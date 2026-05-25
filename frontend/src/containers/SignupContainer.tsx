import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useAccountsStore, type Account, type Role } from '@/store/accounts'

const ROLE_META: Record<Role, { label: string; color: string; bg: string; icon: string; tagline: string }> = {
  client: { label: 'Client', color: '#E87B36', bg: '#FFF1E2', icon: '🛍', tagline: 'Commandez en quelques clics auprès de vos commerces préférés' },
  vendor: { label: 'Vendeur', color: '#6E58F1', bg: '#F0EDFF', icon: '🏪', tagline: 'Vendez votre catalogue à des milliers de clients à Dakar' },
  agency: { label: 'Agence', color: '#1F8B5B', bg: '#E0F2EC', icon: '🏢', tagline: 'Gérez votre flotte de livreurs et optimisez vos zones' },
  driver: { label: 'Livreur', color: '#5BA4F0', bg: '#E0EEFF', icon: '🏍', tagline: 'Gagnez de l\'argent en livrant à votre rythme' },
}

const CITIES = ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès', 'Saint-Louis', 'Touba', 'Mbour']
const SHOP_CATEGORIES = ['Pharmacie', 'Restaurant', 'Marché / Épicerie', 'Cosmétiques', 'Boutique', 'Électronique', 'Autre']
const VEHICLES = ['Moto', 'Vélo', 'Voiture', 'À pied'] as const

export function SignupContainer() {
  const navigate = useNavigate()
  const { role } = useParams<{ role: Role }>()
  const validRole = (role && ['client', 'vendor', 'agency', 'driver'].includes(role)) ? (role as Role) : 'client'
  const meta = ROLE_META[validRole]

  const setUser = useAuthStore(s => s.setUser)
  const addAccount = useAccountsStore(s => s.addAccount)
  const findByPhone = useAccountsStore(s => s.findByPhone)

  const totalSteps = validRole === 'client' ? 4 : 5
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Common fields
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('Dakar')

  // Client
  const [defaultAddress, setDefaultAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'wave' | 'carte'>('orange_money')
  // Vendor
  const [shopName, setShopName] = useState('')
  const [shopCategory, setShopCategory] = useState('Pharmacie')
  const [shopAddress, setShopAddress] = useState('')
  const [openingHours, setOpeningHours] = useState('8h - 20h')
  const [description, setDescription] = useState('')
  // Agency
  const [agencyName, setAgencyName] = useState('')
  const [zone, setZone] = useState('')
  const [fleetSize, setFleetSize] = useState(1)
  const [vehicleTypes, setVehicleTypes] = useState<string[]>(['Moto'])
  const [baseFee, setBaseFee] = useState(500)
  // Driver
  const [vehicle, setVehicle] = useState<typeof VEHICLES[number]>('Moto')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [driverZone, setDriverZone] = useState('Plateau')

  const validateStep = (): boolean => {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (!/^\+221\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.trim())) e.phone = 'Format : +221 7X XXX XX XX'
      if (findByPhone(phone.trim())) e.phone = 'Ce numéro est déjà inscrit'
    }
    if (step === 2) {
      if (otp.length !== 4) e.otp = 'Code à 4 chiffres'
    }
    if (step === 3) {
      if (firstName.trim().length < 2) e.firstName = 'Prénom requis'
      if (lastName.trim().length < 2) e.lastName = 'Nom requis'
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide'
    }
    if (step === 4) {
      if (validRole === 'client' && !defaultAddress.trim()) e.defaultAddress = 'Adresse requise'
      if (validRole === 'vendor') {
        if (shopName.trim().length < 2) e.shopName = 'Nom de boutique requis'
        if (!shopAddress.trim()) e.shopAddress = 'Adresse requise'
      }
      if (validRole === 'agency') {
        if (agencyName.trim().length < 2) e.agencyName = 'Nom d\'agence requis'
        if (!zone.trim()) e.zone = 'Zone requise'
      }
      if (validRole === 'driver') {
        if (licenseNumber.trim().length < 4) e.licenseNumber = 'Numéro requis'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validateStep()) return
    if (step < totalSteps) setStep(s => s + 1)
    else submit()
  }

  const submit = () => {
    setSubmitting(true)
    setTimeout(() => {
      const id = `acc-${Date.now()}`
      const base = {
        id,
        role: validRole,
        phone: phone.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        city,
        createdAt: new Date().toISOString(),
        verified: true,
      }
      let account: Account
      if (validRole === 'client') {
        account = { ...base, role: 'client', defaultAddress: defaultAddress.trim(), paymentMethod }
      } else if (validRole === 'vendor') {
        account = { ...base, role: 'vendor', shopName: shopName.trim(), category: shopCategory, shopAddress: shopAddress.trim(), openingHours, description: description.trim() }
      } else if (validRole === 'agency') {
        account = { ...base, role: 'agency', agencyName: agencyName.trim(), zone, fleetSize, vehicleTypes, baseFee }
      } else {
        account = { ...base, role: 'driver', vehicle, licenseNumber: licenseNumber.trim(), zone: driverZone }
      }
      addAccount(account)
      setUser(id, validRole, `${firstName.trim()} ${lastName.trim()}`)
      setSubmitting(false)
      setDone(true)
      setTimeout(() => navigate(`/${validRole}`), 2000)
    }, 1200)
  }

  if (done) {
    return (
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }} aria-hidden="true">🎉</div>
        <div style={{ fontWeight: 800, fontSize: 24, color: meta.color, marginBottom: 8 }}>Bienvenue sur Korba !</div>
        <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5, marginBottom: 20 }}>
          Votre compte {meta.label.toLowerCase()} est créé. Vous êtes redirigé vers votre espace…
        </div>
        <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: meta.bg, color: meta.color, fontSize: 12, fontWeight: 700 }}>
          {meta.icon} {firstName} {lastName}
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/login')}
          aria-label="Retour"
          style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          ‹
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a1a' }}>Inscription {meta.label}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Étape {step} sur {totalSteps}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }} aria-hidden="true">{meta.icon}</div>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }} role="progressbar" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={step}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < step ? meta.color : '#E5E5E5', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Steps */}
      {step === 1 && (
        <StepBlock title="Votre numéro de téléphone" subtitle="Nous vous enverrons un code de vérification par SMS">
          <Field label="Téléphone" error={errors.phone}>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+221 77 123 45 67"
              autoComplete="tel"
              style={inputStyle(!!errors.phone, meta.color)}
            />
          </Field>
          <div style={{ marginTop: 16, padding: 12, background: meta.bg, borderRadius: 12, fontSize: 12, color: meta.color, lineHeight: 1.5 }}>
            💡 <strong>Astuce démo :</strong> tout numéro au bon format est accepté. Le code OTP sera <strong>1234</strong> à l'étape suivante.
          </div>
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock title="Vérification du numéro" subtitle={`Entrez le code envoyé au ${phone}`}>
          <Field label="Code à 4 chiffres" error={errors.otp}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="1234"
              style={{ ...inputStyle(!!errors.otp, meta.color), textAlign: 'center', fontSize: 24, letterSpacing: '10px', fontWeight: 700 }}
            />
          </Field>
          <button
            onClick={() => setOtp('1234')}
            style={{ marginTop: 10, padding: '8px 14px', borderRadius: 8, background: 'transparent', border: 'none', color: meta.color, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            ⚡ Auto-remplir (démo)
          </button>
        </StepBlock>
      )}

      {step === 3 && (
        <StepBlock title="Votre identité" subtitle="Comment vos contacts vous reconnaîtront">
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="Prénom" error={errors.firstName} flex>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Awa"
                autoComplete="given-name"
                style={inputStyle(!!errors.firstName, meta.color)}
              />
            </Field>
            <Field label="Nom" error={errors.lastName} flex>
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Diallo"
                autoComplete="family-name"
                style={inputStyle(!!errors.lastName, meta.color)}
              />
            </Field>
          </div>
          <Field label="Email (optionnel)" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              style={inputStyle(!!errors.email, meta.color)}
            />
          </Field>
          <Field label="Ville">
            <select value={city} onChange={e => setCity(e.target.value)} style={inputStyle(false, meta.color)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </StepBlock>
      )}

      {/* Step 4 — role-specific */}
      {step === 4 && validRole === 'client' && (
        <StepBlock title="Informations de livraison" subtitle="Pour vos commandes futures">
          <Field label="Adresse par défaut" error={errors.defaultAddress}>
            <input
              value={defaultAddress}
              onChange={e => setDefaultAddress(e.target.value)}
              placeholder="Sacré-Cœur 3, Villa n°12"
              autoComplete="street-address"
              style={inputStyle(!!errors.defaultAddress, meta.color)}
            />
          </Field>
          <Field label="Moyen de paiement préféré">
            <div style={{ display: 'flex', gap: 8 }}>
              {(['orange_money', 'wave', 'carte'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPaymentMethod(p)}
                  style={{ flex: 1, minHeight: 56, padding: 10, borderRadius: 12, border: `1.5px solid ${paymentMethod === p ? meta.color : 'rgba(0,0,0,0.1)'}`, background: paymentMethod === p ? meta.bg : '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: paymentMethod === p ? meta.color : '#555' }}
                >
                  <div style={{ fontSize: 20, marginBottom: 3 }}>{p === 'orange_money' ? '🟠' : p === 'wave' ? '🔵' : '💳'}</div>
                  {p === 'orange_money' ? 'Orange Money' : p === 'wave' ? 'Wave' : 'Carte'}
                </button>
              ))}
            </div>
          </Field>
        </StepBlock>
      )}

      {step === 4 && validRole === 'vendor' && (
        <StepBlock title="Votre boutique" subtitle="Ces informations apparaîtront pour les clients">
          <Field label="Nom de la boutique" error={errors.shopName}>
            <input value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Pharmacie Liberté 6" style={inputStyle(!!errors.shopName, meta.color)} />
          </Field>
          <Field label="Catégorie">
            <select value={shopCategory} onChange={e => setShopCategory(e.target.value)} style={inputStyle(false, meta.color)}>
              {SHOP_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Adresse de la boutique" error={errors.shopAddress}>
            <input value={shopAddress} onChange={e => setShopAddress(e.target.value)} placeholder="Avenue Bourguiba, Dakar" style={inputStyle(!!errors.shopAddress, meta.color)} />
          </Field>
          <Field label="Horaires d'ouverture">
            <input value={openingHours} onChange={e => setOpeningHours(e.target.value)} placeholder="8h - 20h, 7j/7" style={inputStyle(false, meta.color)} />
          </Field>
        </StepBlock>
      )}

      {step === 4 && validRole === 'agency' && (
        <StepBlock title="Votre agence" subtitle="Vos zones et flotte de livreurs">
          <Field label="Nom de l'agence" error={errors.agencyName}>
            <input value={agencyName} onChange={e => setAgencyName(e.target.value)} placeholder="Rapid Dakar Express" style={inputStyle(!!errors.agencyName, meta.color)} />
          </Field>
          <Field label="Zone(s) de couverture" error={errors.zone}>
            <input value={zone} onChange={e => setZone(e.target.value)} placeholder="Dakar Plateau, Mermoz, Sacré-Cœur" style={inputStyle(!!errors.zone, meta.color)} />
          </Field>
          <Field label={`Taille de la flotte : ${fleetSize} livreur${fleetSize > 1 ? 's' : ''}`}>
            <input type="range" min={1} max={50} value={fleetSize} onChange={e => setFleetSize(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: meta.color }} />
          </Field>
          <Field label="Types de véhicules acceptés">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {VEHICLES.map(v => {
                const active = vehicleTypes.includes(v)
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVehicleTypes(prev => active ? prev.filter(x => x !== v) : [...prev, v])}
                    style={{ minHeight: 40, padding: '8px 16px', borderRadius: 999, border: `1.5px solid ${active ? meta.color : 'rgba(0,0,0,0.1)'}`, background: active ? meta.bg : '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, color: active ? meta.color : '#555' }}
                  >
                    {active ? '✓ ' : ''}{v}
                  </button>
                )
              })}
            </div>
          </Field>
        </StepBlock>
      )}

      {step === 4 && validRole === 'driver' && (
        <StepBlock title="Votre profil livreur" subtitle="Véhicule et zone d'activité">
          <Field label="Type de véhicule">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {VEHICLES.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVehicle(v)}
                  style={{ minHeight: 64, padding: 14, borderRadius: 14, border: `1.5px solid ${vehicle === v ? meta.color : 'rgba(0,0,0,0.1)'}`, background: vehicle === v ? meta.bg : '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: vehicle === v ? meta.color : '#333' }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{v === 'Moto' ? '🏍️' : v === 'Vélo' ? '🚲' : v === 'Voiture' ? '🚗' : '🚶'}</div>
                  {v}
                </button>
              ))}
            </div>
          </Field>
          <Field label="N° de permis / pièce d'identité" error={errors.licenseNumber}>
            <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="SN-12345678" style={inputStyle(!!errors.licenseNumber, meta.color)} />
          </Field>
          <Field label="Zone principale">
            <input value={driverZone} onChange={e => setDriverZone(e.target.value)} placeholder="Plateau, Sacré-Cœur" style={inputStyle(false, meta.color)} />
          </Field>
        </StepBlock>
      )}

      {step === 5 && (
        <StepBlock title="Récapitulatif" subtitle="Vérifiez vos informations avant validation">
          <div style={{ padding: 16, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Recap label="Téléphone" value={phone} />
            <Recap label="Nom" value={`${firstName} ${lastName}`} />
            {email && <Recap label="Email" value={email} />}
            <Recap label="Ville" value={city} />
            {validRole === 'vendor' && <>
              <Recap label="Boutique" value={shopName} />
              <Recap label="Catégorie" value={shopCategory} />
              <Recap label="Adresse" value={shopAddress} />
            </>}
            {validRole === 'agency' && <>
              <Recap label="Agence" value={agencyName} />
              <Recap label="Zone" value={zone} />
              <Recap label="Flotte" value={`${fleetSize} livreur${fleetSize > 1 ? 's' : ''}`} />
              <Recap label="Véhicules" value={vehicleTypes.join(', ')} />
            </>}
            {validRole === 'driver' && <>
              <Recap label="Véhicule" value={vehicle} />
              <Recap label="Permis" value={licenseNumber} />
              <Recap label="Zone" value={driverZone} last />
            </>}
          </div>
          <div style={{ marginTop: 14, padding: 12, background: meta.bg, borderRadius: 12, fontSize: 12, color: meta.color, lineHeight: 1.5 }}>
            🔒 En validant, vous acceptez les <strong>conditions d'utilisation</strong> et la <strong>politique de confidentialité</strong> Korba.
          </div>
        </StepBlock>
      )}

      <button
        onClick={next}
        disabled={submitting}
        style={{ width: '100%', minHeight: 52, marginTop: 24, padding: '15px', borderRadius: 16, border: 'none', background: meta.color, color: '#fff', fontWeight: 700, fontSize: 15, cursor: submitting ? 'wait' : 'pointer', boxShadow: `0 6px 20px ${meta.color}40`, transition: 'transform 0.1s, opacity 0.15s', opacity: submitting ? 0.6 : 1 }}
        onMouseDown={e => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
        onMouseUp={e => { e.currentTarget.style.transform = '' }}
      >
        {submitting ? 'Création de votre compte…' : step < totalSteps ? 'Continuer' : '✓ Valider mon inscription'}
      </button>
    </div>
  )
}

function StepBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 19, color: '#1a1a1a', marginBottom: 6, letterSpacing: '-0.3px' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13.5, color: '#888', marginBottom: 20, lineHeight: 1.5 }}>{subtitle}</div>}
      {children}
    </div>
  )
}

function Field({ label, error, children, flex }: { label: string; error?: string; children: React.ReactNode; flex?: boolean }) {
  return (
    <div style={{ marginBottom: 14, flex: flex ? 1 : undefined }}>
      <label style={{ display: 'block', fontSize: 12, color: '#555', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 11.5, color: '#e53e3e', marginTop: 4, fontWeight: 500 }} role="alert">{error}</div>}
    </div>
  )
}

function Recap({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
      <span style={{ fontSize: 12.5, color: '#888' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}

const inputStyle = (hasError: boolean, color: string): React.CSSProperties => ({
  width: '100%',
  minHeight: 48,
  padding: '13px 14px',
  borderRadius: 12,
  border: `1.5px solid ${hasError ? '#e53e3e' : 'rgba(0,0,0,0.1)'}`,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  ...(hasError ? {} : { caretColor: color }),
})
