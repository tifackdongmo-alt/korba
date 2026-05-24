import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

const MOCK_MISSIONS = [
  {
    id: 'DEL-881', vendor: 'Pharmacie Liberté 6', client: 'Sacré-Cœur 3', distance: '1.2 km',
    amount: '4 800 F', fee: '850 F', items: 3, eta: '8 min', urgent: true, status: 'pending',
  },
  {
    id: 'DEL-879', vendor: 'Au bon Maquis', client: 'Mermoz Pyrotechnie', distance: '2.8 km',
    amount: '6 500 F', fee: '1 200 F', items: 2, eta: '15 min', urgent: false, status: 'pending',
  },
]

export function DriverHomeContainer() {
  const { name } = useAuthStore()
  const navigate = useNavigate()
  const [online, setOnline] = useState(true)
  const [accepted, setAccepted] = useState<string[]>([])
  const [rejected, setRejected] = useState<string[]>([])

  const pendingMissions = MOCK_MISSIONS.filter(m => !accepted.includes(m.id) && !rejected.includes(m.id))
  const activeMissions = MOCK_MISSIONS.filter(m => accepted.includes(m.id))

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      {/* Header + Online toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#1a1a1a' }}>Bonjour {name?.split(' ')[0] || 'Livreur'} 🏍️</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Zone : Dakar Plateau</div>
        </div>
        <button
          onClick={() => setOnline(v => !v)}
          style={{
            padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 13,
            background: online ? '#22c55e' : '#E0E0E0',
            color: online ? '#fff' : '#888',
            transition: 'all 0.2s',
            boxShadow: online ? '0 4px 12px rgba(34,197,94,0.35)' : 'none',
          }}
        >
          {online ? '● En ligne' : '○ Hors ligne'}
        </button>
      </div>

      {/* Today stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
        {[
          { label: 'Missions', value: accepted.length.toString(), sub: 'acceptées', color: '#5BA4F0', bg: '#E0EEFF' },
          { label: 'Km parcourus', value: '24', sub: 'km', color: '#1F8B5B', bg: '#E0F2EC' },
          { label: 'Gains', value: '6 800', sub: 'FCFA', color: '#E87B36', bg: '#FFF1E2' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} style={{ padding: '12px 10px', borderRadius: 16, background: bg, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 20, color }}>{value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color, marginBottom: 1 }}>{label}</div>
            <div style={{ fontSize: 10, color: '#888' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Active missions */}
      {activeMissions.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 10 }}>En cours</div>
          {activeMissions.map(m => (
            <button
              key={m.id}
              onClick={() => navigate(`/driver/orders/${m.id}/navigation`)}
              style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg,#E0EEFF,#C8DAFF)', borderRadius: 18, border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 8 }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 4 }}>#{m.id} · {m.vendor}</div>
              <div style={{ fontSize: 12, color: '#555' }}>📍 {m.client} · {m.distance}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <span style={{ flex: 1, padding: '10px', borderRadius: 12, background: '#5BA4F0', color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>Naviguer →</span>
                <span onClick={(e) => { e.stopPropagation(); navigate(`/driver/orders/${m.id}/proof`) }} style={{ padding: '10px 14px', borderRadius: 12, background: '#fff', color: '#5BA4F0', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Preuve</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pending missions */}
      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 10 }}>
        {online ? (pendingMissions.length > 0 ? `Nouvelles missions (${pendingMissions.length})` : 'En attente de missions…') : 'Passez en ligne pour recevoir des missions'}
      </div>

      {online && pendingMissions.map(m => (
        <div
          key={m.id}
          style={{ padding: 16, background: '#fff', borderRadius: 18, border: m.urgent ? '1.5px solid #5BA4F0' : '1px solid rgba(0,0,0,0.06)', marginBottom: 10 }}
        >
          {m.urgent && <div style={{ fontSize: 10, fontWeight: 700, color: '#5BA4F0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>⚡ Mission urgente</div>}
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>#{m.id}</div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>🏪 {m.vendor}</div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 10 }}>📍 {m.client} · {m.distance} · ~{m.eta}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 13, color: '#888' }}>Gain livraison</span>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#5BA4F0' }}>{m.fee}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, color: '#888' }}>Commande</span>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{m.amount}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => setRejected(v => [...v, m.id])}
              style={{ padding: '12px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.12)', background: 'transparent', color: '#666', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Refuser
            </button>
            <button
              onClick={() => { setAccepted(v => [...v, m.id]); navigate(`/driver/orders/${m.id}/navigation`) }}
              style={{ padding: '12px', borderRadius: 14, border: 'none', background: '#5BA4F0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(91,164,240,0.35)' }}
            >
              Accepter ✓
            </button>
          </div>
        </div>
      ))}

      {online && pendingMissions.length === 0 && activeMissions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏍️</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Toutes les missions ont été traitées</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Nouvelles missions à venir…</div>
        </div>
      )}
    </div>
  )
}
