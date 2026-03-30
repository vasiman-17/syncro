import { Bell, BriefcaseBusiness, Compass, FolderKanban, LayoutDashboard, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Projects", icon: FolderKanban, to: "/projects" },
  { label: "Applications", icon: BriefcaseBusiness, to: "/applications" },
  { label: "Notifications", icon: Bell, to: "/notifications", hasBadge: true },
  { label: "Discover", icon: Compass, to: "/discover" },
  { label: "Profile", icon: UserCircle2, to: "/profile" },
];

function SidebarNav({ statusMessage, unreadCount = 0 }) {
  return (
    <aside className="rounded-3xl bg-white p-5 shadow-soft">
      <div className="mb-7 flex items-center gap-2 text-2xl font-black text-slate-900">
        <span className="rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 px-2 py-1 text-white">S</span> Syncro
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `btn-transition flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                  isActive
                    ? "bg-brand-50 font-semibold text-brand-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon size={16} />
              <span className="flex-1">{item.label}</span>
              {item.hasBadge && unreadCount > 0 && (
                <span className="badge-pulse flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-brand-50/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live status</p>
        <p className="mt-2 text-sm text-slate-700">{statusMessage}</p>
      </div>
    </aside>
  );
}

export default SidebarNav;
