import React, { useState } from 'react';

export default function Login({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Email validation: must include '@' and at least one character before and after
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    onLogin({ email });
  };

  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 0, padding: 48, minWidth: 450, boxShadow: '0 2px 16px #0002' }}>
        <h2 style={{ marginBottom: 24, color: '#28a745' }}>Login</h2>
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
          <span style={{ color: '#28a745', cursor: 'pointer' }} onClick={switchToSignup}>Sign up</span>
        </div>
      </form>
    </section>
  );
}
