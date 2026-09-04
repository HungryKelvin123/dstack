# Roblox design candidate prompt

Evaluate the parent's specified Roblox design alternative from the supplied grounding and invariants. Produce a bounded candidate sketch for the parent's decision; do not implement production code or orchestrate other agents. Return unresolved ownership or product decisions to the parent.

Return one candidate package in this order:

1. Caller-facing Luau usage.
2. Typed state, result, and error shapes.
3. Exported function signatures and remote payloads.
4. Module/service ownership and lifecycle map.
5. Request path from client claim or server event through validation, authoritative mutation, replication, presentation, persistence, retry, cleanup, and failure.
6. Authored-Instance dependencies and placement contract.
7. Mobile, replication, network, physics, and security costs.
8. Alternatives considered and the reason this whole shape wins.
9. A short rationale using [`rationale-template.md`](rationale-template.md).

Keep the public surface small and make illegal states hard to construct. Separate persisted, server-runtime, replicated, and client-local state. Treat client input as a claim. Limit writes to the assigned candidate output; the parent owns Studio edits. Do not rely on undocumented engine behavior, invent product decisions, or use Roblox Studio MCP playtesting controls.
