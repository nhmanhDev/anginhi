import { money, t } from './copy.ts'
import { typeLabel } from './labels.ts'
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
  return (
    <article className="food-card">
      <button
        type="button"
        className="food-img-frame"
        onClick={() => onPick(dish)}
        aria-label={dishName(dish, lang)}
      >
        {dish.image ? (
          <img src={dish.image} alt={dishName(dish, lang)} loading="lazy" />
        ) : (
          <div className="food-gap" />
        )}
        {dish.veg && (
          <span className="veg-badge">
            <span className="veg-dot" />
            {copy.veg}
          </span>
        )}
      </button>
      <div className="food-plaque-body">
        <div className="food-meta">
          <span className="food-type">{typeLabel(dish.type, lang)}</span>
          <span className="food-price">{money(dish.price, lang)}</span>
        </div>
        <button type="button" className="food-name-btn" onClick={() => onPick(dish)}>
          {dishName(dish, lang)}
        </button>
        {onHide && (
          <div className="food-card-foot">
            <button
              type="button"
              className="hide-btn"
              aria-label={copy.hide}
              title={copy.hide}
              onClick={() => onHide(dish.id)}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="hide-icon">
                <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" />
                <path d="M3 13L13 3" />
              </svg>
              <span className="hide-text">{copy.hide}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
