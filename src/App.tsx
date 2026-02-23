import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PreferencesProvider } from './shared/context/PreferencesContext';
import { AuthProvider } from './shared/context/AuthContext';
import WorkspaceModule from './modules/workspace/WorkspaceModule';
import AdminModule from './modules/admin/AdminModule';
import Layout from './components/Layout';
import Landing from './pages/Landing';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/workspace/*" 
              element={<Layout><WorkspaceModule /></Layout>}
            />
            <Route 
              path="/admin/*" 
              element={<Layout><AdminModule /></Layout>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
