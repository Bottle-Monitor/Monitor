import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const { Title, Text } = Typography

interface MonitoringData {
  monitoringData: any[]
}

export function Component() {
  const { monitoringData } = useOutletContext<MonitoringData>()
  const [errorCount, setErrorCount] = useState(0)
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [userActions, setUserActions] = useState(0)
  const [recentErrors, setRecentErrors] = useState<any[]>([])

  // 实时统计监控数据
  useEffect(() => {
    if (monitoringData) {
      const errors = monitoringData.filter(item => item.category === 'abnormal')
      const performance = monitoringData.filter(item => item.category === 'vitals')
      const user = monitoringData.filter(item => item.category === 'user')

      setErrorCount(errors.length)
      setPerformanceData(performance)
      setUserActions(user.length)
      setRecentErrors(errors.slice(-5).reverse()) // 最近5条错误
    }
  }, [monitoringData])

  // 错误趋势图配置
  const errorTrendOption = {
    title: {
      text: '错误趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [2, 5, 3, 8, 4, 6],
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#ff4d4f',
        },
      },
    ],
  }

  // 性能指标图配置
  const performanceOption = {
    title: {
      text: '性能指标分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '性能指标',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'FCP' },
          { value: 735, name: 'LCP' },
          { value: 580, name: 'FID' },
          { value: 484, name: 'CLS' },
          { value: 300, name: 'TTFB' },
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

  // 错误表格列配置
  const errorColumns = [
    {
      title: '错误类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'jsError' ? 'red' : type === 'promiseReject' ? 'orange' : 'blue'
        return <Tag color={color}>{type}</Tag>
      },
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time',
      render: (time: number) => new Date(time).toLocaleTimeString(),
    },
  ]

  return (
    <div>
      <Title level={2}>监控概览</Title>
      <Text type="secondary">实时监控前端应用的性能和错误状态</Text>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总错误数"
              value={errorCount}
              valueStyle={{ color: '#cf1322' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="性能数据点"
              value={performanceData.length}
              valueStyle={{ color: '#1890ff' }}
              suffix="条"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户行为"
              value={userActions}
              valueStyle={{ color: '#52c41a' }}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线状态"
              value="正常"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={errorTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={performanceOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 最近错误列表 */}
      <Card title="最近错误" style={{ marginTop: 24 }}>
        <Table
          columns={errorColumns}
          dataSource={recentErrors}
          rowKey="time"
          pagination={false}
          locale={{ emptyText: '暂无错误数据' }}
        />
      </Card>
    </div>
  )
}
