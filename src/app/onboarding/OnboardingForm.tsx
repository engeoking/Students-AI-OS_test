"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { mockStudentProfile } from "@/lib/mock-data";
import type { StudentProfile } from "@/lib/types";

const storageKey = "student-ai-os-profile";

export function OnboardingForm() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window === "undefined") {
      return mockStudentProfile;
    }

    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as StudentProfile) : mockStudentProfile;
  });
  const [saved, setSaved] = useState(false);

  function updateProfile<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setSaved(false);
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
    setSaved(true);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.75fr_0.25fr]">
      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-700">학생 온보딩</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">학습 프로필 입력</h1>
          </div>
          <button
            type="submit"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Save aria-hidden="true" size={17} />
            저장
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="이름">
            <input
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={profile.name}
              onChange={(event) => updateProfile("name", event.target.value)}
            />
          </Field>
          <Field label="학년">
            <select
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={profile.grade}
              onChange={(event) => updateProfile("grade", event.target.value)}
            >
              {["중학교 1학년", "중학교 2학년", "중학교 3학년", "고등학교 1학년", "고등학교 2학년"].map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>
          </Field>
          <Field label="목표 과목">
            <input
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={profile.targetSubjects.join(", ")}
              onChange={(event) =>
                updateProfile(
                  "targetSubjects",
                  event.target.value.split(",").map((subject) => subject.trim()).filter(Boolean),
                )
              }
            />
          </Field>
          <Field label="시험일까지 남은 일수">
            <input
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              min={0}
              type="number"
              value={profile.daysUntilExam}
              onChange={(event) => updateProfile("daysUntilExam", Number(event.target.value))}
            />
          </Field>
          <Field label="시험일">
            <input
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              type="date"
              value={profile.examDate}
              onChange={(event) => updateProfile("examDate", event.target.value)}
            />
          </Field>
          <Field label="선호 학습 시간">
            <input
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={profile.preferredStudyTime}
              onChange={(event) => updateProfile("preferredStudyTime", event.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="최근 점수">
            <div className="grid gap-2">
              {profile.targetSubjects.map((subject) => (
                <label key={subject} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                  <span className="w-16 shrink-0 text-sm font-semibold text-slate-700">{subject}</span>
                  <input
                    className="focus-ring min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    min={0}
                    max={100}
                    type="number"
                    value={profile.recentScores[subject] ?? 70}
                    onChange={(event) =>
                      updateProfile("recentScores", {
                        ...profile.recentScores,
                        [subject]: Number(event.target.value),
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </Field>
          <Field label="취약 과목/취약 단원">
            <textarea
              className="focus-ring min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={profile.weakTopics.join("\n")}
              onChange={(event) =>
                updateProfile(
                  "weakTopics",
                  event.target.value.split("\n").map((topic) => topic.trim()).filter(Boolean),
                )
              }
            />
          </Field>
        </div>

        {saved ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">프로필이 브라우저에 저장되었습니다.</p> : null}
      </form>

      <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm font-semibold text-slate-500">현재 프로필</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">{profile.name}</h2>
        <div className="mt-4 space-y-3 text-sm">
          <Summary label="학년" value={profile.grade} />
          <Summary label="목표 과목" value={profile.targetSubjects.join(" / ")} />
          <Summary label="시험까지" value={`${profile.daysUntilExam}일`} />
          <Summary label="약점" value={profile.weakTopics.slice(0, 2).join(", ")} />
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="block text-xs font-semibold text-slate-500">{label}</span>
      <span className="mt-1 block font-semibold text-slate-950">{value}</span>
    </div>
  );
}
