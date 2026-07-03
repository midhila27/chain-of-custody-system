import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UploadEvidence from './pages/UploadEvidence';
import EvidenceList from './pages/EvidenceList';
import CustodyTransfer from './pages/CustodyTransfer';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import './App.css';

function Protected({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
}

function RoleProtected({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');

  if (!isLoggedIn) return <Navigate to="/login" />;

  if (!allowedRoles.includes(officer.role)) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', color: 'var(--text-primary)'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚫</div>
        <h2 style={{ color: '#ef4444' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Your role ({officer.role}) cannot access this page.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Required: {allowedRoles.join(' or ')}
        </p>
      </div>
    );
  }
  return children;
}

function Layout() {
  const location  = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const hideSidebar =
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {isLoggedIn && !hideSidebar && <Sidebar />}
      <main className="main-content" style={{ flex: 1, margin: 0 }}>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* All roles */}
          <Route path="/" element={
            <Protected><Dashboard /></Protected>
          }/>

          {/* Officer + Admin only — upload */}
          <Route path="/upload" element={
            <RoleProtected allowedRoles={['OFFICER','ADMIN']}>
              <UploadEvidence />
            </RoleProtected>
          }/>

          {/* Investigator + Forensic + Admin — view evidence */}
          <Route path="/evidence" element={
            <RoleProtected allowedRoles={['INVESTIGATOR','FORENSIC_OFFICER','ADMIN']}>
              <EvidenceList />
            </RoleProtected>
          }/>

          {/* Officer + Investigator + Admin — transfer custody */}
          <Route path="/custody" element={
            <RoleProtected allowedRoles={['OFFICER','INVESTIGATOR','ADMIN']}>
              <CustodyTransfer />
            </RoleProtected>
          }/>

          {/* Admin only — audit logs */}
          <Route path="/audit" element={
            <RoleProtected allowedRoles={['ADMIN']}>
              <AuditLogs />
            </RoleProtected>
          }/>

          {/* Admin only — user management */}
          <Route path="/users" element={
            <RoleProtected allowedRoles={['ADMIN']}>
              <Users />
            </RoleProtected>
          }/>
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        theme="colored"
        toastStyle={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          borderRadius: '10px'
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;