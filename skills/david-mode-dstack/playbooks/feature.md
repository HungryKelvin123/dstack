# Feature

1. Confirm the requested behavior and any unresolved gameplay, UX, monetization, progression, data, or architecture decision.
2. Name the data shape, owner, lifecycle, replication path, persistence boundary, and failure behavior.
3. Use `$architect-dstack` when the feature crosses a module, client/server, remote, persistence, or authored-asset boundary.
4. Break implementation into small units that each end in a check.
5. Implement the smallest complete vertical slice. Preserve existing conventions and unrelated work.
6. Review security with `$roblox-security-dstack` and performance with `$roblox-performance-dstack` when those branches apply.
7. Run local tests and project assembly. Give the user an exact Studio scenario for runtime verification.
