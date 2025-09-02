import {
  EyeOutlined,
  GlobalOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
  StopOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { getBottleMonitor } from '@bottle-monitor/core'
import { Alert, Badge, Button, Card, Col, Input, message, Row, Select, Slider, Space, Statistic, Switch, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../../services/monitoringService'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const UserTest: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedEvents, setRecordedEvents] = useState<any[]>([])
  const [customEvent, setCustomEvent] = useState('')
  const [eventType, setEventType] = useState('custom')
  const [eventData, setEventData] = useState('')
  const [autoClick, setAutoClick] = useState(false)
  const [clickInterval, setClickInterval] = useState(1000)
  const [autoNavigation, setAutoNavigation] = useState(false)
  const [navigationInterval, setNavigationInterval] = useState(3000)
  const [serverStats, setServerStats] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  // 获取监控实例
  const monitor = getBottleMonitor()

  // 检查服务器连接状态
  useEffect(() => {
    checkServerConnection()
    // 每5秒检查一次连接状态
    const interval = setInterval(checkServerConnection, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkServerConnection = async () => {
    try {
      const connected = await monitoringService.checkConnection()
      setIsConnected(connected)
      if (connected) {
        const stats = await monitoringService.getStats()
        if (stats) {
          setServerStats(stats)
        }
      }
    }
    catch (error) {
      console.error('检查服务器连接失败:', error)
      setIsConnected(false)
    }
  }

  // 开始记录用户行为
  const startRecording = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setIsRecording(true)
    setRecordedEvents([])
    message.success('开始记录用户行为')

    // 记录开始事件
    if (monitor) {
      monitor.track('recording_started', {
        timestamp: Date.now(),
        source: 'UserTest',
        category: 'user',
        type: 'test_start',
      })
    }
  }

  // 停止记录
  const stopRecording = () => {
    setIsRecording(false)
    message.info('停止记录用户行为')

    // 记录停止事件
    if (monitor) {
      monitor.track('recording_stopped', {
        timestamp: Date.now(),
        eventCount: recordedEvents.length,
        source: 'UserTest',
        category: 'user',
        type: 'test_stop',
      })
    }

    // 立即同步数据到服务器
    syncDataToServer()
  }

  // 同步数据到服务器
  const syncDataToServer = async () => {
    try {
      await checkServerConnection()
      message.success('数据已同步到服务器')
    }
    catch (error) {
      console.error('同步数据失败:', error)
      message.warning('数据同步失败，请检查网络连接')
    }
  }

  // 清理记录
  const clearRecording = () => {
    setRecordedEvents([])
    message.success('记录已清理')
  }

  // 记录点击事件
  const recordClick = (target: string, x: number, y: number) => {
    const event = {
      type: 'click',
      target,
      x,
      y,
      timestamp: Date.now(),
    }

    setRecordedEvents(prev => [...prev, event])

    if (monitor) {
      // 上报到监控SDK
      monitor.track('test_click', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'click',
      })

      // 直接上报到后端服务器
      reportToServer('click', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'click',
      })
    }
  }

  // 记录页面访问
  const recordPageView = (url: string) => {
    const event = {
      type: 'pageView',
      url,
      timestamp: Date.now(),
    }

    setRecordedEvents(prev => [...prev, event])

    if (monitor) {
      monitor.track('test_page_view', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'pageView',
      })

      // 直接上报到后端服务器
      reportToServer('pageView', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'pageView',
      })
    }
  }

  // 记录路由变化
  const recordRouteChange = (from: string, to: string) => {
    const event = {
      type: 'routeChange',
      from,
      to,
      timestamp: Date.now(),
    }

    setRecordedEvents(prev => [...prev, event])

    if (monitor) {
      monitor.track('test_route_change', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'history',
      })

      // 直接上报到后端服务器
      reportToServer('history', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'history',
      })
    }
  }

  // 记录网络请求
  const recordNetworkRequest = (method: string, url: string, status: number) => {
    const event = {
      type: 'network',
      method,
      url,
      status,
      timestamp: Date.now(),
    }

    setRecordedEvents(prev => [...prev, event])

    if (monitor) {
      monitor.track('test_network', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'network',
      })

      // 直接上报到后端服务器
      reportToServer('network', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'network',
      })
    }
  }

  // 记录自定义事件
  const recordCustomEvent = () => {
    if (!customEvent.trim()) {
      message.warning('请输入事件名称')
      return
    }

    const event = {
      type: eventType,
      name: customEvent,
      data: eventData,
      timestamp: Date.now(),
    }

    setRecordedEvents(prev => [...prev, event])

    if (monitor) {
      monitor.track('test_custom_event', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'custom',
      })

      // 直接上报到后端服务器
      reportToServer('custom', {
        ...event,
        source: 'UserTest',
        category: 'user',
        type: 'custom',
      })
    }

    message.success('自定义事件已记录')
    setCustomEvent('')
    setEventData('')
  }

  // 直接上报数据到后端服务器
  const reportToServer = async (type: string, data: any) => {
    if (!isConnected) {
      console.warn('服务器未连接，无法上报数据')
      return
    }

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'user',
          type,
          data,
          timestamp: Date.now(),
          source: 'UserTest',
        }),
      })

      if (response.ok) {
        console.log(`数据上报成功: ${type}`, data)
      }
      else {
        console.error(`数据上报失败: ${type}`, response.status)
      }
    }
    catch (error) {
      console.error(`数据上报错误: ${type}`, error)
    }
  }

  // 自动点击测试
  useEffect(() => {
    if (!autoClick || !isRecording)
      return

    const interval = setInterval(() => {
      const targets = ['测试按钮1', '测试按钮2', '测试按钮3', '测试链接1', '测试链接2']
      const randomTarget = targets[Math.floor(Math.random() * targets.length)]
      const x = Math.floor(Math.random() * 800)
      const y = Math.floor(Math.random() * 600)

      recordClick(randomTarget, x, y)
    }, clickInterval)

    return () => clearInterval(interval)
  }, [autoClick, isRecording, clickInterval])

  // 自动导航测试
  useEffect(() => {
    if (!autoNavigation || !isRecording)
      return

    const routes = [
      { from: '/', to: '/dashboard' },
      { from: '/dashboard', to: '/profile' },
      { from: '/profile', to: '/settings' },
      { from: '/settings', to: '/help' },
      { from: '/help', to: '/' },
    ]

    let currentIndex = 0

    const interval = setInterval(() => {
      const route = routes[currentIndex]
      recordRouteChange(route.from, route.to)

      currentIndex = (currentIndex + 1) % routes.length
    }, navigationInterval)

    return () => clearInterval(interval)
  }, [autoNavigation, isRecording, navigationInterval])

  // 模拟用户行为序列
  const simulateUserBehavior = () => {
    if (!isRecording) {
      message.warning('请先开始记录')
      return
    }

    const behaviors = [
      () => recordClick('登录按钮', 100, 200),
      () => recordPageView('/dashboard'),
      () => recordRouteChange('/login', '/dashboard'),
      () => recordNetworkRequest('GET', '/api/user/profile', 200),
      () => recordClick('设置按钮', 300, 150),
      () => recordRouteChange('/dashboard', '/settings'),
      () => recordNetworkRequest('POST', '/api/user/settings', 200),
      () => recordClick('返回按钮', 50, 50),
      () => recordRouteChange('/settings', '/dashboard'),
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < behaviors.length) {
        behaviors[index]()
        index++
      }
      else {
        clearInterval(interval)
        message.success('用户行为序列模拟完成')
      }
    }, 500)
  }

  // 模拟表单提交
  const simulateFormSubmission = () => {
    if (!isRecording) {
      message.warning('请先开始记录')
      return
    }

    const formEvents = [
      () => recordClick('用户名输入框', 200, 100),
      () => recordClick('密码输入框', 200, 150),
      () => recordClick('记住我复选框', 180, 200),
      () => recordClick('登录按钮', 200, 250),
      () => recordNetworkRequest('POST', '/api/auth/login', 200),
      () => recordPageView('/dashboard'),
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < formEvents.length) {
        formEvents[index]()
        index++
      }
      else {
        clearInterval(interval)
        message.success('表单提交模拟完成')
      }
    }, 300)
  }

  // 模拟购物车操作
  const simulateShoppingCart = () => {
    if (!isRecording) {
      message.warning('请先开始记录')
      return
    }

    const cartEvents = [
      () => recordClick('商品1', 100, 100),
      () => recordClick('添加到购物车', 100, 150),
      () => recordNetworkRequest('POST', '/api/cart/add', 200),
      () => recordClick('商品2', 200, 100),
      () => recordClick('添加到购物车', 200, 150),
      () => recordNetworkRequest('POST', '/api/cart/add', 200),
      () => recordClick('购物车图标', 300, 50),
      () => recordPageView('/cart'),
      () => recordClick('结算按钮', 250, 300),
      () => recordPageView('/checkout'),
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < cartEvents.length) {
        cartEvents[index]()
        index++
      }
      else {
        clearInterval(interval)
        message.success('购物车操作模拟完成')
      }
    }, 400)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>用户行为测试页面</Title>
        <Text type="secondary">
          测试各种用户行为监控功能，包括点击、页面访问、路由变化、网络请求等
        </Text>
      </div>

      <Alert
        message="测试说明"
        description="这个页面用于测试用户行为监控功能。点击各种按钮和链接，或者使用自动测试功能来生成用户行为数据。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 记录控制 */}
      <Card title="记录控制" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} style={{ alignItems: 'center' }}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={startRecording}
              disabled={isRecording || !isConnected}
              block
            >
              开始记录
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              danger
              icon={<StopOutlined />}
              onClick={stopRecording}
              disabled={!isRecording}
              block
            >
              停止记录
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              icon={<ReloadOutlined />}
              onClick={clearRecording}
              disabled={recordedEvents.length === 0}
              block
            >
              清理记录
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              icon={<SyncOutlined />}
              onClick={syncDataToServer}
              disabled={!isConnected}
              block
            >
              同步数据
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              icon={<ReloadOutlined />}
              onClick={checkServerConnection}
              block
            >
              刷新状态
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="dashed"
              icon={<PlayCircleOutlined />}
              onClick={() => {
                // 快速测试数据上报
                if (isConnected) {
                  recordClick('快速测试按钮', 100, 100)
                  recordPageView('/quick-test')
                  recordRouteChange('/current', '/quick-test')
                  message.success('快速测试完成，请查看统计变化')
                }
                else {
                  message.error('请先连接服务器')
                }
              }}
              disabled={!isConnected}
              block
            >
              快速测试
            </Button>
          </Col>
        </Row>

        {isRecording && (
          <Alert
            message="正在记录中"
            description={`已记录 ${recordedEvents.length} 个事件`}
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        {!isConnected && (
          <Alert
            message="服务器未连接"
            description="请检查监控服务器是否正常运行"
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      {/* 手动行为测试 */}
      <Card title="手动行为测试" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<MoreOutlined />}
              onClick={() => recordClick('测试按钮', 100, 100)}
              disabled={!isRecording}
              block
            >
              记录点击事件
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => recordPageView('/test-page')}
              disabled={!isRecording}
              block
            >
              记录页面访问
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<GlobalOutlined />}
              onClick={() => recordRouteChange('/current', '/next')}
              disabled={!isRecording}
              block
            >
              记录路由变化
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              icon={<GlobalOutlined />}
              onClick={() => recordNetworkRequest('GET', '/api/test', 200)}
              disabled={!isRecording}
              block
            >
              记录网络请求
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              icon={<UserOutlined />}
              onClick={() => recordNetworkRequest('POST', '/api/user', 201)}
              disabled={!isRecording}
              block
            >
              记录POST请求
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              icon={<GlobalOutlined />}
              onClick={() => recordNetworkRequest('GET', '/api/error', 500)}
              disabled={!isRecording}
              block
            >
              记录错误请求
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 自动行为测试 */}
      <Card title="自动行为测试" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="自动点击">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>启用自动点击：</Text>
                  <Switch
                    checked={autoClick}
                    onChange={setAutoClick}
                    disabled={!isRecording}
                  />
                </div>
                <div>
                  <Text>点击间隔：</Text>
                  <Slider
                    min={500}
                    max={5000}
                    step={100}
                    value={clickInterval}
                    onChange={setClickInterval}
                    disabled={!autoClick}
                    style={{ width: 200, marginLeft: 16 }}
                  />
                  <Text>
                    {clickInterval}
                    ms
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="自动导航">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>启用自动导航：</Text>
                  <Switch
                    checked={autoNavigation}
                    onChange={setAutoNavigation}
                    disabled={!isRecording}
                  />
                </div>
                <div>
                  <Text>导航间隔：</Text>
                  <Slider
                    min={1000}
                    max={10000}
                    step={500}
                    value={navigationInterval}
                    onChange={setNavigationInterval}
                    disabled={!autoNavigation}
                    style={{ width: 200, marginLeft: 16 }}
                  />
                  <Text>
                    {navigationInterval}
                    ms
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 场景模拟 */}
      <Card title="场景模拟" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={simulateUserBehavior}
              disabled={!isRecording}
              block
            >
              用户行为序列
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={simulateFormSubmission}
              disabled={!isRecording}
              block
            >
              表单提交
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={simulateShoppingCart}
              disabled={!isRecording}
              block
            >
              购物车操作
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 自定义事件 */}
      <Card title="自定义事件" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>事件类型：</Text>
            <Select
              value={eventType}
              onChange={setEventType}
              style={{ width: 120, marginLeft: 8 }}
            >
              <Option value="custom">自定义</Option>
              <Option value="business">业务</Option>
              <Option value="analytics">分析</Option>
              <Option value="debug">调试</Option>
            </Select>
          </div>
          <Input
            placeholder="事件名称..."
            value={customEvent}
            onChange={e => setCustomEvent(e.target.value)}
          />
          <TextArea
            rows={3}
            placeholder="事件数据 (JSON格式)..."
            value={eventData}
            onChange={e => setEventData(e.target.value)}
          />
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={recordCustomEvent}
            disabled={!customEvent.trim() || !isRecording}
          >
            记录自定义事件
          </Button>
        </Space>
      </Card>

      {/* 记录结果 */}
      <Card title="记录结果">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Card size="small" title="本地记录">
                <Statistic
                  title="事件数量"
                  value={recordedEvents.length}
                  suffix="个"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" title="服务器状态">
                <Statistic
                  title="连接状态"
                  value={isConnected ? '已连接' : '未连接'}
                  valueStyle={{ color: isConnected ? '#3f8600' : '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" title="服务器统计">
                <Statistic
                  title="总事件数"
                  value={serverStats?.totalEvents || 0}
                  suffix="个"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Card size="small" title="用户行为数据">
                <Statistic
                  title="用户行为"
                  value={serverStats?.userActions || 0}
                  suffix="个"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" title="错误数据">
                <Statistic
                  title="错误数量"
                  value={serverStats?.errors || 0}
                  suffix="个"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" title="性能数据">
                <Statistic
                  title="性能指标"
                  value={serverStats?.vitals || 0}
                  suffix="个"
                />
              </Card>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>
              已记录
              {recordedEvents.length}
              {' '}
              个事件
            </Text>
            <Button
              size="small"
              icon={<SettingOutlined />}
              onClick={() => console.log('记录的事件:', recordedEvents)}
            >
              查看详情
            </Button>
          </div>

          {recordedEvents.length > 0 && (
            <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #f0f0f0', padding: 16, borderRadius: 4 }}>
              {recordedEvents.map((event, index) => (
                <div key={index} style={{ marginBottom: 8, padding: 8, background: '#f9f9f9', borderRadius: 4 }}>
                  <Text strong>{event.type}</Text>
                  <br />
                  <Text type="secondary">
                    {new Date(event.timestamp).toLocaleTimeString()}
                    {' '}
                    -
                    {event.target && ` 目标: ${event.target}`}
                    {event.url && ` URL: ${event.url}`}
                    {event.method && ` ${event.method} ${event.url}`}
                    {event.name && ` 名称: ${event.name}`}
                  </Text>
                </div>
              ))}
            </div>
          )}

          {recordedEvents.length === 0 && (
            <Text type="secondary">暂无记录的事件</Text>
          )}
        </Space>
      </Card>

      {/* 服务器状态 */}
      <Card title="服务器状态" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              status={isConnected ? 'success' : 'error'}
              text={isConnected ? '已连接' : '未连接'}
            />
            <SyncOutlined
              style={{ marginLeft: 8, color: isConnected ? 'green' : 'red' }}
            />
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={checkServerConnection}
                block
              >
                测试连接
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button
                icon={<SyncOutlined />}
                onClick={syncDataToServer}
                disabled={!isConnected}
                block
              >
                同步数据
              </Button>
            </Col>
          </Row>

          {serverStats && (
            <div style={{ marginTop: 16 }}>
              <Text strong>服务器统计:</Text>
              <pre style={{ background: '#f0f0f0', padding: 10, borderRadius: 4, maxHeight: 200, overflowY: 'auto' }}>
                {JSON.stringify(serverStats, null, 2)}
              </pre>
            </div>
          )}

          {/* 数据上报状态监控 */}
          <div style={{ marginTop: 16 }}>
            <Text strong>数据上报状态:</Text>
            <div style={{ marginTop: 8 }}>
              <Alert
                message="实时监控"
                description={(
                  <div>
                    <p>
                      • 本地记录:
                      {recordedEvents.length}
                      {' '}
                      个事件
                    </p>
                    <p>
                      • 服务器统计:
                      {serverStats?.totalEvents || 0}
                      {' '}
                      个事件
                    </p>
                    <p>
                      • 数据同步状态:
                      {isConnected ? '正常' : '异常'}
                    </p>
                    <p>
                      • 最后更新:
                      {serverStats?.lastUpdate ? new Date(serverStats.lastUpdate).toLocaleTimeString() : '未知'}
                    </p>
                  </div>
                )}
                type={isConnected ? 'success' : 'error'}
                showIcon
              />
            </div>
          </div>
        </Space>
      </Card>

      {/* 注意事项 */}
      <Card title="注意事项" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">
            用户行为测试完成后，可以在以下页面查看结果：
          </Text>
          <ul>
            <li><Text>用户行为页面：查看所有用户行为数据</Text></li>
            <li><Text>仪表盘：查看用户行为统计和趋势</Text></li>
            <li><Text>控制台：查看本地行为日志</Text></li>
          </ul>

          <Alert
            message="前后端联调说明"
            description="1. 确保监控服务器正在运行\n2. 测试数据会自动上报到后端服务器\n3. 可以在用户行为页面实时查看测试数据统计\n4. 使用'同步数据'按钮手动同步数据到服务器"
            type="info"
            showIcon
          />

          <Alert
            message="重要提醒"
            description="1. 请先开始记录再进行测试\n2. 自动测试功能会持续生成数据，请及时停止\n3. 所有行为数据都会上报到监控服务器\n4. 可以在浏览器控制台查看详细的事件信息"
            type="warning"
            showIcon
          />
        </Space>
      </Card>
    </div>
  )
}

export default UserTest
