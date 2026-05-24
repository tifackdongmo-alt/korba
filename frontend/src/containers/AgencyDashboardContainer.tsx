import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

const DRIVERS = [
  { name: 'Cheikh Ndao', vehicle: 'Moto', zone: 'Plateau', orders: 7, rating: 4.9, online: true, status: 'En livraison', id: 'DRV-001' },
  { name: 'Moussa Diop', vehicle: 'Vélo', zone: 'Mermoz', orders: 5, rating: 4.7, online: true, status: 'Disponible', id: 'DRV-002' },
  { name: 'Ibou Sow', vehicle: 'Moto', zone: 'Liberté', orders: 3, rating: 4.5, online: false, status: 'Hors ligne', id: 'DRV-003' },
  { name: 'Aminata Fall', vehicle: 'Moto', zone: 'Dakar', orders: 9, rating: 4.8, online: true, status: 'En route vendeur', id: 'DRV-004' },
]

const METRICS = [
  { label: 'Livraisons', value: '147', sub: 'ce mois', color: '#1F8B5B', bg: '#E0F2EC', icon: '📦', route: '/agency/deliveries' },
  { label: 'Taux succès', value: '96%', sub: '+2% vs mois passé', color: '#6E58F1', bg: '#F0EDFF', icon: '✅', route: '/agency/ratings' },
  { label: 'Livreurs actifs', value: '3', sub: 'sur 4', color: '#5BA4F0', bg: '#E0EEFF', icon: '🏍️', route: '/agency/drivers' },
  { label: 'Revenus', value: '280K', sub: 'FCFA', color: '#E87B36', bg: '#FFF1E2', icon: '💰', route: '/agency/revenue' },
]

export function AgencyDashboardContainer() {
  const { name } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'drivers' | 'zones'>('drivers')

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: '#888' }}>Agence</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#1a1a1a' }}>Dakar Express 🏢</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Gérée par {name || 'Manager'} · Dakar, Sénégal</div>
      </div>

      {/* KPI cards — all clickable */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {METRICS.map(({ label, value, sub, color, bg, icon, route }) => (
          <button
            key={label}
            onClick={() => navigate(route)}
            style={{ padding: 16, borderRadius: 18, background: bg, textAlign: 'left', border: 'none', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${color}30` }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = '' }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontWeight: 800, fontSize: 24, color }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{sub}</div>
            <div style={{ fontSize: 10, color, marginTop: 6, fontWeight: 500 }}>Voir détails →</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['drivers', 'zones'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: tab === t ? '#1F8B5B' : '#E0F2EC', color: tab === t ? '#fff' : '#1F8B5B', transition: 'all 0.15s' }}>
            {t === 'drivers' ? `Livreurs (${DRIVERS.length})` : 'Zones'}
          </button>
        ))}
        <button onClick={() => navigate('/agency/team')} style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 999, border: '1.5px solid #1F8B5B', background: 'transparent', color: '#1F8B5B', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          Gérer →
        </button>
      </div>

      {tab === 'drivers' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DRIVERS.map((d) => (
            <button
              key={d.id}
              onClick={() => navigate(`/agency/drivers?highlight=${d.id}`)}
              style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = ''}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 999, background: '#E0EEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#5BA4F0' }}>{d.name[0]}</div>
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 999, background: d.online ? '#22c55e' : '#ccc', border: '2px solid #fff' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{d.name}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{d.vehicle} · Zone {d.zone}</div>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, color: d.online ? (d.status === 'En livraison' ? '#E87B36' : '#1F8B5B') : '#aaa' }}>{d.status}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{d.orders}</div>
                <div style={{ fontSize: 11, color: '#888' }}>livraisons</div>
                <div style={{ fontSize: 12, color: '#E87B36', fontWeight: 600, marginTop: 2 }}>⭐ {d.rating}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { zone: 'Dakar Plateau', drivers: 3, deliveries: 52, active: true },
            { zone: 'Mermoz / Sacré-Cœur', drivers: 2, deliveries: 38, active: true },
            { zone: 'Liberté / Point-E', drivers: 1, deliveries: 24, active: false },
            { zone: 'Almadies', drivers: 2, deliveries: 33, active: true },
          ].map((z, i) => (
            <div key={i} style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{z.zone}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{z.drivers} livreurs · {z.deliveries} livraisons ce mois</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: z.active ? '#E0F2EC' : '#F0F0F0', color: z.active ? '#1F8B5B' : '#888', fontSize: 11, fontWeight: 600 }}>{z.active ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
