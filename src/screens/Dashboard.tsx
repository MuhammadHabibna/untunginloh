// src/screens/Dashboard.tsx - Dashboard Web & Mobile Responsif Profesional UntunginLOH
import { useState, useRef, useEffect } from 'react'
import {
  ArrowUp,
  Coins,
  Cpu,
  Flame,
  LoaderCircle,
  MessageCircle,
  MessageSquare,
  Package,
  Send,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Trophy,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../lib/store'
import {
  ACTION_INSIGHT,
  chLabel,
  FORECAST_7D,
  PROFIT_BY_CHANNEL,
  rp,
  SALES_7D,
} from '../lib/data'
import { Button, Card, InfoTip, inputCls } from '../components/ui'
import { askBusinessGemini } from '../lib/gemini'

function MovingAverageChart() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const W = 520
  const H = 160
  const pad = 16
  const allData = [...SALES_7D, ...FORECAST_7D]
  const max = 1600
  const min = 700

  const getX = (i: number) => pad + (i * (W - 2 * pad)) / (allData.length - 1)
  const getY = (v: number) => H - pad - ((v - min) / (max - min)) * (H - 2 * pad)

  const ptsPast = SALES_7D.map((v, i) => `${getX(i)},${getY(v)}`).join(' ')
  const ptsForecast = `${getX(6)},${getY(SALES_7D[6])} ` + FORECAST_7D.map((v, i) => `${getX(i + 7)},${getY(v)}`).join(' ')

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  const allDays = [
    'Senin (Realisasi)',
    'Selasa (Realisasi)',
    'Rabu (Realisasi)',
    'Kamis (Realisasi)',
    'Jumat (Realisasi)',
    'Sabtu (Realisasi)',
    'Minggu (Realisasi)',
    'Senin (Proyeksi)',
    'Selasa (Proyeksi)',
    'Rabu (Proyeksi)',
    'Kamis (Proyeksi)',
    'Jumat (Proyeksi)',
    'Sabtu (Proyeksi)',
    'Minggu (Proyeksi)',
  ]

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full h-auto select-none">
        {[800, 1100, 1400].map((val) => (
          <line
            key={val}
            x1={pad}
            x2={W - pad}
            y1={getY(val)}
            y2={getY(val)}
            stroke="#F1F5F9"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        ))}

        {/* Garis Batas Hari Ini */}
        <line
          x1={getX(6.5)}
          x2={getX(6.5)}
          y1={pad}
          y2={H}
          stroke="#10B981"
          strokeDasharray="3 3"
          strokeWidth="1.5"
        />

        {/* Polylines */}
        <polyline
          points={ptsPast}
          fill="none"
          stroke="#15803D"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={ptsForecast}
          fill="none"
          stroke="#D97706"
          strokeWidth="3.5"
          strokeDasharray="5 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Realisasi Dots */}
        {SALES_7D.map((v, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(v)}
            r={activeIdx === i ? 6 : 4}
            fill="#15803D"
            stroke={activeIdx === i ? '#FFFFFF' : 'none'}
            strokeWidth={activeIdx === i ? 2 : 0}
            className="transition-all"
          />
        ))}

        {/* Forecast Dots */}
        {FORECAST_7D.map((v, i) => {
          const idx = i + 7
          return (
            <circle
              key={`fc-${i}`}
              cx={getX(idx)}
              cy={getY(v)}
              r={activeIdx === idx ? 6 : 3.5}
              fill="#D97706"
              stroke={activeIdx === idx ? '#FFFFFF' : '#FEF3C7'}
              strokeWidth={activeIdx === idx ? 2 : 1}
              className="transition-all"
            />
          )
        })}

        {/* Area Sentuh Interaktif untuk Setiap Titik */}
        {allData.map((v, i) => (
          <circle
            key={`hit-${i}`}
            cx={getX(i)}
            cy={getY(v)}
            r="16"
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          />
        ))}

        {/* Tooltip Nilai Rupiah Aktif */}
        {activeIdx !== null && (
          <g className="anim-fade-in pointer-events-none">
            <rect
              x={Math.max(8, Math.min(W - 138, getX(activeIdx) - 65))}
              y={Math.max(4, getY(allData[activeIdx]) - 32)}
              width="130"
              height="26"
              rx="6"
              fill="#0F172A"
            />
            <text
              x={Math.max(8 + 65, Math.min(W - 138 + 65, getX(activeIdx)))}
              y={Math.max(4 + 17, getY(allData[activeIdx]) - 15)}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="700"
            >
              {allDays[activeIdx].split(' ')[0]}: Rp{(allData[activeIdx] * 1000).toLocaleString('id-ID')}
            </text>
          </g>
        )}

        {/* Days Label */}
        {[...days, ...days].map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={H + 18}
            textAnchor="middle"
            fontSize="11"
            fontWeight={activeIdx === i ? '700' : '600'}
            fill={activeIdx === i ? '#0F172A' : i < 7 ? '#15803D' : '#D97706'}
            className="cursor-pointer"
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          >
            {d}
          </text>
        ))}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-emerald-800">
          <span className="w-3.5 h-1 bg-emerald-700 rounded-full" /> 7 Hari Realisasi Penjualan
        </span>
        <span className="flex items-center gap-1.5 text-amber-700">
          <span className="w-3.5 border-t-2 border-dashed border-amber-600" /> Proyeksi Moving Average
        </span>
      </div>
    </figure>
  )
}

export function Dashboard() {
  const a = useApp()
  const naik = ((a.todayProfit / a.yesterdayProfit - 1) * 100).toFixed(0)
  const maxCh = Math.max(...PROFIT_BY_CHANNEL.map((c) => c.value))

  return (
    <div data-name="Layar Dashboard" className="p-4 lg:p-8 space-y-6">
      {/* Header Web */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Dashboard Ringkasan</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {a.shop.name} &bull; {a.shop.city} &bull; Pemilik: {a.shop.ownerName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {a.plan === 'trial' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <span className="font-semibold text-amber-900">Trial {a.trialDaysLeft} Hari</span>
              <button
                type="button"
                onClick={() => a.nav('paket')}
                className="text-amber-800 font-bold underline hover:text-amber-950 cursor-pointer"
              >
                Upgrade Rp24.500
              </button>
            </div>
          )}

          <Button
            variant="secondary"
            className="h-10 text-xs px-3.5 shadow-xs"
            onClick={() => a.nav('tanya')}
          >
            <MessageCircle size={15} className="text-emerald-700" />
            <span>Tanya Bisnis AI</span>
          </Button>
        </div>
      </div>

      {/* 1. ROW 1: 4 KARTU METRIK UTAMA (GRID 4 KOLOM DI DESKTOP) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Untung Bersih (Hero Metric Pekat & Kontras Tinggi) */}
        <Card className="!bg-[#064e3b] text-white p-5 !border-[#043d2e] shadow-md flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-default">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-100 font-bold mb-1.5">
              <span className="flex items-center">
                Untung Bersih Hari Ini <InfoTip termKey="margin" className="text-emerald-200 hover:text-white" />
              </span>
              <Coins size={16} className="text-emerald-300" />
            </div>
            <div className="text-2xl lg:text-3xl font-black tracking-tight text-white">{rp(a.todayProfit)}</div>
          </div>
          <div className="text-xs text-emerald-200 font-bold flex items-center gap-1 mt-3 pt-2 border-t border-emerald-700/70">
            <ArrowUp size={14} className="text-emerald-300 shrink-0" />
            <span>+{naik}% dari kemarin ({rp(a.yesterdayProfit)})</span>
          </div>
        </Card>

        {/* Card 2: Penjualan */}
        <Card className="p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 cursor-default border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1.5">
              <span className="flex items-center">
                Penjualan Kotor <InfoTip termKey="omzet" />
              </span>
              <ShoppingBag size={16} className="text-slate-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-black text-slate-900">{rp(a.todaySales)}</div>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100 block">
            Akumulasi seluruh jalur jualan
          </span>
        </Card>

        {/* Card 3: Rata-rata Modal per Porsi (HPP) */}
        <Card className="p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 cursor-default border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1.5">
              <span className="flex items-center">
                Rata-rata HPP <InfoTip termKey="hpp" />
              </span>
              <Package size={16} className="text-slate-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-black text-slate-900">{rp(4350)}</div>
          </div>
          <span className="text-xs text-emerald-800 font-extrabold mt-3 pt-2 border-t border-slate-100 block">
            HPP stabil terkendali
          </span>
        </Card>

        {/* Card 4: Sisa Kuota AI */}
        <Card className="p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 cursor-default border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1.5">
              <span>Kuota AI Aktif</span>
              <Cpu size={16} className="text-emerald-800 animate-pulse" />
            </div>
            <div className="text-2xl lg:text-3xl font-black text-slate-900">
              {a.aiLimit - a.aiUsed} <span className="text-sm font-semibold text-slate-500">/ {a.aiLimit}</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100 block truncate">
            {a.plan === 'trial' ? 'Paket Free Trial 14 Hari' : 'Paket Dasar UMKM'}
          </span>
        </Card>
      </div>

      {/* 2. PROGRESS KELENGKAPAN DATA 14 HARI & RINGKASAN AI (Sesuai Spesifikasi PRD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Indikator Kemajuan Data 14 Hari */}
        <Card className="lg:col-span-6 p-4 flex flex-col justify-between bg-white border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-extrabold text-slate-900">
                Progres Pengumpulan Data Toko
              </span>
              <span className="font-bold text-slate-600">
                {a.dataDaysCount} dari {a.targetDaysCount} Hari
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Kumpulkan minimal 14 hari pencatatan kasir untuk akurasi moving average tertinggi.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all"
                style={{ width: `${(a.dataDaysCount / a.targetDaysCount) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Status Keandalan Model:</span>
              <span className="font-bold text-amber-700">{a.confidenceLevel}</span>
            </div>
          </div>
        </Card>

        {/* Ringkasan AI Harian */}
        <Card className="lg:col-span-6 p-4 flex flex-col justify-center bg-emerald-50/40 border-emerald-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={16} className="text-emerald-700" />
              <span className="font-extrabold text-xs text-emerald-950">
                Ringkasan AI Harian
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Penjualan toko hari ini berjalan stabil dengan untung bersih Rp312.000. Perhatian khusus pada jalur ShopeeFood di mana margin hanya 15% akibat komisi 20%.
            </p>
          </div>
        </Card>
      </div>

      {/* 3. ROW 3: SPLIT VIEW DI DESKTOP (GRAFIK DI KIRI, JALUR JUALAN DI KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kolom Kiri: Tren & Proyeksi 7 Hari + Action Alert */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Alert Banner */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-xl bg-amber-500 text-slate-950 grid place-items-center shrink-0 mt-0.5">
                <Flame size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                  {a.actionDone ? 'Penyesuaian Telah Diterapkan' : 'Peringatan Margin ShopeeFood'}
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
                  {a.actionDone
                    ? 'Harga jual Es Kelapa di ShopeeFood telah disesuaikan ke Rp14.000. Untung bersih per porsi pulih ke Rp4.700 (33%).'
                    : 'Es Kelapa Muda di ShopeeFood hanya untung Rp3.100 (15%) akibat potongan komisi 20%. Rekomendasi: Naikkan harga khusus online ke Rp14.000.'}
                </p>
              </div>
            </div>

            {!a.actionDone && (
              <button
                type="button"
                onClick={() => {
                  a.setActionDone(true)
                  a.toast('Harga jual ShopeeFood disesuaikan ke Rp14.000!')
                }}
                className="px-4 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                Terapkan Sekarang
              </button>
            )}
          </div>

          {/* Grafik 7 Hari */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center">
                  Tren &amp; Proyeksi Penjualan 7 Hari <InfoTip termKey="forecast" />
                </h3>
                <span className="text-xs text-slate-400">Algoritma 7-Day Moving Average &bull; Tingkat Kepercayaan: Sedang</span>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Basis: 6 Hari Data
              </span>
            </div>

            <MovingAverageChart />

            {/* Kotak Insight Praktis UMKM */}
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-emerald-700 text-white grid place-items-center shrink-0 mt-0.5 shadow-xs">
                <Sparkles size={16} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-emerald-950">
                    Insight Bisnis &amp; Rekomendasi:
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-200/90 text-emerald-900">
                    Peluang Akhir Pekan
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Penjualan toko Anda konsisten melonjak pada hari <strong>Sabtu &amp; Minggu</strong> (diproyeksikan tembus <strong>Rp1.520.000/hari</strong>). Hari Rabu merupakan titik penjualan paling tenang.
                </p>
                <p className="text-xs text-emerald-900 font-semibold pt-0.5">
                  💡 <strong>Saran Aksi:</strong> Siapkan tambahan stok bahan baku es kelapa dan cup kemasan sejak hari Jumat siang agar tidak kehabisan porsi saat jam sibuk pesanan akhir pekan.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Kolom Kanan: Sebaran Untung per Jalur Jualan & Menu Terlaris */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center">
                Untung Bersih per Jalur Jualan <InfoTip termKey="jalur" />
              </h3>
              <span className="text-xs text-emerald-700 font-bold">Hari Ini</span>
            </div>

            <div className="space-y-4">
              {PROFIT_BY_CHANNEL.map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">{chLabel(c.id)}</span>
                    <span className="font-extrabold text-slate-900">{rp(c.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all"
                      style={{ width: `${(c.value / maxCh) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card Menu Unggulan */}
          <Card className="p-5 bg-gradient-to-br from-white to-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Performa Produk Terlaris
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-100 text-amber-800 grid place-items-center">
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">Es Kelapa Muda Original</h4>
                  <span className="text-xs text-slate-500">42 porsi terjual hari ini</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-700 block">+Rp231.000</span>
                <span className="text-[10px] text-slate-400">Total Untung</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  animate?: boolean
}

function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let index = 0
    setDisplayed('')
    setIsDone(false)

    // Kecepatan ketik halus 14ms per karakter
    const timer = setInterval(() => {
      index += 1
      setDisplayed(text.slice(0, index))
      if (index >= text.length) {
        clearInterval(timer)
        setIsDone(true)
        onDone?.()
      }
    }, 14)

    return () => clearInterval(timer)
  }, [text])

  return (
    <span>
      {displayed}
      {!isDone && (
        <span className="inline-block w-1.5 h-3.5 bg-emerald-700 ml-1 animate-pulse align-middle" />
      )}
    </span>
  )
}

/* Screen Tanya AI Real Time */
export function Tanya() {
  const a = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      role: 'ai',
      text: 'Halo! Saya asisten analitik toko UntunginLOH. Ada yang ingin Anda tanyakan seputar untung bersih, komisi, atau efisiensi bahan baku?',
      animate: false,
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [isReasoning, setIsReasoning] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isReasoning])

  const quickQuestions = [
    'Menu apa yang untungnya paling tipis di ShopeeFood?',
    'Berapa total untung bersih toko kita hari ini?',
    'Bahan baku apa yang perlu segera dikulakan?',
  ]

  const ask = async (q: string) => {
    if (!q.trim() || isReasoning) return
    if (!a.useAi()) {
      a.toast('Kuota AI habis! Silakan upgrade ke Paket Dasar.')
      return
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: q.trim(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal('')
    setIsReasoning(true)

    const context = `Toko: ${a.shop.name}, Untung Hari Ini: ${rp(a.todayProfit)}, Penjualan: ${rp(a.todaySales)}, Stok Kelapa: 24 butir, ShopeeFood Es Kelapa margin Rp3.100 (15%) modal Rp4.550.`

    try {
      const answer = await askBusinessGemini(q, context)
      setIsReasoning(false)

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        text: answer,
        animate: true,
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setIsReasoning(false)
      const errorMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        text: 'Maaf, terjadi kendala saat menalar jawaban toko. Silakan coba kembali sesaat lagi.',
        animate: false,
      }
      setMessages((prev) => [...prev, errorMsg])
    }
  }

  const handleFinishAnimation = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, animate: false } : m))
    )
  }

  return (
    <div data-name="Layar Tanya AI" className="p-4 lg:p-8 max-w-3xl mx-auto min-h-dvh flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-lg lg:text-xl font-black text-slate-900">Tanya Bisnis AI</h1>
            <p className="text-xs text-slate-500 font-medium">Konsultasi Margin &amp; Analitik Toko Real-Time</p>
          </div>
          <Button variant="secondary" className="h-9 text-xs" onClick={() => a.nav('dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>

        {/* Quick Questions */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-500">Pertanyaan Cepat:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => ask(q)}
                className="rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-emerald-500 transition-colors cursor-pointer shadow-2xs flex items-start gap-1.5"
              >
                <MessageSquare size={13} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="space-y-3 pt-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col anim-fade-in-up ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl p-4 max-w-[85%] text-xs leading-relaxed shadow-xs transition-all ${
                  m.role === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {m.role === 'ai' && m.animate ? (
                  <TypewriterText text={m.text} onDone={() => handleFinishAnimation(m.id)} />
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
            </div>
          ))}

          {/* Status Reasoning / Menalar dengan Ikon Buffering (Tanpa Ikon Gemini) */}
          {isReasoning && (
            <div className="rounded-2xl p-3.5 bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5 shadow-xs w-fit">
              <LoaderCircle size={15} className="animate-spin text-emerald-700 shrink-0" />
              <span className="font-semibold text-slate-700">Menalar kondisi margin &amp; menyusun rekomendasi...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="sticky bottom-0 bg-[#F8FAFC] pt-3 pb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(inputVal)
          }}
          className="flex items-center gap-2"
        >
          <input
            className={inputCls + ' flex-1 h-11 text-xs bg-white shadow-xs'}
            placeholder="Tanyakan hal lain seputar keuntungan toko Anda…"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isReasoning}
            className="h-11 px-5 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Send size={15} /> Kirim
          </button>
        </form>
      </div>
    </div>
  )
}
