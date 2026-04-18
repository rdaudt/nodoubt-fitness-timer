import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import {
  createServer,
  getNeonEnv,
  isAuthTestMode,
} from "../../../lib/neon/server";
import { LibraryScreen } from "../../../components/library/library-screen";
import { getAuthContext } from "../../../src/features/auth/server/get-auth-context";
import { getLibraryViewModel } from "../../../src/features/timers/server/get-library-view-model";
import {
  buildDuplicatePersonalTimerInput,
  buildPersonalTimerInsert,
  deleteMockPersonalTimerRow,
  getMockPersonalTimerRowById,
  insertMockPersonalTimerRow,
  listPersonalTimersSpec,
  mapPersonalTimerRow,
  type PersonalTimerRow,
} from "../../../src/features/timers/repositories/personal-timers";

export const dynamic = "force-dynamic";

const personalTimerSelect =
  "id, owner_id, name, description, is_draft, source, source_template_id, definition_version, intervals, total_seconds, created_at, updated_at";

async function duplicateTimerFromLibraryAction(formData: FormData) {
  "use server";

  const timerId = String(formData.get("timerId") ?? "").trim();

  if (!timerId) {
    redirect("/library");
  }

  const auth = await getAuthContext();

  if (auth.kind !== "signed-in") {
    redirect(
      `/library?notice=${encodeURIComponent("Sign in to duplicate timers into your private library.")}`,
    );
  }

  let sourceTimer = null;

  if (isAuthTestMode()) {
    const row = getMockPersonalTimerRowById({ userId: auth.userId }, timerId);
    sourceTimer = row ? mapPersonalTimerRow(row) : null;
  } else if (getNeonEnv()) {
    const database = await createServer();
    const spec = listPersonalTimersSpec({ userId: auth.userId });

    let query = database.from(spec.table).select(personalTimerSelect);

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
      `/library?notice=${encodeURIComponent("That timer is unavailable, so nothing was duplicated.")}`,
    );
  }

  const duplicateInput = buildDuplicatePersonalTimerInput(sourceTimer);

  if (isAuthTestMode()) {
    insertMockPersonalTimerRow({ userId: auth.userId }, duplicateInput);
    redirect(
      `/library?notice=${encodeURIComponent("Timer duplicated into a new draft.")}`,
    );
  }

  if (!getNeonEnv()) {
    redirect(
      `/library?notice=${encodeURIComponent("database is not configured, so duplication is only available in auth test mode right now.")}`,
    );
  }

  const database = await createServer();
  const insert = buildPersonalTimerInsert({ userId: auth.userId }, duplicateInput);
  const { error } = await database.from("personal_timers").insert(insert);

  if (error) {
    redirect(
      `/library?notice=${encodeURIComponent("Timer duplication failed. Try again once your private timer storage is available.")}`,
    );
  }

  redirect(`/library?notice=${encodeURIComponent("Timer duplicated into a new draft.")}`);
}

async function deleteTimerFromLibraryAction(formData: FormData) {
  "use server";

  const timerId = String(formData.get("timerId") ?? "").trim();

  if (!timerId) {
    redirect("/library");
  }

  const auth = await getAuthContext();

  if (auth.kind !== "signed-in") {
    redirect(
      `/library?notice=${encodeURIComponent("Sign in to delete timers from your private library.")}`,
    );
  }

  if (isAuthTestMode()) {
    const deleted = deleteMockPersonalTimerRow({ userId: auth.userId }, timerId);

    redirect(
      `/library?notice=${encodeURIComponent(
        deleted
          ? "Timer deleted from your library."
          : "That timer is unavailable, so nothing was deleted.",
      )}`,
    );
  }

  if (!getNeonEnv()) {
    redirect(
      `/library?notice=${encodeURIComponent("database is not configured, so deletion is only available in auth test mode right now.")}`,
    );
  }

  const database = await createServer();
  const { error } = await database
    .from("personal_timers")
    .delete()
    .eq("id", timerId)
    .eq("owner_id", auth.userId);

  if (error) {
    redirect(
      `/library?notice=${encodeURIComponent("Timer deletion failed. Try again once your private timer storage is available.")}`,
    );
  }

  redirect(`/library?notice=${encodeURIComponent("Timer deleted from your library.")}`);
}

interface LibraryPageProps {
  searchParams?: Promise<{
    q?: string | string[];
    notice?: string | string[];
  }>;
}

export default async function LibraryPage({
  searchParams,
}: LibraryPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewModel = await getLibraryViewModel(resolvedSearchParams?.q);
  const notice = Array.isArray(resolvedSearchParams?.notice)
    ? resolvedSearchParams?.notice[0] ?? null
    : resolvedSearchParams?.notice ?? null;
  const actions = Object.fromEntries(
    viewModel.items.map((item) => [
      item.id,
      <div
        key={item.id}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "0.6rem",
        }}
      >
        <form action={duplicateTimerFromLibraryAction}>
          <input type="hidden" name="timerId" value={item.id} />
          <button
            type="submit"
            data-testid={`library-duplicate-${item.id}`}
            style={{
              width: "100%",
              border: "1px solid rgba(140, 92, 22, 0.18)",
              borderRadius: "1rem",
              padding: "0.75rem 0.85rem",
              fontWeight: 700,
              backgroundColor: "rgba(255, 255, 255, 0.78)",
              color: "#1c1814",
            }}
          >
            Duplicate
          </button>
        </form>
        <form action={deleteTimerFromLibraryAction}>
          <input type="hidden" name="timerId" value={item.id} />
          <button
            type="submit"
            data-testid={`library-delete-${item.id}`}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "1rem",
              padding: "0.75rem 0.85rem",
              fontWeight: 700,
              backgroundColor: "#c24d36",
              color: "#fff4ee",
            }}
          >
            Delete
          </button>
        </form>
      </div>,
    ]),
  ) as Record<string, ReactElement>;

  return <LibraryScreen viewModel={viewModel} notice={notice} actions={actions} />;
}

