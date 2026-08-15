/**
 * Side-view breaching whale for the splash, traced from docs/assets/logo.png:
 * head and back sweep to the left, the fluke rises on the right with a notch
 * between its two lobes, the underside opens into a pale crescent and the eye
 * sits as a slit above it, with dashed water at the waterline.
 *
 * Palette: `B` ink · `.` empty (the terminal background shows through, which
 * is what the reference uses for the belly, the eye and the fluke notch).
 */

export interface WhaleFrame {
  readonly name: string
  readonly rows: readonly string[]
}

/**
 * 28×24 sprite. Rows 0-20 are the whale, rows 21-22 the waterline dashes.
 * The row count is even so half-block pairing yields exactly 12 terminal rows,
 * matching the height of the wordmark column beside it.
 */
export const WHALE_FRAMES: readonly WhaleFrame[] = [
  {
    name: 'standard',
    rows: [
      '....................B.......',
      '...........BBB.....BB......B',
      '....BBBBBBBBBB.....BBB....BB',
      '...BBBBBBBBBBB......BBBB.BBB',
      '..BBBBBBBBBBBBB.....BBBBBBBB',
      '.BBBBBBBBBBBBBBB.....BBBBBB.',
      '.BBBBBBBBBBBBBBBB.....BBBB..',
      'BBBBBBBBBBBBBBBBBB....BBB...',
      'BB.....BBBBBBB..BBBB..BBB...',
      'BB.......BBBBBB..BBBBBBB....',
      'BB........BBBBBB.BBBBBBB....',
      'BBB........BBBBB..BBBBBB....',
      'BBB.........BBBBBBBBBBB.....',
      '.BB..........BBBBBBBBBB.....',
      '.BBB.........BBBBBBBBBB.....',
      '..BBB....B....BBBBBBBB......',
      '..BBBB...BBB...BBBBBB.......',
      '...BBBBB..BBB...BBBBBB......',
      '....BBBBBBBBBBB..BBBBBB.....',
      '......BBBBBBBBBBB...........',
      '.BB.....BBBBBBB.............',
      'BB.BBB...........BBBBBB.BBB.',
      '......BBBBBBBB.BBBB..BBBB...',
      '............................',
    ],
  },
  {
    /** Same pose with the eye slit closed — the one beat of the intro. */
    name: 'blink',
    rows: [
      '....................B.......',
      '...........BBB.....BB......B',
      '....BBBBBBBBBB.....BBB....BB',
      '...BBBBBBBBBBB......BBBB.BBB',
      '..BBBBBBBBBBBBB.....BBBBBBBB',
      '.BBBBBBBBBBBBBBB.....BBBBBB.',
      '.BBBBBBBBBBBBBBBB.....BBBB..',
      'BBBBBBBBBBBBBBBBBB....BBB...',
      'BB.....BBBBBBBBBBBBB..BBB...',
      'BB.......BBBBBBBBBBBBBB.....',
      'BB........BBBBBBBBBBBBB.....',
      'BBB........BBBBBBBBBBBB.....',
      'BBB.........BBBBBBBBBBB.....',
      '.BB..........BBBBBBBBBB.....',
      '.BBB.........BBBBBBBBBB.....',
      '..BBB....B....BBBBBBBB......',
      '..BBBB...BBB...BBBBBB.......',
      '...BBBBB..BBB...BBBBBB......',
      '....BBBBBBBBBBB..BBBBBB.....',
      '......BBBBBBBBBBB...........',
      '.BB.....BBBBBBB.............',
      'BB.BBB...........BBBBBB.BBB.',
      '......BBBBBBBB.BBBB..BBBB...',
      '............................',
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
