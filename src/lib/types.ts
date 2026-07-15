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

export type StudentLevel = "기초 보강" | "내신 실전" | "심화 응용";

export type LlmRecommendation = {
  label: string;
  reason: string;
};

export type ProgressAnalysis = {
  subject: string;
  sourceImageName: string;
  currentUnit: string;
  studiedRange: string;
  examFocus: string[];
  recommendedQuestionCount: number;
};

export type PracticeQuestion = {
  id: string;
  subject: string;
  prompt: string;
  answer: string;
  concept: string;
  examPoint: string;
};

export type GradedAnswer = {
  question: PracticeQuestion;
  studentAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

export type WeaknessReport = {
  level: StudentLevel;
  weakConcepts: string[];
  nextStudyDirection: string;
  reviewPlan: string[];
};

export type LearningRun = {
  id: string;
  subject: string;
  level: StudentLevel;
  recommendedLlm: LlmRecommendation;
  progress: ProgressAnalysis;
  questions: PracticeQuestion[];
  gradedAnswers: GradedAnswer[];
  weaknessReport?: WeaknessReport;
  createdAt: string;
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
