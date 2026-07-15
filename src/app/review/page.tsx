import { BookOpenCheck } from "lucide-react";
import { mockReviewItems } from "@/lib/mock-data";
import { groupReviewItemsByBucket, reviewBucketLabels } from "@/lib/student-os";
import type { ReviewBucket } from "@/lib/types";

const bucketOrder: ReviewBucket[] = ["today", "tomorrow", "in7days", "beforeExam"];

export default function ReviewPage() {
  const grouped = groupReviewItemsByBucket(mockReviewItems);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm font-semibold text-sky-700">복습 큐</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">약점과 오답 개념을 일정별로 관리합니다</h1>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {bucketOrder.map((bucket) => (
            <div key={bucket} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">{reviewBucketLabels[bucket]}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{grouped[bucket].length}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {bucketOrder.map((bucket) => (
          <div key={bucket} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                <BookOpenCheck aria-hidden="true" size={18} />
              </span>
              <h2 className="font-bold text-slate-950">{reviewBucketLabels[bucket]}</h2>
            </div>
            <div className="mt-4 space-y-3">
              {grouped[bucket].map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 p-3">
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
    </div>
  );
}
