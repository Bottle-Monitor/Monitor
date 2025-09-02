/**
 * 白屏检测相关工具函数
 */

import type { WhiteScreenData } from '@bottle-monitor/types'
import { getKeyElements } from './dom'

/**
 * 白屏检测配置
 */
export interface WhiteScreenOptions {
  threshold?: number // 白屏阈值 0-1，默认 0.8
  samplingDelay?: number // 采样延迟，默认 1000ms
  samplingMethod?: 'canvas' | 'element' | 'mutation' // 检测方法
  keyElements?: string[] // 关键元素选择器
}

/**
 * 使用 Canvas 采样检测白屏
 */
export function detectWhiteScreenByCanvas(options: WhiteScreenOptions = {}): Promise<WhiteScreenData> {
  const { threshold = 0.8, samplingDelay = 1000 } = options

  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve({
            isWhiteScreen: false,
            score: 0,
            reason: 'Canvas context not supported',
            samplingPoints: [],
          })
          return
        }

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // 绘制当前页面到 canvas
        ctx.drawImage(document.documentElement as any, 0, 0)

        // 定义采样点（十字采样 + 对角线采样）
        const samplingPoints = getSamplingPoints(canvas.width, canvas.height)
        const results: Array<{ x: number, y: number, isWhite: boolean }> = []

        let whitePointCount = 0

        samplingPoints.forEach((point) => {
          const imageData = ctx.getImageData(point.x, point.y, 1, 1)
          const [r, g, b, a] = imageData.data

          // 判断是否为白色或透明
          const isWhite = (
            (r > 245 && g > 245 && b > 245) // 白色
            || a < 10 // 透明
          )

          results.push({
            x: point.x,
            y: point.y,
            isWhite,
          })

          if (isWhite) {
            whitePointCount++
          }
        })

        const score = whitePointCount / samplingPoints.length
        const isWhiteScreen = score >= threshold

        resolve({
          isWhiteScreen,
          score,
          reason: isWhiteScreen ? 'Canvas sampling detected white screen' : 'Normal content detected',
          samplingPoints: results,
        })
      }
      catch (error) {
        resolve({
          isWhiteScreen: false,
          score: 0,
          reason: `Canvas detection failed: ${error}`,
          samplingPoints: [],
        })
      }
    }, samplingDelay)
  })
}

/**
 * 使用关键元素检测白屏
 */
export function detectWhiteScreenByElements(options: WhiteScreenOptions = {}): Promise<WhiteScreenData> {
  const { threshold = 0.8, samplingDelay = 1000, keyElements } = options

  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const elements = keyElements
          ? keyElements.map(selector => document.querySelector(selector)).filter(Boolean)
          : getKeyElements()

        if (elements.length === 0) {
          resolve({
            isWhiteScreen: true,
            score: 1,
            reason: 'No key elements found',
            samplingPoints: [],
          })
          return
        }

        let visibleElementCount = 0

        elements.forEach((element) => {
          if (element && isElementVisible(element as Element)) {
            visibleElementCount++
          }
        })

        const score = 1 - (visibleElementCount / elements.length)
        const isWhiteScreen = score >= threshold

        resolve({
          isWhiteScreen,
          score,
          reason: isWhiteScreen
            ? `Only ${visibleElementCount}/${elements.length} key elements visible`
            : 'Key elements are visible',
          samplingPoints: [],
        })
      }
      catch (error) {
        resolve({
          isWhiteScreen: false,
          score: 0,
          reason: `Element detection failed: ${error}`,
          samplingPoints: [],
        })
      }
    }, samplingDelay)
  })
}

/**
 * 使用 MutationObserver 检测白屏
 */
export function detectWhiteScreenByMutation(options: WhiteScreenOptions = {}): Promise<WhiteScreenData> {
  const { threshold = 0.8, samplingDelay = 3000 } = options

  return new Promise((resolve) => {
    let mutationCount = 0

    const observer = new MutationObserver((mutations) => {
      mutationCount += mutations.length
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    setTimeout(() => {
      observer.disconnect()

      // 如果 DOM 变化次数太少，可能是白屏
      const score = Math.max(0, 1 - (mutationCount / 10)) // 假设正常页面至少有10次变化
      const isWhiteScreen = score >= threshold

      resolve({
        isWhiteScreen,
        score,
        reason: isWhiteScreen
          ? `Low DOM mutation count: ${mutationCount}`
          : 'Normal DOM activity detected',
        samplingPoints: [],
      })
    }, samplingDelay)
  })
}

/**
 * 综合检测白屏
 */
export async function detectWhiteScreen(options: WhiteScreenOptions = {}): Promise<WhiteScreenData> {
  const { samplingMethod = 'canvas' } = options

  switch (samplingMethod) {
    case 'canvas':
      return detectWhiteScreenByCanvas(options)
    case 'element':
      return detectWhiteScreenByElements(options)
    case 'mutation':
      return detectWhiteScreenByMutation(options)
    default:
      return detectWhiteScreenByCanvas(options)
  }
}

/**
 * 获取采样点（十字采样 + 对角线采样）
 */
function getSamplingPoints(width: number, height: number): Array<{ x: number, y: number }> {
  const points: Array<{ x: number, y: number }> = []

  // 中心点
  points.push({ x: width / 2, y: height / 2 })

  // 十字采样
  const step = Math.min(width, height) / 10
  for (let i = 1; i <= 5; i++) {
    // 水平线
    points.push({ x: width / 2 - step * i, y: height / 2 })
    points.push({ x: width / 2 + step * i, y: height / 2 })

    // 垂直线
    points.push({ x: width / 2, y: height / 2 - step * i })
    points.push({ x: width / 2, y: height / 2 + step * i })
  }

  // 对角线采样
  for (let i = 1; i <= 3; i++) {
    const offset = step * i
    points.push({ x: width / 2 - offset, y: height / 2 - offset })
    points.push({ x: width / 2 + offset, y: height / 2 + offset })
    points.push({ x: width / 2 - offset, y: height / 2 + offset })
    points.push({ x: width / 2 + offset, y: height / 2 - offset })
  }

  // 确保采样点在画布范围内
  return points.filter(point =>
    point.x >= 0 && point.x < width
    && point.y >= 0 && point.y < height,
  )
}

/**
 * 检查元素是否可见
 */
function isElementVisible(element: Element): boolean {
  if (!element)
    return false

  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)

  return (
    rect.width > 0
    && rect.height > 0
    && style.visibility !== 'hidden'
    && style.display !== 'none'
    && style.opacity !== '0'
  )
}

/**
 * 实时监控白屏状态
 */
export function monitorWhiteScreen(
  callback: (data: WhiteScreenData) => void,
  options: WhiteScreenOptions & { interval?: number } = {},
): () => void {
  const { interval = 5000 } = options

  const check = async () => {
    const result = await detectWhiteScreen(options)
    callback(result)
  }

  // 立即执行一次
  check()

  // 定时检查
  const intervalId = setInterval(check, interval)

  return () => {
    clearInterval(intervalId)
  }
}
