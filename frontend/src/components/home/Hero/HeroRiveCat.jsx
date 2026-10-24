import { useEffect } from 'react'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'

const RIVE_SOURCE = '/rive/hero/hero-cat.riv'
const RIVE_ARTBOARD = 'Artboard'
const RIVE_STATE_MACHINE = 'State Machine 1'
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function useHeroPointerBridge(rive, canvas) {
  useEffect(() => {
    if (!rive || !canvas) return undefined

    const header = document.querySelector('.site-header')
    const hero = canvas.closest('.hero')
    if (!header || !hero) return undefined

    let frameId = 0
    let latestPointer = null
    let trackingPointer = false
    const forwardedRiveEvents = new WeakSet()

    const visibleRect = (element) => {
      const rect = element.getBoundingClientRect()
      const left = Math.max(0, rect.left)
      const top = Math.max(0, rect.top)
      const right = Math.min(window.innerWidth, rect.right)
      const bottom = Math.min(window.innerHeight, rect.bottom)
      return right > left && bottom > top ? { left, top, right, bottom } : null
    }

    const getPointerBounds = () => {
      const rects = [visibleRect(header), visibleRect(hero)].filter(Boolean)
      if (!rects.length) return null
      const left = Math.min(...rects.map((rect) => rect.left))
      const top = Math.min(...rects.map((rect) => rect.top))
      const right = Math.max(...rects.map((rect) => rect.right))
      const bottom = Math.max(...rects.map((rect) => rect.bottom))
      return { left, top, right, bottom, width: right - left, height: bottom - top }
    }

    const isInsideRect = (x, y, rect) => rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    const isInsideTrackingArea = (x, y, target) => {
      if (target instanceof Node && header.contains(target)) return true
      return isInsideRect(x, y, visibleRect(header)) || isInsideRect(x, y, visibleRect(hero))
    }

    const toCanvasCoordinates = ({ x, y }) => {
      const bounds = getPointerBounds()
      const canvasRect = canvas.getBoundingClientRect()
      if (!bounds || !bounds.width || !bounds.height || !canvasRect.width || !canvasRect.height) return null

      const normalizedX = clamp((x - bounds.left) / bounds.width, 0, 1)
      const normalizedY = clamp((y - bounds.top) / bounds.height, 0, 1)
      return {
        clientX: canvasRect.left + normalizedX * canvasRect.width,
        clientY: canvasRect.top + normalizedY * canvasRect.height,
      }
    }

    // The React hook exposes the Rive canvas but not its active StateMachineInstance.
    // Route mapped coordinates through the runtime's existing canvas listener instead of its private internals.
    const forwardMouseEvent = (type, point, buttons = 0) => {
      const coordinates = toCanvasCoordinates(point)
      if (!coordinates) return
      const event = new MouseEvent(type, {
        view: window,
        bubbles: false,
        clientX: coordinates.clientX,
        clientY: coordinates.clientY,
        buttons,
      })
      forwardedRiveEvents.add(event)
      canvas.dispatchEvent(event)
    }

    const forwardMouseOut = () => {
      const canvasRect = canvas.getBoundingClientRect()
      const event = new MouseEvent('mouseout', {
        view: window,
        bubbles: false,
        clientX: canvasRect.left - 4,
        clientY: canvasRect.top - 4,
      })
      forwardedRiveEvents.add(event)
      canvas.dispatchEvent(event)
    }

    const suppressNativeRivePointerEvent = (event) => {
      if (!forwardedRiveEvents.has(event)) event.stopImmediatePropagation()
    }

    const flushPointer = () => {
      frameId = 0
      if (!latestPointer || !trackingPointer) return
      forwardMouseEvent('mousemove', latestPointer, latestPointer.buttons)
    }

    const releasePointer = () => {
      if (!trackingPointer) return
      if (frameId) window.cancelAnimationFrame(frameId)
      frameId = 0
      latestPointer = null
      trackingPointer = false
      forwardMouseOut()
    }

    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse') return
      if (!isInsideTrackingArea(event.clientX, event.clientY, event.target)) {
        releasePointer()
        return
      }
      trackingPointer = true
      latestPointer = { x: event.clientX, y: event.clientY, buttons: event.buttons }
      if (!frameId) frameId = window.requestAnimationFrame(flushPointer)
    }

    const onPointerOut = (event) => {
      if (event.relatedTarget === null) releasePointer()
    }

    canvas.addEventListener('mouseover', suppressNativeRivePointerEvent, true)
    canvas.addEventListener('mousemove', suppressNativeRivePointerEvent, true)
    canvas.addEventListener('mouseout', suppressNativeRivePointerEvent, true)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut, true)
    window.addEventListener('blur', releasePointer)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      canvas.removeEventListener('mouseover', suppressNativeRivePointerEvent, true)
      canvas.removeEventListener('mousemove', suppressNativeRivePointerEvent, true)
      canvas.removeEventListener('mouseout', suppressNativeRivePointerEvent, true)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut, true)
      window.removeEventListener('blur', releasePointer)
    }
  }, [canvas, rive])
}

export default function HeroRiveCat() {
  const { RiveComponent, rive, canvas } = useRive({
    src: RIVE_SOURCE,
    artboard: RIVE_ARTBOARD,
    stateMachine: RIVE_STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    shouldDisableRiveListeners: false,
    onLoadError: (error) => {
      if (import.meta.env.DEV) {
        console.warn(`MEOMEO hero Rive failed to load at ${RIVE_SOURCE}.`, error)
      }
    },
  }, {
    shouldResizeCanvasToContainer: true,
    useDevicePixelRatio: true,
  })

  useHeroPointerBridge(rive, canvas)

  return (
    <div className="hero__art" aria-hidden="true">
      <RiveComponent className="hero__rive-player" tabIndex={-1} />
    </div>
  )
}
