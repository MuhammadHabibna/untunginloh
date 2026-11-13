// src/screens/Menu.tsx - Resep & HPP Responsif Web & Mobile UntunginLOH
import { useState } from 'react'
import { ArrowLeft, BookOpen, ChevronRight, Edit2, Plus, Sparkles, TrendingUp, X } from 'lucide-react'
import { useApp } from '../lib/store'
import { marginPct, modal, rp, unitProfit, type Ingredient, type Menu } from '../lib/data'
import { Button, Card, InfoTip, inputCls, MarginBadge, Sheet } from '../components/ui'

export function MenuList() {
  const a = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMenuName, setNewMenuName] = useState('')
  const [newMenuPrice, setNewMenuPrice] = useState<number>(12000)

  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMenuName.trim()) {
      a.toast('Masukkan nama menu baru')
      return
    }

    const created: Menu = {
      id: `menu_${Date.now()}`,
      name: newMenuName.trim(),
      price: Number(newMenuPrice) || 10000,
      icon: 'kelapa',
      ingredients: [
        { id: `ing_base_${Date.now()}`, name: 'Bahan Baku Pokok', amount: 1, unit: 'porsi', unitPrice: 3500, stock: 50 },
        { id: `ing_cup_${Date.now()}`, name: 'Kemasan Cup & Sedotan', amount: 1, unit: 'set', unitPrice: 800, stock: 100 },
      ],
    }

    a.addNewMenu(created)
    setNewMenuName('')
    setShowAddModal(false)
  }

  return (
    <div data-name="Layar Menu" className="p-4 lg:p-8 space-y-6">
      {/* Header Web */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Katalog Resep &amp; HPP</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {a.shop.name} &bull; Pantau Modal Bahan Baku &amp; Margin Laba per Menu
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={() => setShowAddModal(true)}
            className="h-10 text-xs px-3.5 font-bold shadow-xs"
          >
            <Plus size={15} /> Tambah Menu Baru
          </Button>
        </div>
      </div>

      {/* Grid Menu Responsif (1 Kolom di Mobile, 2 Kolom di Tablet, 3 Kolom di Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {a.menus.map((m) => {
          const hpp = modal(m)
          const untungShopee = unitProfit(m, a.comm, 'shopee')
          const marginOnline = marginPct(m, a.comm, 'shopee')

          return (
            <Card
              key={m.id}
              onClick={() => a.nav('resep', m.id)}
              className="hover:border-emerald-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer p-4 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {m.name}
                    </h4>
                    <span className="text-xs text-slate-500 font-semibold">{rp(m.price)}</span>
                  </div>
                  <MarginBadge pct={marginOnline} />
                </div>

                <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                  {m.ingredients.map((i) => i.name).join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 text-slate-600">
                <span className="flex items-center">
                  HPP: <strong className="text-slate-800 ml-1">{rp(hpp)}</strong> <InfoTip termKey="hpp" />
                </span>
                <span className="flex items-center">
                  Untung Online: <strong className={marginOnline < 20 ? 'text-red-600 ml-1 font-bold' : 'text-emerald-700 ml-1 font-bold'}>{rp(untungShopee)}</strong>
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Modal Tambah Menu Baru */}
      {showAddModal && (
        <Sheet title="Tambah Menu Baru ke Katalog" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleCreateMenu} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Menu</label>
              <input
                className={inputCls}
                placeholder="Contoh: Es Cincau Gula Aren"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Harga Jual Normal (Rp)</label>
              <input
                type="number"
                className={inputCls}
                placeholder="12000"
                value={newMenuPrice}
                onChange={(e) => setNewMenuPrice(Number(e.target.value))}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Bahan baku awal dan takaran porsi dapat disesuaikan langsung pada rincian resep.
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1 font-bold">
                Simpan Menu Baru
              </Button>
            </div>
          </form>
        </Sheet>
      )}
    </div>
  )
}

export function Resep() {
  const a = useApp()
  const currentMenu = a.menus.find((m) => m.id === a.menuId) ?? a.menus[0]
  const [editingIng, setEditingIng] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<number>(0)
  const [tempStock, setTempStock] = useState<number>(0)

  // Tambah Bahan Baku Baru Modal State
  const [showAddIngModal, setShowAddIngModal] = useState(false)
  const [newIngName, setNewIngName] = useState('')
  const [newIngAmount, setNewIngAmount] = useState<number>(1)
  const [newIngUnit, setNewIngUnit] = useState('ml')
  const [newIngPrice, setNewIngPrice] = useState<number>(50)

  if (!currentMenu) return null

  const hpp = modal(currentMenu)
  const untungShopee = unitProfit(currentMenu, a.comm, 'shopee')
  const marginShopee = marginPct(currentMenu, a.comm, 'shopee')

  const startEdit = (ing: Ingredient) => {
    setEditingIng(ing.id)
    setTempPrice(ing.unitPrice)
    setTempStock(ing.stock ?? 100)
  }

  const saveEdit = (ingId: string) => {
    a.updateIngredientPrice(currentMenu.id, ingId, tempPrice)
    a.updateIngredientStock(currentMenu.id, ingId, tempStock)
    setEditingIng(null)
  }

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIngName.trim()) {
      a.toast('Masukkan nama bahan baku')
      return
    }

    const newIng: Ingredient = {
      id: `ing_${Date.now()}`,
      name: newIngName.trim(),
      amount: Number(newIngAmount) || 1,
      unit: newIngUnit.trim() || 'porsi',
      unitPrice: Number(newIngPrice) || 0,
      stock: 100,
    }

    a.addIngredientToMenu(currentMenu.id, newIng)
    setNewIngName('')
    setShowAddIngModal(false)
  }

  return (
    <div data-name="Layar Detail Resep" className="p-4 lg:p-8 space-y-6">
      {/* Header dengan Tombol Kembali */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => a.nav('menu')}
            className="size-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center text-slate-600 cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">{currentMenu.name}</h1>
            <p className="text-xs text-slate-500 font-medium">Pengaturan Takaran Bahan, HPP, &amp; Analisis Margin</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="h-9 text-xs border-emerald-600 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 hidden sm:inline-flex"
            onClick={() => a.aiSuggestRecipe(currentMenu.id)}
          >
            <Sparkles size={14} className="text-emerald-700" /> Optimasi AI
          </Button>

          <Button
            onClick={() => setShowAddIngModal(true)}
            className="h-9 text-xs font-bold px-3"
          >
            <Plus size={14} /> Tambah Bahan
          </Button>
        </div>
      </div>

      {/* Tata Letak Responsif Desktop Split 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Ringkasan Margin & Rekomendasi */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-slate-50 border-slate-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Analisis Margin ShopeeFood ({a.comm.shopee}%)</span>
              <MarginBadge pct={marginShopee} />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">Harga Jual</span>
                <span className="font-extrabold text-slate-900 text-sm">{rp(currentMenu.price)}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">HPP (Modal)</span>
                <span className="font-extrabold text-slate-900 text-sm">{rp(hpp)}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">Untung Bersih</span>
                <span className={`font-extrabold text-sm ${marginShopee < 20 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {rp(untungShopee)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Modal per Porsi (HPP) dihitung otomatis dari akumulasi harga beli bahan baku supplier per porsi. Jika harga supplier naik, HPP langsung terupdate secara real-time.
            </p>
          </Card>

          <Button
            variant="secondary"
            className="w-full h-11 text-xs border-emerald-600 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 sm:hidden"
            onClick={() => a.aiSuggestRecipe(currentMenu.id)}
          >
            <Sparkles size={14} className="text-emerald-700" /> Optimasi Takaran dengan AI
          </Button>
        </div>

        {/* Kolom Kanan: Daftar Bahan Baku & Editor Harga */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span>Komposisi Bahan Baku ({currentMenu.ingredients.length} item)</span>
            <span className="text-slate-400 font-normal">Ubah harga beli supplier untuk simulasi HPP</span>
          </div>

          <div className="space-y-2.5">
            {currentMenu.ingredients.map((ing) => {
              const isEditing = editingIng === ing.id
              const subtotal = Math.round(ing.amount * ing.unitPrice)

              return (
                <div
                  key={ing.id}
                  className={`rounded-2xl border p-4 bg-white text-xs transition-all shadow-xs ${
                    ing.ai ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{ing.name}</span>
                      {ing.ai && (
                        <span className="text-[11px] font-bold text-emerald-800">
                          (Disarankan AI)
                        </span>
                      )}
                    </div>
                    <span className="font-black text-sm text-slate-900">{rp(subtotal)}</span>
                  </div>

                  <div className="text-slate-500 flex items-center justify-between pt-1">
                    <span>
                      {ing.amount} {ing.unit} &bull; Harga satuan: {rp(ing.unitPrice)}/{ing.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => (isEditing ? saveEdit(ing.id) : startEdit(ing))}
                      className="text-emerald-700 font-extrabold hover:underline cursor-pointer"
                    >
                      {isEditing ? 'Simpan' : 'Ubah Harga'}
                    </button>
                  </div>

                  {isEditing && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          Harga Beli Satuan dari Supplier (Rp)
                        </label>
                        <input
                          type="number"
                          className={inputCls + ' h-9 text-xs'}
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Number(e.target.value))}
                        />
                      </div>
                      <Button onClick={() => saveEdit(ing.id)} className="h-9 px-3 mt-4 text-xs">
                        Terapkan
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal Tambah Bahan Baku Baru */}
      {showAddIngModal && (
        <Sheet title="Tambah Bahan Baku ke Resep" onClose={() => setShowAddIngModal(false)}>
          <form onSubmit={handleAddIngredient} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Bahan Baku</label>
              <input
                className={inputCls}
                placeholder="Contoh: Gula Aren Cair"
                value={newIngName}
                onChange={(e) => setNewIngName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Takaran per Porsi</label>
                <input
                  type="number"
                  className={inputCls}
                  placeholder="25"
                  value={newIngAmount}
                  onChange={(e) => setNewIngAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Satuan Takar</label>
                <input
                  className={inputCls}
                  placeholder="ml / gr / butir"
                  value={newIngUnit}
                  onChange={(e) => setNewIngUnit(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Harga Beli Satuan (Rp)</label>
              <input
                type="number"
                className={inputCls}
                placeholder="50"
                value={newIngPrice}
                onChange={(e) => setNewIngPrice(Number(e.target.value))}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowAddIngModal(false)} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1 font-bold">
                Tambah ke Resep
              </Button>
            </div>
          </form>
        </Sheet>
      )}
    </div>
  )
}
