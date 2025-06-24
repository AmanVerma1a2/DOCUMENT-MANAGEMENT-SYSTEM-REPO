import React from 'react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'documents', label: 'Documents' },
  { key: 'history', label: 'History' },
  { key: 'upload', label: 'Upload' },
];

export default function Navbar({ section, setSection, user, onSignout }) {
  // Use username if available, fallback to email, fallback to 'U'
  const displayName = user?.username || user?.email || 'User';
  const displayInitial = displayName[0]?.toUpperCase() || 'U';
  return (
    <header style={{ background: 'linear-gradient(90deg, #667eea, #764ba2)', color: '#fff', padding: '1rem 0' }}>
      <nav style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Doc Management</h1>
        <ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map(item => (
            <li key={item.key}>
              <button
                onClick={() => setSection(item.key)}
                style={{
                  background: section === item.key ? '#ffffff33' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.5rem 1rem',
                  fontWeight: section === item.key ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: '#fff', color: '#764ba2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18
            }}>
              {displayInitial}
            </div>
            <span style={{ fontWeight: 500 }}>{displayName}</span>
            <button onClick={onSignout} style={{ background: '#e53e3e', color: '#fff', borderRadius: 8, padding: '0.4rem 1rem', marginLeft: 8 }}>Sign out</button>
          </div>
        )}
      </nav>
    </header>
  );
}
