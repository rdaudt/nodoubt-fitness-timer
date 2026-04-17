import type { ReactNode } from "react";

interface RunLayoutProps {
  children: ReactNode;
}

export default function RunLayout({ children }: RunLayoutProps) {
  return (
    <main
      data-testid="run-layout"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(52, 21, 9, 0.88), rgba(8, 8, 8, 0.98))",
        color: "#fff7ed",
        display: "grid",
        alignItems: "stretch",
      }}
    >
      {children}
    </main>
  );
}
