import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("✅ App mounted successfully");
  }, []);

  return (
    <div style={{ padding: "40px", fontSize: "24px" }}>
      🚀 Lesson Generator is running.
    </div>
  );
}
