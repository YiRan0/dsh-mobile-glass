/**
 * dsh-mobile-glass — Host half.
 *
 * Serves the PWA surface without touching any DSH vendor file:
 *  - /sw.js                  → the plugin's service worker (Cache-Control: no-cache
 *                              so a version bump is picked up promptly)
 *  - /manifest.webmanifest   → enhanced manifest (standalone, theme color, PNG
 *                              icons), shadowing the dist copy via exact-route
 *                              priority — the existing <link rel="manifest">
 *                              keeps working unchanged
 *  - /pwa/icon-{192,512,180}.png → app icons shipped in assets/pwa
 *  - an index tap injects the SW registration script plus apple-touch-icon and
 *    theme-color into </head>
 *
 * The client half (src/client.ts) carries the entire mobile UI adaptation and
 * is untouched by the PWA surface.
 */
import type { Context } from '@deepseek-ai/cordis'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { HEAD_EXTRA, MANIFEST_JSON, SW_SOURCE } from './pwa'

export const name = 'dsh-mobile-glass'
export const inject = ['webServer']

const ICON_SIZES = ['192', '512', '180'] as const

export function apply(ctx: Context) {
  const ws = (ctx as any).webServer
  const effect = (ctx as any).effect.bind(ctx)
  const readIcon = (size: string) =>
    readFile(fileURLToPath(new URL(`../assets/pwa/icon-${size}.png`, import.meta.url)))

  effect(() => ws.register({
    kind: 'exact',
    path: '/sw.js',
    handler: (_req: any, res: any) => {
      res.writeHead(200, {
        'content-type': 'text/javascript; charset=utf-8',
        'cache-control': 'no-cache'
      })
      res.end(SW_SOURCE)
    }
  }), 'mobile-glass: /sw.js')

  effect(() => ws.register({
    kind: 'exact',
    path: '/manifest.webmanifest',
    handler: (_req: any, res: any) => {
      res.writeHead(200, { 'content-type': 'application/manifest+json' })
      res.end(MANIFEST_JSON)
    }
  }), 'mobile-glass: /manifest.webmanifest')

  for (const size of ICON_SIZES) {
    effect(() => ws.register({
      kind: 'exact',
      path: `/pwa/icon-${size}.png`,
      handler: async (_req: any, res: any) => {
        try {
          const body = await readIcon(size)
          res.writeHead(200, {
            'content-type': 'image/png',
            'cache-control': 'public, max-age=31536000, immutable'
          })
          res.end(body)
        } catch {
          res.writeHead(404)
          res.end()
        }
      }
    }), `mobile-glass: /pwa/icon-${size}.png`)
  }

  effect(() => ws.tapIndex((html: string) => {
    if (html.includes('data-dsh-pwa')) return html
    if (!html.includes('</head>')) return html + HEAD_EXTRA
    return html.replace('</head>', HEAD_EXTRA + '</head>')
  }), 'mobile-glass: pwa index tap')
}
