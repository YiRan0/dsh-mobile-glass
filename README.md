# dsh-mobile-glass

DSH Web 移动端适配插件（≤1023px，桌面端 ≥1024px 零影响）：液态玻璃视觉、聊天页在上/侧栏在下的 reveal 抽屉、拖动手势、右侧详情玻璃抽屉、设置面板底部卡片上滑、composer 与 header 修复。

## 组成

- Host 半部 `lib/index.js`：仅为锚点（`apply()` 空实现）。
- Client 半部 `lib/client.js`：注入样式 + 驱动抽屉/拖拽/设置行为 + 挂载悬浮汉堡按钮。
- `package.json`：`dsh.client.platform: web`，`exports` 含 `./client` 与 `./package.json`。

## 安装

在 `~/.dsh/profiles/web/cordis.patch.yml` 加：

```yaml
- insert:
    - id: mobile-glass
      name: 'dsh-mobile-glass'
```

重启 dsh web 服务；`lib/client.js` 改动刷新页面即热加载。

## 视觉 / 交互要点

- 无底部导航，顶部悬浮玻璃汉堡 ☰ 打开侧栏抽屉（抽屉打开时 ☰ 跟随聊天层右移）。
- 侧栏作为底层 static（永不参与动画），聊天列 `translateX` 右移（reveal）。
- 拖动手势：`setPointerCapture` + rAF 节流 + 方向锁定 + 速度/位移吸附；命中横向可滚动元素（宽表格/代码块）时让位原生横向滚动。
- 用户消息右侧气泡、悬浮圆角输入框、模型选择器独立一行、发送键最右。
- 详情面板右侧玻璃抽屉（`html[data-mob-details-open]` 控制）。
- 设置面板底部卡片上滑覆盖（`VOzbGW_overlay/panel`），导航收成图标栏。
- 头部清理：隐藏 session-log、tabs 与标题对齐、隐藏侧栏自带 toggle、better-sidebar 按钮与 ☰ 对齐。
- 液态玻璃质感（`backdrop-filter` + `saturate` + 高光描边）。

## 已知问题

- 真机拖拽偶发抖动（疑为侧栏 `backdrop-filter` 实时模糊）；`will-change` 实验已回退。动画只作用在聊天列。

## 许可

MIT
