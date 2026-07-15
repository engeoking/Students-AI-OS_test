"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpenCheck, CalendarClock, FileText, MessageSquareText, UserRoundPen } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { mockParentSummary, mockReviewItems, mockStudySessions } from "@/lib/mock-data";
import { buildWrongAnswerReviews, readLearningRuns } from "@/lib/learning-storage";
import { getLowestScore } from "@/lib/student-os";
import type { LearningRun, StudentProfile } from "@/lib/types";

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
  const weakConcepts = Array.from(new Set([
    ...todaysRuns.flatMap((run) => run.weaknessReport?.weakConcepts ?? []),
    ...wrongReviews.slice(0, 4).map((review) => review.concept),
    ...profile.weakTopics,
  ])).slice(0, 5);
  const recentRuns = learningRuns.slice(0, 3);
  const [lowestSubject, lowestScore] = getLowestScore(profile);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1fr_22rem]">
            <div className="p-5 sm:p-7">
              <p className="text-sm font-semibold text-sky-700">{profile.grade}</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">{profile.name}의 Student AI OS</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    프로필, 진도 맞춤 문제, 오답 복습, 부모 리포트까지 이어지는 학습 운영 현황입니다.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/onboarding"
                    className="focus-ring inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                  >
                    프로필 수정
                  </Link>
                  <Link
                    href="/study"
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    학습 시작
                    <ArrowRight aria-hidden="true" size={17} />
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {profile.targetSubjects.map((subject) => (
                  <span key={subject} className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-slate-950 p-5 text-white lg:border-l lg:border-t-0 sm:p-7">
              <p className="text-sm font-semibold text-slate-300">다음 우선순위</p>
              <h2 className="mt-2 text-xl font-bold">{weakConcepts[0] ?? `${lowestSubject} 보강`}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                오늘은 약점 개념을 먼저 복습하고, 같은 유형 문제를 다시 풀어 정답률을 확인하세요.
              </p>
              <Link
                href="/review"
                className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-sky-50"
              >
                복습 큐 보기
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </aside>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="오늘 공부 시간" value={`${mockParentSummary.studyMinutes}분`} detail="오늘 누적 집중 시간" tone="emerald" />
          <MetricCard label="질문 수" value={`${solvedQuestionCount || mockParentSummary.questionCount}개`} detail={solvedQuestionCount ? "오늘 채점한 문제 기준" : "기본 리포트 기준"} tone="sky" />
          <MetricCard label="오늘 복습" value={`${todayReviewCount}개`} detail="오답/약점 개념 우선" tone="amber" />
          <MetricCard label="최저 점수" value={`${lowestSubject} ${lowestScore}점`} detail="우선 보강 과목" tone="rose" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">학습 운영 흐름</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">입력한 프로필이 학습과 리포트로 연결됩니다</h2>
              </div>
              <Link
                href="/parent-report"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                리포트 보기
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {flowCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="focus-ring rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-sky-300 hover:bg-white"
                  >
                    <span className="grid size-10 place-items-center rounded-lg bg-white text-slate-950 shadow-sm">
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <h3 className="mt-4 font-semibold text-slate-950">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.detail}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <CalendarClock aria-hidden="true" size={19} className="text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-500">시험까지</p>
                <h2 className="text-2xl font-bold text-slate-950">{profile.daysUntilExam}일</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <HomeLine icon={FileText} label="선호 학습 시간" value={profile.preferredStudyTime} />
              <HomeLine icon={BookOpenCheck} label="약점 개념" value={weakConcepts.slice(0, 3).join(" / ") || "오답 없음"} />
            </div>
          </aside>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">최근 학습 메모리</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">채점과 오답 기록이 다음 학습 방향을 만듭니다</h2>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {recentRuns.length > 0
              ? recentRuns.map((run) => (
                <article key={run.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-bold text-sky-800">
                      {run.subject}
                    </span>
                    <span className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                      {run.recommendedLlm.label}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-950">{run.progress.currentUnit}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {run.weaknessReport?.nextStudyDirection ?? `${run.gradedAnswers.length}문제를 채점했고 다음 복습 큐의 기반 데이터로 저장되었습니다.`}
                  </p>
                </article>
              ))
              : mockStudySessions.map((session) => (
                <article key={session.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-bold text-sky-800">
                      {session.recommendedAi}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{session.subject}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-950">{session.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{session.summary}</p>
                </article>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function HomeLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-slate-700">
        <Icon aria-hidden="true" size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-slate-500">{label}</span>
        <span className="block truncate text-sm font-bold text-slate-950">{value}</span>
      </span>
    </div>
  );
}
