import type { Lang, ThemeId } from './types.ts'

export type ModeId = ThemeId

export type ModeLine = {
  title: string
  kicker: string
  lede: string
  catalog: string
  pick: string
  again: string
  picking: string
  idle: string
  opens: string
  choose: string
  dealt: string
  clock: string
  collection: string
}

const vi: Record<ModeId, ModeLine> = {
  que: {
    title: 'Quẻ trưa',
    kicker: 'Bàn rút quẻ',
    lede: 'Rút năm ô, rồi lật một ô. Ô đó là món cho bữa này.',
    catalog: 'Những món đang chờ',
    pick: 'Rút một quẻ',
    again: 'Rút lại',
    picking: 'Đang rút',
    idle: 'Chưa rút ô nào',
    opens: 'Lượt rút',
    choose: 'Chọn một ô',
    dealt: 'Năm ô đã chia. Lật một ô.',
    clock: '',
    collection: '',
  },
  ket: {
    title: 'Két hội thợ lùn',
    kicker: 'Kho vị',
    lede: 'Mở két. Một món đang nằm trong kho bước ra.',
    catalog: 'Trong két có gì',
    pick: 'Mở két',
    again: 'Mở lại',
    picking: 'Đang mở két',
    idle: 'Két còn khóa',
    opens: 'Lượt mở két',
    choose: 'Mở két',
    dealt: '',
    clock: '',
    collection: '',
  },
  khui: {
    title: 'Khui vị',
    kicker: 'Mở hũ',
    lede: 'Khui hũ một lần. Món nằm trong hũ hiện ra.',
    catalog: 'Trong hũ có gì',
    pick: 'Khui món',
    again: 'Khui lại',
    picking: 'Đang khui',
    idle: 'Hũ chưa mở',
    opens: 'Lượt khui',
    choose: 'Khui món',
    dealt: '',
    clock: '',
    collection: '',
  },
  duyen: {
    title: 'Duyên vị',
    kicker: 'Gặp món',
    lede: 'Đi một vòng, gặp món chưa gặp. Bộ sưu tập ghi lại những vị đã gặp.',
    catalog: 'Những vị chờ gặp',
    pick: 'Gặp món hôm nay',
    again: 'Gặp lại',
    picking: 'Đang gặp',
    idle: 'Chưa gặp món nào',
    opens: 'Lượt gặp',
    choose: 'Gặp món hôm nay',
    dealt: '',
    clock: '',
    collection: 'Đã gặp',
  },
  meo: {
    title: 'Hội mèo',
    kicker: 'Nhờ chọn',
    lede: 'Để hội mèo chọn hộ một món trong danh sách.',
    catalog: 'Mèo chọn từ đây',
    pick: 'Nhờ mèo chọn',
    again: 'Chọn lại',
    picking: 'Mèo đang chọn',
    idle: 'Mèo chưa chọn',
    opens: 'Lượt mèo chọn',
    choose: 'Nhờ mèo chọn',
    dealt: '',
    clock: 'Để hội mèo lo bữa này.',
    collection: '',
  },
}

const en: Record<ModeId, ModeLine> = {
  que: {
    title: 'Quẻ trưa',
    kicker: 'Draw a lot',
    lede: 'Deal five slots, then flip one. That slot is the dish for this meal.',
    catalog: 'Dishes waiting',
    pick: 'Draw a lot',
    again: 'Draw again',
    picking: 'Drawing',
    idle: 'No slot drawn yet',
    opens: 'Draws',
    choose: 'Pick a slot',
    dealt: 'Five slots are dealt. Flip one.',
    clock: '',
    collection: '',
  },
  ket: {
    title: 'Két hội thợ lùn',
    kicker: 'Vault',
    lede: 'Open the vault. One dish from the stock comes out.',
    catalog: 'Inside the vault',
    pick: 'Open vault',
    again: 'Open again',
    picking: 'Opening vault',
    idle: 'Vault is locked',
    opens: 'Vault opens',
    choose: 'Open vault',
    dealt: '',
    clock: '',
    collection: '',
  },
  khui: {
    title: 'Khui vị',
    kicker: 'Unseal',
    lede: 'Unseal the jar once. The dish inside comes out.',
    catalog: 'Inside the jar',
    pick: 'Unseal a dish',
    again: 'Unseal again',
    picking: 'Unsealing',
    idle: 'Jar is sealed',
    opens: 'Unseals',
    choose: 'Unseal a dish',
    dealt: '',
    clock: '',
    collection: '',
  },
  duyen: {
    title: 'Duyên vị',
    kicker: 'Meet a dish',
    lede: 'Walk the list and meet a dish you have not met. The album keeps what you met.',
    catalog: 'Flavors waiting',
    pick: 'Meet today’s dish',
    again: 'Meet again',
    picking: 'Meeting',
    idle: 'No meeting yet',
    opens: 'Meetings',
    choose: 'Meet today’s dish',
    dealt: '',
    clock: '',
    collection: 'Met',
  },
  meo: {
    title: 'Hội mèo',
    kicker: 'Ask the cats',
    lede: 'Let the cats pick one dish from this list.',
    catalog: 'The cats pick from here',
    pick: 'Ask the cats',
    again: 'Ask again',
    picking: 'Cats are picking',
    idle: 'The cats have not picked',
    opens: 'Cat picks',
    choose: 'Ask the cats',
    dealt: '',
    clock: 'Let the cats handle this meal.',
    collection: '',
  },
}

export function modeText(id: ModeId, lang: Lang): ModeLine {
  return lang === 'vi' ? vi[id] : en[id]
}
