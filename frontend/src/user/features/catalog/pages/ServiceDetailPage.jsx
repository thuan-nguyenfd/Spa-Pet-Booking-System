import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useServices } from '../hooks/useServices.js'
import ServiceState from '../components/ServiceState.jsx'
import { ROUTES } from '../../../../app/routes/routePaths.js'
import { formatVnd } from '../../bookings/utils/bookingPrice.js'
import '../styles/service-catalog.css'
import { servicePhoto } from '../data/servicePhotos.js'

function bandLabel(bands, index) {
  const upper = bands[index].maxWeightKg
  const lower = index ? bands[index - 1].maxWeightKg : 0
  return upper === null
    ? `Trên ${lower} kg`
    : index === 0
      ? `Đến ${upper} kg`
      : `Trên ${lower} đến ${upper} kg`
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams()
  const { data: service, loading, error, retry } = useServices(serviceId)
  const [selectedBand, setSelectedBand] = useState(0)
  useEffect(() => {
    setSelectedBand(0)
  }, [serviceId])
  if (loading || error)
    return (
      <div className="service-catalog">
        <ServiceState loading={loading} error={error} retry={retry} />
      </div>
    )
  if (!service)
    return (
      <div className="service-catalog catalog-state">
        <p className="catalog-eyebrow">Dịch vụ MEOMEO</p>
        <h1>Không tìm thấy dịch vụ</h1>
        <p>
          Dịch vụ này có thể đã ngừng cung cấp. Bạn xem các lựa chọn khác nhé.
        </p>
        <Link className="catalog-button" to={ROUTES.SERVICES}>
          Xem danh sách dịch vụ
        </Link>
      </div>
    )
  return (
    <div className="service-catalog">
      <nav className="catalog-breadcrumb" aria-label="Đường dẫn">
        <Link to={ROUTES.SERVICES}>Dịch vụ</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{service.name}</span>
      </nav>
      <div className="service-detail-layout">
        <div className="service-detail-photo">
          <img
            src={servicePhoto(service)}
            alt={service.name}
            width="1280"
            height="850"
          />
          <span className="catalog-photo-tag">
            {service.category === 'COMBO' ? 'Gói kết hợp' : 'Dịch vụ lẻ'}
          </span>
        </div>
        <section className="service-detail-information">
          <p className="catalog-eyebrow">Dành thời gian chăm chút cho bé</p>
          <h1>{service.name}</h1>
          <p className="service-detail-description">{service.description}</p>
          <div className="service-detail-facts">
            <span>Thời lượng dự kiến</span>
            <strong>{service.durationMinutes} phút</strong>
          </div>
          <h2>Giá theo cân nặng</h2>
          <p className="service-detail-hint">
            Chọn mức cân nặng của bé để xem giá.
          </p>
          <fieldset className="service-price-options">
            <legend className="catalog-sr-only">
              Mức cân nặng của thú cưng
            </legend>
            {service.priceBands.map((band, index) => (
              <label
                key={index}
                className={selectedBand === index ? 'is-selected' : ''}
              >
                <input
                  type="radio"
                  name="weight-band"
                  checked={selectedBand === index}
                  onChange={() => setSelectedBand(index)}
                />
                <span>{bandLabel(service.priceBands, index)}</span>
                <strong>{formatVnd(band.priceVnd)}</strong>
              </label>
            ))}
          </fieldset>
          <div className="service-detail-total" aria-live="polite">
            <span>Giá dịch vụ đã chọn</span>
            <strong>
              {formatVnd(service.priceBands[selectedBand]?.priceVnd)}
            </strong>
          </div>
          <Link
            className="catalog-button"
            to={`${ROUTES.BOOKING}?serviceId=${service.id}`}
          >
            Đặt lịch dịch vụ này <span aria-hidden="true">→</span>
          </Link>
          <p className="service-detail-note">
            Giá khi đặt lịch được tính theo cân nặng trong hồ sơ thú cưng của
            bạn.
          </p>
        </section>
      </div>
      <div className="service-detail-after">
        <div>
          <p className="catalog-eyebrow">Trước khi chọn lịch hẹn</p>
          <h2>Chuẩn bị hồ sơ cho bé</h2>
        </div>
        <p>
          Bạn sẽ chọn thú cưng, ngày giờ và chuyên viên ở bước đặt lịch. Có thể
          thêm hồ sơ thú cưng ngay trong form.
        </p>
        <Link className="catalog-link" to={ROUTES.SERVICES}>
          ← Xem dịch vụ khác
        </Link>
      </div>
    </div>
  )
}
