import React, { useState } from 'react';
import { uploadEvidence } from '../api/api';
import { toast } from 'react-toastify';

export default function UploadEvidence() {
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');

  const [form, setForm] = useState({
    caseId: '', location: '', description: ''
  });
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [fileType, setFileType] = useState('');
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setFileType(f.type.startsWith('video') ? 'video' : 'image');
  };

  const handleSubmit = async () => {
    if (!file) { toast.error('Please select a file first.'); return; }
    if (!form.caseId) {
      toast.error('Case ID is required.'); return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('caseId', form.caseId);
    fd.append('uploadedBy', officer.fullName);
    fd.append('badge', officer.badgeNumber);
    fd.append('location', form.location);
    fd.append('description', form.description);
    try {
      const res = await uploadEvidence(fd);
      setResult(res.data);
      toast.success('Evidence uploaded and hashed successfully!');
    } catch {
      toast.error('Upload failed. Is port 8081 running?');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">📤 Evidence Intake</div>
        <h1 className="page-title">Upload Evidence</h1>
        <p className="page-sub">Submit new evidence files with automatic SHA-256 integrity hashing</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '960px' }}>

        {/* Left — Form */}
        <div className="card card-lg">

          {/* Uploading as — auto-filled from login, read-only */}
          <div style={{
            background: '#16213e', border: '1px solid #334155',
            borderRadius: '8px', padding: '14px 16px', marginBottom: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Uploading As
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9' }}>
                {officer.fullName || 'Unknown Officer'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Badge
              </div>
              <div style={{ fontSize: '14px', fontFamily: "'Courier New', monospace", color: '#60a5fa' }}>
                {officer.badgeNumber || '—'}
              </div>
            </div>
          </div>

          <p className="section-title">Case Information</p>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Case ID <span style={{ color: '#ef4444' }}>*</span></label>
            <input className="form-input" name="caseId" placeholder="e.g. CASE-2024-001" onChange={handleChange} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Location Found</label>
            <input className="form-input" name="location" placeholder="Where was evidence collected?" onChange={handleChange} />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea className="form-input" name="description" placeholder="Describe the evidence..." onChange={handleChange} />
          </div>
        </div>

        {/* Right — File Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card card-lg" style={{ flex: 1 }}>
            <p className="section-title">Evidence File</p>

            <label className="form-label">
              Select Photo or Video <span style={{ color: '#ef4444' }}>*</span>
            </label>

            {/* Drop Zone */}
            <label style={{
              display: 'block',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius)',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f8fafc',
              marginBottom: '16px',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <input type="file" accept="image/*,video/*" onChange={handleFile}
                style={{ display: 'none' }} />
              {!preview ? (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Click to select file
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Photos and videos accepted
                  </div>
                </div>
              ) : (
                <div>
                  {fileType === 'image' && (
                    <img src={preview} alt="preview" style={{
                      maxWidth: '100%', maxHeight: '200px', objectFit: 'cover',
                      borderRadius: '8px', border: '1px solid var(--border)',
                    }} />
                  )}
                  {fileType === 'video' && (
                    <video src={preview} controls style={{
                      maxWidth: '100%', maxHeight: '200px',
                      borderRadius: '8px', border: '1px solid var(--border)',
                    }} />
                  )}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {file?.name}
                  </div>
                </div>
              )}
            </label>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Uploading...' : '🔒 Upload & Hash Evidence'}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card" style={{
          marginTop: '24px',
          maxWidth: '960px',
          borderLeft: '4px solid #10b981',
          borderRadius: '0 var(--radius) var(--radius) 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
              Upload Successful — Hash Recorded
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            {[
              ['Evidence ID', `#${result.id}`],
              ['Case', result.caseId],
              ['Officer', `${result.uploadedBy} (${result.uploadedByBadge})`],
              ['Source IP', result.uploadedByIp],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {k}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              SHA-256 Hash
            </div>
            <code style={{
              display: 'block', padding: '12px 16px',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '8px', fontSize: '13px',
              color: '#059669', wordBreak: 'break-all', lineHeight: 1.8,
              fontFamily: "'Courier New', monospace",
            }}>
              {result.fileHash}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}