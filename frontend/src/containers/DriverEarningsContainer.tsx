import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WEEKLY_DATA = [4200, 6800, 3500, 8100, 5600, 7200, 6800]
const DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

const PAYOUTS = [
  { date: '24 mai 2026', amount: '28 500 F', method: 'Orange Money', status: 'done' },
  { date: '17 mai 2026', amount: '31 200 F', method: 'Wave', status: 'done' },
  { date: '10 mai 2026', amount: '25 800 F', method: 'Orange Money', status: 'done' },
]

export function DriverEarningsContainer() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'week' | 'month'>('week')

  const weekTotal = WEEKLY_DATA.reduce((a, b) => a + b, 0)
  const maxVal = Math.max(...WEEKLY_DATA)

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', marginBottom: 20 }}>Mes gains</div>

      {/* Big total */}
      <div style={{ padding: 24, background: 'linear-gradient(135deg, #E0EEFF, #C0D8FF)', borderRadius: 24, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#5BA4F0', fontWeight: 600, marginBottom: 6 }}>Cette semaine</div>
        <div style={{ fontWeight: 800, fontSize: 36, color: '#1a1a1a' }}>{weekTotal.toLocaleString()} F</div>
        <div style={{ fontSize: 12, color: '#555', marginTop: 6 }}>Taux de succès : 98% · 24 livraisons</div>
        <button style={{ marginTop: 16, padding: '11px 24px', borderRadius: 999, border: 'none', background: '#5BA4F0', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(91,164,240,0.4)' }}>
          💸 Demander un virement
        </button>
      </div>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['week', 'month'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: tab === t ? '#5BA4F0' : '#E0EEFF', color: tab === t ? '#fff' : '#5BA4F0', transition: 'all 0.15s' }}>
            {t === 'week' ? 'Semaine' : 'Mois'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: 18, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', marginBottom: 16 }}>Gains journaliers (FCFA)</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80 }}>
          {WEEKLY_DATA.map((val, i) => {
            const height = (val / maxVal) * 100
            const isToday = i === 6
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, color: isToday ? '#5BA4F0' : '#888', fontWeight: isToday ? 700 : 400 }}>{(val / 1000).toFixed(1)}K</div>
                <div style={{ width: '100%', height: `${height}%`, borderRadius: '4px 4px 0 0', background: isToday ? '#5BA4F0' : '#C8DAFF', minHeight: 4, transition: 'height 0.3s' }} />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {DAYS.map((d, i) => (
            <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: i === 6 ? '#5BA4F0' : '#aaa', fontWeight: i === 6 ? 700 : 400 }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Nb livraisons', value: '24', sub: 'cette semaine', color: '#5BA4F0', bg: '#E0EEFF' },
          { label: 'Gain moyen', value: '1 762 F', sub: 'par livraison', color: '#E87B36', bg: '#FFF1E2' },
          { label: 'Km parcourus', value: '84 km', sub: 'cette semaine', color: '#1F8B5B', bg: '#E0F2EC' },
          { label: 'Taux acceptation', value: '92%', sub: 'missions reçues', color: '#6E58F1', bg: '#F0EDFF' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 12px', borderRadius: 16, background: s.bg }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.color, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: '#888' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Payout history */}
      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Historique des virements</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PAYOUTS.map((p, i) => (
          <div key={i} style={{ padding: '13px 16px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E0F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💸</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Virement {p.method}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{p.date}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1F8B5B' }}>{p.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
