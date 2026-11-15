import { useEffect, useMemo, useRef, useState } from 'react'
import { AREAS } from './areas.ts'
import { Card } from './Card.tsx'
import { CATALOG } from './catalog.ts'
import { StampMany } from './Chips.tsx'
import { COURSE_I18N, LANG_LOCALE, LANG_OPTIONS, money, t } from './copy.ts'
import { modeText } from './modes.ts'
import { Donate } from './Donate.tsx'
import { Footer } from './Footer.tsx'
import { ErrorCard } from './ErrorCard.tsx'
import { eligibleDishes } from './filter.ts'
import { BowlMark, ChevronMark, CourseMark, GlobeMark, MoonMark, SunMark, VolumeMark } from './icons.tsx'
import {
  BUDGETS,
  CUISINE_OPTIONS,
  REGION_OPTIONS,
  TYPE_OPTIONS,
  cuisineLabel,
  regionLabel,
  typeLabel,
} from './labels.ts'
import { grabSearchUrl, mapsSearchUrl, shopeeSearchUrl } from './maps.ts'
import { dishName } from './names.ts'
import { MyDishes } from './MyDishes.tsx'
import { Select } from './Select.tsx'
import { MagnetButton, Tilt } from './motion.tsx'
import { fillSlots, weightedMean } from './pick.ts'
import { Scene } from './Scene.tsx'
import { LandingHeroMockups } from './LandingHeroMockups.tsx'
import { LandingFeatures } from './LandingFeatures.tsx'
import { LandingSteps } from './LandingSteps.tsx'
import { LandingCta } from './LandingCta.tsx'
import { initGsapAnimations } from './animations.ts'
import { useSpotlightGlow } from './useSpotlightGlow.ts'
import { playPick, playReveal } from './sound.ts'
import { emptyStore, parseStore, STORAGE_KEY, writeStore, type Store } from './store.ts'
import { resolveTheme } from './theme.ts'
import type { Course, Cuisine, Dish, DishType, Lang, Region } from './types.ts'

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return parseStore(raw ? JSON.parse(raw) : null)
  } catch {
    return emptyStore()
  }
}

function toggle<T>(list: readonly T[], item: T): T[] {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item]
}

function emptyLots(): (Dish | null)[] {
  return [null, null, null, null, null]
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function LangPick({
  lang,
  label,
  onChange,
}: {
  lang: Lang
  label: string
  onChange: (lang: Lang) => void
}) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const current = LANG_OPTIONS.find((item) => item.id === lang) ?? LANG_OPTIONS[0]!

  useEffect(() => {
    if (!open) return
    const onDoc = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="lang-select-wrap lang-pick" ref={box}>
      <button
        type="button"
        className={open ? 'lang-btn lang-trigger is-open' : 'lang-btn lang-trigger'}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeMark />
        <span>{current.label}</span>
        <ChevronMark />
      </button>
      {open ? (
        <ul className="lang-menu" role="listbox" aria-label={label}>
          {LANG_OPTIONS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={item.id === lang}
                className={item.id === lang ? 'lang-option is-selected' : 'lang-option'}
                onClick={() => {
                  onChange(item.id)
                  setOpen(false)
                }}
              >
                <span>{item.label}</span>
                {item.id === lang ? (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="menu-check">
                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                  </svg>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function App() {
  const [store, setStore] = useState(loadStore)
  const [storageError, setStorageError] = useState('')
  const [shown, setShown] = useState<Dish | null>(null)
  const [busy, setBusy] = useState(false)
  const [mineOpen, setMineOpen] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [more, setMore] = useState(false)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [prefersDark, setPrefersDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [spendDraft, setSpendDraft] = useState(String(store.filters.budget ?? 50))
  const [slot, setSlot] = useState<number | null>(null)
  const [lots, setLots] = useState<(Dish | null)[]>(emptyLots)
  const [lotsDealt, setLotsDealt] = useState(false)
  const [albumOpen, setAlbumOpen] = useState(false)
  const cancel = useRef(0)
  const copy = t(store.lang)
  const mode = modeText(store.mode, store.lang)
  const resolvedTheme = resolveTheme(store.ui.theme, prefersDark)

  const pool = useMemo(() => [...CATALOG, ...store.custom], [store.custom])
  const eligible = useMemo(
    () => eligibleDishes(pool, store.disabled, store.filters),
    [pool, store.disabled, store.filters],
  )
  const area = AREAS.find((item) => item.id === store.area) ?? AREAS[0]!
  const result = eligible.find((dish) => dish.id === store.lastId) ?? null
  const empty = eligible.length === 0
  const inventory = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('vi')
    const rows = [...eligible].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    return q ? rows.filter((dish) => dish.name.toLocaleLowerCase('vi').includes(q)) : rows
  }, [eligible, query])
  const live = busy ? shown : result
  const seenCount = store.seen.filter((id) => pool.some((dish) => dish.id === id)).length
  const boardText = empty
    ? copy.empty
    : busy
      ? mode.picking
      : lotsDealt && slot == null
        ? mode.dealt
        : live
          ? dishName(live, store.lang)
          : mode.idle
  const album = store.seen
    .map((id) => pool.find((dish) => dish.id === id))
    .filter((dish): dish is Dish => Boolean(dish))
  const target = store.filters.budget ?? 50
  const draftSpend = Number(spendDraft)
  const customValid =
    !store.spendCustom || (Number.isInteger(draftSpend) && draftSpend >= 30 && draftSpend <= 180)
  const mean = eligible.length ? weightedMean(eligible, target) : 0
  const budgetSelect = store.spendCustom ? 'custom' : store.filters.budget == null ? '' : String(store.filters.budget)
  const listed = more ? inventory : inventory.slice(0, 24)
  const recent = store.recent
    .map((id) => pool.find((dish) => dish.id === id))
    .filter((dish): dish is Dish => Boolean(dish))

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setPrefersDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.lang = store.lang
    document.documentElement.dataset.theme = resolvedTheme
    document.title = copy.brand
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', resolvedTheme === 'dark' ? '#1c212b' : '#f4f6f8')
  }, [store.lang, resolvedTheme, copy.brand])

  useEffect(() => {
    document.getElementById('boot-loader')?.classList.add('boot-loader-hidden')
    return () => cancelAnimationFrame(cancel.current)
  }, [])

  const [scrollProgress, setScrollProgress] = useState(0)

  // Bật chuột bắt sáng (Pointer Spotlight Hairline) theo kiểu Linear/Raycast
  useSpotlightGlow('.food-card, .bento-card, .landing-cta-card, .step-card')

  // Khởi tạo GSAP ScrollTrigger & Micro-animations
  useEffect(() => {
    const cleanup = initGsapAnimations()
    return () => cleanup()
  }, [])

  // Theo dõi cuộn trang để cập nhật hairline progress trên Capsule Dock
  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100))
        setScrollProgress(percent)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const eligibleKey = eligible.map((dish) => dish.id).join(',')
  useEffect(() => {
    setLots(emptyLots())
    setLotsDealt(false)
    setSlot(null)
  }, [eligibleKey])

  function commit(next: Store) {
    setStore(next)
    const written = writeStore(next, localStorage)
    setStorageError(written.ok ? '' : written.message)
  }

  function finishPick(winner: Dish) {
    setShown(winner)
    setBusy(false)
    setCopied(false)
    setCopyError(false)
    setReveal(true)
    if (store.sound) playReveal()
    const recent = [winner.id, ...store.recent.filter((id) => id !== winner.id)].slice(0, 8)
    const seen = store.seen.includes(winner.id) ? store.seen : [winner.id, ...store.seen].slice(0, 200)
    commit({ ...store, lastId: winner.id, picks: store.picks + 1, recent, seen })
  }

  function shuffleDishes(winner: Dish, list: Dish[]) {
    if (prefersReducedMotion() || list.length === 1) {
      finishPick(winner)
      return
    }
    const ticks = 8 + Math.floor(Math.random() * 5)
    const duration = 900 + Math.floor(Math.random() * 301)
    const started = performance.now()
    const others = list.filter((dish) => dish.id !== winner.id)
    const cycle = others.length ? others : list
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - (1 - progress) * (1 - progress)
      const step = Math.min(ticks - 1, Math.floor(eased * ticks))
      if (progress >= 1 || step === ticks - 1) {
        finishPick(winner)
        return
      }
      setShown(cycle[step % cycle.length] ?? winner)
      cancel.current = requestAnimationFrame(tick)
    }
    cancel.current = requestAnimationFrame(tick)
  }

  function beginShuffle(winner: Dish, list: Dish[]) {
    setBusy(true)
    setReveal(false)
    setShown(list.find((dish) => dish.id !== winner.id) ?? winner)
    shuffleDishes(winner, list)
  }

  function dealLots() {
    if (busy || empty || !customValid) return
    if (store.sound) playPick()
    setLots(fillSlots(eligible, 5, Math.random, store.seen))
    setLotsDealt(true)
    setSlot(null)
    setShown(null)
    setReveal(false)
  }

  function revealLot(index: number, dealt: (Dish | null)[] = lots) {
    const dish = dealt[index]
    if (!dish || busy) return
    setSlot(index)
    if (store.sound) playPick()
    beginShuffle(
      dish,
      dealt.filter((item): item is Dish => Boolean(item)),
    )
  }

  function pick() {
    if (busy || empty || !customValid) return
    if (!lotsDealt) {
      dealLots()
      return
    }
    if (slot == null) {
      revealLot(Math.floor(Math.random() * 5))
      return
    }
    dealLots()
  }

  function pickFromSlot(index: number) {
    if (busy || empty || !customValid) return
    if (!lotsDealt) {
      const dealt = fillSlots(eligible, 5, Math.random, store.seen)
      setLots(dealt)
      setLotsDealt(true)
      revealLot(index, dealt)
      return
    }
    if (slot != null) return
    revealLot(index)
  }

  function pickOne(dish: Dish) {
    if (busy || !eligible.some((item) => item.id === dish.id)) return
    if (store.sound) playPick()
    finishPick(dish)
  }

  function hideDish(id: string) {
    const next = toggle(store.disabled, id)
    const remain = eligibleDishes(pool, next, { types: [], cuisines: [], regions: [] })
    if (remain.length === 0) return
    commit({ ...store, disabled: next, lastId: store.lastId === id ? null : store.lastId })
  }

  function setLang(lang: Lang) {
    document.documentElement.lang = lang
    commit({ ...store, lang })
  }

  function toggleBuiltin(id: string) {
    const next = toggle(store.disabled, id)
    const remain = eligibleDishes(pool, next, { types: [], cuisines: [], regions: [] })
    if (remain.length === 0) return
    commit({ ...store, disabled: next, lastId: store.lastId === id ? null : store.lastId })
  }

  function enableAll() {
    commit({ ...store, disabled: [] })
  }

  function clearSaved() {
    commit({
      ...store,
      custom: [],
      disabled: [],
      lastId: store.lastId && CATALOG.some((dish) => dish.id === store.lastId) ? store.lastId : null,
      recent: store.recent.filter((id) => CATALOG.some((dish) => dish.id === id)),
    })
  }

  function addCustom(dish: Dish) {
    commit({ ...store, custom: [...store.custom, dish] })
  }

  function updateCustom(dish: Dish) {
    commit({
      ...store,
      custom: store.custom.map((item) => (item.id === dish.id ? dish : item)),
    })
  }

  function removeCustom(id: string) {
    const nextCustom = store.custom.filter((dish) => dish.id !== id)
    const remain = eligibleDishes([...CATALOG, ...nextCustom], store.disabled, {
      types: [],
      cuisines: [],
      regions: [],
    })
    if (remain.length === 0) return
    commit({
      ...store,
      custom: nextCustom,
      lastId: store.lastId === id ? null : store.lastId,
      recent: store.recent.filter((item) => item !== id),
    })
  }

  return (
    <div className="site" data-mode={store.mode}>
      <div className="exhibition-ambient-spotlight" />
      <div className="exhibition-grain" />

      {/* Floating Capsule Dock */}
      <header className="gallery-dock">
        <div className="dock-inner">
          <div
            className="dock-scroll-hairline"
            style={{ width: `${scrollProgress}%` }}
            aria-hidden="true"
          />
          <a className="brand" href="#chon">
            <BowlMark />
            <span className="brand-copy">
              <span className="brand-name">{copy.brand}</span>
              <small className="brand-kicker">{copy.tag}</small>
            </span>
          </a>

          <nav className="dock-nav-links">
            <a className="dock-nav-item" href="#chon">
              {mode.title}
            </a>
            <a className="dock-nav-item" href="#tinh-nang">
              {copy.featuresTitle}
            </a>
            <a className="dock-nav-item" href="#bo-loc">
              {copy.step1}
            </a>
            <a className="dock-nav-item" href="#quy-trinh">
              {store.lang === 'vi' ? 'Quy trình' : 'Steps'}
            </a>
            <a className="dock-nav-item" href="#kho">
              {copy.stock}
            </a>
          </nav>

          <nav className="dock-actions">
            <LangPick lang={store.lang} label={copy.language} onChange={setLang} />
            <button
              type="button"
              className="icon-btn theme-toggle-btn"
              id="btn-theme-toggle"
              aria-pressed={resolvedTheme === 'dark'}
              aria-label={resolvedTheme === 'dark' ? copy.themeLight : copy.themeDark}
              title={copy.themeToggle}
              onClick={() =>
                commit({ ...store, ui: { theme: resolvedTheme === 'dark' ? 'light' : 'dark' } })
              }
            >
              {resolvedTheme === 'dark' ? <SunMark /> : <MoonMark />}
            </button>
            <Donate label={copy.donate} hint={copy.donateHint} closeLabel={copy.close} />
            <button
              type="button"
              className="icon-btn sound-toggle-btn"
              aria-pressed={store.sound}
              aria-label={store.sound ? copy.soundMute : copy.soundUnmute}
              title={store.sound ? copy.soundMute : copy.soundUnmute}
              onClick={() => commit({ ...store, sound: !store.sound })}
            >
              <VolumeMark on={store.sound} />
            </button>
            <button type="button" className="dock-pill-btn" onClick={() => setMineOpen(true)}>
              {copy.mine}
            </button>
          </nav>
        </div>
      </header>

      <div className="exhibition-room">
        <section className="hero-landing-section" id="chon" aria-live="polite">
          <div className="hero-copy-block">
            <h1 className="hero-main-title">
              {store.lang === 'vi' ? (
                <>
                  Hôm nay ăn gì?{' '}
                  <span className="hero-shimmer-wrapper">
                    <span className="hero-shimmer-text">để quẻ trưa quyết.</span>
                    <svg aria-hidden="true" viewBox="0 0 64 60" fill="none" className="hero-doodle-spark">
                      <path
                        d="M32 52 C 22 44, 7 35, 6 21 C 5 11, 14 6, 21 9 C 26 11, 30 16, 32 20 C 34 15, 39 10, 45 9 C 52 8, 59 13, 58 22 C 56 36, 41 45, 32 52 Z"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  What to eat today?{' '}
                  <span className="hero-shimmer-wrapper">
                    <span className="hero-shimmer-text">let fortune decide.</span>
                    <svg aria-hidden="true" viewBox="0 0 64 60" fill="none" className="hero-doodle-spark">
                      <path
                        d="M32 52 C 22 44, 7 35, 6 21 C 5 11, 14 6, 21 9 C 26 11, 30 16, 32 20 C 34 15, 39 10, 45 9 C 52 8, 59 13, 58 22 C 56 36, 41 45, 32 52 Z"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </>
              )}
            </h1>
            <p className="hero-sub-lede">{empty ? copy.hintEmpty : mode.lede}</p>
          </div>

          {storageError ? (
            <ErrorCard
              title={copy.errorStorageTitle}
              message={storageError}
              closeLabel={copy.close}
              onClose={() => setStorageError('')}
            />
          ) : null}

          {/* Central Product Showcase Stage (Surrounded by tilted floating cards) */}
          <div className="hero-stage-container">
            <div className="hero-ambient-glow" aria-hidden="true" />

            <LandingHeroMockups
              lang={store.lang}
              areaQuery={area.query ?? area.label}
              onPickThisOrThat={(dishTitle) => {
                const found = pool.find((d) => d.name === dishTitle)
                if (found) pickOne(found)
              }}
            />

            <div className="hero-board-card">
              <div className="board-card-header">
                <div className="board-title-group">
                  <p className="board-card-title">{mode.title}</p>
                  <p className="board-card-badge">
                    <span className="status-live-dot" />
                    <span>
                      {eligible.length} {copy.dishes} {copy.inStock}
                    </span>
                  </p>
                </div>
                <div className="board-header-actions">
                  <button
                    type="button"
                    className="board-sound-pill"
                    onClick={() => commit({ ...store, sound: !store.sound })}
                    title={store.sound ? copy.soundMute : copy.soundUnmute}
                  >
                    <VolumeMark on={store.sound} />
                    <span>
                      {store.sound
                        ? store.lang === 'vi'
                          ? 'Bật âm'
                          : 'Sound ON'
                        : store.lang === 'vi'
                          ? 'Tắt âm'
                          : 'Muted'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="board-display-zone">
                <p className={empty ? 'board is-empty' : 'board'}>{boardText}</p>
                <Scene
                  busy={busy}
                  disabled={busy || empty || !customValid}
                  slots={lots.map((dish, index) => ({
                    label: dish ? dishName(dish, store.lang) : String(index + 1),
                    open: lotsDealt && slot === index && !busy,
                    on: slot === index,
                  }))}
                  onSlot={pickFromSlot}
                />
              </div>

              <div className="board-card-phases">
                <div className="phases-pill-track">
                  <span className={!lotsDealt ? 'phase-step active' : 'phase-step'}>
                    1. {copy.step1}
                  </span>
                  <span className={lotsDealt && slot == null ? 'phase-step active' : 'phase-step'}>
                    2. {copy.step2}
                  </span>
                  <span className={slot != null ? 'phase-step active' : 'phase-step'}>
                    3. {copy.step3}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-cta-group">
            <MagnetButton className="cta hero-main-cta" onClick={pick} disabled={busy || empty || !customValid}>
              {busy ? mode.picking : !lotsDealt ? mode.pick : slot == null ? mode.choose : mode.again}
            </MagnetButton>
            <a href="#kho" className="hero-secondary-btn">
              <span className="pulse-dot-green" />
              <span>{copy.stock} ({eligible.length})</span>
            </a>
          </div>

          <div className="hero-microcopy">
            <button type="button" className="seen-pill" onClick={() => setAlbumOpen(true)}>
              {mode.collection} {seenCount}/{pool.length}
            </button>
            <span className="micro-divider">·</span>
            <span>
              {mode.opens} <strong>{store.picks.toLocaleString(LANG_LOCALE[store.lang])}</strong>
            </span>
            <span className="micro-divider">·</span>
            <span>{store.lang === 'vi' ? 'Lưu trên trình duyệt này' : 'Saved on this browser'}</span>
          </div>
        </section>

        {/* 5-Column Bento Features Grid */}
        <LandingFeatures lang={store.lang} />

        {/* Tactile Control Console (Bộ điều khiển cơ khí chìm) */}
        <section className="tactile-console" id="bo-loc">
          <div className="console-panel">
            <div className="console-panel-header">
              <span className="console-panel-title">{copy.step1}</span>
              <label className="console-veg-switch">
                <input
                  type="checkbox"
                  checked={Boolean(store.filters.veg)}
                  disabled={busy}
                  onChange={() => commit({ ...store, filters: { ...store.filters, veg: !store.filters.veg } })}
                />
                <span className="switch-slider" />
                <span className="switch-text">{copy.vegOnly}</span>
              </label>
            </div>

            {/* Course Row - Bữa ăn */}
            <div className="console-course-row" role="group" aria-label={copy.meal}>
              {(['chinh', 'vat', 'uong', 'nhau'] as Course[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={store.filters.course === id}
                  className={store.filters.course === id ? 'console-course-btn on' : 'console-course-btn'}
                  disabled={busy}
                  onClick={() =>
                    commit({
                      ...store,
                      filters: { ...store.filters, course: store.filters.course === id ? null : id },
                    })
                  }
                >
                  <CourseMark id={id} />
                  <span>{COURSE_I18N[store.lang][id]}</span>
                </button>
              ))}
            </div>

            {/* Loại món StampMany */}
            <div className="console-field-block">
              <StampMany
                label={copy.type}
                large
                options={TYPE_OPTIONS.map(([id]) => ({ id, label: typeLabel(id, store.lang) }))}
                value={store.filters.types}
                onToggle={(id: DishType) => {
                  if (busy) return
                  commit({ ...store, filters: { ...store.filters, types: toggle(store.filters.types, id) } })
                }}
              />
            </div>

            {/* Open Row: Khu vực & Ngân sách */}
            <div className={store.spendCustom ? 'console-open-row has-custom' : 'console-open-row'}>
              <div className="place-selector-dial">
                <span className="sr">{copy.around}</span>
                <Select
                  label={copy.around}
                  value={store.area}
                  disabled={busy}
                  options={AREAS.map((item) => ({ id: item.id, label: item.query ?? item.label }))}
                  onChange={(id) => commit({ ...store, area: id })}
                />
              </div>

              <div className="budget-selector-dial">
                <span className="sr">{copy.budget}</span>
                <Select
                  label={copy.budget}
                  value={budgetSelect}
                  disabled={busy}
                  options={[
                    { id: '', label: copy.anyBudget },
                    ...BUDGETS.map((n) => ({ id: String(n), label: `${n}k` })),
                    { id: 'custom', label: copy.customBudget },
                  ]}
                  onChange={(value) => {
                    if (value === 'custom') {
                      const next = store.filters.budget ?? 50
                      setSpendDraft(String(next))
                      commit({
                        ...store,
                        spendCustom: true,
                        filters: { ...store.filters, budget: next },
                      })
                      return
                    }
                    commit({
                      ...store,
                      spendCustom: false,
                      filters: {
                        ...store.filters,
                        budget: value ? Number(value) : null,
                      },
                    })
                  }}
                />
              </div>

              {store.spendCustom && (
                <label className="budget-custom-input">
                  <span className="sr">{copy.customSpend}</span>
                  <input
                    inputMode="numeric"
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    disabled={busy}
                    value={spendDraft}
                    aria-label={copy.customSpend}
                    onChange={(event) => {
                      const raw = event.target.value
                      setSpendDraft(raw)
                      const next = Number(raw)
                      if (Number.isInteger(next) && next >= 30 && next <= 180) {
                        commit({ ...store, spendCustom: true, filters: { ...store.filters, budget: next } })
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {store.spendCustom && !customValid && <p className="spend-error">{copy.spendError}</p>}

            {/* Xuất xứ & Vùng miền */}
            <div className="console-control-row">
              <StampMany
                label={copy.cuisine}
                options={CUISINE_OPTIONS.map(([id]) => ({ id, label: cuisineLabel(id, store.lang) }))}
                value={store.filters.cuisines}
                onToggle={(id: Cuisine) => {
                  if (busy) return
                  commit({
                    ...store,
                    filters: { ...store.filters, cuisines: toggle(store.filters.cuisines, id) },
                  })
                }}
              />
              <StampMany
                label={copy.region}
                options={REGION_OPTIONS.map(([id]) => ({ id, label: regionLabel(id, store.lang) }))}
                value={store.filters.regions}
                onToggle={(id: Region) => {
                  if (busy) return
                  commit({
                    ...store,
                    filters: { ...store.filters, regions: toggle(store.filters.regions, id) },
                  })
                }}
              />
            </div>

            <p className="console-hint">
              {area.query ? `${copy.around} ${area.query}.` : copy.nearby}
              {eligible.length > 0 && Math.abs(mean - target) > 0.5
                ? ` ${copy.meanHint}: ~${Math.round(mean)}k.`
                : ''}
            </p>
          </div>
        </section>

        {recent.length > 0 && (
          <div className="history-drawer">
            <span className="history-label">{copy.recent}:</span>
            <div className="history-pills">
              {recent.map((dish) => (
                <button key={dish.id} type="button" className="history-pill" onClick={() => pickOne(dish)}>
                  {dishName(dish, store.lang)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4-Step Process Flow with Curved SVG Arrows */}
        <LandingSteps lang={store.lang} />
      </div>

      {/* Museum Archive Drawer (Kho Lưu Trữ Ẩm Thực) */}
      <section className="museum-archive" id="kho">
        <div className="archive-inner">
          <div className="archive-heading">
            <div className="archive-title-group">
              <span className="archive-kicker">{store.lang === 'vi' ? 'Bảo tàng hương vị' : 'Culinary Archive'}</span>
              <h2 className="archive-title">{mode.catalog}</h2>
              <p className="archive-subtitle">
                {store.lang === 'vi'
                  ? `Khám phá ${inventory.length} món ngon truyền thống chọn lọc từ khắp ba miền.`
                  : `Explore ${inventory.length} classic Vietnamese & regional dishes.`}
              </p>
            </div>
            <div className="archive-controls">
              <label className="archive-search">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                  <circle cx="9" cy="9" r="6" />
                  <path d="M13.5 13.5L18 18" />
                </svg>
                <input
                  value={query}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={store.lang === 'vi' ? 'Tìm tên món, bún, cơm, phở...' : copy.search}
                />
              </label>
              <div className="archive-count-pill">
                <span>{listed.length} / {inventory.length}</span>
              </div>
            </div>
          </div>

          <div className="catalog-grid">
            {listed.map((dish) => (
              <Card
                key={dish.id}
                dish={dish}
                lang={store.lang}
                onPick={pickOne}
                onHide={dish.builtin ? hideDish : undefined}
              />
            ))}
          </div>

          {inventory.length > 24 && (
            <div className="archive-more-wrap">
              <button type="button" className="archive-more-btn" onClick={() => setMore((value) => !value)}>
                <span>{more ? copy.less : copy.more}</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={more ? 'more-chevron rotate' : 'more-chevron'}
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Final Landing CTA Banner */}
      <LandingCta lang={store.lang} onPickNow={pick} />

      {/* Footer */}
      <Footer brand={copy.brand} lang={store.lang} onOpenMine={() => setMineOpen(true)} />

      {/* Winner Ceremonial Plaque */}
      {reveal && result && (
        <div
          className="winner-back"
          onClick={() => {
            setReveal(false)
            setCopied(false)
            setCopyError(false)
          }}
        >
          <Tilt className="winner-tilt">
          <div
            className="winner"
            role="dialog"
            aria-modal="true"
            aria-labelledby="winner-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="winner-gilded-rim" />
            <p className="eyebrow">{mode.kicker}</p>
            <h2 id="winner-title">{dishName(result, store.lang)}</h2>
            <p className="winner-price">
              {copy.typical} · {money(result.price, store.lang)} {copy.perPerson}
            </p>
            {result.image ? <img src={result.image} alt="" /> : <div className="food-gap" />}
            <div className="winner-actions">
              <a
                className="maps"
                href={mapsSearchUrl(result.name, area)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.maps}
              </a>
              <a
                className="maps"
                href={grabSearchUrl(result.name, area)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.grab}
              </a>
              <a
                className="maps"
                href={shopeeSearchUrl(result.name, area)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.shopee}
              </a>
              <button
                type="button"
                className="ghost"
                onClick={async () => {
                  const line =
                    store.lang === 'vi'
                      ? `Hôm nay ăn ${result.name}.`
                      : `Today’s dish is ${dishName(result, 'en')}.`
                  try {
                    await navigator.clipboard.writeText(line)
                    setCopied(true)
                    setCopyError(false)
                    window.setTimeout(() => setCopied(false), 1500)
                  } catch {
                    setCopied(false)
                    setCopyError(true)
                  }
                }}
              >
                {copied ? copy.copied : copy.copyResult}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setReveal(false)
                  setCopied(false)
                  setCopyError(false)
                }}
              >
                {copy.close}
              </button>
            </div>
            {copied && <p className="winner-feedback">{copy.copied}</p>}
            {copyError ? (
              <ErrorCard
                title={copy.errorCopyTitle}
                message={copy.errorCopyBody}
                closeLabel={copy.close}
                onClose={() => setCopyError(false)}
              />
            ) : null}
          </div>
          </Tilt>
        </div>
      )}

      {albumOpen && (
        <div className="winner-back" onClick={() => setAlbumOpen(false)}>
          <div
            className="winner album"
            role="dialog"
            aria-modal="true"
            aria-labelledby="album-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">{mode.collection}</p>
            <h2 id="album-title">
              {store.seen.length}/{pool.length}
            </h2>
            {album.length === 0 ? (
              <p>{copy.albumEmpty}</p>
            ) : (
              <ul className="album-list">
                {album.map((dish) => (
                  <li key={dish.id}>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        setAlbumOpen(false)
                        pickOne(dish)
                      }}
                    >
                      {dishName(dish, store.lang)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="ghost" onClick={() => setAlbumOpen(false)}>
              {copy.close}
            </button>
          </div>
        </div>
      )}

      <MyDishes
        open={mineOpen}
        lang={store.lang}
        onClose={() => setMineOpen(false)}
        disabled={store.disabled}
        custom={store.custom}
        onToggleBuiltin={toggleBuiltin}
        onEnableAll={enableAll}
        onClearSaved={clearSaved}
        onAddCustom={addCustom}
        onUpdateCustom={updateCustom}
        onRemoveCustom={removeCustom}
      />
    </div>
  )
}
