import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Plus, Clock, CheckCircle2, AlertCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { getComplaints, addComplaint } from "../lib/storage";
import type { Complaint } from "../lib/data";

const COMPLAINT_TYPES = [
  "Academic",
  "Administrative",
  "Fee",
  "Examination",
  "Library",
  "Hostel",
  "Transport",
  "Harassment",
  "Other",
];

function StatusBadge({ status }: { status: Complaint["status"] }) {
  const map = {
    Pending: "bg-amber-500/15 text-amber-600 border-amber-500/20",
    "In Review": "bg-blue-500/15 text-blue-600 border-blue-500/20",
    Resolved: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  };
  const icons = {
    Pending: Clock,
    "In Review": AlertCircle,
    Resolved: CheckCircle2,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status]}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
              {complaint.type}
            </span>
            <span className="text-xs text-muted-foreground">#{complaint.id}</span>
            <span className="text-xs text-muted-foreground">{complaint.date}</span>
          </div>
          <p className={`text-sm text-foreground mt-2 ${!expanded ? "line-clamp-2" : ""}`}>
            {complaint.description}
          </p>
          {complaint.description.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary mt-1 flex items-center gap-1 hover:underline"
            >
              {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Read more</>}
            </button>
          )}
        </div>
        <StatusBadge status={complaint.status} />
      </div>
      {complaint.response && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
          <p className="text-xs font-semibold text-emerald-600 mb-1">HOD Response:</p>
          <p className="text-xs text-foreground">{complaint.response}</p>
        </div>
      )}
    </div>
  );
}

export default function Complaints() {
  const { student } = useAuth();
  const [complaints, setComplaints] = useState(() =>
    student ? getComplaints(student.rollNumber) : []
  );
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !description.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const newComplaint = addComplaint(student.rollNumber, { type, description });
      setComplaints(getComplaints(student.rollNumber));
      setType("");
      setDescription("");
      setShowForm(false);
      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 4000);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit and track your complaints to the HOD</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          New Complaint
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <p className="text-sm font-medium text-emerald-600">Complaint submitted successfully. HOD will review it shortly.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Submit New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Complaint Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              >
                <option value="" disabled>Select type of complaint</option>
                {COMPLAINT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your complaint in detail. Be specific about dates, people involved, and the issue."
                rows={5}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">{description.length}/500 characters</p>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-600">
                This complaint will be sent directly to your Head of Department (HOD). You will be notified when the status changes.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Submit Complaint
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">
          Previous Complaints ({complaints.length})
        </h2>
        {complaints.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <MessageSquare size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">No complaints filed yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Click "New Complaint" to file your first complaint</p>
          </div>
        ) : (
          complaints.map((c) => <ComplaintCard key={c.id} complaint={c} />)
        )}
      </div>
    </div>
  );
}
