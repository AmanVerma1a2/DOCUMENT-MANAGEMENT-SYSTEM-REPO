import React, { useState } from 'react';

export default function Signup({ onSignup, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    // Replace with real API call
    onSignup({ email });
  };

  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 0, padding: 48, minWidth: 450, boxShadow: '0 2px 16px #0002' }}>
        <h2 style={{ marginBottom: 24, color: '#28a745' }}>Sign Up</h2>
        {error && <div style={{ color: '#e53e3e', marginBottom: 12 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>Confirm Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ width: '100%' }}>Sign Up</button>
        <div style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account?{' '}
          <span style={{ color: '#28a745', cursor: 'pointer' }} onClick={switchToLogin}>Login</span>
        </div>
      </form>
    </section>
  );
}
