import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AGENCIES = [
  { id: 'ag1', name: 'Rapid Dakar Express', zone: 'Dakar Centre + Plateau', rating: 4.9, deliveries: 1240, avgTime: '18 min', color: '#1F8B5B', bg: '#E0F2EC', active: true },
  { id: 'ag2', name: 'Flash Livraisons SN', zone: 'Mermoz, Sacré-Cœur, Point-E', rating: 4.7, deliveries: 842, avgTime: '22 min', color: '#6E58F1', bg: '#F0EDFF', active: true },
  { id: 'ag3', name: 'Korba Express Ouest', zone: 'Ngor, Almadies, Ouakam', rating: 4.6, deliveries: 530, avgTime: '28 min', color: '#5BA4F0', bg: '#E0EEFF', active: false },
]

const COURIERS = [
  { id: 'c1', name: 'Cheikh Ndao', agency: 'Rapid Dakar Express', deliveries: 312, rating: 4.95, vehicle: 'Moto', status: 'active', lastDelivery: 'il y a 12 min' },
  { id: 'c2', name: 'Ibrahima Fall', agency: 'Rapid Dakar Express', deliveries: 280, rating: 4.88, vehicle: 'Moto', status: 'active', lastDelivery: 'il y a 1 h' },
  { id: 'c3', name: 'Abdou Diop', agency: 'Flash Livraisons SN', deliveries: 198, rating: 4.72, vehicle: 'Vélo élec.', status: 'offline', lastDelivery: 'Hier' },
  { id: 'c4', name: 'Moussa Sy', agency: 'Flash Livraisons SN', deliveries: 156, rating: 4.65, vehicle: 'Moto', status: 'active', lastDelivery: 'il y a 35 min' },
]

export function VendorPartnersContainer() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'agencies' | 'couriers'>('agencies')
  const [expandedAgency, setExpandedAgency] = useState<string | null>(null)

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Partenaires</div>
          <div style={{ fontSize: 12, color: '#888' }}>Agences et livreurs actifs</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: '#F6F2EF', borderRadius: 14, padding: 4 }}>
        {(['agencies', 'couriers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#6E58F1' : '#888', boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
            {t === 'agencies' ? '🏢 Agences' : '🏍️ Livreurs'}
          </button>
        ))}
      </div>

      {tab === 'agencies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AGENCIES.map(ag => {
            const isOpen = expandedAgency === ag.id
            return (
              <div
                key={ag.id}
                style={{ padding: 16, background: '#fff', borderRadius: 20, border: `1.5px solid ${isOpen ? ag.color + '40' : 'rgba(0,0,0,0.06)'}`, cursor: 'pointer', transition: 'all 0.15s' }}
                onClick={() => setExpandedAgency(v => v === ag.id ? null : ag.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: ag.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏢</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{ag.name}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>📍 {ag.zone}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: ag.color }}>⭐ {ag.rating}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: ag.active ? '#1F8B5B' : '#aaa', background: ag.active ? '#E0F2EC' : '#F0F0F0', padding: '2px 8px', borderRadius: 999 }}>{ag.active ? 'Actif' : 'Inactif'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${ag.color}20` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      <div style={{ padding: '10px 12px', background: ag.bg, borderRadius: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: ag.color }}>{ag.deliveries.toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: ag.color, fontWeight: 600 }}>Livraisons totales</div>
                      </div>
                      <div style={{ padding: '10px 12px', background: ag.bg, borderRadius: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: ag.color }}>{ag.avgTime}</div>
                        <div style={{ fontSize: 10, color: ag.color, fontWeight: 600 }}>Délai moyen</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/vendor/messages/agency-cheikh`) }}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: ag.color, color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                      >
                        💬 Contacter
                      </button>
                      <button
                        onClick={e => e.stopPropagation()}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: `1px solid ${ag.color}`, background: '#fff', color: ag.color, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                      >
                        📊 Statistiques
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'couriers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COURIERS.map(c => (
            <div key={c.id} style={{ padding: '14px 16px', background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 999, background: c.status === 'active' ? '#E0F2EC' : '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, position: 'relative' }}>
                🏍️
                <span style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 999, background: c.status === 'active' ? '#22c55e' : '#ccc', border: '2px solid #fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{c.agency} · {c.vehicle}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>Dernière livraison : {c.lastDelivery}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#E87B36' }}>⭐ {c.rating}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{c.deliveries} liv.</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
