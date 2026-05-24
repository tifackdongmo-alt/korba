import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ZONES = [
  { name: 'Dakar Plateau', drivers: ['Cheikh Ndao', 'Ibou Sow'], active: true, deliveries: 52 },
  { name: 'Mermoz / Sacré-Cœur', drivers: ['Moussa Diop'], active: true, deliveries: 38 },
  { name: 'Liberté / Point-E', drivers: [], active: false, deliveries: 0 },
  { name: 'Almadies', drivers: ['Aminata Fall', 'Cheikh Ndao'], active: true, deliveries: 33 },
]

const ALL_DRIVERS = ['Cheikh Ndao', 'Moussa Diop', 'Ibou Sow', 'Aminata Fall']

export function AgencyTeamZonesContainer() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'zones' | 'assign'>('zones')
  const [zones, setZones] = useState(ZONES)
  const [showNewZone, setShowNewZone] = useState(false)
  const [newZoneName, setNewZoneName] = useState('')

  const addZone = () => {
    if (!newZoneName.trim()) return
    setZones(z => [...z, { name: newZoneName.trim(), drivers: [], active: true, deliveries: 0 }])
    setNewZoneName('')
    setShowNewZone(false)
  }

  const toggleDriver = (zoneName: string, driver: string) => {
    setZones(z => z.map(zone => {
      if (zone.name !== zoneName) return zone
      const has = zone.drivers.includes(driver)
      return { ...zone, drivers: has ? zone.drivers.filter(d => d !== driver) : [...zone.drivers, driver] }
    }))
  }

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/agency')} style={{ width: 36, height: 36, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a' }}>Équipe & Zones</div>
          <div style={{ fontSize: 12, color: '#888' }}>Gérer les zones et l'affectation</div>
        </div>
        <button onClick={() => navigate('/agency/drivers')} style={{ padding: '8px 14px', borderRadius: 999, border: 'none', background: '#1F8B5B', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Livreurs →</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['zones', 'assign'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: tab === t ? '#1F8B5B' : '#E0F2EC', color: tab === t ? '#fff' : '#1F8B5B', transition: 'all 0.15s' }}>
            {t === 'zones' ? '🗺️ Zones' : '👥 Affectation'}
          </button>
        ))}
      </div>

      {tab === 'zones' && (
        <>
          {zones.map((z, i) => (
            <div key={i} style={{ padding: 16, background: '#fff', borderRadius: 18, border: `1px solid rgba(0,0,0,0.06)`, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>📍 {z.name}</div>
                <span style={{ padding: '3px 10px', borderRadius: 999, background: z.active ? '#E0F2EC' : '#F0F0F0', color: z.active ? '#1F8B5B' : '#888', fontSize: 11, fontWeight: 600 }}>{z.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{z.deliveries} livraisons ce mois</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {z.drivers.length > 0 ? z.drivers.map(d => (
                  <span key={d} style={{ padding: '3px 10px', borderRadius: 999, background: '#E0EEFF', color: '#5BA4F0', fontSize: 11, fontWeight: 600 }}>{d}</span>
                )) : <span style={{ fontSize: 12, color: '#aaa' }}>Aucun livreur assigné</span>}
              </div>
            </div>
          ))}
          {showNewZone ? (
            <div style={{ padding: 16, background: '#fff', borderRadius: 18, border: '2px solid #1F8B5B', marginBottom: 10 }}>
              <input value={newZoneName} onChange={e => setNewZoneName(e.target.value)} placeholder="Nom de la zone…" style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box', fontFamily: 'inherit' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowNewZone(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                <button onClick={addZone} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: '#1F8B5B', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Créer</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNewZone(true)} style={{ width: '100%', padding: '13px', borderRadius: 16, border: '1.5px dashed rgba(0,0,0,0.15)', background: 'transparent', color: '#888', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              + Nouvelle zone
            </button>
          )}
        </>
      )}

      {tab === 'assign' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {zones.map((z, zi) => (
            <div key={zi} style={{ padding: 16, background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>📍 {z.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ALL_DRIVERS.map(driver => {
                  const assigned = z.drivers.includes(driver)
                  return (
                    <button
                      key={driver}
                      onClick={() => toggleDriver(z.name, driver)}
                      style={{ padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${assigned ? '#1F8B5B' : 'rgba(0,0,0,0.08)'}`, background: assigned ? '#E0F2EC' : '#F6F2EF', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{driver}</span>
                      <span style={{ fontSize: 14, color: assigned ? '#1F8B5B' : '#aaa' }}>{assigned ? '✅' : '○'}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
