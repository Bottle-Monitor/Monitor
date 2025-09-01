import { BugOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Divider, Space, Typography } from 'antd'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

export function Component() {
  const [errorCount, setErrorCount] = useState(0)

  // JS运行时错误
  const triggerJSError = () => {
    setErrorCount(prev => prev + 1)
    const undefinedVar: any = null
    undefinedVar.someProperty.doesNotExist()
  }

  // Promise 拒绝错误
  const triggerPromiseError = () => {
    setErrorCount(prev => prev + 1)
    Promise.reject(new Error('这是一个 Promise 拒绝错误测试'))
  }

  // 资源加载错误
  const triggerResourceError = () => {
    setErrorCount(prev => prev + 1)
    const img = new Image()
    img.src = 'https://this-url-does-not-exist-404.com/image.jpg'
    document.body.appendChild(img)
    setTimeout(() => document.body.removeChild(img), 1000)
  }

  // 网络请求错误 (Fetch)
  const triggerFetchError = () => {
    setErrorCount(prev => prev + 1)
    fetch('https://this-api-does-not-exist-404.com/data')
      .catch(error => console.error('Fetch error:', error))
  }

  // XHR 请求错误
  const triggerXHRError = () => {
    setErrorCount(prev => prev + 1)
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://this-api-does-not-exist-404.com/data')
    xhr.send()
  }

  // 语法错误（通过动态脚本）
  const triggerSyntaxError = () => {
    setErrorCount(prev => prev + 1)
    const script = document.createElement('script')
    script.textContent = 'const invalid syntax = ;'
    document.head.appendChild(script)
    setTimeout(() => document.head.removeChild(script), 100)
  }

  // 类型错误
  const triggerTypeError = () => {
    setErrorCount(prev => prev + 1)
    const num = 123 as any
    num.toUpperCase() // 数字没有 toUpperCase 方法
  }

  // 引用错误
  const triggerReferenceError = () => {
    setErrorCount(prev => prev + 1)
    // @ts-expect-error - 故意触发引用错误
    console.log(thisVariableDoesNotExist)
  }

  return (
    <div>
      <Title level={2}>错误测试页面</Title>
      <Text type="secondary">
        此页面用于测试各种类型的前端错误，验证监控系统的错误捕获能力
      </Text>

      <Alert
        message={`已触发 ${errorCount} 个错误`}
        description="这些错误将被监控系统捕获并记录，您可以在错误监控页面查看详细信息"
        type={errorCount > 0 ? 'warning' : 'info'}
        showIcon
        style={{ marginTop: 16 }}
      />

      <Divider>JavaScript 运行时错误</Divider>

      <Card title="运行时错误测试">
        <Paragraph>
          测试各种 JavaScript 运行时错误，包括类型错误、引用错误等
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            danger
            icon={<BugOutlined />}
            onClick={triggerJSError}
          >
            触发 JS 错误
          </Button>
          <Button
            type="primary"
            danger
            icon={<CloseCircleOutlined />}
            onClick={triggerTypeError}
          >
            触发类型错误
          </Button>
          <Button
            type="primary"
            danger
            icon={<WarningOutlined />}
            onClick={triggerReferenceError}
          >
            触发引用错误
          </Button>
          <Button
            type="primary"
            danger
            icon={<BugOutlined />}
            onClick={triggerSyntaxError}
          >
            触发语法错误
          </Button>
        </Space>
      </Card>

      <Divider>异步错误</Divider>

      <Card title="Promise 和异步错误测试">
        <Paragraph>
          测试 Promise 拒绝和异步操作中的错误
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            danger
            icon={<CloseCircleOutlined />}
            onClick={triggerPromiseError}
          >
            触发 Promise 错误
          </Button>
        </Space>
      </Card>

      <Divider>网络和资源错误</Divider>

      <Card title="网络请求错误测试">
        <Paragraph>
          测试网络请求失败、资源加载失败等错误
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            danger
            icon={<WarningOutlined />}
            onClick={triggerFetchError}
          >
            触发 Fetch 错误
          </Button>
          <Button
            type="primary"
            danger
            icon={<WarningOutlined />}
            onClick={triggerXHRError}
          >
            触发 XHR 错误
          </Button>
          <Button
            type="primary"
            danger
            icon={<CloseCircleOutlined />}
            onClick={triggerResourceError}
          >
            触发资源加载错误
          </Button>
        </Space>
      </Card>

      <Divider>错误模拟说明</Divider>

      <Card title="测试说明">
        <Paragraph>
          <ul>
            <li>
              <strong>JS错误</strong>
              : 访问 null 对象的属性，触发运行时错误
            </li>
            <li>
              <strong>Promise错误</strong>
              : 主动拒绝 Promise，测试未捕获的拒绝
            </li>
            <li>
              <strong>资源错误</strong>
              : 加载不存在的图片资源
            </li>
            <li>
              <strong>Fetch错误</strong>
              : 请求不存在的API接口
            </li>
            <li>
              <strong>XHR错误</strong>
              : 使用XMLHttpRequest请求不存在的接口
            </li>
            <li>
              <strong>语法错误</strong>
              : 动态创建包含语法错误的脚本
            </li>
            <li>
              <strong>类型错误</strong>
              : 对错误的数据类型调用方法
            </li>
            <li>
              <strong>引用错误</strong>
              : 访问未定义的变量
            </li>
          </ul>
        </Paragraph>
        <Alert
          message="注意"
          description="这些错误是故意触发的测试错误，用于验证监控系统的功能。在生产环境中应避免此类错误。"
          type="warning"
          showIcon
        />
      </Card>
    </div>
  )
}
