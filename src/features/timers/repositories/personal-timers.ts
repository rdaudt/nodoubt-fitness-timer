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

const mockPersonalTimerSeed = [
  {
    id: "timer-monday-burn",
    name: "Monday Burn",
    description: "Steady strength intervals for the first training day.",
    is_draft: false,
    source: "scratch",
    source_template_id: null,
    definition_version: 1,
    intervals: [
      {
        id: "warmup",
        label: "Warm up",
        kind: "warmup",
        durationSeconds: 180,
      },
      {
        id: "set-1",
        label: "Set 1",
        kind: "work",
        durationSeconds: 45,
      },
      {
        id: "recover-1",
        label: "Recover",
        kind: "rest",
        durationSeconds: 30,
      },
      {
        id: "cooldown",
        label: "Cooldown",
        kind: "cooldown",
        durationSeconds: 180,
      },
    ] satisfies TimerRecord["intervals"],
    total_seconds: 435,
    created_at: "2026-04-10T14:00:00.000Z",
    updated_at: "2026-04-14T07:30:00.000Z",
  },
  {
    id: "timer-mobility-reset",
    name: "Mobility Reset Draft",
    description: "A partial recovery timer that still needs one more cooldown.",
    is_draft: true,
    source: "scratch",
    source_template_id: null,
    definition_version: 1,
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
        durationSeconds: 90,
      },
      {
        id: "flow-2",
        label: "Flow 2",
        kind: "work",
        durationSeconds: 90,
      },
    ] satisfies TimerRecord["intervals"],
    total_seconds: 300,
    created_at: "2026-04-12T09:00:00.000Z",
    updated_at: "2026-04-15T08:15:00.000Z",
  },
  {
    id: "timer-sprint-ladder",
    name: "Sprint Ladder",
    description: "A duplicated template tuned for short repeat efforts.",
    is_draft: false,
    source: "official-template",
    source_template_id: "00000000-0000-0000-0000-000000000101",
    definition_version: 1,
    intervals: [
      {
        id: "warmup",
        label: "Warm up",
        kind: "warmup",
        durationSeconds: 120,
      },
      {
        id: "sprint-1",
        label: "Sprint 1",
        kind: "work",
        durationSeconds: 30,
      },
      {
        id: "rest-1",
        label: "Walk",
        kind: "rest",
        durationSeconds: 30,
      },
      {
        id: "sprint-2",
        label: "Sprint 2",
        kind: "work",
        durationSeconds: 45,
      },
      {
        id: "rest-2",
        label: "Walk",
        kind: "rest",
        durationSeconds: 45,
      },
      {
        id: "cooldown",
        label: "Cooldown",
        kind: "cooldown",
        durationSeconds: 180,
      },
    ] satisfies TimerRecord["intervals"],
    total_seconds: 450,
    created_at: "2026-04-08T06:00:00.000Z",
    updated_at: "2026-04-13T12:00:00.000Z",
  },
] as const satisfies ReadonlyArray<
  Omit<PersonalTimerRow, "owner_id">
>;

const mockPersonalTimerStore = new Map<string, PersonalTimerRow[]>();

function cloneInterval(
  interval: TimerRecord["intervals"][number],
): TimerRecord["intervals"][number] {
  return {
    ...interval,
  };
}

function clonePersonalTimerRow(row: PersonalTimerRow): PersonalTimerRow {
  return {
    ...row,
    intervals: row.intervals.map((interval) => cloneInterval(interval)),
  };
}

function createSeededMockTimers(ownerId: string): PersonalTimerRow[] {
  return mockPersonalTimerSeed.map((row) => ({
    ...row,
    owner_id: ownerId,
    intervals: row.intervals.map((interval) => cloneInterval(interval)),
  }));
}

export function listMockPersonalTimerRows(
  session: OwnerSession | null | undefined,
): PersonalTimerRow[] {
  const ownerId = assertAuthenticatedOwner(session);
  const existing = mockPersonalTimerStore.get(ownerId);

  if (existing) {
    return existing.map((row) => clonePersonalTimerRow(row));
  }

  const seeded = createSeededMockTimers(ownerId);
  mockPersonalTimerStore.set(ownerId, seeded);

  return seeded.map((row) => clonePersonalTimerRow(row));
}

export function getMockPersonalTimerRowById(
  session: OwnerSession | null | undefined,
  timerId: string,
): PersonalTimerRow | null {
  const ownerId = assertAuthenticatedOwner(session);
  const rows = mockPersonalTimerStore.get(ownerId) ?? createSeededMockTimers(ownerId);

  if (!mockPersonalTimerStore.has(ownerId)) {
    mockPersonalTimerStore.set(ownerId, rows);
  }

  const row = rows.find((item) => item.id === timerId);

  return row ? clonePersonalTimerRow(row) : null;
}

export function insertMockPersonalTimerRow(
  session: OwnerSession | null | undefined,
  input: TimerRecordInput,
): PersonalTimerRow {
  const ownerId = assertAuthenticatedOwner(session);
  const existing =
    mockPersonalTimerStore.get(ownerId)?.map((row) => clonePersonalTimerRow(row)) ??
    createSeededMockTimers(ownerId);
  const timestamp = new Date().toISOString();
  const row: PersonalTimerRow = {
    id: `timer-${crypto.randomUUID()}`,
    owner_id: ownerId,
    name: input.name,
    description: input.description ?? null,
    is_draft: input.isDraft ?? true,
    source: input.source ?? "scratch",
    source_template_id: input.sourceTemplateId ?? null,
    definition_version: 1,
    intervals: input.intervals.map((interval) => cloneInterval(interval)),
    total_seconds: input.totalSeconds,
    created_at: timestamp,
    updated_at: timestamp,
  };

  mockPersonalTimerStore.set(ownerId, [row, ...existing]);

  return clonePersonalTimerRow(row);
}

export function renameMockPersonalTimerRow(
  session: OwnerSession | null | undefined,
  timerId: string,
  nextName: string,
): PersonalTimerRow | null {
  const ownerId = assertAuthenticatedOwner(session);
  const rows = mockPersonalTimerStore.get(ownerId) ?? createSeededMockTimers(ownerId);
  const normalizedName = nextName.trim();

  if (!mockPersonalTimerStore.has(ownerId)) {
    mockPersonalTimerStore.set(ownerId, rows);
  }

  if (!normalizedName) {
    return null;
  }

  let renamedRow: PersonalTimerRow | null = null;
  const updatedRows = rows.map((row) => {
    if (row.id !== timerId) {
      return row;
    }

    renamedRow = {
      ...row,
      name: normalizedName,
      updated_at: new Date().toISOString(),
    };

    return renamedRow;
  });

  mockPersonalTimerStore.set(ownerId, updatedRows);

  return renamedRow ? clonePersonalTimerRow(renamedRow) : null;
}

export function deleteMockPersonalTimerRow(
  session: OwnerSession | null | undefined,
  timerId: string,
): boolean {
  const ownerId = assertAuthenticatedOwner(session);
  const rows = mockPersonalTimerStore.get(ownerId) ?? createSeededMockTimers(ownerId);

  if (!mockPersonalTimerStore.has(ownerId)) {
    mockPersonalTimerStore.set(ownerId, rows);
  }

  const updatedRows = rows.filter((row) => row.id !== timerId);

  if (updatedRows.length === rows.length) {
    return false;
  }

  mockPersonalTimerStore.set(ownerId, updatedRows);

  return true;
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

export function buildDuplicatePersonalTimerInput(
  timer: TimerRecord,
): TimerRecordInput {
  return {
    name: `${timer.name} Copy`,
    description: timer.description,
    isDraft: true,
    source: timer.source,
    sourceTemplateId: timer.sourceTemplateId,
    intervals: timer.intervals.map((interval) => ({
      ...interval,
    })),
    totalSeconds: timer.totalSeconds,
  };
}

export function sortPersonalTimersByUpdatedAt(
  timers: TimerRecord[],
): TimerRecord[] {
  return [...timers].sort((left, right) => {
    return (
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
  });
}

export function searchPersonalTimers(
  timers: TimerRecord[],
  query: string,
): TimerRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...timers];
  }

  return timers.filter((timer) =>
    timer.name.toLowerCase().includes(normalizedQuery),
  );
}

export function getPersonalTimerSourceLabel(timer: TimerRecord): string {
  if (timer.source === "official-template") {
    return "Duplicated from official template";
  }

  return "Saved timer";
}
