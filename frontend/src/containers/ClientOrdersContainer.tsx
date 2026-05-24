import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ORDERS = [
  { id: 'KB-2840', shop: 'Pharmacie Liberté 6', items: 'Doliprane 1000mg × 2', total: '2 700 F', status: 'EN_ROUTE_VERS_CLIENT', date: "Aujourd'hui 14:10", emoji: '💊' },
  { id: 'KB-2820', shop: 'Au bon Maquis', items: 'Thiéboudienne royal', total: '5 200 F', status: 'TERMINEE', date: 'Hier 19:42', emoji: '🍲' },
  { id: 'KB-2805', shop: 'Marché Sandaga express', items: 'Oignons 1kg, Tomates 500g', total: '1 500 F', status: 'TERMINEE', date: '21 mai, 11:30', emoji: '🧅' },
  { id: 'KB-2790', shop: 'Beauté Dakar', items: 'Crème solaire SPF 50', total: '4 300 F', status: 'REMBOURSEE', date: '18 mai, 16:00', emoji: '🧴' },
]

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  EN_ATTENTE: { label: 'En attente', color: '#B85A10', bg: '#FFF1E2' },
  A_PREPARER: { label: 'En préparation', color: '#5BA4F0', bg: '#E0EEFF' },
  EN_ROUTE_VERS_CLIENT: { label: '🏍️ En livraison', color: '#1F8B5B', bg: '#E0F2EC' },
  TERMINEE: { label: '✅ Livrée', color: '#555', bg: '#F0F0F0' },
  REMBOURSEE: { label: '↩️ Remboursée', color: '#e53e3e', bg: '#FFF0F0' },
}

export function ClientOrdersContainer() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  const shown = ORDERS.filter(o => {
    if (filter === 'active') return o.status !== 'TERMINEE' && o.status !== 'REMBOURSEE'
    if (filter === 'done') return o.status === 'TERMINEE' || o.status === 'REMBOURSEE'
    return true
  })

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', marginBottom: 20 }}>Mes commandes</div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, padding: '8px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, background: filter === f ? '#E87B36' : '#fff', color: filter === f ? '#fff' : '#666', transition: 'all 0.15s', boxShadow: filter === f ? '0 4px 12px rgba(232,123,54,0.3)' : '0 0 0 1px rgba(0,0,0,0.08)' }}>
            {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : 'Terminées'}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.map(order => {
          const s = STATUS_CFG[order.status] || { label: order.status, color: '#888', bg: '#F0F0F0' }
          const isActive = order.status !== 'TERMINEE' && order.status !== 'REMBOURSEE'
          return (
            <button
              key={order.id}
              onClick={() => isActive ? navigate(`/client/orders/${order.id}/tracking`) : undefined}
              style={{ padding: 16, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', cursor: isActive ? 'pointer' : 'default', textAlign: 'left', width: '100%', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => isActive && ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '')}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F6F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{order.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>#{order.id}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#E87B36' }}>{order.total}</div>
                  </div>
                  <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{order.shop}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{order.items}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: '#aaa' }}>{order.date}</span>
                  </div>
                </div>
              </div>
              {isActive && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button onClick={e => { e.stopPropagation(); navigate(`/client/orders/${order.id}/tracking`) }} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: '#E87B36', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>📍 Suivre</button>
                  <button onClick={e => { e.stopPropagation(); navigate(`/client/orders/${order.id}/messaging`) }} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#333', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>💬 Message</button>
                </div>
              )}
            </button>
          )
        })}
        {shown.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Aucune commande</div>
          </div>
        )}
      </div>
    </div>
  )
}
