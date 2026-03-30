function LineChartPlaceholder() {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-lg font-bold text-slate-900">Statistics</p>
      <p className="mt-1 text-sm text-slate-500">Track project and application activity.</p>
      <div className="mt-4 rounded-2xl border border-slate-200 p-3">
        <svg viewBox="0 0 320 150" className="h-36 w-full">
          <path d="M0 130 C 40 90, 80 120, 120 80 C 160 40, 200 70, 240 35 C 270 15, 295 40, 320 30" fill="none" stroke="#2563eb" strokeWidth="3" />
          <path d="M0 120 C 40 130, 80 95, 120 105 C 160 120, 200 60, 240 75 C 270 85, 295 70, 320 85" fill="none" stroke="#8b5cf6" strokeWidth="3" />
        </svg>
      </div>
    </section>
  );
}

export default LineChartPlaceholder;
