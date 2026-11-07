import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoHeader from '../../../assets/brand/logoheader.png'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'
import { ROUTES } from '../../../app/routes/routePaths.js'

const NAV_ITEMS = [
  { label: 'Trang chủ', href: ROUTES.HOME, route: true, home: true },
  { label: 'Dịch vụ', href: ROUTES.SERVICES, section: 'services', route: true },
  { label: 'Giới thiệu', href: ROUTES.ABOUT, section: 'about', route: true },
  { label: 'Đặt hẹn', href: ROUTES.BOOKING, route: true, cta: true },
]

function Chevron() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const isLoggedIn = !!user
  const [accountState, setAccountState] = useState('closed')
  const accountMenuRef = useRef(null)
  const accountTriggerRef = useRef(null)
  const homeLogoNavigationRef = useRef(false)
  const location = useLocation()
  const routeActiveSection = location.pathname === ROUTES.ABOUT
    ? 'about'
    : location.pathname === ROUTES.SERVICES || location.pathname.startsWith(`${ROUTES.SERVICES}/`)
      ? 'services'
      : ''
  const currentActiveSection = routeActiveSection

  useEffect(() => {
    if (!homeLogoNavigationRef.current) return
    homeLogoNavigationRef.current = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    if (location.pathname === ROUTES.HOME || location.pathname === ROUTES.ABOUT) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

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
    window.setTimeout(() => navigate(ROUTES.LOGOUT), 170)
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
        <Link className="brand" to={ROUTES.HOME} aria-label="MEOMEO, về trang chủ" onClick={handleBrandClick}>
          <img className="brand__logo" src={logoHeader} alt="MEOMEO Spa" />
        </Link>

        <nav className={`primary-nav${menuOpen ? ' is-open' : ''}`} id="primary-menu" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => {
            const className = item.home
              ? `primary-nav__link primary-nav__link--home${location.pathname === ROUTES.HOME ? ' is-active' : ''}`
              : item.cta
                ? 'primary-nav__link primary-nav__link--cta'
                : item.section && currentActiveSection === item.section ? 'primary-nav__link is-active' : 'primary-nav__link'
            return item.route ? (
              <Link
                key={item.label}
                className={className}
                to={item.href}
                onClick={() => {
                  closeMobileMenu()
                  if (item.href === ROUTES.HOME || item.href === ROUTES.ABOUT) window.scrollTo(0, 0)
                }}
              >
                {item.label}
              </Link>
            ) : (
              <a key={item.label} className={className} href={item.href} aria-current={currentActiveSection === item.section ? 'location' : undefined} onClick={() => {
                closeMobileMenu()
              }}>{item.label}</a>
            )
          })}
        </nav>

        <div className="site-header__actions">
          {isLoggedIn ? (
            <div className="account-menu" data-state={accountState} ref={accountMenuRef}>
              <button
                className="account-menu__trigger"
                type="button"
                aria-label={`Tài khoản ${user.fullName}`}
                aria-expanded={accountState === 'open' || accountState === 'opening'}
                aria-controls="account-panel"
                onClick={toggleAccountMenu}
                ref={accountTriggerRef}
              >
                <span className="account-menu__avatar" aria-hidden="true">{user.fullName.trim().split(/\s+/).slice(-2).map(part => part[0]).join('')}</span>
                <span className="account-menu__name">{user.fullName}</span>
                <span className="account-menu__chevron"><Chevron /></span>
              </button>
              <div className="account-menu__panel" id="account-panel" aria-hidden={accountState !== 'open'} inert={accountState !== 'open'}>
                <Link to={ROUTES.PROFILE} onClick={closeAccountMenu}>Trang cá nhân</Link>
                <Link to={ROUTES.PETS} onClick={closeAccountMenu}>Thú cưng của tôi</Link>
                <Link to={ROUTES.BOOKINGS} onClick={closeAccountMenu}>Lịch đặt của tôi</Link>
                <button type="button" onClick={logOut}>Đăng xuất</button>
              </div>
            </div>
          ) : (
            <Link className="login-link" to={ROUTES.LOGIN}>Đăng nhập</Link>
          )}
          <button className="menu-toggle" type="button" aria-controls="primary-menu" aria-expanded={menuOpen} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
