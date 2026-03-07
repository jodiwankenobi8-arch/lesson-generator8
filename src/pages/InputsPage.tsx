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
import { OrchardBlossomCorner, OrchardGinghamCorner, OrchardMushroomCluster } from "./orchardDecor";

function plannerSheetStyle(background = "#FFFDF9"): React.CSSProperties {
  return {
    ...orchardSoftCardStyle(background),
    border: `1px solid ${COLORS.border}`,
    padding: 18,
    boxShadow: "0 10px 22px rgba(47,47,47,0.05)",
    overflow: "hidden",
  };
}

function plannerTabStyle(background: string, color: string, border = COLORS.borderStrong): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "15px 16px 16px 12px",
    background,
    color,
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    border: `1px solid ${border}`,
    boxShadow: "0 4px 10px rgba(47,47,47,0.04)",
  };
}

function pinnedNoteStyle(): React.CSSProperties {
  return {
    ...plannerSheetStyle("#FFF8EE"),
    border: `1px solid ${COLORS.borderStrong}`,
    transform: "rotate(-1.2deg)",
    alignSelf: "start",
  };
}

function miniPaperStyle(background = "#FFFDF9"): React.CSSProperties {
  return {
    ...orchardSoftCardStyle(background),
    border: `1px solid ${COLORS.border}`,
    padding: 14,
    minHeight: 110,
  };
}

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
          <div style={{ position: "absolute", bottom: 10, left: 12, pointerEvents: "none", opacity: 0.74 }}>
            <OrchardGinghamCorner size={72} />
          </div>
          <div style={{ position: "absolute", bottom: 18, right: 22, pointerEvents: "none", opacity: 0.82 }}>
            <OrchardMushroomCluster size={84} flip />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.55fr) minmax(270px, 0.88fr)",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div style={plannerSheetStyle("#FFFDF9")}>
              <div style={orchardRibbonHeaderStyle()}>Inputs</div>
              <div style={orchardStitchDividerStyle()} />
              <h1 style={orchardHeroTitleStyle()}>Open the planner for the day</h1>
              <div style={{ ...orchardHelpTextStyle(), fontSize: 15, maxWidth: 760, marginBottom: 18 }}>
                Start with the lesson basics, the teaching goal, and the group or standards notes you already know.
                The next step brings in curriculum materials and exemplars that can reshape wording, structure, pacing,
                and output style.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: 12,
                }}
              >
                <div style={miniPaperStyle("#FFF9F2")}>
                  <div style={plannerTabStyle("linear-gradient(180deg, #F2C078 0%, #D9A85F 100%)", "#3F3120", COLORS.warnBorder)}>
                    Core fields
                  </div>
                  <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 18, margin: "10px 0 6px" }}>
                    Title + objective + topic
                  </div>
                  <div style={orchardHelpTextStyle()}>
                    These are the anchors the generator trusts before it reads uploaded sources.
                  </div>
                </div>

                <div style={miniPaperStyle("#FFFDF9")}>
                  <div style={plannerTabStyle("linear-gradient(180deg, #EEF5EA 0%, #E4F0DE 100%)", COLORS.heading, COLORS.successBorder)}>
                    Standards
                  </div>
                  <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 18, margin: "10px 0 6px" }}>
                    Auto-detect first
                  </div>
                  <div style={orchardHelpTextStyle()}>
                    Florida B.E.S.T. should come from the known dataset, with override only when you want it.
                  </div>
                </div>

                <div style={miniPaperStyle("#FFF7F4")}>
                  <div style={plannerTabStyle("linear-gradient(180deg, #F7D6D0 0%, #EFC5BE 100%)", COLORS.cranberry, COLORS.borderStrong)}>
                    Teacher trust
                  </div>
                  <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 18, margin: "10px 0 6px" }}>
                    Ask when signals conflict
                  </div>
                  <div style={orchardHelpTextStyle()}>
                    If later materials pull in different directions, the app should surface that instead of guessing.
                  </div>
                </div>
              </div>
            </div>

            <div style={pinnedNoteStyle()}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: "#D9C7B5",
                  boxShadow: "inset 0 2px 3px rgba(47,47,47,0.15)",
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 900,
                  color: COLORS.cranberry,
                  marginBottom: 6,
                }}
              >
                What happens next
              </div>
              <div
                style={{
                  color: COLORS.heading,
                  fontWeight: 900,
                  fontSize: 22,
                  marginBottom: 10,
                }}
              >
                Gather the lesson thread first
              </div>

              <ol
                style={{
                  margin: "0 0 14px 18px",
                  padding: 0,
                  lineHeight: 1.8,
                  color: COLORS.text,
                }}
              >
                <li>Set the lesson details and teaching focus.</li>
                <li>Add group notes and optional standards override.</li>
                <li>Move to Materials to sort curriculum and exemplars.</li>
                <li>Generate the package after the source desk looks right.</li>
              </ol>

              <div
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${missingCore ? COLORS.warnBorder : COLORS.successBorder}`,
                  background: missingCore ? "#FFF6E8" : "#F3F8F1",
                  color: COLORS.heading,
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {missingCore ? "Some core fields still need attention" : "Core fields look ready for Materials"}
              </div>
            </div>
          </div>
        </div>

        <div style={orchardCardStyle("#FFF8F1")}>
          <div style={{ position: "absolute", top: 14, right: 18, pointerEvents: "none", opacity: 0.8 }}>
            <OrchardGinghamCorner size={66} flip />
          </div>

          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Planner Pages</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 16 }}>
            Instead of isolated software cards, these are the main pages the lesson builder uses before it sees your uploaded materials.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(250px, 0.9fr) minmax(0, 1.3fr)",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div style={plannerSheetStyle("#FFFDF9")}>
              <div style={plannerTabStyle("linear-gradient(180deg, #F7D6D0 0%, #EFC5BE 100%)", COLORS.cranberry)}>
                Day-at-a-Glance
              </div>
              <div style={{ ...orchardHelpTextStyle(), marginTop: 12, marginBottom: 14 }}>
                These are the practical lesson settings that shape the frame around the content.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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

            <div style={plannerSheetStyle("#FFFDF9")}>
              <div style={plannerTabStyle("linear-gradient(180deg, #EEF5EA 0%, #E4F0DE 100%)", COLORS.heading, COLORS.successBorder)}>
                Teaching Focus
              </div>
              <div style={{ ...orchardHelpTextStyle(), marginTop: 12, marginBottom: 14 }}>
                This is the heart of the lesson. Title, objective, and text or topic are the strongest inputs to complete first.
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
                    style={orchardTextareaStyle(118)}
                    placeholder="What is the lesson about? (decodable, skill, topic, etc.)"
                  />
                </label>

                <label style={{ display: "block" }}>
                  <div style={orchardLabelTitleStyle()}>Materials (optional)</div>
                  <textarea
                    value={input.materials ?? ""}
                    onChange={(e) => patch({ materials: e.target.value })}
                    style={orchardTextareaStyle(92)}
                    placeholder="Books, decodables, whiteboards, counters, etc."
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div style={orchardCardStyle("#FFFDF9")}>
          <div style={{ position: "absolute", bottom: 12, left: 14, pointerEvents: "none", opacity: 0.84 }}>
            <OrchardMushroomCluster size={90} />
          </div>

          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Differentiation + Standards</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 16 }}>
            Capture group thinking and any explicit standard override as part of the same planning spread.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.45fr) minmax(250px, 0.8fr)",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div style={plannerSheetStyle("#FFFDF9")}>
              <div style={plannerTabStyle("linear-gradient(180deg, #F2C078 0%, #D9A85F 100%)", "#3F3120", COLORS.warnBorder)}>
                Small-Group Notes
              </div>
              <div style={{ ...orchardHelpTextStyle(), marginTop: 12, marginBottom: 14 }}>
                Capture what each group can do now, where support is needed, or how you want the lesson differentiated.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 14,
                }}
              >
                <label style={{ display: "block" }}>
                  <div style={orchardLabelTitleStyle()}>Tier 3</div>
                  <textarea
                    value={input.groupNotes?.tier3 ?? ""}
                    onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier3: e.target.value } })}
                    style={orchardTextareaStyle(96)}
                  />
                </label>

                <label style={{ display: "block" }}>
                  <div style={orchardLabelTitleStyle()}>Tier 2</div>
                  <textarea
                    value={input.groupNotes?.tier2 ?? ""}
                    onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), tier2: e.target.value } })}
                    style={orchardTextareaStyle(96)}
                  />
                </label>

                <label style={{ display: "block" }}>
                  <div style={orchardLabelTitleStyle()}>On Level</div>
                  <textarea
                    value={input.groupNotes?.onLevel ?? ""}
                    onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), onLevel: e.target.value } })}
                    style={orchardTextareaStyle(96)}
                  />
                </label>

                <label style={{ display: "block" }}>
                  <div style={orchardLabelTitleStyle()}>Enrichment</div>
                  <textarea
                    value={input.groupNotes?.enrichment ?? ""}
                    onChange={(e) => patch({ groupNotes: { ...(input.groupNotes ?? {}), enrichment: e.target.value } })}
                    style={orchardTextareaStyle(96)}
                  />
                </label>
              </div>
            </div>

            <div style={pinnedNoteStyle()}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: "#D9C7B5",
                  boxShadow: "inset 0 2px 3px rgba(47,47,47,0.15)",
                  marginBottom: 10,
                }}
              />
              <div style={plannerTabStyle("linear-gradient(180deg, #EEF5EA 0%, #E4F0DE 100%)", COLORS.heading, COLORS.successBorder)}>
                Standards + Override
              </div>
              <div style={{ ...orchardHelpTextStyle(), marginTop: 12, marginBottom: 12 }}>
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

              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 16,
                  border: `1px solid ${COLORS.border}`,
                  background: "#FFFDF9",
                  color: COLORS.muted,
                  lineHeight: 1.6,
                  fontSize: 13,
                }}
              >
                The goal is confidence-ranked detection first, with a manual path only when you want to override.
              </div>
            </div>
          </div>
        </div>

        {missingCore && (
          <div
            style={{
              ...pinnedNoteStyle(),
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: 12,
              background: "#FFF8EE",
              border: `1px solid ${COLORS.warnBorder}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 900,
                color: COLORS.cranberry,
                marginBottom: 6,
              }}
            >
              Before you continue
            </div>
            <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 22, marginBottom: 8 }}>
              The strongest runs still need three anchors
            </div>
            <div style={orchardHelpTextStyle()}>
              Add a lesson title, objective, and text or topic for the clearest foundation. You can still fill in the rest later.
            </div>
          </div>
        )}

        <div style={orchardCardStyle("#FFF9F2")}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) auto",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div>
              <div style={orchardSectionTitleStyle()}>Next stop: the sorting desk</div>
              <div style={orchardHelpTextStyle()}>
                When you continue, you'll upload curriculum materials and exemplars that can change the lesson structure,
                pacing, and wording before the package is built.
              </div>
            </div>

            <button onClick={() => navigate("/materials")} style={orchardPrimaryButtonStyle(false)}>
              Continue to Materials -&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
