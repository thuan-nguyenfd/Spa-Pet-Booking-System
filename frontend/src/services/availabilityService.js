import { MOCK_BUSY_SLOTS_BY_WEEKDAY, MOCK_SLOT_STARTS } from '../mocks/availability.js'
import { MOCK_BOOKINGS } from '../mocks/bookings.js'
import { addMinutesToTime, minutesFromTime } from '../utils/bookingDuration.js'
import { mockRequest } from './mockRequest.js'

const LAST_BOOKABLE_MINUTE = minutesFromTime('18:00')

function weekdayFor(date) {
  return new Date(`${date}T12:00:00`).getDay()
}

export const availabilityService = {
  async getAvailableSlots({ date, totalDuration, excludeBookingId }) {
    const weekday = weekdayFor(date)
    const busySlots = [...(MOCK_BUSY_SLOTS_BY_WEEKDAY[weekday] ?? [])]
    const excludedBooking = MOCK_BOOKINGS.find((booking) => Number(booking.id) === Number(excludeBookingId))
    if (excludedBooking?.appointment?.date === date) {
      const slotIndex = busySlots.indexOf(excludedBooking.appointment.startTime)
      if (slotIndex >= 0) busySlots.splice(slotIndex, 1)
    }
    if (excludedBooking?.appointment?.date === date) {
      const existingStart = excludedBooking.appointment.startTime
      const existingEnd = excludedBooking.appointment.endTime
      return mockRequest(MOCK_SLOT_STARTS.filter((startTime) => {
        const endTime = addMinutesToTime(startTime, totalDuration)
        const [startHour, startMinute] = startTime.split(':').map(Number)
        const [endHour, endMinute] = endTime.split(':').map(Number)
        const candidateStart = startHour * 60 + startMinute
        const candidateEnd = endHour * 60 + endMinute
        const existingStartMinute = Number(existingStart.slice(0, 2)) * 60 + Number(existingStart.slice(3, 5))
        const existingEndMinute = Number(existingEnd.slice(0, 2)) * 60 + Number(existingEnd.slice(3, 5))
        if (candidateStart === existingStartMinute) return candidateEnd <= LAST_BOOKABLE_MINUTE
        const overlapsExisting = candidateStart < existingEndMinute && candidateEnd > existingStartMinute
        return !overlapsExisting && !busySlots.includes(startTime) && minutesFromTime(endTime) <= LAST_BOOKABLE_MINUTE
      }))
    }
    const slots = MOCK_SLOT_STARTS.filter((startTime) => {
      const endTime = addMinutesToTime(startTime, totalDuration)
      return !busySlots.includes(startTime) && minutesFromTime(endTime) <= LAST_BOOKABLE_MINUTE
    })
    return mockRequest(slots)
  },
}
