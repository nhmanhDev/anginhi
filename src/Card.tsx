import { money, t } from './copy.ts'
import { cuisineLabel, regionLabel, typeLabel } from './labels.ts'
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

  return (
    <article className="food-card group">
      {/* Khung ảnh món ăn với tỉ lệ 4:3 và hiệu ứng zoom mượt */}
      <div className="food-card-media" onClick={() => onPick(dish)}>
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

        {/* Nút Ẩn món dạng nút tròn kính mờ ở góc trên bên phải */}
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

        {/* Tag vùng miền nổi ở đáy ảnh */}
        {dish.region && (
          <span className="food-region-tag">
            {regionLabel(dish.region, lang)}
          </span>
        )}
      </div>

      {/* Thân thẻ thông tin chi tiết */}
      <div className="food-card-body">
        <div className="food-card-header-row">
          <h3 className="food-title" onClick={() => onPick(dish)}>
            {dishName(dish, lang)}
          </h3>
          <span className="food-price-tag">
            {money(dish.price, lang)}
          </span>
        </div>

        <div className="food-card-subinfo">
          <span className="food-cuisine-label">
            {cuisineLabel(dish.cuisine, lang)}
          </span>
          <span className="food-dot-sep">·</span>
          <span className="food-meta-sub">
            {isVi ? 'Bữa chính nhanh gọn' : 'Classic meal'}
          </span>
        </div>

        {/* Nút hành động nhanh ở chân thẻ */}
        <div className="food-card-actions">
          <button
            type="button"
            className="food-action-pick-btn"
            onClick={() => onPick(dish)}
          >
            <span>{isVi ? 'Xem & tìm quán' : 'Find spots'}</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
