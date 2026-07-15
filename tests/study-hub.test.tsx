import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { StudyHub } from "@/app/study/StudyHub";

describe("StudyHub", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("runs the mock upload, exam question, grading, and weakness workflow", async () => {
    render(<StudyHub />);

    expect(screen.getByText("프로필 관심 과목")).toBeInTheDocument();
    expect(screen.queryByText(/최근 점수/)).not.toBeInTheDocument();
    expect(screen.queryByText("학생 수준 분석")).not.toBeInTheDocument();
    expect(screen.queryByText("연결 LLM 반응 방식")).not.toBeInTheDocument();
    expect(screen.getByText("Math Tutor LLM")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("LLM에게 질문"), {
      target: { value: "그래프 꼭짓점이 뭐야?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "질문하기" }));
    expect(screen.getByText(/시험 포인트 기준으로 정리했습니다/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("오늘 배운 진도"), {
      target: { value: "이차방정식 활용 문제에서 문장 조건을 식으로 세우는 방법" },
    });

    expect(screen.getByText("직접 입력")).toBeInTheDocument();
    expect(screen.getByText("이차방정식 활용")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "진도 맞춤 문제 5개 만들기" }));
    expect(screen.getByLabelText("문제 1 답")).toBeInTheDocument();
    expect(screen.getByLabelText("문제 5 답")).toBeInTheDocument();
    expect(screen.getByLabelText("LLM에게 질문")).toBeDisabled();
    expect(screen.getByRole("button", { name: "문제 풀이 중 잠금" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("문제 1 답"), { target: { value: "wrong" } });
    fireEvent.change(screen.getByLabelText("문제 2 답"), { target: { value: "2,3" } });
    fireEvent.change(screen.getByLabelText("문제 3 답"), { target: { value: "(2,3)" } });
    fireEvent.change(screen.getByLabelText("문제 4 답"), { target: { value: "24" } });
    fireEvent.change(screen.getByLabelText("문제 5 답"), { target: { value: "7" } });

    fireEvent.click(screen.getByRole("button", { name: "채점하기" }));
    expect(screen.getByText("5문제 중 4문제 정답")).toBeInTheDocument();
    expect(screen.getByText("학습 데이터 저장됨")).toBeInTheDocument();
    expect(screen.getByText(/정답은 "4"/)).toBeInTheDocument();
    expect(screen.getByLabelText("LLM에게 질문")).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "약점 분석하기" }));
    expect(await screen.findByText(/약점 분석과 다음 진도/)).toBeInTheDocument();
    expect(screen.getAllByText("이차방정식 활용")[0]).toBeInTheDocument();
  });
});
