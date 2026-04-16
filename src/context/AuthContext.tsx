import React, { createContext, useContext, useState, useEffect } from "react";
import type { Student } from "../lib/data";
import { getCurrentStudent, logout as doLogout } from "../lib/auth";

interface AuthContextType {
  student: Student | null;
  setStudent: (s: Student | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  student: null,
  setStudent: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(getCurrentStudent);

  const logout = () => {
    doLogout();
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ student, setStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
