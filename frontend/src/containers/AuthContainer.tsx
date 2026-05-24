import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth'

const DEMO_ROLES = [
  { role: 'client' as const, label: 'Client', emoji: '🛍️', name: 'Mariama Sow', color: '#E87B36', bg: 'linear-gradient(135deg,#FFF1E2,#FFD9BB)', desc: 'Commander et suivre ses livraisons' },
  { role: 'vendor' as const, label: 'Vendeur', emoji: '🏪', name: 'Ibrahima Fall', color: '#6E58F1', bg: 'linear-gradient(135deg,#F0EDFF,#DDD6FD)', desc: 'Gérer boutique et commandes' },
  { role: 'agency' as const, label: 'Agence', emoji: '🏢', name: 'Aïssatou Diallo', color: '#1F8B5B', bg: 'linear-gradient(135deg,#E0F2EC,#BBE9D6)', desc: 'Piloter livreurs et zones' },
  { role: 'driver' as const, label: 'Livreur', emoji: '🏍️', name: 'Cheikh Ndao', color: '#5BA4F0', bg: 'linear-gradient(135deg,#E0EEFF,#BBD6FD)', desc: 'Accepter et livrer des commandes' },
]

export function AuthContainer() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRealAuth, setShowRealAuth] = useState(false)
  const { setTokens, setUser, loginAsDemo } = useAuthStore()
  const navigate = useNavigate()

  const handleDemo = (role: typeof DEMO_ROLES[0]['role'], demoName: string) => {
    loginAsDemo(role, demoName)
    navigate(`/${role}`)
  }

  const handleSendOtp = async () => {
    setLoading(true)
    setError(null)
    try {
      await authApi.sendOtp(phone)
      setStep('otp')
    } catch {
      setError('Impossible d\'envoyer le code. Vérifiez votre numéro ou utilisez le mode démo.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authApi.verifyOtp(phone, otp, name || undefined)
      setTokens(data.access_token, data.refresh_token)
      setUser(data.user_id, data.role, data.name)
      navigate(`/${data.role}`)
    } catch {
      setError('Code invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--paper)', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#E87B36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚀</div>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 26, color: 'var(--ink)' }}>Korba</span>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink)', opacity: 0.5, fontSize: 14, margin: 0 }}>Livraison rapide · Afrique francophone</p>
        </div>

        {/* Demo Mode */}
        {!showRealAuth && (
          <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 24, backdropFilter: 'blur(22px)', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', marginBottom: 16 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--ink)', margin: '0 0 4px' }}>Tester l'application</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink)', opacity: 0.5, margin: '0 0 18px' }}>Choisissez un rôle pour explorer sans compte</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {DEMO_ROLES.map(({ role, label, emoji, name: demoName, color, bg, desc }) => (
                <button
                  key={role}
                  onClick={() => handleDemo(role, demoName)}
                  style={{
                    border: 'none',
                    borderRadius: 18,
                    padding: '16px 12px',
                    background: bg,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    boxShadow: `0 4px 16px -8px ${color}66`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px -8px ${color}88` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px -8px ${color}66` }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{emoji}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--ink)', opacity: 0.6, lineHeight: 1.4 }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real Auth */}
        {showRealAuth && (
          <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 24, backdropFilter: 'blur(22px)', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', margin: '0 0 20px', color: 'var(--ink)', fontSize: 18 }}>
              {step === 'phone' ? 'Connexion avec téléphone' : 'Entrez votre code'}
            </h2>
            {error && <p style={{ color: '#e53e3e', marginBottom: 12, fontSize: 13, fontFamily: 'var(--font-sans)' }}>{error}</p>}
            {step === 'phone' ? (
              <>
                <input type="tel" placeholder="+221 77 412 89 03" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Votre nom complet" value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, marginTop: 10 }} />
                <button onClick={handleSendOtp} disabled={loading || !phone} style={btnStyle('#E87B36')}>
                  {loading ? 'Envoi en cours…' : 'Recevoir le code SMS'}
                </button>
              </>
            ) : (
              <>
                <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink)', opacity: 0.55, marginBottom: 14, fontSize: 13 }}>Code envoyé au {phone}</p>
                <input type="text" placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} style={{ ...inputStyle, letterSpacing: 10, textAlign: 'center', fontSize: 24 }} />
                <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} style={btnStyle('#E87B36')}>
                  {loading ? 'Vérification…' : 'Se connecter'}
                </button>
                <button onClick={() => setStep('phone')} style={{ ...btnStyle('transparent'), color: 'var(--ink)', border: '1px solid rgba(0,0,0,0.12)', marginTop: 8 }}>
                  Changer de numéro
                </button>
              </>
            )}
          </div>
        )}

        {/* Toggle */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => { setShowRealAuth(v => !v); setError(null); setStep('phone') }}
            style={{ fontFamily: 'var(--font-sans)', background: 'none', border: 'none', color: 'var(--ink)', opacity: 0.45, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showRealAuth ? '← Retour au mode démo' : 'Connexion avec un vrai compte'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1.5px solid rgba(0,0,0,0.10)',
  fontFamily: 'var(--font-sans)',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.9)',
}

const btnStyle = (bg: string): React.CSSProperties => ({
  marginTop: 14,
  width: '100%',
  padding: '13px',
  borderRadius: 14,
  background: bg,
  color: bg === 'transparent' ? 'inherit' : '#fff',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 14,
  border: 'none',
  cursor: 'pointer',
  display: 'block',
})
