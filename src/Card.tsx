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
          {dish.image ? <img src={dish.image} alt="" /> : <div className="food-gap" />}
          {dish.veg && <span className="veg-badge">{copy.veg}</span>}
        </div>
        <div className="catalog-copy">
          <p className="catalog-cat">{typeLabel(dish.type, lang)}</p>
          <h3>{dishName(dish, lang)}</h3>
          <p className="catalog-price">{money(dish.price, lang)}</p>
        </div>
      </button>
      {onHide && (
        <button type="button" className="card-hide" onClick={() => onHide(dish.id)}>
          {copy.hide}
        </button>
      )}
    </article>
  )
}
