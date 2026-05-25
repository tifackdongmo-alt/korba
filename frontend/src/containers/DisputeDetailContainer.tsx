import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisputesStore, type DisputeStatus } from '@/store/disputes'

const STATUS: Record<DisputeStatus, { label: string; color: string; bg: string; icon: string }> = {
  OUVERT: { label: 'Litige ouvert', color: '#B85A10', bg: '#FFF1E2', icon: '🆕' },
  EN_COURS: { label: 'En examen par un agent', color: '#5BA4F0', bg: '#E0EEFF', icon: '🔍' },
  RESOLU: { label: 'Litige résolu', color: '#1F8B5B', bg: '#E0F2EC', icon: '✓' },
  REJETE: { label: 'Litige rejeté', color: '#888', bg: '#F0F0F0', icon: '✕' },
}

const REASON_LABELS: Record<string, string> = {
  article_manquant: 'Article manquant',
  mauvais_article: 'Mauvais article livré',
  produit_abime: 'Produit abîmé',
  jamais_recu: 'Commande non reçue',
  retard_excessif: 'Retard excessif',
  autre: 'Autre problème',
}

export function DisputeDetailContainer() {
  const navigate = useNavigate()
  const { disputeId } = useParams<{ disputeId: string }>()
  const dispute = useDisputesStore(s => s.getById(disputeId || ''))
  const addMessage = useDisputesStore(s => s.addMessage)

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dispute?.messages.length])

  if (!dispute) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 50, marginBottom: 16 }} aria-hidden="true">🔍</div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Litige introuvable</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: 20, padding: '12px 24px', borderRadius: 999, border: 'none', background: '#e53e3e', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Retour
        </button>
      </div>
    )
  }

  const s = STATUS[dispute.status]
  const isActive = dispute.status === 'OUVERT' || dispute.status === 'EN_COURS'

  const send = () => {
    if (!input.trim()) return
    addMessage(dispute.id, { text: input.trim(), from: 'client' })
    setInput('')
    setTimeout(() => {
      addMessage(dispute.id, { text: 'Bien noté. Je transmets votre message à l\'équipe et reviens vers vous au plus vite.', from: 'agent' })
    }, 1500)
  }

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', minHeight: 400 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          ‹
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Litige #{dispute.id.slice(-4)}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{dispute.vendorName} · Cmde #{dispute.orderId}</div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ padding: 14, background: s.bg, borderRadius: 14, marginBottom: 12, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }} aria-hidden="true">{s.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: s.color }}>{s.label}</div>
          <div style={{ fontSize: 11.5, color: s.color, opacity: 0.85, marginTop: 1 }}>
            {dispute.agentName ? `Agent : ${dispute.agentName}` : 'En attente d\'un agent Korba'}
          </div>
        </div>
      </div>

      {/* Reason */}
      <div style={{ padding: '10px 14px', background: '#fff', borderRadius: 12, marginBottom: 10, flexShrink: 0, border: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 2 }}>MOTIF</div>
        <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600 }}>{REASON_LABELS[dispute.reason] || dispute.reason}</div>
      </div>

      {/* Messages thread */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
        {dispute.messages.map(msg => {
          const isMe = msg.from === 'client'
          const bg = isMe ? '#e53e3e' : msg.from === 'agent' ? '#fff' : '#F0EDFF'
          const color = isMe ? '#fff' : '#1a1a1a'
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
              {!isMe && (
                <div style={{ width: 28, height: 28, borderRadius: 999, background: msg.from === 'agent' ? '#FEE9E9' : '#F0EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }} aria-hidden="true">
                  {msg.from === 'agent' ? '🛡' : '🏪'}
                </div>
              )}
              <div style={{
                maxWidth: '75%',
                padding: '11px 14px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: bg,
                color,
                fontSize: 14,
                lineHeight: 1.45,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: !isMe ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}>
                {!isMe && (
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4, color: msg.from === 'agent' ? '#e53e3e' : '#6E58F1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {msg.from === 'agent' ? 'Agent Korba' : 'Vendeur'}
                  </div>
                )}
                {msg.text}
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>{msg.time}</div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Resolution if resolved */}
      {dispute.resolution && (
        <div style={{ padding: 14, background: '#E0F2EC', borderRadius: 14, marginTop: 10, flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1F8B5B', marginBottom: 4 }}>✓ Résolution</div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{dispute.resolution}</div>
        </div>
      )}

      {/* Input */}
      {isActive ? (
        <div style={{ display: 'flex', gap: 8, paddingTop: 12, flexShrink: 0, alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Répondre à l'agent…"
            aria-label="Saisir une réponse"
            style={{ flex: 1, minHeight: 44, padding: '12px 16px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 14, outline: 'none', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#e53e3e'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.2)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = '' }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            aria-label="Envoyer"
            style={{ width: 48, height: 48, borderRadius: 999, border: 'none', background: input.trim() ? '#e53e3e' : '#E0E0E0', color: '#fff', cursor: input.trim() ? 'pointer' : 'default', fontSize: 20, flexShrink: 0 }}
          >
            ↑
          </button>
        </div>
      ) : (
        <div style={{ padding: 14, background: '#F6F2EF', borderRadius: 14, marginTop: 12, fontSize: 12, color: '#888', textAlign: 'center', flexShrink: 0 }}>
          🔒 Ce litige est clôturé. Plus de message possible.
        </div>
      )}
    </div>
  )
}
