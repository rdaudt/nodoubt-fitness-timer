import { HomeScreen } from "../../components/home/home-screen";
import { getHomeViewModel } from "../../src/features/home/server/get-home-view-model";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const viewModel = await getHomeViewModel();

  return <HomeScreen viewModel={viewModel} />;
}
