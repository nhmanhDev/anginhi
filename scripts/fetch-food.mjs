import { access, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'food')
const agent = 'Anginhi/0.1 (https://github.com/nhmanhDev/anginhi; food thumbs from Wikimedia Commons)'

const queries = {
  'pho-bo': 'Pho bo Vietnamese beef noodle soup bowl',
  'pho-ga': 'Pho ga Vietnamese chicken noodle soup',
  'bun-cha': 'Bun cha Hanoi grilled pork',
  'bun-thang': 'Bun thang Hanoi',
  'bun-rieu': 'Bun rieu crab noodle soup',
  'cha-ca': 'Cha ca La Vong Hanoi',
  'banh-cuon': 'Banh cuon Vietnamese steamed rice rolls',
  'com-rang': 'Com rang Vietnamese fried rice',
  'bun-bo-hue': 'Bun bo Hue',
  'mi-quang': 'Mi Quang noodles',
  'com-ga-hoi-an': 'Hoi An chicken rice',
  'cao-lau': 'Cao lau Hoi An',
  'banh-beo': 'Banh beo Hue',
  'banh-khoai': 'Banh khoai Hue',
  'bun-thit-nuong': 'Bun thit nuong grilled pork vermicelli',
  'com-tam': 'Com tam broken rice Saigon',
  'hu-tieu': 'Hu tieu nam vang',
  'banh-xeo': 'Banh xeo Vietnamese pancake',
  'banh-mi': 'Banh mi Vietnamese sandwich',
  'bun-mam': 'Bun mam Mekong',
  'com-ga-xoi-mo': 'Com ga xoi mo crispy chicken rice',
  'lau-mam': 'Lau mam Vietnamese hotpot',
  'hu-tieu-bo-kho': 'Bo kho Vietnamese beef stew noodles',
  'com-suon': 'Com suon grilled pork rice Vietnam',
  'lau-ca': 'Vietnamese fish hotpot',
  'bun-dau': 'Bun dau mam tom',
  'xoi': 'Xoi Vietnamese sticky rice',
  'chao-long': 'Chao long Vietnamese porridge',
  'lau-thai-viet': 'Thai hotpot Vietnam',
  'com-chien-duong-chau': 'Yangzhou fried rice',
  'ramen': 'Tonkotsu ramen bowl',
  'udon': 'Udon noodle bowl',
  'soba': 'Soba noodles Japan',
  'sushi': 'Sushi platter nigiri',
  'gyudon': 'Gyudon beef rice bowl',
  'katsu': 'Tonkatsu teishoku rice',
  'okonomiyaki': 'Okonomiyaki Osaka',
  'onigiri': 'Onigiri rice balls',
  'bibimbap': 'Bibimbap stone bowl',
  'tteokbokki': 'Tteokbokki street food',
  'kimbap': 'Gimbap Korean',
  'jajangmyeon': 'Jajangmyeon black bean noodles',
  'kimchi-jjigae': 'Kimchi jjigae stew',
  'samgyeopsal': 'Samgyeopsal Korean BBQ',
  'pad-thai': 'Pad Thai wok',
  'tom-yum': 'Tom yum goong soup',
  'gaeng-keow-wan': 'Thai green curry rice',
  'som-tam': 'Som tam papaya salad',
  'khao-pad': 'Thai fried rice',
  'pizza': 'Margherita pizza',
  'pasta': 'Spaghetti bolognese plate',
  'burger': 'Cheeseburger',
  'sandwich': 'Club sandwich',
  'salad': 'Green salad bowl',
  'steak': 'Grilled beef steak plate',
  'com-chay': 'Vietnamese vegetarian rice tofu vegetables',
  'banh-mi-chay': 'Vietnamese vegetarian banh mi tofu',
  'goi-cuon': 'Goi cuon Vietnamese fresh spring rolls',
  'goi-cuon-chay': 'Vegetarian Vietnamese fresh spring rolls',
  'bun-chay': 'Vietnamese vegetarian bun tofu',
  'mi-nam-chay': 'Vegetarian mushroom noodles Vietnam',
  'lau-nam-chay': 'Vegetarian mushroom hotpot',
  'ga-ran': 'Korean fried chicken or crispy fried chicken',
  'bo-luc-lac': 'Bo luc lac Vietnamese shaking beef',
  'bo-kho-banh-mi': 'Vietnamese bo kho beef stew bread',
  'xoi-man': 'Xoi man Vietnamese savory sticky rice',
  'banh-mi-chao': 'Banh mi chao skillet Vietnam egg',
  'chao-ga': 'Chao ga Vietnamese chicken congee',
  'com-binh-dan': 'Com binh dan Vietnamese rice plate',
  'nem-nuong': 'Nem nuong Vietnamese grilled pork sausage',
  'pho-cuon': 'Pho cuon Hanoi rice rolls',
}

async function search(query) {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrnamespace: '6',
      gsrsearch: query,
      gsrlimit: '8',
      prop: 'imageinfo',
      iiprop: 'url|mime',
      iiurlwidth: '800',
    })
  const res = await fetch(url, { headers: { 'User-Agent': agent, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`search ${res.status}`)
  const data = await res.json()
  const pages = Object.values(data.query?.pages ?? {})
  for (const page of pages) {
    const info = page.imageinfo?.[0]
    const file = info?.thumburl || info?.url
    if (file && /^image\/(jpeg|png|webp)$/.test(info.mime ?? '')) return file
  }
  return null
}

async function download(id, fileUrl) {
  const res = await fetch(fileUrl, { headers: { 'User-Agent': agent } })
  if (!res.ok) throw new Error(`download ${id} ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(outDir, `${id}.jpg`), buf)
}

await mkdir(outDir, { recursive: true })
const credits = []
const onlyMissing = process.argv.includes('--missing')
for (const [id, query] of Object.entries(queries)) {
  try {
    if (onlyMissing) {
      try {
        await access(join(outDir, `${id}.jpg`))
        continue
      } catch {
        /* fetch new */
      }
    }
    const file = await search(query)
    if (!file) {
      console.error('miss', id)
      continue
    }
    await download(id, file)
    credits.push(`${id}\t${file}`)
    console.log('ok', id)
  } catch (error) {
    console.error('fail', id, error.message)
  }
  await new Promise((r) => setTimeout(r, 250))
}
await writeFile(join(outDir, 'CREDITS.txt'), credits.join('\n') + '\n')
