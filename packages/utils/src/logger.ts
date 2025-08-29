function createLogger() {
  let enabled = true

  const enable = () => {
    enabled = true
  }

  const disable = () => {
    enabled = false
  }

  const log = (message: string) => {
    if (enabled) {
      console.log(message)
    }
  }

  const warn = (message: string) => {
    if (enabled) {
      console.warn(message)
    }
  }

  const error = (message: string) => {
    if (enabled) {
      console.error(message)
    }
  }

  return {
    enable,
    disable,
    log,
    warn,
    error,
  }
}

export const logger = createLogger()
