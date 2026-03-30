import { useState } from "react";
import { Rocket, Users, FolderKanban, ArrowRight, Eye, EyeOff } from "lucide-react";

function AuthPage({ authMode, setAuthMode, authForm, setAuthForm, isSubmittingAuth, handleAuth, handleGoogleAuth }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding */}
      <div className="auth-gradient hidden w-1/2 flex-col justify-between p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <span className="glass-card rounded-xl px-3 py-2 text-2xl font-black">S</span>
            <span className="text-3xl font-black tracking-tight">Syncro</span>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl font-black leading-tight tracking-tight">
            Build together.<br />
            <span className="text-white/80">Grow faster.</span>
          </h1>
          <p className="max-w-md text-lg text-white/70">
            The developer collaboration platform where ideas turn into real projects and teams form effortlessly.
          </p>

          <div className="space-y-4">
            <div className="glass-card flex items-center gap-4 rounded-2xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Rocket size={20} />
              </div>
              <div>
                <p className="font-semibold">Launch Projects</p>
                <p className="text-sm text-white/60">Share your ideas and attract talented collaborators</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4 rounded-2xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Users size={20} />
              </div>
              <div>
                <p className="font-semibold">Find Teammates</p>
                <p className="text-sm text-white/60">AI-powered matching based on skills and interests</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4 rounded-2xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <FolderKanban size={20} />
              </div>
              <div>
                <p className="font-semibold">Collaborate & Ship</p>
                <p className="text-sm text-white/60">Manage applications, teams, and project progress</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/40">© 2026 Syncro. Devs don't build alone.</p>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <span className="rounded-lg bg-brand-500 px-2 py-1 text-xl font-black text-white">S</span>
          <span className="text-2xl font-black text-slate-900">Syncro</span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-black text-slate-900">
            {authMode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-slate-500">
            {authMode === "signup"
              ? "Join Syncro and start building with the right people."
              : "Sign in to continue where you left off."}
          </p>

          {/* Google Sign-in button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="btn-transition mt-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">or continue with email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Email / Password form */}
          <form className="space-y-4" onSubmit={handleAuth}>
            {authMode === "signup" && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
                  placeholder="Vaibhav Vasistha"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
              <input
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
                placeholder="you@example.com"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white"
                  placeholder="At least 6 characters"
                  type={showPassword ? "text" : "password"}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              className="btn-transition flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 disabled:opacity-60 disabled:hover:transform-none"
              type="submit"
              disabled={isSubmittingAuth}
            >
              {isSubmittingAuth ? (
                <span className="animate-pulse-soft">Please wait...</span>
              ) : (
                <>
                  {authMode === "signup" ? "Create Account" : "Sign In"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="font-semibold text-brand-600 hover:text-brand-700"
              onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
            >
              {authMode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
