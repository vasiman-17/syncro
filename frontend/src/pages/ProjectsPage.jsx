import { Send, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import ProjectCard from "../components/ProjectCard";

function ProjectsPage({
  user,
  search,
  setSearch,
  projectForm,
  setProjectForm,
  createProject,
  isSubmittingProject,
  loading,
  projects,
  applyMessageByProject,
  setApplyMessageByProject,
  applyToProject,
  goToProject,
  bookmarkProject,
  myProjects,
  updateProjectStatus,
  deleteProject,
  appliedProjectIds,
  bookmarkedProjectIds,
  profileComplete,
  applyingTo,
  onProfileClick,
  peopleSearchResults,
  onOpenDiscover,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scopeFilter, setScopeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [focusedPersonIndex, setFocusedPersonIndex] = useState(0);

  useEffect(() => {
    const querySearch = searchParams.get("q") || "";
    const queryScope = searchParams.get("scope") || "all";
    const queryDifficulty = searchParams.get("difficulty") || "all";

    if (querySearch !== search) {
      setSearch(querySearch);
    }
    if (queryScope !== scopeFilter) {
      setScopeFilter(queryScope);
    }
    if (queryDifficulty !== difficultyFilter) {
      setDifficultyFilter(queryDifficulty);
    }
  }, [searchParams, search, scopeFilter, difficultyFilter, setSearch]);

  useEffect(() => {
    const next = {};
    if (search.trim()) next.q = search.trim();
    if (scopeFilter !== "all") next.scope = scopeFilter;
    if (difficultyFilter !== "all") next.difficulty = difficultyFilter;
    setSearchParams(next, { replace: true });
  }, [search, scopeFilter, difficultyFilter, setSearchParams]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const projectId = String(project._id);
      const ownerId = String(project.owner?._id || project.owner);
      const isMine = user && ownerId === String(user.id);
      const hasApplied = appliedProjectIds.has(projectId);
      const isBookmarked = bookmarkedProjectIds.has(projectId);

      const scopeOk =
        scopeFilter === "all" ||
        (scopeFilter === "my" && isMine) ||
        (scopeFilter === "applied" && hasApplied) ||
        (scopeFilter === "bookmarked" && isBookmarked) ||
        (scopeFilter === "notApplied" && !hasApplied);

      const difficultyOk = difficultyFilter === "all" || project.difficulty === difficultyFilter;

      return scopeOk && difficultyOk;
    });
  }, [projects, user, appliedProjectIds, bookmarkedProjectIds, scopeFilter, difficultyFilter]);

  const searchQuickProjects = useMemo(() => filteredProjects.slice(0, 3), [filteredProjects]);

  useEffect(() => {
    if (!search.trim()) {
      setFocusedPersonIndex(0);
    } else if (peopleSearchResults?.length > 0 && focusedPersonIndex > peopleSearchResults.length - 1) {
      setFocusedPersonIndex(0);
    }
  }, [search, peopleSearchResults, focusedPersonIndex]);

  return (
    <>
      <HeroSection
        user={user}
        title="Projects workspace"
        subtitle="Publish your ideas, collect applications, and navigate projects faster with smart filters."
        searchValue={search}
        onSearchChange={setSearch}
        onProfileClick={onProfileClick}
      />

      {search.trim() && (
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-black text-slate-900">Search results for "{search}"</h2>
            <button
              type="button"
              onClick={onOpenDiscover}
              className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
            >
              Open full people discovery
            </button>
          </div>
          {peopleSearchResults?.length > 0 ? (
            <div
              className="mt-3 grid gap-3 md:grid-cols-2"
              tabIndex={0}
              onKeyDown={(e) => {
                if (peopleSearchResults.length === 0) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setFocusedPersonIndex((prev) => (prev + 1) % peopleSearchResults.length);
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setFocusedPersonIndex((prev) => (prev - 1 + peopleSearchResults.length) % peopleSearchResults.length);
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  onOpenDiscover?.();
                }
              }}
            >
              {peopleSearchResults.map((person, index) => (
                <div key={person._id || person.email} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{person.name || "Unknown user"}</p>
                  <p className="text-xs text-slate-500">{person.email || "No email available"}</p>
                  {person.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {person.skills.slice(0, 4).map((skill) => (
                        <span key={`${person._id}-${skill}`} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {focusedPersonIndex === index && (
                    <p className="mt-2 text-[11px] font-semibold text-brand-600">Press Enter to open full people discovery</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No people matched this search. Try skill keywords like React, Node, or Design.</p>
          )}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Top project matches</p>
            {searchQuickProjects.length > 0 ? (
              <div className="mt-2 space-y-2">
                {searchQuickProjects.map((project) => (
                  <button
                    key={project._id}
                    type="button"
                    onClick={() => goToProject(project._id)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:border-brand-200 hover:bg-brand-50"
                  >
                    {project.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">No top project matches yet.</p>
            )}
          </div>
        </section>
      )}

      {/* Open Projects */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-900">Open Projects</h2>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["notApplied", "Not Applied"],
            ["applied", "Applied"],
            ["bookmarked", "Bookmarked"],
            ["my", "My Posts"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setScopeFilter(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                scopeFilter === key ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
          <select
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-brand-400"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        {loading && <p className="mt-2 text-sm text-slate-500 animate-pulse-soft">Loading projects...</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              value={applyMessageByProject[project._id] || ""}
              onChange={(event) =>
                setApplyMessageByProject((prev) => ({
                  ...prev,
                  [project._id]: event.target.value,
                }))
              }
              onApply={() => applyToProject(project._id)}
              onViewDetails={() => goToProject(project._id)}
              onBookmark={() => bookmarkProject(project._id)}
              hasApplied={appliedProjectIds.has(String(project._id))}
              isOwner={user && String(project.owner?._id || project.owner) === String(user.id)}
              isBookmarked={bookmarkedProjectIds.has(String(project._id))}
              profileComplete={profileComplete}
              isApplying={applyingTo === project._id}
            />
          ))}
          {!loading && filteredProjects.length === 0 && (
            <p className="col-span-2 text-sm text-slate-500">
              {search ? `No projects match "${search}" with current filters.` : "No projects match the selected filters yet."}
            </p>
          )}
        </div>
      </section>

      {/* Create Project */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
          <Plus size={22} className="text-brand-500" /> Create Project
        </h2>
        <form className="mt-4 grid gap-3" onSubmit={createProject}>
          <input
            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
            placeholder="Project title"
            value={projectForm.title}
            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
          />
          <textarea
            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
            placeholder="Project description — what are you building?"
            rows={4}
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
          />
          <input
            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
            type="number"
            min="1"
            placeholder="Number of members needed"
            value={projectForm.requiredMembers}
            onChange={(e) => setProjectForm({ ...projectForm, requiredMembers: e.target.value })}
          />
          <input
            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
            placeholder="Required skills (comma separated, e.g. React, Node.js, Python)"
            value={projectForm.requiredSkills}
            onChange={(e) => setProjectForm({ ...projectForm, requiredSkills: e.target.value })}
          />
          <select
            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white text-slate-700"
            value={projectForm.difficulty}
            onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button
            className="btn-transition flex w-fit items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 disabled:opacity-60"
            type="submit"
            disabled={isSubmittingProject}
          >
            <Send size={16} />
            {isSubmittingProject ? "Creating..." : "Publish Project"}
          </button>
        </form>
      </section>

      {/* My Projects */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">My Projects</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
            {myProjects.length}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {myProjects.map((project) => (
            <div key={project._id} className="animate-slide-up flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 p-4 transition-all hover:border-brand-200">
              <div>
                <p className="font-semibold text-slate-900">{project.title}</p>
                <p className="text-sm text-slate-500">
                  Status:{" "}
                  <span className={`font-semibold ${project.status === "open" ? "text-emerald-600" : "text-slate-500"}`}>
                    {project.status}
                  </span>
                </p>
              </div>
              <div className="mt-2 flex gap-2 md:mt-0">
                <button
                  className="btn-transition rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:hover:transform-none"
                  disabled={project.status === "open"}
                  onClick={() => updateProjectStatus(project._id, "open")}
                >
                  Open
                </button>
                <button
                  className="btn-transition rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50 disabled:hover:transform-none"
                  disabled={project.status === "closed"}
                  onClick={() => updateProjectStatus(project._id, "closed")}
                >
                  Close
                </button>
                <button
                  className="btn-transition rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {myProjects.length === 0 && <p className="text-sm text-slate-500">You haven't created any projects yet.</p>}
        </div>
      </section>
    </>
  );
}

export default ProjectsPage;
