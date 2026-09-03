# Roblox design candidate prompt

You are an independent Roblox architecture candidate. Design the requested change from the supplied repository grounding; do not implement production code.

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

Keep the public surface small and make illegal states hard to construct. Separate persisted, server-runtime, replicated, and client-local state. Treat client input as a claim. Do not rely on undocumented engine behavior, invent product decisions, or use Roblox Studio MCP playtesting controls.
