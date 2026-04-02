import { useRef } from "react";
import HeroSection from "../components/HeroSection";
import { Upload, CheckCircle2, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { getBackendFileUrl } from "../lib/api";

function ProfilePage({ user, profileForm, setProfileForm, updateProfile, isSavingProfile, uploadResume, profileComplete, search, onSearchChange, unreadCount }) {
  const fileInputRef = useRef(null);

  const requiredFields = [
    { label: "Name", filled: Boolean(user?.name?.trim()) },
    { label: "GitHub", filled: Boolean(user?.github?.trim()) },
    { label: "LinkedIn", filled: Boolean(user?.linkedin?.trim()) },
    { label: "Resume", filled: Boolean(user?.resumeUrl?.trim()) },
  ];

  const completedCount = requiredFields.filter((f) => f.filled).length;
  const progressPercent = (completedCount / requiredFields.length) * 100;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadResume(file);
    }
  };

  return (
    <>
      <HeroSection user={user} title="Profile settings" subtitle="Keep your profile updated so the right teams can find you." searchValue={search} onSearchChange={onSearchChange} unreadCount={unreadCount} />

      {/* Profile completeness indicator */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Profile Completeness</h2>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
            profileComplete
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {profileComplete ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {profileComplete ? "Complete" : `${completedCount}/${requiredFields.length} filled`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mt-3">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Checklist */}
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {requiredFields.map((field) => (
            <div key={field.label} className={`flex items-center gap-2 rounded-xl p-2.5 text-sm font-medium ${
              field.filled
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}>
              {field.filled ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {field.label}
            </div>
          ))}
        </div>

        {!profileComplete && (
          <p className="mt-3 text-sm text-amber-600">
            ⚠️ Complete all required fields to apply for projects.
          </p>
        )}
      </section>

      {/* Profile form */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-900">Profile</h2>
        <form className="mt-4 space-y-4" onSubmit={updateProfile}>
          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
              placeholder="Your full name"
              value={profileForm.name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Bio</label>
            <textarea
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
              rows={3}
              placeholder="Tell us about yourself..."
              value={profileForm.bio}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Skills (comma separated)</label>
            <input
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
              placeholder="React, Node.js, Python, AI/ML..."
              value={profileForm.skills}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, skills: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-slate-700">
              GitHub Profile URL <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
              placeholder="https://github.com/yourusername"
              value={profileForm.github}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, github: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-slate-700">
              LinkedIn Profile URL <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
              placeholder="https://linkedin.com/in/yourusername"
              value={profileForm.linkedin}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, linkedin: e.target.value }))}
            />
          </div>

          {user?.email === "vaibhav.vasistha06@gmail.com" && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
              <select
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
                value={profileForm.role}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                <option value="developer">Developer</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            className="btn-transition rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 disabled:opacity-60"
            type="submit"
            disabled={isSavingProfile}
          >
            {isSavingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>

      {/* Resume upload */}
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
          <FileText size={20} className="text-brand-500" /> Resume
          <span className="text-red-500">*</span>
        </h2>

        {user?.resumeUrl ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-800">Resume uploaded</p>
              <p className="truncate text-xs text-emerald-600">{user.resumeUrl}</p>
            </div>
            <a
              href={getBackendFileUrl(user.resumeUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-transition flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <ExternalLink size={12} /> View
            </a>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Upload size={32} className="mx-auto text-slate-400" />
            <p className="mt-2 text-sm font-semibold text-slate-600">Upload your resume</p>
            <p className="text-xs text-slate-400">PDF, DOC, or DOCX — Max 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          className="btn-transition mt-3 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={16} />
          {user?.resumeUrl ? "Replace Resume" : "Upload Resume"}
        </button>
      </section>
    </>
  );
}

export default ProfilePage;
