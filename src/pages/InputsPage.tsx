import React from "react";
import { useNavigate } from "react-router-dom";
import { useLessonStore } from "../state/useLessonStore";

export default function InputsPage() {
  const navigate = useNavigate();

  const input = useLessonStore((s) => s.input);
  const setInput = useLessonStore((s) => s.setInput);

  const patch = (p: any) => setInput(p);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>Lesson Generator — Inputs</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label>
          <div style={{ fontWeight: 700 }}>Date</div>
          <input
            value={input.date ?? ""}
            onChange={(e) => patch({ date: e.target.value })}
            style={{ width: "100%", padding: 10 }}
            placeholder="YYYY-MM-DD"
          />
        </label>

        <label>
          <div style={{ fontWeight: 700 }}>Duration (minutes)</div>
          <input
            type="number"
            value={Number(input.durationMinutes ?? 60)}
            onChange={(e) => patch({ durationMinutes: Number(e.target.value || 0) })}
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 700 }}>Grade</div>
          <select
            value={input.grade ?? "K"}
            onChange={(e) => patch({ grade: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          >
            <option value="K">K</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>

        <label>
          <div style={{ fontWeight: 700 }}>Subject</div>
          <select
            value={input.subject ?? "ELA"}
            onChange={(e) => patch({ subject: e.target.value })}
            style={{ width: "100%", padding: 10 }}
          >
            <option value="ELA">ELA</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="SS">SS</option>
          </select>
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700 }}>Lesson Title</div>
          <input
            value={input.lessonTitle ?? ""}
            onChange={(e) => patch({ lessonTitle: e.target.value })}
            style={{ width: "100%", padding: 10 }}
            placeholder="e.g., Blending CVC Words / Identify Setting"
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700 }}>Objective</div>
          <input
            value={input.objective ?? ""}
            onChange={(e) => patch({ objective: e.target.value })}
            style={{ width: "100%", padding: 10 }}
            placeholder="Students will..."
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700 }}>Essential Question (optional)</div>
          <input
            value={input.essentialQuestion ?? ""}
            onChange={(e) => patch({ essentialQuestion: e.target.value })}
            style={{ width: "100%", padding: 10 }}
            placeholder="e.g., How can we tell where a story takes place?"
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700 }}>Text / Topic</div>
          <textarea
            value={input.textOrTopic ?? ""}
            onChange={(e) => patch({ textOrTopic: e.target.value })}
            style={{ width: "100%", padding: 10, minHeight: 90 }}
            placeholder="What is the lesson about? (decodable, skill, topic, etc.)"
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700 }}>Materials (optional)</div>
          <textarea
            value={input.materials ?? ""}
            onChange={(e) => patch({ materials: e.target.value })}
            style={{ width: "100%", padding: 10, minHeight: 70 }}
            placeholder="Books, decodables, whiteboards, counters, etc."
          />
        </label>

        <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #eee", paddingTop: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Group Notes (optional)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700 }}>Tier 3</div>
              <textarea
                value={input.groupNotes?.tier3 ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier3: e.target.value } })}
                style={{ width: "100%", padding: 10, minHeight: 70 }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700 }}>Tier 2</div>
              <textarea
                value={input.groupNotes?.tier2 ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier2: e.target.value } })}
                style={{ width: "100%", padding: 10, minHeight: 70 }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700 }}>On Level</div>
              <textarea
                value={input.groupNotes?.onLevel ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), onLevel: e.target.value } })}
                style={{ width: "100%", padding: 10, minHeight: 70 }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700 }}>Enrichment</div>
              <textarea
                value={input.groupNotes?.enrichment ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), enrichment: e.target.value } })}
                style={{ width: "100%", padding: 10, minHeight: 70 }}
              />
            </label>
          </div>
        </div>

        <label style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontWeight: 700 }}>Manual Standard Override (optional)</div>
          <input
            value={(input.manualStandardOverride ?? []).join(", ")}
            onChange={(e) =>
              patch({
                manualStandardOverride: String(e.target.value || "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            style={{ width: "100%", padding: 10 }}
            placeholder="ELA.K.R.1.1, ELA.K.F.2.1 ..."
          />
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
            Leave blank to auto-detect Florida B.E.S.T. standards.
          </div>
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/materials")}
          style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #111" }}
        >
          Continue to Materials Upload →
        </button>
      </div>
    </div>
  );
}
