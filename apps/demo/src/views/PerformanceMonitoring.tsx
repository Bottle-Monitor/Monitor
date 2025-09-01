import { ClockCircleOutlined, EyeOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Card, Col, Progress, Row, Statistic, Table, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import ReactECharts from 'echarts-for-react'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const { Title, Text } = Typography

interface MonitoringData {
  monitoringData: any[]
}

interface PerformanceMetrics {
  FCP: number[]
  LCP: number[]
  FID: number[]
  CLS: number[]
  TTFB: number[]
}

export function Component() {
  const { monitoringData } = useOutletContext<MonitoringData>()
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    FCP: [],
    LCP: [],
    FID: [],
    CLS: [],
    TTFB: [],
  })

  // 处理性能数据
  useEffect(() => {
    if (monitoringData) {
      const performance = monitoringData.filter(item => item.category === 'vitals')
      setPerformanceData(performance)

      // 分类汇总性能指标
      const newMetrics: PerformanceMetrics = {
        FCP: [],
        LCP: [],
        FID: [],
        CLS: [],
        TTFB: [],
      }

      performance.forEach((item) => {
        if (item.name && newMetrics[item.name as keyof PerformanceMetrics]) {
          newMetrics[item.name as keyof PerformanceMetrics].push(item.value)
        }
      })

      setMetrics(newMetrics)
    }
  }, [monitoringData])

  // 计算平均值
  const calculateAverage = (values: number[]) => {
    if (values.length === 0)
      return 0
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
  }

  // 获取性能评级
  const getPerformanceGrade = (metric: string, value: number) => {
    const thresholds: { [key: string]: { good: number, needs: number } } = {
      FCP: { good: 1800, needs: 3000 },
      LCP: { good: 2500, needs: 4000 },
      FID: { good: 100, needs: 300 },
      CLS: { good: 0.1, needs: 0.25 },
      TTFB: { good: 800, needs: 1800 },
    }

    const threshold = thresholds[metric]
    if (!threshold)
      return { grade: '未知', color: 'default' }

    if (value <= threshold.good) {
      return { grade: '优秀', color: 'success' }
    }
    else if (value <= threshold.needs) {
      return { grade: '良好', color: 'warning' }
    }
    else {
      return { grade: '需要改进', color: 'error' }
    }
  }

  // Core Web Vitals 趋势图
  const vitalsOption = {
    title: {
      text: 'Core Web Vitals 趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['FCP', 'LCP', 'FID', 'CLS', 'TTFB'],
      bottom: 10,
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 12 }, (_, i) => `${i + 1}h`),
    },
    yAxis: {
      type: 'value',
      name: '毫秒/分数',
    },
    series: [
      {
        name: 'FCP',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 3000 + 1000)),
        itemStyle: { color: '#1890ff' },
      },
      {
        name: 'LCP',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 4000 + 2000)),
        itemStyle: { color: '#52c41a' },
      },
      {
        name: 'FID',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200 + 50)),
        itemStyle: { color: '#faad14' },
      },
      {
        name: 'CLS',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.random() * 0.3),
        itemStyle: { color: '#f5222d' },
      },
      {
        name: 'TTFB',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1500 + 500)),
        itemStyle: { color: '#722ed1' },
      },
    ],
  }

  // 性能分布图
  const performanceDistributionOption = {
    title: {
      text: '性能评分分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 60, name: '优秀 (90-100)', itemStyle: { color: '#52c41a' } },
          { value: 25, name: '良好 (70-89)', itemStyle: { color: '#faad14' } },
          { value: 15, name: '需要改进 (0-69)', itemStyle: { color: '#f5222d' } },
        ],
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

  // 性能指标表格列
  const columns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => {
        const nameMap: { [key: string]: string } = {
          FCP: 'First Contentful Paint',
          LCP: 'Largest Contentful Paint',
          FID: 'First Input Delay',
          CLS: 'Cumulative Layout Shift',
          TTFB: 'Time To First Byte',
        }
        return nameMap[name] || name
      },
    },
    {
      title: '当前值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: any) => {
        const unit = record.name === 'CLS' ? '' : 'ms'
        return `${value}${unit}`
      },
    },
    {
      title: '平均值',
      key: 'average',
      render: (_: any, record: any) => {
        const avg = calculateAverage(metrics[record.name as keyof PerformanceMetrics] || [])
        const unit = record.name === 'CLS' ? '' : 'ms'
        return `${avg}${unit}`
      },
    },
    {
      title: '评级',
      key: 'grade',
      render: (_: any, record: any) => {
        const { grade, color } = getPerformanceGrade(record.name, record.value)
        return <Tag color={color}>{grade}</Tag>
      },
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time',
      render: (time: number) => dayjs(time).format('HH:mm:ss'),
    },
  ]

  return (
    <div>
      <Title level={2}>性能监控</Title>
      <Text type="secondary">监控 Core Web Vitals 和关键性能指标</Text>

      {/* 核心指标统计 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均 FCP"
              value={calculateAverage(metrics.FCP)}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
              suffix="ms"
            />
            <Progress
              percent={Math.min(100, (2000 / Math.max(calculateAverage(metrics.FCP), 1)) * 100)}
              showInfo={false}
              strokeColor="#1890ff"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均 LCP"
              value={calculateAverage(metrics.LCP)}
              valueStyle={{ color: '#52c41a' }}
              prefix={<EyeOutlined />}
              suffix="ms"
            />
            <Progress
              percent={Math.min(100, (3000 / Math.max(calculateAverage(metrics.LCP), 1)) * 100)}
              showInfo={false}
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均 FID"
              value={calculateAverage(metrics.FID)}
              valueStyle={{ color: '#faad14' }}
              prefix={<ThunderboltOutlined />}
              suffix="ms"
            />
            <Progress
              percent={Math.min(100, (100 / Math.max(calculateAverage(metrics.FID), 1)) * 100)}
              showInfo={false}
              strokeColor="#faad14"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均 CLS"
              value={calculateAverage(metrics.CLS).toFixed(3)}
              valueStyle={{ color: '#f5222d' }}
            />
            <Progress
              percent={Math.min(100, (0.1 / Math.max(calculateAverage(metrics.CLS), 0.001)) * 100)}
              showInfo={false}
              strokeColor="#f5222d"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card>
            <ReactECharts option={vitalsOption} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={performanceDistributionOption} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>

      {/* 详细数据表格 */}
      <Card title="性能指标详情" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={performanceData}
          rowKey="time"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
          }}
          locale={{ emptyText: '暂无性能数据' }}
        />
      </Card>
    </div>
  )
}
