import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Info,
  DollarSign,
  BookOpen,
} from "lucide-react";

export default function Clearance() {
  const { student } = useAuth();
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  if (!student) return null;

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplied(true);
      setApplying(false);
    }, 1000);
  };

  const financeClear = student.financeStatus === "Paid";
  const libraryClear = student.libraryStatus === "Returned";
  const allClear = financeClear && libraryClear;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clearance Status</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your university clearance requirements
        </p>
      </div>

      {!allClear && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Clearance Blocked</p>
              <p className="text-sm text-foreground/80 mt-1">
                You have pending dues that must be cleared before your clearance can be processed.
                This also restricts downloading marksheets and submitting exam forms.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-xl border p-5 ${financeClear ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${financeClear ? "bg-emerald-500/20" : "bg-destructive/20"}`}>
              <DollarSign size={20} className={financeClear ? "text-emerald-600" : "text-destructive"} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Finance Department</h3>
              <p className="text-xs text-muted-foreground">Fee & Dues Clearance</p>
            </div>
            <div className="ml-auto">
              {financeClear
                ? <CheckCircle2 size={22} className="text-emerald-500" />
                : <XCircle size={22} className="text-destructive" />
              }
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-semibold ${financeClear ? "text-emerald-600" : "text-destructive"}`}>
                {student.financeStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Semester Fee</span>
              <span className={`font-semibold ${financeClear ? "text-emerald-600" : "text-destructive"}`}>
                {financeClear ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>
          {!financeClear && (
            <div className="mt-3 p-2.5 bg-destructive/10 rounded-lg">
              <p className="text-xs text-destructive">
                Please visit Finance Department or pay online to clear dues.
              </p>
            </div>
          )}
        </div>

        <div className={`rounded-xl border p-5 ${libraryClear ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${libraryClear ? "bg-emerald-500/20" : "bg-destructive/20"}`}>
              <BookOpen size={20} className={libraryClear ? "text-emerald-600" : "text-destructive"} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Library</h3>
              <p className="text-xs text-muted-foreground">Books Return Status</p>
            </div>
            <div className="ml-auto">
              {libraryClear
                ? <CheckCircle2 size={22} className="text-emerald-500" />
                : <XCircle size={22} className="text-destructive" />
              }
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-semibold ${libraryClear ? "text-emerald-600" : "text-destructive"}`}>
                {student.libraryStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overdue Books</span>
              <span className={`font-semibold ${libraryClear ? "text-emerald-600" : "text-destructive"}`}>
                {libraryClear ? "None" : "2 books"}
              </span>
            </div>
          </div>
          {!libraryClear && (
            <div className="mt-3 p-2.5 bg-destructive/10 rounded-lg">
              <p className="text-xs text-destructive">
                Please return all library books before applying for clearance.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Overall Clearance Summary</h3>
        <div className="space-y-3">
          {[
            { dept: "Finance Department", status: financeClear ? "Cleared" : "Pending", ok: financeClear },
            { dept: "Library", status: libraryClear ? "Cleared" : "Pending", ok: libraryClear },
            { dept: "Academic Department", status: "Cleared", ok: true },
            { dept: "HOD", status: allClear ? "Cleared" : "Awaiting Dues", ok: allClear },
          ].map((item) => (
            <div key={item.dept} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {item.ok
                  ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  : <XCircle size={18} className="text-destructive flex-shrink-0" />
                }
                <span className="text-sm font-medium text-foreground">{item.dept}</span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.ok ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : "bg-destructive/15 text-destructive border-destructive/20"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {student.isPassOut && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-2">Apply for Final Clearance</h3>
          <p className="text-sm text-muted-foreground mb-4">
            As a pass-out student, you can apply for final clearance certificate once all dues are cleared.
          </p>

          {!allClear && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
              <Info size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-600">
                You cannot apply for clearance until all pending dues are resolved.
                Please clear Finance and Library dues first.
              </p>
            </div>
          )}

          {applied ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <p className="text-sm font-medium text-emerald-600">
                Clearance application submitted successfully! The registrar will process it within 5-7 working days.
              </p>
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={!allClear || applying}
              className="flex items-center gap-2 bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all"
            >
              {applying ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={15} />
                  Apply for Clearance
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
