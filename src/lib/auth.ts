import { DEMO_STUDENTS, type Student } from "./data";

const AUTH_KEY = "uni_portal_auth";

export function getStoredStudents(): Record<string, Student> {
  try {
    const raw = localStorage.getItem("uni_portal_students");
    if (!raw) return { ...DEMO_STUDENTS };
    return { ...DEMO_STUDENTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEMO_STUDENTS };
  }
}

export function saveStudent(student: Student) {
  const students = getStoredStudents();
  students[student.rollNumber] = student;
  const custom: Record<string, Student> = {};
  for (const [k, v] of Object.entries(students)) {
    if (!DEMO_STUDENTS[k]) custom[k] = v;
    else custom[k] = v;
  }
  localStorage.setItem("uni_portal_students", JSON.stringify(custom));
}

export function login(rollNumber: string, password: string): Student | null {
  const students = getStoredStudents();
  const student = students[rollNumber.toUpperCase()];
  if (!student) return null;
  if (student.password !== password) return null;
  localStorage.setItem(AUTH_KEY, JSON.stringify(student));
  return student;
}

export function register(data: {
  rollNumber: string;
  name: string;
  department: string;
  section: string;
  program: string;
  email: string;
  password: string;
}): { success: boolean; error?: string } {
  const students = getStoredStudents();
  const key = data.rollNumber.toUpperCase();
  if (students[key]) {
    return { success: false, error: "Roll number already registered." };
  }
  const newStudent: Student = {
    rollNumber: key,
    name: data.name,
    department: data.department,
    section: data.section,
    semester: "1st",
    program: data.program,
    email: data.email,
    phone: "",
    cnic: "",
    fatherName: "",
    address: "",
    dob: "",
    cgpa: 0,
    isPassOut: false,
    hasPendingDues: false,
    financeStatus: "Paid",
    libraryStatus: "Returned",
    registeredAt: new Date().toISOString().split("T")[0],
    password: data.password,
  };
  students[key] = newStudent;
  const custom: Record<string, Student> = {};
  for (const [k, v] of Object.entries(students)) {
    if (!DEMO_STUDENTS[k]) custom[k] = v;
    else custom[k] = v;
  }
  localStorage.setItem("uni_portal_students", JSON.stringify(custom));
  localStorage.setItem(AUTH_KEY, JSON.stringify(newStudent));
  return { success: true };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentStudent(): Student | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Student;
  } catch {
    return null;
  }
}
