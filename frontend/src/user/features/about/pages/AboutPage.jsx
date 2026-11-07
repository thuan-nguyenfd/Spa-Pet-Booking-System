import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AboutTabs from '../components/AboutTabs.jsx'
import { PHOTOS, VALUES, EXPERIENCE } from '../data/aboutData.js'
import { AboutPhoto, AboutLocation } from '../components/AboutElements.jsx'
import { ROUTES } from '../../../../app/routes/routePaths.js'
import '../styles/about.css'

export default function AboutPage() {
  const pageRef = useRef(null)
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Giới thiệu MEOMEO | Spa & Grooming cho thú cưng'
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => { document.title = previousTitle }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('about-entered'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    pageRef.current.querySelectorAll('[data-about-reveal]').forEach(item => observer.observe(item))
    return () => { observer.disconnect(); document.title = previousTitle }
  }, [])
  return <div className="about-page" ref={pageRef} id="about">
    <section className="about-hero about-frame" aria-labelledby="about-heading">
      <div className="about-hero__intro">
        <AboutPhoto photo={PHOTOS.brush} eager caption={false} className="about-hero__small" />
        <p>MEOMEO là điểm hẹn Spa & Grooming cho chó mèo, nơi sự chăm chút bắt đầu từ những điều nhỏ nhất.</p>
        <Link className="about-button" to={ROUTES.BOOKING}>Đặt lịch cho Boss <span aria-hidden="true">↗</span></Link>
      </div>
      <AboutPhoto photo={PHOTOS.sage} eager className="about-hero__portrait" />
      <div className="about-hero__aside"><AboutPhoto photo={PHOTOS.bath} eager /><p>Một bộ lông sạch thơm.<br />Một ngày được nâng niu.</p></div>
    </section>
    <section className="about-story about-frame" id="about-story" aria-labelledby="about-story-title">
      <div className="about-story__heading" data-about-reveal><h2 id="about-story-title">Từ một điều rất nhỏ</h2><p>Vì mỗi bé cưng đều xứng đáng được yêu thương.</p></div>
      <AboutPhoto photo={PHOTOS.portrait} className="about-story__photo" />
      <div className="about-story__body" data-about-reveal><p>Một cái dụi đầu, một chiếc đuôi vẫy, một người bạn luôn chờ ở cửa. Chó mèo bước vào cuộc sống của chúng mình như thế, rồi trở thành một phần của gia đình.</p><p>MEOMEO được xây dựng từ mong muốn dành cho những thành viên nhỏ ấy một nơi chăm sóc dịu dàng. Chúng mình trân trọng tính cách riêng của từng bé, từ người bạn hiếu động đến chiếc mèo còn đôi chút rụt rè.</p><blockquote>“Chăm sóc là niềm vui bắt đầu từ sự yêu thương.”</blockquote><p>Mỗi buổi spa là dịp để làm sạch, chăm chút bộ lông và dành thêm một chút quan tâm cho bé.</p></div>
    </section>
    <section className="about-chapters about-frame" aria-labelledby="about-chapters-title" id="services"><div className="about-section-heading" data-about-reveal><h2 id="about-chapters-title">Chúng mình là MEOMEO</h2></div><AboutTabs /></section>
    <section className="about-experience about-frame" aria-labelledby="about-experience-title"><div className="about-section-heading" data-about-reveal><h2 id="about-experience-title">Một buổi được nâng niu</h2></div><ol className="about-experience__steps">{EXPERIENCE.map(step => <li key={step.title} data-about-reveal><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>
    <section className="about-values about-frame" aria-labelledby="about-values-title"><div data-about-reveal><h2 id="about-values-title">Điều mình gìn giữ</h2><p>Những điều giản dị làm nên cách MEOMEO chăm sóc.</p></div><div className="about-values__list">{VALUES.map(value => <article key={value.title} data-about-reveal><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></section>
    <section className="about-find about-frame" aria-label="Ghé thăm MEOMEO"><AboutLocation /></section>
  </div>
}
