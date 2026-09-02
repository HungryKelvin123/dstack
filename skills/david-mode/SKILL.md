---
name: david-mode
description: "Roblox engineering workflow router with architecture, security, performance, review, and verification discipline. Invoke explicitly with $david-mode."
---

# David Mode

`$david-mode` must be the first non-whitespace token in the prompt. The trusted hook may keep it active for the current session. `disable $david-mode` clears that session state. If the hook receipt is absent or stale, apply David Mode for the current turn and report that sticky mode is unavailable.

Read [`../../references/roblox-engineering.md`](../../references/roblox-engineering.md) before acting. Repository instructions override generic DStack conventions.

## Studio preflight

On the turn that explicitly activates David Mode, check Studio once before choosing a playbook:

1. If `list_roblox_studios` is available, call it once. Keep the matching Studio name and `studio_id` for later context-only inspection.
2. If the tool is unavailable, fails, or returns no connected Studio, report `Roblox Studio MCP is unavailable; continuing with repository-only context.` Continue when the repository can answer the task. Do not retry during the same turn.
3. If several Studios are connected, match by the repository or place name. Ask the user which Studio to use only when later inspection is necessary and the target remains ambiguous.
4. Before changing code whose correctness depends on an unresolved Studio-only fact, stop and ask the user to open the target Studio and its MCP connection. Never guess that fact.

Sticky turns reuse the result. Repeat the preflight only after a context-only Studio call fails or the user says the connection changed. The preflight checks connectivity only; it never starts, stops, or controls a playtest.

## Route the work

Choose the narrowest playbook and read it before writing the task plan.

- Read-only behavior or design question: `playbooks/investigation.md`, plus `$how` for runtime structure or `$why` for rationale.
- Reported defect: `playbooks/bug-fix.md` and `$principle-fix-root-causes`.
- New or changed behavior: `playbooks/feature.md` and `$architect` when ownership, state, remotes, persistence, or more than one module boundary changes.
- Behavior-preserving change: `playbooks/refactoring.md`.
- Measured performance problem: `playbooks/perf-issue.md` and `$roblox-performance`.
- Security, remotes, purchases, rewards, data, or consequential RNG: `$roblox-security`.
- Luau implementation or review: `$luau-best-practices`.
- Risk review: `$blast-radius`. Use `$interrogate` only for a contested or high-risk design.
- Explicit TDD or a cheap pure-logic regression target: `$tdd`.
- Long or multi-phase work: `playbooks/multi-phase-plan.md` and `$show-me-your-work`.

Use at most two principle skills unless the task genuinely spans more independent concerns. Read each selected principle in full and state only the decisions it changed.

## Execution rules

- Inspect the actual source and repository guidance before deciding how the game works.
- Prefer the smallest change that fixes the root cause and fits the existing architecture.
- Name the authoritative state shape, its owner, lifecycle, replication path, and persistence boundary before adding stateful behavior.
- Resolve observable facts through source, existing tests, local probes, or context-only Studio inspection. Ask the user only for unresolved gameplay, UX, monetization, progression, data, or architectural decisions.
- Delegate only when the user requests parallel agents or the active runtime permits it and the work has safe, independent boundaries. Routine reading, editing, and checks stay local.
- Preserve unrelated changes. Use the repository's required verification. Never use Roblox Studio MCP playtest controls.
- Apply `$unslop` to every reply and agent-facing document.

## Completion

Done means the requested behavior or answer is complete, the relevant local checks pass, the diff is reviewed, and any Studio-only validation is handed to the user as a concrete test. Lead the reply with the outcome. Include changed files, checks, remaining risks, and the exact user playtest when one remains.
