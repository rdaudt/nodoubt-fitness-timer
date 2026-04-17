import Link from "next/link";

import { RunEnginePanel } from "../../src/features/run/client/run-engine-panel";
import { getRunViewModel } from "../../src/features/run/server/get-run-view-model";

export const dynamic = "force-dynamic";

interface RunPageProps {
  searchParams?: Promise<{
    timerId?: string | string[];
    templateSlug?: string | string[];
    guestSeed?: string | string[];
    notice?: string | string[];
  }>;
}

function readSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export default async function RunPage({ searchParams }: RunPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewModel = await getRunViewModel({
    timerId: readSearchParam(resolvedSearchParams?.timerId),
    templateSlug: readSearchParam(resolvedSearchParams?.templateSlug),
    guestSeed: readSearchParam(resolvedSearchParams?.guestSeed),
    notice: resolvedSearchParams?.notice,
  });

  if (viewModel.state !== "ready" || !viewModel.sequence) {
    return (
      <section
        data-testid="run-screen"
        style={{
          minHeight: "calc(100vh - 3rem)",
          borderRadius: "2rem",
          background:
            "linear-gradient(160deg, rgba(18, 18, 18, 0.96), rgba(46, 13, 8, 0.88))",
          color: "#fff7ed",
          padding: "2rem",
          display: "grid",
          alignContent: "center",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f4b862",
          }}
        >
          Run Layout
        </p>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>{viewModel.title}</h1>
        <p style={{ margin: 0, color: "rgba(255, 247, 237, 0.78)" }}>
          {viewModel.description}
        </p>
        <Link
          href="/library"
          style={{
            justifySelf: "center",
            borderRadius: "1rem",
            padding: "0.8rem 1rem",
            textDecoration: "none",
            backgroundColor: "#f2bb67",
            color: "#1c1814",
            fontWeight: 700,
          }}
        >
          Back to library
        </Link>
      </section>
    );
  }

  return <RunEnginePanel sequence={viewModel.sequence} notice={viewModel.notice} />;
}