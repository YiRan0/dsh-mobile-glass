# dsh-mobile-glass

DSH Web 移动端适配插件：液态玻璃视觉、聊天页在上/侧栏在下的 reveal 抽屉、右侧详情玻璃抽屉、composer 与 header 修复；桌面端（≥1024px）零影响。

## 组成

- Host 半部 `lib/index.js`：仅为锚点（`apply()` 空实现）。
- Client 半部 `lib/client.js`：注入样式 + 驱动抽屉行为 + 挂载悬浮汉堡按钮。
- `package.json`：`dsh.client.platform: web`，`exports` 含 `./client` 与 `./package.json`。

## 安装

在 `~/.dsh/profiles/web/cordis.patch.yml` 加：

```yaml
- insert:
    - id: mobile-glass
      name: 'dsh-mobile-glass'
```

重启 dsh web 服务。

## 视觉 / 交互要点

- 无底部导航，顶部汉堡 ☰ 打开侧栏抽屉。
- 侧栏作为底层 static，聊天列 `translateX` 右移（reveal）。
- 用户消息右侧气泡、悬浮圆角输入框、模型选择器独立一行。
- 液态玻璃质感（`backdrop-filter` + `saturate`）。

## 许可

MIT
