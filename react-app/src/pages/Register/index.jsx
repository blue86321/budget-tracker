import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'stores';
import './index.scss';


const Register = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { loginStore } = useStore()

  const formItemLayout = {
    labelCol: {
      xs: { span: 24, },
      sm: { span: 8, },
    },
    wrapperCol: {
      xs: { span: 24, },
      sm: { span: 16, },
    },
  }



  const onRegister = async (values) => {
    try {
      await loginStore.register(values)
      navigate('/', { replace: true })
      message.success('Success', 2)
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message
      message.error(errorMessage, 3)
    }
  }


  return (
    <div className='register-page-wrapper'>
      <Card className='register-card-container'>
        <h1 className="header-text">Budget Tracker</h1>

        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onRegister}
          requiredMark="optional"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your username',
              },
            ]}

          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="Nickname"
            rules={[
              {
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button className='submit-btn' type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register
