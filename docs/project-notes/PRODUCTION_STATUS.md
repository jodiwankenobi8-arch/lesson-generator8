# Production Hardening Status

Updated: 2026-03-07

This file tracks which major steps from the production plan have been completed in the working project snapshot.

## Step status

1. **Freeze the release path and stop branching the UI in multiple directions**  
   Status: In progress  
   Notes: The live runtime path has been isolated. Branch naming still needs to be done in Git on the user's machine.

2. **Choose one app architecture and archive the other**  
   Status: Completed in source snapshot  
   Notes: Unreachable source modules were moved from `src/` into `legacy-src/` so the live app now reflects a single runtime path.

3. **Fix startup and repo hygiene first**  
   Status: Mostly completed  
   Completed:
   - startup stylesheet import restored in `src/main.tsx`
   - root error boundary in `src/App.tsx`
   - package metadata cleaned up
   - `.gitignore` expanded for bulky local artifacts
   - archived source separated from live source
   Remaining:
   - CI workflow files
   - release checklist docs
   - optional lint/format setup

4. **Lock one domain model for the whole app**  
   Status: Partially started  
   Notes: Versioned workspace persistence is in place. Formal schema validation and package normalization are still pending.

5. **Unify material extraction into one real pipeline**  
   Status: Not started in live path  
   Notes: Current live path still uses limited text extraction with honest fallbacks. Archived extraction/OCR work remains available in `legacy-src/`.

6. **Make generation traceable, not just deterministic**  
   Status: Partially started  
   Notes: Blueprint and package summary surfaces exist. Clear provenance panels and warnings still need to be expanded.

7. **Keep one preview/export path live**  
   Status: Completed for current runtime  
   Notes: Results Hub remains the live preview/export surface.

8. **Build a real design system instead of style helpers**  
   Status: In progress  
   Completed:
   - orchard token source established
   - orchard UI helpers hardened and normalized
   Remaining:
   - reusable UI primitives
   - CSS variable bridge
   - component-level design system

9. **Build UI primitives before re-polishing whole pages**  
   Status: Not started

10. **Redesign the 3 core screens**  
    Status: In progress  
    Notes: Orchard styling direction is in place. Structural cleanup came first; deeper page redesign still remains. Global focus, motion-reduction, and interaction polish rules have been added. Route-level loading fallback has been added.

11. **Add premium polish after structure is stable**  
    Status: Not started

12. **Production hardening**  
    Status: In progress  
    Notes: Clean-install validation has been run in this workspace. Build/typecheck are now passing, and a starter CI workflow is included.

13. **Reduce footprint only after stability**  
    Status: In progress  
    Notes: Archived unused source reduced the live-code footprint without deleting future work. Route-level code splitting is now in place for the live pages.
