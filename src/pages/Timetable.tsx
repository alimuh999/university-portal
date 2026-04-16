import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { TIMETABLES } from "../lib/data";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const typeColors: Record<string, string> = {
  Lecture: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  Lab: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  Tutorial: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  Seminar: "bg-violet-500/15 text-violet-600 border-violet-500/20",
};

export default function Timetable() {
  const { student } = useAuth();
  const [activeDay, setActiveDay] = useState("Monday");

  if (!student) return null;

  const ttKey = `${student.department.split(" ").map(w => w[0]).join("")}-${student.section}`;
  const timetableRaw = TIMETABLES[ttKey] || TIMETABLES["CS-A"] || [];

  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = timetableRaw.filter((e) => e.day === day);
    return acc;
  }, {} as Record<string, typeof timetableRaw>);

  const dayEntries = byDay[activeDay] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Class Timetable</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {student.department} — Section {student.section} — {student.semester} Semester
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              activeDay === day
                ? "bg-primary text-white border-primary"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
            {byDay[day].length > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeDay === day ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                {byDay[day].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {dayEntries.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Calendar size={40} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No classes on {activeDay}</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Enjoy your free day!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEntries.map((entry, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-center bg-primary/10 rounded-xl px-3 py-2 min-w-[80px]">
                  <p className="text-xs text-primary font-medium">Period {i + 1}</p>
                  <p className="text-xs text-muted-foreground mt-1">{entry.time.split(" - ")[0]}</p>
                  <p className="text-xs text-muted-foreground">to</p>
                  <p className="text-xs text-muted-foreground">{entry.time.split(" - ")[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{entry.subject}</h3>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${typeColors[entry.type] || typeColors.Lecture}`}>
                      {entry.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User size={12} />
                      {entry.teacher}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin size={12} />
                      {entry.room}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {entry.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Weekly Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">Day</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5">Total Classes</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 hidden md:table-cell">Subjects</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setActiveDay(day)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {day}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{byDay[day].length} class{byDay[day].length !== 1 ? "es" : ""}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {byDay[day].slice(0, 3).map((e) => (
                        <span key={e.subject} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {e.subject.split(" ")[0]}
                        </span>
                      ))}
                      {byDay[day].length > 3 && (
                        <span className="text-xs text-muted-foreground">+{byDay[day].length - 3} more</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
