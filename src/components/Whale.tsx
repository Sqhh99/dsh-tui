import React from 'react'
import { Box, Text } from '../ui.js'
import { WHALE_FRAMES, type WhaleFrame } from './whaleFrames.js'

type Rgb = readonly [number, number, number]

/** Default monochrome ink (dark-on-light). LogoV2 overrides from the theme. */
const DEFAULT_FILL: Rgb = [24, 24, 24]
const DEFAULT_PATCH: Rgb = [245, 245, 245]

const fg = (rgb: Rgb): string => `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m`
const bg = (rgb: Rgb): string => `\x1b[48;2;${rgb[0]};${rgb[1]};${rgb[2]}m`
const RESET = '\x1b[0m'

export function renderWhaleRows(
  frame: WhaleFrame,
  fill: Rgb = DEFAULT_FILL,
  patch: Rgb = DEFAULT_PATCH,
): string[] {
  const palette: Record<string, Rgb | undefined> = { B: fill, W: patch }
  const sprite = frame.rows
  const rows: string[] = []
  for (let r = 0; r < sprite.length; r += 2) {
    const upper = sprite[r]
    const lower = sprite[r + 1] ?? ''
    let out = ''
    let current = ''
    for (let x = 0; x < upper.length; x++) {
      const up = palette[upper[x] ?? '']
      const lo = palette[lower[x] ?? '']
      let seq: string
      let ch: string
      if (up !== undefined && lo !== undefined) {
        seq = fg(up) + bg(lo)
        ch = '▀'
      } else if (up !== undefined) {
        seq = fg(up)
        ch = '▀'
      } else if (lo !== undefined) {
        seq = fg(lo)
        ch = '▄'
      } else {
        seq = ''
        ch = ' '
      }
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
  patch = DEFAULT_PATCH,
}: {
  frameIndex?: number
  width?: number
  fill?: Rgb
  patch?: Rgb
}): React.ReactNode {
  const frame = WHALE_FRAMES[frameIndex] ?? WHALE_FRAMES[STANDARD_FRAME_INDEX]
  const rows = renderWhaleRows(frame, fill, patch)
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
