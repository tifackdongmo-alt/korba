import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

const CATEGORIES = [
  { label: 'Pharmacie', emoji: '💊', color: '#FFE3CB' },
  { label: 'Restos', emoji: '🍲', color: '#E1DCFA' },
  { label: 'Marché', emoji: '🥬', color: '#DCE9D8' },
  { label: 'Cosmétiques', emoji: '🌸', color: '#FDE2EE' },
  { label: 'Boutiques', emoji: '🛍️', color: '#D9E9F8' },
]

const AGENCIES = [
  { name: 'Pharmacie Liberté 6', tag: 'Pharmacie · Dakar Plateau', stars: 4.9, n: 1240, eta: '25–35 min', fee: '500 F', emoji: '💊', bg: '#FFEDDC', verified: true },
  { name: 'Au bon Maquis', tag: 'Restaurant · Mermoz', stars: 4.7, n: 832, eta: '30–45 min', fee: '700 F', emoji: '🍲', bg: '#E1DCFA', badge: 'PRO' },
  { name: 'Marché Sandaga express', tag: 'Marché · Plateau', stars: 4.6, n: 4111, eta: '45–60 min', fee: '1 200 F', emoji: '🥬', bg: '#DCE9D8' },
]

export function ClientHomeContainer() {
  const { name } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Livrer à</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 6 }}>
            📍 Sacré-Cœur 3, Dakar
          </div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: '#E87B36', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
          {(name || 'C')[0].toUpperCase()}
        </div>
      </div>

      {/* Search */}
      <div
        onClick={() => navigate('/client/catalogue')}
        style={{ padding: '12px 16px', borderRadius: 16, background: '#fff', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}
      >
        <span style={{ fontSize: 16 }}>🔍</span>
        <span style={{ fontSize: 14, color: '#aaa', flex: 1 }}>Chercher une agence, un produit…</span>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: '#E87B36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚙️</span>
      </div>

      {/* Active delivery card */}
      <div style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(135deg, #FFF1E2, #FFD9BB)', boxShadow: '0 8px 24px -8px rgba(232,123,54,0.35)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, position: 'relative' }}>
          🏍️
          <span style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: 999, background: '#22c55e', border: '2px solid #fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#B85A10', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>● En route</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Cheikh arrive dans 8 min</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Pharmacie Liberté · 3 articles</div>
        </div>
        <button
          onClick={() => navigate('/client/orders/demo-order/tracking')}
          style={{ padding: '10px 14px', borderRadius: 999, background: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Suivre →
        </button>
      </div>

      {/* Quick access shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <button
          onClick={() => navigate('/client/escrow')}
          style={{ minHeight: 80, padding: 14, borderRadius: 18, border: 'none', background: '#fff', cursor: 'pointer', textAlign: 'left', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }} aria-hidden="true">🔒</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>Paiements</div>
            <div style={{ fontSize: 11, color: '#888' }}>Fonds bloqués</div>
          </div>
        </button>
        <button
          onClick={() => navigate('/client/orders')}
          style={{ minHeight: 80, padding: 14, borderRadius: 18, border: 'none', background: '#fff', cursor: 'pointer', textAlign: 'left', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }} aria-hidden="true">📦</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>Commandes</div>
            <div style={{ fontSize: 11, color: '#888' }}>Historique</div>
          </div>
        </button>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Catégories</span>
          <button onClick={() => navigate('/client/catalogue')} style={{ background: 'none', border: 'none', fontSize: 12, color: '#888', cursor: 'pointer', fontWeight: 500 }}>Tout voir</button>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map(({ label, emoji, color }) => (
            <button
              key={label}
              onClick={() => navigate('/client/catalogue')}
              style={{ flex: '0 0 auto', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div style={{ width: 58, height: 58, borderRadius: 18, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 6, transition: 'transform 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.07)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = ''}
              >{emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#444' }}>{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Agencies */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Agences à proximité</span>
          <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>Trier ↓</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AGENCIES.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate('/client/catalogue')}
              style={{ padding: 14, background: '#fff', borderRadius: 18, display: 'flex', gap: 14, alignItems: 'center', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.15s, transform 0.15s', width: '100%' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 14, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{a.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  {a.name}
                  {a.verified && <span style={{ width: 14, height: 14, borderRadius: 999, background: '#1F8B5B', color: '#fff', fontSize: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✓</span>}
                  {a.badge && <span style={{ padding: '1px 6px', borderRadius: 999, background: '#6E58F1', color: '#fff', fontSize: 9, fontWeight: 700 }}>{a.badge}</span>}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{a.tag}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: '#444', fontWeight: 500 }}>⭐ {a.stars} ({a.n.toLocaleString()})</span>
                  <span style={{ fontSize: 12, color: '#888' }}>🕐 {a.eta}</span>
                  <span style={{ fontSize: 12, color: '#E87B36', fontWeight: 600 }}>{a.fee}</span>
                </div>
              </div>
              <span style={{ fontSize: 18, color: '#ccc' }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
