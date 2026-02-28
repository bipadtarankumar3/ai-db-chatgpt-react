import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Typography, theme } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    TeamOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Dashboard from './Dashboard.jsx';
import Chatbot from './Chatbot.jsx';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

function AdminLayout({ token, sessionId, setSessionId, onLogout }) {
    const [collapsed, setCollapsed] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text strong style={{ color: 'white', fontSize: collapsed ? '14px' : '20px', transition: 'all 0.3s' }}>
                        {collapsed ? 'AP' : 'Admin Panel'}
                    </Text>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: '2',
                            icon: <TeamOutlined />,
                            label: 'Users',
                        },
                        {
                            key: '3',
                            icon: <SettingOutlined />,
                            label: 'Settings',
                        },
                        {
                            type: 'divider',
                        },
                        {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: 'Logout',
                            onClick: onLogout,
                            danger: true,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div style={{ paddingRight: 24, display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Button type="primary" onClick={() => setIsChatOpen(true)}>
                            Chat with Bot
                        </Button>
                        <Avatar icon={<UserOutlined />} />
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflowY: 'auto'
                    }}
                >
                    <Dashboard />
                </Content>
            </Layout>

            <Chatbot
                token={token}
                sessionId={sessionId}
                setSessionId={setSessionId}
                isOpen={isChatOpen}
                setIsOpen={setIsChatOpen}
            />
        </Layout>
    );
}

export default AdminLayout;
