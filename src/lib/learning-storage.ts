import type { LearningRun, WrongAnswerReview } from "./types";

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

export function buildWrongAnswerReviews(runs: LearningRun[]): WrongAnswerReview[] {
  return runs.flatMap((run) =>
    run.gradedAnswers
      .filter((answer) => !answer.isCorrect)
      .map((answer) => ({
        id: `${run.id}-${answer.question.id}`,
        subject: run.subject,
        concept: answer.question.concept,
        prompt: answer.question.prompt,
        studentAnswer: answer.studentAnswer || "무응답",
        correctAnswer: answer.question.answer,
        explanation: answer.explanation,
        createdAt: run.createdAt,
      })),
  );
}
