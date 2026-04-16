import Link from "next/link";

import { TimerEditorScreen } from "../../../../../components/editor/timer-editor-screen";
import { getAuthContext } from "../../../../../src/features/auth/server/get-auth-context";
import { getEditorViewModel } from "../../../../../src/features/editor/server/get-editor-view-model";
import {
  saveEditorDraft,
  type SaveEditorDraftInput,
} from "../../../../../src/features/editor/server/save-editor-draft";

export const dynamic = "force-dynamic";

interface TimerEditPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    notice?: string | string[];
  }>;
}

export default async function TimerEditPage({
  params,
  searchParams,
}: TimerEditPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewModel = await getEditorViewModel(id, resolvedSearchParams?.notice);
  const auth = await getAuthContext();

  if (viewModel.state !== "ready" || !viewModel.initialState) {
    return (
      <section
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            padding: "1.1rem",
            borderRadius: "1.5rem",
            background:
              "linear-gradient(145deg, rgba(255, 248, 240, 0.96), rgba(245, 224, 196, 0.92))",
            border: "1px solid rgba(140, 92, 22, 0.14)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8c5c16",
            }}
          >
            Timer Editor
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              lineHeight: 1.05,
            }}
          >
            {viewModel.title}
          </h1>
          <p
            style={{
              margin: 0,
              color: "#433d35",
            }}
          >
            {viewModel.description}
          </p>
          {viewModel.notice ? (
            <p
              style={{
                margin: 0,
                padding: "0.8rem 0.9rem",
                borderRadius: "1rem",
                backgroundColor: "rgba(28, 24, 20, 0.9)",
                color: "#f8ecda",
                fontWeight: 600,
              }}
            >
              {viewModel.notice}
            </p>
          ) : null}
        </div>
        <Link
          href={viewModel.state === "guest-restricted" ? "/" : `/timers/${id}`}
          style={{
            width: "fit-content",
            color: "#6a635a",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {viewModel.state === "guest-restricted" ? "Return home" : "Back to timer detail"}
        </Link>
      </section>
    );
  }

  return (
    <TimerEditorScreen
      timerId={id}
      profile={viewModel.profile}
      authStatusLabel={viewModel.authStatusLabel}
      initialState={viewModel.initialState}
      notice={viewModel.notice}
      backHref={`/timers/${id}`}
      onAutoSave={
        auth.kind === "signed-in"
          ? async (input: SaveEditorDraftInput) => {
              "use server";

              return saveEditorDraft(auth, input);
            }
          : undefined
      }
    />
  );
}
