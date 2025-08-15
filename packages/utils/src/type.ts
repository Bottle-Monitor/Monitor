export function getType(value: any) {
    return Object.prototype.toString
        .call(value)
        .slice(8, -1)
        .toLowerCase()
    /**
     * toLocaleLowerCase() 会根据本地化规则来转换，
     * 有些语言环境（如土耳其语的 İ/i）可能出现意外结果
     */
}

export function isArray(value: unknown): value is any[] {
    if (Array.isArray(value)) return true

    console.warn(`${value} must be an array, however ${getType(value)}.`)
    return false
}

export function isFunction(value: unknown): value is Function {
    if (typeof value === 'function') return true

    console.warn(`${value} must be a function, however ${getType(value)}.`)
    return false
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return getType(value) === 'object'
}

export function isNull(value: unknown): value is null {
    return value === null
}

export function isDate(value: unknown): value is Date {
    return getType(value) === 'date'
}
