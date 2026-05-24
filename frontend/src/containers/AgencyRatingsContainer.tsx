import { useNavigate } from 'react-router-dom'

const RATINGS = [
  { id: 1, from: 'Fatou Diallo', type: 'client', to: 'Cheikh Ndao', toType: 'driver', score: 5, comment: 'Très professionnel, livraison rapide et soigneuse.', date: "Aujourd'hui 14:30", orderId: 'KB-2840' },
  { id: 2, from: 'Mamadou Sarr', type: 'client', to: 'Moussa Diop', toType: 'driver', score: 4, comment: 'Bon livreur, légèrement en retard mais très sympa.', date: "Aujourd'hui 12:25", orderId: 'KB-2839' },
  { id: 3, from: 'Cheikh Ndao', type: 'driver', to: 'Fatou Diallo', toType: 'client', score: 5, comment: 'Client très accessible, facile à trouver.', date: "Aujourd'hui 14:32", orderId: 'KB-2840' },
  { id: 4, from: 'Aïcha Ndiaye', type: 'client', to: 'Aminata Fall', toType: 'driver', score: 3, comment: 'Commande reçue mais le paquet était froissé.', date: 'Hier 19:50', orderId: 'KB-2835' },
  { id: 5, from: 'Moussa Diop', type: 'driver', to: 'Mamadou Sarr', toType: 'client', score: 4, comment: 'Client disponible, commande claire.', date: "Aujourd'hui 12:27", orderId: 'KB-2839' },
]

const avgByDriver = (name: string) => {
  const ratings = RATINGS.filter(r => r.to === name)
  if (!ratings.length) return null
  return (ratings.reduce((a, r) => a + r.score, 0) / ratings.length).toFixed(1)
}

export function AgencyRatingsContainer() {
  const navigate = useNavigate()

  const overallAvg = (RATINGS.reduce((a, r) => a + r.score, 0) / RATINGS.length).toFixed(1)

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/agency')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Notations</div>
          <div style={{ fontSize: 12, color: '#888' }}>Évaluations clients ↔ livreurs</div>
        </div>
      </div>

      {/* Overall score */}
      <div style={{ padding: 20, background: 'linear-gradient(135deg, #F0EDFF, #E0E8FF)', borderRadius: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 40, color: '#6E58F1', lineHeight: 1 }}>{overallAvg}</div>
          <div style={{ fontSize: 20, marginTop: 4 }}>{'⭐'.repeat(Math.round(parseFloat(overallAvg)))}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Note globale</div>
        </div>
        <div style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map(n => {
            const count = RATINGS.filter(r => r.score === n).length
            const pct = (count / RATINGS.length) * 100
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#888', width: 16 }}>{n}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: '#D4C8FF', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#6E58F1', borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: 11, color: '#888', width: 20, textAlign: 'right' }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Driver averages */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Moyenne par livreur</div>
        {['Cheikh Ndao', 'Moussa Diop', 'Aminata Fall'].map(name => {
          const avg = avgByDriver(name)
          return avg ? (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: '#E0EEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#5BA4F0' }}>{name[0]}</div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{name}</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#E87B36' }}>⭐ {avg}</span>
            </div>
          ) : null
        })}
      </div>

      {/* All ratings */}
      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Tous les avis</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RATINGS.map(r => (
          <div key={r.id} style={{ padding: 14, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>{r.from}</span>
                <span style={{ fontSize: 12, color: '#888', margin: '0 6px' }}>{r.type === 'client' ? '→' : '→'}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#5BA4F0' }}>{r.to}</span>
              </div>
              <span style={{ fontSize: 12, color: '#E87B36' }}>{'⭐'.repeat(r.score)}</span>
            </div>
            {r.comment && <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5, fontStyle: 'italic' }}>"{r.comment}"</div>}
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>{r.date} · #{r.orderId}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
