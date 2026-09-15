# Ăn gì nhỉ — design

> Superseded by `2026-09-15-anginhi-upgrade-design.md` (2026-09-15). Giữ để tham chiếu lịch sử; code hiện tại không còn theo spec này.

Public one-page site. One job: pick a dish. No accounts, no prices, no embedded map.

## Decisions

- Approach A: single page, Vite + React + TypeScript, data on the visitor’s machine
- Catalog of Vietnamese (and common) dishes + visitor can hide items and add their own
- Filters: dish type, cuisine, region (Bắc / Trung / Nam). No price, no diet, no speed
- Result: name shuffle, then stop. No CS crate, no long animation
- After pick: Google Maps **search URL only** — `https://www.google.com/maps/search/?api=1&query={tên món}`
- Optional area chip (city/district) so search works when location is off: query becomes `{tên món} {khu vực}`
- Language: Vietnamese. Copy in sentence case
- Brand: **Ăn gì nhỉ**

## Out of scope

- Login, backend, database, sync
- Prices, ratings, rarity, gacha
- Embedded Leaflet/OSM, Places API, scraping Google
- In-page restaurant list (OSM cannot match dish names in VN)
- Grab/ShopeeFood deep links
- English UI (later)

## Page

One route `/`.

```
Ăn gì nhỉ                         Món của tôi

[Cơm] [Bún/Phở] [Mì] [Bánh] [Lẩu] [Khác]
[Việt] [Nhật] [Hàn] [Thái] [Âu]
[Bắc] [Trung] [Nam]

Khu vực: [Gần đây] [Q.1] [Thủ Đức] [Hà Nội] …

┌──────────────────────────┐
│      BÚN CHẢ             │
└──────────────────────────┘
         [ Chọn món ]
      Tìm quán gần đây
```

- No filter selected = all catalog + custom dishes that are enabled
- Filters in the same group are OR. Groups combine with AND
  - Example: Cơm + Bún/Phở + Việt + Bắc → Vietnamese rice or bun/pho tagged Bắc
- Nhật / Hàn / Thái / Âu dishes have `region: null`. A region chip excludes them unless they are also tagged that region
- Empty pool: board shows “Không còn món khớp lọc.” Button stays, does not shuffle. Hint: “Bỏ bớt lọc hoặc thêm món.”

### Món của tôi

Dialog, not a second page.

- Search + toggle built-in dishes (enabled by default)
- Add custom: name (1–40 chars), type, cuisine, region (optional, only if cuisine is Việt)
- Max 50 custom dishes
- Custom dishes live only in that browser
- Keep at least one enabled dish in the combined pool

## Visual

One memorable piece: the name board (split-flap / station board). Everything else quiet.

| Token | Value |
|---|---|
| Page | `#D5DCE0` |
| Board | `#1C3A42` |
| Board type | `#E8E2D4` |
| Ink | `#1A1814` |
| Action | `#C23A2B` |
| Font | Be Vietnam Pro |

- Filter chips: square corners, selected = ink fill + paper type, unselected = outline
- No soft pill chips, no identical SaaS cards, no cream+serif, no acid-green-on-black
- Motion only while names shuffle. `prefers-reduced-motion: reduce` → set the name immediately
- Focus rings visible. Touch targets ≥ 44px

Copy: *Ăn gì nhỉ*, *Chọn món*, *Tìm quán gần đây*, *Món của tôi*. No slogan.

## Catalog

Built-in list in source. No prices. Each dish:

```ts
type DishType = 'com' | 'bun-pho' | 'mi' | 'banh' | 'lau' | 'khac'
type Cuisine = 'viet' | 'nhat' | 'han' | 'thai' | 'au'
type Region = 'bac' | 'trung' | 'nam'

type Dish = {
  id: string          // stable slug, e.g. 'bun-cha'
  name: string        // 'Bún chả'
  type: DishType
  cuisine: Cuisine
  region: Region | null
  builtin: boolean
}
```

Seed ~50 dishes so every type × cuisine × region combo has something, without copying another product’s copy or art. Names only — no jokes, no images required for v1. Board is typographic.

Custom dish: same shape, `builtin: false`, `id` = UUID.

## Pick

1. Build eligible list from enabled builtin + custom, apply filters
2. Uniform random — no price weighting
3. Shuffle: cycle names from the eligible list for ~900–1200ms (8–12 ticks, easing to a stop), last name is the winner
4. Winner is chosen **before** the shuffle (motion is cosmetic)
5. “Tìm quán gần đây” enabled only when a result exists
6. Maps URL: `https://www.google.com/maps/search/?api=1&query=` + `encodeURIComponent(area === 'nearby' ? name : `${name} ${areaLabel}`)`
7. Open in a new tab. `rel="noopener noreferrer"`

Area chips (search bias only, not a map):

- Gần đây (default) — query is just the dish name; Google uses device location
- A short fixed list: TP.HCM — Q.1, Q.3, Q.7, Tân Bình, Thủ Đức, Bình Thạnh; Hà Nội — Hoàn Kiếm, Cầu Giấy, Đống Đa, Hà Đông; Đà Nẵng — Hải Châu

Do not embed a map. Do not call Nominatim, Overpass, or any Places API.

## Persistence

`localStorage` key `anginhi-v1`. Cookie not used (4KB limit).

```ts
type Store = {
  v: 1
  disabled: string[]     // builtin ids
  custom: Dish[]
  filters: { types: DishType[]; cuisines: Cuisine[]; regions: Region[] }
  area: string           // 'nearby' | area id
  lastId: string | null
}
```

- Validate on read. Unknown keys / bad values → ignore field, do not crash
- Quota or blocked storage: picker still works; show “Không lưu được trên trình duyệt này.”
- Last pick restores on reload if still in the pool

## Stack

- Vite, React 19, TypeScript
- Be Vietnam Pro from Google Fonts — only this family
- One `src/styles.css` with tokens. No component library, no Tailwind
- pnpm, `127.0.0.1`, no `.env`
- Tests with `node --test` for: filter intersection, pool validation, Maps query builder, store parse

## Errors / empty

| Case | UI |
|---|---|
| No eligible dishes | Board message + hint. No shuffle |
| Custom name empty / too long | Inline error next to the field |
| Storage fail | One line under the board |
| Maps with no result yet | Link not shown |

## Success

A stranger opens the site on the phone, taps two chips, taps **Chọn món**, sees a real dish name land, taps **Tìm quán gần đây**, and gets a Google Maps search. It does not look like a template or a CS case opener.
