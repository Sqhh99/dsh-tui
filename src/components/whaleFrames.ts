/**
 * Compact side-view whale for the splash, matched to docs/assets/logo.png:
 * body faces left, tail flukes up on the right, white eye and belly, dashed
 * water underneath. Palette: B fill · W contrasting patch · `.` empty.
 */

export interface WhaleFrame {
  readonly name: string
  readonly rows: readonly string[]
}

/** 28×16 sprite. Even row count so half-block pairing yields 8 terminal rows. */
export const WHALE_FRAMES: readonly WhaleFrame[] = [
  {
    name: 'standard',
    rows: [
      '.....................BB.....',
      '....................BBBB....',
      '...................BBBBB....',
      '..................BB.BB.....',
      '.................BB.........',
      '......BBBBBBBBBBBB..........',
      '.....BBWWBBBBBBBBB..........',
      '....BBW...WWBBBBBB..........',
      '...BBW......BBBBBB..........',
      '...BB........BBBBB..........',
      '...BB.......BBBBBB..........',
      '....BB.....BBBBBB...........',
      '.....BBBBBBBBBB.............',
      '......BBBBBBB...............',
      '............................',
      '..BB..BBB..BBB..BB..........',
    ],
  },
  {
    name: 'blink',
    rows: [
      '.....................BB.....',
      '....................BBBB....',
      '...................BBBBB....',
      '..................BB.BB.....',
      '.................BB.........',
      '......BBBBBBBBBBBB..........',
      '.....BBBBBBBBBBBBB..........',
      '....BB....WWBBBBBB..........',
      '...BB.......BBBBBB..........',
      '...BB........BBBBB..........',
      '...BB.......BBBBBB..........',
      '....BB.....BBBBBB...........',
      '.....BBBBBBBBBB.............',
      '......BBBBBBB...............',
      '............................',
      '..BB..BBB..BBB..BB..........',
    ],
  },
]

export interface OpeningStep {
  readonly frame: number
  readonly ms: number
}

/** Short blink, then the static logo pose. */
export const OPENING_SEQUENCE: readonly OpeningStep[] = [
  { frame: 0, ms: 450 },
  { frame: 1, ms: 160 },
  { frame: 0, ms: 400 },
]
