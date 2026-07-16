export const entryUnlockStorageKey = "student-ai-os-entry-unlocked";

export function unlockEntryGate() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(entryUnlockStorageKey, "true");
}

export function isEntryGateUnlocked() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(entryUnlockStorageKey) === "true";
}
