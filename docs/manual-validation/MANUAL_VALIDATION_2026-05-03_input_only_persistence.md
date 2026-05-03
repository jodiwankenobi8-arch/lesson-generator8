# Manual Validation — Input-Only Persistence Proof

Date: 2026-05-03  
Checkpoint: 65321c8 Add post zip parity continuation handoff  
Flow: Input-only / no uploaded files  
Dev URL used: http://127.0.0.1:4175/

## Purpose

Confirm that an input-only generated lesson survives refresh and route navigation without losing teacher work or contradicting source-use language.

## Scenario

Inputs used:

- Grade: 1
- Subject: ELA
- Skill / focus: Long A phonics
- Topic / text / unit: Long a CVCe words
- Duration: 25 minutes
- Uploads: none
- Outputs selected: lesson plan, slides, printables

## Result

PASS.

## Confirmed behavior

- Materials correctly showed no files were added.
- Materials correctly said the lesson was ready to generate from teacher inputs.
- Materials clearly stated no curriculum source would be used.
- Default artifact shell language was visible.
- Generation succeeded.
- Results rendered a coherent input-only package.
- Lesson plan, slides, and printables export were visible.
- Refreshing the Results page preserved the generated package.
- Route loop Results → Inputs → Materials → Results preserved state.
- Inputs remained populated.
- Output selections remained preserved, including printables.
- Materials still showed the no-files/input-only readiness state.
- Results still showed the generated package and coherent source-use language.

## Fail conditions checked

No fail conditions were observed.

Specifically, the generated package did not disappear after refresh, inputs did not reset, output choices did not reset, and source-use language did not contradict the no-material/input-only state.

## Conclusion

Input-only persistence is browser-proven for this flow. No code patch is needed based on this validation.
