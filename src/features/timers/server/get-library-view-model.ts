import {
  createServer,
  getNeonEnv,
  isAuthTestMode,
} from "../../../../lib/neon/server";
import type {
  AuthContext,
  SignedInAuthContext,
} from "../../auth/server/get-auth-context";
import { getAuthContext } from "../../auth/server/get-auth-context";
import type { ProfileDisplayRecord } from "../../profiles/contracts/profile";
import {
  getPersonalTimerSourceLabel,
  listMockPersonalTimerRows,
  listPersonalTimersSpec,
  mapPersonalTimerRow,
  sortPersonalTimersByUpdatedAt,
  type PersonalTimerRow,
} from "../repositories/personal-timers";

const personalTimerSelect =
  "id, owner_id, name, description, is_draft, source, source_template_id, definition_version, intervals, total_seconds, created_at, updated_at";

export interface LibraryTimerCard {
  id: string;
  detailHref: string;
  name: string;
  description: string | null;
  draftLabel: "Draft" | null;
  intervalCount: number;
  totalSeconds: number;
  sourceLabel: string;
  updatedAt: string;
  isEditLocked: boolean;
}

export interface LibraryViewModel {
  auth: AuthContext;
  authStatusLabel: "Guest" | "Signed In";
  profile: ProfileDisplayRecord | null;
  heading: string;
  description: string;
  searchQuery: string;
  statusSummary: string;
  activeRunTimerId: string | null;
  hasUnknownActiveRunLock: boolean;
  items: LibraryTimerCard[];
  emptyStateTitle: string;
  emptyStateDescription: string;
}

export interface LibraryViewModelDependencies {
  getAuthContext: () => Promise<AuthContext>;
  loadPersonalTimers: (
    authContext: SignedInAuthContext,
  ) => Promise<LibraryTimerCard[]>;
  readActiveRunMarker: () => Promise<{
    timerId: string | null;
    malformed: boolean;
  }>;
}

function normalizeSearchQuery(input: string | string[] | undefined): string {
  if (Array.isArray(input)) {
    return input[0]?.trim() ?? "";
  }

  return input?.trim() ?? "";
}

function sortLibraryTimerCardsByUpdatedAt(
  items: LibraryTimerCard[],
): LibraryTimerCard[] {
  return [...items].sort((left, right) => {
    return (
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
  });
}

function searchLibraryTimerCards(
  items: LibraryTimerCard[],
  searchQuery: string,
): LibraryTimerCard[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return sortLibraryTimerCardsByUpdatedAt(items);
  }

  return sortLibraryTimerCardsByUpdatedAt(
    items.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery),
    ),
  );
}

async function defaultLoadPersonalTimers(
  authContext: SignedInAuthContext,
): Promise<LibraryTimerCard[]> {
  if (isAuthTestMode()) {
    return sortPersonalTimersByUpdatedAt(
      listMockPersonalTimerRows({ userId: authContext.userId }).map((row) =>
        mapPersonalTimerRow(row),
      ),
    ).map((timer) => ({
      id: timer.id,
      detailHref: `/timers/${timer.id}`,
      name: timer.name,
      description: timer.description,
      draftLabel: timer.isDraft ? "Draft" : null,
      intervalCount: timer.intervals.length,
      totalSeconds: timer.totalSeconds,
      sourceLabel: getPersonalTimerSourceLabel(timer),
      updatedAt: timer.updatedAt,
      isEditLocked: false,
    }));
  }

  if (!getNeonEnv()) {
    return [];
  }

  try {
    const database = await createServer();
    const spec = listPersonalTimersSpec({ userId: authContext.userId });

    let query = database.from(spec.table).select(personalTimerSelect);

    for (const filter of spec.filters) {
      query = query.eq(filter.column, filter.value);
    }

    const { data, error } = await query.order(spec.orderBy.column, {
      ascending: spec.orderBy.ascending,
    });

    if (error || !data?.length) {
      return [];
    }

    return sortPersonalTimersByUpdatedAt(
      (data as PersonalTimerRow[]).map((row) => mapPersonalTimerRow(row)),
    ).map((timer) => ({
      id: timer.id,
      detailHref: `/timers/${timer.id}`,
      name: timer.name,
      description: timer.description,
      draftLabel: timer.isDraft ? "Draft" : null,
      intervalCount: timer.intervals.length,
      totalSeconds: timer.totalSeconds,
      sourceLabel: getPersonalTimerSourceLabel(timer),
      updatedAt: timer.updatedAt,
      isEditLocked: false,
    }));
  } catch {
    return [];
  }
}

function parseActiveRunMarker(rawValue: string | null | undefined): {
  timerId: string | null;
  malformed: boolean;
} {
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

async function defaultReadActiveRunMarker() {
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

function buildStatusSummary(itemCount: number, searchQuery: string): string {
  if (!searchQuery) {
    return `${itemCount} timer${itemCount === 1 ? "" : "s"} sorted by recently updated.`;
  }

  return `${itemCount} match${itemCount === 1 ? "" : "es"} for "${searchQuery}".`;
}

export async function getLibraryViewModel(
  searchInput: string | string[] | undefined,
  overrides: Partial<LibraryViewModelDependencies> = {},
): Promise<LibraryViewModel> {
  const dependencies: LibraryViewModelDependencies = {
    getAuthContext,
    loadPersonalTimers: defaultLoadPersonalTimers,
    readActiveRunMarker: defaultReadActiveRunMarker,
    ...overrides,
  };

  const auth = await dependencies.getAuthContext();
  const searchQuery = normalizeSearchQuery(searchInput);

  if (auth.kind === "guest") {
    return {
      auth,
      authStatusLabel: "Guest",
      profile: null,
      heading: "Build a private timer library once you sign in.",
      description:
        "Your personal timers stay owner-scoped, so the library only opens after authentication.",
      searchQuery,
      statusSummary: "Sign in to browse saved and draft timers.",
      activeRunTimerId: null,
      hasUnknownActiveRunLock: false,
      items: [],
      emptyStateTitle: "Library unavailable for guests",
      emptyStateDescription:
        "Browse official templates first, then sign in when you want a private library that follows you back.",
    };
  }

  const loadedItems = await dependencies.loadPersonalTimers(auth);
  const activeRunMarker = await dependencies.readActiveRunMarker();
  const activeRunTimerId = activeRunMarker.malformed ? null : activeRunMarker.timerId;
  const enrichedItems = loadedItems.map((item) => ({
    ...item,
    isEditLocked:
      activeRunMarker.malformed ||
      (!!activeRunTimerId && item.id === activeRunTimerId),
  }));
  const filteredItems = searchLibraryTimerCards(enrichedItems, searchQuery);

  return {
    auth,
    authStatusLabel: "Signed In",
    profile: auth.profile,
    heading: "My Library",
    description:
      "Search personal timers, spot drafts immediately, and open any timer into its detail review screen.",
    searchQuery,
    statusSummary: buildStatusSummary(filteredItems.length, searchQuery),
    activeRunTimerId,
    hasUnknownActiveRunLock: activeRunMarker.malformed,
    items: filteredItems,
    emptyStateTitle: searchQuery
      ? "No timers matched that search"
      : "Your library is still empty",
    emptyStateDescription: searchQuery
      ? "Try a broader name search or clear the filter to see everything again."
      : "Duplicate an official template or create a timer from scratch to start building your library.",
  };
}

