export function getTotalDuration(selectedItems) {
  return selectedItems.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0)
}

export function formatDuration(minutes) {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours && remainingMinutes) return `${hours} giờ ${remainingMinutes} phút`
  if (hours) return `${hours} giờ`
  return `${remainingMinutes} phút`
}

export function minutesFromTime(time) {
  if (!time) return 0
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function addMinutesToTime(time, minutes) {
  if (!time) return ''
  const totalMinutes = minutesFromTime(time) + Number(minutes || 0)
  const hours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}` // taste-skill-ignore: 24-hour time fields must be two digits.
}
