import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/llm/route";

describe("/api/llm", () => {
  it("returns a safe mock answer when OPENAI_API_KEY is not configured", async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const response = await POST(new Request("http://localhost/api/llm", {
      method: "POST",
      body: JSON.stringify({
        question: "그래프 꼭짓점이 뭐야?",
        subject: "수학",
        profileName: "민준",
        grade: "중학교 3학년",
      }),
    }));
    const data = await response.json() as { answer: string; provider: string };

    expect(response.status).toBe(200);
    expect(data.provider).toBe("mock");
    expect(data.answer).toContain("수학");
    expect(data.answer).toContain("그래프 꼭짓점");

    if (originalKey) {
      process.env.OPENAI_API_KEY = originalKey;
    }
  });

  it("rejects malformed requests", async () => {
    const response = await POST(new Request("http://localhost/api/llm", {
      method: "POST",
      body: JSON.stringify({ question: "" }),
    }));

    expect(response.status).toBe(400);
  });
});
