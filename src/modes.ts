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
    lede: 'Chia năm ô món chưa gặp, rồi lật một ô. Khui ra món cho bữa này.',
    catalog: 'Những món đang chờ',
    pick: 'Chia năm ô',
    again: 'Chia lại',
    picking: 'Đang khui',
    idle: 'Chưa chia ô',
    opens: 'Lượt rút',
    choose: 'Lật một ô',
    dealt: 'Năm ô đã chia. Lật một ô.',
    clock: '',
    collection: 'Đã gặp',
  },
}

const en: Record<ModeId, ModeLine> = {
  que: {
    title: 'Quẻ trưa',
    kicker: 'Draw a lot',
    lede: 'Deal five unseen dishes, then flip one. Open it for this meal.',
    catalog: 'Dishes waiting',
    pick: 'Deal five',
    again: 'Deal again',
    picking: 'Opening',
    idle: 'No lots dealt',
    opens: 'Draws',
    choose: 'Flip one',
    dealt: 'Five lots are dealt. Flip one.',
    clock: '',
    collection: 'Met',
  },
}

const zh: Record<ModeId, ModeLine> = {
  que: {
    title: 'Quẻ trưa',
    kicker: '抽签台',
    lede: '分五格还没见过的菜，再翻开一格。开出来的就是这顿的菜。',
    catalog: '等待中的菜',
    pick: '分五格',
    again: '再分',
    picking: '正在开',
    idle: '还没分格',
    opens: '抽签次数',
    choose: '翻一格',
    dealt: '五格已分好。翻一格。',
    clock: '',
    collection: '见过',
  },
}

const ko: Record<ModeId, ModeLine> = {
  que: {
    title: 'Quẻ trưa',
    kicker: '제비 뽑기',
    lede: '아직 안 만난 메뉴로 다섯 칸을 나눈 뒤 한 칸을 엽니다. 그 칸이 이 끼니입니다.',
    catalog: '기다리는 메뉴',
    pick: '다섯 칸 나누기',
    again: '다시 나누기',
    picking: '여는 중',
    idle: '아직 칸이 없습니다',
    opens: '뽑은 횟수',
    choose: '한 칸 열기',
    dealt: '다섯 칸이 나왔습니다. 하나를 여세요.',
    clock: '',
    collection: '만난 메뉴',
  },
}

const ja: Record<ModeId, ModeLine> = {
  que: {
    title: 'Quẻ trưa',
    kicker: 'くじ台',
    lede: 'まだ出会っていない料理を五マス配り、一マスを開けます。それが今の食事です。',
    catalog: '待ちの料理',
    pick: '五マス配る',
    again: 'もう一度配る',
    picking: '開けています',
    idle: 'まだ配っていません',
    opens: '引いた回数',
    choose: '一マス開ける',
    dealt: '五マス配りました。一マス開けてください。',
    clock: '',
    collection: '出会った',
  },
}

const hi: Record<ModeId, ModeLine> = {
  que: {
    title: 'Quẻ trưa',
    kicker: 'पर्ची वाली मेज़',
    lede: 'अनदेखे व्यंजनों के पाँच खाने बाँटें, फिर एक खोलें। वही इस भोजन का व्यंजन है।',
    catalog: 'इंतज़ार करते व्यंजन',
    pick: 'पाँच खाने बाँटें',
    again: 'फिर बाँटें',
    picking: 'खोल रहे हैं',
    idle: 'अभी खाने नहीं बँटे',
    opens: 'बार',
    choose: 'एक खोलें',
    dealt: 'पाँच खाने बँट गए। एक खोलें।',
    clock: '',
    collection: 'मिले हुए',
  },
}

const TABLES: Record<Lang, Record<ModeId, ModeLine>> = { vi, en, zh, ko, ja, hi }

export function modeText(id: ModeId, lang: Lang): ModeLine {
  return TABLES[lang][id]
}
