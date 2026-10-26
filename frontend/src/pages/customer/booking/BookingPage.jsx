import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AddPetModal from '../../../components/booking/AddPetModal.jsx'
import BookingStepper from '../../../components/booking/BookingStepper.jsx'
import BookingSummary from '../../../components/booking/BookingSummary.jsx'
import BookingSuccess from '../../../components/booking/BookingSuccess.jsx'
import BookingReviewStep from '../../../components/booking/BookingReviewStep.jsx'
import PetSelectionStep from '../../../components/booking/PetSelectionStep.jsx'
import ScheduleSelectionStep from '../../../components/booking/ScheduleSelectionStep.jsx'
import ServiceSelectionStep from '../../../components/booking/ServiceSelectionStep.jsx'
import { ROUTES } from '../../../constants/routes.js'
import { bookingService } from '../../../services/bookingService.js'
import { customerService } from '../../../services/customerService.js'
import { petService } from '../../../services/petService.js'
import { serviceService } from '../../../services/serviceService.js'
import { getTotalDuration, addMinutesToTime, formatDuration } from '../../../utils/bookingDuration.js'
import { todayIsoDate } from '../../../utils/bookingDate.js'
import { getBookingTotalPrice, getServicePrice } from '../../../utils/bookingPrice.js'
import '../../../styles/booking.css'

const INITIAL_DRAFT = {
  petId: null,
  selectedServiceIds: [],
  date: todayIsoDate(),
  startTime: null,
  endTime: null,
  employeeId: null,
  note: '',
  paymentMethod: null,
}

function createPayload({ draft }) {
  return {
    petId: draft.petId,
    employeeId: draft.employeeId,
    appointmentDate: draft.date,
    startTime: draft.startTime,
    serviceIds: [...draft.selectedServiceIds],
    note: draft.note.trim(),
    paymentMethod: draft.paymentMethod,
  }
}

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const [activeStep, setActiveStep] = useState(0)
  const [draft, setDraft] = useState(INITIAL_DRAFT)
  const [pets, setPets] = useState([])
  const [services, setServices] = useState([])
  const [customer, setCustomer] = useState(null)
  const [resourceState, setResourceState] = useState('loading')
  const [resourceError, setResourceError] = useState('')
  const [stepError, setStepError] = useState('')
  const [isPetModalOpen, setIsPetModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)
  const [availableEmployees, setAvailableEmployees] = useState([])
  const stepContentRef = useRef(null)
  const preselectedService = searchParams.get('serviceId')
  const preselectedServiceId = preselectedService?.trim() ? Number(preselectedService) : null

  useEffect(() => {
    let current = true
    Promise.all([
      petService.getMyPets(),
      serviceService.getAvailableServices(),
      customerService.getCurrentCustomer(),
    ]).then(([petList, serviceList, currentCustomer]) => {
      if (!current) return
      setPets(petList)
      setServices(serviceList)
      setCustomer(currentCustomer)
      setDraft((existing) => ({
        ...existing,
        petId: existing.petId ?? petList[0]?.id ?? null,
        selectedServiceIds: existing.selectedServiceIds.length
          ? existing.selectedServiceIds
          : Number.isSafeInteger(preselectedServiceId) && serviceList.some((service) => service.id === preselectedServiceId)
            ? [preselectedServiceId]
            : [],
      }))
      setResourceState('ready')
    }).catch(() => {
      if (!current) return
      setResourceError('Chưa tải được thông tin đặt lịch. Bạn thử tải lại trang nhé.')
      setResourceState('error')
    })
    return () => { current = false }
  }, [preselectedService])

  const pet = pets.find((item) => item.id === draft.petId) ?? null
  const selectedItems = useMemo(() => services
    .filter((service) => draft.selectedServiceIds.includes(service.id))
    .map((service) => ({ ...service, priceVnd: getServicePrice(service, pet) })), [services, draft.selectedServiceIds, pet])
  const totalDuration = getTotalDuration(selectedItems)
  const totalPrice = getBookingTotalPrice(selectedItems, pet)
  const selectedEmployee = availableEmployees.find((item) => item.id === draft.employeeId) ?? null

  const updateDraft = useCallback((updates) => {
    setDraft((current) => ({ ...current, ...updates }))
    setStepError('')
  }, [])

  const selectTime = useCallback((time) => {
    setAvailableEmployees([])
    updateDraft({
      startTime: time,
      endTime: time ? addMinutesToTime(time, totalDuration) : null,
      employeeId: null,
    })
  }, [totalDuration, updateDraft])

  const selectEmployee = useCallback((employeeId) => updateDraft({ employeeId }), [updateDraft])
  const closePetModal = useCallback(() => setIsPetModalOpen(false), [])

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    if (bookingResult) {
      const root = document.documentElement
      const previousScrollBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      const resetScroll = () => {
        root.scrollTop = 0
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
      }
      resetScroll()
      window.requestAnimationFrame(() => {
        resetScroll()
        window.requestAnimationFrame(() => { root.style.scrollBehavior = previousScrollBehavior })
      })
      return
    }
    if (activeStep === 0) return
    stepContentRef.current?.scrollIntoView({ behavior, block: 'start' })
  }, [activeStep, bookingResult])

  function toggleService(service) {
    setDraft((current) => {
      const alreadySelected = current.selectedServiceIds.includes(service.id)
      const chosenServices = current.selectedServiceIds
        .map((id) => services.find((item) => item.id === id))
        .filter(Boolean)
      let nextIds
      if (alreadySelected) {
        nextIds = current.selectedServiceIds.filter((id) => id !== service.id)
      } else if (service.category === 'COMBO') {
        nextIds = [service.id]
      } else {
        nextIds = [
          ...current.selectedServiceIds.filter((id) => chosenServices.find((item) => item.id === id)?.category !== 'COMBO'),
          service.id,
        ]
      }
      return { ...current, selectedServiceIds: [...new Set(nextIds)] }
    })
    setStepError('')
  }

  function selectPet(petId) {
    updateDraft({ petId })
  }

  function selectDate(date) {
    setAvailableEmployees([])
    updateDraft({ date, startTime: null, endTime: null, employeeId: null })
  }

  async function savePet(input) {
    const newPet = await petService.createPet(input)
    setPets((current) => [...current, newPet])
    setDraft((current) => ({ ...current, petId: newPet.id }))
    setStepError('')
    setIsPetModalOpen(false)
  }

  function continueToNextStep() {
    if (activeStep === 0 && !pet) return setStepError('Bạn chọn một bạn nhỏ hoặc thêm hồ sơ mới nhé.')
    if (activeStep === 1 && selectedItems.length === 0) return setStepError('Chọn ít nhất một dịch vụ để tiếp tục nhé.')
    if (activeStep === 2 && (!draft.date || !draft.startTime || !selectedEmployee)) {
      return setStepError(!draft.startTime ? 'Bạn chọn một khung giờ phù hợp nhé.' : !selectedEmployee ? 'Bạn chọn chuyên viên đồng hành nhé.' : 'Bạn chọn ngày hẹn nhé.')
    }
    if (activeStep < 3) {
      setStepError('')
      setActiveStep((current) => current + 1)
      return
    }
    if (!draft.paymentMethod) return setStepError('Bạn chọn phương thức thanh toán nhé.')
    submitBooking()
  }

  async function submitBooking() {
    setIsSubmitting(true)
    setStepError('')
    const submissionDraft = {
      ...draft,
      pet,
      selectedItems,
      employee: selectedEmployee,
      totalDuration,
      totalPrice,
    }
    try {
      const result = await bookingService.createBooking(createPayload({ draft }))
      setBookingResult({ booking: result, draft: submissionDraft })
    } catch {
      setStepError('Chưa gửi được lịch hẹn. Bạn thử lại sau ít phút nhé.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function changeStep(step) {
    if (step < activeStep) {
      setStepError('')
      setActiveStep(step)
    }
  }

  const currentStepContent = () => {
    if (activeStep === 0) {
      return <PetSelectionStep pets={pets} selectedPetId={draft.petId} onSelectPet={selectPet} onAddPet={() => setIsPetModalOpen(true)} error={stepError} />
    }
    if (activeStep === 1) {
      return <ServiceSelectionStep pet={pet} services={services} selectedServiceIds={draft.selectedServiceIds} onToggleService={toggleService} priceFor={(service) => getServicePrice(service, pet)} error={stepError} />
    }
    if (activeStep === 2) {
      return <ScheduleSelectionStep date={draft.date} totalDuration={totalDuration} startTime={draft.startTime} endTime={draft.endTime} employeeId={draft.employeeId} onSelectDate={selectDate} onSelectTime={selectTime} onSelectEmployee={selectEmployee} onAvailableEmployees={setAvailableEmployees} error={stepError} />
    }
    return <BookingReviewStep customer={customer} pet={pet} items={selectedItems} employee={selectedEmployee} date={draft.date} startTime={draft.startTime} endTime={draft.endTime} totalDuration={totalDuration} totalPrice={totalPrice} note={draft.note} paymentMethod={draft.paymentMethod} onNoteChange={(note) => updateDraft({ note })} onPaymentChange={(paymentMethod) => updateDraft({ paymentMethod })} error={stepError} />
  }

  if (bookingResult) return <div className="booking-page"><div className="booking-container"><BookingSuccess booking={bookingResult.booking} draft={bookingResult.draft} /></div></div>

  return (
    <div className="booking-page">
      <div className="booking-container">
        <header className="booking-page-heading">
          <div>
            <p className="booking-page-heading__eyebrow">Đặt lịch tại MEOMEO</p>
            <h1>Đặt lịch chăm sóc</h1>
            <p>Chọn dịch vụ và thời gian hợp với bạn cùng người bạn nhỏ.</p>
          </div>
          <span className="booking-page-heading__note">Chỉ mất vài phút</span>
        </header>

        {resourceState === 'ready' && <BookingStepper activeStep={activeStep} onSelectStep={changeStep} />}

        <div className="booking-layout">
          <main className="booking-stage" ref={stepContentRef}>
            {resourceState === 'loading' && (
              <div className="booking-loading-page" role="status"><span className="booking-loading-line"><span />Đang chuẩn bị lịch hẹn của bạn…</span></div>
            )}
            {resourceState === 'error' && (
              <div className="booking-error-page" role="alert"><h2>Chưa mở được lịch hẹn</h2><p>{resourceError}</p><button className="button button--primary booking-action-button" type="button" onClick={() => window.location.assign(ROUTES.BOOKING)}>Tải lại trang</button></div>
            )}
            {resourceState === 'ready' && (
              <>
                {currentStepContent()}
                <div className="booking-stage-actions">
                  {activeStep > 0 ? (
                    <button className="booking-text-button" type="button" onClick={() => changeStep(activeStep - 1)} disabled={isSubmitting}><span aria-hidden="true">←</span> Quay lại</button>
                  ) : <span />}
                  <button className="button button--primary booking-action-button" type="button" onClick={continueToNextStep} disabled={isSubmitting}>
                    {activeStep === 3 ? (isSubmitting ? 'Đang xác nhận…' : 'Xác nhận đặt lịch') : 'Tiếp tục'}
                    {activeStep < 3 && <span aria-hidden="true">→</span>}
                  </button>
                </div>
                <p className="booking-stage-footnote">{activeStep === 3 ? 'Bạn sẽ nhận được mã lịch hẹn ngay sau khi xác nhận.' : `Bước ${activeStep + 1} trên 4 · ${formatDuration(totalDuration) ? `Dự kiến ${formatDuration(totalDuration)}` : 'Chưa cần thanh toán'}`}</p>
              </>
            )}
          </main>

          {resourceState === 'ready' && (
            <aside className="booking-aside" aria-label="Tóm tắt lịch hẹn">
              <BookingSummary pet={pet} items={selectedItems} date={draft.date} startTime={draft.startTime} endTime={draft.endTime} employee={selectedEmployee} totalDuration={totalDuration} totalPrice={totalPrice} />
            </aside>
          )}
        </div>
      </div>
      {isPetModalOpen && <AddPetModal onClose={closePetModal} onSave={savePet} />}
    </div>
  )
}
