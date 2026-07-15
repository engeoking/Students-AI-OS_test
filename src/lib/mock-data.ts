import type { ParentSummary, ReviewItem, StudentProfile, StudySession } from "./types";

export const mockStudentProfile: StudentProfile = {
  name: "민준",
  grade: "중학교 3학년",
  targetSubjects: ["수학", "영어", "코딩"],
  recentScores: {
    "수학": 72,
    "영어": 84,
    "코딩": 91,
  },
  examDate: "2026-08-12",
  daysUntilExam: 28,
  weakTopics: ["이차방정식 활용", "관계대명사", "반복문 조건 설계"],
  preferredStudyTime: "평일 저녁 8시",
};

export const mockReviewItems: ReviewItem[] = [
  {
    id: "review-1",
    topic: "이차방정식 근의 공식 적용",
    dueBucket: "today",
    status: "scheduled",
    source: "wrong-answer",
  },
  {
    id: "review-2",
    topic: "관계대명사 which/that 구분",
    dueBucket: "today",
    status: "new",
    source: "weak-topic",
  },
  {
    id: "review-3",
    topic: "함수 그래프에서 꼭짓점 찾기",
    dueBucket: "tomorrow",
    status: "scheduled",
    source: "wrong-answer",
  },
  {
    id: "review-4",
    topic: "for loop 종료 조건",
    dueBucket: "in7days",
    status: "scheduled",
    source: "ai-session",
  },
  {
    id: "review-5",
    topic: "시험 전 수학 약점 공식 모음",
    dueBucket: "beforeExam",
    status: "scheduled",
    source: "weak-topic",
  },
];

export const mockStudySessions: StudySession[] = [
  {
    question: "이차방정식 활용 문제에서 식을 어떻게 세워야 해?",
    subject: "수학",
    recommendedAi: "Math Tutor",
    summary: "문장 속 미지수를 먼저 정하고 조건을 방정식으로 바꾸는 순서로 풀면 안정적입니다.",
    createdReviewItems: [mockReviewItems[0], mockReviewItems[4]],
  },
  {
    question: "관계대명사 that과 which 차이를 예문으로 설명해줘.",
    subject: "영어",
    recommendedAi: "English Coach",
    summary: "선행사가 사람/사물인지, 제한적 용법인지 확인하면 선택이 쉬워집니다.",
    createdReviewItems: [mockReviewItems[1]],
  },
];

export const mockParentSummary: ParentSummary = {
  studyMinutes: 74,
  questionCount: 9,
  weakConcepts: ["이차방정식 활용", "관계대명사", "그래프 해석"],
  recommendedAction: "수학 오답 2개를 오늘 복습하고, 영어 문법은 내일 10분 확인하세요.",
  trend: [
    { day: "월", minutes: 38, questions: 4 },
    { day: "화", minutes: 45, questions: 5 },
    { day: "수", minutes: 62, questions: 7 },
    { day: "목", minutes: 51, questions: 6 },
    { day: "금", minutes: 74, questions: 9 },
  ],
};
