import { money, t } from './copy.ts'
import { COURSE_LABELS, cuisineLabel, regionLabel, typeLabel } from './labels.ts'
import { dishName } from './names.ts'
import type { Dish, Lang } from './types.ts'

type Props = {
  dish: Dish
  lang: Lang
  onPick: (dish: Dish) => void
  onHide?: (id: string) => void
}

export function Card({ dish, lang, onPick, onHide }: Props) {
  const copy = t(lang)
  const isVi = lang === 'vi'

  // Tạo chuỗi mô tả xuất xứ & bữa ăn thật sự có ý nghĩa
  const originParts: string[] = []
  if (dish.cuisine === 'viet') {
    if (dish.region) {
      originParts.push(`Món ${regionLabel(dish.region, lang)}`)
    } else {
      originParts.push('Việt Nam')
    }
  } else {
    originParts.push(cuisineLabel(dish.cuisine, lang))
  }
  originParts.push(COURSE_LABELS[dish.course] || (isVi ? 'Bữa chính' : 'Main course'))

  return (
    <article
      className="food-card group"
      onClick={() => onPick(dish)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPick(dish)
        }
      }}
      aria-label={`${dishName(dish, lang)} - ${money(dish.price, lang)}`}
    >
      {/* Khung ảnh món ăn tỉ lệ 4:3 với gradient và badges tinh xảo */}
      <div className="food-card-media">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dishName(dish, lang)}
            loading="lazy"
            className="food-card-img"
          />
        ) : (
          <div className="food-gap" />
        )}
        <div className="food-media-gradient" />

        {/* Badges nổi trên ảnh */}
        <div className="food-badges-top">
          <span className="food-type-pill">
            {typeLabel(dish.type, lang)}
          </span>
          {dish.veg && (
            <span className="veg-badge" title={copy.veg}>
              <span className="veg-dot" />
              <span>{copy.veg}</span>
            </span>
          )}
        </div>

        {/* Nút Ẩn món (hiện rõ nét hơn khi hover card) */}
        {onHide && (
          <button
            type="button"
            className="food-hide-btn"
            aria-label={copy.hide}
            title={copy.hide}
            onClick={(e) => {
              e.stopPropagation()
              onHide(dish.id)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        )}

        {/* Nhãn xem quán trượt lên khi hover */}
        <div className="food-hover-prompt">
          <span>{isVi ? 'Nhấn để tìm quán gần đây' : 'Click to find spots'}</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="prompt-arrow">
            <path d="M4 12l8-8M6 4h6v6" />
          </svg>
        </div>
      </div>

      {/* Thân thẻ thông tin tối giản, sắc sảo */}
      <div className="food-card-body">
        <div className="food-card-header-row">
          <h3 className="food-title">
            {dishName(dish, lang)}
          </h3>
          <span className="food-price-tag">
            {money(dish.price, lang)}
          </span>
        </div>

        <div className="food-card-subinfo">
          <span>{originParts.join(' · ')}</span>
        </div>
      </div>
    </article>
  )
}
