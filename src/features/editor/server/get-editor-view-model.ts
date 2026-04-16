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
import type { TimerRecord } from "../../timers/contracts/timer-record";
import {
  getMockPersonalTimerRowById,
  listPersonalTimersSpec,
  mapPersonalTimerRow,
  type PersonalTimerRow,
} from "../../timers/repositories/personal-timers";
import {
  buildEditorStateFromTimer,
  type EditorState,
} from "../client/editor-state";

const personalTimerSelect =
  "id, owner_id, name, description, is_draft, source, source_template_id, definition_version, intervals, total_seconds, created_at, updated_at";

export type EditorViewState = "ready" | "guest-restricted" | "not-found";

export interface EditorViewModel {
  auth: AuthContext;
  authStatusLabel: "Guest" | "Signed In";
  profile: ProfileDisplayRecord | null;
  state: EditorViewState;
  notice: string | null;
  title: string;
  description: string;
  initialState: EditorState | null;
}

export interface EditorViewModelDependencies {
  getAuthContext: () => Promise<AuthContext>;
  loadTimerById: (
    authContext: SignedInAuthContext,
    timerId: string,
  ) => Promise<TimerRecord | null>;
}

function normalizeNotice(input: string | string[] | undefined) {
  if (Array.isArray(input)) {
    return input[0]?.trim() || null;
  }

  return input?.trim() || null;
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

export async function getEditorViewModel(
  timerId: string,
  noticeInput: string | string[] | undefined,
  overrides: Partial<EditorViewModelDependencies> = {},
): Promise<EditorViewModel> {
  const dependencies: EditorViewModelDependencies = {
    getAuthContext,
    loadTimerById: defaultLoadTimerById,
    ...overrides,
  };
  const auth = await dependencies.getAuthContext();
  const notice = normalizeNotice(noticeInput);

  if (auth.kind === "guest") {
    return {
      auth,
      authStatusLabel: "Guest",
      profile: null,
      state: "guest-restricted",
      notice,
      title: "Sign in to edit this timer",
      description:
        "Timer authoring stays tied to your signed-in library so drafts and edits remain private to the owning account.",
      initialState: null,
    };
  }

  const timer = await dependencies.loadTimerById(auth, timerId);

  if (!timer) {
    return {
      auth,
      authStatusLabel: "Signed In",
      profile: auth.profile,
      state: "not-found",
      notice,
      title: "Timer unavailable",
      description:
        "The timer is missing, was deleted, or does not belong to this account.",
      initialState: null,
    };
  }

  return {
    auth,
    authStatusLabel: "Signed In",
    profile: auth.profile,
    state: "ready",
    notice,
    title: timer.name,
    description:
      timer.description ??
      "Adjust interval order, labels, and timing here before you run or return to the library.",
    initialState: buildEditorStateFromTimer(timer),
  };
}
