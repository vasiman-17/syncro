import HeroSection from "../components/HeroSection";
import { Bell, Check, Clock } from "lucide-react";

function NotificationsPage({ user, notifications, markNotificationRead, search, onSearchChange, unreadCount }) {
  const unread = notifications.filter((n) => !n.readAt);
  const read = notifications.filter((n) => n.readAt);

  return (
    <>
      <HeroSection user={user} title="Notifications" subtitle="Track application updates and team activity." searchValue={search} onSearchChange={onSearchChange} unreadCount={unreadCount} />

      {/* Unread */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <Bell size={18} className="text-brand-500" /> Unread
          </h2>
          {unread.length > 0 && (
            <span className="badge-pulse rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              {unread.length} new
            </span>
          )}
        </div>
        <div className="mt-3 space-y-2">
          {unread.map((item) => (
            <div key={item._id} className="animate-slide-up flex items-start gap-3 rounded-xl border-2 border-brand-100 bg-brand-50/50 p-4 transition-all hover:border-brand-200">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                <Bell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-600">{item.message}</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock size={10} />
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                className="btn-transition shrink-0 flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                onClick={() => markNotificationRead(item._id)}
              >
                <Check size={12} /> Read
              </button>
            </div>
          ))}
          {unread.length === 0 && <p className="text-sm text-slate-500">All caught up! No unread notifications.</p>}
        </div>
      </section>

      {/* Read */}
      {read.length > 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-black text-slate-900">Previously Read</h2>
          <div className="mt-3 space-y-2">
            {read.map((item) => (
              <div key={item._id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-300 text-white">
                  <Check size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-600">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default NotificationsPage;
