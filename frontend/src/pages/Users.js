import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/api';

const roleBadge = {
  ADMIN:            { color: '#dc2626', bg: '#fef2f2', icon: '👑' },
  OFFICER:          { color: '#16a34a', bg: '#dcfce7', icon: '🛡️' },
  INVESTIGATOR:     { color: '#d97706', bg: '#fef3c7', icon: '🔍' },
  FORENSIC_OFFICER: { color: '#7c3aed', bg: '#f5f3ff', icon: '🧪' },
};

export default function Users() {
  const [users, setUsers]     = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.badgeNumber?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">👥 User Management</div>
        <h1 className="page-title">Officers & Personnel</h1>
        <p className="page-sub">All registered users in the Chain of Custody system</p>
      </div>

      {/* Role count cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {Object.entries(roleBadge).map(([role, cfg]) => (
          <div key={role} className="stat-card">
            <div className="stat-card-accent" style={{ background: cfg.color }} />
            <div className="stat-icon" style={{ background: cfg.bg }}>{cfg.icon}</div>
            <div className="stat-value" style={{ color: cfg.color, fontSize: '28px' }}>
              {loading ? '—' : (roleCounts[role] || 0)}
            </div>
            <div className="stat-label">{role.replace('_', ' ')}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card card-sm" style={{ marginBottom: '20px' }}>
        <input
          className="form-input"
          placeholder="Search by name, badge number, or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <div className="empty-state-text">No users found</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Full Name</th><th>Badge</th><th>Role</th>
                <th>Department</th><th>Email</th><th>Status</th><th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const cfg = roleBadge[u.role] || { color: '#64748b', bg: '#f1f5f9', icon: '👤' };
                return (
                  <tr key={u.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>#{u.id}</td>
                    <td style={{ fontWeight: '600' }}>{u.fullName}</td>
                    <td style={{ fontFamily: "'Courier New', monospace", fontSize: '13px' }}>{u.badgeNumber}</td>
                    <td>
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{u.department || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{u.email || '—'}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>
                        {u.status === 'ACTIVE' ? '✓ Active' : '✕ Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {u.lastLoginAt ? u.lastLoginAt.replace('T', ' ').substring(0, 16) : 'Never'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}