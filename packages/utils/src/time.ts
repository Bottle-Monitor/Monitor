/**
 * 拿到一段代码的执行时间
 */
export function timeMeasure(key: string, fn?: (...args: any[]) => any) {
    if (typeof fn !== 'function') return
    const startKey = key + '-start'
    const endKey = key + '-end'

    performance.mark(startKey)
    fn()
    performance.mark(endKey)

    performance.measure(key, {
        start: startKey,
        end: endKey
    })

    const measures = performance.getEntriesByName(key, 'measure')
    return measures.map((measure) => measure.duration)
}
