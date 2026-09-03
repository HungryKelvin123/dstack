# Roblox design red flags

Screen a candidate for these failure patterns:

- **Shallow module:** a wrapper adds a file or method but hides no decision, invariant, or lifecycle.
- **Information leakage:** callers must know storage layout, remote wire details, Instance paths, or internal state to use the module.
- **Temporal decomposition:** callers must invoke methods in a fragile order because the owner does not control readiness, cleanup, retry, or reset.
- **Pass-through API:** a service forwards nearly every argument to another service, exposing the wrong boundary.
- **Authority leak:** the client supplies a reward, price, inventory result, permission, hit result, RNG outcome, or other fact the server should derive or validate.
- **State conflation:** persisted, server-runtime, replicated, and client-local values share one mutable shape without an explicit projection.
- **Lifecycle hole:** player removal, character replacement, round reset, reconnect, shutdown, or failed purchase leaves work, connections, instances, or locks alive.
- **Unbounded cost:** per-frame scans, remote chatter, allocations, physics work, replicated Instances, or caches grow without a measured bound.
- **Migration trap:** a schema or public contract changes without versioning, compatibility, idempotent retry, or a caller migration order.
- **Authored-contract drift:** roots, pivots, attachments, tags, attributes, collision groups, streaming assumptions, or clone/storage paths are implicit or contradicted.

Reject or revise a candidate when a red flag is structural rather than a contained implementation detail. Do not add a new abstraction merely to silence a list item.
