import React from "react";
import { useAuth } from "../context/AuthContext";
import { FileText, Download, Lock, AlertTriangle, ChevronDown, ChevronUp, Printer } from "lucide-react";
import { DEMO_MARKSHEETS } from "../lib/data";
import { useState } from "react";

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-emerald-600 font-bold";
  if (grade.startsWith("B")) return "text-blue-600 font-bold";
  if (grade.startsWith("C")) return "text-amber-600 font-bold";
  return "text-destructive font-bold";
}

export default function Marksheet() {
  const { student } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!student) return null;

  const marksheets = DEMO_MARKSHEETS[student.rollNumber] || [];
  const hasDues = student.hasPendingDues;

  const handleDownload = (semester: string) => {
    if (hasDues) return;
    const win = window.open("", "_blank");
    if (!win) return;
    const ms = marksheets.find((m) => m.semester === semester);
    if (!ms) return;
    win.document.write(`
      <html>
      <head>
        <title>Marksheet - ${semester} Semester</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #111; }
          .header { text-align: center; border-bottom: 3px double #1d4ed8; padding-bottom: 20px; margin-bottom: 30px; }
          h1 { color: #1d4ed8; margin-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
          .info-row { display: flex; flex-direction: column; }
          .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
          .info-value { font-weight: 600; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #1e3a8a; color: white; padding: 10px 12px; text-align: left; font-size: 12px; }
          td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          tr:last-child td { border-bottom: none; }
          .gpa-row { background: #eff6ff; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>University Clearance & Portal System</h1>
          <p>Official Academic Marksheet</p>
          <p>${ms.year}</p>
        </div>
        <div class="info-grid">
          <div class="info-row"><span class="info-label">Student Name</span><span class="info-value">${student.name}</span></div>
          <div class="info-row"><span class="info-label">Roll Number</span><span class="info-value">${student.rollNumber}</span></div>
          <div class="info-row"><span class="info-label">Program</span><span class="info-value">${student.program}</span></div>
          <div class="info-row"><span class="info-label">Department</span><span class="info-value">${student.department}</span></div>
          <div class="info-row"><span class="info-label">Semester</span><span class="info-value">${ms.semester}</span></div>
          <div class="info-row"><span class="info-label">Section</span><span class="info-value">${student.section}</span></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Marks Obtained</th>
              <th>Total Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${ms.courses.map(c => `
              <tr>
                <td>${c.name}</td>
                <td>${c.marks}</td>
                <td>${c.total}</td>
                <td>${Math.round((c.marks / c.total) * 100)}%</td>
                <td><strong>${c.grade}</strong></td>
              </tr>
            `).join("")}
            <tr class="gpa-row">
              <td colspan="4"><strong>Semester GPA</strong></td>
              <td><strong>${ms.gpa.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>This is an official document generated from the University Student Portal.</p>
          <p>Generated on: ${new Date().toLocaleDateString("en-PK")}</p>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marksheets</h1>
        <p className="text-muted-foreground text-sm mt-1">View and download your semester marksheets</p>
      </div>

      {hasDues && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Downloads Disabled</p>
              <p className="text-sm text-foreground/80 mt-1">
                Marksheet download is disabled because you have pending dues. Please clear all dues to enable downloads.
              </p>
            </div>
          </div>
        </div>
      )}

      {marksheets.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <FileText size={40} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No marksheets available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {marksheets.map((ms) => (
            <div key={ms.semester} className={`bg-card rounded-xl border border-border overflow-hidden ${hasDues ? "watermark-overlay" : ""}`}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === ms.semester ? null : ms.semester)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{ms.semester} Semester</p>
                    <p className="text-xs text-muted-foreground">{ms.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-sm font-semibold text-foreground">
                    GPA: {ms.gpa.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(ms.semester);
                    }}
                    disabled={hasDues}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      hasDues
                        ? "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50"
                        : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    }`}
                    title={hasDues ? "Clear pending dues to download" : "Download marksheet"}
                  >
                    {hasDues ? <Lock size={12} /> : <Download size={12} />}
                    {hasDues ? "Locked" : "Download"}
                  </button>
                  {expanded === ms.semester ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                </div>
              </div>

              {expanded === ms.semester && (
                <div className="border-t border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">Course</th>
                          <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-2.5">Marks</th>
                          <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-2.5">Total</th>
                          <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-2.5">%</th>
                          <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-2.5">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ms.courses.map((c) => (
                          <tr key={c.name} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 text-sm text-foreground">{c.name}</td>
                            <td className="px-4 py-3 text-sm text-center text-foreground">{c.marks}</td>
                            <td className="px-4 py-3 text-sm text-center text-muted-foreground">{c.total}</td>
                            <td className="px-4 py-3 text-sm text-center text-muted-foreground">
                              {Math.round((c.marks / c.total) * 100)}%
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span className={gradeColor(c.grade)}>{c.grade}</span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-primary/5 border-t-2 border-primary/20">
                          <td colSpan={4} className="px-4 py-3 text-sm font-bold text-foreground">
                            Semester GPA
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-primary text-center">
                            {ms.gpa.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
