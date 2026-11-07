import { BOOKING_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from '../constants/bookingDomain.js'

export function getBookingActions(booking) {
  const isPending = booking?.bookingStatus === BOOKING_STATUS.PENDING
  const isUnpaid = booking?.paymentStatus === PAYMENT_STATUS.UNPAID
  const usesVnpay = booking?.payment?.method === PAYMENT_METHOD.VNPAY
  const canReview = booking?.bookingStatus === BOOKING_STATUS.COMPLETED && booking?.paymentStatus === PAYMENT_STATUS.PAID

  return {
    canReschedule: isPending,
    canPay: isPending && isUnpaid && usesVnpay,
    canCancel: isPending && isUnpaid,
    canReview,
  }
}
