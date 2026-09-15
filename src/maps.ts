import type { Area } from './areas.ts'

export function mapsSearchUrl(name: string, area: Area): string {
  const query = area.query ? `${name} ${area.query}` : name
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query)
}

export function grabSearchUrl(name: string, area: Area): string {
  const query = area.query ? `${name} ${area.query}` : name
  return 'https://food.grab.com/vn/vi/restaurants?search=' + encodeURIComponent(query)
}

function shopeeCity(area: Area): string {
  if (area.id.startsWith('hn-')) return 'ha-noi'
  if (area.id.startsWith('dn-')) return 'da-nang'
  return 'ho-chi-minh'
}

export function shopeeSearchUrl(name: string, area: Area): string {
  return `https://shopeefood.vn/${shopeeCity(area)}/food?q=` + encodeURIComponent(name)
}
