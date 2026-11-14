// src/screens/Kasir.tsx - Kasir POS Responsif Web (Split Terminal di Desktop & Mobile First)
import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  History,
  Minus,
  Plus,
  Search,
  Sparkles,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  Lightbulb,
} from 'lucide-react'
import { useApp } from '../lib/store'
import { chLabel, getTodayIso, modal, rp } from '../lib/data'
import {
  Button,
  Card,
  CartBar,
  ChannelChips,
  CommissionModal,
  EmptyState,
  InfoTip,
  InstantFeedbackBanner,
  MenuTile,
  TopBar,
  inputCls,
} from '../components/ui'

export function KasirBar() {
  const a = useApp()
  const items = a.menus.filter((m) => (a.cart[m.id] ?? 0) > 0)
  const count = items.reduce((s, m) => s + (a.cart[m.id] ?? 0), 0)
  const total = items.reduce((s, m) => s + m.price * (a.cart[m.id] ?? 0), 0)

  return <CartBar count={count} total={total} onSave={a.saveCart} />
}

export function Kasir() {
  const a = useApp()
  const [q, setQ] = useState('')
  const [showCommModal, setShowCommModal] = useState(false)

  const list = a.menus.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()))
  const itemsInCart = a.menus.filter((m) => (a.cart[m.id] ?? 0) > 0)
  const totalCount = itemsInCart.reduce((s, m) => s + (a.cart[m.id] ?? 0), 0)
  const totalSales = itemsInCart.reduce((s, m) => s + m.price * (a.cart[m.id] ?? 0), 0)
  const totalCost = itemsInCart.reduce((s, m) => s + modal(m) * (a.cart[m.id] ?? 0), 0)
  const currentCommPct = a.comm[a.channel] ?? 0
  const potonganApp = Math.round((totalSales * currentCommPct) / 100)
  const untungBersih = totalSales - potonganApp - totalCost

  const isOwner = a.role === 'owner'

  return (
    <div data-name="Layar Kasir" className="p-4 lg:p-8 space-y-5">
      {/* Header Web */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Kasir Penjualan</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {a.shop.name} &bull; Pencatatan Cepat &amp; Hitung Margin Otomatis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="h-10 text-xs px-3 shadow-xs"
            onClick={() => a.nav('asisten')}
          >
            <Sparkles size={14} className="text-emerald-700" />
            <span>Asisten Catat AI</span>
          </Button>
        </div>
      </div>

      <InstantFeedbackBanner />

      {/* TATA LETAK SPLIT DESKTOP (KIRI: MENU CATALOG, KANAN: CURRENT BILL / CART) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (CATALOG MENU) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls: Tanggal Fleksibel */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Tanggal Input Tipe Date Fleksibel */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                <Calendar size={14} className="text-slate-400" /> Tanggal:
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={a.txDate}
                  max={getTodayIso()}
                  onChange={(e) => a.setTxDate(e.target.value)}
                  className="h-9 px-2.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all cursor-pointer shadow-2xs"
                />
                {a.txDate === getTodayIso() ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] shrink-0">
                    Hari Ini
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => a.setTxDate(getTodayIso())}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="Klik untuk kembali ke hari ini"
                  >
                    <History size={12} />
                    <span>Susulan &bull; <span className="underline">Kembali Hari Ini</span></span>
                  </button>
                )}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Pencatatan kasir fleksibel</span>
          </div>

          {/* Jalur Jualan (Di Tempat, Bungkus, GoFood, ShopeeFood) */}
          <ChannelChips
            value={a.channel}
            onChange={a.setChannel}
            comm={a.comm}
            onOpenCommSetting={() => setShowCommModal(true)}
          />

          {/* Search Bar Menu (Diletakkan di atas katalog menu) */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className={inputCls + ' pl-9 pr-9 text-xs h-10 w-full bg-white shadow-2xs focus:bg-white'}
              placeholder="Cari menu minuman atau makanan…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Grid Menu Tiles */}
          {list.length === 0 ? (
            <EmptyState
              title="Menu tidak ditemukan"
              text={`Tidak ada menu "${q}"`}
              action={<Button variant="secondary" onClick={() => setQ('')} className="h-9 text-xs">Reset</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {list.map((m) => (
                <MenuTile
                  key={m.id}
                  menu={m}
                  qty={a.cart[m.id] ?? 0}
                  onAdd={() => a.addCart(m.id, 1)}
                  onSub={() => a.addCart(m.id, -1)}
                  comm={a.comm}
                  channel={a.channel}
                />
              ))}
            </div>
          )}
        </div>

        {/* KOLOM KANAN DESKTOP: PERSISTENT ORDER SUMMARY / STRUK KERANJANG */}
        <div className="lg:col-span-4 sticky top-4">
          <Card className="p-5 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center">
                Pesanan {chLabel(a.channel)} <InfoTip termKey="margin" />
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {totalCount} item dipilih
              </span>
            </div>

            {/* List Item di Keranjang */}
            {itemsInCart.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Keranjang masih kosong. Ketuk menu di katalog untuk menambahkan pesanan.
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {itemsInCart.map((m) => {
                  const qty = a.cart[m.id] ?? 0
                  return (
                    <div key={m.id} className="flex items-center justify-between text-xs gap-2 pb-2 border-b border-slate-50">
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate">{m.name}</span>
                        <span className="text-[11px] text-slate-400">{rp(m.price)} x {qty}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-extrabold text-slate-900">{rp(m.price * qty)}</span>
                        <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200 p-0.5">
                          <button
                            type="button"
                            onClick={() => a.addCart(m.id, -1)}
                            className="size-6 text-slate-700 hover:bg-white rounded flex items-center justify-center font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-bold text-slate-900">{qty}</span>
                          <button
                            type="button"
                            onClick={() => a.addCart(m.id, 1)}
                            className="size-6 text-slate-700 hover:bg-white rounded flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pilihan Metode Pembayaran (Input Data PRD) */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Metode Pembayaran:</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['qris', 'tunai', 'transfer'] as const).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => a.setPaymentMethod(pm)}
                    className={`py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                      a.paymentMethod === pm
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center">Penjualan Kotor <InfoTip termKey="omzet" /></span>
                <span className="font-bold text-slate-900 text-sm">{rp(totalSales)}</span>
              </div>

              {currentCommPct > 0 && (
                <div className="flex justify-between text-red-600">
                  <span className="flex items-center">Potongan Aplikasi ({currentCommPct}%) <InfoTip termKey="komisi" /></span>
                  <span className="font-bold">-{rp(potonganApp)}</span>
                </div>
              )}

              {isOwner && (
                <div className="flex justify-between text-slate-500">
                  <span className="flex items-center">Modal Bahan (HPP) <InfoTip termKey="hpp" /></span>
                  <span>-{rp(totalCost)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-extrabold text-slate-900">
                  {isOwner ? 'Untung Bersih' : 'Total Diterima'}
                </span>
                <span className={`font-black text-lg ${isOwner ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {isOwner ? rp(untungBersih) : rp(totalSales - potonganApp)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <Button
                onClick={a.saveCart}
                disabled={itemsInCart.length === 0}
                className="w-full h-11 text-xs font-black shadow-sm"
              >
                Simpan Transaksi ({rp(totalSales)})
              </Button>

              {itemsInCart.length > 0 && (
                <button
                  type="button"
                  onClick={a.clearCart}
                  className="w-full text-center text-xs text-slate-400 hover:text-red-600 font-semibold py-1 cursor-pointer"
                >
                  Kosongkan Keranjang
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showCommModal && (
        <CommissionModal
          comm={a.comm}
          onUpdate={a.updateCommission}
          onClose={() => setShowCommModal(false)}
        />
      )}
    </div>
  )
}

/* Screen Ringkasan Umpan Balik Instan Setelah Simpan Transaksi */
export function Ringkasan() {
  const a = useApp()
  const fb = a.instantFeedback

  const lastTxList = a.lastTx
  const totalSales = lastTxList.reduce((s, t) => s + t.sales, 0)
  const totalProfit = lastTxList.reduce((s, t) => s + t.profit, 0)

  return (
    <div data-name="Layar Ringkasan" className="p-4 lg:p-8 max-w-lg mx-auto min-h-dvh flex flex-col justify-between">
      <div className="space-y-6 pt-4">
        {/* Banner Sukses */}
        <div className="text-center space-y-2">
          <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-800 grid place-items-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900">Transaksi Berhasil Dicatat</h2>
          <p className="text-xs text-slate-500">
            Data penjualan telah masuk ke pembukuan dan stok bahan baku otomatis terpotong.
          </p>
        </div>

        {/* Kartu Umpan Balik Instan */}
        <Card className="p-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white space-y-4 shadow-md">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <span>Untung Bersih Transaksi Ini</span>
            <span className="font-extrabold text-white text-base">+{rp(totalProfit)}</span>
          </div>

          <div className="pt-3 border-t border-emerald-800/80">
            <span className="text-[11px] text-emerald-300 block mb-1">Total Untung Bersih Toko Hari Ini:</span>
            <span className="text-3xl font-black tracking-tight">{rp(a.todayProfit)}</span>
          </div>

          {fb?.insight && (
            <div className="flex items-start gap-2 pt-2 border-t border-emerald-800/60">
              <Lightbulb size={15} className="text-emerald-300 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {fb.insight}
              </p>
            </div>
          )}
        </Card>

        {/* Ringkasan Item Terjual */}
        <Card className="p-4 space-y-2">
          <span className="text-xs font-bold text-slate-700 block mb-1">Rincian Transaksi:</span>
          {lastTxList.map((t) => (
            <div key={t.id} className="text-xs flex items-center justify-between text-slate-600">
              <span>{chLabel(t.channel)} &bull; {t.lines.map((l) => `${l.qty}x ${l.menuId}`).join(', ')}</span>
              <span className="font-extrabold text-slate-900">{rp(t.sales)}</span>
            </div>
          ))}
        </Card>
      </div>

      <div className="pt-4 space-y-2">
        <Button onClick={() => a.nav('kasir')} className="w-full h-11 text-xs font-black shadow-xs">
          Catat Transaksi Berikutnya
        </Button>
        <Button variant="secondary" onClick={() => a.nav('dashboard')} className="w-full h-11 text-xs">
          Lihat Dashboard Toko
        </Button>
      </div>
    </div>
  )
}
