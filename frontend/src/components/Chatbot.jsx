import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Table as AntdTable, Button, Input, Tooltip as AntTooltip, Typography } from 'antd';
import { CloseOutlined, MessageOutlined, PlusOutlined, SendOutlined, DownloadOutlined, LineChartOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import './Chatbot.css';

const { Text } = Typography;

function Chatbot({ token, sessionId, setSessionId, isOpen, setIsOpen }) {
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, loading, isOpen]);

    const createNewSession = async () => {
        setLoading(true);
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const sess = await axios.post('http://localhost:8000/session/new', {}, { headers });
            setSessionId(sess.data.session_id);
            setMessages([]);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userText = query;
        setQuery('');

        const userMsg = { role: 'user', text: userText };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.post('http://localhost:8000/query',
                { question: userText, session_id: sessionId },
                { headers }
            );
            const data = res.data;
            const botMsg = {
                role: 'assistant',
                text: data.answer,
                data: data.data || null,
                columns: data.columns || null,
                sql: data.sql || null,
                graphData: data.graphData || null,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            const errMsg = { role: 'assistant', text: `Error: ${err.message}` };
            setMessages((prev) => [...prev, errMsg]);
        }
        setLoading(false);
    };

    const downloadExcel = (cols, data, filename) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, filename);
    };

    const renderMessage = (msg, idx) => (
        <div key={idx} className={`chat-message ${msg.role}`}>
            <div className={`chat-bubble ${msg.role}`}>
                <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '13px', opacity: 0.9 }}>
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{msg.text}</div>
            </div>

            {msg.data && msg.columns && (
                <div className="chat-result-card">
                    <div className="chat-result-header">
                        <Text type="secondary" style={{ fontSize: '12px' }}>Rows: {msg.data.length}</Text>
                        <Button
                            type="text"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => downloadExcel(msg.columns, msg.data, `export_${Date.now()}.xlsx`)}
                        >
                            Excel
                        </Button>
                    </div>
                    <AntdTable
                        columns={msg.columns.map((c) => ({ title: c, dataIndex: c, key: c }))}
                        dataSource={msg.data.map((row, index) => ({ key: index, ...row }))}
                        pagination={{ pageSize: 5 }}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        bordered
                        className="chat-table"
                    />
                </div>
            )}

            {msg.graphData && (
                <div className="chat-chart-card">
                    <div className="chat-result-header" style={{ marginBottom: 8 }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}><LineChartOutlined /> Chart</Text>
                    </div>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={msg.graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="x" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="y" stroke="#1677ff" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {msg.sql && (
                <div className="chat-sql">
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Generated SQL:</Text>
                    <code>{msg.sql}</code>
                </div>
            )}
        </div>
    );

    return (
        <>
            {!isOpen && (
                <button className="chat-fab" onClick={() => setIsOpen(true)}>
                    <MessageOutlined className="fab-icon" />
                </button>
            )}

            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="chatbot-avatar">
                            <MessageOutlined style={{ color: '#fff', fontSize: '16px' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.2 }}>AI Assistant</div>
                            <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span className="online-dot"></span> Online
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <AntTooltip title="New Session">
                            <Button type="text" icon={<PlusOutlined />} onClick={createNewSession} style={{ color: 'white' }} />
                        </AntTooltip>
                        {sessionId && (
                            <AntTooltip title={`Session: ${sessionId}`}>
                                <div className="chatbot-session-indicator" />
                            </AntTooltip>
                        )}
                        <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} style={{ color: 'white' }} />
                    </div>
                </div>

                <div className="chatbot-messages" ref={chatRef}>
                    {messages.length === 0 && !loading && (
                        <div className="chatbot-empty">
                            <MessageOutlined style={{ fontSize: '48px', color: '#e6e6e6', marginBottom: '16px' }} />
                            <div style={{ color: '#8c8c8c' }}>Send a message to start chatting!</div>
                        </div>
                    )}
                    {messages.map(renderMessage)}
                    {loading && (
                        <div className="chat-message assistant">
                            <div className="chat-bubble assistant loading">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="chatbot-input">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', width: '100%', margin: 0 }}>
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask me anything..."
                            disabled={loading}
                            bordered={false}
                            className="chat-input-field"
                        />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            htmlType="submit"
                            loading={loading}
                            className="chat-send-btn"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

export default Chatbot;
