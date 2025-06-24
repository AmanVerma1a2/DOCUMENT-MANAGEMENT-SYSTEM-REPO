import React, { useEffect, useState } from 'react';

export default function History() {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/documents', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to fetch documents');
        }
        return res.json();
      })
      .then(docs => {
        setDocs(docs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Network error');
        setLoading(false);
      });
  }, []);

  return (
    <section>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Upload History</h2>
      <div style={{ color: '#888', marginBottom: 24 }}>All uploaded documents with their upload dates</div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#e53e3e', marginBottom: 16 }}>{error}</div>}
      {docs.length === 0 && !loading && !error && (
        <div style={{ color: '#888', fontSize: 18, marginTop: 32 }}>No upload history found.</div>
      )}
      {docs.length > 0 && (
        <div className="table-responsive" style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#ede9fe' }}>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#7c3aed' }}>#</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#7c3aed' }}>Document Name</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#7c3aed' }}>Size</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#7c3aed' }}>Upload Date</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#7c3aed' }}>Upload Time</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, idx) => {
                let uploadDate = '--';
                let uploadTime = '--';
                if (doc.uploadedAt) {
                  const dateObj = new Date(doc.uploadedAt);
                  uploadDate = dateObj.toLocaleDateString();
                  uploadTime = dateObj.toLocaleTimeString();
                }
                return (
                  <tr key={doc._id} style={{ borderBottom: '1px solid #a78bfa', background: idx % 2 === 0 ? '#f5f3ff' : '#fff' }}>
                    <td style={{ padding: 10, color: '#7c3aed' }}>{idx + 1}</td>
                    <td style={{ padding: 10 }}>{doc.name}</td>
                    <td style={{ padding: 10 }}>{doc.size ? (doc.size / 1024).toFixed(2) + ' KB' : '--'}</td>
                    <td style={{ padding: 10 }}>{uploadDate}</td>
                    <td style={{ padding: 10 }}>{uploadTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}