import { AlertCircle, Clock3, MessageCircleQuestion, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { mockParentSummary } from "@/lib/mock-data";

export default function ParentReportPage() {
  const maxMinutes = Math.max(...mockParentSummary.trend.map((item) => item.minutes));

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm font-semibold text-sky-700">부모 리포트</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">오늘의 학습 상태와 다음 액션</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="공부 시간" value={`${mockParentSummary.studyMinutes}분`} detail="오늘 누적 시간" tone="emerald" />
          <MetricCard label="질문 수" value={`${mockParentSummary.questionCount}개`} detail="과목별 AI 라우팅 포함" tone="sky" />
          <MetricCard label="취약 개념" value={`${mockParentSummary.weakConcepts.length}개`} detail={mockParentSummary.weakConcepts[0]} tone="rose" />
          <MetricCard label="추세" value="상승" detail="질문과 공부 시간이 함께 증가" tone="amber" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-2">
            <TrendingUp aria-hidden="true" size={19} className="text-sky-700" />
            <h2 className="text-xl font-bold text-slate-950">최근 학습 추이</h2>
          </div>
          <div className="mt-5 flex h-56 items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            {mockParentSummary.trend.map((item) => (
              <div key={item.day} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-sky-500"
                    style={{ height: `${Math.max(18, (item.minutes / maxMinutes) * 100)}%` }}
                    aria-label={`${item.day}요일 ${item.minutes}분`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-950">{item.day}</p>
                  <p className="text-xs text-slate-500">{item.questions}Q</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <AlertCircle aria-hidden="true" size={19} className="text-rose-700" />
              <h2 className="text-xl font-bold text-slate-950">취약 개념</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {mockParentSummary.weakConcepts.map((concept) => (
                <span key={concept} className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
                  {concept}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <Clock3 aria-hidden="true" size={19} className="text-emerald-700" />
              <h2 className="text-xl font-bold text-slate-950">추천 액션</h2>
            </div>
            <p className="mt-3 leading-7 text-slate-700">{mockParentSummary.recommendedAction}</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion aria-hidden="true" size={19} className="text-sky-700" />
              <h2 className="text-xl font-bold text-slate-950">요약</h2>
            </div>
            <p className="mt-3 leading-7 text-slate-700">
              질문 수가 늘면서 약점 개념이 더 명확해졌습니다. 오늘은 수학 오답 복습을 먼저 끝내면 시험 전 부담을 낮출 수 있습니다.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}
