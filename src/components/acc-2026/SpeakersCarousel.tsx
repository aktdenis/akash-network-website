import { useCallback, useEffect, useRef, useState } from 'react'
import { acc2026, speakers } from './acc-2026'

const CONTAINER_PADDING = 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))'
const GAP = 24

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function animateScrollTo(
  el: HTMLElement,
  target: number,
  rafRef: { current: number | null },
  duration = 680,
) {
  if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
  const start = el.scrollLeft
  const delta = target - start
  const t0 = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - t0) / duration, 1)
    el.scrollLeft = start + delta * easeOutExpo(t)
    if (t < 1) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      rafRef.current = null
    }
  }
  rafRef.current = requestAnimationFrame(tick)
}

export function SpeakersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const dragRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    velX: 0,
    lastX: 0,
    lastT: 0,
  })
  const momentumRaf = useRef<number | null>(null)
  const scrollRaf = useRef<number | null>(null)
  const targetLeft = useRef<number>(0)

  const stopMomentum = () => {
    if (momentumRaf.current !== null) {
      cancelAnimationFrame(momentumRaf.current)
      momentumRaf.current = null
    }
  }

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    updateArrows()
    return () => el.removeEventListener('scroll', updateArrows)
  }, [updateArrows])

  // Card entrance animation via IntersectionObserver on viewport
  useEffect(() => {
    const cards = scrollRef.current?.querySelectorAll<HTMLElement>('[data-speaker-card]')
    if (!cards?.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 80px 0px 0px' }
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  const scroll = (dir: 'prev' | 'next') => {
    const el = scrollRef.current
    if (!el) return
    stopMomentum()
    const card = el.querySelector<HTMLElement>('[data-speaker-card]')
    const step = (card ? card.offsetWidth : 360) + GAP
    // Advance from intended target, not mid-animation scrollLeft
    if (scrollRaf.current === null) targetLeft.current = el.scrollLeft
    targetLeft.current = Math.max(0, Math.min(
      el.scrollWidth - el.clientWidth,
      targetLeft.current + (dir === 'next' ? step : -step),
    ))
    animateScrollTo(el, targetLeft.current, scrollRaf)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stopMomentum()
    if (scrollRaf.current !== null) { cancelAnimationFrame(scrollRaf.current); scrollRaf.current = null }
    const el = scrollRef.current!
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      velX: 0,
      lastX: e.clientX,
      lastT: e.timeStamp,
    }
    el.setPointerCapture(e.pointerId)
    setIsDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active) return
    const el = scrollRef.current!
    const dt = e.timeStamp - d.lastT
    if (dt > 0) d.velX = (e.clientX - d.lastX) / dt
    d.lastX = e.clientX
    d.lastT = e.timeStamp
    el.scrollLeft = d.startScroll - (e.clientX - d.startX)
  }

  const onPointerUp = (_e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active) return
    d.active = false
    setIsDragging(false)
    const el = scrollRef.current!
    let vel = -d.velX * 20
    const friction = 0.90
    const kick = () => {
      if (Math.abs(vel) < 0.4) return
      el.scrollLeft += vel
      vel *= friction
      momentumRaf.current = requestAnimationFrame(kick)
    }
    momentumRaf.current = requestAnimationFrame(kick)
  }

  return (
    <div className="w-full py-16">
      {/* Heading row */}
      <div
        className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        style={{ paddingLeft: CONTAINER_PADDING, paddingRight: CONTAINER_PADDING }}
      >
        <div>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-foreground">
            The company you'll keep
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-para">
            Two years of Accelerate have drawn the sharpest minds in decentralized compute, AI,
            and infrastructure. Here's who's taken the stage. Many are coming back.
          </p>
        </div>
        <a
          href={acc2026.applyToSpeak}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border/50 bg-transparent px-5 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:border-border hover:text-foreground"
        >
          Apply to Speak
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>

      {/* Arrow buttons */}
      <div className="mb-5 flex gap-2" style={{ paddingLeft: CONTAINER_PADDING }}>
        <button
          onClick={() => scroll('prev')}
          disabled={!canScrollLeft}
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-foreground/60 transition-colors hover:border-border hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => scroll('next')}
          disabled={!canScrollRight}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-foreground/60 transition-colors hover:border-border hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Scrollable cards track */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
        className="flex gap-6 overflow-x-auto py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none"
        style={{ paddingLeft: CONTAINER_PADDING, cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {speakers.map((s, i) => (
          <div
            key={s.name}
            data-speaker-card
            className="shrink-0"
            style={{
              opacity: 0,
              transform: 'translateY(22px)',
              transition: `opacity 0.55s ease ${i * 60}ms, transform 0.55s ease ${i * 60}ms`,
            }}
          >
            <div className="relative w-[300px] h-[480px] sm:w-[340px] sm:h-[530px] lg:w-[360px] lg:h-[580px] rounded-xl transition-transform duration-300 ease-out hover:scale-[1.025] cursor-default">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-[#1a1a1a]">
                  {s.image && (
                    <img
                      src={s.image}
                      alt={s.name}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      loading="lazy"
                      draggable={false}
                    />
                  )}
                </div>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-lg font-semibold text-white">{s.name}</p>
                  <p className="mt-1 text-base text-white/70">{s.role}</p>
                  <p className="text-sm text-white/55">{s.company}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="shrink-0" aria-hidden="true" style={{ width: CONTAINER_PADDING }} />
      </div>
    </div>
  )
}
