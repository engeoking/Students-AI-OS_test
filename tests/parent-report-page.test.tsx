import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ParentReportPage from "@/app/parent-report/page";

describe("ParentReportPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the top report and trend graph while hiding the side summary cards", () => {
    render(<ParentReportPage />);

    expect(screen.getByText("오늘의 학습 상태와 다음 액션")).toBeInTheDocument();
    expect(screen.getByText("최근 학습 추이")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "추천 액션" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "요약" })).not.toBeInTheDocument();
  });
});
