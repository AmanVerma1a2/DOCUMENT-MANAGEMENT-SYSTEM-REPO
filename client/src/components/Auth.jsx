import React, { useState } from 'react';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }
    // Email validation for username
    if (!/^\S+@\S+\.\S+$/.test(username)) {
      setError('Username must be a valid email address');
      return;
    }
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      if (mode === 'login') {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem('token', data.token);
          onAuth({ username, token: data.token });
        } else {
          setError(data.message || 'Login failed');
        }
      } else {
        const res = await fetch('/api/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
          setMode('login');
          setError('Signup successful! Please login.');
        } else {
          setError(data.message || 'Signup failed');
        }
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 0, padding: 48, minWidth: 450, boxShadow: '0 2px 16px #0002' }}>
        <h2 style={{ marginBottom: 24, color: '#28a745' }}>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        {error && <div style={{ color: error.includes('success') ? '#38a169' : '#e53e3e', marginBottom: 12 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        {mode === 'signup' && (
          <div style={{ marginBottom: 24 }}>
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ width: '100%' }} />
          </div>
        )}
        <button type="submit" style={{ width: '100%' }}>{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        <div style={{ marginTop: 16, fontSize: 14 }}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}<span style={{ color: '#28a745', cursor: 'pointer' }} onClick={() => { setMode('signup'); setError(''); }}>Sign up</span></>
          ) : (
            <>Already have an account?{' '}<span style={{ color: '#28a745', cursor: 'pointer' }} onClick={() => { setMode('login'); setError(''); }}>Login</span></>
          )}
        </div>
      </form>
    </section>
  );
}
