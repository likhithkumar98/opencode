# Claude Code — opencode

Repo-wide agent guidance lives in **AGENTS.md** (style, typecheck, SDK regen). Read it for implementation work.

## gstack ([likhithkumar98/gstack](https://github.com/likhithkumar98/gstack))

Vendored at `.claude/skills/gstack`. Slash commands:

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
