import { describe, expect, it } from 'vitest'
import { brandRamp } from '../src/components/LogoV2.tsx'
import { LOGO_MASK, mosaicRows, whaleCellSize } from '../src/components/logoMosaic.ts'
import { parseRGB } from '../src/components/Spinner/spinnerUtils.ts'
import { getTheme } from '../src/theme.ts'

const FALLBACK = { r: 24, g: 24, b: 24 }

describe('brandRamp', () => {
  it('falls back to flat ink when the theme has no rgb() brand colors', () => {
    expect(brandRamp(getTheme('dark-ansi'), FALLBACK)).toEqual([FALLBACK])
  })

  it('uses remember then claude on truecolor themes', () => {
    const theme = getTheme('dark')
    expect(brandRamp(theme, FALLBACK)).toEqual([parseRGB(theme.remember), parseRGB(theme.claude)])
  })

  it('keeps the parseable stop when only one brand color is rgb()', () => {
    const theme = { ...getTheme('dark'), remember: 'ansi:blueBright' }
    expect(brandRamp(theme, FALLBACK)).toEqual([parseRGB(theme.claude)])
  })

  it('paints the whale without reading ink.r on a null color', () => {
    const ramp = brandRamp(getTheme('dark-ansi'), FALLBACK)
    const size = whaleCellSize(130)
    expect(size).not.toBeNull()
    expect(() =>
      mosaicRows(LOGO_MASK, size!.columns, ramp[ramp.length - 1] ?? FALLBACK, {
        glyphs: 'half',
        rows: size!.rows,
      }),
    ).not.toThrow()
  })
})
