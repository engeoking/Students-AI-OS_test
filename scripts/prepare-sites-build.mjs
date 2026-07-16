import { copyFileSync, cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const serverEntry = join("dist", "server", "index.js");
const hostingTarget = join("dist", ".openai", "hosting.json");
const serverPackage = join("dist", "server", "package.json");
const nextStaticTarget = join("dist", "_next", "static");

mkdirSync(dirname(serverEntry), { recursive: true });
mkdirSync(dirname(hostingTarget), { recursive: true });
mkdirSync(dirname(nextStaticTarget), { recursive: true });

cpSync(join("dist", "static"), nextStaticTarget, { recursive: true });

const pages = {
  "/": readFileSync(join("dist", "server", "app", "index.html"), "utf8"),
  "/home": readFileSync(join("dist", "server", "app", "home.html"), "utf8"),
  "/onboarding": readFileSync(join("dist", "server", "app", "onboarding.html"), "utf8"),
  "/study": readFileSync(join("dist", "server", "app", "study.html"), "utf8"),
  "/review": readFileSync(join("dist", "server", "app", "review.html"), "utf8"),
  "/parent-report": readFileSync(join("dist", "server", "app", "parent-report.html"), "utf8"),
};
const notFoundPage = readFileSync(join("dist", "server", "app", "_not-found.html"), "utf8");

writeFileSync(serverPackage, JSON.stringify({ type: "module" }, null, 2));

writeFileSync(serverEntry, `const pages = new Map(${JSON.stringify(Object.entries(pages))});
const notFoundPage = ${JSON.stringify(notFoundPage)};

function fallbackAnswer(requestBody) {
  const subject = requestBody.subject || "학습";
  const question = requestBody.question || "질문";
  const currentUnit = requestBody.progress?.currentUnit;
  const scope = currentUnit ? \`\${currentUnit} 범위에서 \` : "";

  return \`\${subject} 튜터가 \${scope}질문을 시험 포인트 기준으로 정리했습니다. 질문의 핵심은 "\${question}"입니다. 먼저 개념 정의를 한 문장으로 확인하고, 조건을 표시한 뒤, 같은 유형을 한 문제 더 풀어보세요.\`;
}

function systemPrompt() {
  return [
    "You are Student AI OS, a Korean study tutor for middle and high school students.",
    "Answer in Korean.",
    "Do not solve active locked practice questions for the student.",
    "Explain with exam-oriented concepts, common mistakes, and one short next action.",
    "Keep the answer concise, supportive, and suitable for a parent-visible learning record.",
  ].join("\\n");
}

function userPrompt(requestBody) {
  const weakTopics = Array.isArray(requestBody.weakTopics) && requestBody.weakTopics.length
    ? requestBody.weakTopics.join(", ")
    : "기록 없음";
  const progressSummary = requestBody.progress
    ? [
        \`현재 진도: \${requestBody.progress.currentUnit}\`,
        \`학습 범위: \${requestBody.progress.studiedRange}\`,
        \`시험 포인트: \${Array.isArray(requestBody.progress.examFocus) ? requestBody.progress.examFocus.join(", ") : "기록 없음"}\`,
      ].join("\\n")
    : "현재 진도: 학생이 일반 질문을 입력함";

  return [
    \`학생: \${requestBody.profileName ?? "학생"}\`,
    \`학년: \${requestBody.grade ?? "미입력"}\`,
    \`과목: \${requestBody.subject}\`,
    \`취약 개념: \${weakTopics}\`,
    progressSummary,
    \`질문: \${requestBody.question}\`,
  ].join("\\n");
}

function extractOpenAiText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const output = Array.isArray(data.output) ? data.output : [];
  for (const item of output) {
    const content = Array.isArray(item.content) ? item.content : [];
    for (const part of content) {
      if (typeof part.text === "string" && part.text.trim()) {
        return part.text.trim();
      }
    }
  }

  return null;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

async function readJsonRequest(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function handleLlm(request, env) {
  const body = await readJsonRequest(request);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";

  if (!question || !subject) {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const chatRequest = { ...body, question, subject };
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonResponse({ answer: fallbackAnswer(chatRequest), provider: "mock" });
  }

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${apiKey}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: userPrompt(chatRequest) },
        ],
        max_output_tokens: 550,
      }),
    });

    if (!openAiResponse.ok) {
      return jsonResponse({ answer: fallbackAnswer(chatRequest), provider: "mock" });
    }

    const data = await openAiResponse.json();
    const answer = extractOpenAiText(data);
    return jsonResponse({
      answer: answer ?? fallbackAnswer(chatRequest),
      provider: answer ? "openai" : "mock",
    });
  } catch {
    return jsonResponse({ answer: fallbackAnswer(chatRequest), provider: "mock" });
  }
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export default {
  async fetch(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\\/$/, "") || "/";

  if (request.method === "POST" && pathname === "/api/llm") {
    return handleLlm(request, env ?? {});
  }

  if (pages.has(pathname)) {
    return htmlResponse(pages.get(pathname));
  }

  if (env?.ASSETS) {
    return env.ASSETS.fetch(request);
  }

  return htmlResponse(notFoundPage, 404);
  },
};
`);

copyFileSync(join(".openai", "hosting.json"), hostingTarget);
