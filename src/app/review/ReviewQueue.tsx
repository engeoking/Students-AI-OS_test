"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, ClipboardList, NotebookText } from "lucide-react";
import { mockReviewItems } from "@/lib/mock-data";
import { buildWrongAnswerReviews, readLearningRuns } from "@/lib/learning-storage";
import { readProfileOrMock } from "@/lib/profile-storage";
import { getProfileSubjects, groupReviewItemsByBucket, reviewBucketLabels } from "@/lib/student-os";
import type { ReviewBucket } from "@/lib/types";

const bucketOrder: ReviewBucket[] = ["today", "tomorrow", "in7days", "beforeExam"];

export function ReviewQueue() {
  const [profile] = useState(() => readProfileOrMock());
  const subjects = useMemo(() => getProfileSubjects(profile), [profile]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] ?? "수학");
  const [learningRuns] = useState(() => readLearningRuns());

  const grouped = groupReviewItemsByBucket(mockReviewItems);
  const wrongAnswerReviews = useMemo(
    () => buildWrongAnswerReviews(learningRuns).filter((review) => review.subject === selectedSubject),
    [learningRuns, selectedSubject],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <aside className="product-card p-4 lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-semibold text-slate-500">복습 과목 선택</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">{selectedSubject} 복습</h1>
        <div className="mt-4 grid gap-2">
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              className={`focus-ring rounded-lg border px-3 py-3 text-left text-sm font-semibold ${
                selectedSubject === subject
                  ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-rose-100 bg-rose-50/80 p-3">
          <p className="text-xs font-semibold text-rose-700">현재 과목 오답 노트</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{wrongAnswerReviews.length}개</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            학습에서 채점한 오답은 자동으로 이 복습 목록에 연결됩니다.
          </p>
        </div>
      </aside>

      <section className="space-y-5">
        <section className="product-card p-4 sm:p-6">
          <p className="text-sm font-semibold text-sky-700">복습 큐</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">약점과 오답 개념을 일정별로 관리합니다</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {bucketOrder.map((bucket) => (
              <div key={bucket} className="product-panel p-3">
                <p className="text-xs font-semibold text-slate-500">{reviewBucketLabels[bucket]}</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{grouped[bucket].length}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="product-card p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-700">
              <NotebookText aria-hidden="true" size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-rose-700">오답 노트</p>
              <h2 className="font-bold text-slate-950">{selectedSubject} 틀린 문제 풀이</h2>
            </div>
          </div>

          {wrongAnswerReviews.length > 0 ? (
            <div className="mt-4 space-y-3">
              {wrongAnswerReviews.map((review) => (
                <article key={review.id} className="rounded-lg border border-rose-100 bg-rose-50/80 p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-rose-800">{review.concept}</span>
                    <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-700">
                      {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-950">{review.prompt}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <p className="rounded-lg bg-white p-3 text-sm text-slate-700">
                      내 답: <strong>{review.studentAnswer}</strong>
                    </p>
                    <p className="rounded-lg bg-white p-3 text-sm text-slate-700">
                      정답: <strong>{review.correctAnswer}</strong>
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{review.explanation}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <ClipboardList aria-hidden="true" className="text-slate-500" size={18} />
                <p className="text-sm font-semibold text-slate-800">아직 저장된 {selectedSubject} 오답이 없습니다.</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                학습에서 진도 맞춤 문제를 풀고 채점하면 틀린 문제의 풀이와 이유가 여기에 쌓입니다.
              </p>
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {bucketOrder.map((bucket) => (
          <div key={bucket} className="product-card p-4">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                  <BookOpenCheck aria-hidden="true" size={18} />
                </span>
                <h2 className="font-bold text-slate-950">{reviewBucketLabels[bucket]}</h2>
              </div>
              <div className="mt-4 space-y-3">
                {grouped[bucket].map((item) => (
                  <article key={item.id} className="rounded-lg border border-slate-200 bg-white/70 p-3">
                    <p className="text-sm font-semibold text-slate-950">{item.topic}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">{item.source}</span>
                      <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}
