import {
  BugOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Input, message, Row, Select, Space, Statistic, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../../services/monitoringService'
import { TestUtils } from '../../utils/testUtils'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const ErrorTest: React.FC = () => {
  const [customError, setCustomError] = useState('')
  const [errorLevel, setErrorLevel] = useState('error')
  const [isGenerating, setIsGenerating] = useState(false)
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

  // 触发JavaScript错误 - 纯业务逻辑，SDK 自动捕获
  const triggerJavaScriptError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerJavaScriptError()
    message.success('JavaScript错误已触发，SDK 会自动捕获')
  }

  // 触发Promise错误 - 纯业务逻辑，SDK 自动捕获
  const triggerPromiseError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerPromiseError()
    message.success('Promise错误已触发，SDK 会自动捕获')
  }

  // 触发未处理的Promise错误 - 纯业务逻辑，SDK 自动捕获
  const triggerUnhandledPromiseError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerUnhandledPromiseError()
    message.success('未处理Promise错误已触发，SDK 会自动捕获')
  }

  // 触发资源加载错误 - 纯业务逻辑，SDK 自动捕获
  const triggerResourceError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerResourceError()
    message.success('资源加载错误已触发，SDK 会自动捕获')
  }

  // 触发网络请求错误 - 纯业务逻辑，SDK 自动捕获
  const triggerNetworkError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerNetworkError()
    message.success('网络请求错误已触发，SDK 会自动捕获')
  }

  // 触发白屏检测 - 纯业务逻辑，SDK 自动捕获
  const triggerWhitescreenError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    // 模拟白屏情况
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 100, 100)
    }

    message.success('白屏检测已触发，SDK 会自动捕获')
  }

  // 手动上报自定义错误 - 纯业务逻辑
  const reportCustomError = () => {
    if (!customError.trim()) {
      message.warning('请输入错误信息')
      return
    }

    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    // 直接抛出错误，让 SDK 自动捕获
    throw new Error(customError)
  }

  // 批量生成错误 - 纯业务逻辑，SDK 自动捕获
  const generateBatchErrors = async () => {
    if (isGenerating)
      return

    setIsGenerating(true)
    TestUtils.generateBatchErrors(5)

    setTimeout(() => {
      setIsGenerating(false)
      message.success('批量错误已生成，SDK 会自动捕获所有错误')
    }, 1000)
  }

  // 触发语法错误 - 纯业务逻辑，SDK 自动捕获
  const triggerSyntaxError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerSyntaxError()
    message.success('语法错误已触发，SDK 会自动捕获')
  }

  // 触发类型错误 - 纯业务逻辑，SDK 自动捕获
  const triggerTypeError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerTypeError()
    message.success('类型错误已触发，SDK 会自动捕获')
  }

  // 触发范围错误 - 纯业务逻辑，SDK 自动捕获
  const triggerRangeError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }
    TestUtils.triggerRangeError()
    message.success('范围错误已触发，SDK 会自动捕获')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>错误测试页面</Title>
        <Text type="secondary">
          测试各种类型的错误监控功能，SDK 将自动捕获所有错误，无需手动埋点
        </Text>
      </div>

      <Alert
        message="全埋点错误监控说明"
        description="此页面采用全埋点模式，SDK 会自动捕获所有 JavaScript 错误、Promise 错误、资源加载错误、网络请求错误等。您只需要触发相应的错误，SDK 会自动处理监控逻辑。"
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 基础错误测试 */}
      <Card title="基础错误测试" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              danger
              icon={<BugOutlined />}
              onClick={triggerJavaScriptError}
              block
            >
              触发JavaScript错误
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              danger
              icon={<ExclamationCircleOutlined />}
              onClick={triggerPromiseError}
              block
            >
              触发Promise错误
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              onClick={triggerUnhandledPromiseError}
              block
            >
              触发未处理Promise错误
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 高级错误测试 */}
      <Card title="高级错误测试" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<WarningOutlined />}
              onClick={triggerResourceError}
              block
            >
              触发资源加载错误
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<InfoCircleOutlined />}
              onClick={triggerNetworkError}
              block
            >
              触发网络请求错误
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="primary"
              icon={<BugOutlined />}
              onClick={triggerWhitescreenError}
              block
            >
              触发白屏检测
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 特殊错误测试 */}
      <Card title="特殊错误测试" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              onClick={triggerSyntaxError}
              block
            >
              触发语法错误
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              onClick={triggerTypeError}
              block
            >
              触发类型错误
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Button
              type="default"
              onClick={triggerRangeError}
              block
            >
              触发范围错误
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 自定义错误上报 */}
      <Card title="自定义错误上报" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>错误级别：</Text>
            <Select
              value={errorLevel}
              onChange={setErrorLevel}
              style={{ width: 120, marginLeft: 8 }}
            >
              <Option value="error">错误</Option>
              <Option value="warning">警告</Option>
              <Option value="info">信息</Option>
              <Option value="debug">调试</Option>
            </Select>
          </div>
          <TextArea
            rows={4}
            placeholder="请输入错误信息..."
            value={customError}
            onChange={e => setCustomError(e.target.value)}
          />
          <Button
            type="primary"
            icon={<BugOutlined />}
            onClick={reportCustomError}
            disabled={!customError.trim()}
          >
            上报自定义错误
          </Button>
        </Space>
      </Card>

      {/* 批量错误生成 */}
      <Card title="批量错误生成" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">
            批量生成多个错误用于测试错误聚合和去重功能
          </Text>
          <Button
            type="primary"
            icon={isGenerating ? <StopOutlined /> : <PlayCircleOutlined />}
            onClick={generateBatchErrors}
            loading={isGenerating}
            disabled={isGenerating}
          >
            {isGenerating ? '生成中...' : '生成批量错误'}
          </Button>
        </Space>
      </Card>

      {/* 服务器状态 */}
      <Card title="服务器状态" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Statistic
            title="服务器连接状态"
            value={isConnected ? '已连接' : '未连接'}
            prefix={isConnected ? <SyncOutlined /> : <WarningOutlined />}
            valueStyle={{ color: isConnected ? 'green' : 'red' }}
          />
          {serverStats && (
            <div>
              <Text type="secondary">服务器统计:</Text>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(serverStats, null, 2)}
              </pre>
            </div>
          )}
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={syncDataToServer}
            disabled={!isConnected}
          >
            同步数据到服务器
          </Button>
        </Space>
      </Card>

      {/* 测试结果 */}
      <Card title="全埋点错误监控说明">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="全埋点优势"
            description="1. 无需手动埋点，SDK 自动捕获所有错误\n2. 业务代码与监控代码完全分离\n3. 减少开发工作量，提高开发效率\n4. 确保错误收集的完整性和准确性"
            type="success"
            showIcon
          />

          <Alert
            message="使用说明"
            description="1. 点击各种错误测试按钮，SDK 会自动捕获错误\n2. JavaScript 错误会被自动捕获并上报\n3. Promise 错误会被自动捕获并上报\n4. 资源加载错误会被自动捕获并上报\n5. 网络请求错误会被自动捕获并上报"
            type="info"
            showIcon
          />

          <Alert
            message="注意事项"
            description="1. 确保监控服务器正在运行\n2. 某些错误可能不会立即显示，需要等待上报\n3. 重复的错误会被自动去重\n4. 可以在浏览器控制台查看详细的错误信息"
            type="warning"
            showIcon
          />
        </Space>
      </Card>
    </div>
  )
}

export default ErrorTest
