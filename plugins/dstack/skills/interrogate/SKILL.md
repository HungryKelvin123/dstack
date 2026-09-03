---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Independent read-only reviewers challenge risky Roblox changes through the same evidence and rubric."
---

# Interrogate

Interrogate is a bounded adversarial review. It does not implement fixes, does not auto-apply findings, and never uses Roblox Studio MCP playtest controls. Read [`../david-mode/references/agent-runtime.md`](../david-mode/references/agent-runtime.md), [`references/interrogate-panel.md`](references/interrogate-panel.md), and [`../../models.json`](../../models.json) before dispatching reviewers.

The current DStack version does not assume that the parent model is different from a reviewer. Model diversity is real only when the client serves distinct, observable model identities. If every lane inherits one model, report a single-model review rather than calling it multi-model evidence.

## Step 1, Determine scope and risk

Identify the exact diff or files to review:

- a pointed diff or file set from the user's request;
- `git diff <base>...HEAD` for a branch changeset;
- the relevant recent files when the user references work just completed.

Read the smallest surrounding contracts needed to trace behavior: Roblox repository instructions, typed Luau interfaces, remotes, persistence schemas, authored instance rules, and local verification scripts. Do not pull unrelated history or raw logs into every reviewer prompt.

Classify the review before choosing a panel:

- **local**: one clear owner and no external boundary — one reviewer;
- **cross-module**: two or more modules/services or a replication contract — two reviewers;
- **high-risk**: security, saved data, monetization, consequential RNG, networking, or a lifecycle boundary — three reviewers;
- **critical**: an irreversible migration, release boundary, or explicitly requested maximum review — four reviewers, never more.

Use fewer lanes when the diff is smaller than the risk class suggests. The panel is a cost budget, not a badge. Add a lane only when it can see the complete evidence and the parent can wait for it.

## Step 2, State the intent

Write one paragraph describing what the change is intended to accomplish. Derive it from the user's request, repository decisions, commit/PR context, and the implementation. Review execution against the intent; do not redesign the product because a reviewer prefers a different goal. Ask the user only if the intent is genuinely unresolved.

## Step 3, Resolve real model lanes

Read the installed model configuration when present. Use the first valid source below:

1. a user-configured `interrogate reviewers` list;
2. Claude's shipped `interrogate-haiku`, `interrogate-sonnet`, and `interrogate-opus` agent profiles;
3. Codex's advertised `gpt-5.6-sol`, `gpt-5.6-terra`, and `gpt-5.6-luna` model overrides from `models.json`;
4. one generic read-only reviewer inheriting the parent, explicitly labeled single-model.

For every selected lane, validate the profile/model and requested effort before dispatch. Keep `model` and `reasoning_effort` (or Claude's `effort`) separate. A model name in a configuration file is not availability proof. If the client cannot serve a requested pair, follow its declared `skip`, `inherit`, or `fail-closed` policy and record the dropout. Never silently replace it with a weaker model, silently reduce the requested panel, or claim an unverified served identity.

The reviewers are independent model lanes, not invented personas. Give every lane the same intent, complete diff/file set, repository constraints, and rubric. Do not show one reviewer's findings to another before collection.

Launch all ready lanes in one dispatch wave using the active client's supported subagent surface. Codex uses `spawn_agent` with explicit model and reasoning values when available; Claude uses the named read-only agent profiles. If isolation is required, reviewers may read a shared checkout but may not write it. Retain each handle and wait for every launched lane before judging.

## Step 4, Fill the reviewer prompt

Read [`references/reviewer-prompt.md`](references/reviewer-prompt.md), [`references/rubric.md`](references/rubric.md), and [`references/code-quality-review.md`](references/code-quality-review.md). Fill one identical prompt for every lane with:

1. the intent paragraph;
2. the diff or complete file contents and only the surrounding evidence needed;
3. the rubric and code-quality lens;
4. the Roblox engineering contract, including server authority, replication, persistence, mobile performance, and the Studio MCP no-playtest boundary.

Require each reviewer to return concrete findings with severity, location, reasoning, and an optional fix. A reviewer that returns no findings is a valid result. Reviewers must not edit files, run destructive commands, call external systems, change model configuration, or launch, start, stop, simulate, or control a Roblox Studio playtest.

## Step 5, Collect receipts and synthesize

For each lane record its label, requested model and effort, route, served identity (observed or unverified), start/end, completion or dropout, finding count, and whether it saw complete evidence. Then:

1. parse every result, including explicit `no findings`;
2. deduplicate concrete issues and list all lanes that raised each one;
3. mark consensus only when at least two independent lanes raised the same issue;
4. keep lone findings visible and evaluate them on their evidence;
5. record explicit disagreements and every coverage gap.

Read [`references/lead-judgment.md`](references/lead-judgment.md). As lead reviewer, categorize each finding as **Act on**, **Consider**, **Noted**, or **Dismissed**, with the lane(s) and one-line rationale. Do not average votes: correctness, security, data integrity, and reachable failure paths outweigh popularity.

## Output format

### Intent
> [The stated intent paragraph]

### Reviewers
- Reviewer [label]: [requested model], served [observed or unverified], [N findings], [complete evidence or gap]

### Act On
[Concrete blockers, with evidence and lanes]

### Consider
[Legitimate tradeoffs, with evidence and lanes]

### Noted
[Valid but low-priority observations]

### Dismissed
[Rejected findings and why]

### Agreement Map
[Consensus, lone findings, disagreements, skipped lanes, and what the coverage means]

### Verification boundary
[Checks performed locally and the exact Roblox Studio checks the user must perform. State that DStack did not use Studio MCP playtest controls.]
