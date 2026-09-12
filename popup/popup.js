import { PROFILES } from '../src/common/profiles.js';
import { getSiteRules, setSiteRule } from '../src/common/storage.js';

const $siteName = document.getElementById('site-name');
const $siteEnabled = document.getElementById('site-enabled');
const $siteStatus = document.getElementById('site-status');
const $profileList = document.getElementById('profile-list');
const $hint = document.getElementById('hint');

const EMOJI = {
  'chrome-windows': '🪟',
  'chrome-mac': '💻',
  'edge-windows': '🌊',
  'firefox-windows': '🦊',
  'safari-mac': '🍎',
  'safari-iphone': '📱',
  'chrome-android': '🤖',
  'safari-ipad': '📟'
};

let currentDomain = null;
let siteRules = {};

function normalizeDomain(hostname) {
  return hostname.replace(/^www\./, '');
}

function render() {
  const activePid = siteRules[currentDomain] || null;
  $siteEnabled.checked = !!activePid;
  $siteStatus.textContent = activePid
    ? `Override active: ${PROFILES.find(p => p.id === activePid)?.name || activePid} — reload page to take full effect`
    : 'No override on this site';
  for (const btn of $profileList.querySelectorAll('.profile')) {
    btn.classList.toggle('active', btn.dataset.pid === activePid);
  }
}

function toast(msg) {
  $hint.textContent = msg;
  setTimeout(() => { if ($hint.textContent === msg) $hint.textContent = ''; }, 2500);
}

async function init() {
  document.getElementById('version').textContent = 'v' + chrome.runtime.getManifest().version;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let host = null;
  let protocol = null;
  try {
    const u = new URL(tab.url);
    host = u.hostname;
    protocol = u.protocol;
  } catch { /* 非法 URL */ }

  siteRules = await getSiteRules();

  if (!host || !/^https?:$/.test(protocol)) {
    $siteName.textContent = 'N/A';
    $siteStatus.textContent = 'Open a website to configure';
    $siteEnabled.disabled = true;
    render();
    return;
  }

  currentDomain = normalizeDomain(host);
  $siteName.textContent = currentDomain;

  for (const p of PROFILES) {
    const btn = document.createElement('button');
    btn.className = 'profile';
    btn.dataset.pid = p.id;
    btn.innerHTML = `<span class="emoji">${EMOJI[p.id] || '🔧'}</span>${p.name}`;
    btn.addEventListener('click', () => applyProfile(p.id));
    $profileList.appendChild(btn);
  }

  $siteEnabled.addEventListener('change', async () => {
    if (!currentDomain) return;
    if (!$siteEnabled.checked) {
      await setSiteRule(currentDomain, null);
      siteRules = await getSiteRules();
      render();
      toast('Removed — reload page');
    } else {
      // 重新启用时若无指定档，默认 Chrome·Windows
      await setSiteRule(currentDomain, siteRules[currentDomain] || 'chrome-windows');
      siteRules = await getSiteRules();
      render();
      toast('Applied — reload page');
    }
  });

  render();
}

async function applyProfile(pid) {
  if (!currentDomain) return;
  await setSiteRule(currentDomain, pid);
  siteRules = await getSiteRules();
  render();
  toast('Applied — reload page');
}

init();
