import { MOCK_SERVICES } from '../mocks/services.js'
import { copyMockData, mockRequest } from './mockRequest.js'

export const serviceService = {
  async getAvailableServices() {
    return mockRequest(copyMockData(MOCK_SERVICES))
  },
}
