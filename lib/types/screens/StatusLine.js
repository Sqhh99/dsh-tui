import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from '../ui.js';
import { formatTokens } from '../cc/format.js';
import { Byline } from '../components/design-system/Byline.js';
import { ActivityLine, contextPressurePct } from '../components/ActivityLine.js';
import { DEFAULT_STATUS_LINE } from '../statusLinePrefs.js';
import { formatContextUsage, renderTpsGauge, renderTpsSparkline, speedColor, } from './StatusMetrics.js';
/**
 * The footer under the prompt input: one metrics row (model · tps · effort
 * · ctx · cache · tokens on the left, git · cwd · title on the right) and
 * an optional hint row. Context is a short `ctx 23k/1.0M 2.3%` read, not
 * a full-width labeled segment bar.
 *
 * `segments` (the `/statusline` choice, persisted in
 * `~/.dsh-tui/statusline.json`) gates each field individually. It only ever
 * removes: `contextBar` still needs the cordis.yml `contextBar` key on, and a
 * field with nothing to show stays hidden regardless.
 */
export function StatusLine({ channel, selectionActive = false, helpOpen = false, segments = DEFAULT_STATUS_LINE, }) {
    const usage = channel.lastUsage;
    const contextParts = [];
    if (segments.effort && channel.reasoningEffort !== undefined) {
        contextParts.push(_jsx(Text, { color: "inactiveShimmer", children: channel.reasoningEffort }, "effort"));
    }
    if (segments.cache && usage !== undefined && usage.cacheRead > 0) {
        // Cache hit rate of the context fed to the model (read / total), one
        // decimal — the absolute read count lives in the context bar's system
        // segment, the rate is the glanceable health signal.
        const total = usage.input + usage.cacheRead + usage.cacheWrite;
        const rate = total > 0 ? (usage.cacheRead / total) * 100 : 0;
        contextParts.push(_jsxs(Text, { children: [_jsx(Text, { dimColor: true, children: "cache " }), _jsxs(Text, { color: "inactiveShimmer", children: [rate.toFixed(1), "%"] })] }, "cache"));
    }
    // TPS readout sits right after the model so a crowded footer truncates
    // the trailing fields (tokens/think/cache), never the speedometer. One
    // number only: the live value (gauge while streaming, sparkline of past
    // turns once samples exist) — no μ/p95 clutter.
    const tpsParts = [];
    if (segments.tps && channel.tps !== undefined) {
        if (channel.working && channel.tpsSamples.length === 0) {
            tpsParts.push(_jsxs(Text, { children: [renderTpsGauge(channel.tps, channel.tps), ' ', _jsxs(Text, { dimColor: true, children: [Math.round(channel.tps), " tps"] })] }, "tps"));
        }
        else if (channel.tpsSamples.length > 0) {
            const peak = Math.max(...channel.tpsSamples.map(sample => sample.tps), channel.tps);
            tpsParts.push(_jsxs(Text, { children: [channel.working
                        ? renderTpsGauge(channel.tps, peak)
                        : renderTpsSparkline(channel.tpsSamples), ' ', speedColor(channel.tps, `${Math.round(channel.tps)}`), " tps"] }, "tps"));
        }
        else {
            tpsParts.push(_jsxs(Text, { dimColor: true, children: [Math.round(channel.tps), " t/s"] }, "tps"));
        }
    }
    const ctxText = segments.contextBar &&
        channel.contextBarEnabled &&
        channel.contextWindow !== undefined
        ? formatContextUsage(usage !== undefined
            ? usage.input + usage.cacheRead + usage.cacheWrite
            : channel.tokens.input, channel.contextWindow)
        : '';
    // Left group: every field sits at soft white (inactiveShimmer) instead of
    // the previous uniform dim grey — readable against dark terminals.
    const leftParts = [
        ...(segments.model
            ? [
                _jsx(Text, { color: "inactiveShimmer", children: channel.model }, "model"),
            ]
            : []),
        ...(ctxText !== ''
            ? [
                _jsx(Text, { color: "inactiveShimmer", children: ctxText }, "ctx"),
            ]
            : []),
        ...tpsParts,
        ...contextParts,
        ...(segments.tokens
            ? [
                _jsxs(Text, { color: "inactiveShimmer", children: [formatTokens(channel.tokens.input), "\u2192", formatTokens(channel.tokens.output)] }, "tokens"),
            ]
            : []),
    ];
    // Right group: git branch in muted steel blue, cwd a soft white, the
    // session title dimmest (it truncates first anyway).
    const rightParts = [
        ...(segments.git && channel.gitBranch
            ? [
                _jsx(Text, { color: "professionalBlue", children: channel.gitBranch }, "git"),
            ]
            : []),
        ...(segments.cwd
            ? [
                _jsx(Text, { color: "inactiveShimmer", children: basename(channel.cwd) }, "cwd"),
            ]
            : []),
        ...(segments.title && channel.sessionTitle
            ? [
                _jsx(Text, { dimColor: true, children: channel.sessionTitle }, "title"),
            ]
            : []),
    ];
    // Row 3: the mode hint — and, while idle, the working-activity turn
    // summary (the live working line itself moves to the spinner slot above
    // the input while a turn runs, so the two never duplicate).
    const hint = !segments.hint
        ? ''
        : selectionActive
            ? 'esc to return to input'
            : channel.working
                ? 'esc to interrupt'
                : !helpOpen
                    ? '? for shortcuts'
                    : '';
    const activity = channel.workingActivity;
    const showActivity = !channel.working &&
        activity !== undefined &&
        activity.line !== '' &&
        activity.phase !== 'idle';
    return (_jsx(Box, { paddingX: 2, children: _jsxs(Box, { flexDirection: "column", width: "100%", children: [_jsxs(Box, { flexDirection: "row", gap: 2, children: [_jsx(Box, { flexGrow: 1, flexShrink: 1, children: _jsx(Text, { wrap: "truncate", children: _jsx(Byline, { children: leftParts }) }) }), _jsx(Box, { flexShrink: 1, children: _jsx(Text, { wrap: "truncate", children: _jsx(Byline, { children: rightParts }) }) })] }), (showActivity || hint) && (_jsxs(Box, { height: 1, overflow: "hidden", flexDirection: "row", justifyContent: "space-between", gap: 2, children: [showActivity && activity !== undefined ? (_jsx(ActivityLine, { activity: activity, activityFrames: channel.activityFrames, warnPct: contextPressurePct(usage, channel.contextWindow), warnDanger: (contextPressurePct(usage, channel.contextWindow) ?? 0) >= 95 })) : hint ? (_jsx(Text, { color: "inactiveShimmer", children: hint })) : null, showActivity && hint ? (_jsx(Text, { color: "inactiveShimmer", wrap: "truncate", children: hint })) : null] }))] }) }));
}
function basename(path) {
    const parts = path.split(/[\\/]/);
    return parts[parts.length - 1] ?? path;
}
