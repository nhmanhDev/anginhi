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
    <article className="catalog-card">
      <button type="button" className="catalog-hit" onClick={() => onPick(dish)}>
        <div className="catalog-art">
          {dish.image ? <img src={dish.image} alt={dishName(dish, lang)} loading="lazy" /> : <div className="food-gap" />}
          <div className="catalog-art-overlay" />
          {dish.veg && <span className="veg-badge"><span className="veg-dot" />{copy.veg}</span>}
        </div>
        <div className="catalog-copy">
          <div className="catalog-meta">
            <span className="catalog-cat">{typeLabel(dish.type, lang)}</span>
            <span className="catalog-price">{money(dish.price, lang)}</span>
          </div>
          <h3 className="catalog-title">{dishName(dish, lang)}</h3>
        </div>
      </button>
      {onHide && (
        <button type="button" className="card-hide" aria-label={copy.hide} title={copy.hide} onClick={() => onHide(dish.id)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="hide-icon">
            <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" />
            <path d="M3 13L13 3" />
          </svg>
          <span className="hide-text">{copy.hide}</span>
        </button>
      )}
    </article>
  )
}
