import React from 'react'
import { Box, Text } from '../ui.js'
import { formatTokens } from '../cc/format.js'
import { Byline } from '../components/design-system/Byline.js'
import { ActivityLine, contextPressurePct } from '../components/ActivityLine.js'
import type { Channel } from '../channel.js'
import { DEFAULT_STATUS_LINE, type StatusLinePrefs } from '../statusLinePrefs.js'
import {
  formatContextUsage,
  renderTpsGauge,
  renderTpsSparkline,
  speedColor,
} from './StatusMetrics.js'

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
export function StatusLine({
  channel,
  selectionActive = false,
  helpOpen = false,
  segments = DEFAULT_STATUS_LINE,
}: {
  channel: Channel
  selectionActive?: boolean
  helpOpen?: boolean
  segments?: StatusLinePrefs
}) {
  const usage = channel.lastUsage
  const contextParts: React.ReactNode[] = []
  if (segments.effort && channel.reasoningEffort !== undefined) {
    contextParts.push(
      <Text key="effort" color="inactiveShimmer">
        {channel.reasoningEffort}
      </Text>,
    )
  }
  if (segments.cache && usage !== undefined && usage.cacheRead > 0) {
    // Cache hit rate of the context fed to the model (read / total), one
    // decimal — the absolute read count lives in the context bar's system
    // segment, the rate is the glanceable health signal.
    const total = usage.input + usage.cacheRead + usage.cacheWrite
    const rate = total > 0 ? (usage.cacheRead / total) * 100 : 0
    contextParts.push(
      <Text key="cache">
        <Text dimColor>cache </Text>
        <Text color="inactiveShimmer">{rate.toFixed(1)}%</Text>
      </Text>,
    )
  }
  // TPS readout sits right after the model so a crowded footer truncates
  // the trailing fields (tokens/think/cache), never the speedometer. One
  // number only: the live value (gauge while streaming, sparkline of past
  // turns once samples exist) — no μ/p95 clutter.
  const tpsParts: React.ReactNode[] = []
  if (segments.tps && channel.tps !== undefined) {
    if (channel.working && channel.tpsSamples.length === 0) {
      tpsParts.push(
        <Text key="tps">
          {renderTpsGauge(channel.tps, channel.tps)}{' '}
          <Text dimColor>{Math.round(channel.tps)} tps</Text>
        </Text>,
      )
    } else if (channel.tpsSamples.length > 0) {
      const peak = Math.max(...channel.tpsSamples.map(sample => sample.tps), channel.tps)
      tpsParts.push(
        <Text key="tps">
          {channel.working
            ? renderTpsGauge(channel.tps, peak)
            : renderTpsSparkline(channel.tpsSamples)}{' '}
          {speedColor(channel.tps, `${Math.round(channel.tps)}`)} tps
        </Text>,
      )
    } else {
      tpsParts.push(
        <Text key="tps" dimColor>
          {Math.round(channel.tps)} t/s
        </Text>,
      )
    }
  }

  const ctxText =
    segments.contextBar &&
    channel.contextBarEnabled &&
    channel.contextWindow !== undefined
      ? formatContextUsage(
          usage !== undefined
            ? usage.input + usage.cacheRead + usage.cacheWrite
            : channel.tokens.input,
          channel.contextWindow,
        )
      : ''

  // Left group: every field sits at soft white (inactiveShimmer) instead of
  // the previous uniform dim grey — readable against dark terminals.
  const leftParts = [
    ...(segments.model
      ? [
          <Text key="model" color="inactiveShimmer">
            {channel.model}
          </Text>,
        ]
      : []),
    ...(ctxText !== ''
      ? [
          <Text key="ctx" color="inactiveShimmer">
            {ctxText}
          </Text>,
        ]
      : []),
    ...tpsParts,
    ...contextParts,
    ...(segments.tokens
      ? [
          <Text key="tokens" color="inactiveShimmer">
            {formatTokens(channel.tokens.input)}→{formatTokens(channel.tokens.output)}
          </Text>,
        ]
      : []),
  ]

  // Right group: git branch in muted steel blue, cwd a soft white, the
  // session title dimmest (it truncates first anyway).
  const rightParts = [
    ...(segments.git && channel.gitBranch
      ? [
          <Text key="git" color="professionalBlue">
            {channel.gitBranch}
          </Text>,
        ]
      : []),
    ...(segments.cwd
      ? [
          <Text key="cwd" color="inactiveShimmer">
            {basename(channel.cwd)}
          </Text>,
        ]
      : []),
    ...(segments.title && channel.sessionTitle
      ? [
          <Text key="title" dimColor>
            {channel.sessionTitle}
          </Text>,
        ]
      : []),
  ]

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
          : ''
  const activity = channel.workingActivity
  const showActivity =
    !channel.working &&
    activity !== undefined &&
    activity.line !== '' &&
    activity.phase !== 'idle'

  return (
    <Box paddingX={2}>
      <Box flexDirection="column" width="100%">
        <Box flexDirection="row" gap={2}>
          <Box flexGrow={1} flexShrink={1}>
            <Text wrap="truncate">
              <Byline>{leftParts}</Byline>
            </Text>
          </Box>
          <Box flexShrink={1}>
            <Text wrap="truncate">
              <Byline>{rightParts}</Byline>
            </Text>
          </Box>
        </Box>
        {(showActivity || hint) && (
          <Box
            height={1}
            overflow="hidden"
            flexDirection="row"
            justifyContent="space-between"
            gap={2}
          >
            {showActivity && activity !== undefined ? (
              <ActivityLine
                activity={activity}
                activityFrames={channel.activityFrames}
                warnPct={contextPressurePct(usage, channel.contextWindow)}
                warnDanger={
                  (contextPressurePct(usage, channel.contextWindow) ?? 0) >= 95
                }
              />
            ) : hint ? (
              <Text color="inactiveShimmer">{hint}</Text>
            ) : null}
            {showActivity && hint ? (
              <Text color="inactiveShimmer" wrap="truncate">
                {hint}
              </Text>
            ) : null}
          </Box>
        )}
      </Box>
    </Box>
  )
}

function basename(path: string): string {
  const parts = path.split(/[\\/]/)
  return parts[parts.length - 1] ?? path
}
