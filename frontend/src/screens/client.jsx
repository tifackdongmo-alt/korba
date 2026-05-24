// client.jsx — Client screens (orange épuré)
// Home, Catalogue, Profil Agence, Détail produit, Checkout, Tracking, Validation+Avis
import { Phone, Icon, Avatar, Stars, TabBar, Chip, Logo, AppBar, MapBg, ProductImg, ROLE, StatusBar } from './components.jsx';

function ClientHome() {
  return (
    <Phone role="client" bg="var(--paper)">
      {/* greeting */}
      <div style={{ padding: '4px 22px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize: 12.5, color:'var(--ink-4)' }}>Livrer à</div>
            <div style={{ display:'flex', alignItems:'center', gap: 6, fontWeight: 600, fontSize: 15, marginTop: 2 }}>
              <Icon.pin style={{ width: 14, height: 14, color:'var(--client)' }}/> Sacré-Cœur 3, Dakar <Icon.arrow style={{ width: 14, height: 14, transform:'rotate(90deg)', color:'var(--ink-3)' }}/>
            </div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            <span style={{ position:'relative', display:'inline-flex', width: 38, height: 38, borderRadius:999, background:'var(--paper-2)', alignItems:'center', justifyContent:'center' }}>
              <Icon.bell style={{ width: 18, height: 18 }}/>
              <span style={{ position:'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius:999, background:'var(--client)', boxShadow:'0 0 0 2px var(--paper-2)' }}/>
            </span>
            <Avatar name="Mariama Sow" size={38}/>
          </div>
        </div>

        {/* search */}
        <div style={{ marginTop: 14, padding:'12px 14px', borderRadius: 16, background:'#fff', boxShadow:'0 0 0 1px var(--line)', display:'flex', alignItems:'center', gap: 10 }}>
          <Icon.search style={{ width: 18, height: 18, color:'var(--ink-3)' }}/>
          <span style={{ fontSize: 14, color:'var(--ink-4)', flex: 1 }}>Chercher une agence, un produit…</span>
          <span style={{ width: 28, height: 28, borderRadius: 8, background:'var(--client)', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
            <Icon.filter style={{ width: 14, height: 14, color:'#fff' }}/>
          </span>
        </div>
      </div>

      {/* active delivery card — glass */}
      <div style={{ padding:'16px 22px 0' }}>
        <div className="k-glass" style={{ padding: 14, borderRadius: 20, display:'flex', alignItems:'center', gap: 12, background: 'linear-gradient(150deg, #FFF1E2, #FFE3CB)', boxShadow: '0 14px 30px -16px rgba(232,123,54,0.45), inset 0 0 0 1px rgba(255,255,255,0.5)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <Icon.moto style={{ width: 24, height: 24, color:'var(--client-deep)' }}/>
            <span className="k-dot k-dot-live" style={{ position:'absolute', top: -2, right: -2 }}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display:'flex', gap: 6, alignItems:'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color:'var(--client-deep)', textTransform:'uppercase', letterSpacing:'0.05em' }}>● En route</span>
              <span style={{ fontSize: 11, color:'var(--ink-3)' }}>· #KB-2840</span>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>Cheikh arrive dans 8 min</div>
            <div style={{ fontSize: 12.5, color:'var(--ink-3)', marginTop: 1 }}>Pharmacie Liberté · 3 articles</div>
          </div>
          <button style={{ border:0, background:'var(--ink)', color:'#fff', padding:'10px 14px', borderRadius:999, fontWeight: 600, fontSize: 13, display:'inline-flex', gap: 4, alignItems:'center' }}>
            Suivre <Icon.arrow style={{ width: 13, height: 13 }}/>
          </button>
        </div>
      </div>

      {/* categories */}
      <div style={{ padding:'18px 0 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px 10px' }}>
          <span className="k-h3">Catégories</span>
          <span style={{ fontSize: 12, color:'var(--ink-4)', fontWeight: 500 }}>Tout voir</span>
        </div>
        <div style={{ display:'flex', gap: 10, padding:'2px 22px 4px', overflowX:'auto' }}>
          {[
            ['Pharmacie','💊','#FFE3CB'],
            ['Restos','🍲','#E1DCFA'],
            ['Marché','🥬','#DCE9D8'],
            ['Cosmétiques','🌸','#FDE2EE'],
            ['Boutiques','🛍️','#D9E9F8'],
          ].map(([n,e,c]) => (
            <div key={n} style={{ flex:'0 0 auto', textAlign:'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: c, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 24 }}>{e}</div>
              <div style={{ fontSize: 11, fontWeight: 500, marginTop: 6 }}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* agencies near you */}
      <div style={{ padding:'20px 22px 100px', flex: 1 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
          <span className="k-h3">Agences à proximité</span>
          <span style={{ fontSize: 12, color:'var(--ink-4)', fontWeight: 500 }}>Trier ↓</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
          {[
            { name:'Pharmacie Liberté 6', tag:'Pharmacie · Dakar Plateau', stars: 4.9, n: 1240, eta:'25–35 min', fee:'500 F', verified: true, c: 0 },
            { name:'Au bon Maquis', tag:'Restaurant · Mermoz', stars: 4.7, n: 832, eta:'30–45 min', fee:'700 F', verified: true, c: 1, badge:'PRO' },
            { name:'Marché Sandaga express', tag:'Marché · Plateau', stars: 4.6, n: 4111, eta:'45–60 min', fee:'1 200 F', c: 2 },
          ].map((a,i) => (
            <div key={i} className="k-card" style={{ padding: 12, display:'flex', gap: 12, alignItems:'center', borderRadius: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: ['#FFEDDC','#E1DCFA','#DCE9D8'][a.c], display:'flex', alignItems:'center', justifyContent:'center', fontSize: 24, flexShrink: 0 }}>
                {['💊','🍲','🥬'][a.c]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                  {a.verified && <span style={{ width: 14, height: 14, borderRadius: 999, background:'var(--agency)', color:'#fff', fontSize: 9, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✓</span>}
                  {a.badge && <span className="k-badge k-badge-pro">{a.badge}</span>}
                </div>
                <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>{a.tag}</div>
                <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 6, fontSize: 11.5, color:'var(--ink-3)' }}>
                  <Stars value={a.stars} showValue size={11}/>
                  <span>· {a.n} avis</span>
                  <span>· <Icon.clock style={{ width: 11, height: 11, verticalAlign:'middle', display:'inline-block' }}/> {a.eta}</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: 11, color:'var(--ink-4)' }}>Livraison</div>
                <div style={{ fontWeight: 600, fontSize: 13, color:'var(--client-deep)' }}>{a.fee}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar role="client"/>
    </Phone>
  );
}

function ClientCatalogue() {
  return (
    <Phone role="client">
      <AppBar title="Marketplace" sub="412 boutiques · Dakar"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
        trailing={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.filter style={{ width:18, height:18 }}/></button>}
      />
      <div style={{ padding:'0 18px 4px', display:'flex', gap: 6, overflowX:'auto' }}>
        <Chip variant="solid">Tout</Chip>
        <Chip>Pharmacie</Chip>
        <Chip>Cosmétiques</Chip>
        <Chip>Boutique</Chip>
        <Chip>Resto</Chip>
      </div>
      <div style={{ padding:'14px 18px 100px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, overflowY:'hidden' }}>
        {[
          { n:'Crème solaire Avène SPF50', p:'8 500 F', a:'Pharmacie Liberté', g:'🧴', t:0 },
          { n:'Riz Délice parfumé 5kg', p:'4 200 F', a:'Marché Sandaga', g:'🍚', t:5 },
          { n:'Thiof frais (1kg)', p:'5 800 F', a:'Poissonnerie Yoff', g:'🐟', t:3 },
          { n:'Karité brut 250g', p:'2 900 F', a:'Maison Faye', t:1, g:'🪨' },
          { n:'Pizza Royale 33cm', p:'7 500 F', a:'Au bon Maquis', t:4, g:'🍕' },
          { n:'Bouquet roses', p:'12 000 F', a:'Fleurs de Saly', t:2, g:'🌹' },
        ].map((it,i) => (
          <div key={i} className="k-card" style={{ padding: 10, borderRadius: 18, display:'flex', flexDirection:'column', gap: 8 }}>
            <ProductImg tone={it.t} glyph={it.g}/>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize: 11, color:'var(--ink-4)' }}>{it.a}</span>
              <Stars value={4.8} size={9}/>
            </div>
            <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2, minHeight: 32 }}>{it.n}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{it.p}</span>
              <button style={{ width: 28, height: 28, borderRadius: 999, background:'var(--client)', border:0, color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                <Icon.plus style={{ width: 14, height: 14 }}/>
              </button>
            </div>
          </div>
        ))}
      </div>
      <TabBar role="client"/>
    </Phone>
  );
}

function ClientAgencyProfile() {
  return (
    <Phone role="client">
      <div style={{ position:'relative', height: 220, overflow:'hidden', margin:'0 14px', borderRadius: 22, background:'linear-gradient(160deg, #FFEDDC, #FFD79E)' }}>
        <svg viewBox="0 0 320 220" width="100%" height="100%">
          <circle cx="280" cy="40" r="60" fill="rgba(255,255,255,0.5)"/>
          <rect x="40" y="120" width="240" height="60" rx="10" fill="#fff" opacity="0.45"/>
          <text x="22" y="170" fontFamily="Switzer" fontSize="44" fontWeight="700" fill="#B85412" letterSpacing="-0.04em">Pharmacie</text>
        </svg>
        <div style={{ position:'absolute', top: 12, left: 12, right: 12, display:'flex', justifyContent:'space-between' }}>
          <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon.back style={{ width:18, height:18 }}/>
          </button>
          <div style={{ display:'flex', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon.heart style={{ width:18, height:18, color:'var(--client-deep)' }}/>
            </button>
            <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon.more style={{ width:18, height:18 }}/>
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 10 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <span className="k-h1" style={{ fontSize: 22 }}>Pharmacie Liberté 6</span>
              <span style={{ width: 18, height: 18, borderRadius: 999, background:'var(--agency)', color:'#fff', fontSize: 11, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✓</span>
            </div>
            <div style={{ fontSize: 12.5, color:'var(--ink-3)', marginTop: 4 }}>Sacré-Cœur · Dakar · ouvert jusqu’à 23h</div>
          </div>
          <span className="k-badge k-badge-pro">PRO</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap: 14, marginTop: 12 }}>
          <div><span style={{ fontWeight: 600, fontSize: 14 }}>4.9</span> <Stars value={4.9} size={11}/></div>
          <span style={{ fontSize: 12, color:'var(--ink-3)' }}>· 1 240 avis</span>
          <span style={{ fontSize: 12, color:'var(--ink-3)' }}>· 98% réussite</span>
        </div>

        {/* trust badges */}
        <div style={{ display:'flex', gap: 8, marginTop: 14, flexWrap:'wrap' }}>
          <span className="k-badge k-badge-verified"><Icon.shield style={{ width:10, height:10 }}/> KYC vérifié</span>
          <span className="k-badge" style={{ background:'#FFEDDC', color:'#B85412' }}>Assurance colis</span>
          <span className="k-badge" style={{ background:'#E5F0FB', color:'#1E6FC6' }}>Paiement à la livraison</span>
        </div>

        {/* tabs */}
        <div style={{ display:'flex', gap: 22, marginTop: 22, borderBottom: '1px solid var(--line)' }}>
          {['Catalogue','Équipe','Avis','Zones'].map((t,i) => (
            <div key={t} style={{ paddingBottom: 10, fontSize: 13.5, fontWeight: i===0 ? 600 : 500, color: i===0 ? 'var(--ink)' : 'var(--ink-3)', position:'relative' }}>
              {t}
              {i===0 && <span style={{ position:'absolute', left: 0, right: 0, bottom: -1, height: 2, background:'var(--client)' }}/>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, paddingBottom: 100 }}>
          {[
            { n:'Doliprane 1000mg', p:'1 800 F', t: 0, g:'💊' },
            { n:'Vitamine C effervescent', p:'2 400 F', t: 1, g:'💊' },
            { n:'Crème Avène SPF50', p:'8 500 F', t: 2, g:'🧴' },
            { n:'Pansements stériles', p:'1 200 F', t: 4, g:'🩹' },
          ].map((p,i) => (
            <div key={i} className="k-card" style={{ padding: 10, borderRadius: 18 }}>
              <ProductImg tone={p.t} glyph={p.g}/>
              <div style={{ fontWeight: 500, fontSize: 13, marginTop: 8, lineHeight: 1.2 }}>{p.n}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{p.p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 22, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', boxShadow:'var(--sh-3), 0 0 0 0.5px rgba(14,17,22,0.06)', display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, color:'var(--ink-4)' }}>Délai · livraison</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>25–35 min · 500 F</div>
        </div>
        <button className="k-btn k-btn-role" style={{ '--role':'var(--client)' }}>Commander · 3 articles</button>
      </div>
    </Phone>
  );
}

function ClientProductDetail() {
  return (
    <Phone role="client">
      <div style={{ position:'relative', margin:'0 14px', borderRadius: 22, background:'linear-gradient(160deg, #FFEDDC, #FCE0C5)', height: 320, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 130 }}>🧴</div>
        <div style={{ position:'absolute', top: 12, left: 12, right: 12, display:'flex', justifyContent:'space-between' }}>
          <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>
          <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.heart style={{ width:18, height:18, color:'var(--client-deep)' }}/></button>
        </div>
        <div style={{ position:'absolute', bottom: 12, left: '50%', transform:'translateX(-50%)', display:'flex', gap: 5 }}>
          {[0,1,2,3].map(i => <span key={i} style={{ width: i===0 ? 18 : 6, height: 6, borderRadius: 999, background: i===0 ? 'var(--ink)' : 'rgba(255,255,255,0.7)' }}/>)}
        </div>
      </div>

      <div style={{ padding:'18px 22px 100px', overflow:'auto', flex: 1 }}>
        <div style={{ fontSize: 11.5, color:'var(--client-deep)', fontWeight: 600, letterSpacing:'0.05em', textTransform:'uppercase' }}>Pharmacie Liberté 6</div>
        <h1 className="k-h1" style={{ fontSize: 22, marginTop: 4 }}>Crème solaire Avène SPF50+ visage 50ml</h1>

        <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 8 }}>
          <Stars value={4.8} size={12} showValue/>
          <span style={{ fontSize: 12, color:'var(--ink-3)' }}>· 213 avis</span>
          <span className="k-badge k-badge-new" style={{ marginLeft:'auto' }}>En stock</span>
        </div>

        <div style={{ display:'flex', alignItems:'baseline', gap: 8, marginTop: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 26, letterSpacing:'-0.02em' }}>8 500 F</span>
          <span style={{ fontSize: 13, color:'var(--ink-4)', textDecoration:'line-through' }}>9 800 F</span>
          <span style={{ fontSize: 11, fontWeight: 600, color:'var(--client-deep)', background:'var(--client-tint)', padding:'2px 8px', borderRadius:6 }}>-13%</span>
        </div>

        <p style={{ fontSize: 14, color:'var(--ink-2)', lineHeight: 1.55, marginTop: 14, textWrap:'pretty' }}>
          Protection minérale très haute, formulée pour les peaux sensibles. Texture légère, finition mate, résistante à l’eau.
        </p>

        <div style={{ marginTop: 18, padding: 14, borderRadius: 18, background: 'var(--paper)', boxShadow:'0 0 0 1px var(--line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <Icon.moto style={{ width: 22, height: 22, color:'var(--client-deep)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Livraison estimée à 18h35</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)' }}>≈ 28 min · Sacré-Cœur 3</div>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>500 F</span>
          </div>
          <div style={{ height: 1, background:'var(--line)', margin:'12px 0' }}/>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <Icon.pkg style={{ width: 22, height: 22, color:'var(--ink-3)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Retrait en boutique</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)' }}>Prêt en 15 min · gratuit</div>
            </div>
            <span style={{ fontSize: 12, color:'var(--ink-3)', fontWeight: 500 }}>Choisir →</span>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 10, borderRadius: 22, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', boxShadow:'var(--sh-3), 0 0 0 0.5px rgba(14,17,22,0.06)', display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 4, padding:'8px 6px', background:'var(--paper-2)', borderRadius: 999 }}>
          <button style={{ width: 26, height: 26, borderRadius: 999, background:'#fff', border:0, fontSize: 14 }}>−</button>
          <span style={{ minWidth: 18, textAlign:'center', fontWeight: 600 }}>1</span>
          <button style={{ width: 26, height: 26, borderRadius: 999, background:'#fff', border:0, fontSize: 14 }}>+</button>
        </div>
        <button className="k-btn k-btn-role" style={{ '--role':'var(--client)', flex: 1 }}>Ajouter — 8 500 F</button>
      </div>
    </Phone>
  );
}

function ClientCheckout() {
  return (
    <Phone role="client">
      <AppBar title="Validation" sub="3 articles · Pharmacie Liberté 6"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
      />

      <div style={{ padding:'0 22px 110px', overflow:'auto', flex: 1 }}>
        {/* Pickup vs delivery */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, padding: 6, background:'var(--paper-2)', borderRadius: 16 }}>
          <div style={{ background:'#fff', padding:'12px 10px', borderRadius: 12, textAlign:'center', boxShadow:'var(--sh-1)' }}>
            <Icon.moto style={{ width: 20, height: 20, color:'var(--client-deep)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>Livraison</div>
            <div style={{ fontSize: 11, color:'var(--ink-3)' }}>25–35 min · 500 F</div>
          </div>
          <div style={{ padding:'12px 10px', textAlign:'center' }}>
            <Icon.pkg style={{ width: 20, height: 20, color:'var(--ink-3)' }}/>
            <div style={{ fontWeight: 500, fontSize: 13, marginTop: 4, color:'var(--ink-3)' }}>Retrait</div>
            <div style={{ fontSize: 11, color:'var(--ink-4)' }}>15 min · gratuit</div>
          </div>
        </div>

        {/* Address */}
        <div style={{ marginTop: 16, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow">Adresse de livraison</div>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background:'var(--client-tint)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon.pin style={{ width: 18, height: 18, color:'var(--client-deep)' }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Maison · Sacré-Cœur 3</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)' }}>Villa 12, en face de la pharmacie</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color:'var(--client-deep)' }}>Modifier</span>
          </div>
        </div>

        {/* Choose a driver — favorite */}
        <div style={{ marginTop: 16 }}>
          <div className="k-eyebrow" style={{ marginBottom: 8 }}>Livreur</div>
          <div className="k-card" style={{ padding: 12, borderRadius: 18, display:'flex', alignItems:'center', gap: 12 }}>
            <Avatar name="Cheikh Ndiaye" size={42} ring={{ color:'var(--driver)', w: 2 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Cheikh Ndiaye</span>
                <Icon.heart style={{ width: 14, height: 14, color:'var(--client)' }}/>
                <span style={{ fontSize: 10.5, color:'var(--ink-4)' }}>Favori</span>
              </div>
              <div style={{ display:'flex', gap: 6, fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>
                <Stars value={4.9} size={10}/> 4.9 · 312 livraisons · 99%
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color:'var(--ink-3)' }}>Changer</span>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ marginTop: 16, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 10 }}>Récapitulatif</div>
          {[
            ['Crème Avène SPF50 ×1', '8 500 F'],
            ['Doliprane 1000mg ×1', '1 800 F'],
            ['Vitamine C ×1', '2 400 F'],
          ].map(([l,p]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize: 13.5, padding:'5px 0' }}>
              <span style={{ color:'var(--ink-2)' }}>{l}</span><span style={{ fontWeight: 500 }}>{p}</span>
            </div>
          ))}
          <div style={{ height: 1, background:'var(--line)', margin:'8px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 13, padding:'3px 0', color:'var(--ink-3)' }}><span>Livraison</span><span>500 F</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 13, padding:'3px 0', color:'var(--ink-3)' }}><span>Service Korba</span><span>200 F</span></div>
          <div style={{ height: 1, background:'var(--line)', margin:'8px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing:'-0.01em' }}>13 400 F</span>
          </div>
        </div>

        {/* payment */}
        <div style={{ marginTop: 16, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)', display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background:'#FF6B00', color:'#fff', fontWeight: 700, fontSize: 11, display:'flex', alignItems:'center', justifyContent:'center' }}>OM</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Orange Money</div>
            <div style={{ fontSize: 12, color:'var(--ink-3)' }}>•••• 89 03</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color:'var(--client-deep)' }}>Changer</span>
        </div>
      </div>

      <div style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 22, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', boxShadow:'var(--sh-3), 0 0 0 0.5px rgba(14,17,22,0.06)', display:'flex', alignItems:'center', gap: 10 }}>
        <button className="k-btn k-btn-role" style={{ '--role':'var(--client)', flex: 1 }}>Confirmer · 13 400 F</button>
      </div>
    </Phone>
  );
}

function ClientTracking() {
  return (
    <Phone role="client" statusInvert={false}>
      <div style={{ position:'relative', height: 420, marginTop: -44, overflow:'hidden' }}>
        <MapBg>
          {/* route polyline */}
          <svg viewBox="0 0 360 420" width="360" height="420" style={{ position:'absolute', inset: 0 }}>
            <defs>
              <linearGradient id="rt" x1="0" x2="1">
                <stop offset="0" stopColor="#E87B36"/>
                <stop offset="1" stopColor="#B85412"/>
              </linearGradient>
            </defs>
            <path d="M 70 320 C 120 260, 160 280, 200 200 S 280 130, 290 80" stroke="rgba(255,255,255,0.9)" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M 70 320 C 120 260, 160 280, 200 200 S 280 130, 290 80" stroke="url(#rt)" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="6 6"/>
            {/* pin dest */}
            <g transform="translate(290, 80)">
              <circle cx="0" cy="0" r="22" fill="rgba(232,123,54,0.18)"/>
              <circle cx="0" cy="0" r="14" fill="#fff" stroke="#E87B36" strokeWidth="3"/>
              <circle cx="0" cy="0" r="6" fill="#E87B36"/>
            </g>
            {/* moto current */}
            <g transform="translate(180, 230)">
              <circle cx="0" cy="0" r="26" fill="rgba(14,17,22,0.06)"/>
              <circle cx="0" cy="0" r="18" fill="#0E1116"/>
              <path d="M -7 -1 L 0 -8 L 7 -1 L 5 6 L -5 6 Z" fill="#E87B36"/>
            </g>
            {/* origin */}
            <g transform="translate(70, 320)">
              <circle cx="0" cy="0" r="9" fill="#fff" stroke="#0E1116" strokeWidth="3"/>
            </g>
          </svg>

          {/* top bar */}
          <div style={{ position:'absolute', top: 44, left: 12, right: 12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button style={{ width: 38, height: 38, borderRadius: 999, background:'rgba(255,255,255,0.95)', border:0, boxShadow:'var(--sh-1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon.back style={{ width: 18, height: 18 }}/>
            </button>
            <div className="k-glass" style={{ padding:'8px 14px', borderRadius: 999, display:'flex', alignItems:'center', gap: 8 }}>
              <span className="k-dot k-dot-live"/>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>En route · arrive dans 8 min</span>
            </div>
            <button style={{ width: 38, height: 38, borderRadius: 999, background:'rgba(255,255,255,0.95)', border:0, boxShadow:'var(--sh-1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon.alert style={{ width: 18, height: 18 }}/>
            </button>
          </div>
        </MapBg>
      </div>

      {/* bottom sheet */}
      <div style={{ marginTop: -22, background:'var(--paper)', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding:'14px 20px 100px', position:'relative', zIndex: 2, boxShadow:'0 -10px 30px -10px rgba(14,17,22,0.1)', flex: 1 }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background:'var(--ink-5)', margin:'0 auto 14px' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color:'var(--ink-4)' }}>Commande #KB-2840</div>
            <div className="k-h2">8 min · 1,4 km</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <Avatar name="Cheikh Ndiaye" size={42}/>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Cheikh N.</div>
              <div style={{ fontSize: 11, color:'var(--ink-3)' }}><Stars value={4.9} size={9}/> 4.9 · DK-2841-AB</div>
            </div>
          </div>
        </div>

        {/* timeline */}
        <div style={{ marginTop: 16, padding:14, borderRadius: 16, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          {[
            ['Commande confirmée', '17:42', true],
            ['Préparation pharmacie', '17:47', true],
            ['Récupérée par Cheikh', '17:55', true],
            ['En route vers vous', '18:05', 'current'],
            ['Livraison', '~ 18:13', false],
          ].map(([l,t,s], i, a) => (
            <div key={l} style={{ display:'flex', alignItems:'flex-start', gap: 12, position:'relative' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: s===true ? 'var(--client)' : s==='current' ? '#fff' : 'var(--paper-2)', boxShadow: s==='current' ? '0 0 0 2px var(--client), 0 0 0 6px var(--client-tint)' : (s===true ? 'none' : '0 0 0 1px var(--ink-5)') }}/>
                {i < a.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 18, background: s===true ? 'var(--client)' : 'var(--paper-2)' }}/>}
              </div>
              <div style={{ flex: 1, paddingBottom: 14 }}>
                <div style={{ fontSize: 13.5, fontWeight: s ? 600 : 500, color: s ? 'var(--ink)' : 'var(--ink-3)' }}>{l}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{t}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap: 10, marginTop: 14 }}>
          <button className="k-btn k-btn-tinted" style={{ flex: 1 }}><Icon.chat style={{ width: 16, height: 16 }}/> Message</button>
          <button className="k-btn k-btn-primary" style={{ flex: 1 }}>📞 Appeler</button>
        </div>
      </div>
    </Phone>
  );
}

function ClientDelivered() {
  return (
    <Phone role="client" bg="linear-gradient(180deg, #FFEDDC, #FAFAF7 60%)">
      <div style={{ padding:'8px 22px 0', display:'flex', justifyContent:'space-between' }}>
        <button style={{ width: 36, height: 36, borderRadius: 999, background:'rgba(255,255,255,0.85)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>
      </div>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', padding:'24px 22px 100px' }}>
        {/* success */}
        <div style={{ textAlign:'center', marginTop: 6 }}>
          <div style={{ width: 88, height: 88, borderRadius: 999, background:'var(--ok)', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 16px 36px -10px rgba(31,139,91,0.4)' }}>
            <Icon.check style={{ width: 40, height: 40, color:'#fff', strokeWidth: 2.4 }}/>
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize: 26, fontWeight: 600, letterSpacing:'-0.02em', marginTop: 18 }}>Livrée avec succès</div>
          <div style={{ fontSize: 13.5, color:'var(--ink-3)', marginTop: 6 }}>Cheikh a déposé votre colis à 18:11</div>
        </div>

        {/* proof */}
        <div style={{ marginTop: 22, padding: 12, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 10 }}>Preuve de livraison</div>
          <div style={{ display:'flex', gap: 10 }}>
            <div style={{ width: 88, height: 88, borderRadius: 12, background:'linear-gradient(135deg, #2B2F36, #5C616B)', position:'relative', overflow:'hidden' }}>
              <Icon.cam style={{ width: 28, height: 28, color:'rgba(255,255,255,0.6)', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}/>
              <span style={{ position:'absolute', bottom: 6, left: 6, fontSize: 9, color:'#fff', background:'rgba(0,0,0,0.4)', padding:'2px 4px', borderRadius: 4 }}>Photo</span>
            </div>
            <div style={{ flex: 1, padding:'6px 4px' }}>
              <div style={{ fontSize: 13, color:'var(--ink-2)', lineHeight: 1.4 }}>Déposé devant la porte. Sonnerie effectuée.</div>
              <div style={{ display:'flex', gap: 8, marginTop: 10 }}>
                <span className="k-badge k-badge-verified"><Icon.shield style={{ width: 10, height: 10 }}/> Code OTP validé</span>
              </div>
            </div>
          </div>
        </div>

        {/* rating */}
        <div style={{ marginTop: 16, padding: 18, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <Avatar name="Cheikh Ndiaye" size={48}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Notez Cheikh</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)' }}>Votre avis aide d’autres clients</div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop: 14 }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} viewBox="0 0 24 24" width="32" height="32" fill={i <= 5 ? '#E8A53C' : 'rgba(0,0,0,0.1)'}>
                <path d="M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.7l1.8-7.3L1.5 9.5l7.5-.6z"/>
              </svg>
            ))}
          </div>
          <div style={{ display:'flex', gap: 6, marginTop: 14, flexWrap:'wrap' }}>
            {['Ponctuel','Aimable','Soigneux','Pro'].map(t => (
              <span key={t} className="k-chip" style={{ background:'var(--paper-2)', borderColor:'transparent' }}>{t}</span>
            ))}
          </div>
          <button style={{ marginTop: 14, width:'100%', padding: 12, border:0, borderRadius: 999, background:'var(--client-tint)', color:'var(--client-deep)', fontWeight: 600, fontSize: 13, display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 6 }}>
            <Icon.heart style={{ width: 14, height: 14 }}/> Ajouter aux favoris
          </button>
        </div>

        <div style={{ flex: 1 }}/>
        <button className="k-btn k-btn-role" style={{ '--role':'var(--client)', marginTop: 20 }}>Envoyer mon avis</button>
      </div>
    </Phone>
  );
}

Object.assign(window, { ClientHome, ClientCatalogue, ClientAgencyProfile, ClientProductDetail, ClientCheckout, ClientTracking, ClientDelivered });

// Exports Vite
export { ClientHome, ClientCatalogue, ClientAgencyProfile, ClientProductDetail, ClientCheckout, ClientTracking, ClientDelivered };
