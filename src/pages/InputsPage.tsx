import React from "react";
import { useNavigate } from "react-router-dom";
import { useLessonStore } from "../state/useLessonStore";

const COLORS = {
  page: "#F7F1E8",
  panel: "#FFFDF9",
  panelAlt: "#F9F4EC",
  border: "#D8CBB8",
  borderSoft: "#E8DDD0",
  text: "#2F2A24",
  muted: "#6F655B",
  heading: "#314B3A",
  accent: "#6E8B5E",
  accentDark: "#4E6542",
  blush: "#D9A58F",
  honey: "#E8C47A",
  shadow: "rgba(73, 52, 33, 0.08)",
};

function shellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: COLORS.page,
    color: COLORS.text,
  };
}

function wrapStyle(): React.CSSProperties {
  return {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 24,
  };
}

function cardStyle(): React.CSSProperties {
  return {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 22,
    padding: 18,
    boxShadow: `0 8px 24px ${COLORS.shadow}`,
    marginBottom: 18,
  };
}

function fieldLabelStyle(): React.CSSProperties {
  return {
    display: "block",
  };
}

function labelTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 800,
    color: COLORS.heading,
    marginBottom: 6,
  };
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "#FFFDFC",
    color: COLORS.text,
    outline: "none",
    boxSizing: "border-box",
  };
}

function textareaStyle(minHeight = 90): React.CSSProperties {
  return {
    ...inputStyle(),
    minHeight,
    resize: "vertical",
  };
}

function smallCardStyle(): React.CSSProperties {
  return {
    background: COLORS.panelAlt,
    border: `1px solid ${COLORS.borderSoft}`,
    borderRadius: 18,
    padding: 14,
  };
}

export default function InputsPage() {
  const navigate = useNavigate();
  const input = useLessonStore((s) => s.input);
  const patch = useLessonStore((s) => s.setInput);

  return (
    <div style={shellStyle()}>
      <div style={wrapStyle()}>
        <div
          style={{
            ...cardStyle(),
            background: "linear-gradient(135deg, #FFF8EF 0%, #F7F1E8 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 700 }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "#EEF5EA",
                  border: "1px solid #C9DABD",
                  fontSize: 12,
                  fontWeight: 800,
                  color: COLORS.accentDark,
                  marginBottom: 10,
                }}
              >
                Lesson Generator
              </div>

              <h1
                style={{
                  margin: "0 0 8px 0",
                  color: COLORS.heading,
                  fontSize: 34,
                  lineHeight: 1.1,
                }}
              >
                Build a lesson from teacher inputs
              </h1>

              <div style={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.55 }}>
                Start with the core lesson plan. You’ll upload curriculum and exemplar materials on the next step.
              </div>
            </div>

            <div style={{ ...smallCardStyle(), minWidth: 260 }}>
              <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 8 }}>
                What happens next
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div>1. Enter lesson details</div>
                <div>2. Add curriculum and exemplars</div>
                <div>3. Build the lesson package</div>
                <div>4. Review slides, plan, centers, and exports</div>
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontWeight: 900, fontSize: 20, color: COLORS.heading, marginBottom: 14 }}>
            Lesson Inputs
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>Grade</div>
              <select
                value={input.grade ?? "K"}
                onChange={(e) => patch({ grade: e.target.value as any })}
                style={inputStyle()}
              >
                <option value="K">K</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>

            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>Subject</div>
              <select
                value={input.subject ?? "ELA"}
                onChange={(e) => patch({ subject: e.target.value as any })}
                style={inputStyle()}
              >
                <option value="ELA">ELA</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="SS">SS</option>
              </select>
            </label>

            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>Date</div>
              <input
                type="date"
                value={input.date ?? ""}
                onChange={(e) => patch({ date: e.target.value })}
                style={inputStyle()}
              />
            </label>

            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>Duration (minutes)</div>
              <input
                type="number"
                min={1}
                value={input.durationMinutes ?? 60}
                onChange={(e) => patch({ durationMinutes: Number(e.target.value || 60) })}
                style={inputStyle()}
              />
            </label>

            <label style={{ ...fieldLabelStyle(), gridColumn: "1 / -1" }}>
              <div style={labelTitleStyle()}>Lesson Title</div>
              <input
                value={input.lessonTitle ?? ""}
                onChange={(e) => patch({ lessonTitle: e.target.value })}
                style={inputStyle()}
                placeholder="e.g., CVC Words"
              />
            </label>

            <label style={{ ...fieldLabelStyle(), gridColumn: "1 / -1" }}>
              <div style={labelTitleStyle()}>Objective</div>
              <input
                value={input.objective ?? ""}
                onChange={(e) => patch({ objective: e.target.value })}
                style={inputStyle()}
                placeholder="Students will..."
              />
            </label>

            <label style={{ ...fieldLabelStyle(), gridColumn: "1 / -1" }}>
              <div style={labelTitleStyle()}>Essential Question (optional)</div>
              <input
                value={input.essentialQuestion ?? ""}
                onChange={(e) => patch({ essentialQuestion: e.target.value })}
                style={inputStyle()}
                placeholder="e.g., How can we tell where a story takes place?"
              />
            </label>

            <label style={{ ...fieldLabelStyle(), gridColumn: "1 / -1" }}>
              <div style={labelTitleStyle()}>Text / Topic</div>
              <textarea
                value={input.textOrTopic ?? ""}
                onChange={(e) => patch({ textOrTopic: e.target.value })}
                style={textareaStyle(100)}
                placeholder="What is the lesson about? (decodable, skill, topic, etc.)"
              />
            </label>

            <label style={{ ...fieldLabelStyle(), gridColumn: "1 / -1" }}>
              <div style={labelTitleStyle()}>Materials (optional)</div>
              <textarea
                value={input.materials ?? ""}
                onChange={(e) => patch({ materials: e.target.value })}
                style={textareaStyle(80)}
                placeholder="Books, decodables, whiteboards, counters, etc."
              />
            </label>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontWeight: 900, fontSize: 20, color: COLORS.heading, marginBottom: 6 }}>
            Group Notes (optional)
          </div>
          <div style={{ color: COLORS.muted, marginBottom: 14, lineHeight: 1.5 }}>
            Capture what each group can do now, where they need support, or how you want to differentiate.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>Tier 3</div>
              <textarea
                value={input.groupNotes?.tier3 ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier3: e.target.value } })}
                style={textareaStyle(90)}
              />
            </label>

            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>Tier 2</div>
              <textarea
                value={input.groupNotes?.tier2 ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier2: e.target.value } })}
                style={textareaStyle(90)}
              />
            </label>

            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>On Level</div>
              <textarea
                value={input.groupNotes?.onLevel ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), onLevel: e.target.value } })}
                style={textareaStyle(90)}
              />
            </label>

            <label style={fieldLabelStyle()}>
              <div style={labelTitleStyle()}>Enrichment</div>
              <textarea
                value={input.groupNotes?.enrichment ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), enrichment: e.target.value } })}
                style={textareaStyle(90)}
              />
            </label>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontWeight: 900, fontSize: 20, color: COLORS.heading, marginBottom: 6 }}>
            Standards
          </div>
          <div style={{ color: COLORS.muted, marginBottom: 12, lineHeight: 1.5 }}>
            Leave this blank to let the app auto-detect Florida B.E.S.T. standards from the lesson details.
          </div>

          <label style={fieldLabelStyle()}>
            <div style={labelTitleStyle()}>Manual Standard Override (optional)</div>
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
              style={inputStyle()}
              placeholder="ELA.K.R.1.1, ELA.K.F.2.1 ..."
            />
          </label>
        </div>

        <div
          style={{
            ...cardStyle(),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: COLORS.muted, lineHeight: 1.5 }}>
            When you continue, you’ll upload lesson materials and exemplars that can change the lesson structure and wording.
          </div>

          <button
            onClick={() => navigate("/materials")}
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              border: `1px solid ${COLORS.accent}`,
              background: COLORS.accent,
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Continue to Materials Upload ?
          </button>
        </div>
      </div>
    </div>
  );
}
