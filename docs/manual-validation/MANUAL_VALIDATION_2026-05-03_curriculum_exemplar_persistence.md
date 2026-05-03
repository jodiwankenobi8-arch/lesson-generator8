# Manual Validation — Curriculum + Exemplar Persistence Proof

Date: 2026-05-03  
Current baseline before proof: ac737ef Document input-only persistence validation  
Flow: Curriculum + exemplar  
Dev URL used: http://127.0.0.1:4175/

## Purpose

Confirm that a generated lesson using both curriculum and exemplar sources survives refresh and route navigation without losing teacher work, source materials, output selections, or source-use language.

## Scenario

Inputs used:

- Grade: 1
- Subject: ELA
- Skill / focus: Long A phonics
- Topic / text / unit: Long a CVCe words
- Duration: 25 minutes
- Outputs selected: lesson plan, slides, printables

## Curriculum source

File: curriculum-long-a.txt

Content included:

- Word List: cake, game, lake, name, tape
- Decodable text: Jake made a cake by the lake.
- Practice: Read and sort long-a CVCe words.
- Assessment: Students read three long-a words and one sentence.

## Exemplar source

File: exemplar-flow.txt

Content included:

- Objective / Opening
- Teach/Model: I do, we do, you do sequence with explicit think-aloud
- Word List / Practice
- Partner practice with sentence frames
- Closure / Quick Check

## Result

PASS.

## Confirmed behavior

- Inputs remained populated.
- Output selections remained preserved, including printables.
- Curriculum source was added, parsed, and shown as present.
- Exemplar source was added, parsed, and shown as present.
- Materials showed:
  - Content from curriculum-long-a.txt
  - Structure from exemplar-flow.txt
- Standards confirmation was required and completed with RF.1.3.
- Word examples were confirmed in draft review.
- Generation succeeded.
- Results language stated content came from curriculum materials.
- Results language stated structure came from exemplar materials.
- Lesson plan, slides, and printables exports were visible.
- Curriculum source use, curriculum details used, and teacher review needs were present and internally consistent.
- Refreshing Results preserved the generated package.
- Route loop Results → Inputs → Materials → Results preserved state.
- Materials still showed curriculum and exemplar as present and ready after navigation.
- Results still showed the generated package after navigation.
- No contradiction appeared between curriculum-content language and exemplar-structure language.

## Fail conditions checked

No fail conditions were observed.

Specifically, the generated package did not disappear after refresh, inputs did not reset, output selections did not reset, materials did not disappear, and source-use language did not contradict the curriculum + exemplar state.

## Conclusion

Curriculum + exemplar persistence is browser-proven for this flow. No code patch is needed based on this validation.
