# Interrogate panel contract

The parent chooses the review budget from [`../../../models.json`](../../../models.json), dispatches independent workers under the shared runtime contract, and judges every finding against the actual code. Record the served model when observable.

## Risk budget

Use `riskPolicy` for the reviewer count and `delegation` for concurrent capacity. Classify by the strongest boundary the change affects:

- `local`: one owner with no external contract.
- `crossModule`: multiple modules or services, or a shared interface.
- `securityDataMonetization`: authority, saved data, purchases, consequential RNG, networking, or lifecycle behavior.
- `critical`: an irreversible migration, release boundary, or an explicitly requested maximum review.

The count is a ceiling for useful reviews, not a minimum charge. Queue any reviews beyond concurrent capacity. A narrow change can use fewer reviewers; broad risk does not justify unrelated searches or duplicate raw logs.

## Dispatch and judgment

All reviewers use the exact configured worker model and effort. Each receives the same filled reviewer prompt, intent, evidence, and rubric in an independent context. This is a single-model reviewer panel. Do not manufacture diversity with different model labels or claim multi-model coverage because several workers ran.

Reviewers are read-only leaves. They do not edit the repository, call external services, change model configuration, delegate, or use Roblox Studio MCP playtest controls. The parent reads all results, verifies the cited failure paths, resolves disagreements, and makes the Act on / Consider / Noted / Dismissed judgment. Interrogate never applies a finding automatically.

If the exact worker pair cannot run, use a parent-only review and identify the coverage gap. Do not fill an unavailable reviewer slot by launching a different model. Report incomplete reviews as incomplete.

## Receipt fields

Record each reviewer's label, requested model and effort, served identity as observed or unverified, route, completion or dropout, finding count, and whether it saw the complete evidence. Keep these distinctions:

- **agreement**: the same concrete issue raised by independent reviewers, with shared-model bias still possible;
- **lone finding**: one reviewer's issue evaluated on its evidence;
- **disagreement**: opposing conclusions requiring parent investigation;
- **coverage gap**: a skipped or failed review, or an artifact the reviewer could not inspect.
