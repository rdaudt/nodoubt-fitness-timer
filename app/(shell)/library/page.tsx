import { LibraryScreen } from "../../../components/library/library-screen";
import { getLibraryViewModel } from "../../../src/features/timers/server/get-library-view-model";

export const dynamic = "force-dynamic";

interface LibraryPageProps {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}

export default async function LibraryPage({
  searchParams,
}: LibraryPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewModel = await getLibraryViewModel(resolvedSearchParams?.q);

  return <LibraryScreen viewModel={viewModel} />;
}
