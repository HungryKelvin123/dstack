# Bug fix

1. Define the failing behavior and a check that goes red without the fix.
2. Reproduce from source, tests, logs, saved artifacts, or a deterministic local probe. Runtime-only Studio reproduction belongs to the user.
3. Trace the root cause across client, server, remotes, state lifecycle, persistence, and authored dependencies.
4. Add a regression test when `$tdd` finds a cheap deterministic target.
5. Make the smallest root-cause fix. Avoid guards that only hide the symptom.
6. Run the focused proof, relevant suite, and repository assembly check. Review the diff with `$blast-radius` when the change crosses a boundary.
7. Report what broke, why, what changed, checks, and the exact Studio playtest still needed.
