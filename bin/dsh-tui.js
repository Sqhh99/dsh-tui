#!/usr/bin/env node
/**
 * dsh-tui — one-shot launcher for the dsh-tui profile.
 *
 * After a global install of @sqhh99/dsh-tui this command:
 *   1. Requires the official `dsh` CLI.
 *   2. Initializes ~/.dsh/profiles/dsh-tui on first run via
 *      `dsh plugin --profile dsh-tui add @sqhh99/dsh-tui@<this version>`.
 *   3. Intercepts `--resume` and sets DSH_TUI_RESUME_SESSION from
 *      ~/.dsh-tui/resume.txt (falls back to ~/.dsh-cc/resume.txt).
 *   4. Spawns `dsh --profile dsh-tui` with the remaining arguments.
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const ownVersion = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8')).version
const PACKAGE = '@sqhh99/dsh-tui'
const PROFILE = 'dsh-tui'

process.env.NODE_ENV ??= 'production'

const isWin = process.platform === 'win32'
const shellOpt = isWin ? { shell: true } : {}

const probe = spawnSync('dsh', ['--version'], { stdio: 'pipe', ...shellOpt })
if (probe.error || probe.status !== 0) {
  console.error('[dsh-tui] Official dsh CLI not found. Install it first:')
  console.error('  npm install -g @deepseek-ai/dsh')
  process.exit(1)
}

const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
const profileDir = join(dshHome, 'profiles', PROFILE)
if (!existsSync(join(profileDir, 'node_modules', '@sqhh99', 'dsh-tui'))) {
  const pnpmProbe = spawnSync('pnpm', ['--version'], { stdio: 'pipe', ...shellOpt })
  if (pnpmProbe.error || pnpmProbe.status !== 0) {
    console.error('[dsh-tui] First install needs pnpm (`dsh plugin` forwards to it):')
    console.error('  npm install -g pnpm')
    process.exit(1)
  }
  console.log(`[dsh-tui] First run: initializing ${PROFILE} profile (${PACKAGE}@${ownVersion})…`)
  const add = spawnSync('dsh', ['plugin', '--profile', PROFILE, 'add', `${PACKAGE}@${ownVersion}`], { stdio: 'inherit', ...shellOpt })
  if (add.status !== 0) {
    console.error('[dsh-tui] Plugin install failed. Retry with:')
    console.error(`  dsh plugin --profile ${PROFILE} add ${PACKAGE}@${ownVersion}`)
    process.exit(add.status ?? 1)
  }
}

/** Load the last session id written by the TUI on exit, if there is one. */
function readResumeTarget() {
  const candidates = [
    join(homedir(), '.dsh-tui', 'resume.txt'),
    join(homedir(), '.dsh-cc', 'resume.txt'),
  ]
  for (const file of candidates) {
    try {
      return readFileSync(file, 'utf8').trim()
    } catch {
      // Try the next compatibility path.
    }
  }
  return undefined
}

const args = []
for (const a of process.argv.slice(2)) {
  if (a === '--resume') {
    const target = readResumeTarget()
    if (target) process.env.DSH_TUI_RESUME_SESSION = target
  } else {
    args.push(a)
  }
}

// Ctrl+C's restart: the TUI leaves with this code and we bring it straight
// back on the same session. Relaunching HERE keeps things flat — having the
// TUI respawn itself would leave one live parent process per restart.
// Must match RESTART_EXIT_CODE in src/update.ts (and dsh-tui.cmd); this file
// ships as plain JS with no build step, so it cannot import it.
const RESTART_EXIT_CODE = 75

// Tell the TUI a relaunch loop is watching, so it takes the exit-code path
// instead of respawning itself.
process.env.DSH_TUI_LAUNCHER = '1'

function launch() {
  const child = spawn('dsh', ['--profile', PROFILE, ...args], {
    stdio: 'inherit',
    env: process.env,
    ...shellOpt,
  })
  child.on('error', (err) => {
    console.error(`[dsh-tui] Failed to start: ${err.message}`)
    process.exit(1)
  })
  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }
    if (code === RESTART_EXIT_CODE) {
      // The TUI wrote the session id to resume.txt before leaving; pick it
      // up so the replacement continues the same conversation.
      const target = readResumeTarget()
      if (target) process.env.DSH_TUI_RESUME_SESSION = target
      launch()
      return
    }
    process.exit(code ?? 0)
  })
}

launch()
