import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("shell-routes", () => {
  it("wraps shell pages in the shared mobile shell layout", () => {
    const shellLayout = readProjectFile("app/(shell)/layout.tsx");
    const mobileShell = readProjectFile("components/shell/mobile-shell.tsx");

    expect(shellLayout).toContain("MobileShell");
    expect(mobileShell).toContain('data-testid="bottom-navigation"');
    expect(mobileShell).toContain('href: "/"');
    expect(mobileShell).toContain('href: "/create"');
    expect(mobileShell).toContain('href: "/templates"');
  });

  it("keeps the home route server-rendered inside the shell group", () => {
    const homePage = readProjectFile("app/(shell)/page.tsx");

    expect(homePage).toContain("getHomeViewModel");
    expect(homePage).toContain("HomeScreen");
    expect(homePage).toContain('dynamic = "force-dynamic"');
  });

  it("keeps the run route outside the shared shell chrome", () => {
    const runLayout = readProjectFile("app/run/layout.tsx");

    expect(runLayout).toContain('data-testid="run-layout"');
    expect(runLayout).not.toContain("MobileShell");
  });
});
