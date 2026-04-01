import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection({
  user,
  title = "Build with the right people",
  subtitle = "Post projects, find teammates, and collaborate fast.",
  searchValue = "",
  onSearchChange,
  unreadCount = 0,
  onProfileClick,
}) {
  const navigate = useNavigate();

  return (
    <section className="animate-fade-in rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full flex-1 md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 group-focus-within:text-brand-600 transition-colors" />
          <input
            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:shadow-glow"
            placeholder="Search projects, skills, people..."
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
        </div>
        <div className="flex w-full items-center justify-end gap-3 md:w-auto">
          <button
            className="btn-transition relative rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200"
            onClick={() => navigate("/notifications")}
            title="View notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="badge-pulse absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <div
            className="flex max-w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:max-w-[280px]"
            onClick={() => onProfileClick?.()}
            title="User profile summary"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-center text-xs font-bold text-white">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name || "Guest"}</p>
              <p className="truncate text-xs text-slate-500">{user?.email || "Please login"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </section>
  );
}

export default HeroSection;
