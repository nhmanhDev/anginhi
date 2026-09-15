let ctx: AudioContext | null = null

function context() {
  ctx ??= new AudioContext()
  return ctx
}

function tone(freq: number, start: number, length: number, gain = 0.04) {
  const audio = context()
  const osc = audio.createOscillator()
  const amp = audio.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  amp.gain.setValueAtTime(gain, audio.currentTime + start)
  amp.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + length)
  osc.connect(amp)
  amp.connect(audio.destination)
  osc.start(audio.currentTime + start)
  osc.stop(audio.currentTime + start + length + 0.02)
}

export function playPick() {
  try {
    void context().resume()
    tone(420, 0, 0.08)
    tone(560, 0.07, 0.1)
  } catch {
    /* ignore */
  }
}

export function playReveal() {
  try {
    void context().resume()
    tone(520, 0, 0.12, 0.05)
    tone(780, 0.1, 0.16, 0.045)
  } catch {
    /* ignore */
  }
}
