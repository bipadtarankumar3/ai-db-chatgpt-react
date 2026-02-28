import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import AdminLayout from './components/AdminLayout.jsx';

// Import CSS reset and global layout
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (newToken, newSessionId) => {
    setToken(newToken);
    setSessionId(newSessionId);
  };

  const handleLogout = () => {
    setToken(null);
    setSessionId(null);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <AdminLayout
      token={token}
      sessionId={sessionId}
      setSessionId={setSessionId}
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;
