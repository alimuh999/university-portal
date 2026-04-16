import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ClipboardList, Lock, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { EXAM_COURSES } from "../lib/data";
import { getExamForm, saveExamForm } from "../lib/storage";

export default function ExamForm() {
  const { student } = useAuth();
  const examState = student ? getExamForm(student.rollNumber) : { submitted: false, selectedCourses: [] };
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(examState.submitted);
  const [submittedCourses] = useState<string[]>(examState.selectedCourses);
  const [submitting, setSubmitting] = useState(false);

  if (!student) return null;

  const hasDues = student.hasPendingDues;
  const courses = EXAM_COURSES[student.rollNumber] || [];

  const toggleCourse = (course: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length === 0 || hasDues) return;
    setSubmitting(true);
    setTimeout(() => {
      saveExamForm(student.rollNumber, selectedCourses);
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exam Form</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill and submit your exam registration form</p>
        </div>
        <div className="bg-card rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg">Exam Form Submitted!</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Your exam registration has been successfully submitted. You can now download your admit card.
              </p>
              <div className="space-y-1">
                {(submittedCourses.length > 0 ? submittedCourses : selectedCourses).map((course) => (
                  <div key={course} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-foreground">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Go to <strong>Admit Card</strong> section to download your admit card.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exam Form</h1>
        <p className="text-muted-foreground text-sm mt-1">Fill your exam registration form for the current semester</p>
      </div>

      {hasDues && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Exam Form Locked</p>
              <p className="text-sm text-foreground/80 mt-1">
                You cannot submit an exam form with pending dues. Please clear your Finance and Library dues first.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-5">
        <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Student Name</p>
            <p className="text-sm font-semibold text-foreground">{student.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Roll Number</p>
            <p className="text-sm font-semibold text-foreground">{student.rollNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Department</p>
            <p className="text-sm font-semibold text-foreground">{student.department}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Program</p>
            <p className="text-sm font-semibold text-foreground">{student.program}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Semester</p>
            <p className="text-sm font-semibold text-foreground">{student.semester}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Section</p>
            <p className="text-sm font-semibold text-foreground">{student.section}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Select Courses for Examination</h3>
            <p className="text-xs text-muted-foreground mb-3">Check the courses you want to appear in</p>
            <div className="space-y-2">
              {courses.map((course) => (
                <label
                  key={course}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCourses.includes(course)
                      ? "border-primary/40 bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  } ${hasDues ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course)}
                    onChange={() => !hasDues && toggleCourse(course)}
                    disabled={hasDues}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">{course}</span>
                </label>
              ))}
            </div>
            {selectedCourses.length > 0 && (
              <p className="text-xs text-primary mt-2">{selectedCourses.length} course(s) selected</p>
            )}
          </div>

          <button
            type="submit"
            disabled={hasDues || selectedCourses.length === 0 || submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary/90 transition-all"
          >
            {hasDues ? (
              <>
                <Lock size={15} />
                Locked — Clear Dues First
              </>
            ) : submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} />
                Submit Exam Form
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
