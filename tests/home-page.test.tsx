import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { HomeDashboard } from "@/components/HomeDashboard";
import { mockStudentProfile } from "@/lib/mock-data";

describe("entry and home dashboard", () => {
  it("always starts with the branded profile-entry screen", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Student AI OS" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /프로필 입력하기/ })).toHaveAttribute("href", "/onboarding");
    expect(screen.queryByText("오늘 공부 시간")).not.toBeInTheDocument();
  });

  it("shows the requested metrics on the actual home dashboard", () => {
    render(<HomeDashboard profile={mockStudentProfile} />);

    expect(screen.getByText("오늘 공부 시간")).toBeInTheDocument();
    expect(screen.getByText("질문 수")).toBeInTheDocument();
    expect(screen.getByText("오늘 복습")).toBeInTheDocument();
    expect(screen.getByText("최저 점수")).toBeInTheDocument();
    expect(screen.queryByText("최근 학습 메모리")).not.toBeInTheDocument();
    expect(screen.queryByText("학습 운영 흐름")).not.toBeInTheDocument();
  });
});
