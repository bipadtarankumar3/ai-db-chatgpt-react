import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Table as AntdTable } from 'antd';
import * as XLSX from 'xlsx';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const chatRef = useRef(null);

  // login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/login', { username, password });
      setToken(res.data.token);
      // automatically create first session
      const sess = await axios.post('http://localhost:8000/session/new');
      setSessionId(sess.data.session_id);
      setMessages([]);
      setError(null);
    } catch (err) {
      setError('Login failed');
    }
  };

  const createNewSession = async () => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const sess = await axios.post('http://localhost:8000/session/new', {}, { headers });
    setSessionId(sess.data.session_id);
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    const userMsg = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('http://localhost:8000/query',
        { question: query, session_id: sessionId },
        { headers }
      );
      const data = res.data;
      const botMsg = {
        role: 'assistant',
        text: data.answer,
        data: data.data || null,
        columns: data.columns || null,
        sql: data.sql || null,
      };
      setMessages((prev) => [...prev, botMsg]);
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 50);
    } catch (err) {
      const errMsg = { role: 'assistant', text: `Error: ${err.message}` };
      setMessages((prev) => [...prev, errMsg]);
    }

    setQuery('');
  };

  const downloadExcel = (cols, data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
  };

  const renderMessage = (msg, idx) => (
    <div key={idx} className={`message ${msg.role}`}>
      <div className="bubble">
        <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong>
        <div>{msg.text}</div>
      </div>
      {msg.data && msg.columns && (
        <div className="result">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>Rows: {msg.data.length}</div>
            <button
              onClick={() => downloadExcel(msg.columns, msg.data, `export_${Date.now()}.xlsx`)}
              style={{fontSize:'0.8rem', padding:'0.25rem 0.5rem'}}
            >
              Download Excel
            </button>
          </div>
          <AntdTable
            columns={msg.columns.map((c) => ({ title: c, dataIndex: c, key: c }))}
            dataSource={msg.data.map((row, index) => ({ key: index, ...row }))}
            pagination={false}
            size="small"
            style={{marginTop:'0.5rem'}}
          />
        </div>
      )}
      {msg.graphData && (
        <div className="chart" style={{height:'300px', marginTop:'1rem'}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={msg.graphData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="x" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#10a37f" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {msg.sql && <div className="sql">SQL: {msg.sql}</div>}
      {msg.hint && <div className="hint">{msg.hint}</div>}
    </div>
  );

  if (!token) {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button className="new-chat">+ New Chat</button>
        <nav className="history">
          {/* past sessions could go here */}
        </nav>
      </aside>
      <main className="chat-main">
        <header className="chat-header">
          <span>AI Database Assistant</span>
          <button className="session-btn" onClick={createNewSession}>
            + New Session
          </button>
          {sessionId && <small style={{marginLeft:'1rem', fontSize:'0.8rem'}}>Session: {sessionId}</small>}
        </header>
        <div className="chat-container" ref={chatRef}>
          {messages.map(renderMessage)}
        </div>
        <form className="input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Send a message..."
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}

export default App;
