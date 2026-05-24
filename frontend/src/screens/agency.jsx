// agency.jsx — Agence (vert premium)
// Dashboard, Profil agence, Équipe & Zones
import { Phone, Icon, Avatar, Stars, TabBar, Chip, Logo, AppBar, MapBg, ProductImg, ROLE, StatusBar } from './components.jsx';

function AgencyDashboard() {
  return (
    <Phone role="agency">
      <div style={{ padding:'4px 22px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color:'var(--ink-4)' }}>Bonjour Aminata</div>
            <div className="k-h2" style={{ marginTop: 2 }}>Agence Téranga</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <span style={{ display:'inline-flex', gap: 6, alignItems:'center', padding:'6px 10px', borderRadius: 999, background:'var(--agency-tint)', color:'var(--agency-deep)', fontSize: 12, fontWeight: 600 }}>
              <span className="k-dot k-dot-live"/> 12 livreurs actifs
            </span>
          </div>
        </div>

        {/* hero stat with double */}
        <div style={{ marginTop: 18, padding: 18, borderRadius: 24, background:'linear-gradient(150deg, #1F8B5B, #0F5B3A)', color:'#fff', position:'relative', overflow:'hidden', boxShadow:'0 20px 40px -16px rgba(31,139,91,0.5)' }}>
          <div style={{ position:'absolute', right: -30, top: -40, width: 180, height: 180, borderRadius: 999, background:'rgba(255,255,255,0.08)' }}/>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Livraisons aujourd’hui</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize: 42, fontWeight: 600, letterSpacing:'-0.035em', marginTop: 2 }}>164</div>
              <div style={{ fontSize: 12.5, marginTop: 2 }}>
                <span style={{ background:'rgba(255,255,255,0.18)', padding:'2px 8px', borderRadius: 6, fontWeight: 600 }}>↑ 22%</span>
                <span style={{ opacity: 0.85, marginLeft: 6 }}>vs lundi</span>
              </div>
            </div>
            {/* donut */}
            <div style={{ width: 88, height: 88, position:'relative' }}>
              <svg viewBox="0 0 88 88" width="88" height="88">
                <circle cx="44" cy="44" r="36" stroke="rgba(255,255,255,0.18)" strokeWidth="10" fill="none"/>
                <circle cx="44" cy="44" r="36" stroke="#fff" strokeWidth="10" fill="none"
                  strokeDasharray="226" strokeDashoffset={226 - 226*0.97} transform="rotate(-90 44 44)" strokeLinecap="round"/>
              </svg>
              <div style={{ position:'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>97%</span>
                <span style={{ fontSize: 9, opacity: 0.85 }}>Réussite</span>
              </div>
            </div>
          </div>
          <div style={{ height: 1, background:'rgba(255,255,255,0.18)', margin:'14px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12 }}>
            <div><div style={{ opacity: 0.8 }}>Revenu</div><div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>418 200 F</div></div>
            <div><div style={{ opacity: 0.8 }}>Délai moy.</div><div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>27 min</div></div>
            <div><div style={{ opacity: 0.8 }}>Note</div><div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>4.8 ★</div></div>
          </div>
        </div>

        {/* live missions */}
        <div style={{ marginTop: 18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span className="k-h3">Missions en cours</span>
          <span style={{ fontSize: 12, color:'var(--agency-deep)', fontWeight: 600 }}>Voir la carte →</span>
        </div>
      </div>

      <div style={{ padding:'12px 22px 110px', flex: 1, overflow:'hidden' }}>
        {/* mini live map */}
        <div className="k-card" style={{ height: 130, borderRadius: 18, overflow:'hidden', position:'relative', padding: 0 }}>
          <MapBg>
            {/* mini pins */}
            <svg viewBox="0 0 360 130" width="100%" height="100%" style={{ position:'absolute', inset: 0 }}>
              {[[60,40],[120,80],[180,30],[230,90],[280,40],[320,80]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="14" fill="rgba(31,139,91,0.18)"/>
                  <circle cx={x} cy={y} r="6" fill="#1F8B5B"/>
                </g>
              ))}
              <text x="16" y="22" fontFamily="Switzer" fontSize="11" fontWeight="600" fill="#0F5B3A">6 livreurs actifs · Dakar Plateau</text>
            </svg>
          </MapBg>
        </div>

        <div style={{ marginTop: 14, display:'flex', flexDirection:'column', gap: 8 }}>
          {[
            { id:'#KB-2840', drv:'Cheikh N.', from:'Pharmacie Liberté', to:'Sacré-Cœur 3', eta:'8 min', d:'1,4 km', dot:'live', col:'var(--agency-deep)' },
            { id:'#KB-2839', drv:'Khady B.',  from:'Au bon Maquis',     to:'Mermoz',        eta:'14 min', d:'3,2 km', dot:'live', col:'var(--agency-deep)' },
            { id:'#KB-2838', drv:'Modou D.',  from:'Marché Sandaga',    to:'Plateau',       eta:'En attente prise', d:'—', dot:'wait', col:'#C28714' },
          ].map(o => (
            <div key={o.id} className="k-card" style={{ padding: 12, borderRadius: 14 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <Avatar name={o.drv} size={32}/>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{o.id} · {o.drv}</div>
                    <div style={{ fontSize: 11.5, color:'var(--ink-3)' }}>{o.from} → {o.to}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 4, fontSize: 12, fontWeight: 600, color: o.col, justifyContent:'flex-end' }}>
                    <span className={`k-dot k-dot-${o.dot}`}/>{o.eta}
                  </div>
                  <div style={{ fontSize: 11, color:'var(--ink-4)', marginTop: 2 }}>{o.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar role="agency"/>
    </Phone>
  );
}

function AgencyProfile() {
  return (
    <Phone role="agency">
      {/* hero */}
      <div style={{ position:'relative', height: 200, margin:'0 14px', borderRadius: 22, background:'linear-gradient(160deg, #E0F0E6, #C8E3D2)', overflow:'hidden' }}>
        <svg viewBox="0 0 320 200" width="100%" height="100%">
          <circle cx="40" cy="40" r="50" fill="rgba(255,255,255,0.4)"/>
          <circle cx="280" cy="160" r="80" fill="rgba(255,255,255,0.35)"/>
          <text x="22" y="160" fontFamily="Switzer" fontSize="48" fontWeight="700" fill="#0F5B3A" letterSpacing="-0.04em">Téranga</text>
        </svg>
        <div style={{ position:'absolute', top: 12, left: 12, right: 12, display:'flex', justifyContent:'space-between' }}>
          <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>
          <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.more style={{ width:18, height:18 }}/></button>
        </div>
      </div>

      <div style={{ padding:'16px 22px 110px', flex: 1, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <span className="k-h1" style={{ fontSize: 22 }}>Agence Téranga</span>
              <span style={{ width: 18, height: 18, borderRadius: 999, background:'var(--agency)', color:'#fff', fontSize: 11, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✓</span>
            </div>
            <div style={{ fontSize: 12.5, color:'var(--ink-3)', marginTop: 4 }}>Express · 24 livreurs · Dakar & Rufisque</div>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 8 }}>
              <Stars value={4.8} size={11} showValue/>
              <span style={{ fontSize: 12, color:'var(--ink-3)' }}>· 3 240 avis</span>
              <span style={{ fontSize: 12, color:'var(--ink-3)' }}>· 97% réussite</span>
            </div>
          </div>
          <span className="k-badge k-badge-pro">PRO</span>
        </div>

        <div style={{ display:'flex', gap: 8, marginTop: 12, flexWrap:'wrap' }}>
          <span className="k-badge k-badge-verified">✓ KYC entreprise</span>
          <span className="k-badge" style={{ background:'var(--agency-tint)', color:'var(--agency-deep)' }}>Assurance colis 500 k</span>
          <span className="k-badge" style={{ background:'#FFEDDC', color:'#B85412' }}>Express ≤ 60 min</span>
        </div>

        {/* CTAs */}
        <div style={{ display:'flex', gap: 8, marginTop: 16 }}>
          <button className="k-btn k-btn-role" style={{ '--role':'var(--agency)', flex: 1 }}>Demander une course</button>
          <button className="k-btn k-btn-tinted" style={{ width: 48, padding: 0 }}><Icon.chat style={{ width: 18, height: 18 }}/></button>
        </div>

        {/* zones */}
        <div className="k-card" style={{ marginTop: 18, padding: 14, borderRadius: 18 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
            <span className="k-h3">Zones couvertes</span>
            <span style={{ fontSize: 12, color:'var(--ink-3)' }}>5 zones</span>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
            {[
              ['Plateau','≤ 30 min'],
              ['Mermoz','≤ 35 min'],
              ['Sacré-Cœur','≤ 30 min'],
              ['Almadies','≤ 45 min'],
              ['Rufisque','≤ 70 min'],
            ].map(([z,d]) => (
              <span key={z} className="k-chip" style={{ background:'var(--agency-tint)', color:'var(--agency-deep)', borderColor:'transparent' }}>
                <Icon.pin style={{ width: 10, height: 10 }}/> {z} · {d}
              </span>
            ))}
          </div>
        </div>

        {/* team preview */}
        <div className="k-card" style={{ marginTop: 12, padding: 14, borderRadius: 18 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
            <span className="k-h3">Équipe</span>
            <span style={{ fontSize: 12, color:'var(--agency-deep)', fontWeight: 600 }}>24 livreurs →</span>
          </div>
          <div style={{ display:'flex', gap: 14, overflowX:'auto' }}>
            {[
              ['Cheikh N.', 4.9, true],
              ['Khady B.', 4.8, true],
              ['Modou D.', 4.7, false],
              ['Aïssatou D.', 4.9, true],
            ].map(([n,s,act]) => (
              <div key={n} style={{ textAlign:'center', flex:'0 0 auto' }}>
                <div style={{ position:'relative' }}>
                  <Avatar name={n} size={48}/>
                  {act && <span className="k-dot k-dot-live" style={{ position:'absolute', bottom: 0, right: 0, boxShadow:'0 0 0 2px #fff' }}/>}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, marginTop: 6 }}>{n}</div>
                <div style={{ fontSize: 10, color:'var(--ink-4)' }}>{s} ★</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 10, borderRadius: 22, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', boxShadow:'var(--sh-3), 0 0 0 0.5px rgba(14,17,22,0.06)', display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color:'var(--ink-4)' }}>Tarif moyen</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>500 F – 1 200 F</div>
        </div>
        <button className="k-btn k-btn-role" style={{ '--role':'var(--agency)' }}>Réserver →</button>
      </div>
    </Phone>
  );
}

function AgencyTeamZones() {
  return (
    <Phone role="agency">
      <AppBar title="Équipe & Zones" sub="24 livreurs · 5 zones"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
        trailing={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--agency)', border:0, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.plus style={{ width:18, height:18 }}/></button>}
      />

      {/* zone map */}
      <div style={{ margin:'0 22px 14px', height: 160, borderRadius: 20, overflow:'hidden', position:'relative' }}>
        <MapBg>
          <svg viewBox="0 0 360 160" width="100%" height="100%" style={{ position:'absolute', inset: 0 }}>
            {/* zones */}
            <ellipse cx="120" cy="80" rx="80" ry="55" fill="rgba(31,139,91,0.18)" stroke="#1F8B5B" strokeWidth="1.5" strokeDasharray="4 4"/>
            <ellipse cx="240" cy="60" rx="65" ry="40" fill="rgba(110,88,241,0.16)" stroke="#6E58F1" strokeWidth="1.5" strokeDasharray="4 4"/>
            <ellipse cx="280" cy="120" rx="50" ry="35" fill="rgba(232,123,54,0.16)" stroke="#E87B36" strokeWidth="1.5" strokeDasharray="4 4"/>
            {/* drivers */}
            {[[80,60],[140,90],[100,100],[220,50],[260,70],[290,110],[180,80]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#fff" stroke="#0E1116" strokeWidth="1.5"/>
            ))}
          </svg>
          <div style={{ position:'absolute', left: 10, bottom: 10, display:'flex', gap: 6, flexWrap:'wrap' }}>
            <span className="k-chip" style={{ background:'rgba(255,255,255,0.9)', borderColor:'transparent' }}><span className="k-dot" style={{ background:'#1F8B5B' }}/>Plateau</span>
            <span className="k-chip" style={{ background:'rgba(255,255,255,0.9)', borderColor:'transparent' }}><span className="k-dot" style={{ background:'#6E58F1' }}/>Mermoz</span>
            <span className="k-chip" style={{ background:'rgba(255,255,255,0.9)', borderColor:'transparent' }}><span className="k-dot" style={{ background:'#E87B36' }}/>Almadies</span>
          </div>
        </MapBg>
      </div>

      {/* team filter */}
      <div style={{ padding:'0 22px 8px', display:'flex', gap: 6, overflowX:'auto' }}>
        <Chip variant="solid">Tous · 24</Chip>
        <Chip>Actifs · 12</Chip>
        <Chip>En pause</Chip>
        <Chip>Hors ligne</Chip>
      </div>

      <div style={{ padding:'4px 22px 100px', flex: 1, overflow:'hidden', display:'flex', flexDirection:'column', gap: 8 }}>
        {[
          { n:'Cheikh Ndiaye',  st:4.9, dl:312, suc:99, dot:'live', tag:'Plateau · Sacré-Cœur', plate:'DK-2841-AB', col:'var(--agency-deep)' },
          { n:'Khady Ba',       st:4.8, dl:281, suc:98, dot:'live', tag:'Mermoz · Ouakam',     plate:'DK-1903-CD', col:'var(--agency-deep)' },
          { n:'Modou Diallo',   st:4.7, dl:198, suc:96, dot:'wait', tag:'En pause · 6 min',     plate:'DK-2210-EF', col:'#C28714' },
          { n:'Aïssatou Diop',  st:4.9, dl:412, suc:100,dot:'live', tag:'Almadies',             plate:'DK-3144-GH', col:'var(--agency-deep)' },
          { n:'Babacar Faye',   st:4.5, dl:142, suc:94, dot:'off',  tag:'Hors ligne',           plate:'DK-1187-JK', col:'var(--ink-4)' },
        ].map(p => (
          <div key={p.n} className="k-card" style={{ padding: 12, borderRadius: 14, display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ position:'relative' }}>
              <Avatar name={p.n} size={42}/>
              <span className={`k-dot k-dot-${p.dot}`} style={{ position:'absolute', bottom: 0, right: 0, boxShadow:'0 0 0 2px #fff' }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.n}</div>
              <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 11.5, color:'var(--ink-3)', marginTop: 2 }}>
                <Stars value={p.st} size={10}/> {p.st} · {p.dl} livr. · {p.suc}%
              </div>
              <div style={{ fontSize: 11, color: p.col, fontWeight: 600, marginTop: 3 }}>{p.tag}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize: 10.5, color:'var(--ink-4)', fontFamily:'var(--font-mono)' }}>{p.plate}</div>
              <button style={{ marginTop: 6, width: 28, height: 28, borderRadius: 999, background:'var(--paper-2)', border:0, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                <Icon.more style={{ width: 14, height: 14 }}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      <TabBar role="agency"/>
    </Phone>
  );
}

Object.assign(window, { AgencyDashboard, AgencyProfile, AgencyTeamZones });

// Exports Vite
export { AgencyDashboard, AgencyProfile, AgencyTeamZones };
