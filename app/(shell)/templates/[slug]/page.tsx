import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createServer,
  getNeonEnv,
  isAuthTestMode,
} from "../../../../lib/neon/server";
import { TimerDetailScreen } from "../../../../components/detail/timer-detail-screen";
import { getAuthContext } from "../../../../src/features/auth/server/get-auth-context";
import {
  buildPersonalTimerFromOfficialTemplateInput,
  getMockOfficialTemplateRowBySlug,
  getOfficialTemplateBySlugSpec,
  mapOfficialTemplateRow,
  type OfficialTemplateRow,
} from "../../../../src/features/templates/repositories/official-templates";
import {
  getOfficialTemplateDetailViewModel,
} from "../../../../src/features/timers/server/get-timer-detail-view-model";
import {
  buildPersonalTimerInsert,
  insertMockPersonalTimerRow,
} from "../../../../src/features/timers/repositories/personal-timers";

export const dynamic = "force-dynamic";

const officialTemplateSelect =
  "id, slug, title, summary, workout_type, difficulty, interval_count, total_seconds, intervals, created_at, updated_at";

async function duplicateTemplateAction(formData: FormData) {
  "use server";

  const slug = String(formData.get("slug") ?? "").trim();
  const intent = String(formData.get("intent") ?? "").trim();

  if (!slug) {
    redirect("/templates");
  }

  const auth = await getAuthContext();

  if (auth.kind !== "signed-in") {
    redirect(
      `/templates/${slug}?notice=${encodeURIComponent("Sign in to duplicate official templates into your private library.")}`,
    );
  }

  let template = null;

  if (isAuthTestMode() || !getNeonEnv()) {
    const row = getMockOfficialTemplateRowBySlug(slug);
    template = row ? mapOfficialTemplateRow(row) : null;
  } else {
    const database = await createServer();
    const spec = getOfficialTemplateBySlugSpec(slug);

    let query = database.from(spec.table).select(officialTemplateSelect);

    for (const filter of spec.filters) {
      query = query.eq(filter.column, filter.value);
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      template = mapOfficialTemplateRow(data as OfficialTemplateRow);
    }
  }

  if (!template) {
    redirect(
      `/templates/${slug}?notice=${encodeURIComponent("That official template is unavailable right now.")}`,
    );
  }

  const duplicateInput = buildPersonalTimerFromOfficialTemplateInput(template);
  const editNotice =
    intent === "edit"
      ? "Copied into your library. Editor workflows land in Plan 02-03."
      : "Copied into your library as a private draft.";

  if (isAuthTestMode()) {
    const row = insertMockPersonalTimerRow({ userId: auth.userId }, duplicateInput);

    redirect(`/timers/${row.id}?notice=${encodeURIComponent(editNotice)}`);
  }

  if (!getNeonEnv()) {
    redirect(
      `/templates/${slug}?notice=${encodeURIComponent("database is not configured, so template duplication is only available in auth test mode right now.")}`,
    );
  }

  const database = await createServer();
  const insert = buildPersonalTimerInsert({ userId: auth.userId }, duplicateInput);
  const { data, error } = await database
    .from("personal_timers")
    .insert(insert)
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      `/templates/${slug}?notice=${encodeURIComponent("Template duplication failed. Try again once your private timer storage is available.")}`,
    );
  }

  redirect(`/timers/${String(data.id)}?notice=${encodeURIComponent(editNotice)}`);
}

interface TemplateDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    notice?: string | string[];
  }>;
}

export default async function TemplateDetailPage({
  params,
  searchParams,
}: TemplateDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewModel = await getOfficialTemplateDetailViewModel(
    slug,
    resolvedSearchParams?.notice,
  );
  const canDuplicate = viewModel.auth.kind === "signed-in";

  const actions =
    viewModel.state === "ready" ? (
      <div
        style={{
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "0.65rem",
          }}
        >
          <Link
            href={`/run?templateSlug=${slug}`}
            data-testid="template-run-now"
            style={{
              borderRadius: "1rem",
              padding: "0.85rem 0.9rem",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 700,
              backgroundColor: "#1c1814",
              color: "#f8ecda",
            }}
          >
            Run now
          </Link>
          <form action={duplicateTemplateAction}>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="intent" value="edit" />
            <button
              type="submit"
              disabled={!canDuplicate}
              style={{
                width: "100%",
                border: "1px solid rgba(140, 92, 22, 0.18)",
                borderRadius: "1rem",
                padding: "0.85rem 0.9rem",
                fontWeight: 700,
                backgroundColor: canDuplicate
                  ? "rgba(255, 255, 255, 0.78)"
                  : "rgba(255, 255, 255, 0.55)",
                color: "#1c1814",
              }}
            >
              Edit as Copy
            </button>
          </form>
          <form action={duplicateTemplateAction}>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="intent" value="duplicate" />
            <button
              type="submit"
              disabled={!canDuplicate}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "1rem",
                padding: "0.85rem 0.9rem",
                fontWeight: 700,
                backgroundColor: canDuplicate ? "#f2bb67" : "#e2d4be",
                color: "#1c1814",
              }}
            >
              Duplicate
            </button>
          </form>
        </div>
        <p
          style={{
            margin: 0,
            color: "#5a544d",
          }}
        >
          {canDuplicate
            ? "Official templates never change in place. Both copy actions create a private draft first so later edits stay independent."
            : "Sign in to duplicate this official template into your private library before editing."}
        </p>
      </div>
    ) : null;

  return <TimerDetailScreen viewModel={viewModel} actions={actions} />;
}


