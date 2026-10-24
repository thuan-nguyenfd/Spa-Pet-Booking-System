import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'

const HeroRiveCat = lazy(() => import('./HeroRiveCat.jsx'))

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title">Boss sạch thơm,<br />sen an tâm.</h1>
        <p className="hero__intro">Tắm, sấy và chăm lông dịu nhẹ. Dịch vụ có thời lượng rõ ràng, giá tính theo cân nặng.</p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/booking">Đặt hẹn ngay<span aria-hidden="true">↗</span></Link>
          <a className="text-link" href="#services">Khám phá dịch vụ</a>
        </div>
      </div>
      <Suspense fallback={<div className="hero__art" aria-hidden="true" />}>
        <HeroRiveCat />
      </Suspense>
    </section>
  )
}
