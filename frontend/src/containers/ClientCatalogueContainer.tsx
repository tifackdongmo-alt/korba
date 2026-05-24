import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['Tout', 'Pharmacie', 'Restos', 'Marché', 'Cosmétiques', 'Boutiques']

const PRODUCTS = [
  { id: '1', name: 'Doliprane 1000mg', shop: 'Pharmacie Liberté 6', price: '1 200 F', category: 'Pharmacie', emoji: '💊', inStock: true },
  { id: '2', name: 'Thiéboudienne royal', shop: 'Au bon Maquis', price: '4 500 F', category: 'Restos', emoji: '🍲', inStock: true },
  { id: '3', name: 'Oignons (1kg)', shop: 'Marché Sandaga express', price: '800 F', category: 'Marché', emoji: '🧅', inStock: true },
  { id: '4', name: 'Crème solaire SPF 50', shop: 'Beauté Dakar', price: '3 800 F', category: 'Cosmétiques', emoji: '🧴', inStock: true },
  { id: '5', name: 'Spray nasal', shop: 'Pharmacie Liberté 6', price: '2 100 F', category: 'Pharmacie', emoji: '💊', inStock: false },
  { id: '6', name: 'Mafé poulet', shop: 'Au bon Maquis', price: '3 200 F', category: 'Restos', emoji: '🍗', inStock: true },
  { id: '7', name: 'Tomates (500g)', shop: 'Marché Sandaga express', price: '400 F', category: 'Marché', emoji: '🍅', inStock: true },
  { id: '8', name: 'Sérum vitamine C', shop: 'Beauté Dakar', price: '6 500 F', category: 'Cosmétiques', emoji: '✨', inStock: true },
  { id: '9', name: 'Boubou brodé homme', shop: 'Mode Dakar', price: '18 500 F', category: 'Boutiques', emoji: '👘', inStock: true },
  { id: '10', name: 'Robe wax femme', shop: 'Mode Dakar', price: '12 000 F', category: 'Boutiques', emoji: '👗', inStock: true },
  { id: '11', name: 'Basket sport unisexe', shop: 'Sport & Style SN', price: '22 000 F', category: 'Boutiques', emoji: '👟', inStock: true },
  { id: '12', name: 'Sac tissé local', shop: 'Artisanat Dakar', price: '7 500 F', category: 'Boutiques', emoji: '👜', inStock: false },
]

export function ClientCatalogueContainer() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tout')

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'Tout' || p.category === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.shop.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
        <input
          type="text"
          placeholder="Chercher un produit, une agence…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '13px 14px 13px 42px', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ flex: '0 0 auto', padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: activeCategory === cat ? '#E87B36' : '#fff', color: activeCategory === cat ? '#fff' : '#555', boxShadow: activeCategory === cat ? '0 4px 12px rgba(232,123,54,0.3)' : '0 0 0 1.5px rgba(0,0,0,0.08)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ fontSize: 13, color: '#888', marginBottom: 12, fontWeight: 500 }}>
        {filtered.length} produit{filtered.length !== 1 ? 's' : ''} {search ? `pour "${search}"` : ''}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => navigate(`/client/products/${p.id}`)}
            style={{ padding: 14, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.15s, transform 0.15s', opacity: p.inStock ? 1 : 0.6 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            <div style={{ width: '100%', aspectRatio: '1', borderRadius: 14, background: '#F6F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 10 }}>
              {p.emoji}
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', marginBottom: 2, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>{p.shop}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#E87B36' }}>{p.price}</span>
              {!p.inStock && <span style={{ fontSize: 10, color: '#e53e3e', fontWeight: 600 }}>Rupture</span>}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Aucun résultat</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Essayez un autre mot-clé</div>
        </div>
      )}
    </div>
  )
}
