import {
    Breadcrumb,
    BreadcrumbOptions,
    BreadcrumbType,
    TransportData,
    TransportReturn
} from '@bottle-monitor/types'
import { getDate, runHook, useWebStorage } from '@bottle-monitor/utils'

/**
 * 事件上报
 */
const Transport = (
    dsnURL: string,
    beforeTransport?: (data: any) => any,
    beforePushBreadcrumb?: (data: any) => any
): TransportReturn => {
    const QUEUE_KEY = 'bottle-monitor'
    const queueStorage = useWebStorage()
    let breadcrumbs = {} as Record<BreadcrumbType, Breadcrumb>
    let cachedQueue = []
    let isOnline = navigator.onLine

    const loadCachedQueue = () => queueStorage.get(QUEUE_KEY)
    const saveCachedQueue = () => {
        const queues: any[] = []
        Object.entries(breadcrumbs).forEach(([_key, value]) => {
            queues.push(...value.queue)
        })
        queueStorage.set(QUEUE_KEY, queues)
    }

    const detectWebQuality = () => {
        setInterval(() => {
            if (!navigator.onLine && isOnline) saveCachedQueue()
            else if (navigator.onLine && !isOnline) loadCachedQueue()
        }, 1000)
    }

    const initBreadcrumb = (breadcrumbOptions: BreadcrumbOptions) => {
        detectWebQuality()

        breadcrumbOptions.forEach((option) => {
            const {
                breadcrumbType,
                breadcrumbId,
                capacity,
                uploadInterval,
                perBeforePushBreadcrumb
            } = option
            breadcrumbs[breadcrumbType] = {
                capacity: capacity,
                breadcrumbId,
                uploadInterval,
                lastUpload: Date.now(),
                queue: [],
                perBeforePushBreadcrumb
            }

            if (uploadInterval) {
                setInterval(() => flush(breadcrumbType), uploadInterval)
            }
        })
    }

    // 监听到 transport 事件触发时发送
    const send = (breadcrumbType: BreadcrumbType, data: TransportData) => {
        const breadcrumb = breadcrumbs[breadcrumbType]
        if (breadcrumb) {
            const { queue, capacity, perBeforePushBreadcrumb } = breadcrumb

            runHook(perBeforePushBreadcrumb, data)
            runHook(beforePushBreadcrumb, data)

            queue.push(data)

            // 双触发设计
            if (queue.length >= capacity) {
                flush(breadcrumbType, true)
            }
        } else {
            console.warn(`${breadcrumbType} queue is not exist!`)
        }
    }

    const sendByBeacon = (data: TransportData[]) => {
        return navigator.sendBeacon(dsnURL, JSON.stringify(data))
    }

    const sendByFetch = (data: TransportData[]) => {
        fetch(dsnURL, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    const formatData = () => {

    }

    const flush = (breadcrumbType: BreadcrumbType, full?: boolean) => {
        const { queue, uploadInterval, lastUpload, perBeforeTransport } =
            breadcrumbs[breadcrumbType]
        if (queue.length === 0) return
        if (
            !full &&
            uploadInterval &&
            Date.now() - lastUpload! < uploadInterval
        )
            return

        const sendData = {
            flushTime: getDate(new Date()),

        }

        if (!sendByBeacon(queue)) {
            sendByFetch(queue)
        }

        runHook(perBeforeTransport, queue)
        runHook(beforeTransport, queue)

        console.log('data flushed!', queue)
        // 清空相应队列, 更新发送时间 TODO: web-vitals 可以 idle 了再发，优先级不那么高
        breadcrumbs[breadcrumbType].queue = []
        breadcrumbs[breadcrumbType].lastUpload = Date.now()
    }

    return {
        send,
        initBreadcrumb
    }
}

export default Transport
