import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  BookOpen,
  Users,
  GraduationCap,
  Star,
} from "lucide-react";

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { student } = useAuth();
  if (!student) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Your academic and personal information</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-primary">{student.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
            <p className="text-muted-foreground text-sm">{student.program}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <GraduationCap size={12} />
                {student.rollNumber}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Star size={12} />
                CGPA: {student.cgpa.toFixed(2)}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${student.isPassOut ? "bg-violet-500/10 text-violet-600 border-violet-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"}`}>
                {student.isPassOut ? "Pass-Out" : `${student.semester} Semester`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1">Academic Information</h3>
          <p className="text-xs text-muted-foreground mb-4">Your enrollment and study details</p>
          <InfoRow icon={GraduationCap} label="Roll Number" value={student.rollNumber} />
          <InfoRow icon={BookOpen} label="Program" value={student.program} />
          <InfoRow icon={Users} label="Department" value={student.department} />
          <InfoRow icon={Users} label="Section" value={student.section} />
          <InfoRow icon={Star} label="Current Semester" value={student.semester} />
          <InfoRow icon={Star} label="CGPA" value={student.cgpa.toFixed(2)} />
          <InfoRow icon={Calendar} label="Registered On" value={student.registeredAt} />
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-1">Personal Information</h3>
          <p className="text-xs text-muted-foreground mb-4">Your contact and personal details</p>
          <InfoRow icon={User} label="Full Name" value={student.name} />
          <InfoRow icon={User} label="Father's Name" value={student.fatherName || "Not provided"} />
          <InfoRow icon={CreditCard} label="CNIC" value={student.cnic || "Not provided"} />
          <InfoRow icon={Calendar} label="Date of Birth" value={student.dob || "Not provided"} />
          <InfoRow icon={Mail} label="Email Address" value={student.email} />
          <InfoRow icon={Phone} label="Phone Number" value={student.phone || "Not provided"} />
          <InfoRow icon={MapPin} label="Address" value={student.address || "Not provided"} />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Clearance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`rounded-xl p-4 border ${student.financeStatus === "Paid" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-destructive/10 border-destructive/20"}`}>
            <p className="text-xs font-medium text-muted-foreground mb-1">Finance Status</p>
            <p className={`font-bold text-lg ${student.financeStatus === "Paid" ? "text-emerald-600" : "text-destructive"}`}>
              {student.financeStatus}
            </p>
          </div>
          <div className={`rounded-xl p-4 border ${student.libraryStatus === "Returned" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-destructive/10 border-destructive/20"}`}>
            <p className="text-xs font-medium text-muted-foreground mb-1">Library Status</p>
            <p className={`font-bold text-lg ${student.libraryStatus === "Returned" ? "text-emerald-600" : "text-destructive"}`}>
              {student.libraryStatus === "Returned" ? "Cleared" : "Books Pending"}
            </p>
          </div>
          <div className={`rounded-xl p-4 border ${!student.hasPendingDues ? "bg-emerald-500/10 border-emerald-500/20" : "bg-destructive/10 border-destructive/20"}`}>
            <p className="text-xs font-medium text-muted-foreground mb-1">Overall Status</p>
            <p className={`font-bold text-lg ${!student.hasPendingDues ? "text-emerald-600" : "text-destructive"}`}>
              {student.hasPendingDues ? "Dues Pending" : "All Clear"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
