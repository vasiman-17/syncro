import { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api, setAuthToken } from "./lib/api";
import SidebarNav from "./components/SidebarNav";
import TeamCard from "./components/TeamCard";
import LineChartPlaceholder from "./components/LineChartPlaceholder";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import NotificationsPage from "./pages/NotificationsPage";
import DiscoverPage from "./pages/DiscoverPage";

const emptyAuth = { name: "", email: "", password: "" };
const emptyProject = { title: "", description: "", requiredSkills: "" };
const emptyProfile = { name: "", bio: "", skills: "", github: "", linkedin: "", role: "developer" };

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuth);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [token, setToken] = useState(localStorage.getItem("syncro_token") || "");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appliedByMe, setAppliedByMe] = useState([]);
  const [applyMessageByProject, setApplyMessageByProject] = useState({});
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [teammateSuggestions, setTeammateSuggestions] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toast, setToast] = useState("");
  const [statusMessage, setStatusMessage] = useState("Welcome to Syncro Pro.");
  const [applyingTo, setApplyingTo] = useState(null);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  // Compute set of project IDs user has applied to
  const appliedProjectIds = useMemo(() => {
    return new Set(appliedByMe.map((app) => String(app.project?._id || app.project)));
  }, [appliedByMe]);

  // Compute set of bookmarked project IDs
  const bookmarkedProjectIds = useMemo(() => {
    return new Set(bookmarks.map((b) => String(b.project?._id || b.project)));
  }, [bookmarks]);

  // Profile completeness
  const profileComplete = useMemo(() => {
    if (!user) return false;
    return Boolean(
      user.name?.trim() &&
      user.github?.trim() &&
      user.linkedin?.trim() &&
      user.resumeUrl?.trim()
    );
  }, [user]);

  // Unread notifications count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.readAt).length;
  }, [notifications]);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("syncro_token", token);
      fetchMe();
      bootstrapDashboard();
      fetchNotifications();
      fetchBookmarks();
      fetchSuggestions();
      if (location.pathname === "/auth" || location.pathname === "/") {
        navigate("/dashboard");
      }
    } else {
      localStorage.removeItem("syncro_token");
      setUser(null);
      setProjects([]);
      setMyProjects([]);
      setApplications([]);
      setAppliedByMe([]);
      if (location.pathname !== "/auth") {
        navigate("/auth");
      }
    }
  }, [token]);

  // Debounced search
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      fetchProjects().catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!statusMessage) return;
    setToast(statusMessage);
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  const bootstrapDashboard = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchMyProjects(), fetchMyApplications(), fetchAppliedByMe()]);
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Failed loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      setProfileForm({
        name: data.user?.name || "",
        bio: data.user?.bio || "",
        skills: (data.user?.skills || []).join(", "),
        github: data.user?.github || "",
        linkedin: data.user?.linkedin || "",
        role: data.user?.role || "developer",
      });
    } catch {
      setToken("");
      setUser(null);
      setStatusMessage("Session expired. Please login again.");
    }
  };

  const fetchProjects = async () => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    const { data } = await api.get("/projects", { params });
    setProjects(data.projects || []);
  };

  const fetchMyProjects = async () => {
    const { data } = await api.get("/projects/mine");
    setMyProjects(data.projects || []);
  };

  const fetchMyApplications = async () => {
    const { data } = await api.get("/applications/mine");
    setApplications(data.applications || []);
  };

  const fetchAppliedByMe = async () => {
    const { data } = await api.get("/applications/applied-by-me");
    setAppliedByMe(data.applications || []);
  };

  const fetchNotifications = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data.notifications || []);
  };

  const fetchBookmarks = async () => {
    const { data } = await api.get("/bookmarks");
    setBookmarks(data.bookmarks || []);
  };

  const fetchSuggestions = async () => {
    try {
      const [team, projectsResult] = await Promise.all([api.get("/matching/teammates"), api.get("/matching/projects")]);
      setTeammateSuggestions(team.data.users || []);
      setProjectSuggestions(projectsResult.data.projects || []);
    } catch {
      // silently fail if skills empty
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    if (!authForm.email || !authForm.password || (authMode === "signup" && !authForm.name.trim())) {
      setStatusMessage("Please fill all required auth fields.");
      return;
    }
    try {
      setIsSubmittingAuth(true);
      const path = authMode === "signup" ? "/auth/signup" : "/auth/login";
      const payload = authMode === "signup" ? authForm : { email: authForm.email, password: authForm.password };
      const { data } = await api.post(path, payload);
      setToken(data.token);
      setUser(data.user);
      setAuthForm(emptyAuth);
      setStatusMessage(`Welcome ${data.user.name}, you are logged in.`);
      await bootstrapDashboard();
      await Promise.all([fetchNotifications(), fetchBookmarks(), fetchSuggestions()]);
      navigate("/dashboard");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Authentication failed.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleGoogleAuth = useCallback(async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setStatusMessage("Google Sign-In is not configured yet. Please use email/password.");
      return;
    }
    try {
      // Load Google Identity Services
      const google = window.google;
      if (!google?.accounts?.id) {
        setStatusMessage("Google Sign-In script not loaded. Please try again.");
        return;
      }
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            setIsSubmittingAuth(true);
            const { data } = await api.post("/auth/google", { credential: response.credential });
            setToken(data.token);
            setUser(data.user);
            setAuthForm(emptyAuth);
            setStatusMessage(`Welcome ${data.user.name}!`);
            await bootstrapDashboard();
            await Promise.all([fetchNotifications(), fetchBookmarks(), fetchSuggestions()]);
            navigate("/dashboard");
          } catch (error) {
            setStatusMessage(error?.response?.data?.message || "Google authentication failed.");
          } finally {
            setIsSubmittingAuth(false);
          }
        },
      });
      google.accounts.id.prompt();
    } catch (error) {
      setStatusMessage("Google Sign-In failed. Please try email/password.");
    }
  }, []);

  const createProject = async (event) => {
    event.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setStatusMessage("Project title and description are required.");
      return;
    }
    try {
      setIsSubmittingProject(true);
      const requiredSkills = projectForm.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
      await api.post("/projects", { ...projectForm, requiredSkills });
      setProjectForm(emptyProject);
      await Promise.all([fetchProjects(), fetchMyProjects()]);
      setStatusMessage("Project created successfully.");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Project creation failed.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const applyToProject = async (projectId) => {
    if (!profileComplete) {
      setStatusMessage("Complete your profile first (Name, GitHub, LinkedIn, Resume required).");
      navigate("/profile");
      return;
    }
    try {
      setApplyingTo(projectId);
      await api.post(`/projects/${projectId}/apply`, {
        message: applyMessageByProject[projectId] || "I would love to contribute.",
      });
      setApplyMessageByProject((prev) => ({ ...prev, [projectId]: "" }));
      await fetchAppliedByMe();
      setStatusMessage("Applied to project successfully!");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not apply to project.");
    } finally {
      setApplyingTo(null);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      await fetchMyApplications();
      await fetchProjects();
      await fetchNotifications();
      setStatusMessage(`Application ${status}.`);
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not update application.");
    }
  };

  const withdrawApplication = async (applicationId) => {
    try {
      await api.delete(`/applications/${applicationId}/withdraw`);
      await fetchAppliedByMe();
      setStatusMessage("Application withdrawn.");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not withdraw application.");
    }
  };

  const logout = () => {
    setToken("");
    setStatusMessage("Logged out.");
    navigate("/auth");
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await api.patch(`/projects/${projectId}/status`, { status });
      await Promise.all([fetchProjects(), fetchMyProjects()]);
      setStatusMessage(`Project marked as ${status}.`);
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not update project status.");
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      await Promise.all([fetchProjects(), fetchMyProjects()]);
      setStatusMessage("Project deleted.");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not delete project.");
    }
  };

  const bookmarkProject = async (projectId) => {
    try {
      if (bookmarkedProjectIds.has(String(projectId))) {
        const bookmark = bookmarks.find((b) => String(b.project?._id || b.project) === String(projectId));
        if (bookmark) {
          await api.delete(`/bookmarks/${bookmark._id}`);
          setStatusMessage("Bookmark removed.");
        }
      } else {
        await api.post("/bookmarks", { projectId });
        setStatusMessage("Project bookmarked!");
      }
      await fetchBookmarks();
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not update bookmark.");
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      await fetchNotifications();
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not update notification.");
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    if (!profileForm.name.trim()) {
      setStatusMessage("Name is required.");
      return;
    }
    try {
      setIsSavingProfile(true);
      const payload = {
        name: profileForm.name,
        bio: profileForm.bio,
        skills: profileForm.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        github: profileForm.github,
        linkedin: profileForm.linkedin,
        role: profileForm.role,
      };
      const { data } = await api.put("/auth/me", payload);
      setUser(data.user);
      setStatusMessage("Profile updated.");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const uploadResume = async (file) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const { data } = await api.post("/auth/me/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(data.user);
      setStatusMessage("Resume uploaded successfully!");
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Could not upload resume.");
    }
  };

  // Global search handler: navigate to projects page when searching from other pages
  const handleGlobalSearch = useCallback((value) => {
    setSearch(value);
    if (location.pathname !== "/projects" && value.trim()) {
      navigate("/projects");
    }
  }, [location.pathname, navigate]);

  const stats = useMemo(
    () => [
      { label: "Open projects", value: projects.length, to: "/projects" },
      { label: "My projects", value: myProjects.length, to: "/projects" },
      { label: "Applications received", value: applications.length, to: "/applications" },
      { label: "Applications sent", value: appliedByMe.length, to: "/applications" },
    ],
    [projects.length, myProjects.length, applications.length, appliedByMe.length]
  );

  return (
    <div className={isAuthenticated ? "min-h-screen bg-slate-100 p-6" : ""}>
      {!isAuthenticated ? (
        <Routes>
          <Route
            path="*"
            element={
              <AuthPage
                authMode={authMode}
                setAuthMode={setAuthMode}
                authForm={authForm}
                setAuthForm={setAuthForm}
                isSubmittingAuth={isSubmittingAuth}
                handleAuth={handleAuth}
                handleGoogleAuth={handleGoogleAuth}
                user={user}
              />
            }
          />
        </Routes>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <SidebarNav statusMessage={statusMessage} unreadCount={unreadCount} />
            <button
              className="btn-transition mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-soft hover:bg-red-50 hover:text-red-600"
              onClick={logout}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          <main className="space-y-5 lg:col-span-7">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    user={user}
                    stats={stats}
                    applications={applications}
                    updateApplicationStatus={updateApplicationStatus}
                    notifications={notifications}
                    teammateSuggestions={teammateSuggestions}
                    projectSuggestions={projectSuggestions}
                    bookmarks={bookmarks}
                    unreadCount={unreadCount}
                    search={search}
                    onSearchChange={handleGlobalSearch}
                  />
                }
              />
              <Route
                path="/projects"
                element={
                  <ProjectsPage
                    user={user}
                    search={search}
                    setSearch={setSearch}
                    projectForm={projectForm}
                    setProjectForm={setProjectForm}
                    createProject={createProject}
                    isSubmittingProject={isSubmittingProject}
                    loading={loading}
                    projects={projects}
                    applyMessageByProject={applyMessageByProject}
                    setApplyMessageByProject={setApplyMessageByProject}
                    applyToProject={applyToProject}
                    goToProject={(projectId) => navigate(`/projects/${projectId}`)}
                    bookmarkProject={bookmarkProject}
                    myProjects={myProjects}
                    updateProjectStatus={updateProjectStatus}
                    deleteProject={deleteProject}
                    appliedProjectIds={appliedProjectIds}
                    bookmarkedProjectIds={bookmarkedProjectIds}
                    profileComplete={profileComplete}
                    applyingTo={applyingTo}
                  />
                }
              />
              <Route path="/projects/:id" element={<ProjectDetailsPage user={user} setStatusMessage={setStatusMessage} />} />
              <Route
                path="/applications"
                element={
                  <ApplicationsPage
                    user={user}
                    applications={applications}
                    appliedByMe={appliedByMe}
                    updateApplicationStatus={updateApplicationStatus}
                    withdrawApplication={withdrawApplication}
                    search={search}
                    onSearchChange={handleGlobalSearch}
                    unreadCount={unreadCount}
                  />
                }
              />
              <Route
                path="/notifications"
                element={
                  <NotificationsPage
                    user={user}
                    notifications={notifications}
                    markNotificationRead={markNotificationRead}
                    search={search}
                    onSearchChange={handleGlobalSearch}
                    unreadCount={unreadCount}
                  />
                }
              />
              <Route
                path="/discover"
                element={
                  <DiscoverPage
                    user={user}
                    teammateSuggestions={teammateSuggestions}
                    projectSuggestions={projectSuggestions}
                    bookmarks={bookmarks}
                    search={search}
                    onSearchChange={handleGlobalSearch}
                    unreadCount={unreadCount}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProfilePage
                    user={user}
                    profileForm={profileForm}
                    setProfileForm={setProfileForm}
                    updateProfile={updateProfile}
                    isSavingProfile={isSavingProfile}
                    uploadResume={uploadResume}
                    profileComplete={profileComplete}
                    search={search}
                    onSearchChange={handleGlobalSearch}
                    unreadCount={unreadCount}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          <section className="space-y-5 lg:col-span-3">
            <TeamCard user={user} />
            <LineChartPlaceholder />
          </section>
        </div>
      )}
      {toast && (
        <div className="toast-enter fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 px-5 py-3 text-sm text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
