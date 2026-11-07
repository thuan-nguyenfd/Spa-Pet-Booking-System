import { currentUser } from '../mocks/customerRepository.js'
import { MOCK_CUSTOMER } from '../mocks/customer.js'
import { copyMockData, mockRequest } from '../../../../shared/api/mockRequest.js'

export const customerService = {
  async getCurrentCustomer() {
    return mockRequest(copyMockData(currentUser() ?? MOCK_CUSTOMER), 120)
  },
}
