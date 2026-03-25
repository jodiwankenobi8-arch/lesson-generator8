# Results and export parity checklist

Purpose:
- finish the last browser/manual pass for Results, exports, and lane separation
- verify the live teacher-facing UI matches the current package/export contract

Current export truth to verify:
- per-artifact downloads remain available
- one optional package ZIP bundles the current generated artifacts
- Results should never imply that centers and teacher-led support are the same lane

## Scenario 1 — centers-only

Setup:
- request centers / independent work
- do not request teacher-led support / small group
- do not request intervention
- generate a lesson with usable curriculum + exemplar materials

Expected Results behavior:
- Results shows `Centers / Independent Work`
- Results shows `Centers / Independent Work Rotation`
- Results does **not** show `Teacher-Led Support`
- Results does **not** show `Intervention Support`
- no `Teacher-Led Support Focus:` line appears inside the rotation section

Expected export behavior:
- Exports section shows one ZIP button plus per-artifact downloads
- ZIP callout explains that it bundles the current generated artifacts
- printables export may include centers / independent work, but should not invent teacher-led support

## Scenario 2 — teacher-led support only

Setup:
- request teacher-led support / small group
- do not request centers / independent work
- do not request intervention
- generate a lesson with usable curriculum + exemplar materials

Expected Results behavior:
- Results shows `Teacher-Led Support`
- Results does **not** show `Centers / Independent Work Rotation`
- Results does **not** show `Centers / Independent Work`
- Results does **not** show `Intervention Support`
- no placeholder such as `No centers defined.` appears in teacher-facing output

Expected export behavior:
- Exports section still shows one ZIP button plus per-artifact downloads
- printables export may include teacher-led support, but should not invent a centers rotation block

## Scenario 3 — mixed package

Setup:
- request centers / independent work
- request teacher-led support / small group
- request intervention
- generate a lesson with usable curriculum + exemplar materials

Expected Results behavior:
- Results shows `Teacher-Led Support`
- Results shows `Intervention Support`
- Results shows `Centers / Independent Work`
- Results shows `Centers / Independent Work Rotation`
- teacher-led support lines stay in the teacher-led support section, not inside the independent rotation section

Expected export behavior:
- ZIP callout appears above per-artifact downloads
- ZIP copy names the current generated artifacts included in the bundle
- per-artifact downloads remain visible below the ZIP callout
- individual filenames match the actual generated artifact list

## Quick smoke checks

- Results header still says teacher-facing package first
- evidence/planning sections remain secondary
- no copy promises exports that are not actually present
- no copy collapses centers into teacher-led support
