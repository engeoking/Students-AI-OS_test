import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OnboardingForm } from "@/app/onboarding/OnboardingForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("OnboardingForm", () => {
  it("adds a custom recent-score subject with the plus button", () => {
    window.localStorage.clear();

    render(<OnboardingForm />);

    fireEvent.change(screen.getByLabelText("추가할 과목명"), {
      target: { value: "물리" },
    });
    fireEvent.click(screen.getByRole("button", { name: "최근 점수 과목 추가" }));

    expect(screen.getByLabelText("물리 과목명")).toBeInTheDocument();
    expect(screen.getByLabelText("물리 최근 점수")).toHaveValue(70);
  });

  it("removes a recent-score subject with the minus button", () => {
    window.localStorage.clear();

    render(<OnboardingForm />);

    expect(screen.getByLabelText("수학 최근 점수")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "수학 과목 삭제" }));

    expect(screen.queryByLabelText("수학 최근 점수")).not.toBeInTheDocument();
  });

  it("splits target subjects by comma or spacing immediately", () => {
    window.localStorage.clear();

    render(<OnboardingForm />);

    fireEvent.change(screen.getByLabelText("목표 과목"), {
      target: { value: "수학 영어,과학" },
    });

    expect(screen.getByText("수학 / 영어 / 과학")).toBeInTheDocument();
  });
});
