import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FileSignature, Plus, Clock, CheckCircle2, XCircle, Send, Calendar } from "lucide-react";
import { getLeaveRequests, addLeaveRequest } from "../lib/storage";
import type { LeaveRequest } from "../lib/data";

function StatusBadge({ status }: { status: LeaveRequest["status"] }) {
  const map = {
    Pending: "bg-amber-500/15 text-amber-600 border-amber-500/20",
    Approved: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    Rejected: "bg-destructive/15 text-destructive border-destructive/20",
  };
  const icons = { Pending: Clock, Approved: CheckCircle2, Rejected: XCircle };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status]}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}

export default function LeaveRequest() {
  const { student } = useAuth();
  const [requests, setRequests] = useState(() =>
    student ? getLeaveRequests(student.rollNumber) : []
  );
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });

  if (!student) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      addLeaveRequest(student.rollNumber, {
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });
      setRequests(getLeaveRequests(student.rollNumber));
      setForm({ startDate: "", endDate: "", reason: "" });
      setShowForm(false);
      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 4000);
    }, 700);
  };

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Request leaves — sent directly to HOD for approval</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <p className="text-sm font-medium text-emerald-600">Leave request submitted. HOD will review it shortly.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">New Leave Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || new Date().toISOString().split("T")[0]}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Reason for Leave</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Please provide a detailed reason for your leave request..."
                rows={4}
                className={inputClass + " resize-none"}
                required
              />
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-600">
                This leave request will be sent directly to the Head of Department (HOD) for approval. Please provide genuine reasons.
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
                    Submit Request
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
        <h2 className="font-semibold text-foreground">Previous Requests ({requests.length})</h2>
        {requests.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <FileSignature size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">No leave requests yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Click "New Request" to submit a leave request</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground font-mono">#{req.id}</span>
                    <span className="text-xs text-muted-foreground">Submitted: {req.submittedAt}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {req.startDate} — {req.endDate}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.max(1, Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)} day{req.startDate !== req.endDate ? "s" : ""})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.reason}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
