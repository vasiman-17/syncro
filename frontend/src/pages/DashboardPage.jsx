import HeroSection from "../components/HeroSection";
import StatCards from "../components/StatCards";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

function DashboardPage({
  user,
  stats,
  applications,
  updateApplicationStatus,
  notifications,
  teammateSuggestions,
  projectSuggestions,
  bookmarks,
  unreadCount,
  search,
  onSearchChange,
}) {
  return (
    <>
      <HeroSection
        user={user}
        title="Start managing your projects!"
        subtitle="Create projects, discover collaborators, and move your product forward with the right teammates."
        searchValue={search}
        onSearchChange={onSearchChange}
        unreadCount={unreadCount}
      />
      <StatCards stats={stats} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/notifications" className="stat-card block rounded-2xl bg-white p-4 shadow-soft no-underline">
          <p className="text-xs uppercase text-slate-500">Unread notifications</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{unreadCount}</p>
          <p className="mt-3 text-sm font-semibold text-brand-600">Open notifications →</p>
        </Link>
        <Link to="/discover" className="stat-card block rounded-2xl bg-white p-4 shadow-soft no-underline">
          <p className="text-xs uppercase text-slate-500">Teammate suggestions</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{teammateSuggestions.length}</p>
          <p className="mt-3 text-sm font-semibold text-brand-600">Explore discover →</p>
        </Link>
        <Link to="/discover" className="stat-card block rounded-2xl bg-white p-4 shadow-soft no-underline">
          <p className="text-xs uppercase text-slate-500">Project suggestions</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{projectSuggestions.length}</p>
          <p className="mt-3 text-sm font-semibold text-brand-600">View project matches →</p>
        </Link>
        <Link to="/discover" className="stat-card block rounded-2xl bg-white p-4 shadow-soft no-underline">
          <p className="text-xs uppercase text-slate-500">Bookmarked projects</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{bookmarks.length}</p>
          <p className="mt-3 text-sm font-semibold text-brand-600">Open bookmarks →</p>
        </Link>
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-900">Applications To My Projects</h2>
        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <div key={application._id} className="animate-slide-up flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 p-4 transition-all hover:border-brand-200">
              <div>
                <p className="font-semibold text-slate-900">
                  {application.applicant?.name} applied for <span className="text-brand-600">{application.project?.title}</span>
                </p>
                <p className="text-sm text-slate-500">
                  Status:{" "}
                  <span className={`font-semibold ${
                    application.status === "accepted" ? "text-emerald-600" :
                    application.status === "rejected" ? "text-red-500" :
                    "text-amber-600"
                  }`}>
                    {application.status}
                  </span>
                </p>
              </div>
              <div className="mt-2 flex gap-2 md:mt-0">
                {application.status === "pending" ? (
                  <>
                    <button
                      className="btn-transition flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      onClick={() => updateApplicationStatus(application._id, "accepted")}
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      className="btn-transition flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                      onClick={() => updateApplicationStatus(application._id, "rejected")}
                    >
                      <X size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    application.status === "accepted"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {application.status === "accepted" ? "✓ Accepted" : "✗ Rejected"}
                  </span>
                )}
              </div>
            </div>
          ))}
          {applications.length === 0 && <p className="text-sm text-slate-500">No applications received yet.</p>}
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
