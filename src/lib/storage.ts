import type { Complaint, LeaveRequest, GatePass } from "./data";
import { DEMO_COMPLAINTS, DEMO_LEAVE_REQUESTS } from "./data";

function getKey(prefix: string, rollNumber: string) {
  return `${prefix}_${rollNumber}`;
}

export function getComplaints(rollNumber: string): Complaint[] {
  try {
    const raw = localStorage.getItem(getKey("complaints", rollNumber));
    const custom: Complaint[] = raw ? JSON.parse(raw) : [];
    const demo = DEMO_COMPLAINTS[rollNumber] || [];
    const demoIds = new Set(demo.map((c) => c.id));
    const merged = [...demo, ...custom.filter((c) => !demoIds.has(c.id))];
    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return DEMO_COMPLAINTS[rollNumber] || [];
  }
}

export function addComplaint(rollNumber: string, complaint: Omit<Complaint, "id" | "date" | "status">): Complaint {
  const existing = getComplaints(rollNumber);
  const newComplaint: Complaint = {
    ...complaint,
    id: `C${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
  };
  const custom = existing.filter((c) => !DEMO_COMPLAINTS[rollNumber]?.some((d) => d.id === c.id));
  custom.push(newComplaint);
  localStorage.setItem(getKey("complaints", rollNumber), JSON.stringify(custom));
  return newComplaint;
}

export function getLeaveRequests(rollNumber: string): LeaveRequest[] {
  try {
    const raw = localStorage.getItem(getKey("leaves", rollNumber));
    const custom: LeaveRequest[] = raw ? JSON.parse(raw) : [];
    const demo = DEMO_LEAVE_REQUESTS[rollNumber] || [];
    const demoIds = new Set(demo.map((l) => l.id));
    const merged = [...demo, ...custom.filter((l) => !demoIds.has(l.id))];
    return merged.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch {
    return DEMO_LEAVE_REQUESTS[rollNumber] || [];
  }
}

export function addLeaveRequest(rollNumber: string, leave: Omit<LeaveRequest, "id" | "status" | "submittedAt">): LeaveRequest {
  const existing = getLeaveRequests(rollNumber);
  const newLeave: LeaveRequest = {
    ...leave,
    id: `LR${Date.now()}`,
    status: "Pending",
    submittedAt: new Date().toISOString().split("T")[0],
  };
  const demo = DEMO_LEAVE_REQUESTS[rollNumber] || [];
  const custom = existing.filter((l) => !demo.some((d) => d.id === l.id));
  custom.push(newLeave);
  localStorage.setItem(getKey("leaves", rollNumber), JSON.stringify(custom));
  return newLeave;
}

export function getGatePasses(rollNumber: string): GatePass[] {
  try {
    const raw = localStorage.getItem(getKey("gatepasses", rollNumber));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addGatePass(rollNumber: string, gatePass: Omit<GatePass, "id" | "approved" | "approvedBy">): GatePass {
  const existing = getGatePasses(rollNumber);
  const newGatePass: GatePass = {
    ...gatePass,
    id: `GP${Date.now()}`,
    approved: false,
  };
  existing.push(newGatePass);
  localStorage.setItem(getKey("gatepasses", rollNumber), JSON.stringify(existing));
  return newGatePass;
}

export function getExamForm(rollNumber: string): { submitted: boolean; selectedCourses: string[]; submittedAt?: string } {
  try {
    const raw = localStorage.getItem(getKey("examform", rollNumber));
    return raw ? JSON.parse(raw) : { submitted: false, selectedCourses: [] };
  } catch {
    return { submitted: false, selectedCourses: [] };
  }
}

export function saveExamForm(rollNumber: string, courses: string[]) {
  localStorage.setItem(getKey("examform", rollNumber), JSON.stringify({
    submitted: true,
    selectedCourses: courses,
    submittedAt: new Date().toISOString(),
  }));
}
