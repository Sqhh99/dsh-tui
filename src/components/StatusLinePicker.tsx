import React from 'react'
import { Box, Text } from '../ui.js'
import { t } from '../i18n.js'
import { Pane } from './design-system/Pane.js'
import { ListItem } from './design-system/ListItem.js'
import { Byline } from './design-system/Byline.js'
import { KeyboardShortcutHint } from './design-system/KeyboardShortcutHint.js'
import { STATUS_SEGMENTS, type StatusLinePrefs, type StatusSegment } from '../statusLinePrefs.js'

/** i18n key for each segment's row label. */
const LABEL_KEY: Record<StatusSegment, `statusline-segment-${StatusSegment}`> = {
  contextBar: 'statusline-segment-contextBar',
  model: 'statusline-segment-model',
  tps: 'statusline-segment-tps',
  effort: 'statusline-segment-effort',
  cache: 'statusline-segment-cache',
  tokens: 'statusline-segment-tokens',
  git: 'statusline-segment-git',
  cwd: 'statusline-segment-cwd',
  title: 'statusline-segment-title',
  hint: 'statusline-segment-hint',
}

/**
 * `/statusline` segment editor, in the same Pane + ListItem style as the other
 * pickers. Unlike them this is a multi-toggle, so `isSelected` (the ✓) means
 * "this segment is on" rather than "this is the one chosen value" — the
 * ModelPicker's direct ListItem mapping rather than the single-choice Select.
 *
 * The footer below re-renders from the same draft, so toggling previews live.
 */
export function StatusLinePicker({
  draft,
  focusIndex,
}: {
  draft: StatusLinePrefs
  focusIndex: number
}): React.ReactNode {
  return (
    <Pane color="permission">
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color="remember" bold>
            {t('statusline-title')}
          </Text>
        </Box>
        {STATUS_SEGMENTS.map((segment, index) => (
          <ListItem
            key={segment}
            isFocused={index === focusIndex}
            isSelected={draft[segment]}
          >
            {t(LABEL_KEY[segment])}
          </ListItem>
        ))}
      </Box>
      <Text dimColor italic>
        <Byline>
          <KeyboardShortcutHint shortcut="Space" action={t('statusline-hint-toggle')} bold />
          <KeyboardShortcutHint shortcut="Enter" action={t('statusline-hint-save')} />
          <KeyboardShortcutHint shortcut="Esc" action={t('statusline-hint-cancel')} />
        </Byline>
      </Text>
    </Pane>
  )
}
