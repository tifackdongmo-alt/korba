import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TRANSACTIONS = [
  { id: 'TXN-441', type: 'commission', label: 'Commission livraison #DEL-881', amount: '+850 F', date: "Aujourd'hui 14:22", positive: true },
  { id: 'TXN-440', type: 'commission', label: 'Commission livraison #DEL-879', amount: '+1 200 F', date: "Aujourd'hui 12:10", positive: true },
  { id: 'TXN-439', type: 'commission', label: 'Commission livraison #DEL-877', amount: '+600 F', date: "Aujourd'hui 11:30", positive: true },
  { id: 'TXN-438', type: 'payout', label: 'Virement Cheikh Ndao', amount: '-12 500 F', date: 'Hier 18:00', positive: false },
  { id: 'TXN-437', type: 'payout', label: 'Virement Moussa Diop', amount: '-8 200 F', date: 'Hier 18:00', positive: false },
  { id: 'TXN-436', type: 'commission', label: 'Commission livraison #DEL-875', amount: '+950 F', date: 'Hier 16:00', positive: true },
  { id: 'TXN-435', type: 'refund', label: 'Remboursement litige #DEL-870', amount: '-3 800 F', date: 'Hier 15:00', positive: false },
  { id: 'TXN-434', type: 'commission', label: 'Commission livraison #DEL-870', amount: '+750 F', date: 'Hier 14:30', positive: true },
]

const PERIOD_STATS = [
  { label: 'Ce mois', commissions: '45 600 F', payouts: '38 200 F', net: '7 400 F' },
  { label: 'Mois dernier', commissions: '52 800 F', payouts: '44 100 F', net: '8 700 F' },
]

export function AgencyRevenueContainer() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState(0)

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/agency')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Revenus</div>
          <div style={{ fontSize: 12, color: '#888' }}>Commissions & virements</div>
        </div>
      </div>

      {/* Period selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {PERIOD_STATS.map((p, i) => (
          <button key={i} onClick={() => setPeriod(i)} style={{ flex: 1, padding: '9px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: period === i ? '#E87B36' : '#FFF1E2', color: period === i ? '#fff' : '#E87B36', transition: 'all 0.15s' }}>{p.label}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div style={{ padding: '14px 10px', borderRadius: 16, background: '#E0F2EC', textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1F8B5B' }}>{PERIOD_STATS[period].commissions}</div>
          <div style={{ fontSize: 10, color: '#1F8B5B', fontWeight: 600, marginTop: 2 }}>Commissions</div>
        </div>
        <div style={{ padding: '14px 10px', borderRadius: 16, background: '#FFF0F0', textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#e53e3e' }}>{PERIOD_STATS[period].payouts}</div>
          <div style={{ fontSize: 10, color: '#e53e3e', fontWeight: 600, marginTop: 2 }}>Virements</div>
        </div>
        <div style={{ padding: '14px 10px', borderRadius: 16, background: '#FFF1E2', textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#E87B36' }}>{PERIOD_STATS[period].net}</div>
          <div style={{ fontSize: 10, color: '#E87B36', fontWeight: 600, marginTop: 2 }}>Net</div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', marginBottom: 12 }}>Revenus journaliers</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60 }}>
          {[40, 65, 30, 80, 55, 70, 90].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', background: i === 6 ? '#E87B36' : '#FFD9BB', transition: 'height 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
            <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#aaa' }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Transactions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TRANSACTIONS.map(t => (
          <div key={t.id} style={{ padding: '13px 16px', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: t.positive ? '#E0F2EC' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {t.type === 'commission' ? '💰' : t.type === 'payout' ? '💸' : '↩️'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{t.date}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.positive ? '#1F8B5B' : '#e53e3e', flexShrink: 0 }}>{t.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
