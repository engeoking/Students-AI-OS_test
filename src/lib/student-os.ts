import { mockReviewItems } from "./mock-data";
import type { ReviewBucket, ReviewItem, StudySession, StudentProfile } from "./types";

export const aiLabelsBySubject: Record<string, string> = {
  "수학": "Math Tutor",
  "영어": "English Coach",
  "코딩": "Coding Mentor",
  "과학": "Science Guide",
  "국어": "Reading Coach",
};

export const reviewBucketLabels: Record<ReviewBucket, string> = {
  today: "오늘 복습",
  tomorrow: "내일 복습",
  in7days: "7일 후 복습",
  beforeExam: "시험 전 최종 복습",
};

export function recommendAi(question: string, selectedSubject: string): string {
  const normalized = `${selectedSubject} ${question}`.toLowerCase();

  if (normalized.includes("수학") || normalized.includes("방정식") || normalized.includes("그래프")) {
    return "Math Tutor";
  }

  if (normalized.includes("영어") || normalized.includes("grammar") || normalized.includes("문법")) {
    return "English Coach";
  }

  if (normalized.includes("코딩") || normalized.includes("loop") || normalized.includes("함수")) {
    return "Coding Mentor";
  }

  return aiLabelsBySubject[selectedSubject] ?? "Study Coach";
}

export function createReviewItemsFromQuestion(question: string, subject: string): ReviewItem[] {
  const topic = inferTopic(question, subject);

  return [
    {
      id: `generated-${subject}-today`,
      topic,
      dueBucket: "today",
      status: "new",
      source: "ai-session",
    },
    {
      id: `generated-${subject}-in7days`,
      topic: `${topic} 재확인`,
      dueBucket: "in7days",
      status: "scheduled",
      source: "ai-session",
    },
  ];
}

export function buildMockStudySession(question: string, subject: string): StudySession {
  const recommendedAi = recommendAi(question, subject);
  const createdReviewItems = createReviewItemsFromQuestion(question, subject);

  return {
    question,
    subject,
    recommendedAi,
    summary: `${recommendedAi}가 핵심 개념을 짧게 정리하고, 같은 유형을 다시 풀 수 있도록 복습 큐를 만들었습니다.`,
    createdReviewItems,
  };
}

export function groupReviewItemsByBucket(items: ReviewItem[] = mockReviewItems) {
  return items.reduce<Record<ReviewBucket, ReviewItem[]>>(
    (groups, item) => {
      groups[item.dueBucket].push(item);
      return groups;
    },
    {
      today: [],
      tomorrow: [],
      in7days: [],
      beforeExam: [],
    },
  );
}

export function getLowestScore(profile: StudentProfile) {
  return Object.entries(profile.recentScores).sort(([, a], [, b]) => a - b)[0];
}

function inferTopic(question: string, subject: string): string {
  if (question.includes("이차") || question.includes("방정식")) {
    return "이차방정식 활용";
  }

  if (question.includes("관계대명사") || question.toLowerCase().includes("that")) {
    return "관계대명사 구분";
  }

  if (question.includes("반복") || question.toLowerCase().includes("loop")) {
    return "반복문 조건 설계";
  }

  return `${subject} 질문 핵심 개념`;
}
