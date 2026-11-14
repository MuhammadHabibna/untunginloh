// src/screens/Lainnya.tsx - Riwayat Transaksi, Pengaturan Kasir, & Paket SaaS Responsif UntunginLOH
import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  History,
  Key,
  Lock,
  Plus,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  UserPlus,
  Users,
  Percent,
  Cpu,
} from 'lucide-react'
import { useApp } from '../lib/store'
import { chLabel, rp, type Channel, type Tx } from '../lib/data'
import { Button, Card, EmptyState, InfoTip, inputCls, Sheet, TopBar, cx } from '../components/ui'
import { testGeminiConnection } from '../lib/gemini'

/* 1. LAYAR RIWAYAT TRANSAKSI */
export function Riwayat() {
  const a = useApp()
  const isOwner = a.role === 'owner'
  const [filterDay, setFilterDay] = useState<'today' | 'history'>('today')

  const todayCount = a.txs.filter((t) => t.day === 'today').length
  const historyCount = a.txs.filter((t) => t.day !== 'today').length

  const filtered = a.txs.filter((t) => {
    if (filterDay === 'today') return t.day === 'today'
    return t.day !== 'today'
  })

  return (
    <div data-name="Layar Riwayat" className="p-4 lg:p-8 space-y-6">
      {/* Header Web */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Riwayat Transaksi</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {a.shop.name} &bull; {filtered.length} transaksi {filterDay === 'today' ? 'hari ini' : 'riwayat sebelumnya'}
          </p>
        </div>

        {/* Filter Tab: Hari Ini & Riwayat */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-bold border border-slate-300/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterDay('today')}
            className={cx(
              'px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              filterDay === 'today'
                ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span>Hari Ini</span>
            <span
              className={cx(
                'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                filterDay === 'today' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300/80 text-slate-700'
              )}
            >
              {todayCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilterDay('history')}
            className={cx(
              'px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              filterDay === 'history'
                ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span>Riwayat</span>
            <span
              className={cx(
                'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                filterDay === 'history' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300/80 text-slate-700'
              )}
            >
              {historyCount}
            </span>
          </button>
        </div>
      </div>

      {/* List Transaksi Responsif */}
      {filtered.length === 0 ? (
        <EmptyState
          title={filterDay === 'today' ? 'Belum ada transaksi hari ini' : 'Belum ada riwayat transaksi lampau'}
          text={
            filterDay === 'today'
              ? 'Catat transaksi penjualan hari ini melalui kasir POS untuk melihat daftarnya.'
              : 'Transaksi dari hari-hari sebelumnya atau catatan susulan akan otomatis tersimpan di sini.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <Card key={t.id} className="p-4 hover:border-slate-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {chLabel(t.channel)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    &bull; {t.time} &bull; {t.dateLabel}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="font-black text-base text-slate-900 block">{rp(t.sales)}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 mb-2.5">
                {t.lines.map((l) => `${l.qty}x ${l.menuId}`).join(', ')}
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                <span className="text-slate-400">Dicatat oleh: <strong className="text-slate-700">{t.by}</strong></span>

                {isOwner ? (
                  <div className="flex items-center gap-3">
                    {t.commission > 0 && (
                      <span className="text-red-600 font-semibold text-xs">
                        Potongan Komisi: -{rp(t.commission)}
                      </span>
                    )}
                    <span className="font-black text-emerald-800 text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Untung Bersih: {rp(t.profit)}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-slate-700">Diterima Bersih: {rp(t.sales - t.commission)}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* 2. LAYAR PENGATURAN TOKO & KASIR (LENGKAP SESUAI PRD) */
export function Pengaturan() {
  const a = useApp()
  const [showAddCashier, setShowAddCashier] = useState(false)
  const [newCashierName, setNewCashierName] = useState('')
  const [newPin, setNewPin] = useState('')

  // Settings State Form
  const [tempApiKey, setTempApiKey] = useState(a.apiKey)
  const [apiStatus, setApiStatus] = useState<string | null>(null)
  const [testingApi, setTestingApi] = useState(false)

  // Commission Edit State
  const [commGofood, setCommGofood] = useState(a.comm.gofood)
  const [commShopee, setCommShopee] = useState(a.comm.shopee)

  // Financial Parameter Edit State
  const [tempTargetMargin, setTempTargetMargin] = useState(a.targetMargin)
  const [tempFixedCost, setTempFixedCost] = useState(a.fixedCost)

  const handleSaveCashier = () => {
    if (!newCashierName.trim()) return
    a.setCashierName(newCashierName)
    setShowAddCashier(false)
    a.toast(`Akun kasir "${newCashierName}" berhasil ditambahkan`)
  }

  const handleSaveApi = () => {
    a.updateApiKey(tempApiKey)
  }

  const handleTestApi = async () => {
    setTestingApi(true)
    const res = await testGeminiConnection(tempApiKey)
    setApiStatus(res.message)
    setTestingApi(false)
    a.toast(res.ok ? 'Koneksi Gemini AI Sukses!' : 'Koneksi AI Gagal')
  }

  const handleSaveCommissions = () => {
    a.updateCommission('gofood', commGofood)
    a.updateCommission('shopee', commShopee)
    a.toast('Skema komisi online diperbarui!')
  }

  const handleSaveFinancials = () => {
    a.setTargetMargin(Number(tempTargetMargin) || 25)
    a.setFixedCost(Number(tempFixedCost) || 50000)
    a.toast('Target margin & biaya operasional disimpan!')
  }

  const handleExportCsv = () => {
    const headers = ['ID Transaksi', 'Waktu', 'Jalur', 'Total Penjualan', 'Potongan Komisi', 'Untung Bersih', 'Dicatat Oleh']
    const rows = a.txs.map((t) => [
      t.id,
      `${t.dateLabel} ${t.time}`,
      chLabel(t.channel),
      t.sales,
      t.commission,
      t.profit,
      t.by,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `laporan_transaksi_${a.shop.id}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    a.toast('Laporan CSV berhasil diunduh')
  }

  return (
    <div data-name="Layar Pengaturan" className="p-4 lg:p-8 space-y-6">
      {/* Header Web */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Pengaturan Toko &amp; Integrasi</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Konfigurasi Kunci API AI, Skema Komisi, Target Margin, &amp; Manajemen Kasir
          </p>
        </div>

        <Button variant="secondary" onClick={handleExportCsv} className="h-9 text-xs px-3 shadow-2xs self-start sm:self-auto">
          <Download size={14} /> Ekspor Laporan (CSV)
        </Button>
      </div>

      {/* Grid 2 Kolom Responsif Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Kolom Kiri: Integrasi API & Skema Komisi */}
        <div className="space-y-5">
          {/* Card 1: Integrasi Google Gemini API Studio */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-emerald-50 text-emerald-800 grid place-items-center">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Integrasi Google AI Studio</h3>
                  <span className="text-[11px] text-slate-500">Model: gemini-3.1-flash-lite (Flash)</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Aktif
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Kunci API Gemini (AI Studio Key)
              </label>
              <input
                type="password"
                className={inputCls + ' font-mono text-xs'}
                placeholder="Masukkan API Key Google AI Studio..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Digunakan untuk Asisten Catat AI (ekstraksi screenshot rekap pesanan) &amp; konsultasi Tanya Bisnis AI.
              </span>
            </div>

            {apiStatus && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {apiStatus}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={testingApi}
                onClick={handleTestApi}
                className="flex-1 h-9 text-xs"
              >
                {testingApi ? 'Menguji...' : 'Uji Status Koneksi'}
              </Button>
              <Button onClick={handleSaveApi} className="flex-1 h-9 text-xs">
                Simpan Kunci API
              </Button>
            </div>
          </Card>

          {/* Card 2: Skema Potongan Komisi Saluran Online */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center">
                  Potongan Komisi Aplikasi Online <InfoTip termKey="komisi" />
                </h3>
                <span className="text-[11px] text-slate-400">Otomatis dipotong dari setiap penjualan online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Komisi GoFood (%)</label>
                <input
                  type="number"
                  className={inputCls}
                  value={commGofood}
                  onChange={(e) => setCommGofood(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Komisi ShopeeFood (%)</label>
                <input
                  type="number"
                  className={inputCls}
                  value={commShopee}
                  onChange={(e) => setCommShopee(Number(e.target.value))}
                />
              </div>
            </div>

            <Button onClick={handleSaveCommissions} className="w-full h-9 text-xs">
              Simpan Persentase Komisi
            </Button>
          </Card>

          {/* Card 3: Parameter Target Margin & Fixed Cost */}
          <Card className="p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Parameter Margin &amp; Biaya Operasional
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Margin Min. (%)</label>
                <input
                  type="number"
                  className={inputCls}
                  value={tempTargetMargin}
                  onChange={(e) => setTempTargetMargin(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sewa &amp; Listrik/Hari (Rp)</label>
                <input
                  type="number"
                  className={inputCls}
                  value={tempFixedCost}
                  onChange={(e) => setTempFixedCost(Number(e.target.value))}
                />
              </div>
            </div>

            <Button onClick={handleSaveFinancials} variant="secondary" className="w-full h-9 text-xs">
              Perbarui Parameter Finansial
            </Button>
          </Card>
        </div>

        {/* Kolom Kanan: Identitas Toko, Staf Kasir, & SaaS */}
        <div className="space-y-5">
          {/* Info Ruang Kerja Toko */}
          <Card className="bg-white p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-emerald-100 text-emerald-800 grid place-items-center font-bold shrink-0">
                <Store size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{a.shop.name}</h3>
                <p className="text-xs text-slate-500">
                  Kota {a.shop.city} &bull; Template Usaha: {a.shop.template} &bull; Pemilik: {a.shop.ownerName}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Beralih Ruang Kerja Toko:</span>
              <button
                type="button"
                onClick={() => a.switchTenant(a.tenantId === 'toko_a' ? 'toko_b' : 'toko_a')}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Ganti ke {a.tenantId === 'toko_a' ? 'Toko B (Kopi Senja)' : 'Toko A (Kedai Kelapa)'}
              </button>
            </div>
          </Card>

          {/* Manajemen Akun Kasir */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Users size={16} className="text-emerald-700" /> Staf Akun Kasir
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Kasir hanya memiliki akses kasir POS.</p>
              </div>
              <Button
                variant="secondary"
                className="text-xs min-h-8 px-3"
                onClick={() => setShowAddCashier(true)}
              >
                <UserPlus size={14} /> Tambah Kasir
              </Button>
            </div>

            <div className="space-y-2">
              <div className="rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between text-xs bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="size-8 rounded-full bg-slate-200 text-slate-700 grid place-items-center font-bold text-xs">
                    {a.cashierName.charAt(0)}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">{a.cashierName} (Kasir Aktif)</span>
                    <span className="text-slate-400 text-[11px]">PIN: &bull;&bull;&bull;&bull; &bull; Akses: Kasir Terbatas</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">
                  Aktif
                </span>
              </div>
            </div>
          </Card>

          {/* Menu Langganan SaaS */}
          <div
            onClick={() => a.nav('paket')}
            className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-5 text-left flex items-center justify-between hover:bg-emerald-100/60 transition-colors shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-2xl bg-emerald-700 text-white grid place-items-center shrink-0">
                <CreditCard size={22} />
              </div>
              <div>
                <span className="font-extrabold text-sm text-emerald-950 block">Status Langganan SaaS</span>
                <span className="text-xs text-emerald-800 font-medium">
                  {a.plan === 'trial' ? 'Masa Uji Coba 14 Hari Aktif' : 'Paket Dasar UMKM Aktif (Rp24.500/bln)'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 underline">Lihat Paket</span>
          </div>
        </div>
      </div>

      {/* Modal Tambah Kasir */}
      {showAddCashier && (
        <Sheet title="Tambah Staf Kasir" onClose={() => setShowAddCashier(false)}>
          <div className="space-y-3.5 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Kasir</label>
              <input
                className={inputCls}
                placeholder="Contoh: Siti - Kasir Pagi"
                value={newCashierName}
                onChange={(e) => setNewCashierName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">PIN 4 Angka</label>
              <input
                type="password"
                maxLength={4}
                className={inputCls}
                placeholder="1234"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowAddCashier(false)} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleSaveCashier} className="flex-1 font-bold">
              Simpan Kasir
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  )
}

/* 3. LAYAR PAKET LANGGANAN SAAS */
export function Paket() {
  const a = useApp()
  const isUpgraded = a.plan === 'dasar'

  return (
    <div data-name="Layar Paket" className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header dengan Tombol Kembali */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => a.nav('pengaturan')}
          className="size-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center text-slate-600 cursor-pointer shadow-2xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Paket Langganan Toko</h1>
          <p className="text-xs text-slate-500 font-medium">Investasi Terjangkau untuk Menjaga Margin UMKM</p>
        </div>
      </div>

      {/* Banner Status Saat Ini */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 shadow-md">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400">Status Langganan Anda</span>
          <span
            className={cx(
              'px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide',
              isUpgraded ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 text-slate-950'
            )}
          >
            {isUpgraded ? 'Pelanggan Dasar Aktif' : 'Masa Trial 14 Hari'}
          </span>
        </div>
        <div className="text-2xl lg:text-3xl font-black">
          {isUpgraded ? 'Paket Dasar UMKM' : 'Free Trial 14 Hari'}
        </div>
        <p className="text-xs text-slate-300 mt-1.5">
          Kuota AI Tersisa: <strong>{a.aiLimit - a.aiUsed}</strong> dari <strong>{a.aiLimit}</strong> kali pembacaan per bulan.
        </p>
      </div>

      {/* Perbandingan 2 Paket Side-by-Side di Tablet & Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* Paket 1: Free Trial */}
        <Card className={cx('p-6 flex flex-col justify-between', !isUpgraded ? 'border-2 border-emerald-600 bg-emerald-50/20 shadow-md' : 'opacity-70')}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-slate-900">Paket Uji Coba (Free Trial)</h3>
              <span className="font-black text-xl text-slate-900">Rp0</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Masa coba fitur lengkap selama 14 hari pertama.</p>
            <ul className="text-xs text-slate-600 space-y-2.5 mb-6">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-700 shrink-0" /> Kuota 30 kali pembacaan AI
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-700 shrink-0" /> Akses kasir dan laporan untung bersih
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-700 shrink-0" /> Maksimal 1 akun staf kasir
              </li>
            </ul>
          </div>

          <div className="text-center text-xs text-slate-400 font-semibold py-2">
            {!isUpgraded ? 'Sedang Digunakan' : 'Trial Telah Selesai'}
          </div>
        </Card>

        {/* Paket 2: Paket Dasar UMKM */}
        <Card className={cx('p-6 flex flex-col justify-between', isUpgraded ? 'border-2 border-emerald-600 bg-emerald-50/30 shadow-md' : 'border-amber-300 bg-amber-50/30')}>
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="bg-emerald-700 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                  Promo Diskon 50%
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">Paket Dasar UMKM</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through block">Rp49.000</span>
                <span className="font-black text-2xl text-emerald-800">Rp24.500</span>
                <span className="text-[10px] text-slate-500 block">/bulan</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4">Investasi cerdas pencegah kebocoran margin warung/kedai Anda.</p>

            <ul className="text-xs text-slate-700 space-y-2.5 mb-6">
              <li className="flex items-center gap-2 font-semibold">
                <Check size={14} className="text-emerald-700 shrink-0" /> Kuota 150 kali pembacaan AI / bulan
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check size={14} className="text-emerald-700 shrink-0" /> Laporan untung bersih &amp; moving average
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check size={14} className="text-emerald-700 shrink-0" /> Tambah staf kasir tanpa batas
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check size={14} className="text-emerald-700 shrink-0" /> Multi-tenant workspace backup
              </li>
            </ul>
          </div>

          {!isUpgraded ? (
            <Button
              onClick={a.upgradePlan}
              className="w-full py-3 text-sm font-black shadow-md bg-emerald-700 hover:bg-emerald-800"
            >
              Aktifkan Paket Dasar (Rp24.500/bulan)
            </Button>
          ) : (
            <div className="rounded-xl bg-emerald-100 text-emerald-900 p-2.5 text-center text-xs font-bold flex items-center justify-center gap-1.5">
              <Check size={14} /> Paket Ini Sedang Aktif di Toko Anda
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
