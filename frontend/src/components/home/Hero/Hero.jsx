import { Fragment, lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HeroRiveCat = lazy(() => import('./HeroRiveCat.jsx'))
const HERO_MESSAGES = [
  'Hãy để Boss của bạn tận hưởng những dịch vụ chăm sóc chất lượng, tận tâm và chuyên nghiệp của chúng tôi!',
  'Mỗi lần ghé MeoMeo Spa là một lần Boss được nâng niu bằng sự tận tâm và chăm sóc chỉn chu.',
  'Trao Boss cho MeoMeo Spa, để Sen an tâm và người bạn nhỏ luôn được chăm sóc thật tốt.',
]

export default function Hero() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [characterIndex, setCharacterIndex] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timeout
    let messageIndex = 0
    let characterIndex = 0
    let deleting = false
    let fontReady = false
    let cancelled = false

    const clearTimer = () => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout)
        timeout = undefined
      }
    }

    const tick = () => {
      const message = HERO_MESSAGES[messageIndex]

      if (!deleting) {
        characterIndex += 1
        setCharacterIndex(characterIndex)
        if (characterIndex === message.length) {
          deleting = true
          timeout = window.setTimeout(tick, 1500)
        } else {
          timeout = window.setTimeout(tick, 46)
        }
        return
      }

      characterIndex -= 1
      setCharacterIndex(characterIndex)
      if (characterIndex === 0) {
        deleting = false
        messageIndex = (messageIndex + 1) % HERO_MESSAGES.length
        setMessageIndex(messageIndex)
        timeout = window.setTimeout(tick, 260)
      } else {
        timeout = window.setTimeout(tick, 28)
      }
    }

    const updateMotionPreference = () => {
      clearTimer()
      messageIndex = 0
      characterIndex = 0
      deleting = false
      setMessageIndex(0)
      setCharacterIndex(0)

      if (!fontReady) return

      if (reduceMotion.matches) {
        characterIndex = HERO_MESSAGES[0].length
        setCharacterIndex(characterIndex)
      } else {
        timeout = window.setTimeout(tick, 46)
      }
    }

    const loadFontAndStart = async () => {
      try {
        await document.fonts.load('400 30px "Dancing Script"')
        await document.fonts.ready
      } catch {
        // If the web font is unavailable, keep the serif fallback without restarting mid-message.
      }
      if (cancelled) return
      fontReady = true
      updateMotionPreference()
    }

    void loadFontAndStart()
    reduceMotion.addEventListener('change', updateMotionPreference)
    return () => {
      cancelled = true
      clearTimer()
      reduceMotion.removeEventListener('change', updateMotionPreference)
    }
  }, [])

  const message = HERO_MESSAGES[messageIndex]
  let textOffset = 0
  const tokens = (message.match(/\S+|\s+/gu) || []).map((text, tokenIndex) => {
    const start = textOffset
    textOffset += text.length
    return /^\s+$/u.test(text)
      ? { type: 'space', text, start, tokenIndex }
      : { type: 'word', text, start, end: textOffset, tokenIndex }
  })
  const activeWordIndex = tokens.findIndex((token) => (
    token.type === 'word' && characterIndex >= token.start && characterIndex <= token.end
  ))

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title">Boss sạch thơm,<br />sen an tâm.</h1>
        <p className="hero__intro">
          <span className="hero__intro-visual" aria-hidden="true">
            {tokens.map((token) => token.type === 'space' ? (
              <Fragment key={`space-${token.start}`}>{token.text}</Fragment>
            ) : (
              <span className="hero__intro-word" key={`word-${token.start}`}>
                <span className="hero__intro-word-sizer" data-word={token.text} />
                <span className="hero__intro-word-visible">
                  {token.text.slice(0, Math.max(0, Math.min(token.text.length, characterIndex - token.start)))}
                  {token.tokenIndex === tokens[activeWordIndex]?.tokenIndex && <span className="hero__intro-caret" />}
                </span>
              </span>
            ))}
          </span>
          <span className="hero__intro-accessible" aria-live="polite" aria-atomic="true">{message}</span>
        </p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/booking">Đặt hẹn ngay<span aria-hidden="true">↗</span></Link>
          <a className="text-link" href="#services">Khám phá dịch vụ</a>
        </div>
      </div>
      <Suspense fallback={<div className="hero__art" aria-hidden="true" />}>
        <HeroRiveCat />
      </Suspense>
    </section>
  )
}
