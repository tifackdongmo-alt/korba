import { useNavigate } from 'react-router-dom'
import { useEscrowStore, type EscrowStatus } from '@/store/escrow'

const STATUS_META: Record<EscrowStatus, { label: string; color: string; bg: string; icon: string }> = {
  EN_ESCROW: { label: 'Bloqués', color: '#B85A10', bg: '#FFF1E2', icon: '🔒' },
  LIBERE: { label: 'Libérés', color: '#1F8B5B', bg: '#E0F2EC', icon: '✓' },
  REMBOURSE: { label: 'Remboursés', color: '#5BA4F0', bg: '#E0EEFF', icon: '↩' },
  LITIGE: { label: 'En litige', color: '#e53e3e', bg: '#FEE9E9', icon: '⚠' },
}

export function ClientEscrowListContainer() {
  const navigate = useNavigate()
  const transactions = useEscrowStore(s => s.transactions)

  const totalBlocked = transactions
    .filter(t => t.status === 'EN_ESCROW')
    .reduce((acc, t) => acc + t.amountCentimes, 0)

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          ‹
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Mes paiements</div>
          <div style={{ fontSize: 13, color: '#888' }}>Suivi escrow Korba</div>
        </div>
      </div>

      {/* Total bloqué */}
      <div style={{ padding: 20, background: 'linear-gradient(135deg, #FFF1E2, #FFE5C7)', borderRadius: 22, marginBottom: 20, border: '1px solid #E87B3620' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }} aria-hidden="true">🔒</span>
          <span style={{ fontSize: 13, color: '#B85A10', fontWeight: 600 }}>Fonds bloqués en escrow</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 32, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>
          {totalBlocked.toLocaleString('fr-FR')} F
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4, lineHeight: 1.5 }}>
          Ces fonds sont sécurisés par Korba. Ils seront libérés au vendeur uniquement après votre validation à la réception.
        </div>
      </div>

      {/* Filters stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
        {(['EN_ESCROW', 'LIBERE', 'LITIGE'] as EscrowStatus[]).map(status => {
          const count = transactions.filter(t => t.status === status).length
          const m = STATUS_META[status]
          return (
            <div key={status} style={{ padding: '12px 10px', borderRadius: 14, background: m.bg, textAlign: 'center' }}>
              <div style={{ fontSize: 18 }} aria-hidden="true">{m.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
              <div style={{ fontSize: 10, color: m.color, fontWeight: 600 }}>{m.label}</div>
            </div>
          )
        })}
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Toutes les transactions</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {transactions.map(t => {
          const m = STATUS_META[t.status]
          return (
            <button
              key={t.id}
              onClick={() => navigate(`/client/escrow/${t.id}`)}
              aria-label={`Voir détails transaction ${t.vendorName}`}
              style={{ width: '100%', padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 0.15s, transform 0.15s' }}
              onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,123,54,0.25)' }}
              onBlur={e => { e.currentTarget.style.boxShadow = '' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }} aria-hidden="true">
                {m.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{t.vendorName}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  Cmde #{t.orderId} · {new Date(t.paidAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
                <span style={{ marginTop: 6, display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: m.bg, color: m.color, fontSize: 11, fontWeight: 700 }}>
                  {m.label}
                </span>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: m.color, fontVariantNumeric: 'tabular-nums' }}>
                  {t.amountCentimes.toLocaleString('fr-FR')} F
                </div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>›</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
