import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useMessagesStore } from '@/store/messages'

const ROLE_CONFIG = {
  client: {
    label: 'Client', color: '#E87B36', bg: '#FFF1E2',
    nav: [
      { label: 'Accueil', path: '/client', icon: '🏠', exact: true },
      { label: 'Catalogue', path: '/client/catalogue', icon: '🛍️', exact: false },
      { label: 'Messages', path: '/client/messages', icon: '💬', exact: false },
      { label: 'Paiements', path: '/client/escrow', icon: '🔒', exact: false },
      { label: 'Profil', path: '/client/profile', icon: '👤', exact: false },
    ],
  },
  vendor: {
    label: 'Vendeur', color: '#6E58F1', bg: '#F0EDFF',
    nav: [
      { label: 'Dashboard', path: '/vendor', icon: '📊', exact: true },
      { label: 'Catalogue', path: '/vendor/catalogue', icon: '📦', exact: false },
      { label: 'Messages', path: '/vendor/messages', icon: '💬', exact: false },
      { label: 'Profil', path: '/vendor/profile', icon: '👤', exact: false },
    ],
  },
  agency: {
    label: 'Agence', color: '#1F8B5B', bg: '#E0F2EC',
    nav: [
      { label: 'Dashboard', path: '/agency', icon: '🏢', exact: true },
      { label: 'Équipe', path: '/agency/team', icon: '👥', exact: false },
      { label: 'Messages', path: '/agency/messages', icon: '💬', exact: false },
      { label: 'Revenus', path: '/agency/revenue', icon: '💰', exact: false },
      { label: 'Profil', path: '/agency/profile', icon: '👤', exact: false },
    ],
  },
  driver: {
    label: 'Livreur', color: '#5BA4F0', bg: '#E0EEFF',
    nav: [
      { label: 'Missions', path: '/driver', icon: '🏍️', exact: true },
      { label: 'Messages', path: '/driver/messages', icon: '💬', exact: false },
      { label: 'Historique', path: '/driver/history', icon: '📋', exact: false },
      { label: 'Gains', path: '/driver/earnings', icon: '💰', exact: false },
      { label: 'Profil', path: '/driver/profile', icon: '👤', exact: false },
    ],
  },
} as const

export function AppLayout() {
  const { role, name, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const cartItems = useCartStore(s => s.items)
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0)
  const conversations = useMessagesStore(s => Object.values(s.conversations))
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unread, 0)

  const cfg = role && role in ROLE_CONFIG ? ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] : null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F6F2EF', fontFamily: 'Switzer, system-ui, sans-serif' }}>

      {/* Minimal top header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#E87B36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚀</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#1a1a1a', letterSpacing: '-0.3px' }}>Korba</span>
        </div>
        {cfg && (
          <span style={{ padding: '3px 10px', borderRadius: 999, background: cfg.bg, color: cfg.color, fontWeight: 600, fontSize: 11, border: `1px solid ${cfg.color}33` }}>
            {cfg.label} · {name}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {role === 'client' && (
            <Link to="/client/checkout" style={{ width: 44, height: 44, borderRadius: 999, background: '#FFF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 16, position: 'relative' }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 999, background: '#E87B36', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', padding: '0 3px' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}
          {role && (
            <Link to={`/${role}/notifications`} style={{ width: 44, height: 44, borderRadius: 999, background: '#F6F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 16, position: 'relative' }}>
              🔔
              <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 999, background: '#E87B36', border: '1.5px solid #fff' }} />
            </Link>
          )}
          <button
            onClick={() => { logout(); navigate('/login') }}
            style={{ padding: '5px 12px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: '#555', whiteSpace: 'nowrap' }}
          >
            ⇄ Rôles
          </button>
        </div>
      </div>

      {/* Page content — padded bottom so bottom bar doesn't overlap */}
      <div style={{ flex: 1, padding: '20px 16px 100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Outlet />
      </div>

      {/* Bottom tab bar */}
      {cfg && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
          display: 'flex',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.07)',
          paddingBottom: 'env(safe-area-inset-bottom, 4px)',
        }}>
          {cfg.nav.map(({ label, path, icon, exact }) => {
            const active = exact ? location.pathname === path : location.pathname.startsWith(path)
            const showMsgBadge = path.includes('/messages') && unreadMessages > 0
            return (
              <Link
                key={path}
                to={path}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                style={{ flex: 1, minHeight: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 4px 6px', textDecoration: 'none', gap: 3, transition: 'opacity 0.1s', outline: 'none', position: 'relative' }}
                onFocus={e => { e.currentTarget.style.background = `${cfg.color}10` }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ position: 'relative' }}>
                  <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1, filter: active ? 'none' : 'grayscale(0.5) opacity(0.6)', transition: 'filter 0.15s', transform: active ? 'scale(1.08)' : 'scale(1)', display: 'inline-block' }}>{icon}</span>
                  {showMsgBadge && (
                    <span aria-label={`${unreadMessages} messages non lus`} style={{ position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, borderRadius: 999, background: '#e53e3e', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #fff' }}>
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? cfg.color : '#888', transition: 'color 0.15s' }}>{label}</span>
                {active && <span aria-hidden="true" style={{ width: 20, height: 2.5, borderRadius: 999, background: cfg.color, marginTop: 1 }} />}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
