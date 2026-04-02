import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import { Trash2 } from "lucide-react";
import { api } from "../lib/api";

function FeedbackAdminPage({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setError("");
      const { data } = await api.get("/feedback");
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this feedback?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete.");
    }
  };

  if (!user || user.email !== "vaibhav.vasistha06@gmail.com") {
    return <div className="p-6">Access Denied. Only the authorized creator can view this.</div>;
  }

  return (
    <>
      <HeroSection user={user} title="User Feedback" subtitle="Read what users are saying about your platform." />
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-slate-900 mb-4">Received Feedback</h2>
        {error && <p className="text-sm font-semibold text-red-500 mb-4 flex items-center gap-2">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : feedbacks.length === 0 ? (
          <p className="text-sm text-slate-500">No feedback received yet.</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="group relative rounded-2xl border border-slate-200 p-4 animate-fade-in hover:border-brand-200 transition-all">
                <button 
                  onClick={() => handleDelete(fb._id)}
                  className="absolute right-4 top-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove feedback"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex justify-between items-start mb-2 text-xs text-slate-500 pr-8">
                  <p>
                    From: <span className="font-semibold text-slate-700">{fb.user?.name || "Unknown"}</span> ({fb.user?.email || "No email"})
                  </p>
                  <span>{new Date(fb.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{fb.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default FeedbackAdminPage;
