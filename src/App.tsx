// src/App.tsx - Arsitektur Web SaaS Profesional UntunginLOH (Full Desktop & Mobile Native)
import { useEffect, useRef } from 'react'
import {
  BookOpen,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  UserCheck,
} from 'lucide-react'
import { AppProvider, useApp, type Screen } from './lib/store'
import { Toast, cx } from './components/ui'
import { LogoUntunginLOH } from './components/LogoUntunginLOH'
import { Auth, Onboarding } from './screens/Auth'
import { Kasir, KasirBar, Ringkasan } from './screens/Kasir'
import { Asisten } from './screens/Asisten'
import { MenuList, Resep } from './screens/Menu'
import { Dashboard, Tanya } from './screens/Dashboard'
import { Paket, Pengaturan, Riwayat } from './screens/Lainnya'

interface TabItem {
  id: Screen
  label: string
  icon: typeof ReceiptText
  ownerOnly?: boolean
}

const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, ownerOnly: true },
  { id: 'kasir', label: 'Kasir POS', icon: ReceiptText },
  { id: 'riwayat', label: 'Riwayat Transaksi', icon: ClipboardList },
  { id: 'menu', label: 'Resep & HPP', icon: BookOpen, ownerOnly: true },
  { id: 'pengaturan', label: 'Pengaturan Toko', icon: Settings, ownerOnly: true },
]

const PARENT_TAB: Partial<Record<Screen, Screen>> = {
  ringkasan: 'kasir',
  asisten: 'kasir',
  resep: 'menu',
  tanya: 'dashboard',
  paket: 'pengaturan',
}

function MainShell() {
  const a = useApp()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [a.screen, a.menuId])

  const isAuth = !a.isLoggedIn || a.screen === 'auth' || a.screen === 'onboarding'
  const isOwner = a.role === 'owner'
  const visibleTabs = TABS.filter((t) => isOwner || !t.ownerOnly)
  const activeTabId = PARENT_TAB[a.screen] ?? a.screen

  const currentView = {
    auth: <Auth />,
    onboarding: <Onboarding />,
    kasir: <Kasir />,
    ringkasan: <Ringkasan />,
    asisten: <Asisten />,
    riwayat: <Riwayat />,
    menu: <MenuList />,
    resep: <Resep key={a.menuId} />,
    dashboard: <Dashboard />,
    tanya: <Tanya />,
    pengaturan: <Pengaturan />,
    paket: <Paket />,
  }[a.screen]

  if (isAuth) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
        <Toast msg={a.toastMsg} />
        <div className="w-full max-w-md py-4">{currentView}</div>
      </div>
    )
  }

  return (
    <div className="h-dvh w-full bg-[#F8FAFC] flex overflow-hidden font-sans select-none text-slate-800">
      <Toast msg={a.toastMsg} />

      {/* 1. SIDEBAR DESKTOP WEB ASLI (TAMPIL DI LAYAR LAPTOP / PC) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-white border-r border-slate-200/80 z-20">
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between">
            <LogoUntunginLOH size={34} variant="full" />
          </div>

          {/* Info Ruang Kerja Toko (Clean Branding, Roleplay via URL) */}
          <div className="p-3 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-white border border-slate-200 grid place-items-center shrink-0 text-emerald-800 shadow-2xs">
                <Store size={16} />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-xs text-slate-900 block truncate">
                  {a.shop.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Kota {a.shop.city}
                </span>
              </div>
            </div>
          </div>

          {/* Navigasi Utama Web */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {visibleTabs.map((t) => {
              const active = activeTabId === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => a.nav(t.id)}
                  className={cx(
                    'w-full h-10 px-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all duration-150 active:scale-[0.98] text-left cursor-pointer',
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <t.icon size={17} className={active ? 'text-white' : 'text-slate-500'} />
                  <span className="truncate">{t.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer Profil & Logout */}
          <div className="p-3 border-t border-slate-100 space-y-2">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-left text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-7 rounded-lg bg-emerald-100 text-emerald-800 grid place-items-center shrink-0">
                  {a.role === 'owner' ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 block truncate">
                    {a.role === 'owner' ? a.shop.ownerName : a.cashierName}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {a.role === 'owner' ? 'Pemilik Toko' : 'Akses Kasir'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={a.toggleRole}
                className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Ganti
              </button>
            </div>

            <button
              type="button"
              onClick={a.logout}
              className="w-full h-8 px-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 text-[11px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. AREA KONTEN UTAMA (RESPONSIF PENUH DI WEB & MOBILE) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Web SaaS dengan URL Breadcrumb & Quick Switch */}
        <header className="hidden lg:flex h-12 bg-white border-b border-slate-200/80 px-8 items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-400">
            <span className="text-slate-600 font-bold">untungin.loh</span>
            <span>/</span>
            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              {a.tenantId}
            </span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{a.screen}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Toko Aktif: <strong className="text-slate-800">{a.shop.name}</strong>
            </span>
            <span className="text-slate-300">&bull;</span>
            <button
              type="button"
              onClick={() => a.switchTenant(a.tenantId === 'toko_a' ? 'toko_b' : 'toko_a')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Beralih ke {a.tenantId === 'toko_a' ? 'Toko B (Kopi Senja)' : 'Toko A (Kedai Kelapa)'}
            </button>
          </div>
        </header>

        {/* Top Header Mobile Native dengan Logo, Peran, & Tombol Keluar (Logout) */}
        <header className="lg:hidden h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <LogoUntunginLOH size={26} variant="full" />
          </div>

          <div className="flex items-center gap-2">
            {/* Status Peran Pengguna */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700">
              {a.role === 'owner' ? (
                <>
                  <ShieldCheck size={13} className="text-emerald-700 shrink-0" />
                  <span className="truncate max-w-[85px]">{a.shop.ownerName}</span>
                </>
              ) : (
                <>
                  <UserCheck size={13} className="text-amber-700 shrink-0" />
                  <span className="truncate max-w-[85px]">{a.cashierName}</span>
                </>
              )}
            </div>

            {/* Tombol Logout Mobile */}
            <button
              type="button"
              onClick={a.logout}
              title="Keluar dari akun toko"
              className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-2xs"
            >
              <LogOut size={13} />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Main View Scrollable */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="w-full anim-fade-in pb-20 lg:pb-8" key={`${a.tenantId}-${a.screen}`}>{currentView}</div>
        </main>

        {/* Floating Cart Bar di Kasir (Hanya tampil di Mobile jika item > 0) */}
        {a.screen === 'kasir' && <div className="lg:hidden anim-naik"><KasirBar /></div>}

        {/* BOTTOM NAVIGATION (HANYA TAMPIL DI MOBILE < 1024px) */}
        <nav
          data-name="Navigasi Bawah Mobile"
          aria-label="Navigasi utama mobile"
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 grid shrink-0 z-30"
          style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)` }}
        >
          {visibleTabs.map((t) => {
            const active = activeTabId === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => a.nav(t.id)}
                className={cx(
                  'h-14 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-95 select-none cursor-pointer',
                  active ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <t.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px]">{t.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  )
}
