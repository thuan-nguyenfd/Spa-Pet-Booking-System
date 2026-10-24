import { Link } from 'react-router-dom'
import { SERVICES, SERVICE_CREDITS } from '../homeData.js'

export default function ServicesSection() {
  return (
    <section className="services-section page-gutter" id="services" aria-labelledby="services-title">
      <div className="section-heading section-heading--split">
        <h2 id="services-title">Dịch vụ cho boss</h2>
        <p>Chọn buổi chăm vừa với bộ lông, tính cách và lịch sinh hoạt của thú cưng.</p>
      </div>

      <div className="service-list">
        {SERVICES.filter((service) => service.trangthai === 1).map((service) => {
          const credit = SERVICE_CREDITS[service.madichvu]
          return (
            <article className="service-strip" key={service.madichvu}>
              <img
                className="service-strip__photo"
                src={service.hinhanh}
                alt={service.madichvu === 1 ? 'Nhân viên nhẹ nhàng tắm cho một chú chó' : service.madichvu === 2 ? 'Chú Shih Tzu lông trắng sau khi được tỉa gọn' : service.madichvu === 3 ? 'Chủ đang chải bộ lông dài cho chó' : 'Chú chó đã được chăm lông tại bàn grooming'}
                loading="lazy"
                decoding="async"
                width="1280"
                height="850"
              />
              <div className="service-strip__scrim" aria-hidden="true" />
              <div className="service-strip__copy">
                <h3>{service.ten}</h3>
                <p className="service-strip__description">{service.mota}</p>
                <div className="service-strip__details">
                  <span>{service.loaidichvu === 'COMBO' ? 'Gói kết hợp' : 'Dịch vụ đơn'}</span>
                  <span>{service.thoiluongphut} phút</span>
                  <span>Giá theo cân nặng</span>
                  <Link to={`/services/${service.madichvu}`}>Xem chi tiết <span aria-hidden="true">↗</span></Link>
                </div>
              </div>
              <a className="service-strip__credit" href={credit.href} target="_blank" rel="noreferrer" aria-label={`Nguồn ảnh: ${credit.title}, ${credit.creator}, ${credit.licence}, ${credit.source}`}>
                Ảnh: {credit.creator} · {credit.licence}
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
