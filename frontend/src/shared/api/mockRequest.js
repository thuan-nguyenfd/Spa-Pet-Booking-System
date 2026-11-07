export function mockRequest(data, delay = 240) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), delay)
  })
}

export function copyMockData(value) {
  return JSON.parse(JSON.stringify(value))
}
