// entry.jsx — Splash, Onboarding, Auth screens

function ScreenSplash() {
  return (
    <Phone role="client" noStatus
      bg="radial-gradient(120% 80% at 50% 20%, #FFE3CB 0%, #FAFAF7 55%, #F3F1EC 100%)">
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'52px 28px 38px', position:'relative' }}>
        {/* glow circle */}
        <div style={{
          position:'absolute', top: 90, left:'50%', transform:'translateX(-50%)',
          width: 220, height: 220, borderRadius: 999,
          background: 'radial-gradient(circle, rgba(232,123,54,0.35), transparent 65%)',
          filter: 'blur(20px)',
        }}/>
        <StatusBar />
        <div style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 18, zIndex:1 }}>
          <div style={{ width: 92, height: 92, borderRadius: 28, background:'linear-gradient(160deg, #FFFFFF, #FFF1E2)', boxShadow:'var(--sh-glass), 0 22px 50px -16px rgba(232,123,54,0.45)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <svg viewBox="0 0 64 64" width="50" height="50">
              <defs>
                <linearGradient id="logoG" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#E87B36"/><stop offset="1" stopColor="#B85412"/></linearGradient>
              </defs>
              <path d="M14 44 L14 18 L24 18 L36 32 L24 32 L24 44 Z" fill="url(#logoG)"/>
              <circle cx="46" cy="22" r="6" fill="url(#logoG)"/>
              <path d="M40 44 C 40 36, 50 36, 50 44" stroke="url(#logoG)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ textAlign:'center' }}>
            <Logo size={36}/>
            <div style={{ fontSize: 13.5, color:'var(--ink-3)', marginTop: 10 }}>Marketplace de livraison · Afrique de l’Ouest</div>
          </div>
        </div>
        <div style={{ textAlign:'center', fontSize: 11.5, color:'var(--ink-4)', letterSpacing:'0.04em', zIndex:1 }}>
          <div style={{ display:'inline-flex', gap: 6, alignItems:'center' }}>
            <span className="k-dot k-dot-live"/>Sécurisé · KYC vérifié · Paiement Orange Money / Wave
          </div>
          <div style={{ marginTop: 18, opacity: 0.6 }}>v0.1 · build 2026.05</div>
        </div>
      </div>
    </Phone>
  );
}

function ScreenOnboarding() {
  return (
    <Phone role="client">
      <div style={{ flex: 1, display:'flex', flexDirection:'column', padding: '14px 22px 30px', position:'relative' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 18 }}>
          <Logo size={20}/>
          <span style={{ fontSize: 13, color:'var(--ink-3)', fontWeight: 500 }}>Passer</span>
        </div>
        {/* hero illustration — stylized */}
        <div style={{
          height: 280, borderRadius: 26,
          background: 'linear-gradient(160deg, #FFEDDC, #FFE3CB)',
          position:'relative', overflow:'hidden',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)',
        }}>
          <svg viewBox="0 0 320 280" width="100%" height="100%">
            {/* road */}
            <path d="M 0 220 Q 160 200 320 230" stroke="#fff" strokeWidth="44" fill="none" strokeLinecap="round"/>
            <path d="M 0 220 Q 160 200 320 230" stroke="rgba(232,123,54,0.5)" strokeWidth="2" strokeDasharray="6 8" fill="none"/>
            {/* moto */}
            <g transform="translate(80, 158)">
              <circle cx="14" cy="48" r="14" fill="#0E1116"/>
              <circle cx="14" cy="48" r="6" fill="#fff"/>
              <circle cx="74" cy="48" r="14" fill="#0E1116"/>
              <circle cx="74" cy="48" r="6" fill="#fff"/>
              <path d="M 14 48 L 44 22 L 60 22 L 74 48" stroke="#0E1116" strokeWidth="4" fill="#E87B36" strokeLinejoin="round"/>
              <rect x="36" y="0" width="28" height="22" rx="4" fill="#fff" stroke="#0E1116" strokeWidth="2.5"/>
              <path d="M 44 0 L 44 -8 L 56 -8 L 56 0" stroke="#0E1116" strokeWidth="2.5" fill="none"/>
              {/* driver */}
              <circle cx="50" cy="2" r="8" fill="#5C616B"/>
            </g>
            {/* package floating */}
            <g transform="translate(220, 80)">
              <rect x="0" y="0" width="60" height="60" rx="10" fill="#fff" stroke="#0E1116" strokeWidth="2"/>
              <path d="M 0 22 L 60 22" stroke="#0E1116" strokeWidth="2"/>
              <path d="M 30 0 L 30 22" stroke="#0E1116" strokeWidth="2"/>
              <circle cx="30" cy="22" r="3" fill="#E87B36"/>
            </g>
            {/* pin */}
            <g transform="translate(46, 60)">
              <circle cx="0" cy="0" r="18" fill="#fff"/>
              <circle cx="0" cy="0" r="8" fill="#1F8B5B"/>
            </g>
          </svg>
        </div>

        <div style={{ marginTop: 26 }}>
          <span className="k-eyebrow" style={{ color:'var(--client)' }}>2 / 3 · Découvrir</span>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize: 28, fontWeight: 600, letterSpacing:'-0.03em', lineHeight: 1.1, margin:'10px 0 8px' }}>
            Choisissez votre agence,<br/>suivez votre livraison en direct.
          </h2>
          <p style={{ fontSize: 14.5, color:'var(--ink-3)', lineHeight: 1.5, textWrap:'pretty' }}>
            Comparez les zones, les délais et les avis. Marquez vos livreurs préférés et commandez en deux gestes.
          </p>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 14 }}>
          <div style={{ display:'flex', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background:'var(--ink-5)' }}/>
            <span style={{ width: 22, height: 8, borderRadius: 999, background:'var(--client)' }}/>
            <span style={{ width: 8, height: 8, borderRadius: 999, background:'var(--ink-5)' }}/>
          </div>
          <button className="k-btn k-btn-role" style={{ '--role': 'var(--client)', padding:'14px 22px' }}>
            Continuer <Icon.arrow style={{ width: 16, height: 16 }}/>
          </button>
        </div>
      </div>
    </Phone>
  );
}

function ScreenAuth() {
  return (
    <Phone role="client">
      <div style={{ flex: 1, display:'flex', flexDirection:'column', padding: '8px 22px 26px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 30 }}>
          <button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon.back style={{ width: 18, height: 18 }}/>
          </button>
          <Logo size={18}/>
          <span style={{ width: 36 }}/>
        </div>

        <h1 className="k-h1" style={{ marginBottom: 6 }}>Bon retour.</h1>
        <p style={{ fontSize: 14, color:'var(--ink-3)' }}>Connectez-vous pour suivre vos commandes en temps réel.</p>

        <div style={{ display:'flex', flexDirection:'column', gap: 12, marginTop: 26 }}>
          <label style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color:'var(--ink-3)' }}>Numéro de téléphone</span>
            <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'14px 16px', background:'#fff', borderRadius: 16, boxShadow:'0 0 0 1px var(--line)' }}>
              <span style={{ fontWeight: 600, color:'var(--ink-2)', fontSize: 15 }}>🇸🇳 +221</span>
              <span style={{ width: 1, height: 18, background:'var(--line-2)' }}/>
              <span style={{ fontSize: 16, fontWeight: 500, letterSpacing:'0.02em' }}>77 412 89 03</span>
            </div>
          </label>
          <label style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color:'var(--ink-3)' }}>Mot de passe</span>
            <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'14px 16px', background:'#fff', borderRadius: 16, boxShadow:'0 0 0 1.5px var(--client)' }}>
              <span style={{ fontSize: 16, letterSpacing: '0.4em', flex: 1 }}>••••••••</span>
              <span style={{ fontSize: 12, color:'var(--client-deep)', fontWeight: 600 }}>Afficher</span>
            </div>
          </label>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop: 12 }}>
          <span style={{ fontSize: 13, color:'var(--ink-3)', fontWeight: 500 }}>Mot de passe oublié&nbsp;?</span>
        </div>

        <button className="k-btn k-btn-role" style={{ '--role': 'var(--client)', marginTop: 18, padding: '16px' }}>
          Se connecter <Icon.arrow style={{ width: 16, height: 16 }}/>
        </button>

        <div style={{ display:'flex', alignItems:'center', gap: 10, margin:'22px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background:'var(--line)' }}/>
          <span style={{ fontSize: 11.5, color:'var(--ink-4)', letterSpacing:'0.06em', textTransform:'uppercase' }}>ou continuer avec</span>
          <div style={{ flex: 1, height: 1, background:'var(--line)' }}/>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <button className="k-btn k-btn-tinted" style={{ padding: '12px' }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, background:'#FF6B00', color:'#fff', fontSize: 10, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>OM</span>
            Orange Money
          </button>
          <button className="k-btn k-btn-tinted" style={{ padding: '12px' }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, background:'#1A237E', color:'#00D9FF', fontSize: 9, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>W</span>
            Wave
          </button>
        </div>

        <div style={{ flex: 1 }}/>
        <div style={{ textAlign:'center', fontSize: 13, color:'var(--ink-3)', marginTop: 22 }}>
          Pas encore de compte&nbsp;? <strong style={{ color:'var(--client-deep)' }}>Créer un compte</strong>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { ScreenSplash, ScreenOnboarding, ScreenAuth });
