# UA Switcher — Client Hints Aware（中文说明）

Chrome/Edge MV3 扩展。切换 User-Agent 时**同步改写 Client Hints 头与 JavaScript API**，保证网络层与 JS 层指纹一致——去任意检测站验证都对得上。

## 与传统 UA 切换器的区别

| | 传统工具（含 Google 官方旧版） | 本扩展 |
|---|---|---|
| UA 字符串（网络层） | ✅ | ✅ |
| `sec-ch-ua` / `-mobile` / `-platform` | ❌ 不改，现代网站一测就穿帮 | ✅ 同步改写 |
| `navigator.userAgent`（JS 层） | 部分 | ✅ 覆写 |
| `navigator.userAgentData` + 高熵值 | ❌ | ✅ 含 `getHighEntropyValues` |
| 伪装 Safari 时 `userAgentData` | 残留 Chrome 数据（穿帮） | ✅ 置为 `undefined`（与真 Safari 一致） |
| 跨域子资源请求（cdn/api） | 常遗漏 | ✅ initiator 规则覆盖 |
| 按站点记忆 | 因品而异 | ✅ 每域独立配置，子域继承主域，重启保留 |

## 安装（开发模式）

1. 浏览器打开 `chrome://extensions` 或 `edge://extensions`
2. 右上角开启「开发者模式」
3. 「加载已解压的扩展程序」→ 选择本仓库目录

## 使用

1. 打开目标网站，点击扩展图标
2. 选择设备档（如 `Safari · iPhone`）
3. **刷新页面**生效
4. 验证：
   - https://www.whatismybrowser.com/ 应识别为 Safari/iOS
   - https://browserleaks.com/client-hints 的 HTTP 与 JS 两侧 Client Hints 均应为空
   - 控制台 `navigator.userAgentData`：伪装 Safari/Firefox 时为 `undefined`

## 实测记录（2026-09）

- whatismybrowser.com（Safari·iPhone 档）：识别为 **Safari 26 on iOS 26, Apple iPhone**
- 多站点隔离：A 站 iPhone / B 站 Firefox 交叉刷新不串扰
- 子域继承：主域配置对子域生效（网络+JS 两层）
- 重启持久化：完全退出浏览器后配置与规则全部恢复

## 已知限制

- **极早期内联脚本竞态**：页面 `<head>` 中最先执行的内联脚本理论上可能在注入完成前读到真实值。网络层（DNR）无此问题，始终可靠。后续版本评估 `chrome.userScripts` API 消除竞态。
- 预设档版本号为发布时构造值，浏览器大版本每 4 周更新，需定期刷新 `src/common/profiles.js`（这本身就是产品维护工作）。
- 不处理 `Accept-Language`、时区、Canvas/WebGL 等深层指纹（刻意缩小范围：本工具定位是 UA 一致性，不是反指纹浏览器）。

## 架构

```
src/common/profiles.js      设备预设档（UA + Client Hints 数据，单一数据源）
src/common/storage.js       siteRules 存储（domain → profileId）
src/background/main.js      DNR 动态规则管理 + onCommitted 时 MAIN world 注入
src/content/override-func.js  MAIN world 覆写函数（自包含，经 args 注入数据）
popup/                      站点开关 + 档位选择 UI
```

网络层每站点 2 条 DNR 规则：`requestDomains`（主文档 + 同域资源）、`initiatorDomains`（页面发起的跨域请求）。JS 层在 `webNavigation.onCommitted` 以 `injectImmediately: true` 注入，数据内嵌于注入参数，无异步竞态读。

## 许可

MIT
