# Claude Code — opencode

Repo-wide agent guidance lives in **AGENTS.md** (style, typecheck, SDK regen). Read it for implementation work.

## Regular editing (always on)

**Changing this codebase:** Use normal tools — edit/write/patch/search_replace on repo files. That is the default for every task unless the user explicitly asked for read-only review (`/qa-only`, `/review` as report-only, or plan-mode style “don’t implement yet”).

**gstack is additive:** `/browse` is only for **URLs** (live sites, staging). It is **not** how you modify source in git. Slash commands like `/plan-ceo-review` are optional workflows; they do **not** disable file edits afterward.

**OpenCode TUI:** If edits are blocked, you are likely in **Plan** mode — switch to **Build** to apply changes.

## Two-way: your editor ↔ OpenCode

Treat it as **one workspace, two surfaces** — not “IDE for long coding” vs “OpenCode only for chat.”

- **Same files on disk:** Whatever you save in Cursor/VS Code/Zed and whatever the agent writes in OpenCode (TUI/web) are the same tree. There is no separate copy to sync by hand.
- **Either direction anytime:** Type for an hour in the IDE, then jump to OpenCode for a review or a patch; or drive changes from OpenCode and keep refining in the IDE. Switch back and forth as often as you want.
- **Keep context honest:** If the user edited files outside the session since the last message, **re-read** those paths (or ask what changed) before overwriting. If you’re about to edit a file they may have open, a short heads-up in chat helps avoid surprise overwrites.
- **Web / desktop UI:** Open a file tab → **Edit in app** for a built-in text editor and **Save** (writes to disk, same as an external editor). Syntax-highlighted view stays read-only until you switch to edit mode. Binary files cannot be edited in-app.

## gstack ([likhithkumar98/gstack](https://github.com/likhithkumar98/gstack))

Vendored at `.claude/skills/gstack`.

**View / edit in your IDE:** Open `.claude/skills/gstack/<skill>/SKILL.md` (full workflow text). OpenCode entrypoints: `.opencode/agents/gstack-*.md`. No special UI required — same as any markdown file.

### When `/…` commands work (and when they don’t)

| Environment | Slash commands like `/browse`, `/qa` |
|-------------|--------------------------------------|
| **Claude Code** | Yes — **if** you ran `cd .claude/skills/gstack && ./setup` so symlinks exist under `.claude/skills/` and Claude discovers the skills. |
| **Cursor / Copilot Chat** | **No** slash menu. Use natural language or point at `SKILL.md` files. |
| **OpenCode (this repo)** | **Yes — `@` subagents** under `.opencode/agents/gstack-*.md`. They load the same gstack `SKILL.md` playbooks and work with **OpenAI, Anthropic, or any** session model (whatever you pick in OpenCode). Type `@gstack-` to see them. |
| **`/browse` specifically** | Needs the gstack **browse binary** (`./setup` builds it). In OpenCode use **`@gstack-browse`** or run `.claude/skills/gstack/browse/dist/browse` in the terminal. |

**OpenCode + OpenAI:** Connect OpenAI in OpenCode, choose e.g. GPT‑4o / GPT‑5.x for the session, then **`@gstack-plan-ceo-review`**, **`@gstack-qa`**, etc. Each agent tells the model to read the matching skill under `.claude/skills/gstack/`. Optional: pin a default model per agent in `opencode.json`:

```json
"agent": {
  "gstack-review": { "model": "openai/gpt-4o" }
}
```

(Use the exact model id OpenCode shows in your provider list.)

Slash commands (Claude Code only, after setup):

| Command | Role |
|--------|------|
| `/plan-ceo-review` | Product / founder lens — “what should we actually build?” |
| `/plan-eng-review` | Architecture, diagrams, edge cases, tests |
| `/review` | Production-risk pass (Greptile-aware if installed) |
| `/ship` | Ready branch only: sync, tests, PR — not for deciding scope |
| `/browse` | **All** web browsing, screenshots, flows |
| `/qa` | Diff-aware QA + fixes; `--quick` smoke; or URL + tier |
| `/qa-only` | Same methodology as `/qa`, report-only (no code changes) |
| `/setup-browser-cookies` | Auth sessions for headless browser |
| `/retro` | Weekly retro; snapshots under `.context/retros/` |
| `/gstack-upgrade` | Pull newer gstack |

**Browsing:** Use **gstack `/browse`** only. Do **not** use `mcp__claude-in-chrome__*` here. Browse CLI reference: `.claude/skills/gstack/BROWSER.md`.

**Security:** `/browse` keeps a real Chromium session (cookies, localStorage). Avoid pointed-at sensitive prod unless intentional; session idles out after ~30m.

**If skills or `/browse` fail:** `cd .claude/skills/gstack && ./setup`

**Branch for diffs:** Default is **`dev`** (local `main` may be missing). For `/qa` diff mode use `dev` / `origin/dev` as baseline.

### This monorepo

- **Core / TUI:** `packages/opencode` — run `bun dev` from root (see CONTRIBUTING.md).
- **Web UI:** often `bun run --cwd packages/app dev` with API already up.
- **Desktop:** `packages/desktop` (Tauri). **Console / lander:** `packages/console`, `packages/web`.
- Point `/browse` and `/qa` at whatever is actually running (e.g. local web port, staging). Grep changed packages from the diff to guess URLs/routes.

### Upgrading gstack

`/gstack-upgrade` or re-sync from [likhithkumar98/gstack](https://github.com/likhithkumar98/gstack), then `./setup` in `.claude/skills/gstack`.
