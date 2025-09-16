/**
 * 测试工具类 - 专注于触发测试事件，不处理监控逻辑
 * 监控逻辑由 SDK 自动处理，实现业务代码与监控代码的完全分离
 */

export class TestUtils {
  /**
   * 触发 JavaScript 错误
   */
  static triggerJavaScriptError() {
    const obj: any = null
    obj.nonExistentMethod()
  }

  /**
   * 触发 Promise 错误
   */
  static triggerPromiseError() {
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('这是一个Promise错误'))
      }, 100)
    })
  }

  /**
   * 触发未处理的 Promise 错误
   */
  static triggerUnhandledPromiseError() {
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('这是一个未处理的Promise错误'))
      }, 100)
    })
  }

  /**
   * 触发资源加载错误
   */
  static triggerResourceError() {
    const img = new Image()
    img.src = 'https://example.com/nonexistent-image.jpg'
  }

  /**
   * 触发网络请求错误
   */
  static triggerNetworkError() {
    fetch('https://httpstat.us/500')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })
      .catch((error) => {
        console.error('网络请求错误:', error)
      })
  }

  /**
   * 触发语法错误
   */
  static triggerSyntaxError() {
    try {
      eval('function test() { console.log("test") }')
    }
    catch (error) {
      console.error('语法错误:', error)
    }
  }

  /**
   * 触发类型错误
   */
  static triggerTypeError() {
    try {
      const str = 'hello'
      ;(str as any).toFixed(2)
    }
    catch (error) {
      console.error('类型错误:', error)
    }
  }

  /**
   * 触发范围错误
   */
  static triggerRangeError() {
    try {
      const _arr = Array.from({ length: -1 })
    }
    catch (error) {
      console.error('范围错误:', error)
    }
  }

  /**
   * 模拟长任务
   */
  static simulateLongTask(_duration: number = 100) {
    const startTime = performance.now()
    let _result = 0

    // 执行CPU密集型任务
    for (let i = 0; i < 1000000; i++) {
      _result += Math.sqrt(i) * Math.sin(i)
    }

    const endTime = performance.now()
    console.log(`长任务完成，耗时: ${(endTime - startTime).toFixed(2)}ms`)
    return endTime - startTime
  }

  /**
   * 模拟内存泄漏
   */
  static simulateMemoryLeak(duration: number = 10000) {
    const objects: any[] = []
    const interval = setInterval(() => {
      for (let i = 0; i < 1000; i++) {
        objects.push({
          id: Date.now() + i,
          data: Array.from({ length: 1000 }).fill('memory leak test'),
          timestamp: Date.now(),
        })
      }
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      console.log(`内存泄漏测试完成，创建了 ${objects.length} 个对象`)
    }, duration)
  }

  /**
   * 模拟网络延迟
   */
  static async simulateNetworkDelay(delay: number = 200) {
    const startTime = performance.now()
    await new Promise<void>(resolve => setTimeout(resolve, delay))
    const endTime = performance.now()
    const actualDelay = endTime - startTime
    console.log(`网络延迟测试完成，实际延迟: ${actualDelay.toFixed(2)}ms`)
    return actualDelay
  }

  /**
   * 模拟渲染性能
   */
  static simulateRenderPerformance() {
    const startTime = performance.now()

    // 创建大量DOM元素
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'

    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div')
      div.textContent = `Element ${i}`
      div.style.padding = '10px'
      div.style.margin = '5px'
      div.style.border = '1px solid #ccc'
      container.appendChild(div)
    }

    document.body.appendChild(container)

    // 强制重排和重绘
    void container.offsetHeight

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // 清理
    document.body.removeChild(container)

    console.log(`渲染性能测试完成，耗时: ${renderTime.toFixed(2)}ms`)
    return renderTime
  }

  /**
   * 模拟 FPS 下降
   */
  static simulateFpsDrop(duration: number = 5000) {
    let frameCount = 0
    let lastTime = performance.now()
    const _targetFps = 30

    const animate = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        const actualFps = frameCount
        frameCount = 0
        lastTime = currentTime

        console.log(`FPS: ${actualFps}`)
      }

      // 模拟重计算
      for (let i = 0; i < 10000; i++) {
        void (Math.sqrt(i) * Math.sin(i))
      }

      requestAnimationFrame(animate)
    }

    animate()

    setTimeout(() => {
      console.log('FPS下降测试完成')
    }, duration)
  }

  /**
   * 模拟用户行为序列
   */
  static simulateUserBehavior() {
    const behaviors = [
      () => console.log('用户点击登录按钮'),
      () => console.log('用户访问仪表盘'),
      () => console.log('用户路由跳转'),
      () => console.log('用户发起网络请求'),
      () => console.log('用户点击设置按钮'),
      () => console.log('用户路由跳转到设置页'),
      () => console.log('用户提交设置'),
      () => console.log('用户返回仪表盘'),
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < behaviors.length) {
        behaviors[index]()
        index++
      }
      else {
        clearInterval(interval)
        console.log('用户行为序列模拟完成')
      }
    }, 500)
  }

  /**
   * 模拟表单提交
   */
  static simulateFormSubmission() {
    const formEvents = [
      () => console.log('用户点击用户名输入框'),
      () => console.log('用户点击密码输入框'),
      () => console.log('用户点击记住我复选框'),
      () => console.log('用户点击登录按钮'),
      () => console.log('用户发起登录请求'),
      () => console.log('用户跳转到仪表盘'),
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < formEvents.length) {
        formEvents[index]()
        index++
      }
      else {
        clearInterval(interval)
        console.log('表单提交模拟完成')
      }
    }, 300)
  }

  /**
   * 模拟购物车操作
   */
  static simulateShoppingCart() {
    const cartEvents = [
      () => console.log('用户点击商品1'),
      () => console.log('用户添加到购物车'),
      () => console.log('用户发起添加商品请求'),
      () => console.log('用户点击商品2'),
      () => console.log('用户添加到购物车'),
      () => console.log('用户发起添加商品请求'),
      () => console.log('用户点击购物车图标'),
      () => console.log('用户访问购物车页面'),
      () => console.log('用户点击结算按钮'),
      () => console.log('用户访问结算页面'),
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < cartEvents.length) {
        cartEvents[index]()
        index++
      }
      else {
        clearInterval(interval)
        console.log('购物车操作模拟完成')
      }
    }, 400)
  }

  /**
   * 批量生成错误
   */
  static generateBatchErrors(count: number = 5) {
    const errors = [
      '批量错误测试 - 错误1',
      '批量错误测试 - 错误2',
      '批量错误测试 - 错误3',
      '批量错误测试 - 错误4',
      '批量错误测试 - 错误5',
    ]

    for (let i = 0; i < Math.min(count, errors.length); i++) {
      setTimeout(() => {
        throw new Error(errors[i])
      }, i * 200)
    }
  }
}
