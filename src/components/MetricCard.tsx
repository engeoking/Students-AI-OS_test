export function MetricCard({
  label,
  value,
  detail,
  tone = "black",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "black" | "gold" | "ruby";
}) {
  const tones = {
    black: "from-black text-black/70",
    gold: "from-[#D4AF37] text-[#7a5a00]",
    ruby: "from-[#9B111E] text-[#9B111E]",
  };

  return (
    <section className="relative overflow-hidden rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tones[tone]} to-black/10`} />
      <p className="text-xs font-bold text-black/55">{label}</p>
      <p className="mt-2 text-2xl font-black text-black">{value}</p>
      <p className={`mt-1 text-sm font-semibold ${tones[tone]}`}>{detail}</p>
    </section>
  );
}
