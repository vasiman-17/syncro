import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

function Footer({ user }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setStatus("Sending...");
    try {
      await api.post("/feedback", { message: feedback });
      setStatus("Sent! Thank you.");
      setTimeout(() => {
        setShowFeedback(false);
        setFeedback("");
        setStatus("");
      }, 2000);
    } catch {
      setStatus("Failed to send.");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  const isAdmin = user && user.email === "vaibhav.vasistha06@gmail.com";

  return (
    <footer className="mt-8 rounded-3xl bg-white p-6 shadow-soft text-center">
      <p className="text-sm font-semibold text-slate-700">Created by Vaibhav Vasistha</p>
      <div className="mt-3 flex justify-center gap-4">
        <a href="https://github.com/vasiman-17" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span className="text-[10px] uppercase font-bold">GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/vaibhav-vasistha-8a6803358/" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#0a66c2] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          <span className="text-[10px] uppercase font-bold">LinkedIn</span>
        </a>
      </div>
      
      <div className="mt-6 flex justify-center flex-col items-center gap-2">
        {!showFeedback ? (
          <button 
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-2 text-xs font-semibold text-brand-600 hover:underline bg-brand-50 px-3 py-1.5 rounded-full"
          >
            <MessageSquare size={14} /> Send Feedback to Creator
          </button>
        ) : (
          <form onSubmit={submitFeedback} className="w-full max-w-sm animate-fade-in bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700">Send Feedback</span>
              <button type="button" onClick={() => setShowFeedback(false)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
            <textarea 
              autoFocus
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none focus:border-brand-500"
              rows={3} 
              placeholder="What can be improved? Found a bug?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={status === "Sending..." || status === "Sent! Thank you."}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-brand-600 font-semibold">{status}</span>
              <button 
                type="submit" 
                disabled={!feedback.trim() || status !== ""}
                className="btn-transition flex items-center gap-1 rounded bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                <Send size={12} /> Submit
              </button>
            </div>
          </form>
        )}
        
        {isAdmin && (
          <Link to="/admin/feedback" className="text-xs text-slate-500 hover:underline mt-2">
            View Received Feedback (Admin Only)
          </Link>
        )}
      </div>
    </footer>
  );
}

export default Footer;
