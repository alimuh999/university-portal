import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CreditCard, Download, Printer, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getExamForm } from "../lib/storage";

export default function AdmitCard() {
  const { student } = useAuth();
  const [downloading, setDownloading] = useState(false);

  if (!student) return null;

  const examForm = getExamForm(student.rollNumber);
  const hasDues = student.hasPendingDues;
  const canDownload = examForm.submitted && !hasDues;

  const handleDownload = () => {
    if (!canDownload) return;
    setDownloading(true);
    setTimeout(() => {
      const win = window.open("", "_blank");
      if (!win) { setDownloading(false); return; }
      const examDate = new Date();
      examDate.setDate(examDate.getDate() + 14);
      const examDateStr = examDate.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Admit Card - ${student.rollNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 30px; color: #111; max-width: 780px; margin: 0 auto; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 20px; }
            .uni-name h1 { color: #1e3a8a; font-size: 20px; }
            .uni-name p { color: #64748b; font-size: 12px; }
            .card-title { text-align: center; }
            .card-title h2 { font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #1e3a8a; }
            .card-title p { font-size: 11px; color: #ef4444; font-weight: bold; }
            .photo-box { width: 90px; height: 110px; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; background: #f1f5f9; color: #94a3b8; font-size: 11px; text-align: center; }
            .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
            .info-item { display: flex; flex-direction: column; }
            .info-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
            .info-value { font-size: 13px; font-weight: 600; }
            .courses-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #1e3a8a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #1e3a8a; color: white; padding: 8px 12px; text-align: left; font-size: 12px; }
            td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            tr:nth-child(even) td { background: #f8fafc; }
            .important { border: 1px solid #fbbf24; background: #fef3c7; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
            .important h3 { color: #d97706; font-size: 12px; font-weight: bold; margin-bottom: 5px; }
            .important ul { color: #92400e; font-size: 11px; padding-left: 15px; }
            .important li { margin-bottom: 3px; }
            .sign-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 30px; }
            .sign-box { border-top: 1px solid #cbd5e1; padding-top: 8px; }
            .sign-label { font-size: 10px; color: #64748b; text-align: center; }
            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 80px; font-weight: 900; color: rgba(30,58,138,0.05); letter-spacing: 0.2em; pointer-events: none; white-space: nowrap; }
          </style>
        </head>
        <body>
          <div class="watermark">ADMIT CARD</div>
          <div class="header">
            <div class="uni-name">
              <h1>University Portal</h1>
              <p>Clearance & Complaint Management System</p>
              <p style="margin-top:3px;font-size:11px;color:#475569;">Academic Year 2024-25</p>
            </div>
            <div class="card-title">
              <h2>ADMIT CARD</h2>
              <p>FINAL EXAMINATION</p>
            </div>
            <div class="photo-box">Photo<br/>Here</div>
          </div>

          <div class="student-info">
            <div class="info-item"><span class="info-label">Student Name</span><span class="info-value">${student.name}</span></div>
            <div class="info-item"><span class="info-label">Roll Number</span><span class="info-value">${student.rollNumber}</span></div>
            <div class="info-item"><span class="info-label">Program</span><span class="info-value">${student.program}</span></div>
            <div class="info-item"><span class="info-label">Department</span><span class="info-value">${student.department}</span></div>
            <div class="info-item"><span class="info-label">Semester</span><span class="info-value">${student.semester}</span></div>
            <div class="info-item"><span class="info-label">Section</span><span class="info-value">${student.section}</span></div>
            <div class="info-item"><span class="info-label">Exam Date Starts</span><span class="info-value">${examDateStr}</span></div>
            <div class="info-item"><span class="info-label">Issue Date</span><span class="info-value">${new Date().toLocaleDateString("en-PK")}</span></div>
          </div>

          <p class="courses-title">Registered Courses</p>
          <table>
            <thead>
              <tr><th>#</th><th>Course Name</th><th>Venue</th><th>Exam Time</th></tr>
            </thead>
            <tbody>
              ${examForm.selectedCourses.map((c, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${c}</td>
                  <td>Exam Hall ${i + 1}</td>
                  <td>${9 + (i % 3)}:00 AM</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="important">
            <h3>IMPORTANT INSTRUCTIONS:</h3>
            <ul>
              <li>This admit card must be presented at the examination center.</li>
              <li>Bring your original CNIC or university ID card.</li>
              <li>Mobile phones, smartwatches, and electronic devices are NOT allowed.</li>
              <li>Report 30 minutes before examination time.</li>
              <li>Maintain examination hall decorum at all times.</li>
            </ul>
          </div>

          <div class="sign-section">
            <div class="sign-box"><p class="sign-label">Student Signature</p></div>
            <div class="sign-box"><p class="sign-label">Controller of Examinations</p></div>
            <div class="sign-box"><p class="sign-label">Head of Department</p></div>
          </div>

          <script>window.print();</script>
        </body>
        </html>
      `);
      setDownloading(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admit Card</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate and download your examination admit card</p>
      </div>

      {hasDues && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Admit Card Locked</p>
              <p className="text-sm text-foreground/80 mt-1">Clear all pending dues to unlock your admit card.</p>
            </div>
          </div>
        </div>
      )}

      {!examForm.submitted && !hasDues && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-600">Exam Form Not Submitted</p>
              <p className="text-sm text-foreground/80 mt-1">
                You need to fill and submit the Exam Form before your admit card can be generated.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Examination Admit Card</h2>
              <p className="text-xs text-muted-foreground">Final Examination — {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Name", value: student.name },
              { label: "Roll No.", value: student.rollNumber },
              { label: "Program", value: student.program },
              { label: "Department", value: student.department },
              { label: "Semester", value: student.semester },
              { label: "Section", value: student.section },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {examForm.submitted && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Registered Courses:</p>
              <div className="space-y-1.5">
                {examForm.selectedCourses.map((c, i) => (
                  <div key={c} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-border">
          <button
            onClick={handleDownload}
            disabled={!canDownload || downloading}
            className="w-full flex items-center justify-center gap-2 bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary/90 transition-all"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : !canDownload ? (
              <>
                <Lock size={15} />
                {hasDues ? "Locked — Clear Dues" : "Submit Exam Form First"}
              </>
            ) : (
              <>
                <Printer size={15} />
                Print / Download Admit Card
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
