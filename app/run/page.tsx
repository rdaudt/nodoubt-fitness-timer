import Link from "next/link";

import { RunScreen } from "../../components/run/run-screen";
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
          minHeight: "100vh",
          padding: "2rem 1.2rem",
          display: "grid",
          alignContent: "center",
          gap: "0.9rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.76rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#f4b862",
            fontWeight: 700,
          }}
        >
          Run mode
        </p>
        <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.05 }}>
          {viewModel.title}
        </h1>
        <p style={{ margin: 0, color: "rgba(255, 247, 237, 0.84)" }}>
          {viewModel.description}
        </p>
        <Link
          href="/library"
          style={{
            justifySelf: "center",
            borderRadius: "999px",
            padding: "0.8rem 1rem",
            backgroundColor: "#f2bb67",
            color: "#1c1814",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Back to library
        </Link>
      </section>
    );
  }

  return <RunScreen sequence={viewModel.sequence} notice={viewModel.notice} />;
}
