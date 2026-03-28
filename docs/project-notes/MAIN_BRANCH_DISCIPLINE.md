# Main branch discipline

## Rule
`main` is the live truth branch for Lesson Generator 8.

Do not let meaningful finished work live only on side branches.
If a side branch contains the current truth, recover that work into `main` immediately or discard the branch.

## What side branches are for
Side branches are temporary only.
Use them only for one of these reasons:
- a narrow implementation seam that will be merged back quickly
- a recovery branch used to rescue already-finished work into `main`
- a short-lived salvage/reference branch while inspecting older history

## What side branches are not for
Do not use side branches as long-term truth branches.
Do not keep evolving a branch after its intended work has already been merged.
Do not let continuation docs point at a branch as if it were the live product unless that branch is actively being merged right now.

## Required follow-through
After meaningful work lands:
1. make sure the real current truth is on `main`
2. update the active continuation docs to match `main`
3. remove or archive stale branch-specific guidance
4. delete temporary branches once their work is safely recovered or intentionally abandoned

## Recovery rule
If branch drift is discovered:
- compare the branch to `main`
- recover the cleanest valid work into `main` first
- prefer narrow fast-forward or cherry-pick recovery over broad historical merges
- do not merge a large diverged branch wholesale unless it is clearly the safest option

## Practical intent
The goal is to stop losing hours of work to branch drift, stale checkpoints, and competing versions of current truth.
