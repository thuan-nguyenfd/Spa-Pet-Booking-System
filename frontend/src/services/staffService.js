import { MOCK_STAFF } from '../mocks/staff.js'
import { minutesFromTime } from '../utils/bookingDuration.js'
import { copyMockData, mockRequest } from './mockRequest.js'

export const staffService = {
  async getAvailableStaff({ date, startTime, endTime }) {
    const weekday = new Date(`${date}T12:00:00`).getDay()
    const startMinute = minutesFromTime(startTime)
    const endMinute = minutesFromTime(endTime)
    const available = MOCK_STAFF.filter((staff) => {
      if (staff.unavailableWeekdays.includes(weekday)) return false
      return !staff.unavailableWindows.some((window) => (
        startMinute < minutesFromTime(window.end) && endMinute > minutesFromTime(window.start)
      ))
    }).map(({ unavailableWeekdays, unavailableWindows, ...staff }) => staff)
    return mockRequest(copyMockData(available), 300)
  },
}
