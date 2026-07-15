"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ClipboardCheck, FileText } from "lucide-react";
import { readLearningRuns } from "@/lib/learning-storage";
import type { GradedAnswer, LearningRun } from "@/lib/types";

function toDateInputValue(dateText: string) {
  return new Date(dateText).toISOString().slice(0, 10);
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function getWeakConcepts(runs: LearningRun[]) {
  const fromReports = runs.flatMap((run) => run.weaknessReport?.weakConcepts ?? []);
  const fromWrongAnswers = runs.flatMap((run) =>
    run.gradedAnswers.filter((answer) => !answer.isCorrect).map((answer) => answer.question.concept),
  );

  return uniqueValues([...fromReports, ...fromWrongAnswers]);
}

function buildSubjectSummary(runs: LearningRun[]) {
  const gradedAnswers = runs.flatMap((run) => run.gradedAnswers);
  const correctCount = gradedAnswers.filter((answer) => answer.isCorrect).length;
  const weakConcepts = getWeakConcepts(runs);
  const latestRun = runs[0];

  return {
    totalQuestions: gradedAnswers.length,
    correctCount,
    weakConcepts,
    summary: latestRun?.weaknessReport?.nextStudyDirection
      ?? (weakConcepts.length > 0
        ? `${weakConcepts.join(", ")} 개념에서 오답이 나왔습니다. 다음 학습은 같은 유형을 다시 풀면서 조건 표시와 마지막 검산을 같이 확인해야 합니다.`
        : "오늘 풀이 기록에서는 뚜렷한 오답 약점이 적습니다. 다음 학습은 시간 제한을 두고 같은 단원의 변형 문제를 풀면 좋습니다."),
    wrongAnswers: gradedAnswers.filter((answer) => !answer.isCorrect),
  };
}

export function ParentLearningHistory() {
  const [runs] = useState(() => readLearningRuns());
  const dateOptions = useMemo(
    () => uniqueValues(runs.map((run) => toDateInputValue(run.createdAt))).sort().reverse(),
    [runs],
  );
  const [selectedDate, setSelectedDate] = useState(dateOptions[0] ?? new Date().toISOString().slice(0, 10));

  const runsForDate = useMemo(
    () => runs.filter((run) => toDateInputValue(run.createdAt) === selectedDate),
    [runs, selectedDate],
  );
  const subjects = useMemo(
    () => uniqueValues(runsForDate.map((run) => run.subject)),
    [runsForDate],
  );
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] ?? "");
  const activeSubject = subjects.includes(selectedSubject) ? selectedSubject : subjects[0] ?? "";
  const subjectRuns = runsForDate.filter((run) => run.subject === activeSubject);
  const subjectSummary = buildSubjectSummary(subjectRuns);

  function handleDateChange(value: string) {
    setSelectedDate(value);
    setSelectedSubject("");
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-700">날짜별 문제풀이 리포트</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">선택한 날의 과목별 약점과 요약</h2>
        </div>
        <label className="block min-w-48">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarDays aria-hidden="true" size={17} />
            날짜 선택
          </span>
          <input
            aria-label="리포트 날짜 선택"
            className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            type="date"
            value={selectedDate}
            onChange={(event) => handleDateChange(event.target.value)}
          />
        </label>
      </div>

      {subjects.length > 0 ? (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                className={`focus-ring rounded-lg border px-3 py-2 text-sm font-bold ${
                  activeSubject === subject
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.38fr_0.62fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck aria-hidden="true" className="text-sky-700" size={18} />
                <h3 className="font-bold text-slate-950">{activeSubject} 풀이 결과</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="문제 수" value={`${subjectSummary.totalQuestions}개`} />
                <Metric label="정답" value={`${subjectSummary.correctCount}개`} />
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700">취약 개념</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(subjectSummary.weakConcepts.length > 0 ? subjectSummary.weakConcepts : ["실전 속도 유지"]).map((concept) => (
                    <span key={concept} className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-800">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <FileText aria-hidden="true" className="text-emerald-700" size={18} />
                <h3 className="font-bold text-slate-950">요약 정리</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{subjectSummary.summary}</p>

              {subjectSummary.wrongAnswers.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {subjectSummary.wrongAnswers.slice(0, 3).map((answer) => (
                    <WrongAnswerLine key={answer.question.id} answer={answer} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-slate-950">선택한 날짜에 저장된 문제풀이 기록이 없습니다.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            학습 화면에서 진도 맞춤 문제를 풀고 채점하면 이곳에서 날짜와 과목별로 취약 개념을 확인할 수 있습니다.
          </p>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function WrongAnswerLine({ answer }: { answer: GradedAnswer }) {
  return (
    <article className="rounded-lg border border-rose-100 bg-rose-50 p-3">
      <p className="text-sm font-bold text-slate-950">{answer.question.concept}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{answer.explanation}</p>
    </article>
  );
}
