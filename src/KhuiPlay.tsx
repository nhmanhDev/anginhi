import { Lottie } from 'lottie-react'
import { khuiAnimation } from './khui.ts'

export function KhuiPlay() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return <span className="khui-still" aria-hidden="true" />
  return <Lottie className="khui-lottie" src={khuiAnimation} autoplay loop={false} />
}
