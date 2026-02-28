import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { UserOutlined, MessageOutlined, DollarOutlined, LineChartOutlined } from '@ant-design/icons';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const { Title } = Typography;

const data = [
    { name: 'Mon', queries: 4000, users: 2400 },
    { name: 'Tue', queries: 3000, users: 1398 },
    { name: 'Wed', queries: 2000, users: 9800 },
    { name: 'Thu', queries: 2780, users: 3908 },
    { name: 'Fri', queries: 1890, users: 4800 },
    { name: 'Sat', queries: 2390, users: 3800 },
    { name: 'Sun', queries: 3490, users: 4300 },
];

function Dashboard() {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginTop: 0, marginBottom: '24px', fontWeight: 600 }}>Overview</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable style={{ borderRadius: '12px' }}>
                        <Statistic
                            title="Total Users"
                            value={112893}
                            prefix={<UserOutlined style={{ color: '#1677ff', opacity: 0.8 }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable style={{ borderRadius: '12px' }}>
                        <Statistic
                            title="Active Sessions"
                            value={193}
                            prefix={<MessageOutlined style={{ color: '#52c41a', opacity: 0.8 }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable style={{ borderRadius: '12px' }}>
                        <Statistic
                            title="Queries Today"
                            value={9382}
                            prefix={<LineChartOutlined style={{ color: '#faad14', opacity: 0.8 }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} hoverable style={{ borderRadius: '12px' }}>
                        <Statistic
                            title="Est. Revenue"
                            value={4231}
                            prefix={<DollarOutlined style={{ color: '#eb2f96', opacity: 0.8 }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card bordered={false} style={{ borderRadius: '12px', minHeight: '400px' }} title="Query Activity (Weekly)">
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <AreaChart
                                    data={data}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="queries" stroke="#1677ff" fillOpacity={1} fill="url(#colorPv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
