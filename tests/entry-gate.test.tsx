import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EntryPage from "@/app/page";
import { AppShell } from "@/components/AppShell";
import { entryUnlockStorageKey } from "@/lib/entry-gate";

const replace = vi.fn();
let mockedPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockedPathname,
  useRouter: () => ({
    replace,
  }),
}));

describe("entry gate", () => {
  beforeEach(() => {
    mockedPathname = "/";
    replace.mockClear();
    window.sessionStorage.clear();
  });

  it("unlocks the protected app only when the profile-entry button is clicked", () => {
    render(<EntryPage />);

    fireEvent.click(screen.getByRole("link", { name: /프로필 입력하기/ }));

    expect(window.sessionStorage.getItem(entryUnlockStorageKey)).toBe("true");
  });

  it("redirects direct mobile-style internal links back to the entry screen", async () => {
    mockedPathname = "/home";

    render(
      <AppShell>
        <p>내부 홈</p>
      </AppShell>,
    );

    expect(screen.queryByText("내부 홈")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/");
    });
  });

  it("shows protected pages after the entry button unlocked the session", async () => {
    mockedPathname = "/home";
    window.sessionStorage.setItem(entryUnlockStorageKey, "true");

    render(
      <AppShell>
        <p>내부 홈</p>
      </AppShell>,
    );

    expect(await screen.findByText("내부 홈")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
