/**
 * DOM 操作相关工具函数
 */

/**
 * 获取元素的XPath路径
 */
export function getXPath(element: Element): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`
  }

  if (element === document.body) {
    return '/html/body'
  }

  let index = 0
  const siblings = element.parentNode?.children

  if (siblings) {
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i]
      if (sibling === element) {
        const tagName = element.tagName.toLowerCase()
        const parent = element.parentNode as Element
        const parentPath = parent ? getXPath(parent) : ''

        return `${parentPath}/${tagName}[${index + 1}]`
      }

      if (sibling.tagName === element.tagName) {
        index++
      }
    }
  }

  return ''
}

/**
 * 获取元素的CSS选择器路径
 */
export function getCSSSelector(element: Element): string {
  if (element.id) {
    return `#${element.id}`
  }

  const path: string[] = []

  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.tagName.toLowerCase()

    if (element.className) {
      const classes = element.className.trim().split(/\s+/).join('.')
      selector += `.${classes}`
    }

    // 检查是否唯一
    const parent = element.parentElement
    if (parent) {
      const siblings = Array.from(parent.children)
      const sameTagSiblings = siblings.filter(sibling =>
        sibling.tagName.toLowerCase() === selector.split('.')[0],
      )

      if (sameTagSiblings.length > 1) {
        const index = sameTagSiblings.indexOf(element) + 1
        selector += `:nth-child(${index})`
      }
    }

    path.unshift(selector)
    element = element.parentElement as Element
  }

  return path.join(' > ')
}

/**
 * 获取元素的文本内容（去除空白字符）
 */
export function getElementText(element: Element): string {
  return element.textContent?.trim().slice(0, 150) || ''
}

/**
 * 检查元素是否在视口中
 */
export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 获取元素相对于文档的坐标
 */
export function getElementPosition(element: Element): { x: number, y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + window.pageXOffset,
    y: rect.top + window.pageYOffset,
  }
}

/**
 * 检查点击是否在元素上
 */
export function isClickOnElement(element: Element, x: number, y: number): boolean {
  const rect = element.getBoundingClientRect()
  return (
    x >= rect.left
    && x <= rect.right
    && y >= rect.top
    && y <= rect.bottom
  )
}

/**
 * 获取页面关键元素（用于白屏检测）
 */
export function getKeyElements(): Element[] {
  const selectors = [
    'body',
    'main',
    '#app',
    '#root',
    '.container',
    'header',
    'nav',
    '.content',
    '.main',
  ]

  const elements: Element[] = []

  selectors.forEach((selector) => {
    try {
      const element = document.querySelector(selector)
      if (element) {
        elements.push(element)
      }
    }
    catch (_e) {
      // 忽略无效选择器
    }
  })

  return elements
}

/**
 * 检查元素是否为可交互元素
 */
export function isInteractiveElement(element: Element): boolean {
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea']
  const tagName = element.tagName.toLowerCase()

  return (
    interactiveTags.includes(tagName)
    || element.hasAttribute('onclick')
    || element.hasAttribute('role')
    || (element as HTMLElement).style.cursor === 'pointer'
  )
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
