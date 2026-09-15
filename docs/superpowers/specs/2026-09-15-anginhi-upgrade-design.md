# Ăn gì nhỉ — nâng cấp toàn site (design)

Ngày: 2026-09-15. Thay thế `2026-09-14-anginhi-design.md` (spec cũ đã lệch code: font, giá, mode game, i18n…). Spec này mô tả **trạng thái đích** sau đợt nâng cấp; `docs/ARCHITECTURE.md` + `docs/FEATURES.md` (viết ở PR1) là ảnh chụp hiện tại và được sửa đè theo từng PR.

## Mục tiêu

1. Đạt chuẩn bắt buộc của Second Brain cho sản phẩm free public AI42E (`Reference/UI stack.md`, `Reference/AI Repo Rules.md`).
2. Nâng craft: mobile, hiệu năng ảnh, SEO, a11y, tách file để dễ sửa.
3. Repo đúng quy trình: `main`/`dev`, PR vào `dev`, docs + community files đầy đủ.

## Không làm (ponytail)

- Không thêm tính năng mới (mode, filter, tài khoản, backend, PWA offline, deploy).
- Không đổi luật chọn món, dữ liệu món, giá, URL Maps/Grab/Shopee.
- Không thêm design-system lib; vẫn CSS thuần + token.
- Không đổi thiết kế Donate (đã copy y hệt DownloadAnything).

## Quyết định đã chốt với Mạnh

| Vấn đề | Chốt |
|---|---|
| Cách chia | 5 PR theo mảng, tuần tự vào `dev` |
| Thứ tự | Repo hygiene → Chuẩn UI stack → Craft |
| Theme mặc định | Theo `prefers-color-scheme`, fallback **sáng cream hiện tại**; đổi tay thì lưu store |
| Ngôn ngữ | Điền đủ 6: vi, en, zh, ko, ja, hi |
| GitHub | `github.com/nhmanhDev/anginhi` (đã tồn tại, PUBLIC, rỗng), Apache-2.0 |

## Kiến trúc đích (sau PR4)

```
index.html                 boot-loader + meta/OG + favicon/manifest
src/
  main.tsx                 import styles theo thứ tự, mount App
  App.tsx                  ≤150 dòng: compose hooks + sections
  hooks/
    useStore.ts            load/parse/commit localStorage, storageError
    usePicker.ts           shuffle, lots (quẻ), meo delay, reveal state
    useTheme.ts            data-theme trên <html>, prefers-color-scheme, store.ui.theme
  components/
    Header.tsx             brand, LangPick, ThemeToggle, Donate, sound, Món của tôi
    ModeBar.tsx            <nav> 5 mode
    Stage.tsx              Scene + stage-copy + steps
    Controls.tsx           course, type, place, budget Select, veg, cuisine, region
    Catalog.tsx            search + grid Card (skeleton) + more
    WinnerDialog.tsx       kết quả + maps/grab/shopee + copy
    AlbumDialog.tsx        bộ sưu tập (mode duyên)
    Footer.tsx             brand + social-card grid AI42E
    Modal.tsx              .modal/.modal-content chung: portal, zoom-fade, Esc, focus trap, nút đóng xoay
    ErrorCard.tsx          role="alert", icon, nút đóng
    Select.tsx, Donate.tsx, Card.tsx, Chips.tsx, Scene.tsx, MyDishes.tsx, icons.tsx (giữ)
  i18n/
    copy.ts                COPY[lang] 6 ngôn ngữ, t(lang)
    modes.ts               modeText 6 ngôn ngữ
    labels.ts              type/cuisine/region/course 6 ngôn ngữ
  styles/
    tokens.css  base.css  header.css  mode.css  stage.css  controls.css
    catalog.css modal.css donate.css footer.css loader.css
  (giữ) areas.ts catalog.ts dish.ts filter.ts maps.ts names.ts pick.ts reel.ts sound.ts store.ts types.ts
public/
  QR_code.jpg  scene.webp  favicon.svg  manifest.webmanifest  icons/social/*.svg
  food/*.jpg (gốc) + food/*-480.webp, *-960.webp
```

Luật import: `components/*` chỉ import `hooks/`, `i18n/`, module thuần; `hooks/` không import component. `App.tsx` là nơi duy nhất nối store ↔ components.

## Token & theme

`tokens.css` đổi tên/bổ sung để khớp DownloadAnything (giữ alias cũ 1 PR rồi xoá):

```
:root, [data-theme="light"]      [data-theme="dark"]
--bg-dark      #f2f0e7 (paper)    #0f141c
--panel-bg     #faf8ef (card)     rgba(16,20,30,0.96)
--panel-border ink 14%            rgba(255,255,255,0.10)
--input-bg     #faf8ef            rgba(8,10,16,0.55)
--btn-hover-bg ink 6%             rgba(255,255,255,0.06)
--text-primary #354a43            #e8ece6
--text-secondary #697362          #9aa79c
--stage        #efe5ca            #1a2230
--kind         #e4e8dd            #223026
--line         #d5d2c6            rgba(255,255,255,0.12)
--go / --go-ink giữ               #c98a6a / #fff9e9
--skeleton-shimmer-highlight ink 8% / white 12%
```

- Mọi màu hardcode trong CSS (scene, jar, két, mèo, winner, album, mode accents) chuyển về token hoặc biến `--mode-*` khai báo trong `mode.css` cho cả 2 theme.
- Donate/coffee modal **không** đổi theo theme: giữ nền tối DownloadAnything (đã ghi ở memory 2026-09-15).
- `useTheme`: khởi tạo = `store.ui.theme ?? (matchMedia dark ? 'dark' : 'light')`; set `document.documentElement.dataset.theme`; `<meta name="theme-color">` đổi theo theme. Nút `ThemeToggle` (sun/moon SVG, `aria-pressed`, tooltip i18n) đặt giữa LangPick và Donate.
- Store: thêm `ui: { theme: 'light' | 'dark' | null }`; `parseStore` validate, mặc định `null` (= theo hệ thống). Đổi tên field `theme` hiện tại (mode game) thành `mode` trong Store, `parseStore` đọc cả `theme` cũ để tương thích.

## i18n

- `Lang = 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'hi'`; `COPY`, `modes`, `labels`, `COURSE_I18N`, `LANG_LOCALE`, `money` đủ 6.
- Tên món: `dishName` giữ tiếng Việt + tên romanized/EN như hiện tại cho mọi ngôn ngữ ngoài vi (không dịch tên món).
- Test tự động: mọi `COPY[lang]` có đúng tập key của `COPY.vi`; `modeText` đủ 5 mode × 6 lang; không key nào rỗng.
- `<html lang>` theo store; `document.title` theo `copy.brand`.

## Component chuẩn UI stack

- **Modal.tsx**: props `open, onClose, labelledBy, className`; portal vào body; backdrop `fadeIn 0.3s` + blur; content `scaleIn 0.3s` (0.92→1, 12px→0); Esc; click backdrop đóng; focus trap + trả focus về trigger; nút đóng chung `.btn-close-modal` hover xoay 90° + `rgba(255,255,255,0.15)` + glow. Dùng cho Winner, Album, MyDishes, Coffee (coffee thêm class `coffee-modal`).
- **ErrorCard.tsx**: `.error-card.glass-panel`, `role="alert"`, icon, title, message, nút đóng. Dùng cho lỗi storage (thay dòng text trong page-head) và lỗi clipboard (thay im lặng).
- **Footer.tsx**: `footer-social-grid` 5 `social-card` (YouTube `@nhmanhAI42E`, Facebook `nhmanhAI4E`, Telegram `@AI42E`, GitHub `nhmanhDev`, Email `nhmanh.dev@gmail.com`), icon SVG màu brand copy từ `Reference/Assets/icons/svg/original` vào `public/icons/social/`, CSS copy từ DownloadAnything `style.css` `.footer-social-grid`/`.social-card`, đổi màu về token.
- **Boot loader**: `#boot-loader` trong `index.html` (overlay `z-index 99999`, badge + ring spin + icon bát, text “Đang tải dữ liệu” + 3 chấm), inline script đặt trước link font: ẩn khi `window.load` && `document.fonts.ready`, cap 5s. CSS trong `loader.css` nhưng phần critical inline để hiện ngay first paint.
- **Skeleton**: `Card` render `.skeleton-thumbnail` (aspect 4/3) + `.skeleton-line` khi ảnh chưa `onLoad`; shimmer 1.6s theo token.

## Craft (PR5)

- Ảnh: `scripts/fetch-food.mjs` thêm bước `sharp` xuất `*-480.webp`, `*-960.webp`; `Card`/`WinnerDialog` dùng `<picture>` + `srcset` + `loading="lazy"` + `decoding="async"` + `width/height`. `scene.png` → `scene.webp`, `<link rel="preload" as="image">`.
- `index.html`: `meta description` (vi), OG/Twitter (title, description, `og:image` = `public/og.png` 1200×630 chụp từ site), `favicon.svg` (bát), `manifest.webmanifest` (name, icons, theme_color), `theme-color` light/dark.
- a11y: skip-to-content link đầu body; `ModeBar` là `<nav aria-label>`; kiểm contrast dark theme ≥ 4.5:1 cho text, ≥ 3:1 cho border/icon; touch target ≥ 44px; focus-visible thống nhất.
- Responsive: kiểm 360 / 768 / 1280; header wrap gọn ở 360 (brand + icon-only), controls 1 cột, mode-bar cuộn ngang có mask 2 đầu.
- Lighthouse mobile (dev build preview): Performance/Accessibility/Best Practices/SEO ≥ 90.

## Repo (PR1)

- Baseline: commit toàn bộ hiện trạng lên `main` (repo GitHub đang rỗng — đây là lần duy nhất commit thẳng `main`), tạo `dev` từ `main`, push cả hai. Từ đó mọi việc theo nhánh từ `dev` → PR vào `dev`; Mạnh merge.
- `.gitignore` thêm `*.tsbuildinfo`.
- Files: `README.md` (Template README product: hero, badge license, screenshot `docs/screenshot.png`, grid tính năng, chạy local, kiến trúc tóm tắt + link, ủng hộ QR `docs/QR_code.jpg`, liên hệ AI42E, đóng góp, license), `LICENSE` Apache-2.0, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md` (3 template vault), `docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `docs/JOURNAL.md` (template). Không có `docs/API.md` (không có API).
- Xoá `src/donate.ts`, `HeartMark` trong `icons.tsx`. Spec cũ thêm dòng đầu “Superseded by 2026-09-15-anginhi-upgrade-design.md”.

## Lộ trình PR

| PR | Nhánh (từ `dev`) | Nội dung | Điều kiện xong |
|---|---|---|---|
| 1 | `chore/repo-hygiene` | Baseline + README/LICENSE/community/docs/JOURNAL, xoá leftover | typecheck + test xanh; README render đúng trên GitHub |
| 2 | `feat/theme-i18n-error-card` | tokens + dark theme + ThemeToggle + 6 ngôn ngữ + ErrorCard + store `ui`/`mode` | test key i18n; screenshot light/dark; không màu hardcode ngoài donate |
| 3 | `feat/footer-loader-modal` | Footer AI42E + boot loader + skeleton + Modal chung | 4 modal dùng Modal.tsx; boot loader tắt ≤5s kể cả offline font |
| 4 | `refactor/split-app` | tách App.tsx/styles.css theo kiến trúc đích, không đổi behavior | file ≤300 dòng; test/typecheck xanh; screenshot trước/sau khớp |
| 5 | `perf/seo-a11y` | WebP + lazy + picture, meta/OG/favicon/manifest, skip-link/nav/contrast/mobile | Lighthouse mobile ≥90 ×4 |

Mỗi PR: cập nhật `docs/CHANGELOG.md` (đầu file) + sửa đè `ARCHITECTURE.md`/`FEATURES.md` nếu đổi. `git commit`/`git push` chạy lệnh đơn lẻ để Mạnh duyệt.

## Xử lý lỗi

| Tình huống | UI |
|---|---|
| localStorage fail | ErrorCard dưới page-head, đóng được, picker vẫn chạy |
| clipboard fail | ErrorCard trong WinnerDialog |
| ảnh món 404 | skeleton → fallback `.food-gap` (như hiện tại), không layout shift |
| font CDN treo | boot loader tự tắt sau 5s, fallback `sans-serif` |
| store cũ (field `theme` = mode) | `parseStore` map sang `mode`, `ui.theme = null` |

## Kiểm thử

- `pnpm typecheck`, `pnpm test` (node --test) mỗi PR.
- Test mới: `store.test.ts` (ui.theme, mode alias), `i18n.test.ts` (key parity 6 ngôn ngữ), `theme.test.ts` (resolve theme từ store + media).
- Browser: screenshot 360/768/1280 × light/dark cho PR2, PR4, PR5; kiểm modal Esc/focus trap tay ở PR3.
- Lighthouse mobile trên `pnpm build && pnpm preview` ở PR5.

## Rủi ro

- Dịch zh/ko/ja/hi do AI: câu ngắn, ghi trong README rằng bản dịch cộng đồng có thể sửa qua PR.
- Tách file (PR4) đụng mọi selector: chốt bằng screenshot diff, không đổi class name.
- Dark theme với ảnh `scene.png` sáng: thêm overlay `--stage-veil` theo theme để chữ đọc được.
