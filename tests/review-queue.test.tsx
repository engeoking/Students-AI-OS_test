import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ReviewQueue } from "@/app/review/ReviewQueue";
import { learningHistoryStorageKey } from "@/lib/learning-storage";
import type { LearningRun } from "@/lib/types";

describe("ReviewQueue", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows subject selection and turns saved wrong answers into review notes", () => {
    const run: LearningRun = {
      id: "learning-test",
      subject: "수학",
      level: "내신 실전",
      recommendedLlm: {
        label: "Math Tutor LLM",
        reason: "mock",
      },
      progress: {
        subject: "수학",
        sourceImageName: "직접 입력",
        currentUnit: "함수 그래프",
        studiedRange: "그래프 꼭짓점",
        examFocus: ["그래프 해석"],
        recommendedQuestionCount: 5,
      },
      questions: [],
      gradedAnswers: [
        {
          question: {
            id: "math-wrong",
            subject: "수학",
            prompt: "y=(x-2)^2+3 그래프의 꼭짓점 좌표를 쓰세요.",
            answer: "(2,3)",
            concept: "함수 그래프",
            examPoint: "꼭짓점 형태 해석",
          },
          studentAnswer: "(3,2)",
          isCorrect: false,
          explanation: "오답입니다. 정답은 \"(2,3)\"입니다. 그래프 꼭짓점은 괄호 안 부호를 반대로 봅니다.",
        },
      ],
      createdAt: "2026-07-15T00:00:00.000Z",
    };

    window.localStorage.setItem(learningHistoryStorageKey, JSON.stringify([run]));
    render(<ReviewQueue />);

    expect(screen.getByText("복습 과목 선택")).toBeInTheDocument();
    expect(screen.getByText("수학 틀린 문제 풀이")).toBeInTheDocument();
    expect(screen.getByText("함수 그래프")).toBeInTheDocument();
    expect(screen.getByText(/내 답:/)).toHaveTextContent("(3,2)");
    expect(screen.getByText(/정답:/)).toHaveTextContent("(2,3)");
    expect(screen.getByText(/괄호 안 부호/)).toBeInTheDocument();
  });
});
