import { Bookmark, BookmarkCheck, Check, AlertCircle, Loader2 } from "lucide-react";

function ProjectCard({
  project,
  value,
  onChange,
  onApply,
  onViewDetails,
  onBookmark,
  hasApplied,
  isOwner,
  isBookmarked,
  profileComplete,
  isApplying,
}) {
  const getApplyButton = () => {
    if (isOwner) {
      return (
        <button className="flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 cursor-default" disabled>
          Your Project
        </button>
      );
    }
    if (hasApplied) {
      return (
        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 cursor-default" disabled>
          <Check size={14} /> Applied
        </button>
      );
    }
    if (!profileComplete) {
      return (
        <button
          className="btn-transition flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-200"
          onClick={onApply}
          title="Complete your profile to apply"
        >
          <AlertCircle size={14} /> Complete Profile
        </button>
      );
    }
    return (
      <button
        className="btn-transition flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        onClick={onApply}
        disabled={isApplying}
      >
        {isApplying ? <Loader2 size={14} className="animate-spin" /> : null}
        {isApplying ? "Applying..." : "Apply"}
      </button>
    );
  };

  return (
    <article className="animate-slide-up rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-glow hover:border-brand-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
          project.status === "open"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-500"
        }`}>
          {project.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{project.description}</p>
      <p className="mt-2 text-xs text-slate-500">by {project.owner?.name || "Unknown"}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {(project.requiredSkills || []).slice(0, 5).map((skill) => (
          <span key={skill} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            {skill}
          </span>
        ))}
      </div>
      {!isOwner && !hasApplied && profileComplete && (
        <input
          className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
          placeholder="Message to owner (optional)"
          value={value}
          onChange={onChange}
        />
      )}
      <div className="mt-3 flex items-center gap-2">
        {getApplyButton()}
        <button
          className="btn-transition rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          onClick={onViewDetails}
        >
          Details
        </button>
        <button
          className={`btn-transition ml-auto rounded-lg px-3 py-2 text-sm font-semibold ${
            isBookmarked
              ? "bg-brand-100 text-brand-700"
              : "bg-slate-50 text-slate-500 hover:bg-brand-50 hover:text-brand-600"
          }`}
          onClick={onBookmark}
          title={isBookmarked ? "Remove bookmark" : "Bookmark project"}
        >
          {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;
