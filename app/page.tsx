import { SessionBoundary } from "../src/features/auth/components/session-boundary";
import { getAuthContext } from "../src/features/auth/server/get-auth-context";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const authContext = await getAuthContext();

  return <SessionBoundary authContext={authContext} />;
}
