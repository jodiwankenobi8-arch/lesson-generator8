export type SlideAction = "reuse" | "adapt" | "create_new"

export type SlideKind =
  | "objective"
  | "opening"
  | "teach"
  | "guided_practice"
  | "independent_practice"
  | "centers"
  | "closure"
  | "teaching_notes"

export type SlideOutline = {
  slideNumber: number
  title: string
  kind: SlideKind
  action: SlideAction
  purpose: string
  timing: string
  teacherMove: string
  promptStyle: string
  tone: string
  body: string[]
}
