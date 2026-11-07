export default function ServiceState({ loading, error, retry }) {
  if (loading)
    return (
      <div className="catalog-state" role="status">
        Đang chuẩn bị thông tin dịch vụ…
      </div>
    )
  return (
    <div className="catalog-state" role="alert">
      <h2>Chưa tải được dịch vụ</h2>
      <p>{error}</p>
      <button
        className="catalog-button catalog-button--secondary"
        onClick={retry}
      >
        Thử tải lại
      </button>
    </div>
  )
}
