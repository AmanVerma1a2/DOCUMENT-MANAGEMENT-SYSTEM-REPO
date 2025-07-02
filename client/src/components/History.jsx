import React, { useEffect, useState } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/documents/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to fetch upload history');
        }
        return res.json();
      })
      .then(history => {
        setHistory(history);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Network error');
        setLoading(false);
      });
  }, []);

  // Delete a single history entry
  const handleDeleteHistoryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this history entry?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/documents/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete history entry');
      setHistory(history => history.filter(item => item._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete history entry');
    }
  };

  return (
    <section>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Upload History</h2>
      <div style={{ color: '#888', marginBottom: 24 }}>All uploaded documents with their upload dates</div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#e53e3e', marginBottom: 16 }}>{error}</div>}
      {history.length === 0 && !loading && !error && (
        <div style={{ color: '#888', fontSize: 18, marginTop: 32 }}>No upload history found.</div>
      )}
      {history.length > 0 && (
        <div className="table-responsive" style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#ede9fe' }}>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#000' }}>#</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#000' }}>Doc Name</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#000' }}>Size</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#000' }}>Upload Date</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#000' }}>Upload Time</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#000' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => {
                let uploadDate = '--';
                let uploadTime = '--';
                if (item.uploadedAt) {
                  const dateObj = new Date(item.uploadedAt);
                  uploadDate = dateObj.toLocaleDateString();
                  uploadTime = dateObj.toLocaleTimeString();
                }
                return (
                  <tr key={item._id || idx} style={{ borderBottom: '1px solid #a78bfa', background: idx % 2 === 0 ? '#f5f3ff' : '#fff' }}>
                    <td style={{ padding: 10, color: '#7c3aed' }}>{idx + 1}</td>
                    <td style={{ padding: 10 }}>{item.documentName}</td>
                    <td style={{ padding: 10 }}>{item.size ? (item.size / 1024).toFixed(2) + ' KB' : '--'}</td>
                    <td style={{ padding: 10 }}>{uploadDate}</td>
                    <td style={{ padding: 10 }}>{uploadTime}</td>
                    <td style={{ padding: 10, textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteHistoryItem(item._id)}
                        title="Delete history entry"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </td>
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