#!/bin/sh
# Install @sqhh99/dsh-tui into a dsh profile.
# Requires official `dsh` and pnpm 10+.
set -eu

if ! command -v dsh >/dev/null 2>&1; then
  echo "dsh CLI not found. Install the official client:" >&2
  echo "  npm install -g @deepseek-ai/dsh" >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found. dsh plugin forwards installs to pnpm:" >&2
  echo "  npm install -g pnpm" >&2
  exit 1
fi

dsh plugin --profile dsh-tui add @sqhh99/dsh-tui
echo
echo "Installed. Start with:  dsh-tui"
echo "or:                     dsh --profile dsh-tui"
echo
echo "Do not add dsh-working-activity as its own bundle — this package"
echo "already mounts it via ./working-activity. Override publishIntervalMs"
echo "in \$DSH_HOME/profiles/dsh-tui/cordis.patch.yml if needed."
