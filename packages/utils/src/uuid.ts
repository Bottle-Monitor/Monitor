/**
 * 生成UUID相关工具函数
 */

/**
 * 生成简单的UUID v4
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // 降级方案
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 生成短UUID（用于会话ID等）
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15)
}

/**
 * 生成基于时间戳的ID
 */
export function generateTimestampId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
