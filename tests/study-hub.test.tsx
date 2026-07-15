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
    expect(screen.getAllByText("Math Tutor LLM")[0]).toBeInTheDocument();

    const file = new File(["mock"], "math-progress.jpg", { type: "image/jpeg" });
    fireEvent.change(screen.getByLabelText("진도 사진 업로드"), {
      target: { files: [file] },
    });

    expect(screen.getByText("math-progress.jpg")).toBeInTheDocument();
    expect(screen.getByText("이차방정식 활용과 함수 그래프")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "시험형 문제 5개 만들기" }));
    expect(screen.getByLabelText("문제 1 답")).toBeInTheDocument();
    expect(screen.getByLabelText("문제 5 답")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("문제 1 답"), { target: { value: "wrong" } });
    fireEvent.change(screen.getByLabelText("문제 2 답"), { target: { value: "2,3" } });
    fireEvent.change(screen.getByLabelText("문제 3 답"), { target: { value: "(2,3)" } });
    fireEvent.change(screen.getByLabelText("문제 4 답"), { target: { value: "-4,4" } });
    fireEvent.change(screen.getByLabelText("문제 5 답"), { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: "채점하기" }));
    expect(screen.getByText("5문제 중 4문제 정답")).toBeInTheDocument();
    expect(screen.getByText("학습 데이터 저장됨")).toBeInTheDocument();
    expect(screen.getByText(/정답은 "4"/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "약점 분석하기" }));
    expect(await screen.findByText(/약점 분석과 다음 진도/)).toBeInTheDocument();
    expect(screen.getAllByText("이차방정식 활용")[0]).toBeInTheDocument();
  });
});
