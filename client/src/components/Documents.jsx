import React, { useEffect, useState } from 'react';

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'pdf', label: 'PDF' },
  { value: 'image', label: 'Images' },
];

function getTypeIcon(name) {
  if (!name) return '📁';
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['txt', 'md'].includes(ext)) return '📃';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) return '🖼️';
  return '📁';
}

export default function Documents({ setToast }) {
  const [docs, setDocs] = useState([]);
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [viewDoc, setViewDoc] = useState(null);

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line
  }, []);

  const fetchDocs = () => {
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
      .then(setDocs)
      .catch(err => {
        setDocs([]);
        setError(err.message || 'Network error');
        if (setToast) setToast({ message: err.message, type: 'error' });
      });
  };

  const handleDelete = async id => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: 'Document deleted', type: 'success' });
        setDocs(docs => docs.filter(doc => doc._id !== id));
      } else {
        setToast({ message: data.message || 'Delete failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  // Helper to download files (especially images)
  const handleDownload = async (doc) => {
    const ext = doc.name.split('.').pop().toLowerCase();
    if (["jpg","jpeg","png","gif","bmp","svg","webp"].includes(ext)) {
      try {
        const response = await fetch(doc.url, { mode: 'cors' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        setToast && setToast({ message: 'Failed to download image', type: 'error' });
      }
    } else {
      // For other files, fallback to default behavior
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const filtered = docs.filter(doc => {
    const ext = doc.name ? doc.name.split('.').pop().toLowerCase() : '';
    const matchesType = !type ||
      (type === 'image' && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) ||
      (type === 'pdf' && ext === 'pdf') ||
      type === '';
    return matchesType;
  });

  return (
    <section>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Documents</h2>
      <div style={{ color: '#888', marginBottom: 24 }}>Manage and organize your documents</div>
      {error && <div style={{ color: '#e53e3e', marginBottom: 16 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <select value={type} onChange={e => setType(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }}>
          {typeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {filtered.map(doc => (
          <div key={doc._id} style={{ background: '#fff', borderRadius: 12, padding: 20, minWidth: 260, boxShadow: '0 2px 8px #0001', position: 'relative' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{getTypeIcon(doc.name)}</div>
            <h3 style={{ fontWeight: 600 }}>{doc.name}</h3>
            <div style={{ fontSize: 12, color: '#888', margin: '8px 0' }}>
              Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '--'}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {(() => {
                const ext = doc.name.split('.').pop().toLowerCase();
                if (["jpg","jpeg","png","gif","bmp","svg","webp"].includes(ext)) {
                  // Images: open directly
                  return (
                    <a href={doc.url.replace('/raw/upload/', '/image/upload/')}
                      target="_blank" rel="noopener noreferrer">
                      <button>View</button>
                    </a>
                  );
                } else if (ext === "pdf") {
                  // PDFs: use Google Docs Viewer
                  const gview = `https://docs.google.com/gview?url=${encodeURIComponent(doc.url)}&embedded=true`;
                  return (
                    <a href={gview} target="_blank" rel="noopener noreferrer">
                      <button>View</button>
                    </a>
                  );
                } else if (["txt","md"].includes(ext)) {
                  // Text files: open in a new tab (raw)
                  return (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <button>View</button>
                    </a>
                  );
                } else {
                  // Other files: open/download
                  return (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <button>View</button>
                    </a>
                  );
                }
              })()}
              <button
                onClick={e => {
                  e.preventDefault();
                  handleDownload(doc);
                }}
              >Download</button>
              <button onClick={() => handleDelete(doc._id)}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !error && (
          <div style={{ color: '#888', fontSize: 18, marginTop: 32 }}>No documents found.</div>
        )}
      </div>
    </section>
  );
}