import { runHook } from './hook'

export interface StorageOptions {
    storage: Storage
    beforeSetStorage: (...args: any[]) => any
    beforeGetStorage: (...args: any[]) => any
}

type UseStorageOptions = Partial<StorageOptions>

export function useWebStorage(options: UseStorageOptions = {}) {
    const {
        storage = localStorage,
        beforeGetStorage,
        beforeSetStorage
    } = options

    function set<T>(key: string, value: T) {
        storage.setItem(key, runHook(beforeSetStorage, value))
    }

    function get<T>(key: string): T | null {
        const value = storage.getItem(key)

        try {
            return JSON.parse(runHook(beforeGetStorage, value)) as T
        } catch (e: unknown) {
            console.warn(`[useStorage] 解析失败：${e}`)
            return null
        }
    }

    const clear = () => {
        storage.clear()
    }

    const remove = (key: string) => {
        storage.removeItem(key)
    }

    return {
        set,
        get,
        remove,
        clear
    }
}
