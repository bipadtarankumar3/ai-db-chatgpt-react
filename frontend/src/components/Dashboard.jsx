import React from 'react';
import { Row, Col, Progress, Calendar, Typography } from 'antd';
import {
    FireFilled, HeartFilled, AimOutlined,
    MoonFilled, RightOutlined, EllipsisOutlined,
    GlobalOutlined, DollarOutlined, TeamOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const { Text, Title } = Typography;

// Dummy Chart Data - Repurposed for CSR metrics
const treesData = [{ v: 40 }, { v: 60 }, { v: 30 }, { v: 80 }, { v: 50 }, { v: 90 }, { v: 40 }, { v: 70 }];
const carbonData = [{ v: 600 }, { v: 650 }, { v: 800 }, { v: 600 }, { v: 1040 }, { v: 750 }, { v: 650 }];
const volunteersData = [{ v: 6 }, { v: 7 }, { v: 5 }, { v: 8 }, { v: 6 }, { v: 9 }, { v: 8.5 }];
const impactData = [
    { name: 'Jan', val: 200 }, { name: 'Feb', val: 400 }, { name: 'Mar', val: 300 },
    { name: 'Apr', val: 600 }, { name: 'May', val: 400 }, { name: 'Jun', val: 500 },
    { name: 'Jul', val: 900 }, { name: 'Aug', val: 550 }, { name: 'Sep', val: 650 }, { name: 'Oct', val: 500 }
];

function Dashboard() {
    return (
        <div style={{ paddingRight: '12px' }}>
            <Row gutter={[24, 24]}>
                {/* LEFT COLUMN */}
                <Col xs={24} xl={17}>
                    {/* TOP STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                        {/* Trees Planted */}
                        <div className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <Text strong style={{ color: 'var(--text-primary)' }}>Trees Planted</Text>
                                <div style={{ background: 'rgba(0,185,107,0.1)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <EnvironmentOutlined style={{ color: '#00b96b', fontSize: '12px' }} />
                                </div>
                            </div>
                            <div style={{ height: 50, marginBottom: '8px' }}>
                                <ResponsiveContainer>
                                    <BarChart data={treesData}>
                                        <Bar dataKey="v" fill="#00b96b" radius={[4, 4, 4, 4]} barSize={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '24px', fontWeight: 600, color: '#00b96b' }}>14,280</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trees</span>
                            </div>
                        </div>

                        {/* Carbon Offset */}
                        <div className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <Text strong style={{ color: 'var(--text-primary)' }}>Carbon Offset</Text>
                                <div style={{ background: 'rgba(0, 255, 200, 0.1)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <GlobalOutlined style={{ color: '#00ffc8', fontSize: '12px' }} />
                                </div>
                            </div>
                            <div style={{ height: 50, marginBottom: '8px' }}>
                                <ResponsiveContainer>
                                    <LineChart data={carbonData}>
                                        <Line type="monotone" dataKey="v" stroke="#00ffc8" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '24px', fontWeight: 600, color: '#00ffc8' }}>6,104</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tons CO2</span>
                            </div>
                        </div>

                        {/* Donations */}
                        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                                <Text strong style={{ color: 'var(--text-primary)' }}>Donations</Text>
                                <div style={{ background: 'rgba(255, 117, 39, 0.1)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <DollarOutlined style={{ color: '#ff7527', fontSize: '12px' }} />
                                </div>
                            </div>
                            <Progress
                                type="circle"
                                percent={75}
                                strokeColor="#ff7527"
                                format={(percent) => (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '18px', fontWeight: 600, color: '#ff7527' }}>$988k</span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Goal</span>
                                    </div>
                                )}
                                size={80}
                                strokeWidth={8}
                            />
                        </div>

                        {/* Volunteers */}
                        <div className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <Text strong style={{ color: 'var(--text-primary)' }}>Volunteers</Text>
                                <div style={{ background: 'rgba(22, 119, 255, 0.1)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TeamOutlined style={{ color: '#1677ff', fontSize: '12px' }} />
                                </div>
                            </div>
                            <div style={{ height: 50, marginBottom: '8px' }}>
                                <ResponsiveContainer>
                                    <BarChart data={volunteersData}>
                                        <Bar dataKey="v" fill="#1677ff" radius={[4, 4, 4, 4]} barSize={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '24px', fontWeight: 600, color: '#1677ff' }}>8.5k</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hours/mo</span>
                            </div>
                        </div>
                    </div>

                    {/* CHARTS ROW */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                        {/* Global Impact Tracking */}
                        <div className="glass-card" style={{ flex: 1.5 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>Global Impact Tracking</Title>
                                <div style={{ fontSize: '12px', color: 'var(--text-primary)', background: 'var(--glass-card-border)', padding: '4px 12px', borderRadius: '16px' }}>
                                    Monthly <span>▾</span>
                                </div>
                            </div>
                            <div style={{ height: 200, width: '100%' }}>
                                <ResponsiveContainer>
                                    <AreaChart data={impactData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="val" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorO)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Campaign Card */}
                        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden', padding: 0 }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(0,185,107,0.2) 0%, rgba(255,255,255,0.05) 100%)' }} />
                            <div style={{ position: 'relative', zIndex: 1, padding: '24px', paddingTop: '100px' }}>
                                <Title level={4} style={{ margin: 0, marginBottom: '16px', color: 'var(--text-primary)' }}>Clean Water Initiative</Title>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>12 <span style={{ fontSize: '12px', fontWeight: 'normal' }}>Communities</span></div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Reached This Month</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>428 <span style={{ fontSize: '12px', fontWeight: 'normal' }}>Total</span></div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Communities Reached</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION PLAN */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                            <Title level={4} style={{ margin: 0, borderLeft: '4px solid var(--accent-color)', paddingLeft: '8px', color: 'var(--text-primary)' }}>Active Campaigns</Title>
                            <Text style={{ color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>view all</Text>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text strong style={{ display: 'block', color: 'var(--text-primary)' }}>Reforestation</Text>
                                    <Text style={{ color: 'var(--text-secondary)', fontSize: '11px', display: 'block', marginBottom: '8px' }}>Planting native trees in<br />deforested regions.</Text>
                                    <div style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', display: 'inline-block' }}>Phase 1</div>
                                </div>
                                <div style={{ width: 60, height: 60, background: 'rgba(0,185,107,0.1)', borderRadius: '50%', border: '1px solid var(--glass-card-border)' }} />
                            </div>

                            <div className="glass-card" style={{ background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text strong style={{ display: 'block', color: '#fff' }}>Ocean Cleanup</Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', display: 'block', marginBottom: '8px' }}>Removing plastic waste<br />from coastal areas.</Text>
                                    <div style={{ border: '1px solid #fff', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', display: 'inline-block', background: 'rgba(255,255,255,0.2)' }}>Phase 2</div>
                                </div>
                                <div style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }} />
                            </div>

                            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text strong style={{ display: 'block', color: 'var(--text-primary)' }}>Solar Power</Text>
                                    <Text style={{ color: 'var(--text-secondary)', fontSize: '11px', display: 'block', marginBottom: '8px' }}>Installing panels for<br />rural communities.</Text>
                                    <div style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', display: 'inline-block' }}>Phase 3</div>
                                </div>
                                <div style={{ width: 60, height: 60, background: 'rgba(0,185,107,0.1)', borderRadius: '50%', border: '1px solid var(--glass-card-border)' }} />
                            </div>
                        </div>
                    </div>
                </Col>

                {/* RIGHT COLUMN */}
                <Col xs={24} xl={7}>
                    <div className="glass-panel-dark" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>

                        {/* STATS */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginBottom: '32px' }}>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 600 }}>120+</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Partners</div>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 600 }}>14</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Countries</div>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 600 }}>4 yrs</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Running</div>
                            </div>
                        </div>

                        {/* CALENDAR */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <Text strong style={{ color: '#fff' }}>October 2026</Text>
                                <div style={{ display: 'flex', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
                                    <div style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{'<'}</div>
                                    <div style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{'>'}</div>
                                </div>
                            </div>
                            <div style={{ width: '100%', transform: 'scale(0.9)', transformOrigin: 'top left', opacity: 0.8 }}>
                                <Calendar fullscreen={false} headerRender={() => null} />
                            </div>
                        </div>

                        {/* SCHEDULED */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                            <Title level={4} style={{ margin: 0, borderLeft: '4px solid var(--accent-color)', paddingLeft: '8px', color: '#fff' }}>Scheduled Events</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer' }}>view all</Text>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', color: 'var(--accent-color)', padding: '2px 8px', borderRadius: '10px' }}>Community</div>
                                            <EllipsisOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />
                                        </div>
                                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Fundraiser Gala</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                            <Text style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Annual charity event</Text>
                                            <Text style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>17-21 Oct</Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
