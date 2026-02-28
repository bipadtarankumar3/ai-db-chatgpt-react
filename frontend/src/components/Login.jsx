import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, message, Switch } from 'antd';
import { UserOutlined, LockOutlined, BulbFilled, BulbOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

function Login({ onLoginSuccess, theme, toggleTheme }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8000/login', {
        username: values.username,
        password: values.password,
      });
      const token = res.data.token;

      // automatically create first session
      const sess = await axios.post('http://localhost:8000/session/new');
      const sessionId = sess.data.session_id;

      message.success('Login successful!');
      onLoginSuccess(token, sessionId);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative'
    }}>

      {/* Theme Toggle Top Right */}
      <div style={{ position: 'absolute', top: 32, right: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Text style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
          {theme === 'light' ? 'Day Theme' : 'Night Theme'}
        </Text>
        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          style={{ background: theme === 'dark' ? 'var(--accent-color)' : '#ccc' }}
        />
      </div>

      <div className="glass-panel" style={{ width: 420, padding: 40, textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: 'var(--accent-color)', fontWeight: 700 }}>AI CSR Hub</Title>
          <Text style={{ color: 'var(--text-secondary)' }}>Log in to access impact metrics</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24, textAlign: 'left', borderRadius: 12 }} />}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--text-secondary)' }} />}
              placeholder="Username"
              style={{
                borderRadius: 20,
                background: 'var(--glass-card-bg)',
                border: '1px solid var(--glass-card-border)',
                color: 'var(--text-primary)'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-secondary)' }} />}
              placeholder="Password"
              style={{
                borderRadius: 20,
                background: 'var(--glass-card-bg)',
                border: '1px solid var(--glass-card-border)',
                color: 'var(--text-primary)'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 24,
                background: 'var(--accent-color)',
                border: 'none',
                fontWeight: 600,
                fontSize: 16,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              Authenticate
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
