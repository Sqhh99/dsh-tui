import React from 'react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Box, Text, useTerminalSize } from '../ui.js'
import { getTheme } from '../theme.js'
import { useTheme } from './design-system/ThemeProvider.js'
import { parseRGB } from './Spinner/spinnerUtils.js'
import { renderBigTextSolid } from './bigfont.js'
import { STANDARD_FRAME_INDEX, WhaleArt } from './Whale.js'
import { OPENING_SEQUENCE } from './whaleFrames.js'

const VERSION = (() => {
  try {
    const pkgPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'package.json')
    return (JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string }).version ?? '0.1.0'
  } catch {
    return '0.1.0'
  }
})()

const FULL_WHALE_WIDTH = 28
/** `DEEPSEEK` at 8 glyphs × 6 columns, less the trailing kerning column. */
const WORDMARK_WIDTH = 47
/** Whale + gap + wordmark; below this the whale drops and the text stands alone. */
const WHALE_MIN_COLUMNS = FULL_WHALE_WIDTH + 3 + WORDMARK_WIDTH
/** Rule under the wordmark, flush with it as in docs/assets/logo.png. */
const RULE = '─'.repeat(WORDMARK_WIDTH)

const INK_LIGHT = { r: 232, g: 230, b: 224 }
const INK_DARK = { r: 24, g: 24, b: 24 }

function capitalize(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1)
}

function toTriple(color: { r: number; g: number; b: number }): readonly [number, number, number] {
  return [color.r, color.g, color.b]
}

/**
 * Splash matched to docs/assets/logo.png: monochrome leaping whale, 4-row
 * outline wordmark, short blink, then a static header. Narrow terminals
 * drop the whale.
 */
export function LogoV2({
  model,
  effort,
  cwd,
  skipIntro = false,
}: {
  model: string
  effort?: string | undefined
  cwd: string
  skipIntro?: boolean
}): React.ReactNode {
  const [step, setStep] = React.useState(skipIntro ? OPENING_SEQUENCE.length : 0)
  const settled = step >= OPENING_SEQUENCE.length

  React.useEffect(() => {
    if (settled) return
    const timer = setTimeout(() => {
      setStep(s => s + 1)
    }, OPENING_SEQUENCE[step].ms)
    return () => {
      clearTimeout(timer)
    }
  }, [step, settled])

  const [themeName] = useTheme()
  const theme = getTheme(themeName)
  const { columns } = useTerminalSize()

  const ink = parseRGB(theme.text) ?? (themeName === 'light' ? INK_DARK : INK_LIGHT)
  const showWhale = columns >= WHALE_MIN_COLUMNS
  const frameIndex = settled ? STANDARD_FRAME_INDEX : OPENING_SEQUENCE[step].frame
  const bigDeepSeek = renderBigTextSolid('DEEPSEEK', ink)
  const bigHarness = renderBigTextSolid('HARNESS', ink)

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row" gap={3} width="100%" alignItems="center">
        {showWhale && (
          <WhaleArt frameIndex={frameIndex} width={FULL_WHALE_WIDTH} fill={toTriple(ink)} />
        )}
        <Box flexDirection="column" flexShrink={1}>
          <Text dimColor wrap="truncate-end">
            {'dsh-tui  v' + VERSION}
          </Text>
          {bigDeepSeek.map((row, index) => (
            <Text key={`ds-${index}`} wrap="truncate-end">
              {row}
            </Text>
          ))}
          {bigHarness.map((row, index) => (
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
          </Text>
          <Text dimColor wrap="truncate-end">
            {'>_  ' + cwd}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
