"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpenCheck, GraduationCap, PenLine } from "lucide-react";
import { mockParentSummary, mockReviewItems } from "@/lib/mock-data";
import { buildWrongAnswerReviews, readLearningRuns } from "@/lib/learning-storage";
import { getLowestScore } from "@/lib/student-os";
import type { LearningRun, StudentProfile } from "@/lib/types";

export function HomeDashboard({ profile }: { profile: StudentProfile }) {
  const [learningRuns] = useState<LearningRun[]>(() => readLearningRuns());
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysRuns = useMemo(
    () => learningRuns.filter((run) => run.createdAt.slice(0, 10) === todayKey),
    [learningRuns, todayKey],
  );
  const wrongReviews = useMemo(() => buildWrongAnswerReviews(learningRuns), [learningRuns]);
  const todayReviewCount = Math.max(
    mockReviewItems.filter((item) => item.dueBucket === "today").length,
    wrongReviews.filter((review) => review.createdAt.slice(0, 10) === todayKey).length,
  );
  const solvedQuestionCount = todaysRuns.reduce((total, run) => total + run.gradedAnswers.length, 0);
  const [lowestSubject, lowestScore] = getLowestScore(profile);
  const primarySubject = profile.targetSubjects[0] ?? lowestSubject;
  const primaryWeakTopic = profile.weakTopics[0] ?? `${lowestSubject} 보강`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.24),transparent_38rem)]" />
      <div className="absolute right-[-10rem] top-24 h-80 w-80 rounded-full bg-[#9B111E]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-lg border border-[#D4AF37]/25 bg-black/80 shadow-2xl shadow-black/40">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-5 sm:p-7 lg:p-8">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-lg bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20">
                  <GraduationCap aria-hidden="true" size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#D4AF37]">{profile.grade}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">Student Operating System</p>
                </div>
              </div>

              <h1 className="mt-8 max-w-3xl text-4xl font-black leading-[0.95] text-white sm:text-6xl">
                오늘의 학습을 한 화면에서 정리합니다.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70">
                {profile.name} 학생은 {primarySubject} 중심으로 진행하고, {primaryWeakTopic}을 먼저 보강하면 됩니다.
              </p>

              <div className="mt-7 grid gap-2 sm:grid-cols-3">
                <HomeAction href="/study" label="학습 시작" icon={PenLine} primary />
                <HomeAction href="/review" label="복습 큐" icon={BookOpenCheck} />
                <HomeAction href="/parent-report" label="리포트" icon={BarChart3} />
              </div>
            </div>

            <aside className="border-t border-[#D4AF37]/[0.18] bg-white/[0.035] p-5 sm:p-7 lg:border-l lg:border-t-0">
              <p className="text-sm font-bold text-[#D4AF37]">오늘의 운영 지표</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <HomeMetric label="오늘 공부 시간" value={`${mockParentSummary.studyMinutes}분`} detail="누적 집중" tone="gold" />
                <HomeMetric label="질문 수" value={`${solvedQuestionCount || mockParentSummary.questionCount}개`} detail={solvedQuestionCount ? "오늘 채점 기준" : "기본 리포트 기준"} tone="white" />
                <HomeMetric label="오늘 복습" value={`${todayReviewCount}개`} detail="우선 확인" tone="gold" />
                <HomeMetric label="최저 점수" value={`${lowestSubject} ${lowestScore}점`} detail="보강 우선" tone="ruby" />
              </div>
            </aside>
          </div>
        </section>

        <section className="rounded-lg border border-[#D4AF37]/20 bg-black/70 p-4 text-white shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#D4AF37]">프로필 기준 과목</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.targetSubjects.map((subject) => (
                  <span key={subject} className="rounded-lg border border-white/[0.12] bg-white/[0.08] px-3 py-2 text-xs font-bold text-white">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/onboarding"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/45 px-4 py-2 text-sm font-bold text-white hover:bg-[#D4AF37]/10"
            >
              프로필 수정
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function HomeMetric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "ruby" | "white";
}) {
  const toneClass = {
    gold: "border-[#D4AF37]/[0.28] text-[#D4AF37]",
    ruby: "border-[#9B111E]/[0.42] text-[#F2CED2]",
    white: "border-white/[0.14] text-white",
  }[tone];

  return (
    <div className={`rounded-lg border bg-black/[0.44] p-4 ${toneClass}`}>
      <p className="text-xs font-bold text-white/50">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold">{detail}</p>
    </div>
  );
}

function HomeAction({
  href,
  label,
  icon: Icon,
  primary = false,
}: {
  href: string;
  label: string;
  icon: typeof PenLine;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${
        primary
          ? "bg-[#D4AF37] text-black hover:bg-[#c6a12f]"
          : "border border-white/20 bg-white/5 text-white hover:bg-[#D4AF37]/10"
      }`}
    >
      <Icon aria-hidden="true" size={16} />
      {label}
    </Link>
  );
}
