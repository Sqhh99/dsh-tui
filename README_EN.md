# @sqhh99/dsh-tui

[简体中文](README.md) | English

A terminal UI plugin for DeepSeek Harness. It projects `session/event` into a transcript, merges local slash commands with `ctx.commands`, and renders tool cards from `presentCall` / `presentResult`. The official `dsh` process still owns the agent, model, tools, and persistence.

## Install

Requires Node.js `^22.19 || >=24`, official [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh), pnpm 10+, and `DEEPSEEK_API_KEY`.

```sh
npm install -g @deepseek-ai/dsh @sqhh99/dsh-tui
dsh-tui
```

The first run runs `dsh plugin --profile dsh-tui add @sqhh99/dsh-tui@<version>`. Manual equivalent:

```sh
dsh plugin --profile dsh-tui add @sqhh99/dsh-tui
dsh --profile dsh-tui
```

Git install (sources; allow `prepare` to compile):

```sh
dsh plugin --profile dsh-tui add github:Sqhh99/dsh-tui
```

pnpm ≥10 blocks that build until you add the printed key under `allowBuilds` in `~/.dsh/profiles/dsh-tui/pnpm-workspace.yaml`.

The splash draws the whale from `docs/assets/deepseek.png` as a solid half-block silhouette — braille samples finer but leaves gaps around each dot, so a filled shape comes out as a mesh — beside a two-line `DEEPSEEK` / `HARNESS` wordmark justified to one right edge and ramped through the theme's brand blues. The package version sits on the model line, and narrow terminals drop the whale. Set `DSH_TUI_LOGO_GLYPHS=braille|sextant|half` to change the glyph set.

`dsh-tui --resume` reads `~/.dsh-tui/resume.txt`, then `~/.dsh-cc/resume.txt`.

## Layers

```text
dsh-base
  → @sqhh99/dsh-tui cordis.patch.yml
  → profile / home cordis.patch.yml
  → session/event → Channel → React + Ink → terminal
```

Host model-facing tool rows are disabled. Agent presets (`standard` / `code` / `minimal` / `cordis`) compose each session.

## Keys

| Key | Action |
|---|---|
| Enter | Send (Shift+Enter newline) |
| Ctrl+C | Interrupt; twice while idle exits |
| Esc | Close menus; double-tap on empty input rewinds |
| Ctrl+O | Expand or collapse thinking and tool detail |
| / | Slash commands |

See [docs/interaction.en.md](docs/interaction.en.md) for the full table.

## Config

Prefs live in `~/.dsh-tui/`. Legacy `~/.dsh-cc/` is read-only fallback. Prefer `DSH_TUI_*` environment names; `CC_TUI_*` / `DSH_CC_*` still work.

Publishing to npm needs an `NPM_TOKEN` repository secret and the `@sqhh99` npm scope. Git install works without either.

## Develop

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

## License

MIT. Terminal runtime is adapted from [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) (Copyright chimney / ccch1mneyyy). See [LICENSE](LICENSE).
