#!/usr/bin/env node
/**
 * Build src/components/logoBitmap.ts from docs/assets/deepseek.png.
 * Auto-crops whitespace, thresholds to 1-bit, nearest-neighbor downsamples.
 * Run after changing the whale PNG.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PNG_PATH = join(ROOT, 'docs/assets/deepseek.png')
const OUT_PATH = join(ROOT, 'src/components/logoBitmap.ts')

const TARGET_WIDTH = 240
const LUMINANCE_CUT = 128
const PAD = 4

const png = PNG.sync.read(readFileSync(PNG_PATH))
const { width: srcW, height: srcH, data } = png

function luminance(x, y) {
  const i = (y * srcW + x) * 4
  return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
}

function isInk(x, y) {
  return luminance(x, y) < LUMINANCE_CUT
}

let minX = srcW
let minY = srcH
let maxX = -1
let maxY = -1
for (let y = 0; y < srcH; y++) {
  for (let x = 0; x < srcW; x++) {
    if (!isInk(x, y)) continue
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
}
if (maxX < 0) {
  throw new Error(`no ink in ${PNG_PATH}`)
}

const x0 = Math.max(0, minX - PAD)
const y0 = Math.max(0, minY - PAD)
const x1 = Math.min(srcW, maxX + 1 + PAD)
const y1 = Math.min(srcH, maxY + 1 + PAD)
const cropW = x1 - x0
const cropH = y1 - y0
const destW = TARGET_WIDTH
const destH = Math.max(1, Math.round((TARGET_WIDTH * cropH) / cropW))

const rowBytes = Math.ceil(destW / 8)
const packed = Buffer.alloc(destH * rowBytes)

for (let y = 0; y < destH; y++) {
  const srcY = y0 + Math.min(cropH - 1, Math.floor((y * cropH) / destH))
  for (let x = 0; x < destW; x++) {
    const srcX = x0 + Math.min(cropW - 1, Math.floor((x * cropW) / destW))
    if (!isInk(srcX, srcY)) continue
    packed[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7)
  }
}

const b64 = packed.toString('base64')
const wrapped = b64.match(/.{1,100}/g)?.join('\n  ') ?? b64

const body = `/**
 * 1-bit whale mask generated from docs/assets/deepseek.png.
 * Do not edit by hand — run \`pnpm raster-logo\`.
 *
 * Crop x=${x0}..${x1} y=${y0}..${y1}, nearest-neighbor to ${destW}×${destH}.
 * Bits are row-major, MSB first, each row padded to a whole byte.
 */
export const LOGO_WIDTH = ${destW}
export const LOGO_HEIGHT = ${destH}
/** ${destW} / ${destH} — used to size the mosaic against a 1:2 cell. */
export const LOGO_ASPECT = ${destW} / ${destH}

export const LOGO_BITS = Uint8Array.from(
  atob(
    \`
  ${wrapped}
\`.replace(/\\s+/g, ''),
  ),
  ch => ch.charCodeAt(0),
)
`

writeFileSync(OUT_PATH, body)
process.stderr.write(
  `raster-logo: ${srcW}×${srcH} crop ${cropW}×${cropH} → ${destW}×${destH} (${packed.length} bytes) → ${OUT_PATH}\n`,
)
