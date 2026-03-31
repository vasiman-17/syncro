import { Send, Plus } from "lucide-react";
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
}) {
  return (
    <>
      <HeroSection user={user} title="Projects workspace" subtitle="Publish your ideas, collect applications, and manage project status." searchValue={search} onSearchChange={setSearch} />

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

      {/* Open Projects */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Open Projects</h2>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>
        {loading && <p className="mt-2 text-sm text-slate-500 animate-pulse-soft">Loading projects...</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
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
          {!loading && projects.length === 0 && (
            <p className="col-span-2 text-sm text-slate-500">
              {search ? `No projects match "${search}".` : "No open projects yet. Create one above!"}
            </p>
          )}
        </div>
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
