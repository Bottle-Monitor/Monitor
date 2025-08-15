import { TransportData } from "./data"
import { BreadcrumbOptions, BreadcrumbType } from "./options"

export interface Breadcrumb {
    breadcrumbId?: string
    capacity: number
    uploadInterval?: number
    lastUpload?: number
    queue: TransportData[],
    perBeforePushBreadcrumb?: (data: any) => any
    perBeroreTransport?: (data: any) => any
}

export interface TransportReturn {
    send: (breadcrumbType: BreadcrumbType, data: TransportData) => void
    initBreadcrumb: (breadcrumbOptions: BreadcrumbOptions) => void
}