function TeamCard({ user }) {
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Member";
  const skillsCount = Array.isArray(user?.skills) ? user.skills.length : 0;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-lg font-bold text-slate-900">Your team</p>
      <p className="mt-1 text-sm text-slate-500">Quick profile snapshot for collaboration context.</p>
      <div className="mt-4 rounded-2xl bg-brand-500 p-4 text-white">
        <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-white/20 text-center text-2xl font-black leading-[5rem] overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            (user?.name || "A").slice(0, 1).toUpperCase()
          )}
        </div>
        <p className="text-center font-bold tracking-tight">{user?.name || "Anonymous"}</p>
        <p className="text-center text-[10px] uppercase font-black tracking-widest text-white/60 -mt-1 mb-1">
          @{user?.username || "syncro_dev"}
        </p>
        <p className="text-center text-xs font-medium text-white/90">{roleLabel}</p>
        <p className="mt-1 text-center text-xs text-white/80">
          {skillsCount > 0 ? `${skillsCount} listed skills` : "Add skills to improve matching"}
        </p>
      </div>
    </section>
  );
}

export default TeamCard;
