"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpenCheck, PenLine } from "lucide-react";
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
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-700">{profile.grade}</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                {profile.name}의 Student AI OS
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                오늘은 {primarySubject} 중심으로 학습하고, {primaryWeakTopic}을 먼저 확인하세요.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
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

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">프로필 기준</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.targetSubjects.map((subject) => (
                  <span key={subject} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/onboarding"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
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
          ? "bg-slate-950 text-white hover:bg-slate-800"
          : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      }`}
    >
      <Icon aria-hidden="true" size={16} />
      {label}
    </Link>
  );
}
