import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ParentLearningHistory } from "@/app/parent-report/ParentLearningHistory";
import { learningHistoryStorageKey } from "@/lib/learning-storage";
import type { LearningRun } from "@/lib/types";

function makeRun(subject: string, concept: string, createdAt: string): LearningRun {
  return {
    id: `${subject}-${createdAt}`,
    subject,
    level: "내신 실전",
    recommendedLlm: {
      label: `${subject} LLM`,
      reason: "mock",
    },
    progress: {
      subject,
      sourceImageName: "직접 입력",
      currentUnit: concept,
      studiedRange: concept,
      examFocus: [concept],
      recommendedQuestionCount: 5,
    },
    questions: [],
    gradedAnswers: [
      {
        question: {
          id: `${subject}-wrong`,
          subject,
          prompt: `${concept} 문제`,
          answer: "정답",
          concept,
          examPoint: "시험 포인트",
        },
        studentAnswer: "오답",
        isCorrect: false,
        explanation: `${concept} 풀이 설명입니다.`,
      },
    ],
    weaknessReport: {
      level: "내신 실전",
      weakConcepts: [concept],
      nextStudyDirection: `${concept} 중심으로 다시 풀어야 합니다.`,
      reviewPlan: ["내일 다시 풀기"],
    },
    createdAt,
  };
}

describe("ParentLearningHistory", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("filters saved learning runs by date and subject", () => {
    const runs = [
      makeRun("수학", "함수 그래프", "2026-07-15T03:00:00.000Z"),
      makeRun("과학", "운동 그래프", "2026-07-15T04:00:00.000Z"),
      makeRun("영어", "관계대명사", "2026-07-14T04:00:00.000Z"),
    ];
    window.localStorage.setItem(learningHistoryStorageKey, JSON.stringify(runs));

    render(<ParentLearningHistory />);

    expect(screen.getByLabelText("리포트 날짜 선택")).toHaveValue("2026-07-15");
    expect(screen.getByRole("button", { name: "수학" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "과학" })).toBeInTheDocument();
    expect(screen.getAllByText("함수 그래프").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "과학" }));
    expect(screen.getAllByText("운동 그래프").length).toBeGreaterThan(0);
    expect(screen.getByText(/운동 그래프 중심으로 다시 풀어야 합니다/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("리포트 날짜 선택"), {
      target: { value: "2026-07-14" },
    });
    expect(screen.getByRole("button", { name: "영어" })).toBeInTheDocument();
    expect(screen.getAllByText("관계대명사").length).toBeGreaterThan(0);
  });
});
