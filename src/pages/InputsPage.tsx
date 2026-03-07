import React from "react";
import { useNavigate } from "react-router-dom";
import { useLessonStore } from "../state/useLessonStore";
import {
  ORCHARD_COLORS as COLORS,
  orchardShellStyle,
  orchardWrapStyle,
  orchardCardStyle,
  orchardHeroCardStyle,
  orchardSoftCardStyle,
  orchardSectionTitleStyle,
  orchardLabelTitleStyle,
  orchardHelpTextStyle,
  orchardInputStyle,
  orchardTextareaStyle,
  orchardPrimaryButtonStyle,
  orchardRibbonHeaderStyle,
  orchardHeroTitleStyle,
  orchardStitchDividerStyle,
} from "./orchardUi";
import { WizardProgress } from "./WizardProgress";
import { OrchardBlossomCorner, OrchardGinghamCorner } from "./orchardDecor";

export default function InputsPage() {
  const navigate = useNavigate();
  const input = useLessonStore((s) => s.input);
  const patch = useLessonStore((s) => s.setInput);

  const missingCore =
    !(input.lessonTitle ?? "").trim() ||
    !(input.objective ?? "").trim() ||
    !(input.textOrTopic ?? "").trim();

  return (
    <div style={orchardShellStyle()}>
      <div style={orchardWrapStyle()}>
        <WizardProgress current="inputs" />

        <div style={orchardHeroCardStyle()}>
          <div style={{ position: "absolute", top: 12, right: 14, pointerEvents: "none", opacity: 0.92 }}>
            <OrchardBlossomCorner size={118} />
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 12, pointerEvents: "none", opacity: 0.72 }}>
            <OrchardGinghamCorner size={68} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div style={orchardRibbonHeaderStyle()}>Inputs</div>
              <div style={orchardStitchDividerStyle()} />
              <h1 style={orchardHeroTitleStyle()}>Open the planner for the day</h1>
              <div style={{ ...orchardHelpTextStyle(), fontSize: 15, maxWidth: 680 }}>
                Start with the lesson basics, the teaching goal, and any group or standards notes you already know.
                On the next step, you�ll add curriculum materials and exemplars that can shape structure, wording,
                pacing, and output style.
              </div>
            </div>

            <div style={{ ...orchardSoftCardStyle("#FFFDF9"), minWidth: 270, maxWidth: 320 }}>
              <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 8 }}>
                What happens next
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.65 }}>
                <div>1. Enter lesson details</div>
                <div>2. Add curriculum and exemplars</div>
                <div>3. Build the lesson package</div>
                <div>4. Review slides, plan, centers, and exports</div>
              </div>
            </div>
          </div>
        </div>

        <div style={orchardCardStyle()}>
          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Day-at-a-Glance</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 14 }}>
            These are the core inputs the generator uses to anchor the lesson before it sees uploaded materials.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Grade</div>
              <select
                value={input.grade ?? "K"}
                onChange={(e) => patch({ grade: e.target.value as any })}
                style={orchardInputStyle()}
              >
                <option value="K">K</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Subject</div>
              <select
                value={input.subject ?? "ELA"}
                onChange={(e) => patch({ subject: e.target.value as any })}
                style={orchardInputStyle()}
              >
                <option value="ELA">ELA</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="SS">SS</option>
              </select>
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Date</div>
              <input
                type="date"
                value={input.date ?? ""}
                onChange={(e) => patch({ date: e.target.value })}
                style={orchardInputStyle()}
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Duration (minutes)</div>
              <input
                type="number"
                min={1}
                value={input.durationMinutes ?? 60}
                onChange={(e) => patch({ durationMinutes: Number(e.target.value || 60) })}
                style={orchardInputStyle()}
              />
            </label>
          </div>
        </div>

        <div style={orchardCardStyle()}>
          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Teaching Focus</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 14 }}>
            This is the heart of the lesson. Title, objective, and text or topic are the most important fields to complete.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 14,
            }}
          >
            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Lesson Title</div>
              <input
                value={input.lessonTitle ?? ""}
                onChange={(e) => patch({ lessonTitle: e.target.value })}
                style={orchardInputStyle()}
                placeholder="e.g., CVC Words"
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Objective</div>
              <input
                value={input.objective ?? ""}
                onChange={(e) => patch({ objective: e.target.value })}
                style={orchardInputStyle()}
                placeholder="Students will..."
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Essential Question (optional)</div>
              <input
                value={input.essentialQuestion ?? ""}
                onChange={(e) => patch({ essentialQuestion: e.target.value })}
                style={orchardInputStyle()}
                placeholder="e.g., How can we tell where a story takes place?"
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Text / Topic</div>
              <textarea
                value={input.textOrTopic ?? ""}
                onChange={(e) => patch({ textOrTopic: e.target.value })}
                style={orchardTextareaStyle(110)}
                placeholder="What is the lesson about? (decodable, skill, topic, etc.)"
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Materials (optional)</div>
              <textarea
                value={input.materials ?? ""}
                onChange={(e) => patch({ materials: e.target.value })}
                style={orchardTextareaStyle(86)}
                placeholder="Books, decodables, whiteboards, counters, etc."
              />
            </label>
          </div>
        </div>

        <div style={orchardCardStyle()}>
          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Small-Group Notes (optional)</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 14 }}>
            Capture what each group can do now, where they need support, or how you want to differentiate.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Tier 3</div>
              <textarea
                value={input.groupNotes?.tier3 ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier3: e.target.value } })}
                style={orchardTextareaStyle(90)}
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Tier 2</div>
              <textarea
                value={input.groupNotes?.tier2 ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier2: e.target.value } })}
                style={orchardTextareaStyle(90)}
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>On Level</div>
              <textarea
                value={input.groupNotes?.onLevel ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), onLevel: e.target.value } })}
                style={orchardTextareaStyle(90)}
              />
            </label>

            <label style={{ display: "block" }}>
              <div style={orchardLabelTitleStyle()}>Enrichment</div>
              <textarea
                value={input.groupNotes?.enrichment ?? ""}
                onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), enrichment: e.target.value } })}
                style={orchardTextareaStyle(90)}
              />
            </label>
          </div>
        </div>

        <div style={orchardCardStyle()}>
          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Standards + Override</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 12 }}>
            Leave this blank to let the app auto-detect Florida B.E.S.T. standards from the lesson details.
          </div>

          <label style={{ display: "block" }}>
            <div style={orchardLabelTitleStyle()}>Manual Standard Override (optional)</div>
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
              style={orchardInputStyle()}
              placeholder="ELA.K.R.1.1, ELA.K.F.2.1 ..."
            />
          </label>
        </div>

        {missingCore && (
          <div
            style={{
              ...orchardCardStyle(),
              background: "#FFF8EE",
              border: `1px solid ${COLORS.warnBorder}`,
            }}
          >
            <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 6 }}>
              Before you continue
            </div>
            <div style={orchardHelpTextStyle()}>
              The strongest lesson runs usually include a lesson title, objective, and text or topic. You can still fill in the rest later.
            </div>
          </div>
        )}

        <div
          style={{
            ...orchardCardStyle(),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={orchardHelpTextStyle()}>
            When you continue, you�ll upload lesson materials and exemplars that can change the lesson structure and wording.
          </div>

          <button
            onClick={() => navigate("/materials")}
            style={orchardPrimaryButtonStyle(false)}
          >
            Continue to Materials -&gt;
          </button>
        </div>
      </div>
    </div>
  );
}

