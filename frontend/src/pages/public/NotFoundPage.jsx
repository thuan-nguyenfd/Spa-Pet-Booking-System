import { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import '../../styles/not-found.css'

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = (event) => setReducedMotion(event.matches)

    setReducedMotion(preference.matches)
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  return reducedMotion
}

export default function NotFoundPage() {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const previousTitle = document.title
    document.title = '404 · MEOMEO Spa'
    return () => { document.title = previousTitle }
  }, [])

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__inner">
        <div className="not-found__content">
          <div className="not-found__copy">
            <h1 id="not-found-title">
              <span>Ối! Boss chạy</span>
              <span>lạc mất rồi</span>
            </h1>
            <p>
              Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
              Đừng lo, tụi mình sẽ đưa bạn về đúng chỗ.
            </p>
          </div>

          <div className="not-found__actions">
            <Link className="button button--primary" to={ROUTES.HOME}>
              Về trang chủ <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to={ROUTES.SERVICES}>Khám phá dịch vụ</Link>
          </div>
        </div>

        <figure className="not-found__art" role="img" aria-label="Hoạt ảnh thú cưng chạy lạc">
          <DotLottieReact
            src="/animations/404-pet.lottie"
            autoplay={!reducedMotion}
            loop={!reducedMotion}
            aria-hidden="true"
          />
        </figure>
      </div>
    </section>
  )
}
