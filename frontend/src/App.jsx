import React, { useState } from 'react';
import Login from './components/Login.jsx';
import AdminLayout from './components/AdminLayout.jsx';

// Import CSS reset and global layout
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleLoginSuccess = (newToken, newSessionId) => {
    setToken(newToken);
    setSessionId(newSessionId);
  };

  const handleLogout = () => {
    setToken(null);
    setSessionId(null);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      token={token}
      sessionId={sessionId}
      setSessionId={setSessionId}
      onLogout={handleLogout}
    />
  );
}

export default App;
