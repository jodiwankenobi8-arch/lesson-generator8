import { create } from "zustand";
import type { LessonInput, LessonPackage } from "../engine/types";
import type { LessonBlueprint } from "../engine/blueprint/types";
import { generateLesson } from "../engine/generateLesson";

type Status = "idle" | "generating" | "ready" | "error";

type StoredWorkspace = {
  version: number;
  input: LessonInput;
  package: LessonPackage | null;
};

const STORAGE_VERSION = 3;
const LS_KEY = "lesson_generator__workspace_v3";
const LEGACY_PACKAGE_KEY = "lesson_generator__package_v2";

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

function isLessonPackageLike(value: unknown): value is LessonPackage {
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
  package: LessonPackage | null;
  status: Status;
  errorMessage?: string;
  setInput: (patch: Partial<LessonInput>) => void;
  generate: (blueprint?: LessonBlueprint | null) => Promise<void>;
  reset: () => void;
  clearSaved: () => void;
}

export const useLessonStore = create<LessonStore>((set, get) => {
  const hydrated = typeof window !== "undefined" ? safeLoadWorkspace() : null;

  return {
    input: hydrated?.input ?? createDefaultInput(),
    package: hydrated?.package ?? null,
    status: hydrated?.package ? "ready" : "idle",
    errorMessage: undefined,

    setInput: (patch) => {
      const nextInput = { ...get().input, ...patch };
      const nextPackage = get().package;

      set({ input: nextInput });
      safeSaveWorkspace({
        version: STORAGE_VERSION,
        input: nextInput,
        package: nextPackage,
      });
    },

    generate: async (blueprint) => {
      const input = get().input;
      set({ status: "generating", errorMessage: undefined });
      try {
        const pkg = generateLesson(input, blueprint);
        set({ package: pkg, status: "ready" });
        safeSaveWorkspace({
          version: STORAGE_VERSION,
          input,
          package: pkg,
        });
      } catch (error) {
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
        status: "idle",
        errorMessage: undefined,
      });
      safeSaveWorkspace(null);
    },

    clearSaved: () => {
      const currentInput = get().input;
      set({ package: null, status: "idle" });
      safeSaveWorkspace({
        version: STORAGE_VERSION,
        input: currentInput,
        package: null,
      });
    },
  };
});
