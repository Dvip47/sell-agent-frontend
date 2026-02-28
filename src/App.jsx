import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleGuard from './auth/RoleGuard';
import AccountStateGuard from './auth/AccountStateGuard';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/Leads/LeadsList';
import LeadDetail from './pages/Leads/LeadDetail';
import PendingVerification from './pages/PendingVerification';
import Suspended from './pages/Suspended';
import Settings from './pages/Settings';
import ProductSetup from './pages/ProductSetup';
import ProductList from './pages/ProductList';
import MeetingsPage from './pages/MeetingsPage';
import ExecutionLogs from './pages/ExecutionLogs';
import TestHarness from './pages/TestHarness';

import AdminDashboard from './admin/AdminDashboard';
import ClientList from './admin/ClientList';
import ClientDetail from './admin/ClientDetail';

import { ROLES } from './utils/constants';

/**
 * RedirectIfLoggedIn Guard
 * 
 * Prevents authenticated users from seeing public pages (Landing, Login, Register).
 */
function RedirectIfLoggedIn({ children }) {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

/**
 * App Component
 */
function App() {
  useEffect(() => {
    // Sync logout across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' && !e.newValue) {
        window.location.reload();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RedirectIfLoggedIn><Landing /></RedirectIfLoggedIn>} />
        <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
        <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pending-verification" element={<PendingVerification />} />
        <Route path="/suspended" element={<Suspended />} />

        {/* Client Routes (Protected by Auth & Account State) */}
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <ProductList />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup/:productId"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <ProductSetup />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <Dashboard />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <LeadsList />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:leadId"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <LeadDetail />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <Settings />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <ExecutionLogs />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <MeetingsPage />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-harness"
          element={
            <ProtectedRoute>
              <AccountStateGuard allowedStates={['ACTIVE', 'PAUSED']}>
                <TestHarness />
              </AccountStateGuard>
            </ProtectedRoute>
          }
        />

        {/* Super Admin Routes (Protected by Auth & Role) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard roles={[ROLES.SUPER_ADMIN]}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute>
              <RoleGuard roles={[ROLES.SUPER_ADMIN]}>
                <ClientList />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/:clientId"
          element={
            <ProtectedRoute>
              <RoleGuard roles={[ROLES.SUPER_ADMIN]}>
                <ClientDetail />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
