import React, { useState, useRef, useEffect } from 'react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'documents', label: 'Documents' },
  { key: 'history', label: 'History' },
  { key: 'upload', label: 'Upload' },
];

export default function Navbar({ section, setSection, user, onSignout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.username || user?.email || 'User';
  const displayInitial = displayName[0]?.toUpperCase() || 'U';

  return (
    <header style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', color: '#fff', padding: '1rem 0' }}>
      <nav className="navbar" style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>DocX</h1>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#fff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
              aria-label="User menu"
            >
              {displayInitial}
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                background: '#fff',
                color: '#7c3aed',
                borderRadius: 8,
                boxShadow: '0 2px 8px #0002',
                minWidth: 140,
                zIndex: 10,
                padding: '8px 0'
              }}>
                <div style={{
                  padding: '10px 16px',
                  fontWeight: 600,
                  borderBottom: '1px solid #ede9fe'
                }}>
                  {displayName}
                </div>
                <button
                  onClick={onSignout}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#7c3aed',
                    padding: '10px 16px',
                    textAlign: 'left',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
