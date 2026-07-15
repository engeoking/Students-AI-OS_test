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
    sky: "border-sky-100 bg-sky-50 text-sky-800",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-800",
    amber: "border-amber-100 bg-amber-50 text-amber-900",
    rose: "border-rose-100 bg-rose-50 text-rose-800",
  };

  return (
    <section className={`rounded-lg border p-4 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-normal opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm opacity-80">{detail}</p>
    </section>
  );
}
