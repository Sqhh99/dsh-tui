import { describe, expect, it } from 'vitest'
import { renderBigTextSolid, trackingToFit, wordmarkColumns } from '../src/components/bigfont.ts'
import {
  bitAt,
  brailleChar,
  halfBlockChar,
  mosaicRows,
  sextantChar,
  whaleCellSize,
  type BitMask,
} from '../src/components/logoMosaic.ts'

const INK = { r: 10, g: 20, b: 30 }

function pack(width: number, height: number, ink: ReadonlySet<string>): BitMask {
  const rowBytes = Math.ceil(width / 8)
  const bits = new Uint8Array(height * rowBytes)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!ink.has(`${x},${y}`)) continue
      bits[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7)
    }
  }
  return { width, height, bits }
}

function stripSgr(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '')
}

describe('halfBlockChar', () => {
  it('uses only ▀▄█ and space', () => {
    expect(halfBlockChar(false, false)).toBe(' ')
    expect(halfBlockChar(true, false)).toBe('▀')
    expect(halfBlockChar(false, true)).toBe('▄')
    expect(halfBlockChar(true, true)).toBe('█')
  })
})

describe('sextantChar', () => {
  it('maps empty, halves, full, and U+1FB00 cells', () => {
    expect(sextantChar(0)).toBe(' ')
    expect(sextantChar(21)).toBe('▌')
    expect(sextantChar(42)).toBe('▐')
    expect(sextantChar(63)).toBe('█')
    expect(sextantChar(1)).toBe('\u{1FB00}')
    expect(sextantChar(22)).toBe('\u{1FB14}')
  })
})

describe('brailleChar', () => {
  it('uses the Braille Patterns block', () => {
    expect(brailleChar(0)).toBe('\u2800')
    expect(brailleChar(0xff)).toBe('⣿')
  })
})

describe('mosaicRows', () => {
  it('renders an empty mask as a blank row', () => {
    const mask = pack(1, 2, new Set())
    const rows = mosaicRows(mask, 1, INK, { glyphs: 'half', rows: 1 })
    expect(rows).toEqual([''])
    expect(bitAt(mask, 0, 0)).toBe(false)
  })

  it('fills a 1×2 ink cell with a full block and ink SGR', () => {
    const rows = mosaicRows(pack(1, 2, new Set(['0,0', '0,1'])), 1, INK, { glyphs: 'half', rows: 1 })
    expect(stripSgr(rows[0] ?? '')).toBe('█')
    expect(rows[0]).toContain('38;2;10;20;30')
    expect(rows[0]).not.toMatch(/\u{1FB00}/u)
  })

  it('places an upper half-block', () => {
    const rows = mosaicRows(pack(1, 2, new Set(['0,0'])), 1, INK, { glyphs: 'half', rows: 1 })
    expect(stripSgr(rows[0] ?? '')).toBe('▀')
  })

  it('fills a 2×4 ink cell with a solid braille glyph', () => {
    const ink = new Set<string>()
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 2; x++) ink.add(`${x},${y}`)
    }
    const rows = mosaicRows(pack(2, 4, ink), 1, INK, { glyphs: 'braille', rows: 1 })
    expect(stripSgr(rows[0] ?? '')).toBe('⣿')
  })
})

describe('wordmarkColumns', () => {
  it('inserts a one-column gap between 6-wide letters', () => {
    expect(wordmarkColumns('DEEPSEEK')).toBe(8 * 6 + 7)
    const rows = renderBigTextSolid('DE', INK)
    expect(rows).toHaveLength(4)
    // D is capped `#####.` over `#....#`, E is `######` over `#.....`.
    expect(stripSgr(rows[0] ?? '')).toBe('█▀▀▀▀▄ █▀▀▀▀▀')
  })

  it('trims trailing blanks rather than padding the row', () => {
    const rows = renderBigTextSolid('P', INK)
    // P has no bottom-left serif, so its last row is the stem alone.
    expect(stripSgr(rows[3] ?? '')).toBe('▀')
  })
})

describe('trackingToFit', () => {
  it('widens a shorter word to the same right edge', () => {
    const width = wordmarkColumns('DEEPSEEK')
    const tracking = trackingToFit('HARNESS', width)
    expect(tracking).toBeGreaterThan(1)
    expect(wordmarkColumns('HARNESS', tracking)).toBeLessThanOrEqual(width)
  })

  it('never tightens below the default tracking', () => {
    expect(trackingToFit('HARNESS', 10)).toBe(1)
  })
})

describe('whaleCellSize', () => {
  it('keeps the whale about half the wordmark beside it', () => {
    const at130 = whaleCellSize(130, 1.28)
    expect(at130?.columns).toBe(30)
    // Half-block rows are two pixels tall, so the box holds the mask aspect.
    expect(at130?.rows).toBe(Math.round(30 / (2 * 1.28)))

    // 80 columns leaves 21 beside the wordmark: smaller, but still drawn.
    expect(whaleCellSize(80, 1.28)?.columns).toBe(21)

    // Below that the wordmark stands alone.
    expect(whaleCellSize(72, 1.28)).toBeNull()
  })
})
