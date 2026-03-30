import HeroSection from "../components/HeroSection";
import { Check, X, Undo2 } from "lucide-react";

function ApplicationsPage({ user, applications, appliedByMe, updateApplicationStatus, withdrawApplication, search, onSearchChange, unreadCount }) {
  return (
    <>
      <HeroSection user={user} title="Applications" subtitle="Review incoming applications and track applications you sent." searchValue={search} onSearchChange={onSearchChange} unreadCount={unreadCount} />

      {/* Applications to my projects */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Applications To My Projects</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{applications.length}</span>
        </div>
        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <div key={application._id} className="animate-slide-up flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 p-4 transition-all hover:border-brand-200">
              <div>
                <p className="font-semibold text-slate-900">
                  {application.applicant?.name} applied for <span className="text-brand-600">{application.project?.title}</span>
                </p>
                {application.applicant?.email && (
                  <p className="text-xs text-slate-400">{application.applicant.email}</p>
                )}
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

      {/* Applications I sent */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Applications I Sent</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{appliedByMe.length}</span>
        </div>
        <div className="mt-3 space-y-2">
          {appliedByMe.map((application) => (
            <div key={application._id} className="animate-slide-up flex items-center justify-between rounded-xl border border-slate-200 p-3 transition-all hover:border-brand-200">
              <div>
                <p className="text-sm font-semibold text-slate-800">{application.project?.title}</p>
                <p className="text-xs text-slate-500">
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
              {application.status === "pending" && (
                <button
                  className="btn-transition flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
                  onClick={() => withdrawApplication(application._id)}
                >
                  <Undo2 size={12} /> Withdraw
                </button>
              )}
              {application.status === "accepted" && (
                <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">✓ Accepted</span>
              )}
              {application.status === "rejected" && (
                <span className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">✗ Rejected</span>
              )}
            </div>
          ))}
          {appliedByMe.length === 0 && <p className="text-sm text-slate-500">No applications sent yet.</p>}
        </div>
      </section>
    </>
  );
}

export default ApplicationsPage;
