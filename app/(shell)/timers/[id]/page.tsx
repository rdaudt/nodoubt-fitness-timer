import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createServer,
  getSupabaseEnv,
  isAuthTestMode,
} from "../../../../lib/supabase/server";
import { TimerDetailScreen } from "../../../../components/detail/timer-detail-screen";
import { getAuthContext } from "../../../../src/features/auth/server/get-auth-context";
import {
  getPersonalTimerDetailViewModel,
} from "../../../../src/features/timers/server/get-timer-detail-view-model";
import {
  buildDuplicatePersonalTimerInput,
  buildPersonalTimerInsert,
  getMockPersonalTimerRowById,
  insertMockPersonalTimerRow,
  listPersonalTimersSpec,
  mapPersonalTimerRow,
  type PersonalTimerRow,
} from "../../../../src/features/timers/repositories/personal-timers";

export const dynamic = "force-dynamic";

const personalTimerSelect =
  "id, owner_id, name, description, is_draft, source, source_template_id, definition_version, intervals, total_seconds, created_at, updated_at";

async function duplicateTimerAction(formData: FormData) {
  "use server";

  const timerId = String(formData.get("timerId") ?? "").trim();

  if (!timerId) {
    redirect("/library");
  }

  const auth = await getAuthContext();

  if (auth.kind !== "signed-in") {
    redirect(
      `/timers/${timerId}?notice=${encodeURIComponent("Sign in to duplicate personal timers into your private library.")}`,
    );
  }

  let sourceTimer = null;

  if (isAuthTestMode()) {
    const row = getMockPersonalTimerRowById({ userId: auth.userId }, timerId);
    sourceTimer = row ? mapPersonalTimerRow(row) : null;
  } else if (getSupabaseEnv()) {
    const supabase = await createServer();
    const spec = listPersonalTimersSpec({ userId: auth.userId });

    let query = supabase.from(spec.table).select(personalTimerSelect);

    for (const filter of spec.filters) {
      query = query.eq(filter.column, filter.value);
    }

    const { data, error } = await query.eq("id", timerId).maybeSingle();

    if (!error && data) {
      sourceTimer = mapPersonalTimerRow(data as PersonalTimerRow);
    }
  }

  if (!sourceTimer) {
    redirect(
      `/timers/${timerId}?notice=${encodeURIComponent("That timer is unavailable, so nothing was duplicated.")}`,
    );
  }

  const duplicateInput = buildDuplicatePersonalTimerInput(sourceTimer);

  if (isAuthTestMode()) {
    const row = insertMockPersonalTimerRow({ userId: auth.userId }, duplicateInput);

    redirect(
      `/timers/${row.id}?notice=${encodeURIComponent("Timer duplicated into a new draft.")}`,
    );
  }

  if (!getSupabaseEnv()) {
    redirect(
      `/timers/${timerId}?notice=${encodeURIComponent("Supabase is not configured, so duplication is only available in auth test mode right now.")}`,
    );
  }

  const supabase = await createServer();
  const insert = buildPersonalTimerInsert({ userId: auth.userId }, duplicateInput);
  const { data, error } = await supabase
    .from("personal_timers")
    .insert(insert)
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      `/timers/${timerId}?notice=${encodeURIComponent("Timer duplication failed. Try again once your private timer storage is available.")}`,
    );
  }

  redirect(
    `/timers/${String(data.id)}?notice=${encodeURIComponent("Timer duplicated into a new draft.")}`,
  );
}

interface TimerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    notice?: string | string[];
  }>;
}

export default async function TimerDetailPage({
  params,
  searchParams,
}: TimerDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewModel = await getPersonalTimerDetailViewModel(
    id,
    resolvedSearchParams?.notice,
  );

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
            href={`/run?timerId=${id}`}
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
            Run
          </Link>
          <Link
            href={`/timers/${id}?notice=${encodeURIComponent("Editor workflows land in Plan 02-03. This detail screen is the review boundary for now.")}`}
            style={{
              borderRadius: "1rem",
              padding: "0.85rem 0.9rem",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 700,
              backgroundColor: "rgba(255, 255, 255, 0.78)",
              color: "#1c1814",
              border: "1px solid rgba(140, 92, 22, 0.18)",
            }}
          >
            Edit
          </Link>
          <form action={duplicateTimerAction}>
            <input type="hidden" name="timerId" value={id} />
            <button
              type="submit"
              style={{
                width: "100%",
                border: "none",
                borderRadius: "1rem",
                padding: "0.85rem 0.9rem",
                fontWeight: 700,
                backgroundColor: "#f2bb67",
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
          Rename and delete actions land with the next library CRUD pass. This
          screen is the review boundary for run, edit, and duplicate entry
          points.
        </p>
      </div>
    ) : null;

  return <TimerDetailScreen viewModel={viewModel} actions={actions} />;
}
