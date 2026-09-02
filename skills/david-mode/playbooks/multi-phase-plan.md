# Multi-phase plan

Create a durable plan only when one verified change cannot safely deliver the goal.

For each phase, record the outcome, owned files and state, dependency, migration or compatibility rule, local checks, user-run Studio scenario, rollback point, and completion predicate. Order phases so each leaves the repository usable. Separate gameplay decisions from implementation work. Do not invent unresolved product choices. Keep the plan short enough to maintain and use `$show-me-your-work` for decisions that future sessions must audit.
