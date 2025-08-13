import {
    Breadcrumb,
    BreadcrumbOptions,
    BreadcrumbType,
    TransportData,
    TransportReturn
} from '@bottle-monitor/types'
/**
 * 事件上报
 */

const Transport = (dsnURL: string): TransportReturn => {
    let breadcrumbs = {} as Record<BreadcrumbType, Breadcrumb>

    const initBreadcrumb = (breadcrumbOptions: BreadcrumbOptions) => {
        breadcrumbOptions.forEach((option) => {
            const { breadcrumbType, breadcrumbId, capacity, uploadInterval } =
                option
            breadcrumbs[breadcrumbType] = {
                capacity: capacity,
                breadcrumbId,
                uploadInterval,
                lastUpload: Date.now(),
                queue: []
            }

            if (uploadInterval) {
                setInterval(() => flush(breadcrumbType), uploadInterval)
            }
        })
    }

    // 监听到 transport 事件触发时发送
    const send = (breadcrumbType: BreadcrumbType, data: TransportData) => {
        // BUG: 此处，有闭包问题
        const breadcrumb = breadcrumbs[breadcrumbType]
        if (breadcrumb) {
            const { queue, capacity } = breadcrumb
            queue.push(data)

            // 双触发设计
            if (queue.length >= capacity) {
                flush(breadcrumbType, true)
            }
        } else {
            console.warn(`${breadcrumbType} 队列不存在!`)
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

    const flush = (breadcrumbType: BreadcrumbType, full?: boolean) => {
        const { queue, uploadInterval, lastUpload } =
            breadcrumbs[breadcrumbType]
        if (queue.length === 0) return
        if (
            !full &&
            uploadInterval &&
            Date.now() - lastUpload! < uploadInterval
        )
            return

        if (!sendByBeacon(queue)) {
            sendByFetch(queue)
        }
        console.log('data flushed!')
        // 清空相应队列, 更新发送时间
        breadcrumbs[breadcrumbType].queue = []
        breadcrumbs[breadcrumbType].lastUpload = Date.now()
    }

    return {
        send,
        initBreadcrumb
    }
}

export default Transport
