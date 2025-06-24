import React, { useState, useRef } from 'react';

export default function Upload({ setToast, user }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      setToast({ message: 'Please select a file', type: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('file', file);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setToast({ message: 'Document uploaded!', type: 'success' });
        setTitle('');
        setDesc('');
        setFile(null);
      } else {
        setToast({ message: 'Upload failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'Upload failed', type: 'error' });
    }
  };

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <section style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'flex-start', marginTop: 32 }}>
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          flex: 1,
          minWidth: 340,
          minHeight: 340,
          border: dragActive ? '2px dashed #7c3aed' : '2px dashed #a78bfa',
          background: dragActive ? '#ede9fe' : '#f5f7fa',
          borderRadius: 10,
          padding: 32,
          textAlign: 'center',
          transition: 'background 0.2s, border 0.2s',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => inputRef.current.click()}
      >
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div style={{ fontSize: 40, color: '#b4b8f0', marginBottom: 12 }}>
          <span role="img" aria-label="upload">☁️</span>
        </div>
        <div style={{ fontWeight: 600, color: '#7c3aed', fontSize: 18, marginBottom: 4 }}>Drag & Drop Files Here</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>or click to browse files</div>
        <button type="button" style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500 }}>Choose Files</button>
        {file && (
          <div style={{ marginTop: 16, color: '#7c3aed', fontWeight: 500 }}>
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
      {/* Details Form */}
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 320, boxShadow: '0 2px 8px #0001', flex: 1, maxWidth: 340 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 18 }}>Document Details</h3>
        <div style={{ marginBottom: 16 }}>
          <label>Document Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: 12 }}>Upload Document</button>
      </form>
    </section>
  );
}