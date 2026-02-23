import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PreferencesProvider } from './shared/context/PreferencesContext';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import WorkspaceModule from './modules/workspace/WorkspaceModule';
import AdminModule from './modules/admin/AdminModule';
import Layout from './components/Layout';
import Login from './pages/Login';
import LoggedOut from './pages/LoggedOut';

const ProtectedRoute = ({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && !user?.roles?.includes('admin')) {
    return <Navigate to="/workspace" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/workspace" replace /> : <Login />} />
      <Route path="/logged-out" element={<LoggedOut />} />
      <Route 
        path="/workspace/*" 
        element={
          <ProtectedRoute>
            <Layout><WorkspaceModule /></Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requireAdmin>
            <Layout><AdminModule /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/workspace" replace />} />
      <Route path="*" element={<Navigate to="/workspace" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
          <AppRoutes />
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
