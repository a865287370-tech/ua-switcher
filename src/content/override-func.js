// MAIN world 覆写函数 — 由 background 通过 scripting.executeScript 注入
// 约束：本函数序列化后在页面 MAIN world 执行，必须完全自包含（无外部引用），
// 全部数据经 args 传入。一致性是本产品的核心卖点：JS 层读到的值必须与网络层
// 发送的 UA / sec-ch-ua 完全对应。

export function applyClientOverride(data) {
  if (window.__uaSwitcherActive) return;
  window.__uaSwitcherActive = true;

  const def = (obj, prop, value) => {
    Object.defineProperty(obj, prop, {
      get: () => value,
      configurable: true
    });
  };

  def(navigator, 'userAgent', data.ua);
  def(navigator, 'appVersion', data.appVersion);
  def(navigator, 'platform', data.jsPlatform);
  if (data.vendor) {
    def(navigator, 'vendor', data.vendor);
  } else {
    def(navigator, 'vendor', '');
  }

  if (data.hasUAData) {
    // Chrome / Edge / Android Chrome：提供与请求头一致的 userAgentData
    const brandsSnapshot = data.brands.map(b => ({ brand: b.brand, version: String(b.version) }));
    const fullListSnapshot = (data.fullVersionList || []).map(b => ({ brand: b.brand, version: String(b.version) }));

    const uad = {
      brands: Object.freeze(brandsSnapshot.map(b => Object.freeze(b))),
      mobile: !!data.mobile,
      platform: data.platform,
      toJSON() {
        return { brands: brandsSnapshot, mobile: !!data.mobile, platform: data.platform };
      },
      async getHighEntropyValues(hints) {
        const all = {
          architecture: data.architecture || '',
          bitness: data.bitness || '',
          model: data.model || '',
          platformVersion: data.platformVersion || '',
          uaFullVersion: data.uaFullVersion || '',
          fullVersionList: fullListSnapshot,
          wow64: false
        };
        const out = { brands: brandsSnapshot, mobile: !!data.mobile, platform: data.platform };
        for (const h of hints || []) {
          if (h in all) out[h] = all[h];
        }
        return out;
      }
    };
    def(navigator, 'userAgentData', uad);
  } else {
    // Safari / Firefox 没有 userAgentData —— 置为 undefined 才是一致伪装
    def(navigator, 'userAgentData', undefined);
  }
}
