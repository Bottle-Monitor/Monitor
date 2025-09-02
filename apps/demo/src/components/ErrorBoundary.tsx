import type { ErrorInfo, ReactNode } from 'react'
import { BugOutlined, ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Typography } from 'antd'
import React, { Component } from 'react'

const { Title, Text } = Typography

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Card>
            <div style={{ marginBottom: '24px' }}>
              <BugOutlined style={{ fontSize: '64px', color: '#ff4d4f', marginBottom: '16px' }} />
              <Title level={3} style={{ color: '#ff4d4f' }}>
                应用出现错误
              </Title>
              <Text type="secondary">
                很抱歉，应用遇到了一个意外错误。请尝试重新加载页面或联系技术支持。
              </Text>
            </div>

            <Alert
              message="错误详情"
              description={(
                <div style={{ textAlign: 'left' }}>
                  <Text strong>错误信息:</Text>
                  <br />
                  <Text code>{this.state.error?.message || '未知错误'}</Text>
                  <br />
                  <br />
                  <Text strong>错误堆栈:</Text>
                  <br />
                  <pre style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    overflow: 'auto',
                    maxHeight: '200px',
                  }}
                  >
                    {this.state.error?.stack || '无堆栈信息'}
                  </pre>
                </div>
              )}
              type="error"
              showIcon
              style={{ marginBottom: '24px', textAlign: 'left' }}
            />

            <div>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                style={{ marginRight: '12px' }}
              >
                重新加载页面
              </Button>
              <Button onClick={this.handleReset}>
                尝试恢复
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
