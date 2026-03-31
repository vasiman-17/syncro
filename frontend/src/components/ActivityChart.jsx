import { useMemo } from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

function ActivityChart({ projects = [], applications = [] }) {
  const chartData = useMemo(() => {
    const dateCounts = {};

    [...projects, ...applications].forEach((item) => {
      if (!item.createdAt) return;
      const date = new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      if (!dateCounts[date]) {
        dateCounts[date] = { date, activity: 0 };
      }
      dateCounts[date].activity += 1;
    });

    const data = Object.values(dateCounts).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (data.length === 0) {
      return [
        { date: "Mon", activity: 2 },
        { date: "Tue", activity: 5 },
        { date: "Wed", activity: 3 },
        { date: "Thu", activity: 8 },
        { date: "Fri", activity: 6 },
      ];
    }

    if (data.length < 3) {
      return [
        { date: "Past", activity: Math.max(0, data[0].activity - 1) },
        ...data,
        { date: "Now", activity: data[data.length - 1].activity + 1 },
      ];
    }

    return data;
  }, [projects, applications]);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-lg font-bold text-slate-900">Platform Activity</p>
      <p className="mt-1 text-sm text-slate-500">Track project and application volume.</p>
      <div className="mt-4 h-40 w-full rounded-2xl border border-slate-200 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="activity"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActivity)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ActivityChart;
