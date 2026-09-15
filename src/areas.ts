export type Area = {
  id: string
  label: string
  query: string | null
}

export const AREAS: Area[] = [
  { id: 'nearby', label: 'Gần đây', query: null },
  { id: 'hcm-q1', label: 'Q.1', query: 'Quận 1, Hồ Chí Minh' },
  { id: 'hcm-q3', label: 'Q.3', query: 'Quận 3, Hồ Chí Minh' },
  { id: 'hcm-q7', label: 'Q.7', query: 'Quận 7, Hồ Chí Minh' },
  { id: 'hcm-tan-binh', label: 'Tân Bình', query: 'Tân Bình, Hồ Chí Minh' },
  { id: 'hcm-thu-duc', label: 'Thủ Đức', query: 'Thủ Đức, Hồ Chí Minh' },
  { id: 'hcm-binh-thanh', label: 'Bình Thạnh', query: 'Bình Thạnh, Hồ Chí Minh' },
  { id: 'hn-hoan-kiem', label: 'Hoàn Kiếm', query: 'Hoàn Kiếm, Hà Nội' },
  { id: 'hn-cau-giay', label: 'Cầu Giấy', query: 'Cầu Giấy, Hà Nội' },
  { id: 'hn-dong-da', label: 'Đống Đa', query: 'Đống Đa, Hà Nội' },
  { id: 'hn-ha-dong', label: 'Hà Đông', query: 'Hà Đông, Hà Nội' },
  { id: 'dn-hai-chau', label: 'Hải Châu', query: 'Hải Châu, Đà Nẵng' },
]
