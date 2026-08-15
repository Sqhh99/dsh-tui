/**
 * Launcher contract for `dsh-tui --resume`: the TUI writes the chosen session
 * id to `~/.dsh-tui/resume.txt`, and the launcher feeds it back as
 * `DSH_TUI_RESUME_SESSION`. Session *records* live in DSH's own persistence
 * backend (dsh-session-persistence-jsonl) — `/resume` lists those via
 * `sessionPersistence.list()`, this file only carries the id across
 * processes. It also keeps a small `last-used.json` of session-id → epoch-ms
 * touches so `/resume` can sort most-recently-used first (DSH session
 * headers carry only `createdAt`).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PREFS_DIR, readPrefText } from './paths.js';
const DIR = PREFS_DIR;
const RESUME_FILE = join(DIR, 'resume.txt');
const LAST_USED_FILE = join(DIR, 'last-used.json');
function ensureDir() {
    mkdirSync(DIR, { recursive: true });
}
/**
 * Store the session to resume and report the launcher invocation.
 * @param sessionId - Session id for `dsh-tui --resume` on the next launch.
 */
export function writeResumeTarget(sessionId) {
    ensureDir();
    writeFileSync(RESUME_FILE, sessionId);
}
/** Forget the resume marker (`/new` starts a fresh conversation). */
export function clearResumeTarget() {
    try {
        writeFileSync(RESUME_FILE, '');
    }
    catch {
        // Best effort — the marker is a launcher nicety.
    }
}
/**
 * The session id requested by `dsh-tui --resume`, if any.
 * @returns The stored session id, or undefined when none is set.
 */
export function readResumeTarget() {
    const value = readPrefText('resume.txt')?.trim();
    return value || undefined;
}
/**
 * Session-id → last-used epoch ms map for MRU ordering.
 * @returns The parsed map; best effort, an unreadable file yields {}.
 */
export function readLastUsed() {
    try {
        const text = readPrefText('last-used.json');
        if (text === undefined)
            return {};
        const parsed = JSON.parse(text);
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return {};
        }
        const record = parsed;
        const result = {};
        for (const [id, value] of Object.entries(record)) {
            if (typeof value === 'number' && Number.isFinite(value)) {
                result[id] = value;
            }
        }
        return result;
    }
    catch {
        return {};
    }
}
/**
 * Record that a session was just used (resumed or written to) so `/resume`
 * can sort most-recently-used first. Best effort — never throws.
 * @param sessionId - Session id to touch.
 */
export function touchSession(sessionId) {
    try {
        ensureDir();
        const lastUsed = { ...readLastUsed(), [sessionId]: Date.now() };
        writeFileSync(LAST_USED_FILE, JSON.stringify(lastUsed));
    }
    catch {
        // Best effort — MRU ordering is a nicety.
    }
}
