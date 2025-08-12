import { ABNORMAL, EventBusReturn, InitOptions } from '@bottle-monitor/types'

// TODO: 后续可以细化为只传递所需插件的选项，将 initOptions 拆解为按插件区分的部分
const ErrorPlugin = (eventBus: EventBusReturn, initOptions: InitOptions) => {
    const capturePromise = () => {
        window.addEventListener('unhandledrejection', (ev) => {
            eventBus.emit('bottle-monitor:transport', {
                type: ABNORMAL.UNHANDLEDREJECTION,
                message: ev.reason?.message || String(ev.reason),
                stack: ev.reason.stack
            })
        })
    }

    const captureCodeError = () => {
        window.addEventListener('error', (e) => {
                if (e.error) {
                    eventBus.emit('bottle-monitor:transport', {
                        type: ABNORMAL.CODE,
                        message: e.error.message,
                        stack: e.error.stack,
                        filename: e.filename,
                        lineno: e.lineno,
                        colno: e.colno
                    })
                }
            },
            true
        )
    }

    const initPlugin = () => {}

    return {
        capturePromise,
        captureCodeError
    }
}

export default ErrorPlugin
