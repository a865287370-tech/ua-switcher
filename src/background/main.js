// Background service worker（module）
// 职责：
//  1. storage 的 siteRules 变化 → 全量重建 DNR 动态规则（网络层伪装）
//  2. webNavigation.onCommitted → 查内存规则 → MAIN world 注入 JS 层伪装
//  3. 启动时从 storage 恢复内存缓存与 DNR 规则

import { getSiteRules, onChanged } from '../common/storage.js';
import { getProfile, brandsHeader, fullVersionListHeader } from '../common/profiles.js';
import { applyClientOverride } from '../content/override-func.js';

// 每个 site 占用 RULES_PER_SITE 条连续规则 id，base = index * RULES_PER_SITE
const RULES_PER_SITE = 2;
const ALL_RESOURCE_TYPES = [
  'main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font',
  'object', 'xmlhttprequest', 'ping', 'csp_report', 'media',
  'websocket', 'webtransport', 'webbundle', 'other'
];
const SUB_RESOURCE_TYPES = ALL_RESOURCE_TYPES.filter(t => t !== 'main_frame');

let siteRulesCache = {};   // { domain: profileId }
let profileCache = {};     // { domain: profileObj }

function buildHeadersFor(profile) {
  const hasCH = profile.hasUAData && profile.brands;
  const headers = [
    { header: 'User-Agent', operation: 'set', value: profile.ua }
  ];
  if (hasCH) {
    for (const [name, value] of [
      ['sec-ch-ua', brandsHeader(profile.brands)],
      ['sec-ch-ua-mobile', profile.mobile ? '?1' : '?0'],
      ['sec-ch-ua-platform', `"${profile.platform}"`]
    ]) {
      headers.push({ header: name, operation: 'set', value });
    }
  } else {
    // 伪装 Safari / Firefox：浏览器仍会自动附带 sec-ch-ua 系头（Accept-CH 站点还会带高熵头），
    // 必须全量 remove 才能与真实 Safari/Firefox 一致 —— any residual header = 穿帮
    for (const name of [
      'sec-ch-ua',
      'sec-ch-ua-mobile',
      'sec-ch-ua-platform',
      'sec-ch-ua-full-version-list',
      'sec-ch-ua-form-factors',
      'sec-ch-ua-arch',
      'sec-ch-ua-bitness',
      'sec-ch-ua-model',
      'sec-ch-ua-platform-version',
      'sec-ch-ua-wow64',
      'sec-ch-ua-full-version'
    ]) {
      headers.push({ header: name, operation: 'remove' });
    }
  }
  // 高熵 full-version-list：仅在预设提供时设置（正常浏览默认不发，Accept-CH 站点会请求）
  if (hasCH && profile.fullVersionList) {
    headers.push({
      header: 'sec-ch-ua-full-version-list',
      operation: 'set',
      value: fullVersionListHeader(profile.fullVersionList)
    });
  }
  return headers;
}

function buildRulesFor(domain, index, profile) {
  const headers = buildHeadersFor(profile);
  // DNR 规则 id 必须 >= 1：站点 0 → 1,2；站点 1 → 3,4 …
  const base = index * RULES_PER_SITE + 1;
  return [
    { // 覆盖主文档导航 + 同域子资源（主文档请求无 initiator，靠 requestDomains 匹配）
      id: base,
      priority: 1,
      action: { type: 'modifyHeaders', requestHeaders: headers },
      condition: { requestDomains: [domain], resourceTypes: ALL_RESOURCE_TYPES }
    },
    { // 覆盖该页面发起的跨域子资源请求（cdn、api 等）
      id: base + 1,
      priority: 1,
      action: { type: 'modifyHeaders', requestHeaders: headers },
      condition: { initiatorDomains: [domain], resourceTypes: SUB_RESOURCE_TYPES }
    }
  ];
}

async function rebuildDnr() {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  // 兼容两种 API 返回形态：Rule[]（新版）或 { rules: Rule[] }（旧文档）
  const existingRules = Array.isArray(existing) ? existing : (existing.rules || []);
  const domains = Object.keys(siteRulesCache);
  const addRules = [];
  domains.forEach((domain, i) => {
    const profile = profileCache[domain];
    if (!profile) return;
    addRules.push(...buildRulesFor(domain, i, profile));
  });
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRules.map(r => r.id),
    addRules
  });
  console.log(`[UA Switcher] DNR rebuilt: ${domains.length} site(s), ${addRules.length} rule(s)`);
}

async function refreshCache(rules) {
  siteRulesCache = rules || {};
  profileCache = {};
  for (const [domain, pid] of Object.entries(siteRulesCache)) {
    const p = getProfile(pid);
    if (p) profileCache[domain] = p;
  }
  await rebuildDnr();
}

// 与 DNR 的 requestDomains 语义对齐：匹配域名本身或其子域
function findProfileForHost(host) {
  for (const [domain, profile] of Object.entries(profileCache)) {
    if (host === domain || host.endsWith('.' + domain)) return profile;
  }
  return null;
}

// ---- JS 层注入：onCommitted 尽早执行，injectImmediately 抢在页面脚本之前 ----
chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return;
  let host;
  try {
    host = new URL(details.url).hostname;
  } catch {
    return;
  }
  const profile = findProfileForHost(host);
  if (!profile) return;

  const data = {
    ua: profile.ua,
    appVersion: profile.appVersion,
    jsPlatform: profile.jsPlatform,
    vendor: profile.vendor,
    hasUAData: profile.hasUAData,
    brands: profile.brands,
    fullVersionList: profile.fullVersionList,
    mobile: profile.mobile,
    platform: profile.platform,
    platformVersion: profile.platformVersion,
    architecture: profile.architecture,
    bitness: profile.bitness,
    model: profile.model,
    uaFullVersion: profile.uaFullVersion
  };

  try {
    await chrome.scripting.executeScript({
      target: { tabId: details.tabId, allFrames: false },
      world: 'MAIN',
      injectImmediately: true,
      func: applyClientOverride,
      args: [data]
    });
  } catch (e) {
    // about:blank、chrome:// 等不可注入页面静默失败
    console.debug('[UA Switcher] inject skipped:', e.message);
  }
});

// ---- 初始化与监听 ----
onChanged(async (rules) => {
  await refreshCache(rules);
});

(async () => {
  await refreshCache(await getSiteRules());
})();
