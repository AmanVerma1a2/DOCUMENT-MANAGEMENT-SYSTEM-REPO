import React, { useState } from 'react';

export default function Login({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Replace with real API call
    if (email && password) {
      onLogin({ email });
    } else {
      setError('Please enter email and password');
    }
  };

  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002' }}>
        <h2 style={{ marginBottom: 24, color: '#667eea' }}>Login</h2>
        {error && <div style={{ color: '#e53e3e', marginBottom: 12 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ width: '100%' }}>Login</button>
        <div style={{ marginTop: 16, fontSize: 14 }}>
          Don't have an account?{' '}
          <span style={{ color: '#667eea', cursor: 'pointer' }} onClick={switchToSignup}>Sign up</span>
        </div>
      </form>
    </section>
  );
}
