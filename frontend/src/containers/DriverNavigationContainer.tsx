import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const DEMO_ORDERS: Record<string, {
  id: string; client: string; clientPhone: string; clientAddress: string;
  vendor: string; vendorAddress: string; items: string; amount: string; fee: string
}> = {
  'DEL-881': {
    id: 'DEL-881', client: 'Fatou Diallo', clientPhone: '+221 77 412 89 03', clientAddress: 'Sacré-Cœur 3, Imm. B, 2ème ét.',
    vendor: 'Pharmacie Liberté 6', vendorAddress: '42 Rue Carnot, Dakar Plateau', items: 'Doliprane 1000mg × 2, Spray nasal', amount: '4 800 F', fee: '850 F',
  },
  'DEL-879': {
    id: 'DEL-879', client: 'Mamadou Sarr', clientPhone: '+221 76 238 10 44', clientAddress: 'Mermoz Pyrotechnie, Villa 23',
    vendor: 'Au bon Maquis', vendorAddress: '15 Rue des Jasmins, Mermoz', items: 'Thiéboudienne royal', amount: '6 500 F', fee: '1 200 F',
  },
}

export function DriverNavigationContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const order = DEMO_ORDERS[orderId || ''] || DEMO_ORDERS['DEL-881']

  const [step, setStep] = useState<'to_vendor' | 'at_vendor' | 'to_client' | 'at_client'>('to_vendor')
  const [otpInput, setOtpInput] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [eta, setEta] = useState(8)

  useEffect(() => {
    if (step !== 'to_vendor' && step !== 'to_client') return
    if (eta <= 0) return
    const t = setTimeout(() => setEta(e => Math.max(0, e - 1)), 30000)
    return () => clearTimeout(t)
  }, [eta, step])

  const STEPS_CFG = {
    to_vendor: { title: 'En route vers le vendeur', subtitle: order.vendorAddress, color: '#E87B36', bg: '#FFF1E2', cta: 'Arrivé au vendeur', icon: '🏪' },
    at_vendor: { title: 'Chez le vendeur', subtitle: 'Récupérez la commande', color: '#6E58F1', bg: '#F0EDFF', cta: null, icon: '📦' },
    to_client: { title: 'En route vers le client', subtitle: order.clientAddress, color: '#5BA4F0', bg: '#E0EEFF', cta: 'Arrivé chez le client', icon: '📍' },
    at_client: { title: 'Chez le client', subtitle: 'Remettez la commande', color: '#1F8B5B', bg: '#E0F2EC', cta: null, icon: '🎉' },
  }

  const cfg = STEPS_CFG[step]

  const verifyOtp = () => {
    if (otpInput === '4729') {
      navigate(`/driver/orders/${orderId}/proof`)
    } else {
      setOtpError(true)
      setTimeout(() => setOtpError(false), 2000)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/driver')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Mission #{order.id}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{order.vendor}</div>
        </div>
        <div style={{ marginLeft: 'auto', padding: '5px 14px', borderRadius: 999, background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 13 }}>
          ~{eta} min
        </div>
      </div>

      {/* Map */}
      <div style={{ width: '100%', height: 200, borderRadius: 20, background: 'linear-gradient(135deg, #E8F4F8 0%, #C8E6F0 60%, #A8D8EA 100%)', marginBottom: 20, position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          {[30, 80, 130, 180].map(y => <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: y, height: 1, background: '#5BA4F0' }} />)}
          {[50, 110, 170, 230, 290, 350].map(x => <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: x, width: 1, background: '#5BA4F0' }} />)}
        </div>
        <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">
          <polyline points={step === 'to_vendor' ? "60,170 100,130 160,90 230,80" : "230,80 270,100 310,130 340,160"} fill="none" stroke="#5BA4F0" strokeWidth="3" strokeDasharray="8,4" />
        </svg>
        {/* Vendor */}
        <div style={{ position: 'absolute', left: 218, top: 68, width: 26, height: 26, borderRadius: 999, background: '#E87B36', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 2 }}>🏪</div>
        {/* Client */}
        <div style={{ position: 'absolute', right: 50, top: 148, width: 26, height: 26, borderRadius: 999, background: '#1F8B5B', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 2 }}>📍</div>
        {/* Driver */}
        <div style={{ position: 'absolute', left: step === 'to_vendor' ? 48 : 218, top: step === 'to_vendor' ? 158 : 68, width: 38, height: 38, borderRadius: 999, background: '#fff', border: `3px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: `0 4px 12px ${cfg.color}50`, transition: 'left 1s, top 1s', zIndex: 3 }}>🏍️</div>
        {/* Status pill */}
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: 12, color: cfg.color, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
          {cfg.icon} {cfg.title}
        </div>
      </div>

      {/* Destination card */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          {step === 'to_vendor' || step === 'at_vendor' ? '🎯 Destination — Vendeur' : '🎯 Destination — Client'}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{step === 'to_vendor' || step === 'at_vendor' ? order.vendor : order.client}</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>📍 {step === 'to_vendor' || step === 'at_vendor' ? order.vendorAddress : order.clientAddress}</div>
        {(step === 'to_client' || step === 'at_client') && (
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>📞 {order.clientPhone}</div>
        )}
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#F6F2EF', borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Articles</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{order.items}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#5BA4F0' }}>{order.fee}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Votre gain</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{order.amount}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Commande</div>
          </div>
        </div>
      </div>

      {/* OTP verification (at_vendor step) */}
      {step === 'at_vendor' && (
        <div style={{ padding: 18, background: '#fff', borderRadius: 20, border: '1.5px solid #6E58F1', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>🔐 Code de récupération</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>Demandez le code au vendeur pour confirmer la récupération</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={otpInput}
              onChange={e => setOtpInput(e.target.value.replace(/\D/, '').slice(0, 4))}
              placeholder="Code 4 chiffres"
              style={{ flex: 1, padding: '13px 16px', borderRadius: 14, border: `1.5px solid ${otpError ? '#e53e3e' : 'rgba(0,0,0,0.12)'}`, fontSize: 18, textAlign: 'center', letterSpacing: '0.2em', fontWeight: 700, outline: 'none', fontFamily: 'inherit' }}
              maxLength={4}
            />
            <button
              onClick={verifyOtp}
              disabled={otpInput.length !== 4}
              style={{ padding: '13px 20px', borderRadius: 14, border: 'none', background: otpInput.length === 4 ? '#6E58F1' : '#E0E0E0', color: '#fff', fontWeight: 700, fontSize: 15, cursor: otpInput.length === 4 ? 'pointer' : 'default' }}
            >
              ✓
            </button>
          </div>
          {otpError && <div style={{ fontSize: 12, color: '#e53e3e', marginTop: 8, textAlign: 'center' }}>Code incorrect. Réessayez.</div>}
        </div>
      )}

      {/* OTP verification (at_client step) */}
      {step === 'at_client' && (
        <div style={{ padding: 18, background: '#fff', borderRadius: 20, border: '1.5px solid #1F8B5B', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>🔐 Code de remise</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>Le client doit vous donner son code pour confirmer la réception</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={otpInput}
              onChange={e => setOtpInput(e.target.value.replace(/\D/, '').slice(0, 4))}
              placeholder="Code du client"
              style={{ flex: 1, padding: '13px 16px', borderRadius: 14, border: `1.5px solid ${otpError ? '#e53e3e' : 'rgba(0,0,0,0.12)'}`, fontSize: 18, textAlign: 'center', letterSpacing: '0.2em', fontWeight: 700, outline: 'none', fontFamily: 'inherit' }}
              maxLength={4}
            />
            <button
              onClick={() => navigate(`/driver/orders/${orderId}/proof`)}
              disabled={otpInput.length !== 4}
              style={{ padding: '13px 20px', borderRadius: 14, border: 'none', background: otpInput.length === 4 ? '#1F8B5B' : '#E0E0E0', color: '#fff', fontWeight: 700, fontSize: 15, cursor: otpInput.length === 4 ? 'pointer' : 'default' }}
            >
              ✓
            </button>
          </div>
          {otpError && <div style={{ fontSize: 12, color: '#e53e3e', marginTop: 8, textAlign: 'center' }}>Code incorrect. Réessayez.</div>}
        </div>
      )}

      {/* CTA button */}
      {cfg.cta && (
        <button
          onClick={() => {
            if (step === 'to_vendor') setStep('at_vendor')
            else if (step === 'to_client') setStep('at_client')
          }}
          style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: cfg.color, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: `0 6px 20px ${cfg.color}40`, marginBottom: 10 }}
        >
          {cfg.cta}
        </button>
      )}
      {step === 'at_vendor' && !cfg.cta && (
        <button
          onClick={() => { setStep('to_client'); setEta(12); setOtpInput('') }}
          style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: '#5BA4F0', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(91,164,240,0.4)', marginBottom: 10 }}
        >
          🏍️ En route vers le client
        </button>
      )}
    </div>
  )
}
