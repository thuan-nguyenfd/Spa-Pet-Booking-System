import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import PlaceholderPage from '../components/common/PlaceholderPage.jsx'
import PublicLayout from '../layouts/PublicLayout.jsx'
import {
  AboutPage, AdminBookingDetailPage, AdminBookingsPage, AdminCustomersPage,
  AdminDashboardPage, AdminPetsPage, AdminServicesPage, AdminStaffPage,
  BookingConfirmPage, BookingDetailPage, BookingPage, ContactPage,
  ForgotPasswordPage, HomePage, LoginPage, MyBookingsPage, PetsPage,
  ProfilePage, RegisterPage, ServiceDetailPage, ServicesPage,
} from '../pages/index.js'

const pageRoutes = [
  ['/', HomePage], ['/about', AboutPage], ['/services', ServicesPage],
  ['/services/:serviceId', ServiceDetailPage], ['/contact', ContactPage],
  ['/login', LoginPage], ['/register', RegisterPage], ['/forgot-password', ForgotPasswordPage],
  ['/profile', ProfilePage], ['/pets', PetsPage], ['/booking', BookingPage],
  ['/booking/confirm', BookingConfirmPage], ['/bookings', MyBookingsPage],
  ['/bookings/:bookingId', BookingDetailPage], ['/admin', AdminDashboardPage],
  ['/admin/bookings', AdminBookingsPage], ['/admin/bookings/:bookingId', AdminBookingDetailPage],
  ['/admin/customers', AdminCustomersPage], ['/admin/pets', AdminPetsPage],
  ['/admin/staff', AdminStaffPage], ['/admin/services', AdminServicesPage],
]

const publicPaths = new Set(['/', '/about', '/services', '/services/:serviceId', '/contact'])

function RouteContent() {
  const { pathname } = useLocation()

  return (
    <>
      {pathname !== '/' && (
        <nav aria-label="Placeholder navigation">
          <Link to="/">Home</Link>
        </nav>
      )}
      <Routes>
        <Route element={<PublicLayout />}>
          {pageRoutes.filter(([path]) => publicPaths.has(path)).map(([path, Page]) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
        </Route>
        {pageRoutes.filter(([path]) => !publicPaths.has(path)).map(([path, Page]) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Routes>
    </>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <RouteContent />
    </BrowserRouter>
  )
}
