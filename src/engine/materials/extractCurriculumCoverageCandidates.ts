const COVERAGE_SIGNAL_PATTERN = /(objective|learning\s+target|standard|practice\s+words?|word\s+list|phonemic\s+awareness|blend|segment|spell|passage|decodable|let'?s\s+read\s+together)/i

const PREFIX_PATTERNS: RegExp[] = [
  /^notes:\s*slide\s*\d+\s*\/\s*\d+\s*:\s*/i,
  /^notes:\s*/i,
  /^text:\s*/i,
  /^slide\s*\d+\s*:\s*/i,
]

const TRAILING_NOISE_PATTERNS: RegExp[] = [
  /\s*(?:\bpage\s*\d+\s*(?:of\s*\d+)?\b)\s*$/i,
  /\s*[-–—]?\s*continued\s*$/i,
  /\s*[-–—]?\s*cont\.?\s*$/i,
]

export function extractCurriculumCoverageCandidates(lines: string[]): string[] {
  const candidates: string[] = []
  const seen = new Set<string>()

  for (const line of lines) {
    for (const sentence of splitIntoSentences(line)) {
      const cleaned = cleanCandidate(sentence)
      if (!cleaned || !isCurriculumCoverageSignal(cleaned)) {
        continue
      }

      const key = cleaned.toLowerCase()
      if (seen.has(key)) {
        continue
      }

      seen.add(key)
      candidates.push(cleaned)
    }
  }

  return candidates
}

function splitIntoSentences(line: string): string[] {
  return line
    .split(/(?<=[.!?])\s+|\s*[;|]\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function cleanCandidate(line: string): string {
  let cleaned = line.trim()

  for (const pattern of PREFIX_PATTERNS) {
    cleaned = cleaned.replace(pattern, "")
  }

  for (const pattern of TRAILING_NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "")
  }

  return cleaned.replace(/\s+/g, " ").trim()
}

function isCurriculumCoverageSignal(line: string): boolean {
  return COVERAGE_SIGNAL_PATTERN.test(line)
}
