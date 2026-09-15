# Tính năng — Ăn gì nhỉ

Góc nhìn người dùng. Chi tiết code: [ARCHITECTURE.md](ARCHITECTURE.md).

## Việc chính

Lọc kho món, rút một lần, rồi mở Google Maps / Grab / ShopeeFood để tìm quán gần khu vực đã chọn.

## Năm cách chọn

| Cách | Việc xảy ra |
|---|---|
| Quẻ trưa | Chia năm ô, lật một ô |
| Két hội thợ lùn | Mở két, một món bước ra |
| Khui vị | Khui hũ một lần |
| Duyên vị | Gặp món chưa gặp, ghi vào album |
| Hội mèo | Nghỉ một nhịp rồi chọn hộ |

## Lọc

- Suất: món chính / ăn vặt / đồ uống / món nhậu
- Loại: cơm, bún/phở, mì, bánh, lẩu, khác
- Xuất xứ: Việt, Nhật, Hàn, Thái, Âu
- Vùng miền: Bắc, Trung, Nam (món không-Việt thường không có vùng)
- Chỉ món chay
- Ngân sách: trần giá tham khảo (35k–150k hoặc tự nhập 30–180)

Trong một nhóm: OR. Giữa các nhóm: AND. Không lọc = cả kho đang bật.

## Khu vực

Chip khu vực chỉ đổi câu tìm Maps (`tên món` hoặc `tên món + quận`). Không nhúng bản đồ, không gọi Places API.

## Món của tôi

Hộp thoại, không phải trang riêng. Ẩn món có sẵn; thêm tối đa 50 món của mình (lưu trên trình duyệt này). Phải còn ít nhất một món trong kho.

## Ngôn ngữ

Dropdown có vi, en, zh, ko, ja, hi. Bản đầy đủ cho zh/ko/ja/hi nằm ở đợt nâng cấp theme/i18n. Tên món giữ tiếng Việt; bản không-vi dùng tên romanized.

## Donate

Nút tim hồng trên header → *Buy me a coffee!* → QR Vietcombank. Copy y hệt DownloadAnything.

## Không làm

Tài khoản, đồng bộ mây, giá thật quán, danh sách quán trong trang, Grab/Shopee deep link.
