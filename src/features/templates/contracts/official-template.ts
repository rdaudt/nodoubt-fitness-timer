import type { TimerIntervalBlock } from "../../timers/contracts/timer-record";

export interface OfficialTemplateRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  workoutType: "hiit" | "strength" | "mobility" | "recovery";
  difficulty: "beginner" | "intermediate" | "advanced";
  intervalCount: number;
  totalSeconds: number;
  intervals: TimerIntervalBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface OfficialTemplatePreview {
  id: string;
  slug: string;
  title: string;
  summary: string;
  workoutType: OfficialTemplateRecord["workoutType"];
  intervalCount: number;
  totalSeconds: number;
}

export function toOfficialTemplatePreview(
  template: OfficialTemplateRecord,
): OfficialTemplatePreview {
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
