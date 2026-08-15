import React from 'react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Box, Text, useTerminalSize } from '../ui.js'
import { getTheme, type Theme } from '../theme.js'
import { useTheme } from './design-system/ThemeProvider.js'
import { parseRGB } from './Spinner/spinnerUtils.js'
import { renderBigText, trackingToFit, type Rgb } from './bigfont.js'
import {
  LOGO_MASK,
  mosaicRows,
  preferGlyphs,
  whaleCellSize,
  WHALE_GAP,
  WORDMARK_COLUMNS,
} from './logoMosaic.js'

const VERSION = (() => {
  try {
    const pkgPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'package.json')
    return (JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string }).version ?? '0.1.0'
  } catch {
    return '0.1.0'
  }
})()

/** Flush with the wordmark, as the rule is in docs/assets/logo.png. */
const RULE = '─'.repeat(WORDMARK_COLUMNS)

const INK_LIGHT: Rgb = { r: 232, g: 230, b: 224 }
const INK_DARK: Rgb = { r: 24, g: 24, b: 24 }

/**
 * Brand ramp for the wordmark, left to right: `remember` is the palette's
 * strongest brand blue against its own background and `claude` the mid one,
 * so the ramp falls away from the reader in both light and dark without
 * needing separate stops — and user themes inherit it with no extra keys.
 * Falls back to flat ink on `dark-ansi`, which has no truecolor to ramp.
 */
export function brandRamp(theme: Theme, fallback: Rgb): Rgb[] {
  const stops = [theme.remember, theme.claude]
    .map((color) => parseRGB(color))
    .filter((color): color is Rgb => color != null)
  return stops.length === 0 ? [fallback] : stops
}

function capitalize(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1)
}

/**
 * Splash: the whale from docs/assets/deepseek.png as a solid half-block
 * silhouette, the two-line wordmark ramped through the theme's brand blues,
 * then model / effort / version and the cwd. Narrow terminals drop the whale
 * and leave the wordmark standing alone.
 */
export function LogoV2({
  model,
  effort,
  cwd,
}: {
  model: string
  effort?: string | undefined
  cwd: string
}): React.ReactNode {
  const [themeName] = useTheme()
  const theme = getTheme(themeName)
  const { columns } = useTerminalSize()

  const ink = parseRGB(theme.text) ?? (themeName === 'light' ? INK_DARK : INK_LIGHT)
  const ramp = brandRamp(theme, ink)
  // The whale sits at the soft end of the ramp so the wordmark stays the
  // brightest thing in the block; ink alone made the silhouette shout.
  const whaleInk = ramp[ramp.length - 1] ?? ink
  const size = whaleCellSize(columns)
  const whale =
    size === null
      ? null
      : mosaicRows(LOGO_MASK, size.columns, whaleInk, { glyphs: preferGlyphs(), rows: size.rows })
  // `HARNESS` is a letter short, so widen its tracking to the same right edge.
  const deepseek = renderBigText('DEEPSEEK', ramp)
  const harness = renderBigText('HARNESS', ramp, trackingToFit('HARNESS', WORDMARK_COLUMNS))

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row" gap={WHALE_GAP} width="100%" alignItems="center">
        {whale !== null && (
          <Box flexDirection="column" flexShrink={0} width={size?.columns}>
            {whale.map((row, index) => (
              <Text key={index} wrap="truncate-end">
                {row}
              </Text>
            ))}
          </Box>
        )}
        <Box flexDirection="column" flexShrink={1}>
          {deepseek.map((row, index) => (
            <Text key={`ds-${index}`} wrap="truncate-end">
              {row}
            </Text>
          ))}
          <Box height={1} />
          {harness.map((row, index) => (
            <Text key={`h-${index}`} wrap="truncate-end">
              {row}
            </Text>
          ))}
          <Text dimColor wrap="truncate-end">
            {RULE}
          </Text>
          <Text wrap="truncate-end">
            {model}
            {effort !== undefined && <Text dimColor>{'  ·  ' + capitalize(effort) + ' effort'}</Text>}
            <Text dimColor>{'  ·  v' + VERSION}</Text>
          </Text>
          <Text dimColor wrap="truncate-end">
            {'>_  ' + cwd}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
