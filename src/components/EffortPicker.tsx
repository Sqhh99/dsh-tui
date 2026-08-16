import React from 'react'
import { t } from '../i18n.js'
import { Box, Text } from '../ui.js'
import { Pane } from './design-system/Pane.js'
import { Select, type SelectOption } from './Select.js'
import { Byline } from './design-system/Byline.js'
import { KeyboardShortcutHint } from './design-system/KeyboardShortcutHint.js'

/** One reasoning tier as the adapter declares it. */
export type EffortOption = { id: string; name: string; description?: string }

/**
 * `/effort` reasoning-tier picker, in the ThemePicker shape: a
 * permission-colored Pane, the adapter's own tiers as Select rows in the
 * adapter's own display order, and the Enter/Esc hint line. The tier that
 * applies when nothing is pinned is marked so the list is readable before
 * the first request reports a live value.
 */
export function EffortPicker({
  efforts,
  focusIndex,
  currentEffort,
  defaultEffort,
}: {
  efforts: readonly EffortOption[]
  focusIndex: number
  /** The pinned tier, when one is in effect (shows the ✓). */
  currentEffort: string | undefined
  /** The adapter's fallback tier, annotated on its row. */
  defaultEffort: string | undefined
}): React.ReactNode {
  const options: SelectOption[] = efforts.map(effort => ({
    value: effort.id,
    label: effort.id === defaultEffort ? `${effort.name} ${t('effort-default-suffix')}` : effort.name,
    ...effort.description !== undefined ? { description: effort.description } : {},
  }))

  return (
    <Pane color="permission">
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color="remember" bold>
            {t('effort-title')}
          </Text>
        </Box>
        <Select
          options={options}
          focusIndex={focusIndex}
          // Nothing pinned yet = the adapter's default is what is running.
          selectedValue={currentEffort ?? defaultEffort}
        />
      </Box>
      <Text dimColor italic>
        <Byline>
          <KeyboardShortcutHint shortcut="Enter" action="confirm" bold />
          <KeyboardShortcutHint shortcut="Esc" action="exit" />
        </Byline>
      </Text>
    </Pane>
  )
}
