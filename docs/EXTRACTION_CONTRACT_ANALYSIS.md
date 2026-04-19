# Extraction Contract Implementation vs Test Expectations

**Analysis Date:** 2026-04-19  
**Focus:** Why `extractPlainText` and HTML/image extraction aren't filtering expected noise

---

## Summary

The extraction contract has **incomplete noise filtering logic**. The current implementation in [src/engine/materials/extractTextFromFile.ts](src/engine/materials/extractTextFromFile.ts) filters some low-value patterns but **missing critical filters** that tests expect:

1. **URLs** (https://, www., http://)
2. **Slide number patterns** (e.g., "Slide 1", "Slide 3")

---

## Current Extraction Flow

### 1. extractPlainText Function
**Location:** [src/engine/materials/extractTextFromFile.ts](src/engine/materials/extractTextFromFile.ts#L207-L215)

```typescript
export function extractPlainText(content: string): string[] {
  return normalizeExtractedText(
    content
      .split(/\r?\n/)
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
  )
}
```

**Current behavior:**
- Splits on newlines, trims, filters empty
- Calls `normalizeExtractedText()` which applies noise filtering

**Test expectations:** [src/engine/extraction.test.ts](src/engine/extraction.test.ts#L84-L102)

Test case: "extractPlainText removes noisy low-value lines before analysis"

```
Input includes:
  - "1", "2", "12" (numbers)
  - "https://example.com/resource", "www.example.com/unit1" (URLs)
  - "Slide 3" (slide number)
  - "---", "***" (separator noise)

Expected output: ["Short a words", "Teacher model the blending"]
```

---

### 2. extractTextFromFile - HTML Extraction
**Location:** [src/engine/materials/extractTextFromFile.ts](src/engine/materials/extractTextFromFile.ts#L215-L230)

```typescript
case "html": {
  const extractedText = extractHtmlText(
    input.fileContent ?? decodeArrayBuffer(input.fileBuffer)
  )
  // ... returns with normalization metadata
}
```

**HTML extraction flow:**
1. Calls `extractHtmlText()` which removes script/style tags
2. Replaces block-level tags with newlines
3. Removes remaining HTML tags
4. Decodes HTML entities
5. Calls `normalizeExtractedText()` for filtering

**Test expectation:** [src/engine/extraction.test.ts](src/engine/extraction.test.ts#L163-L182)

Test case: "extractTextFromFile normalizes noisy html into analysis-ready lines"

```
Input HTML:
  <div>Slide 1</div>
  <div>https://district.example.org</div>
  <h1>Long A Lesson</h1>
  <p>Teacher says: Today we will read long a words.</p>
  <div>3</div>

Expected output: [
  "Long A Lesson",
  "Teacher says: Today we will read long a words."
]
```

**Current issue:** The HTML extraction is keeping URLs and slide numbers that should be filtered.

---

### 3. extractTextFromFile - Image OCR Extraction
**Location:** [src/engine/materials/extractTextFromFile.ts](src/engine/materials/extractTextFromFile.ts#L396-L448)

```typescript
const normalizedOcrLines = normalizeExtractedText(ocrResult.lines)
```

**Image extraction flow:**
1. Calls `extractImageTextWithOcr()` from OCR provider
2. Passes OCR lines through `normalizeExtractedText()` for noise removal
3. Returns normalized lines if they exist, fallback notice if empty

**Current issue:** OCR results may include URLs, slide numbers, or other noise that isn't being filtered out before being marked as "extracted".

---

## Noise Filtering Implementation

### Current Filters in `shouldDropLowValueExtractedLine()`
**Location:** [src/engine/materials/extractTextFromFile.ts](src/engine/materials/extractTextFromFile.ts#L675-L725)

**Filters currently implemented:**

| Pattern | Regex/Logic | Status |
|---------|-------------|--------|
| Empty lines | `!lower` | ✅ Implemented |
| Recoverable standards (e.g., "RF.1.3") | Special detector | ✅ Implemented |
| Too short (< 4 chars) | `lower.length < 4` | ✅ Implemented |
| Pure numbers or page numbers | `/^(page\s+\d+\|\d+)$/` | ✅ Implemented |
| Standards/benchmarks keywords | `/^(standards?\|benchmarks?\|teacher edition\|student edition)$/` | ✅ Implemented |
| Copyright/edition boilerplate | `/(all rights reserved\|copyright\|...)/i` | ✅ Implemented |
| Low alphabetic ratio | `alphaRatio < 0.45` | ✅ Implemented |
| Too many special chars | `/[\)\]\(]{2,}/` or low alpha with special | ✅ Implemented |

**Filters MISSING (causing test failures):**

| Pattern | Test Expects Filtered | Current Status |
|---------|----------------------|-----------------|
| URLs (http://, https://, www.) | YES | ❌ **NOT IMPLEMENTED** |
| Slide numbers (e.g., "Slide 1", "Slide 3") | YES | ❌ **NOT IMPLEMENTED** |

---

## What Should Be Filtered But Isn't

### URL Patterns Not Caught
```
https://example.com/resource      ← NOT filtered (contains alpha, length > 4)
www.example.com/unit1             ← NOT filtered (contains alpha, length > 4)
https://district.example.org      ← NOT filtered (contains alpha, length > 4)
```

The alphaRatio check won't catch these because URLs have high alphabetic content (domain names, paths).

### Slide Number Patterns Not Caught
```
Slide 1                           ← NOT filtered (length > 4, has alpha)
Slide 3                           ← NOT filtered (length > 4, has alpha)
```

No regex catches the "Slide [0-9]" or "Slide [A-Z]" pattern.

---

## Root Cause Analysis

### Why These Patterns Are Missing

1. **URLs were likely considered low-priority** initially since:
   - They're more common in extracted HTML/PDFs than plain text files
   - They have legitimate educational use (resource references)
   - But tests show they should be removed from analysis content

2. **Slide numbers were likely overlooked** because:
   - They only appear in PowerPoint/presentation files extracted as text
   - Early focus may have been on PDF/DOCX/image extraction
   - Slide number pattern ("Slide N") is presentation-specific noise

3. **No TODO or FIXME comments** exist in the code suggesting these were intentionally deferred—they just weren't implemented.

---

## Tests Affected

### Currently Failing Tests

1. **"extractPlainText removes noisy low-value lines before analysis"**  
   Location: [src/engine/extraction.test.ts#L84-L102](src/engine/extraction.test.ts#L84-L102)
   
   Failure point: URLs and "Slide 3" not being filtered

2. **"extractTextFromFile normalizes noisy html into analysis-ready lines"**  
   Location: [src/engine/extraction.test.ts#L163-L182](src/engine/extraction.test.ts#L163-L182)
   
   Failure point: URLs and "Slide 1" remaining in output

---

## Fix Requirements

To make extraction filtering match test expectations, `shouldDropLowValueExtractedLine()` needs:

### 1. URL Detection Filter
```typescript
// Should match:
// - https://example.com
// - http://example.com
// - www.example.com
// - ftp://example.com

if (/^(https?|ftp):\/\/\S+|^www\.\S+/i.test(line)) {
  return true
}
```

### 2. Slide Number Pattern Filter
```typescript
// Should match:
// - "Slide 1", "Slide 2", "Slide 10"
// - "Slide A", "Slide B"
// - "slide 1" (case-insensitive)

if (/^\s*slide\s+[a-z0-9]+\s*$/i.test(line)) {
  return true
}
```

---

## Impact Assessment

### What These Fixes Will Achieve

- ✅ Plain text extraction removes URLs and slide numbers automatically
- ✅ HTML extraction becomes cleaner (URLs in HTML divs, slide headers removed)
- ✅ Image OCR extraction filters out slide overlays that include numbers
- ✅ Tests pass: extraction contract is honored
- ✅ Analysis input cleaner: lesson analysis gets focused curriculum content, not reference URLs

### No Breaking Changes Expected

- Standard codes (RF.1.3, etc.) are still kept via `looksLikeRecoverableStandardCode()`
- Legitimate lesson text ("Teacher says: ...") remains unaffected
- Educational content is preserved

---

## File Locations Reference

| File | Purpose |
|------|---------|
| [src/engine/materials/extractTextFromFile.ts](src/engine/materials/extractTextFromFile.ts) | Main extraction logic, `normalizeExtractedText()`, `shouldDropLowValueExtractedLine()` |
| [src/engine/extraction.test.ts](src/engine/extraction.test.ts) | Test cases defining expected filtering behavior |
| [src/engine/materials/extractImageOcr.ts](src/engine/materials/extractImageOcr.ts) | Image OCR integration (output fed to `normalizeExtractedText()`) |
| [src/engine/materials/extractPdfOcr.ts](src/engine/materials/extractPdfOcr.ts) | PDF extraction (output fed to `normalizeExtractedText()`) |

---

## Recommendation

Add URL and slide number filtering to `shouldDropLowValueExtractedLine()` in [src/engine/materials/extractTextFromFile.ts](src/engine/materials/extractTextFromFile.ts) immediately before the alphaRatio check (around line 720). This closes a gap in the extraction contract without changing any other logic.
