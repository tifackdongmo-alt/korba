import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

const MOCK_ORDERS = [
  { id: 'KB-2841', client: 'Fatou Diallo', items: 'Doliprane 1000mg × 2, Spray nasal', total: '4 800 F', status: 'A_PREPARER', time: 'il y a 3 min', urgent: true },
  { id: 'KB-2839', client: 'Mamadou Sarr', items: 'Paracétamol, Vitamines C', total: '2 350 F', status: 'LIVREUR_ASSIGNE', time: 'il y a 12 min', urgent: false },
  { id: 'KB-2835', client: 'Aïcha Ndiaye', items: 'Crème solaire, Sérum', total: '8 900 F', status: 'EN_ROUTE_VERS_CLIENT', time: 'il y a 28 min', urgent: false },
  { id: 'KB-2830', client: 'Omar Ba', items: 'Antidouleurs × 3', total: '3 200 F', status: 'TERMINEE', time: 'hier 18:42', urgent: false },
]

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  A_PREPARER: { label: 'À préparer', color: '#B85A10', bg: '#FFF1E2' },
  LIVREUR_ASSIGNE: { label: 'Livreur assigné', color: '#5BA4F0', bg: '#E0EEFF' },
  EN_ROUTE_VERS_CLIENT: { label: 'En livraison', color: '#1F8B5B', bg: '#E0F2EC' },
  TERMINEE: { label: 'Terminée', color: '#888', bg: '#F0F0F0' },
}

export function VendorHomeContainer() {
  const { name } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'active' | 'done'>('active')

  const activeOrders = MOCK_ORDERS.filter(o => o.status !== 'TERMINEE')
  const doneOrders = MOCK_ORDERS.filter(o => o.status === 'TERMINEE')
  const shown = activeTab === 'active' ? activeOrders : doneOrders

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: '#888' }}>Bonjour,</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#1a1a1a' }}>{name || 'Vendeur'} 👋</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Pharmacie Liberté 6 · Dakar Plateau</div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Commandes', value: '12', sub: 'aujourd\'hui', color: '#6E58F1', bg: '#F0EDFF' },
          { label: 'En cours', value: `${activeOrders.length}`, sub: 'à traiter', color: '#E87B36', bg: '#FFF1E2' },
          { label: 'Revenus', value: '48K', sub: 'FCFA', color: '#1F8B5B', bg: '#E0F2EC' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} style={{ padding: '14px 12px', borderRadius: 16, background: bg, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 22, color }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 10, color: '#888' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['active', 'done'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: activeTab === tab ? '#6E58F1' : '#F0EDFF',
              color: activeTab === tab ? '#fff' : '#6E58F1',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'active' ? `En cours (${activeOrders.length})` : `Terminées (${doneOrders.length})`}
          </button>
        ))}
        <button
          onClick={() => navigate('/vendor/catalogue')}
          style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 999, border: '1.5px solid #6E58F1', background: 'transparent', color: '#6E58F1', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
        >
          + Produits
        </button>
        <button
          onClick={() => navigate('/vendor/partners')}
          style={{ padding: '8px 14px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.12)', background: 'transparent', color: '#888', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
        >
          🤝
        </button>
      </div>

      {/* Orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.map(order => {
          const s = STATUS_LABELS[order.status] || { label: order.status, color: '#888', bg: '#F0F0F0' }
          return (
            <button
              key={order.id}
              onClick={() => navigate(`/vendor/orders/${order.id}`)}
              style={{ padding: 16, background: '#fff', borderRadius: 18, border: order.urgent ? '1.5px solid #E87B36' : '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'box-shadow 0.15s, transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; (e.currentTarget as HTMLButtonElement).style.transform = '' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>#{order.id}</span>
                  {order.urgent && <span style={{ fontSize: 10, fontWeight: 700, color: '#E87B36', background: '#FFF1E2', padding: '2px 6px', borderRadius: 999 }}>URGENT</span>}
                </div>
                <span style={{ fontSize: 11, color: '#aaa' }}>{order.time}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333', marginBottom: 4 }}>{order.client}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>{order.items}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#6E58F1' }}>{order.total}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
