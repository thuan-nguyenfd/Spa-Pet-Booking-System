import { MOCK_BUSY_SLOTS_BY_WEEKDAY, MOCK_SLOT_STARTS } from '../mocks/availability.js'
import { addMinutesToTime, minutesFromTime } from '../utils/bookingDuration.js'
import { mockRequest } from './mockRequest.js'

const LAST_BOOKABLE_MINUTE = minutesFromTime('18:00')

function weekdayFor(date) {
  return new Date(`${date}T12:00:00`).getDay()
}

export const availabilityService = {
  async getAvailableSlots({ date, totalDuration }) {
    const busySlots = MOCK_BUSY_SLOTS_BY_WEEKDAY[weekdayFor(date)] ?? []
    const slots = MOCK_SLOT_STARTS.filter((startTime) => {
      const endTime = addMinutesToTime(startTime, totalDuration)
      return !busySlots.includes(startTime) && minutesFromTime(endTime) <= LAST_BOOKABLE_MINUTE
    })
    return mockRequest(slots)
  },
}
