import { useState } from 'react'
export default function AccountField({
  label,
  name,
  error,
  type = 'text',
  ...props
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="account-field">
      <label htmlFor={name}>{label}</label>
      <div className="account-input">
        <input
          {...props}
          id={name}
          name={name}
          type={type === 'password' && visible ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {type === 'password' && (
          <button
            type="button"
            aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'Ẩn' : 'Hiện'}
          </button>
        )}
      </div>
      {error && (
        <p className="account-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
