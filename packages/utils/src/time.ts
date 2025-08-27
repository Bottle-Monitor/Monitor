/**
 * 拿到一段代码的执行时间
 */
export function timeMeasure(key: string, fn?: (...args: any[]) => any) {
  if (typeof fn !== 'function')
    return
  const startKey = `${key}-start`
  const endKey = `${key}-end`

  performance.mark(startKey)
  fn()
  performance.mark(endKey)

  performance.measure(key, {
    start: startKey,
    end: endKey,
  })

  const measures = performance.getEntriesByName(key, 'measure')
  return measures.map(measure => measure.duration)
}

export function getDate(date: Date, pattern = 'YYYY-MM-DD HH:mm:ss'): string {
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0')

  const tokens: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
    d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
  }

  return pattern.replace(
    /YYYY|MM|DD|HH|mm|ss|SSS|d/g,
    token => tokens[token] || token,
  )
}
