import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GCListPage from './pages/GCListPage';
import GCDetailPage from './pages/GCDetailPage';
import SubDetailPage from './pages/SubDetailPage';
import SubOnboardingPage from './pages/SubOnboardingPage';
import AgentVerificationPage from './pages/AgentVerificationPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Consultant routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute requiredRole="consultant"><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/gcs"
              element={<ProtectedRoute requiredRole="consultant"><GCListPage /></ProtectedRoute>}
            />
            <Route
              path="/gcs/:gcId"
              element={<ProtectedRoute requiredRole="consultant"><GCDetailPage /></ProtectedRoute>}
            />
            <Route
              path="/subs/:subId"
              element={<ProtectedRoute requiredRole="consultant"><SubDetailPage /></ProtectedRoute>}
            />
            <Route
              path="/subs/new"
              element={<ProtectedRoute requiredRole="consultant"><SubOnboardingPage /></ProtectedRoute>}
            />

            {/* GC routes */}
            <Route
              path="/gc-dashboard"
              element={<ProtectedRoute requiredRole="general_contractor"><DashboardPage /></ProtectedRoute>}
            />

            {/* Public routes */}
            <Route path="/verify/:tokenId" element={<AgentVerificationPage />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
