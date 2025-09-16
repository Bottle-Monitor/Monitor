import {
  ClockCircleOutlined,
  LineChartOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, message, Row, Space, Statistic, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../../services/monitoringService'
import { TestUtils } from '../../utils/testUtils'

const { Title, Text } = Typography

const PerformanceTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState('')
  const [testResults, setTestResults] = useState<any>({})
  const [fps] = useState(60)
  const [_serverStats, setServerStats] = useState<any>(null)
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

  // 同步数据到服务器
  const _syncDataToServer = async () => {
    try {
      await checkServerConnection()
      message.success('数据已同步到服务器')
    }
    catch (error) {
      console.error('同步数据失败:', error)
      message.warning('数据同步失败，请检查网络连接')
    }
  }

  // 模拟长任务 - 纯业务逻辑，SDK 自动捕获性能数据
  const simulateLongTask = (duration: number) => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest(`长任务测试 (${duration}ms)`)
    const executionTime = TestUtils.simulateLongTask(duration)

    setTestResults((prev: any) => ({
      ...prev,
      longTask: { duration: executionTime, timestamp: Date.now() },
    }))

    message.success(`长任务完成，耗时: ${executionTime.toFixed(2)}ms，SDK 已自动捕获性能数据`)
    setCurrentTest('')
  }

  // 模拟内存泄漏 - 纯业务逻辑，SDK 自动捕获性能数据
  const simulateMemoryLeak = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest('内存泄漏测试')
    TestUtils.simulateMemoryLeak(10000)

    setTimeout(() => {
      setCurrentTest('')
      message.success('内存泄漏测试完成，SDK 已自动捕获性能数据')
    }, 10000)
  }

  // 模拟网络延迟 - 纯业务逻辑，SDK 自动捕获性能数据
  const simulateNetworkDelay = async (delay: number) => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest(`网络延迟测试 (${delay}ms)`)
    const actualDelay = await TestUtils.simulateNetworkDelay(delay)

    setTestResults((prev: any) => ({
      ...prev,
      networkDelay: { expected: delay, actual: actualDelay, timestamp: Date.now() },
    }))

    message.success(`网络延迟测试完成，实际延迟: ${actualDelay.toFixed(2)}ms，SDK 已自动捕获性能数据`)
    setCurrentTest('')
  }

  // 模拟渲染性能 - 纯业务逻辑，SDK 自动捕获性能数据
  const simulateRenderPerformance = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest('渲染性能测试')
    const renderTime = TestUtils.simulateRenderPerformance()

    setTestResults((prev: any) => ({
      ...prev,
      renderPerformance: { renderTime, timestamp: Date.now() },
    }))

    message.success(`渲染性能测试完成，耗时: ${renderTime.toFixed(2)}ms，SDK 已自动捕获性能数据`)
    setCurrentTest('')
  }

  // 模拟FPS下降 - 纯业务逻辑，SDK 自动捕获性能数据
  const simulateFpsDrop = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    setCurrentTest('FPS下降测试')
    TestUtils.simulateFpsDrop(5000)

    setTimeout(() => {
      setCurrentTest('')
      message.success('FPS下降测试完成，SDK 已自动捕获性能数据')
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
    message.success('批量性能测试完成，SDK 已自动捕获所有性能数据')
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
          测试各种性能监控功能，SDK 将自动捕获所有性能数据，无需手动埋点
        </Text>
      </div>

      <Alert
        message="全埋点性能监控说明"
        description="此页面采用全埋点模式，SDK 会自动捕获所有性能指标，包括长任务、内存使用、网络延迟、渲染性能、FPS 等。您只需要触发相应的性能测试，SDK 会自动处理监控逻辑。"
        type="success"
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
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" title="服务器状态">
              <Text type={isConnected ? 'success' : 'danger'}>
                {isConnected ? '已连接' : '未连接'}
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 全埋点性能监控说明 */}
      <Card title="全埋点性能监控说明" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="全埋点优势"
            description="1. 无需手动埋点，SDK 自动捕获所有性能指标\n2. 业务代码与监控代码完全分离\n3. 减少开发工作量，提高开发效率\n4. 确保性能数据收集的完整性和准确性"
            type="success"
            showIcon
          />

          <Alert
            message="使用说明"
            description="1. 点击各种性能测试按钮，SDK 会自动捕获性能数据\n2. 长任务会被自动检测并上报\n3. 内存使用情况会被自动监控\n4. 网络延迟会被自动测量\n5. 渲染性能会被自动分析"
            type="info"
            showIcon
          />

          <Alert
            message="注意事项"
            description="1. 某些测试可能会影响页面性能，请谨慎使用\n2. 内存泄漏测试会创建大量对象，测试完成后会自动清理\n3. 长任务测试会阻塞主线程，请避免在重要操作时使用\n4. 所有测试数据都会自动上报到监控服务器"
            type="warning"
            showIcon
          />
        </Space>
      </Card>
    </div>
  )
}

export default PerformanceTest
