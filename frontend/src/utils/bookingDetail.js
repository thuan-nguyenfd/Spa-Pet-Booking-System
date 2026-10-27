export function getBookingActions(booking) {
  const isPending = booking?.bookingStatus === 'PENDING'
  const isUnpaid = booking?.paymentStatus === 'UNPAID'
  const usesVnpay = String(booking?.payment?.method ?? '').toUpperCase() === 'VNPAY'
  const canReview = booking?.bookingStatus === 'COMPLETED' && booking?.paymentStatus === 'PAID'

  return {
    canReschedule: isPending,
    canPay: isPending && isUnpaid && usesVnpay,
    canCancel: isPending && isUnpaid,
    canReview,
  }
}
