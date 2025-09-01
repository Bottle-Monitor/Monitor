import { ClockCircleOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic, Table, Tag, Timeline, Typography } from 'antd'
import dayjs from 'dayjs'
import ReactECharts from 'echarts-for-react'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const { Title, Text } = Typography

interface MonitoringData {
  monitoringData: any[]
}

interface UserAction {
  type: string
  target: string
  time: number
  url: string
  [key: string]: any
}

export function Component() {
  const { monitoringData } = useOutletContext<MonitoringData>()
  const [userActions, setUserActions] = useState<UserAction[]>([])
  const [pageViews, setPageViews] = useState<any[]>([])
  const [_clickHeatmap, setClickHeatmap] = useState<any[]>([])

  // 处理用户行为数据
  useEffect(() => {
    if (monitoringData) {
      const actions = monitoringData.filter(item => item.category === 'user')
      setUserActions(actions)

      // 统计页面访问
      const pageViewData = actions
        .filter(action => action.type === 'history-route' || action.type === 'hash-route')
        .reduce((acc: any, action) => {
          const page = action.url || action.target
          acc[page] = (acc[page] || 0) + 1
          return acc
        }, {})

      setPageViews(Object.entries(pageViewData).map(([page, count]) => ({
        page,
        count,
      })))

      // 点击热力图数据
      const clicks = actions.filter(action => action.type === 'click')
      setClickHeatmap(clicks)
    }
  }, [monitoringData])

  // 用户行为分布图
  const behaviorDistributionOption = {
    title: {
      text: '用户行为类型分布',
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
        data: [
          {
            value: userActions.filter(action => action.type === 'click').length,
            name: '点击事件',
            itemStyle: { color: '#1890ff' },
          },
          {
            value: userActions.filter(action => action.type === 'history-route').length,
            name: '页面跳转',
            itemStyle: { color: '#52c41a' },
          },
          {
            value: userActions.filter(action => action.type === 'hash-route').length,
            name: '哈希路由',
            itemStyle: { color: '#faad14' },
          },
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

  // 用户活跃度趋势图
  const activityTrendOption = {
    title: {
      text: '用户活跃度趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    },
    yAxis: {
      type: 'value',
      name: '操作次数',
    },
    series: [
      {
        name: '用户操作',
        type: 'bar',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50 + 10)),
        itemStyle: {
          color: '#52c41a',
        },
      },
    ],
  }

  // 页面访问量图表
  const pageViewOption = {
    title: {
      text: '页面访问量统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: pageViews.map(item => item.page),
    },
    series: [
      {
        name: '访问量',
        type: 'bar',
        data: pageViews.map(item => item.count),
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  }

  // 用户行为表格列
  const columns = [
    {
      title: '行为类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap: { [key: string]: { label: string, color: string } } = {
          'click': { label: '点击', color: 'blue' },
          'history-route': { label: '页面跳转', color: 'green' },
          'hash-route': { label: '哈希路由', color: 'orange' },
        }
        const config = typeMap[type] || { label: type, color: 'default' }
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: '目标元素',
      dataIndex: 'target',
      key: 'target',
      ellipsis: true,
    },
    {
      title: '页面路径',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      ellipsis: true,
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  // 用户行为时间线数据
  const timelineItems = userActions
    .slice(-10)
    .reverse()
    .map((action, index) => ({
      color: action.type === 'click' ? 'blue' : action.type === 'history-route' ? 'green' : 'orange',
      children: (
        <div key={index}>
          <p>
            <Tag color={action.type === 'click' ? 'blue' : action.type === 'history-route' ? 'green' : 'orange'}>
              {action.type}
            </Tag>
            {action.target || action.url}
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            {dayjs(action.time).format('HH:mm:ss')}
          </p>
        </div>
      ),
    }))

  return (
    <div>
      <Title level={2}>用户行为分析</Title>
      <Text type="secondary">分析用户在应用中的交互行为和访问模式</Text>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总交互次数"
              value={userActions.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="页面访问量"
              value={pageViews.reduce((sum, item) => sum + item.count, 0)}
              valueStyle={{ color: '#52c41a' }}
              prefix={<EyeOutlined />}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均会话时长"
              value={Math.floor(Math.random() * 300 + 60)}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
              suffix="秒"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={1}
              valueStyle={{ color: '#f5222d' }}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <ReactECharts option={behaviorDistributionOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={activityTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts option={pageViewOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 实时行为时间线和详细表格 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title="最近用户行为" style={{ height: 400 }}>
            <Timeline items={timelineItems} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="用户行为详情">
            <Table
              columns={columns}
              dataSource={userActions}
              rowKey="time"
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
              }}
              locale={{ emptyText: '暂无用户行为数据' }}
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
