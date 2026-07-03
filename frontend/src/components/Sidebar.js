import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');
  const role = officer.role || 'OFFICER';

  const ALL_LINKS = [
    { path:'/',         label:'Dashboard',        icon:'⬛', roles:['OFFICER','INVESTIGATOR','FORENSIC_OFFICER','ADMIN'] },
    { path:'/upload',   label:'Upload Evidence',  icon:'⬆', roles:['OFFICER','ADMIN'] },
    { path:'/evidence', label:'Evidence',         icon:'▦', roles:['INVESTIGATOR','FORENSIC_OFFICER','ADMIN'] },
    { path:'/custody',  label:'Chain of Custody', icon:'⇄', roles:['OFFICER','INVESTIGATOR','ADMIN'] },
    { path:'/audit',    label:'Audit Logs',       icon:'≡', roles:['ADMIN'] },
    { path:'/users',    label:'Users',            icon:'👤', roles:['ADMIN'] },
  ];

  const NAV_LINKS = ALL_LINKS.filter(link => link.roles.includes(role));

  const roleColor = {
    ADMIN:            '#f87171',
    INVESTIGATOR:     '#fbbf24',
    OFFICER:          '#34d399',
    FORENSIC_OFFICER: '#a78bfa',
  };

  const initials = officer.fullName
    ? officer.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'OF';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('officer');
    navigate('/login');
  };

  return (
    <aside style={{
      width: '230px', minWidth: '230px',
      background: 'var(--bg-sidebar)',
      height: '100vh', position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Brand */}
      <div style={{ padding: '22px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', flexShrink: 0,
        }}>🔒</div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.2px' }}>
            Chain of Custody
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b' }}>Management System</div>
        </div>
      </div>

      {/* Officer card */}
      <div style={{
        margin: '4px 16px 16px', padding: '12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0,
        }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {officer.fullName || 'Officer'}
          </div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: roleColor[role] || '#34d399' }}>
            {role?.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_LINKS.map(link => {
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.path} to={link.path} style={{
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '10px 14px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '13.5px',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#f1f5f9' : '#94a3b8',
              background: isActive ? 'rgba(59,130,246,0.18)' : 'transparent',
              borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Status + Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '12px', color: '#10b981' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
          System Secure
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '9px',
          background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
          color: '#94a3b8', borderRadius: '8px', fontSize: '12.5px',
          fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.15)'; e.target.style.color = '#f87171'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#94a3b8'; }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}