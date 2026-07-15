import { describe, expect, it } from "vitest";
import {
  buildMockStudySession,
  createReviewItemsFromQuestion,
  groupReviewItemsByBucket,
  recommendAi,
} from "@/lib/student-os";
import type { ReviewItem } from "@/lib/types";

describe("student-os domain logic", () => {
  it("routes questions to the expected mock AI label", () => {
    expect(recommendAi("이차방정식 그래프가 어려워", "수학")).toBe("Math Tutor");
    expect(recommendAi("관계대명사 문법 설명해줘", "영어")).toBe("English Coach");
    expect(recommendAi("loop 종료 조건을 모르겠어", "코딩")).toBe("Coding Mentor");
  });

  it("creates immediate and spaced review items from a question", () => {
    const items = createReviewItemsFromQuestion("이차방정식 활용 문제를 틀렸어", "수학");

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.dueBucket)).toEqual(["today", "in7days"]);
    expect(items[0].topic).toBe("이차방정식 활용");
  });

  it("builds a study session with recommended AI and generated review items", () => {
    const session = buildMockStudySession("that과 which 차이 알려줘", "영어");

    expect(session.recommendedAi).toBe("English Coach");
    expect(session.createdReviewItems[0].topic).toBe("관계대명사 구분");
  });

  it("groups review items by due bucket", () => {
    const items: ReviewItem[] = [
      { id: "1", topic: "A", dueBucket: "today", status: "new", source: "ai-session" },
      { id: "2", topic: "B", dueBucket: "beforeExam", status: "scheduled", source: "weak-topic" },
    ];

    const grouped = groupReviewItemsByBucket(items);

    expect(grouped.today).toHaveLength(1);
    expect(grouped.beforeExam).toHaveLength(1);
    expect(grouped.tomorrow).toEqual([]);
  });
});
