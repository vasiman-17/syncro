import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import HeroSection from "../components/HeroSection";
import { ArrowLeft, ExternalLink, Clock, Users, Loader2 } from "lucide-react";

function ProjectDetailsPage({ user, setStatusMessage }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/projects/${id}`);
        setProject(data.project);
      } catch (error) {
        setStatusMessage(error?.response?.data?.message || "Could not fetch project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, setStatusMessage]);

  return (
    <>
      <HeroSection user={user} title="Project details" subtitle="Inspect full project information and team requirements." />

      <div className="mb-3">
        <Link to="/projects" className="btn-transition inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-soft hover:text-brand-600 no-underline">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        {loading && (
          <div className="flex items-center gap-2 py-8 justify-center text-slate-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading project...</span>
          </div>
        )}
        {!loading && !project && <p className="py-8 text-center text-sm text-slate-500">Project not found.</p>}
        {project && (
          <div className="animate-fade-in space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{project.title}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Users size={14} />
                  by {project.owner?.name || "Unknown"}
                  {project.owner?.email && (
                    <span className="text-slate-400">({project.owner.email})</span>
                  )}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
                project.status === "open"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-500"
              }`}>
                {project.status}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm leading-relaxed text-slate-700">{project.description}</p>
            </div>

            {project.requiredSkills?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700">Required Skills</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.techStack?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700">Tech Stack</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.tags?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700">Tags</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              {project.difficulty && (
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Difficulty</p>
                  <p className={`mt-1 text-sm font-bold ${
                    project.difficulty === "beginner" ? "text-emerald-600" :
                    project.difficulty === "intermediate" ? "text-amber-600" :
                    "text-red-600"
                  }`}>
                    {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                  </p>
                </div>
              )}
              {project.deadline && (
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Deadline</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-700">
                    <Clock size={12} />
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Created</p>
                <p className="mt-1 text-sm font-bold text-slate-700">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {project.owner?.github && (
              <a
                href={project.owner.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-transition inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-brand-600"
              >
                <ExternalLink size={16} /> View Owner's GitHub
              </a>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default ProjectDetailsPage;
