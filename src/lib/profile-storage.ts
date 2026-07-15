import { mockStudentProfile } from "./mock-data";
import type { StudentProfile } from "./types";

export const profileStorageKey = "student-ai-os-profile";

export function readStoredProfile(): StudentProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(profileStorageKey);
  return stored ? (JSON.parse(stored) as StudentProfile) : null;
}

export function readProfileOrMock(): StudentProfile {
  return readStoredProfile() ?? mockStudentProfile;
}

export function saveStoredProfile(profile: StudentProfile) {
  window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
}
