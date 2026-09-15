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
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-head">
          <h2 id={titleId}>{copy.mine}</h2>
          <button type="button" className="text-btn" onClick={onClose}>
            {copy.close}
          </button>
        </div>

        <div className="mine-tabs" role="tablist">
          <button
            type="button"
            className={tab === 'builtIn' ? 'on' : undefined}
            onClick={() => setTab('builtIn')}
          >
            {copy.catalogTab} ({CATALOG.length - disabled.length})
          </button>
          <button
            type="button"
            className={tab === 'custom' ? 'on' : undefined}
            onClick={() => setTab('custom')}
          >
            {copy.customTab} ({custom.length}/50)
          </button>
        </div>

        {tab === 'builtIn' ? (
          <section className="dialog-catalog">
            <label className="field" htmlFor={searchId}>
              {copy.findBuiltin}
              <input
                id={searchId}
                ref={firstField}
                value={search}
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
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={lastOn}
                        onChange={() => onToggleBuiltin(dish.id)}
                      />
                      {dish.image && <img className="thumb" src={dish.image} alt="" />}
                      <span>
                        {dishName(dish, lang)}
                        {dish.veg ? ` · ${copy.veg}` : ''}
                        <small>
                          {typeLabel(dish.type, lang)}
                          {dish.region ? `, ${regionLabel(dish.region, lang)}` : ''}
                          {` · ${dish.price}k`}
                        </small>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
            <button type="button" className="text-btn" onClick={onEnableAll}>
              {copy.enableAll}
            </button>
          </section>
        ) : (
          <section className="dialog-form">
            <div className="form-grid">
              <label className="field">
                {copy.dishName}
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} />
              </label>
              <label className="field">
                {copy.dishPrice}
                <input
                  value={price}
                  inputMode="numeric"
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
              <label className="field">
                {copy.type}
                <Select
                  label={copy.type}
                  value={type}
                  options={TYPE_OPTIONS.map(([id]) => ({ id, label: typeLabel(id, lang) }))}
                  onChange={(id) => setType(id)}
                />
              </label>
              <label className="field">
                {copy.cuisine}
                <Select
                  label={copy.cuisine}
                  value={cuisine}
                  options={CUISINE_OPTIONS.map(([id]) => ({ id, label: cuisineLabel(id, lang) }))}
                  onChange={(id) => setCuisine(id)}
                />
              </label>
              {cuisine === 'viet' && (
                <label className="field">
                  {copy.region}
                  <Select
                    label={copy.region}
                    value={region ?? ''}
                    options={[
                      { id: '', label: '—' },
                      ...REGION_OPTIONS.map(([id]) => ({ id, label: regionLabel(id, lang) })),
                    ]}
                    onChange={(id) => setRegion((id || null) as Region | null)}
                  />
                </label>
              )}
              <label className="field">
                {copy.meal}
                <Select
                  label={copy.meal}
                  value={course}
                  options={(Object.keys(COURSE_I18N[lang]) as Course[]).map((id) => ({
                    id,
                    label: COURSE_I18N[lang][id],
                  }))}
                  onChange={(id) => setCourse(id)}
                />
              </label>
            </div>
            <label className="veg-toggle">
              <input type="checkbox" checked={veg} onChange={() => setVeg((value) => !value)} />
              {copy.vegDish}
            </label>
            {error && <p className="field-error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="secondary" onClick={save}>
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
                    <li key={dish.id}>
                      <button type="button" className="text-btn" onClick={() => edit(dish)}>
                        {dish.name}
                        {dish.veg ? ` · ${copy.veg}` : ''}
                        <small>
                          {' '}
                          {cuisineLabel(dish.cuisine, lang)} · {dish.price}k
                        </small>
                      </button>
                      <button
                        type="button"
                        className="text-btn"
                        disabled={lastOn}
                        onClick={() => {
                          onRemoveCustom(dish.id)
                          if (editing === dish.id) resetForm()
                        }}
                      >
                        {lang === 'vi' ? 'Xóa' : 'Remove'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}

        <p className="mine-foot">
          {enabled.length} {copy.dishes} · {copy.opens}
        </p>
        <div className="form-actions">
          <button
            type="button"
            className="text-btn"
            onClick={() => setConfirm((value) => !value)}
          >
            {copy.clearSaved}
          </button>
          {confirm && (
            <>
              <span>{copy.confirmClear}</span>
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  onClearSaved()
                  resetForm()
                  setConfirm(false)
                }}
              >
                {copy.confirmYes}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
