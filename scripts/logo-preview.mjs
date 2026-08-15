#!/usr/bin/env node
/** Print the whale mosaic. Usage: node --import tsx/esm scripts/logo-preview.mjs [cols] */
import { mosaicRows, LOGO_MASK, whaleCellSize, preferGlyphs } from '../src/components/logoMosaic.ts'

const columns = Number(process.argv[2] ?? 80)
const glyphs = preferGlyphs()
const size = whaleCellSize(columns) ?? { columns: 32, rows: 14 }
const ink = { r: 232, g: 230, b: 224 }
process.stderr.write(`whale ${size.columns}×${size.rows} glyphs=${glyphs}\n`)
for (const row of mosaicRows(LOGO_MASK, size.columns, ink, { glyphs, rows: size.rows })) {
  process.stdout.write(row + '\n')
}
