import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDisputesStore } from '@/store/disputes'
import { useEscrowStore } from '@/store/escrow'

const REASONS = [
  { value: 'article_manquant', label: 'Article manquant', icon: '📦' },
  { value: 'mauvais_article', label: 'Mauvais article livré', icon: '❌' },
  { value: 'produit_abime', label: 'Produit abîmé', icon: '💔' },
  { value: 'jamais_recu', label: 'Commande non reçue', icon: '🚫' },
  { value: 'retard_excessif', label: 'Retard excessif', icon: '⏰' },
  { value: 'autre', label: 'Autre problème', icon: '📝' },
]

export function DisputeContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const escrowIdParam = searchParams.get('escrowId')
  const openDispute = useDisputesStore(s => s.openDispute)
  const openDisputeEscrow = useEscrowStore(s => s.openDispute)
  const getEscrow = useEscrowStore(s => s.getById)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [newDisputeId, setNewDisputeId] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!reason || !description.trim()) return
    const escrowTx = escrowIdParam ? getEscrow(escrowIdParam) : null
    const dispId = openDispute({
      orderId: orderId || 'demo-order',
      escrowId: escrowIdParam || undefined,
      vendorName: escrowTx?.vendorName || 'Vendeur',
      reason,
      description: description.trim(),
    })
    if (escrowIdParam) openDisputeEscrow(escrowIdParam, dispId)
    setNewDisputeId(dispId)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 50, marginBottom: 16 }}>📋</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#1a1a1a', marginBottom: 8 }}>Litige ouvert</div>
        <div style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 24 }}>
          Votre litige pour la commande #{orderId} a été soumis. L'agence de livraison vous contactera sous 48 heures.
        </div>
        <div style={{ padding: '14px 18px', background: '#FFF1E2', borderRadius: 16, marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#B85A10', marginBottom: 4 }}>📞 Vous pouvez aussi nous contacter</div>
          <div style={{ fontSize: 12, color: '#888' }}>Support Korba : +221 33 842 00 11</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
          {newDisputeId && (
            <button
              onClick={() => navigate(`/client/disputes/${newDisputeId}`)}
              style={{ minHeight: 48, padding: '14px 24px', borderRadius: 999, border: 'none', background: '#e53e3e', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            >
              Suivre le litige
            </button>
          )}
          <button
            onClick={() => navigate('/client/messages')}
            style={{ minHeight: 48, padding: '14px 24px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Retour à la boîte
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Signaler un problème</div>
          <div style={{ fontSize: 12, color: '#888' }}>Commande #{orderId}</div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: '#FFF1E2', borderRadius: 16, marginBottom: 24, fontSize: 12, color: '#B85A10', lineHeight: 1.6 }}>
        ℹ️ Vous pouvez signaler un problème dans les 48 heures suivant la livraison. Un agent Korba examinera votre demande.
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 14 }}>Quel est le problème ?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {REASONS.map(r => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              style={{ padding: '14px 12px', borderRadius: 16, border: `1.5px solid ${reason === r.value ? '#E87B36' : 'rgba(0,0,0,0.08)'}`, background: reason === r.value ? '#FFF1E2' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{r.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 10 }}>Décrivez le problème</div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Décrivez en détail ce qui s'est passé…"
          style={{ width: '100%', padding: '13px 16px', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 14, outline: 'none', resize: 'none', height: 120, fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.5 }}
        />
        <div style={{ fontSize: 12, color: '#aaa', textAlign: 'right', marginTop: 4 }}>{description.length} / 500</div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!reason || !description.trim()}
        style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: reason && description ? '#e53e3e' : '#ccc', color: '#fff', fontWeight: 700, fontSize: 15, cursor: reason && description ? 'pointer' : 'default', transition: 'all 0.2s' }}
      >
        Soumettre le litige
      </button>
    </div>
  )
}
