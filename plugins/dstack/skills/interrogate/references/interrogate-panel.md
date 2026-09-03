# Interrogate panel contract

Interrogate is a bounded evidence review, not a request to spend every available model on every diff. The parent chooses the panel size from the change risk and records the served model for every lane.

## Risk budget

| Change shape | Default lanes | When to add a lane |
| --- | ---: | --- |
| One local owner, no external boundary | 1 | Only when the user explicitly asks for multi-model review. |
| Two or more modules or services | 2 | Add a third when contracts, replication, or persistence interact. |
| Security, saved data, monetization, consequential RNG, or networking | 3 | Add a fourth only when the blast radius is critical or the user asks. |
| Critical migration or irreversible release boundary | 4 | Stop at four; more reviewers add cost before signal. |

Use fewer lanes when the diff is smaller than the risk class suggests. Use more only when the extra model can see the same complete evidence and the parent can wait for it. Never let panel size become an automatic tax on a routine fix.

## Default model sources

Read `plugins/dstack/models.json` from the plugin root (or the installed equivalent) for the current recommendation. A configured user panel takes precedence when it is valid and observable.

- Claude Code: use the named `interrogate-haiku`, `interrogate-sonnet`, and `interrogate-opus` agents shipped by DStack. Their model aliases are deliberately portable; record the actual served identity when the client exposes it.
- Codex: request distinct advertised model overrides, normally `gpt-5.6-sol`, `gpt-5.6-terra`, and `gpt-5.6-luna`, with the declared reasoning effort. The active host may expose a different set.
- Other or older clients: use the client's configured model lanes if they are observable. Do not invent a provider, model, or effort value.

If only one model is available, a single-model review is still useful but is **not** multi-model evidence. State that limitation. If a requested model or effort is unavailable, follow the declared fallback (`skip`, `inherit`, or `fail-closed`) and show the dropout. Never silently substitute a weaker model, collapse all lanes to the parent, or claim that a lane ran when its identity is unverified.

## Dispatch invariants

Every lane receives the same filled reviewer prompt, the same diff or file set, the same intent, and the same rubric. Do not assign personas to manufacture disagreement. The diversity comes from independently served models and isolated context. Launch ready lanes together, retain handles, wait for all launched lanes, and keep each receipt separate.

Reviewers are read-only. They do not edit the repository, call external services, change model configuration, or use Roblox Studio MCP playtest controls. The parent reads every result, deduplicates findings, records disagreements, and makes the final Act on / Consider / Noted / Dismissed judgment. Interrogate never applies a finding automatically.

## Receipt fields

For each lane record: label, requested model, requested effort, served identity (observed or unverified), route, start/end, completion or dropout, finding count, and whether the lane saw the complete evidence. The summary must distinguish:

- **consensus**: the same concrete issue independently raised by at least two lanes;
- **lone finding**: raised by one lane and still evaluated on its evidence;
- **disagreement**: lanes explicitly reached opposite conclusions;
- **coverage gap**: a lane was skipped, failed, or could not inspect a required artifact.
