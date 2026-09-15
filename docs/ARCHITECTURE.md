# Kiến trúc — Ăn gì nhỉ

Một trang Vite + React 19. Không backend. Dữ liệu trên máy khách.

## Luồng

```
catalog + custom → eligibleDishes(filters) → pickWeighted / fillSlots → shuffle cosmetic → maps/grab/shopee URL
```

## Module

| File | Việc |
|---|---|
| `src/App.tsx` | UI + state React |
| `src/store.ts` | parse/write `localStorage` `anginhi-v1` (`mode` = cách chọn, `ui.theme` = sáng/tối) |
| `src/theme.ts` | `resolveTheme(stored, prefersDark)` |
| `src/ErrorCard.tsx` | banner lỗi, `role="alert"` |
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
