const STANDARD_CODE_REGEX = /\b(?:[A-Za-z]{2,5}\.)?[A-Za-z0-9]+\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+(?:[a-z](?:-[a-z])?)?\b/i

const GENERIC_STANDARD_HEADINGS = new Set([
  'standard',
  'standards',
  'benchmark',
  'benchmarks',
  'hb florida b.e.s.t. standards',
])


const STANDARD_DESCRIPTION_SNIPPETS = [
  'demonstrate phonological awareness',
  'read high-frequency words',
  'identify and use new vocabulary',
  'identify the main topic',
  'key details in a text',
  'retell a text orally',
  'ask and answer questions about unfamiliar words',
  'sort common words into basic categories',
  'sort common words into categories',
  'use knowledge of grade-appropriate phonics',
  'recognize and read with automaticity',
]

export function isKnownStandardDescription(value: string): boolean {
  const normalized = stripStandardCode(value).toLowerCase()
  return STANDARD_DESCRIPTION_SNIPPETS.some((snippet) => normalized.includes(snippet))
}

export function normalizeStandardValue(value: string): string {
  const normalized = String(value ?? '')
    .replace(/^[\s*•\-–—¥¢®©@~]+/, '')
    .replace(/^\[/, '')
    .replace(/^[^A-Za-z0-9(]+(?=[A-Za-z0-9(])/, '')
    .replace(/^(hb\s+)?florida\s+b\.?e\.?s\.?t\.?\s+standards?:?\s*/i, '')
    .replace(/^standards?:?\s*/i, '')
    .replace(/^[a-z]\s+(?=(?:[A-Za-z]{2,5}\.)?[A-Za-z0-9]+\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+)/i, '')
    .replace(/^\(?[a-z0-9]\)?\s+(?=(?:[A-Za-z]{2,5}\.)?[A-Za-z0-9]+\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+)/i, '')
    .replace(/^([A-Za-z]{2,5}(?:\.[A-Za-z0-9]+){2,})\s+(?=[A-Z])/, '$1: ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[;:]+$/g, '')
    .trim()

  return normalized
}

export function extractStandardCode(value: string): string | null {
  const normalized = normalizeStandardValue(value)
  const match = normalized.match(STANDARD_CODE_REGEX)
  return match ? match[0] : null
}

export function stripStandardCode(value: string): string {
  const normalized = normalizeStandardValue(value)
  const code = extractStandardCode(normalized)
  if (!code) {
    return normalized
  }

  return normalized
    .replace(code, '')
    .replace(/^[:\-–—\s]+/, '')
    .trim()
}

export function splitStandardsText(value: string): string[] {
  return String(value ?? '')
    .split(/[;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function isValidStandardCandidate(
  value: string,
  options?: { requireCode?: boolean }
): boolean {
  const normalized = normalizeStandardValue(value)
  if (!normalized) return false

  const lower = normalized.toLowerCase()
  if (GENERIC_STANDARD_HEADINGS.has(lower)) return false
  if (/\.(pdf|pptx|docx|png|jpg|jpeg|webp|html|htm)\b/i.test(lower)) return false
  if (lower.includes('edition)') || lower.includes('teacher edition') || lower.includes('student edition')) {
    return false
  }

  const code = extractStandardCode(normalized)
  if (options?.requireCode) {
    return Boolean(code)
  }

  return Boolean(code) || normalized.length >= 3
}

export function normalizeAndDedupeStandards(
  values: string[],
  options?: { requireCode?: boolean }
): string[] {
  const chosen = new Map<string, string>()

  for (const rawValue of values ?? []) {
    for (const candidate of splitStandardsText(rawValue)) {
      const normalized = normalizeStandardValue(candidate)
      if (!isValidStandardCandidate(normalized, options)) {
        continue
      }

      const code = extractStandardCode(normalized)
      const key = (code ?? normalized).toLowerCase()
      const existing = chosen.get(key)
      if (!existing) {
        chosen.set(key, normalized)
        continue
      }

      const existingCode = extractStandardCode(existing)
      const existingDescription = stripStandardCode(existing)
      const nextDescription = stripStandardCode(normalized)

      const shouldReplace =
        (existingCode && !existingDescription && Boolean(nextDescription)) ||
        (!existingCode && Boolean(code)) ||
        normalized.length > existing.length

      if (shouldReplace) {
        chosen.set(key, normalized)
      }
    }
  }

  return [...chosen.values()]
}

export function serializeStandardsText(values: string[]): string {
  return normalizeAndDedupeStandards(values).join('; ')
}

export function toggleStandardInText(currentText: string, standard: string): string {
  const current = normalizeAndDedupeStandards(splitStandardsText(currentText))
  const target = normalizeAndDedupeStandards([standard])[0]

  if (!target) {
    return serializeStandardsText(current)
  }

  const targetCode = extractStandardCode(target)?.toLowerCase()
  const next = current.filter((existing) => {
    const existingCode = extractStandardCode(existing)?.toLowerCase()
    if (targetCode && existingCode) {
      return existingCode !== targetCode
    }
    return existing.toLowerCase() !== target.toLowerCase()
  })

  const removed = next.length !== current.length
  return serializeStandardsText(removed ? next : [...current, target])
}

export function standardTextIncludes(currentText: string, standard: string): boolean {
  const current = normalizeAndDedupeStandards(splitStandardsText(currentText))
  const target = normalizeAndDedupeStandards([standard])[0]
  if (!target) return false

  const targetCode = extractStandardCode(target)?.toLowerCase()
  return current.some((existing) => {
    const existingCode = extractStandardCode(existing)?.toLowerCase()
    if (targetCode && existingCode) {
      return existingCode === targetCode
    }
    return existing.toLowerCase() === target.toLowerCase()
  })
}
