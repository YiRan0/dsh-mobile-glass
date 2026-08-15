# AGENTS.md

This file guides coding agents working on this repository.

## What this plugin is

A local npm package (ESM) with a no-op Host anchor (`lib/index.js`) and the full
implementation in the Client half (`lib/client.js`). Installed into the
profile's `node_modules` and referenced by `name: 'dsh-mobile-glass'`.

## Client half (`lib/client.js`)

- Loaded via `window.__ModuleLoader__.load({ id, factory })`; use
  `require('react')` inside the factory (react is a platform seed).
- Injects one `<style data-plugin="dsh-mobile-glass">` block; everything is
  gated behind `@media (max-width: 1023px)` so desktop is untouched.
- Drawer model: the sidebar is the bottom layer (fixed, never animates); the
  chat column slides right (top layer, `translateX`) to reveal it. The details
  drawer is a right slide-over toggled by `html[data-mob-details-open]`.
- `data-shell-overlay`, `data-sidebar-collapsed` are DSH shell DOM contracts the
  CSS hooks into; changing the shell's DOM/data-attributes will break this.

## Known issue

- Real-device drag can jitter (suspected the sidebar `backdrop-filter` real-time
  blur). `will-change` experiments were rolled back. Keep the reveal animation
  on the chat column, not the sidebar.

## Deploy

Live copies: `~/.dsh/profiles/web/node_modules/dsh-mobile-glass/lib/*`.
`lib/client.js` edits hot-reload on page refresh; `package.json` / new-package
changes need a launchd restart:
`launchctl kickstart -k gui/$(id -u)/com.yiran.dsh-web`.

## Gotchas

- `package.json` must export BOTH `./client` and `./package.json`.
- This is plain JavaScript with no TS/JSX/bundler transform; use
  `React.createElement`-style semantics if you add React code.
