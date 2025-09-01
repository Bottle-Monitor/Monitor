import { ClockCircleOutlined, LoadingOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Divider, Space, Spin, Typography } from 'antd'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

export function Component() {
  const [isLongTaskRunning, setIsLongTaskRunning] = useState(false)
  const [domElements, setDomElements] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [layoutShifts, setLayoutShifts] = useState(0)

  // 长任务 - 阻塞主线程
  const triggerLongTask = () => {
    setIsLongTaskRunning(true)
    const startTime = performance.now()

    // 模拟长时间运行的同步任务
    setTimeout(() => {
      while (performance.now() - startTime < 2000) {
        // 阻塞主线程2秒
        Math.random()
      }
      setIsLongTaskRunning(false)
    }, 10)
  }

  // 大量DOM操作 - 测试渲染性能
  const triggerMassiveDOMOperations = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newElements = Array.from({ length: 1000 }, (_, i) => i)
      setDomElements(newElements)
      setIsLoading(false)
    }, 100)
  }

  // 清理DOM元素
  const clearDOMElements = () => {
    setDomElements([])
  }

  // 触发布局偏移 (CLS)
  const triggerLayoutShift = () => {
    setLayoutShifts(prev => prev + 1)

    // 动态插入图片导致布局偏移
    const container = document.getElementById('layout-shift-container')
    if (container) {
      const img = document.createElement('img')
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxheW91dCBTaGlmdCBUZXN0PC90ZXh0Pjwvc3ZnPg=='
      img.style.width = '300px'
      img.style.height = '200px'
      img.style.display = 'block'
      img.style.margin = '10px 0'

      // 延迟设置尺寸，模拟真实的布局偏移
      setTimeout(() => {
        container.appendChild(img)
        setTimeout(() => {
          if (container.contains(img)) {
            container.removeChild(img)
          }
        }, 3000)
      }, 500)
    }
  }

  // 模拟慢速网络请求
  const simulateSlowNetworkRequest = async () => {
    setIsLoading(true)
    try {
      // 模拟慢速API请求
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log('慢速请求完成')
    }
    finally {
      setIsLoading(false)
    }
  }

  // 大量内存分配
  const triggerMemoryLeak = () => {
    const largeArray = Array.from({ length: 1000000 }).fill('memory-test-data')
    console.log('分配了大量内存:', largeArray.length)

    // 故意不清理引用，模拟内存泄漏
    setTimeout(() => {
      console.log('内存分配测试完成')
    }, 1000)
  }

  // 强制重排和重绘
  const triggerReflowRepaint = () => {
    const testDiv = document.getElementById('reflow-test')
    if (testDiv) {
      // 连续修改样式触发重排重绘
      for (let i = 0; i < 100; i++) {
        testDiv.style.width = `${100 + i}px`
        testDiv.style.height = `${100 + i}px`
        testDiv.style.backgroundColor = `hsl(${i * 3.6}, 50%, 50%)`

        // 强制读取布局属性触发重排
        void testDiv.offsetWidth
        void testDiv.offsetHeight
      }
    }
  }

  return (
    <div>
      <Title level={2}>性能测试页面</Title>
      <Text type="secondary">
        此页面用于测试各种性能场景，验证监控系统的性能指标收集能力
      </Text>

      <Alert
        message="性能测试说明"
        description="以下测试会影响页面性能，可以观察 Core Web Vitals 指标的变化"
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />

      <Divider>CPU 性能测试</Divider>

      <Card title="主线程阻塞测试">
        <Paragraph>
          测试长任务对 FID (First Input Delay) 的影响
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            icon={<ClockCircleOutlined />}
            onClick={triggerLongTask}
            loading={isLongTaskRunning}
            disabled={isLongTaskRunning}
          >
            {isLongTaskRunning ? '执行长任务中...' : '触发长任务 (2秒)'}
          </Button>
          {isLongTaskRunning && (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          )}
        </Space>
      </Card>

      <Divider>渲染性能测试</Divider>

      <Card title="DOM 操作性能测试">
        <Paragraph>
          测试大量 DOM 操作对渲染性能的影响
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={triggerMassiveDOMOperations}
            loading={isLoading}
          >
            创建1000个DOM元素
          </Button>
          <Button onClick={clearDOMElements} disabled={domElements.length === 0}>
            清理DOM元素
          </Button>
        </Space>

        {domElements.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Text>
              已创建
              {domElements.length}
              {' '}
              个元素
            </Text>
            <div
              style={{
                maxHeight: 200,
                overflowY: 'auto',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                padding: 8,
                marginTop: 8,
              }}
            >
              {domElements.slice(0, 100).map(num => (
                <div key={num} style={{ padding: 2, fontSize: 12 }}>
                  元素 #
                  {num}
                </div>
              ))}
              {domElements.length > 100 && (
                <div style={{ textAlign: 'center', color: '#999' }}>
                  ... 还有
                  {' '}
                  {domElements.length - 100}
                  {' '}
                  个元素
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      <Card title="重排重绘测试" style={{ marginTop: 16 }}>
        <Paragraph>
          测试强制重排重绘对性能的影响
        </Paragraph>
        <Button type="primary" onClick={triggerReflowRepaint}>
          触发重排重绘
        </Button>
        <div
          id="reflow-test"
          style={{
            width: 100,
            height: 100,
            backgroundColor: '#1890ff',
            margin: '16px 0',
            transition: 'all 0.1s',
          }}
        >
          测试元素
        </div>
      </Card>

      <Divider>布局稳定性测试</Divider>

      <Card title="CLS (累积布局偏移) 测试">
        <Paragraph>
          测试动态内容导致的布局偏移
        </Paragraph>
        <Space wrap>
          <Button type="primary" onClick={triggerLayoutShift}>
            触发布局偏移
          </Button>
          <Text>
            已触发
            {layoutShifts}
            {' '}
            次布局偏移
          </Text>
        </Space>
        <div id="layout-shift-container" style={{ marginTop: 16, minHeight: 50 }}>
          <div style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            这里会动态插入内容，导致布局偏移
          </div>
        </div>
      </Card>

      <Divider>网络性能测试</Divider>

      <Card title="网络请求性能测试">
        <Paragraph>
          测试慢速网络请求对 TTFB 和用户体验的影响
        </Paragraph>
        <Button
          type="primary"
          onClick={simulateSlowNetworkRequest}
          loading={isLoading}
        >
          模拟慢速请求 (3秒)
        </Button>
      </Card>

      <Divider>内存性能测试</Divider>

      <Card title="内存使用测试">
        <Paragraph>
          测试大量内存分配对性能的影响
        </Paragraph>
        <Button type="primary" onClick={triggerMemoryLeak}>
          分配大量内存
        </Button>
      </Card>

      <Alert
        message="测试说明"
        description={(
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>
              <strong>长任务</strong>
              : 阻塞主线程2秒，影响FID指标
            </li>
            <li>
              <strong>DOM操作</strong>
              : 创建大量DOM元素，测试渲染性能
            </li>
            <li>
              <strong>布局偏移</strong>
              : 动态插入内容，影响CLS指标
            </li>
            <li>
              <strong>慢速请求</strong>
              : 模拟网络延迟，影响TTFB指标
            </li>
            <li>
              <strong>内存分配</strong>
              : 测试内存使用对整体性能的影响
            </li>
            <li>
              <strong>重排重绘</strong>
              : 强制浏览器重新计算布局和绘制
            </li>
          </ul>
        )}
        type="warning"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  )
}
