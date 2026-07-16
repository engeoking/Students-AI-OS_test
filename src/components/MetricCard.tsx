export function MetricCard({
  label,
  value,
  detail,
  tone = "sky",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "sky" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    sky: "from-sky-500 text-sky-700",
    emerald: "from-emerald-500 text-emerald-700",
    amber: "from-amber-500 text-amber-700",
    rose: "from-rose-500 text-rose-700",
  };

  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tones[tone]} to-slate-200`} />
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      <p className={`mt-1 text-sm font-semibold ${tones[tone]}`}>{detail}</p>
    </section>
  );
}
