"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { unlockEntryGate } from "@/lib/entry-gate";

export function EntryUnlockLink() {
  return (
    <Link
      href="/onboarding"
      className="hero-actions-reveal focus-ring mt-9 inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-black text-black shadow-lg shadow-[#D4AF37]/20 hover:bg-[#c6a12f]"
      onClick={unlockEntryGate}
    >
      프로필 입력하기
      <ArrowRight aria-hidden="true" size={18} />
    </Link>
  );
}
