import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useMessagesStore } from '@/store/messages'

const ROLE_COLORS = { client: '#E87B36', vendor: '#6E58F1', agency: '#1F8B5B', driver: '#5BA4F0', support: '#888' }
const ROLE_LABELS = { client: 'Client', vendor: 'Vendeur', agency: 'Agence', driver: 'Livreur', support: 'Support Korba' }

const CONTACT_DETAILS: Record<string, {
  rating: number; transactions: number; joined: string; bio: string; verified: boolean
  badges?: string[]
}> = {
  boutique: { rating: 4.8, transactions: 312, joined: 'Jan 2024', bio: 'Pharmacie de quartier, ouverte 7j/7. Médicaments, parapharmacie, produits bébé.', verified: true, badges: ['Pharmacie certifiée', 'Top vendeur 2025'] },
  driver: { rating: 4.95, transactions: 248, joined: 'Mar 2025', bio: 'Livreur professionnel. Moto. Zone Dakar Plateau, Sacré-Cœur, Mermoz.', verified: true, badges: ['Livreur Premium', '98% succès'] },
  'vendor-boutique': { rating: 4.7, transactions: 24, joined: 'Sept 2025', bio: 'Cliente régulière, paye à temps, claire dans ses demandes.', verified: false },
  'DEL-881': { rating: 4.7, transactions: 18, joined: 'Oct 2025', bio: 'Cliente fidèle.', verified: false },
  'DEL-879': { rating: 4.5, transactions: 12, joined: 'Nov 2025', bio: 'Client occasionnel.', verified: false },
  'agency-cheikh': { rating: 4.95, transactions: 248, joined: 'Mar 2025', bio: 'Livreur Premium de l\'agence. Moto récente.', verified: true, badges: ['Livreur Premium'] },
  'agency-omar': { rating: 4.2, transactions: 87, joined: 'Avr 2025', bio: 'Livreur en cours d\'évaluation.', verified: true },
  support: { rating: 5, transactions: 9999, joined: 'Fondation', bio: 'Équipe support officielle Korba. Disponible 24/7 pour résoudre tout problème.', verified: true, badges: ['Officiel Korba'] },
}

export function ContactProfileContainer() {
  const navigate = useNavigate()
  const { contactId } = useParams<{ contactId: string }>()
  const { role } = useAuthStore()
  const conv = useMessagesStore(s => s.conversations[contactId || ''])

  if (!conv) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 50, marginBottom: 16 }} aria-hidden="true">👤</div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Contact introuvable</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: 20, padding: '12px 24px', borderRadius: 999, border: 'none', background: '#E87B36', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Retour
        </button>
      </div>
    )
  }

  const details = CONTACT_DETAILS[conv.id] || { rating: 0, transactions: 0, joined: '—', bio: '', verified: false }
  const contactColor = ROLE_COLORS[conv.role]
  const userColor = ROLE_COLORS[(role as keyof typeof ROLE_COLORS) || 'client']

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          ‹
        </button>
        <button
          aria-label="Plus d'options"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          ⋯
        </button>
      </div>

      {/* Avatar + name */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${contactColor}30, ${contactColor}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, border: `3px solid ${contactColor}40` }} aria-hidden="true">
            {conv.avatar}
          </div>
          {conv.online && (
            <span aria-label="En ligne" style={{ position: 'absolute', bottom: 4, right: 4, width: 22, height: 22, borderRadius: 999, background: '#22c55e', border: '3px solid #fff' }} />
          )}
          {details.verified && (
            <span aria-label="Vérifié" style={{ position: 'absolute', top: 2, right: 0, width: 28, height: 28, borderRadius: 999, background: '#5BA4F0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: '3px solid #fff' }}>
              ✓
            </span>
          )}
        </div>
        <div style={{ fontWeight: 800, fontSize: 22, color: '#1a1a1a', marginBottom: 4 }}>{conv.name}</div>
        <span style={{ padding: '4px 14px', borderRadius: 999, background: `${contactColor}15`, color: contactColor, fontSize: 12, fontWeight: 700 }}>
          {ROLE_LABELS[conv.role]}
        </span>
        {details.bio && (
          <div style={{ fontSize: 13.5, color: '#666', marginTop: 14, lineHeight: 1.5, padding: '0 20px' }}>{details.bio}</div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div style={{ padding: '14px 10px', background: '#fff', borderRadius: 16, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#E87B36', fontVariantNumeric: 'tabular-nums' }}>⭐ {details.rating}</div>
          <div style={{ fontSize: 10.5, color: '#888', fontWeight: 600, marginTop: 2 }}>Note</div>
        </div>
        <div style={{ padding: '14px 10px', background: '#fff', borderRadius: 16, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: contactColor, fontVariantNumeric: 'tabular-nums' }}>{details.transactions}</div>
          <div style={{ fontSize: 10.5, color: '#888', fontWeight: 600, marginTop: 2 }}>Transactions</div>
        </div>
        <div style={{ padding: '14px 10px', background: '#fff', borderRadius: 16, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a1a' }}>{details.joined}</div>
          <div style={{ fontSize: 10.5, color: '#888', fontWeight: 600, marginTop: 2 }}>Membre</div>
        </div>
      </div>

      {/* Badges */}
      {details.badges && details.badges.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#888', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Badges</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {details.badges.map(b => (
              <span key={b} style={{ padding: '6px 12px', borderRadius: 999, background: '#FFF1E2', color: '#B85A10', fontSize: 12, fontWeight: 600 }}>
                🏅 {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', marginBottom: 20, overflow: 'hidden' }}>
        {conv.phone && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', gap: 12 }}>
            <span style={{ fontSize: 18 }} aria-hidden="true">📞</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>Téléphone</div>
              <div style={{ fontSize: 13.5, color: '#1a1a1a', fontWeight: 600 }}>{conv.phone}</div>
            </div>
          </div>
        )}
        {conv.orderRef && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
            <span style={{ fontSize: 18 }} aria-hidden="true">📦</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>Dernière commande</div>
              <div style={{ fontSize: 13.5, color: '#1a1a1a', fontWeight: 600 }}>#{conv.orderRef}</div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => navigate(`/${role}/messages/${conv.id}`)}
          style={{ width: '100%', minHeight: 52, padding: '15px', borderRadius: 16, border: 'none', background: userColor, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: `0 6px 20px ${userColor}40` }}
        >
          💬 Envoyer un message
        </button>
        {conv.phone && (
          <a
            href={`tel:${conv.phone.replace(/\s/g, '')}`}
            style={{ width: '100%', minHeight: 52, padding: '15px', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            📞 Appeler
          </a>
        )}
        {role === 'client' && conv.role === 'vendor' && (
          <button
            onClick={() => navigate('/client/catalogue')}
            style={{ width: '100%', minHeight: 52, padding: '15px', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            🛍️ Voir la boutique
          </button>
        )}
      </div>
    </div>
  )
}
