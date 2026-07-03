import React, { useEffect, useState } from 'react';
import { getAllEvidence, getAllCustody, getAllUsers } from '../api/api';

const STAT_CONFIG = [
  { key: 'total',     label: 'Total Evidence',  icon: '🗂️', color: '#3b82f6', bg: '#eff6ff' },
  { key: 'active',    label: 'Active',          icon: '✓',  color: '#10b981', bg: '#f0fdf4' },
  { key: 'tampered',  label: 'Tamper Alerts',   icon: '⚠️', color: '#ef4444', bg: '#fef2f2' },
  { key: 'transfers', label: 'Total Transfers', icon: '⇄',  color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'users',     label: 'Active Users',    icon: '👤', color: '#06b6d4', bg: '#ecfeff' },
];

// Simple SVG donut chart — no external library needed
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 70, cx = 90, cy = 90, stroke = 26;
  let angleStart = -90;

  const arc = (value, color, key) => {
    const angle = (value / total) * 360;
    const angleEnd = angleStart + angle;
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = cx + radius * Math.cos((Math.PI * angleStart) / 180);
    const y1 = cy + radius * Math.sin((Math.PI * angleStart) / 180);
    const x2 = cx + radius * Math.cos((Math.PI * angleEnd) / 180);
    const y2 = cy + radius * Math.sin((Math.PI * angleEnd) / 180);
    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
    angleStart = angleEnd;
    if (value === 0) return null;
    return <path key={key} d={path} fill="none" stroke={color} strokeWidth={stroke} />;
  };

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      {data.map(d => arc(d.value, d.color, d.label))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--text-primary)">{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--text-muted)">Total</text>
    </svg>
  );
}

export default function Dashboard() {
  const [evidence, setEvidence] = useState([]);
  const [custody, setCustody]   = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getAllEvidence().catch(() => ({ data: [] })),
      getAllCustody().catch(() => ({ data: [] })),
      getAllUsers().catch(() => ({ data: [] })),
    ]).then(([ev, cu, us]) => {
      setEvidence(ev.data);
      setCustody(cu.data);
      setUsers(us.data);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    total:     evidence.length,
    active:    evidence.filter(e => e.status === 'ACTIVE').length,
    tampered:  evidence.filter(e => e.status === 'TAMPERED').length,
    transfers: custody.length,
    users:     users.filter(u => u.status === 'ACTIVE').length || users.length,
  };

  const donutData = [
    { label: 'Active',   value: stats.active,                                          color: '#3b82f6' },
    { label: 'Photo',    value: evidence.filter(e => e.evidenceType === 'PHOTO' && e.status !== 'TAMPERED').length, color: '#10b981' },
    { label: 'Video',    value: evidence.filter(e => e.evidenceType === 'VIDEO' && e.status !== 'TAMPERED').length, color: '#f59e0b' },
    { label: 'Tampered', value: stats.tampered,                                         color: '#ef4444' },
  ];

  const tamperedItems = evidence.filter(e => e.status === 'TAMPERED').slice(-5).reverse();
  const recentEvidence = [...evidence].slice(-6).reverse();
  const recentTransfers = [...custody].slice(-6).reverse();

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">🏛️ Law Enforcement System</div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Real-time evidence monitoring and integrity tracking</p>
      </div>

      {/* Stat cards row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {STAT_CONFIG.map(cfg => (
          <div key={cfg.key} className="stat-card">
            <div className="stat-card-accent" style={{ background: cfg.color }} />
            <div className="stat-icon" style={{ background: cfg.bg }}>{cfg.icon}</div>
            <div className="stat-value" style={{ color: cfg.color, fontSize: '28px' }}>
              {loading ? '—' : stats[cfg.key]}
            </div>
            <div className="stat-label">{cfg.label}</div>
          </div>
        ))}
      </div>

      {/* Donut chart + Tamper alerts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', marginBottom: '28px' }}>

        {/* Donut chart card */}
        <div className="card">
          <p className="section-title">Evidence by Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <DonutChart data={donutData} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {donutData.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{d.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', marginLeft: 'auto' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent tamper alerts table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 0' }}>
            <p className="section-title">Recent Tamper Alerts</p>
          </div>
          {tamperedItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✓</div>
              <div className="empty-state-text">No tamper alerts — all evidence intact</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>Evidence ID</th><th>Status</th><th>Detected By</th><th>Detected On</th></tr>
              </thead>
              <tbody>
                {tamperedItems.map(e => (
                  <tr key={e.id}>
                    <td style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>EV-{e.id}</td>
                    <td><span className="badge badge-red">⚠ Tampered</span></td>
                    <td>{e.tamperedBy?.split('|')[0]?.trim() || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {e.tamperedAt?.replace('T', ' ').substring(0, 16)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Evidence + Recent Transfers — 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        <div>
          <p className="section-title">Recent Evidence</p>
          <div className="table-wrap">
            {recentEvidence.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📁</div>
                <div className="empty-state-text">No evidence uploaded yet</div>
              </div>
            ) : (
              <table>
                <thead><tr><th>ID</th><th>Type</th><th>Status</th><th>Uploaded</th></tr></thead>
                <tbody>
                  {recentEvidence.map(ev => (
                    <tr key={ev.id} className={ev.status === 'TAMPERED' ? 'row-tampered' : ''}>
                      <td style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>EV-{ev.id}</td>
                      <td>{ev.evidenceType === 'VIDEO' ? '🎥' : '📷'} {ev.evidenceType}</td>
                      <td>
                        <span className={`badge ${ev.status === 'TAMPERED' ? 'badge-red' : 'badge-green'}`}>
                          {ev.status === 'TAMPERED' ? '⚠ Tampered' : '✓ Active'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        {ev.uploadedAt?.replace('T', ' ').substring(0, 16)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <p className="section-title">Recent Transfers</p>
          <div className="table-wrap">
            {recentTransfers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">⇄</div>
                <div className="empty-state-text">No custody transfers yet</div>
              </div>
            ) : (
              <table>
                <thead><tr><th>Evidence ID</th><th>From</th><th>To</th><th>Date</th></tr></thead>
                <tbody>
                  {recentTransfers.map(c => (
                    <tr key={c.id}>
                      <td style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>{c.evidenceId}</td>
                      <td>{c.fromOfficer}</td>
                      <td>{c.toOfficer}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        {c.transferTime?.replace('T', ' ').substring(0, 16)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}