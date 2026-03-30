import { Link } from "react-router-dom";

function StatCards({ stats }) {
  return (
    <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Link
          key={item.label}
          to={item.to || "/dashboard"}
          className="stat-card min-h-[96px] rounded-2xl bg-white p-4 shadow-soft block no-underline"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide leading-tight text-slate-500 break-words">{item.label}</p>
          <p className="mt-2 text-3xl font-black leading-none text-slate-900">{item.value}</p>
          <p className="mt-2 text-xs font-semibold text-brand-600">View →</p>
        </Link>
      ))}
    </div>
  );
}

export default StatCards;
