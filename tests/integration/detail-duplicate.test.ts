import { describe, expect, it } from "vitest";

import {
  buildPersonalTimerFromOfficialTemplateInput,
  getMockOfficialTemplateRowBySlug,
  mapOfficialTemplateRow,
} from "../../src/features/templates/repositories/official-templates";
import {
  buildDuplicatePersonalTimerInput,
  getMockPersonalTimerRowById,
  listMockPersonalTimerRows,
  mapPersonalTimerRow,
} from "../../src/features/timers/repositories/personal-timers";

describe("detail-duplicate", () => {
  it("duplicates official templates into personal draft inputs without mutating the original template", () => {
    const sourceRow = getMockOfficialTemplateRowBySlug("starter-hiit-18");

    expect(sourceRow).toBeTruthy();

    const template = mapOfficialTemplateRow(sourceRow!);
    const duplicate = buildPersonalTimerFromOfficialTemplateInput(template);

    expect(duplicate.name).toBe("Starter HIIT 18 Copy");
    expect(duplicate.isDraft).toBe(true);
    expect(duplicate.source).toBe("official-template");
    expect(duplicate.sourceTemplateId).toBe(template.id);
    expect(duplicate.intervals).toEqual(template.intervals);

    duplicate.intervals[0]!.label = "Changed";

    expect(template.intervals[0]!.label).toBe("Warm up");
  });

  it("duplicates personal timers as editable copies without mutating the source timer", () => {
    const rows = listMockPersonalTimerRows({ userId: "user-42" });
    const sourceRow = getMockPersonalTimerRowById(
      { userId: "user-42" },
      rows[0]!.id,
    );

    expect(sourceRow).toBeTruthy();

    const timer = mapPersonalTimerRow(sourceRow!);
    const duplicate = buildDuplicatePersonalTimerInput(timer);

    expect(duplicate.name).toBe(`${timer.name} Copy`);
    expect(duplicate.isDraft).toBe(true);
    expect(duplicate.source).toBe(timer.source);
    expect(duplicate.sourceTemplateId).toBe(timer.sourceTemplateId);

    duplicate.intervals[0]!.label = "Changed";

    expect(timer.intervals[0]!.label).not.toBe("Changed");
  });
});
