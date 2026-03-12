import { SlideOutline } from "./slideTypes"

export function buildSlideContent(outline: SlideOutline): string {
  const body = outline.body.join(" | ")

  return [
    `Slide ${outline.slideNumber}: ${outline.title}`,
    `Kind: ${outline.kind}`,
    `Action: ${outline.action}`,
    `Purpose: ${outline.purpose}`,
    `Timing: ${outline.timing}`,
    `Teacher Move: ${outline.teacherMove}`,
    `Prompt Style: ${outline.promptStyle}`,
    `Tone: ${outline.tone}`,
    `Content: ${body}`,
  ].join(" | ")
}
