import { describe, expect, it } from "vitest";

import {
  MissingOwnerContextError,
  buildPersonalTimerInsert,
  listPersonalTimersSpec,
} from "../../src/features/timers/repositories/personal-timers";

describe("rls-boundary", () => {
  it("fails closed when no authenticated owner is present", () => {
    expect(() => listPersonalTimersSpec(null)).toThrow(MissingOwnerContextError);
  });

  it("always scopes personal timer reads to the signed-in owner", () => {
    const spec = listPersonalTimersSpec({ userId: "user-a" });

    expect(spec.table).toBe("personal_timers");
    expect(spec.filters).toContainEqual({
      column: "owner_id",
      operator: "eq",
      value: "user-a",
    });
    expect(spec.orderBy).toEqual({
      column: "updated_at",
      ascending: false,
    });
  });

  it("can request draft-only rows without dropping the owner boundary", () => {
    const spec = listPersonalTimersSpec(
      { userId: "user-b" },
      { draftsOnly: true },
    );

    expect(spec.filters).toEqual([
      {
        column: "owner_id",
        operator: "eq",
        value: "user-b",
      },
      {
        column: "is_draft",
        operator: "eq",
        value: true,
      },
    ]);
  });

  it("writes new personal timers with the authenticated owner id", () => {
    const insert = buildPersonalTimerInsert(
      { userId: "user-c" },
      {
        name: "Leg Day Draft",
        isDraft: true,
        source: "official-template",
        sourceTemplateId: "template-1",
        intervals: [],
        totalSeconds: 0,
      },
    );

    expect(insert.owner_id).toBe("user-c");
    expect(insert.source).toBe("official-template");
    expect(insert.source_template_id).toBe("template-1");
    expect(insert.is_draft).toBe(true);
  });
});
