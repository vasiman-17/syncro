function TeamCard({ user }) {
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Member";
  const skillsCount = Array.isArray(user?.skills) ? user.skills.length : 0;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-lg font-bold text-slate-900">Your team</p>
      <p className="mt-1 text-sm text-slate-500">Quick profile snapshot for collaboration context.</p>
      <div className="mt-4 rounded-2xl bg-brand-500 p-4 text-white">
        <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-white/20 text-center text-2xl font-black leading-[5rem]">
          {(user?.name || "A").slice(0, 1).toUpperCase()}
        </div>
        <p className="text-center font-semibold">{user?.name || "Anna Miller"}</p>
        <p className="text-center text-sm text-white/90">{roleLabel}</p>
        <p className="mt-1 text-center text-xs text-white/80">
          {skillsCount > 0 ? `${skillsCount} listed skills` : "Add skills to improve matching"}
        </p>
      </div>
    </section>
  );
}

export default TeamCard;
