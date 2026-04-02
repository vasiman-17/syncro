import { useState } from "react";
import { Github, Linkedin, MessageSquare, Send, X } from "lucide-react";
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

  const isAdmin = user && (user.role === "admin" || user.role === "owner");

  return (
    <footer className="mt-8 rounded-3xl bg-white p-6 shadow-soft text-center">
      <p className="text-sm font-semibold text-slate-700">Created by Vaibhav Vasistha</p>
      <div className="mt-3 flex justify-center gap-4">
        <a href="https://github.com/vasiman-17" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
          <Github size={20} />
          <span className="text-[10px] uppercase font-bold">GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/vaibhav-vasistha-8a6803358/" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-slate-500 hover:text-[#0a66c2] transition-colors">
          <Linkedin size={20} />
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
          <a href="/admin/feedback" className="text-xs text-slate-500 hover:underline mt-2">
            View Received Feedback (Admin Only)
          </a>
        )}
      </div>
    </footer>
  );
}

export default Footer;
