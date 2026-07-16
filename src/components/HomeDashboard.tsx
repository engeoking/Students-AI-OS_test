"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpenCheck, GraduationCap, PenLine } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
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
      <div className="absolute inset-x-0 top-16 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.18),transparent_34rem)]" />
      <div className="relative mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/30 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="grid size-12 place-items-center rounded-lg bg-white text-slate-950 shadow-lg shadow-white/10">
                <GraduationCap aria-hidden="true" size={26} />
              </div>
              <p className="mt-5 text-sm font-semibold text-sky-200">{profile.grade}</p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-5xl">
                Student AI OS
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {profile.name} 학생은 오늘 {primarySubject} 중심으로 학습하고, {primaryWeakTopic}을 먼저 확인하면 됩니다.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
              <HomeAction href="/study" label="학습 시작" icon={PenLine} primary />
              <HomeAction href="/review" label="복습 큐" icon={BookOpenCheck} />
              <HomeAction href="/parent-report" label="리포트" icon={BarChart3} />
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="오늘 공부 시간" value={`${mockParentSummary.studyMinutes}분`} detail="오늘 누적 집중 시간" tone="emerald" />
          <MetricCard label="질문 수" value={`${solvedQuestionCount || mockParentSummary.questionCount}개`} detail={solvedQuestionCount ? "오늘 채점 기준" : "기본 리포트 기준"} tone="sky" />
          <MetricCard label="오늘 복습" value={`${todayReviewCount}개`} detail="우선 확인할 항목" tone="amber" />
          <MetricCard label="최저 점수" value={`${lowestSubject} ${lowestScore}점`} detail="보강 우선순위" tone="rose" />
        </section>

        <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-white shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-300">프로필 기준</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.targetSubjects.map((subject) => (
                  <span key={subject} className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-slate-100">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/onboarding"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
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
          ? "bg-sky-300 text-slate-950 hover:bg-sky-200"
          : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
      }`}
    >
      <Icon aria-hidden="true" size={16} />
      {label}
    </Link>
  );
}
