# @sqhh99/dsh-tui

简体中文 | [English](README_EN.md)

DeepSeek Harness 的终端界面插件：从 `session/event` 投影对话，斜杠命令走本地菜单和 `ctx.commands`，工具卡使用 `presentCall` / `presentResult`。Agent、模型、工具和持久化仍由官方 `dsh` 拥有。

## 安装

需要 Node.js `^22.19 || >=24`、官方 [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh)、pnpm 10+，以及 `DEEPSEEK_API_KEY`。

```sh
npm install -g @deepseek-ai/dsh @sqhh99/dsh-tui
dsh-tui
```

首次运行会执行 `dsh plugin --profile dsh-tui add @sqhh99/dsh-tui@<version>`。也可以手工：

```sh
dsh plugin --profile dsh-tui add @sqhh99/dsh-tui
dsh --profile dsh-tui
```

从 Git 安装（源码，需允许 `prepare` 编译）：

```sh
dsh plugin --profile dsh-tui add github:Sqhh99/dsh-tui
```

pnpm ≥10 第一次会因 `allowBuilds` 失败。把提示的包名写进 `~/.dsh/profiles/dsh-tui/pnpm-workspace.yaml` 后再跑一次。

`dsh-tui --resume` 读取 `~/.dsh-tui/resume.txt`（没有则读 `~/.dsh-cc/resume.txt`）。

## 叠层

```text
dsh-base
  → @sqhh99/dsh-tui cordis.patch.yml
  → profile / home cordis.patch.yml
  → session/event → Channel → React + Ink → 终端
```

Host 上的模型工具行被关掉，改由 agent preset（`standard` / `code` / `minimal` / `cordis`）按会话组装。

## 常用键

| 键 | 作用 |
|---|---|
| Enter | 发送（Shift+Enter 换行） |
| Ctrl+C | 中断回合；空闲连按两次退出 |
| Esc | 关菜单；空输入双击 = 时间回溯 |
| Ctrl+O | 展开/收起思考与工具详情 |
| / | 斜杠命令 |

完整键位与命令见 [docs/interaction.md](docs/interaction.md)。

## 配置

偏好写在 `~/.dsh-tui/`（theme、model、preset、lang、resume.txt）。仍会读旧的 `~/.dsh-cc/`，只往新目录写。

环境变量优先用 `DSH_TUI_*`（`DSH_TUI_LANG`、`DSH_TUI_THEME`、`DSH_TUI_PRESET`、`DSH_TUI_RESUME_SESSION`、`DSH_TUI_DEBUG`）。`CC_TUI_*` / `DSH_CC_*` 仍可作为回退。

发布到 npm 需要仓库 Secrets 里的 `NPM_TOKEN`，以及已创建的 `@sqhh99` npm scope。没有 scope 时用 Git 安装即可。

## 开发

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

CI 还会跑若干无头 `scripts/repro-*` / `verify-*`。不要向活动 TUI 的 stdout 打日志。

## 许可

MIT。运行时大量复用了 [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) 的终端实现（Copyright chimney / ccch1mneyyy），见 [LICENSE](LICENSE)。
