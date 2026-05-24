import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

const ROLE_CONFIG = {
  client: { color: '#E87B36', label: 'Client', emoji: '🛍️', city: 'Dakar, Sénégal', phone: '+221 77 412 89 03' },
  vendor: { color: '#6E58F1', label: 'Vendeur', emoji: '🏪', city: 'Dakar Plateau', phone: '+221 76 238 10 44' },
  agency: { color: '#1F8B5B', label: 'Agence', emoji: '🏢', city: 'Dakar, Sénégal', phone: '+221 33 842 00 11' },
  driver: { color: '#5BA4F0', label: 'Livreur', emoji: '🏍️', city: 'Dakar, Sénégal', phone: '+221 77 930 22 18' },
}

type ModalKey = 'address' | 'payment' | 'notif' | 'lang' | 'security' | null

export function ProfileContainer() {
  const { name, role, logout } = useAuthStore()
  const navigate = useNavigate()
  const cfg = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.client
  const [modal, setModal] = useState<ModalKey>(null)
  const [address, setAddress] = useState('Sacré-Cœur 3, Dakar')
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [lang, setLang] = useState('Français')

  const SETTINGS = [
    { key: 'address' as ModalKey, icon: '📍', label: 'Adresse de livraison', value: address },
    { key: 'payment' as ModalKey, icon: '💳', label: 'Moyen de paiement', value: 'Orange Money · +221 77 412 89 03' },
    { key: 'notif' as ModalKey, icon: '🔔', label: 'Notifications', value: notifEnabled ? 'Activées' : 'Désactivées' },
    { key: 'lang' as ModalKey, icon: '🌐', label: 'Langue', value: lang },
    { key: 'security' as ModalKey, icon: '🔐', label: 'Sécurité', value: 'PIN · 2FA activé' },
  ]

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
      {/* Avatar + info */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ width: 80, height: 80, borderRadius: 999, background: cfg.color + '20', border: `3px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 14px' }}>
          {cfg.emoji}
        </div>
        <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>{name || 'Utilisateur'}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '4px 12px', borderRadius: 999, background: cfg.color + '15', color: cfg.color }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{cfg.label}</span>
        </div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>📍 {cfg.city}</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>📞 {cfg.phone}</div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
        {[
          { value: '24', label: 'Commandes' },
          { value: '4.8', label: 'Note ⭐' },
          { value: '6 mois', label: 'Membre' },
        ].map(({ value, label }) => (
          <div key={label} style={{ padding: '12px 8px', background: '#fff', borderRadius: 14, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: cfg.color }}>{value}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
        {SETTINGS.map(({ key, icon, label, value }, i) => (
          <button
            key={label}
            onClick={() => setModal(key)}
            style={{ width: '100%', padding: '15px 18px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < SETTINGS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#F9F9F9'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = ''}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{label}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{value}</div>
            </div>
            <span style={{ color: '#ccc', fontSize: 16 }}>›</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{ width: '100%', padding: '14px', borderRadius: 16, border: '1.5px solid #e53e3e', background: 'transparent', color: '#e53e3e', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF0F0' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
      >
        Se déconnecter
      </button>

      {/* Modals */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
          >
            {modal === 'address' && (
              <>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>📍 Adresse de livraison</div>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button onClick={() => setModal(null)} style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: cfg.color, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 14 }}>Enregistrer</button>
              </>
            )}
            {modal === 'payment' && (
              <>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>💳 Moyen de paiement</div>
                {['Orange Money', 'Wave', 'Carte bancaire'].map(m => (
                  <div key={m} style={{ padding: '14px 16px', background: '#F6F2EF', borderRadius: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <span style={{ fontSize: 20 }}>{m === 'Orange Money' ? '🟠' : m === 'Wave' ? '🔵' : '💳'}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{m}</span>
                    {m === 'Orange Money' && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#1F8B5B', fontWeight: 600 }}>✓ Actif</span>}
                  </div>
                ))}
              </>
            )}
            {modal === 'notif' && (
              <>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>🔔 Notifications</div>
                {[
                  { label: 'Nouvelles commandes', enabled: true },
                  { label: 'Statut de livraison', enabled: true },
                  { label: 'Promotions', enabled: notifEnabled },
                  { label: 'Mise à jour système', enabled: false },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: 14, color: '#1a1a1a' }}>{item.label}</span>
                    <button
                      onClick={() => item.label === 'Promotions' && setNotifEnabled(v => !v)}
                      style={{ width: 44, height: 24, borderRadius: 999, background: item.enabled ? cfg.color : '#E0E0E0', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                    >
                      <span style={{ position: 'absolute', top: 2, left: item.enabled ? 22 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    </button>
                  </div>
                ))}
              </>
            )}
            {modal === 'lang' && (
              <>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>🌐 Langue</div>
                {['Français', 'English', 'Wolof'].map(l => (
                  <button key={l} onClick={() => { setLang(l); setModal(null) }} style={{ width: '100%', padding: '14px 16px', background: l === lang ? cfg.color + '15' : '#F6F2EF', borderRadius: 14, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: l === lang ? `1.5px solid ${cfg.color}` : '1.5px solid transparent' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{l}</span>
                    {l === lang && <span style={{ fontSize: 16, color: cfg.color }}>✓</span>}
                  </button>
                ))}
              </>
            )}
            {modal === 'security' && (
              <>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>🔐 Sécurité</div>
                {[
                  { label: 'Changer le code PIN', icon: '🔑' },
                  { label: 'Authentification 2FA', icon: '📱' },
                  { label: 'Appareils connectés', icon: '💻' },
                  { label: 'Historique des connexions', icon: '📋' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', flex: 1 }}>{item.label}</span>
                    <span style={{ color: '#ccc' }}>›</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
