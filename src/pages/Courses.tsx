import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Search } from "lucide-react";
import { DEMO_COURSES } from "../lib/data";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D": 1.0, "F": 0,
};

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "bg-emerald-500/15 text-emerald-600 border-emerald-500/20";
  if (grade.startsWith("B")) return "bg-blue-500/15 text-blue-600 border-blue-500/20";
  if (grade.startsWith("C")) return "bg-amber-500/15 text-amber-600 border-amber-500/20";
  return "bg-destructive/15 text-destructive border-destructive/20";
}

export default function Courses() {
  const { student } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  if (!student) return null;

  const courses = DEMO_COURSES[student.rollNumber] || [];
  const semesters = ["All", ...Array.from(new Set(courses.map((c) => c.semester + " Sem")))];

  const filtered = courses.filter((c) => {
    const matchSearch = search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.semester + " Sem" === filter;
    return matchSearch && matchFilter;
  });

  const totalCH = courses.reduce((sum, c) => sum + c.creditHours, 0);
  const earnedPoints = courses.reduce((sum, c) => sum + (GRADE_POINTS[c.grade] || 0) * c.creditHours, 0);
  const gpa = totalCH > 0 ? (earnedPoints / totalCH).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Completed Courses</h1>
        <p className="text-muted-foreground text-sm mt-1">All courses completed in previous semesters</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: courses.length, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
          { label: "Credit Hours", value: totalCH, color: "text-violet-600 bg-violet-500/10 border-violet-500/20" },
          { label: "Cumulative GPA", value: gpa, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
          { label: "A Grades", value: courses.filter(c => c.grade.startsWith("A")).length, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium opacity-70 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {semesters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${filter === s ? "bg-primary text-white border-primary" : "bg-card text-foreground border-border hover:bg-muted"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <BookOpen size={40} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No courses found</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Code</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Course Name</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Instructor</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Semester</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">CH</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course.code} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-medium text-muted-foreground">{course.code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{course.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{course.instructor}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{course.semester} Sem</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{course.creditHours}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${gradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
