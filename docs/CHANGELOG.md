# Changelog

| Ngày | Lỗi | Nguyên nhân | Giải pháp |
|---|---|---|---|
| 2026-09-15 | Repo thiếu community files / docs; leftover donate GitHub | Baseline chỉ có source, chưa LICENSE/README product | Thêm Apache-2.0 + 4 file cộng đồng + ARCHITECTURE/FEATURES/JOURNAL; xoá donate.ts/HeartMark |
| 2026-09-15 | Nút Donate vẫn là icon tim tròn + link GitHub; dropdown ngân sách/form nhìn native Windows; spacing/border lệch | `Donate.tsx` không được gắn vào `App`; CSS donate/modal của DownloadAnything không được copy; `<select>` native nuốt CSS trên Windows; token radius/spacing không thống nhất | Gắn CTA donate y hệt second brain / DownloadAnything (tim hồng + modal cà phê + QR). Dropdown ngân sách và Món của tôi tự vẽ panel. Token 8/12/16px + viền dùng `--panel-border`. |
