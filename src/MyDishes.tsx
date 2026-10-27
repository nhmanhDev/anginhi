import { useEffect, useId, useRef, useState } from 'react'
import { CATALOG } from './catalog.ts'
import { COURSE_I18N, t } from './copy.ts'
import { validateCustomInput } from './dish.ts'
import { eligibleDishes } from './filter.ts'
import { CUISINE_OPTIONS, REGION_OPTIONS, TYPE_OPTIONS, cuisineLabel, regionLabel, typeLabel } from './labels.ts'
import { dishName } from './names.ts'
import { Select } from './Select.tsx'
import type { Course, Cuisine, Dish, DishType, Lang, Region } from './types.ts'

type Props = {
  open: boolean
  lang: Lang
  onClose: () => void
  disabled: readonly string[]
  custom: readonly Dish[]
  onToggleBuiltin: (id: string) => void
  onEnableAll: () => void
  onClearSaved: () => void
  onAddCustom: (dish: Dish) => void
  onUpdateCustom: (dish: Dish) => void
  onRemoveCustom: (id: string) => void
}

const emptyFilters = { types: [], cuisines: [], regions: [] }

export function MyDishes({
  open,
  lang,
  onClose,
  disabled,
  custom,
  onToggleBuiltin,
  onEnableAll,
  onClearSaved,
  onAddCustom,
  onUpdateCustom,
  onRemoveCustom,
}: Props) {
  const copy = t(lang)
  const titleId = useId()
  const searchId = useId()
  const firstField = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'builtIn' | 'custom'>('builtIn')
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('45')
  const [veg, setVeg] = useState(false)
  const [type, setType] = useState<DishType>('com')
  const [cuisine, setCuisine] = useState<Cuisine>('viet')
  const [region, setRegion] = useState<Region | null>('nam')
  const [course, setCourse] = useState<Course>('chinh')
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    if (!open) return
    firstField.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const query = search.trim().toLocaleLowerCase('vi')
  const shown = CATALOG.filter((dish) => dishName(dish, lang).toLocaleLowerCase('vi').includes(query))
  const enabled = eligibleDishes([...CATALOG, ...custom], disabled, emptyFilters)

  function resetForm() {
    setEditing(null)
    setName('')
    setPrice('45')
    setVeg(false)
    setType('com')
    setCuisine('viet')
    setRegion('nam')
    setCourse('chinh')
    setError('')
  }

  function save() {
    const result = validateCustomInput(
      {
        name,
        type,
        cuisine,
        region: cuisine === 'viet' ? region : null,
        price: Number(price),
        veg,
        course,
      },
      editing ? custom.length - 1 : custom.length,
    )
    if (!result.ok) {
      setError(result.message)
      return
    }
    if (editing) onUpdateCustom({ ...result.dish, id: editing, builtin: false })
    else onAddCustom({ ...result.dish, id: crypto.randomUUID(), builtin: false })
    resetForm()
  }

  function edit(dish: Dish) {
    setTab('custom')
    setEditing(dish.id)
    setName(dish.name)
    setPrice(String(dish.price))
    setVeg(dish.veg)
    setType(dish.type)
    setCuisine(dish.cuisine)
    setRegion(dish.region)
    setCourse(dish.course)
    setError('')
  }

  return (
    <div className="dialog-back" onClick={onClose}>
      <div
        className="dialog mine"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-head mine-head">
          <div>
            <p className="mine-kicker">
              {enabled.length} {copy.dishes}
            </p>
            <h2 id={titleId}>{copy.mine}</h2>
          </div>
          <button
            type="button"
            className="btn-close-dialog"
            onClick={onClose}
            aria-label={copy.close}
            title={copy.close}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mine-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'builtIn'}
            className={tab === 'builtIn' ? 'on' : undefined}
            onClick={() => setTab('builtIn')}
          >
            {copy.catalogTab}
            <em>{CATALOG.length - disabled.length}</em>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'custom'}
            className={tab === 'custom' ? 'on' : undefined}
            onClick={() => setTab('custom')}
          >
            {copy.customTab}
            <em>
              {custom.length}/50
            </em>
          </button>
        </div>

        {tab === 'builtIn' ? (
          <section className="dialog-catalog">
            <label className="field" htmlFor={searchId}>
              <span className="field-label">{copy.findBuiltin}</span>
              <input
                id={searchId}
                ref={firstField}
                value={search}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                onChange={(event) => setSearch(event.target.value)}
                type="search"
              />
            </label>

            <ul className="dish-list">
              {shown.map((dish) => {
                const on = !disabled.includes(dish.id)
                const lastOn = on && enabled.length === 1
                return (
                  <li key={dish.id}>
                    <label className={on ? 'dish-row' : 'dish-row is-off'}>
                      {dish.image ? (
                        <img className="thumb" src={dish.image} alt="" />
                      ) : (
                        <span className="thumb thumb-gap" />
                      )}
                      <span className="dish-copy">
                        <strong>
                          {dishName(dish, lang)}
                          {dish.veg && <span className="veg-dot" />}
                        </strong>
                        <small>
                          {typeLabel(dish.type, lang)}
                          {dish.region ? ` · ${regionLabel(dish.region, lang)}` : ''}
                          {` · ${dish.price}k`}
                        </small>
                      </span>
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={lastOn}
                        onChange={() => onToggleBuiltin(dish.id)}
                      />
                      <span className="switch-slider" aria-hidden="true" />
                    </label>
                  </li>
                )
              })}
            </ul>
            {shown.length === 0 && <p className="mine-empty">{copy.empty}</p>}
          </section>
        ) : (
          <section className="dialog-form mine-form">
            <div className="form-grid">
              <label className="field">
                <span className="field-label">{copy.dishName}</span>
                <input
                  value={name}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  onChange={(event) => setName(event.target.value)}
                  maxLength={60}
                />
              </label>
              <label className="field">
                <span className="field-label">{copy.dishPrice}</span>
                <input
                  value={price}
                  inputMode="numeric"
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
              <div className="field">
                <span className="field-label">{copy.type}</span>
                <Select
                  label={copy.type}
                  value={type}
                  options={TYPE_OPTIONS.map(([id]) => ({ id, label: typeLabel(id, lang) }))}
                  onChange={(id) => setType(id)}
                />
              </div>
              <div className="field">
                <span className="field-label">{copy.cuisine}</span>
                <Select
                  label={copy.cuisine}
                  value={cuisine}
                  options={CUISINE_OPTIONS.map(([id]) => ({ id, label: cuisineLabel(id, lang) }))}
                  onChange={(id) => setCuisine(id)}
                />
              </div>
              {cuisine === 'viet' && (
                <div className="field">
                  <span className="field-label">{copy.region}</span>
                  <Select
                    label={copy.region}
                    value={region ?? ''}
                    options={[
                      { id: '', label: '—' },
                      ...REGION_OPTIONS.map(([id]) => ({ id, label: regionLabel(id, lang) })),
                    ]}
                    onChange={(id) => setRegion((id || null) as Region | null)}
                  />
                </div>
              )}
              <div className="field">
                <span className="field-label">{copy.meal}</span>
                <Select
                  label={copy.meal}
                  value={course}
                  options={(Object.keys(COURSE_I18N[lang]) as Course[]).map((id) => ({
                    id,
                    label: COURSE_I18N[lang][id],
                  }))}
                  onChange={(id) => setCourse(id)}
                />
              </div>
            </div>
            <label className="console-veg-switch mine-veg">
              <input type="checkbox" checked={veg} onChange={() => setVeg((value) => !value)} />
              <span className="switch-slider" />
              {copy.vegDish}
            </label>
            {error && <p className="field-error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="dock-pill-btn" onClick={save}>
                {editing ? copy.updateDish : copy.addDish}
              </button>
              {editing && (
                <button type="button" className="text-btn" onClick={resetForm}>
                  {copy.cancelEdit}
                </button>
              )}
            </div>

            {custom.length > 0 && (
              <ul className="custom-list">
                {custom.map((dish) => {
                  const lastOn = enabled.length === 1 && enabled[0]?.id === dish.id
                  return (
                    <li key={dish.id} className={editing === dish.id ? 'custom-row is-editing' : 'custom-row'}>
                      <button type="button" className="custom-main" onClick={() => edit(dish)}>
                        <strong>
                          {dish.name}
                          {dish.veg && <span className="veg-dot" />}
                        </strong>
                        <small>
                          {cuisineLabel(dish.cuisine, lang)} · {dish.price}k
                        </small>
                      </button>
                      <button
                        type="button"
                        className="mine-quiet"
                        disabled={lastOn}
                        onClick={() => {
                          onRemoveCustom(dish.id)
                          if (editing === dish.id) resetForm()
                        }}
                      >
                        {copy.removeDish}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}

        <div className="mine-footbar">
          {tab === 'builtIn' ? (
            <button type="button" className="mine-quiet" onClick={onEnableAll}>
              {copy.enableAll}
            </button>
          ) : (
            <span />
          )}
          {confirm ? (
            <div className="mine-confirm">
              <p>{copy.confirmClear}</p>
              <button
                type="button"
                className="mine-quiet mine-danger"
                onClick={() => {
                  onClearSaved()
                  resetForm()
                  setConfirm(false)
                }}
              >
                {copy.confirmYes}
              </button>
              <button type="button" className="mine-quiet" onClick={() => setConfirm(false)}>
                {copy.cancelEdit}
              </button>
            </div>
          ) : (
            <button type="button" className="mine-quiet mine-danger" onClick={() => setConfirm(true)}>
              {copy.clearSaved}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
