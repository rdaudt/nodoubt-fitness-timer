"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileShellProps {
  children: ReactNode;
}

const navItems = [
  {
    href: "/",
    label: "Home",
    testId: "nav-home",
  },
  {
    href: "/create",
    label: "Create",
    testId: "nav-create",
    isPrimary: true,
  },
  {
    href: "/library",
    label: "Library",
    testId: "nav-library",
  },
  {
    href: "/templates",
    label: "Templates",
    testId: "nav-templates",
  },
] as const;

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname();

  return (
    <div
      data-testid="mobile-shell"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "1rem 0.9rem calc(6.5rem + env(safe-area-inset-bottom))",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "32rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            flex: 1,
            borderRadius: "2rem",
            padding: "1.25rem",
            backgroundColor: "rgba(255, 251, 245, 0.82)",
            boxShadow: "0 32px 64px rgba(73, 43, 5, 0.14)",
            backdropFilter: "blur(16px)",
          }}
        >
          {children}
        </div>
        <nav
          aria-label="Primary"
          data-testid="bottom-navigation"
          style={{
            position: "sticky",
            bottom: "max(0.85rem, env(safe-area-inset-bottom))",
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr 1fr 1fr",
            gap: "0.75rem",
            padding: "0.8rem",
            borderRadius: "1.5rem",
            backgroundColor: "rgba(28, 24, 20, 0.94)",
            boxShadow: "0 18px 40px rgba(28, 24, 20, 0.28)",
          }}
        >
          {navItems.map((item) => {
            const isActive = isCurrentPath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testId}
                aria-current={isActive ? "page" : undefined}
                style={{
                  borderRadius: "1rem",
                  padding: item.isPrimary ? "0.95rem 1rem" : "0.85rem 1rem",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isActive || item.isPrimary ? "#1c1814" : "#f8ecda",
                  backgroundColor:
                    isActive || item.isPrimary ? "#f2bb67" : "transparent",
                  boxShadow: item.isPrimary
                    ? "0 12px 20px rgba(242, 187, 103, 0.28)"
                    : "none",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
