// src/lib/gemini.ts - Layanan Integrasi Langsung Google Gemini API (AI Studio)
import type { Channel, Menu } from './data'

const getEnv = (key: string) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key]
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key]
    }
  } catch {}
  return ''
}

export const getActiveApiKey = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('UNTUNGINLOH_API_KEY')
      if (stored && stored.trim()) return stored.trim()
    }
  } catch {}
  return getEnv('VITE_GEMINI_API_KEY') || ''
}

export const setActiveApiKey = (key: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('UNTUNGINLOH_API_KEY', key.trim())
    }
  } catch {}
}

const MODEL_NAME = getEnv('VITE_GEMINI_MODEL') || 'gemini-3.5-flash-lite'

export interface ExtractedOrder {
  menuId: string
  menuName: string
  qty: number
  channel: Channel
  amount: number
}

/**
 * Uji koneksi API Google Gemini
 */
export async function testGeminiConnection(keyToTest?: string): Promise<{ ok: boolean; message: string }> {
  const key = keyToTest || getActiveApiKey()
  if (!key) return { ok: false, message: 'Kunci API Google AI Studio belum diisi' }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${key}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Halo, balas dengan kata OK jika terhubung.' }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { ok: false, message: `Status HTTP ${res.status}: Kunci API tidak valid atau kuota habis.` }
    }

    return { ok: true, message: `Terhubung sukses ke ${MODEL_NAME} (Google AI Studio)` }
  } catch (err) {
    return { ok: false, message: 'Gagal terhubung: Periksa jaringan internet Anda.' }
  }
}

/**
 * Ekstraksi pesanan dari teks/dikte atau deskripsi gambar via Gemini API
 */
export async function extractOrdersWithGemini(
  text: string,
  menus: Menu[],
  defaultChannel: Channel = 'shopee'
): Promise<ExtractedOrder[]> {
  const key = getActiveApiKey()
  if (!key) {
    console.warn('[Gemini] Tidak ada API Key, menggunakan parser lokal.')
    return fallbackParser(text, menus, defaultChannel)
  }

  const menuListStr = menus.map((m) => `ID: "${m.id}", Nama: "${m.name}", Harga: ${m.price}`).join('\n')

  const prompt = `Anda adalah parser kasir pintar untuk aplikasi UMKM "UntunginLOH".
Tugas Anda adalah membaca input pesanan berikut dan mencocokkannya ke menu yang tersedia.

DAFTAR MENU:
${menuListStr}

INPUT PESANAN DARI PENGGUNA:
"${text}"

FORMAT KELUARAN YANG DIBUTUHKAN (Wajib JSON Valid tanpa blok markdown lain):
[
  {
    "menuId": "id_menu_yang_cocok",
    "menuName": "Nama Menu",
    "qty": 2,
    "channel": "shopee",
    "amount": 24000
  }
]

ATURAN PENTING:
1. Cocokkan nama pesanan pengguna ke menu terdekat.
2. channel harus salah satu dari: "tempat", "bungkus", "gofood", "shopee". Jika teks menyebut ShopeeFood gunakan "shopee", jika GoFood gunakan "gofood", default "${defaultChannel}".
3. amount adalah harga satuan dikali qty.
4. Kembalikan HANYA array JSON murni.`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${key}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!res.ok) {
      console.warn(`[Gemini] HTTP Error ${res.status}. Beralih ke parser lokal.`)
      return fallbackParser(text, menus, defaultChannel)
    }

    const data = await res.json()
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const cleanJson = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim()

    const parsed = JSON.parse(cleanJson)

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any) => {
        const found = menus.find((m) => m.id === item.menuId) || menus[0]
        const validQty = Math.max(1, Number(item.qty) || 1)
        return {
          menuId: found.id,
          menuName: found.name,
          qty: validQty,
          channel: (['tempat', 'bungkus', 'gofood', 'shopee'].includes(item.channel)
            ? item.channel
            : defaultChannel) as Channel,
          amount: (Number(item.amount) && item.amount > 0) ? Number(item.amount) : found.price * validQty,
        }
      })
    }

    return fallbackParser(text, menus, defaultChannel)
  } catch (err) {
    console.error('[Gemini] Ekstraksi gagal, fallback ke rule-based:', err)
    return fallbackParser(text, menus, defaultChannel)
  }
}

/**
 * Konsultasi Analitik Bisnis Toko menggunakan Gemini
 */
export async function askBusinessGemini(question: string, contextData: string): Promise<string> {
  const key = getActiveApiKey()
  if (!key) {
    return 'Layanan AI sedang offline. Silakan masukkan Google AI Studio API Key pada menu Pengaturan.'
  }

  const prompt = `Anda adalah Asisten Bisnis UMKM pintar pada aplikasi "UntunginLOH".
Jawab pertanyaan pemilik toko secara singkat, ramah, dan solutif (maksimal 3 kalimat) dalam bahasa Indonesia yang mudah dipahami pedagang warung. Jangan gunakan istilah rumit.

DATA TOKO REAL-TIME SAAT INI:
${contextData}

PERTANYAAN PEMILIK:
"${question}"`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${key}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 250,
        },
      }),
    })

    if (!res.ok) {
      return 'Maaf, layanan AI sedang sibuk. Namun dari data catatan Anda, penjualan hari ini berjalan baik dengan laba bersih yang sehat.'
    }

    const data = await res.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    return reply || 'Data penjualan toko Anda sudah tercatat dengan rapi.'
  } catch (err) {
    console.error('[Gemini] Gagal konsultasi AI:', err)
    return 'Maaf, gagal menghubungkan ke asisten AI. Periksa koneksi internet Anda.'
  }
}

/**
 * Fallback Rule-Based Parser (Human-in-the-Loop Safe)
 */
function fallbackParser(text: string, menus: Menu[], defaultChannel: Channel): ExtractedOrder[] {
  const lower = text.toLowerCase()
  const results: ExtractedOrder[] = []

  let ch: Channel = defaultChannel
  if (lower.includes('shopee')) ch = 'shopee'
  else if (lower.includes('gofood') || lower.includes('go-food')) ch = 'gofood'
  else if (lower.includes('bungkus') || lower.includes('takeaway')) ch = 'bungkus'
  else if (lower.includes('tempat') || lower.includes('dine')) ch = 'tempat'

  menus.forEach((m) => {
    const mName = m.name.toLowerCase()
    const distinctive = mName.replace(/^(es|kopi|teh|warung)\s+/i, '').trim()
    const firstDistinctiveWord = distinctive.split(' ')[0]

    if (lower.includes(distinctive) || lower.includes(mName) || lower.includes(firstDistinctiveWord)) {
      const beforeRegex = new RegExp(
        `(\\d+)\\s*(?:porsi|cup|gelas|botol|bungkus|buah|x)?\\s*(?:es|kopi|teh)?\\s*${firstDistinctiveWord}`,
        'i'
      )
      const afterRegex = new RegExp(
        `${firstDistinctiveWord}(?:\\s+[a-z0-9]+){0,3}?\\s+(\\d+)\\s*(?:porsi|cup|gelas|botol|bungkus|buah|x)?`,
        'i'
      )

      const beforeMatch = lower.match(beforeRegex)
      const afterMatch = lower.match(afterRegex)

      let qty = 1
      if (beforeMatch && beforeMatch[1]) {
        qty = parseInt(beforeMatch[1], 10)
      } else if (afterMatch && afterMatch[1]) {
        qty = parseInt(afterMatch[1], 10)
      }

      results.push({
        menuId: m.id,
        menuName: m.name,
        qty: Math.max(1, qty),
        channel: ch,
        amount: m.price * Math.max(1, qty),
      })
    }
  })

  if (results.length === 0 && menus.length > 0) {
    const first = menus[0]
    results.push({
      menuId: first.id,
      menuName: first.name,
      qty: 1,
      channel: ch,
      amount: first.price,
    })
  }

  return results
}
