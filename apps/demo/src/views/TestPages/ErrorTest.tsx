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
import { getBottleMonitor } from '@bottle-monitor/core'
import { Alert, Button, Card, Col, Input, message, Row, Select, Space, Statistic, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../../services/monitoringService'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const ErrorTest: React.FC = () => {
  const [customError, setCustomError] = useState('')
  const [errorLevel, setErrorLevel] = useState('error')
  const [isGenerating, setIsGenerating] = useState(false)
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

  // 触发JavaScript错误
  const triggerJavaScriptError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    try {
      // 故意触发一个错误
      const obj: any = null
      obj.nonExistentMethod()
    }
    catch (error) {
      console.error('JavaScript错误已触发:', error)

      // 手动上报错误
      if (monitor) {
        monitor.track('javascript_error', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          category: 'error',
          type: 'codeError',
          source: 'ErrorTest',
        })

        // 直接上报到后端服务器
        reportToServer('codeError', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          category: 'error',
          type: 'codeError',
          source: 'ErrorTest',
        })
      }
    }
  }

  // 触发Promise错误
  const triggerPromiseError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('这是一个Promise错误'))
      }, 100)
    })

    promise.catch((error) => {
      console.error('Promise错误已触发:', error)

      // 手动上报错误
      if (monitor) {
        monitor.track('promise_error', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          category: 'error',
          type: 'unhandledrejection',
          source: 'ErrorTest',
        })

        // 直接上报到后端服务器
        reportToServer('unhandledrejection', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          category: 'error',
          type: 'unhandledrejection',
          source: 'ErrorTest',
        })
      }
    })
  }

  // 触发未处理的Promise错误
  const triggerUnhandledPromiseError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('这是一个未处理的Promise错误'))
      }, 100)
    })
  }

  // 触发资源加载错误
  const triggerResourceError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    const img = new Image()
    img.onerror = () => {
      console.error('资源加载错误已触发')

      // 手动上报错误
      if (monitor) {
        monitor.track('resource_error', {
          error: '资源加载失败',
          url: 'https://example.com/nonexistent-image.jpg',
          timestamp: Date.now(),
          category: 'error',
          type: 'resource',
          source: 'ErrorTest',
        })

        // 直接上报到后端服务器
        reportToServer('resource', {
          error: '资源加载失败',
          url: 'https://example.com/nonexistent-image.jpg',
          timestamp: Date.now(),
          category: 'error',
          type: 'resource',
          source: 'ErrorTest',
        })
      }
    }
    img.src = 'https://example.com/nonexistent-image.jpg'
  }

  // 触发网络请求错误
  const triggerNetworkError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    fetch('https://httpstat.us/500')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })
      .catch((error) => {
        console.error('网络请求错误已触发:', error)

        // 手动上报错误
        if (monitor) {
          monitor.track('network_error', {
            error: error instanceof Error ? error.message : String(error),
            url: 'https://httpstat.us/500',
            timestamp: Date.now(),
            category: 'error',
            type: 'network',
            source: 'ErrorTest',
          })

          // 直接上报到后端服务器
          reportToServer('network', {
            error: error instanceof Error ? error.message : String(error),
            url: 'https://httpstat.us/500',
            timestamp: Date.now(),
            category: 'error',
            type: 'network',
            source: 'ErrorTest',
          })
        }
      })
  }

  // 触发白屏检测
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
      // 这里可以添加白屏检测逻辑
    }

    // 手动上报白屏错误
    if (monitor) {
      monitor.track('whitescreen_error', {
        error: '检测到白屏情况',
        timestamp: Date.now(),
        category: 'error',
        type: 'whitescreen',
        source: 'ErrorTest',
      })

      // 直接上报到后端服务器
      reportToServer('whitescreen', {
        error: '检测到白屏情况',
        timestamp: Date.now(),
        category: 'error',
        type: 'whitescreen',
        source: 'ErrorTest',
      })
    }

    message.info('白屏检测已触发，请查看控制台')
  }

  // 手动上报自定义错误
  const reportCustomError = () => {
    if (!customError.trim()) {
      message.warning('请输入错误信息')
      return
    }

    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    if (monitor) {
      monitor.track('custom_error', {
        message: customError,
        level: errorLevel,
        timestamp: Date.now(),
        extra: {
          source: 'ErrorTest',
          userAction: 'manual_report',
        },
      })
      message.success('自定义错误已上报')
      setCustomError('')
    }
    else {
      message.error('监控SDK未初始化')
    }
  }

  // 批量生成错误
  const generateBatchErrors = async () => {
    if (isGenerating)
      return

    setIsGenerating(true)
    const errors = [
      '批量错误测试 - 错误1',
      '批量错误测试 - 错误2',
      '批量错误测试 - 错误3',
      '批量错误测试 - 错误4',
      '批量错误测试 - 错误5',
    ]

    for (let i = 0; i < errors.length; i++) {
      if (monitor) {
        monitor.track('batch_error', {
          message: errors[i],
          level: 'error',
          timestamp: Date.now(),
          batchId: `batch_${Date.now()}`,
          sequence: i + 1,
        })
      }
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setIsGenerating(false)
    message.success('批量错误已生成')
  }

  // 触发语法错误
  const triggerSyntaxError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    try {
      // 使用eval故意触发语法错误
      eval('function test() { console.log("test") }')
    }
    catch (error) {
      console.error('语法错误已触发:', error)

      // 手动上报错误
      if (monitor) {
        monitor.track('syntax_error', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          category: 'error',
          type: 'syntax',
          source: 'ErrorTest',
        })
      }
    }
  }

  // 触发类型错误
  const triggerTypeError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    try {
      const str = 'hello'
      ;(str as any).toFixed(2) // 字符串没有toFixed方法
    }
    catch (error) {
      console.error('类型错误已触发:', error)

      // 手动上报错误
      if (monitor) {
        monitor.track('type_error', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          category: 'error',
          type: 'type',
          source: 'ErrorTest',
        })
      }
    }
  }

  // 触发范围错误
  const triggerRangeError = () => {
    if (!isConnected) {
      message.error('无法连接到监控服务器，请检查服务器状态')
      return
    }

    try {
      const arr = Array.from({ length: -1 }) // 负数长度会抛出RangeError
    }
    catch (error) {
      console.error('范围错误已触发:', error)

      // 手动上报错误
      if (monitor) {
        monitor.track('range_error', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
          category: 'error',
          type: 'range',
          source: 'ErrorTest',
        })
      }
    }
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
          category: 'error',
          type,
          data,
          timestamp: Date.now(),
          source: 'ErrorTest',
        }),
      })

      if (response.ok) {
        console.log(`错误数据上报成功: ${type}`, data)
      }
      else {
        console.error(`错误数据上报失败: ${type}`, response.status)
      }
    }
    catch (error) {
      console.error(`错误数据上报错误: ${type}`, error)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>错误测试页面</Title>
        <Text type="secondary">
          测试各种类型的错误监控功能，包括JavaScript错误、Promise错误、资源加载错误等
        </Text>
      </div>

      <Alert
        message="测试说明"
        description="点击下面的按钮可以触发各种类型的错误，这些错误会被监控SDK自动捕获并上报到服务器。请确保监控服务器正在运行。"
        type="info"
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
      <Card title="测试结果">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">
            错误测试完成后，可以在以下页面查看结果：
          </Text>
          <ul>
            <li><Text>错误监控页面：查看所有捕获的错误</Text></li>
            <li><Text>仪表盘：查看错误统计和趋势</Text></li>
            <li><Text>控制台：查看本地错误日志</Text></li>
          </ul>
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
