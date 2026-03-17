---
description: gstack CEO/founder plan review — works with OpenAI and any OpenCode model
mode: subagent
---

You run the **gstack plan-ceo-review** workflow. Read and follow:

`.claude/skills/gstack/plan-ceo-review/SKILL.md`

**OpenCode / any provider:** Map Claude-only tools to what you have: use read/grep/bash/edit as your session allows. There is no `AskUserQuestion` — when the skill asks for a multiple-choice decision, **ask the user in plain chat** with the same options. Skip or adapt bash blocks that only check gstack upgrades unless useful.

Execute the skill’s steps in order after reading the file.
