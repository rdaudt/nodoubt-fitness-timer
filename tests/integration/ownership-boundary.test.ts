import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  OFFICIAL_TEMPLATE_DUPLICATION_RULE,
  listOfficialTemplatesSpec,
} from "../../src/features/templates/repositories/official-templates";
import {
  MissingOwnerContextError,
  listPersonalTimersSpec,
} from "../../src/features/timers/repositories/personal-timers";

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/202604150001_phase1_foundation.sql",
);
const seedPath = resolve(process.cwd(), "supabase/seed.sql");

const migrationSql = readFileSync(migrationPath, "utf8");
const seedSql = readFileSync(seedPath, "utf8");

describe("ownership-boundary", () => {
  it("keeps the repository split aligned with the public-vs-private schema", () => {
    const officialTemplates = listOfficialTemplatesSpec();
    const personalTimers = listPersonalTimersSpec({ userId: "owner-1" });

    expect(officialTemplates.table).toBe("official_templates");
    expect(officialTemplates.filters).toContainEqual({
      column: "is_published",
      operator: "eq",
      value: true,
    });
    expect(personalTimers.table).toBe("personal_timers");
    expect(personalTimers.filters).toContainEqual({
      column: "owner_id",
      operator: "eq",
      value: "owner-1",
    });
  });

  it("documents duplicate-before-edit for official starter templates", () => {
    expect(OFFICIAL_TEMPLATE_DUPLICATION_RULE).toBe("duplicate-before-edit");
    expect(migrationSql).toContain("create table if not exists public.official_templates");
    expect(migrationSql).toContain("create table if not exists public.personal_timers");
  });

  it("enables row level security and authenticated owner policies for private timers", () => {
    expect(migrationSql).toContain(
      "alter table public.personal_timers enable row level security;",
    );
    expect(migrationSql).toContain(
      "alter table public.personal_timers force row level security;",
    );
    expect(migrationSql).toMatch(
      /create policy "personal timers are owner readable"[\s\S]*to authenticated[\s\S]*auth\.uid\(\)\)\s*=\s*owner_id/i,
    );
    expect(migrationSql).toMatch(
      /create policy "personal timers are owner insertable"[\s\S]*to authenticated[\s\S]*auth\.uid\(\)\)\s*=\s*owner_id/i,
    );
    expect(migrationSql).toMatch(
      /create policy "personal timers are owner updatable"[\s\S]*with check \(\(select auth\.uid\(\)\) = owner_id\)/i,
    );
    expect(migrationSql).toContain(
      "grant select, insert, update, delete on public.personal_timers to authenticated;",
    );
    expect(migrationSql).not.toContain(
      'create policy "personal timers are owner readable"\non public.personal_timers\nfor select\nto anon',
    );
  });

  it("proves unauthenticated personal reads fail closed in both code and SQL intent", () => {
    expect(() => listPersonalTimersSpec(undefined)).toThrow(
      MissingOwnerContextError,
    );
    expect(migrationSql).toMatch(
      /create policy "personal timers are owner readable"[\s\S]*to authenticated/i,
    );
  });

  it("seeds only official templates for guest browsing", () => {
    expect(seedSql).toContain("insert into public.official_templates");
    expect(seedSql).not.toContain("insert into public.personal_timers");
    expect(seedSql).not.toContain("insert into public.profiles");
  });
});
