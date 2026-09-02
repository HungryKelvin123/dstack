# Performance issue

1. Define a realistic workload, metric, baseline, and failure threshold.
2. Trace the measured cost with `$roblox-performance-dstack`.
3. Form one hypothesis at a time. Prefer removing or bounding work.
4. Measure after each accepted change under the same workload.
5. Run correctness checks and inspect authority or replication changes.
6. Report before, after, method, tradeoff, and the user-run Studio measurement when local evidence cannot establish runtime cost.
