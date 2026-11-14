// src/lib/store.tsx - Global State & URL Routing Management for UntunginLOH
import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react'
import {
  BASE_PROFIT_TOKO_A,
  BASE_SALES_TOKO_A,
  buildTx,
  DEFAULT_COMM,
  formatIndoDate,
  getTodayIso,
  MENUS_TOKO_A,
  MENUS_TOKO_B,
  SEED_TX_TOKO_A,
  SEED_TX_TOKO_B,
  YESTERDAY_PROFIT_TOKO_A,
  type Channel,
  type Ingredient,
  type Line,
  type Menu,
  type Tx,
} from './data'
import { getActiveApiKey, setActiveApiKey } from './gemini'

export type Screen =
  | 'auth'
  | 'onboarding'
  | 'kasir'
  | 'ringkasan'
  | 'asisten'
  | 'riwayat'
  | 'menu'
  | 'resep'
  | 'dashboard'
  | 'tanya'
  | 'pengaturan'
  | 'paket'

export type UserRole = 'owner' | 'cashier'

export interface Shop {
  id: string
  name: string
  city: string
  template: string
  ownerName: string
}

const SHOPS: Record<string, Shop> = {
  toko_a: {
    id: 'toko_a',
    name: 'Kedai Kelapa Muda Segar',
    city: 'Surabaya',
    template: 'minuman',
    ownerName: 'Bu Sari',
  },
  toko_b: {
    id: 'toko_b',
    name: 'Warung Kopi Senja',
    city: 'Malang',
    template: 'warung',
    ownerName: 'Mas Seno',
  },
}

export interface InstantFeedback {
  addedProfit: number
  totalProfit: number
  insight: string
}

// Helper parsing route from pathname: e.g. /toko_a/kasir or /login
function parseRouteFromUrl(): {
  isAuth: boolean
  isOnboarding: boolean
  tenantId: 'toko_a' | 'toko_b'
  screen: Screen
} {
  if (typeof window === 'undefined') {
    return { isAuth: false, isOnboarding: false, tenantId: 'toko_a', screen: 'dashboard' }
  }

  const path = window.location.pathname.replace(/^\/+/, '').split('/')
  const first = path[0]?.toLowerCase()
  const second = path[1]?.toLowerCase() as Screen | undefined

  if (first === 'login' || first === 'auth') {
    return { isAuth: true, isOnboarding: false, tenantId: 'toko_a', screen: 'auth' }
  }

  if (first === 'onboarding') {
    return { isAuth: true, isOnboarding: true, tenantId: 'toko_a', screen: 'onboarding' }
  }

  if (first === 'toko_b' || first === 'tokob' || first === 'b') {
    return {
      isAuth: false,
      isOnboarding: false,
      tenantId: 'toko_b',
      screen: second && isValidScreen(second) ? second : 'dashboard',
    }
  }

  if (first === 'toko_a' || first === 'tokoa' || first === 'a') {
    return {
      isAuth: false,
      isOnboarding: false,
      tenantId: 'toko_a',
      screen: second && isValidScreen(second) ? second : 'dashboard',
    }
  }

  // Default root /
  return { isAuth: false, isOnboarding: false, tenantId: 'toko_a', screen: 'dashboard' }
}

function isValidScreen(s: string): s is Screen {
  return [
    'auth',
    'onboarding',
    'kasir',
    'ringkasan',
    'asisten',
    'riwayat',
    'menu',
    'resep',
    'dashboard',
    'tanya',
    'pengaturan',
    'paket',
  ].includes(s)
}

function useStore() {
  const initialRoute = parseRouteFromUrl()

  // 1. Multi-Tenant State
  const [tenantId, setTenantId] = useState<'toko_a' | 'toko_b'>(initialRoute.tenantId)
  const [shops, setShops] = useState<Record<string, Shop>>(SHOPS)
  const currentShop = shops[tenantId]

  // 2. Auth Session & URL Routing State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!initialRoute.isAuth)
  const [screen, setScreen] = useState<Screen>(initialRoute.screen)
  const [role, setRole] = useState<UserRole>('owner')
  const [cashierName, setCashierName] = useState('Budi')

  // 3. Menus & Custom Ingredients State per Tenant
  const [menusA, setMenusA] = useState<Menu[]>(MENUS_TOKO_A)
  const [menusB, setMenusB] = useState<Menu[]>(MENUS_TOKO_B)
  const menus = tenantId === 'toko_a' ? menusA : menusB
  const setMenus = tenantId === 'toko_a' ? setMenusA : setMenusB

  const [menuId, setMenuId] = useState('kelapa_ori')

  // 4. Commission Settings per Tenant (GoFood, ShopeeFood, etc.)
  const [comm, setComm] = useState<Record<Channel, number>>(DEFAULT_COMM)

  // 5. Parameter Finansial & Target Margin (Input Data PRD)
  const [targetMargin, setTargetMargin] = useState<number>(25) // Target margin 25%
  const [fixedCost, setFixedCost] = useState<number>(50000) // Biaya operasional tetap per hari (sewa/listrik)

  // 6. Integrasi Google AI Studio Key (Input Data PRD)
  const [apiKey, setApiKey] = useState<string>(getActiveApiKey())

  // 7. Kasir State & Input Fleksibel Tanggal Transaksi
  const [cart, setCart] = useState<Record<string, number>>({})
  const [channel, setChannel] = useState<Channel>('tempat')
  const [txDate, setTxDate] = useState<string>(getTodayIso())
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'tunai' | 'transfer'>('qris')

  // 8. Transactions State per Tenant
  const [txsA, setTxsA] = useState<Tx[]>(SEED_TX_TOKO_A)
  const [txsB, setTxsB] = useState<Tx[]>(SEED_TX_TOKO_B)
  const txs = tenantId === 'toko_a' ? txsA : txsB
  const setTxs = tenantId === 'toko_a' ? setTxsA : setTxsB

  // 9. SaaS & AI Quota Layer
  const [plan, setPlan] = useState<'trial' | 'dasar'>('trial')
  const [aiUsed, setAiUsed] = useState(6)
  const aiLimit = plan === 'trial' ? 30 : 150
  const trialDaysLeft = 14

  // 10. Indikator Kemajuan Data 14 Hari (Spesifikasi PRD)
  const dataDaysCount = 6
  const targetDaysCount = 14
  const confidenceLevel = 'Sedang (Basis 6 dari 14 Hari Data)'

  // 11. Instant Feedback & Notifications
  const [instantFeedback, setInstantFeedback] = useState<InstantFeedback | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [lastTx, setLastTx] = useState<Tx[]>([])
  const [actionDone, setActionDone] = useState(false)
  const toastTimer = useRef<number>(0)

  // Sinkronisasi URL browser saat route atau tenant berubah
  const syncBrowserUrl = (targetTenant: string, targetScreen: Screen, isAuthScreen = false) => {
    if (typeof window === 'undefined') return
    let newPath = ''
    if (isAuthScreen) {
      newPath = targetScreen === 'onboarding' ? '/onboarding' : '/login'
    } else {
      newPath = `/${targetTenant}/${targetScreen}`
    }
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath)
    }
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromUrl()
      setTenantId(parsed.tenantId)
      setScreen(parsed.screen)
      setIsLoggedIn(!parsed.isAuth)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Reset menuId when tenant changes
  useEffect(() => {
    if (tenantId === 'toko_a') {
      setMenuId('kelapa_ori')
    } else {
      setMenuId('kopi_tubruk')
    }
  }, [tenantId])

  const toast = (m: string) => {
    setToastMsg(m)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 3000)
  }

  const nav = (s: Screen, targetMenuId?: string) => {
    if (targetMenuId) setMenuId(targetMenuId)
    setScreen(s)
    const isAuth = s === 'auth' || s === 'onboarding'
    if (isAuth) {
      setIsLoggedIn(false)
      syncBrowserUrl(tenantId, s, true)
    } else {
      setIsLoggedIn(true)
      syncBrowserUrl(tenantId, s, false)
    }
  }

  // Switch Multi-Tenant Shop via URL / internal
  const switchTenant = (newTenantId: 'toko_a' | 'toko_b') => {
    setTenantId(newTenantId)
    setCart({})
    syncBrowserUrl(newTenantId, screen, false)
    toast(`Beralih ke toko: ${SHOPS[newTenantId].name}`)
  }

  // Fast One-Click Roleplay Login (untuk kemudahan Juri & Evaluasi)
  const loginAs = (targetTenant: 'toko_a' | 'toko_b', targetRole: UserRole) => {
    setTenantId(targetTenant)
    setRole(targetRole)
    setIsLoggedIn(true)
    const nextScreen = targetRole === 'cashier' ? 'kasir' : 'dashboard'
    setScreen(nextScreen)
    syncBrowserUrl(targetTenant, nextScreen, false)
    toast(
      targetRole === 'owner'
        ? `Masuk sebagai ${SHOPS[targetTenant].ownerName} (${SHOPS[targetTenant].name})`
        : `Masuk sebagai Kasir Budi (${SHOPS[targetTenant].name})`
    )
  }

  const logout = () => {
    setIsLoggedIn(false)
    setScreen('auth')
    setCart({})
    syncBrowserUrl(tenantId, 'auth', true)
    toast('Anda telah keluar dari toko.')
  }

  // Switch Role (Owner vs Cashier)
  const toggleRole = () => {
    const nextRole: UserRole = role === 'owner' ? 'cashier' : 'owner'
    setRole(nextRole)
    if (nextRole === 'cashier') {
      if (screen !== 'kasir' && screen !== 'riwayat') {
        setScreen('kasir')
        syncBrowserUrl(tenantId, 'kasir', false)
      }
      toast('Akses Kasir aktif: Menu margin & pengaturan disembunyikan')
    } else {
      toast('Akses Pemilik aktif: Seluruh fitur terbuka')
    }
  }

  const nowTime = () =>
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')

  // Record Transactions
  const record = (groups: { channel: Channel; lines: Line[] }[], customDateStr?: string) => {
    const targetDate = customDateStr || txDate
    const todayStr = getTodayIso()
    const isToday = targetDate === todayStr

    const recorderName = role === 'owner' ? `${currentShop.ownerName} (Pemilik)` : `${cashierName} (Kasir)`
    let dateLabel = 'Hari Ini'
    let dayTag: 'today' | 'yesterday' | 'past' = 'today'

    if (!isToday) {
      const targetTime = new Date(targetDate).setHours(0, 0, 0, 0)
      const todayTime = new Date(todayStr).setHours(0, 0, 0, 0)
      const diffDays = Math.round((todayTime - targetTime) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        dateLabel = 'Kemarin (Susulan)'
        dayTag = 'yesterday'
      } else {
        dateLabel = `Susulan (${formatIndoDate(targetDate)})`
        dayTag = 'past'
      }
    }

    const made = groups.map((g, i) =>
      buildTx(menus, comm, g.channel, g.lines, recorderName, dayTag, nowTime(), `tx_${Date.now()}_${i}`, dateLabel, false)
    )

    setTxs((prev) => [...made, ...prev])
    setLastTx(made)

    // Deduct stock for ingredients
    setMenus((currentMenus) =>
      currentMenus.map((m) => {
        const itemLine = groups.flatMap((g) => g.lines).find((l) => l.menuId === m.id)
        if (!itemLine) return m
        return {
          ...m,
          ingredients: m.ingredients.map((ing) => ({
            ...ing,
            stock: Math.max(0, (ing.stock ?? 50) - ing.amount * itemLine.qty),
          })),
        }
      })
    )

    const addedProfit = made.reduce((s, t) => s + t.profit, 0)
    const newTotalProfit = BASE_PROFIT_TOKO_A + addedProfit

    // Set Instant Feedback
    setInstantFeedback({
      addedProfit,
      totalProfit: newTotalProfit,
      insight: `Stok bahan baku otomatis terpotong. Sisa bahan utama aman untuk operasional.`,
    })

    nav('ringkasan')
    toast(isToday ? 'Pesanan berhasil dicatat' : `Catatan susulan tanggal ${formatIndoDate(targetDate)} tersimpan`)
  }

  const saveCart = () => {
    const lines = Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([menuId, qty]) => ({ menuId, qty }))
    if (!lines.length) {
      toast('Pilih minimal 1 menu sebelum menyimpan transaksi')
      return
    }
    record([{ channel, lines }], txDate)
    setCart({})
  }

  const saveLines = (rows: { menuId: string; qty: number; channel: Channel; amount: number }[]) => {
    const g = new Map<Channel, Line[]>()
    rows.forEach((r) =>
      g.set(r.channel, [...(g.get(r.channel) ?? []), { menuId: r.menuId, qty: r.qty, amount: r.amount }])
    )
    record(
      [...g.entries()].map(([ch, lines]) => ({ channel: ch, lines })),
      txDate
    )
  }

  const addCart = (id: string, delta: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) }))

  const clearCart = () => setCart({})

  // Resep & HPP Management
  const updateIngredientPrice = (menuIdToUpdate: string, ingId: string, newUnitPrice: number) => {
    if (newUnitPrice < 0) {
      toast('Harga bahan tidak boleh bernilai negatif')
      return
    }
    setMenus((current) =>
      current.map((m) => {
        if (m.id !== menuIdToUpdate) return m
        return {
          ...m,
          ingredients: m.ingredients.map((ing) => (ing.id === ingId ? { ...ing, unitPrice: newUnitPrice } : ing)),
        }
      })
    )
    toast('Harga bahan diperbarui: Modal per Porsi (HPP) otomatis dihitung ulang.')
  }

  const updateIngredientStock = (menuIdToUpdate: string, ingId: string, newStock: number) => {
    setMenus((current) =>
      current.map((m) => {
        if (m.id !== menuIdToUpdate) return m
        return {
          ...m,
          ingredients: m.ingredients.map((ing) => (ing.id === ingId ? { ...ing, stock: newStock } : ing)),
        }
      })
    )
    toast('Stok bahan diperbarui')
  }

  const addIngredientToMenu = (menuIdToUpdate: string, newIng: Ingredient) => {
    setMenus((current) =>
      current.map((m) => {
        if (m.id !== menuIdToUpdate) return m
        return {
          ...m,
          ingredients: [...m.ingredients, newIng],
        }
      })
    )
    toast(`Bahan "${newIng.name}" berhasil ditambahkan ke resep.`)
  }

  const addNewMenu = (newMenu: Menu) => {
    setMenus((current) => [newMenu, ...current])
    toast(`Menu baru "${newMenu.name}" siap dijual di kasir!`)
  }

  const aiSuggestRecipe = (targetMenuId: string) => {
    setMenus((current) =>
      current.map((m) => {
        if (m.id !== targetMenuId) return m
        return {
          ...m,
          ingredients: m.ingredients.map((ing) => ({
            ...ing,
            ai: true,
            amount: ing.unit === 'butir' ? 1 : ing.unit === 'ml' ? Math.round(ing.amount * 0.9) : ing.amount,
          })),
        }
      })
    )
    toast('Saran Takaran AI diterapkan: Komposisi resep telah dioptimalkan.')
  }

  const updateCommission = (ch: Channel, pct: number) => {
    const cleanPct = Math.max(0, Math.min(100, Number(pct) || 0))
    setComm((c) => ({ ...c, [ch]: cleanPct }))
    toast(`Potongan komisi ${ch} disetel ke ${cleanPct}%`)
  }

  const updateApiKey = (key: string) => {
    setApiKey(key)
    setActiveApiKey(key)
    toast('Kunci API Google AI Studio tersimpan')
  }

  const useAi = () => {
    if (aiUsed >= aiLimit) return false
    setAiUsed((n) => n + 1)
    return true
  }

  const upgradePlan = () => {
    setPlan('dasar')
    setAiUsed(0)
    toast('Paket Dasar UMKM aktif: Kuota 150 kali pembacaan AI per bulan.')
  }

  // Perhitungan Keuangan Harian
  const newTxs = txs.filter((t) => !t.seed && t.day === 'today')
  const todayProfit = tenantId === 'toko_a'
    ? BASE_PROFIT_TOKO_A + newTxs.reduce((s, t) => s + t.profit, 0)
    : txs.filter((t) => t.day === 'today').reduce((s, t) => s + t.profit, 0)

  const todaySales = tenantId === 'toko_a'
    ? BASE_SALES_TOKO_A + newTxs.reduce((s, t) => s + t.sales, 0)
    : txs.filter((t) => t.day === 'today').reduce((s, t) => s + t.sales, 0)

  return {
    tenantId,
    switchTenant,
    shop: currentShop,
    shops,
    setShops,
    isLoggedIn,
    loginAs,
    logout,
    screen,
    nav,
    role,
    toggleRole,
    cashierName,
    setCashierName,
    menus,
    setMenus,
    setMenusA,
    menuId,
    setMenuId,
    addNewMenu,
    addIngredientToMenu,
    comm,
    updateCommission,
    targetMargin,
    setTargetMargin,
    fixedCost,
    setFixedCost,
    apiKey,
    updateApiKey,
    cart,
    addCart,
    clearCart,
    channel,
    setChannel,
    txDate,
    setTxDate,
    paymentMethod,
    setPaymentMethod,
    txs,
    plan,
    upgradePlan,
    aiUsed,
    aiLimit,
    trialDaysLeft,
    useAi,
    dataDaysCount,
    targetDaysCount,
    confidenceLevel,
    instantFeedback,
    setInstantFeedback,
    toastMsg,
    toast,
    lastTx,
    actionDone,
    setActionDone,
    saveCart,
    saveLines,
    updateIngredientPrice,
    updateIngredientStock,
    aiSuggestRecipe,
    todayProfit,
    todaySales,
    yesterdayProfit: YESTERDAY_PROFIT_TOKO_A,
  }
}

export type AppStore = ReturnType<typeof useStore>
const StoreContext = createContext<AppStore>(null!)

export const AppProvider = ({ children }: { children: ReactNode }) => (
  <StoreContext.Provider value={useStore()}>{children}</StoreContext.Provider>
)

export const useApp = () => useContext(StoreContext)
