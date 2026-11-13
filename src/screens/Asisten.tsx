// src/screens/Asisten.tsx - Asisten AI Terhubung Langsung ke Google Gemini API
import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Image as ImageIcon,
  LoaderCircle,
  Mic,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import { useApp } from '../lib/store'
import { chLabel, rp, type Channel } from '../lib/data'
import { Button, Card, inputCls, Sheet, TopBar, cx } from '../components/ui'
import { extractOrdersWithGemini, type ExtractedOrder } from '../lib/gemini'

export function Asisten() {
  const a = useApp()
  const [tab, setTab] = useState<'ketik' | 'unggah'>('ketik')
  const [inputText, setInputText] = useState('')
  const [screenshotName, setScreenshotName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<ExtractedOrder[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [fallbackMode, setFallbackMode] = useState(false)

  // Quick fill sample helpers
  const fillExampleText = () => {
    setInputText('Hari ini di ShopeeFood laku Es Kelapa Muda Original 15 cup dan Es Kuwut Bali 8 cup')
  }

  const fillExampleScreenshot = () => {
    setScreenshotName('rekap_shopeefood_12nov.png')
  }

  const handleProcessAI = async () => {
    if (fallbackMode) {
      a.toast('Mode offline aktif: Beralih ke pencatatan kasir')
      a.nav('kasir')
      return
    }

    const textToProcess =
      tab === 'ketik'
        ? inputText
        : 'Rekap ShopeeFood: 24 Es Kelapa Muda Original, 12 Es Kelapa Jeruk Segar, 18 Es Teh Melati Jumbo'

    if (tab === 'ketik' && !inputText.trim()) {
      a.toast('Tulis atau pilih contoh pesanan dulu')
      return
    }

    if (tab === 'unggah' && !screenshotName) {
      a.toast('Pilih file struk/rekap atau gunakan contoh')
      return
    }

    if (!a.useAi()) {
      a.toast('Kuota AI habis! Silakan upgrade ke Paket Dasar.')
      return
    }

    setLoading(true)

    try {
      const result = await extractOrdersWithGemini(textToProcess, a.menus, 'shopee')
      setRows(result)
      setShowConfirm(true)
    } catch (err) {
      console.error(err)
      a.toast('Gagal memproses via AI, silakan catat manual')
    } finally {
      setLoading(false)
    }
  }

  const updateQty = (idx: number, delta: number) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r
        const newQty = Math.max(1, r.qty + delta)
        const unitPrice = r.amount / r.qty
        return { ...r, qty: newQty, amount: unitPrice * newQty }
      })
    )
  }

  const removeRow = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = () => {
    a.saveLines(rows)
    setShowConfirm(false)
    setRows([])
  }

  return (
    <div data-name="Layar Asisten AI" className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header dengan Tombol Kembali */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => a.nav('kasir')}
            className="size-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center text-slate-600 cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Asisten Catat AI</h1>
            <p className="text-xs text-slate-500 font-medium">Ekstraksi Pesanan Otomatis dari Dikte atau Struk</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          Sisa Kuota: {a.aiLimit - a.aiUsed} kali
        </span>
      </div>

      <Card className="p-5 space-y-4">
        {/* Tab Pemilih */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('ketik')}
            className={cx('h-9 rounded-lg transition-all cursor-pointer', tab === 'ketik' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500')}
          >
            Ketik / Suara Dikte
          </button>
          <button
            type="button"
            onClick={() => setTab('unggah')}
            className={cx('h-9 rounded-lg transition-all cursor-pointer', tab === 'unggah' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500')}
          >
            Screenshot Rekap Struk
          </button>
        </div>

        {tab === 'ketik' ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Teks Pesanan Pelanggan</span>
              <button type="button" onClick={fillExampleText} className="text-emerald-700 font-bold hover:underline cursor-pointer">
                Isi Contoh Cepat
              </button>
            </div>
            <textarea
              className={inputCls + ' h-28 py-3 resize-none text-xs leading-relaxed'}
              placeholder="Contoh: 15 es kelapa muda shopee, 8 es kuwut bali dine in..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Unggah Gambar Rekap</span>
              <button type="button" onClick={fillExampleScreenshot} className="text-emerald-700 font-bold hover:underline cursor-pointer">
                Isi Contoh Struk
              </button>
            </div>
            <label className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center cursor-pointer hover:border-emerald-600 hover:bg-emerald-50/20 transition-all block">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setScreenshotName(e.target.files?.[0]?.name ?? null)}
              />
              <Upload size={24} className="mx-auto text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 block">
                {screenshotName || 'Pilih Gambar Screenshot Struk Rekap'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Format PNG atau JPG (Maks. 5MB)</span>
            </label>
          </div>
        )}

        <Button onClick={handleProcessAI} disabled={loading} className="w-full h-11 text-xs font-bold shadow-sm">
          {loading ? (
            <>
              <LoaderCircle size={15} className="animate-spin" /> Menganalisis dengan Google Gemini AI...
            </>
          ) : (
            <>
              <Sparkles size={15} /> Ekstrak Pesanan ke Kasir
            </>
          )}
        </Button>

        {/* Fallback Mode Offline */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setFallbackMode(!fallbackMode)
              a.toast(fallbackMode ? 'Mode Online (Gemini AI) aktif' : 'Mode Hemat Kuota (Offline Parser) aktif')
            }}
            className="text-[11px] text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
          >
            {fallbackMode ? 'Gunakan Model Online (Gemini)' : 'Aktifkan Mode Offline (Hemat Kuota)'}
          </button>
        </div>
      </Card>

      {/* Sheet Konfirmasi */}
      {showConfirm && rows.length > 0 && (
        <Sheet title="Konfirmasi Hasil Ekstraksi AI" onClose={() => setShowConfirm(false)}>
          <div className="space-y-2.5 mb-4 max-h-60 overflow-y-auto pr-1">
            {rows.map((r, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 flex items-center justify-between text-xs bg-slate-50/60">
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-900 block truncate">{r.menuName}</span>
                  <span className="text-[11px] text-slate-500">{chLabel(r.channel)} &bull; Total: {rp(r.amount)}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center rounded-lg bg-white border border-slate-200">
                    <button type="button" onClick={() => updateQty(i, -1)} className="size-6 text-slate-600 font-bold hover:bg-slate-100 cursor-pointer">-</button>
                    <span className="px-2 font-bold text-slate-900 text-xs">{r.qty}</span>
                    <button type="button" onClick={() => updateQty(i, 1)} className="size-6 text-slate-600 font-bold hover:bg-slate-100 cursor-pointer">+</button>
                  </div>
                  <button type="button" onClick={() => removeRow(i)} className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-bold mb-4 pt-2 border-t border-slate-100">
            <span>Total Nilai Penjualan:</span>
            <span className="text-base font-black text-slate-900">{rp(rows.reduce((s, r) => s + r.amount, 0))}</span>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1 h-10 text-xs">
              Batal
            </Button>
            <Button onClick={handleSave} className="flex-[2] h-10 text-xs font-bold">
              Masukkan ke Keranjang Kasir
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  )
}
