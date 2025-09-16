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
import { Alert, Button, Card, Col, Input, message, Row, Select, Slider, Space, Statistic, Switch, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../../services/monitoringService'
import { TestUtils } from '../../utils/testUtils'

const { Title, Text } = Typography
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

  // 检查服务器连接状态
  useEffect(() => {
    checkServerConnection()
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
    message.success('开始记录用户行为 - SDK 将自动捕获所有用户行为')
  }

  // 停止记录
  const stopRecording = () => {
    setIsRecording(false)
    message.info('停止记录用户行为')
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

  // 记录点击事件 - 纯业务逻辑，SDK 自动捕获
  const recordClick = (target: string, x: number, y: number) => {
    const event = {
      type: 'click',
      target,
      x,
      y,
      timestamp: Date.now(),
    }
    setRecordedEvents(prev => [...prev, event])
    console.log('用户点击事件:', event)
  }

  // 记录页面访问 - 纯业务逻辑，SDK 自动捕获
  const recordPageView = (url: string) => {
    const event = {
      type: 'pageView',
      url,
      timestamp: Date.now(),
    }
    setRecordedEvents(prev => [...prev, event])
    console.log('页面访问事件:', event)
  }

  // 记录路由变化 - 纯业务逻辑，SDK 自动捕获
  const recordRouteChange = (from: string, to: string) => {
    const event = {
      type: 'routeChange',
      from,
      to,
      timestamp: Date.now(),
    }
    setRecordedEvents(prev => [...prev, event])
    console.log('路由变化事件:', event)
  }

  // 记录网络请求 - 纯业务逻辑，SDK 自动捕获
  const recordNetworkRequest = (method: string, url: string, status: number) => {
    const event = {
      type: 'network',
      method,
      url,
      status,
      timestamp: Date.now(),
    }
    setRecordedEvents(prev => [...prev, event])
    console.log('网络请求事件:', event)

    // 实际发起网络请求，SDK 会自动捕获
    fetch(url, { method })
      .then((response) => {
        console.log(`网络请求 ${method} ${url} 完成，状态: ${response.status}`)
      })
      .catch((error) => {
        console.error(`网络请求 ${method} ${url} 失败:`, error)
      })
  }

  // 记录自定义事件 - 纯业务逻辑
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
    console.log('自定义事件:', event)
    message.success('自定义事件已记录')
    setCustomEvent('')
    setEventData('')
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
    TestUtils.simulateUserBehavior()
    message.success('用户行为序列模拟已启动')
  }

  // 模拟表单提交
  const simulateFormSubmission = () => {
    if (!isRecording) {
      message.warning('请先开始记录')
      return
    }
    TestUtils.simulateFormSubmission()
    message.success('表单提交模拟已启动')
  }

  // 模拟购物车操作
  const simulateShoppingCart = () => {
    if (!isRecording) {
      message.warning('请先开始记录')
      return
    }
    TestUtils.simulateShoppingCart()
    message.success('购物车操作模拟已启动')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>用户行为测试页面</Title>
        <Text type="secondary">
          测试各种用户行为监控功能，SDK 将自动捕获所有用户行为，无需手动埋点
        </Text>
      </div>

      <Alert
        message="全埋点模式说明"
        description="此页面采用全埋点模式，SDK 会自动捕获所有用户行为，包括点击、页面访问、路由变化、网络请求等。您只需要触发相应的用户行为，SDK 会自动处理监控逻辑。"
        type="success"
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
                if (isConnected) {
                  recordClick('快速测试按钮', 100, 100)
                  recordPageView('/quick-test')
                  recordRouteChange('/current', '/quick-test')
                  message.success('快速测试完成，SDK 已自动捕获所有事件')
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
            description={`已记录 ${recordedEvents.length} 个事件，SDK 正在自动捕获用户行为`}
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

      {/* 注意事项 */}
      <Card title="全埋点模式说明" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="全埋点优势"
            description="1. 无需手动埋点，SDK 自动捕获所有用户行为\n2. 业务代码与监控代码完全分离\n3. 减少开发工作量，提高开发效率\n4. 确保数据收集的完整性和准确性"
            type="success"
            showIcon
          />

          <Alert
            message="使用说明"
            description="1. 点击'开始记录'后，SDK 会自动捕获所有用户行为\n2. 点击各种按钮和链接，SDK 会自动记录点击事件\n3. 发起网络请求，SDK 会自动记录网络请求\n4. 页面跳转，SDK 会自动记录路由变化\n5. 所有数据会自动上报到监控服务器"
            type="info"
            showIcon
          />

          <Alert
            message="注意事项"
            description="1. 请先开始记录再进行测试\n2. 自动测试功能会持续生成数据，请及时停止\n3. 所有行为数据都会自动上报到监控服务器\n4. 可以在浏览器控制台查看详细的事件信息"
            type="warning"
            showIcon
          />
        </Space>
      </Card>
    </div>
  )
}

export default UserTest
