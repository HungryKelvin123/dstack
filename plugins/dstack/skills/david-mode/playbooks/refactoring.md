# Refactoring

1. State the preserved behavior and the concrete source of reader or maintenance cost.
2. Find every caller and boundary affected.
3. Remove dead paths before adding structure.
4. Reshape in small, behavior-preserving units. Migrate callers and delete replaced internal APIs in the same change when safe.
5. Run the same checks before and after. Add no gameplay or data behavior without explicit scope.
6. Report the simpler shape and the evidence that behavior stayed stable.
