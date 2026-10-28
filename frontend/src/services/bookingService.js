import { copyMockData, mockRequest } from './mockRequest.js'
import { MOCK_BOOKINGS } from '../mocks/bookings.js'
import { mapBookingResponse } from '../utils/bookingMapper.js'
import { getTotalDuration } from '../utils/bookingDuration.js'
import { MOCK_STAFF } from '../mocks/staff.js'
import { getBookingActions } from '../utils/bookingDetail.js'
import { staffService } from './staffService.js'
import { availabilityService } from './availabilityService.js'

const RESCHEDULE_STORAGE_KEY = 'meomeo:booking-reschedules'
const BOOKING_CHANGES_KEY = 'meomeo:booking-changes'

function readBookingChanges() {
  try { return JSON.parse(window.sessionStorage.getItem(BOOKING_CHANGES_KEY) ?? '{}') }
  catch { return {} }
}

function getMockBooking(id) {
  const bookingId = Number(id)
  if (!Number.isSafeInteger(bookingId) || bookingId <= 0) return null
  const original = MOCK_BOOKINGS.find((item) => item.id === bookingId)
  return original ? applyRescheduleOverride({ ...copyMockData(original), ...readBookingChanges()[bookingId] }) : null
}

function saveBookingChanges(id, changes) {
  const all = readBookingChanges()
  all[id] = { ...all[id], ...changes }
  window.sessionStorage.setItem(BOOKING_CHANGES_KEY, JSON.stringify(all))
}

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
  if (startMinutes < 8 * 60 || endMinutes > 18 * 60 || endMinutes <= startMinutes) {
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
    const bookings = MOCK_BOOKINGS.map((booking) => mapBookingResponse(getMockBooking(booking.id)))
    return mockRequest(bookings, 520)
  },

  async getBookingById(id) {
    // Replace this mock source with GET /api/bookings/{id}; keep returning the shared booking model.
    const booking = getMockBooking(id)
    return mockRequest(booking ? mapBookingResponse(booking) : null, 520)
  },

  async rescheduleBooking(id, requestedAppointment) {
    const bookingId = Number(id)
    const booking = getMockBooking(bookingId)
    if (!booking) throw new Error('Booking not found')
    if (!getBookingActions(booking).canReschedule) throw new Error('Booking cannot be rescheduled')

    const appointment = getRescheduledAppointment(booking, requestedAppointment)
    const slots = await availabilityService.getAvailableSlots({ date: appointment.date, totalDuration: getTotalDuration(booking.services), excludeBookingId: bookingId })
    if (!slots.includes(appointment.startTime)) throw new Error('Appointment slot is no longer available')
    const staff = await staffService.getAvailableStaff({ ...appointment, excludeBookingId: bookingId })
    const selectedStaff = staff.find((member) => member.id === Number(requestedAppointment.employeeId))
    if (!selectedStaff) throw new Error('Employee is no longer available')
    const overrides = readRescheduleOverrides()
    overrides[String(bookingId)] = { ...appointment, employeeId: selectedStaff.id }
    window.sessionStorage.setItem(RESCHEDULE_STORAGE_KEY, JSON.stringify(overrides))

    const updatedBooking = { ...booking, employee: { ...booking.employee, id: selectedStaff.id, name: selectedStaff.name }, appointment }
    return mockRequest(mapBookingResponse(updatedBooking), 420)
  },

  async cancelBooking(id, reason) {
    const booking = getMockBooking(id)
    if (!booking) throw new Error('Booking not found')
    if (!getBookingActions(booking).canCancel) throw new Error('Booking cannot be cancelled')
    saveBookingChanges(booking.id, { bookingStatus: 'CANCELLED', cancellationReason: reason ?? null })
    return mockRequest(mapBookingResponse(getMockBooking(id)))
  },

  async reviewBooking(id, { rating, comment }) {
    const booking = getMockBooking(id)
    if (!booking) throw new Error('Booking not found')
    if (!getBookingActions(booking).canReview || booking.review) throw new Error('Booking cannot be reviewed')
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Invalid rating')
    const review = { id: Date.now(), rating, comment: String(comment ?? '').trim(), hidden: false, createdAt: new Date().toISOString() }
    saveBookingChanges(booking.id, { review })
    return mockRequest(mapBookingResponse(getMockBooking(id)))
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
