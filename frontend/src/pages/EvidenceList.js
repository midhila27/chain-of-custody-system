import React, { useEffect, useState } from 'react';
import { getAllEvidence, getAllCustody, checkTamper } from '../api/api';
import { toast } from 'react-toastify';

export default function EvidenceList() {
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');
  const canVerify = ['FORENSIC_OFFICER', 'ADMIN'].includes(officer.role);

  const [list, setList]       = useState([]);
  const [custody, setCustody] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => { load(); }, []);

  const load = () => {
    Promise.all([
      getAllEvidence().catch(() => ({ data: [] })),
      getAllCustody().catch(() => ({ data: [] })),
    ]).then(([ev, cu]) => {
      setList(ev.data);
      setCustody(cu.data);
    }).finally(() => setLoading(false));
  };

  const handleCheck = async (id) => {
    try {
      const res = await checkTamper(id, officer.fullName, officer.badgeNumber);
      if (res.data.status === 'TAMPERED') {
        toast.error(`⚠️ Tampered — Detected by: ${res.data.tamperedBy}`);
      } else {
        toast.success('✅ File integrity verified — Intact');
      }
      load();
    } catch {
      toast.error('Check failed. Is the evidence service running?');
    }
  };

  const toggleExpand = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  // Find custody transfers for an evidence ID that fall within the
  // window between upload time and the time tampering was detected.
  // These are the officers who had custody and are "suspects".
  const getSuspectWindow = (ev) => {
    if (!ev.tamperedAt) return [];
    const start = new Date(ev.uploadedAt).getTime();
    const end   = new Date(ev.tamperedAt).getTime();

    return custody
      .filter(c => String(c.evidenceId) === String(ev.id))
      .filter(c => {
        const t = new Date(c.transferTime).getTime();
        return t >= start && t <= end;
      })
      .sort((a, b) => new Date(a.transferTime) - new Date(b.transferTime));
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">🗂️ Evidence Registry</div>
        <h1 className="page-title">All Evidence Files</h1>
        <p className="page-sub">Review, verify, and manage all logged evidence records</p>
      </div>

      {/* Verification identity bar — only shown to roles that can verify */}
      {canVerify && (
        <div className="card" style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
          border: '1px solid #dbeafe',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                🔍 Tamper Verification
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Verifying as <b>{officer.fullName}</b> ({officer.badgeNumber})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Loading evidence records...
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No evidence on record</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {['ID', 'Case ID', 'Type', 'Officer', 'Badge', 'Date', 'Status', ...(canVerify ? ['Action'] : [])].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(ev => {
                const isTampered  = ev.status === 'TAMPERED';
                const isExpanded  = expanded[ev.id];
                const suspects    = isTampered ? getSuspectWindow(ev) : [];

                return (
                  <React.Fragment key={ev.id}>
                    <tr className={isTampered ? 'row-tampered' : ''}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>#{ev.id}</td>
                      <td style={{ fontWeight: '600' }}>{ev.caseId}</td>
                      <td>
                        <span className={`badge ${ev.evidenceType === 'VIDEO' ? 'badge-amber' : 'badge-blue'}`}>
                          {ev.evidenceType === 'VIDEO' ? '🎥' : '📷'} {ev.evidenceType}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500' }}>{ev.uploadedBy}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{ev.uploadedByBadge}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        {ev.uploadedAt?.replace('T', ' ').substring(0, 16)}
                      </td>
                      <td>
                        <span
                          className={`badge ${isTampered ? 'badge-red' : 'badge-green'}`}
                          style={isTampered ? { cursor: 'pointer' } : {}}
                          onClick={isTampered ? () => toggleExpand(ev.id) : undefined}
                        >
                          {isTampered ? `⚠ Tampered ${isExpanded ? '▲' : '▼'}` : '✓ Intact'}
                        </span>
                      </td>
                      {canVerify && (
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleCheck(ev.id)}
                          >
                            Verify
                          </button>
                        </td>
                      )}
                    </tr>

                    {/* Suspect Window — expandable row */}
                    {isTampered && isExpanded && (
                      <tr>
                        <td colSpan={canVerify ? 8 : 7} style={{ padding: 0, background: '#fef2f2' }}>
                          <div style={{ padding: '20px 24px', borderLeft: '4px solid #ef4444' }}>

                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
                              🕵️ Suspect Window
                            </div>
                            <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '14px' }}>
                              Evidence was verified intact at upload (<b>{ev.uploadedAt?.replace('T',' ').substring(0,16)}</b>) and
                              found tampered at (<b>{ev.tamperedAt?.replace('T',' ').substring(0,16)}</b>).
                              The officers below had custody during this window — they should be investigated first.
                            </div>

                            {suspects.length === 0 ? (
                              <div style={{
                                background: '#fff', border: '1px solid #fecaca',
                                borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#7f1d1d'
                              }}>
                                ⚠️ No custody transfer records found during this window.
                                This means tampering occurred while evidence was with the
                                <b> original uploader ({ev.uploadedBy} / {ev.uploadedByBadge})</b>,
                                or before any transfer was logged.
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {suspects.map((s, i) => (
                                  <div key={s.id} style={{
                                    background: '#fff', border: '1px solid #fecaca',
                                    borderRadius: '8px', padding: '12px 16px',
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                  }}>
                                    <div style={{
                                      width: '26px', height: '26px', borderRadius: '50%',
                                      background: '#dc2626', color: '#fff', fontSize: '12px',
                                      fontWeight: '700', display: 'flex', alignItems: 'center',
                                      justifyContent: 'center', flexShrink: 0,
                                    }}>
                                      {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '13px', fontWeight: '600' }}>
                                        {s.fromOfficer} ({s.fromBadge}) → {s.toOfficer} ({s.toBadge})
                                      </div>
                                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        Transferred at {s.transferTime?.replace('T',' ').substring(0,16)}
                                        {s.transferLocation && ` · ${s.transferLocation}`}
                                        {s.purpose && ` · ${s.purpose}`}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}