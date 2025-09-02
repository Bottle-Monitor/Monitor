import type { ColumnsType } from 'antd/es/table'
import type { MonitoringData } from '../services/monitoringService'
import {
  BugOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Descriptions, Progress, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../services/monitoringService'

const { Title, Text, Paragraph } = Typography

const ErrorMonitoring: React.FC = () => {
  const [errorData, setErrorData] = useState<MonitoringData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedError, setSelectedError] = useState<MonitoringData | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [errorTypeStats, setErrorTypeStats] = useState<any>({})

  useEffect(() => {
    loadErrorData()
    // 每5秒刷新一次数据，实现实时联动
    const interval = setInterval(loadErrorData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadErrorData = async () => {
    setLoading(true)
    try {
      // 获取所有错误相关的数据，包括测试页面上报的数据
      const [errorData, statsData] = await Promise.all([
        monitoringService.getMonitoringData({
          category: 'error',
          limit: 100,
          // 添加时间范围，获取最近的数据
          startTime: Date.now() - 24 * 60 * 60 * 1000, // 最近24小时
        }),
        monitoringService.getStats(),
      ])

      if (errorData?.items) {
        setErrorData(errorData.items)
      }

      if (statsData) {
        setStats(statsData)
        setErrorTypeStats(statsData.errorTypeStats || {})
      }
    }
    catch (error) {
      console.error('加载错误数据失败:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const getErrorChartOption = () => {
    const chartData = Object.entries(errorTypeStats).map(([type, count]) => ({
      name: getErrorTypeDisplayName(type),
      value: count as number,
    })).filter(item => item.value > 0)

    if (chartData.length === 0) {
      return {
        title: { text: '暂无错误数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    return {
      title: {
        text: '错误类型分布',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '错误类型',
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }

  const getErrorTrendChartOption = () => {
    // 基于真实数据生成错误趋势图
    if (!errorData || errorData.length === 0) {
      return {
        title: { text: '暂无错误趋势数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 按小时统计错误趋势
    const now = new Date()
    const hours = []
    const errorCounts = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      hours.push(`${hour.getHours().toString().padStart(2, '0')}:00`)

      const hourStart = hour.getTime()
      const hourEnd = hourStart + 60 * 60 * 1000

      // 计算每小时的错误数量
      const hourData = errorData.filter(item =>
        item.timestamp >= hourStart && item.timestamp < hourEnd,
      )

      errorCounts.push(hourData.length)
    }

    return {
      title: {
        text: '错误趋势（最近24小时）',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: hours,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '错误数量',
          type: 'line',
          data: errorCounts,
          itemStyle: { color: '#ff4d4f' },
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
                { offset: 1, color: 'rgba(255, 77, 79, 0.1)' },
              ],
            },
          },
        },
      ],
    }
  }

  const getErrorSourceChartOption = () => {
    // 基于真实数据生成错误来源分布图
    if (!errorData || errorData.length === 0) {
      return {
        title: { text: '暂无错误来源数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 统计不同来源的错误
    const sourceStats: Record<string, number> = {}
    errorData.forEach((item) => {
      const source = (item as any).source || '未知'
      sourceStats[source] = (sourceStats[source] || 0) + 1
    })

    const chartData = Object.entries(sourceStats).map(([source, count]) => ({
      name: source,
      value: count,
    }))

    if (chartData.length === 0) {
      return {
        title: { text: '暂无错误来源数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    return {
      title: {
        text: '错误来源分布',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '错误来源',
          type: 'pie',
          radius: ['40%', '70%'],
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }

  const getErrorTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      codeError: 'JavaScript错误',
      unhandledrejection: 'Promise错误',
      resource: '资源加载错误',
      network: '网络请求错误',
      whitescreen: '白屏检测',
      custom_error: '自定义错误',
      batch_error: '批量错误',
    }
    return typeMap[type] || type
  }

  const getErrorLevelColor = (type: string) => {
    const levelMap: Record<string, string> = {
      codeError: 'red',
      unhandledrejection: 'orange',
      resource: 'blue',
      network: 'purple',
      whitescreen: 'volcano',
      custom_error: 'cyan',
      batch_error: 'magenta',
    }
    return levelMap[type] || 'default'
  }

  const getErrorLevelText = (type: string) => {
    const levelMap: Record<string, string> = {
      codeError: '严重',
      unhandledrejection: '警告',
      resource: '信息',
      network: '警告',
      whitescreen: '严重',
      custom_error: '自定义',
      batch_error: '批量',
    }
    return levelMap[type] || '未知'
  }

  const columns: ColumnsType<MonitoringData> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
      sorter: (a: MonitoringData, b: MonitoringData) => a.timestamp - b.timestamp,
    },
    {
      title: '错误类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getErrorLevelColor(type)}>
          {getErrorTypeDisplayName(type)}
        </Tag>
      ),
      filters: Object.entries(errorTypeStats).map(([type, count]) => ({
        text: `${getErrorTypeDisplayName(type)} (${count})`,
        value: type,
      })),
      onFilter: (value: any, record: MonitoringData) => record.type === String(value),
    },
    {
      title: '错误信息',
      dataIndex: 'data',
      key: 'data',
      render: (data: any) => (
        <Text ellipsis={{ tooltip: data.message || data.error || JSON.stringify(data) }}>
          {data.message || data.error || JSON.stringify(data).substring(0, 50)}
        </Text>
      ),
    },
    {
      title: '页面URL',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <Text ellipsis={{ tooltip: url }}>
          {url ? new URL(url).pathname : '未知'}
        </Text>
      ),
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => userId || '匿名',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MonitoringData) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedError(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ]

  const clearAllErrors = async () => {
    try {
      await monitoringService.clearAllData()
      loadErrorData()
    }
    catch (error) {
      console.error('清空错误数据失败:', error)
    }
  }

  // 计算错误率
  const calculateErrorRate = (errorType: string) => {
    const total = stats?.totalEvents || 1
    const count = errorTypeStats[errorType] || 0
    return Math.round((count / total) * 100)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>错误监控</Title>
        <Text type="secondary">
          实时监控和追踪前端应用中的各种错误，帮助快速定位和解决问题
        </Text>
      </div>

      {/* 连接状态提示 */}
      {!stats && (
        <Alert
          message="连接状态"
          description="正在连接监控服务器，请稍候..."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 错误统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总错误数"
              value={stats?.errors || 0}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="JavaScript错误"
              value={errorTypeStats.codeError || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Promise错误"
              value={errorTypeStats.unhandledrejection || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="资源错误"
              value={errorTypeStats.resource || 0}
              prefix={<InfoCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="错误类型分布">
            <ReactECharts option={getErrorChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="错误趋势">
            <ReactECharts option={getErrorTrendChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="错误来源分布">
            <ReactECharts option={getErrorSourceChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 错误率指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="JavaScript错误率">
            <Progress
              percent={calculateErrorRate('codeError')}
              status={calculateErrorRate('codeError') > 10 ? 'exception' : 'active'}
            />
            <Text type="secondary">
              当前:
              {' '}
              {errorTypeStats.codeError || 0}
              {' '}
              个错误
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="资源加载错误率">
            <Progress
              percent={calculateErrorRate('resource')}
              status={calculateErrorRate('resource') > 5 ? 'exception' : 'active'}
            />
            <Text type="secondary">
              当前:
              {' '}
              {errorTypeStats.resource || 0}
              {' '}
              个错误
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="网络请求错误率">
            <Progress
              percent={calculateErrorRate('network')}
              status={calculateErrorRate('network') > 8 ? 'exception' : 'active'}
            />
            <Text type="secondary">
              当前:
              {' '}
              {errorTypeStats.network || 0}
              {' '}
              个错误
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 错误列表 */}
      <Card
        title={`错误列表 (共 ${errorData.length} 条)`}
        extra={(
          <Space>
            <Button size="small" icon={<ReloadOutlined />} onClick={loadErrorData}>
              刷新
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={clearAllErrors}
            >
              清空所有
            </Button>
          </Space>
        )}
      >
        {errorData.length === 0
          ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <BugOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Text type="secondary">暂无错误数据</Text>
              </div>
            )
          : (
              <Table
                columns={columns}
                dataSource={errorData}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: total => `共 ${total} 条错误记录`,
                }}
                loading={loading}
                size="small"
              />
            )}
      </Card>

      {/* 错误详情弹窗 */}
      {selectedError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Card
            title="错误详情"
            style={{ width: '80%', maxWidth: 800, maxHeight: '80vh', overflow: 'auto' }}
            extra={
              <Button type="text" onClick={() => setSelectedError(null)}>✕</Button>
            }
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="错误类型">
                <Tag color={getErrorLevelColor(selectedError.type)}>
                  {getErrorTypeDisplayName(selectedError.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发生时间">
                {new Date(selectedError.timestamp).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="页面URL" span={2}>
                {selectedError.url || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="用户ID">
                {selectedError.userId || '匿名'}
              </Descriptions.Item>
              <Descriptions.Item label="会话ID">
                {selectedError.sessionId || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="用户代理" span={2}>
                {selectedError.userAgent || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="错误详情" span={2}>
                <Paragraph>
                  <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
                    {JSON.stringify(selectedError.data, null, 2)}
                  </pre>
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ErrorMonitoring
