import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const STEPS = [
  { key: 'confirmed', label: 'Commande confirmée', icon: '✅' },
  { key: 'preparing', label: 'Préparation en cours', icon: '🏪' },
  { key: 'picked_up', label: 'Livreur en route', icon: '🏍️' },
  { key: 'arriving', label: 'Arrive dans 8 min', icon: '📍' },
  { key: 'delivered', label: 'Livré', icon: '🎉' },
]

export function ClientTrackingContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [step, setStep] = useState(2)
  const [otpVisible, setOtpVisible] = useState(false)
  const [rated, setRated] = useState(false)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (step >= STEPS.length - 1) return
    const t = setTimeout(() => setStep(s => s + 1), 8000)
    return () => clearTimeout(t)
  }, [step])

  const isDelivered = step >= STEPS.length - 1

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Suivi commande #{orderId}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Pharmacie Liberté 6 · 3 articles</div>
        </div>
      </div>

      {/* Map area */}
      <div style={{ width: '100%', height: 180, borderRadius: 20, background: 'linear-gradient(135deg, #E8F4F8 0%, #C8E6F0 50%, #A8D8EA 100%)', marginBottom: 20, position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
        {/* Street grid simulation */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          {[20, 60, 100, 140].map(y => <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: y, height: 1, background: '#5BA4F0' }} />)}
          {[40, 90, 140, 190, 240, 290, 340].map(x => <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: x, width: 1, background: '#5BA4F0' }} />)}
        </div>
        {/* Route line */}
        <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">
          <polyline points="40,150 80,120 140,80 220,70 300,90" fill="none" stroke="#5BA4F0" strokeWidth="3" strokeDasharray="8,4" />
        </svg>
        {/* Origin */}
        <div style={{ position: 'absolute', left: 28, top: 138, width: 24, height: 24, borderRadius: 999, background: '#E87B36', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>🏪</div>
        {/* Destination */}
        <div style={{ position: 'absolute', right: 60, top: 66, width: 24, height: 24, borderRadius: 999, background: '#1F8B5B', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>📍</div>
        {/* Driver (animated) */}
        <div style={{ position: 'absolute', left: 190 + step * 10, top: 60 + step * 5, width: 36, height: 36, borderRadius: 999, background: '#fff', border: '3px solid #5BA4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(91,164,240,0.4)', transition: 'left 2s ease, top 2s ease' }}>🏍️</div>
        {/* ETA badge */}
        <div style={{ position: 'absolute', top: 10, right: 10, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: 12, color: '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {isDelivered ? '✅ Livré' : `~${Math.max(1, 8 - step * 2)} min`}
        </div>
      </div>

      {/* Driver card */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 50, height: 50, borderRadius: 999, background: '#E0EEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏍️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Cheikh Ndao</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>⭐ 4.9 · Honda CB 125</div>
          <div style={{ fontSize: 12, color: '#888' }}>📞 +221 77 930 22 18</div>
        </div>
        <a href="tel:+221779302218" style={{ width: 44, height: 44, borderRadius: 999, background: '#E0F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, textDecoration: 'none' }}>📞</a>
        <button
          onClick={() => navigate(`/client/orders/${orderId}/messaging`)}
          style={{ width: 44, height: 44, borderRadius: 999, background: '#E0EEFF', border: 'none', cursor: 'pointer', fontSize: 20 }}
        >💬</button>
      </div>

      {/* Progress steps */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 14 }}>Progression</div>
        {STEPS.map((s, i) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < STEPS.length - 1 ? 12 : 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: i <= step ? '#E0EEFF' : '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, border: i === step ? '2px solid #5BA4F0' : '2px solid transparent' }}>
              {i < step ? '✅' : s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: i === step ? 700 : 500, fontSize: 13, color: i <= step ? '#1a1a1a' : '#aaa' }}>{s.label}</div>
            </div>
            {i === step && !isDelivered && <div style={{ width: 8, height: 8, borderRadius: 999, background: '#5BA4F0' }} />}
          </div>
        ))}
      </div>

      {/* OTP */}
      <div
        onClick={() => setOtpVisible(v => !v)}
        style={{ padding: 16, background: 'linear-gradient(135deg, #E0EEFF, #C8DAFF)', borderRadius: 20, marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <span style={{ fontSize: 24 }}>🔐</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Code de remise</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Donnez ce code au livreur à la porte</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 22, color: '#5BA4F0', letterSpacing: '0.15em' }}>{otpVisible ? '4729' : '····'}</div>
      </div>

      {/* Order summary */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Récapitulatif</div>
        {[
          { name: 'Doliprane 1000mg × 2', price: '2 400 F' },
          { name: 'Spray nasal', price: '2 100 F' },
          { name: 'Frais de livraison', price: '300 F' },
        ].map(item => (
          <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#555' }}>{item.name}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.price}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#E87B36' }}>4 800 F</span>
        </div>
      </div>

      {/* Delivered: rate + dispute */}
      {isDelivered && !rated && (
        <div style={{ padding: 20, background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>Livraison reçue ? Notez Cheikh</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '14px 0' }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} style={{ fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', opacity: n <= rating ? 1 : 0.3, transition: 'opacity 0.1s' }}>⭐</button>
            ))}
          </div>
          <button
            onClick={() => setRated(true)}
            disabled={!rating}
            style={{ width: '100%', padding: '13px', borderRadius: 16, border: 'none', background: rating ? '#E87B36' : '#ccc', color: '#fff', fontWeight: 700, fontSize: 15, cursor: rating ? 'pointer' : 'default' }}
          >
            Valider la livraison
          </button>
          <button
            onClick={() => navigate(`/client/orders/${orderId}/dispute`)}
            style={{ width: '100%', padding: '10px', borderRadius: 16, border: '1px solid #e53e3e', background: 'transparent', color: '#e53e3e', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 8 }}
          >
            Signaler un problème
          </button>
        </div>
      )}
      {rated && (
        <div style={{ padding: 20, background: '#E0F2EC', borderRadius: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>🎉</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1F8B5B', marginTop: 8 }}>Merci pour votre note !</div>
          <button onClick={() => navigate('/client')} style={{ marginTop: 14, padding: '12px 24px', borderRadius: 999, border: 'none', background: '#1F8B5B', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Retour à l'accueil
          </button>
        </div>
      )}
    </div>
  )
}
