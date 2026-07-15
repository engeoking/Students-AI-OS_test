"use client";

import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, ClipboardCheck, ImageUp, Save } from "lucide-react";
import { readLearningRuns, saveLearningRun } from "@/lib/learning-storage";
import { readProfileOrMock } from "@/lib/profile-storage";
import {
  analyzeProgressFromUpload,
  analyzeProgressFromText,
  buildWeaknessReport,
  createLearningRun,
  generateExamQuestions,
  getProfileSubjects,
  gradePracticeAnswers,
} from "@/lib/student-os";
import type { GradedAnswer, LearningRun, PracticeQuestion, ProgressAnalysis, WeaknessReport } from "@/lib/types";

export function StudyHub() {
  const [profile] = useState(() => readProfileOrMock());
  const subjects = useMemo(() => getProfileSubjects(profile), [profile]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] ?? "수학");
  const [progressText, setProgressText] = useState("");
  const [progress, setProgress] = useState<ProgressAnalysis | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [gradedAnswers, setGradedAnswers] = useState<GradedAnswer[]>([]);
  const [showWeaknessReport, setShowWeaknessReport] = useState(false);
  const [savedRuns, setSavedRuns] = useState<LearningRun[]>(() => readLearningRuns());

  const correctCount = gradedAnswers.filter((answer) => answer.isCorrect).length;
  const weaknessReport = useMemo(
    () => (showWeaknessReport && gradedAnswers.length > 0
      ? buildWeaknessReport(profile, selectedSubject, gradedAnswers)
      : null),
    [gradedAnswers, profile, selectedSubject, showWeaknessReport],
  );
  const visibleWeaknessReport = showWeaknessReport
    ? weaknessReport ?? savedRuns.find((run) => run.weaknessReport)?.weaknessReport ?? null
    : null;

  function selectSubject(subject: string) {
    setSelectedSubject(subject);
    setProgressText("");
    setProgress(null);
    setQuestions([]);
    setAnswers({});
    setGradedAnswers([]);
    setShowWeaknessReport(false);
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setProgress(analyzeProgressFromUpload(file.name, selectedSubject));
    setQuestions([]);
    setAnswers({});
    setGradedAnswers([]);
    setShowWeaknessReport(false);
  }

  function handleProgressTextChange(value: string) {
    setProgressText(value);
    if (value.trim()) {
      setProgress(analyzeProgressFromText(value.trim(), selectedSubject));
    } else {
      setProgress(null);
    }
    setQuestions([]);
    setAnswers({});
    setGradedAnswers([]);
    setShowWeaknessReport(false);
  }

  function createQuestions() {
    if (!progress) {
      return;
    }

    const nextQuestions = generateExamQuestions(selectedSubject, progress);
    setQuestions(nextQuestions);
    setAnswers(Object.fromEntries(nextQuestions.map((question) => [question.id, ""])));
    setGradedAnswers([]);
    setShowWeaknessReport(false);
  }

  function updateAnswer(questionId: string, answer: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  }

  function gradeAnswers() {
    if (!progress || questions.length === 0) {
      return;
    }

    const nextGradedAnswers = gradePracticeAnswers(questions, answers);
    setGradedAnswers(nextGradedAnswers);
    setShowWeaknessReport(false);
    persistRun(progress, questions, nextGradedAnswers);
  }

  function analyzeWeakness() {
    if (!progress || gradedAnswers.length === 0) {
      return;
    }

    const nextReport = buildWeaknessReport(profile, selectedSubject, gradedAnswers);
    setShowWeaknessReport(true);
    persistRun(progress, questions, gradedAnswers, nextReport);
  }

  function persistRun(
    nextProgress: ProgressAnalysis,
    nextQuestions: PracticeQuestion[],
    nextGradedAnswers: GradedAnswer[],
    nextWeaknessReport?: WeaknessReport,
  ) {
    const run = createLearningRun({
      profile,
      subject: selectedSubject,
      progress: nextProgress,
      questions: nextQuestions,
      gradedAnswers: nextGradedAnswers,
      weaknessReport: nextWeaknessReport,
    });
    setSavedRuns(saveLearningRun(run));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-semibold text-slate-500">프로필 관심 과목</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">학습 과목 선택</h1>
        <div className="mt-4 grid gap-2">
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              className={`focus-ring rounded-lg border px-3 py-3 text-left text-sm font-semibold ${
                selectedSubject === subject
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => selectSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">저장된 학습 데이터</p>
          <p className="mt-1 text-lg font-bold text-slate-950">{savedRuns.length}회</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            채점과 약점 분석 결과는 다음 방문 때 복습 방향의 기초 데이터로 저장됩니다.
          </p>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-semibold text-sky-700">학습 허브</p>
          <div className="mt-1">
            <h2 className="text-2xl font-bold text-slate-950">{selectedSubject} 맞춤 문제 만들기</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              오늘 배운 진도를 사진으로 올리거나 글로 적으면, 그 진도에 맞춰 시험형 문제를 만들고 채점과 약점 분석까지 저장합니다.
            </p>
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">1. 오늘 배운 진도 입력</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                교재, 노트, 문제집 페이지 사진을 올리거나 오늘 배운 내용을 직접 적어주세요.
              </p>
            </div>
            <label className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              <ImageUp aria-hidden="true" size={17} />
              사진 선택
              <input aria-label="진도 사진 업로드" className="sr-only" type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">오늘 뭐 배웠나요?</span>
            <textarea
              aria-label="오늘 배운 진도"
              className="focus-ring min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="예: 이차방정식 활용 문제에서 문장 조건을 식으로 세우는 방법을 배웠어요."
              value={progressText}
              onChange={(event) => handleProgressTextChange(event.target.value)}
            />
          </label>

          {progress ? (
            <div className="mt-4 grid gap-3 rounded-lg border border-sky-100 bg-sky-50 p-4 md:grid-cols-3">
              <ProgressLine label="입력 방식" value={progress.sourceImageName} />
              <ProgressLine label="현재 진도" value={progress.currentUnit} />
              <ProgressLine label="학습 범위" value={progress.studiedRange} />
              <div className="md:col-span-3">
                <p className="text-xs font-semibold text-sky-700">시험 빈출 포인트</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {progress.examFocus.map((focus) => (
                    <span key={focus} className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-sky-800">
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            disabled={!progress}
            onClick={createQuestions}
          >
            <ClipboardCheck aria-hidden="true" size={17} />
            진도 맞춤 문제 5개 만들기
          </button>
        </section>

        {questions.length > 0 ? (
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-bold text-slate-950">2. 예상 문제 풀이</h2>
            <div className="mt-4 space-y-4">
              {questions.map((question, index) => (
                <article key={question.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                      문제 {index + 1}
                    </span>
                    <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
                      {question.concept}
                    </span>
                  </div>
                  <p className="mt-3 font-semibold leading-7 text-slate-950">{question.prompt}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{question.examPoint}</p>
                  <input
                    aria-label={`문제 ${index + 1} 답`}
                    className="focus-ring mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="답을 입력하세요"
                    value={answers[question.id] ?? ""}
                    onChange={(event) => updateAnswer(question.id, event.target.value)}
                  />
                </article>
              ))}
            </div>

            <button
              type="button"
              className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 sm:w-auto"
              onClick={gradeAnswers}
            >
              <CheckCircle2 aria-hidden="true" size={17} />
              채점하기
            </button>
          </section>
        ) : null}

        {gradedAnswers.length > 0 ? (
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">3. 채점 결과와 오답 해설</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {questions.length}문제 중 {correctCount}문제 정답
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
                <Save aria-hidden="true" size={17} />
                학습 데이터 저장됨
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {gradedAnswers.map((answer, index) => (
                <article
                  key={answer.question.id}
                  className={`rounded-lg border p-4 ${
                    answer.isCorrect ? "border-emerald-100 bg-emerald-50" : "border-rose-100 bg-rose-50"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-950">
                    문제 {index + 1}: {answer.isCorrect ? "정답" : "오답"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{answer.explanation}</p>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700 sm:w-auto"
              onClick={analyzeWeakness}
            >
              <BarChart3 aria-hidden="true" size={17} />
              약점 분석하기
            </button>
          </section>
        ) : null}

        {visibleWeaknessReport ? (
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-bold text-slate-950">4. 약점 분석과 다음 진도</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-[0.4fr_0.6fr]">
              <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
                <p className="text-xs font-semibold text-rose-700">약점 개념</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {visibleWeaknessReport.weakConcepts.map((concept) => (
                    <span key={concept} className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-rose-800">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold leading-6 text-slate-800">{visibleWeaknessReport.nextStudyDirection}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {visibleWeaknessReport.reviewPlan.map((plan) => (
                    <li key={plan}>{plan}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}

function ProgressLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-sky-700">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-950">{value}</p>
    </div>
  );
}
