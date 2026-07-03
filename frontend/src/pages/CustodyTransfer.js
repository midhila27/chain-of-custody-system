import React, { useState } from 'react';
import { transferCustody } from '../api/api';
import { toast } from 'react-toastify';

const Field = ({ name, label, placeholder, onChange, required, value }) => (
  <div style={{ marginBottom: '16px' }}>
    <label className="form-label">
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input
      className="form-input"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default function CustodyTransfer() {
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');

  const [form, setForm] = useState({
    evidenceId: '', caseId: '',
    toOfficer: '',   toBadge: '',
    location: '', purpose: '', signature: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        fromOfficer: officer.fullName,
        fromBadge: officer.badgeNumber,
      };
      const res = await transferCustody(payload);
      setResult(res.data);
      toast.success('✅ Custody transfer recorded successfully.');
    } catch {
      toast.error('Transfer failed. Is port 8082 running?');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">🔗 Custody Chain</div>
        <h1 className="page-title">Transfer Custody</h1>
        <p className="page-sub">Record a formal chain-of-custody transfer between officers</p>
      </div>

      <div style={{ maxWidth: '820px' }}>
        <div className="card card-lg">

          {/* Evidence Reference */}
          <p className="section-title">Evidence Reference</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>
            <Field name="evidenceId" label="Evidence ID"   placeholder="e.g. 1"        value={form.evidenceId} onChange={handleChange} required />
            <Field name="caseId"     label="Case ID"       placeholder="e.g. CASE-001" value={form.caseId}     onChange={handleChange} required />
          </div>

          {/* Officers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '24px 0' }}>
            {/* From — auto-filled, read-only */}
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius)',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '16px', fontWeight: '700', fontSize: '13px', color: '#dc2626',
              }}>
                ↑ Transferring From
              </div>
              <div style={{ marginBottom: '4px' }}>
                <div style={{ fontSize: '11px', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                  Officer Name
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {officer.fullName || 'Unknown'}
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                  Badge Number
                </div>
                <div style={{ fontSize: '14px', fontFamily: "'Courier New', monospace", color: 'var(--text-primary)' }}>
                  {officer.badgeNumber || '—'}
                </div>
              </div>
            </div>

            {/* To — still editable, you choose the recipient */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius)',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '16px', fontWeight: '700', fontSize: '13px', color: '#059669',
              }}>
                ↓ Transferring To
              </div>
              <Field name="toOfficer" label="Officer Name" placeholder="Full Name" value={form.toOfficer} onChange={handleChange} />
              <Field name="toBadge"   label="Badge Number" placeholder="Badge #"   value={form.toBadge}   onChange={handleChange} />
            </div>
          </div>

          {/* Transfer Details */}
          <p className="section-title">Transfer Details</p>
          <Field name="location"  label="Transfer Location" placeholder="e.g. District Forensics Lab"  value={form.location}  onChange={handleChange} />
          <Field name="purpose"   label="Purpose"           placeholder="e.g. Forensic Analysis"        value={form.purpose}   onChange={handleChange} />
          <Field name="signature" label="Acknowledgment"    placeholder="Officer acknowledgment note"   value={form.signature} onChange={handleChange} />

          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            style={{ width: '100%', marginTop: '8px' }}
          >
            🔗 Record Custody Transfer
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="card" style={{
            marginTop: '20px',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '0 var(--radius) var(--radius) 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>
                Transfer Recorded Successfully
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                ['Record ID',   `#${result.id}`],
                ['Transfer Time', result.transferTime?.replace('T', ' ').substring(0, 16)],
                ['From',        `${result.fromOfficer} (${result.fromBadge})`],
                ['To',          `${result.toOfficer} (${result.toBadge})`],
                ['IP Address',  result.ipAddress],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    {k}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}