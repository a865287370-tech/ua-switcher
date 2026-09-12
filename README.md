# UA Switcher — Client Hints Aware

**The UA switcher that survives fingerprint detection.**

Most user-agent switchers only change the `User-Agent` string. Modern websites read **Client Hints** (`sec-ch-ua` family) and JavaScript APIs instead — so the spoof falls apart the moment you visit a detection page.

UA Switcher rewrites **every layer in sync**, driven by a single profile data source:

| Layer | What changes |
|-------|-------------|
| Network headers | `User-Agent`, `sec-ch-ua`, `sec-ch-ua-mobile`, `sec-ch-ua-platform` via declarativeNetRequest |
| JS APIs | `navigator.userAgent`, `appVersion`, `platform`, `vendor`, full `navigator.userAgentData` incl. `getHighEntropyValues()` |
| Non-CH browsers | Spoofing Safari/Firefox? `userAgentData` is removed entirely and all 11 `sec-ch-ua*` headers stripped — exactly like the real browsers |

## Install

**From the Edge Add-ons store** (recommended):

> [Install UA Switcher from Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/ua-switcher-%E2%80%94-client-hint/bpaaoegldmkigpnbpdindcfblbnokeii)

**Manual (developer mode)**:

1. Download or clone this repo
2. Open `edge://extensions` or `chrome://extensions` → enable Developer mode
3. "Load unpacked" → select this folder

## Why it's different

- **Consistency you can verify** — after switching, browserleaks, creepjs and whatismybrowser all agree with your chosen profile. Tested, not promised.
- **Cross-origin coverage** — requests your page makes to CDN/API domains carry the same spoofed headers (`initiatorDomains` rules, the gap most competitors miss).
- **Per-site memory** — each domain keeps its own profile, surviving browser restarts. Subdomains inherit the parent domain's profile.
- **One-click off** — toggle the switch to restore your real identity instantly.
- **Zero everything** — no accounts, no servers, no analytics, no remote code. 100% offline.

## Verified consistency

| Test | Result |
|------|--------|
| whatismybrowser.com (Safari · iPhone profile) | Detects **Safari 26 on iOS 26, Apple iPhone** |
| browserleaks.com/client-hints | HTTP + JS Client Hints both empty (correct for Safari) |
| `navigator.userAgentData` on Safari profile | `undefined` (matches real Safari) |
| Multi-site isolation | Site A → iPhone, Site B → Firefox, no cross-talk |
| Subdomain inheritance | Config on `wikipedia.org` applies to `zh.wikipedia.org` |
| Restart persistence | All rules restored after full browser restart |

## How it works

```
src/common/profiles.js       Device profiles (UA + Client Hints data, single source of truth)
src/common/storage.js        Per-domain rules (domain → profileId)
src/background/main.js       DNR dynamic-rule management + onCommitted JS injection
src/content/override-func.js Self-contained MAIN-world override (data passed via args)
popup/                       Per-site toggle + profile picker UI
```

- **Network layer**: two DNR rules per site — `requestDomains` covers main-frame navigation and same-origin subresources, `initiatorDomains` covers cross-origin requests initiated by the page.
- **JS layer**: injected at `webNavigation.onCommitted` with `injectImmediately: true`, profile data embedded in the injection args — no async storage reads racing the page.
- Known limitation: a page's very earliest inline script may theoretically read the real value before injection lands. The network layer has no such race. (Evaluating `chrome.userScripts` for a future release.)

## Privacy

No data collection. No servers. No remote code. See [Privacy Policy](https://gist.github.com/a865287370-tech/7e6c398c1da8d15a15621a601fc5af54).

## Use responsibly

This is a development, QA and research tool. Use it in accordance with the terms of the websites you visit.

## License

[MIT](LICENSE)
