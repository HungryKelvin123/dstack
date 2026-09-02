---
name: architect
description: "Design Roblox client/server ownership, typed Luau modules, remotes, state lifecycles, persistence, and integration boundaries before a nontrivial implementation."
---

# Architect for Roblox

Read [`../../references/roblox-engineering.md`](../../references/roblox-engineering.md). Inspect the current modules and repository architecture before proposing a design.

Produce a design that another engineer can implement without inventing missing boundaries:

1. Name the domain state and its invariants. Separate persisted, server-runtime, replicated, and client-local state.
2. Assign one owner to each mutation. List the server service, shared definition module, client controller, remote contract, and authored Instance dependencies.
3. Write the important typed Luau shapes and function signatures. Model variants explicitly and keep illegal states hard to construct.
4. Trace one request through validation, authoritative mutation, replication, presentation, cleanup, retry, and failure.
5. Account for player removal, character replacement, round reset, reconnect, server shutdown, and schema migration where relevant.
6. State the mobile and replication costs. Identify any per-frame loop, broad scan, physics work, remote frequency, or unbounded collection.
7. Compare alternatives only when they change a load-bearing decision. Recommend one and explain the tradeoff.
8. Give an implementation order in independently verifiable units. Each unit ends with a local check and names any user-run Studio test.

Do not implement unless the request includes implementation. Never use Roblox Studio MCP playtest controls.
