import type { ProgressAnalysis, StudentProfile } from "./types";

export type LlmChatRequest = {
  question: string;
  subject: string;
  profileName?: string;
  grade?: string;
  weakTopics?: string[];
  progress?: ProgressAnalysis | null;
};

export type LlmChatResponse = {
  answer: string;
  provider: "openai" | "mock";
};

export function buildFallbackLlmAnswer({ question, subject, progress }: LlmChatRequest) {
  const scope = progress?.currentUnit ? `${progress.currentUnit} 범위에서 ` : "";

  return `${subject} 튜터가 ${scope}질문을 시험 포인트 기준으로 정리했습니다. 질문의 핵심은 "${question}"입니다. 먼저 개념 정의를 한 문장으로 확인하고, 조건을 표시한 뒤, 같은 유형을 한 문제 더 풀어보세요.`;
}

export function buildStudentLlmSystemPrompt() {
  return [
    "You are Student AI OS, a Korean study tutor for middle and high school students.",
    "Answer in Korean.",
    "Do not solve active locked practice questions for the student.",
    "Explain with exam-oriented concepts, common mistakes, and one short next action.",
    "Keep the answer concise, supportive, and suitable for a parent-visible learning record.",
  ].join("\n");
}

export function buildStudentLlmUserPrompt(request: LlmChatRequest) {
  const weakTopics = request.weakTopics?.length ? request.weakTopics.join(", ") : "기록 없음";
  const progressSummary = request.progress
    ? [
        `현재 진도: ${request.progress.currentUnit}`,
        `학습 범위: ${request.progress.studiedRange}`,
        `시험 포인트: ${request.progress.examFocus.join(", ")}`,
      ].join("\n")
    : "현재 진도: 학생이 일반 질문을 입력함";

  return [
    `학생: ${request.profileName ?? "학생"}`,
    `학년: ${request.grade ?? "미입력"}`,
    `과목: ${request.subject}`,
    `취약 개념: ${weakTopics}`,
    progressSummary,
    `질문: ${request.question}`,
  ].join("\n");
}

export function createLlmRequestFromProfile(
  question: string,
  subject: string,
  profile: StudentProfile,
  progress?: ProgressAnalysis | null,
): LlmChatRequest {
  return {
    question,
    subject,
    profileName: profile.name,
    grade: profile.grade,
    weakTopics: profile.weakTopics,
    progress,
  };
}
