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
    column: "is_published";
    operator: "eq";
    value: true;
  }>;
  orderBy: {
    column: "title";
    ascending: true;
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
