import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [badge, setBadge]     = useState('');
  const [password, setPass]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleLogin = async () => {
    if (!badge || !password) {
      toast.error('Enter badge number and password!'); return;
    }
    setLoading(true);
    try {
      const res = await loginUser(badge, password);
      localStorage.setItem('officer', JSON.stringify(res.data));
      localStorage.setItem('isLoggedIn', 'true');
      toast.success(`Welcome, ${res.data.fullName}!`);
      navigate('/');
    } catch {
      toast.error('Invalid badge or password!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: '#ffffff',
        padding: '44px 40px',
        borderRadius: '18px',
        width: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
          }}>
            <span style={{ fontSize: '26px' }}> </span>
          </div>
          <h2 style={{ color: '#0f172a', margin: 0, fontSize: '21px', fontWeight: '800' }}>
            Chain of Custody
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
            Digital Evidence Management System
          </p>
        </div>

        {/* Form */}
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
          Badge Number
        </label>
        <input
          className="form-input"
          style={{ marginBottom: '18px' }}
          placeholder="e.g. TN-PD-4521"
          value={badge}
          onChange={e => setBadge(e.target.value)}
        />

        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
          Password
        </label>
        <input
          className="form-input"
          style={{ marginBottom: '22px' }}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <button
          className="btn btn-primary btn-lg"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? '⏳ Logging in...' : '🔓 Login'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '22px', color: '#64748b', fontSize: '13px' }}>
          {"Don't have an account? "}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}