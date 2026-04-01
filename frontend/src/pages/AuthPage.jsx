import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, Zap, Users, TrendingUp } from "lucide-react";

function AuthPage({ authMode, setAuthMode, authForm, setAuthForm, isSubmittingAuth, handleAuth, handleGoogleAuth }) {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
    if (!clientId) return;

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleAuth
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: 350 }
      );
    }
  }, [handleGoogleAuth]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white">
      <div className="grid min-h-screen lg:h-screen grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
        <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[linear-gradient(160deg,#5B4FE9_0%,#4A63F6_45%,#3D57E8_100%)] p-14 text-white">
          <div className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-indigo-900/30 blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-4 animate-fade-in">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-black text-[#5B4FE9]">S</span>
              <span className="text-[40px] font-extrabold tracking-tight leading-none">Syncro</span>
            </div>
            <h1 className="mt-16 max-w-xl text-[36px] font-extrabold leading-tight animate-slide-up">
              Build great products with the right people.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 animate-fade-in">
              Syncro helps you find teammates, launch projects faster, and manage applications in one clean workspace.
            </p>
            <div className="mt-10 grid max-w-lg gap-3">
              <div className="flex items-start gap-3 rounded-2xl bg-white/14 px-4 py-3 text-sm font-semibold text-white/95 backdrop-blur-md transition-all hover:bg-white/20">
                <span className="mt-0.5 rounded-lg bg-white/25 p-1.5"><Zap size={14} /></span>
                <span>Post projects and define exactly who you need.</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/14 px-4 py-3 text-sm font-semibold text-white/95 backdrop-blur-md transition-all hover:bg-white/20">
                <span className="mt-0.5 rounded-lg bg-white/25 p-1.5"><Users size={14} /></span>
                <span>Discover relevant developers with smart filters.</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/14 px-4 py-3 text-sm font-semibold text-white/95 backdrop-blur-md transition-all hover:bg-white/20">
                <span className="mt-0.5 rounded-lg bg-white/25 p-1.5"><TrendingUp size={14} /></span>
                <span>Track applications and decisions in real time.</span>
              </div>
            </div>
            <div className="mt-8 flex max-w-xl flex-wrap gap-2">
              {["React", "Node.js", "Design", "AI/ML", "Founders"].map((pill) => (
                <span key={pill} className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                  {pill}
                </span>
              ))}
            </div>
            <div className="mt-10 max-w-xl rounded-2xl border border-white/25 bg-white/12 px-4 py-3 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wide text-white/70">Used by teams</p>
              <p className="mt-1 text-sm font-semibold text-white">Trusted by developers shipping real products.</p>
            </div>
          </div>
          <p className="relative text-sm text-white/80">Trusted by builders worldwide</p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:overflow-y-auto h-full">
          <div className="w-full max-w-md">
            <h2 className="text-[22px] font-extrabold text-slate-900">{authMode === "signup" ? "Create your account" : "Welcome back"}</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              {authMode === "signup" ? "Start building with your team in minutes." : "Sign in to continue building with your team."}
            </p>

            <div className="mt-6 flex justify-center w-full min-h-[40px]">
              <div id="googleBtn"></div>
            </div>

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
