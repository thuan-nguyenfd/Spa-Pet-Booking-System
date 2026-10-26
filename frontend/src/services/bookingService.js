import { mockRequest } from './mockRequest.js'

function bookingDateCode(date) {
  const [year, month, day] = date.split('-')
  return `${year.slice(-2)}${month}${day}`
}

export const bookingService = {
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
