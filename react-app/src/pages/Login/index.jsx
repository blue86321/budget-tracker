import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'stores';
import './index.scss';


export default function Login() {

  const { loginStore } = useStore()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      await loginStore.login(values)
      // go to main page
      navigate('/', { replace: true })
      message.success('Successfully login', 2);
    } catch (e) {
      message.error('incorrect username or password', 2)
    }
  }

  const onRegister = () => {
    navigate('/register')
  }

  return (
    <div className='login-page-wrapper'>
      <Card className='login-card-container'>
        <h1 className="header-text">Budget Tracker</h1>
        {/* login form */}
        <Form
          className="login-form"
          onFinish={onFinish}
          initialValues={{
            username: 'guest',
            password: 'guest',
          }}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="submit-btn" size="large">
            Log In
          </Button>
        </Form>

        <div className="horizontal-divider"></div>

        <Button
          className="submit-btn"
          type="default"
          size="large"
          onClick={onRegister}
        >
          Register</Button>

      </Card>
    </div>
  )
}
