import { GraduationCap } from "lucide-react";
import { EntryUnlockLink } from "@/components/EntryUnlockLink";

export default function EntryPage() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden bg-black px-4 py-16 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.18),transparent_24rem)]" />

      <div className="relative flex max-w-4xl flex-col items-center text-center">
        <div className="hero-cap-reveal grid size-20 place-items-center rounded-2xl bg-white text-black shadow-2xl shadow-white/10 sm:size-24">
          <GraduationCap aria-hidden="true" size={44} />
        </div>
        <h1 className="hero-title-reveal mt-7 text-5xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl">
          Student AI OS
        </h1>
        <EntryUnlockLink />
      </div>
    </section>
  );
}
