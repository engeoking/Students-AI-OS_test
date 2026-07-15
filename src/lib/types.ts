export type ReviewBucket = "today" | "tomorrow" | "in7days" | "beforeExam";

export type StudentProfile = {
  name: string;
  grade: string;
  targetSubjects: string[];
  recentScores: Record<string, number>;
  examDate: string;
  daysUntilExam: number;
  weakTopics: string[];
  preferredStudyTime: string;
};

export type StudySession = {
  question: string;
  subject: string;
  recommendedAi: string;
  summary: string;
  createdReviewItems: ReviewItem[];
};

export type ReviewItem = {
  id: string;
  topic: string;
  dueBucket: ReviewBucket;
  status: "new" | "scheduled" | "done";
  source: "weak-topic" | "wrong-answer" | "ai-session";
};

export type ParentSummary = {
  studyMinutes: number;
  questionCount: number;
  weakConcepts: string[];
  recommendedAction: string;
  trend: Array<{
    day: string;
    minutes: number;
    questions: number;
  }>;
};
