import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useMessagesStore } from '@/store/messages'
import { useDisputesStore, type DisputeStatus } from '@/store/disputes'

const ROLE_COLORS = { client: '#E87B36', vendor: '#6E58F1', agency: '#1F8B5B', driver: '#5BA4F0' }
const DISPUTE_STATUS: Record<DisputeStatus, { label: string; color: string; bg: string }> = {
  OUVERT: { label: 'Ouvert', color: '#B85A10', bg: '#FFF1E2' },
  EN_COURS: { label: 'En examen', color: '#5BA4F0', bg: '#E0EEFF' },
  RESOLU: { label: 'Résolu', color: '#1F8B5B', bg: '#E0F2EC' },
  REJETE: { label: 'Rejeté', color: '#888', bg: '#F0F0F0' },
}

export function MessagesInboxContainer() {
  const navigate = useNavigate()
  const { role } = useAuthStore()
  const roleColor = ROLE_COLORS[role as keyof typeof ROLE_COLORS] || '#E87B36'
  const [tab, setTab] = useState<'messages' | 'disputes'>('messages')
  const [search, setSearch] = useState('')

  const conversations = useMessagesStore(s => s.getList())
  const disputes = useDisputesStore(s => s.disputes)

  const filteredConv = conversations.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )
  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0)
  const activeDisputes = disputes.filter(d => d.status === 'OUVERT' || d.status === 'EN_COURS').length

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color: '#1a1a1a', letterSpacing: '-0.3px' }}>Boîte de réception</div>
          <div style={{ fontSize: 13, color: '#888' }}>
            {tab === 'messages'
              ? `${conversations.length} conversation${conversations.length > 1 ? 's' : ''} · ${totalUnread} non lu${totalUnread > 1 ? 's' : ''}`
              : `${disputes.length} litige${disputes.length > 1 ? 's' : ''} · ${activeDisputes} actif${activeDisputes > 1 ? 's' : ''}`}
          </div>
        </div>
        {tab === 'disputes' && role === 'client' && (
          <button
            onClick={() => navigate('/client/orders/demo-order/dispute')}
            aria-label="Signaler un nouveau litige"
            style={{ minHeight: 44, padding: '11px 18px', borderRadius: 999, border: 'none', background: '#e53e3e', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(229,62,62,0.3)' }}
          >
            + Signaler
          </button>
        )}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Boîte de réception" style={{ display: 'flex', gap: 6, background: '#F6F2EF', borderRadius: 14, padding: 4, marginBottom: 18 }}>
        <button
          role="tab"
          aria-selected={tab === 'messages'}
          onClick={() => setTab('messages')}
          style={{ flex: 1, minHeight: 40, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, background: tab === 'messages' ? '#fff' : 'transparent', color: tab === 'messages' ? roleColor : '#888', boxShadow: tab === 'messages' ? '0 1px 6px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          💬 Messages
          {totalUnread > 0 && <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: roleColor, color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{totalUnread}</span>}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'disputes'}
          onClick={() => setTab('disputes')}
          style={{ flex: 1, minHeight: 40, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, background: tab === 'disputes' ? '#fff' : 'transparent', color: tab === 'disputes' ? '#e53e3e' : '#888', boxShadow: tab === 'disputes' ? '0 1px 6px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          ⚠ Litiges
          {activeDisputes > 0 && <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: '#e53e3e', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{activeDisputes}</span>}
        </button>
      </div>

      {/* Search */}
      {tab === 'messages' && (
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#888' }} aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Chercher un contact ou message…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Rechercher dans les messages"
            style={{ width: '100%', minHeight: 44, padding: '12px 14px 12px 42px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
            onFocus={e => { e.currentTarget.style.borderColor = roleColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${roleColor}25` }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = '' }}
          />
        </div>
      )}

      {/* MESSAGES LIST */}
      {tab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredConv.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">💬</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#666' }}>Aucune conversation</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{search ? 'Essayez un autre mot-clé' : 'Vos conversations apparaîtront ici'}</div>
            </div>
          )}
          {filteredConv.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/${role}/messages/${conv.id}`)}
              aria-label={`Ouvrir conversation avec ${conv.name}`}
              style={{ width: '100%', minHeight: 72, padding: 14, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.15s, transform 0.1s' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.99)' }}
              onMouseUp={e => { e.currentTarget.style.transform = '' }}
              onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 3px ${roleColor}25` }}
              onBlur={e => { e.currentTarget.style.boxShadow = '' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FAFAF8' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: 999, background: '#F0EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }} aria-hidden="true">{conv.avatar}</div>
                {conv.online && <span aria-label="En ligne" style={{ position: 'absolute', bottom: 1, right: 1, width: 14, height: 14, borderRadius: 999, background: '#22c55e', border: '2.5px solid #fff' }} />}
                {conv.pinned && <span aria-label="Épinglé" style={{ position: 'absolute', top: -2, left: -2, width: 18, height: 18, borderRadius: 999, background: roleColor, color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📌</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <div style={{ fontWeight: conv.unread > 0 ? 700 : 600, fontSize: 14.5, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.name}
                  </div>
                  <div style={{ fontSize: 11, color: conv.unread > 0 ? roleColor : '#aaa', fontWeight: conv.unread > 0 ? 700 : 400, flexShrink: 0, marginLeft: 8 }}>{conv.lastTime}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 13, color: conv.unread > 0 ? '#1a1a1a' : '#888', fontWeight: conv.unread > 0 ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {conv.lastMessage}
                  </div>
                  {conv.unread > 0 && (
                    <span style={{ minWidth: 20, height: 20, borderRadius: 999, background: roleColor, color: '#fff', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0 }}>
                      {conv.unread}
                    </span>
                  )}
                </div>
                {conv.orderRef && (
                  <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>Cmde #{conv.orderRef}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* DISPUTES LIST */}
      {tab === 'disputes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {disputes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">✓</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#666' }}>Aucun litige</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Toutes vos commandes se sont bien passées</div>
            </div>
          )}
          {disputes.map(d => {
            const m = DISPUTE_STATUS[d.status]
            return (
              <button
                key={d.id}
                onClick={() => navigate(`/${role}/disputes/${d.id}`)}
                aria-label={`Voir litige ${d.id}`}
                style={{ width: '100%', minHeight: 84, padding: 16, background: '#fff', borderRadius: 18, border: `1.5px solid ${d.status === 'EN_COURS' ? '#5BA4F040' : 'rgba(0,0,0,0.06)'}`, cursor: 'pointer', textAlign: 'left' }}
                onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.2)' }}
                onBlur={e => { e.currentTarget.style.boxShadow = '' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{d.vendorName}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Cmde #{d.orderId} · {new Date(d.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: m.bg, color: m.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{m.label}</span>
                </div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {d.description}
                </div>
                {d.agentName && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: 12, color: '#888' }}>
                    Agent Korba : <strong style={{ color: '#1a1a1a' }}>{d.agentName}</strong>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
