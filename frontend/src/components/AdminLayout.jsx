import React, { useState } from 'react';
import { Input, Button, Avatar, Switch, Tooltip, Typography } from 'antd';
const { Title, Text } = Typography;

// Simple dummy page for navigation
const DummyPage = ({ title, description, icon }) => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 64, color: 'var(--accent-color)', marginBottom: 24, opacity: 0.8 }}>{icon}</div>
        <Title level={2} style={{ color: 'var(--text-primary)', marginBottom: 8 }}>{title}</Title>
        <Text style={{ color: 'var(--text-secondary)', fontSize: 16 }}>{description}</Text>
    </div>
);
import {
    AppstoreFilled,
    LineChartOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    SettingOutlined,
    BulbOutlined,
    BulbFilled,
    SearchOutlined,
    BellOutlined,
    RocketOutlined
} from '@ant-design/icons';
import Dashboard from './Dashboard.jsx';
import Chatbot from './Chatbot.jsx';

function AdminLayout({ token, sessionId, setSessionId, onLogout, theme, toggleTheme }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="layout-wrapper">
            {/* Floating Sidebar Pill */}
            <div className="glass-panel sidebar-pill">
                <div style={{ color: '#ff7527', fontSize: '24px', marginBottom: '16px' }}>
                    <RocketOutlined />
                </div>

                <Tooltip placement="right" title="Dashboard">
                    <div className={`glass-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <AppstoreFilled />
                    </div>
                </Tooltip>
                <Tooltip placement="right" title="Impact Charts">
                    <div className={`glass-btn ${activeTab === 'charts' ? 'active' : ''}`} onClick={() => setActiveTab('charts')}>
                        <LineChartOutlined />
                    </div>
                </Tooltip>
                <Tooltip placement="right" title="Events Calendar">
                    <div className={`glass-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
                        <CalendarOutlined />
                    </div>
                </Tooltip>
                <Tooltip placement="right" title="Recent Activity">
                    <div className={`glass-btn ${activeTab === 'clock' ? 'active' : ''}`} onClick={() => setActiveTab('clock')}>
                        <ClockCircleOutlined />
                    </div>
                </Tooltip>
                <Tooltip placement="right" title="Volunteers">
                    <div className={`glass-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
                        <TeamOutlined />
                    </div>
                </Tooltip>
                <Tooltip placement="right" title="Settings">
                    <div className={`glass-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <SettingOutlined />
                    </div>
                </Tooltip>

                <div style={{ flex: 1 }} />

                <Tooltip placement="right" title="Logout">
                    <div className="glass-btn" onClick={onLogout}>
                        <BulbOutlined />
                    </div>
                </Tooltip>
            </div>

            {/* Main Glass Container */}
            <div className="glass-panel main-glass-container" style={{ padding: '32px 32px 0 32px' }}>
                {/* Header built into layout */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Impact Dashboard 🌍</h1>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Track our global sustainability efforts</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                {theme === 'light' ? 'Day' : 'Night'}
                            </span>
                            <Switch
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                                checkedChildren={<BulbFilled />}
                                unCheckedChildren={<BulbOutlined />}
                                style={{ background: theme === 'dark' ? 'var(--accent-color)' : '#ccc' }}
                            />
                        </div>
                        <Input
                            prefix={<SearchOutlined style={{ color: '#999', fontSize: '16px' }} />}
                            placeholder="Search something here..."
                            style={{
                                borderRadius: '24px',
                                background: 'rgba(255,255,255,0.4)',
                                border: '1px solid rgba(255,255,255,0.6)',
                                width: '280px',
                                padding: '8px 16px',
                                color: '#333'
                            }}
                        />
                        <Button
                            shape="circle"
                            icon={<BellOutlined />}
                            style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', width: '40px', height: '40px' }}
                        />
                        <Button
                            type="primary"
                            onClick={() => setIsChatOpen(true)}
                            style={{ background: 'var(--accent-color)', border: 'none', borderRadius: '20px', padding: '0 20px', height: '40px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0, 255, 200, 0.3)', color: '#001529' }}
                        >
                            AI Assistant
                        </Button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', padding: '4px 16px 4px 4px', borderRadius: '30px', cursor: 'pointer' }}>
                            <Avatar src="https://i.pravatar.cc/150?img=11" size={32} />
                            <div style={{ lineHeight: 1.2 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>Lionel Messi</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>@itsworks</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Dashboard Space */}
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '32px', paddingRight: '8px' }}>
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'charts' && <DummyPage title="Global Impact Charts" description="Detailed analytics on carbon offsets, tree planting, and donation goals." icon={<LineChartOutlined />} />}
                    {activeTab === 'calendar' && <DummyPage title="Events Calendar" description="Upcoming charity galas, community cleanups, and fundraising events." icon={<CalendarOutlined />} />}
                    {activeTab === 'clock' && <DummyPage title="Recent Activity" description="Log of all recent CSR activity and volunteer hours logged." icon={<ClockCircleOutlined />} />}
                    {activeTab === 'team' && <DummyPage title="Volunteer Network" description="Manage your list of global active volunteers and coordinators." icon={<TeamOutlined />} />}
                    {activeTab === 'settings' && <DummyPage title="Platform Settings" description="Configure your integration keys, notifications, and profile details." icon={<SettingOutlined />} />}
                </div>
            </div>

            <Chatbot
                token={token}
                sessionId={sessionId}
                setSessionId={setSessionId}
                isOpen={isChatOpen}
                setIsOpen={setIsChatOpen}
            />
        </div>
    );
}

export default AdminLayout;
