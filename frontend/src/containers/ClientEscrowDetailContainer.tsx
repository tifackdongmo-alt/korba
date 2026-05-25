import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEscrowStore } from '@/store/escrow'

export function ClientEscrowDetailContainer() {
  const navigate = useNavigate()
  const { escrowId } = useParams<{ escrowId: string }>()
  const tx = useEscrowStore(s => s.getById(escrowId || ''))
  const releaseEscrow = useEscrowStore(s => s.releaseEscrow)
  const refundEscrow = useEscrowStore(s => s.refundEscrow)
  const [confirming, setConfirming] = useState<null | 'accept' | 'refuse'>(null)
  const [done, setDone] = useState<null | 'accept' | 'refuse'>(null)

  if (!tx) {
    return (
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 50, marginBottom: 16 }} aria-hidden="true">🔍</div>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a', marginBottom: 8 }}>Transaction introuvable</div>
        <button onClick={() => navigate('/client/escrow')} style={{ marginTop: 20, padding: '14px 28px', borderRadius: 999, border: 'none', background: '#E87B36', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
          Retour aux paiements
        </button>
      </div>
    )
  }

  const handleAccept = () => {
    releaseEscrow(tx.id)
    setDone('accept')
    setTimeout(() => navigate('/client/escrow'), 2000)
  }

  const handleRefuse = () => {
    refundEscrow(tx.id)
    setDone('refuse')
    setTimeout(() => navigate('/client/escrow'), 2000)
  }

  const handleDispute = () => {
    navigate(`/client/orders/${tx.orderId}/dispute?escrowId=${tx.id}`)
  }

  if (done) {
    const msg = done === 'accept'
      ? { icon: '✅', title: 'Fonds libérés !', sub: 'Le vendeur a reçu son paiement.', color: '#1F8B5B' }
      : { icon: '↩️', title: 'Transaction annulée', sub: 'Vous serez remboursé sous 24-48h.', color: '#5BA4F0' }
    return (
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }} aria-hidden="true">{msg.icon}</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: msg.color, marginBottom: 8 }}>{msg.title}</div>
        <div style={{ fontSize: 14, color: '#888' }}>{msg.sub}</div>
      </div>
    )
  }

  const isPending = tx.status === 'EN_ESCROW'
  const statusBadge = {
    EN_ESCROW: { label: '🔒 Fonds bloqués', color: '#B85A10', bg: '#FFF1E2' },
    LIBERE: { label: '✓ Fonds libérés', color: '#1F8B5B', bg: '#E0F2EC' },
    REMBOURSE: { label: '↩ Remboursé', color: '#5BA4F0', bg: '#E0EEFF' },
    LITIGE: { label: '⚠ En litige', color: '#e53e3e', bg: '#FEE9E9' },
  }[tx.status]

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
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Transaction</div>
          <div style={{ fontSize: 12, color: '#888' }}>Cmde #{tx.orderId}</div>
        </div>
        <span style={{ padding: '6px 14px', borderRadius: 999, background: statusBadge.bg, color: statusBadge.color, fontSize: 12, fontWeight: 700 }}>
          {statusBadge.label}
        </span>
      </div>

      {/* Montant */}
      <div style={{ padding: 24, background: '#fff', borderRadius: 22, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8, fontWeight: 500 }}>Montant total</div>
        <div style={{ fontWeight: 800, fontSize: 38, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
          {tx.amountCentimes.toLocaleString('fr-FR')} F
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
          Payé via {tx.provider === 'orange_money' ? 'Orange Money' : tx.provider === 'wave' ? 'Wave' : 'Carte bancaire'} · {new Date(tx.paidAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Vendeur */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F0EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }} aria-hidden="true">🏪</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{tx.vendorName}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Vendeur partenaire</div>
        </div>
        <button
          onClick={() => navigate('/client/messages/boutique')}
          aria-label="Contacter le vendeur"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: '#F0EDFF', cursor: 'pointer', fontSize: 18 }}
        >
          💬
        </button>
      </div>

      {/* Articles */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 10 }}>Articles ({tx.items.length})</div>
        {tx.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < tx.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', fontSize: 13 }}>
            <span style={{ color: '#333' }}>{item.name} × {item.qty}</span>
            <span style={{ fontWeight: 600, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>{item.price}</span>
          </div>
        ))}
      </div>

      {/* Explication escrow */}
      {isPending && (
        <div style={{ padding: 14, background: '#FFF1E2', borderRadius: 16, marginBottom: 16, display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true">ℹ️</span>
          <div style={{ fontSize: 12.5, color: '#B85A10', lineHeight: 1.55 }}>
            <strong>Comment ça marche ?</strong> Vos fonds sont sécurisés par Korba. Cliquez sur "Accepter" si vous avez reçu votre commande et qu'elle vous convient. "Refuser" annule la transaction et déclenche un remboursement. "Litige" alerte un agent Korba.
          </div>
        </div>
      )}

      {/* Actions */}
      {isPending && !confirming && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setConfirming('accept')}
            style={{ width: '100%', minHeight: 52, padding: '15px', borderRadius: 18, border: 'none', background: '#1F8B5B', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(31,139,91,0.35)', transition: 'transform 0.1s' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
            onMouseUp={e => { e.currentTarget.style.transform = '' }}
          >
            ✓ Accepter — libérer les fonds
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setConfirming('refuse')}
              style={{ flex: 1, minHeight: 52, padding: '15px', borderRadius: 18, border: '1.5px solid #e53e3e', background: '#fff', color: '#e53e3e', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              ✕ Refuser
            </button>
            <button
              onClick={handleDispute}
              style={{ flex: 1, minHeight: 52, padding: '15px', borderRadius: 18, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#333', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              ⚠ Litige
            </button>
          </div>
        </div>
      )}

      {/* Confirmation dialog */}
      {confirming && (
        <div style={{ padding: 18, background: '#fff', borderRadius: 18, border: `2px solid ${confirming === 'accept' ? '#1F8B5B' : '#e53e3e'}`, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 8 }}>
            {confirming === 'accept' ? '✓ Confirmer la libération ?' : '✕ Confirmer le refus ?'}
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.5 }}>
            {confirming === 'accept'
              ? `Les fonds (${tx.amountCentimes.toLocaleString('fr-FR')} F) seront immédiatement transférés à ${tx.vendorName}. Cette action est définitive.`
              : `La transaction sera annulée et vous serez remboursé(e) sous 24-48h sur votre moyen de paiement initial.`}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setConfirming(null)}
              style={{ flex: 1, minHeight: 48, padding: '13px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#666', fontWeight: 600, cursor: 'pointer' }}
            >
              Annuler
            </button>
            <button
              onClick={confirming === 'accept' ? handleAccept : handleRefuse}
              style={{ flex: 1, minHeight: 48, padding: '13px', borderRadius: 14, border: 'none', background: confirming === 'accept' ? '#1F8B5B' : '#e53e3e', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* Status info for non-pending */}
      {!isPending && tx.status === 'LIBERE' && (
        <div style={{ padding: 16, background: '#E0F2EC', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }} aria-hidden="true">✓</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1F8B5B' }}>Fonds libérés au vendeur</div>
          {tx.releasedAt && <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Le {new Date(tx.releasedAt).toLocaleDateString('fr-FR')}</div>}
        </div>
      )}
      {!isPending && tx.status === 'REMBOURSE' && (
        <div style={{ padding: 16, background: '#E0EEFF', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }} aria-hidden="true">↩</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#5BA4F0' }}>Transaction remboursée</div>
          {tx.refundedAt && <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Le {new Date(tx.refundedAt).toLocaleDateString('fr-FR')}</div>}
        </div>
      )}
      {!isPending && tx.status === 'LITIGE' && (
        <div style={{ padding: 16, background: '#FEE9E9', borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }} aria-hidden="true">⚠</span>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#e53e3e' }}>Litige ouvert</div>
          </div>
          <div style={{ fontSize: 12.5, color: '#666', lineHeight: 1.5, marginBottom: 12 }}>
            Un agent Korba examine votre dossier. Vous serez contacté(e) sous 48h.
          </div>
          {tx.disputeId && (
            <button
              onClick={() => navigate('/client/disputes')}
              style={{ width: '100%', minHeight: 44, padding: '11px', borderRadius: 12, border: '1.5px solid #e53e3e', background: '#fff', color: '#e53e3e', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              Voir le litige
            </button>
          )}
        </div>
      )}
    </div>
  )
}
