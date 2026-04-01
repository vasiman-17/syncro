import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

function AuthPage({ authMode, setAuthMode, authForm, setAuthForm, isSubmittingAuth, handleAuth, handleGoogleAuth }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#0f172a_0%,#1e3a8a_38%,#312e81_68%,#0b1120_100%)]"></div>
      <div className="absolute -top-[18%] -left-[8%] -z-10 h-[58vw] w-[58vw] animate-pulse-soft rounded-full bg-sky-300/55 mix-blend-screen blur-[130px]"></div>
      <div className="absolute -bottom-[18%] -right-[8%] -z-10 h-[55vw] w-[55vw] animate-pulse-soft rounded-full bg-violet-300/50 mix-blend-screen blur-[125px]"></div>
      <div className="absolute top-[24%] right-[16%] -z-10 h-[38vw] w-[38vw] animate-pulse-soft rounded-full bg-cyan-200/40 mix-blend-screen blur-[110px]"></div>

      <div className="w-full max-w-[420px] animate-slide-up">
        {/* Branding header */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-brand-500 to-violet-500 text-3xl font-black text-white shadow-xl shadow-brand-400/50">
              S
            </span>
            <span className="text-4xl font-black tracking-tight text-white">Syncro</span>
          </div>
          <h2 className="mt-8 text-2xl font-black text-white">
            {authMode === "signup" ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-slate-200/90">
            {authMode === "signup"
              ? "Join the collaboration platform where devs build together."
              : "Sign in to your account to continue building."}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-[0_24px_60px_rgba(56,189,248,0.26)] backdrop-blur-2xl">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="btn-transition flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-sky-100 bg-white px-4 py-3.5 font-bold text-slate-700 shadow-sm hover:border-brand-200 hover:bg-sky-50 hover:text-brand-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex w-full items-center justify-center">
            <div className="rounded-full bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Or continue with email
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAuth}>
            {authMode === "signup" && (
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Full Name</label>
                <input
                  className="w-full rounded-2xl border-2 border-sky-100 bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all hover:border-sky-200 focus:border-brand-400 focus:shadow-glow"
                  placeholder="Vaibhav Vasistha"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Email</label>
              <input
                className="w-full rounded-2xl border-2 border-sky-100 bg-white px-4 py-3.5 text-sm font-medium outline-none transition-all hover:border-sky-200 focus:border-brand-400 focus:shadow-glow"
                placeholder="you@example.com"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Password</label>
              <div className="relative">
                <input
                  className="w-full rounded-2xl border-2 border-sky-100 bg-white py-3.5 pl-4 pr-12 text-sm font-medium outline-none transition-all hover:border-sky-200 focus:border-brand-400 focus:shadow-glow"
                  placeholder="Min 6 characters"
                  type={showPassword ? "text" : "password"}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                className="btn-transition flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-brand-500 to-violet-500 px-4 py-4 font-bold text-white shadow-lg shadow-brand-400/40 hover:from-sky-600 hover:via-brand-600 hover:to-violet-600 disabled:opacity-60 disabled:hover:transform-none"
                type="submit"
                disabled={isSubmittingAuth}
              >
                {isSubmittingAuth ? (
                  <span className="animate-pulse-soft">Authenticating...</span>
                ) : (
                  <>
                    {authMode === "signup" ? "Create Account" : "Sign In to Syncro"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-100">
          {authMode === "signup" ? "Already have an account?" : "New to Syncro?"}{" "}
          <button
            className="font-bold text-sky-300 hover:text-sky-200 hover:underline transition-colors"
            onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
          >
            {authMode === "signup" ? "Sign in instead" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
