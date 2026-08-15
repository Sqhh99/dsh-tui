/**
 * Header probe: renders LogoV2 into an in-memory terminal.
 * Run: node --import tsx/esm scripts/header-probe.tsx
 */
process.env.FORCE_COLOR = '3'

const [{ PassThrough, Writable }, React, { render, ThemeProvider }, { LogoV2 }] = await Promise.all([
  import('node:stream'),
  import('react'),
  import('../src/ui.js'),
  import('../src/components/LogoV2.js'),
])

class FakeStdout extends Writable {
  columns = 130
  rows = 40
  isTTY = true
  frames: string[] = []
  _write(chunk: unknown, _encoding: BufferEncoding, callback: () => void) {
    this.frames.push(String(chunk))
    callback()
  }
}

class FakeStderr extends Writable {
  isTTY = true
  _write(_chunk: unknown, _encoding: BufferEncoding, callback: () => void) {
    callback()
  }
}

class FakeStdin extends PassThrough {
  isTTY = true
  setRawMode() {
    return this
  }
  ref() {
    return this
  }
  unref() {
    return this
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const plain = (s: string) =>
  s
    .replace(/\x1b\[(\d+)C/g, (_, n) => ' '.repeat(Number(n)))
    .replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')
    .replace(/\x1b\]9;[^\x07]*\x07/g, '')

const stdout = new FakeStdout()
const instance = await render(
  <ThemeProvider>
    <LogoV2 model="deepseek-v4-flash" effort="high" cwd="D:/code/projects/test" />
  </ThemeProvider>,
  {
    stdout,
    stdin: new FakeStdin(),
    stderr: new FakeStderr(),
    exitOnCtrlC: false,
    patchConsole: false,
  },
)
await sleep(400)
const raw = stdout.frames.join('')
const full = plain(raw)
const mosaicChars = (full.match(/[▀▄█\u2800-\u28FF]/g) ?? []).length
const hasSextants = /[\u{1FB00}-\u{1FB3B}]/u.test(full)
const hasTopBrand = /^\s*dsh-tui/m.test(full)

console.log('=== HEADER ===')
console.log(full)
console.log('--- whale cells?', mosaicChars > 20)
console.log('--- no sextants?', !hasSextants)
console.log('--- no top dsh-tui line?', !hasTopBrand)
console.log('--- version on model line?', full.includes('v0.1.0') && full.includes('deepseek-v4-flash'))
console.log('--- ink SGR?', /\x1b\[38;2;\d+;\d+;\d+m/.test(raw))
console.log('--- has cwd?', full.includes('D:/code/projects/test'))
console.log('--- has prompt mark?', full.includes('>_'))
console.log('--- no tip line?', !full.includes('/model'))

await instance.unmount()
process.exit(
  mosaicChars > 20
    && !hasSextants
    && !hasTopBrand
    && full.includes('v0.1.0')
    && full.includes('deepseek-v4-flash')
    && full.includes('>_')
    ? 0
    : 1,
)
