import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [totalDocs, setTotalDocs] = useState('--');
  const [totalSize, setTotalSize] = useState('--');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/documents', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(docs => {
        setTotalDocs(docs.length);
        const bytes = docs.reduce((sum, doc) => sum + (doc.size || 0), 0);
        setTotalSize(bytesToSize(bytes));
      })
      .catch(() => {
        setTotalDocs('--');
        setTotalSize('--');
      });
  }, []);

  function bytesToSize(bytes) {
    if (!bytes || bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <section>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Dashboard</h2>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 220, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontSize: 18, color: '#667eea' }}>Total Documents</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalDocs}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 220, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontSize: 18, color: '#764ba2' }}>Total Uploaded Size</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalSize}</div>
        </div>
      </div>
    </section>
  );
}