import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  FileCheck,
  BookOpen,
  FileText,
  ClipboardList,
  CreditCard,
  Calendar,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  GraduationCap,
  FileSignature,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", path: "/profile", icon: User },
  { label: "Complaints", path: "/complaints", icon: MessageSquare },
  { label: "Clearance", path: "/clearance", icon: FileCheck },
  { label: "Courses", path: "/courses", icon: BookOpen },
  { label: "Marksheet", path: "/marksheet", icon: FileText },
  { label: "Exam Form", path: "/exam-form", icon: ClipboardList },
  { label: "Admit Card", path: "/admit-card", icon: CreditCard },
  { label: "Timetable", path: "/timetable", icon: Calendar },
  { label: "Leave Request", path: "/leave", icon: FileSignature },
  { label: "Gate Pass", path: "/gate-pass", icon: GraduationCap },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { student, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasDues = student?.hasPendingDues;

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 z-50 lg:z-auto
          bg-sidebar text-sidebar-foreground flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white leading-tight">University Portal</h1>
              <p className="text-xs text-sidebar-foreground/60">Student Management</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">
                {student?.name?.charAt(0) || "S"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{student?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{student?.rollNumber}</p>
            </div>
          </div>
        </div>

        {hasDues && (
          <div className="mx-3 mt-3 p-2.5 rounded-lg bg-destructive/20 border border-destructive/30">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-destructive flex-shrink-0" />
              <p className="text-xs text-destructive font-medium">Pending Dues Alert</p>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path || location.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                    ? "bg-primary text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={17} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-all duration-150"
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-card border-b border-border h-14 flex items-center px-4 gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1" />

          {hasDues && (
            <div className="hidden sm:flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-full px-3 py-1">
              <Bell size={13} className="text-destructive" />
              <span className="text-xs font-medium text-destructive">Dues Pending</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {student?.name?.charAt(0) || "S"}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-foreground truncate max-w-[150px]">
              {student?.name}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
