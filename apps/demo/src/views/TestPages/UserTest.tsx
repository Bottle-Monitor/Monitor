import {

  EyeOutlined,
  FormOutlined,
  InfoCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input

export function Component() {
  const navigate = useNavigate()
  const [clickCount, setClickCount] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [form] = Form.useForm()

  // 测试数据
  const tableData = [
    { key: 1, name: '张三', age: 28, address: '北京市朝阳区' },
    { key: 2, name: '李四', age: 32, address: '上海市浦东新区' },
    { key: 3, name: '王五', age: 25, address: '广州市天河区' },
  ]

  const tableColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" onClick={() => message.info('查看详情')}>查看</Button>
          <Button type="link" onClick={() => message.success('编辑成功')}>编辑</Button>
        </Space>
      ),
    },
  ]

  // 各种点击事件
  const handleClick = (type: string) => {
    setClickCount(prev => prev + 1)
    message.success(`触发了${type}点击事件`)
  }

  // 表单提交
  const handleFormSubmit = (values: any) => {
    console.log('表单数据:', values)
    message.success('表单提交成功')
  }

  // 路由跳转测试
  const handleRouteChange = (path: string) => {
    navigate(path)
  }

  // 复杂交互：批量操作
  const handleBatchOperations = () => {
    // 模拟复杂的用户交互流程
    message.loading('处理中...', 1)
    setTimeout(() => {
      message.success('批量操作完成')
    }, 1000)
  }

  return (
    <div>
      <Title level={2}>用户交互测试页面</Title>
      <Text type="secondary">
        此页面包含各种用户交互元素，用于测试用户行为监控功能
      </Text>

      <Paragraph style={{ marginTop: 16 }}>
        <Text strong>
          当前点击计数:
          {clickCount}
        </Text>
      </Paragraph>

      <Divider>基础交互测试</Divider>

      <Card title="按钮点击测试">
        <Paragraph>
          测试各种类型的按钮点击事件
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() => handleClick('主要按钮')}
          >
            主要按钮
          </Button>
          <Button
            type="default"
            onClick={() => handleClick('默认按钮')}
          >
            默认按钮
          </Button>
          <Button
            type="dashed"
            onClick={() => handleClick('虚线按钮')}
          >
            虚线按钮
          </Button>
          <Button
            type="text"
            onClick={() => handleClick('文本按钮')}
          >
            文本按钮
          </Button>
          <Button
            type="link"
            onClick={() => handleClick('链接按钮')}
          >
            链接按钮
          </Button>
          <Button
            danger
            onClick={() => handleClick('危险按钮')}
          >
            危险按钮
          </Button>
        </Space>
      </Card>

      <Divider>表单交互测试</Divider>

      <Card title="表单填写测试">
        <Paragraph>
          测试表单元素的交互和提交行为
        </Paragraph>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item label="性别" name="gender">
            <Select placeholder="请选择性别">
              <Option value="male">男</Option>
              <Option value="female">女</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item label="兴趣爱好" name="hobbies">
            <Checkbox.Group>
              <Checkbox value="reading">阅读</Checkbox>
              <Checkbox value="music">音乐</Checkbox>
              <Checkbox value="sports">运动</Checkbox>
              <Checkbox value="travel">旅行</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="个人介绍" name="description">
            <TextArea rows={4} placeholder="请输入个人介绍" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<FormOutlined />}>
                提交表单
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置表单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Divider>弹窗交互测试</Divider>

      <Card title="弹窗和抽屉测试">
        <Paragraph>
          测试模态框、抽屉等浮层组件的交互
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            onClick={() => setModalVisible(true)}
          >
            打开模态框
          </Button>
          <Button
            type="primary"
            onClick={() => setDrawerVisible(true)}
          >
            打开抽屉
          </Button>
          <Tooltip title="这是一个提示信息">
            <Button icon={<InfoCircleOutlined />}>
              悬停提示
            </Button>
          </Tooltip>
        </Space>

        <Modal
          title="测试模态框"
          open={modalVisible}
          onOk={() => {
            message.success('确认操作')
            setModalVisible(false)
          }}
          onCancel={() => setModalVisible(false)}
        >
          <p>这是一个测试模态框，用于测试弹窗交互行为。</p>
          <p>点击确定或取消按钮会触发相应的用户行为事件。</p>
        </Modal>

        <Drawer
          title="测试抽屉"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={400}
        >
          <p>这是一个测试抽屉组件。</p>
          <p>可以在这里放置各种交互元素。</p>
          <Button
            type="primary"
            onClick={() => {
              message.info('抽屉中的操作')
              setDrawerVisible(false)
            }}
            style={{ marginTop: 16 }}
          >
            执行操作
          </Button>
        </Drawer>
      </Card>

      <Divider>页面跳转测试</Divider>

      <Card title="路由导航测试">
        <Paragraph>
          测试页面间的导航和路由跳转行为
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleRouteChange('/dashboard')}
          >
            跳转到概览页
          </Button>
          <Button
            onClick={() => handleRouteChange('/errors')}
          >
            跳转到错误监控
          </Button>
          <Button
            onClick={() => handleRouteChange('/performance')}
          >
            跳转到性能监控
          </Button>
          <Button
            onClick={() => handleRouteChange('/user-behavior')}
          >
            跳转到用户行为
          </Button>
        </Space>
      </Card>

      <Divider>数据交互测试</Divider>

      <Card title="表格操作测试">
        <Paragraph>
          测试表格数据的查看、编辑等操作
        </Paragraph>
        <Table
          columns={tableColumns}
          dataSource={tableData}
          pagination={false}
          size="small"
        />
      </Card>

      <Divider>复杂交互测试</Divider>

      <Card title="批量操作测试">
        <Paragraph>
          测试复杂的用户交互流程
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={handleBatchOperations}
          >
            执行批量操作
          </Button>
          <Button
            onClick={() => {
              // 连续触发多个事件
              handleClick('连续点击1')
              setTimeout(() => handleClick('连续点击2'), 100)
              setTimeout(() => handleClick('连续点击3'), 200)
            }}
          >
            连续点击测试
          </Button>
        </Space>
      </Card>

      <Card title="外部链接测试" style={{ marginTop: 16 }}>
        <Paragraph>
          测试外部链接的点击行为
        </Paragraph>
        <Space wrap>
          <Button
            type="link"
            onClick={() => window.open('https://ant.design', '_blank')}
          >
            打开外部链接 (新窗口)
          </Button>
          <a
            href="https://github.com/ant-design/ant-design"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => message.info('点击了外部链接')}
          >
            GitHub 链接
          </a>
          <a
            href="#section1"
            onClick={() => message.info('点击了锚点链接')}
          >
            页面锚点
          </a>
        </Space>
      </Card>

      <div style={{ marginTop: 500 }} id="section1">
        <Title level={4}>页面底部区域</Title>
        <Text>这是页面底部的内容，用于测试锚点跳转。</Text>
      </div>
    </div>
  )
}
