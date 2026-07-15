import { mockReviewItems } from "./mock-data";
import type {
  GradedAnswer,
  LearningRun,
  LlmRecommendation,
  PracticeQuestion,
  ProgressAnalysis,
  ReviewBucket,
  ReviewItem,
  StudentLevel,
  StudySession,
  StudentProfile,
  WeaknessReport,
} from "./types";

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

export function getProfileSubjects(profile: StudentProfile) {
  return Array.from(new Set([...profile.targetSubjects, ...Object.keys(profile.recentScores)]));
}

export function analyzeStudentLevel(profile: StudentProfile, subject: string): StudentLevel {
  const score = profile.recentScores[subject] ?? 70;

  if (score < 65) {
    return "기초 보강";
  }

  if (score < 85) {
    return "내신 실전";
  }

  return "심화 응용";
}

export function recommendLearningLlm(subject: string, level: StudentLevel): LlmRecommendation {
  const label = aiLabelsBySubject[subject] ?? "Study Coach LLM";
  const levelGuide = {
    "기초 보강": "개념 구멍을 먼저 찾고 쉬운 대표 유형부터 설명합니다.",
    "내신 실전": "학교 시험에 자주 나오는 유형과 실수 포인트를 우선합니다.",
    "심화 응용": "응용 변형과 고난도 사고 과정을 단계별로 점검합니다.",
  };

  return {
    label: `${label} LLM`,
    reason: `${subject} 과목과 ${level} 수준에 맞춰 ${levelGuide[level]}`,
  };
}

export function analyzeProgressFromUpload(fileName: string, subject: string): ProgressAnalysis {
  const unitBySubject: Record<string, ProgressAnalysis> = {
    "수학": {
      subject,
      sourceImageName: fileName,
      currentUnit: "이차방정식 활용과 함수 그래프",
      studiedRange: "개념 정리 후 대표 유형 풀이를 시작한 단계",
      examFocus: ["식 세우기", "근의 공식 적용", "그래프 꼭짓점 해석"],
      recommendedQuestionCount: 5,
    },
    "영어": {
      subject,
      sourceImageName: fileName,
      currentUnit: "관계대명사와 문장 구조",
      studiedRange: "기본 문법은 학습했고 문장 적용 연습이 필요한 단계",
      examFocus: ["which/that 구분", "선행사 찾기", "문장 해석"],
      recommendedQuestionCount: 5,
    },
    "코딩": {
      subject,
      sourceImageName: fileName,
      currentUnit: "반복문과 조건 분기",
      studiedRange: "문법은 알고 있지만 종료 조건 설계 연습이 필요한 단계",
      examFocus: ["for loop 범위", "조건식 검증", "출력 예측"],
      recommendedQuestionCount: 5,
    },
  };

  return unitBySubject[subject] ?? {
    subject,
    sourceImageName: fileName,
    currentUnit: `${subject} 핵심 개념 단원`,
    studiedRange: "사진 속 학습 흔적 기준으로 대표 유형 풀이에 진입한 단계",
    examFocus: ["핵심 개념 확인", "대표 유형 풀이", "오답 원인 정리"],
    recommendedQuestionCount: 5,
  };
}

export function generateExamQuestions(subject: string, progress: ProgressAnalysis): PracticeQuestion[] {
  const questionBank: Record<string, PracticeQuestion[]> = {
    "수학": [
      makeQuestion("math-1", subject, "어떤 수 x에 3을 더한 뒤 제곱하면 49이다. 가능한 x 값 중 양수를 쓰세요.", "4", "이차방정식 활용", "문장 조건을 식으로 바꾸는 문제가 자주 출제됩니다."),
      makeQuestion("math-2", subject, "x^2 - 5x + 6 = 0의 두 근을 작은 수부터 쉼표로 쓰세요.", "2,3", "인수분해", "근을 빠르게 찾는 기본 계산 유형입니다."),
      makeQuestion("math-3", subject, "y=(x-2)^2+3 그래프의 꼭짓점 좌표를 쓰세요.", "(2,3)", "함수 그래프", "꼭짓점 형태 해석은 서술형 단골 포인트입니다."),
      makeQuestion("math-4", subject, "x^2=16을 만족하는 모든 정수를 쉼표로 쓰세요.", "-4,4", "제곱근", "양수와 음수 해를 모두 확인해야 합니다."),
      makeQuestion("math-5", subject, "가로가 x, 세로가 x+3인 직사각형의 넓이가 40일 때 x의 양수 값을 쓰세요.", "5", "이차방정식 활용", "도형 조건을 방정식으로 세우는 시험형 문제입니다."),
    ],
    "영어": [
      makeQuestion("eng-1", subject, "빈칸에 알맞은 관계대명사: This is the book ___ I bought yesterday.", "that", "관계대명사", "목적격 관계대명사 선택이 자주 출제됩니다."),
      makeQuestion("eng-2", subject, "문장 속 선행사를 쓰세요: I met a teacher who helped me.", "teacher", "선행사 찾기", "관계대명사가 꾸미는 명사를 찾는 기본 유형입니다."),
      makeQuestion("eng-3", subject, "빈칸에 알맞은 말: The dog ___ is barking is mine.", "that", "관계대명사", "주격 관계대명사와 동사 연결을 확인합니다."),
      makeQuestion("eng-4", subject, "which가 가리키는 선행사를 쓰세요: I lost my pen which was blue.", "pen", "문장 해석", "선행사와 수식절을 끊어 읽는 문제입니다."),
      makeQuestion("eng-5", subject, "다음 뜻의 영어 단어를 쓰세요: 시험, 검사", "test", "어휘", "내신 문법 문제 안의 기본 어휘 확인입니다."),
    ],
    "코딩": [
      makeQuestion("code-1", subject, "for (let i=0; i<3; i++) 는 총 몇 번 실행되나요?", "3", "반복문 범위", "초기값과 종료 조건을 같이 보는 문제입니다."),
      makeQuestion("code-2", subject, "i가 1부터 5까지 증가할 때 합계 1+2+3+4+5의 결과를 쓰세요.", "15", "누적 합계", "반복문 내부 누적 변수를 이해해야 합니다."),
      makeQuestion("code-3", subject, "조건식 i <= 4에서 i가 0부터 시작해 1씩 증가하면 몇 번 실행되나요?", "5", "종료 조건", "경계값 실수가 시험에서 자주 나옵니다."),
      makeQuestion("code-4", subject, "배열 [2,4,6]의 길이를 쓰세요.", "3", "배열", "반복 횟수와 배열 길이를 연결합니다."),
      makeQuestion("code-5", subject, "짝수만 출력하려면 i % 2 의 결과가 무엇일 때 출력해야 하나요?", "0", "조건 분기", "나머지 연산을 조건문에 적용하는 유형입니다."),
    ],
  };

  return (questionBank[subject] ?? progress.examFocus.map((focus, index) =>
    makeQuestion(
      `${subject}-${index + 1}`,
      subject,
      `${focus} 개념을 한 문장으로 설명하세요.`,
      focus,
      focus,
      "사진 속 진도와 연결되는 핵심 개념 설명형 문제입니다.",
    ),
  )).slice(0, progress.recommendedQuestionCount);
}

export function gradePracticeAnswers(questions: PracticeQuestion[], answers: Record<string, string>): GradedAnswer[] {
  return questions.map((question) => {
    const studentAnswer = answers[question.id]?.trim() ?? "";
    const isCorrect = normalizeAnswer(studentAnswer) === normalizeAnswer(question.answer);

    return {
      question,
      studentAnswer,
      isCorrect,
      explanation: buildExamExplanation(question, studentAnswer, isCorrect),
    };
  });
}

export function buildWeaknessReport(profile: StudentProfile, subject: string, gradedAnswers: GradedAnswer[]): WeaknessReport {
  const wrongAnswers = gradedAnswers.filter((answer) => !answer.isCorrect);
  const weakConcepts = wrongAnswers.length > 0
    ? Array.from(new Set(wrongAnswers.map((answer) => answer.question.concept)))
    : [`${subject} 실전 속도 유지`];
  const level = analyzeStudentLevel(profile, subject);

  return {
    level,
    weakConcepts,
    nextStudyDirection: wrongAnswers.length > 0
      ? `${subject}은 ${weakConcepts.join(", ")}에서 감점 가능성이 큽니다. 내일은 오답 개념을 먼저 15분 복습한 뒤 같은 유형 3문제를 다시 풀어야 합니다.`
      : `${subject} 기본 흐름은 안정적입니다. 내일은 시간 제한을 두고 변형 문제를 풀어 실전 속도를 점검하세요.`,
    reviewPlan: [
      "내일: 오늘 틀린 개념을 노트 없이 다시 설명하기",
      "3일 후: 같은 유형 문제를 시간 제한 8분 안에 풀기",
      "시험 전: 오답 개념만 모아 최종 체크리스트로 확인하기",
    ],
  };
}

export function createLearningRun(params: {
  profile: StudentProfile;
  subject: string;
  progress: ProgressAnalysis;
  questions: PracticeQuestion[];
  gradedAnswers: GradedAnswer[];
  weaknessReport?: WeaknessReport;
}): LearningRun {
  const level = analyzeStudentLevel(params.profile, params.subject);

  return {
    id: `learning-${Date.now()}`,
    subject: params.subject,
    level,
    recommendedLlm: recommendLearningLlm(params.subject, level),
    progress: params.progress,
    questions: params.questions,
    gradedAnswers: params.gradedAnswers,
    weaknessReport: params.weaknessReport,
    createdAt: new Date().toISOString(),
  };
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

function makeQuestion(
  id: string,
  subject: string,
  prompt: string,
  answer: string,
  concept: string,
  examPoint: string,
): PracticeQuestion {
  return {
    id,
    subject,
    prompt,
    answer,
    concept,
    examPoint,
  };
}

function normalizeAnswer(answer: string) {
  return answer.replace(/\s/g, "").replace(/[，]/g, ",").toLowerCase();
}

function buildExamExplanation(question: PracticeQuestion, studentAnswer: string, isCorrect: boolean) {
  if (isCorrect) {
    return `정답입니다. 시험에서는 ${question.examPoint} 답을 맞혔더라도 풀이 과정에서 ${question.concept} 근거를 짧게 남기면 서술형 감점을 줄일 수 있습니다.`;
  }

  const shownAnswer = studentAnswer || "무응답";
  return `오답입니다. 입력한 답은 "${shownAnswer}"이고 정답은 "${question.answer}"입니다. 이 문제의 핵심은 ${question.concept}입니다. 시험에서는 ${question.examPoint} 먼저 조건을 식이나 문장 구조로 분리하고, 마지막에 답의 범위와 단위를 다시 확인해야 합니다. 같은 유형을 틀리면 개념을 몰라서라기보다 문제 조건을 끝까지 반영하지 못한 경우가 많으므로 풀이 첫 줄에 조건을 따로 적는 습관이 필요합니다.`;
}
