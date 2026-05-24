import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function ClientPaymentChoiceContainer() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<'platform' | 'physical' | null>(null)

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a' }}>Mode de paiement</div>
          <div style={{ fontSize: 12, color: '#888' }}>Retrait physique</div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#555', marginBottom: 24, lineHeight: 1.6, padding: '14px 16px', background: '#FFF1E2', borderRadius: 16, border: '1px solid rgba(232,123,54,0.2)' }}>
        ℹ️ Vous avez choisi le retrait physique. Sélectionnez comment vous souhaitez régler votre commande lors du passage.
      </div>

      {/* Option 1: Platform escrow */}
      <button
        onClick={() => setSelected('platform')}
        style={{ width: '100%', padding: 20, borderRadius: 20, border: `2px solid ${selected === 'platform' ? '#E87B36' : 'rgba(0,0,0,0.08)'}`, background: selected === 'platform' ? '#FFF1E2' : '#fff', cursor: 'pointer', textAlign: 'left', marginBottom: 12, transition: 'all 0.15s' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: '1px solid rgba(232,123,54,0.2)' }}>🔒</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>Payer via la plateforme</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>Vos fonds sont sécurisés sur Korba et libérés au vendeur uniquement à la confirmation de votre retrait.</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 10px', borderRadius: 999, background: '#E0F2EC', color: '#1F8B5B', fontSize: 11, fontWeight: 600 }}>🛡️ Sécurisé</span>
              <span style={{ padding: '3px 10px', borderRadius: 999, background: '#E0EEFF', color: '#5BA4F0', fontSize: 11, fontWeight: 600 }}>Orange Money</span>
              <span style={{ padding: '3px 10px', borderRadius: 999, background: '#E0EEFF', color: '#5BA4F0', fontSize: 11, fontWeight: 600 }}>Wave</span>
            </div>
          </div>
        </div>
        {selected === 'platform' && <div style={{ marginTop: 14, borderTop: '1px solid rgba(232,123,54,0.2)', paddingTop: 14 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Sélectionnez votre moyen de paiement</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Orange Money', 'Wave', 'Carte'].map(m => (
              <button key={m} style={{ flex: 1, padding: '10px 6px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#333' }}>{m}</button>
            ))}
          </div>
        </div>}
      </button>

      {/* Option 2: Pay physically */}
      <button
        onClick={() => setSelected('physical')}
        style={{ width: '100%', padding: 20, borderRadius: 20, border: `2px solid ${selected === 'physical' ? '#6E58F1' : 'rgba(0,0,0,0.08)'}`, background: selected === 'physical' ? '#F0EDFF' : '#fff', cursor: 'pointer', textAlign: 'left', marginBottom: 24, transition: 'all 0.15s' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F0EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: '1px solid rgba(110,88,241,0.2)' }}>💵</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 4 }}>Payer physiquement</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>Contactez le vendeur, discutez directement et réglez lors de votre passage. Possibilité de négocier.</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ padding: '3px 10px', borderRadius: 999, background: '#F0EDFF', color: '#6E58F1', fontSize: 11, fontWeight: 600 }}>💬 Message vendeur</span>
              <span style={{ padding: '3px 10px', borderRadius: 999, background: '#FFF1E2', color: '#E87B36', fontSize: 11, fontWeight: 600 }}>💰 Négociable</span>
            </div>
          </div>
        </div>
      </button>

      {/* CTA */}
      <button
        onClick={() => {
          if (selected === 'physical') navigate(`/client/messages/vendor-boutique?product=${productId}&mode=physical`)
          else if (selected === 'platform') navigate(`/client/checkout?product=${productId}&mode=escrow`)
        }}
        disabled={!selected}
        style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: selected ? '#E87B36' : '#ccc', color: '#fff', fontWeight: 700, fontSize: 15, cursor: selected ? 'pointer' : 'default', boxShadow: selected ? '0 6px 20px rgba(232,123,54,0.35)' : 'none', transition: 'all 0.2s' }}
      >
        {selected === 'physical' ? '💬 Contacter le vendeur' : selected === 'platform' ? '🔒 Sécuriser le paiement' : 'Choisissez une option'}
      </button>
    </div>
  )
}
