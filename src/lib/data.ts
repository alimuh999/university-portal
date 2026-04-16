export interface Student {
  rollNumber: string;
  name: string;
  department: string;
  section: string;
  semester: string;
  program: string;
  email: string;
  phone: string;
  cnic: string;
  fatherName: string;
  address: string;
  dob: string;
  cgpa: number;
  isPassOut: boolean;
  hasPendingDues: boolean;
  financeStatus: "Paid" | "Pending";
  libraryStatus: "Returned" | "Not Returned";
  registeredAt: string;
  password: string;
}

export interface Complaint {
  id: string;
  type: string;
  description: string;
  status: "Pending" | "In Review" | "Resolved";
  date: string;
  response?: string;
}

export interface Course {
  code: string;
  name: string;
  creditHours: number;
  grade: string;
  semester: string;
  instructor: string;
}

export interface Marksheet {
  semester: string;
  year: string;
  gpa: number;
  courses: { name: string; marks: number; total: number; grade: string }[];
}

export interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: string;
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

export interface GatePass {
  id: string;
  purpose: string;
  destination: string;
  departureTime: string;
  returnTime: string;
  date: string;
  approved: boolean;
  approvedBy?: string;
}

export interface ExamForm {
  semester: string;
  courses: string[];
  submittedAt?: string;
  feeStatus: "Paid" | "Pending";
}

export const DEMO_STUDENTS: Record<string, Student> = {
  "CS-2021-001": {
    rollNumber: "CS-2021-001",
    name: "Ahmed Ali Khan",
    department: "Computer Science",
    section: "A",
    semester: "7th",
    program: "BS Computer Science",
    email: "ahmed.ali@university.edu.pk",
    phone: "0300-1234567",
    cnic: "35202-1234567-1",
    fatherName: "Ali Khan",
    address: "House #12, Street 4, Lahore",
    dob: "2002-03-15",
    cgpa: 3.45,
    isPassOut: false,
    hasPendingDues: false,
    financeStatus: "Paid",
    libraryStatus: "Returned",
    registeredAt: "2021-09-01",
    password: "demo123",
  },
  "EE-2020-045": {
    rollNumber: "EE-2020-045",
    name: "Fatima Malik",
    department: "Electrical Engineering",
    section: "B",
    semester: "Pass-Out",
    program: "BS Electrical Engineering",
    email: "fatima.malik@university.edu.pk",
    phone: "0321-9876543",
    cnic: "35202-9876543-4",
    fatherName: "Malik Ahmad",
    address: "Flat 5B, Garden Town, Karachi",
    dob: "2001-07-22",
    cgpa: 3.72,
    isPassOut: true,
    hasPendingDues: true,
    financeStatus: "Pending",
    libraryStatus: "Not Returned",
    registeredAt: "2020-09-01",
    password: "demo123",
  },
};

export const DEMO_COMPLAINTS: Record<string, Complaint[]> = {
  "CS-2021-001": [
    {
      id: "C001",
      type: "Academic",
      description: "The grading criteria for Mid Term exam was not clear. Many students were confused about the weightage distribution.",
      status: "Resolved",
      date: "2024-11-10",
      response: "The course instructor has clarified the grading policy and it has been updated on the university portal.",
    },
    {
      id: "C002",
      type: "Administrative",
      description: "Scholarship form deadline was not communicated properly. I missed the submission deadline.",
      status: "In Review",
      date: "2024-12-01",
    },
  ],
  "EE-2020-045": [
    {
      id: "C003",
      type: "Fee",
      description: "The fee challan issued has incorrect amount compared to the fee structure provided at admission.",
      status: "Pending",
      date: "2025-01-05",
    },
  ],
};

export const DEMO_COURSES: Record<string, Course[]> = {
  "CS-2021-001": [
    { code: "CS-301", name: "Data Structures & Algorithms", creditHours: 3, grade: "A", semester: "5th", instructor: "Dr. Imran Shah" },
    { code: "CS-302", name: "Database Management Systems", creditHours: 3, grade: "A-", semester: "5th", instructor: "Ms. Sarah Ahmed" },
    { code: "CS-303", name: "Operating Systems", creditHours: 3, grade: "B+", semester: "5th", instructor: "Dr. Kamran Iqbal" },
    { code: "CS-304", name: "Computer Networks", creditHours: 3, grade: "A", semester: "5th", instructor: "Prof. Asad Ali" },
    { code: "CS-305", name: "Software Engineering", creditHours: 3, grade: "B+", semester: "5th", instructor: "Dr. Nadia Hussain" },
    { code: "CS-401", name: "Artificial Intelligence", creditHours: 3, grade: "A-", semester: "6th", instructor: "Dr. Imran Shah" },
    { code: "CS-402", name: "Machine Learning", creditHours: 3, grade: "A", semester: "6th", instructor: "Dr. Farhan Baig" },
    { code: "CS-403", name: "Web Technologies", creditHours: 3, grade: "A", semester: "6th", instructor: "Ms. Zara Khan" },
    { code: "CS-404", name: "Mobile App Development", creditHours: 3, grade: "B+", semester: "6th", instructor: "Mr. Hassan Raza" },
    { code: "CS-405", name: "Compiler Construction", creditHours: 3, grade: "B", semester: "6th", instructor: "Dr. Kamran Iqbal" },
  ],
  "EE-2020-045": [
    { code: "EE-301", name: "Power Electronics", creditHours: 3, grade: "A-", semester: "5th", instructor: "Dr. Bilal Awan" },
    { code: "EE-302", name: "Signals & Systems", creditHours: 3, grade: "A", semester: "5th", instructor: "Prof. Amjad Hussain" },
    { code: "EE-303", name: "Control Systems", creditHours: 3, grade: "B+", semester: "5th", instructor: "Dr. Sana Malik" },
    { code: "EE-401", name: "Digital Signal Processing", creditHours: 3, grade: "A", semester: "6th", instructor: "Dr. Bilal Awan" },
    { code: "EE-402", name: "Embedded Systems", creditHours: 3, grade: "A-", semester: "6th", instructor: "Mr. Usman Ali" },
  ],
};

export const DEMO_MARKSHEETS: Record<string, Marksheet[]> = {
  "CS-2021-001": [
    {
      semester: "5th",
      year: "Spring 2023",
      gpa: 3.5,
      courses: [
        { name: "Data Structures & Algorithms", marks: 87, total: 100, grade: "A" },
        { name: "Database Management Systems", marks: 83, total: 100, grade: "A-" },
        { name: "Operating Systems", marks: 79, total: 100, grade: "B+" },
        { name: "Computer Networks", marks: 90, total: 100, grade: "A" },
        { name: "Software Engineering", marks: 78, total: 100, grade: "B+" },
      ],
    },
    {
      semester: "6th",
      year: "Fall 2023",
      gpa: 3.6,
      courses: [
        { name: "Artificial Intelligence", marks: 85, total: 100, grade: "A-" },
        { name: "Machine Learning", marks: 91, total: 100, grade: "A" },
        { name: "Web Technologies", marks: 92, total: 100, grade: "A" },
        { name: "Mobile App Development", marks: 80, total: 100, grade: "B+" },
        { name: "Compiler Construction", marks: 74, total: 100, grade: "B" },
      ],
    },
  ],
  "EE-2020-045": [
    {
      semester: "7th",
      year: "Spring 2024",
      gpa: 3.72,
      courses: [
        { name: "Power Electronics", marks: 85, total: 100, grade: "A-" },
        { name: "Signals & Systems", marks: 92, total: 100, grade: "A" },
        { name: "Control Systems", marks: 80, total: 100, grade: "B+" },
        { name: "Digital Signal Processing", marks: 91, total: 100, grade: "A" },
        { name: "Embedded Systems", marks: 85, total: 100, grade: "A-" },
      ],
    },
  ],
};

export const TIMETABLES: Record<string, TimetableEntry[]> = {
  "CS-A": [
    { day: "Monday", time: "08:00 - 09:00", subject: "Artificial Intelligence", teacher: "Dr. Imran Shah", room: "CS-101", type: "Lecture" },
    { day: "Monday", time: "09:00 - 10:00", subject: "Machine Learning", teacher: "Dr. Farhan Baig", room: "CS-Lab-2", type: "Lab" },
    { day: "Monday", time: "11:00 - 12:00", subject: "Web Technologies", teacher: "Ms. Zara Khan", room: "CS-202", type: "Lecture" },
    { day: "Tuesday", time: "08:00 - 09:00", subject: "Mobile App Development", teacher: "Mr. Hassan Raza", room: "CS-Lab-1", type: "Lab" },
    { day: "Tuesday", time: "10:00 - 11:00", subject: "Compiler Construction", teacher: "Dr. Kamran Iqbal", room: "CS-301", type: "Lecture" },
    { day: "Wednesday", time: "08:00 - 09:00", subject: "Artificial Intelligence", teacher: "Dr. Imran Shah", room: "CS-101", type: "Tutorial" },
    { day: "Wednesday", time: "10:00 - 11:00", subject: "Machine Learning", teacher: "Dr. Farhan Baig", room: "CS-202", type: "Lecture" },
    { day: "Thursday", time: "09:00 - 10:00", subject: "Web Technologies", teacher: "Ms. Zara Khan", room: "CS-Lab-3", type: "Lab" },
    { day: "Thursday", time: "11:00 - 12:00", subject: "Mobile App Development", teacher: "Mr. Hassan Raza", room: "CS-301", type: "Lecture" },
    { day: "Friday", time: "08:00 - 09:00", subject: "Compiler Construction", teacher: "Dr. Kamran Iqbal", room: "CS-101", type: "Tutorial" },
    { day: "Friday", time: "10:00 - 12:00", subject: "Seminar / Extra Class", teacher: "HOD", room: "Seminar Hall", type: "Seminar" },
  ],
  "EE-B": [
    { day: "Monday", time: "08:00 - 09:00", subject: "Digital Signal Processing", teacher: "Dr. Bilal Awan", room: "EE-101", type: "Lecture" },
    { day: "Monday", time: "10:00 - 11:00", subject: "Embedded Systems", teacher: "Mr. Usman Ali", room: "EE-Lab-1", type: "Lab" },
    { day: "Tuesday", time: "09:00 - 10:00", subject: "Power Systems", teacher: "Prof. Amjad Hussain", room: "EE-201", type: "Lecture" },
    { day: "Wednesday", time: "08:00 - 09:00", subject: "Digital Signal Processing", teacher: "Dr. Bilal Awan", room: "EE-Lab-2", type: "Lab" },
    { day: "Thursday", time: "09:00 - 10:00", subject: "Embedded Systems", teacher: "Mr. Usman Ali", room: "EE-201", type: "Lecture" },
    { day: "Friday", time: "08:00 - 10:00", subject: "Power Systems", teacher: "Prof. Amjad Hussain", room: "EE-Lab-1", type: "Lab" },
  ],
};

export const DEMO_LEAVE_REQUESTS: Record<string, LeaveRequest[]> = {
  "CS-2021-001": [
    {
      id: "LR001",
      startDate: "2024-11-15",
      endDate: "2024-11-17",
      reason: "Family medical emergency - Father was hospitalized.",
      status: "Approved",
      submittedAt: "2024-11-14",
    },
    {
      id: "LR002",
      startDate: "2024-12-10",
      endDate: "2024-12-10",
      reason: "Medical appointment - Dental treatment scheduled.",
      status: "Pending",
      submittedAt: "2024-12-08",
    },
  ],
  "EE-2020-045": [],
};

export const EXAM_COURSES: Record<string, string[]> = {
  "CS-2021-001": [
    "Artificial Intelligence (CS-401)",
    "Machine Learning (CS-402)",
    "Web Technologies (CS-403)",
    "Mobile App Development (CS-404)",
    "Compiler Construction (CS-405)",
  ],
  "EE-2020-045": [
    "Final Year Project (EE-501)",
    "Digital Signal Processing (EE-401)",
    "Embedded Systems (EE-402)",
  ],
};
