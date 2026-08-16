/**
 * Persisted status-line segment visibility (`/statusline` picker choice), kept
 * at `~/.dsh-tui/statusline.json` so the footer layout survives restarts —
 * same pattern as agent-preset.json / working-activity.json.
 *
 * The file is a partial map: only keys the user actually changed need be
 * present, and an unknown key is dropped. A segment added by a later version
 * is therefore absent from an older file and falls back to its default (on)
 * rather than silently disappearing. A missing or corrupt file yields the
 * full default layout.
 *
 * The cordis.yml `contextBar` key stays a separate, harder switch: it turns
 * the bar off for a deployment, and this preference cannot turn it back on.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PREFS_DIR, readPrefText } from './paths.js';
/**
 * Footer segments in picker order, which is also roughly their order on the
 * status line: the context bar owns row 1, the left group runs
 * model → tps → effort → cache → tokens, the right group git → cwd → title,
 * and the hint owns row 3.
 */
export const STATUS_SEGMENTS = [
    'contextBar',
    'model',
    'tps',
    'effort',
    'cache',
    'tokens',
    'git',
    'cwd',
    'title',
    'hint',
];
/** Default footer: metrics on, session title off (it is the first field
 *  to collide with the right cluster on a narrow terminal). */
export const DEFAULT_STATUS_LINE = Object.freeze({
    contextBar: true,
    model: true,
    tps: true,
    effort: true,
    cache: true,
    tokens: true,
    git: true,
    cwd: true,
    title: false,
    hint: true,
});
/**
 * Whether a string names a segment this version knows.
 * @param value - Candidate segment name.
 * @returns True when `value` is a known segment.
 */
export function isStatusSegment(value) {
    return STATUS_SEGMENTS.includes(value);
}
/**
 * Merge a partial preference over the defaults.
 * @param partial - Segments the user changed, if any.
 * @returns A complete segment map.
 */
export function resolveStatusLinePrefs(partial) {
    return { ...DEFAULT_STATUS_LINE, ...partial };
}
/**
 * Parse a persisted `{ segment: boolean }` map; unknown keys and non-boolean
 * values are dropped. Anything that is not a JSON object yields undefined.
 * @param text - Raw file contents.
 * @returns The recognized segment flags, or undefined when unparseable.
 */
export function parseStatusLinePref(text) {
    try {
        const parsed = JSON.parse(text);
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed))
            return undefined;
        const out = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (isStatusSegment(key) && typeof value === 'boolean')
                out[key] = value;
        }
        return out;
    }
    catch {
        return undefined;
    }
}
/**
 * The persisted segment flags, or undefined when unset or invalid.
 * @param dir - Prefs directory (injectable for tests).
 * @returns The persisted flags, if any.
 */
export function readStatusLinePref(dir = PREFS_DIR) {
    const text = readPrefText('statusline.json', dir);
    return text === undefined ? undefined : parseStatusLinePref(text);
}
/**
 * Persist the chosen segment flags (best effort). The complete map is written
 * so a later version can tell "explicitly off" from "not yet known".
 * @param prefs - Segment flags to persist.
 * @param dir - Prefs directory (injectable for tests).
 * @returns True when the file was written, false on failure.
 */
export function writeStatusLinePref(prefs, dir = PREFS_DIR) {
    try {
        mkdirSync(dir, { recursive: true });
        // Serialize in STATUS_SEGMENTS order so the file reads like the picker.
        const ordered = Object.fromEntries(STATUS_SEGMENTS.map(segment => [segment, prefs[segment]]));
        writeFileSync(join(dir, 'statusline.json'), JSON.stringify(ordered, null, 2));
        return true;
    }
    catch {
        return false;
    }
}
