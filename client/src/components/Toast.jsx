import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [onClose]);
  const color = type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce';
  return (
    <div style={{
      position: 'fixed', top: 80, right: 32, zIndex: 1000,
      background: '#fff', borderLeft: `6px solid ${color}`,
      boxShadow: '0 2px 8px #0002', padding: '1rem 2rem', borderRadius: 8
    }}>
      {message}
    </div>
  );
}