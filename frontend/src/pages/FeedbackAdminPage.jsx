import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import { api } from "../lib/api";

function FeedbackAdminPage({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data } = await api.get("/feedback");
      setFeedbacks(data.feedbacks || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
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
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-sm text-slate-500">No feedback received yet.</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">
                  From: <span className="font-semibold text-slate-700">{fb.user?.name || "Unknown"}</span> ({fb.user?.email || "No email"})
                  <span className="ml-2">— {new Date(fb.createdAt).toLocaleDateString()}</span>
                </p>
                <p className="text-sm text-slate-800">{fb.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default FeedbackAdminPage;
