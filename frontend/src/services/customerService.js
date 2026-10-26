import { MOCK_CUSTOMER } from '../mocks/customer.js'
import { copyMockData, mockRequest } from './mockRequest.js'

export const customerService = {
  async getCurrentCustomer() {
    return mockRequest(copyMockData(MOCK_CUSTOMER), 120)
  },
}
