import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout.jsx'
import CustomerLayout from '../layouts/CustomerLayout.jsx'
import { ROUTES } from '../constants/routes.js'
import NotFoundPage from '../pages/public/NotFoundPage.jsx'
import {
  AboutPage, AdminBookingDetailPage, AdminBookingsPage, AdminCustomersPage,
  AdminDashboardPage, AdminPetsPage, AdminServicesPage, AdminStaffPage,
  BookingDetailPage, BookingPage, BookingReschedulePage, ContactPage,
  ForgotPasswordPage, HomePage, LoginPage, MyBookingsPage, PetsPage,
  ProfilePage, RegisterPage, ServiceDetailPage, ServicesPage,
} from '../pages/index.js'

const pageRoutes = [
  [ROUTES.HOME, HomePage], [ROUTES.ABOUT, AboutPage], [ROUTES.SERVICES, ServicesPage],
  [ROUTES.SERVICE_DETAIL(), ServiceDetailPage], [ROUTES.CONTACT, ContactPage],
  [ROUTES.LOGIN, LoginPage], [ROUTES.REGISTER, RegisterPage], [ROUTES.FORGOT_PASSWORD, ForgotPasswordPage],
  [ROUTES.PROFILE, ProfilePage], [ROUTES.PETS, PetsPage], [ROUTES.BOOKING, BookingPage],
  [ROUTES.BOOKINGS, MyBookingsPage],
  [ROUTES.BOOKING_DETAIL(), BookingDetailPage],
  [ROUTES.BOOKING_RESCHEDULE(), BookingReschedulePage], [ROUTES.ADMIN, AdminDashboardPage],
  [ROUTES.ADMIN_BOOKINGS, AdminBookingsPage], [ROUTES.ADMIN_BOOKING_DETAIL(), AdminBookingDetailPage],
  [ROUTES.ADMIN_CUSTOMERS, AdminCustomersPage], [ROUTES.ADMIN_PETS, AdminPetsPage],
  [ROUTES.ADMIN_STAFF, AdminStaffPage], [ROUTES.ADMIN_SERVICES, AdminServicesPage],
]

const publicPaths = new Set([ROUTES.HOME, ROUTES.ABOUT, ROUTES.SERVICES, ROUTES.SERVICE_DETAIL(), ROUTES.CONTACT])
const customerPaths = new Set([
  ROUTES.PROFILE, ROUTES.PETS, ROUTES.BOOKING,
  ROUTES.BOOKINGS, ROUTES.BOOKING_DETAIL(),
  ROUTES.BOOKING_RESCHEDULE(),
])

function RouteContent() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          {pageRoutes.filter(([path]) => publicPaths.has(path)).map(([path, Page]) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route element={<CustomerLayout />}>
          {pageRoutes.filter(([path]) => customerPaths.has(path)).map(([path, Page]) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
        </Route>
        {pageRoutes.filter(([path]) => !publicPaths.has(path) && !customerPaths.has(path)).map(([path, Page]) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
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
