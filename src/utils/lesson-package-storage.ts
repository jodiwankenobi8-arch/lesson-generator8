import {
  LESSON_PACKAGE_STORAGE_KEY,
  LESSON_PACKAGE_VERSION,
  createEmptyLessonPackage,
  lessonPackageSchema,
  type LessonPackage,
} from '../types/lesson-package'

export type LessonPackageLoadResult =
  | { ok: true; value: LessonPackage }
  | { ok: false; error: string }

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function parseLessonPackage(input: unknown): LessonPackageLoadResult {
  const result = lessonPackageSchema.safeParse(input)

  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues.map((issue) => issue.message).join('; '),
    }
  }

  return { ok: true, value: result.data }
}

export function loadLessonPackage(): LessonPackageLoadResult {
  if (!isBrowser()) {
    return { ok: false, error: 'localStorage unavailable' }
  }

  const raw = window.localStorage.getItem(LESSON_PACKAGE_STORAGE_KEY)
  if (!raw) {
    return { ok: true, value: createEmptyLessonPackage() }
  }

  try {
    const parsed = JSON.parse(raw)
    return parseLessonPackage(parsed)
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to parse lesson package JSON',
    }
  }
}

export function saveLessonPackage(pkg: LessonPackage): void {
  if (!isBrowser()) return

  const next: LessonPackage = {
    ...pkg,
    metadata: {
      ...pkg.metadata,
      version: LESSON_PACKAGE_VERSION,
      updatedAt: new Date().toISOString(),
    },
  }

  window.localStorage.setItem(LESSON_PACKAGE_STORAGE_KEY, JSON.stringify(next))
}

export function clearLessonPackage(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(LESSON_PACKAGE_STORAGE_KEY)
}
