import Link from "next/link";
import { ArrowRight, BookOpenCheck, MessageSquareText, UserRoundPen } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { StudentSummary } from "@/components/StudentSummary";
import { mockParentSummary, mockReviewItems, mockStudySessions, mockStudentProfile } from "@/lib/mock-data";

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
  const todayReviewCount = mockReviewItems.filter((item) => item.dueBucket === "today").length;

  return (
    <div className="space-y-6">
      <StudentSummary />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="오늘 공부 시간" value={`${mockParentSummary.studyMinutes}분`} detail="최근 5일 중 최고 집중도" tone="emerald" />
        <MetricCard label="질문 수" value={`${mockParentSummary.questionCount}개`} detail="학습 허브 기록 기준" tone="sky" />
        <MetricCard label="오늘 복습" value={`${todayReviewCount}개`} detail="오답/약점 개념 우선" tone="amber" />
        <MetricCard label="최저 점수" value={`${mockStudentProfile.recentScores["수학"]}점`} detail="수학 약점 보강 필요" tone="rose" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">핵심 이동</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">프로필에서 리포트까지 이어지는 MVP 흐름</h2>
            </div>
            <Link
              href="/study"
              className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              학습 시작
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {flowCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="focus-ring rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-sky-200 hover:bg-sky-50"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-white text-slate-700 shadow-sm">
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
          <p className="text-sm font-semibold text-slate-500">최근 학습 메모리</p>
          <div className="mt-4 space-y-3">
            {mockStudySessions.map((session) => (
              <article key={session.question} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                    {session.recommendedAi}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{session.subject}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-950">{session.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{session.summary}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
