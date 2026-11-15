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
  const isVi = lang === 'vi'
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
        className="dialog mine-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header Modal Sang Trọng */}
        <div className="mine-modal-header">
          <div className="mine-header-info">
            <div className="mine-brand-badge">
              <span className="badge-icon">🍱</span>
              <span className="badge-text">
                {isVi ? `Đang kích hoạt ${enabled.length}/${CATALOG.length + custom.length} món` : `${enabled.length} dishes active`}
              </span>
            </div>
            <h2 id={titleId} className="mine-modal-title">
              {copy.mine}
            </h2>
            <p className="mine-modal-subtitle">
              {isVi
                ? 'Tùy biến danh sách quẻ trưa: bật/tắt món mặc định hoặc tự tạo món khoái khẩu của bạn.'
                : 'Customize your food pool: enable/disable built-in dishes or add your own favorites.'}
            </p>
          </div>
          <button
            type="button"
            className="mine-close-btn"
            onClick={onClose}
            aria-label={copy.close}
            title={copy.close}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="mine-segmented-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'builtIn'}
            className={tab === 'builtIn' ? 'active' : ''}
            onClick={() => setTab('builtIn')}
          >
            <span className="tab-icon">🍜</span>
            <span>{copy.catalogTab}</span>
            <span className="tab-count-pill">{CATALOG.length - disabled.length}/{CATALOG.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'custom'}
            className={tab === 'custom' ? 'active' : ''}
            onClick={() => setTab('custom')}
          >
            <span className="tab-icon">✍️</span>
            <span>{copy.customTab}</span>
            <span className="tab-count-pill">{custom.length}/50</span>
          </button>
        </div>

        {/* Tab 1: Danh sách món có sẵn */}
        {tab === 'builtIn' ? (
          <div className="mine-body-container">
            {/* Search Box Viên Thuốc */}
            <div className="mine-search-wrapper">
              <svg className="mine-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="6" />
                <path d="M13.5 13.5L18 18" />
              </svg>
              <input
                id={searchId}
                ref={firstField}
                value={search}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                onChange={(event) => setSearch(event.target.value)}
                placeholder={isVi ? 'Tìm nhanh trong 77 món ăn...' : copy.findBuiltin}
                className="mine-search-field"
              />
              {search && (
                <button
                  type="button"
                  className="mine-search-clear-btn"
                  onClick={() => setSearch('')}
                  aria-label="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* List Món Ăn Có Thumbnail & Switch Cam */}
            <ul className="mine-dish-scroll-list">
              {shown.map((dish) => {
                const on = !disabled.includes(dish.id)
                const lastOn = on && enabled.length === 1
                return (
                  <li key={dish.id} className="mine-dish-item">
                    <label className={on ? 'mine-dish-row active' : 'mine-dish-row disabled'}>
                      <div className="mine-dish-thumb-frame">
                        {dish.image ? (
                          <img className="mine-dish-thumb" src={dish.image} alt={dishName(dish, lang)} loading="lazy" />
                        ) : (
                          <div className="mine-dish-thumb-gap" />
                        )}
                        {dish.veg && <span className="mine-veg-dot-badge" title={copy.veg} />}
                      </div>

                      <div className="mine-dish-details">
                        <div className="mine-dish-name-row">
                          <strong className="mine-dish-name">{dishName(dish, lang)}</strong>
                          <span className="mine-dish-price-pill">{dish.price}.000đ</span>
                        </div>
                        <div className="mine-dish-tags">
                          <span className="tag-item">{typeLabel(dish.type, lang)}</span>
                          {dish.region && (
                            <>
                              <span className="tag-dot">·</span>
                              <span className="tag-item">{regionLabel(dish.region, lang)}</span>
                            </>
                          )}
                          <span className="tag-dot">·</span>
                          <span className="tag-item">{cuisineLabel(dish.cuisine, lang)}</span>
                        </div>
                      </div>

                      <div className="mine-switch-wrapper">
                        <input
                          type="checkbox"
                          checked={on}
                          disabled={lastOn}
                          onChange={() => onToggleBuiltin(dish.id)}
                          className="mine-toggle-input"
                        />
                        <span className="mine-toggle-switch" aria-hidden="true" />
                      </div>
                    </label>
                  </li>
                )
              })}
            </ul>
            {shown.length === 0 && (
              <div className="mine-empty-state">
                <span className="empty-icon">🔍</span>
                <p>{copy.empty}</p>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Thêm món ăn tùy chỉnh */
          <div className="mine-body-container">
            <div className="mine-custom-form-card">
              <h3 className="custom-form-heading">
                {editing ? (isVi ? 'Chỉnh sửa món ăn' : copy.updateDish) : (isVi ? 'Thêm món ăn mới' : copy.addDish)}
              </h3>

              <div className="mine-form-grid">
                {/* Tên món */}
                <div className="form-field-group col-span-2">
                  <label className="field-title">{copy.dishName} <span className="required-star">*</span></label>
                  <input
                    value={name}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    onChange={(event) => setName(event.target.value)}
                    maxLength={60}
                    placeholder={isVi ? 'Ví dụ: Bún đậu mắm tôm, Cơm rang dưa bò...' : copy.dishName}
                    className="mine-input-control"
                  />
                </div>

                {/* Giá tiền */}
                <div className="form-field-group">
                  <label className="field-title">{copy.dishPrice} (k) <span className="required-star">*</span></label>
                  <div className="input-with-addon">
                    <input
                      value={price}
                      inputMode="numeric"
                      spellCheck={false}
                      autoCorrect="off"
                      autoCapitalize="off"
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="45"
                      className="mine-input-control"
                    />
                    <span className="input-unit-addon">.000đ</span>
                  </div>
                </div>

                {/* Loại món */}
                <div className="form-field-group">
                  <label className="field-title">{copy.type}</label>
                  <Select
                    label={copy.type}
                    value={type}
                    options={TYPE_OPTIONS.map(([id]) => ({ id, label: typeLabel(id, lang) }))}
                    onChange={(id) => setType(id)}
                  />
                </div>

                {/* Xuất xứ */}
                <div className="form-field-group">
                  <label className="field-title">{copy.cuisine}</label>
                  <Select
                    label={copy.cuisine}
                    value={cuisine}
                    options={CUISINE_OPTIONS.map(([id]) => ({ id, label: cuisineLabel(id, lang) }))}
                    onChange={(id) => setCuisine(id)}
                  />
                </div>

                {/* Vùng miền */}
                {cuisine === 'viet' ? (
                  <div className="form-field-group">
                    <label className="field-title">{copy.region}</label>
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
                ) : (
                  <div className="form-field-group" />
                )}

                {/* Suất ăn */}
                <div className="form-field-group col-span-2">
                  <label className="field-title">{copy.meal}</label>
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

              {/* Món chay Switch */}
              <label className="mine-veg-checkbox-card">
                <input
                  type="checkbox"
                  checked={veg}
                  onChange={() => setVeg((value) => !value)}
                  className="mine-toggle-input"
                />
                <span className="mine-toggle-switch" />
                <span className="veg-label-text">
                  <span className="veg-icon">🌱</span>
                  <strong>{copy.vegDish}</strong>
                  <small className="veg-hint">{isVi ? 'Món không dùng thịt/hải sản' : 'No meat or seafood'}</small>
                </span>
              </label>

              {error && <p className="mine-error-msg">{error}</p>}

              {/* Action Buttons */}
              <div className="mine-form-actions">
                <button type="button" className="mine-primary-btn" onClick={save}>
                  <span>{editing ? copy.updateDish : copy.addDish}</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </button>
                {editing && (
                  <button type="button" className="mine-cancel-btn" onClick={resetForm}>
                    {copy.cancelEdit}
                  </button>
                )}
              </div>
            </div>

            {/* Danh sách các món do người dùng tự tạo */}
            {custom.length > 0 ? (
              <div className="mine-custom-list-block">
                <h4 className="custom-list-heading">
                  {isVi ? `Món bạn đã tạo (${custom.length})` : `Your created dishes (${custom.length})`}
                </h4>
                <ul className="mine-custom-dish-list">
                  {custom.map((dish) => {
                    const lastOn = enabled.length === 1 && enabled[0]?.id === dish.id
                    return (
                      <li key={dish.id} className={editing === dish.id ? 'custom-dish-card is-editing' : 'custom-dish-card'}>
                        <div className="custom-dish-main" onClick={() => edit(dish)} role="button" tabIndex={0}>
                          <div className="custom-dish-title-row">
                            <strong className="custom-name">{dish.name}</strong>
                            {dish.veg && <span className="custom-veg-badge">🌱 Chay</span>}
                            <span className="custom-price-tag">{dish.price}.000đ</span>
                          </div>
                          <div className="custom-dish-sub">
                            <span>{cuisineLabel(dish.cuisine, lang)}</span>
                            {dish.region && <span> · {regionLabel(dish.region, lang)}</span>}
                            <span> · {COURSE_I18N[lang][dish.course]}</span>
                          </div>
                        </div>

                        <div className="custom-dish-actions">
                          <button
                            type="button"
                            className="btn-action-edit"
                            onClick={() => edit(dish)}
                            title="Sửa món"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn-action-delete"
                            disabled={lastOn}
                            onClick={() => {
                              onRemoveCustom(dish.id)
                              if (editing === dish.id) resetForm()
                            }}
                            title="Xóa món"
                          >
                            🗑️
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : (
              <div className="mine-custom-empty">
                <span className="empty-fork-icon">🍴</span>
                <p className="empty-prompt">
                  {isVi ? 'Bạn chưa tự tạo món nào. Hãy thêm các món ăn ruột của bạn ở trên!' : 'No custom dishes yet. Add your favorite meals above!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footbar Dialog */}
        <div className="mine-modal-footbar">
          {tab === 'builtIn' ? (
            <button type="button" className="mine-btn-secondary" onClick={onEnableAll}>
              <span className="check-all-icon">✓</span>
              <span>{copy.enableAll}</span>
            </button>
          ) : (
            <span />
          )}

          {confirm ? (
            <div className="mine-confirm-panel">
              <span className="confirm-text">{copy.confirmClear}</span>
              <button
                type="button"
                className="btn-confirm-yes"
                onClick={() => {
                  onClearSaved()
                  resetForm()
                  setConfirm(false)
                }}
              >
                {copy.confirmYes}
              </button>
              <button type="button" className="btn-confirm-no" onClick={() => setConfirm(false)}>
                {copy.cancelEdit}
              </button>
            </div>
          ) : (
            <button type="button" className="mine-btn-danger" onClick={() => setConfirm(true)}>
              <span>{copy.clearSaved}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
