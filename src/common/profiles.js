// 设备预设档 — UA 字符串与 Client Hints 数据必须保持一致
// 注意：版本号为构造时的合理值（Chrome 遵循 reduced-UA 规范，build 号全 0 是真实行为）
// 维护项：Chrome/Firefox/Safari 大版本每 4 周更新一次，上架后需定期刷新

export const PROFILES = [
  {
    id: 'chrome-windows',
    name: 'Chrome · Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
    hasUAData: true,
    brands: [
      { brand: 'Chromium', version: '152' },
      { brand: 'Google Chrome', version: '152' },
      { brand: 'Not?A_Brand', version: '24' }
    ],
    mobile: false,
    platform: 'Windows',
    platformVersion: '15.0.0',
    architecture: 'x86',
    bitness: '64',
    model: '',
    uaFullVersion: '152.0.0.0',
    fullVersionList: [
      { brand: 'Chromium', version: '152.0.0.0' },
      { brand: 'Google Chrome', version: '152.0.0.0' },
      { brand: 'Not?A_Brand', version: '24.0.0.0' }
    ],
    vendor: 'Google Inc.',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
    jsPlatform: 'Win32'
  },
  {
    id: 'chrome-mac',
    name: 'Chrome · macOS',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
    hasUAData: true,
    brands: [
      { brand: 'Chromium', version: '152' },
      { brand: 'Google Chrome', version: '152' },
      { brand: 'Not?A_Brand', version: '24' }
    ],
    mobile: false,
    platform: 'macOS',
    platformVersion: '14.6.0',
    architecture: 'arm',
    bitness: '64',
    model: '',
    uaFullVersion: '152.0.0.0',
    fullVersionList: [
      { brand: 'Chromium', version: '152.0.0.0' },
      { brand: 'Google Chrome', version: '152.0.0.0' },
      { brand: 'Not?A_Brand', version: '24.0.0.0' }
    ],
    vendor: 'Google Inc.',
    appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
    jsPlatform: 'MacIntel'
  },
  {
    id: 'edge-windows',
    name: 'Edge · Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36 Edg/152.0.0.0',
    hasUAData: true,
    brands: [
      { brand: 'Chromium', version: '152' },
      { brand: 'Microsoft Edge', version: '152' },
      { brand: 'Not?A_Brand', version: '24' }
    ],
    mobile: false,
    platform: 'Windows',
    platformVersion: '15.0.0',
    architecture: 'x86',
    bitness: '64',
    model: '',
    uaFullVersion: '152.0.0.0',
    fullVersionList: [
      { brand: 'Chromium', version: '152.0.0.0' },
      { brand: 'Microsoft Edge', version: '152.0.0.0' },
      { brand: 'Not?A_Brand', version: '24.0.0.0' }
    ],
    vendor: 'Google Inc.',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36 Edg/152.0.0.0',
    jsPlatform: 'Win32'
  },
  {
    id: 'firefox-windows',
    name: 'Firefox · Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',
    hasUAData: false,
    brands: null,
    mobile: false,
    platform: 'Windows',
    platformVersion: '',
    architecture: 'x86',
    bitness: '64',
    model: '',
    uaFullVersion: '',
    fullVersionList: null,
    vendor: '',
    appVersion: '5.0 (Windows)',
    jsPlatform: 'Win32'
  },
  {
    id: 'safari-mac',
    name: 'Safari · macOS',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
    hasUAData: false,
    brands: null,
    mobile: false,
    platform: 'macOS',
    platformVersion: '',
    architecture: '',
    bitness: '',
    model: '',
    uaFullVersion: '',
    fullVersionList: null,
    vendor: 'Apple Computer, Inc.',
    appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
    jsPlatform: 'MacIntel'
  },
  {
    id: 'safari-iphone',
    name: 'Safari · iPhone',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
    hasUAData: false,
    brands: null,
    mobile: true,
    platform: 'iOS',
    platformVersion: '26.0.0',
    architecture: '',
    bitness: '',
    model: 'iPhone',
    uaFullVersion: '',
    fullVersionList: null,
    vendor: 'Apple Computer, Inc.',
    appVersion: '5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
    jsPlatform: 'iPhone'
  },
  {
    id: 'chrome-android',
    name: 'Chrome · Android',
    ua: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36',
    hasUAData: true,
    brands: [
      { brand: 'Chromium', version: '152' },
      { brand: 'Google Chrome', version: '152' },
      { brand: 'Not?A_Brand', version: '24' }
    ],
    mobile: true,
    platform: 'Android',
    platformVersion: '15.0.0',
    architecture: '',
    bitness: '',
    model: 'Pixel 9',
    uaFullVersion: '152.0.0.0',
    fullVersionList: [
      { brand: 'Chromium', version: '152.0.0.0' },
      { brand: 'Google Chrome', version: '152.0.0.0' },
      { brand: 'Not?A_Brand', version: '24.0.0.0' }
    ],
    vendor: 'Google Inc.',
    appVersion: '5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36',
    jsPlatform: 'Linux armv81'
  },
  {
    id: 'safari-ipad',
    name: 'Safari · iPad',
    ua: 'Mozilla/5.0 (iPad; CPU OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
    hasUAData: false,
    brands: null,
    mobile: false,
    platform: 'macOS',
    platformVersion: '',
    architecture: '',
    bitness: '',
    model: '',
    uaFullVersion: '',
    fullVersionList: null,
    vendor: 'Apple Computer, Inc.',
    appVersion: '5.0 (iPad; CPU OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
    jsPlatform: 'MacIntel'
  }
];

export function getProfile(id) {
  return PROFILES.find(p => p.id === id) || null;
}

// sec-ch-ua 请求头值（低熵 brands）
export function brandsHeader(brands) {
  return brands.map(b => `"${b.brand}";v="${b.version}"`).join(', ');
}

// sec-ch-ua-full-version-list 请求头值（高熵，部分站点通过 Accept-CH 请求）
export function fullVersionListHeader(list) {
  return list.map(b => `"${b.brand}";v="${b.version}"`).join(', ');
}
