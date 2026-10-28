import { copyMockData, mockRequest } from './mockRequest.js'
import { MOCK_BOOKINGS } from '../mocks/bookings.js'
import { mapBookingResponse } from '../utils/bookingMapper.js'
import { getTotalDuration } from '../utils/bookingDuration.js'
import { MOCK_STAFF } from '../mocks/staff.js'

const RESCHEDULE_STORAGE_KEY = 'meomeo:booking-reschedules'

function readRescheduleOverrides() {
  try {
    return JSON.parse(window.sessionStorage.getItem(RESCHEDULE_STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function applyRescheduleOverride(booking) {
  const override = readRescheduleOverrides()[String(booking.id)]
  return override
    ? {
      ...booking,
      employee: override.employeeId
        ? { ...booking.employee, id: override.employeeId, name: MOCK_STAFF.find((member) => Number(member.id) === Number(override.employeeId))?.name ?? booking.employee?.name }
        : booking.employee,
      appointment: { ...booking.appointment, ...override },
    }
    : booking
}

function formatTime(totalMinutes) {
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}` // taste-skill-ignore
}

function getRescheduledAppointment(booking, requested) {
  const date = String(requested?.date ?? '')
  const startTime = String(requested?.startTime ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime)) {
    throw new Error('Invalid appointment date or time')
  }

  const [year, month, day] = date.split('-').map(Number)
  const parsedDate = new Date(year, month - 1, day)
  if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) {
    throw new Error('Invalid appointment date')
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (parsedDate <= today) throw new Error('Appointment must be in the future')

  const [hours, minutes] = startTime.split(':').map(Number)
  if (hours > 23 || minutes > 59) throw new Error('Invalid appointment time')
  const startMinutes = hours * 60 + minutes
  const endMinutes = startMinutes + getTotalDuration(booking.services)
  if (startMinutes < 9 * 60 || endMinutes > 18 * 60 || endMinutes <= startMinutes) {
    throw new Error('Appointment is outside the available hours')
  }

  return { date, startTime, endTime: formatTime(endMinutes) }
}

function bookingDateCode(date) {
  const [year, month, day] = date.split('-')
  return `${year.slice(-2)}${month}${day}`
}

export const bookingService = {
  async getMyBookings() {
    // Replace this mock source with GET /api/bookings/my; the page consumes the same mapped model.
    const bookings = copyMockData(MOCK_BOOKINGS).map(applyRescheduleOverride).map(mapBookingResponse)
    return mockRequest(bookings, 520)
  },

  async getBookingById(id) {
    // Replace this mock source with GET /api/bookings/{id}; keep returning the shared booking model.
    const bookingId = Number(id)
    const booking = Number.isSafeInteger(bookingId) && bookingId > 0
      ? copyMockData(MOCK_BOOKINGS).find((item) => Number(item.id) === bookingId)
      : null

    return mockRequest(booking ? mapBookingResponse(applyRescheduleOverride(booking)) : null, 520)
  },

  async rescheduleBooking(id, requestedAppointment) {
    const bookingId = Number(id)
    const booking = Number.isSafeInteger(bookingId) && bookingId > 0
      ? copyMockData(MOCK_BOOKINGS).find((item) => Number(item.id) === bookingId)
      : null
    if (!booking) throw new Error('Booking not found')
    if (booking.bookingStatus !== 'PENDING') throw new Error('Booking cannot be rescheduled')

    const appointment = getRescheduledAppointment(booking, requestedAppointment)
    const overrides = readRescheduleOverrides()
    overrides[String(bookingId)] = { ...appointment, employeeId: requestedAppointment.employeeId }
    window.sessionStorage.setItem(RESCHEDULE_STORAGE_KEY, JSON.stringify(overrides))

    const currentEmployee = MOCK_STAFF.find((member) => Number(member.id) === Number(requestedAppointment.employeeId))
    const updatedBooking = { ...booking, employee: { ...booking.employee, id: requestedAppointment.employeeId, name: currentEmployee?.name ?? booking.employee?.name }, appointment }
    return mockRequest(mapBookingResponse(updatedBooking), 420)
  },

  async createBooking(draft) {
    const dateKey = `meomeo:booking-sequence:${draft.appointmentDate}`
    let sequence = 1
    try {
      sequence = Number(window.sessionStorage.getItem(dateKey) ?? 0) + 1
      window.sessionStorage.setItem(dateKey, String(sequence))
    } catch {
      sequence = Math.floor(Math.random() * 900) + 100
    }

    const booking = {
      bookingCode: `MEO-${bookingDateCode(draft.appointmentDate)}-${String(sequence).padStart(3, '0')}`,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      paymentMethod: draft.paymentMethod,
      submittedAt: new Date().toISOString(),
    }
    return mockRequest(booking, 650)
  },
}
