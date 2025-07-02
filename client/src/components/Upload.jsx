import React, { useState, useRef } from 'react';

export default function Upload({ setToast, user }) {
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
          border: `2px dashed ${dragActive ? '#e53935' : '#ccc'}`,
          background: dragActive ? '#fbeaea' : '#f5f7fa',
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
        <div style={{ fontSize: 40, color: '#e53935', marginBottom: 12 }}>
          <span role="img" aria-label="upload">☁️</span>
        </div>
        <div style={{ fontWeight: 600, color: '#e53935', fontSize: 18, marginBottom: 4 }}>Drag & Drop Files Here</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>or click to browse files</div>
        <button type="button" style={{
          background: '#e53935',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.5rem 1.2rem',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Choose Files
        </button>
        {file && (
          <div style={{ marginTop: 16, color: '#e53935', fontWeight: 500 }}>
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      {/* Upload Form with black submit button */}
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        minWidth: 320,
        boxShadow: '0 2px 8px #0001',
        flex: 1,
        maxWidth: 340
      }}>
        <button type="submit" style={{
          width: '100%',
          marginTop: 12,
          background: '#000',     // Black background
          color: '#fff',          // White text
          border: 'none',
          borderRadius: 8,
          padding: '0.5rem 1rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Upload Document
        </button>
      </form>
    </section>
  );
}
