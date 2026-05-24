// driver.jsx — Livreur (bleu ciel)
// Home missions, Navigation active, Preuve livraison
import { Phone, Icon, Avatar, Stars, TabBar, Chip, Logo, AppBar, MapBg, ProductImg, ROLE, StatusBar } from './components.jsx';

function DriverHome() {
  return (
    <Phone role="driver">
      <div style={{ padding:'4px 22px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <Avatar name="Cheikh Ndiaye" size={40}/>
            <div>
              <div style={{ fontSize: 12, color:'var(--ink-4)' }}>Bonjour</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Cheikh Ndiaye</div>
            </div>
          </div>
          <label style={{ display:'inline-flex', alignItems:'center', gap: 8, padding:'7px 12px', borderRadius: 999, background:'var(--driver-tint)', color:'var(--driver-deep)', fontSize: 12.5, fontWeight: 600 }}>
            <span className="k-dot k-dot-live"/> En ligne
          </label>
        </div>

        {/* today earnings */}
        <div style={{ marginTop: 18, padding: 18, borderRadius: 24, background:'linear-gradient(150deg, #5BA4F0, #1E6FC6)', color:'#fff', position:'relative', overflow:'hidden', boxShadow:'0 18px 40px -16px rgba(91,164,240,0.5)' }}>
          <div style={{ position:'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: 999, background:'rgba(255,255,255,0.08)' }}/>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Gains aujourd’hui</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize: 38, fontWeight: 600, letterSpacing:'-0.03em', marginTop: 4 }}>22 800 <span style={{ fontSize: 15, fontWeight: 500, opacity: 0.85 }}>F</span></div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 14 }}>
            <div><div style={{ opacity:0.85, fontSize: 11 }}>Courses</div><div style={{ fontWeight: 700, fontSize: 17 }}>14</div></div>
            <div><div style={{ opacity:0.85, fontSize: 11 }}>Temps</div><div style={{ fontWeight: 700, fontSize: 17 }}>5h 42</div></div>
            <div><div style={{ opacity:0.85, fontSize: 11 }}>Km</div><div style={{ fontWeight: 700, fontSize: 17 }}>61,4</div></div>
            <div><div style={{ opacity:0.85, fontSize: 11 }}>Note</div><div style={{ fontWeight: 700, fontSize: 17 }}>4.9 ★</div></div>
          </div>
        </div>

        {/* big incoming offer card */}
        <div style={{ marginTop: 16, padding: 16, borderRadius: 22, background:'#fff', boxShadow:'0 16px 36px -16px rgba(14,17,22,0.18), 0 0 0 1px var(--line)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background:'var(--driver)', boxShadow:'0 0 0 3px var(--driver-tint)' }}/>
              <span style={{ fontSize: 11.5, fontWeight: 600, color:'var(--driver-deep)', letterSpacing:'0.05em', textTransform:'uppercase' }}>Nouvelle mission · 12 sec</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing:'-0.01em' }}>1 800 F</div>
          </div>

          <div style={{ display:'flex', alignItems:'stretch', gap: 12, marginTop: 14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 999, background:'var(--ink)' }}/>
              <span style={{ width: 2, flex: 1, background:'var(--ink-5)', margin:'2px 0' }}/>
              <span style={{ width: 12, height: 12, borderRadius: 999, background:'var(--driver)' }}/>
            </div>
            <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color:'var(--ink-4)' }}>Récupération</div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Pharmacie Liberté 6</div>
                <div style={{ fontSize: 11.5, color:'var(--ink-3)' }}>650 m · 3 min</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color:'var(--ink-4)' }}>Livraison</div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Mariama S. · Sacré-Cœur 3</div>
                <div style={{ fontSize: 11.5, color:'var(--ink-3)' }}>1,4 km · 6 min</div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
            <button className="k-btn k-btn-tinted" style={{ flex: 1 }}>Refuser</button>
            <button className="k-btn k-btn-role" style={{ '--role':'var(--driver)', flex: 1.4 }}>Accepter →</button>
          </div>
        </div>

        {/* zone hot */}
        <div style={{ marginTop: 14, display:'flex', alignItems:'center', gap: 8, fontSize: 12, color:'var(--ink-3)' }}>
          <Icon.bolt style={{ width: 14, height: 14, color:'#C28714' }}/>
          <span><strong style={{ color:'var(--ink)' }}>Forte demande</strong> à Plateau · +30% sur les courses</span>
        </div>
      </div>

      {/* recent missions */}
      <div style={{ padding:'18px 22px 110px', flex: 1, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
          <span className="k-h3">Missions récentes</span>
          <span style={{ fontSize: 12, color:'var(--ink-4)' }}>3 dernières</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          {[
            ['Pharmacie Liberté → Sacré-Cœur', '8 min', '1 200 F'],
            ['Au bon Maquis → Mermoz', '14 min', '1 600 F'],
            ['Marché Sandaga → Plateau', '22 min', '2 100 F'],
          ].map(([r, t, p]) => (
            <div key={r} style={{ padding: 12, borderRadius: 14, background:'#fff', boxShadow:'0 0 0 1px var(--line)', display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background:'var(--driver-tint)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon.check style={{ width: 16, height: 16, color:'var(--driver-deep)' }}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r}</div>
                <div style={{ fontSize: 11.5, color:'var(--ink-3)' }}>{t} · livrée</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 13.5 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar role="driver"/>
    </Phone>
  );
}

function DriverNavigation() {
  return (
    <Phone role="driver">
      <div style={{ position:'relative', flex: 1, marginTop: -44, overflow:'hidden' }}>
        <MapBg>
          <svg viewBox="0 0 360 716" width="360" height="716" style={{ position:'absolute', inset: 0 }}>
            {/* route */}
            <path d="M 60 600 C 120 480, 180 500, 200 380 S 280 240, 300 120" stroke="rgba(255,255,255,0.9)" strokeWidth="14" fill="none" strokeLinecap="round"/>
            <path d="M 60 600 C 120 480, 180 500, 200 380 S 280 240, 300 120" stroke="#5BA4F0" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M 60 600 C 120 480, 180 500, 200 380 S 280 240, 300 120" stroke="#1E6FC6" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 8"/>
            {/* pickup pin */}
            <g transform="translate(60, 600)">
              <circle r="22" fill="rgba(14,17,22,0.18)"/>
              <circle r="14" fill="#fff" stroke="#0E1116" strokeWidth="3"/>
              <text y="4" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Switzer">A</text>
            </g>
            {/* destination */}
            <g transform="translate(300, 120)">
              <circle r="22" fill="rgba(91,164,240,0.25)"/>
              <circle r="14" fill="#5BA4F0" stroke="#fff" strokeWidth="3"/>
              <text y="4" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Switzer" fill="#fff">B</text>
            </g>
            {/* current position */}
            <g transform="translate(180, 440)">
              <circle r="28" fill="rgba(91,164,240,0.20)">
                <animate attributeName="r" values="28;36;28" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle r="18" fill="#1E6FC6"/>
              <path d="M -7 4 L 0 -8 L 7 4 L 0 0 Z" fill="#fff"/>
            </g>
          </svg>

          {/* top status pill */}
          <div style={{ position:'absolute', top: 50, left: 12, right: 12, display:'flex', alignItems:'center', gap: 8 }}>
            <button style={{ width: 40, height: 40, borderRadius: 999, background:'rgba(255,255,255,0.95)', border:0, boxShadow:'var(--sh-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon.back style={{ width: 18, height: 18 }}/>
            </button>
            <div className="k-glass" style={{ flex: 1, padding:'10px 14px', borderRadius: 18, display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background:'var(--driver-tint)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1E6FC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color:'var(--ink-4)' }}>Tout droit puis</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Tourner à droite — 240 m</div>
              </div>
            </div>
          </div>

          {/* speed badge */}
          <div style={{ position:'absolute', left: 16, top: 110, padding:'10px 12px', background:'#fff', borderRadius: 16, boxShadow:'var(--sh-2)', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>34</div>
            <div style={{ fontSize: 9.5, color:'var(--ink-4)', fontWeight: 600 }}>km/h</div>
          </div>
        </MapBg>

        {/* bottom action sheet */}
        <div className="k-glass" style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 16, borderRadius: 24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 11, fontWeight: 600, color:'var(--driver-deep)', letterSpacing:'0.05em', textTransform:'uppercase' }}>
                <span className="k-dot k-dot-live"/> Étape 2 sur 3 · vers le client
              </div>
              <div className="k-h2" style={{ marginTop: 4 }}>1,4 km · 6 min</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>Mariama S. · Sacré-Cœur 3, villa 12</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: 6, alignItems:'flex-end' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>1 800 F</span>
              <span style={{ fontSize: 10, color:'var(--ink-4)' }}>arrivée 18:13</span>
            </div>
          </div>

          {/* slider */}
          <div style={{ marginTop: 14, padding: 6, borderRadius: 999, background:'var(--paper-2)', display:'flex', alignItems:'center', gap: 8, position:'relative', overflow:'hidden' }}>
            <span style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: 70, background:'linear-gradient(90deg, var(--driver), var(--driver-deep))', borderRadius: 999 }}/>
            <span style={{ position:'relative', zIndex: 1, width: 46, height: 46, borderRadius: 999, background:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,0.15)', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'var(--driver-deep)' }}>
              <Icon.arrow style={{ width: 20, height: 20 }}/>
            </span>
            <span style={{ flex: 1, textAlign:'center', fontSize: 13, fontWeight: 600, color:'var(--ink-3)', paddingRight: 50 }}>Glisser — je suis arrivé</span>
          </div>

          <div style={{ display:'flex', gap: 10, marginTop: 12 }}>
            <button style={{ flex: 1, padding: 10, borderRadius: 14, background:'#fff', border:0, fontSize: 12.5, fontWeight: 600, display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 6, boxShadow:'0 0 0 1px var(--line)' }}>
              <Icon.chat style={{ width: 14, height: 14 }}/> Message
            </button>
            <button style={{ flex: 1, padding: 10, borderRadius: 14, background:'#fff', border:0, fontSize: 12.5, fontWeight: 600, display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 6, boxShadow:'0 0 0 1px var(--line)' }}>
              📞 Appeler
            </button>
            <button style={{ width: 44, padding: 0, borderRadius: 14, background:'#fff', border:0, display:'inline-flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 1px var(--line)' }}>
              <Icon.alert style={{ width: 16, height: 16, color:'var(--danger)' }}/>
            </button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function DriverProof() {
  return (
    <Phone role="driver">
      <AppBar title="Preuve de livraison" sub="Commande #KB-2840"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
      />
      <div style={{ padding:'0 22px 110px', flex: 1, overflow:'hidden' }}>

        {/* client card */}
        <div style={{ padding: 14, borderRadius: 18, background:'linear-gradient(150deg, #E5F0FB, #C9DFF6)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <Avatar name="Mariama Sow" size={42}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Mariama Sow</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)' }}>Villa 12, Sacré-Cœur 3</div>
            </div>
            <button style={{ width: 38, height: 38, borderRadius: 999, background:'#fff', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              📞
            </button>
          </div>
        </div>

        {/* OTP */}
        <div style={{ marginTop: 14, padding: 18, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow">Code de remise</div>
          <div style={{ fontSize: 13, color:'var(--ink-3)', marginTop: 4, marginBottom: 14 }}>Demandez le code à 4 chiffres au client</div>
          <div style={{ display:'flex', gap: 10, justifyContent:'center' }}>
            {['4','7','2','9'].map((d,i) => (
              <div key={i} style={{ width: 56, height: 68, borderRadius: 14, background:'var(--paper)', border:'1.5px solid var(--driver)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight: 700, fontSize: 30, letterSpacing:'-0.02em', color:'var(--ink)', boxShadow:'inset 0 -2px 0 rgba(0,0,0,0.04)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: 14, justifyContent:'center' }}>
            <Icon.check style={{ width: 14, height: 14, color:'var(--ok)' }}/>
            <span style={{ fontSize: 12.5, color:'var(--ok)', fontWeight: 600 }}>Code validé</span>
          </div>
        </div>

        {/* photo upload */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 10 }}>Photo de remise (optionnelle)</div>
          <div style={{ display:'flex', gap: 10 }}>
            <div style={{ flex: 1, aspectRatio:'1/1', borderRadius: 14, background:'linear-gradient(135deg, #2B2F36, #5C616B)', position:'relative', overflow:'hidden' }}>
              <Icon.cam style={{ width: 32, height: 32, color:'rgba(255,255,255,0.7)', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}/>
              <span style={{ position:'absolute', bottom: 8, left: 8, fontSize: 10, color:'#fff', background:'rgba(0,0,0,0.4)', padding:'2px 6px', borderRadius: 6 }}>Devant la porte</span>
            </div>
            <div style={{ flex: 1, aspectRatio:'1/1', borderRadius: 14, background:'var(--paper-2)', border:'1.5px dashed var(--ink-5)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 6, color:'var(--ink-3)' }}>
              <Icon.plus style={{ width: 20, height: 20 }}/>
              <span style={{ fontSize: 11, fontWeight: 500 }}>Ajouter</span>
            </div>
          </div>
        </div>

        {/* signature note */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 8 }}>Commentaire</div>
          <div style={{ fontSize: 13, color:'var(--ink-3)', minHeight: 32 }}>« Déposé devant la porte. Sonnerie effectuée. »</div>
        </div>
      </div>

      <div style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 22, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', boxShadow:'var(--sh-3), 0 0 0 0.5px rgba(14,17,22,0.06)', display:'flex', alignItems:'center', gap: 10 }}>
        <button className="k-btn k-btn-role" style={{ '--role':'var(--driver)', flex: 1 }}><Icon.check style={{ width: 16, height: 16 }}/> Confirmer la livraison</button>
      </div>
    </Phone>
  );
}

Object.assign(window, { DriverHome, DriverNavigation, DriverProof });

// Exports Vite
export { DriverHome, DriverNavigation, DriverProof };
