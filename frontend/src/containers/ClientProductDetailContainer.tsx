import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCartStore } from '@/store/cart'

const MOCK_PRODUCTS: Record<string, {
  id: string; name: string; shop: string; price: string; category: string;
  emoji: string; inStock: boolean; rating: number; reviews: number;
  description: string; images: string[]; tags: string[]
}> = {
  '1': { id: '1', name: 'Doliprane 1000mg', shop: 'Pharmacie Liberté 6', price: '1 200 F', category: 'Pharmacie', emoji: '💊', inStock: true, rating: 4.8, reviews: 312, description: 'Paracétamol 1000mg. Antidouleur et antipyrétique. Boîte de 16 comprimés sécables. À conserver à température ambiante.', images: ['💊', '📦', '🔬'], tags: ['Antidouleur', 'Fièvre', 'OTC'] },
  '2': { id: '2', name: 'Thiéboudienne royal', shop: 'Au bon Maquis', price: '4 500 F', category: 'Restos', emoji: '🍲', inStock: true, rating: 4.9, reviews: 891, description: 'Riz au poisson sénégalais préparé avec poisson frais, légumes de saison, tomates et épices maison. Servi avec sauce citron.', images: ['🍲', '🐟', '🌿'], tags: ['Poisson', 'Sénégalais', 'Plat du jour'] },
  '3': { id: '3', name: 'Oignons (1kg)', shop: 'Marché Sandaga express', price: '800 F', category: 'Marché', emoji: '🧅', inStock: true, rating: 4.5, reviews: 156, description: 'Oignons frais du terroir sénégalais. Cultivés localement à Niayes. Sélectionnés pour leur fraîcheur et leur conservation.', images: ['🧅', '🌱', '🏡'], tags: ['Bio', 'Local', 'Frais'] },
  '4': { id: '4', name: 'Crème solaire SPF 50', shop: 'Beauté Dakar', price: '3 800 F', category: 'Cosmétiques', emoji: '🧴', inStock: true, rating: 4.7, reviews: 234, description: 'Protection solaire haute SPF 50+. Formule hydratante non grasse. Convient à tous les types de peau. 200ml.', images: ['🧴', '☀️', '✨'], tags: ['SPF50', 'Hydratant', 'Peaux sensibles'] },
}

export function ClientProductDetailContainer() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const product = MOCK_PRODUCTS[productId || '1'] || MOCK_PRODUCTS['1']

  const addItem = useCartStore(s => s.addItem)

  const [imgIndex, setImgIndex] = useState(0)
  const [favorited, setFavorited] = useState(false)
  const [qty, setQty] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const parsedPrice = parseInt((product.price || '0').replace(/\D/g, ''), 10)

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <button
          onClick={() => setFavorited(f => !f)}
          style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: favorited ? '#FFF0F0' : '#fff', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {favorited ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Image carousel */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ width: '100%', aspectRatio: '1', borderRadius: 24, background: '#F6F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, marginBottom: 12, position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
          {product.images[imgIndex]}
          {!product.inStock && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#e53e3e' }}>Rupture de stock</div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              style={{ width: 56, height: 56, borderRadius: 12, background: '#F6F2EF', border: `2px solid ${i === imgIndex ? '#E87B36' : 'transparent'}`, cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}
            >
              {img}
            </button>
          ))}
        </div>
      </div>

      {/* Product info */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          {product.tags.map(tag => (
            <span key={tag} style={{ padding: '3px 10px', borderRadius: 999, background: '#F0F0F0', fontSize: 11, fontWeight: 500, color: '#555' }}>{tag}</span>
          ))}
        </div>
        <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', marginBottom: 4 }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#888' }}>⭐ {product.rating} ({product.reviews.toLocaleString()} avis)</span>
          <span style={{ fontSize: 12, color: '#888' }}>🏪 {product.shop}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 24, color: '#E87B36' }}>{product.price}</div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 10, lineHeight: 1.6 }}>{product.description}</div>
      </div>

      {/* Quantity selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '12px 16px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', flex: 1 }}>Quantité</span>
        <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 18 }}>−</button>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a', minWidth: 20, textAlign: 'center' }}>{qty}</span>
        <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: '#E87B36', cursor: 'pointer', fontWeight: 700, fontSize: 18, color: '#fff' }}>+</button>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Deliver */}
        <button
          onClick={() => navigate(`/client/orders/new-${productId}/messaging`)}
          disabled={!product.inStock}
          style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: product.inStock ? '#E87B36' : '#ccc', color: '#fff', fontWeight: 700, fontSize: 15, cursor: product.inStock ? 'pointer' : 'default', boxShadow: product.inStock ? '0 6px 20px rgba(232,123,54,0.35)' : 'none' }}
        >
          🏍️ Commander (livraison)
        </button>

        {/* Physical pickup */}
        <button
          onClick={() => navigate(`/client/payment-choice/${productId}`)}
          disabled={!product.inStock}
          style={{ width: '100%', padding: '15px', borderRadius: 18, border: '2px solid #E87B36', background: '#fff', color: '#E87B36', fontWeight: 700, fontSize: 15, cursor: product.inStock ? 'pointer' : 'default' }}
        >
          🏪 Retrait physique
        </button>

        {/* Add to cart */}
        <button
          onClick={() => {
            addItem({ productId: product.id, vendorId: product.shop, name: product.name, price_centimes: parsedPrice, quantity: qty, image: product.images[0] })
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2000)
          }}
          disabled={!product.inStock}
          style={{ width: '100%', padding: '14px', borderRadius: 18, border: '1.5px solid rgba(0,0,0,0.12)', background: addedToCart ? '#E0F2EC' : '#fff', color: addedToCart ? '#1F8B5B' : '#333', fontWeight: 600, fontSize: 14, cursor: product.inStock ? 'pointer' : 'default', transition: 'all 0.2s' }}
        >
          {addedToCart ? '✅ Ajouté au panier' : '🛒 Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}
