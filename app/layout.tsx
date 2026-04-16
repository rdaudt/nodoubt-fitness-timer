import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #f7f1e5 0%, #efe3cf 48%, #f8f4ed 100%)",
          color: "#1d1b18",
          fontFamily:
            "'Trebuchet MS', 'Segoe UI', 'Avenir Next', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
