import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { mockStudentProfile } from "@/lib/mock-data";
import { profileStorageKey } from "@/lib/profile-storage";

describe("HomePage profile gate", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows only the branded intro before a profile is saved", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Student AI OS" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /프로필 입력/ })).toHaveAttribute("href", "/onboarding");
    expect(screen.queryByText("오늘 공부 시간")).not.toBeInTheDocument();
  });

  it("shows the home metrics after a profile exists", () => {
    window.localStorage.setItem(profileStorageKey, JSON.stringify(mockStudentProfile));

    render(<HomePage />);

    expect(screen.getByText("오늘 공부 시간")).toBeInTheDocument();
    expect(screen.getByText("질문 수")).toBeInTheDocument();
    expect(screen.getByText("오늘 복습")).toBeInTheDocument();
    expect(screen.getByText("최저 점수")).toBeInTheDocument();
  });
});
