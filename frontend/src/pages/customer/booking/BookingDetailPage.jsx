import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import arrowLeftIcon from '../../../assets/icons/booking/arrow-left.svg'
import { ROUTES } from '../../../constants/routes.js'
import { bookingService } from '../../../services/bookingService.js'
import {
  BookingDetailContent,
  BookingDetailMessage,
  BookingDetailSkeleton,
} from '../../../components/booking/detail/BookingDetailSections.jsx'
import '../../../styles/booking-detail.css'

export default function BookingDetailPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [loadState, setLoadState] = useState('loading')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setBooking(null)
    setLoadState('loading')

    bookingService.getBookingById(bookingId)
      .then((result) => {
        if (!active) return
        if (!result) {
          setLoadState('not-found')
          return
        }
        setBooking(result)
        setLoadState('ready')
      })
      .catch(() => {
        if (active) setLoadState('error')
      })

    return () => { active = false }
  }, [bookingId, retryCount])

  function cancelBooking(reason) {
    setBooking((current) => current ? {
      ...current,
      bookingStatus: 'CANCELLED',
      cancellationReason: reason,
    } : current)
  }

  function saveReview(review) {
    setBooking((current) => current ? { ...current, review } : current)
  }

  return (
    <div className="booking-detail-page" lang="vi">
      <div className="booking-detail-page__inner">
        <Link className="booking-detail-page__back" to={ROUTES.BOOKINGS}>
          <img className="booking-detail-page__back-icon" src={arrowLeftIcon} alt="" /> Lịch đặt của tôi
        </Link>

        {loadState === 'loading' && <BookingDetailSkeleton />}

        {loadState === 'error' && (
          <BookingDetailMessage
            title="Chưa tải được chi tiết lịch hẹn."
            message="Bạn thử tải lại sau ít phút nhé."
            action={(
              <button className="booking-detail-page__button booking-detail-page__button--primary" type="button" onClick={() => setRetryCount((count) => count + 1)}>
                Thử lại
              </button>
            )}
          />
        )}

        {loadState === 'not-found' && (
          <BookingDetailMessage
            title="Không tìm thấy lịch hẹn này."
            message="Lịch hẹn có thể đã được di chuyển hoặc không còn tồn tại."
            action={(
              <Link className="booking-detail-page__button booking-detail-page__button--primary" to={ROUTES.BOOKINGS}>
                Về lịch đặt của tôi
              </Link>
            )}
          />
        )}

        {loadState === 'ready' && booking && (
          <BookingDetailContent booking={booking} onCancel={cancelBooking} onSubmitReview={saveReview} />
        )}
      </div>
    </div>
  )
}
