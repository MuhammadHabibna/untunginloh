// src/screens/Auth.tsx - Masuk, Daftar, & Onboarding 3 Langkah UntunginLOH
import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coffee,
  Layers,
  LoaderCircle,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
  Utensils,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react'
import { useApp } from '../lib/store'
import { TEMPLATES } from '../lib/data'
import { Button, Card, inputCls } from '../components/ui'
import { LogoUntunginLOH } from '../components/LogoUntunginLOH'

export function Auth() {
  const a = useApp()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      a.toast('Masukkan email toko Anda')
      return
    }
    // Default to Toko A if owner email
    if (email.toLowerCase().includes('kopi') || email.toLowerCase().includes('seno')) {
      a.loginAs('toko_b', 'owner')
    } else if (email.toLowerCase().includes('kasir') || email.toLowerCase().includes('budi')) {
      a.loginAs('toko_a', 'cashier')
    } else {
      a.loginAs('toko_a', 'owner')
    }
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    a.toast('Menghubungkan akun Google...')
    setTimeout(() => {
      setGoogleLoading(false)
      a.loginAs('toko_a', 'owner')
      a.toast('Masuk berhasil dengan Google: sari.kedai@gmail.com')
    }, 600)
  }

  return (
    <div data-name="Layar Masuk" className="px-5 py-8 min-h-dvh flex flex-col justify-between max-w-md mx-auto anim-fade-in-up">
      <div className="space-y-6 pt-2">
        {/* Logo Resmi UntunginLOH */}
        <div className="text-center flex flex-col items-center">
          <LogoUntunginLOH size={52} variant="full" />
          <p className="text-xs text-slate-500 font-medium mt-2">
            Kasir Pintar &amp; Penjaga Margin UMKM Berbasis AI
          </p>
        </div>

        {/* Form Masuk Standar SaaS */}
        <Card className="space-y-3.5 p-5 shadow-xs hover:shadow-sm transition-all duration-300">
          <h2 className="font-extrabold text-base text-slate-900">Masuk ke Toko Anda</h2>

          {/* Tombol Masuk dengan Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 font-bold text-xs text-slate-700 flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer select-none disabled:opacity-60 active:scale-[0.98]"
          >
            {googleLoading ? (
              <LoaderCircle size={16} className="animate-spin text-slate-500" />
            ) : (
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{googleLoading ? 'Menghubungkan Akun Google...' : 'Masuk dengan Akun Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-2.5 text-[11px] font-semibold text-slate-400">
              atau gunakan email toko
            </span>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Pemilik atau Kasir</label>
              <input
                type="email"
                className={inputCls}
                placeholder="nama@tokomu.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kata Sandi</label>
              <input
                type="password"
                className={inputCls}
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full py-3 text-sm font-black shadow-xs mt-2">
              Masuk ke Toko
            </Button>
          </form>
        </Card>

        {/* Akses Cepat Roleplay Multi-Tenant (Untuk Kemudahan Evaluasi & Juri) */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Akses Cepat Pengujian Roleplay:
          </span>

          <div className="grid grid-cols-1 gap-2">
            {/* Toko A */}
            <button
              type="button"
              onClick={() => a.loginAs('toko_a', 'owner')}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-600 transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-800 grid place-items-center shrink-0">
                  <Store size={16} />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 block truncate">
                    Toko A: Kedai Kelapa Muda Segar
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Bu Sari (Pemilik) &bull; Jalur URL: /toko_a
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 shrink-0">Masuk</span>
            </button>

            {/* Toko B */}
            <button
              type="button"
              onClick={() => a.loginAs('toko_b', 'owner')}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-600 transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-amber-50 text-amber-800 grid place-items-center shrink-0">
                  <Coffee size={16} />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-amber-800 block truncate">
                    Toko B: Warung Kopi Senja
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Mas Seno (Pemilik) &bull; Jalur URL: /toko_b
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 shrink-0">Masuk</span>
            </button>

            {/* Kasir Budi */}
            <button
              type="button"
              onClick={() => a.loginAs('toko_a', 'cashier')}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-slate-100 text-slate-700 grid place-items-center shrink-0">
                  <UserCheck size={16} />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 block truncate">
                    Staf Kasir: Budi (Toko A)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Akses Terbatas: Hanya Layanan Kasir POS
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 shrink-0">Masuk</span>
            </button>
          </div>
        </div>

        {/* Ajakan Onboarding 14 Hari */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-center">
          <span className="text-xs text-emerald-950 font-bold block mb-1">Belum punya akun toko?</span>
          <p className="text-xs text-slate-600 mb-3">
            Coba gratis 14 hari tanpa kartu kredit. Contoh menu dan bahan siap pakai langsung tersedia.
          </p>
          <Button
            variant="secondary"
            onClick={() => a.nav('onboarding')}
            className="w-full text-xs font-extrabold min-h-10 bg-white shadow-2xs"
          >
            Daftar &amp; Coba Gratis 14 Hari <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 pt-6">
        &copy; 2026 UntunginLOH &bull; Platform POS &amp; Manajemen Margin UMKM
      </div>
    </div>
  )
}

export function Onboarding() {
  const a = useApp()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedTemplate, setSelectedTemplate] = useState('minuman')
  const [customCategory, setCustomCategory] = useState('')
  const [shopName, setShopName] = useState('Kedai Kelapa Muda Segar')
  const [city, setCity] = useState('Surabaya')

  // Editable Menu & Bahan lists in Step 3
  const [menuList, setMenuList] = useState<string[]>(TEMPLATES[0].menus)
  const [bahanList, setBahanList] = useState<string[]>(TEMPLATES[0].bahan)
  const [newMenuInput, setNewMenuInput] = useState('')
  const [newBahanInput, setNewBahanInput] = useState('')

  const t = TEMPLATES.find((x) => x.id === selectedTemplate) ?? TEMPLATES[0]
  const displayCategoryName =
    selectedTemplate === 'lainnya' && customCategory.trim()
      ? customCategory.trim()
      : t.name

  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplate(tplId)
    const tpl = TEMPLATES.find((x) => x.id === tplId)
    if (tpl) {
      setMenuList([...tpl.menus])
      setBahanList([...tpl.bahan])
    }
    if (tplId === 'minuman' && shopName === 'Warung Kopi Senja') {
      setShopName('Kedai Kelapa Muda Segar')
    } else if (tplId === 'warung' && shopName === 'Kedai Kelapa Muda Segar') {
      setShopName('Warung Makan Sedap')
    } else if (tplId === 'snack' && (shopName === 'Kedai Kelapa Muda Segar' || shopName === 'Warung Makan Sedap')) {
      setShopName('Dapur Roti & Camilan')
    } else if (tplId === 'jasa' && (shopName === 'Kedai Kelapa Muda Segar' || shopName === 'Warung Makan Sedap')) {
      setShopName('Sentosa Laundry & Jasa')
    }
  }

  const handleAddMenu = () => {
    const trimmed = newMenuInput.trim()
    if (!trimmed) return
    if (menuList.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      a.toast('Menu ini sudah ada di daftar')
      return
    }
    setMenuList((prev) => [...prev, trimmed])
    setNewMenuInput('')
    a.toast(`Menu "${trimmed}" berhasil ditambahkan`)
  }

  const handleRemoveMenu = (index: number) => {
    const target = menuList[index]
    setMenuList((prev) => prev.filter((_, i) => i !== index))
    a.toast(`Menu "${target}" dihapus`)
  }

  const handleAddBahan = () => {
    const trimmed = newBahanInput.trim()
    if (!trimmed) return
    if (bahanList.some((b) => b.toLowerCase() === trimmed.toLowerCase())) {
      a.toast('Bahan ini sudah ada di daftar')
      return
    }
    setBahanList((prev) => [...prev, trimmed])
    setNewBahanInput('')
    a.toast(`Bahan "${trimmed}" berhasil ditambahkan`)
  }

  const handleRemoveBahan = (index: number) => {
    const target = bahanList[index]
    setBahanList((prev) => prev.filter((_, i) => i !== index))
    a.toast(`Bahan "${target}" dihapus`)
  }

  const handleResetToDefault = () => {
    setMenuList([...t.menus])
    setBahanList([...t.bahan])
    a.toast('Daftar menu & bahan dipulihkan ke bawaan template')
  }

  const finishOnboarding = () => {
    a.setShops((prev) => ({
      ...prev,
      toko_a: {
        id: 'toko_a',
        name: shopName,
        city: city,
        template: displayCategoryName,
        ownerName: 'Bu Sari',
      },
    }))

    // Jika user membuat atau mengubah daftar menu di langkah 3, inisialisasi menu aktif toko_a
    if (menuList.length > 0) {
      const generatedIngredients = (bahanList.length > 0 ? bahanList : ['Modal Dasar']).map((bName, idx) => ({
        id: `ing_custom_${idx + 1}`,
        name: bName,
        amount: 1,
        unit: 'porsi',
        pricePerUnit: 2500 + (idx % 4) * 1000,
        stock: 50,
      }))

      const newStoreMenus = menuList.map((mName, mIdx) => ({
        id: `m_custom_${mIdx + 1}`,
        name: mName,
        category: displayCategoryName,
        price: 15000,
        ingredients: generatedIngredients.slice(0, Math.min(3, generatedIngredients.length)),
      }))

      a.setMenusA(newStoreMenus)
    }

    a.loginAs('toko_a', 'owner')
    a.toast(`Toko "${shopName}" berhasil didaftarkan dan siap dipakai!`)
  }

  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'minuman':
        return <Coffee size={16} className="text-emerald-700" />
      case 'warung':
        return <Utensils size={16} className="text-emerald-700" />
      case 'snack':
        return <ShoppingBag size={16} className="text-emerald-700" />
      case 'ritel':
        return <Store size={16} className="text-emerald-700" />
      case 'jasa':
        return <Sparkles size={16} className="text-emerald-700" />
      default:
        return <Layers size={16} className="text-emerald-700" />
    }
  }

  return (
    <div data-name="Layar Onboarding" className="px-5 py-6 min-h-dvh flex flex-col justify-between max-w-md mx-auto">
      <div className="space-y-5">
        {/* Header Onboarding */}
        <div className="flex items-center justify-between">
          <LogoUntunginLOH size={36} variant="compact" />
          <span className="text-xs font-bold text-slate-500">
            Langkah {step} dari 3
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-emerald-700 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* LANGKAH 1: PILIH TEMPLATE */}
        {step === 1 && (
          <div key="step-1" className="space-y-4 anim-fade-in-up">
            <div>
              <h2 className="font-black text-xl text-slate-900 leading-tight">Pilih Jenis Usaha Anda</h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilih kategori atau buat kustom untuk menyiapkan resep, bahan baku, dan menu awal.
              </p>
            </div>

            <div className="space-y-2.5">
              {TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`rounded-2xl border p-3.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs active:scale-[0.99] ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-100 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getTemplateIcon(tpl.id)}
                        <span className="font-extrabold text-sm text-slate-900">{tpl.name}</span>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{tpl.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {tpl.menus.slice(0, 3).map((m, i) => (
                        <span key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* Input Tambahan Jika Memilih Opsi Lainnya */}
                    {tpl.id === 'lainnya' && isSelected && (
                      <div
                        className="mt-3 pt-3 border-t border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Tuliskan Bidang / Jenis Usaha Anda:
                        </label>
                        <input
                          type="text"
                          className={inputCls}
                          placeholder="Misal: Laundry Kiloan, Barbershop, Percetakan, Petshop..."
                          value={customCategory}
                          onChange={(e) => {
                            setCustomCategory(e.target.value)
                            if (e.target.value.trim()) {
                              setShopName(`Usaha ${e.target.value.trim()}`)
                            }
                          }}
                          autoFocus
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Sistem AI UntunginLOH akan otomatis mengadaptasi perhitungan margin &amp; struktur modal usaha ini.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <Button onClick={() => setStep(2)} className="w-full py-3 text-sm font-bold mt-2">
              Lanjut ke Identitas Toko <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* LANGKAH 2: IDENTITAS TOKO */}
        {step === 2 && (
          <div key="step-2" className="space-y-4 anim-fade-in-up">
            <div>
              <h2 className="font-black text-xl text-slate-900 leading-tight">Nama Toko &amp; Kota</h2>
              <p className="text-xs text-slate-500 mt-1">
                Kategori Usaha:{' '}
                <span className="font-extrabold text-emerald-700">{displayCategoryName}</span>
              </p>
            </div>

            <Card className="space-y-3.5 p-4 shadow-xs hover:shadow-sm transition-all duration-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Usaha / Toko</label>
                <input
                  className={inputCls}
                  placeholder="Contoh: Kedai Kelapa Segar"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kota Operasional</label>
                <input
                  className={inputCls}
                  placeholder="Contoh: Surabaya"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </Card>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                Kembali
              </Button>
              <Button onClick={() => setStep(3)} className="flex-[2]">
                Periksa Menu &amp; Bahan <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* LANGKAH 3: INPUT & EDIT MENU / BAHAN BAKU DARI USER */}
        {step === 3 && (
          <div key="step-3" className="space-y-4 anim-fade-in-up">
            <div>
              <h2 className="font-black text-xl text-slate-900 leading-tight">Data Awal Toko Anda</h2>
              <p className="text-xs text-slate-500 mt-1">
                Atur menu jualan dan bahan baku modal. Anda bisa menambah, menghapus, atau menyesuaikan sebelum toko dibuka.
              </p>
            </div>

            <Card className="space-y-4 p-4 shadow-xs hover:shadow-sm transition-all duration-200">
              {/* Bagian 1: Menu / Produk Awal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Menu / Produk Siap Jual ({menuList.length})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Ketik &amp; Tambahkan
                  </span>
                </div>

                {/* Daftar Chip Menu dengan Tombol Hapus X */}
                <div className="flex flex-wrap gap-1.5 min-h-7">
                  {menuList.length === 0 ? (
                    <span className="text-xs text-slate-400 italic py-1">
                      Belum ada menu. Masukkan nama menu pertama toko Anda di bawah.
                    </span>
                  ) : (
                    menuList.map((m, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-white font-bold text-xs text-emerald-900 shadow-2xs group anim-pop-in hover:border-emerald-300 transition-all"
                      >
                        <span>{m}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMenu(i)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded cursor-pointer hover:scale-110 active:scale-90"
                          title={`Hapus ${m}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Input Tambah Menu Baru */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Tambah menu baru... (tekan Enter)"
                    value={newMenuInput}
                    onChange={(e) => setNewMenuInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddMenu()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddMenu}
                    className="shrink-0 text-xs px-3 font-bold"
                  >
                    <Plus size={14} /> Tambah
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Bagian 2: Bahan Baku & HPP Otomatis */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Bahan Baku &amp; HPP Otomatis ({bahanList.length})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Komponen Modal
                  </span>
                </div>

                {/* Daftar Chip Bahan Baku dengan Tombol Hapus X */}
                <div className="flex flex-wrap gap-1.5 min-h-7">
                  {bahanList.length === 0 ? (
                    <span className="text-xs text-slate-400 italic py-1">
                      Belum ada bahan baku. Tambahkan bahan modal pokok di bawah.
                    </span>
                  ) : (
                    bahanList.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-xs text-slate-700 group anim-pop-in hover:border-slate-300 transition-all"
                      >
                        <span>{b}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBahan(i)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded cursor-pointer hover:scale-110 active:scale-90"
                          title={`Hapus ${b}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Input Tambah Bahan Baku Baru */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Tambah bahan baku baru... (tekan Enter)"
                    value={newBahanInput}
                    onChange={(e) => setNewBahanInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddBahan()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddBahan}
                    className="shrink-0 text-xs px-3 font-bold"
                  >
                    <Plus size={14} /> Tambah
                  </Button>
                </div>
              </div>

              {/* Tombol Pulihkan ke Default */}
              <div className="pt-1 text-right">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer group transition-colors"
                >
                  <RotateCcw size={12} className="group-hover:-rotate-90 transition-transform duration-300" /> Pulihkan daftar bawaan template
                </button>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                Kembali
              </Button>
              <Button onClick={finishOnboarding} className="flex-[2] py-3 text-base font-black shadow-md">
                Mulai Jualan Sekarang
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-slate-400 pt-4 flex items-center justify-center gap-1.5">
        <Clock size={12} /> Proses penyiapan toko memerlukan waktu kurang dari 3 menit.
      </div>
    </div>
  )
}
