import { FrameworkDetection, PresenterCue } from "./types";

function parseTimeToSeconds(text: string): number | undefined {
  const t = text.toLowerCase();

  const mmss = t.match(/\b(\d{1,2}):(\d{2})\b/);
  if (mmss) return Number(mmss[1]) * 60 + Number(mmss[2]);

  const mins = t.match(/\b(\d+)\s*(min|mins|minute|minutes)\b/);
  if (mins) return Number(mins[1]) * 60;

  const secs = t.match(/\b(\d+)\s*(sec|secs|second|seconds)\b/);
  if (secs) return Number(secs[1]);

  return undefined;
}

export function extractPresenterCues(exemplarText: string, sourceFile?: string): PresenterCue[] {
  const lines = exemplarText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cues: PresenterCue[] = [];

  for (const line of lines) {
    const hasTimer = /(timer|countdown|\b\d{1,2}:\d{2}\b|\b\d+\s*(min|minute|sec|second)s?\b)/i.test(line);
    const hasClicker = /\b(clicker|remote|click|advance|next slide|press)\b/i.test(line);
    const hasScript = /^(teacher:|say:|script:)/i.test(line);
    const hasTransition = /\b(turn and talk|stop and jot|pause|wait time|transition|now move to)\b/i.test(line);

    if (hasTimer) {
      cues.push({
        type: "timer",
        rawText: line,
        timeSeconds: parseTimeToSeconds(line),
        confidence: 0.75,
        sourceFile,
      });
      continue;
    }
    if (hasClicker) {
      cues.push({ type: "clicker", rawText: line, confidence: 0.7, sourceFile });
      continue;
    }
    if (hasScript) {
      cues.push({ type: "script", rawText: line, confidence: 0.7, sourceFile });
      continue;
    }
    if (hasTransition) {
      cues.push({ type: "transition", rawText: line, confidence: 0.65, sourceFile });
      continue;
    }
  }

  return cues;
}

export function detectFramework(exemplarText: string): FrameworkDetection {
  const t = exemplarText.toLowerCase();
  const evidence: string[] = [];
  let scoreHub = 0;
  let scoreGuidepost = 0;

  // Clickable Hub cues (your system)
  if (/\b(home button|toc button|table of contents)\b/.test(t)) { scoreHub += 2; evidence.push("Mentions Home/TOC button"); }
  if (/\b(click on|click the circle|click circle)\b/.test(t)) { scoreHub += 2; evidence.push("Mentions clicking circles / navigation"); }
  if (/\b(go to|jump to)\b/.test(t) && /\b(section|portion of the lesson)\b/.test(t)) { scoreHub += 1; evidence.push("Mentions jumping to sections"); }

  // Guidepost-ish words (placeholder)
  if (/\bfoundation\b/.test(t)) { scoreGuidepost += 1; evidence.push("Mentions Foundation"); }
  if (/\bstrategy\b/.test(t)) { scoreGuidepost += 1; evidence.push("Mentions Strategy"); }
  if (/\bnegotiation\b/.test(t)) { scoreGuidepost += 1; evidence.push("Mentions Negotiation"); }
  if (/\bresolution\b/.test(t)) { scoreGuidepost += 1; evidence.push("Mentions Resolution"); }
  if (/\benforcement\b/.test(t)) { scoreGuidepost += 1; evidence.push("Mentions Enforcement"); }

  if (scoreHub >= 3 && scoreHub >= scoreGuidepost + 2) {
    return { framework: "clickableHub", confidence: Math.min(0.95, 0.55 + scoreHub * 0.12), evidence };
  }
  if (scoreGuidepost >= 3 && scoreGuidepost >= scoreHub + 1) {
    return { framework: "guidepost", confidence: Math.min(0.95, 0.5 + scoreGuidepost * 0.12), evidence };
  }

  return {
    framework: "linear",
    confidence: 0.55,
    evidence: evidence.length ? evidence : ["Defaulted to linear (no strong framework markers found)"],
  };
}
