"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, BookOpenCheck, GraduationCap, MessageSquareText, UserRoundPen } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { mockParentSummary, mockReviewItems, mockStudySessions } from "@/lib/mock-data";
import { profileStorageKey } from "@/lib/profile-storage";
import { getLowestScore } from "@/lib/student-os";
import type { StudentProfile } from "@/lib/types";

const flowCards = [
  {
    href: "/onboarding",
    title: "학생 프로필",
    detail: "학년, 목표 과목, 최근 점수, 시험일, 취약 단원을 한 번에 정리합니다.",
    icon: UserRoundPen,
  },
  {
    href: "/study",
    title: "학습 허브",
    detail: "질문을 입력하면 mock 라우터가 추천 AI와 답변, 복습 항목을 만듭니다.",
    icon: MessageSquareText,
  },
  {
    href: "/review",
    title: "복습 큐",
    detail: "오늘, 내일, 7일 후, 시험 전 복습으로 약점 개념을 관리합니다.",
    icon: BookOpenCheck,
  },
];

export default function HomePage() {
  const profile = useStoredProfile();

  if (!profile) {
    return <ProfileGate />;
  }

  return <HomeDashboard profile={profile} />;
}

function ProfileGate() {
  return (
    <section className="relative grid min-h-[calc(100svh-8rem)] place-items-center overflow-hidden bg-black px-4 py-16 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.18),transparent_24rem)]" />

      <div className="relative flex max-w-4xl flex-col items-center text-center">
        <div className="hero-cap-reveal grid size-20 place-items-center rounded-2xl bg-white text-black shadow-2xl shadow-white/10 sm:size-24">
          <GraduationCap aria-hidden="true" size={44} />
        </div>
        <h1 className="hero-title-reveal mt-7 text-5xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl">
          Student AI OS
        </h1>
        <Link
          href="/onboarding"
          className="hero-actions-reveal focus-ring mt-9 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-black hover:bg-slate-200"
        >
          프로필 입력
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}

function HomeDashboard({ profile }: { profile: StudentProfile }) {
  const todayReviewCount = mockReviewItems.filter((item) => item.dueBucket === "today").length;
  const [lowestSubject, lowestScore] = getLowestScore(profile);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-sky-300">{profile.grade}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{profile.name}의 홈</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                오늘의 공부 시간, 질문, 복습, 취약 점수를 한눈에 확인합니다.
              </p>
            </div>
            <Link
              href="/study"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-slate-200"
            >
              학습 시작
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="오늘 공부 시간" value={`${mockParentSummary.studyMinutes}분`} detail="최근 5일 중 최고 집중도" tone="emerald" />
          <MetricCard label="질문 수" value={`${mockParentSummary.questionCount}개`} detail="학습 허브 기록 기준" tone="sky" />
          <MetricCard label="오늘 복습" value={`${todayReviewCount}개`} detail="오답/약점 개념 우선" tone="amber" />
          <MetricCard label="최저 점수" value={`${lowestSubject} ${lowestScore}점`} detail="우선 보강 과목" tone="rose" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-400">핵심 이동</p>
                <h2 className="mt-1 text-xl font-bold text-white">프로필에서 리포트까지 이어지는 MVP 흐름</h2>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {flowCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="focus-ring rounded-lg border border-slate-800 bg-black p-4 hover:border-sky-400"
                  >
                    <span className="grid size-10 place-items-center rounded-lg bg-white text-black shadow-sm">
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <h3 className="mt-4 font-semibold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{card.detail}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-sm sm:p-5">
            <p className="text-sm font-semibold text-slate-400">최근 학습 메모리</p>
            <div className="mt-4 space-y-3">
              {mockStudySessions.map((session) => (
                <article key={session.question} className="rounded-lg border border-slate-800 bg-black p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-sky-950 px-2 py-1 text-xs font-semibold text-sky-200">
                      {session.recommendedAi}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{session.subject}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{session.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{session.summary}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function useStoredProfile() {
  const profileJson = useSyncExternalStore(
    subscribeToProfileStorage,
    readStoredProfileSnapshot,
    () => null,
  );

  return useMemo(() => (profileJson ? (JSON.parse(profileJson) as StudentProfile) : null), [profileJson]);
}

function subscribeToProfileStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function readStoredProfileSnapshot() {
  return window.localStorage.getItem(profileStorageKey);
}
