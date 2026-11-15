import { useEffect } from 'react'

/**
 * Hook gắn dynamic pointer spotlight cho các card hairline kiểu Linear/Raycast.
 * Tự động tính toán vị trí chuột so với từng card để tạo viền sáng bắt theo chuột.
 */
export function useSpotlightGlow(selector: string = '.food-card, .bento-card, .landing-cta-card') {
  useEffect(() => {
    // Tôn trọng prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const handlePointerMove = (e: PointerEvent) => {
      const cards = document.querySelectorAll<HTMLElement>(selector)
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Chỉ cập nhật khi chuột ở gần hoặc trong card (trong khoảng 80px)
        if (
          x >= -80 &&
          x <= rect.width + 80 &&
          y >= -80 &&
          y <= rect.height + 80
        ) {
          card.style.setProperty('--mouse-x', `${x}px`)
          card.style.setProperty('--mouse-y', `${y}px`)
          card.style.setProperty('--spotlight-opacity', '1')
        } else {
          card.style.setProperty('--spotlight-opacity', '0')
        }
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [selector])
}
