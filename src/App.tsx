import { useEffect, useMemo, useRef, useState } from 'react'
import { AREAS } from './areas.ts'
import { Card } from './Card.tsx'
import { CATALOG } from './catalog.ts'
import { StampMany } from './Chips.tsx'
import { COURSE_I18N, LANG_LOCALE, LANG_OPTIONS, THEME_I18N, THEMES, money, t } from './copy.ts'
import { modeText } from './modes.ts'
import { Donate } from './Donate.tsx'
import { ErrorCard } from './ErrorCard.tsx'
import { eligibleDishes } from './filter.ts'
import { BowlMark, ChevronMark, CourseMark, GlobeMark, MoonMark, SunMark, ThemeMark, VolumeMark } from './icons.tsx'
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
import { fillSlots, pickUnseen, pickWeighted, weightedMean } from './pick.ts'
import { Scene } from './Scene.tsx'
import { playPick, playReveal } from './sound.ts'
import { emptyStore, parseStore, STORAGE_KEY, writeStore, type Store } from './store.ts'
import { resolveTheme } from './theme.ts'
import type { Course, Cuisine, Dish, DishType, Lang, Region, ThemeId } from './types.ts'

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
    <div className="lang-pick" ref={box}>
      <button
        type="button"
        className="lang-trigger"
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
                onClick={() => {
                  onChange(item.id)
                  setOpen(false)
                }}
              >
                {item.label}
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
  const placeBox = useRef<HTMLDetailsElement>(null)
  const cancel = useRef(0)
  const think = useRef(0)
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
  const boardText = empty
    ? copy.empty
    : busy && !shown
      ? mode.picking
      : store.mode === 'que' && lotsDealt && slot == null
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
    if (meta) meta.setAttribute('content', resolvedTheme === 'dark' ? '#0f141c' : '#f2f0e7')
  }, [store.lang, resolvedTheme, copy.brand])

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('mode')
    if (!raw || !THEMES.includes(raw as ThemeId)) return
    setStore((current) => {
      if (current.mode === raw) return current
      const next = { ...current, mode: raw as ThemeId }
      writeStore(next, localStorage)
      return next
    })
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(cancel.current)
      window.clearTimeout(think.current)
    }
  }, [])

  const eligibleKey = eligible.map((dish) => dish.id).join(',')
  useEffect(() => {
    setLots(emptyLots())
    setLotsDealt(false)
    setSlot(null)
  }, [eligibleKey, store.mode])

  function commit(next: Store) {
    setStore(next)
    const written = writeStore(next, localStorage)
    setStorageError(written.ok ? '' : written.message)
  }

  function finishPick(winner: Dish) {
    setShown(winner)
    setBusy(false)
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
    window.clearTimeout(think.current)
    setBusy(true)
    setReveal(false)
    if (store.mode === 'meo' && !prefersReducedMotion() && list.length > 1) {
      setShown(null)
      think.current = window.setTimeout(() => shuffleDishes(winner, list), 700)
      return
    }
    setShown(list.find((dish) => dish.id !== winner.id) ?? winner)
    shuffleDishes(winner, list)
  }

  function runPick(unseen = false) {
    if (busy || empty || !customValid) return
    if (store.sound) playPick()
    const winner = unseen ? pickUnseen(eligible, store.seen, target) : pickWeighted(eligible, target)
    beginShuffle(winner, eligible)
  }

  function dealLots() {
    if (busy || empty || !customValid) return
    if (store.sound) playPick()
    setLots(fillSlots(eligible, 5))
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
    if (store.mode === 'que') {
      if (!lotsDealt) {
        dealLots()
        return
      }
      if (slot == null) {
        revealLot(Math.floor(Math.random() * 5))
        return
      }
      dealLots()
      return
    }
    runPick(store.mode === 'duyen')
  }

  function pickFromSlot(index: number) {
    if (busy || empty || !customValid) return
    if (!lotsDealt) {
      const dealt = fillSlots(eligible, 5)
      setLots(dealt)
      setLotsDealt(true)
      revealLot(index, dealt)
      return
    }
    if (slot != null) return
    revealLot(index)
  }

  function setMode(id: ThemeId) {
    setSlot(null)
    setLots(emptyLots())
    setLotsDealt(false)
    setAlbumOpen(false)
    commit({ ...store, mode: id })
    const url = new URL(window.location.href)
    url.searchParams.set('mode', id)
    window.history.replaceState(null, '', url)
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

      {/* Floating Museum Gallery Dock */}
      <header className="gallery-dock">
        <div className="dock-inner">
          <a className="brand" href="#chon">
            <BowlMark />
            <span className="brand-copy">
              <span className="brand-name">{copy.brand}</span>
              <small className="brand-kicker">{copy.tag}</small>
            </span>
          </a>

          <nav className="dock-actions">
            <a className="dock-link" href="#kho">
              <span className="dock-link-dot" />
              {copy.stock}
            </a>
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

      {/* Central Kinetic Exhibition Chamber */}
      <div className="exhibition-room">
        {/* Plinth / Pedestal Section */}
        <section className="exhibition-plinth" id="chon" aria-live="polite">
          {/* Mode Switcher Integrated as Brass / Obsidian Recessed Keycaps */}
          <div className="console-mode-bar" role="group" aria-label={copy.modes}>
            {THEMES.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={store.mode === id}
                className={store.mode === id ? 'console-mode-key is-active' : 'console-mode-key'}
                onClick={() => setMode(id)}
              >
                <ThemeMark id={id} />
                <span className="mode-label">{THEME_I18N[id]}</span>
                <span className="key-pip" />
              </button>
            ))}
          </div>

          {/* Exhibition Plaque Header */}
          <div className="plinth-header">
            <div className="plinth-header-lead">
              <span className="plinth-badge">KINETIC ARTIFACT · NO. 0{THEMES.indexOf(store.mode) + 1}</span>
              <h1 className="plinth-title">{mode.title}</h1>
            </div>
            <p className="plinth-stats">
              <span className="stat-item">{mode.opens}: <strong>{store.picks.toLocaleString(LANG_LOCALE[store.lang])}</strong></span>
              {store.mode === 'duyen' ? (
                <span className="stat-item"> · {mode.collection}: <strong>{store.seen.length}/{pool.length}</strong></span>
              ) : null}
              {result && !busy ? (
                <span className="stat-item"> · {copy.last}: <strong>{dishName(result, store.lang)}</strong></span>
              ) : (
                <span className="stat-item"> · {copy.inStock}: <strong>{eligible.length} {copy.dishes}</strong></span>
              )}
            </p>
            {storageError ? (
              <ErrorCard
                title={copy.errorStorageTitle}
                message={storageError}
                closeLabel={copy.close}
                onClose={() => setStorageError('')}
              />
            ) : null}
          </div>

          {/* Sân khấu cỗ máy trung tâm (The Interactive Machine) */}
          <div className="kinetic-machine-housing">
            <div className="machine-glass-reflection" />
            <Scene
              mode={store.mode}
              busy={busy}
              disabled={busy || empty || !customValid}
              actLabel={busy ? mode.picking : result ? mode.again : mode.pick}
              liveName={live && !busy ? dishName(live, store.lang) : ''}
              slots={lots.map((dish, index) => ({
                label: dish ? dishName(dish, store.lang) : String(index + 1),
                open: lotsDealt && slot === index && !busy,
                on: slot === index,
              }))}
              clockLine={mode.clock}
              seenLabel={`${mode.collection} ${store.seen.length}/${pool.length}`}
              onAct={pick}
              onSlot={pickFromSlot}
              onCollection={() => setAlbumOpen(true)}
            />

            {/* Stage Output & Display Screen */}
            <div className="machine-display-pod">
              <p className="display-kicker">{mode.kicker}</p>
              <p className={empty ? 'display-dish is-empty' : 'display-dish'}>{boardText}</p>
              <p className="display-lede">{empty ? copy.hintEmpty : mode.lede}</p>

              {/* Central Physical Actuator Button */}
              <button
                type="button"
                className="hero-actuator-btn"
                onClick={pick}
                disabled={busy || empty || !customValid}
              >
                <span className="actuator-ring" />
                <span className="actuator-label">
                  {busy
                    ? mode.picking
                    : store.mode === 'que'
                      ? !lotsDealt
                        ? mode.pick
                        : slot == null
                          ? mode.choose
                          : mode.again
                      : result
                        ? mode.again
                        : mode.pick}
                </span>
                <span className="actuator-specular" />
              </button>
            </div>
          </div>

          {/* Stepper sequence */}
          <ol className="ceremonial-steps">
            <li><span className="step-num">01</span> {copy.step1}</li>
            <li><span className="step-num">02</span> {copy.step2}</li>
            <li><span className="step-num">03</span> {copy.step3}</li>
          </ol>
        </section>

        {/* Tactile Control Console (Bộ điều khiển cơ khí chìm) */}
        <section className="tactile-console">
          <div className="console-panel">
            <div className="console-panel-header">
              <span className="console-panel-title">THIẾT LẬP ĐIỀU KHIỂN CƠ HỌC</span>
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
              <details className="place-selector-dial" ref={placeBox}>
                <summary>{area.query ?? area.label}</summary>
                <ul>
                  {AREAS.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={item.id === area.id ? 'on' : undefined}
                        onClick={() => {
                          commit({ ...store, area: item.id })
                          if (placeBox.current) placeBox.current.open = false
                        }}
                      >
                        {item.query ?? item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>

              <label className="budget-selector-dial">
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
              </label>

              {store.spendCustom && (
                <label className="budget-custom-input">
                  <span className="sr">{copy.customSpend}</span>
                  <input
                    inputMode="numeric"
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
      </div>

      {/* Museum Archive Drawer (Kho Lưu Trữ Ẩm Thực) */}
      <section className="museum-archive" id="kho">
        <div className="archive-inner">
          <div className="archive-heading">
            <div className="archive-title-group">
              <span className="archive-badge">MUSEUM COLLECTION</span>
              <h2>{mode.catalog}</h2>
            </div>
            <label className="archive-search">
              <span className="sr">{copy.search}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.search}
              />
            </label>
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
            <button type="button" className="archive-more-btn" onClick={() => setMore((value) => !value)}>
              {more ? copy.less : copy.more}
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="foot">
        <span>{copy.brand}</span>
        <a className="foot-mail" href="mailto:nhmanh.dev@gmail.com">
          nhmanh.dev@gmail.com
        </a>
      </footer>

      {/* Winner Ceremonial Plaque */}
      {reveal && result && (
        <div className="winner-back" onClick={() => setReveal(false)}>
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
              <button type="button" className="secondary" onClick={() => setReveal(false)}>
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
