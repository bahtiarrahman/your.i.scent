import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminState {
  isLoggedIn: boolean;
}

interface AuthContextType {
  admin: AdminState;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'onlymin';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminState>(() => {
    try {
      const stored = localStorage.getItem('youri_admin');
      return stored ? JSON.parse(stored) : { isLoggedIn: false };
    } catch { return { isLoggedIn: false }; }
  });

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const s = { isLoggedIn: true };
      setAdmin(s);
      localStorage.setItem('youri_admin', JSON.stringify(s));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdmin({ isLoggedIn: false });
    localStorage.removeItem('youri_admin');
  };

  return (
    <AuthContext.Provider value={{ admin, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}