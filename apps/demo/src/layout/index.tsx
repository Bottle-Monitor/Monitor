import {
  DashboardOutlined,
  ExceptionOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { abnormalPlugin, bottleMonitorInit, userPlugin, vitalsPlugin } from '@bottle-monitor/core'
import { Layout as AntLayout, Menu, theme } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = AntLayout

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 菜单项配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '监控概览',
    },
    {
      key: '/errors',
      icon: <ExceptionOutlined />,
      label: '错误监控',
    },
    {
      key: '/performance',
      icon: <ThunderboltOutlined />,
      label: '性能监控',
    },
    {
      key: '/user-behavior',
      icon: <UserOutlined />,
      label: '用户行为',
    },
    {
      key: '/test-pages',
      icon: <TeamOutlined />,
      label: '测试页面',
      children: [
        {
          key: '/test-pages/error-test',
          label: '错误测试',
        },
        {
          key: '/test-pages/performance-test',
          label: '性能测试',
        },
        {
          key: '/test-pages/user-test',
          label: '用户交互测试',
        },
      ],
    },
  ]

  // 监控数据存储
  const [monitoringData, setMonitoringData] = useState<any[]>([])

  // 数据收集钩子
  const beforeTransport = (data: unknown) => {
    console.log('监控数据收集: ', data)
    setMonitoringData(prev => [...prev, data])
  }

  // 初始化监控SDK
  useEffect(() => {
    // 配置用户行为插件
    const userPlugin_instance = userPlugin({
      options: {
        click: true,
        hash: true,
        history: true,
      },
      breadcrumbs: {
      },
    })

    // 配置性能监控插件
    const vitalsPlugin_instance = vitalsPlugin({
      options: {
        FCP: true,
        LCP: true,
        FID: true,
        CLS: true,
        TTFB: true,
      },
      breadcrumbs: {
      },
    })

    // 配置异常监控插件
    const abnormalPlugin_instance = abnormalPlugin({
      options: {
        codeError: true,
        unhandledrejection: true,
        resource: true,
        network: true,
      },
      breadcrumbs: {
      },
    })

    // 初始化监控
    bottleMonitorInit({
      userId: 'demo-user-001',
      dsnURL: '/api/report',
      plugins: [userPlugin_instance, vitalsPlugin_instance, abnormalPlugin_instance],
      hook: {
        beforeTransport,
      },
    })

    // 自动导航到首页
    if (location.pathname === '/') {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate, location.pathname])

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'BM' : 'Bottle Monitor'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
          }}
        >
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {collapsed ? '📂' : '📁'}
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: 16 }}>
            前端监控系统
          </span>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet context={{ monitoringData }} />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}
