import type { ReactNode } from "react";

import { MobileShell } from "../../components/shell/mobile-shell";

interface ShellLayoutProps {
  children: ReactNode;
}

export default function ShellLayout({ children }: ShellLayoutProps) {
  return <MobileShell>{children}</MobileShell>;
}
