# Roblox engineering contract

Use repository instructions as the first authority. Read the project's design and architecture documents when they exist, then inspect the relevant source before describing implemented behavior. Use Roblox Studio context only when the repository cannot answer a necessary question.

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
- Roblox Studio MCP is context-only. Never invoke its playtesting controls or start, stop, or control a test session. The user performs Studio playtesting.
- Use the repository's own checks. For Rojo projects, `rojo build` proves project assembly and serialization, not Luau compilation or runtime behavior. Run narrower automated tests when they exist. Report the exact Studio behavior the user still needs to verify.
