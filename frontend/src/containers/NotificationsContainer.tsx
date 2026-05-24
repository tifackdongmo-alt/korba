import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

interface Notif {
  id: number; type: string; icon: string; title: string; body: string; time: string; unread: boolean; color: string
  detail?: string
}

const NOTIFS: Notif[] = [
  { id: 1, type: 'order', icon: '🏍️', title: 'Cheikh arrive dans 8 min', body: 'Commande #KB-2840 · Pharmacie Liberté', time: "À l'instant", unread: true, color: '#E87B36', detail: 'Votre livreur Cheikh Ndao est en route vers votre adresse. Distance restante : 1,2 km. Code de remise : 4729. Préparez-vous à recevoir votre commande.' },
  { id: 2, type: 'otp', icon: '🔐', title: 'Votre code de remise est 4729', body: 'Donnez-le au livreur à la porte', time: '2 min', unread: true, color: '#5BA4F0', detail: 'Code de sécurité à usage unique : 4729\n\nCe code est valable pour la commande #KB-2840. Donnez-le UNIQUEMENT au livreur lorsqu\'il se présente à votre porte. Ne le partagez jamais par téléphone ou message.' },
  { id: 3, type: 'promo', icon: '🎉', title: 'Promo Marché Sandaga · -15%', body: "Sur les produits frais jusqu'à 21h", time: '1 h', unread: true, color: '#E87B36', detail: 'Profitez de -15% sur tous les produits frais du Marché Sandaga Express jusqu\'à 21h ce soir. Valable sur les oignons, tomates, poivrons et légumes de saison. Code promo appliqué automatiquement.' },
  { id: 4, type: 'rating', icon: '⭐', title: 'Livraison réussie · 4 étoiles reçues', body: 'Commande #KB-2820 · Au bon Maquis', time: 'Hier 19:42', unread: false, color: '#C28714', detail: 'Vous avez reçu une note de 4/5 étoiles pour la commande #KB-2820. Commentaire du livreur : "Client très sympa, facile à trouver." Merci pour votre confiance !' },
  { id: 5, type: 'system', icon: '📢', title: 'Mise à jour politique de litige', body: 'Délai porté à 48h pour signaler', time: 'Hier 09:00', unread: false, color: '#888', detail: 'Korba a mis à jour sa politique de gestion des litiges. Vous avez désormais 48 heures (au lieu de 24h) pour signaler un problème après réception de votre commande. Cette mesure vise à mieux protéger vos achats.' },
]

export function NotificationsContainer() {
  const { role } = useAuthStore()
  const navigate = useNavigate()
  const roleColor = { client: '#E87B36', vendor: '#6E58F1', agency: '#1F8B5B', driver: '#5BA4F0' }[role || 'client'] || '#E87B36'
  const [read, setRead] = useState<number[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  const unreadCount = NOTIFS.filter(n => n.unread && !read.includes(n.id)).length

  const toggleExpand = (id: number) => {
    setRead(v => v.includes(id) ? v : [...v, id])
    setExpanded(v => v === id ? null : id)
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Notifications</div>
          {unreadCount > 0 && <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</div>}
        </div>
        {unreadCount > 0 && (
          <button onClick={() => setRead(NOTIFS.map(n => n.id))} style={{ fontSize: 13, fontWeight: 600, color: roleColor, background: 'none', border: 'none', cursor: 'pointer' }}>
            Tout lire
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {NOTIFS.map(n => {
          const isUnread = n.unread && !read.includes(n.id)
          const isExpanded = expanded === n.id
          return (
            <div
              key={n.id}
              onClick={() => toggleExpand(n.id)}
              style={{ padding: '14px 16px', background: '#fff', borderRadius: 18, cursor: 'pointer', border: `1.5px solid ${isUnread ? roleColor + '30' : isExpanded ? roleColor + '20' : 'transparent'}`, transition: 'all 0.15s', boxShadow: isExpanded ? '0 4px 20px rgba(0,0,0,0.08)' : '0 0 0 1px rgba(0,0,0,0.04)' }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: n.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {n.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: isUnread ? 700 : 500, fontSize: 13.5, color: '#1a1a1a', lineHeight: 1.3 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{n.body}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{n.time}</span>
                  {isUnread && <span style={{ width: 8, height: 8, borderRadius: 999, background: roleColor }} />}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && n.detail && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${roleColor}20` }}>
                  <div style={{ fontSize: 13, color: '#444', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{n.detail}</div>
                  {n.type === 'order' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button onClick={e => { e.stopPropagation(); navigate('/client/orders/demo-order/tracking') }} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: roleColor, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>📍 Suivre</button>
                      <button onClick={e => { e.stopPropagation(); navigate('/client/orders/demo-order/messaging') }} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#333', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>💬 Message</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
