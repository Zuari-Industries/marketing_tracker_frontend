// FILE: src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet,useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ForgotPassword from "./pages/ForgotPassword";
import Sidebar from './components/Sidebar';
import LoginScreen from './pages/LoginScreen';
import Dashboard from './pages/Dashboard';
import AllRequestsPage from './pages/AllRequestsPage';
import TeamWorkloadPage from './pages/TeamWorkloadPage'; 
import GanttOverviewPage from './pages/GanttOverviewPage';
import UserManagementPage from './pages/UserManagementPage';
import FormConfigurationPage from './pages/FormConfigurationPage';
import DataImportExportPage from './pages/DataImportExportPage';
import CreateTaskPage from './pages/CreateTaskPage'; 
import ResetPassword from './pages/ResetPassword';
import SubtaskTemplatesPage from './pages/SubtaskTemplatesPage';


const AppLayout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <div className="bg-gray-950 h-screen flex items-center justify-center text-white">Loading Application...</div>;
    }
    return (
        <div className="flex bg-gray-950 h-screen overflow-hidden">
            <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="bg-gray-950 h-screen flex items-center justify-center text-white">
        Loading Application...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const AuthLayout = () => {
    return <Outlet />;
};

function App() {
    const { user } = useAuth();
    return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="requests" element={<AllRequestsPage />} />
        <Route path="create-task" element={<CreateTaskPage />} />
       <Route path="workload" element={<TeamWorkloadPage />} />
        <Route path="gantt" element={<GanttOverviewPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="form-config" element={<FormConfigurationPage />} />
        <Route path="data-import" element={<DataImportExportPage />} />
      
        <Route path="/subtask-templates" element={<SubtaskTemplatesPage />} />

       <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
 );
}

export default App;