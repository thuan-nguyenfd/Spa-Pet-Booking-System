const REASONS = [
  { title: 'Giá theo cân nặng', description: 'Mức phí thay đổi theo khoảng cân nặng của thú cưng.' },
  { title: 'Thời lượng rõ ràng', description: 'Mỗi dịch vụ ghi thời gian dự kiến để sen dễ sắp xếp.' },
  { title: 'Chăm vừa đủ', description: 'Từ tắm sấy tới chải tỉa, chọn đúng điều boss cần.' },
  { title: 'Lịch hẹn dễ tìm', description: 'Lối đặt hẹn và theo dõi lịch luôn ở ngay trên trang.' },
]

export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-section__inner page-gutter">
        <div className="about-section__lead">
          <h2 id="about-title">Chăm sóc dịu dàng</h2>
          <p>Sen biết mình đang chọn gì. Boss có một buổi chăm sóc nhẹ nhàng hơn.</p>
        </div>
        <ul className="reason-list">
          {REASONS.map((reason) => (
            <li key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
