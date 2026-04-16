import {
  createServer,
  getSupabaseEnv,
  isAuthTestMode,
} from "../../../../lib/supabase/server";
import type { AuthContext, SignedInAuthContext } from "../../auth/server/get-auth-context";
import { getAuthContext } from "../../auth/server/get-auth-context";
import type { ProfileDisplayRecord } from "../../profiles/contracts/profile";
import type { OfficialTemplatePreview } from "../../templates/contracts/official-template";
import {
  listOfficialTemplatesSpec,
  toOfficialTemplatePreview,
  type OfficialTemplateRow,
} from "../../templates/repositories/official-templates";
import {
  listPersonalTimersSpec,
  mapPersonalTimerRow,
  type PersonalTimerRow,
} from "../../timers/repositories/personal-timers";

const officialTemplateSelect =
  "id, slug, title, summary, workout_type, difficulty, interval_count, total_seconds, intervals, created_at, updated_at";
const personalTimerSelect =
  "id, owner_id, name, description, is_draft, source, source_template_id, definition_version, intervals, total_seconds, created_at, updated_at";

const fallbackOfficialTemplates: OfficialTemplatePreview[] = [
  {
    id: "template-hustle-15",
    slug: "hustle-15",
    title: "Hustle 15",
    summary: "Quick HIIT starter with short recoveries and a clean cool-down.",
    workoutType: "hiit",
    intervalCount: 12,
    totalSeconds: 900,
  },
  {
    id: "template-strength-ladder",
    slug: "strength-ladder",
    title: "Strength Ladder",
    summary:
      "Alternating work and recovery blocks for a steady strength-focused pace.",
    workoutType: "strength",
    intervalCount: 10,
    totalSeconds: 1080,
  },
  {
    id: "template-reset-flow",
    slug: "reset-flow",
    title: "Reset Flow",
    summary: "Mobility intervals for warmup days, resets, and post-lift recovery.",
    workoutType: "mobility",
    intervalCount: 8,
    totalSeconds: 720,
  },
];

export interface PersonalTimerSummary {
  id: string;
  name: string;
  isDraft: boolean;
  totalSeconds: number;
  sourceLabel: string;
}

export interface PersonalTimerSummarySection {
  kind: "my-timers";
  title: "My Timers";
  description: string;
  emptyState: string;
  items: PersonalTimerSummary[];
}

export interface OfficialTemplatesSection {
  kind: "official-templates";
  title: "Official Templates";
  description: string;
  items: OfficialTemplatePreview[];
}

export type HomeViewSection = PersonalTimerSummarySection | OfficialTemplatesSection;

export interface HomeViewModel {
  auth: AuthContext;
  authStatusLabel: "Guest" | "Signed In";
  heading: string;
  description: string;
  email: string | null;
  profile: ProfileDisplayRecord | null;
  showGoogleSignIn: boolean;
  sections: HomeViewSection[];
}

export interface HomeViewModelDependencies {
  getAuthContext: () => Promise<AuthContext>;
  loadOfficialTemplates: () => Promise<OfficialTemplatePreview[]>;
  loadPersonalTimers: (
    authContext: SignedInAuthContext,
  ) => Promise<PersonalTimerSummary[]>;
}

function buildOfficialTemplatesSection(
  templates: OfficialTemplatePreview[],
): OfficialTemplatesSection {
  return {
    kind: "official-templates",
    title: "Official Templates",
    description:
      "Start with branded No Doubt Fitness presets before you build your own library.",
    items: templates,
  };
}

function buildMyTimersSection(
  timers: PersonalTimerSummary[],
): PersonalTimerSummarySection {
  return {
    kind: "my-timers",
    title: "My Timers",
    description:
      "Your saved workouts stay separate from the public starter library.",
    emptyState:
      "Duplicate an official template or create a timer from scratch to build your personal library.",
    items: timers,
  };
}

async function defaultLoadOfficialTemplates() {
  if (isAuthTestMode() || !getSupabaseEnv()) {
    return fallbackOfficialTemplates;
  }

  try {
    const supabase = await createServer();
    const spec = listOfficialTemplatesSpec();

    let query = supabase.from(spec.table).select(officialTemplateSelect);

    for (const filter of spec.filters) {
      query = query.eq(filter.column, filter.value);
    }

    const { data, error } = await query.order(spec.orderBy.column, {
      ascending: spec.orderBy.ascending,
    });

    if (error || !data?.length) {
      return fallbackOfficialTemplates;
    }

    return (data as OfficialTemplateRow[]).map((row) =>
      toOfficialTemplatePreview(row),
    );
  } catch {
    return fallbackOfficialTemplates;
  }
}

function buildMockPersonalTimers(userId: string): PersonalTimerSummary[] {
  return [
    {
      id: `${userId}-timer-1`,
      name: "Monday Burn",
      isDraft: false,
      totalSeconds: 1260,
      sourceLabel: "Saved timer",
    },
    {
      id: `${userId}-timer-2`,
      name: "Mobility Reset Draft",
      isDraft: true,
      totalSeconds: 780,
      sourceLabel: "Draft",
    },
  ];
}

async function defaultLoadPersonalTimers(
  authContext: SignedInAuthContext,
): Promise<PersonalTimerSummary[]> {
  if (isAuthTestMode()) {
    return buildMockPersonalTimers(authContext.userId);
  }

  if (!getSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = await createServer();
    const spec = listPersonalTimersSpec({ userId: authContext.userId });

    let query = supabase.from(spec.table).select(personalTimerSelect);

    for (const filter of spec.filters) {
      query = query.eq(filter.column, filter.value);
    }

    const { data, error } = await query.order(spec.orderBy.column, {
      ascending: spec.orderBy.ascending,
    });

    if (error || !data?.length) {
      return [];
    }

    return (data as PersonalTimerRow[]).map((row) => {
      const timer = mapPersonalTimerRow(row);

      return {
        id: timer.id,
        name: timer.name,
        isDraft: timer.isDraft,
        totalSeconds: timer.totalSeconds,
        sourceLabel:
          timer.source === "official-template"
            ? "Duplicated from official template"
            : "Saved timer",
      };
    });
  } catch {
    return [];
  }
}

export async function getHomeViewModel(
  overrides: Partial<HomeViewModelDependencies> = {},
): Promise<HomeViewModel> {
  const dependencies: HomeViewModelDependencies = {
    getAuthContext,
    loadOfficialTemplates: defaultLoadOfficialTemplates,
    loadPersonalTimers: defaultLoadPersonalTimers,
    ...overrides,
  };

  const auth = await dependencies.getAuthContext();
  const officialTemplates = await dependencies.loadOfficialTemplates();
  const officialTemplatesSection = buildOfficialTemplatesSection(
    officialTemplates,
  );

  if (auth.kind === "guest") {
    return {
      auth,
      authStatusLabel: "Guest",
      heading: "Browse the official starters before you ever hit a sign-in wall.",
      description:
        "The guest home leads with public No Doubt Fitness templates so the first visit feels useful immediately.",
      email: null,
      profile: null,
      showGoogleSignIn: true,
      sections: [officialTemplatesSection],
    };
  }

  const personalTimers = await dependencies.loadPersonalTimers(auth);

  return {
    auth,
    authStatusLabel: "Signed In",
    heading: `Welcome back, ${auth.profile.firstName}.`,
    description:
      "Signed-in home keeps your timers first while leaving the official library one section below for quick starts.",
    email: auth.email,
    profile: auth.profile,
    showGoogleSignIn: false,
    sections: [
      buildMyTimersSection(personalTimers),
      officialTemplatesSection,
    ],
  };
}
