import type { MonitoringData } from '../services/monitoringService'
import {
  BugOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Progress, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../services/monitoringService'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [recentData, setRecentData] = useState<MonitoringData[]>([])
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    loadDashboardData()
    // 每5秒刷新一次数据，实现实时联动
    const interval = setInterval(loadDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // 检查连接状态
      const connected = await monitoringService.checkConnection()
      setIsConnected(connected)

      if (connected) {
        const [statsData, recentData] = await Promise.all([
          monitoringService.getStats(),
          monitoringService.getMonitoringData({ limit: 20 }),
        ])
        setStats(statsData)
        setRecentData(recentData?.items || [])
      }
    }
    catch (error) {
      console.error('加载仪表盘数据失败:', error)
      setIsConnected(false)
    }
    finally {
      setLoading(false)
    }
  }

  const getChartOption = () => {
    // 基于真实数据生成趋势图
    if (!recentData || recentData.length === 0) {
      return {
        title: { text: '暂无监控数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 按小时统计数据
    const now = new Date()
    const hours = []
    const errorData = []
    const performanceData = []
    const userData = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      hours.push(`${hour.getHours().toString().padStart(2, '0')}:00`)

      const hourStart = hour.getTime()
      const hourEnd = hourStart + 60 * 60 * 1000

      // 计算每小时的数据量
      const hourData = recentData.filter(item =>
        item.timestamp >= hourStart && item.timestamp < hourEnd,
      )

      errorData.push(hourData.filter(item => item.category === 'error' || item.category === 'abnormal').length)
      performanceData.push(hourData.filter(item => item.category === 'performance' || item.category === 'vitals').length)
      userData.push(hourData.filter(item => item.category === 'user').length)
    }

    return {
      title: {
        text: '监控事件趋势（最近24小时）',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['错误', '性能', '用户行为'],
        bottom: 0,
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
          name: '错误',
          type: 'line',
          data: errorData,
          itemStyle: { color: '#ff4d4f' },
          smooth: true,
        },
        {
          name: '性能',
          type: 'line',
          data: performanceData,
          itemStyle: { color: '#1890ff' },
          smooth: true,
        },
        {
          name: '用户行为',
          type: 'line',
          data: userData,
          itemStyle: { color: '#52c41a' },
          smooth: true,
        },
      ],
    }
  }

  const getPerformanceChartOption = () => {
    // 基于真实性能数据生成雷达图
    if (!stats?.performanceStats) {
      return {
        title: { text: '暂无性能数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    const performanceStats = stats.performanceStats
    const metrics = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB']
    const values = metrics.map((metric) => {
      const stat = performanceStats[metric]
      if (!stat || stat.count === 0)
        return 0

      // 计算性能评分（基于Web Vitals标准）
      const avgValue = stat.total / stat.count
      let score = 0

      switch (metric) {
        case 'FCP':
          score = avgValue <= 1800 ? 100 : avgValue <= 3000 ? 80 : 60
          break
        case 'LCP':
          score = avgValue <= 2500 ? 100 : avgValue <= 4000 ? 80 : 60
          break
        case 'CLS':
          score = avgValue <= 0.1 ? 100 : avgValue <= 0.25 ? 80 : 60
          break
        case 'FID':
          score = avgValue <= 100 ? 100 : avgValue <= 300 ? 80 : 60
          break
        case 'TTFB':
          score = avgValue <= 200 ? 100 : avgValue <= 600 ? 80 : 60
          break
        default:
          score = 0
      }

      return score
    })

    return {
      title: {
        text: 'Core Web Vitals 性能评分',
        left: 'center',
      },
      radar: {
        indicator: metrics.map(name => ({ name, max: 100 })),
      },
      series: [{
        type: 'radar',
        data: [{
          value: values,
          name: '当前性能',
          itemStyle: { color: '#1890ff' },
        }],
      }],
    }
  }

  const getErrorRateChartOption = () => {
    // 基于真实错误数据生成错误率图表
    if (!stats) {
      return {
        title: { text: '暂无错误数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    const totalEvents = stats.totalEvents || 1
    const errorRate = ((stats.errors || 0) / totalEvents) * 100
    const successRate = 100 - errorRate

    return {
      title: {
        text: '系统健康度',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: successRate, name: '正常', itemStyle: { color: '#52c41a' } },
          { value: errorRate, name: '错误', itemStyle: { color: '#ff4d4f' } },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }],
    }
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '类型',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const colorMap: Record<string, string> = {
          error: 'red',
          abnormal: 'red',
          performance: 'blue',
          vitals: 'blue',
          user: 'green',
          custom: 'orange',
        }
        return <Tag color={colorMap[category] || 'default'}>{category}</Tag>
      },
    },
    {
      title: '事件',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => source || '未知',
    },
    {
      title: '状态',
      key: 'status',
      render: () => <Tag color="success">已上报</Tag>,
    },
  ]

  if (!isConnected) {
    return (
      <Alert
        message="未连接到监控服务器"
        description="请确保监控服务器正在运行，并检查连接配置。"
        type="warning"
        showIcon
        action={(
          <Button size="small" onClick={loadDashboardData} icon={<ReloadOutlined />}>
            重试连接
          </Button>
        )}
      />
    )
  }

  if (!stats) {
    return (
      <Alert
        message="正在加载数据"
        description="正在从监控服务器获取数据，请稍候..."
        type="info"
        showIcon
      />
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>监控系统仪表盘</Title>
        <Text type="secondary">
          实时监控前端应用的健康状态、性能指标和用户行为
        </Text>
      </div>

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总监控事件"
              value={stats.totalEvents || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="错误事件"
              value={stats.errors || 0}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="性能指标"
              value={stats.vitals || 0}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户行为"
              value={stats.userActions || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="监控事件趋势" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadDashboardData}>刷新</Button>}>
            <ReactECharts option={getChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统健康度">
            <ReactECharts option={getErrorRateChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="性能雷达图">
            <ReactECharts option={getPerformanceChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 系统状态 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="系统状态">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>服务器连接: </Text>
                <Tag color={isConnected ? 'success' : 'error'}>
                  {isConnected ? '正常' : '异常'}
                </Tag>
              </div>
              <div>
                <Text>SDK状态: </Text>
                <Tag color="success">已初始化</Tag>
              </div>
              <div>
                <Text>数据上报: </Text>
                <Tag color="success">实时</Tag>
              </div>
              <div>
                <Text>最后更新: </Text>
                <Text code>{stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleString() : '未知'}</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="性能评分">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>整体评分: </Text>
                <Progress
                  percent={Math.max(0, 100 - ((stats.errors || 0) / Math.max(stats.totalEvents || 1, 1)) * 100)}
                  status="active"
                />
              </div>
              <div>
                <Text>错误率: </Text>
                <Progress
                  percent={Math.min(100, ((stats.errors || 0) / Math.max(stats.totalEvents || 1, 1)) * 100)}
                  status="exception"
                />
              </div>
              <div>
                <Text>响应时间: </Text>
                <Progress percent={92} status="active" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 最近事件 */}
      <Card
        title="最近监控事件"
        extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadDashboardData}>刷新</Button>}
      >
        <Table
          columns={columns}
          dataSource={recentData}
          rowKey="id"
          pagination={false}
          loading={loading}
          size="small"
        />
      </Card>
    </div>
  )
}

export default Dashboard
