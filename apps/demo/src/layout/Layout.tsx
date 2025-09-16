import {
  BugOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  EyeOutlined,
  InfoCircleFilled,
  LineChartOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { abnormalPlugin, bottleMonitorInit, userPlugin, vitalsPlugin } from '@bottle-monitor/core'
import { Layout as AntLayout, Badge, Button, Menu, Space, theme, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { monitoringService } from '../services/monitoringService'

const { Header, Sider, Content } = AntLayout
const { Title } = Typography

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 初始化监控SDK - 全埋点模式
  useEffect(() => {
    bottleMonitorInit({
      dsnURL: '/api/report',
      userId: `demo-user-${Date.now()}`,
      projectId: 'bottle-monitor-demo',
      framework: 'react',
      sampleRate: 1, // 100% 采样率，确保测试数据完整
      plugins: [
        userPlugin({
          options: {
            click: true,
            history: true,
            pageView: true,
            network: true,
            deviceInfo: true,
            uniqueVisitor: true,
            clickContainers: ['test-button', 'demo-button'],
          },
          breadcrumbs: {
            capacity: 50,
            uploadInterval: 30000,
          },
        }),
        vitalsPlugin({
          options: {
            TTFB: true,
            INP: true,
            FPS: true,
            LONGTASK: true,
            Resource: true,
          },
          breadcrumbs: {
            uploadInterval: 30000,
            capacity: 20,
          },
        }),
        abnormalPlugin({
          options: {
            codeError: true,
            unhandledrejection: true,
            resource: true,
            network: true,
            whitescreen: true,
            repeatError: false, // 错误去重
          },
          breadcrumbs: {
            capacity: 10,
            uploadInterval: 10000,
          },
        }),
      ],
      hooks: {
        beforeTransport: (dataArray) => {
          console.log('🚀 监控数据上报:', dataArray.length, '条数据')
          return dataArray
        },
        beforePushBreadcrumb: (breadcrumb) => {
          console.log('📝 面包屑记录:', breadcrumb)
          return breadcrumb
        },
      },
    })

    // 检查服务器连接状态
    checkConnection()
    const interval = setInterval(checkConnection, 10000) // 每10秒检查一次

    return () => {
      clearInterval(interval)
    }
  }, [])

  const checkConnection = async () => {
    const isConnected = await monitoringService.checkConnection()
    setConnectionStatus(isConnected)
    if (isConnected) {
      const statsData = await monitoringService.getStats()
      setStats(statsData)
    }
  }

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/error-monitoring',
      icon: <BugOutlined />,
      label: '错误监控',
    },
    {
      key: '/performance-monitoring',
      icon: <LineChartOutlined />,
      label: '性能监控',
    },
    {
      key: '/user-behavior',
      icon: <UserOutlined />,
      label: '用户行为',
    },
    {
      key: '/data-integration-demo',
      icon: <SyncOutlined />,
      label: '数据联动演示',
    },
    {
      type: 'divider' as const,
    },
    {
      key: '/error-test',
      icon: <ExperimentOutlined />,
      label: '错误测试',
    },
    {
      key: '/performance-test',
      icon: <ClockCircleOutlined />,
      label: '性能测试',
    },
    {
      key: '/user-test',
      icon: <EyeOutlined />,
      label: '用户测试',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const getSelectedKey = () => {
    if (location.pathname === '/')
      return ['/']
    return [location.pathname]
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
        }}
        theme="light"
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}
        >
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'BM' : 'Bottle Monitor'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
          theme="light"
        />
      </Sider>
      <AntLayout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <EyeOutlined /> : <EyeOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Title level={4} style={{ margin: 0 }}>
              {menuItems.find(item => item.key === getSelectedKey()[0])?.label || '仪表盘'}
            </Title>
          </Space>
          <Space>
            <Badge
              status={connectionStatus ? 'success' : 'error'}
              text={connectionStatus ? '已连接' : '未连接'}
            />
            {stats && (
              <Space size="large">
                <Badge count={stats.totalEvents || 0} showZero>
                  <Button size="small" icon={<InfoCircleFilled />}>
                    总事件
                  </Button>
                </Badge>
                <Badge count={stats.errors || 0} showZero>
                  <Button size="small" icon={<BugOutlined />}>
                    错误
                  </Button>
                </Badge>
                <Badge count={stats.vitals || 0} showZero>
                  <Button size="small" icon={<LineChartOutlined />}>
                    性能
                  </Button>
                </Badge>
              </Space>
            )}
          </Space>
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
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
