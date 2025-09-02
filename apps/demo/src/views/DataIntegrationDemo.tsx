import type { MonitoringData } from '../services/monitoringService'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined,
  ReloadOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Progress, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../services/monitoringService'

const { Title, Text } = Typography

const DataIntegrationDemo: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [recentData, setRecentData] = useState<MonitoringData[]>([])
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadData()
    // 每3秒刷新一次数据，实现实时联动
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 检查连接状态
      const connected = await monitoringService.checkConnection()
      setIsConnected(connected)

      if (connected) {
        const [statsData, recentData] = await Promise.all([
          monitoringService.getStats(),
          monitoringService.getMonitoringData({ limit: 50 }),
        ])
        setStats(statsData)
        setRecentData(recentData?.items || [])
        setLastUpdate(new Date())
      }
    }
    catch (error) {
      console.error('加载数据失败:', error)
      setIsConnected(false)
    }
    finally {
      setLoading(false)
    }
  }

  const getRealTimeChartOption = () => {
    // 基于真实数据生成实时图表
    if (!recentData || recentData.length === 0) {
      return {
        title: { text: '暂无实时数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 按分钟统计最近的数据
    const now = new Date()
    const minutes = []
    const errorData = []
    const performanceData = []
    const userData = []

    for (let i = 59; i >= 0; i--) {
      const minute = new Date(now.getTime() - i * 60 * 1000)
      minutes.push(`${minute.getHours().toString().padStart(2, '0')}:${minute.getMinutes().toString().padStart(2, '0')}`)

      const minuteStart = minute.getTime()
      const minuteEnd = minuteStart + 60 * 1000

      // 计算每分钟的数据量
      const minuteData = recentData.filter(item =>
        item.timestamp >= minuteStart && item.timestamp < minuteEnd,
      )

      errorData.push(minuteData.filter(item => item.category === 'error').length)
      performanceData.push(minuteData.filter(item => item.category === 'performance').length)
      userData.push(minuteData.filter(item => item.category === 'user').length)
    }

    return {
      title: {
        text: '实时数据流（最近60分钟）',
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
        data: minutes,
        axisLabel: {
          rotate: 45,
        },
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
        {
          name: '性能',
          type: 'line',
          data: performanceData,
          itemStyle: { color: '#1890ff' },
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
              ],
            },
          },
        },
        {
          name: '用户行为',
          type: 'line',
          data: userData,
          itemStyle: { color: '#52c41a' },
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.1)' },
              ],
            },
          },
        },
      ],
    }
  }

  const getDataFlowChartOption = () => {
    // 数据流向图
    const nodes = [
      { name: '测试页面', x: 100, y: 100, itemStyle: { color: '#1890ff' } },
      { name: '监控SDK', x: 300, y: 100, itemStyle: { color: '#52c41a' } },
      { name: '后端服务器', x: 500, y: 100, itemStyle: { color: '#722ed1' } },
      { name: '统计页面', x: 500, y: 300, itemStyle: { color: '#fa8c16' } },
    ]

    const links = [
      { source: '测试页面', target: '监控SDK', value: stats?.totalEvents || 0 },
      { source: '监控SDK', target: '后端服务器', value: stats?.totalEvents || 0 },
      { source: '后端服务器', target: '统计页面', value: stats?.totalEvents || 0 },
    ]

    return {
      title: {
        text: '数据流向图',
        left: 'center',
      },
      tooltip: {
        formatter(params: any) {
          if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target}<br/>数据量: ${params.data.value}`
          }
          return params.data.name
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          data: nodes,
          links,
          roam: true,
          label: {
            show: true,
            position: 'right',
          },
          force: {
            repulsion: 100,
            edgeLength: 200,
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            show: true,
            formatter: '{c}',
          },
        },
      ],
    }
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleTimeString(),
      width: 120,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const colorMap: Record<string, string> = {
          error: 'red',
          performance: 'blue',
          user: 'green',
          custom: 'orange',
        }
        return <Tag color={colorMap[category] || 'default'}>{category}</Tag>
      },
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => source || '未知',
      width: 120,
    },
    {
      title: '数据',
      dataIndex: 'data',
      key: 'data',
      render: (data: any) => {
        if (typeof data === 'object') {
          return (
            <Text code>
              {JSON.stringify(data).substring(0, 50)}
              ...
            </Text>
          )
        }
        return <Text code>{String(data)}</Text>
      },
      ellipsis: true,
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
          <Button size="small" onClick={loadData} icon={<ReloadOutlined />}>
            重试连接
          </Button>
        )}
      />
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>前后端数据联动演示</Title>
        <Text type="secondary">
          实时展示测试页面与统计页面的数据联动效果
        </Text>
      </div>

      {/* 连接状态 */}
      <Alert
        message="实时数据同步状态"
        description={(
          <div>
            <p>
              • 服务器连接:
              <Tag color={isConnected ? 'success' : 'error'}>{isConnected ? '正常' : '异常'}</Tag>
            </p>
            <p>
              • 最后更新:
              <Text code>{lastUpdate.toLocaleTimeString()}</Text>
            </p>
            <p>• 数据刷新间隔: 3秒</p>
            <p>
              • 总数据量:
              <Text strong>{stats?.totalEvents || 0}</Text>
              {' '}
              条
            </p>
          </div>
        )}
        type={isConnected ? 'success' : 'error'}
        showIcon
        style={{ marginBottom: 24 }}
        action={(
          <Button size="small" icon={<SyncOutlined />} onClick={loadData}>
            立即刷新
          </Button>
        )}
      />

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总监控事件"
              value={stats?.totalEvents || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="错误事件"
              value={stats?.errors || 0}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="性能指标"
              value={stats?.vitals || 0}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户行为"
              value={stats?.userActions || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 实时数据流图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="实时数据流" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>}>
            <ReactECharts option={getRealTimeChartOption()} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="数据流向图">
            <ReactECharts option={getDataFlowChartOption()} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>

      {/* 系统健康度 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="系统健康度">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>整体评分: </Text>
                <Progress
                  percent={Math.max(0, 100 - ((stats?.errors || 0) / Math.max(stats?.totalEvents || 1, 1)) * 100)}
                  status="active"
                />
              </div>
              <div>
                <Text>错误率: </Text>
                <Progress
                  percent={Math.min(100, ((stats?.errors || 0) / Math.max(stats?.totalEvents || 1, 1)) * 100)}
                  status="exception"
                />
              </div>
              <div>
                <Text>数据同步率: </Text>
                <Progress
                  percent={isConnected ? 100 : 0}
                  status={isConnected ? 'active' : 'exception'}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="数据分类统计">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>错误数据: </Text>
                <Progress
                  percent={Math.min(100, ((stats?.errors || 0) / Math.max(stats?.totalEvents || 1, 1)) * 100)}
                  status="exception"
                  strokeColor="#ff4d4f"
                />
              </div>
              <div>
                <Text>性能数据: </Text>
                <Progress
                  percent={Math.min(100, ((stats?.vitals || 0) / Math.max(stats?.totalEvents || 1, 1)) * 100)}
                  status="active"
                  strokeColor="#1890ff"
                />
              </div>
              <div>
                <Text>用户行为: </Text>
                <Progress
                  percent={Math.min(100, ((stats?.userActions || 0) / Math.max(stats?.totalEvents || 1, 1)) * 100)}
                  status="active"
                  strokeColor="#52c41a"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 最近事件 */}
      <Card
        title="最近监控事件"
        extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>}
      >
        <Table
          columns={columns}
          dataSource={recentData}
          rowKey="id"
          pagination={false}
          loading={loading}
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>如何测试前后端数据联动：</Text>
          <ol>
            <li>确保后端服务器正在运行</li>
            <li>打开测试页面（用户行为、性能、错误测试）</li>
            <li>执行各种测试操作</li>
            <li>观察此页面的实时数据变化</li>
            <li>数据应该每3秒自动刷新</li>
          </ol>
          <Alert
            message="实时联动效果"
            description="测试页面产生的数据会实时显示在此页面的图表和统计中，实现真正的前后端数据联动。"
            type="success"
            showIcon
          />
        </Space>
      </Card>
    </div>
  )
}

export default DataIntegrationDemo
