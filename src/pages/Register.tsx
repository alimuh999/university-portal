import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { register } from "../lib/auth";
import { useAuth } from "../context/AuthContext";
import { getCurrentStudent } from "../lib/auth";

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Mathematics",
  "Physics",
  "Chemistry",
];

const PROGRAMS: Record<string, string[]> = {
  "Computer Science": ["BS Computer Science", "BS Software Engineering", "BS Cyber Security"],
  "Electrical Engineering": ["BS Electrical Engineering", "BE Electronics"],
  "Mechanical Engineering": ["BS Mechanical Engineering"],
  "Civil Engineering": ["BS Civil Engineering"],
  "Business Administration": ["BBA", "BS Commerce"],
  "Mathematics": ["BS Mathematics"],
  "Physics": ["BS Physics"],
  "Chemistry": ["BS Chemistry"],
};

export default function Register() {
  const [, navigate] = useLocation();
  const { setStudent } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    rollNumber: "",
    name: "",
    department: "",
    section: "",
    program: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { program: "" } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register({
        rollNumber: form.rollNumber,
        name: form.name,
        department: form.department,
        section: form.section,
        program: form.program,
        email: form.email,
        password: form.password,
      });

      if (result.success) {
        const s = getCurrentStudent();
        if (s) setStudent(s);
        navigate("/dashboard");
      } else {
        setError(result.error || "Registration failed.");
      }
      setLoading(false);
    }, 600);
  };

  const programs = form.department ? PROGRAMS[form.department] || [] : [];

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg my-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Student Registration</h1>
          <p className="text-slate-400 mt-1 text-sm">Create your university portal account</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-lg mb-5">
              <AlertCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Muhammad Ahmed" className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Roll Number</label>
                <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="CS-2024-001" className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Section</label>
                <input name="section" value={form.section} onChange={handleChange} placeholder="A" className={inputClass} required />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Department</label>
                <select name="department" value={form.department} onChange={handleChange} className={inputClass + " appearance-none"} required>
                  <option value="" disabled className="bg-slate-800">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-slate-800">{d}</option>
                  ))}
                </select>
              </div>

              {programs.length > 0 && (
                <div className="col-span-2">
                  <label className={labelClass}>Program</label>
                  <select name="program" value={form.program} onChange={handleChange} className={inputClass + " appearance-none"} required>
                    <option value="" disabled className="bg-slate-800">Select program</option>
                    {programs.map((p) => (
                      <option key={p} value={p} className="bg-slate-800">{p}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-span-2">
                <label className={labelClass}>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@university.edu.pk" className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className={inputClass + " pr-12"}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              Already registered?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
