import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useServices } from '../hooks/useServices.js'
import ServiceState from '../components/ServiceState.jsx'
import { ROUTES } from '../../../../app/routes/routePaths.js'
import { formatVnd } from '../../bookings/utils/bookingPrice.js'
import '../styles/service-catalog.css'
import { servicePhoto } from '../data/servicePhotos.js'

export default function ServicesPage() {
  const { data, loading, error, retry } = useServices()
  const [category, setCategory] = useState('ALL')
  const services = (data ?? []).filter(
    (service) => category === 'ALL' || service.category === category,
  )
  return (
    <div className="service-catalog">
      <header className="catalog-heading">
        <div>
          <p className="catalog-eyebrow">MEOMEO · Chăm sóc thú cưng</p>
          <h1>
            Chăm sóc cho bé.
            <br />
            Theo cách thật dịu dàng.
          </h1>
        </div>
        <div className="catalog-intro">
          <p>
            Tắm thơm, chải lông hay tỉa gọn diện mạo. Chọn dịch vụ phù hợp với
            người bạn nhỏ của bạn.
          </p>
          <span>Giá theo cân nặng · Thời lượng rõ ràng</span>
        </div>
      </header>
      <div className="catalog-toolbar">
        <div
          className="catalog-filters"
          role="group"
          aria-label="Lọc loại dịch vụ"
        >
          {[
            ['ALL', 'Tất cả'],
            ['SINGLE', 'Dịch vụ lẻ'],
            ['COMBO', 'Gói kết hợp'],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {!loading && !error && (
          <span className="catalog-count" role="status">
            {services.length} dịch vụ
          </span>
        )}
      </div>
      {loading || error ? (
        <ServiceState loading={loading} error={error} retry={retry} />
      ) : services.length ? (
        <div className="catalog-grid">
          {services.map((service, index) => (
            <article className="catalog-item" key={service.id}>
              <Link
                className="catalog-photo"
                to={ROUTES.SERVICE_DETAIL(service.id)}
                aria-label={`Xem ${service.name}`}
              >
                <img
                  src={servicePhoto(service)}
                  alt={service.name}
                  width="1280"
                  height="850"
                  loading={index > 1 ? 'lazy' : 'eager'}
                />
                <span className="catalog-photo-tag">
                  {service.category === 'COMBO' ? 'Gói kết hợp' : 'Dịch vụ lẻ'}
                </span>
              </Link>
              <div className="catalog-item-heading">
                <h2>
                  <Link to={ROUTES.SERVICE_DETAIL(service.id)}>
                    {service.name}
                  </Link>
                </h2>
                <span>{service.durationMinutes} phút</span>
              </div>
              <p>{service.description}</p>
              <div className="catalog-item-bottom">
                <p>
                  Từ{' '}
                  <strong>
                    {formatVnd(
                      Math.min(
                        ...service.priceBands.map((band) => band.priceVnd),
                      ),
                    )}
                  </strong>
                </p>
                <Link
                  className="catalog-link"
                  to={ROUTES.SERVICE_DETAIL(service.id)}
                >
                  Xem chi tiết <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="catalog-state">
          <h2>Chưa có dịch vụ phù hợp</h2>
          <p>Bạn thử xem loại dịch vụ khác nhé.</p>
          <button
            className="catalog-button catalog-button--secondary"
            onClick={() => setCategory('ALL')}
          >
            Xem tất cả dịch vụ
          </button>
        </div>
      )}
    </div>
  )
}
