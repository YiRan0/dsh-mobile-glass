/**
 * dsh-mobile-glass — Client half.
 * TypeScript source; compiled to lib/client.js by `npm run build`.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

declare global {
  interface Window {
    __ModuleLoader__: {
      load(options: {
        id: string
        factory: (require: (spec: string) => unknown) => Record<string, unknown>
      }): void
    }
  }
}

window.__ModuleLoader__.load({
	id: "dsh-mobile-glass",
	factory: (require: (spec: string) => unknown) => {
		const module: { exports: Record<string, unknown> } = { exports: {} };
		const exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const react = require("react") as typeof import("react");

		/** Mobile adaptation styles: liquid glass, reveal drawers, composer/header fixes. */
		const CSS = `
@media (max-width: 1023px) {
  div:has(> [data-shell-overlay]) {
    --mobui-drawer: min(82vw, 300px);
    grid-template-columns: 0 minmax(0, 1fr) 0 !important;
  }
  /* sidebar: ALWAYS in place at the bottom layer — never animates, the chat
     slides right over it (iOS / WeChat drawer pattern) */
  div:has(> [data-shell-overlay]) > :first-child {
    position: fixed !important;
    left: 0; top: 0; bottom: 0;
    width: var(--mobui-drawer) !important;
    z-index: 10;
    background: var(--dsw-specific-sidebar-fill) !important;
    background: color-mix(in srgb, var(--dsw-specific-sidebar-fill) 80%, transparent) !important;
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    box-shadow: 0 16px 48px rgba(0, 0, 0, .16), inset 0 1px 0 rgba(255, 255, 255, .55) !important;
    border-right: 1px solid var(--dsw-alias-border-l1);
  }
  /* chat: top layer, slides right to reveal the sidebar (the only animated layer) */
  div:has(> [data-shell-overlay]) > :nth-child(2) {
    position: relative;
    z-index: 30;
    grid-column: 2;
    touch-action: pan-y;
    transition: transform .38s cubic-bezier(.32, .72, .24, 1) !important;
  }
  div:has(> [data-shell-overlay]):not([data-sidebar-collapsed]) > :nth-child(2) {
    transform: translateX(var(--mobui-drawer));
    box-shadow: -24px 0 60px rgba(0, 0, 0, .20);
  }
  [data-shell-overlay] { z-index: 40 !important; }
  /* header: clear the floating hamburger, icon-only session log */
  .wSkVaW_titleCluster { margin-left: 56px; }
  .wSkVaW_tabs { margin-left: 56px; }
  .nL4_yW_sessionLogButton { display: none; }
  /* hide the sidebar's own toggle (the floating hamburger is the single control) */
  .hHd-Xa_toggle { display: none !important; }
  /* keep the better-sidebar toggle but align its cluster with the hamburger (top:10) */
  .W-zNGW_toggleCluster { top: 10px !important; }
  .wSkVaW_header {
    background: var(--dsw-alias-bg-layer-1);
    background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 72%, transparent) !important;
    backdrop-filter: blur(22px) saturate(180%);
    -webkit-backdrop-filter: blur(22px) saturate(180%);
  }
  /* composer: glass floating card — compact pill by default (never eats the
     whole screen), expands to full width while focused; the model selector
     shares the tool row with the shield/dropdown controls; the input area
     starts at one line and auto-grows with content (native mirror) */
  .uV2eYG_card {
    border-radius: 20px !important;
    background: var(--dsw-alias-bg-layer-1);
    background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 74%, transparent) !important;
    backdrop-filter: blur(22px) saturate(180%);
    -webkit-backdrop-filter: blur(22px) saturate(180%);
    box-shadow: 0 14px 40px rgba(0, 0, 0, .12), inset 0 1px 0 rgba(255, 255, 255, .5) !important;
    max-width: min(86%, 460px) !important;
    transition: max-width .32s cubic-bezier(.32, .72, .24, 1), height .32s cubic-bezier(.32, .72, .24, 1);
  }
  .uV2eYG_card:focus-within { max-width: 100% !important; }
  .uV2eYG_row { flex-wrap: nowrap; gap: 6px; }
  /* trailing (context / model / send): one row, never wraps */
  .uV2eYG_trailing { flex-wrap: nowrap; justify-content: flex-end; flex: 1; min-width: 0; }
  /* input area starts compact (one line) and auto-grows as the draft grows;
     while focused it opens to ~2.5 lines so the height visibly expands on
     focus and contracts on blur (content always wins — a long draft keeps
     its full height even when unfocused) */
  .uV2eYG_mirror { min-height: 24px !important; }
  .uV2eYG_card:focus-within .uV2eYG_mirror { min-height: 60px !important; }
  /* model selector stays inside trailing, sharing the tool row */
  ._7KE1Ra_root { flex: 0 1 auto; min-width: 0; }
  ._7KE1Ra_trigger { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* while the card is narrowed (unfocused), tighten the trailing row and
     ellipsize the model selector so the row still fits */
  @container (max-width: 360px) {
    .uV2eYG_trailing { gap: 6px; }
    ._7KE1Ra_trigger { max-width: 128px; }
  }
  body { overflow-x: hidden; }
}
/* settings: bottom-sheet card that slides up and covers the chat (mobile only).
   The settings overlay renders inside the sidebar column; the sidebar's
   backdrop-filter would otherwise confine its fixed positioning to the drawer,
   so when it is open we drop the filter and lift the whole column above the chat. */
@media (max-width: 1023px) {
  div:has(> [data-shell-overlay]) > :first-child:has(.VOzbGW_overlay) {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    z-index: 70 !important;
  }
  .VOzbGW_overlay { align-items: flex-end; }
  .VOzbGW_panel {
    width: 100%;
    max-width: none;
    height: min(85vh, 720px);
    border-radius: 24px 24px 0 0;
    animation: mobui-settings-up .32s cubic-bezier(.32, .72, .24, 1);
  }
  /* compact the left nav to an icon rail so the content column gets room */
  .VOzbGW_nav { width: 56px; padding: 14px 6px 0; gap: 10px; }
  .VOzbGW_navTitle { display: none; }
  .VOzbGW_navLabel { display: none; }
  .VOzbGW_navCell { justify-content: center; padding: 10px; border-radius: 12px; }
  @keyframes mobui-settings-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
}
/* floating nav (narrow screens only; hamburger only) */
.dsw-mob-floatnav {
  position: fixed; inset: 0; pointer-events: none; z-index: 60;
  transition: transform .38s cubic-bezier(.32, .72, .24, 1);
}
/* when the drawer opens, the hamburger slides right together with the chat layer */
@media (max-width: 1023px) {
  div:has(> [data-shell-overlay]):not([data-sidebar-collapsed]) .dsw-mob-floatnav {
    transform: translateX(var(--mobui-drawer));
  }
}
.dsw-mob-ham {
  position: absolute;
  pointer-events: auto;
  width: 40px; height: 40px;
  border-radius: 13px;
  border: 1px solid rgba(255, 255, 255, .85);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; line-height: 1; font-weight: 700;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-1);
  background: linear-gradient(180deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 92%, white) 0%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 62%, transparent) 100%);
  backdrop-filter: blur(24px) saturate(220%);
  -webkit-backdrop-filter: blur(24px) saturate(220%);
  box-shadow: 0 12px 30px rgba(0, 0, 0, .18), inset 0 1.5px 0 rgba(255, 255, 255, .95), inset 0 -1px 0 rgba(255, 255, 255, .4);
}
.dsw-mob-ham { top: 10px; left: 10px; }
@media (min-width: 1024px) { .dsw-mob-floatnav { display: none; } }
@media (prefers-reduced-motion: reduce) {
  div:has(> [data-shell-overlay]) > :first-child,
  div:has(> [data-shell-overlay]) > :nth-child(2),
}
`;

		/**
		 * Client plugin body: injects the mobile stylesheet, drives the reveal
		 * drawer behaviour, and mounts the floating nav buttons.
		 */
		function apply(ctx: ClientContext) {
			const styleTag = document.createElement("style");
			styleTag.dataset.plugin = "dsh-mobile-glass";
			styleTag.textContent = CSS;
			document.head.appendChild(styleTag);

			const isPhone = () => window.innerWidth <= 1023;
			const frameEl = () => {
				const o = document.querySelector('[data-shell-overlay]');
				return o ? o.parentElement : null;
			};
			const sidebarOpen = () => {
				const f = frameEl();
				return !!f && !f.hasAttribute('data-sidebar-collapsed');
			};
			const layout = () => ctx.get('layout');
			const later = (fn, ms) => {
				const timer = ctx.get('timer');
				if (timer) timer.timeout(fn, ms);
				else requestAnimationFrame(() => requestAnimationFrame(fn));
			};

			// --- drag-to-open drawer (iOS pattern, MUI SwipeableDrawer-style):
			// capture on the chat element, rAF-throttled transform, velocity snap,
			// and ALWAYS clear inline styles on cancel/up so a later ☰ click animates. ---
			let drag = null;
			let suppressClickUntil = 0;

			const drawerW = () => {
				const f = frameEl();
				return f ? f.children[0].getBoundingClientRect().width : 300;
			};

			// true when the touch starts inside a horizontally-scrollable element
			// (wide table / code block): the drawer drag must yield to native pan.
			const isHScrollable = (el) => {
				const f = frameEl();
				let n = el;
				while (n && n !== document.body && n !== f) {
					if (n.scrollWidth > n.clientWidth + 2) {
						const ox = getComputedStyle(n).overflowX;
						if (ox === 'auto' || ox === 'scroll') return true;
					}
					n = n.parentElement;
				}
				return false;
			};

			const resetInline = () => {
				const f = frameEl(); if (!f) return;
				const chat = f.children[1] as HTMLElement;
				chat.style.transition = '';
				chat.style.transform = '';
			};

			const onPointerDown = (e) => {
				if (window.innerWidth >= 1024 || !e.isPrimary) return;
				const t = e.target;
				if (!t || typeof t.closest !== 'function') return;
				// only real form controls block the drag; links in message text are
				// disambiguated by the direction-lock (horizontal intent = drag, tap = navigate)
				if (t.closest('textarea, input, select, button, [contenteditable]')) return;
				if (t.closest('[data-mob-ham]')) return;
				if (isHScrollable(t)) return; // wide table / code block scrolls horizontally
				const f = frameEl(); if (!f) return;
				const chat = f.children[1] as HTMLElement;
				if (!chat || !chat.contains(t)) return;
				// capture on the chat so we keep getting move/up even if the pointer
				// leaves the element (and the browser doesn't swipe-cancel on touch)
				try { chat.setPointerCapture(e.pointerId); } catch {}
				const starting = sidebarOpen();
				drag = {
					startX: e.clientX, startY: e.clientY,
					active: false, open: starting, logical: starting,
					chat: chat, pointer: e.pointerId,
					lastX: e.clientX, lastT: e.timestamp, velocity: 0
				};
			};

			const onPointerMove = (e) => {
				if (!drag) return;
				if (drag.pointer !== e.pointerId) return;
				const dx = e.clientX - drag.startX;
				const dy = e.clientY - drag.startY;
				if (!drag.active) {
					if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
					if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; } // vertical scroll intent
					drag.active = true;
					const w = drawerW();
					if (!drag.open) { const l = layout(); if (l) l.toggleSidebar(); drag.logical = true; }
					drag.chat.style.transition = 'none';
					drag.base = drag.open ? w : 0;
				}
				const w = drawerW();
				const raw = drag.base + dx;
				const next = Math.max(0, Math.min(w, raw));
				drag.next = next;
				// rAF-throttled apply
				if (!drag.raf) {
					drag.raf = requestAnimationFrame(() => {
						if (drag) drag.chat.style.transform = 'translateX(' + drag.next + 'px)';
						if (drag) drag.raf = null;
					});
				}
				// velocity (px/ms) from last sample
				const dt = Math.max(1, e.timestamp - drag.lastT);
				const dxv = e.clientX - drag.lastX;
				drag.velocity = dxv / dt;
				drag.lastX = e.clientX; drag.lastT = e.timestamp;
			};

			const onPointerUp = (e) => {
				if (!drag) return;
				if (drag.pointer !== e.pointerId) return;
				const d = drag; drag = null;
				try { d.chat.releasePointerCapture(e.pointerId); } catch {}
				if (!d.active) { resetInline(); return; }
				const w = drawerW();
				const final = d.open ? w + (e.clientX - d.startX) : (e.clientX - d.startX);
				const percentOpen = Math.max(0, Math.min(1, final / w));
				let wantOpen;
				if (d.velocity > 0.4) wantOpen = true;
				else if (d.velocity < -0.4) wantOpen = false;
				else wantOpen = percentOpen > 0.5;
				if (wantOpen !== d.logical) {
					const l = layout(); if (l) l.toggleSidebar();
					suppressClickUntil = Date.now() + 600;
				}
				// ALWAYS clear inline so the CSS class transition animates the final settle
				if (d.raf) { cancelAnimationFrame(d.raf); d.raf = null; }
				d.chat.style.transition = '';
				d.chat.style.transform = '';
			};

			const onPointerCancel = (e) => {
				if (!drag) return;
				if (drag.pointer !== e.pointerId) return;
				if (drag.raf) { cancelAnimationFrame(drag.raf); drag.raf = null; }
				// browser took over (vertical scroll) — restore inline to current logical state
				resetInline();
				drag = null;
			};

			const onClick = (e) => {
				if (Date.now() < suppressClickUntil) return;
				const t = e.target;
				if (!t || typeof t.closest !== 'function') return;
				const f = frameEl();
				if (!f) return;
				const sidebar = f.children[0];

				if (isPhone() && t.closest('[role=treeitem]')) {
					if (sidebarOpen()) later(() => {
						const l = layout();
						if (l && sidebarOpen()) l.toggleSidebar();
					}, 320);
					return;
				}

				if (isPhone() && sidebarOpen() && sidebar && !sidebar.contains(t) && !t.closest('[data-mob-ham]')) {
					const l = layout();
					if (l) l.toggleSidebar();
				}
			};

			ctx.effect(() => {
				const meta = document.querySelector('meta[name="viewport"]');
				const prev = meta ? meta.getAttribute('content') : null;
				if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');

				// --- composer height animation: CSS can't tween an auto height, so
				// FLIP the card — lock to the old height, then tween to the newly
				// measured height whenever its content changes (draft auto-grow,
				// focus reflow), matching the max-width transition. ---
				let animCard: Element | null = null;
				let animRO: ResizeObserver | null = null;
				let animBusy = false;
				let animPrev = 0;
				const attachHeightAnim = (card: Element) => {
					if (animRO) { animRO.disconnect(); animRO = null; }
					animCard = card;
					animPrev = card.getBoundingClientRect().height;
					animRO = new ResizeObserver(() => {
						if (animBusy || !animCard || !animCard.isConnected) return;
						const cur = animCard.getBoundingClientRect().height;
						if (Math.abs(cur - animPrev) < 1) return;
						animBusy = true;
						(animCard as HTMLElement).style.height = animPrev + 'px';
						requestAnimationFrame(() => {
							if (!animCard || !animCard.isConnected) { animBusy = false; return; }
							const el = animCard as HTMLElement;
							el.style.transition = 'height .32s cubic-bezier(.32, .72, .24, 1), max-width .32s cubic-bezier(.32, .72, .24, 1)';
							el.style.height = cur + 'px';
							animPrev = cur;
							later(() => {
								if (el.isConnected) { el.style.height = ''; el.style.transition = ''; }
								animBusy = false;
							}, 380);
						});
					});
					animRO.observe(card);
				};
				const composerFinder = new MutationObserver(() => {
					const card = document.querySelector('.uV2eYG_card');
					if (card && card !== animCard) attachHeightAnim(card);
					else if (!card && animRO) { animRO.disconnect(); animRO = null; animCard = null; animPrev = 0; }
				});
				composerFinder.observe(document.body, { childList: true, subtree: true });

				document.addEventListener('click', onClick, true);
				window.addEventListener('pointerdown', onPointerDown, true);
				window.addEventListener('pointermove', onPointerMove, true);
				window.addEventListener('pointerup', onPointerUp, true);
				window.addEventListener('pointercancel', onPointerCancel, true);
				return () => {
					if (animRO) animRO.disconnect();
					composerFinder.disconnect();
					document.removeEventListener('click', onClick, true);
					window.removeEventListener('pointerdown', onPointerDown, true);
					window.removeEventListener('pointermove', onPointerMove, true);
					window.removeEventListener('pointerup', onPointerUp, true);
					window.removeEventListener('pointercancel', onPointerCancel, true);
					if (meta && prev !== null) meta.setAttribute('content', prev);
					styleTag.remove();
				};
			}, 'mobile-glass: listeners + css');

			const slots = ctx.get('slots') as any;
			if (slots) {
				ctx.effect(() => slots.inject('shell.overlay', () => slots.register(
					{ name: 'shell.overlay', id: 'mobile-glass-floatnav', order: 200 },
					() => react.createElement('div', { className: 'dsw-mob-floatnav' },
						react.createElement('button', {
							className: 'dsw-mob-ham', 'data-mob-ham': '1', type: 'button',
							'aria-label': 'Toggle sidebar',
							onClick: () => { const l = layout(); if (l) l.toggleSidebar(); },
						}, '\u2261')
					)
				)), 'mobile-glass: floating nav');
			}
		}

		exports.apply = apply;
		return module.exports;
	}
});
