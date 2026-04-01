import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

function AuthPage({ authMode, setAuthMode, authForm, setAuthForm, isSubmittingAuth, handleAuth, handleGoogleAuth }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
        <section className="hidden lg:flex lg:flex-col lg:justify-between bg-[#5B4FE9] p-14 text-white">
          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-black text-[#5B4FE9]">S</span>
              <span className="text-[40px] font-extrabold tracking-tight leading-none">Syncro</span>
            </div>
            <h1 className="mt-16 max-w-xl text-[32px] font-extrabold leading-tight">
              Build great products with the right people.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85">
              Syncro helps you find teammates, launch projects faster, and manage applications in one clean workspace.
            </p>
            <div className="mt-10 grid max-w-lg gap-3">
              <div className="rounded-xl bg-white/14 px-4 py-3 text-sm font-semibold text-white/95">
                Post projects and define exactly who you need.
              </div>
              <div className="rounded-xl bg-white/14 px-4 py-3 text-sm font-semibold text-white/95">
                Discover relevant developers with smart filters.
              </div>
              <div className="rounded-xl bg-white/14 px-4 py-3 text-sm font-semibold text-white/95">
                Track applications and decisions in real time.
              </div>
            </div>
            <div className="mt-8 flex max-w-xl flex-wrap gap-2">
              {["React", "Node.js", "Design", "AI/ML", "Founders"].map((pill) => (
                <span key={pill} className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/80">Trusted by builders worldwide</p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <h2 className="text-[22px] font-extrabold text-slate-900">{authMode === "signup" ? "Create your account" : "Welcome back"}</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              {authMode === "signup" ? "Start building with your team in minutes." : "Sign in to continue building with your team."}
            </p>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="btn-transition mt-6 flex w-full items-center justify-center gap-3 rounded-lg border-[1.5px] border-[#E4E4E7] bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200"></div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">or continue with email</p>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <form className="space-y-4" onSubmit={handleAuth}>
              {authMode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    className="w-full rounded-lg border-[1.5px] border-slate-200 bg-[#FAFAFA] px-4 py-3 text-sm outline-none transition-colors focus:border-[#5B4FE9] focus:ring-2 focus:ring-[#5B4FE9]/15"
                    placeholder="Vaibhav Vasistha"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email</label>
                <input
                  className="w-full rounded-lg border-[1.5px] border-slate-200 bg-[#FAFAFA] px-4 py-3 text-sm outline-none transition-colors focus:border-[#5B4FE9] focus:ring-2 focus:ring-[#5B4FE9]/15"
                  placeholder="you@example.com"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border-[1.5px] border-slate-200 bg-[#FAFAFA] py-3 pl-4 pr-12 text-sm outline-none transition-colors focus:border-[#5B4FE9] focus:ring-2 focus:ring-[#5B4FE9]/15"
                    placeholder="Min 8 characters"
                    type={showPassword ? "text" : "password"}
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <button type="button" className="text-xs font-semibold text-[#5B4FE9] hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>
              <button
                className="btn-transition mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#5B4FE9] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#4E43D4] disabled:opacity-60"
                type="submit"
                disabled={isSubmittingAuth}
              >
                {isSubmittingAuth ? "Authenticating..." : authMode === "signup" ? "Create account" : "Sign in to Syncro"}
                {!isSubmittingAuth && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              {authMode === "signup" ? "Already have an account?" : "New to Syncro?"}{" "}
              <button
                className="font-semibold text-[#5B4FE9] hover:underline"
                onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
              >
                {authMode === "signup" ? "Sign in instead" : "Create an account"}
              </button>
            </p>
            <p className="mt-8 text-center text-xs text-slate-400">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              Secure · Private · No spam
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;
