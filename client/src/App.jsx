import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Documents from './components/Documents';
import Upload from './components/Upload';
import Toast from './components/Toast';
import Auth from './components/Auth';
import History from './components/History';

export default function App() {
  const [section, setSection] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token && username ? { username, token } : null;
  });

  const handleSignout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  const handleAuth = ({ username, token }) => {
    setUser({ username, token });
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  };

  return !user ? (
    <Auth onAuth={handleAuth} />
  ) : (
    <div>
      <Navbar section={section} setSection={setSection} user={user} onSignout={handleSignout} />
      <main style={{ maxWidth: 1200, margin: '2rem auto', padding: 16 }}>
        {section === 'dashboard' && <Dashboard />}
        {section === 'documents' && <Documents setToast={setToast} />}
        {section === 'history' && <History />}
        {section === 'upload' && <Upload setToast={setToast} user={user} />}
      </main>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
