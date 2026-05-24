import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DELIVERIES = [
  { id: 'DEL-881', driver: 'Cheikh Ndao', client: 'Fatou Diallo', vendor: 'Pharmacie Liberté 6', amount: '4 800 F', fee: '850 F', status: 'TERMINEE', date: "Aujourd'hui 14:22", rating: 5 },
  { id: 'DEL-879', driver: 'Moussa Diop', client: 'Mamadou Sarr', vendor: 'Au bon Maquis', amount: '6 500 F', fee: '1 200 F', status: 'TERMINEE', date: "Aujourd'hui 12:10", rating: 4 },
  { id: 'DEL-877', driver: 'Aminata Fall', client: 'Aïcha Ndiaye', vendor: 'Marché Sandaga', amount: '1 800 F', fee: '600 F', status: 'EN_COURS', date: "Aujourd'hui 11:30", rating: null },
  { id: 'DEL-875', driver: 'Ibou Sow', client: 'Omar Ba', vendor: 'Beauté Dakar', amount: '5 200 F', fee: '950 F', status: 'LITIGE', date: 'Hier 18:42', rating: null },
  { id: 'DEL-872', driver: 'Cheikh Ndao', client: 'Fatou Diallo', vendor: 'Pharmacie Liberté 6', amount: '2 100 F', fee: '500 F', status: 'TERMINEE', date: 'Hier 16:00', rating: 5 },
  { id: 'DEL-870', driver: 'Moussa Diop', client: 'Rokhaya Diallo', vendor: 'Au bon Maquis', amount: '3 800 F', fee: '750 F', status: 'REMBOURSEE', date: 'Hier 14:30', rating: null },
]

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  TERMINEE: { label: '✅ Terminée', color: '#1F8B5B', bg: '#E0F2EC' },
  EN_COURS: { label: '🏍️ En cours', color: '#5BA4F0', bg: '#E0EEFF' },
  LITIGE: { label: '⚠️ Litige', color: '#e53e3e', bg: '#FFF0F0' },
  REMBOURSEE: { label: '↩️ Remboursée', color: '#888', bg: '#F0F0F0' },
}

export function AgencyDeliveryHistoryContainer() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filtered = DELIVERIES.filter(d => filter === 'all' || d.status === filter)

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/agency')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Historique livraisons</div>
          <div style={{ fontSize: 12, color: '#888' }}>{DELIVERIES.length} livraisons ce mois</div>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { label: 'Toutes', value: 'all', count: DELIVERIES.length },
          { label: 'Terminées', value: 'TERMINEE', count: DELIVERIES.filter(d => d.status === 'TERMINEE').length },
          { label: 'En cours', value: 'EN_COURS', count: DELIVERIES.filter(d => d.status === 'EN_COURS').length },
          { label: 'Litiges', value: 'LITIGE', count: DELIVERIES.filter(d => d.status === 'LITIGE').length },
        ].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} style={{ flex: '0 0 auto', padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, background: filter === f.value ? '#1F8B5B' : '#E0F2EC', color: filter === f.value ? '#fff' : '#1F8B5B', whiteSpace: 'nowrap' }}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {filtered.map(d => {
        const s = STATUS_CFG[d.status] || STATUS_CFG['TERMINEE']
        const isExpanded = selected === d.id
        return (
          <div
            key={d.id}
            onClick={() => setSelected(v => v === d.id ? null : d.id)}
            style={{ padding: 16, background: '#fff', borderRadius: 18, border: `1px solid ${isExpanded ? '#1F8B5B40' : 'rgba(0,0,0,0.06)'}`, marginBottom: 10, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>#{d.id}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{d.date}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600 }}>{s.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#555' }}>
              <span>🏍️ {d.driver}</span>
              <span>👤 {d.client}</span>
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>🏪 {d.vendor}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1F8B5B' }}>Commission : {d.fee}</span>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 10 }}>Commande : {d.amount}</span>
              </div>
              {d.rating && <span style={{ fontSize: 12, color: '#C28714' }}>{'⭐'.repeat(d.rating)}</span>}
            </div>
            {isExpanded && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ padding: '10px 12px', background: '#F6F2EF', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: '#888' }}>Distance</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>2,4 km</div>
                  </div>
                  <div style={{ padding: '10px 12px', background: '#F6F2EF', borderRadius: 12 }}>
                    <div style={{ fontSize: 11, color: '#888' }}>Durée</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>18 min</div>
                  </div>
                </div>
                {d.status === 'LITIGE' && (
                  <button style={{ width: '100%', marginTop: 10, padding: '11px', borderRadius: 14, border: 'none', background: '#FFF0F0', color: '#e53e3e', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Gérer le litige →
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
