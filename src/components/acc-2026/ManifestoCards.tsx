import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { decoImages } from './acc-2026'

// ── Fan / arc constants ───────────────────────────────────────────────────────
const CARD_W = 300
const CARD_H = 300
const N = decoImages.length
const TOTAL_ARC = 56
const ARC_STEP = TOTAL_ARC / (N - 1)
const R_OFFSET = 450
const CONTAINER_W = 880
const CONTAINER_H = 420
const CARD_LEFT = CONTAINER_W / 2 - CARD_W / 2
const CARD_TOP = 40
const ORIGIN = `50% calc(100% + ${R_OFFSET}px)`
const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28, mass: 0.5 }
const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

function ArcCard({
  image,
  index,
  isHovered,
  setRef,
}: {
  image: string
  index: number
  isHovered: boolean
  setRef: (el: HTMLDivElement | null) => void
}) {
  const angle = -TOTAL_ARC / 2 + index * ARC_STEP

  return (
    <motion.div
      ref={setRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      animate={{
        y: isHovered ? -55 : 0,
        scale: isHovered ? 1.04 : 1,
        rotate: angle,
      }}
      transition={{
        opacity: { duration: 0.5, ease: EASE, delay: index * 0.05 },
        y: SPRING,
        scale: SPRING,
        rotate: { duration: 0 },
      }}
      style={{
        position: 'absolute',
        left: CARD_LEFT,
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        transformOrigin: ORIGIN,
        zIndex: isHovered ? 100 : index + 1,
        willChange: 'transform',
        // pointer-events: none so all events pass through to the container,
        // which does its own hit-testing. No per-card event handling at all.
        pointerEvents: 'none',
        boxShadow: isHovered
          ? '0 28px 60px -8px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.18)'
          : '0 4px 18px rgba(0,0,0,0.55)',
      }}
      className="overflow-hidden rounded-xl bg-[#161616] cursor-default"
    >
      <img
        src={image}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' }}
      />
    </motion.div>
  )
}

export function ManifestoCards() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null))

  // Stable ref setters — created once, never re-created
  const cardRefSetters = useRef(
    Array.from({ length: N }, (_, i) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el
    }),
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Container-level hit testing. All cards have pointer-events:none so events
  // pass through to this container. On each move we check which card rect
  // contains the cursor (front-to-back). No debounce — no bouncing possible.
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const cx = e.clientX
    const cy = e.clientY
    let found: number | null = null
    for (let i = N - 1; i >= 0; i--) {
      const el = cardRefs.current[i]
      if (!el) continue
      const { left, right, top, bottom } = el.getBoundingClientRect()
      if (cx >= left && cx <= right && cy >= top && cy <= bottom) {
        found = i
        break
      }
    }
    setHoveredIndex((prev) => (prev === found ? prev : found))
  }, [])

  const handlePointerLeave = useCallback(() => setHoveredIndex(null), [])

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {decoImages.map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl bg-[#161616]"
            style={{ aspectRatio: '1' }}
          >
            <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover object-center" loading="lazy" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        height: CONTAINER_H + 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        cursor: 'default',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: CONTAINER_W,
          height: CONTAINER_H,
          flexShrink: 0,
          overflow: 'visible',
        }}
      >
        {decoImages.map((src, i) => (
          <ArcCard
            key={i}
            image={src}
            index={i}
            isHovered={hoveredIndex === i}
            setRef={cardRefSetters.current[i]}
          />
        ))}
      </div>
    </div>
  )
}
