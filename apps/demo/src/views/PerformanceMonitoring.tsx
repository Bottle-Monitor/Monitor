import type { ColumnsType } from 'antd/es/table'
import type { MonitoringData } from '../services/monitoringService'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LineChartOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Descriptions, Progress, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import React, { useEffect, useState } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import { monitoringService } from '../services/monitoringService'

const { Title, Text } = Typography

const PerformanceMonitoring: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<MonitoringData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<MonitoringData | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [performanceStats, setPerformanceStats] = useState<any>({})

  useEffect(() => {
    loadPerformanceData()
    // 每5秒刷新一次性能数据，实现实时联动
    const interval = setInterval(loadPerformanceData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadPerformanceData = async () => {
    setLoading(true)
    try {
      // 获取所有性能相关的数据，包括测试页面上报的数据
      const [performanceData, statsData] = await Promise.all([
        monitoringService.getMonitoringData({
          category: 'performance',
          limit: 100,
          // 添加时间范围，获取最近的数据
          startTime: Date.now() - 24 * 60 * 60 * 1000, // 最近24小时
        }),
        monitoringService.getStats(),
      ])

      if (performanceData?.items) {
        setPerformanceData(performanceData.items)
      }

      if (statsData) {
        setStats(statsData)
        setPerformanceStats(statsData.performanceStats || {})
      }
    }
    catch (error) {
      console.error('加载性能数据失败:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const getVitalsChartOption = () => {
    // 基于真实数据生成性能指标图表
    if (!performanceData || performanceData.length === 0) {
      return {
        title: { text: '暂无性能数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 按小时统计性能指标
    const now = new Date()
    const hours = []
    const fcpData = []
    const lcpData = []
    const clsData = []
    const fidData = []
    const ttfbData = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      hours.push(`${hour.getHours().toString().padStart(2, '0')}:00`)

      const hourStart = hour.getTime()
      const hourEnd = hourStart + 60 * 60 * 1000

      // 计算每小时的平均值
      const hourData = performanceData.filter(item =>
        item.timestamp >= hourStart && item.timestamp < hourEnd,
      )

      const fcpAvg = hourData.filter(item => item.type === 'FCP')
        .reduce((sum, item) => sum + (item.data?.value || item.data || 0), 0)
        / Math.max(hourData.filter(item => item.type === 'FCP').length, 1)

      const lcpAvg = hourData.filter(item => item.type === 'LCP')
        .reduce((sum, item) => sum + (item.data?.value || item.data || 0), 0)
        / Math.max(hourData.filter(item => item.type === 'LCP').length, 1)

      const clsAvg = hourData.filter(item => item.type === 'CLS')
        .reduce((sum, item) => sum + (item.data?.value || item.data || 0), 0)
        / Math.max(hourData.filter(item => item.type === 'CLS').length, 1)

      const fidAvg = hourData.filter(item => item.type === 'FID')
        .reduce((sum, item) => sum + (item.data?.value || item.data || 0), 0)
        / Math.max(hourData.filter(item => item.type === 'FID').length, 1)

      const ttfbAvg = hourData.filter(item => item.type === 'TTFB')
        .reduce((sum, item) => sum + (item.data?.value || item.data || 0), 0)
        / Math.max(hourData.filter(item => item.type === 'TTFB').length, 1)

      fcpData.push(Math.round(fcpAvg))
      lcpData.push(Math.round(lcpAvg))
      clsData.push(Math.round(clsAvg * 1000) / 1000) // 保留3位小数
      fidData.push(Math.round(fidAvg))
      ttfbData.push(Math.round(ttfbAvg))
    }

    return {
      title: {
        text: 'Core Web Vitals 趋势（最近24小时）',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter(params: any) {
          let result = `${params[0].axisValue}<br/>`
          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value}<br/>`
          })
          return result
        },
      },
      legend: {
        data: ['FCP', 'LCP', 'CLS', 'FID', 'TTFB'],
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
          name: 'FCP',
          type: 'line',
          data: fcpData,
          itemStyle: { color: '#1890ff' },
          smooth: true,
        },
        {
          name: 'LCP',
          type: 'line',
          data: lcpData,
          itemStyle: { color: '#52c41a' },
          smooth: true,
        },
        {
          name: 'CLS',
          type: 'line',
          data: clsData,
          itemStyle: { color: '#fa8c16' },
          smooth: true,
        },
        {
          name: 'FID',
          type: 'line',
          data: fidData,
          itemStyle: { color: '#722ed1' },
          smooth: true,
        },
        {
          name: 'TTFB',
          type: 'line',
          data: ttfbData,
          itemStyle: { color: '#eb2f96' },
          smooth: true,
        },
      ],
    }
  }

  const getCustomPerformanceChartOption = () => {
    // 基于真实数据生成自定义性能指标图表
    if (!performanceData || performanceData.length === 0) {
      return {
        title: { text: '暂无自定义性能数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 统计自定义性能指标
    const customMetrics = performanceData.filter(item =>
      !['FCP', 'LCP', 'CLS', 'FID', 'TTFB'].includes(item.type),
    )

    if (customMetrics.length === 0) {
      return {
        title: { text: '暂无自定义性能数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 按类型分组统计
    const metricStats: Record<string, { count: number, total: number }> = {}
    customMetrics.forEach((item) => {
      const type = item.type
      if (!metricStats[type]) {
        metricStats[type] = { count: 0, total: 0 }
      }
      metricStats[type].count++
      metricStats[type].total += item.data?.value || item.data || 0
    })

    const chartData = Object.entries(metricStats).map(([type, stats]) => ({
      name: type,
      value: Math.round(stats.total / stats.count),
      count: stats.count,
    }))

    return {
      title: {
        text: '自定义性能指标',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter(params: any) {
          const data = params.data
          return `${params.name}<br/>平均值: ${data.value}<br/>样本数: ${data.count}`
        },
      },
      xAxis: {
        type: 'category',
        data: chartData.map(item => item.name),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          data: chartData.map(item => ({
            value: item.value,
            count: item.count,
          })),
          itemStyle: { color: '#1890ff' },
        },
      ],
    }
  }

  const getPerformanceGaugeOption = () => {
    // 计算整体性能评分
    const totalMetrics = Object.values(performanceStats).reduce((sum: number, metric: any) => {
      return sum + (metric.count || 0)
    }, 0)

    if (totalMetrics === 0) {
      return {
        title: { text: '暂无性能数据', left: 'center' },
        series: [{
          type: 'gauge',
          data: [{ value: 0, name: '性能评分' }],
        }],
      }
    }

    const goodMetrics = Object.values(performanceStats).reduce((sum: number, metric: any) => {
      return sum + (metric.good || 0)
    }, 0)

    const score = Math.round((goodMetrics / totalMetrics) * 100)

    return {
      title: {
        text: '整体性能评分',
        left: 'center',
      },
      series: [
        {
          type: 'gauge',
          progress: {
            show: true,
            width: 18,
          },
          axisLine: {
            lineStyle: {
              width: 18,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: '#999',
            },
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 12,
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
              borderWidth: 10,
            },
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            fontSize: 30,
            offsetCenter: [0, '70%'],
          },
          data: [
            {
              value: score,
              name: '性能评分',
            },
          ],
        },
      ],
    }
  }

  const getPerformanceLevel = (value: any, type: string) => {
    // 确保value是数字
    const numValue = typeof value === 'number' ? value : Number.parseFloat(value) || 0

    if (type === 'CLS') {
      if (numValue <= 0.1)
        return { level: 'good', color: 'success', text: '优秀' }
      if (numValue <= 0.25)
        return { level: 'needs-improvement', color: 'warning', text: '需要改进' }
      return { level: 'poor', color: 'error', text: '较差' }
    }

    if (type === 'FCP' || type === 'LCP' || type === 'FID' || type === 'TTFB') {
      const thresholds = {
        FCP: { good: 1800, needsImprovement: 3000 },
        LCP: { good: 2500, needsImprovement: 4000 },
        FID: { good: 100, needsImprovement: 300 },
        TTFB: { good: 200, needsImprovement: 600 },
      }
      const threshold = thresholds[type as keyof typeof thresholds]
      if (numValue <= threshold.good)
        return { level: 'good', color: 'success', text: '优秀' }
      if (numValue <= threshold.needsImprovement)
        return { level: 'needs-improvement', color: 'warning', text: '需要改进' }
      return { level: 'poor', color: 'error', text: '较差' }
    }

    return { level: 'unknown', color: 'default', text: '未知' }
  }

  const getMetricDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      FCP: 'First Contentful Paint',
      LCP: 'Largest Contentful Paint',
      CLS: 'Cumulative Layout Shift',
      FID: 'First Input Delay',
      TTFB: 'Time to First Byte',
      longTask: 'Long Task',
      memory: 'Memory Usage',
    }
    return typeMap[type] || type
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
      title: '指标类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getMetricDisplayName(type),
      filters: Object.entries(performanceStats)
        .map(([type, metric]: [string, any]) => ({
          text: `${getMetricDisplayName(type)} (${metric.count || 0})`,
          value: type,
        }))
        .filter((item) => {
          const metric = performanceStats[item.value]
          return metric && (metric.count || 0) > 0
        })
        .map(item => ({
          text: item.text,
          value: item.value,
        })),
      onFilter: (value: any, record: MonitoringData) => record.type === String(value),
    },
    {
      title: '数值',
      dataIndex: 'data',
      key: 'data',
      render: (data: any) => {
        const value = data?.value || data
        const type = data?.type || 'unknown'
        const { color, text } = getPerformanceLevel(value, type)
        return (
          <Space>
            <Text strong>{typeof value === 'number' ? value : JSON.stringify(value)}</Text>
            <Tag color={color}>{text}</Tag>
          </Space>
        )
      },
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
      title: '操作',
      key: 'action',
      render: (_: any, record: MonitoringData) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setSelectedMetric(record)}
        >
          详情
        </Button>
      ),
    },
  ]

  // 计算性能指标统计
  const calculateMetricStats = (metricType: string) => {
    const metric = performanceStats[metricType]
    if (!metric || metric.count === 0)
      return { avg: 0, good: 0, needsImprovement: 0, poor: 0 }

    return {
      avg: Math.round(metric.total / metric.count),
      good: metric.good || 0,
      needsImprovement: metric.needsImprovement || 0,
      poor: metric.poor || 0,
    }
  }

  // 计算性能评分
  const calculatePerformanceScore = (metricType: string) => {
    const metric = performanceStats[metricType]
    if (!metric || metric.count === 0)
      return 0

    const total = metric.good + metric.needsImprovement + metric.poor
    if (total === 0)
      return 0

    return Math.round((metric.good / total) * 100)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>性能监控</Title>
        <Text type="secondary">
          实时监控前端应用的性能指标，包括Core Web Vitals和自定义性能数据
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

      {/* 性能统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="性能指标总数"
              value={stats?.vitals || 0}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="优秀指标"
              value={Object.values(performanceStats).reduce((sum: number, metric: any) => sum + (metric.good || 0), 0)}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="需要改进"
              value={Object.values(performanceStats).reduce((sum: number, metric: any) => sum + (metric.needsImprovement || 0), 0)}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="较差指标"
              value={Object.values(performanceStats).reduce((sum: number, metric: any) => sum + (metric.poor || 0), 0)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Core Web Vitals 趋势" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadPerformanceData}>刷新</Button>}>
            <ErrorBoundary>
              {performanceData.length > 0
                ? (
                    <ReactECharts option={getVitalsChartOption()} style={{ height: 300 }} />
                  )
                : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">暂无性能数据，无法生成图表</Text>
                    </div>
                  )}
            </ErrorBoundary>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="性能评分">
            <ErrorBoundary>
              {Object.keys(performanceStats).length > 0
                ? (
                    <ReactECharts option={getPerformanceGaugeOption()} style={{ height: 300 }} />
                  )
                : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">暂无性能统计，无法生成评分</Text>
                    </div>
                  )}
            </ErrorBoundary>
          </Card>
        </Col>
      </Row>

      {/* 自定义性能指标图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="自定义性能指标" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadPerformanceData}>刷新</Button>}>
            <ErrorBoundary>
              {performanceData.length > 0
                ? (
                    <ReactECharts option={getCustomPerformanceChartOption()} style={{ height: 300 }} />
                  )
                : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Text type="secondary">暂无性能数据，无法生成图表</Text>
                    </div>
                  )}
            </ErrorBoundary>
          </Card>
        </Col>
      </Row>

      {/* 性能指标详情 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="FCP (First Contentful Paint)">
            <Progress
              percent={calculatePerformanceScore('FCP')}
              status={calculatePerformanceScore('FCP') > 80 ? 'active' : 'exception'}
            />
            <Text type="secondary">目标: &lt; 1.8s</Text>
            <br />
            <Text type="secondary">
              当前:
              {' '}
              {calculateMetricStats('FCP').avg}
              ms
              (
              {calculateMetricStats('FCP').good}
              个优秀)
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="LCP (Largest Contentful Paint)">
            <Progress
              percent={calculatePerformanceScore('LCP')}
              status={calculatePerformanceScore('LCP') > 80 ? 'active' : 'exception'}
            />
            <Text type="secondary">目标: &lt; 2.5s</Text>
            <br />
            <Text type="secondary">
              当前:
              {' '}
              {calculateMetricStats('LCP').avg}
              ms
              (
              {calculateMetricStats('LCP').good}
              个优秀)
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="CLS (Cumulative Layout Shift)">
            <Progress
              percent={calculatePerformanceScore('CLS')}
              status={calculatePerformanceScore('CLS') > 80 ? 'active' : 'exception'}
            />
            <Text type="secondary">目标: &lt; 0.1</Text>
            <br />
            <Text type="secondary">
              当前:
              {' '}
              {Number((calculateMetricStats('CLS').avg).toFixed(4))}
              {' '}
              (
              {calculateMetricStats('CLS').good}
              个优秀)
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="FID (First Input Delay)">
            <Progress
              percent={calculatePerformanceScore('FID')}
              status={calculatePerformanceScore('FID') > 80 ? 'active' : 'exception'}
            />
            <Text type="secondary">目标: &lt; 100ms</Text>
            <br />
            <Text type="secondary">
              当前:
              {' '}
              {calculateMetricStats('FID').avg}
              ms
              (
              {calculateMetricStats('FID').good}
              个优秀)
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="TTFB (Time to First Byte)">
            <Progress
              percent={calculatePerformanceScore('TTFB')}
              status={calculatePerformanceScore('TTFB') > 80 ? 'active' : 'exception'}
            />
            <Text type="secondary">目标: &lt; 200ms</Text>
            <br />
            <Text type="secondary">
              当前:
              {' '}
              {calculateMetricStats('TTFB').avg}
              ms
              (
              {calculateMetricStats('TTFB').good}
              个优秀)
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="整体性能">
            <Progress
              percent={Object.values(performanceStats).reduce((sum: number, metric: any) => {
                const total = (metric.good || 0) + (metric.needsImprovement || 0) + (metric.poor || 0)
                return total > 0 ? sum + Math.round(((metric.good || 0) / total) * 100) : sum
              }, 0) / Math.max(Object.keys(performanceStats).length, 1)}
              status="active"
            />
            <Text type="secondary">综合评分</Text>
            <br />
            <Text type="secondary">
              状态:
              {' '}
              {Object.values(performanceStats).reduce((sum: number, metric: any) => sum + (metric.good || 0), 0)
                > Object.values(performanceStats).reduce((sum: number, metric: any) => sum + (metric.poor || 0), 0)
                ? '良好'
                : '需要优化'}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 性能数据列表 */}
      <Card
        title={`性能指标列表 (共 ${performanceData.length} 条)`}
        extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadPerformanceData}>刷新</Button>}
      >
        {performanceData.length === 0
          ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <LineChartOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Text type="secondary">暂无性能数据</Text>
              </div>
            )
          : (
              <Table
                columns={columns}
                dataSource={performanceData}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: total => `共 ${total} 条性能记录`,
                }}
                loading={loading}
                size="small"
              />
            )}
      </Card>

      {/* 指标详情弹窗 */}
      {selectedMetric && (
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
            title="性能指标详情"
            style={{ width: '80%', maxWidth: 800, maxHeight: '80vh', overflow: 'auto' }}
            extra={
              <Button type="text" onClick={() => setSelectedMetric(null)}>✕</Button>
            }
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="指标类型">
                {getMetricDisplayName(selectedMetric.type)}
              </Descriptions.Item>
              <Descriptions.Item label="记录时间">
                {new Date(selectedMetric.timestamp).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="页面URL" span={2}>
                {selectedMetric.url || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="用户ID">
                {selectedMetric.userId || '匿名'}
              </Descriptions.Item>
              <Descriptions.Item label="会话ID">
                {selectedMetric.sessionId || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="指标详情" span={2}>
                <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
                  {JSON.stringify(selectedMetric.data, null, 2)}
                </pre>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </div>
  )
}

export default PerformanceMonitoring
