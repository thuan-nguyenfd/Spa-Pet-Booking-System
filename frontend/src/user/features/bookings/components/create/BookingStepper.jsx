const STEPS = ['Thú cưng', 'Dịch vụ', 'Lịch hẹn', 'Xác nhận']

export default function BookingStepper({ activeStep, onSelectStep }) {
  return (
    <nav className="booking-stepper" aria-label="Tiến trình đặt lịch">
      <ol>
        {STEPS.map((label, index) => {
          const isComplete = index < activeStep
          const isCurrent = index === activeStep
          const className = [
            'booking-stepper__step',
            isComplete ? 'is-complete' : '',
            isCurrent ? 'is-current' : '',
          ].filter(Boolean).join(' ')

          return (
            <li className={className} key={label}>
              {isComplete ? (
                <button type="button" onClick={() => onSelectStep(index)} aria-label={`Quay lại bước ${index + 1}: ${label}`}>
                  <span className="booking-stepper__number" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="m5.5 12.5 4.25 4.25L18.5 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="booking-stepper__label">{label}</span>
                </button>
              ) : (
                <span aria-current={isCurrent ? 'step' : undefined}>
                  <span className="booking-stepper__number" aria-hidden="true">{index + 1}</span>
                  <span className="booking-stepper__label">{label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
