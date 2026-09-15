# Ăn gì nhỉ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Public one-page site that filters a dish catalog, shuffles a name, and opens a Google Maps search.

**Architecture:** Pure domain modules (`filter`, `maps`, `store`, `dish`) tested with `node --test`. A single React page reads those modules, persists to `localStorage` key `anginhi-v1`, and never calls a map/places API.

**Tech Stack:** Vite, React 19, TypeScript, one `src/styles.css`, Be Vietnam Pro, pnpm, `node --test` with type stripping.

## Global Constraints

- Vietnamese UI, sentence case. Copy: *Ăn gì nhỉ*, *Chọn món*, *Tìm quán gần đây*, *Món của tôi*
- No prices, no accounts, no backend, no `.env`
- No Tailwind, no component library
- Colors: page `#D5DCE0`, board `#1C3A42`, board type `#E8E2D4`, ink `#1A1814`, action `#C23A2B`
- Font: Be Vietnam Pro only
- Maps: search URL only. Do not embed a map. Do not call Nominatim, Overpass, or Places
- Storage: `localStorage` `anginhi-v1`. Picker works if storage fails
- Bind Vite to `127.0.0.1`
- Do not copy truanayangi assets, jokes, or art
- Do not commit unless the user asks

---

## File structure

- `package.json` — scripts: `dev`, `build`, `preview`, `test`, `typecheck`
- `index.html` — title Ăn gì nhỉ, font link, `#root`
- `vite.config.ts` — alias `@`, host `127.0.0.1`
- `src/main.tsx` — mount
- `src/styles.css` — tokens + layout
- `src/types.ts` — Dish, filters, Store, Area
- `src/catalog.ts` — ~50 builtin dishes
- `src/areas.ts` — nearby + HCM / HN / DN chips
- `src/filter.ts` — `eligibleDishes`
- `src/pick.ts` — `pickDish`
- `src/maps.ts` — `mapsSearchUrl`
- `src/store.ts` — parse / write
- `src/dish.ts` — custom dish validation
- `src/App.tsx` — page
- `src/Board.tsx` — name board + shuffle
- `src/Chips.tsx` — filter / area chips
- `src/MyDishes.tsx` — dialog
- `tests/filter.test.ts`
- `tests/maps.test.ts`
- `tests/store.test.ts`
- `tests/dish.test.ts`

---

### Task 1: Types and filter

**Files:**
- Create: `src/types.ts`
- Create: `src/filter.ts`
- Test: `tests/filter.test.ts`

**Interfaces:**
- Produces:
  - `DishType = 'com' | 'bun-pho' | 'mi' | 'banh' | 'lau' | 'khac'`
  - `Cuisine = 'viet' | 'nhat' | 'han' | 'thai' | 'au'`
  - `Region = 'bac' | 'trung' | 'nam'`
  - `Dish = { id: string; name: string; type: DishType; cuisine: Cuisine; region: Region | null; builtin: boolean }`
  - `Filters = { types: DishType[]; cuisines: Cuisine[]; regions: Region[] }`
  - `eligibleDishes(dishes: Dish[], disabled: readonly string[], filters: Filters): Dish[]`

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { eligibleDishes } from '../src/filter.ts'
import type { Dish } from '../src/types.ts'

const d = (partial: Partial<Dish> & Pick<Dish, 'id' | 'type' | 'cuisine'>): Dish => ({
  name: partial.id,
  region: null,
  builtin: true,
  ...partial,
})

const pool: Dish[] = [
  d({ id: 'com-tam', type: 'com', cuisine: 'viet', region: 'nam' }),
  d({ id: 'pho-bo', type: 'bun-pho', cuisine: 'viet', region: 'bac' }),
  d({ id: 'ramen', type: 'mi', cuisine: 'nhat' }),
  d({ id: 'pizza', type: 'banh', cuisine: 'au' }),
]

test('no filters returns every enabled dish', () => {
  assert.deepEqual(
    eligibleDishes(pool, [], { types: [], cuisines: [], regions: [] }).map((x) => x.id),
    ['com-tam', 'pho-bo', 'ramen', 'pizza'],
  )
})

test('disabled builtin ids are removed', () => {
  assert.deepEqual(
    eligibleDishes(pool, ['pizza'], { types: [], cuisines: [], regions: [] }).map((x) => x.id),
    ['com-tam', 'pho-bo', 'ramen'],
  )
})

test('same group is OR, groups are AND', () => {
  const ids = eligibleDishes(pool, [], {
    types: ['com', 'bun-pho'],
    cuisines: ['viet'],
    regions: ['bac'],
  }).map((x) => x.id)
  assert.deepEqual(ids, ['pho-bo'])
})

test('region chip excludes dishes with null region', () => {
  const ids = eligibleDishes(pool, [], {
    types: [],
    cuisines: [],
    regions: ['nam'],
  }).map((x) => x.id)
  assert.deepEqual(ids, ['com-tam'])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/filter.test.ts`

Expected: FAIL — cannot find module `../src/filter.ts`

- [ ] **Step 3: Write types + filter**

`eligibleDishes`: drop `disabled` ids; if `filters.types.length` then keep `types.includes(dish.type)` (OR); same for cuisine; if `regions.length` then keep `dish.region !== null && regions.includes(dish.region)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --experimental-strip-types --test tests/filter.test.ts`

Expected: PASS

- [ ] **Step 5: Do not commit**

---

### Task 2: Maps URL and pick

**Files:**
- Create: `src/areas.ts`
- Create: `src/maps.ts`
- Create: `src/pick.ts`
- Test: `tests/maps.test.ts`

**Interfaces:**
- Produces:
  - `Area = { id: string; label: string; query: string | null }` (`query: null` = nearby)
  - `AREAS: Area[]` — nearby, then HCM Q.1 / Q.3 / Q.7 / Tân Bình / Thủ Đức / Bình Thạnh, HN Hoàn Kiếm / Cầu Giấy / Đống Đa / Hà Đông, DN Hải Châu
  - `mapsSearchUrl(name: string, area: Area): string`
  - `pickDish<T>(items: T[], random?: () => number): T` — `random()` in `[0, 1)`; throw if `items` empty

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { mapsSearchUrl } from '../src/maps.ts'
import { pickDish } from '../src/pick.ts'
import { AREAS } from '../src/areas.ts'

const nearby = AREAS.find((a) => a.id === 'nearby')!
const q1 = AREAS.find((a) => a.id === 'hcm-q1')!

test('nearby query is the dish name only', () => {
  assert.equal(
    mapsSearchUrl('Bún chả', nearby),
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Bún chả'),
  )
})

test('area query appends the area search label', () => {
  assert.equal(
    mapsSearchUrl('Bún chả', q1),
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Bún chả Quận 1, Hồ Chí Minh'),
  )
})

test('pickDish uses the supplied draw', () => {
  assert.equal(pickDish(['a', 'b', 'c'], () => 0.99), 'c')
})

test('pickDish throws when the list is empty', () => {
  assert.throws(() => pickDish([]), /empty/)
})
```

- [ ] **Step 2: Run test — expect FAIL (modules missing)**

- [ ] **Step 3: Implement**

`mapsSearchUrl`: `const q = area.query ? `${name} ${area.query}` : name` then prefix `https://www.google.com/maps/search/?api=1&query=` + `encodeURIComponent(q)`.

`pickDish`: `const i = Math.min(items.length - 1, Math.floor(random() * items.length)); return items[i]`.

`AREAS` nearby: `{ id: 'nearby', label: 'Gần đây', query: null }`. HCM query strings: `Quận 1, Hồ Chí Minh`, `Quận 3, Hồ Chí Minh`, `Quận 7, Hồ Chí Minh`, `Tân Bình, Hồ Chí Minh`, `Thủ Đức, Hồ Chí Minh`, `Bình Thạnh, Hồ Chí Minh`. HN: `Hoàn Kiếm, Hà Nội`, `Cầu Giấy, Hà Nội`, `Đống Đa, Hà Nội`, `Hà Đông, Hà Nội`. DN: `Hải Châu, Đà Nẵng`.

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Do not commit**

---

### Task 3: Store and custom dish

**Files:**
- Create: `src/store.ts`
- Create: `src/dish.ts`
- Test: `tests/store.test.ts`
- Test: `tests/dish.test.ts`

**Interfaces:**
- Produces:
  - `Store = { v: 1; disabled: string[]; custom: Dish[]; filters: Filters; area: string; lastId: string | null }`
  - `emptyStore(): Store`
  - `parseStore(raw: unknown): Store` — never throws; bad fields fall back to empty
  - `writeStore(store: Store, storage: Pick<Storage, 'setItem'>): { ok: true } | { ok: false; message: string }`
  - `STORAGE_KEY = 'anginhi-v1'`
  - `STORAGE_FAIL = 'Không lưu được trên trình duyệt này.'`
  - `validateCustomInput(input: { name: string; type: DishType; cuisine: Cuisine; region: Region | null }, existingCustomCount: number): { ok: true; dish: Omit<Dish, 'id' | 'builtin'> } | { ok: false; message: string }`
  - Name trim + NFC; 1–40 chars; no control chars; custom max 50
  - Region required null unless `cuisine === 'viet'` (if cuisine is not Việt, force `region: null`; if Việt, region may be null or a Region)

- [ ] **Step 1: Write failing tests**

`tests/store.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { emptyStore, parseStore, writeStore, STORAGE_KEY, STORAGE_FAIL } from '../src/store.ts'

test('parseStore returns emptyStore for garbage', () => {
  assert.deepEqual(parseStore(null), emptyStore())
  assert.deepEqual(parseStore('nope'), emptyStore())
})

test('parseStore keeps valid fields and drops unknown ids in filters', () => {
  const parsed = parseStore({
    v: 1,
    disabled: ['pho-bo', 3],
    custom: [],
    filters: { types: ['com', 'nope'], cuisines: ['viet'], regions: ['nam'] },
    area: 'hcm-q1',
    lastId: 'pho-bo',
    extra: true,
  })
  assert.deepEqual(parsed.disabled, ['pho-bo'])
  assert.deepEqual(parsed.filters.types, ['com'])
  assert.equal(parsed.area, 'hcm-q1')
  assert.equal(parsed.lastId, 'pho-bo')
})

test('writeStore reports failure when setItem throws', () => {
  const result = writeStore(emptyStore(), {
    setItem() {
      throw new Error('quota')
    },
  })
  assert.deepEqual(result, { ok: false, message: STORAGE_FAIL })
})

test('writeStore writes JSON under anginhi-v1', () => {
  const bag: Record<string, string> = {}
  const result = writeStore(emptyStore(), {
    setItem(k, v) {
      bag[k] = v
    },
  })
  assert.equal(result.ok, true)
  assert.equal(JSON.parse(bag[STORAGE_KEY]).v, 1)
})
```

`tests/dish.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { validateCustomInput } from '../src/dish.ts'

test('rejects empty and too-long names', () => {
  const empty = validateCustomInput({ name: '   ', type: 'com', cuisine: 'viet', region: 'nam' }, 0)
  assert.equal(empty.ok, false)
  const long = validateCustomInput({ name: 'x'.repeat(41), type: 'com', cuisine: 'viet', region: null }, 0)
  assert.equal(long.ok, false)
})

test('rejects a 51st custom dish', () => {
  const r = validateCustomInput({ name: 'Cơm nhà', type: 'com', cuisine: 'viet', region: 'nam' }, 50)
  assert.equal(r.ok, false)
})

test('strips region on non-Việt cuisine', () => {
  const r = validateCustomInput({ name: 'Ramen', type: 'mi', cuisine: 'nhat', region: 'bac' }, 0)
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.dish.region, null)
})
```

- [ ] **Step 2: Run tests — expect FAIL**

- [ ] **Step 3: Implement parse/write/validate as specified. `parseStore` only accepts `v === 1` objects.**

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Do not commit**

---

### Task 4: Catalog + Vite app shell

**Files:**
- Create: `src/catalog.ts` — 50 builtin dishes, unique ids, mix of all types/cuisines/regions
- Create: `index.html`, `package.json`, `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`, `src/main.tsx`, `src/vite-env.d.ts`
- Create: `src/styles.css` (tokens only in this task)
- Create: `.gitignore`

**Interfaces:**
- Produces: `CATALOG: Dish[]` — every item `builtin: true`; at least one dish per `DishType`, per `Cuisine`, and per `Region`

- [ ] **Step 1: Add a catalog coverage test in `tests/filter.test.ts`**

```ts
import { CATALOG } from '../src/catalog.ts'

test('catalog covers every type, cuisine, and region', () => {
  const types = new Set(CATALOG.map((d) => d.type))
  const cuisines = new Set(CATALOG.map((d) => d.cuisine))
  const regions = new Set(CATALOG.map((d) => d.region).filter(Boolean))
  assert.deepEqual([...types].sort(), ['banh', 'bun-pho', 'com', 'khac', 'lau', 'mi'])
  assert.deepEqual([...cuisines].sort(), ['au', 'han', 'nhat', 'thai', 'viet'])
  assert.deepEqual([...regions].sort(), ['bac', 'nam', 'trung'])
  assert.ok(CATALOG.length >= 50)
  assert.ok(CATALOG.every((d) => d.builtin && d.id && d.name))
})
```

- [ ] **Step 2: Run — expect FAIL (no catalog)**

- [ ] **Step 3: Write original dish names (no truanayangi quips). Scaffold Vite + React 19 + TS. Scripts: `dev` = `vite --host 127.0.0.1`, `test` = `node --experimental-strip-types --test tests/*.test.ts`, `build` = `tsc -b && vite build`.**

- [ ] **Step 4: `pnpm test` PASS; `pnpm build` may wait until App exists — if `main.tsx` mounts a placeholder, build should pass.**

---

### Task 5: UI

**Files:**
- Create: `src/App.tsx`
- Create: `src/Board.tsx`
- Create: `src/Chips.tsx`
- Create: `src/MyDishes.tsx`
- Modify: `src/styles.css`
- Modify: `src/main.tsx` to render `App`

**Interfaces:**
- Consumes: `CATALOG`, `AREAS`, `eligibleDishes`, `pickDish`, `mapsSearchUrl`, `parseStore`, `writeStore`, `validateCustomInput`, `emptyStore`, `STORAGE_KEY`
- Board empty copy: `Không còn món khớp lọc.`
- Hint: `Bỏ bớt lọc hoặc thêm món.`
- Shuffle: pick winner first; 8–12 ticks over 900–1200ms cycling eligible names; last frame is winner. If `matchMedia('(prefers-reduced-motion: reduce)')`, set winner immediately.
- Maps `<a>` only when `lastId` resolves to a dish; `target="_blank"` `rel="noopener noreferrer"`
- Custom add uses `crypto.randomUUID()`; cannot disable the last remaining eligible+enabled dish if that would empty the combined enabled list
- Persist on every successful change; on `writeStore` fail show `STORAGE_FAIL` under the board
- Restore `lastId` on load if still in pool

- [ ] **Step 1: Implement the page to the spec wireframe. No extra marketing copy.**

- [ ] **Step 2: `pnpm test` and `pnpm build`**

- [ ] **Step 3: Browser: open `/`, tap chips, tap Chọn món, tap Tìm quán gần đây, add a custom dish, reload — last pick and custom persist.**

- [ ] **Step 4: Do not commit**

---

## Spec coverage

| Spec | Task |
|---|---|
| Filter OR/AND + region excludes null | 1 |
| Maps search URL + area chips | 2 |
| Store + custom validation | 3 |
| ~50 catalog, no prices | 4 |
| Page, shuffle, dialog, visual tokens | 5 |
| Empty / storage / maps-hidden states | 5 |
|}
