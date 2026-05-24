import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const MOCK_ORDERS: Record<string, {
  id: string; client: string; phone: string; items: { name: string; qty: number; price: string }[];
  total: string; status: string; time: string; address: string; note: string
}> = {
  'KB-2841': {
    id: 'KB-2841', client: 'Fatou Diallo', phone: '+221 77 412 89 03', address: 'Sacré-Cœur 3, Dakar',
    items: [{ name: 'Doliprane 1000mg', qty: 2, price: '1 200 F' }, { name: 'Spray nasal', qty: 1, price: '2 100 F' }],
    total: '4 800 F', status: 'A_PREPARER', time: 'il y a 3 min', note: 'Sonner à l\'interphone 3B',
  },
  'KB-2839': {
    id: 'KB-2839', client: 'Mamadou Sarr', phone: '+221 76 238 10 44', address: 'Mermoz Pyrotechnie',
    items: [{ name: 'Paracétamol 500mg', qty: 2, price: '900 F' }, { name: 'Vitamine C', qty: 1, price: '550 F' }],
    total: '2 350 F', status: 'LIVREUR_ASSIGNE', time: 'il y a 12 min', note: '',
  },
  'KB-2835': {
    id: 'KB-2835', client: 'Aïcha Ndiaye', phone: '+221 77 930 22 18', address: 'Point-E, Dakar',
    items: [{ name: 'Crème solaire SPF 50', qty: 1, price: '3 800 F' }, { name: 'Sérum vitamine C', qty: 1, price: '6 500 F' }],
    total: '10 600 F', status: 'EN_ROUTE_VERS_CLIENT', time: 'il y a 28 min', note: '',
  },
}

const STATUS_FLOW = ['A_PREPARER', 'LIVREUR_ASSIGNE', 'EN_ROUTE_VERS_VENDEUR', 'EN_ROUTE_VERS_CLIENT', 'TERMINEE']
const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; next?: string; nextLabel?: string }> = {
  A_PREPARER: { label: 'À préparer', color: '#B85A10', bg: '#FFF1E2', next: 'LIVREUR_ASSIGNE', nextLabel: 'Marquer comme prête' },
  LIVREUR_ASSIGNE: { label: 'Livreur assigné', color: '#5BA4F0', bg: '#E0EEFF', next: 'EN_ROUTE_VERS_VENDEUR', nextLabel: 'Livreur arrivé au shop' },
  EN_ROUTE_VERS_VENDEUR: { label: 'Livreur en route', color: '#6E58F1', bg: '#F0EDFF', next: 'EN_ROUTE_VERS_CLIENT', nextLabel: 'Confirmer récupération' },
  EN_ROUTE_VERS_CLIENT: { label: 'En livraison', color: '#1F8B5B', bg: '#E0F2EC' },
  TERMINEE: { label: '✅ Terminée', color: '#555', bg: '#F0F0F0' },
}

export function VendorOrderDetailContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const order = MOCK_ORDERS[orderId || ''] || Object.values(MOCK_ORDERS)[0]
  const [status, setStatus] = useState(order.status)

  const s = STATUS_LABELS[status] || STATUS_LABELS['A_PREPARER']
  const currentStepIndex = STATUS_FLOW.indexOf(status)

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/vendor')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Commande #{order.id}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{order.time}</div>
        </div>
        <span style={{ padding: '5px 12px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 12, fontWeight: 700 }}>{s.label}</span>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '12px 16px', background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {['Reçue', 'Prête', 'Récupérée', 'Livraison', 'Fini'].map((label, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: i <= currentStepIndex ? '#6E58F1' : '#E0E0E0', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700 }}>
                {i < currentStepIndex ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 9, color: i <= currentStepIndex ? '#6E58F1' : '#aaa', fontWeight: i === currentStepIndex ? 700 : 400 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Client info */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 999, background: '#FFF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#E87B36', flexShrink: 0 }}>{order.client[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{order.client}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>📞 {order.phone}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>📍 {order.address}</div>
          {order.note && <div style={{ fontSize: 12, color: '#B85A10', marginTop: 4 }}>📝 {order.note}</div>}
        </div>
        <button onClick={() => navigate(`/vendor/messages/boutique`)} style={{ width: 38, height: 38, borderRadius: 999, border: 'none', background: '#F0EDFF', cursor: 'pointer', fontSize: 18 }}>💬</button>
      </div>

      {/* Items */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>Articles commandés</div>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{item.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Qté : {item.qty}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#6E58F1' }}>{item.price}</div>
          </div>
        ))}
        <div style={{ borderTop: '1.5px solid rgba(0,0,0,0.06)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#6E58F1' }}>{order.total}</span>
        </div>
      </div>

      {/* Action button */}
      {s.next && (
        <button
          onClick={() => setStatus(s.next!)}
          style={{ width: '100%', padding: '15px', borderRadius: 18, border: 'none', background: '#6E58F1', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(110,88,241,0.35)' }}
        >
          ✓ {s.nextLabel}
        </button>
      )}
      {status === 'TERMINEE' && (
        <div style={{ padding: 20, background: '#E0F2EC', borderRadius: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 28 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1F8B5B', marginTop: 8 }}>Commande terminée !</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Fonds débloqués</div>
        </div>
      )}
    </div>
  )
}
