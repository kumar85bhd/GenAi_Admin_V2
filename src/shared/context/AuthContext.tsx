import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Define mock user once to avoid duplication
  const MOCK_USER: User = {
    id: '1',
    name: 'Test User',
    email: 'test_user@company.com',
    roles: ['user', 'admin'] // Initial role, admin resolved by backend
  };

  useEffect(() => {
    // Mock user for development - synced with backend mock strategy
    setUser(MOCK_USER);
  }, []);

  const login = () => {
    // Mock login - synced with backend mock strategy
    setUser(MOCK_USER);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
