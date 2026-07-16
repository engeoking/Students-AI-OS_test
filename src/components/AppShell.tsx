"use client";

import Link from "next/link";
import { BarChart3, BookOpenCheck, ClipboardList, GraduationCap, Home, MessageSquareText } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/onboarding", label: "프로필", icon: ClipboardList },
  { href: "/study", label: "학습", icon: MessageSquareText },
  { href: "/review", label: "복습", icon: BookOpenCheck },
  { href: "/parent-report", label: "리포트", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEntry = pathname === "/";
  const isHome = pathname === "/home";
  const mainClass = isEntry
    ? "bg-black"
    : isHome
      ? ""
    : "mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8";

  return (
    <div className="min-h-screen">
      {isEntry ? null : <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/home" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-950 text-white shadow-sm">
              <GraduationCap aria-hidden="true" size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-950">Student AI OS</span>
              <span className="block truncate text-xs font-medium text-slate-500">learning memory MVP</span>
            </span>
          </Link>

          <nav aria-label="주요 화면" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "border border-sky-200 bg-sky-50 text-sky-800"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon aria-hidden="true" size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>}

      <main className={mainClass}>{children}</main>

      {isEntry ? null : <nav aria-label="모바일 주요 화면" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${
                  active ? "text-slate-950" : "text-slate-500"
                }`}
              >
                <Icon aria-hidden="true" size={19} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>}
      {isEntry ? null : <div className="h-20 md:hidden" />}
    </div>
  );
}
