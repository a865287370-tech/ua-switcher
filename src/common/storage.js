// 存储层：siteRules: { "example.com": profileId }
const KEY = 'siteRules';

export async function getSiteRules() {
  const res = await chrome.storage.local.get(KEY);
  return res[KEY] || {};
}

export async function setSiteRule(domain, profileId) {
  const rules = await getSiteRules();
  if (profileId) {
    rules[domain] = profileId;
  } else {
    delete rules[domain];
  }
  await chrome.storage.local.set({ [KEY]: rules });
}

export async function clearAllSiteRules() {
  await chrome.storage.local.set({ [KEY]: {} });
}

export function onChanged(callback) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[KEY]) {
      callback(changes[KEY].newValue || {});
    }
  });
}
