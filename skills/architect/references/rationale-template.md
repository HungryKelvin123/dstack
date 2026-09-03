# Roblox architecture rationale

Use this compact record for each design candidate:

```text
Candidate: <short name>
Usage: <caller-facing example>
Shape: <one-sentence module and ownership summary>
Invariants: <the facts that must always hold>
Why it fits: <evidence-backed reason>
Alternatives rejected: <meaningful whole shapes and why>
Risks: <security, lifecycle, persistence, replication, performance, or migration risks>
Verification: <local checks and exact user-run Studio scenario>
```

For synthesis, append:

```text
Synthesis decision: <chosen candidate and why>
Grafts: <idea, source candidate, and why it remains coherent>
Rejections: <candidate idea and concrete reason>
Dropouts: <missing candidates, if any>
Verification result: <evidence and remaining gap>
```
