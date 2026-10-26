import { useState } from 'react'
import { formatDuration } from '../../utils/bookingDuration.js'
import { formatVnd } from '../../utils/bookingPrice.js'
import checkCircle from '../../assets/icons/booking/check-circle.svg'
import plusCircle from '../../assets/icons/booking/plus-circle.svg'

const SERVICE_TABS = [
  { id: 'SINGLE', label: 'Dịch vụ riêng' },
  { id: 'COMBO', label: 'Combo chăm sóc' },
]

export default function ServiceSelectionStep({
  pet,
  services,
  selectedServiceIds,
  onToggleService,
  priceFor,
  error,
}) {
  const [activeCategory, setActiveCategory] = useState('SINGLE')
  const visibleServices = services.filter((service) => service.category === activeCategory)

  return (
    <section className="booking-step-content" aria-labelledby="service-step-title">
      <div className="booking-step-heading">
        <p className="booking-step-heading__eyebrow">Bước 2 · Chăm sóc</p>
        <h2 id="service-step-title">Boss muốn được chăm sóc thế nào?</h2>
        {pet && <p className="booking-step-context">Đang chọn cho <strong>{pet.name}</strong><span aria-hidden="true"> · </span>{pet.weightKg} kg</p>}
      </div>

      <div className="booking-service-tabs" role="group" aria-label="Loại dịch vụ">
        {SERVICE_TABS.map((tab) => (
          <button
            className={activeCategory === tab.id ? 'is-active' : ''}
            type="button"
            aria-pressed={activeCategory === tab.id}
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="booking-service-list">
        {visibleServices.map((service) => {
          const selected = selectedServiceIds.includes(service.id)
          const price = priceFor(service)
          return (
            <button
              className={`booking-service-option${selected ? ' is-selected' : ''}`}
              key={service.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggleService(service)}
            >
              <img className="booking-service-option__photo" src={service.imageUrl} alt="" />
              <span className="booking-service-option__body">
                <span className="booking-service-option__meta">
                  {service.category === 'COMBO' ? 'Gói trọn buổi' : 'Dịch vụ riêng'}
                </span>
                <strong>{service.name}</strong>
                <span className="booking-service-option__description">{service.description}</span>
                <span className="booking-service-option__price">{formatVnd(price)} <small>cho {pet?.name ?? 'bé'}</small></span>
              </span>
              <span className="booking-service-option__aside">
                <span className="booking-service-option__duration">{formatDuration(service.durationMinutes)}</span>
                <span className="booking-service-option__action" aria-hidden="true"><img src={selected ? checkCircle : plusCircle} alt="" /></span>
              </span>
            </button>
          )
        })}
      </div>

      {error && <p className="booking-inline-error" role="alert">{error}</p>}
      {selectedServiceIds.some((id) => services.find((service) => service.id === id)?.category === 'COMBO') && (
        <p className="booking-service-note">Combo đã bao gồm các bước chăm sóc chính, nên không cộng thêm dịch vụ riêng.</p>
      )}
    </section>
  )
}
