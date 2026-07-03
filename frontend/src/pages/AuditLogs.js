import React, { useEffect, useState } from 'react';
import { getAllAudit, getTamperAlerts } from '../api/api';
 
export default function AuditLogs() {
  const [logs, setLogs]       = useState([]);
  const [alerts, setAlerts]   = useState([]);
  const [tab, setTab]         = useState('all');
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    Promise.all([
      getAllAudit().then(r => setLogs(r.data)).catch(() => {}),
      getTamperAlerts().then(r => setAlerts(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);
 
  const display = tab === 'tamper' ? alerts : logs;
 
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">📋 System Audit</div>
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-sub">Full history of all system actions and tamper detection events</p>
      </div>
 
      {/* Summary chips */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px' }}>
          <span style={{ fontSize: '18px' }}>📋</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{logs.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Logs</div>
          </div>
        </div>
        <div className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px', background: alerts.length > 0 ? '#fef2f2' : undefined, borderColor: alerts.length > 0 ? '#fecaca' : undefined }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: alerts.length > 0 ? '#dc2626' : 'var(--text-primary)' }}>{alerts.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tamper Alerts</div>
          </div>
        </div>
      </div>
 
      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
          All Logs
        </button>
        <button className={`tab-btn ${tab === 'tamper' ? 'active' : ''}`} onClick={() => setTab('tamper')}>
          ⚠️ Tamper Alerts {alerts.length > 0 && `(${alerts.length})`}
        </button>
      </div>
 
      {/* Table */}
      <div className="table-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Loading audit records...
          </div>
        ) : display.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No log entries found</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {['ID', 'Action', 'Performed By', 'Badge', 'IP Address', 'Evidence', 'Case', 'Timestamp'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {display.map((log, i) => (
                <tr key={log.id} className={log.action === 'TAMPER_DETECTED' ? 'row-tampered' : ''}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>#{log.id}</td>
                  <td>
                    <span className={`badge ${log.action === 'TAMPER_DETECTED' ? 'badge-red' : 'badge-green'}`}>
                      {log.action === 'TAMPER_DETECTED' ? '⚠ Tamper' : '✓ ' + log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500' }}>{log.performedBy}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{log.badgeNumber}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{log.ipAddress}</td>
                  <td>
                    <span className="badge badge-blue">#{log.evidenceId}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{log.caseId}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {log.timestamp?.replace('T', ' ').substring(0, 16)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}