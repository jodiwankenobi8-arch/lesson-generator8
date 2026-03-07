import { K_ELA_BEST_DATASET } from "./data/k_ela_best_dataset";
import { classifyLessonDomain } from "../domain/classifyLessonDomain";

function safeLower(v: any): string {
  return String(v ?? "").toLowerCase();
}

const DEBUG_BEST = false;

type LessonDomain = "ELA" | "Math" | "Science" | "SocialStudies" | "Other";

// Per-domain strand weighting. Keep neutral (1.0) unless you want domain-level bias later.
const DOMAIN_WEIGHT: Record<LessonDomain, Record<string, number>> = {
  ELA: { F: 1, R: 1, V: 1, W: 1, C: 1 },
  Math: { F: 1, R: 1, V: 1, W: 1, C: 1 },
  Science: { F: 1, R: 1, V: 1, W: 1, C: 1 },
  SocialStudies: { F: 1, R: 1, V: 1, W: 1, C: 1 },
  Other: { F: 1, R: 1, V: 1, W: 1, C: 1 },
};

function applyDomainWeighting(input: any, standards: any[]) {
  if (!Array.isArray(standards) || standards.length === 0) return standards;

  const asText = (() => {
    if (typeof input === "string") return input;
    try {
      const maybe = input ?? {};
      const parts = [
        maybe.lessonTitle,
        maybe.title,
        maybe.topic,
        maybe.objective,
        maybe.iCan,
        maybe.intent,
        maybe.focus,
        maybe.skillFocus,
        maybe.text,
        maybe.textOrTopic,
        maybe.prompt,
        maybe.userInput,
        maybe.lessonText,
        maybe.readAloudTitle,
        maybe.essentialQuestion,
      ]
        .filter(Boolean)
        .map(String);

      const json = JSON.stringify(maybe);
      return (parts.join(" ") + " " + json).trim();
    } catch {
      return String(input ?? "");
    }
  })();

  const domain = classifyLessonDomain(asText) as LessonDomain;
  const weightMap = DOMAIN_WEIGHT[domain] ?? DOMAIN_WEIGHT.Other;

  const getBase = (std: any) => {
    const candidates = [std?.confidence, std?.score, std?.match, std?.matchPct];
    for (const v of candidates) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
    return 0;
  };

  const reweighted = standards.map((std: any) => {
    const code = String(std?.code ?? "");
    const prefix = code.split(".")[2]; // F, R, V, W, C
    const multiplier = (weightMap as any)[prefix] ?? 1;

    const base = getBase(std);
    const weightedScore = base * multiplier;

    const next: any = { ...std, weightedScore };

    if (Number.isFinite(Number(std?.confidence))) {
      next.originalConfidence = Number(std.confidence);
      next.confidence = weightedScore;
    } else if (Number.isFinite(Number(std?.score))) {
      next.originalScore = Number(std.score);
      next.score = weightedScore;
    } else {
      next.confidence = weightedScore;
    }
    return next;
  });

  reweighted.sort((a: any, b: any) => Number(b?.weightedScore ?? 0) - Number(a?.weightedScore ?? 0));

  if (DEBUG_BEST) {
    const preview = asText.slice(0, 120).replace(/\s+/g, " ");
    console.log(`[STANDARDS DOMAIN] ${domain} | inputPreview="${preview}..."`);
    console.log(
      "[BEST] TOP 6 K-ELA BEST",
      reweighted.slice(0, 6).map((s: any) => ({
        code: String(s?.code ?? ""),
        confidence: Number(s?.confidence ?? 0),
        weightedScore: Number(s?.weightedScore ?? 0),
      }))
    );
  }

  return reweighted;
}

const STOP_WORDS = new Set([
  "the","and","a","to","of","in","for","with","is","on","at","by","an","be","as","it",

  // BEST boilerplate verbs (reduce noisy overlap)
  "demonstrate","knowledge","identify","use","recognize","locate","distinguish","match",
  "show","understand","describe","explain","determine","apply","practice","produce",
  "appropriate","grade","level","student","students","skills","skill","accurately"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function tokenSet(text: string): Set<string> {
  return new Set(tokenize(text));
}

function hasAny(raw: string, patterns: RegExp[]) {
  return patterns.some((r) => r.test(raw));
}

// Build corpus from many possible input fields (matches the real app shape)
function buildCorpus(input: any): string {
  if (!input) return "";
  if (typeof input === "string") return input.toLowerCase();

  try {
    const parts = [
      input.lessonTitle,
      input.title,
      input.topic,
      input.objective,
      input.iCan,
      input.essentialQuestion,
      input.textOrTopic,
      input.text,
      input.prompt,
      input.userInput,
      input.lessonText,
      input.readAloudTitle,
      input.skillFocus,
      input.focus,
      input.intent,
    ]
      .filter(Boolean)
      .map(String);

    // Also include nested input if package passes {input:{...}}
    if (input.input && typeof input.input === "object") {
      const nested = input.input;
      parts.push(
        nested.lessonTitle,
        nested.title,
        nested.topic,
        nested.objective,
        nested.iCan,
        nested.essentialQuestion,
        nested.textOrTopic,
        nested.text,
        nested.prompt
      );
    }

    const json = JSON.stringify(input);
    return (parts.join(" ") + " " + json).toLowerCase();
  } catch {
    return String(input ?? "").toLowerCase();
  }
}

function wrappedDetectKelaBest(input: any, options: any = {}) {
  const max = options.max ?? 10;

  const rawCorpus = buildCorpus(input);
  const corpusTokens = tokenSet(rawCorpus);

  // Strand intents
  const phonicsIntent = /\b(cvc|blend|blending|phoneme|decode|decoding|short vowel|long vowel|digraph|word family|onset|rime)\b/.test(rawCorpus);
  const comprehensionIntent = /\b(retell|character|setting|main idea|details|story)\b/.test(rawCorpus);
  const writingIntent = /\b(write|opinion|reason|draw|sentence)\b/.test(rawCorpus);

  // Micro signals
  const printConceptsIntent = /\b(print|book|page|letters|spaces|punctuation|word on a page)\b/.test(rawCorpus);
  const sightWordsIntent = /\b(high[-\s]?frequency|sight word|dolch|fry)\b/.test(rawCorpus);

  const cvcSignal = hasAny(rawCorpus, [/\bcvc\b/, /\bconsonant vowel consonant\b/]);
  const wordFamilySignal = hasAny(rawCorpus, [/\bword family\b/, /\bword families\b/, /\b(-at|-an|-in|-op|-ug)\b/]);
  const decodeSignal = hasAny(rawCorpus, [/\bdecode\b/, /\bdecoding\b/, /\bphonics\b/, /\bword[-\s]?analysis\b/]);

  const phonologicalAwarenessSignal = hasAny(rawCorpus, [
    /\brhyme\b/, /\brhyming\b/, /\balliteration\b/, /\bsegment\b/, /\bsegmentation\b/, /\bblend\b/, /\bblending\b/, /\bsyllable\b/, /\bonset\b/, /\brime\b/
  ]);

  const kOnly = K_ELA_BEST_DATASET.filter((s: any) => /^ELA\.K\./i.test(String(s.code ?? "")));

  const scored = kOnly.map((std: any) => {
    let score = 0;

    const code = String(std.code ?? "");
    const stdText = safeLower(std.label ?? std.description ?? "");
    const stdTokens = tokenSet(stdText);

    // Token overlap (set-based)
    let overlap = 0;
    corpusTokens.forEach((t) => {
      if (stdTokens.has(t)) overlap += 1;
    });
    score += overlap * 3;

    // Strand intent boosts
    if (phonicsIntent && code.startsWith("ELA.K.F.")) score += 6;
    if (comprehensionIntent && code.startsWith("ELA.K.R.")) score += 5;
    if (writingIntent && code.startsWith("ELA.K.W.")) score += 5;

    // Tie-break boosts INSIDE Foundational Skills (F)
    if (code === "ELA.K.F.1.3" && (cvcSignal || wordFamilySignal || decodeSignal)) score += 6; // decoding/phonics
    if (code === "ELA.K.F.1.2" && phonologicalAwarenessSignal) score += 5; // blending/segmenting/rhyme
    if (code === "ELA.K.F.1.1" && printConceptsIntent) score += 5; // concepts of print
    if (code === "ELA.K.F.1.4" && sightWordsIntent) score += 5; // HF words

    // Light mismatch penalties when a strong micro-signal exists
    if ((cvcSignal || wordFamilySignal || decodeSignal) && code === "ELA.K.F.1.1") score -= 2;
    if (printConceptsIntent && code === "ELA.K.F.1.3") score -= 1;

    // Never negative
    return { ...std, confidence: Math.max(0, score) };
  });

  const CONFIDENCE_FLOOR = 4;

  const filtered = scored
    .filter((s: any) => Number(s.confidence) >= CONFIDENCE_FLOOR)
    .sort((a: any, b: any) => {
      if (b.confidence !== a.confidence) return b.confidence - a.confidence;
      return String(a.code ?? "").localeCompare(String(b.code ?? ""));
    });

  return filtered.slice(0, max);
}

export function detectKelaBest(input: any, opts: any = {}) {
  const out = wrappedDetectKelaBest(input, opts);
  return applyDomainWeighting(input, out);
}

