import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HISTORY = [
  { id: 'DEL-881', client: 'Fatou Diallo', vendor: 'Pharmacie Liberté 6', fee: '850 F', distance: '2.4 km', duration: '18 min', rating: 5, date: "Aujourd'hui 14:22", status: 'done' },
  { id: 'DEL-879', client: 'Mamadou Sarr', vendor: 'Au bon Maquis', fee: '1 200 F', distance: '3.1 km', duration: '22 min', rating: 4, date: "Aujourd'hui 12:10", status: 'done' },
  { id: 'DEL-875', client: 'Aïcha Ndiaye', vendor: 'Marché Sandaga', fee: '600 F', distance: '1.8 km', duration: '14 min', rating: null, date: 'Hier 18:42', status: 'done' },
  { id: 'DEL-870', client: 'Omar Ba', vendor: 'Beauté Dakar', fee: '950 F', distance: '4.2 km', duration: '28 min', rating: 5, date: 'Hier 15:20', status: 'done' },
  { id: 'DEL-865', client: 'Rokhaya Diallo', vendor: 'Pharmacie Liberté 6', fee: '500 F', distance: '1.2 km', duration: '10 min', rating: 3, date: 'Avant-hier 11:00', status: 'done' },
]

export function DriverHistoryContainer() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  const totalFee = HISTORY.reduce((a, d) => a + parseInt(d.fee.replace(/\D/g, '')), 0)
  const avgRating = (HISTORY.filter(d => d.rating).reduce((a, d) => a + (d.rating || 0), 0) / HISTORY.filter(d => d.rating).length).toFixed(1)

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', marginBottom: 20 }}>Historique</div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
        <div style={{ padding: '12px 8px', borderRadius: 16, background: '#E0EEFF', textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#5BA4F0' }}>{HISTORY.length}</div>
          <div style={{ fontSize: 10, color: '#5BA4F0', fontWeight: 600 }}>Ce mois</div>
        </div>
        <div style={{ padding: '12px 8px', borderRadius: 16, background: '#FFF1E2', textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#E87B36' }}>{totalFee.toLocaleString()} F</div>
          <div style={{ fontSize: 10, color: '#E87B36', fontWeight: 600 }}>Gains</div>
        </div>
        <div style={{ padding: '12px 8px', borderRadius: 16, background: '#E0F2EC', textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1F8B5B' }}>⭐ {avgRating}</div>
          <div style={{ fontSize: 10, color: '#1F8B5B', fontWeight: 600 }}>Moyenne</div>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {HISTORY.map(d => {
          const isExpanded = selected === d.id
          return (
            <div
              key={d.id}
              onClick={() => setSelected(v => v === d.id ? null : d.id)}
              style={{ padding: 14, background: '#fff', borderRadius: 18, border: `1px solid ${isExpanded ? '#5BA4F040' : 'rgba(0,0,0,0.06)'}`, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#E0EEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏍️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>#{d.id}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#5BA4F0' }}>{d.fee}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{d.vendor} → {d.client}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: '#888' }}>📍 {d.distance}</span>
                    <span style={{ fontSize: 11, color: '#888' }}>⏱ {d.duration}</span>
                    {d.rating && <span style={{ fontSize: 11, color: '#E87B36' }}>{'⭐'.repeat(d.rating)}</span>}
                    <span style={{ fontSize: 11, color: '#aaa', marginLeft: 'auto' }}>{d.date}</span>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ padding: '10px 12px', background: '#F6F2EF', borderRadius: 12 }}>
                      <div style={{ fontSize: 11, color: '#888' }}>Client</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{d.client}</div>
                    </div>
                    <div style={{ padding: '10px 12px', background: '#F6F2EF', borderRadius: 12 }}>
                      <div style={{ fontSize: 11, color: '#888' }}>Vendeur</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{d.vendor}</div>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); navigate(`/driver/messages/${d.id}`) }} style={{ width: '100%', marginTop: 10, padding: '10px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#333', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                    💬 Voir la conversation
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
