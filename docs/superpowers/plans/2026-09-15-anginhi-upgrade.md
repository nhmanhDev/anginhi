# Ăn gì nhỉ Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đưa Ăn gì nhỉ lên chuẩn Second Brain (theme / i18n 6 ngôn ngữ / error-card / footer AI42E / boot loader / modal) + craft (tách file, ảnh WebP, SEO, a11y) trên 5 PR vào `dev`.

**Architecture:** Giữ Vite + React 19 + TypeScript + CSS thuần. Store đổi `theme` (mode game) → `mode`, thêm `ui.theme` cho sáng/tối. Token DownloadAnything trên `<html data-theme>`. Sau PR4: `App.tsx` chỉ compose hooks + sections; CSS tách 11 file.

**Tech Stack:** Vite 7, React 19, TypeScript 5.9, pnpm 10, `node --test`, Mulish, không Tailwind / không lib UI. Ảnh WebP qua `sharp` (devDependency, PR5).

## Global Constraints

- Không thêm tính năng (mode, filter, tài khoản, backend, PWA, deploy)
- Không đổi luật chọn món, catalog, giá, URL Maps/Grab/Shopee
- Donate CSS/markup copy y hệt DownloadAnything — không sửa
- Một stack CSS thuần + token; không shadcn/MUI/Tailwind
- Theme mặc định: `prefers-color-scheme`, fallback cream light; đổi tay lưu `store.ui.theme`
- 6 ngôn ngữ: `vi | en | zh | ko | ja | hi`. Tên món: vi giữ gốc, còn lại `NAME_EN` (romanized)
- Git: không code trên `main`. Nhánh từ `dev` → PR vào `dev`. `git commit` / `git push` lệnh đơn lẻ
- `corepack pnpm typecheck` + `corepack pnpm test` xanh mỗi task có code
- Mỗi PR: entry mới đầu `docs/CHANGELOG.md`, sửa đè ARCHITECTURE/FEATURES nếu đổi
- Font: Mulish. Host Vite: `127.0.0.1`
- `data-theme` sở hữu `--bg-dark` / `--text-primary` / panel. `data-mode` chỉ `--mode-*` (accent Scene / mode-bar). Không để `.site[data-mode='ket']` ghi đè `--paper` nữa — xung đột theme toggle
- Coffee modal luôn nền tối `rgba(16,20,30,0.96)` dù site sáng

---

## File structure

**PR1 tạo:** `README.md`, `LICENSE`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `docs/JOURNAL.md`, `docs/screenshot.png`, `docs/QR_code.jpg`

**PR1 xoá:** `src/donate.ts`, `HeartMark` trong `src/icons.tsx`

**PR2 sửa:** `src/types.ts`, `src/store.ts`, `src/copy.ts`, `src/modes.ts`, `src/labels.ts`, `src/App.tsx`, `src/styles.css`, `tests/store.test.ts`

**PR2 tạo:** `src/theme.ts`, `src/ErrorCard.tsx`, `tests/i18n.test.ts`, `tests/theme.test.ts`

**PR3 tạo:** `src/Modal.tsx`, `src/Footer.tsx`, `public/icons/social/{youtube,facebook,telegram,github,gmail}.svg`

**PR3 sửa:** `index.html`, `src/Donate.tsx`, `src/MyDishes.tsx`, `src/App.tsx`, `src/Card.tsx`, `src/styles.css`

**PR4 tạo:** `src/hooks/{useStore,usePicker,useTheme}.ts`, `src/components/{Header,ModeBar,Stage,Controls,Catalog,WinnerDialog,AlbumDialog,ThemeToggle}.tsx`, `src/styles/{tokens,base,header,mode,stage,controls,catalog,modal,donate,footer,loader}.css`, `src/i18n/{copy,modes,labels}.ts` (move)

**PR5 tạo:** `public/food/*-480.webp`, `public/food/*-960.webp`, `public/scene.webp`, `public/favicon.svg`, `public/og.png`, `public/manifest.webmanifest`

**Giữ nguyên hành vi:** `areas.ts`, `catalog.ts`, `dish.ts`, `filter.ts`, `maps.ts`, `names.ts`, `pick.ts`, `reel.ts`, `sound.ts`, `Select.tsx`, `Scene.tsx`, `Chips.tsx`

---

### Task 1: Nhánh `dev` + dọn leftover

**Files:**
- Delete: `src/donate.ts`
- Modify: `src/icons.tsx` (xoá `HeartMark` dòng 31–43)
- Modify: `docs/CHANGELOG.md` (entry PR1 — ghi ở Task 2 cùng commit docs, hoặc commit riêng cleanup)

**Interfaces:**
- Consumes: baseline commit `0e23e49` trên `main`
- Produces: nhánh `dev` = `main`; nhánh `chore/repo-hygiene` từ `dev`; không còn `DONATE_URL` / `HeartMark`

- [ ] **Step 1: Tạo `dev` và nhánh làm việc**

```bash
git branch dev
git checkout -b chore/repo-hygiene
```

Expected: HEAD = `0e23e49`, branch `chore/repo-hygiene`.

- [ ] **Step 2: Xoá leftover**

Xoá file `src/donate.ts`. Trong `src/icons.tsx` xoá nguyên hàm `HeartMark`. Không import nào còn trỏ tới chúng (đã xác nhận).

- [ ] **Step 3: Typecheck + test**

```bash
corepack pnpm typecheck
corepack pnpm test
```

Expected: typecheck exit 0; 32 test pass.

- [ ] **Step 4: Commit**

```bash
git add src/donate.ts src/icons.tsx
git commit -m "chore: drop unused GitHub donate leftover"
```

---

### Task 2: Community files + README + docs

**Files:**
- Create: `LICENSE`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `docs/JOURNAL.md`, `docs/QR_code.jpg` (copy `public/QR_code.jpg`), `docs/screenshot.png`
- Modify: `docs/CHANGELOG.md`

**Interfaces:**
- Consumes: template vault `Template - README (product).md`, `Template - CODE_OF_CONDUCT.md`, `Template - CONTRIBUTING.md`, `Template - SECURITY.md`, `Template - Multi-Agent JOURNAL.md`
- Produces: repo PUBLIC đủ 5 community files; docs giải thích được dự án không cần đọc source

- [ ] **Step 1: LICENSE Apache-2.0**

Tạo `LICENSE` đúng văn bản Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0.txt). Dòng copyright: `Copyright 2026 Nguyễn Hùng Mạnh`.

- [ ] **Step 2: CODE_OF_CONDUCT / SECURITY / CONTRIBUTING**

Copy 3 template vault. `CONTRIBUTING.md`: tên repo `anginhi`, branch gốc là `dev` (không `master`):

```md
3. Tạo branch từ `dev`: `git checkout -b feat/ten-tinh-nang`
```

Issue URL: `https://github.com/nhmanhDev/anginhi/issues`. Email bảo mật: `nhmanh.dev@gmail.com`.

- [ ] **Step 3: JOURNAL**

`docs/JOURNAL.md` — khối Log trống theo template Multi-Agent JOURNAL (bỏ comment mẫu).

- [ ] **Step 4: ARCHITECTURE.md** (ảnh chụp HIỆN TẠI, trước khi tách file)

```md
# Kiến trúc — Ăn gì nhỉ

Một trang Vite + React 19. Không backend. Dữ liệu trên máy khách.

## Luồng

catalog + custom → eligibleDishes(filters) → pickWeighted / fillSlots → shuffle cosmetic → maps/grab/shopee URL

## Module

| File | Việc |
|---|---|
| `src/App.tsx` | UI + state React |
| `src/store.ts` | parse/write `localStorage` `anginhi-v1` |
| `src/filter.ts` | AND giữa nhóm, OR trong nhóm; budget = trần giá |
| `src/pick.ts` | random có trọng số budget; unseen (duyên); 5 ô (quẻ) |
| `src/maps.ts` | search URL Maps / Grab / ShopeeFood |
| `src/catalog.ts` | món có sẵn |
| `src/Donate.tsx` | CTA DownloadAnything + QR `/QR_code.jpg` |
| `src/Select.tsx` | listbox custom (không `<select>` native) |

## Lưu trữ

`Store.v === 1`. Field hỏng → bỏ, không crash. Quota đầy → picker vẫn chạy.

## Không có

API HTTP, DB, tài khoản, embed map.
```

- [ ] **Step 5: FEATURES.md**

Liệt kê góc user: 5 cách chọn (Quẻ / Két / Khui / Duyên / Hội mèo), lọc loại-xuất xứ-vùng-suất-chay-ngân sách, khu vực Maps, Món của tôi (ẩn/thêm, max 50), VI/EN (4 ngôn ngữ dropdown còn thiếu copy — PR2), Donate + QR, link Grab/ShopeeFood.

- [ ] **Step 6: README product**

Hero: **Ăn gì nhỉ** — "Chọn món hôm nay, rồi tìm quán gần đây." Badge chỉ license Apache-2.0 (chưa có tag/CI). Grid 4 ô: Lọc món / 5 cách chọn / Tìm quán / Món của tôi. Chạy local:

```sh
corepack enable
corepack pnpm install
corepack pnpm dev
```

Mở `http://127.0.0.1:5173/`. Kiến trúc → `docs/ARCHITECTURE.md`. Không section API. Ủng hộ: ảnh `docs/QR_code.jpg`. Liên hệ 5 kênh AI42E. Ghi nhận: ảnh món `public/food/CREDITS.txt`. Một câu: bản dịch zh/ko/ja/hi (sau PR2) nhận PR sửa.

- [ ] **Step 7: Ảnh README**

Copy `public/QR_code.jpg` → `docs/QR_code.jpg`. Chụp viewport header+stage (light, 1280) lưu `docs/screenshot.png` (browser tool hoặc `pnpm dev` + screenshot).

- [ ] **Step 8: CHANGELOG**

Thêm đầu bảng:

```md
| 2026-09-15 | Repo thiếu community files / docs; leftover donate GitHub | Baseline chỉ có source, chưa LICENSE/README product | Thêm Apache-2.0 + 4 file cộng đồng + ARCHITECTURE/FEATURES/JOURNAL; xoá donate.ts/HeartMark |
```

- [ ] **Step 9: Typecheck + test + commit**

```bash
corepack pnpm typecheck
corepack pnpm test
git add LICENSE CODE_OF_CONDUCT.md CONTRIBUTING.md SECURITY.md README.md docs/
git commit -m "docs: product README, Apache-2.0, and repo health files"
```

---

### Task 3: Push baseline + PR1

**Files:** không

- [ ] **Step 1: Push `main` rồi `dev`** (lệnh đơn lẻ, Mạnh Approve từng lệnh)

```bash
git push -u origin main
```

```bash
git push -u origin dev
```

- [ ] **Step 2: Push nhánh + PR vào `dev`**

```bash
git push -u origin chore/repo-hygiene
```

```bash
gh pr create --base dev --title "chore: repo hygiene for public Ăn gì nhỉ" --body "$(cat <<'EOF'
## Summary
- LICENSE Apache-2.0, README product, CODE_OF_CONDUCT / CONTRIBUTING / SECURITY
- docs/ARCHITECTURE.md, FEATURES.md, JOURNAL.md
- Xoá leftover GitHub donate

## Test plan
- [ ] README render trên GitHub
- [ ] `corepack pnpm typecheck` + `corepack pnpm test`
EOF
)"
```

Expected: URL PR. Không merge.

---

### Task 4: Store `mode` + `ui.theme` (TDD)

**Files:**
- Modify: `src/types.ts`, `src/store.ts`, `src/App.tsx` (mọi `store.theme` → `store.mode`)
- Test: `tests/store.test.ts`

**Interfaces:**
- Consumes: `ThemeId`, `Lang` hiện tại
- Produces:

```ts
export type UiTheme = 'light' | 'dark'

export type Store = {
  v: 1
  disabled: string[]
  custom: Dish[]
  filters: Filters
  area: string
  lastId: string | null
  sound: boolean
  lang: Lang
  mode: ThemeId
  ui: { theme: UiTheme | null }
  picks: number
  recent: string[]
  spendCustom: boolean
  seen: string[]
}

export function emptyStore(): Store  // mode: 'que', ui: { theme: null }
```

`parseStore`: `mode = pickTheme(value.mode ?? value.theme)`; `ui.theme` chỉ `'light'|'dark'`, còn lại `null`.

- [ ] **Step 1: Viết test fail**

Thay assertion cũ `parsed.theme` bằng `parsed.mode`. Thêm:

```ts
test('parseStore maps legacy theme field to mode and defaults ui.theme', () => {
  assert.equal(parseStore({ v: 1, theme: 'kem', lang: 'zh' }).mode, 'que')
  assert.equal(parseStore({ v: 1, theme: 'muc' }).mode, 'ket')
  assert.equal(parseStore({ v: 1, mode: 'khui' }).mode, 'khui')
  assert.equal(parseStore({ v: 1 }).ui.theme, null)
  assert.equal(parseStore({ v: 1, ui: { theme: 'dark' } }).ui.theme, 'dark')
  assert.equal(parseStore({ v: 1, ui: { theme: 'neon' } }).ui.theme, null)
})
```

Xoá test `parseStore maps old theme ids` cũ (thay bằng test trên). Giữ test lang/seen/budget.

- [ ] **Step 2: Chạy test — FAIL**

```bash
corepack pnpm test
```

Expected: FAIL — `Store.theme` / property `mode` missing.

- [ ] **Step 3: Sửa store + App**

`emptyStore`: `mode: 'que', ui: { theme: null }`, không field `theme`.
`parseStore`: như Interfaces.
`App.tsx`: `store.theme` → `store.mode` (mọi chỗ gồm `data-mode`, `modeText`, `setMode`, Scene). `setMode` vẫn ghi `?mode=` trên URL.

- [ ] **Step 4: Test + typecheck PASS**

```bash
corepack pnpm test
corepack pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git checkout dev
git pull origin dev
git checkout -b feat/theme-i18n-error-card
git add src/types.ts src/store.ts src/App.tsx tests/store.test.ts
git commit -m "fix: rename store.theme to mode so UI theme can live in store.ui"
```

(Nếu PR1 chưa merge: branch từ `chore/repo-hygiene` thay vì `dev`.)

---

### Task 5: i18n 6 ngôn ngữ (TDD)

**Files:**
- Modify: `src/copy.ts`, `src/modes.ts`, `src/labels.ts`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Consumes: `Lang`, `ModeLine`, `COPY.vi` keys
- Produces:

```ts
export const COPY: Record<Lang, typeof vi>
export function t(lang: Lang): typeof vi  // COPY[lang]
export function modeText(id: ThemeId, lang: Lang): ModeLine
export function typeLabel(id: DishType, lang: Lang): string
export function cuisineLabel(id: Cuisine, lang: Lang): string
export function regionLabel(id: Region, lang: Lang): string
```

Thêm key vào `vi` (và 5 bản kia): `themeToggle`, `themeLight`, `themeDark`, `errorStorageTitle`, `errorCopyTitle`, `errorCopyBody` (`Không chép được. Hãy chép tay.` / EN: `Could not copy. Copy it by hand.`).

- [ ] **Step 1: Test fail**

`tests/i18n.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { COPY, t } from '../src/copy.ts'
import { modeText } from '../src/modes.ts'
import { THEMES } from '../src/copy.ts'
import type { Lang } from '../src/types.ts'

const langs: Lang[] = ['vi', 'en', 'zh', 'ko', 'ja', 'hi']

test('every language has the same COPY keys as vi and no empty string', () => {
  const keys = Object.keys(COPY.vi).sort()
  for (const lang of langs) {
    assert.deepEqual(Object.keys(COPY[lang]).sort(), keys, lang)
    for (const key of keys) {
      const value = COPY[lang][key as keyof typeof COPY.vi]
      assert.equal(typeof value, 'string', `${lang}.${key}`)
      assert.ok(value.trim().length > 0, `${lang}.${key} empty`)
    }
  }
})

test('t() returns the table for that language', () => {
  assert.equal(t('zh').close, COPY.zh.close)
  assert.equal(t('vi').brand, 'Ăn gì nhỉ')
})

test('modeText covers 5 modes × 6 langs', () => {
  for (const lang of langs) {
    for (const id of THEMES) {
      const line = modeText(id, lang)
      assert.ok(line.title.trim())
      assert.ok(line.pick.trim())
    }
  }
})
```

- [ ] **Step 2: Chạy — FAIL** (`COPY.zh` undefined)

```bash
corepack pnpm test
```

- [ ] **Step 3: Điền bảng**

`t(lang)` = `COPY[lang]`.

`labels.ts`: bảng `TYPE_I18N` / `CUISINE_I18N` / `REGION_I18N` kiểu `Record<Lang, Record<Id, string>>`. Ngoài `en` có thể giữ nhãn Việt cho type (Cơm, Phở…) — người dùng vẫn nhận ra; `en` giữ bản hiện tại. Course đã có `COURSE_I18N`.

`modes.ts`: thêm `zh`, `ko`, `ja`, `hi` — cùng shape `Record<ThemeId, ModeLine>`. Title mode **giữ tiếng Việt** (thương hiệu mode); `kicker`/`lede`/`pick` dịch. Ví dụ zh-que: kicker `抽签台`, pick `抽一签`, lede `抽出五格，再翻一格。那一格就是这顿的菜。`

COPY zh/ko/ja/hi: dịch đủ key `vi`. `brand` luôn `Ăn gì nhỉ`. `donate` luôn `Donate`. Câu ngắn, sentence case theo ngôn ngữ.

- [ ] **Step 4: Test PASS**

```bash
corepack pnpm test
corepack pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/copy.ts src/modes.ts src/labels.ts tests/i18n.test.ts
git commit -m "feat: complete vi/en/zh/ko/ja/hi copy tables"
```

---

### Task 6: Token theme + ThemeToggle

**Files:**
- Create: `src/theme.ts`, test `tests/theme.test.ts`
- Modify: `src/styles.css` (`:root` + `[data-theme]`), `src/App.tsx` (nút + effect), `src/icons.tsx` (`SunMark` / `MoonMark`)
- Modify: `src/copy.ts` nếu thiếu key toggle (đã có Task 5)

**Interfaces:**
- Produces:

```ts
export type UiTheme = 'light' | 'dark'
export function resolveTheme(
  stored: UiTheme | null,
  prefersDark: boolean,
): UiTheme {
  return stored ?? (prefersDark ? 'dark' : 'light')
}
```

- [ ] **Step 1: Test fail**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveTheme } from '../src/theme.ts'

test('resolveTheme prefers stored value over system', () => {
  assert.equal(resolveTheme('light', true), 'light')
  assert.equal(resolveTheme('dark', false), 'dark')
})

test('resolveTheme follows system when stored is null', () => {
  assert.equal(resolveTheme(null, true), 'dark')
  assert.equal(resolveTheme(null, false), 'light')
})
```

- [ ] **Step 2: Chạy — FAIL**

- [ ] **Step 3: `theme.ts` + CSS tokens**

`:root, [data-theme='light']` — map token spec:

```css
:root,
[data-theme='light'] {
  --bg-dark: #f2f0e7;
  --panel-bg: #faf8ef;
  --panel-border: color-mix(in srgb, #354a43 14%, transparent);
  --panel-border-hover: color-mix(in srgb, #354a43 24%, transparent);
  --input-bg: #faf8ef;
  --btn-hover-bg: color-mix(in srgb, #354a43 6%, transparent);
  --text-primary: #354a43;
  --text-secondary: #697362;
  --skeleton-shimmer-highlight: color-mix(in srgb, #354a43 8%, transparent);
  --paper: var(--bg-dark);
  --ink: var(--text-primary);
  --quiet: var(--text-secondary);
  --card: var(--panel-bg);
  --stage: #efe5ca;
  --kind: #e4e8dd;
  --line: #d5d2c6;
  --go: #965b46;
  --go-ink: #fff9e9;
  --stage-veil: rgb(239 229 202 / 0.72);
}
[data-theme='dark'] {
  --bg-dark: #0f141c;
  --panel-bg: rgba(16, 20, 30, 0.96);
  --panel-border: rgba(255, 255, 255, 0.10);
  --panel-border-hover: rgba(255, 255, 255, 0.18);
  --input-bg: rgba(8, 10, 16, 0.55);
  --btn-hover-bg: rgba(255, 255, 255, 0.06);
  --text-primary: #e8ece6;
  --text-secondary: #9aa79c;
  --skeleton-shimmer-highlight: rgba(255, 255, 255, 0.12);
  --paper: var(--bg-dark);
  --ink: var(--text-primary);
  --quiet: var(--text-secondary);
  --card: #161c26;
  --stage: #1a2230;
  --kind: #223026;
  --line: rgba(255, 255, 255, 0.12);
  --go: #c98a6a;
  --go-ink: #fff9e9;
  --stage-veil: rgb(15 20 28 / 0.72);
}
```

Alias cũ `--veil` = `var(--stage-veil)`.

Xoá block `.site[data-mode='ket'|'duyen'|'khui'|'meo']` đang ghi đè `--paper`. Thay bằng `--mode-accent` trên `.site[data-mode=…]` (ket `#c9a227`, duyen `#8f4a66`, khui `#6d9848`, meo `#e07a3d`, que `var(--go)`). Scene/mode-bar `on` dùng `var(--mode-accent)`.

`.site` `background: var(--bg-dark); color: var(--text-primary);`

- [ ] **Step 4: ThemeToggle trong header**

Giữa `LangPick` và `Donate`:

```tsx
<button
  type="button"
  className="icon-btn"
  id="btn-theme-toggle"
  aria-pressed={resolved === 'dark'}
  aria-label={resolved === 'dark' ? copy.themeLight : copy.themeDark}
  title={copy.themeToggle}
  onClick={() => commit({ ...store, ui: { theme: resolved === 'dark' ? 'light' : 'dark' } })}
>
  {resolved === 'dark' ? <SunMark /> : <MoonMark />}
</button>
```

`useEffect`: `document.documentElement.dataset.theme = resolveTheme(...)`; `document.documentElement.lang = store.lang`; `document.title = copy.brand`; `meta[name=theme-color]` content `#f2f0e7` / `#0f141c`. Listen `prefers-color-scheme` khi `store.ui.theme === null`.

`SunMark` / `MoonMark`: SVG 18px stroke `currentColor`, cùng style `GlobeMark`.

- [ ] **Step 5: Test + typecheck + screenshot light/dark 1280**

```bash
corepack pnpm test
corepack pnpm typecheck
```

- [ ] **Step 6: Commit**

```bash
git add src/theme.ts src/styles.css src/App.tsx src/icons.tsx tests/theme.test.ts
git commit -m "feat: system-aware light/dark theme with DownloadAnything tokens"
```

---

### Task 7: ErrorCard

**Files:**
- Create: `src/ErrorCard.tsx`
- Modify: `src/App.tsx`, `src/styles.css`

**Interfaces:**
- Produces:

```ts
export function ErrorCard(props: {
  title: string
  message: string
  closeLabel: string
  onClose: () => void
}): JSX.Element
```

Markup: `<div class="error-card glass-panel" role="alert">` + title + message + nút đóng.

CSS: padding 16px 20px, border `var(--panel-border)`, `background: var(--panel-bg)`, gap 8px. Không `alert()`.

- [ ] **Step 1: Component + CSS**

- [ ] **Step 2: Gắn storage error**

Bỏ `storageError` khỏi chuỗi `<p>` page-head. Dưới `.page-head`:

```tsx
{storageError ? (
  <ErrorCard
    title={copy.errorStorageTitle}
    message={storageError}
    closeLabel={copy.close}
    onClose={() => setStorageError('')}
  />
) : null}
```

`errorStorageTitle`: vi `Không lưu được`, en `Could not save`.

Clipboard fail trong winner: `setCopyError(true)` + ErrorCard `errorCopyTitle` / `errorCopyBody` (không còn im lặng).

- [ ] **Step 3: Typecheck + test**

```bash
corepack pnpm typecheck
corepack pnpm test
```

- [ ] **Step 4: CHANGELOG + commit**

```md
| 2026-09-15 | Theme/i18n/error không đạt UI stack | Chỉ cream + COPY vi/en; lỗi storage là text lẫn page-head | Token light/dark, ThemeToggle, 6 ngôn ngữ + ErrorCard; store.mode + store.ui.theme |
```

```bash
git add src/ErrorCard.tsx src/App.tsx src/styles.css src/copy.ts docs/CHANGELOG.md docs/ARCHITECTURE.md docs/FEATURES.md
git commit -m "feat: error-card for storage and clipboard failures"
```

---

### Task 8: PR2

```bash
git push -u origin feat/theme-i18n-error-card
```

```bash
gh pr create --base dev --title "feat: theme toggle, 6-language copy, error-card" --body "$(cat <<'EOF'
## Summary
- `store.mode` + `store.ui.theme` (null = theo hệ thống)
- Token light/dark khớp DownloadAnything
- COPY/modes/labels đủ vi en zh ko ja hi + test key parity
- ErrorCard thay alert/text lẫn heading

## Test plan
- [ ] `corepack pnpm test` (store / i18n / theme)
- [ ] Toggle theme, reload — giữ lựa chọn
- [ ] Đổi zh/ko/ja/hi — không còn fallback English
- [ ] Screenshot 1280 light + dark
EOF
)"
```

---

### Task 9: Modal chung

**Files:**
- Create: `src/Modal.tsx`
- Modify: `src/Donate.tsx`, `src/MyDishes.tsx`, `src/App.tsx` (winner + album), `src/styles.css`

**Interfaces:**
- Produces:

```ts
export function Modal(props: {
  open: boolean
  onClose: () => void
  labelledBy: string
  closeLabel: string
  className?: string
  children: React.ReactNode
}): JSX.Element | null
```

Portal `document.body`. Backdrop `.modal` click → `onClose`. Content `.modal-content.glass-panel` + `className`. Esc. Focus trap (Tab vòng trong dialog). Restore focus trigger. Nút `.btn-close-modal` (style copy `.btn-close-coffee-modal`, hover rotate 90deg + `rgba(255,255,255,0.15)` + glow).

Donate: `Modal className="coffee-modal"` — không đổi animation cốc/QR.

Winner/Album/MyDishes: bỏ overlay `.winner-back` riêng; dùng `Modal`. Giữ class inner `.winner` / `.album` / `.mine` để CSS cũ còn chạy.

- [ ] **Step 1: Viết `Modal.tsx`**
- [ ] **Step 2: Thay 4 call site**
- [ ] **Step 3: Typecheck + test + Esc/focus tay trên browser**
- [ ] **Step 4: Commit** `feat: shared zoom-fade modal with focus trap`

Nhánh: `feat/footer-loader-modal` từ `dev` (hoặc tiếp stack nếu PR2 chưa merge).

---

### Task 10: Footer AI42E + boot loader + skeleton

**Files:**
- Create: `src/Footer.tsx`, `public/icons/social/{youtube,facebook,telegram,github,gmail}.svg`
- Modify: `index.html`, `src/App.tsx`, `src/Card.tsx`, `src/styles.css`

**Interfaces:**
- Footer 5 card — URL đúng Business Core:

```ts
const SOCIAL = [
  { href: 'https://www.youtube.com/@nhmanhAI42E', platform: 'YouTube', handle: '@nhmanhAI42E', icon: '/icons/social/youtube.svg' },
  { href: 'https://www.facebook.com/nhmanhAI4E/', platform: 'Facebook', handle: 'nhmanhAI4E', icon: '/icons/social/facebook.svg' },
  { href: 'https://t.me/AI42E', platform: 'Telegram', handle: '@AI42E', icon: '/icons/social/telegram.svg' },
  { href: 'https://github.com/nhmanhDev', platform: 'GitHub', handle: 'nhmanhDev', icon: '/icons/social/github.svg' },
  { href: 'mailto:nhmanh.dev@gmail.com', platform: 'Email', handle: 'nhmanh.dev@gmail.com', icon: '/icons/social/gmail.svg' },
]
```

Copy SVG từ `Manh_SecondBrain/Reference/Assets/icons/svg/original/{youtube,facebook,telegram,github,gmail}.svg`.

CSS copy DA `.footer-social-grid` / `.social-card` (min-width 170px, radius 16px, hover translateY -2px). Mobile: wrap.

Boot loader trong `index.html` **trước** `#root`: overlay, badge + ring, SVG bát (path `BowlMark`), text `Đang tải dữ liệu` + 3 chấm. Inline `<style>` critical (`#boot-loader{position:fixed;inset:0;z-index:99999;background:#f2f0e7}`). Inline script **trước** link font:

```js
(function () {
  var done = false
  function hide() {
    if (done) return
    done = true
    var el = document.getElementById('boot-loader')
    if (el) el.classList.add('boot-loader-hidden')
  }
  var ready = Promise.all([
    new Promise(function (r) { window.addEventListener('load', r) }),
    document.fonts ? document.fonts.ready : Promise.resolve(),
  ])
  ready.then(hide)
  setTimeout(hide, 5000)
})()
```

`Card.tsx`: state `loaded`. Ảnh: `onLoad` → loaded. Khi chưa load: `.skeleton-thumbnail` (aspect-ratio 4/3) + `.skeleton-line`. Shimmer:

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton-thumbnail,
.skeleton-line {
  background: linear-gradient(90deg, var(--btn-hover-bg) 25%, var(--skeleton-shimmer-highlight) 50%, var(--btn-hover-bg) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}
```

`onError` → fallback `.food-gap`.

- [ ] **Step 1–3:** icons + Footer; boot loader; skeleton
- [ ] **Step 4:** typecheck + test; boot loader biến mất ≤5s
- [ ] **Step 5:** CHANGELOG + commit `feat: AI42E footer, boot loader, and catalog skeletons`

---

### Task 11: PR3

```bash
git push -u origin feat/footer-loader-modal
```

`gh pr create --base dev` title `feat: footer, boot loader, shared modal`. Test plan: 4 modal Esc + focus; footer 5 link; loader tắt; skeleton khi throttle mạng.

---

### Task 12: Tách App → hooks + components

**Files:**
- Create: các file listed ở File structure PR4 (hooks + components)
- Modify: `src/App.tsx` còn ≤150 dòng compose
- Move: `copy.ts`/`modes.ts`/`labels.ts` → `src/i18n/` (update mọi import)

**Interfaces:**
- `useStore()` → `{ store, commit, storageError, setStorageError }`
- `usePicker(store, commit, eligible)` → `{ busy, shown, reveal, lots, lotsDealt, slot, pick, pickFromSlot, pickOne, setReveal }`
- `useTheme(store, commit)` → `{ resolved, toggle }` — effect `data-theme`

Không đổi class CSS, không đổi behavior. Screenshot trước khi tách.

- [ ] **Step 1:** Screenshot 1280 light (baseline)
- [ ] **Step 2:** Move i18n, fix import
- [ ] **Step 3:** Extract hooks
- [ ] **Step 4:** Extract components — props explicit, không import `App`
- [ ] **Step 5:** `App.tsx` compose only
- [ ] **Step 6:** typecheck + test + screenshot so khớp
- [ ] **Step 7:** Commit `refactor: split App into hooks and page sections`

Nhánh `refactor/split-app`.

---

### Task 13: Tách styles.css

**Files:**
- Create: 11 file dưới `src/styles/`
- Modify: `src/main.tsx` import theo thứ tự: tokens → base → header → mode → stage → controls → catalog → modal → donate → footer → loader
- Delete: `src/styles.css` sau khi chuyển hết

Cắt theo comment/`/*` section hiện có. Không đổi selector. Donate nguyên khối.

- [ ] **Step 1:** Cắt file, import
- [ ] **Step 2:** typecheck + screenshot
- [ ] **Step 3:** ARCHITECTURE.md cập nhật cây thư mục
- [ ] **Step 4:** Commit `refactor: split styles.css into token-scoped sheets`

---

### Task 14: PR4

Push `refactor/split-app`, `gh pr create --base dev`. Điều kiện: không file TSX >300 dòng trừ catalog data; `App.tsx` ≤150.

---

### Task 15: WebP + picture + SEO

**Files:**
- Modify: `scripts/fetch-food.mjs` (thêm bước sharp), `src/Card.tsx`, Winner dialog, `index.html`, `package.json` (`sharp` devDependency)
- Create: `public/favicon.svg`, `public/manifest.webmanifest`, `public/og.png`, `public/scene.webp`

**Interfaces:**
- Ảnh món: `dish.image` vẫn path jpg; UI derive:

```ts
export function foodSrc(image: string) {
  const base = image.replace(/\.jpg$/, '')
  return {
    jpg: image,
    w480: `${base}-480.webp`,
    w960: `${base}-960.webp`,
  }
}
```

`<picture>` + `srcset` 480/960, `sizes="(max-width: 700px) 50vw, 280px"`, `width={480} height={360}`, `loading="lazy"` `decoding="async"`.

- [ ] **Step 1:** `corepack pnpm add -D sharp` rồi script convert mọi `public/food/*.jpg` + `scene.png`
- [ ] **Step 2:** Card + Winner dùng `foodSrc`
- [ ] **Step 3:** `index.html` — description vi `Lọc món, rút một lần, rồi tìm quán gần đây trên Google Maps.`; OG title/description/image `/og.png`; twitter card; favicon.svg (BowlMark); manifest; `theme-color`; preload `scene.webp`
- [ ] **Step 4:** typecheck + test
- [ ] **Step 5:** Commit `perf: serve food images as responsive WebP`

Nhánh `perf/seo-a11y`.

---

### Task 16: a11y + mobile + Lighthouse

**Files:**
- Modify: `src/App.tsx` hoặc `Header`/`ModeBar`, `src/styles/header.css`, `src/styles/controls.css`

- [ ] **Step 1:** Skip link đầu `#root`: `<a class="skip" href="#chon">` + CSS clip/focus. ModeBar `<nav aria-label={copy.modes}>`.
- [ ] **Step 2:** CSS 360px — header wrap, mode-bar `overflow-x:auto` + `mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)`; controls 1 cột; touch target `min-height: 44px` / `min-width: 44px` cho icon-btn, stamps, course.
- [ ] **Step 3:** Contrast dark — text `--text-primary` trên `--bg-dark` (đã #e8ece6 / #0f141c). Focus-visible 2px `var(--ink)` offset 2px mọi control.
- [ ] **Step 4:** Screenshot 360 / 768 / 1280 × light/dark
- [ ] **Step 5:** `corepack pnpm build && corepack pnpm preview` — Lighthouse mobile 4 cột ≥ 90. Nếu fail: sửa (nén og.png, preload font, giảm JS) rồi đo lại.
- [ ] **Step 6:** CHANGELOG + commit `fix: mobile a11y, skip link, and Lighthouse floor`

---

### Task 17: PR5

Push `perf/seo-a11y`, `gh pr create --base dev` title `perf: WebP, SEO meta, a11y`. Test plan Lighthouse + 3 viewport × 2 theme.

---

## Self-review

| Spec | Task |
|---|---|
| PR1 community/docs/xóa leftover | 1–3 |
| Store mode + ui.theme | 4 |
| 6 ngôn ngữ + test key | 5 |
| Token + ThemeToggle + system default | 6 |
| ErrorCard storage/clipboard | 7–8 |
| Modal + Donate không đổi | 9 |
| Footer / boot / skeleton | 10–11 |
| Tách App + CSS | 12–14 |
| WebP / OG / favicon / Lighthouse | 15–17 |
| Không API.md | Task 2 README bỏ API |
| Coffee modal luôn tối | Task 6+9 constraint |
| Mode palette không đè theme | Task 6 |
