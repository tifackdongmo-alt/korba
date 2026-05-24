import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCartStore } from '@/store/cart'

const PROVIDERS = [
  { value: 'orange_money', label: 'Orange Money', icon: '🟠' },
  { value: 'wave', label: 'Wave', icon: '🔵' },
  { value: 'carte', label: 'Carte bancaire', icon: '💳' },
]

export function ClientCheckoutContainer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'delivery'

  const cartItems = useCartStore(s => s.items)
  const cartTotal = useCartStore(s => s.total)
  const clearCart = useCartStore(s => s.clear)

  const [address, setAddress] = useState('Sacré-Cœur 3, Dakar')
  const [provider, setProvider] = useState('orange_money')
  const [phone, setPhone] = useState('+221 77 412 89 03')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const FALLBACK_ITEMS = [
    { name: 'Doliprane 1000mg', qty: 2, price: '1 200 F', subtotal: '2 400 F' },
    { name: 'Spray nasal', qty: 1, price: '2 100 F', subtotal: '2 100 F' },
  ]
  const ITEMS = cartItems.length > 0
    ? cartItems.map(i => ({
        name: i.name,
        qty: i.quantity,
        price: `${i.price_centimes.toLocaleString()} F`,
        subtotal: `${(i.price_centimes * i.quantity).toLocaleString()} F`,
      }))
    : FALLBACK_ITEMS
  const deliveryFee = '500 F'
  const serviceFee = '200 F'
  const rawTotal = cartItems.length > 0 ? cartTotal() + 700 : 5200
  const total = `${rawTotal.toLocaleString()} F`

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setConfirmed(true)
      clearCart()
      setTimeout(() => navigate('/client/orders/demo-order/tracking'), 2000)
    }, 1500)
  }

  if (confirmed) {
    return (
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🔒</div>
        <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', marginBottom: 8 }}>Paiement sécurisé !</div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Fonds placés en escrow · {total}</div>
        <div style={{ fontSize: 13, color: '#aaa' }}>Redirection vers le suivi…</div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Récapitulatif</div>
          <div style={{ fontSize: 12, color: '#888' }}>{mode === 'escrow' ? 'Paiement sécurisé (escrow)' : 'Livraison à domicile'}</div>
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Articles</div>
        {ITEMS.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < ITEMS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{item.name} × {item.qty}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{item.price} / unité</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#6E58F1' }}>{item.subtotal}</div>
          </div>
        ))}
        <div style={{ borderTop: '1.5px solid rgba(0,0,0,0.06)', paddingTop: 10, marginTop: 6 }}>
          {[{ label: 'Frais de livraison', value: deliveryFee }, { label: 'Frais de service', value: serviceFee }].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#888' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#E87B36' }}>{total}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      {mode !== 'escrow' && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a', marginBottom: 8 }}>📍 Adresse de livraison</div>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
      )}

      {/* Payment */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a', marginBottom: 8 }}>💳 Mode de paiement</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {PROVIDERS.map(p => (
            <button
              key={p.value}
              onClick={() => setProvider(p.value)}
              style={{ flex: 1, padding: '11px 8px', borderRadius: 14, border: `1.5px solid ${provider === p.value ? '#E87B36' : 'rgba(0,0,0,0.08)'}`, background: provider === p.value ? '#FFF1E2' : '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}
            >
              <div style={{ fontSize: 18, marginBottom: 3 }}>{p.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#1a1a1a' }}>{p.label}</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Numéro de téléphone"
            style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {mode === 'escrow' && (
        <div style={{ padding: '12px 16px', background: '#E0F2EC', borderRadius: 14, marginBottom: 14, fontSize: 12, color: '#1F8B5B', lineHeight: 1.5 }}>
          🔒 Vos fonds seront sécurisés en escrow et libérés uniquement à la confirmation du retrait.
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={loading}
        style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: loading ? '#ccc' : '#E87B36', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer', boxShadow: loading ? 'none' : '0 6px 20px rgba(232,123,54,0.4)', transition: 'all 0.2s' }}
      >
        {loading ? 'Traitement…' : mode === 'escrow' ? '🔒 Sécuriser le paiement' : '✓ Confirmer la commande'}
      </button>
    </div>
  )
}
