export function selectService(mockImplementation) {
  if ((import.meta.env.VITE_DATA_SOURCE || 'mock') !== 'mock')
    throw new Error('Chưa cấu hình kết nối máy chủ.')
  return mockImplementation
}
