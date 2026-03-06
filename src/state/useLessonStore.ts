import { create } from "zustand";
import type { LessonInput, LessonPackage } from "../engine/types";
import type { LessonBlueprint } from "../engine/blueprint/types";
import { generateLesson } from "../engine/generateLesson";

type Status = "idle" | "generating" | "ready" | "error";

const LS_KEY = "lesson_generator__package_v2";

function safeLoadPackage(): LessonPackage | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LessonPackage;
  } catch {
    return null;
  }
}

function safeSavePackage(pkg: LessonPackage | null) {
  try {
    if (!pkg) {
      localStorage.removeItem(LS_KEY);
      return;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(pkg));
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

const defaultInput: LessonInput = {
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

export const useLessonStore = create<LessonStore>((set, get) => {
  const hydrated = typeof window !== "undefined" ? safeLoadPackage() : null;

  return {
    input: hydrated?.input ?? defaultInput,
    package: hydrated ?? null,
    status: hydrated ? "ready" : "idle",
    errorMessage: undefined,

    setInput: (patch) => set({ input: { ...get().input, ...patch } }),

    generate: async (blueprint) => {
      const input = get().input;
      set({ status: "generating", errorMessage: undefined });
      try {
        const pkg = generateLesson(input, blueprint);
        set({ package: pkg, status: "ready" });
        safeSavePackage(pkg);
      } catch (e: any) {
        set({ status: "error", errorMessage: e?.message ?? "Generation failed." });
      }
    },

    reset: () => {
      set({ input: defaultInput, package: null, status: "idle", errorMessage: undefined });
      safeSavePackage(null);
    },

    clearSaved: () => {
      safeSavePackage(null);
      set({ package: null, status: "idle" });
    },
  };
});
