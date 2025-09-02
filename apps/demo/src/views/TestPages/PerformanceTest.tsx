import {
  ClockCircleOutlined,
  LineChartOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { getBottleMonitor } from '@bottle-monitor/core'
import { Alert, Button, Card, Col, message, Row, Space, Statistic, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../../services/monitoringService'

const { Title, Text } = Typography

const PerformanceTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState('')
  const [testResults, setTestResults] = useState<any>({})
  const [fps, setFps] = useState(60)
  const [serverStats, setServerStats] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  // 获取监控实例
  const monitor = getBottleMonitor()

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
          category: 'performance',
          type,
          data,
          timestamp: Date.now(),
          source: 'PerformanceTest',
        }),
      })

      if (response.ok) {
        console.log(`性能数据上报成功: ${type}`, data)
      }
      else {
        console.error(`性能数据上报失败: ${type}`, response.status)
      }
    }
    catch (error) {
      console.error(`性能数据上报错误: ${type}`, error)
    }
  }

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

  // 模拟长任务
  const simulateLongTask = (duration: number) => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    const startTime = performance.now()
    setCurrentTest(`长任务测试 (${duration}ms)`)

    // 执行CPU密集型任务
    let result = 0
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i) * Math.sin(i)
    }

    const endTime = performance.now()
    const executionTime = endTime - startTime

    if (monitor) {
      monitor.track('long_task', {
        duration: executionTime,
        startTime,
        endTime,
        type: 'simulation',
        result: result.toString().substring(0, 10),
        category: 'performance',
        source: 'PerformanceTest',
      })

      // 直接上报到后端服务器
      reportToServer('longTask', {
        duration: executionTime,
        startTime,
        endTime,
        type: 'simulation',
        result: result.toString().substring(0, 10),
        category: 'performance',
        source: 'PerformanceTest',
      })
    }

    setTestResults((prev: any) => ({
      ...prev,
      longTask: { duration: executionTime, timestamp: Date.now() },
    }))

    message.success(`长任务完成，耗时: ${executionTime.toFixed(2)}ms`)
    setCurrentTest('')
  }

  // 模拟内存泄漏
  const simulateMemoryLeak = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest('内存泄漏测试')

    // 创建大量对象但不释放
    const objects: any[] = []
    const interval = setInterval(() => {
      for (let i = 0; i < 1000; i++) {
        objects.push({
          id: Date.now() + i,
          data: Array.from({ length: 1000 }).fill('memory leak test'),
          timestamp: Date.now(),
        })
      }

      if (monitor) {
        monitor.track('memory_leak', {
          objectCount: objects.length,
          memoryUsage: objects.length * 1000,
          timestamp: Date.now(),
          category: 'performance',
          source: 'PerformanceTest',
        })

        // 直接上报到后端服务器
        reportToServer('memoryLeak', {
          objectCount: objects.length,
          memoryUsage: objects.length * 1000,
          timestamp: Date.now(),
          category: 'performance',
          source: 'PerformanceTest',
        })
      }

      setTestResults((prev: any) => ({
        ...prev,
        memoryLeak: { objectCount: objects.length, timestamp: Date.now() },
      }))
    }, 100)

    // 10秒后停止
    setTimeout(() => {
      clearInterval(interval)
      setCurrentTest('')
      message.success(`内存泄漏测试完成，创建了 ${objects.length} 个对象`)
    }, 10000)
  }

  // 模拟网络延迟
  const simulateNetworkDelay = async (delay: number) => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest(`网络延迟测试 (${delay}ms)`)

    const startTime = performance.now()

    try {
      // 模拟网络请求
      await new Promise<void>(resolve => setTimeout(resolve, delay))

      const endTime = performance.now()
      const actualDelay = endTime - startTime

      if (monitor) {
        monitor.track('network_delay', {
          expectedDelay: delay,
          actualDelay,
          timestamp: Date.now(),
          category: 'performance',
          source: 'PerformanceTest',
        })

        // 直接上报到后端服务器
        reportToServer('networkDelay', {
          expectedDelay: delay,
          actualDelay,
          timestamp: Date.now(),
          category: 'performance',
          source: 'PerformanceTest',
        })
      }

      setTestResults((prev: any) => ({
        ...prev,
        networkDelay: { expected: delay, actual: actualDelay, timestamp: Date.now() },
      }))

      message.success(`网络延迟测试完成，实际延迟: ${actualDelay.toFixed(2)}ms`)
    }
    catch (_error) {
      message.error('网络延迟测试失败')
    }

    setCurrentTest('')
  }

  // 模拟渲染性能
  const simulateRenderPerformance = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest('渲染性能测试')

    const startTime = performance.now()

    // 创建大量DOM元素
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'

    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div')
      div.textContent = `Element ${i}`
      div.style.padding = '10px'
      div.style.margin = '5px'
      div.style.border = '1px solid #ccc'
      container.appendChild(div)
    }

    document.body.appendChild(container)

    // 强制重排和重绘
    void container.offsetHeight

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // 清理
    document.body.removeChild(container)

    if (monitor) {
      monitor.track('render_performance', {
        renderTime,
        elementCount: 1000,
        timestamp: Date.now(),
        category: 'performance',
        source: 'PerformanceTest',
      })
    }

    setTestResults((prev: any) => ({
      ...prev,
      renderPerformance: { renderTime, timestamp: Date.now() },
    }))

    message.success(`渲染性能测试完成，耗时: ${renderTime.toFixed(2)}ms`)
    setCurrentTest('')
  }

  // 模拟FPS下降
  const simulateFpsDrop = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest('FPS下降测试')

    let frameCount = 0
    let lastTime = performance.now()
    const targetFps = 30 // 目标30fps

    const animate = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        const actualFps = frameCount
        frameCount = 0
        lastTime = currentTime

        if (monitor) {
          monitor.track('fps_drop', {
            targetFps,
            actualFps,
            timestamp: Date.now(),
            category: 'performance',
            source: 'PerformanceTest',
          })
        }

        setTestResults((prev: any) => ({
          ...prev,
          fpsDrop: { target: targetFps, actual: actualFps, timestamp: Date.now() },
        }))

        setFps(actualFps)
      }

      // 模拟重计算
      for (let i = 0; i < 10000; i++) {
        void (Math.sqrt(i) * Math.sin(i))
      }

      if (currentTest === 'FPS下降测试') {
        requestAnimationFrame(animate)
      }
    }

    animate()

    // 5秒后停止
    setTimeout(() => {
      setCurrentTest('')
      message.success('FPS下降测试完成')
    }, 5000)
  }

  // 批量性能测试
  const runBatchPerformanceTest = async () => {
    if (isRunning)
      return

    setIsRunning(true)
    const tests = [
      () => simulateLongTask(100),
      () => simulateNetworkDelay(200),
      () => simulateRenderPerformance(),
      () => simulateMemoryLeak(),
    ]

    for (let i = 0; i < tests.length; i++) {
      if (!isRunning)
        break

      setCurrentTest(`批量测试 ${i + 1}/${tests.length}`)
      await tests[i]()
      await new Promise<void>(resolve => setTimeout(resolve, 1000))
    }

    setIsRunning(false)
    setCurrentTest('')
    message.success('批量性能测试完成')
  }

  // 停止所有测试
  const stopAllTests = () => {
    setIsRunning(false)
    setCurrentTest('')
    message.info('已停止所有测试')
  }

  // 清理测试结果
  const clearTestResults = () => {
    setTestResults({})
    message.success('测试结果已清理')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>性能测试页面</Title>
        <Text type="secondary">
          测试各种性能监控功能，包括长任务、内存泄漏、网络延迟、渲染性能等
        </Text>
      </div>

      <Alert
        message="测试说明"
        description="点击下面的按钮可以触发各种性能测试，这些测试会生成性能数据并被监控SDK捕获。请确保监控服务器正在运行。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 测试控制 */}
      <Card title="测试控制" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} style={{ alignItems: 'center' }}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={runBatchPerformanceTest}
              loading={isRunning}
              disabled={isRunning}
              block
            >
              运行批量测试
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              danger
              icon={<StopOutlined />}
              onClick={stopAllTests}
              disabled={!isRunning}
              block
            >
              停止所有测试
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              icon={<ReloadOutlined />}
              onClick={clearTestResults}
              block
            >
              清理结果
            </Button>
          </Col>
        </Row>

        {currentTest && (
          <Alert
            message="当前测试"
            description={currentTest}
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      {/* 基础性能测试 */}
      <Card title="基础性能测试" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<ClockCircleOutlined />}
              onClick={() => simulateLongTask(100)}
              disabled={isRunning}
              block
            >
              长任务测试 (100ms)
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => simulateNetworkDelay(200)}
              disabled={isRunning}
              block
            >
              网络延迟测试 (200ms)
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<LineChartOutlined />}
              onClick={simulateRenderPerformance}
              disabled={isRunning}
              block
            >
              渲染性能测试
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 高级性能测试 */}
      <Card title="高级性能测试" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              icon={<LineChartOutlined />}
              onClick={simulateMemoryLeak}
              disabled={isRunning}
              block
            >
              内存泄漏测试
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              icon={<ThunderboltOutlined />}
              onClick={simulateFpsDrop}
              disabled={isRunning}
              block
            >
              FPS下降测试
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              icon={<ClockCircleOutlined />}
              onClick={() => simulateLongTask(500)}
              disabled={isRunning}
              block
            >
              长任务测试 (500ms)
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 测试结果 */}
      <Card title="测试结果">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" title="长任务">
              {testResults.longTask
                ? (
                    <Statistic
                      title="执行时间"
                      value={testResults.longTask.duration}
                      suffix="ms"
                      precision={2}
                    />
                  )
                : (
                    <Text type="secondary">未测试</Text>
                  )}
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" title="网络延迟">
              {testResults.networkDelay
                ? (
                    <Statistic
                      title="实际延迟"
                      value={testResults.networkDelay.actual}
                      suffix="ms"
                      precision={2}
                    />
                  )
                : (
                    <Text type="secondary">未测试</Text>
                  )}
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" title="渲染性能">
              {testResults.renderPerformance
                ? (
                    <Statistic
                      title="渲染时间"
                      value={testResults.renderPerformance.renderTime}
                      suffix="ms"
                      precision={2}
                    />
                  )
                : (
                    <Text type="secondary">未测试</Text>
                  )}
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" title="内存泄漏">
              {testResults.memoryLeak
                ? (
                    <Statistic
                      title="对象数量"
                      value={testResults.memoryLeak.objectCount}
                      suffix="个"
                    />
                  )
                : (
                    <Text type="secondary">未测试</Text>
                  )}
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" title="FPS">
              <Statistic
                title="当前FPS"
                value={fps}
                suffix="fps"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" title="测试状态">
              <Text type={isRunning ? 'success' : 'secondary'}>
                {isRunning ? '运行中' : '已停止'}
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 注意事项 */}
      <Card title="注意事项" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">
            性能测试完成后，可以在以下页面查看结果：
          </Text>
          <ul>
            <li><Text>性能监控页面：查看所有性能指标</Text></li>
            <li><Text>仪表盘：查看性能统计和趋势</Text></li>
            <li><Text>控制台：查看本地性能日志</Text></li>
          </ul>
          <Alert
            message="重要提醒"
            description="1. 某些测试可能会影响页面性能，请谨慎使用\n2. 内存泄漏测试会创建大量对象，测试完成后会自动清理\n3. 长任务测试会阻塞主线程，请避免在重要操作时使用\n4. 所有测试数据都会上报到监控服务器"
            type="warning"
            showIcon
          />
        </Space>
      </Card>
    </div>
  )
}

export default PerformanceTest
