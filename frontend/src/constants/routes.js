// Keep page URLs in one place so links and the router stay in sync.
export const ROUTES = Object.freeze({
  HOME: '/', ABOUT: '/about', SERVICES: '/services',
  SERVICE_DETAIL: (serviceId = ':serviceId') => `/services/${serviceId}`,
  CONTACT: '/contact', LOGIN: '/login', REGISTER: '/register', FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile', PETS: '/pets', BOOKING: '/booking',
  BOOKINGS: '/bookings', BOOKING_DETAIL: (bookingId = ':bookingId') => `/bookings/${bookingId}`,
  BOOKING_RESCHEDULE: (bookingId = ':bookingId') => `/bookings/${bookingId}/reschedule`,
  ADMIN: '/admin', ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_BOOKING_DETAIL: (bookingId = ':bookingId') => `/admin/bookings/${bookingId}`,
  ADMIN_CUSTOMERS: '/admin/customers', ADMIN_PETS: '/admin/pets',
  ADMIN_STAFF: '/admin/staff', ADMIN_SERVICES: '/admin/services',
})
