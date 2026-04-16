import type {
  TimerRecord,
  TimerRecordInput,
} from "../contracts/timer-record";

export interface OwnerSession {
  userId: string | null | undefined;
}

export interface PersonalTimerRow {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  is_draft: boolean;
  source: TimerRecord["source"];
  source_template_id: string | null;
  definition_version: number;
  intervals: TimerRecord["intervals"];
  total_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface PersonalTimerQuerySpec {
  table: "personal_timers";
  filters: Array<{
    column: "owner_id" | "is_draft";
    operator: "eq";
    value: string | boolean;
  }>;
  orderBy: {
    column: "updated_at";
    ascending: false;
  };
}

export interface PersonalTimerInsertRow {
  owner_id: string;
  name: string;
  description: string | null;
  is_draft: boolean;
  source: TimerRecord["source"];
  source_template_id: string | null;
  definition_version: number;
  intervals: TimerRecord["intervals"];
  total_seconds: number;
}

export class MissingOwnerContextError extends Error {
  constructor() {
    super("Personal timer access requires an authenticated owner.");
    this.name = "MissingOwnerContextError";
  }
}

export function assertAuthenticatedOwner(
  session: OwnerSession | null | undefined,
): string {
  const ownerId = session?.userId?.trim();

  if (!ownerId) {
    throw new MissingOwnerContextError();
  }

  return ownerId;
}

export function listPersonalTimersSpec(
  session: OwnerSession | null | undefined,
  options: { draftsOnly?: boolean } = {},
): PersonalTimerQuerySpec {
  const ownerId = assertAuthenticatedOwner(session);
  const filters: PersonalTimerQuerySpec["filters"] = [
    {
      column: "owner_id",
      operator: "eq",
      value: ownerId,
    },
  ];

  if (options.draftsOnly) {
    filters.push({
      column: "is_draft",
      operator: "eq",
      value: true,
    });
  }

  return {
    table: "personal_timers",
    filters,
    orderBy: {
      column: "updated_at",
      ascending: false,
    },
  };
}

export function buildPersonalTimerInsert(
  session: OwnerSession | null | undefined,
  input: TimerRecordInput,
): PersonalTimerInsertRow {
  return {
    owner_id: assertAuthenticatedOwner(session),
    name: input.name,
    description: input.description ?? null,
    is_draft: input.isDraft ?? true,
    source: input.source ?? "scratch",
    source_template_id: input.sourceTemplateId ?? null,
    definition_version: 1,
    intervals: input.intervals,
    total_seconds: input.totalSeconds,
  };
}

export function mapPersonalTimerRow(row: PersonalTimerRow): TimerRecord {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description,
    isDraft: row.is_draft,
    source: row.source,
    sourceTemplateId: row.source_template_id,
    definitionVersion: row.definition_version,
    intervals: row.intervals,
    totalSeconds: row.total_seconds,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
