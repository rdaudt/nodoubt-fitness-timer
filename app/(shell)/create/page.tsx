import { CreateEntryScreen } from "../../../components/create/create-entry-screen";
import { getAuthContext } from "../../../src/features/auth/server/get-auth-context";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  const auth = await getAuthContext();

  return <CreateEntryScreen auth={auth} />;
}
