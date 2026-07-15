import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudyHub } from "@/app/study/StudyHub";

describe("StudyHub", () => {
  it("shows a new mock answer and review items after a student question", () => {
    render(<StudyHub />);

    fireEvent.change(screen.getByLabelText("질문 과목"), {
      target: { value: "코딩" },
    });
    fireEvent.change(screen.getByLabelText("학생 질문"), {
      target: { value: "loop 종료 조건을 어떻게 잡아야 해?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "mock 답변 생성" }));

    expect(screen.getAllByText("Coding Mentor")[0]).toBeInTheDocument();
    expect(screen.getByText("반복문 조건 설계")).toBeInTheDocument();
    expect(screen.getByText("반복문 조건 설계 재확인")).toBeInTheDocument();
  });
});
