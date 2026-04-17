import {
  createServer,
  getSupabaseEnv,
  isAuthTestMode,
} from "../../../../lib/supabase/server";
import type {
  AuthContext,
  SignedInAuthContext,
} from "../../auth/server/get-auth-context";
import { getAuthContext } from "../../auth/server/get-auth-context";
import type { ProfileDisplayRecord } from "../../profiles/contracts/profile";
import type { OfficialTemplateRecord } from "../../templates/contracts/official-template";
import {
  getMockOfficialTemplateRowBySlug,
  getOfficialTemplateBySlugSpec,
  mapOfficialTemplateRow,
  type OfficialTemplateRow,
} from "../../templates/repositories/official-templates";
import type { TimerIntervalKind, TimerRecord } from "../contracts/timer-record";
import {
  getMockPersonalTimerRowById,
  getPersonalTimerSourceLabel,
  listPersonalTimersSpec,
  mapPersonalTimerRow,
  type PersonalTimerRow,
} from "../repositories/personal-timers";

const personalTimerSelect =
  "id, owner_id, name, description, is_draft, source, source_template_id, definition_version, intervals, total_seconds, created_at, updated_at";
const officialTemplateSelect =
  "id, slug, title, summary, workout_type, difficulty, interval_count, total_seconds, intervals, created_at, updated_at";

export type TimerDetailState = "ready" | "guest-restricted" | "not-found";

export interface TimerDetailIntervalItem {
  id: string;
  label: string;
  kindLabel: string;
  durationLabel: string;
}

export interface TimerDetailViewModel {
  auth: AuthContext;
  authStatusLabel: "Guest" | "Signed In";
  profile: ProfileDisplayRecord | null;
  detailKind: "personal-timer" | "official-template";
  state: TimerDetailState;
  eyebrow: string;
  title: string;
  description: string;
  primaryBadge: string | null;
  metaItems: string[];
  intervals: TimerDetailIntervalItem[];
  notice: string | null;
  isEditLocked: boolean;
  editLockReason: string | null;
  emptyStateTitle: string | null;
  emptyStateDescription: string | null;
}

export interface ActiveRunMarker {
  timerId: string | null;
  malformed: boolean;
}

export interface PersonalTimerDetailDependencies {
  getAuthContext: () => Promise<AuthContext>;
  loadTimerById: (
    authContext: SignedInAuthContext,
    timerId: string,
  ) => Promise<TimerRecord | null>;
  readActiveRunMarker: () => Promise<ActiveRunMarker>;
}

export interface OfficialTemplateDetailDependencies {
  getAuthContext: () => Promise<AuthContext>;
  loadTemplateBySlug: (slug: string) => Promise<OfficialTemplateRecord | null>;
  readActiveRunMarker: () => Promise<ActiveRunMarker>;
}

function normalizeNotice(input: string | string[] | undefined): string | null {
  if (Array.isArray(input)) {
    return input[0]?.trim() || null;
  }

  return input?.trim() || null;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  if (seconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatIntervalKind(kind: TimerIntervalKind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function buildIntervals(
  intervals: TimerRecord["intervals"] | OfficialTemplateRecord["intervals"],
): TimerDetailIntervalItem[] {
  return intervals.map((interval) => ({
    id: interval.id,
    label: interval.label,
    kindLabel: formatIntervalKind(interval.kind),
    durationLabel: formatDuration(interval.durationSeconds),
  }));
}

async function defaultLoadTimerById(
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

async function defaultLoadTemplateBySlug(
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

function parseActiveRunMarker(rawValue: string | null | undefined): ActiveRunMarker {
  if (!rawValue) {
    return {
      timerId: null,
      malformed: false,
    };
  }

  try {
    const decodedValue = decodeURIComponent(rawValue);
    const parsed = JSON.parse(decodedValue) as {
      timerId?: unknown;
    };

    if (typeof parsed.timerId !== "string" || !parsed.timerId.trim()) {
      return {
        timerId: null,
        malformed: true,
      };
    }

    return {
      timerId: parsed.timerId,
      malformed: false,
    };
  } catch {
    return {
      timerId: null,
      malformed: true,
    };
  }
}

async function defaultReadActiveRunMarker(): Promise<ActiveRunMarker> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const rawValue = cookieStore.get("ndft-active-run")?.value;

    return parseActiveRunMarker(rawValue);
  } catch {
    return {
      timerId: null,
      malformed: false,
    };
  }
}

export async function getPersonalTimerDetailViewModel(
  timerId: string,
  noticeInput: string | string[] | undefined,
  overrides: Partial<PersonalTimerDetailDependencies> = {},
): Promise<TimerDetailViewModel> {
  const dependencies: PersonalTimerDetailDependencies = {
    getAuthContext,
    loadTimerById: defaultLoadTimerById,
    readActiveRunMarker: defaultReadActiveRunMarker,
    ...overrides,
  };

  const auth = await dependencies.getAuthContext();
  const notice = normalizeNotice(noticeInput);

  if (auth.kind === "guest") {
    return {
      auth,
      authStatusLabel: "Guest",
      profile: null,
      detailKind: "personal-timer",
      state: "guest-restricted",
      eyebrow: "Personal Timer",
      title: "Sign in to view this timer",
      description:
        "Personal timer detail stays private to the signed-in account that owns it.",
      primaryBadge: null,
      metaItems: [],
      intervals: [],
      notice,
      isEditLocked: false,
      editLockReason: null,
      emptyStateTitle: "Timer detail is private",
      emptyStateDescription:
        "Use Google sign-in to open, review, and manage your saved timers.",
    };
  }

  const timer = await dependencies.loadTimerById(auth, timerId);

  if (!timer) {
    return {
      auth,
      authStatusLabel: "Signed In",
      profile: auth.profile,
      detailKind: "personal-timer",
      state: "not-found",
      eyebrow: "Personal Timer",
      title: "Timer not found",
      description:
        "The timer is missing, was deleted, or does not belong to this account.",
      primaryBadge: null,
      metaItems: [],
      intervals: [],
      notice,
      isEditLocked: false,
      editLockReason: null,
      emptyStateTitle: "Timer unavailable",
      emptyStateDescription:
        "Return to your library and choose another timer from your private list.",
    };
  }

  const activeRunMarker = await dependencies.readActiveRunMarker();
  const isEditLocked = activeRunMarker.malformed || activeRunMarker.timerId === timer.id;

  return {
    auth,
    authStatusLabel: "Signed In",
    profile: auth.profile,
    detailKind: "personal-timer",
    state: "ready",
    eyebrow: "Personal Timer",
    title: timer.name,
    description:
      timer.description ??
      "Review the interval breakdown here before you run, edit, duplicate, rename, or delete this timer.",
    primaryBadge: timer.isDraft ? "Draft" : null,
    metaItems: [
      getPersonalTimerSourceLabel(timer),
      `${timer.intervals.length} intervals`,
      formatDuration(timer.totalSeconds),
    ],
    intervals: buildIntervals(timer.intervals),
    notice,
    isEditLocked,
    editLockReason: isEditLocked
      ? "Finish or reset this timer's active run before editing."
      : null,
    emptyStateTitle: null,
    emptyStateDescription: null,
  };
}

export async function getOfficialTemplateDetailViewModel(
  slug: string,
  noticeInput: string | string[] | undefined,
  overrides: Partial<OfficialTemplateDetailDependencies> = {},
): Promise<TimerDetailViewModel> {
  const dependencies: OfficialTemplateDetailDependencies = {
    getAuthContext,
    loadTemplateBySlug: defaultLoadTemplateBySlug,
    readActiveRunMarker: defaultReadActiveRunMarker,
    ...overrides,
  };

  const auth = await dependencies.getAuthContext();
  const notice = normalizeNotice(noticeInput);
  const template = await dependencies.loadTemplateBySlug(slug);

  if (!template) {
    return {
      auth,
      authStatusLabel: auth.kind === "signed-in" ? "Signed In" : "Guest",
      profile: auth.kind === "signed-in" ? auth.profile : null,
      detailKind: "official-template",
      state: "not-found",
      eyebrow: "Official Template",
      title: "Template not found",
      description: "That official template is no longer available.",
      primaryBadge: null,
      metaItems: [],
      intervals: [],
      notice,
      isEditLocked: false,
      editLockReason: null,
      emptyStateTitle: "Template unavailable",
      emptyStateDescription:
        "Browse the official template library again and choose another starter.",
    };
  }

  return {
    auth,
    authStatusLabel: auth.kind === "signed-in" ? "Signed In" : "Guest",
    profile: auth.kind === "signed-in" ? auth.profile : null,
    detailKind: "official-template",
    state: "ready",
    eyebrow: "Official Template",
    title: template.title,
    description:
      template.summary +
      " Duplicate a copy into your library before you edit so the original starter stays immutable.",
    primaryBadge: "Duplicate before edit",
    metaItems: [
      template.workoutType,
      template.difficulty,
      `${template.intervalCount} intervals`,
      formatDuration(template.totalSeconds),
    ],
    intervals: buildIntervals(template.intervals),
    notice,
    isEditLocked: false,
    editLockReason: null,
    emptyStateTitle: null,
    emptyStateDescription: null,
  };
}
