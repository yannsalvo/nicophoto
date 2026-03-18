'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide on mobile
    if (window.matchMedia('(max-width: 768px)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
      if (!isVisible) setIsVisible(true)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-cursor="hover"]')) {
        setIsHovering(true)
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-cursor="hover"]')) {
        setIsHovering(false)
      }
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [isVisible])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out hidden md:block"
      style={{
        width: isHovering ? 48 : 12,
        height: isHovering ? 48 : 12,
        borderRadius: '50%',
        border: `1.5px solid hsl(var(--foreground))`,
        opacity: isVisible ? 1 : 0,
        transition: 'width 0.2s, height 0.2s, opacity 0.2s',
      }}
    />
  )
}
