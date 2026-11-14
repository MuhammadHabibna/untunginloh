// src/lib/data.ts - Data Models & Dictionary for UntunginLOH

export type Channel = 'tempat' | 'bungkus' | 'gofood' | 'shopee'

export interface ChannelInfo {
  id: Channel
  label: string
  defaultComm: number
}

export const CHANNELS: ChannelInfo[] = [
  { id: 'tempat', label: 'Di Tempat', defaultComm: 0 },
  { id: 'bungkus', label: 'Bungkus', defaultComm: 0 },
  { id: 'gofood', label: 'GoFood', defaultComm: 20 },
  { id: 'shopee', label: 'ShopeeFood', defaultComm: 20 },
]

export const chLabel = (c: Channel) => CHANNELS.find((x) => x.id === c)?.label ?? c
export const DEFAULT_COMM: Record<Channel, number> = { tempat: 0, bungkus: 0, gofood: 20, shopee: 20 }

export const rp = (n: number) => {
  const rounded = Math.round(n)
  return (rounded < 0 ? '-' : '') + 'Rp' + Math.abs(rounded).toLocaleString('id-ID')
}

// ==========================================
// KAMUS ISTILAH & EDUKASI UMKM (IKON (i) POPUP)
// ==========================================
export interface TermInfo {
  key: string
  title: string
  subtitle: string
  desc: string
  formula: string
}

export const TERMS: Record<string, TermInfo> = {
  hpp: {
    key: 'hpp',
    title: 'Modal per Porsi (HPP)',
    subtitle: 'Cost of Goods Sold (COGS)',
    desc: 'Total biaya bahan baku dan kemasan yang dikeluarkan langsung untuk membuat 1 porsi menu.',
    formula: 'Total Harga Semua Takaran Bahan Baku + Kemasan.',
  },
  margin: {
    key: 'margin',
    title: 'Untung Bersih (Net Margin)',
    subtitle: 'Net Profit Margin per Porsi',
    desc: 'Uang riil yang benar-benar masuk ke kantong Anda setelah harga jual dipotong modal bahan dan komisi aplikasi.',
    formula: 'Harga Jual - Modal Bahan - Potongan Aplikasi.',
  },
  omzet: {
    key: 'omzet',
    title: 'Penjualan (Omzet Kotor)',
    subtitle: 'Gross Revenue',
    desc: 'Total uang masuk dari pembeli sebelum dikurangi biaya belanja bahan dan komisi platform pesan-antar.',
    formula: 'Akumulasi seluruh harga jual transaksi.',
  },
  komisi: {
    key: 'komisi',
    title: 'Potongan Aplikasi (Platform Fee)',
    subtitle: 'Merchant Service Fee / Komisi',
    desc: 'Persentase komisi yang dipotong oleh GoFood/ShopeeFood (biasanya 20%) dari setiap pesanan online.',
    formula: 'Harga Jual × Persentase Potongan Aplikasi (misal 20%).',
  },
  jalur: {
    key: 'jalur',
    title: 'Jalur Jualan (Sales Channel)',
    subtitle: 'Multi-Channel Sales Distribution',
    desc: 'Saluran tempat transaksi terjadi. Tiap jalur memiliki skema komisi dan margin yang berbeda-beda.',
    formula: 'Di Tempat (0%), Bungkus (0%), GoFood (20%), ShopeeFood (20%).',
  },
  resep: {
    key: 'resep',
    title: 'Resep dan Takaran (BOM)',
    subtitle: 'Bill of Materials',
    desc: 'Komposisi bahan baku yang otomatis menghitung ulang modal per porsi setiap kali harga pasar naik/turun.',
    formula: '∑ (Jumlah Takaran × Harga Beli Bahan).',
  },
  toko: {
    key: 'toko',
    title: 'Toko (Workspace UMKM)',
    subtitle: 'Multi-Tenant Isolated Environment',
    desc: 'Ruang kerja digital mandiri. Data resep, kasir, dan untung antar-toko terpisah aman dan terisolasi.',
    formula: 'Row-Level Security (RLS) per tenant.',
  },
  forecast: {
    key: 'forecast',
    title: 'Perkiraan Penjualan (7-Day Moving Average)',
    subtitle: 'Moving Average Trend Projection',
    desc: 'Proyeksi tren penjualan 7 hari ke depan berdasarkan pola rata-rata bergerak dari riwayat transaksi toko Anda.',
    formula: 'Rata-rata transaksi 7 hari terakhir + faktor bobot kelengkapan data.',
  },
  simulasi: {
    key: 'simulasi',
    title: 'Data Sampel Toko Baru',
    subtitle: 'Pre-seeded Sample Dataset',
    desc: 'Kumpulan data sampel operasional agar pemilik toko dapat langsung meninjau seluruh analisis keuntungan dan prediksi tanpa harus menunggu 7 hari pertama.',
    formula: 'Riwayat 6 hari penjualan terintegrasi, siap diperbarui secara real-time dari kasir POS.',
  },
}

// ==========================================
// MODEL DATA BAHAN & MENU
// ==========================================
export interface Ingredient {
  id: string
  name: string
  amount: number
  unit: string
  unitPrice: number
  stock?: number
  ai?: boolean
}

export interface Menu {
  id: string
  name: string
  price: number
  icon: 'kelapa' | 'teh' | 'kopi' | 'makan' | 'mie' | 'snack'
  favorite?: boolean
  ingredients: Ingredient[]
}

const ing = (id: string, name: string, amount: number, unit: string, unitPrice: number, stock = 100, ai = false): Ingredient => ({
  id, name, amount, unit, unitPrice, stock, ai,
})

// TOKO A: Kedai Kelapa Muda Segar
export const MENUS_TOKO_A: Menu[] = [
  {
    id: 'kelapa_ori',
    name: 'Es Kelapa Muda Original',
    price: 12000,
    icon: 'kelapa',
    favorite: true,
    ingredients: [
      ing('a1', 'Kelapa muda', 1, 'butir', 4000, 24),
      ing('a2', 'Sirup gula murni', 30, 'ml', 40, 2500),
      ing('a3', 'Es batu kristal', 150, 'gram', 5, 8000),
      ing('a4', 'Cup 16oz & sedotan', 1, 'set', 550, 120),
    ],
  },
  {
    id: 'kelapa_jeruk',
    name: 'Es Kelapa Jeruk Segar',
    price: 14000,
    icon: 'kelapa',
    favorite: true,
    ingredients: [
      ing('b1', 'Kelapa muda', 1, 'butir', 4000, 24),
      ing('b2', 'Perasan jeruk asli', 60, 'ml', 25, 1800),
      ing('b3', 'Sirup gula murni', 20, 'ml', 40, 2500),
      ing('b4', 'Es batu kristal', 150, 'gram', 5, 8000),
      ing('b5', 'Biji selasih', 1, 'sdm', 200, 450),
      ing('b6', 'Cup 16oz & sedotan', 1, 'set', 550, 120),
    ],
  },
  {
    id: 'kelapa_kuwut',
    name: 'Es Kuwut Bali Segar',
    price: 13000,
    icon: 'kelapa',
    favorite: true,
    ingredients: [
      ing('c1', 'Kelapa muda serut', 0.8, 'butir', 4000, 24),
      ing('c2', 'Melon serut', 50, 'gram', 30, 1200),
      ing('c3', 'Jeruk nipis peras', 1, 'buah', 1000, 40),
      ing('c4', 'Biji selasih', 1, 'sdm', 200, 450),
      ing('c5', 'Cup 16oz & sedotan', 1, 'set', 550, 120),
    ],
  },
  {
    id: 'kelapa_gula',
    name: 'Es Kelapa Gula Aren',
    price: 15000,
    icon: 'kelapa',
    favorite: false,
    ingredients: [
      ing('d1', 'Kelapa muda', 1, 'butir', 4000, 24),
      ing('d2', 'Gula aren organik cair', 40, 'ml', 45, 1500),
      ing('d3', 'Santan peras kental', 20, 'ml', 55, 800),
      ing('d4', 'Es batu kristal', 150, 'gram', 5, 8000),
      ing('d5', 'Cup 16oz & sedotan', 1, 'set', 550, 120),
    ],
  },
  {
    id: 'teh_manis',
    name: 'Es Teh Melati Jumbo',
    price: 5000,
    icon: 'teh',
    favorite: true,
    ingredients: [
      ing('e1', 'Teh melati tubruk', 1, 'porsi', 300, 500),
      ing('e2', 'Gula pasir premium', 25, 'gram', 16, 4000),
      ing('e3', 'Es batu kristal', 120, 'gram', 5, 8000),
      ing('e4', 'Cup 22oz & sedotan', 1, 'set', 450, 200),
    ],
  },
  {
    id: 'kopi_susu',
    name: 'Kopi Susu Aren Gelas',
    price: 12000,
    icon: 'kopi',
    favorite: false,
    ingredients: [
      ing('f1', 'Espresso robusta', 1, 'shot', 1500, 300),
      ing('f2', 'Susu segar UHT', 80, 'ml', 25, 2000),
      ing('f3', 'Gula aren cair', 20, 'ml', 40, 1500),
      ing('f4', 'Cup 14oz & sedotan', 1, 'set', 450, 150),
    ],
  },
]

// TOKO B: Warung Kopi Senja (Untuk pembuktian isolasi data multi-toko)
export const MENUS_TOKO_B: Menu[] = [
  {
    id: 'kopi_tubruk',
    name: 'Kopi Tubruk Tradisional',
    price: 8000,
    icon: 'kopi',
    favorite: true,
    ingredients: [
      ing('b_k1', 'Bubuk kopi dampit', 15, 'gram', 120, 1000),
      ing('b_k2', 'Gula pasir', 20, 'gram', 16, 3000),
      ing('b_k3', 'Cangkir keramik', 1, 'cuci', 150, 999),
    ],
  },
  {
    id: 'mie_goreng',
    name: 'Mie Goreng Spesial Telur',
    price: 16000,
    icon: 'mie',
    favorite: true,
    ingredients: [
      ing('b_m1', 'Mie kuning', 1, 'keping', 2500, 80),
      ing('b_m2', 'Telur ayam', 1, 'butir', 2200, 60),
      ing('b_m3', 'Bumbu rahasia & sawi', 1, 'porsi', 1800, 100),
      ing('b_m4', 'Kotak mika takeaway', 1, 'buah', 600, 150),
    ],
  },
  {
    id: 'pisang_keju',
    name: 'Pisang Crispy Keju Susu',
    price: 14000,
    icon: 'snack',
    favorite: false,
    ingredients: [
      ing('b_p1', 'Pisang kepok', 3, 'buah', 1200, 90),
      ing('b_p2', 'Tepung crispy', 50, 'gram', 20, 2000),
      ing('b_p3', 'Keju cheddar parut', 25, 'gram', 45, 800),
      ing('b_p4', 'Susu kental manis', 30, 'ml', 25, 1500),
    ],
  },
]

// Helper Kalkulasi Keuangan
export const modal = (m: Menu) => Math.round(m.ingredients.reduce((s, i) => s + i.amount * i.unitPrice, 0))
export const unitProfit = (m: Menu, comm: Record<Channel, number>, ch: Channel) => {
  const sellingPrice = m.price
  const commission = (sellingPrice * (comm[ch] ?? 0)) / 100
  return Math.round(sellingPrice - commission - modal(m))
}
export const marginPct = (m: Menu, comm: Record<Channel, number>, ch: Channel) => {
  const p = unitProfit(m, comm, ch)
  return (p / m.price) * 100
}
export const worstMargin = (m: Menu, comm: Record<Channel, number>) => Math.min(...CHANNELS.map((c) => marginPct(m, comm, c.id)))

// ==========================================
// MODEL DATA TRANSAKSI
// ==========================================
export interface Line {
  menuId: string
  qty: number
  amount?: number
}

export interface Tx {
  id: string
  day: 'today' | 'yesterday' | 'past'
  dateLabel: string
  time: string
  channel: Channel
  lines: { menuId: string; qty: number }[]
  sales: number
  commission: number
  cost: number
  profit: number
  by: string
  seed?: boolean
}

export function buildTx(
  menus: Menu[],
  comm: Record<Channel, number>,
  channel: Channel,
  lines: Line[],
  by: string,
  day: Tx['day'],
  time: string,
  id: string,
  dateLabel = 'Hari Ini',
  seed = false
): Tx {
  let sales = 0
  let cost = 0
  for (const l of lines) {
    const m = menus.find((x) => x.id === l.menuId)
    if (!m) continue
    sales += l.amount ?? m.price * l.qty
    cost += modal(m) * l.qty
  }
  const commission = Math.round((sales * (comm[channel] ?? 0)) / 100)
  const profit = sales - commission - cost
  return {
    id,
    day,
    dateLabel,
    time,
    channel,
    lines: lines.map((l) => ({ menuId: l.menuId, qty: l.qty })),
    sales,
    commission,
    cost,
    profit,
    by,
    seed,
  }
}

// Data Awal Pre-seeded (Data Contoh Toko A)
const S = (id: string, day: Tx['day'], dateLabel: string, time: string, ch: Channel, lines: Line[], by: string) =>
  buildTx(MENUS_TOKO_A, DEFAULT_COMM, ch, lines, by, day, time, id, dateLabel, true)

export const SEED_TX_TOKO_A: Tx[] = [
  S('s1', 'today', 'Hari Ini', '14.32', 'shopee', [{ menuId: 'kelapa_ori', qty: 2 }], 'Bu Sari (Pemilik)'),
  S('s2', 'today', 'Hari Ini', '13.50', 'tempat', [{ menuId: 'kopi_susu', qty: 1 }, { menuId: 'teh_manis', qty: 2 }], 'Budi (Kasir)'),
  S('s3', 'today', 'Hari Ini', '12.41', 'gofood', [{ menuId: 'kelapa_jeruk', qty: 1 }, { menuId: 'teh_manis', qty: 1 }], 'Bu Sari (Pemilik)'),
  S('s4', 'today', 'Hari Ini', '11.20', 'bungkus', [{ menuId: 'kelapa_kuwut', qty: 3 }], 'Budi (Kasir)'),
  S('s5', 'yesterday', 'Kemarin', '19.05', 'tempat', [{ menuId: 'kelapa_ori', qty: 4 }], 'Bu Sari (Pemilik)'),
  S('s6', 'yesterday', 'Kemarin', '16.48', 'shopee', [{ menuId: 'kelapa_kuwut', qty: 2 }, { menuId: 'kopi_susu', qty: 1 }], 'Budi (Kasir)'),
  S('s7', 'yesterday', 'Kemarin', '10.12', 'gofood', [{ menuId: 'kelapa_ori', qty: 1 }, { menuId: 'kelapa_jeruk', qty: 1 }], 'Bu Sari (Pemilik)'),
]

export const SEED_TX_TOKO_B: Tx[] = [
  buildTx(MENUS_TOKO_B, DEFAULT_COMM, 'tempat', [{ menuId: 'kopi_tubruk', qty: 3 }, { menuId: 'pisang_keju', qty: 1 }], 'Mas Seno (Pemilik)', 'today', '15.10', 'tb1', 'Hari Ini', true),
  buildTx(MENUS_TOKO_B, DEFAULT_COMM, 'shopee', [{ menuId: 'mie_goreng', qty: 2 }], 'Mas Seno (Pemilik)', 'today', '13.20', 'tb2', 'Hari Ini', true),
]

export const BASE_SALES_TOKO_A = 1240000
export const BASE_PROFIT_TOKO_A = 385000
export const YESTERDAY_PROFIT_TOKO_A = 343750

// 6 Hari Riwayat Transaksi Simulasi + Tren Moving Average
export const SALES_7D = [980, 1050, 890, 1120, 1310, 1450, 1240] // dalam ribuan Rp
export const FORECAST_7D = [1150, 1190, 1080, 1260, 1380, 1520, 1310] // perkiraan moving average 7 hari

export const PROFIT_BY_CHANNEL: { id: Channel; value: number }[] = [
  { id: 'tempat', value: 168000 },
  { id: 'bungkus', value: 52000 },
  { id: 'gofood', value: 83000 },
  { id: 'shopee', value: 82000 },
]

export const ACTION_INSIGHT =
  'Peringatan Margin: Es Kelapa Muda di ShopeeFood hanya untung Rp3.100 per gelas (15%) akibat potongan komisi 20% dan kenaikan bahan. Rekomendasi Tindakan: Naikkan harga khusus ShopeeFood jadi Rp14.000 agar untung bersih pulih ke Rp4.700 (33%).'

// Template Usaha untuk Onboarding
export const TEMPLATES = [
  {
    id: 'minuman',
    name: 'Kedai Minuman & Es',
    desc: 'Es kelapa muda, kopi susu, es teh, aneka jus buah',
    menus: ['Es Kelapa Muda', 'Es Kelapa Jeruk', 'Es Kuwut Bali', 'Es Teh Melati', 'Kopi Susu Aren'],
    bahan: ['Kelapa muda', 'Sirup gula', 'Jeruk asli', 'Es batu', 'Biji selasih', 'Cup 16oz & sedotan'],
  },
  {
    id: 'warung',
    name: 'Warung Makan & Kuliner',
    desc: 'Nasi ayam, soto, lauk pauk, lalapan, sambal',
    menus: ['Nasi Ayam Goreng', 'Nasi Telur Dadar', 'Soto Ayam Lamongan', 'Es Teh Manis'],
    bahan: ['Beras premium', 'Daging ayam segar', 'Telur ayam', 'Minyak goreng', 'Bumbu rempah dapur'],
  },
  {
    id: 'snack',
    name: 'Bakery, Kue & Camilan',
    desc: 'Roti bakar, martabak, pastry, aneka gorengan, dimsum',
    menus: ['Roti Bakar Cokelat Keju', 'Pisang Crispy Keju', 'Dimsum Ayam Mentai', 'Tahu Walik'],
    bahan: ['Tepung terigu', 'Keju cheddar', 'Cokelat meses', 'Pisang raja', 'Minyak goreng'],
  },
  {
    id: 'ritel',
    name: 'Ritel Mikro & Toko Kelontong',
    desc: 'Camilan kemasan, sembako, minuman dingin, rokok',
    menus: ['Air Mineral Dingin', 'Mi Instan Siap Santap', 'Kopi Sachet Seduh', 'Roti Tawar'],
    bahan: ['Stok kulakan grosir', 'Kemasan plastik belanja', 'Gas LPG'],
  },
  {
    id: 'jasa',
    name: 'Usaha Jasa & Kreatif',
    desc: 'Laundry kiloan, barbershop, percetakan, kerajinan tangan',
    menus: ['Cuci Komplit Reguler', 'Cuci Kilat Express', 'Setrika Uap Per Kilo'],
    bahan: ['Deterjen cair konsentrat', 'Pewangi pakaian', 'Plastik packing kedap', 'Tag nota kasir'],
  },
  {
    id: 'lainnya',
    name: 'Lainnya (Kustomisasi Mandiri)',
    desc: 'Pilihan fleksibel untuk bidang usaha lain yang ingin mengatur menu & resep sendiri',
    menus: ['Produk / Layanan Utama', 'Paket Hemat', 'Varian Spesial'],
    bahan: ['Bahan baku / modal dasar 1', 'Bahan baku 2', 'Kemasan / operasional'],
  },
]

export function getTodayIso(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatIndoDate(isoStr: string): string {
  if (!isoStr) return ''
  const parts = isoStr.split('-')
  if (parts.length !== 3) return isoStr
  const [y, m, d] = parts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const mIdx = parseInt(m, 10) - 1
  return `${parseInt(d, 10)} ${months[mIdx] || m} ${y}`
}
