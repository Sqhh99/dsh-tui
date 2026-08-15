#!/usr/bin/env node
/** Compile TypeScript when lib/ is missing (git installs). Published tarballs ship lib/. */
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
if (existsSync(join(root, 'lib/types/index.js'))) process.exit(0)
const tsc = spawnSync('pnpm', ['exec', 'tsc', '-p', 'tsconfig.json'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
process.exit(tsc.status ?? 1)
