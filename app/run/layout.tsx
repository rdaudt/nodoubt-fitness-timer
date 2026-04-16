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
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      {children}
    </main>
  );
}
