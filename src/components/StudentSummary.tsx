import { CalendarDays, Target, TrendingUp } from "lucide-react";
import { mockStudentProfile } from "@/lib/mock-data";
import { getLowestScore } from "@/lib/student-os";

export function StudentSummary() {
  const [lowestSubject, lowestScore] = getLowestScore(mockStudentProfile);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#9B111E]">{mockStudentProfile.grade}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
            {mockStudentProfile.name}의 학습 OS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            목표 과목, 질문 기록, 약점, 복습 큐를 하나의 흐름으로 묶어 오늘 해야 할 학습을 보여줍니다.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold text-slate-500">시험까지</p>
          <p className="text-2xl font-bold text-slate-950">{mockStudentProfile.daysUntilExam}일</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SummaryLine icon={Target} label="목표 과목" value={mockStudentProfile.targetSubjects.join(" / ")} />
        <SummaryLine icon={TrendingUp} label="가장 낮은 최근 점수" value={`${lowestSubject} ${lowestScore}점`} />
        <SummaryLine icon={CalendarDays} label="선호 학습 시간" value={mockStudentProfile.preferredStudyTime} />
      </div>
    </section>
  );
}

function SummaryLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
        <Icon aria-hidden="true" size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-slate-500">{label}</span>
        <span className="block truncate text-sm font-semibold text-slate-900">{value}</span>
      </span>
    </div>
  );
}
