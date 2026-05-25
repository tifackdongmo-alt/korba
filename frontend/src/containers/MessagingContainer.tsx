import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useMessagesStore } from '@/store/messages'

const AUTO_REPLIES: Record<string, string[]> = {
  client: ['Bien reçu, je vous confirme rapidement.', 'C\'est noté, merci !', 'D\'accord, à tout à l\'heure.', 'Votre commande est prise en compte.'],
  vendor: ['Ok, je prépare votre commande.', 'Merci pour votre achat !', 'C\'est noté, à bientôt.', 'Votre commande sera prête.'],
  driver: ['Compris, j\'arrive.', 'Je suis en route.', 'C\'est noté !', 'Ok, merci pour l\'info.'],
  agency: ['Bien reçu.', 'Compris, je m\'en occupe.', 'Merci pour le message.', 'Noté.'],
}

const ROLE_COLORS = { client: '#E87B36', vendor: '#6E58F1', agency: '#1F8B5B', driver: '#5BA4F0' }

export function MessagingContainer() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { role } = useAuthStore()
  const roleColor = ROLE_COLORS[role as keyof typeof ROLE_COLORS] || '#E87B36'

  const conv = useMessagesStore(s => s.conversations[conversationId || ''] || s.conversations['support'])
  const addMessage = useMessagesStore(s => s.addMessage)
  const markAsRead = useMessagesStore(s => s.markAsRead)

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const productMode = searchParams.get('mode')

  useEffect(() => {
    if (conv) markAsRead(conv.id)
  }, [conv?.id, markAsRead])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages.length, isTyping])

  const sendMessage = (textOverride?: string, isDispute = false) => {
    const text = (textOverride ?? input).trim()
    if (!text || !conv) return
    const time = new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })
    addMessage(conv.id, { id: Date.now(), text, from: 'me', time, isDispute })
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const replies = AUTO_REPLIES[(role || 'client') as keyof typeof AUTO_REPLIES] || AUTO_REPLIES.client
      addMessage(conv.id, { id: Date.now() + 1, text: replies[Math.floor(Math.random() * replies.length)], from: 'other', time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) })
    }, 1500)
  }

  if (!conv) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 50, marginBottom: 16 }} aria-hidden="true">💬</div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Conversation introuvable</div>
        <button onClick={() => navigate(`/${role}/messages`)} style={{ marginTop: 20, padding: '12px 24px', borderRadius: 999, border: 'none', background: roleColor, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Retour à la boîte
        </button>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', minHeight: 400 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexShrink: 0 }}>
        <button
          onClick={() => navigate(`/${role}/messages`)}
          aria-label="Retour à la boîte"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          ‹
        </button>
        <button
          onClick={() => navigate(`/${role}/contacts/${conv.id}`)}
          aria-label={`Voir profil de ${conv.name}`}
          style={{ flex: 1, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 12, textAlign: 'left' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FAFAF8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F0EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }} aria-hidden="true">{conv.avatar}</div>
            {conv.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 999, background: '#22c55e', border: '2px solid #fff' }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{conv.name}</div>
            <div style={{ fontSize: 11, color: conv.online ? '#22c55e' : '#aaa', fontWeight: 500 }}>{conv.online ? '● En ligne' : 'Hors ligne'} · Voir profil ›</div>
          </div>
        </button>
        {conv.phone && (
          <a
            href={`tel:${conv.phone.replace(/\s/g, '')}`}
            aria-label={`Appeler ${conv.name}`}
            style={{ width: 44, height: 44, borderRadius: 999, background: '#F6F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none', flexShrink: 0 }}
          >
            📞
          </a>
        )}
      </div>

      {/* Order ref banner */}
      {conv.orderRef && (
        <button
          onClick={() => navigate(`/${role}/orders/${conv.orderRef}`)}
          style={{ padding: '10px 14px', background: `${roleColor}15`, borderRadius: 12, marginBottom: 10, fontSize: 12, color: roleColor, fontWeight: 600, flexShrink: 0, border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          📦 Commande #{conv.orderRef} · Voir détails
        </button>
      )}

      {/* Product mode banner */}
      {productMode && (
        <div style={{ padding: '10px 14px', background: '#FFF1E2', borderRadius: 12, marginBottom: 10, fontSize: 12, color: '#B85A10', fontWeight: 500, flexShrink: 0 }}>
          {productMode === 'physical' ? '🏪 Retrait physique en cours' : '🔒 Paiement escrow actif'}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {conv.messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: msg.from === 'me' ? 'row-reverse' : 'row', gap: 6, alignItems: 'flex-end' }}>
            <div style={{
              maxWidth: '78%',
              padding: '11px 14px',
              borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.isDispute ? '#FEE9E9' : (msg.from === 'me' ? roleColor : '#fff'),
              color: msg.isDispute ? '#9b1c1c' : (msg.from === 'me' ? '#fff' : '#1a1a1a'),
              fontSize: 14,
              lineHeight: 1.45,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: msg.isDispute ? '1px solid #e53e3e40' : 'none',
            }}>
              {msg.isDispute && <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: '#e53e3e' }}>⚠ SIGNALEMENT</div>}
              {msg.text}
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ padding: '11px 16px', borderRadius: '18px 18px 18px 4px', background: '#fff', fontSize: 18, color: '#888', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', alignSelf: 'flex-start', maxWidth: 80 }}>
            <span aria-label="En train d'écrire">···</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Actions menu */}
      {showActions && (
        <div style={{ padding: 12, background: '#fff', borderRadius: 14, marginTop: 8, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => { setShowActions(false); navigate(`/${role}/orders/${conv.orderRef || 'demo-order'}/dispute`) }}
              style={{ minHeight: 44, padding: '11px', borderRadius: 12, border: '1.5px solid #e53e3e', background: '#fff', color: '#e53e3e', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              ⚠ Signaler un litige
            </button>
            <button
              onClick={() => { setShowActions(false); navigate(`/${role}/contacts/${conv.id}`) }}
              style={{ minHeight: 44, padding: '11px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#333', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              👤 Voir profil
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 12, flexShrink: 0, alignItems: 'center' }}>
        <button
          onClick={() => setShowActions(v => !v)}
          aria-label="Plus d'actions"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: showActions ? roleColor + '20' : '#F6F2EF', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: showActions ? roleColor : '#666' }}
        >
          {showActions ? '×' : '+'}
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Écrire un message…"
          aria-label="Saisir un message"
          style={{ flex: 1, minHeight: 44, padding: '12px 16px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 14, outline: 'none', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box' }}
          onFocus={e => { e.currentTarget.style.borderColor = roleColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${roleColor}25` }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = '' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim()}
          aria-label="Envoyer"
          style={{ width: 48, height: 48, borderRadius: 999, border: 'none', background: input.trim() ? roleColor : '#E0E0E0', color: '#fff', cursor: input.trim() ? 'pointer' : 'default', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s, transform 0.1s' }}
          onMouseDown={e => { if (input.trim()) e.currentTarget.style.transform = 'scale(0.92)' }}
          onMouseUp={e => { e.currentTarget.style.transform = '' }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
