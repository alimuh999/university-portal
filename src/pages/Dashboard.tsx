import React from "react";
import { Link } from "wouter";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  MessageSquare,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Bell,
  ArrowRight,
} from "lucide-react";
import { DEMO_COURSES, DEMO_COMPLAINTS } from "../lib/data";
import { getComplaints } from "../lib/storage";

export default function Dashboard() {
  const { student } = useAuth();
  if (!student) return null;

  const courses = DEMO_COURSES[student.rollNumber] || [];
  const complaints = getComplaints(student.rollNumber);
  const pendingComplaints = complaints.filter((c) => c.status === "Pending").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved").length;

  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      iconBg: "bg-blue-500",
    },
    {
      label: "CGPA",
      value: student.cgpa.toFixed(2),
      icon: Star,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      iconBg: "bg-emerald-500",
    },
    {
      label: "Complaints",
      value: complaints.length,
      icon: MessageSquare,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      iconBg: "bg-amber-500",
    },
    {
      label: "Current Semester",
      value: student.semester,
      icon: TrendingUp,
      color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      iconBg: "bg-violet-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {student.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {student.department} — {student.program}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-muted-foreground">Roll Number</p>
          <p className="font-semibold text-foreground">{student.rollNumber}</p>
        </div>
      </div>

      {student.hasPendingDues && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-destructive mb-1">Pending Dues Alert</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className={`flex items-center gap-1.5 ${student.financeStatus === "Pending" ? "text-destructive" : "text-emerald-600"}`}>
                  {student.financeStatus === "Pending" ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                  Finance: {student.financeStatus}
                </span>
                <span className={`flex items-center gap-1.5 ${student.libraryStatus === "Not Returned" ? "text-destructive" : "text-emerald-600"}`}>
                  {student.libraryStatus === "Not Returned" ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                  Library: {student.libraryStatus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Marksheet download and exam form submission are disabled until dues are cleared.
              </p>
            </div>
            <Link href="/clearance" className="flex-shrink-0 text-xs bg-destructive text-white px-3 py-1.5 rounded-lg font-medium hover:bg-destructive/90 transition-colors">
              View
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.color}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium opacity-70 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Clearance Status</h2>
            <Link href="/clearance" className="text-xs text-primary hover:underline flex items-center gap-1">View <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${student.financeStatus === "Paid" ? "bg-emerald-500/15" : "bg-destructive/15"}`}>
                  {student.financeStatus === "Paid"
                    ? <CheckCircle2 size={16} className="text-emerald-600" />
                    : <XCircle size={16} className="text-destructive" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Finance Department</p>
                  <p className="text-xs text-muted-foreground">Fee Clearance</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${student.financeStatus === "Paid" ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}`}>
                {student.financeStatus}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${student.libraryStatus === "Returned" ? "bg-emerald-500/15" : "bg-destructive/15"}`}>
                  {student.libraryStatus === "Returned"
                    ? <CheckCircle2 size={16} className="text-emerald-600" />
                    : <XCircle size={16} className="text-destructive" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Library</p>
                  <p className="text-xs text-muted-foreground">Books Return Status</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${student.libraryStatus === "Returned" ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}`}>
                {student.libraryStatus === "Returned" ? "Cleared" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Complaint Summary</h2>
            <Link href="/complaints" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "Pending", count: pendingComplaints, color: "bg-amber-500/15 text-amber-600", dot: "bg-amber-500" },
              { label: "In Review", count: complaints.filter(c => c.status === "In Review").length, color: "bg-blue-500/15 text-blue-600", dot: "bg-blue-500" },
              { label: "Resolved", count: resolvedComplaints, color: "bg-emerald-500/15 text-emerald-600", dot: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.color}`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
          {complaints.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">No complaints filed yet</p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Courses</h2>
            <Link href="/courses" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          {courses.slice(0, 4).map((course) => (
            <div key={course.code} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{course.name}</p>
                <p className="text-xs text-muted-foreground">{course.code} — {course.semester} Sem</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                course.grade.startsWith("A") ? "bg-emerald-500/15 text-emerald-600"
                : course.grade.startsWith("B") ? "bg-blue-500/15 text-blue-600"
                : "bg-amber-500/15 text-amber-600"
              }`}>
                {course.grade}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Submit Complaint", path: "/complaints", icon: MessageSquare, color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20" },
              { label: "Apply Clearance", path: "/clearance", icon: FileCheck, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20" },
              { label: "Request Leave", path: "/leave", icon: Clock, color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" },
              { label: "Get Gate Pass", path: "/gate-pass", icon: Bell, color: "bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/20" },
            ].map((action) => (
              <Link key={action.path} href={action.path} className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-colors ${action.color}`}>
                <action.icon size={20} />
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
