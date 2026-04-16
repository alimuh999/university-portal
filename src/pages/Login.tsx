import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { login } from "../lib/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { setStudent } = useAuth();
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const student = login(rollNumber.trim(), password);
      if (student) {
        setStudent(student);
        navigate("/dashboard");
      } else {
        setError("Invalid roll number or password. Try: CS-2021-001 / demo123");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">University Portal</h1>
          <p className="text-slate-400 mt-1 text-sm">Clearance & Complaint Management System</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Welcome Back</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to your student account</p>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-lg mb-4">
              <AlertCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. CS-2021-001"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              New student?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300 font-medium mb-1">Demo Accounts:</p>
            <p className="text-xs text-slate-400">CS-2021-001 / demo123 (No dues)</p>
            <p className="text-xs text-slate-400">EE-2020-045 / demo123 (Pass-out, has dues)</p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          University Clearance and Complaint Management System v2.0
        </p>
      </div>
    </div>
  );
}
