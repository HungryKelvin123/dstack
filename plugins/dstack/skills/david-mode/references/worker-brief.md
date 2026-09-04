# Worker brief

Fill this brief for every worker. Include only the source, constraints, and skill references needed for its assignment.

- Task: one bounded question or implementation batch, with a concrete completion criterion.
- Evidence: repository root, exact source paths or diff, relevant instructions, and parent decisions already made.
- Ready inputs: accepted prerequisite artifacts and fixed interfaces. A worker must be able to finish without another worker's intermediate results; return new dependencies to the parent.
- Ownership: read-only or exact allowed write paths, forbidden paths, and other actors' owned files. Reviewers and judges are read-only.
- Contract: interfaces and behavior to preserve, expected result, and focused verification commands. Return unresolved design decisions to the parent.
- Output: `PASS`, `ISSUES`, or `BLOCKED`; changed files or cited `path:line` evidence; checks actually run; remaining questions. Name the output files and preserve relevant assumptions there instead of relying on chat-only handoffs. Keep findings concise; leave bulk output in an artifact only when needed.

The worker follows the active client's model and effort supplied by the parent from the runtime contract. It is a leaf: no subagents, model changes, expanded scope, commits, pushes, publishing, or connector writes. It preserves unrelated changes and reports partial work if blocked. Run only assigned local checks. Roblox Studio MCP playtest controls are forbidden, including launching, starting, stopping, simulating, or controlling a test session. Any allowed Studio context is non-playtest and limited to the selected Studio and assignment; the parent owns Studio writes.
