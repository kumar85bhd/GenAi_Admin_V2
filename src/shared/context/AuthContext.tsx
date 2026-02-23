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
  authMode: 'login' | 'sso' | null;
  ssoFailed: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'sso' | null>(null);
  const [ssoFailed, setSsoFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const configRes = await fetch('/api/auth/config');
        const configData = await configRes.json();
        setAuthMode(configData.mode);

        const token = localStorage.getItem('access_token');
        if (token) {
          const userRes = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
          } else {
            localStorage.removeItem('access_token');
            if (configData.mode === 'sso') setSsoFailed(true);
          }
        } else {
          if (configData.mode === 'sso') setSsoFailed(true);
        }
      } catch (error) {
        console.error('Auth init failed', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email?: string, password?: string) => {
    if (authMode === 'login') {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      
      const userRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, authMode, ssoFailed, login, logout }}>
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
