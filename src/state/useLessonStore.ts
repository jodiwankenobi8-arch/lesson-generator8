import { create } from "zustand";
import type { LessonInput, LessonPackage as EngineLessonPackage } from "../engine/types";
import type { LessonBlueprint } from "../engine/blueprint/types";
import type { LessonPackage as CanonicalLessonPackage } from "../types/lesson-package";
import { generateLesson } from "../engine/generateLesson";
import { toCanonicalLessonPackage, fromCanonicalLessonPackage } from "../utils/lesson-package-adapters";
import {
  clearLessonPackage,
  hasStoredLessonPackage,
  loadLessonPackage,
  saveLessonPackage,
} from "../utils/lesson-package-storage";

type Status = "idle" | "generating" | "ready" | "error";

type StoredWorkspace = {
  version: number;
  input: LessonInput;
  package: EngineLessonPackage | null;
};

const STORAGE_VERSION = 3;
const LS_KEY = "lesson_generator__workspace_v3";
const LEGACY_PACKAGE_KEY = "lesson_generator__engine_package_v1";

function createDefaultInput(): LessonInput {
  return {
    grade: "K",
    subject: "ELA",
    date: new Date().toISOString().slice(0, 10),
    lessonTitle: "",
    objective: "",
    essentialQuestion: "",
    textOrTopic: "",
    durationMinutes: 60,
    groupNotes: { tier3: "", tier2: "", onLevel: "", enrichment: "" },
    materials: "",
    manualStandardOverride: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isLessonInputLike(value: unknown): value is LessonInput {
  if (!isRecord(value)) return false;

  return (
    typeof value.grade === "string" &&
    typeof value.subject === "string" &&
    typeof value.date === "string" &&
    typeof value.lessonTitle === "string" &&
    typeof value.objective === "string" &&
    typeof value.textOrTopic === "string" &&
    typeof value.durationMinutes === "number"
  );
}

function isLessonPackageLike(value: unknown): value is EngineLessonPackage {
  if (!isRecord(value)) return false;
  if (!isRecord(value.meta) || !isLessonInputLike(value.input)) return false;

  return Array.isArray(value.standards) && Array.isArray(value.slides) && Array.isArray(value.lessonPlan);
}

function normalizeStoredWorkspace(raw: unknown): StoredWorkspace | null {
  if (!raw) return null;

  if (isLessonPackageLike(raw)) {
    return {
      version: STORAGE_VERSION,
      input: raw.input,
      package: raw,
    };
  }

  if (!isRecord(raw) || raw.version !== STORAGE_VERSION) return null;
  if (!isLessonInputLike(raw.input)) return null;
  if (raw.package !== null && !isLessonPackageLike(raw.package)) return null;

  return {
    version: STORAGE_VERSION,
    input: raw.input,
    package: raw.package,
  };
}

function safeLoadWorkspace(): StoredWorkspace | null {
  try {
    const rawWorkspace = localStorage.getItem(LS_KEY);
    if (rawWorkspace) {
      return normalizeStoredWorkspace(JSON.parse(rawWorkspace));
    }

    const rawLegacyPackage = localStorage.getItem(LEGACY_PACKAGE_KEY);
    if (!rawLegacyPackage) return null;

    return normalizeStoredWorkspace(JSON.parse(rawLegacyPackage));
  } catch {
    return null;
  }
}

function safeSaveWorkspace(workspace: StoredWorkspace | null) {
  try {
    if (!workspace) {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem(LEGACY_PACKAGE_KEY);
      return;
    }

    localStorage.setItem(LS_KEY, JSON.stringify(workspace));
    if (workspace.package) {
      localStorage.setItem(LEGACY_PACKAGE_KEY, JSON.stringify(workspace.package));
    } else {
      localStorage.removeItem(LEGACY_PACKAGE_KEY);
    }
  } catch {
    // ignore storage failures
  }
}

interface LessonStore {
  input: LessonInput;
  package: EngineLessonPackage | null;
  canonicalPackage: CanonicalLessonPackage | null;
  canonicalStorageNotice?: string;
  status: Status;
  errorMessage?: string;
  setInput: (patch: Partial<LessonInput>) => void;
  generate: (blueprint?: LessonBlueprint | null) => Promise<void>;
  reset: () => void;
  clearSaved: () => void;
}

export const useLessonStore = create<LessonStore>((set, get) => {
  const hydrated = typeof window !== "undefined" ? safeLoadWorkspace() : null;
  let canonicalStorageNotice: string | undefined;
  const hydratedCanonical = (() => {
    if (hasStoredLessonPackage()) {
      const loadedCanonical = loadLessonPackage();
      if (loadedCanonical.ok) return loadedCanonical.value;
      clearLessonPackage();
      canonicalStorageNotice = "Recovered invalid saved canonical lesson package.";
    }

    if (hydrated?.package) {
      const fallbackCanonical = toCanonicalLessonPackage(hydrated.package);
      saveLessonPackage(fallbackCanonical);
      return fallbackCanonical;
    }

    return null;
  })();

  const recoveredPackage =
    hydrated?.package ??
    (hydratedCanonical ? (fromCanonicalLessonPackage(hydratedCanonical) as EngineLessonPackage) : null);

  return {
    input: hydrated?.input ?? createDefaultInput(),
    package: recoveredPackage,
    canonicalPackage: hydratedCanonical,
    canonicalStorageNotice,
    status: recoveredPackage ? "ready" : "idle",
    errorMessage: undefined,

    setInput: (patch) => {
      const nextInput = { ...get().input, ...patch };
      const nextPackage = get().package;
      const nextCanonicalPackage = get().canonicalPackage;

      set({ input: nextInput });
      safeSaveWorkspace({
        version: STORAGE_VERSION,
        input: nextInput,
        package: nextPackage,
      });

      if (nextCanonicalPackage) {
        set({ canonicalPackage: nextCanonicalPackage });
      }
    },

    generate: async (blueprint) => {
      const input = get().input;
      console.log("[LG8 DEBUG] generate:start", {
        lessonTitle: input.lessonTitle,
        hasBlueprint: Boolean(blueprint),
        curriculumItems: blueprint?.curriculum?.coverageChecklist?.length ?? 0,
      });
      set({ status: "generating", errorMessage: undefined });

      try {
        const pkg = generateLesson(input, blueprint);
        const canonicalPkg = toCanonicalLessonPackage(pkg);

        console.log("[LG8 DEBUG] generate:built", {
          slides: Array.isArray((pkg as any)?.slides) ? (pkg as any).slides.length : null,
          lessonPlan: Array.isArray((pkg as any)?.lessonPlan) ? (pkg as any).lessonPlan.length : null,
          standards: Array.isArray((pkg as any)?.standards) ? (pkg as any).standards.length : null,
        });

        set({
          package: pkg,
          canonicalPackage: canonicalPkg,
          canonicalStorageNotice: undefined,
          status: "ready",
        });

        console.log("[LG8 DEBUG] generate:after-set", {
          hasPackage: Boolean(get().package),
          hasCanonicalPackage: Boolean(get().canonicalPackage),
          status: get().status,
        });

        safeSaveWorkspace({
          version: STORAGE_VERSION,
          input,
          package: pkg,
        });
        saveLessonPackage(canonicalPkg);

        console.log("[LG8 DEBUG] generate:after-save", {
          hasPackage: Boolean(get().package),
          hasCanonicalPackage: Boolean(get().canonicalPackage),
          status: get().status,
        });
      } catch (error) {
        console.error("[LG8 DEBUG] generate:error", error);
        set({
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Generation failed.",
        });
      }
    },

    reset: () => {
      set({
        input: createDefaultInput(),
        package: null,
        canonicalPackage: null,
        canonicalStorageNotice: undefined,
        status: "idle",
        errorMessage: undefined,
      });
      safeSaveWorkspace(null);
      clearLessonPackage();
    },

    clearSaved: () => {
      const currentInput = get().input;
      set({
        package: null,
        canonicalPackage: null,
        canonicalStorageNotice: undefined,
        status: "idle",
      });
      safeSaveWorkspace({
        version: STORAGE_VERSION,
        input: currentInput,
        package: null,
      });
      clearLessonPackage();
    },
  };
});



