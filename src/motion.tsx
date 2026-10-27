import { useRef, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from 'react'

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || reduced()) return
    const box = el.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width - 0.5
    const py = (event.clientY - box.top) / box.height - 0.5
    el.style.transform = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div className={className ? `tilt ${className}` : 'tilt'} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="tilt-face" ref={ref}>
        {children}
      </div>
    </div>
  )
}

export function MagnetButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null)

  function onMove(event: PointerEvent<HTMLButtonElement>) {
    const el = ref.current
    if (!el || props.disabled || reduced()) return
    const box = el.getBoundingClientRect()
    const x = event.clientX - (box.left + box.width / 2)
    const y = event.clientY - (box.top + box.height / 2)
    el.style.transform = `translate(${(x * 0.22).toFixed(1)}px, ${(y * 0.28).toFixed(1)}px)`
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <button
      {...props}
      ref={ref}
      className={className ? `magnet ${className}` : 'magnet'}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </button>
  )
}
