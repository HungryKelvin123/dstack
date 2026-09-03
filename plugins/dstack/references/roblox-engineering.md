# Roblox engineering contract

Use repository instructions as the first authority. Read the project's design and architecture documents when they exist, then inspect the relevant source before describing implemented behavior. Use Roblox Studio context only when the repository cannot answer a necessary question.

## API freshness

Keep stable engineering invariants in DStack; treat exact engine signatures, enum values, quotas, service behavior, marketplace policy, and tool availability as time-sensitive. Before relying on one that the repository or current source does not establish, verify it in the current official Roblox Creator Hub or engine API reference. Do not preserve numeric limits in a skill unless that limit is the subject of the task. Report a conflict between current Roblox documentation and project code instead of silently choosing one.

## Runtime boundaries

- The server owns currencies, inventory, progression, combat results, purchases, saved data, consequential RNG, permissions, and anti-abuse decisions.
- The client owns input, presentation, local prediction, camera, animation, and cosmetic effects. Client requests are claims, not facts.
- Validate remote payload type, range, ownership, permissions, rate, and current state at the server boundary. Return authoritative state instead of trusting a client-computed result.
- Put shared definitions in replicated containers only when clients need them. Keep secrets, authoritative algorithms, and server-only state outside replication.
- Define ownership and cleanup for every task, connection, instance, and cache. Player departure, character replacement, round reset, and server shutdown are normal lifecycle events.

## Persistence and randomness

- Make writes idempotent and retry-safe. Prefer atomic update patterns, versioned schemas, explicit migrations, session ownership, and failure behavior that preserves player data.
- Generate consequential random outcomes on the server. Persist or commit the outcome before exposing it when retries, purchases, or reconnects could duplicate or reroll it.
- Treat monetization, rewards, progression pacing, and data migrations as product decisions when the repository has not already decided them.

## Performance

- Design for mobile hardware and Roblox replication limits. Measure before optimizing.
- Scrutinize per-frame work, broad instance scans, unbounded tables, duplicate connections, repeated allocations, remote chatter, physics ownership, pathfinding frequency, particle counts, and replicated instance volume.
- Prefer event-driven updates, bounded work, spatial filtering, caching with explicit invalidation, pooling only when measured, and client-side cosmetic work that cannot affect authority.

## Authoring and verification

- Preserve pivots, roots, attachments, tags, attributes, collision groups, streaming behavior, and clone/storage contracts when editing authored models.
- When a Roblox Studio MCP call reports a missing or unconfigured server/tool, read [`roblox-mcp-setup.md`](roblox-mcp-setup.md) and apply its stop-and-ask installation gate. Do not classify an empty Studio connection list as an installation failure.
- Use the Studio execution mode that matches the available source path:
  - **Repository mode (preferred):** when a local source repository and its Rojo/project sync to the target Studio are available, edit the repository and use Studio MCP only for missing context. The repository remains authoritative.
  - **Studio fallback mode:** when Rojo/project sync is unavailable, or no local repository is both present and connected to the target Studio, use all non-playtest MCP operations the server exposes within the user's requested scope. This may include inspecting and editing scripts, Instances, properties, hierarchy, attributes, tags, attachments, and authored assets. Inspect before mutating, keep writes narrow, and report exact Studio paths and operations.
  - **Ambiguous mode:** when the target Studio or repository connection is unclear, do not guess. Ask the user before writing.
- Full MCP fallback does not override the user's authority, destructive-write safeguards, or external-write checks. It never invokes its playtesting controls, and excludes starting, stopping, launching, simulating, or controlling any playtest. The user performs Studio playtesting.
- Use the repository's own checks in Repository mode. For Rojo projects, `rojo build` proves project assembly and serialization, not Luau compilation or runtime behavior. In Studio fallback mode, report that repository tests, Rojo assembly, source diffs, and commits do not prove the Studio edit unless the user exports or syncs it afterward. Report the exact Studio behavior the user still needs to verify.
