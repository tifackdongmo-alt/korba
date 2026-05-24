import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Product {
  id: string; name: string; category: string; price: string; stock: number; emoji: string; active: boolean
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Doliprane 1000mg', category: 'Médicaments', price: '1 200 F', stock: 48, emoji: '💊', active: true },
  { id: '2', name: 'Spray nasal', category: 'Médicaments', price: '2 100 F', stock: 0, emoji: '💊', active: false },
  { id: '3', name: 'Crème solaire SPF 50', category: 'Cosmétiques', price: '3 800 F', stock: 12, emoji: '🧴', active: true },
  { id: '4', name: 'Sérum vitamine C', category: 'Cosmétiques', price: '6 500 F', stock: 5, emoji: '✨', active: true },
  { id: '5', name: 'Paracétamol 500mg', category: 'Médicaments', price: '900 F', stock: 100, emoji: '💊', active: true },
]

export function VendorCatalogueContainer() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Médicaments', emoji: '📦' })

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  const toggleActive = (id: string) => setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p))
  const deleteProduct = (id: string) => setProducts(ps => ps.filter(p => p.id !== id))
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    setProducts(ps => [...ps, { id: Date.now().toString(), name: newProduct.name, price: newProduct.price, stock: parseInt(newProduct.stock) || 0, category: newProduct.category, emoji: newProduct.emoji, active: true }])
    setNewProduct({ name: '', price: '', stock: '', category: 'Médicaments', emoji: '📦' })
    setShowAddForm(false)
  }

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Mon catalogue</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{products.filter(p => p.active).length} produits actifs</div>
        </div>
        <button onClick={() => setShowAddForm(true)} style={{ padding: '10px 18px', borderRadius: 999, border: 'none', background: '#6E58F1', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(110,88,241,0.3)' }}>
          + Ajouter
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Chercher un produit…"
          style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
      </div>

      {/* Add form */}
      {showAddForm && (
        <div style={{ padding: 18, background: '#fff', borderRadius: 20, border: '2px solid #6E58F1', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 14 }}>Nouveau produit</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input value={newProduct.emoji} onChange={e => setNewProduct(p => ({ ...p, emoji: e.target.value }))} placeholder="Emoji" style={{ width: 60, padding: '10px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 20, textAlign: 'center', outline: 'none', fontFamily: 'inherit' }} />
            <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="Nom du produit" style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="Prix (ex: 1 200 F)" style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <input value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} placeholder="Stock" type="number" style={{ width: 90, padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#666', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
            <button onClick={addProduct} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: '#6E58F1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Ajouter</button>
          </div>
        </div>
      )}

      {/* Products list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(product => (
          <div
            key={product.id}
            style={{ padding: 14, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, opacity: product.active ? 1 : 0.6 }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 14, background: '#F6F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{product.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{product.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{product.category}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#6E58F1' }}>{product.price}</span>
                <span style={{ fontSize: 11, color: product.stock === 0 ? '#e53e3e' : product.stock < 10 ? '#E87B36' : '#888', fontWeight: 500 }}>
                  {product.stock === 0 ? 'Rupture' : `Stock: ${product.stock}`}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {/* Toggle active */}
              <button
                onClick={() => toggleActive(product.id)}
                style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: product.active ? '#E0F2EC' : '#F0F0F0', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {product.active ? '✅' : '🚫'}
              </button>
              {/* Delete */}
              <button
                onClick={() => deleteProduct(product.id)}
                style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: '#FFF0F0', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
