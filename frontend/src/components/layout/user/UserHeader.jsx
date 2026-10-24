import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoHeader from '../../../assets/brand/logoheader.png'

const NAV_ITEMS = [
  { label: 'Đặt hẹn', href: '/booking', route: true, cta: true },
  { label: 'Dịch vụ', href: '#services', section: 'services' },
  { label: 'Giới thiệu', href: '#about', section: 'about' },
  { label: 'Liên hệ', href: '#contact', section: 'contact' },
]

function Chevron() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [activeSection, setActiveSection] = useState('')
  const [accountState, setAccountState] = useState('closed')
  const accountMenuRef = useRef(null)
  const accountTriggerRef = useRef(null)
  const homeLogoNavigationRef = useRef(false)
  const location = useLocation()

  useEffect(() => {
    if (!homeLogoNavigationRef.current) return
    homeLogoNavigationRef.current = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    const ids = ['services', 'about', 'contact']
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!('IntersectionObserver' in window) || !targets.length) return undefined

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
      if (visible.length) setActiveSection(visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.5] })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  useEffect(() => {
    if (accountState === 'opening') {
      const frame = window.requestAnimationFrame(() => {
        setAccountState((state) => state === 'opening' ? 'open' : state)
      })
      return () => window.cancelAnimationFrame(frame)
    }

    if (accountState === 'closing') {
      const timeout = window.setTimeout(() => {
        setAccountState((state) => state === 'closing' ? 'closed' : state)
      }, 170)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [accountState])

  useEffect(() => {
    if (accountState !== 'open') return undefined

    const closeOnOutsidePointer = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) setAccountState('closing')
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setAccountState('closing')
      accountTriggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountState])

  function closeMobileMenu() {
    setMenuOpen(false)
  }

  function handleBrandClick(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    if (location.pathname === '/' && !location.search && !location.hash) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    homeLogoNavigationRef.current = true
  }

  function logOut() {
    setAccountState('closing')
    window.setTimeout(() => setIsLoggedIn(false), 170)
  }

  function toggleAccountMenu() {
    setAccountState((state) => state === 'open' || state === 'opening' ? 'closing' : 'opening')
  }

  function closeAccountMenu() {
    setAccountState((state) => state === 'closed' ? 'closed' : 'closing')
  }

  return (
    <header className="site-header">
      <div className="site-header__row">
        <Link className="brand" to="/" aria-label="MEOMEO, về trang chủ" onClick={handleBrandClick}>
          <img className="brand__logo" src={logoHeader} alt="MEOMEO Spa" />
        </Link>

        <nav className={`primary-nav${menuOpen ? ' is-open' : ''}`} id="primary-menu" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => {
            const className = item.cta
              ? 'primary-nav__link primary-nav__link--cta'
              : item.section && activeSection === item.section ? 'primary-nav__link is-active' : 'primary-nav__link'
            return item.route ? (
              <Link key={item.label} className={className} to={item.href} onClick={closeMobileMenu}>{item.label}</Link>
            ) : (
              <a key={item.label} className={className} href={item.href} aria-current={activeSection === item.section ? 'location' : undefined} onClick={closeMobileMenu}>{item.label}</a>
            )
          })}
        </nav>

        <div className="site-header__actions">
          {isLoggedIn ? (
            <div className="account-menu" data-state={accountState} ref={accountMenuRef}>
              <button
                className="account-menu__trigger"
                type="button"
                aria-label="Tài khoản Minh Thuận"
                aria-expanded={accountState === 'open' || accountState === 'opening'}
                aria-controls="account-panel"
                onClick={toggleAccountMenu}
                ref={accountTriggerRef}
              >
                <span className="account-menu__avatar" aria-hidden="true">MT</span>
                <span className="account-menu__name">Minh Thuận</span>
                <span className="account-menu__chevron"><Chevron /></span>
              </button>
              <div className="account-menu__panel" id="account-panel" aria-hidden={accountState !== 'open'} inert={accountState !== 'open'}>
                <Link to="/profile" onClick={closeAccountMenu}>Trang cá nhân</Link>
                <Link to="/pets" onClick={closeAccountMenu}>Thú cưng của tôi</Link>
                <Link to="/bookings" onClick={closeAccountMenu}>Lịch đặt của tôi</Link>
                <button type="button" onClick={logOut}>Đăng xuất</button>
              </div>
            </div>
          ) : (
            <Link className="login-link" to="/login">Đăng nhập</Link>
          )}
          <button className="menu-toggle" type="button" aria-controls="primary-menu" aria-expanded={menuOpen} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
