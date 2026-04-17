import {
  createServer,
  getSupabaseEnv,
  isAuthTestMode,
} from "../../../../lib/supabase/server";
import { decodeGuestTimerSeed } from "../../create/server/create-timer-from-preset";
import type {
  AuthContext,
  SignedInAuthContext,
} from "../../auth/server/get-auth-context";
import { getAuthContext } from "../../auth/server/get-auth-context";
import type { OfficialTemplateRecord } from "../../templates/contracts/official-template";
import {
  getMockOfficialTemplateRowBySlug,
  getOfficialTemplateBySlugSpec,
  mapOfficialTemplateRow,
  type OfficialTemplateRow,
} from "../../templates/repositories/official-templates";
import type { TimerRecord } from "../../timers/contracts/timer-record";
import {
  getMockPersonalTimerRowById,
  listPersonalTimersSpec,
  mapPersonalTimerRow,
  type PersonalTimerRow,
} from "../../timers/repositories/personal-timers";
import type { RunSequence } from "../contracts/run-sequence";
import { compileRunSequence } from "../engine/compile-run-sequence";

const personalTimerSelect =
  "id, owner_id, name, description, is_draft, source, source_template_id, definition_version, intervals, total_seconds, created_at, updated_at";
const officialTemplateSelect =
  "id, slug, title, summary, workout_type, difficulty, interval_count, total_seconds, intervals, created_at, updated_at";

export interface RunViewModelInput {
  timerId?: string | null;
  templateSlug?: string | null;
  guestSeed?: string | null;
  notice?: string | string[];
}

export type RunViewState = "ready" | "not-found" | "access-restricted" | "missing-source";

export interface RunViewModel {
  auth: AuthContext;
  authStatusLabel: "Guest" | "Signed In";
  state: RunViewState;
  title: string;
  description: string;
  notice: string | null;
  sequence: RunSequence | null;
}

export interface RunViewModelDependencies {
  getAuthContext: () => Promise<AuthContext>;
  loadPersonalTimer: (
    authContext: SignedInAuthContext,
    timerId: string,
  ) => Promise<TimerRecord | null>;
  loadOfficialTemplate: (slug: string) => Promise<OfficialTemplateRecord | null>;
}

function normalizeNotice(notice: string | string[] | undefined) {
  if (Array.isArray(notice)) {
    return notice[0]?.trim() || null;
  }

  return notice?.trim() || null;
}

async function defaultLoadPersonalTimer(
  authContext: SignedInAuthContext,
  timerId: string,
): Promise<TimerRecord | null> {
  if (isAuthTestMode()) {
    const row = getMockPersonalTimerRowById({ userId: authContext.userId }, timerId);

    return row ? mapPersonalTimerRow(row) : null;
  }

  if (!getSupabaseEnv()) {
    return null;
  }

  try {
    const supabase = await createServer();
    const spec = listPersonalTimersSpec({ userId: authContext.userId });

    let query = supabase.from(spec.table).select(personalTimerSelect);

    for (const filter of spec.filters) {
      query = query.eq(filter.column, filter.value);
    }

    const { data, error } = await query.eq("id", timerId).maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapPersonalTimerRow(data as PersonalTimerRow);
  } catch {
    return null;
  }
}

async function defaultLoadOfficialTemplate(
  slug: string,
): Promise<OfficialTemplateRecord | null> {
  if (isAuthTestMode() || !getSupabaseEnv()) {
    const row = getMockOfficialTemplateRowBySlug(slug);

    return row ? mapOfficialTemplateRow(row) : null;
  }

  try {
    const supabase = await createServer();
    const spec = getOfficialTemplateBySlugSpec(slug);

    let query = supabase.from(spec.table).select(officialTemplateSelect);

    for (const filter of spec.filters) {
      query = query.eq(filter.column, filter.value);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapOfficialTemplateRow(data as OfficialTemplateRow);
  } catch {
    return null;
  }
}

function readyModel(
  auth: AuthContext,
  input: {
    title: string;
    description: string;
    sequence: RunSequence;
    notice: string | null;
  },
): RunViewModel {
  return {
    auth,
    authStatusLabel: auth.kind === "signed-in" ? "Signed In" : "Guest",
    state: "ready",
    title: input.title,
    description: input.description,
    notice: input.notice,
    sequence: input.sequence,
  };
}

export async function getRunViewModel(
  input: RunViewModelInput,
  overrides: Partial<RunViewModelDependencies> = {},
): Promise<RunViewModel> {
  const dependencies: RunViewModelDependencies = {
    getAuthContext,
    loadPersonalTimer: defaultLoadPersonalTimer,
    loadOfficialTemplate: defaultLoadOfficialTemplate,
    ...overrides,
  };
  const auth = await dependencies.getAuthContext();
  const notice = normalizeNotice(input.notice);
  const timerId = input.timerId?.trim() ?? "";
  const templateSlug = input.templateSlug?.trim() ?? "";

  if (timerId) {
    if (auth.kind !== "signed-in") {
      return {
        auth,
        authStatusLabel: "Guest",
        state: "access-restricted",
        title: "Sign in to run this timer",
        description:
          "Personal timer playback remains owner-scoped so private workouts stay private.",
        notice,
        sequence: null,
      };
    }

    const timer = await dependencies.loadPersonalTimer(auth, timerId);

    if (!timer) {
      return {
        auth,
        authStatusLabel: "Signed In",
        state: "not-found",
        title: "Timer unavailable",
        description:
          "This timer was removed or does not belong to the active account.",
        notice,
        sequence: null,
      };
    }

    return readyModel(auth, {
      title: timer.name,
      description:
        timer.description ?? "Deterministic run playback derived from absolute elapsed time.",
      notice,
      sequence: compileRunSequence({
        title: timer.name,
        sourceKind: "personal-timer",
        sourceRef: timer.id,
        definitionVersion: timer.definitionVersion,
        intervals: timer.intervals,
      }),
    });
  }

  if (templateSlug) {
    const template = await dependencies.loadOfficialTemplate(templateSlug);

    if (!template) {
      return {
        auth,
        authStatusLabel: auth.kind === "signed-in" ? "Signed In" : "Guest",
        state: "not-found",
        title: "Template unavailable",
        description: "This official template is not available for playback.",
        notice,
        sequence: null,
      };
    }

    return readyModel(auth, {
      title: template.title,
      description: template.summary,
      notice,
      sequence: compileRunSequence({
        title: template.title,
        sourceKind: "official-template",
        sourceRef: template.slug,
        definitionVersion: 1,
        intervals: template.intervals,
      }),
    });
  }

  const guestSeed = input.guestSeed?.trim() ?? "";

  if (guestSeed) {
    const decoded = decodeGuestTimerSeed(guestSeed);

    if (!decoded) {
      return {
        auth,
        authStatusLabel: auth.kind === "signed-in" ? "Signed In" : "Guest",
        state: "not-found",
        title: "Temporary timer unavailable",
        description: "The temporary timer seed is invalid or expired.",
        notice,
        sequence: null,
      };
    }

    return readyModel(auth, {
      title: decoded.name,
      description: decoded.description ?? "Guest temporary workout",
      notice,
      sequence: compileRunSequence({
        title: decoded.name,
        sourceKind: "guest-temp",
        sourceRef: "guest-temp",
        definitionVersion: 1,
        intervals: decoded.intervals,
      }),
    });
  }

  return {
    auth,
    authStatusLabel: auth.kind === "signed-in" ? "Signed In" : "Guest",
    state: "missing-source",
    title: "Select a timer to run",
    description: "Open run mode from a timer detail card, template detail page, or guest create flow.",
    notice,
    sequence: null,
  };
}