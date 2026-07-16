import { NextResponse } from "next/server";
import {
  buildFallbackLlmAnswer,
  buildStudentLlmSystemPrompt,
  buildStudentLlmUserPrompt,
  type LlmChatRequest,
  type LlmChatResponse,
} from "@/lib/llm";

export const runtime = "nodejs";

type OpenAiResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  const chatRequest = normalizeChatRequest(body);

  if (!chatRequest) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json<LlmChatResponse>({
      answer: buildFallbackLlmAnswer(chatRequest),
      provider: "mock",
    });
  }

  try {
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: buildStudentLlmSystemPrompt(),
          },
          {
            role: "user",
            content: buildStudentLlmUserPrompt(chatRequest),
          },
        ],
        max_output_tokens: 550,
      }),
    });

    if (!response.ok) {
      return NextResponse.json<LlmChatResponse>({
        answer: buildFallbackLlmAnswer(chatRequest),
        provider: "mock",
      });
    }

    const data = await response.json() as OpenAiResponse;
    const answer = extractOpenAiText(data) ?? buildFallbackLlmAnswer(chatRequest);

    return NextResponse.json<LlmChatResponse>({
      answer,
      provider: extractOpenAiText(data) ? "openai" : "mock",
    });
  } catch {
    return NextResponse.json<LlmChatResponse>({
      answer: buildFallbackLlmAnswer(chatRequest),
      provider: "mock",
    });
  }
}

async function readJsonBody(request: Request) {
  try {
    return await request.json() as unknown;
  } catch {
    return null;
  }
}

function normalizeChatRequest(body: unknown): LlmChatRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const input = body as Partial<LlmChatRequest>;
  const question = typeof input.question === "string" ? input.question.trim() : "";
  const subject = typeof input.subject === "string" ? input.subject.trim() : "";

  if (!question || !subject) {
    return null;
  }

  return {
    question,
    subject,
    profileName: typeof input.profileName === "string" ? input.profileName : undefined,
    grade: typeof input.grade === "string" ? input.grade : undefined,
    weakTopics: Array.isArray(input.weakTopics)
      ? input.weakTopics.filter((topic): topic is string => typeof topic === "string")
      : undefined,
    progress: input.progress ?? null,
  };
}

function extractOpenAiText(data: OpenAiResponse) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const text = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .find((value): value is string => typeof value === "string" && value.trim().length > 0);

  return text?.trim();
}
