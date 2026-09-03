# Feature

1. Confirm the requested behavior and any unresolved gameplay, UX, monetization, progression, data, or architecture decision.
2. Name the data shape, owner, lifecycle, replication path, persistence boundary, and failure behavior.
3. Use `$architect` only when the feature crosses two or more modules or services, changes a public/shared API or remote contract, introduces or changes server-owned state, persistence, replication, lifecycle ownership, or another load-bearing boundary. Skip it for a local change with one clear owner and no boundary change.
4. Break implementation into small units that each end in a check.
5. Implement the smallest complete vertical slice. Preserve existing conventions and unrelated work.
6. Review security with `$roblox-security` and performance with `$roblox-performance` when those branches apply.
7. Run local tests and project assembly. Give the user an exact Studio scenario for runtime verification.
