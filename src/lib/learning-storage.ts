import type { LearningRun } from "./types";

export const learningHistoryStorageKey = "student-ai-os-learning-runs";

export function readLearningRuns(): LearningRun[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(learningHistoryStorageKey);
  return stored ? (JSON.parse(stored) as LearningRun[]) : [];
}

export function saveLearningRun(run: LearningRun) {
  const nextRuns = [run, ...readLearningRuns()].slice(0, 12);
  window.localStorage.setItem(learningHistoryStorageKey, JSON.stringify(nextRuns));
  return nextRuns;
}
