import type { TimerRecordInput } from "../../timers/contracts/timer-record";
import type {
  OfficialTemplatePreview,
  OfficialTemplateRecord,
} from "../contracts/official-template";

export interface OfficialTemplateRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  workout_type: OfficialTemplateRecord["workoutType"];
  difficulty: OfficialTemplateRecord["difficulty"];
  interval_count: number;
  total_seconds: number;
  intervals: OfficialTemplateRecord["intervals"];
  created_at: string;
  updated_at: string;
}

export interface OfficialTemplateListSpec {
  table: "official_templates";
  filters: Array<{
    column: "is_published" | "slug";
    operator: "eq";
    value: string | true;
  }>;
  orderBy: {
    column: "title";
    ascending: true;
  };
}

const mockOfficialTemplateRows = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    slug: "starter-hiit-18",
    title: "Starter HIIT 18",
    summary: "Introductory HIIT template with steady work and recovery pacing.",
    workout_type: "hiit",
    difficulty: "beginner",
    interval_count: 6,
    total_seconds: 1080,
    intervals: [
      {
        id: "warmup",
        label: "Warm up",
        kind: "warmup",
        durationSeconds: 180,
      },
      {
        id: "round-1-work",
        label: "Round 1 work",
        kind: "work",
        durationSeconds: 45,
      },
      {
        id: "round-1-rest",
        label: "Round 1 rest",
        kind: "rest",
        durationSeconds: 30,
      },
      {
        id: "round-2-work",
        label: "Round 2 work",
        kind: "work",
        durationSeconds: 45,
      },
      {
        id: "round-2-rest",
        label: "Round 2 rest",
        kind: "rest",
        durationSeconds: 30,
      },
      {
        id: "cooldown",
        label: "Cooldown",
        kind: "cooldown",
        durationSeconds: 750,
      },
    ],
    created_at: "2026-04-10T12:00:00.000Z",
    updated_at: "2026-04-14T12:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    slug: "mobility-reset-12",
    title: "Mobility Reset 12",
    summary: "Low-intensity mobility flow intended for recovery or warm-up blocks.",
    workout_type: "mobility",
    difficulty: "beginner",
    interval_count: 5,
    total_seconds: 720,
    intervals: [
      {
        id: "prep",
        label: "Prep",
        kind: "warmup",
        durationSeconds: 120,
      },
      {
        id: "flow-1",
        label: "Flow 1",
        kind: "work",
        durationSeconds: 120,
      },
      {
        id: "transition-1",
        label: "Transition",
        kind: "rest",
        durationSeconds: 30,
      },
      {
        id: "flow-2",
        label: "Flow 2",
        kind: "work",
        durationSeconds: 120,
      },
      {
        id: "reset",
        label: "Reset",
        kind: "cooldown",
        durationSeconds: 330,
      },
    ],
    created_at: "2026-04-11T12:00:00.000Z",
    updated_at: "2026-04-15T12:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    slug: "strength-ladder-16",
    title: "Strength Ladder 16",
    summary: "Alternating strength efforts and recoveries that scale well for classes.",
    workout_type: "strength",
    difficulty: "intermediate",
    interval_count: 7,
    total_seconds: 960,
    intervals: [
      {
        id: "warmup",
        label: "Warm up",
        kind: "warmup",
        durationSeconds: 180,
      },
      {
        id: "lift-1",
        label: "Lift 1",
        kind: "work",
        durationSeconds: 60,
      },
      {
        id: "rest-1",
        label: "Rest",
        kind: "rest",
        durationSeconds: 45,
      },
      {
        id: "lift-2",
        label: "Lift 2",
        kind: "work",
        durationSeconds: 60,
      },
      {
        id: "rest-2",
        label: "Rest",
        kind: "rest",
        durationSeconds: 45,
      },
      {
        id: "lift-3",
        label: "Lift 3",
        kind: "work",
        durationSeconds: 60,
      },
      {
        id: "cooldown",
        label: "Cooldown",
        kind: "cooldown",
        durationSeconds: 510,
      },
    ],
    created_at: "2026-04-09T12:00:00.000Z",
    updated_at: "2026-04-13T12:00:00.000Z",
  },
] as const satisfies ReadonlyArray<OfficialTemplateRow>;

function cloneInterval(
  interval: OfficialTemplateRecord["intervals"][number],
): OfficialTemplateRecord["intervals"][number] {
  return {
    ...interval,
  };
}

function cloneOfficialTemplateRow(row: OfficialTemplateRow): OfficialTemplateRow {
  return {
    ...row,
    intervals: row.intervals.map((interval) => cloneInterval(interval)),
  };
}

// Official templates are immutable source material. Future edit flows must
// duplicate them into personal_timers before any user-authored changes.
export const OFFICIAL_TEMPLATE_DUPLICATION_RULE =
  "duplicate-before-edit";

export function listOfficialTemplatesSpec(): OfficialTemplateListSpec {
  return {
    table: "official_templates",
    filters: [
      {
        column: "is_published",
        operator: "eq",
        value: true,
      },
    ],
    orderBy: {
      column: "title",
      ascending: true,
    },
  };
}

export function getOfficialTemplateBySlugSpec(
  slug: string,
): OfficialTemplateListSpec {
  return {
    table: "official_templates",
    filters: [
      {
        column: "is_published",
        operator: "eq",
        value: true,
      },
      {
        column: "slug",
        operator: "eq",
        value: slug,
      },
    ],
    orderBy: {
      column: "title",
      ascending: true,
    },
  };
}

export function listMockOfficialTemplateRows(): OfficialTemplateRow[] {
  return mockOfficialTemplateRows.map((row) => cloneOfficialTemplateRow(row));
}

export function getMockOfficialTemplateRowBySlug(
  slug: string,
): OfficialTemplateRow | null {
  const row = mockOfficialTemplateRows.find((item) => item.slug === slug);

  return row ? cloneOfficialTemplateRow(row) : null;
}

export function mapOfficialTemplateRow(
  row: OfficialTemplateRow,
): OfficialTemplateRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    workoutType: row.workout_type,
    difficulty: row.difficulty,
    intervalCount: row.interval_count,
    totalSeconds: row.total_seconds,
    intervals: row.intervals,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toOfficialTemplatePreview(
  row: OfficialTemplateRow,
): OfficialTemplatePreview {
  const template = mapOfficialTemplateRow(row);

  return {
    id: template.id,
    slug: template.slug,
    title: template.title,
    summary: template.summary,
    workoutType: template.workoutType,
    intervalCount: template.intervalCount,
    totalSeconds: template.totalSeconds,
  };
}

export function buildPersonalTimerFromOfficialTemplateInput(
  template: OfficialTemplateRecord,
): TimerRecordInput {
  return {
    name: `${template.title} Copy`,
    description: template.summary,
    isDraft: true,
    source: "official-template",
    sourceTemplateId: template.id,
    intervals: template.intervals.map((interval) => ({
      ...interval,
    })),
    totalSeconds: template.totalSeconds,
  };
}
