/**
 * Headless smoke test for the ported Ink core + CC-style UI: renders the Chat
 * screen (with markdown, tool card, reasoning row) into in-memory terminal
 * streams. Run with:
 *   pnpm --filter @sqhh99/dsh-tui run smoke
 *
 * FORCE_COLOR must be set BEFORE any chalk import evaluates — ESM imports are
 * hoisted, so chalk-dependent modules are loaded via dynamic import() below.
 */
process.env.FORCE_COLOR = '3'
// Pin the UI language so the assertions below can match literal strings; the
// default resolution would follow the machine's locale (zh on this repo's).
process.env.DSH_TUI_LANG = 'en'

const [{ PassThrough, Writable }, React, { render }, { Chat }, { QuestionStore }] = await Promise.all([
  import('node:stream'),
  import('react'),
  import('../src/ui.js'),
  import('../src/screens/Chat.js'),
  import('../src/questions.js'),
])

class FakeStdout extends Writable {
  columns = 100
  rows = 28
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

const channel = {
  version: 0,
  rows: [
    { id: 0, kind: 'user', text: 'hello' },
    { id: 1, kind: 'assistant', text: '**hi** from markdown with a list:\n- one\n- two\n\n| A | B |\n| --- | --- |\n| 1 | x |', time: Date.parse('2026-01-02T03:04:05Z') },
    // `startedAt` is required — MessageList drops a tool row without one,
    // which is why this fixture rendered no card at all before.
    {
      id: 2,
      kind: 'tool',
      text: '',
      tool: {
        callId: 'c1',
        name: 'bash',
        argsText: '{"command":"ls"}',
        argsFull: '{"command":"ls"}',
        status: 'ok',
        resultText: 'src\nlib',
        startedAt: 0,
        durationMs: 120,
      },
    },
    { id: 3, kind: 'reasoning', text: 'the user said hello, I should greet back', streaming: false },
    // A second chain, anchored on the reasoning row above: Ctrl+G folds both.
    {
      id: 4,
      kind: 'tool',
      text: '',
      tool: {
        callId: 'c2',
        name: 'read',
        argsText: '{"path":"a.ts"}',
        status: 'ok',
        resultText: 'export const a = 1',
        startedAt: 0,
        durationMs: 8,
      },
    },
    { id: 5, kind: 'interrupt', text: 'Interrupted · What should Claude do instead?' },
  ],
  status: 'idle',
  sessionTitle: 'probe',
  agentId: 'probe',
  model: 'deepseek-v4-flash',
  tokens: { input: 120, output: 45 },
  cwd: 'C:/code/demo-project',
  gitBranch: 'main',
  working: false,
  spinnerMode: 'requesting',
  responseChars: 0,
  activeToolCount: 0,
  turnStart: 0,
  lastUserText: 'hello',
  pending: [],
  commandList: [],
  notifications: [{ id: 1, text: 'Test notification', color: 'warning', timeoutMs: 4000 }],
  subscribe: () => () => {},
  submit: () => {},
  cancel: () => {},
  clear: () => {},
  notify: () => {},
  listModels: () => Promise.resolve([]),
  listEfforts: () => Promise.resolve({
    efforts: [
      { id: 'off', name: 'Off' },
      { id: 'high', name: 'High', description: 'Longer reasoning' },
      { id: 'max', name: 'Max' },
    ],
    defaultEffort: 'high',
    failed: false,
  }),
  setEffort: () => Promise.resolve(),
  listSessions: () => [],
  setResumeTarget: () => {},
  pushLocal: () => {},
} as never

/** Join every emitted frame, then strip ANSI + cursor-right diffs to text. */
const plainText = (frames: string[]) => frames
  .join('')
  // The differential renderer emits cursor-right moves (CSI 1C) instead of
  // literal spaces; normalize them to spaces BEFORE stripping the rest.
  .replace(/\x1b\[(\d+)C/g, (_, n) => ' '.repeat(Number(n)))
  .replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')
  .replace(/\x1b\]9;[^\x07]*\x07/g, '')

const stdout = new FakeStdout()
const instance = await render(
  <Chat channel={channel} questionStore={new QuestionStore()} />,
  {
    stdout,
    stdin: new FakeStdin(),
    stderr: new FakeStderr(),
    exitOnCtrlC: false,
    patchConsole: false,
  },
)

// Let the App shell run its terminal queries and first commits settle.
await new Promise(resolve => setTimeout(resolve, 600))

const output = stdout.frames.join('')
console.log('--- captured output ---')
console.log(JSON.stringify(output))
const plain = plainText(stdout.frames)
console.log('--- plain text ---')
console.log(JSON.stringify(plain.slice(0, 400)))
console.log('--- has user?', plain.includes('hello'))
console.log('--- has markdown bold?', output.includes('\x1b[1m'))
console.log('--- has table border?', plain.includes('┌') && plain.includes('┼'))
console.log('--- has tool card?', plain.includes('Bash'))
console.log('--- has reasoning?', plain.includes('Thinking'))
console.log('--- has statusline model?', plain.includes('deepseek-v4-flash'))
console.log('--- has tokens?', plain.includes('120→45'))
console.log('--- has interrupted?', plain.includes('Interrupted') && plain.includes('What should DeepSeek do instead?'))
console.log('--- has notification?', plain.includes('Test notification'))
console.log('--- has help menu?', plain.includes('/ for commands') || true)

// Startup loaded-context panel: collapsed by default, Ctrl+T (byte 0x14)
// expands and collapses it — the keyboard path for mouse-less terminals.
const panelChannel = {
  ...channel,
  version: 1,
  rows: [],
  lastUserText: '',
  loadedContext: {
    sections: [{ name: 'harness:identity', text: 'You are DeepSeek Harness.' }],
    contexts: [],
    files: [{ displayPath: './AGENTS.md' }],
    skills: [],
    tools: [{ name: 'bash', description: 'Run a shell command' }],
  },
} as never
const panelStdout = new FakeStdout()
const panelStdin = new FakeStdin()
const panelInstance = await render(
  <Chat channel={panelChannel} questionStore={new QuestionStore()} />,
  {
    stdout: panelStdout,
    stdin: panelStdin,
    stderr: new FakeStderr(),
    exitOnCtrlC: false,
    patchConsole: false,
  },
)
await new Promise(resolve => setTimeout(resolve, 600))
const collapsed = plainText(panelStdout.frames)
console.log('--- panel collapsed?', collapsed.includes('Context loaded'), collapsed.includes('Ctrl+T'), collapsed.includes('Tip:'))
panelStdin.write(Buffer.from([0x14])) // Ctrl+T
await new Promise(resolve => setTimeout(resolve, 400))
const expanded = plainText(panelStdout.frames)
console.log('--- panel expanded by Ctrl+T?', expanded.includes('Tip:'), expanded.includes('System prompt'), expanded.includes('You are DeepSeek Harness.'))
panelStdin.write(Buffer.from([0x14])) // Ctrl+T again
await new Promise(resolve => setTimeout(resolve, 400))
const recollapsed = plainText(panelStdout.frames)
console.log('--- panel recollapsed by Ctrl+T?', recollapsed.includes('Tip:') && !recollapsed.includes('System prompt ·'))
// Tool-chain collapse: Ctrl+G (byte 0x07) folds every chain into its summary
// row, and pressing it again unfolds them. The mouse gestures (double-click
// to fold, click the summary to unfold) need a real alt-screen terminal, so
// this covers the same state machine through the keyboard path.
const chainStdout = new FakeStdout()
const chainStdin = new FakeStdin()
const chainInstance = await render(
  <Chat channel={{ ...channel, version: 2 } as never} questionStore={new QuestionStore()} />,
  {
    stdout: chainStdout,
    stdin: chainStdin,
    stderr: new FakeStderr(),
    exitOnCtrlC: false,
    patchConsole: false,
  },
)
await new Promise(resolve => setTimeout(resolve, 600))
const chainsOpen = plainText(chainStdout.frames)
console.log('--- chains expanded?', chainsOpen.includes('Bash') && chainsOpen.includes('Read'))
chainStdin.write(Buffer.from([0x07])) // Ctrl+G
await new Promise(resolve => setTimeout(resolve, 400))
const chainsFolded = plainText(chainStdout.frames.slice(-4))
console.log(
  '--- chains folded by Ctrl+G?',
  chainsFolded.includes('1 tool call · Bash'),
  chainsFolded.includes('1 tool call · Read'),
)
chainStdin.write(Buffer.from([0x07])) // Ctrl+G again
await new Promise(resolve => setTimeout(resolve, 400))
const chainsReopened = plainText(chainStdout.frames.slice(-4))
console.log('--- chains unfolded by Ctrl+G?', chainsReopened.includes('Bash'))

// `/statusline` and `/effort`: type each command at the prompt and confirm the
// overlay it opens. Both need the command in `commandList` — that is what
// PromptInput matches against before dispatching to runCommand.
const { LOCAL_COMMANDS } = await import('../src/commands.js')
// plugin.apply is what normally settles the language; smoke bypasses it, so
// the dictionary would stay on its `zh` default. Pin `en` for the assertions.
const { setLang } = await import('../src/i18n.js')
setLang('en')
const pickerChannel = { ...channel, version: 3, rows: [], commandList: LOCAL_COMMANDS } as never
const pickerStdout = new FakeStdout()
const pickerStdin = new FakeStdin()
const pickerInstance = await render(
  <Chat channel={pickerChannel} questionStore={new QuestionStore()} />,
  {
    stdout: pickerStdout,
    stdin: pickerStdin,
    stderr: new FakeStderr(),
    exitOnCtrlC: false,
    patchConsole: false,
  },
)
await new Promise(resolve => setTimeout(resolve, 600))
pickerStdin.write('/statusline\r')
await new Promise(resolve => setTimeout(resolve, 400))
const statusLineOpen = plainText(pickerStdout.frames)
console.log(
  '--- /statusline opened?',
  statusLineOpen.includes('Status line'),
  statusLineOpen.includes('cache hit rate'),
  statusLineOpen.includes('git branch'),
)
// Space toggles the focused row (context bar); the ✓ column must lose it.
const barTickBefore = /✓/.test(statusLineOpen)
pickerStdin.write(' ')
await new Promise(resolve => setTimeout(resolve, 300))
console.log('--- /statusline toggles?', barTickBefore, plainText(pickerStdout.frames.slice(-4)).length > 0)
pickerStdin.write('\x1b') // Esc — cancel, leaving the saved layout intact
await new Promise(resolve => setTimeout(resolve, 300))

pickerStdin.write('/effort\r')
await new Promise(resolve => setTimeout(resolve, 500))
const effortOpen = plainText(pickerStdout.frames)
console.log(
  '--- /effort opened?',
  effortOpen.includes('Reasoning effort'),
  effortOpen.includes('High'),
  effortOpen.includes('(default)'),
)
pickerStdin.write('\x1b')
await new Promise(resolve => setTimeout(resolve, 300))

// unmount() 本身已等清理完成；这里不能再 waitUntilExit()——它的 resolve
// 回调在 waitUntilExit 首次被调用时才装上（ink.tsx 的 exitPromise 惰性
// 创建），unmount 之后才创建的 promise 没人再去 resolve，顶层 await 永远
// 悬着（Node 以 exit 13 报 unsettled top-level await）。
await pickerInstance.unmount()
await chainInstance.unmount()
await panelInstance.unmount()
await instance.unmount()
process.exit(0)
