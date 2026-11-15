import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Đăng ký plugin ScrollTrigger của GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Khởi tạo toàn bộ GSAP ScrollTrigger và Micro-animations cho Landing Page
 */
export function initGsapAnimations(): () => void {
  if (typeof window === 'undefined') return () => {}

  // Kiểm tra giảm chuyển động của người dùng
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const ctx = gsap.context(() => {
    // 1. Bento Features Cards: Stagger Reveal từ dưới lên với độ nảy nhẹ
    const bentoCards = document.querySelectorAll('.bento-card')
    if (bentoCards.length > 0) {
      gsap.fromTo(
        bentoCards,
        {
          opacity: 0,
          y: 35,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.bento-features-section',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    // 2. Process Steps Cards: Stagger Flow
    const stepCards = document.querySelectorAll('.step-card')
    if (stepCards.length > 0) {
      gsap.fromTo(
        stepCards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.landing-steps-section',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    // 3. Final CTA Banner: Scale-in mềm mại
    const ctaCard = document.querySelector('.landing-cta-card')
    if (ctaCard) {
      gsap.fromTo(
        ctaCard,
        {
          opacity: 0,
          y: 40,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.landing-cta-section',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    // 4. Hero 3D Mockup Cards: Idle Floating Animation (Nhịp thở 3D nhẹ)
    const floatCards = document.querySelectorAll('.hero-preview-cards .floating-card')
    floatCards.forEach((card, index) => {
      const delay = index * 0.4
      const duration = 3.6 + index * 0.4
      gsap.to(card, {
        y: '-=8',
        rotateZ: index % 2 === 0 ? '+=0.8' : '-=0.8',
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay,
      })
    })
  })

  return () => ctx.revert()
}

/**
 * Hiệu ứng Spring Physics khi lật thẻ quẻ hoặc click món ăn
 */
export function playSpringPop(element: HTMLElement | null) {
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  gsap.fromTo(
    element,
    { scale: 0.94 },
    {
      scale: 1,
      duration: 0.5,
      ease: 'back.out(2)',
    }
  )
}
