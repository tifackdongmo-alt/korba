import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface Driver {
  id: string; name: string; vehicle: string; zone: string; orders: number; rating: number;
  online: boolean; status: string; phone: string; joined: string; successRate: number
}

const INITIAL_DRIVERS: Driver[] = [
  { id: 'DRV-001', name: 'Cheikh Ndao', vehicle: 'Moto', zone: 'Plateau', orders: 7, rating: 4.9, online: true, status: 'En livraison', phone: '+221 77 930 22 18', joined: 'Jan 2026', successRate: 98 },
  { id: 'DRV-002', name: 'Moussa Diop', vehicle: 'Vélo', zone: 'Mermoz', orders: 5, rating: 4.7, online: true, status: 'Disponible', phone: '+221 76 112 33 44', joined: 'Fév 2026', successRate: 94 },
  { id: 'DRV-003', name: 'Ibou Sow', vehicle: 'Moto', zone: 'Liberté', orders: 3, rating: 4.5, online: false, status: 'Hors ligne', phone: '+221 77 456 78 90', joined: 'Mar 2026', successRate: 91 },
  { id: 'DRV-004', name: 'Aminata Fall', vehicle: 'Moto', zone: 'Dakar', orders: 9, rating: 4.8, online: true, status: 'En route vendeur', phone: '+221 78 234 56 78', joined: 'Déc 2025', successRate: 97 },
]

export function AgencyDriversContainer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('highlight')
  const highlightRef = useRef<HTMLDivElement>(null)

  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS)
  const [selected, setSelected] = useState<string | null>(highlightId)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', vehicle: 'Moto', zone: 'Plateau' })

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      setTimeout(() => highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150)
    }
  }, [highlightId])

  const removeDriver = (id: string) => {
    if (confirm('Supprimer ce livreur de l\'agence ?')) {
      setDrivers(ds => ds.filter(d => d.id !== id))
      setSelected(null)
    }
  }

  const addDriver = () => {
    if (!newDriver.name || !newDriver.phone) return
    const newDrv: Driver = { id: `DRV-${Date.now()}`, name: newDriver.name, phone: newDriver.phone, vehicle: newDriver.vehicle, zone: newDriver.zone, orders: 0, rating: 0, online: false, status: 'Nouveau', joined: 'Maintenant', successRate: 0 }
    setDrivers(ds => [...ds, newDrv])
    setNewDriver({ name: '', phone: '', vehicle: 'Moto', zone: 'Plateau' })
    setShowAddForm(false)
  }

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/agency')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Livreurs</div>
            <div style={{ fontSize: 12, color: '#888' }}>{drivers.filter(d => d.online).length} en ligne · {drivers.length} total</div>
          </div>
        </div>
        <button onClick={() => setShowAddForm(true)} style={{ padding: '10px 16px', borderRadius: 999, border: 'none', background: '#1F8B5B', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Ajouter</button>
      </div>

      {showAddForm && (
        <div style={{ padding: 18, background: '#fff', borderRadius: 20, border: '2px solid #1F8B5B', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 14 }}>Nouveau livreur</div>
          <input value={newDriver.name} onChange={e => setNewDriver(p => ({ ...p, name: e.target.value }))} placeholder="Nom complet" style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box', fontFamily: 'inherit' }} />
          <input value={newDriver.phone} onChange={e => setNewDriver(p => ({ ...p, phone: e.target.value }))} placeholder="Téléphone (+221...)" style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {(['Moto', 'Vélo', 'Voiture'] as const).map(v => (
              <button key={v} onClick={() => setNewDriver(p => ({ ...p, vehicle: v }))} style={{ flex: 1, padding: '9px', borderRadius: 12, border: `1.5px solid ${newDriver.vehicle === v ? '#1F8B5B' : 'rgba(0,0,0,0.1)'}`, background: newDriver.vehicle === v ? '#E0F2EC' : '#fff', color: newDriver.vehicle === v ? '#1F8B5B' : '#555', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>{v}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', color: '#666', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
            <button onClick={addDriver} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: '#1F8B5B', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Ajouter</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {drivers.map(d => {
          const isSelected = selected === d.id
          const isHighlighted = d.id === highlightId
          return (
            <div key={d.id} ref={isHighlighted ? highlightRef : null} style={{ borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${isSelected ? '#1F8B5B' : isHighlighted ? '#1F8B5B80' : 'rgba(0,0,0,0.06)'}`, background: isHighlighted && !isSelected ? '#E0F2EC10' : '#fff', transition: 'border-color 0.15s' }}>
              <button
                onClick={() => setSelected(v => v === d.id ? null : d.id)}
                style={{ width: '100%', padding: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left' }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 999, background: '#E0EEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#5BA4F0' }}>{d.name[0]}</div>
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 999, background: d.online ? '#22c55e' : '#ccc', border: '2px solid #fff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{d.vehicle} · Zone {d.zone}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, color: d.online ? '#1F8B5B' : '#aaa' }}>{d.status}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{d.orders}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>livraisons</div>
                  {d.rating > 0 && <div style={{ fontSize: 12, color: '#E87B36', fontWeight: 600, marginTop: 2 }}>⭐ {d.rating}</div>}
                </div>
              </button>
              {isSelected && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '12px 0' }}>
                    <div style={{ padding: '10px', background: '#F6F2EF', borderRadius: 12, textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1F8B5B' }}>{d.successRate}%</div>
                      <div style={{ fontSize: 10, color: '#888' }}>Succès</div>
                    </div>
                    <div style={{ padding: '10px', background: '#F6F2EF', borderRadius: 12, textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#5BA4F0' }}>{d.orders}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>Ce mois</div>
                    </div>
                    <div style={{ padding: '10px', background: '#F6F2EF', borderRadius: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{d.joined}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>Membre</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>📞 {d.phone}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`tel:${d.phone}`} style={{ flex: 1, padding: '10px', borderRadius: 12, background: '#E0EEFF', color: '#5BA4F0', fontWeight: 700, fontSize: 12, textDecoration: 'none', textAlign: 'center' }}>📞 Appeler</a>
                    <button onClick={() => removeDriver(d.id)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid #e53e3e', background: 'transparent', color: '#e53e3e', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>🗑️ Retirer</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
