#!/usr/bin/env node
/**
 * Generate assets/pwa/icon-{192,512,180}.png from assets/pwa/icon.svg.
 *
 * Build-time only — sharp resolves from the DSH deployment's node_modules
 * (the plugin itself has no runtime dependency on sharp; the PNGs are
 * committed to the repo and served statically by the Host half).
 */
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const sharp = require('/Users/yiran/.local/lib/node_modules/@deepseek-ai/dsh/node_modules/sharp')

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '../assets/pwa')
mkdirSync(outDir, { recursive: true })

const svg = readFileSync(join(outDir, 'icon.svg'))
const base = sharp(svg, { density: 192 }).resize(512, 512)

for (const size of [192, 512, 180]) {
  await base.clone().resize(size, size).png().toFile(join(outDir, `icon-${size}.png`))
  console.log(`assets/pwa/icon-${size}.png`)
}
