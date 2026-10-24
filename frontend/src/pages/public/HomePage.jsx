import { useEffect } from 'react'
import Hero from '../../components/home/Hero/Hero.jsx'
import ServicesSection from '../../components/home/ServicesSection/ServicesSection.jsx'
import AboutSection from '../../components/home/AboutSection/AboutSection.jsx'
import ReviewsSection from '../../components/home/ReviewsSection/ReviewsSection.jsx'

export default function HomePage() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const items = document.querySelectorAll('.service-strip, .reason-list li, .review-quote')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('has-entered')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Hero />
      <ServicesSection />
      <AboutSection />
      <ReviewsSection />
    </>
  )
}
