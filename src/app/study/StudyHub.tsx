"use client";

import { useState } from "react";
import { BrainCircuit, Plus, Send } from "lucide-react";
import { mockStudySessions } from "@/lib/mock-data";
import { buildMockStudySession } from "@/lib/student-os";
import type { StudySession } from "@/lib/types";

const subjects = ["수학", "영어", "코딩", "과학", "국어"];

export function StudyHub() {
  const [question, setQuestion] = useState("이차방정식 활용 문제에서 식을 어떻게 세워야 해?");
  const [subject, setSubject] = useState("수학");
  const [sessions, setSessions] = useState<StudySession[]>(mockStudySessions);
  const latest = sessions[0];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }

    const nextSession = buildMockStudySession(question.trim(), subject);
    setSessions((current) => [nextSession, ...current]);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.62fr_0.38fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-semibold text-sky-700">학습 허브</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">질문하면 추천 AI와 복습 큐가 이어집니다</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-[0.35fr_0.65fr]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">질문 과목</span>
              <select
                className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              >
                {subjects.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">학생 질문</span>
              <textarea
                className="focus-ring min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"
          >
            <Send aria-hidden="true" size={17} />
            mock 답변 생성
          </button>
        </form>

        <article className="mt-6 rounded-lg border border-sky-100 bg-sky-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1 text-sm font-bold text-sky-800 shadow-sm">
              <BrainCircuit aria-hidden="true" size={17} />
              {latest.recommendedAi}
            </span>
            <span className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white">{latest.subject}</span>
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-950">mock 답변</h2>
          <p className="mt-2 leading-7 text-slate-700">{latest.summary}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {latest.createdReviewItems.map((item) => (
              <div key={item.id} className="rounded-lg border border-white bg-white p-3 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">생성된 복습 항목</p>
                <p className="mt-1 font-semibold text-slate-950">{item.topic}</p>
                <p className="mt-2 text-sm text-slate-600">{item.dueBucket === "today" ? "오늘 복습" : "7일 후 복습"}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">질문 기록</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">{sessions.length}개 세션</h2>
          </div>
          <span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
            <Plus aria-hidden="true" size={19} />
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {sessions.map((session, index) => (
            <article key={`${session.question}-${index}`} className="rounded-lg border border-slate-200 p-3">
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {session.recommendedAi}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-950">{session.question}</h3>
              <p className="mt-2 text-xs text-slate-500">복습 {session.createdReviewItems.length}개 생성</p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
