import { useEffect, useState } from "react";
import { DeckPlayer } from "./DeckPlayer";
import type { DeckPlan } from "../types/slides";
import { ORCHARD_COLORS } from "../pages/orchardUi";

interface TeachModeShellProps {
  deckPlan: DeckPlan;
  onExit: () => void;
}

type EngagementPrompt =
  | "turn-talk"
  | "say-with-me"
  | "show-fingers"
  | "hands-on-head"
  | "stand-if-rhymes"
  | null;

const ENGAGEMENT_PROMPTS: Record<Exclude<EngagementPrompt, null>, string> = {
  "turn-talk": "Turn and talk with a partner.",
  "say-with-me": "Say it with me.",
  "show-fingers": "Show me on your fingers.",
  "hands-on-head": "Hands on head if you hear it.",
  "stand-if-rhymes": "Stand if it rhymes.",
};

const ENGAGEMENT_BUTTONS: Array<{
  key: Exclude<EngagementPrompt, null>;
  short: string;
  title: string;
}> = [
  { key: "turn-talk", short: "Talk", title: "Turn and Talk" },
  { key: "say-with-me", short: "Echo", title: "Say it with me" },
  { key: "show-fingers", short: "Fingers", title: "Show me on your fingers" },
  { key: "hands-on-head", short: "Listen", title: "Hands on head if you hear it" },
  { key: "stand-if-rhymes", short: "Rhyme", title: "Stand if it rhymes" },
];

export function TeachModeShell({ deckPlan, onExit }: TeachModeShellProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEngagement, setShowEngagement] = useState<EngagementPrompt>(null);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(!!document.fullscreenElement);
    }
  };

  const handleExit = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } finally {
      onExit();
    }
  };

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    if (!showEngagement) return;
    const timer = setTimeout(() => setShowEngagement(null), 2800);
    return () => clearTimeout(timer);
  }, [showEngagement]);

  const ghostButton = (primary = false): React.CSSProperties => ({
    padding: "10px 14px",
    borderRadius: 16,
    border: primary
      ? `1px solid ${ORCHARD_COLORS.accentDark}`
      : "1px solid rgba(255,255,255,0.18)",
    background: primary
      ? "linear-gradient(180deg, #6E8B6B 0%, #587053 100%)"
      : "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)",
    color: "#FFFFFF",
    fontWeight: 800,
    letterSpacing: "0.01em",
    boxShadow: primary ? "0 10px 20px rgba(0,0,0,0.18)" : "none",
    cursor: "pointer",
  });

  return (
    <div
      className="teach-mode-shell h-screen"
      style={{
        background: "linear-gradient(180deg, #1F2A20 0%, #182119 100%)",
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            background: "linear-gradient(180deg, rgba(255,250,244,0.18) 0%, rgba(255,250,244,0.10) 100%)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 24,
            padding: "14px 16px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
          }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div style={{ color: "#FFFFFF" }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 900,
                  opacity: 0.82,
                  marginBottom: 4,
                }}
              >
                Teach Mode
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif',
                }}
              >
                Present the lesson clearly
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={toggleFullscreen} style={ghostButton(false)}>
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
              <button onClick={handleExit} style={ghostButton(true)}>
                Exit Teach Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <div
          style={{
            background: "linear-gradient(180deg, rgba(255,250,244,0.16) 0%, rgba(255,250,244,0.10) 100%)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 24,
            padding: 12,
            backdropFilter: "blur(14px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
            display: "grid",
            gap: 8,
            minWidth: 112,
          }}
        >
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 900,
              opacity: 0.82,
              marginBottom: 2,
            }}
          >
            Engagement
          </div>

          {ENGAGEMENT_BUTTONS.map((button) => (
            <button
              key={button.key}
              onClick={() => setShowEngagement(button.key)}
              title={button.title}
              style={{
                padding: "10px 12px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.14)",
                background:
                  showEngagement === button.key
                    ? "linear-gradient(180deg, #6E8B6B 0%, #587053 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)",
                color: "#FFFFFF",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: showEngagement === button.key ? "0 10px 20px rgba(0,0,0,0.18)" : "none",
              }}
            >
              {button.short}
            </button>
          ))}
        </div>
      </div>

      {showEngagement && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none"
          style={{ background: "rgba(24,33,25,0.30)" }}
        >
          <div
            style={{
              background: "#FFFDF9",
              color: ORCHARD_COLORS.heading,
              border: `1px solid ${ORCHARD_COLORS.borderStrong}`,
              borderRadius: 32,
              padding: "26px 34px",
              minWidth: 360,
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 900,
                color: ORCHARD_COLORS.cranberry,
                marginBottom: 8,
              }}
            >
              Cue
            </div>
            <div
              style={{
                fontSize: 36,
                lineHeight: 1.15,
                fontWeight: 800,
                fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif',
              }}
            >
              {ENGAGEMENT_PROMPTS[showEngagement]}
            </div>
          </div>
        </div>
      )}

      <DeckPlayer deckPlan={deckPlan} teachMode={true} />

      <div className="fixed bottom-4 left-4 z-50">
        <div
          style={{
            background: "linear-gradient(180deg, rgba(255,250,244,0.16) 0%, rgba(255,250,244,0.10) 100%)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 20,
            padding: "12px 14px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
            color: "#FFFFFF",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 900,
              opacity: 0.82,
              marginBottom: 4,
            }}
          >
            Keyboard
          </div>
          <div>Space / →: Next slide</div>
          <div>←: Previous slide</div>
          <div>Home / End: Jump to start or finish</div>
        </div>
      </div>
    </div>
  );
}
