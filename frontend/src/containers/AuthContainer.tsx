import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth'

export function AuthContainer() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setTokens, setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setLoading(true)
    setError(null)
    try {
      await authApi.sendOtp(phone)
      setStep('otp')
    } catch {
      setError('Impossible d\'envoyer le code. Vérifiez votre numéro.')
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

  // UI inline légère — le design des autres screens reste inchangé
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--paper)' }}>
      <div style={{ width: 340, padding: 32, background: 'rgba(255,255,255,0.8)', borderRadius: 24, backdropFilter: 'blur(22px)', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', marginBottom: 24, color: 'var(--ink)' }}>
          {step === 'phone' ? 'Bienvenue sur Korba' : 'Entrez votre code'}
        </h2>
        {error && <p style={{ color: '#e53e3e', marginBottom: 12, fontSize: 14 }}>{error}</p>}
        {step === 'phone' ? (
          <>
            <input
              type="tel"
              placeholder="+221 77 412 89 03"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Votre nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ ...inputStyle, marginTop: 12 }}
            />
            <button onClick={handleSendOtp} disabled={loading || !phone} style={btnStyle}>
              {loading ? 'Envoi...' : 'Recevoir le code SMS'}
            </button>
          </>
        ) : (
          <>
            <p style={{ color: 'var(--ink)', opacity: 0.6, marginBottom: 16, fontSize: 14 }}>Code envoyé au {phone}</p>
            <input
              type="text"
              placeholder="6 chiffres"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ ...inputStyle, letterSpacing: 8, textAlign: 'center', fontSize: 24 }}
            />
            <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} style={btnStyle}>
              {loading ? 'Vérification...' : 'Connexion'}
            </button>
            <button onClick={() => setStep('phone')} style={{ ...btnStyle, background: 'transparent', color: 'var(--ink)', border: '1px solid rgba(0,0,0,0.15)', marginTop: 8 }}>
              Changer de numéro
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 12,
  border: '1.5px solid rgba(0,0,0,0.12)',
  fontFamily: 'var(--font-sans)',
  fontSize: 16,
  outline: 'none',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.9)',
}

const btnStyle: React.CSSProperties = {
  marginTop: 16,
  width: '100%',
  padding: '14px',
  borderRadius: 14,
  background: 'var(--client, #E87B36)',
  color: '#fff',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 15,
  border: 'none',
  cursor: 'pointer',
}
