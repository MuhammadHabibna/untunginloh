// src/components/ui.tsx - Clean, Minimalist UI Components (Zero AI Slop)
import { useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  CircleAlert,
  CircleCheck,
  Clock,
  Coins,
  Info,
  Minus,
  OctagonAlert,
  Plus,
  Settings,
  Sparkles,
  Store,
  TriangleAlert,
  UserCheck,
  X,
} from 'lucide-react'
import { CHANNELS, rp, TERMS, type Channel, type Menu, type TermInfo } from '../lib/data'
import { useApp } from '../lib/store'

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

/* =========================================================
   1. IKON INFORMASI (i) - MINIMALIS & ELEGAN
   ========================================================= */
export function InfoTip({ termKey, className = '' }: { termKey: keyof typeof TERMS | string; className?: string }) {
  const [open, setOpen] = useState(false)
  const item: TermInfo | undefined = TERMS[termKey]

  if (!item) return null

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        aria-label={`Info ${item.title}`}
        className={cx(
          'inline-flex items-center justify-center size-4 rounded-full text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors shrink-0 align-middle ml-1 cursor-pointer',
          className
        )}
      >
        <Info size={12} strokeWidth={2.2} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs anim-muncul"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl p-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{item.subtitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="size-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 grid place-items-center"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.desc}</p>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700 font-mono">
              <span className="font-bold text-slate-800 block text-[11px] font-sans mb-0.5">Rumus:</span>
              {item.formula}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full h-10 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* =========================================================
   2. BUTTONS, CARDS, INPUTS
   ========================================================= */
export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'amber'
}) {
  const styles = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.97] hover:shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.97]',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.97]',
    amber: 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 active:scale-[0.97] hover:shadow-sm',
  }[variant]

  return (
    <button
      {...props}
      className={cx(
        'h-11 px-4 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-xs',
        styles,
        className
      )}
    >
      {children}
    </button>
  )
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cx('bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs transition-all duration-200', className)}
    >
      {children}
    </div>
  )
}

export const inputCls =
  'w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-xs'

/* =========================================================
   3. MARGIN BADGES & STATUS (Clean Typography Anti-Template)
   ========================================================= */
export function MarginBadge({ pct }: { pct: number }) {
  const roundPct = Math.round(pct)
  if (pct < 20) {
    return (
      <span className="font-extrabold text-xs text-red-600 flex items-center gap-1">
        <span className="inline-block size-1.5 rounded-full bg-red-600"></span>
        Bocor ({roundPct}%)
      </span>
    )
  } else if (pct < 30) {
    return (
      <span className="font-extrabold text-xs text-amber-700 flex items-center gap-1">
        <span className="inline-block size-1.5 rounded-full bg-amber-600"></span>
        Tipis ({roundPct}%)
      </span>
    )
  }
  return (
    <span className="font-extrabold text-xs text-emerald-700 flex items-center gap-1">
      <span className="inline-block size-1.5 rounded-full bg-emerald-600"></span>
      Sehat ({roundPct}%)
    </span>
  )
}

/* =========================================================
   4. CHIPS JALUR JUALAN
   ========================================================= */
export function ChannelChips({
  value,
  onChange,
  comm,
  onOpenCommSetting,
}: {
  value: Channel
  onChange: (c: Channel) => void
  comm: Record<Channel, number>
  onOpenCommSetting: () => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="font-semibold flex items-center">
          Jalur <InfoTip termKey="jalur" />
        </span>
        <button
          type="button"
          onClick={onOpenCommSetting}
          className="text-slate-500 hover:text-emerald-700 font-medium text-[11px] flex items-center gap-1"
        >
          <Settings size={12} /> Atur Komisi
        </button>
      </div>

      <div role="radiogroup" className="grid grid-cols-4 gap-1.5">
        {CHANNELS.map((c) => {
          const isSelected = value === c.id
          const currentComm = comm[c.id] ?? c.defaultComm
          return (
            <button
              key={c.id}
              role="radio"
              aria-checked={isSelected}
              type="button"
              onClick={() => onChange(c.id)}
              className={cx(
                'h-11 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer',
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              )}
            >
              <span className="font-bold text-xs">{c.label}</span>
              <span className={cx('text-[10px]', isSelected ? 'text-emerald-200' : 'text-slate-400')}>
                {currentComm > 0 ? `-${currentComm}%` : '0%'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* =========================================================
   5. MENU TILE (KASIR)
   ========================================================= */
export function MenuTile({
  menu,
  qty,
  onAdd,
  onSub,
  comm,
  channel,
}: {
  menu: Menu
  qty: number
  onAdd: () => void
  onSub: () => void
  comm: Record<Channel, number>
  channel: Channel
}) {
  const currentComm = comm[channel] ?? 0
  const modalCost = menu.ingredients.reduce((s, i) => s + i.amount * i.unitPrice, 0)
  const untung = Math.round(menu.price * (1 - currentComm / 100) - modalCost)

  return (
    <div
      className={cx(
        'rounded-2xl border p-3 flex flex-col justify-between transition-all duration-200 bg-white hover:-translate-y-0.5',
        qty > 0 ? 'border-emerald-600 ring-1 ring-emerald-600 shadow-xs' : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
      )}
    >
      <div>
        <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">{menu.name}</h4>
        <div className="font-extrabold text-sm text-slate-900 mt-0.5">{rp(menu.price)}</div>
        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
          Untung {rp(untung)}
        </div>
      </div>

      <div className="mt-3">
        {qty === 0 ? (
          <button
            type="button"
            onClick={onAdd}
            className="w-full h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <Plus size={14} /> Tambah
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-0.5 anim-scale-up">
            <button
              type="button"
              onClick={onSub}
              className="size-7 rounded bg-white text-emerald-800 shadow-2xs flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span key={qty} className="font-bold text-emerald-950 text-xs px-2 anim-pop-in">{qty}</span>
            <button
              type="button"
              onClick={onAdd}
              className="size-7 rounded bg-emerald-700 text-white shadow-2xs flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   6. TOPBAR
   ========================================================= */
export function TopBar({
  title,
  sub,
  right,
  onBack,
}: {
  title: string
  sub?: string
  right?: ReactNode
  onBack?: () => void
}) {
  const a = useApp()

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3">
      {/* Selector Toko & Role di Mobile (Di Desktop sudah ada di sidebar kiri) */}
      <div className="lg:hidden flex items-center justify-between text-xs pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-1">
          <Store size={13} className="text-emerald-700" />
          <select
            value={a.tenantId}
            onChange={(e) => a.switchTenant(e.target.value as 'toko_a' | 'toko_b')}
            className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer text-xs"
          >
            <option value="toko_a">Kedai Kelapa Segar</option>
            <option value="toko_b">Kopi Senja</option>
          </select>
          <InfoTip termKey="toko" />
        </div>

        <button
          type="button"
          onClick={a.toggleRole}
          className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md"
        >
          {a.role === 'owner' ? 'Pemilik' : 'Kasir'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 min-h-8">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="size-7 rounded-lg border border-slate-200 grid place-items-center text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="font-extrabold text-base text-slate-900 truncate">{title}</h1>
            {sub && <p className="text-[11px] text-slate-500 truncate">{sub}</p>}
          </div>
        </div>

        {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
      </div>
    </header>
  )
}

/* =========================================================
   7. CARTBAR
   ========================================================= */
export function CartBar({ count, total, onSave }: { count: number; total: number; onSave: () => void }) {
  if (count === 0) return null

  return (
    <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200 p-3 shadow-md anim-naik">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-500 block">{count} pesanan</span>
          <span className="text-lg font-black text-slate-900">{rp(total)}</span>
        </div>
        <Button onClick={onSave} className="px-5 h-10 text-xs">
          Simpan Transaksi
        </Button>
      </div>
    </div>
  )
}

/* =========================================================
   8. UMPAN BALIK INSTAN
   ========================================================= */
export function InstantFeedbackBanner() {
  const a = useApp()
  if (!a.instantFeedback) return null

  return (
    <div className="rounded-xl bg-emerald-800 text-white p-3 shadow-md anim-muncul mb-2 flex items-center justify-between text-xs">
      <div>
        <span className="font-bold block">Pesanan Tersimpan!</span>
        <span className="text-emerald-200 text-[11px]">+{rp(a.instantFeedback.addedProfit)} untung bersih</span>
      </div>
      <button type="button" onClick={() => a.setInstantFeedback(null)} className="text-emerald-300 hover:text-white p-1">
        <X size={16} />
      </button>
    </div>
  )
}

/* =========================================================
   9. MODAL ATUR KOMISI
   ========================================================= */
export function CommissionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const a = useApp()
  const [gf, setGf] = useState(a.comm.gofood)
  const [sh, setSh] = useState(a.comm.shopee)

  if (!open) return null

  const handleSave = () => {
    a.updateCommission('gofood', gf)
    a.updateCommission('shopee', sh)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs anim-muncul">
      <div className="w-full max-w-xs rounded-2xl bg-white border border-slate-200 shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-900">Potongan Aplikasi</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">GoFood (%)</label>
            <input type="number" min="0" max="50" value={gf} onChange={(e) => setGf(Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">ShopeeFood (%)</label>
            <input type="number" min="0" max="50" value={sh} onChange={(e) => setSh(Number(e.target.value))} className={inputCls} />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1 h-9">Batal</Button>
          <Button onClick={handleSave} className="flex-1 h-9">Simpan</Button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   10. TOAST & TRIAL BANNER
   ========================================================= */
export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-bold shadow-xl border border-slate-700/60 anim-fade-in-down flex items-center gap-2.5">
      <CircleCheck size={15} className="text-emerald-400 shrink-0 animate-pulse" />
      <span>{msg}</span>
    </div>
  )
}

export function TrialBanner({ onClick }: { onClick: () => void }) {
  const a = useApp()
  return (
    <div
      onClick={onClick}
      className="rounded-xl bg-amber-50 border border-amber-200 p-2 flex items-center justify-between text-xs cursor-pointer hover:bg-amber-100/60"
    >
      <span className="text-amber-900 font-semibold text-[11px]">
        Trial {a.trialDaysLeft} Hari • Kuota AI: {a.aiLimit - a.aiUsed}/{a.aiLimit}
      </span>
      <span className="font-bold text-amber-800 text-[11px] underline">Upgrade Rp24.500</span>
    </div>
  )
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center bg-white/50 my-2">
      <h3 className="font-bold text-xs text-slate-800 mb-0.5">{title}</h3>
      <p className="text-[11px] text-slate-400 mb-3">{text}</p>
      {action}
    </div>
  )
}

export function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs anim-muncul">
      <div className="w-full max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white border-t border-slate-200 shadow-xl p-4 anim-naik">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="size-7 rounded-full text-slate-400 hover:text-slate-700 grid place-items-center">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
