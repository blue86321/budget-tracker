import { BellOutlined, BookOutlined, DollarOutlined, ExclamationCircleOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, Menu, Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import { createElement, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from 'stores';
import { removeLocalToken } from 'utils';
import { removeLocalRefreshToken } from 'utils/token';
import './index.scss';


const { Header, Content, Sider } = Layout;

function MainLayout() {

  const [collapsed, setCollapse] = useState(false)
  const [notificationLinkObj, setNotificationLinkObj] = useState(
    {
      label: "Notification",
      key: '/notification',
      icon: <BellOutlined />,
    }
  )
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { userStore, partnerStore } = useStore()

  const toggleCollapse = () => {
    setCollapse(!collapsed)
    if (!collapsed) {
      setNotificationLinkObj({
        ...notificationLinkObj,
        label: "Notification",
        // antd <Badge/> has issues with Warning: "findDOMNode is deprecated in StrictMode"
        // https://github.com/ant-design/ant-design/issues/26136
        icon: <><Badge dot count={partnerStore.inviteList.length} style={{ position: 'absolute' }} offset={[18, -5]} /><BellOutlined /></>,
      })
    } else {
      setNotificationLinkObj({
        ...notificationLinkObj,
        label: <>{"Notification"}<Badge count={partnerStore.inviteList.length} offset={[10]} /></>,
        icon: <BellOutlined />
      })
    }
  }


  const logout = () => {
    removeLocalToken()
    removeLocalRefreshToken()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    userStore.getUserInfo()
    partnerStore.getInvite()
  }, [partnerStore, userStore])

  useEffect(() => {
    if (collapsed) {
      setNotificationLinkObj({
        ...notificationLinkObj,
        label: "Notification",
        icon: <><Badge dot count={partnerStore.inviteList.length} style={{ position: 'absolute' }} offset={[18, -5]} /><BellOutlined /></>,
      })
    } else {
      setNotificationLinkObj({
        ...notificationLinkObj,
        label: <>{"Notification"}<Badge count={partnerStore.inviteList.length} offset={[10]} /></>,
        icon: <BellOutlined />
      })
    }
  }, [collapsed, notificationLinkObj, partnerStore.inviteList])

  const logoutConfirm = () => {
    Modal.confirm({
      title: 'Log out',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to log out?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: logout,
    });
  }

  const onMenuClick = (values) => {
    navigate(values.key)
  }

  return (
    <Layout className="page-wrapper">
      {/* 1. side bar */}
      <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={toggleCollapse}>
        {/* <div className="logo" /> */}
        <div className="logo">
          <WalletOutlined style={{ fontSize: 30 }} />
          <span style={collapsed ? { opacity: 0, display: 'none' } : { opacity: 1, display: 'block' }}>
            Budget Tracker</span>
        </div>
        <Menu
          theme="dark"
          onClick={onMenuClick}
          defaultSelectedKeys={[pathname]}
          mode="inline"
          items={[
            // assign url to key, so that useLocation can get key (pathname) to assign defaultSelectedKey
            // ??? url ?????? key, ??????????????? useLocation ?????? key (pathname), ?????? defaultSelectedKey
            {
              label: "Dashboard",
              key: '/',
              icon: <PieChartOutlined />,
            },
            {
              label: "Finance",
              key: '/finance',
              icon: <DollarOutlined />,
            },
            {
              label: "Book",
              key: '/book',
              icon: <BookOutlined />,
            },
            {
              label: "Partner",
              key: '/partner',
              icon: <UserOutlined />,
            },
            { ...notificationLinkObj },
          ]} />
      </Sider>

      {/* 2. content */}
      <Layout>
        {/* 2.1. header */}
        <Header className="site-layout-background header">
          {
            createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              { className: 'trigger', onClick: toggleCollapse })
          }
          <div className="user-wrapper">
            <span className="user-nick-name">{userStore.userInfo?.nickname}</span>
            <Button onClick={logoutConfirm} className="sign-out-btn" shape="circle" size="large">
              <LogoutOutlined />
            </Button>
          </div>
        </Header>
        {/* 2.2. main content */}
        <Content className='site-layout-background site-layout-content'>
          {/* Nested Route, render children here */}
          {/* ?????????????????? */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}


export default observer(MainLayout)
