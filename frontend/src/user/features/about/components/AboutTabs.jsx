import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ABOUT, CARE, GROOMING, PHOTOS, TABS } from '../data/aboutData.js'
import { AboutPhoto } from './AboutElements.jsx'
import { ROUTES } from '../../../../app/routes/routePaths.js'

function Gallery() {
  const [selected, setSelected] = useState(null)
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  function open(photo, event) { triggerRef.current = event.currentTarget; setSelected(photo); dialogRef.current.showModal() }
  return <div className="about-gallery"><div className="about-gallery__intro"><h3>Những niềm vui bé xíu</h3><p>Một cái nghiêng đầu, một ánh nhìn, một bộ lông mềm. Những khoảnh khắc khiến mình mỉm cười.</p><p className="about-gallery__note">Bộ ảnh minh họa về những người bạn bốn chân.</p></div><div className="about-gallery__photos">{Object.values(PHOTOS).map(photo => <button type="button" key={photo.src} onClick={event => open(photo, event)} aria-label={`Xem ảnh lớn: ${photo.alt}`}><AboutPhoto photo={photo} /></button>)}</div><dialog className="about-lightbox" ref={dialogRef} aria-label="Ảnh thú cưng phóng lớn" onClose={() => triggerRef.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close() }}><button type="button" className="about-lightbox__close" onClick={() => dialogRef.current.close()} aria-label="Đóng ảnh">Đóng ×</button>{selected && <AboutPhoto photo={selected} />}</dialog></div>
}

function Panel({ active }) {
  if (active === 'grooming') return <div className="about-grooming"><AboutPhoto photo={PHOTOS.bath} /><div><h3>Chăm từ bộ lông</h3><ul>{GROOMING.map(service => <li key={service.routeId}><Link to={ROUTES.SERVICE_DETAIL(service.routeId)}>{service.title}</Link><p>{service.text}</p><span>{service.duration}</span></li>)}</ul></div></div>
  if (active === 'care') return <div className="about-care"><div><h3>Hiểu bé, rồi chăm bé</h3><AboutPhoto photo={PHOTOS.brush} /></div><div>{CARE.map(item => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</div></div>
  if (active === 'moments') return <Gallery />
  if (active === 'visit') return <div className="about-visit"><div><h3>Ghé chơi cùng Boss</h3><p>Chúng mình hẹn nhau ở Chợ Quán nhé. Chọn trước dịch vụ phù hợp để buổi ghé thăm thêm thong thả.</p><address>{ABOUT.address}</address><a className="about-button" href={ABOUT.mapsUrl} target="_blank" rel="noopener noreferrer">Chỉ đường <span aria-hidden="true">↗</span></a><Link className="about-text-link" to={ROUTES.SERVICES}>Khám phá dịch vụ</Link></div><div className="about-visit__number" aria-hidden="true"><span>Hẹn tại số</span><strong>273</strong><span>An Dương Vương</span></div></div>
  return <div className="about-tab-story"><div><h3>Một cái tên.<br />Một lời thương.</h3><p>MEOMEO nghe như tiếng gọi một người bạn nhỏ. Gần gũi, thân quen, như cách chúng mình mong mỗi bé cảm nhận khi được quan tâm.</p><p>Từ một buổi tắm thơm đến lần chải lại bộ lông, chúng mình muốn dành chỗ cho những điều nhỏ ấy. Bởi với sen, bé luôn là một thành viên của gia đình.</p><Link className="about-text-link" to={ROUTES.SERVICES}>Tìm dịch vụ dành cho bé</Link></div><AboutPhoto photo={PHOTOS.portrait} /></div>
}

export default function AboutTabs() {
  const [active, setActive] = useState('story')
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const listRef = useRef(null)
  const tabRefs = useRef([])
  useEffect(() => {
    let alive = true
    function update() { const tab = tabRefs.current[TABS.findIndex(item => item.id === active)]; if (alive && tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth }) }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(listRef.current)
    document.fonts.ready.then(update)
    return () => { alive = false; observer.disconnect() }
  }, [active])
  function activate(index, focus = false) {
    setActive(TABS[index].id)
    const tab = tabRefs.current[index]
    if (focus) tab.focus()
    listRef.current.scrollTo({ left: tab.offsetLeft - (listRef.current.clientWidth - tab.offsetWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  function handleKey(event, index) {
    const keys = { ArrowRight: (index + 1) % TABS.length, ArrowLeft: (index + TABS.length - 1) % TABS.length, Home: 0, End: TABS.length - 1 }
    if (!(event.key in keys)) return
    event.preventDefault(); activate(keys[event.key], true)
  }
  return <div className="about-tabs"><div className="about-tabs__list" role="tablist" aria-label="Khám phá MEOMEO" ref={listRef}>{TABS.map((tab, index) => <button type="button" role="tab" id={`about-tab-${tab.id}`} aria-controls={`about-panel-${tab.id}`} aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} key={tab.id} ref={node => { tabRefs.current[index] = node }} onClick={() => activate(index)} onKeyDown={event => handleKey(event, index)}><span className="about-tabs__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{tab.label}</button>)}<span className="about-tabs__indicator" aria-hidden="true" style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }} /></div>{TABS.map(tab => <div key={tab.id} role="tabpanel" id={`about-panel-${tab.id}`} aria-labelledby={`about-tab-${tab.id}`} hidden={active !== tab.id} tabIndex={0} className="about-tabs__panel">{active === tab.id && <Panel active={active} />}</div>)}</div>
}
