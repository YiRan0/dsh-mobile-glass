# AGENTS.md

This file guides coding agents working on this repository.

## What this plugin is

A publishable DSH bundle npm package (ESM) with TypeScript sources in `src/`.
The Host anchor is `src/index.ts` (compiled to `lib/index.js`); the full
implementation lives in the Client half `src/client.ts` (compiled to
`lib/client.js`). It declares `dsh.bundle` + `cordis.patch.yml`, so it can be
installed via `dsh plugin --profile web add ...` and auto-mounts as
`name: 'dsh-mobile-glass'`.

## Client half (`src/client.ts` → `lib/client.js`)

- Loaded via `window.__ModuleLoader__.load({ id, factory })`; use
  `require('react')` inside the factory (react is a platform seed).
- Injects one `<style data-plugin="dsh-mobile-glass">` block; everything is
  gated behind `@media (max-width: 1023px)` so desktop is untouched.
- Drawer model: the sidebar is the bottom layer (fixed, never animates); the
  chat column slides right (top layer, `translateX`) to reveal it. The details
  drawer is a right slide-over toggled by `html[data-mob-details-open]`.
- The floating ☰ lives in `shell.overlay`; when the drawer opens it is
  translated by `var(--mobui-drawer)` so it follows the chat layer.
- Drag-to-open: pointer capture + rAF-throttled transform + velocity/position
  snap; `isHScrollable` skips the drag when the touch starts inside a
  horizontally-scrollable element (wide table/code block). Inline
  `transition: none` is NOT `!important` — the stylesheet transition IS
  `!important` (needed to beat the shipped CSS), and during drag the inline
  style is restored/removed via `removeProperty`.
- Settings bottom sheet: `:has(.VOzbGW_overlay)` on the sidebar column drops its
  `backdrop-filter` (freeing the fixed overlay from the containing block) and
  lifts z-index to 70; `VOzbGW_panel` becomes a full-width bottom card with a
  `@keyframes` slide-up; the nav is compacted to an icon rail.
- `data-shell-overlay`, `data-sidebar-collapsed` are DSH shell DOM contracts the
  CSS hooks into; `VOzbGW_*`, `wSkVaW_*`, `uV2eYG_*`, `nL4_yW_*`, `hHd-Xa_*`,
  `W-zNGW_*` are shipped CSS-module class names — changing the shell's
  DOM/classes will break these hooks.

## Known issue

- Real-device drag can jitter (suspected the sidebar `backdrop-filter` real-time
  blur). `will-change` experiments were rolled back. Keep the reveal animation
  on the chat column, not the sidebar. If jitter persists, try temporarily
  dropping the sidebar `backdrop-filter` during the drag.

## Build / Deploy / Publish

```sh
npm install
npm run build       # compile src/*.ts → lib/*.js
npm run typecheck   # optional
npm pack            # inspect publish tarball
npm publish         # publish to npm (prepack runs build automatically)
```

Live copies: `~/.dsh/profiles/web/node_modules/dsh-mobile-glass/lib/*`.
After editing `src/*.ts`, run `npm run build` first; the generated
`lib/client.js` then hot-reloads on page refresh. `package.json` / new-package
changes need a launchd restart:
`launchctl kickstart -k gui/$(id -u)/com.yiran.dsh-web`.

## Gotchas

- `package.json` must export BOTH `./client` and `./package.json`; for bundle
  installs it also needs `dsh.bundle.patch` and `./cordis.patch.yml` export.
- Client source is TypeScript but must be built to a plain browser script
  (`lib/client.js`) — no top-level ESM `import`/`export`; keep using
  `window.__ModuleLoader__.load` + `require('react')` and
  `React.createElement`-style semantics.
- `src/client.ts` uses `ctx.get('slots') as any` because the installed slot
  typings only expose the `root` slot; `shell.overlay` is a DSH shell contract
  not represented in the local type declarations.
- The settings overlay is a descendant of the sidebar column; its `position:
  fixed` only escapes to the viewport once the sidebar's `backdrop-filter` is
  removed (see the `:has(.VOzbGW_overlay)` rule).
