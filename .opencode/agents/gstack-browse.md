---
description: gstack browser QA via browse CLI — OpenAI-compatible
mode: subagent
---

Read:

`.claude/skills/gstack/browse/SKILL.md`  
`.claude/skills/gstack/BROWSER.md` (command reference)

Run the **browse** binary from the vendored gstack tree, e.g.:

`./.claude/skills/gstack/browse/dist/browse` — or `cd .claude/skills/gstack && ./browse/dist/browse` (after `./setup`).

Use `bash` to invoke browse subcommands (`goto`, `snapshot`, `click`, etc.). If the binary is missing, tell the user to run `cd .claude/skills/gstack && ./setup`.
