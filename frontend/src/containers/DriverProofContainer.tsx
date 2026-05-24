import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function DriverProofContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [photoTaken, setPhotoTaken] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [note, setNote] = useState('')

  if (submitted) {
    return (
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: '#1a1a1a', marginBottom: 8 }}>Livraison confirmée !</div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Mission #{orderId} terminée avec succès. Vos gains ont été crédités.</div>
        <div style={{ padding: 16, background: '#E0F2EC', borderRadius: 18, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1F8B5B' }}>💰 +850 F crédités</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Gains totaux aujourd'hui : 6 800 F</div>
        </div>
        <button onClick={() => navigate('/driver')} style={{ padding: '14px 32px', borderRadius: 999, border: 'none', background: '#5BA4F0', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(91,164,240,0.4)' }}>
          Retour aux missions
        </button>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Preuve de livraison</div>
          <div style={{ fontSize: 12, color: '#888' }}>Mission #{orderId}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>📸 Photo de la livraison</div>
        <div
          onClick={() => setPhotoTaken(true)}
          style={{ width: '100%', aspectRatio: '16/9', borderRadius: 20, background: photoTaken ? 'linear-gradient(135deg, #E0F2EC, #B8EDD4)' : '#F6F2EF', border: `2px dashed ${photoTaken ? '#1F8B5B' : 'rgba(0,0,0,0.15)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', gap: 8 }}
        >
          {photoTaken ? (
            <>
              <span style={{ fontSize: 40 }}>✅</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#1F8B5B' }}>Photo prise !</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 40 }}>📷</span>
              <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Toucher pour prendre une photo</span>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#888', marginBottom: 10 }}>Récapitulatif</div>
        {[
          { label: 'Client', value: 'Fatou Diallo' },
          { label: 'Adresse', value: 'Sacré-Cœur 3, Imm. B' },
          { label: 'Articles', value: 'Doliprane × 2, Spray nasal' },
          { label: 'Votre gain', value: '850 F' },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 12, color: '#888' }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 8 }}>📝 Note (optionnel)</div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Ajouter une note sur la livraison…"
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.10)', fontSize: 14, outline: 'none', resize: 'none', height: 80, fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      </div>

      <button
        onClick={() => setSubmitted(true)}
        disabled={!photoTaken}
        style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: photoTaken ? '#5BA4F0' : '#ccc', color: '#fff', fontWeight: 700, fontSize: 15, cursor: photoTaken ? 'pointer' : 'default', boxShadow: photoTaken ? '0 6px 20px rgba(91,164,240,0.4)' : 'none', transition: 'all 0.2s' }}
      >
        ✓ Confirmer la livraison
      </button>
    </div>
  )
}
