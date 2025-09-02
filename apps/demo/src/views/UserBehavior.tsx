import type { MonitoringData } from '../services/monitoringService'
import {
  CheckCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Progress, Row, Space, Statistic, Table, Tag, Timeline, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import React, { useEffect, useState } from 'react'
import { monitoringService } from '../services/monitoringService'

const { Title, Text } = Typography

const UserBehavior: React.FC = () => {
  const [userData, setUserData] = useState<MonitoringData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBehavior, setSelectedBehavior] = useState<MonitoringData | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [userBehaviorStats, setUserBehaviorStats] = useState<any>({})

  useEffect(() => {
    loadUserBehaviorData()
    // 每5秒刷新一次用户行为数据，实现实时联动
    const interval = setInterval(loadUserBehaviorData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadUserBehaviorData = async () => {
    setLoading(true)
    try {
      // 获取所有用户相关的数据，包括测试页面上报的数据
      const [userData, statsData] = await Promise.all([
        monitoringService.getMonitoringData({
          category: 'user',
          limit: 100,
          // 添加时间范围，获取最近的数据
          startTime: Date.now() - 24 * 60 * 60 * 1000, // 最近24小时
        }),
        monitoringService.getStats(),
      ])

      if (userData?.items) {
        setUserData(userData.items)
      }

      if (statsData) {
        setStats(statsData)
        setUserBehaviorStats(statsData.userBehaviorStats || {})
      }
    }
    catch (error) {
      console.error('加载用户行为数据失败:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const getUserBehaviorChartOption = () => {
    // 基于真实数据生成饼图
    const chartData = Object.entries(userBehaviorStats)
      .map(([type, stats]: [string, any]) => ({
        value: stats.count || 0,
        name: getBehaviorTypeText(type),
      }))
      .filter(item => item.value > 0)

    if (chartData.length === 0) {
      return {
        title: { text: '暂无用户行为数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    return {
      title: {
        text: '用户行为分布',
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
          name: '行为类型',
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

  const getUserBehaviorTrendChartOption = () => {
    // 基于真实数据生成趋势图
    if (!userData || userData.length === 0) {
      return {
        title: { text: '暂无趋势数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 按小时统计用户行为趋势
    const now = new Date()
    const hours = []
    const clickData = []
    const pageViewData = []
    const routeChangeData = []
    const networkData = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      hours.push(`${hour.getHours().toString().padStart(2, '0')}:00`)

      const hourStart = hour.getTime()
      const hourEnd = hourStart + 60 * 60 * 1000

      // 计算每小时的数据量
      const hourData = userData.filter(item =>
        item.timestamp >= hourStart && item.timestamp < hourEnd,
      )

      clickData.push(hourData.filter(item => item.type === 'click').length)
      pageViewData.push(hourData.filter(item => item.type === 'pageView').length)
      routeChangeData.push(hourData.filter(item => item.type === 'history').length)
      networkData.push(hourData.filter(item => item.type === 'network').length)
    }

    return {
      title: {
        text: '用户行为趋势（最近24小时）',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['点击', '页面访问', '路由变化', '网络请求'],
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
          name: '点击',
          type: 'line',
          data: clickData,
          itemStyle: { color: '#52c41a' },
          smooth: true,
        },
        {
          name: '页面访问',
          type: 'line',
          data: pageViewData,
          itemStyle: { color: '#1890ff' },
          smooth: true,
        },
        {
          name: '路由变化',
          type: 'line',
          data: routeChangeData,
          itemStyle: { color: '#722ed1' },
          smooth: true,
        },
        {
          name: '网络请求',
          type: 'line',
          data: networkData,
          itemStyle: { color: '#fa8c16' },
          smooth: true,
        },
      ],
    }
  }

  const getUserSourceChartOption = () => {
    // 基于真实数据生成来源分布图
    if (!userData || userData.length === 0) {
      return {
        title: { text: '暂无来源数据', left: 'center' },
        error: { text: '暂无数据' },
      }
    }

    // 统计不同来源的用户行为
    const sourceStats: Record<string, number> = {}
    userData.forEach((item) => {
      const source = (item as any).source || '未知'
      sourceStats[source] = (sourceStats[source] || 0) + 1
    })

    const chartData = Object.entries(sourceStats).map(([source, count]) => ({
      name: source,
      value: count,
    }))

    return {
      title: {
        text: '用户行为来源分布',
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
          name: '来源',
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

  const getUserActivityChartOption = () => {
    // 基于真实数据生成24小时活跃度趋势
    const now = new Date()
    const hours = []
    const activityData = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      hours.push(`${hour.getHours().toString().padStart(2, '0')}:00`)

      const hourStart = hour.getTime()
      const hourEnd = hourStart + 60 * 60 * 1000

      // 计算每小时的用户行为数量
      const hourData = userData.filter(item =>
        item.timestamp >= hourStart && item.timestamp < hourEnd,
      )

      // 统计独立用户数
      const uniqueUsers = new Set(hourData.map(item => item.userId).filter(Boolean))
      activityData.push(uniqueUsers.size)
    }

    return {
      title: {
        text: '用户活跃度趋势 (24小时)',
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
        name: '活跃用户数',
      },
      series: [
        {
          name: '活跃用户',
          type: 'bar',
          data: activityData,
          itemStyle: { color: '#1890ff' },
        },
      ],
    }
  }

  const getBehaviorTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      click: '点击事件',
      pageView: '页面访问',
      history: '路由变化',
      network: '网络请求',
      deviceInfo: '设备信息',
      custom: '自定义事件',
    }
    return typeMap[type] || type
  }

  const getBehaviorTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      click: 'blue',
      pageView: 'green',
      history: 'purple',
      network: 'orange',
      deviceInfo: 'cyan',
      custom: 'default',
    }
    return colorMap[type] || 'default'
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '行为类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getBehaviorTypeColor(type)}>
          {getBehaviorTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '行为详情',
      dataIndex: 'data',
      key: 'data',
      render: (data: any) => {
        if (data.type === 'click') {
          return `点击了 ${data.target || '未知元素'}`
        }
        if (data.type === 'pageView') {
          return `访问了 ${data.url || '未知页面'}`
        }
        if (data.type === 'history') {
          return `路由变化: ${data.from || '未知'} → ${data.to || '未知'}`
        }
        if (data.type === 'network') {
          return `${data.method || 'GET'} ${data.url || '未知URL'}`
        }
        return `${JSON.stringify(data).substring(0, 50)}...`
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
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => userId || '匿名',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MonitoringData) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setSelectedBehavior(record)}
        >
          详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>用户行为监控</Title>
        <Text type="secondary">
          追踪和分析用户在应用中的行为模式，包括点击、页面访问、路由变化等
        </Text>
      </div>

      {/* 用户行为统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户行为"
              value={stats?.userActions || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="页面访问"
              value={userBehaviorStats.pageView?.count || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="点击事件"
              value={userBehaviorStats.click?.count || 0}
              prefix={<MoreOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="独立用户数"
              value={new Set(userData.map(item => item.userId).filter(Boolean)).size}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="用户行为分布">
            <ReactECharts option={getUserBehaviorChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="用户活跃度趋势">
            <ReactECharts option={getUserActivityChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="用户行为趋势">
            <ReactECharts option={getUserBehaviorTrendChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="用户行为来源分布">
            <ReactECharts option={getUserSourceChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 用户行为指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="页面访问率">
            <Progress percent={85} status="active" />
            <Text type="secondary">较昨日 +5%</Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="用户停留时间">
            <Progress percent={72} status="active" />
            <Text type="secondary">平均: 3分25秒</Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="跳出率">
            <Progress percent={28} status="active" />
            <Text type="secondary">较昨日 -3%</Text>
          </Card>
        </Col>
      </Row>

      {/* 实时用户行为 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="实时用户行为" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadUserBehaviorData}>刷新</Button>}>
            {userData.length === 0
              ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="secondary">暂无用户行为数据</Text>
                  </div>
                )
              : (
                  <Timeline>
                    {userData.slice(0, 5).map((item, index) => (
                      <Timeline.Item key={item.id} color={getBehaviorTypeColor(item.type)}>
                        <Text>
                          用户
                          {' '}
                          {item.userId || '匿名'}
                          {' '}
                          {getBehaviorTypeText(item.type)}
                        </Text>
                        <br />
                        <Text type="secondary">
                          {Math.round((Date.now() - item.timestamp) / 1000)}
                          秒前
                        </Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="热门页面">
            {(() => {
              // 统计页面访问次数
              const pageStats = new Map<string, number>()
              userData.forEach((item) => {
                if (item.url) {
                  const pathname = new URL(item.url).pathname
                  pageStats.set(pathname, (pageStats.get(pathname) || 0) + 1)
                }
              })

              const sortedPages = Array.from(pageStats.entries())
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)

              if (sortedPages.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="secondary">暂无页面访问数据</Text>
                  </div>
                )
              }

              const maxCount = Math.max(...sortedPages.map(([, count]) => count))

              return (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {sortedPages.map(([pathname, count]) => (
                    <React.Fragment key={pathname}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>{pathname}</Text>
                        <Text strong>
                          {count}
                          {' '}
                          次访问
                        </Text>
                      </div>
                      <Progress percent={Math.round((count / maxCount) * 100)} showInfo={false} />
                    </React.Fragment>
                  ))}
                </Space>
              )
            })()}
          </Card>
        </Col>
      </Row>

      {/* 用户行为列表 */}
      <Card
        title="用户行为列表"
        extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadUserBehaviorData}>刷新</Button>}
      >
        <Table
          columns={columns}
          dataSource={userData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条行为记录`,
          }}
          loading={loading}
          size="small"
        />
      </Card>

      {/* 行为详情弹窗 */}
      {selectedBehavior && (
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
            title="用户行为详情"
            style={{ width: '80%', maxWidth: 800 }}
            extra={
              <Button type="text" onClick={() => setSelectedBehavior(null)}>✕</Button>
            }
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="行为类型">
                <Tag color={getBehaviorTypeColor(selectedBehavior.type)}>
                  {getBehaviorTypeText(selectedBehavior.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发生时间">
                {new Date(selectedBehavior.timestamp).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="页面URL" span={2}>
                {selectedBehavior.url || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="用户ID">
                {selectedBehavior.userId || '匿名'}
              </Descriptions.Item>
              <Descriptions.Item label="会话ID">
                {selectedBehavior.sessionId || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="用户代理" span={2}>
                {selectedBehavior.userAgent || '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="行为详情" span={2}>
                <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
                  {JSON.stringify(selectedBehavior.data, null, 2)}
                </pre>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </div>
  )
}

export default UserBehavior
