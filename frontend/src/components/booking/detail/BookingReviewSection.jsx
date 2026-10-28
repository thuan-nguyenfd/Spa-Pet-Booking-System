import { useRef, useState } from 'react'
import { getBookingActions } from '../../../utils/bookingDetail.js'

function formatReviewDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path
        d="m12 2.75 2.82 5.72 6.32.92-4.57 4.45 1.08 6.3L12 17.16l-5.65 2.98 1.08-6.3-4.57-4.45 6.32-.92L12 2.75Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReviewStars({ rating }) {
  return (
    <span className="booking-detail-page__review-stars" role="img" aria-label={`${rating} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span className={index < rating ? 'is-filled' : ''} key={index}>
          <StarIcon filled={index < rating} />
        </span>
      ))}
    </span>
  )
}

export default function BookingReviewSection({ booking, onSubmit }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const firstRatingRef = useRef(null)
  const { canReview } = getBookingActions(booking)

  if (!canReview) return null

  if (booking.review) {
    return (
      <section className="booking-detail-page__review" aria-labelledby="booking-detail-review-title">
        <h2 id="booking-detail-review-title">Đánh giá của bạn</h2>
        <div className="booking-detail-page__review-summary">
          <ReviewStars rating={booking.review.rating} />
          <strong>{Number(booking.review.rating).toFixed(1)}</strong>
        </div>
        {booking.review.hidden ? (
          <p className="booking-detail-page__quiet-copy">Đánh giá đang được MEOMEO kiểm duyệt.</p>
        ) : booking.review.comment ? (
          <blockquote>“{booking.review.comment}”</blockquote>
        ) : null}
        {formatReviewDate(booking.review.createdAt) && <time>{formatReviewDate(booking.review.createdAt)}</time>}
      </section>
    )
  }

  async function submitReview(event) {
    event.preventDefault()
    if (submitting) return
    if (!rating) {
      setValidationMessage('Chọn số sao trước khi gửi đánh giá nhé.')
      firstRatingRef.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ rating, comment: comment.trim() })
      setIsExpanded(false)
      setRating(0)
      setComment('')
      setValidationMessage('')
    } catch {
      setValidationMessage('Chưa gửi được đánh giá. Bạn thử lại nhé.')
    } finally {
      setSubmitting(false)
    }
  }

  function closeReviewForm() {
    setIsExpanded(false)
    setValidationMessage('')
  }

  return (
    <section className="booking-detail-page__review" aria-labelledby="booking-detail-review-title">
      <div className="booking-detail-page__review-invitation">
        <div>
          <p className="booking-detail-page__field-label">Trải nghiệm của bạn</p>
          <h2 id="booking-detail-review-title">Boss đã hoàn thành buổi spa rồi.</h2>
          <p>Bạn cảm thấy buổi chăm sóc hôm nay thế nào?</p>
        </div>
        <button
          className="booking-detail-page__button booking-detail-page__button--secondary"
          type="button"
          aria-expanded={isExpanded}
          aria-controls={`booking-review-form-${booking.id}`}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? 'Đóng biểu mẫu' : 'Đánh giá trải nghiệm'}
        </button>
      </div>

      {isExpanded && (
        <form className="booking-detail-page__review-form" id={`booking-review-form-${booking.id}`} onSubmit={submitReview}>
          <fieldset aria-describedby={validationMessage ? `booking-review-validation-${booking.id}` : undefined}>
            <legend>Chọn số sao</legend>
            <div className="booking-detail-page__rating-options">
              {[1, 2, 3, 4, 5].map((value) => (
                <label className={rating >= value ? 'is-selected' : ''} key={value}>
                  <input
                    ref={value === 1 ? firstRatingRef : undefined}
                    type="radio"
                    name={`booking-rating-${booking.id}`}
                    value={value}
                    checked={rating === value}
                    aria-label={`${value} sao`}
                    onChange={() => {
                      setRating(value)
                      setValidationMessage('')
                    }}
                  />
                  <span aria-hidden="true"><StarIcon filled={rating >= value} /></span>
                </label>
              ))}
            </div>
          </fieldset>
          {validationMessage && <p className="booking-detail-page__validation" id={`booking-review-validation-${booking.id}`} role="alert">{validationMessage}</p>}

          <label className="booking-detail-page__comment-label" htmlFor={`booking-review-comment-${booking.id}`}>Chia sẻ trải nghiệm của bạn <span>(không bắt buộc)</span></label>
          <textarea
            id={`booking-review-comment-${booking.id}`}
            rows="4"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Điều gì khiến bạn hài lòng trong buổi chăm sóc?"
          />
          <div className="booking-detail-page__review-actions">
            <button className="booking-detail-page__button booking-detail-page__button--primary" type="submit" disabled={submitting}>Gửi đánh giá</button>
            <button className="booking-detail-page__button booking-detail-page__button--quiet" type="button" onClick={closeReviewForm}>Đóng</button>
          </div>
        </form>
      )}
    </section>
  )
}
