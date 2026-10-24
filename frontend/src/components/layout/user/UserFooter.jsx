import { Link } from 'react-router-dom'
import { CONTACT_INFO, SERVICE_CREDITS } from '../../home/homeData.js'

function MobilePeekingPets() {
  return (
    <div className="peeking-pets__mobile">
      <svg className="peeking-pets__cat" viewBox="0 0 180 128" focusable="false">
        <path d="M31 113c-9-22-7-48-1-68L24 8l39 22c17-5 36-5 53 0l39-22-6 39c8 23 8 46-1 66Z" fill="#f4ad3e" />
        <path d="m36 47-4-26 23 14m86 12 4-26-23 14" fill="#de7a31" />
        <path d="M51 72c9-10 20-10 29 0m20 0c9-10 20-10 29 0" fill="none" stroke="#392b20" strokeWidth="5" strokeLinecap="round" />
        <path d="m83 88 7-5 7 5-7 6Z" fill="#a4493a" />
        <path d="M90 94v8m0 0c-7 6-13 5-17 1m17-1c7 6 13 5 17 1" fill="none" stroke="#633b2a" strokeWidth="3" strokeLinecap="round" />
        <path d="M70 119c-3-13-1-22 7-26 8-3 15 6 15 26m4 0c0-15 7-23 15-22 8 2 9 11 7 22" fill="#f7c55c" />
      </svg>
      <svg className="peeking-pets__dog" viewBox="0 0 180 128" focusable="false">
        <path d="M31 114c-9-25-7-57 3-75 13-20 36-29 57-29s44 9 57 29c10 19 12 50 2 75Z" fill="#df9b58" />
        <path d="M38 47C15 49 8 76 21 99c8 13 20 16 32 11m89-63c23 2 30 29 17 52-8 13-20 16-32 11" fill="#aa6944" />
        <ellipse cx="68" cy="67" rx="6" ry="8" fill="#342a22" />
        <ellipse cx="112" cy="67" rx="6" ry="8" fill="#342a22" />
        <ellipse cx="90" cy="88" rx="29" ry="21" fill="#fff0d5" />
        <path d="m80 81 10-6 10 6-10 9Z" fill="#382a24" />
        <path d="M90 90v9m0 0c-7 6-13 4-17 0m17 0c7 6 13 4 17 0" fill="none" stroke="#704332" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 119c-2-14 2-23 10-24 8 0 12 10 12 24m32 0c0-14 4-24 12-24 8 1 12 10 10 24" fill="#e9ae68" />
      </svg>
    </div>
  )
}

function DesktopPeekingPets() {
  return (
    <svg className="peeking-pets__desktop" viewBox="0 0 430 184" focusable="false">
      <g strokeLinejoin="round" strokeLinecap="round">
        <path d="M48 155c-5-18-1-36 10-49 11-13 29-20 51-20 22 0 40 8 49 23 8 13 10 30 5 46Z" fill="#edaa48" stroke="#76502f" strokeWidth="4" />
        <path d="M80 108c7-10 17-15 29-15s23 5 29 15c6 11 8 28 6 47H73c-2-19 0-36 7-47Z" fill="#f8dba5" />
        <path d="M61 113c-8 10-10 25-8 42h25c-1-14 1-26 8-36m49-5c9 10 12 25 10 41h-25c1-14-2-26-8-36" fill="#edaa48" stroke="#76502f" strokeWidth="4" />

        <path d="M48 70c-2-12-1-23 3-33l-2-17c-1-6 3-8 8-4l25 22c14-4 29-4 43 0l25-22c5-4 9-1 8 5l-2 21c6 11 9 23 7 35-3 26-25 43-57 43-32 0-54-18-58-44Z" fill="#f2b64f" stroke="#76502f" strokeWidth="4" />
        <path d="m55 25 21 17c-8 3-14 8-18 15Z" fill="#d98543" />
        <path d="m153 25-20 17c8 3 14 8 18 15Z" fill="#d98543" />
        <path d="M77 51c5-3 10-4 15-4m22 0c6 0 11 1 16 4" fill="none" stroke="#c37d35" strokeWidth="3" />
        <path d="M75 71c6-7 14-7 20 0m24 0c6-7 14-7 20 0" fill="none" stroke="#493525" strokeWidth="4" />
        <path d="M89 83c5-4 10-6 17-6s12 2 17 6c-3 9-10 13-17 13s-14-4-17-13Z" fill="#f8dba5" />
        <path d="m101 81 6-4 6 4-6 5Z" fill="#9f5544" />
        <path d="M107 87v6m0 0c-5 5-10 4-14 0m14 0c5 5 10 4 14 0" fill="none" stroke="#654332" strokeWidth="2.7" />
        <path d="m81 84-17-4m18 10-19 2m70-8 17-4m-18 10 19 2" fill="none" stroke="#875b37" strokeWidth="2" />

        <path d="M218 155c-5-22 1-43 15-58 15-15 37-22 68-22 33 0 59 10 74 28 12 15 16 33 11 52Z" fill="#dca365" stroke="#715039" strokeWidth="4" />
        <path d="M272 93c11-10 24-15 38-15 16 0 30 6 40 17 11 13 15 33 13 60h-99c-2-27 1-48 8-62Z" fill="#f3dfc0" />
        <path d="M245 104c-12 12-16 30-14 51h33c-1-17 3-31 12-42m79-8c13 12 18 30 16 50h-34c1-17-3-31-12-42" fill="#dca365" stroke="#715039" strokeWidth="4" />

        <g transform="translate(0 -9)">
          <path d="M263 42c-17-17-32-11-35 8-4 23 7 42 27 49 10-7 15-21 17-36Z" fill="#b87a4d" stroke="#715039" strokeWidth="4" />
          <path d="M362 40c17-18 32-12 36 7 5 22-5 42-25 51-11-7-16-20-19-35Z" fill="#b87a4d" stroke="#715039" strokeWidth="4" />
          <path d="M257 54c1-30 23-47 57-47 33 0 56 18 57 48 1 30-17 52-47 60-11 3-22 2-33-2-24-9-36-29-34-59Z" fill="#e8b977" stroke="#715039" strokeWidth="4" />
          <path d="M278 27c10-8 22-12 37-12" fill="none" stroke="#f5d6a4" strokeWidth="4" />
          <path d="M280 61c6-6 13-6 19 0m24 0c6-6 13-6 19 0" fill="none" stroke="#49392d" strokeWidth="3.5" />
          <path d="M276 76c7-10 17-15 29-13 5 1 9 4 11 8 4-5 10-8 17-7 12 1 20 9 22 18-4 13-18 22-39 22-21 0-36-9-40-22Z" fill="#f6e6cc" stroke="#806044" strokeWidth="2.5" />
          <path d="m306 77 9-6 9 6-4 7c-3 3-7 3-10 0Z" fill="#49372d" />
          <path d="M315 84v7m0 0c-5 5-11 5-16 1m16-1c5 5 11 4 16-1" fill="none" stroke="#634a36" strokeWidth="2.7" />
        </g>
      </g>

      <path d="M0 156h430v28H0Z" fill="#302e27" />
      <ellipse cx="70" cy="158" rx="20" ry="3.5" fill="#171611" opacity="0.28" />
      <ellipse cx="142" cy="158" rx="20" ry="3.5" fill="#171611" opacity="0.28" />
      <ellipse cx="248" cy="158" rx="25" ry="4" fill="#171611" opacity="0.3" />
      <ellipse cx="364" cy="158" rx="25" ry="4" fill="#171611" opacity="0.3" />

      <g strokeLinejoin="round" strokeLinecap="round">
        <path d="M52 149c0-8 5-13 13-13h9c8 0 13 5 13 13v11c0 5-4 8-9 8H61c-5 0-9-3-9-8Z" fill="#f6cf87" stroke="#76502f" strokeWidth="3.5" />
        <path d="M128 149c0-8 5-13 13-13h9c8 0 13 5 13 13v11c0 5-4 8-9 8h-17c-5 0-9-3-9-8Z" fill="#f6cf87" stroke="#76502f" strokeWidth="3.5" />
        <path d="M68 148v6m9-6v6m67-6v6m9-6v6" fill="none" stroke="#bd8340" strokeWidth="2" />
        <path d="M226 149c0-9 6-15 15-15h14c9 0 15 6 15 15v12c0 6-5 9-11 9h-22c-6 0-11-3-11-9Z" fill="#ebc18d" stroke="#715039" strokeWidth="3.5" />
        <path d="M346 149c0-9 6-15 15-15h14c9 0 15 6 15 15v12c0 6-5 9-11 9h-22c-6 0-11-3-11-9Z" fill="#ebc18d" stroke="#715039" strokeWidth="3.5" />
        <path d="M248 148v7m10-7v7m113-7v7m10-7v7" fill="none" stroke="#b28657" strokeWidth="2" />
      </g>
    </svg>
  )
}

function PeekingPets() {
  return (
    <div className="peeking-pets" aria-hidden="true">
      <DesktopPeekingPets />
      <MobilePeekingPets />
    </div>
  )
}

function SocialMark({ kind }) {
  if (kind === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8Z" fill="currentColor" /></svg>
}

export default function HomeFooter() {
  return (
    <footer className="site-footer page-gutter" id="contact" aria-labelledby="footer-title">
      <PeekingPets />
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
