import React from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import AppRouter from "./app/AppRouter";
import { orchardTokens } from "./design/orchardTokens";

function AppErrorFallback({ error }: FallbackProps) {
  return (
    <div
      role="alert"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: orchardTokens.colors.page,
        color: orchardTokens.colors.text,
        fontFamily: orchardTokens.typography.bodyStack,
      }}
    >
      <div
        style={{
          width: "min(680px, 100%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,249,243,1) 100%)",
          border: `1px solid ${orchardTokens.colors.border}`,
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 14px 30px rgba(47,47,47,0.06)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: 999,
            background: "#FFF1EE",
            border: `1px solid ${orchardTokens.colors.borderStrong}`,
            color: orchardTokens.colors.cranberry,
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          App recovery
        </div>

        <h1
          style={{
            margin: "0 0 12px",
            color: orchardTokens.colors.heading,
            fontSize: 34,
            lineHeight: 1.1,
            fontFamily: orchardTokens.typography.headingStack,
          }}
        >
          Something went wrong, but your work may still be recoverable.
        </h1>

        <p style={{ margin: "0 0 16px", lineHeight: 1.7 }}>
          The app hit an unexpected error. Try reloading first. Draft lesson input and the last generated package are now
          stored separately to reduce the chance of losing work after a crash.
        </p>

        <details style={{ marginBottom: 18 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Technical details</summary>
          <pre
            style={{
              marginTop: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#FFFDF9",
              border: `1px solid ${orchardTokens.colors.borderSoft}`,
              borderRadius: 16,
              padding: 14,
              overflowX: "auto",
            }}
          >
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>

        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 18px",
            borderRadius: 16,
            border: `1px solid ${orchardTokens.colors.accentDark}`,
            background: "linear-gradient(180deg, #6E8B6B 0%, #587053 100%)",
            color: "#FFFFFF",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: `0 8px 18px ${orchardTokens.colors.shadow}`,
          }}
        >
          Reload app
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <AppRouter />
    </ErrorBoundary>
  );
}
