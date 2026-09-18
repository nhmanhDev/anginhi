# Changelog

| Ngày | Lỗi | Nguyên nhân | Giải pháp |
|---|---|---|---|
| 2026-09-18 | UI/UX thô, nặng nề, thiếu tính nghệ thuật và xúc giác | Chưa áp dụng ngôn ngữ thiết kế Seesaw / MoMA; typography thiếu phân cấp editorial; thiếu bóng đổ đa tầng và chất liệu vật lý cho 5 chế độ | Tái thiết kế toàn diện theo chuẩn Interface Craft X MoMA: font Cormorant Garamond kết hợp Plus Jakarta Sans; bảng màu Limestone/Obsidian; Floating Glass Header; Mode Capsule Navigation; 5 stage tương tác xúc giác cao cấp; Food Gallery Plaque với indicator Chay; giữ nguyên 100% chuẩn Donate DownloadAnything. |
| 2026-09-15 | Theme/i18n/error không đạt UI stack | Chỉ cream + COPY vi/en; lỗi storage là text lẫn page-head | Token light/dark, ThemeToggle, 6 ngôn ngữ + ErrorCard; store.mode + store.ui.theme |
| 2026-09-15 | Repo thiếu community files / docs; leftover donate GitHub | Baseline chỉ có source, chưa LICENSE/README product | Thêm Apache-2.0 + 4 file cộng đồng + ARCHITECTURE/FEATURES/JOURNAL; xoá donate.ts/HeartMark |
| 2026-09-15 | Nút Donate vẫn là icon tim tròn + link GitHub; dropdown ngân sách/form nhìn native Windows; spacing/border lệch | `Donate.tsx` không được gắn vào `App`; CSS donate/modal của DownloadAnything không được copy; `<select>` native nuốt CSS trên Windows; token radius/spacing không thống nhất | Gắn CTA donate y hệt second brain / DownloadAnything (tim hồng + modal cà phê + QR). Dropdown ngân sách và Món của tôi tự vẽ panel. Token 8/12/16px + viền dùng `--panel-border`. |
