import React from 'react'
import { Box, Text } from '../ui.js'
import { WHALE_FRAMES, type WhaleFrame } from './whaleFrames.js'

type Rgb = readonly [number, number, number]

/** Default monochrome ink (dark-on-light). LogoV2 overrides from the theme. */
const DEFAULT_FILL: Rgb = [24, 24, 24]

const fg = (rgb: Rgb): string => `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m`
const RESET = '\x1b[0m'

/**
 * Fold the 1-bit sprite into half-block rows: each terminal row carries two
 * sprite rows as `▀`/`▄`/`█`. Empty cells stay unpainted so the terminal
 * background shows through the belly, the eye and the fluke notch.
 * @param frame - The sprite to draw.
 * @param fill - Ink color for every set cell.
 * @returns One ANSI string per terminal row (half the sprite's row count).
 */
export function renderWhaleRows(frame: WhaleFrame, fill: Rgb = DEFAULT_FILL): string[] {
  const ink = fg(fill)
  const sprite = frame.rows
  const rows: string[] = []
  for (let r = 0; r < sprite.length; r += 2) {
    const upper = sprite[r]
    const lower = sprite[r + 1] ?? ''
    let out = ''
    let current = ''
    for (let x = 0; x < upper.length; x++) {
      const up = upper[x] === 'B'
      const lo = lower[x] === 'B'
      const seq = up || lo ? ink : ''
      const ch = up && lo ? '█' : up ? '▀' : lo ? '▄' : ' '
      if (seq !== current) {
        out += seq === '' ? RESET : seq
        current = seq
      }
      out += ch
    }
    let row = out.replace(/[ ]+$/, '')
    if (!row.endsWith(RESET)) row += RESET
    rows.push(row)
  }
  return rows
}

export const STANDARD_FRAME_INDEX = 0

export function WhaleArt({
  frameIndex = STANDARD_FRAME_INDEX,
  width,
  fill = DEFAULT_FILL,
}: {
  frameIndex?: number
  width?: number
  fill?: Rgb
}): React.ReactNode {
  const frame = WHALE_FRAMES[frameIndex] ?? WHALE_FRAMES[STANDARD_FRAME_INDEX]
  const rows = renderWhaleRows(frame, fill)
  return (
    <Box flexDirection="column" flexShrink={0} width={width}>
      {rows.map((row, index) => (
        <Text key={index} wrap="truncate-end">
          {row}
        </Text>
      ))}
    </Box>
  )
}
