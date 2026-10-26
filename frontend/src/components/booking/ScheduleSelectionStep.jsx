import { useEffect, useRef, useState } from 'react'
import { availabilityService } from '../../services/availabilityService.js'
import { staffService } from '../../services/staffService.js'
import { addMinutesToTime, formatDuration } from '../../utils/bookingDuration.js'
import { todayIsoDate } from '../../utils/bookingDate.js'
import checkCircle from '../../assets/icons/booking/check-circle.svg'
import plusCircle from '../../assets/icons/booking/plus-circle.svg'

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function dateAtOffset(offset) {
  const date = new Date(`${todayIsoDate()}T12:00:00`)
  date.setDate(date.getDate() + offset)
  return date
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` // taste-skill-ignore: the picker emits ISO calendar dates.
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date(`${date}T12:00:00`))
}

function initials(name) {
  return name.split(' ').slice(-2).map((word) => word[0]).join('').toUpperCase()
}

export default function ScheduleSelectionStep({
  date,
  totalDuration,
  startTime,
  endTime,
  employeeId,
  onSelectDate,
  onSelectTime,
  onSelectEmployee,
  onAvailableEmployees,
  error,
}) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [slots, setSlots] = useState([])
  const [slotState, setSlotState] = useState('loading')
  const [staff, setStaff] = useState([])
  const [staffState, setStaffState] = useState('idle')
  const selectedTimeRef = useRef(startTime)
  const selectedEmployeeRef = useRef(employeeId)
  selectedTimeRef.current = startTime
  selectedEmployeeRef.current = employeeId

  useEffect(() => {
    let current = true
    setSlotState('loading')
    setSlots([])
    availabilityService.getAvailableSlots({ date, totalDuration }).then((availableSlots) => {
      if (!current) return
      setSlots(availableSlots)
      setSlotState('ready')
      if (selectedTimeRef.current && !availableSlots.includes(selectedTimeRef.current)) onSelectTime(null)
    }).catch(() => {
      if (current) setSlotState('error')
    })
    return () => { current = false }
  }, [date, totalDuration, onSelectTime])

  useEffect(() => {
    if (!date || !startTime || !endTime) {
      setStaff([])
      setStaffState('idle')
      return undefined
    }

    let current = true
    setStaffState('loading')
    staffService.getAvailableStaff({ date, startTime, endTime }).then((availableStaff) => {
      if (!current) return
      setStaff(availableStaff)
      setStaffState('ready')
      onAvailableEmployees(availableStaff)
      if (selectedEmployeeRef.current && !availableStaff.some((member) => member.id === selectedEmployeeRef.current)) {
        onSelectEmployee(null)
      }
    }).catch(() => {
      if (current) {
        setStaffState('error')
        onAvailableEmployees([])
      }
    })
    return () => { current = false }
  }, [date, startTime, endTime, onSelectEmployee, onAvailableEmployees])

  const visibleDates = Array.from({ length: 7 }, (_, index) => dateAtOffset(weekOffset + index))
  const morningSlots = slots.filter((time) => Number(time.slice(0, 2)) < 12)
  const afternoonSlots = slots.filter((time) => Number(time.slice(0, 2)) >= 12)
  const chosenEndTime = endTime || (startTime ? addMinutesToTime(startTime, totalDuration) : '')

  return (
    <section className="booking-step-content" aria-labelledby="schedule-step-title">
      <div className="booking-step-heading">
        <p className="booking-step-heading__eyebrow">Bước 3 · Lịch hẹn</p>
        <h2 id="schedule-step-title">Chọn lúc bạn và bé ghé MEOMEO.</h2>
        <p>Chọn ngày trước, tụi mình sẽ mở những khung giờ và chuyên viên còn trống.</p>
      </div>

      <div className="booking-schedule-section">
        <div className="booking-schedule-section__title">
          <h3>Ngày bạn muốn đến</h3>
          <div className="booking-week-controls">
            <button type="button" onClick={() => setWeekOffset((offset) => Math.max(0, offset - 7))} disabled={weekOffset === 0} aria-label="Xem tuần trước">‹</button>
            <button type="button" onClick={() => setWeekOffset((offset) => Math.min(7, offset + 7))} disabled={weekOffset >= 7} aria-label="Xem tuần sau">›</button>
          </div>
        </div>
        <div className="booking-date-grid" role="group" aria-label="Chọn ngày hẹn">
          {visibleDates.map((day) => {
            const isoDate = toIsoDate(day)
            const selected = isoDate === date
            return (
              <button
                className={`booking-date-option${selected ? ' is-selected' : ''}`}
                type="button"
                aria-pressed={selected}
                aria-label={`${WEEKDAYS[day.getDay()]}, ${day.getDate()} tháng ${day.getMonth() + 1}`}
                key={isoDate}
                onClick={() => onSelectDate(isoDate)}
              >
                <span>{WEEKDAYS[day.getDay()]}</span>
                <strong>{day.getDate()}</strong>
                <small>{new Intl.DateTimeFormat('vi-VN', { month: 'short' }).format(day)}</small>
              </button>
            )
          })}
        </div>
      </div>

      <div className="booking-schedule-section" aria-live="polite">
        <div className="booking-schedule-section__title">
          <div>
            <h3>Khung giờ còn trống</h3>
            {date && <p>{formatLongDate(date)}</p>}
          </div>
          <span className="booking-duration-hint">Dự kiến {formatDuration(totalDuration)}</span>
        </div>

        {slotState === 'loading' && <div className="booking-loading-line"><span />Đang kiểm tra lịch trống…</div>}
        {slotState === 'error' && <p className="booking-inline-error" role="alert">Chưa tải được khung giờ. Bạn đổi ngày hoặc thử lại sau nhé.</p>}
        {slotState === 'ready' && slots.length === 0 && (
          <div className="booking-slot-empty">
            <p>Hôm nay các bé ghé đông quá rồi.</p>
            <span>Bạn thử chọn một ngày khác nhé.</span>
            <button className="text-link" type="button" onClick={() => setWeekOffset((offset) => Math.min(7, offset + 7))}>Xem tuần tiếp theo <span aria-hidden="true">→</span></button>
          </div>
        )}
        {slotState === 'ready' && slots.length > 0 && (
          <div className="booking-time-groups">
            {[['Buổi sáng', morningSlots], ['Buổi chiều', afternoonSlots]].map(([label, groupSlots]) => groupSlots.length > 0 && (
              <div className="booking-time-group" key={label}>
                <h4>{label}</h4>
                <div className="booking-time-options" role="group" aria-label={`Khung giờ ${label.toLowerCase()}`}>
                  {groupSlots.map((time) => (
                    <button
                      className={`booking-time-option${startTime === time ? ' is-selected' : ''}`}
                      type="button"
                      aria-pressed={startTime === time}
                      key={time}
                      onClick={() => onSelectTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {startTime && chosenEndTime && (
          <div className="booking-time-confirmation" aria-live="polite">
            <span className="booking-time-confirmation__time">{startTime}<i aria-hidden="true" /><strong>{chosenEndTime}</strong></span>
            <span>Khoảng {formatDuration(totalDuration)} chăm sóc</span>
          </div>
        )}
      </div>

      {startTime && (
        <div className="booking-schedule-section booking-staff-section" aria-live="polite">
          <div className="booking-schedule-section__title">
            <div>
              <h3>Chuyên viên đồng hành</h3>
              <p>Những người có thể chăm sóc bé trọn khung giờ này.</p>
            </div>
          </div>
          {staffState === 'loading' && <div className="booking-loading-line"><span />Đang tìm chuyên viên phù hợp…</div>}
          {staffState === 'error' && <p className="booking-inline-error" role="alert">Chưa tải được danh sách chuyên viên. Bạn thử chọn lại giờ nhé.</p>}
          {staffState === 'ready' && staff.length === 0 && (
            <div className="booking-slot-empty booking-slot-empty--staff">
              <p>Khung giờ này vừa kín mất rồi.</p>
              <button className="text-link" type="button" onClick={() => onSelectTime(null)}>Chọn khung giờ khác</button>
            </div>
          )}
          {staffState === 'ready' && staff.length > 0 && (
            <div className="booking-staff-list" role="group" aria-label="Chọn chuyên viên">
              {staff.map((member) => (
                <button
                  className={`booking-staff-option${employeeId === member.id ? ' is-selected' : ''}`}
                  type="button"
                  key={member.id}
                  aria-pressed={employeeId === member.id}
                  onClick={() => onSelectEmployee(member.id)}
                >
                  <span className={`booking-staff-option__avatar booking-staff-option__avatar--${member.avatarTone}`}>{initials(member.name)}</span>
                  <span className="booking-staff-option__info"><strong>{member.name}</strong><small>{member.role}</small></span>
                  <span className="booking-staff-option__mark" aria-hidden="true"><img src={employeeId === member.id ? checkCircle : plusCircle} alt="" /></span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="booking-inline-error" role="alert">{error}</p>}
    </section>
  )
}
