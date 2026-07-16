import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const serverEntry = join("dist", "server", "index.js");
const hostingTarget = join("dist", ".openai", "hosting.json");

mkdirSync(dirname(serverEntry), { recursive: true });
mkdirSync(dirname(hostingTarget), { recursive: true });

writeFileSync(serverEntry, `const { createServer } = require("node:http");
const { readFile } = require("node:fs/promises");
const { extname, join, normalize } = require("node:path");

const port = Number(process.env.PORT ?? 3000);
const hostname = "0.0.0.0";
const root = process.cwd();
const pageFiles = new Map([
  ["/", "dist/server/app/index.html"],
  ["/home", "dist/server/app/home.html"],
  ["/onboarding", "dist/server/app/onboarding.html"],
  ["/study", "dist/server/app/study.html"],
  ["/review", "dist/server/app/review.html"],
  ["/parent-report", "dist/server/app/parent-report.html"],
]);
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
]);

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

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJsonRequest(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

async function handleLlm(request, response) {
  const body = await readJsonRequest(request);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";

  if (!question || !subject) {
    sendJson(response, 400, { error: "Invalid request" });
    return;
  }

  const chatRequest = { ...body, question, subject };
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    sendJson(response, 200, { answer: fallbackAnswer(chatRequest), provider: "mock" });
    return;
  }

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${apiKey}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: userPrompt(chatRequest) },
        ],
        max_output_tokens: 550,
      }),
    });

    if (!openAiResponse.ok) {
      sendJson(response, 200, { answer: fallbackAnswer(chatRequest), provider: "mock" });
      return;
    }

    const data = await openAiResponse.json();
    const answer = extractOpenAiText(data);
    sendJson(response, 200, {
      answer: answer ?? fallbackAnswer(chatRequest),
      provider: answer ? "openai" : "mock",
    });
  } catch {
    sendJson(response, 200, { answer: fallbackAnswer(chatRequest), provider: "mock" });
  }
}

function resolveAssetPath(pathname) {
  if (pathname.startsWith("/_next/static/")) {
    return join("dist", "static", pathname.slice("/_next/static/".length));
  }

  if (pathname === "/favicon.ico") {
    return join("public", "favicon.ico");
  }

  return null;
}

async function serveFile(filePath, response) {
  const normalized = normalize(filePath);

  if (normalized.startsWith("..")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const absolutePath = join(root, normalized);
    const content = await readFile(absolutePath);
    const contentType = mimeTypes.get(extname(normalized)) ?? "application/octet-stream";
    response.writeHead(200, {
      "Cache-Control": normalized.includes("dist/static/") ? "public, max-age=31536000, immutable" : "no-store",
      "Content-Type": contentType,
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", \`http://\${request.headers.host ?? "localhost"}\`);
  const pathname = url.pathname.replace(/\\/$/, "") || "/";

  if (request.method === "POST" && pathname === "/api/llm") {
    await handleLlm(request, response);
    return;
  }

  const assetPath = resolveAssetPath(url.pathname);
  if (assetPath) {
    await serveFile(assetPath, response);
    return;
  }

  await serveFile(pageFiles.get(pathname) ?? "dist/server/app/_not-found.html", response);
}).listen(port, hostname, () => {
  console.log(\`Student AI OS listening on http://\${hostname}:\${port}\`);
});
`);

copyFileSync(join(".openai", "hosting.json"), hostingTarget);
