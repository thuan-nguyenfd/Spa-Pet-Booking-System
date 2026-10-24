import { Link } from 'react-router-dom'
import { CONTACT_INFO, SERVICE_CREDITS } from '../../home/homeData.js'
import catDogFooter from '../../../assets/custom-footer/catdogfooter.png'

function SocialMark({ kind }) {
  if (kind === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8Z" fill="currentColor" /></svg>
}

export default function HomeFooter() {
  return (
    <footer className="site-footer page-gutter" id="contact" aria-labelledby="footer-title">
      <div className="site-footer__pets" aria-hidden="true">
        <img className="site-footer__pets-image" src={catDogFooter} alt="" />
      </div>
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <h2 id="footer-title">MEOMEO</h2>
          <p>Spa · Grooming · Chăm sóc thú cưng. Chỗ hẹn nhỏ cho những bộ lông sạch thơm và chiếc đuôi vui vẻ.</p>
        </div>
        <div className="site-footer__details">
          <div>
            <h3>Khám phá</h3>
            <Link to="/booking">Đặt hẹn</Link>
            <a href="#services">Dịch vụ</a>
            <a href="#about">Giới thiệu</a>
          </div>
          <address>
            <h3>Liên hệ</h3>
            <span>{CONTACT_INFO.phone}</span>
            <span>{CONTACT_INFO.email}</span>
            <span>{CONTACT_INFO.address}</span>
          </address>
          <div className="site-footer__social">
            <h3>Mạng xã hội</h3>
            <span><SocialMark kind="facebook" />Facebook sẽ cập nhật</span>
            <span><SocialMark kind="instagram" />Instagram sẽ cập nhật</span>
          </div>
        </div>
      </div>

      <details className="photo-credits">
        <summary>Nguồn ảnh minh họa dịch vụ</summary>
        <ul>
          {Object.values(SERVICE_CREDITS).map((credit) => (
            <li key={credit.title}>
              <a href={credit.href} target="_blank" rel="noreferrer">“{credit.title}” — {credit.creator}, {credit.licence}, via {credit.source}</a>
            </li>
          ))}
        </ul>
      </details>
      <div className="site-footer__bottom">
        <span>© 2026 MEOMEO. All rights reserved.</span>
        <span>Made for clean paws & happy tails.</span>
      </div>
    </footer>
  )
}
