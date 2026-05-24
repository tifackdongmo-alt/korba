import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

interface Message {
  id: number
  text: string
  from: 'me' | 'other'
  time: string
}

const DEMO_CONVERSATIONS: Record<string, { name: string; emoji: string; messages: Message[] }> = {
  'boutique': {
    name: 'Pharmacie Liberté 6',
    emoji: '💊',
    messages: [
      { id: 1, text: 'Bonjour ! Je souhaite commander du Doliprane 1000mg × 2.', from: 'me', time: '10:32' },
      { id: 2, text: 'Bonjour ! Bien reçu. Le stock est disponible. Prix : 1 200 F × 2 = 2 400 F. Puis-je confirmer votre commande ?', from: 'other', time: '10:33' },
      { id: 3, text: 'Oui, confirmé. Je viens en retrait dans 30 min.', from: 'me', time: '10:34' },
      { id: 4, text: 'Parfait, votre commande est prête. À tout à l\'heure 👍', from: 'other', time: '10:35' },
    ],
  },
  'vendor-boutique': {
    name: 'Fatou Diallo (Cliente)',
    emoji: '👤',
    messages: [
      { id: 1, text: 'Bonjour ! Je souhaite passer en retrait physique pour le Doliprane.', from: 'other', time: '11:00' },
      { id: 2, text: 'Bonjour Fatou ! C\'est noté. Quel est votre horaire de passage ?', from: 'me', time: '11:02' },
      { id: 3, text: 'Je serai là vers 14h30. Vous avez le Spray nasal aussi ?', from: 'other', time: '11:05' },
      { id: 4, text: 'Oui, le spray nasal est aussi disponible. Je vous prépare les deux. Montant : 3 300 F.', from: 'me', time: '11:07' },
    ],
  },
  'driver': {
    name: 'Cheikh Ndao (Livreur)',
    emoji: '🏍️',
    messages: [
      { id: 1, text: 'Bonjour, j\'arrive dans environ 8 minutes.', from: 'other', time: '14:12' },
      { id: 2, text: 'Ok, je vous attends en bas de l\'immeuble.', from: 'me', time: '14:13' },
      { id: 3, text: 'Je suis en bas. Appartement ?', from: 'other', time: '14:20' },
      { id: 4, text: 'Bâtiment B, 3ème étage. Je descends.', from: 'me', time: '14:21' },
    ],
  },
  // Conversations livreur → client par numéro de livraison
  'DEL-881': {
    name: 'Fatou Diallo',
    emoji: '👤',
    messages: [
      { id: 1, text: 'Bonjour Fatou, je suis votre livreur. Je serai là dans 10 min.', from: 'me', time: '14:10' },
      { id: 2, text: 'Bonjour ! Je vous attends. Sonnez à l\'interphone 3B.', from: 'other', time: '14:11' },
      { id: 3, text: 'Noté, merci !', from: 'me', time: '14:12' },
    ],
  },
  'DEL-879': {
    name: 'Mamadou Sarr',
    emoji: '👤',
    messages: [
      { id: 1, text: 'Bonjour, je suis en route pour votre commande Au bon Maquis.', from: 'me', time: '12:00' },
      { id: 2, text: 'Super, j\'attends votre arrivée.', from: 'other', time: '12:01' },
    ],
  },
  // Conversations agence → livreur
  'agency-cheikh': {
    name: 'Cheikh Ndao',
    emoji: '🏍️',
    messages: [
      { id: 1, text: 'Cheikh, vous avez une nouvelle mission dans votre zone.', from: 'me', time: '13:00' },
      { id: 2, text: 'Reçu chef, j\'accepte.', from: 'other', time: '13:01' },
      { id: 3, text: 'Parfait. Récupération chez Pharmacie Liberté 6, livraison à Sacré-Cœur.', from: 'me', time: '13:02' },
    ],
  },
  'agency-omar': {
    name: 'Omar Ba',
    emoji: '🏍️',
    messages: [
      { id: 1, text: 'Omar, votre taux d\'acceptation est en baisse ce mois. Tout va bien ?', from: 'me', time: '09:00' },
      { id: 2, text: 'Bonjour, j\'ai eu un problème de moto la semaine dernière. C\'est réglé maintenant.', from: 'other', time: '09:15' },
      { id: 3, text: 'Ok, notez bien que 3 refus consécutifs entraînent une suspension temporaire.', from: 'me', time: '09:16' },
    ],
  },
  'demo': {
    name: 'Support Korba',
    emoji: '🚀',
    messages: [
      { id: 1, text: 'Bonjour ! Comment puis-je vous aider ?', from: 'other', time: '09:00' },
    ],
  },
}

const AUTO_REPLIES: Record<string, string[]> = {
  client: ['Bien reçu, je vous confirme rapidement.', 'C\'est noté, merci !', 'D\'accord, à tout à l\'heure.', 'Votre commande est prise en compte.'],
  vendor: ['Ok, je prépare votre commande.', 'Merci pour votre achat !', 'C\'est noté, à bientôt.', 'Votre commande sera prête.'],
  driver: ['Compris, j\'arrive.', 'Je suis en route.', 'C\'est noté !', 'Ok, merci pour l\'info.'],
  agency: ['Bien reçu.', 'Compris, je m\'en occupe.', 'Merci pour le message.', 'Noté.'],
}

export function MessagingContainer() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { role } = useAuthStore()
  const roleColor = { client: '#E87B36', vendor: '#6E58F1', agency: '#1F8B5B', driver: '#5BA4F0' }[role || 'client'] || '#E87B36'

  const convId = conversationId || 'demo'
  const conv = DEMO_CONVERSATIONS[convId] || DEMO_CONVERSATIONS['demo']
  const roleKey = (role || 'client') as keyof typeof AUTO_REPLIES

  const [messages, setMessages] = useState<Message[]>(conv.messages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const productMode = searchParams.get('mode')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = { id: Date.now(), text: input.trim(), from: 'me', time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(m => [...m, newMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const replies = AUTO_REPLIES[roleKey] || AUTO_REPLIES.client
      const reply: Message = { id: Date.now() + 1, text: replies[Math.floor(Math.random() * replies.length)], from: 'other', time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(m => [...m, reply])
    }, 1500)
  }

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', minHeight: 400 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: '#FFF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{conv.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{conv.name}</div>
          <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>● En ligne</div>
        </div>
        <a href="tel:+221779302218" style={{ width: 36, height: 36, borderRadius: 999, background: '#F6F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>📞</a>
      </div>

      {/* Product context banner */}
      {productMode && (
        <div style={{ padding: '10px 14px', background: '#FFF1E2', borderRadius: 14, marginBottom: 12, fontSize: 12, color: '#B85A10', fontWeight: 500, flexShrink: 0 }}>
          {productMode === 'physical' ? '🏪 Retrait physique — Discutez des détails avec le vendeur' : '🔒 Paiement escrow — Confirmez les conditions de retrait'}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: msg.from === 'me' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.from === 'me' ? roleColor : '#fff',
              color: msg.from === 'me' ? '#fff' : '#1a1a1a',
              fontSize: 13,
              lineHeight: 1.5,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              {msg.text}
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ padding: '10px 14px', borderRadius: '18px 18px 18px 4px', background: '#fff', fontSize: 13, color: '#888', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 12, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Écrire un message…"
          style={{ flex: 1, padding: '13px 16px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 14, outline: 'none', background: '#fff', fontFamily: 'inherit' }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{ width: 46, height: 46, borderRadius: 999, border: 'none', background: input.trim() ? roleColor : '#E0E0E0', color: '#fff', cursor: input.trim() ? 'pointer' : 'default', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
