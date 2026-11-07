import { MOCK_SERVICES } from '../mocks/services.js'
import { copyMockData, mockRequest } from '../../../../shared/api/mockRequest.js'

export const serviceService = {
  async getAvailableServices() {
    return mockRequest(copyMockData(MOCK_SERVICES))
  },
  async getServiceById(id) {
    return mockRequest(copyMockData(MOCK_SERVICES.find(service => service.id === Number(id)) ?? null))
  },
}
