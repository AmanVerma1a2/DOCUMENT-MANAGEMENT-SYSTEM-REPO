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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {docs.map(doc => (
          <div key={doc._id} style={{ background: '#fff', borderRadius: 12, padding: 20, minWidth: 260, boxShadow: '0 2px 8px #0001', position: 'relative' }}>
            <h3 style={{ fontWeight: 600 }}>{doc.name}</h3>
            <div style={{ fontSize: 12, color: '#888', margin: '8px 0' }}>
              Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : '--'}
            </div>
          </div>
        ))}
        {docs.length === 0 && !loading && !error && (
          <div style={{ color: '#888', fontSize: 18, marginTop: 32 }}>No upload history found.</div>
        )}
      </div>
    </section>
  );
}
