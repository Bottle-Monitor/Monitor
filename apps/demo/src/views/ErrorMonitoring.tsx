import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, DatePicker, Input, Row, Select, Table, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import ReactECharts from 'echarts-for-react'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

interface MonitoringData {
  monitoringData: any[]
}

export function Component() {
  const { monitoringData } = useOutletContext<MonitoringData>()
  const [errorData, setErrorData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [searchText, setSearchText] = useState('')
  const [errorType, setErrorType] = useState('all')

  // 处理错误数据
  useEffect(() => {
    if (monitoringData) {
      const errors = monitoringData.filter(item => item.category === 'abnormal')
      setErrorData(errors)
      setFilteredData(errors)
    }
  }, [monitoringData])

  // 过滤数据
  useEffect(() => {
    let filtered = errorData

    if (searchText) {
      filtered = filtered.filter(item =>
        item.message?.toLowerCase().includes(searchText.toLowerCase())
        || item.stack?.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    if (errorType !== 'all') {
      filtered = filtered.filter(item => item.type === errorType)
    }

    setFilteredData(filtered)
  }, [errorData, searchText, errorType])

  // 错误分布图配置
  const errorDistributionOption = {
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
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: errorData.filter(item => item.type === 'jsError').length, name: 'JS错误' },
          { value: errorData.filter(item => item.type === 'promiseReject').length, name: 'Promise错误' },
          { value: errorData.filter(item => item.type === 'resourceError').length, name: '资源错误' },
          { value: errorData.filter(item => item.type === 'xhr').length, name: 'XHR错误' },
          { value: errorData.filter(item => item.type === 'fetch').length, name: 'Fetch错误' },
        ],
      },
    ],
  }

  // 错误趋势图配置
  const errorTrendOption = {
    title: {
      text: '24小时错误趋势',
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
      name: '错误数量',
    },
    series: [
      {
        name: '错误数量',
        type: 'line',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
        itemStyle: {
          color: '#ff4d4f',
        },
        areaStyle: {
          color: 'rgba(255, 77, 79, 0.3)',
        },
      },
    ],
  }

  // 表格列配置
  const columns = [
    {
      title: '错误类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const colorMap: { [key: string]: string } = {
          jsError: 'red',
          promiseReject: 'orange',
          resourceError: 'blue',
          xhr: 'green',
          fetch: 'purple',
        }
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>
      },
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      width: 200,
      ellipsis: true,
    },
    {
      title: '行号',
      dataIndex: 'lineno',
      key: 'lineno',
      width: 80,
    },
    {
      title: '列号',
      dataIndex: 'colno',
      key: 'colno',
      width: 80,
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            console.log('查看详情:', record)
          }}
        >
          详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>错误监控</Title>
      <Text type="secondary">监控和分析前端应用中的各类错误</Text>

      {/* 统计警告 */}
      {errorData.length > 0 && (
        <Alert
          message={`检测到 ${errorData.length} 个错误`}
          description="建议及时处理高频错误，提升用户体验"
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={errorDistributionOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={errorTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 过滤器 */}
      <Card title="错误列表" style={{ marginTop: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="搜索错误信息"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="错误类型"
              value={errorType}
              onChange={setErrorType}
            >
              <Option value="all">全部类型</Option>
              <Option value="jsError">JS错误</Option>
              <Option value="promiseReject">Promise错误</Option>
              <Option value="resourceError">资源错误</Option>
              <Option value="xhr">XHR错误</Option>
              <Option value="fetch">Fetch错误</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={2}>
            <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
              刷新
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="time"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
          }}
          locale={{ emptyText: '暂无错误数据' }}
        />
      </Card>
    </div>
  )
}
