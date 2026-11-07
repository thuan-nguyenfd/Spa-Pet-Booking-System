export function getServicePrice(service, pet) {
  if (!service || !pet || !Array.isArray(service.priceBands)) return 0
  const band = service.priceBands.find(({ maxWeightKg }) => (
    maxWeightKg === null || Number(pet.weightKg) <= maxWeightKg
  ))
  return band?.priceVnd ?? 0
}

export function getBookingTotalPrice(selectedItems, pet) {
  return selectedItems.reduce((sum, item) => sum + getServicePrice(item, pet), 0)
}

export function formatVnd(amount) {
  return `${Number(amount || 0).toLocaleString('vi-VN')}đ`
}
