import HeroSection from "../components/HeroSection";
import { Users, FolderKanban, Bookmark, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function DiscoverPage({ user, teammateSuggestions, projectSuggestions, bookmarks, search, onSearchChange, unreadCount, onProfileClick }) {
  const [skillFilter, setSkillFilter] = useState("");
  const [projectDifficultyFilter, setProjectDifficultyFilter] = useState("all");

  const filteredTeammates = useMemo(() => {
    const query = skillFilter.trim().toLowerCase();
    if (!query) return teammateSuggestions;
    return teammateSuggestions.filter((person) =>
      (person.skills || []).some((skill) => String(skill).toLowerCase().includes(query))
    );
  }, [teammateSuggestions, skillFilter]);

  const filteredSuggestedProjects = useMemo(() => {
    return projectSuggestions.filter((project) => {
      if (projectDifficultyFilter !== "all" && project.difficulty !== projectDifficultyFilter) return false;
      return true;
    });
  }, [projectSuggestions, projectDifficultyFilter]);

  return (
    <>
      <HeroSection
        user={user}
        title="Discover"
        subtitle="AI-powered teammate and project suggestions based on your skills."
        searchValue={search}
        onSearchChange={onSearchChange}
        unreadCount={unreadCount}
        onProfileClick={onProfileClick}
      />

      {/* Suggested teammates */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <Users size={18} className="text-purple-500" /> Suggested Teammates
          </h2>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-purple-300 focus:bg-white md:w-56"
            placeholder="Filter by skill (e.g. React)"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {filteredTeammates.map((person) => (
            <div key={person._id} className="animate-slide-up rounded-xl border border-slate-200 p-4 transition-all hover:border-purple-200 hover:shadow-glow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-brand-500 text-sm font-bold text-white">
                  {(person.name || "U").slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{person.name}</p>
                  <p className="truncate text-xs text-slate-500">{person.email}</p>
                </div>
              </div>
              {person.skills?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {person.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 flex gap-2">
                {person.github && (
                  <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700">
                    <ExternalLink size={14} />
                  </a>
                )}
                {person.linkedin && (
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
          {filteredTeammates.length === 0 && (
            <p className="col-span-2 text-sm text-slate-500">No teammate suggestions yet. Add skills to your profile to get recommendations.</p>
          )}
        </div>
      </section>

      {/* Suggested projects */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <FolderKanban size={18} className="text-brand-500" /> Suggested Projects
          </h2>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-brand-300"
            value={projectDifficultyFilter}
            onChange={(e) => setProjectDifficultyFilter(e.target.value)}
          >
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {filteredSuggestedProjects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="animate-slide-up block rounded-xl border border-slate-200 p-4 no-underline transition-all hover:border-brand-200 hover:shadow-glow"
            >
              <p className="text-sm font-semibold text-slate-900">{project.title}</p>
              <p className="mt-1 text-xs text-slate-500">by {project.owner?.name}</p>
              {project.requiredSkills?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.requiredSkills.slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
          {filteredSuggestedProjects.length === 0 && (
            <p className="col-span-2 text-sm text-slate-500">No project suggestions yet. Add skills to your profile to see matches.</p>
          )}
        </div>
      </section>

      {/* Bookmarks */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
          <Bookmark size={18} className="text-amber-500" /> Bookmarked Projects
        </h2>
        <div className="mt-3 space-y-2">
          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark._id}
              to={`/projects/${bookmark.project?._id}`}
              className="animate-slide-up flex items-center justify-between rounded-xl border border-slate-200 p-3 no-underline transition-all hover:border-amber-200 hover:bg-amber-50"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{bookmark.project?.title || "Unknown"}</p>
                <p className="text-xs text-slate-500">{bookmark.project?.description?.slice(0, 60)}...</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                bookmark.project?.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
              }`}>
                {bookmark.project?.status || "—"}
              </span>
            </Link>
          ))}
          {bookmarks.length === 0 && <p className="text-sm text-slate-500">No bookmarks yet. Save projects you're interested in!</p>}
        </div>
      </section>
    </>
  );
}

export default DiscoverPage;
