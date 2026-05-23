// vendor.jsx — Vendeur (violet/indigo)
// Home, Catalogue boutique, Commande détail

function VendorHome() {
  return (
    <Phone role="vendor">
      <div style={{ padding:'4px 22px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background:'var(--vendor-tint)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 18 }}>🍲</div>
            <div>
              <div style={{ fontSize: 11, color:'var(--ink-4)', letterSpacing:'0.05em', textTransform:'uppercase' }}>Boutique</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Au bon Maquis</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'6px 10px', borderRadius: 999, background:'var(--paper-2)', fontSize: 12, fontWeight: 600 }}>
              <span className="k-dot k-dot-live"/> En ligne
            </span>
          </div>
        </div>

        {/* big stat */}
        <div style={{ marginTop: 18, padding: 18, borderRadius: 22, background: 'linear-gradient(160deg, #6E58F1, #4632C2)', color:'#fff', boxShadow:'0 20px 40px -16px rgba(110,88,241,0.5)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right: -20, top: -20, width: 160, height: 160, borderRadius: 999, background:'rgba(255,255,255,0.08)' }}/>
          <div style={{ position:'absolute', right: 20, bottom: -40, width: 100, height: 100, borderRadius: 999, background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ fontSize: 12.5, opacity: 0.9 }}>Recettes aujourd’hui</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize: 38, fontWeight: 600, letterSpacing:'-0.03em', marginTop: 4 }}>
            186 400<span style={{ fontSize: 16, fontWeight: 500, marginLeft: 6, opacity: 0.85 }}>FCFA</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 6, fontSize: 12.5 }}>
            <span style={{ background:'rgba(255,255,255,0.18)', padding:'2px 8px', borderRadius: 6, fontWeight: 600 }}>↑ 14%</span>
            <span style={{ opacity: 0.85 }}>vs hier</span>
          </div>
          {/* sparkline */}
          <svg viewBox="0 0 280 70" width="100%" height="56" style={{ marginTop: 12 }} preserveAspectRatio="none">
            <path d="M 0 50 Q 30 35, 60 40 T 120 28 T 180 32 T 240 15 T 280 22" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" fill="none"/>
            <path d="M 0 50 Q 30 35, 60 40 T 120 28 T 180 32 T 240 15 T 280 22 L 280 70 L 0 70 Z" fill="rgba(255,255,255,0.12)"/>
          </svg>
        </div>

        {/* mini stats */}
        <div style={{ marginTop: 12, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['Commandes', '47', '↑ 8'],
            ['Panier moy.', '3 970', '↑ 3%'],
            ['Annulées', '2', 'stable'],
          ].map(([l,v,d]) => (
            <div key={l} className="k-card" style={{ padding: 12, borderRadius: 14 }}>
              <div style={{ fontSize: 11, color:'var(--ink-4)' }}>{l}</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2, letterSpacing:'-0.01em' }}>{v}</div>
              <div style={{ fontSize: 10.5, color:'var(--vendor-deep)', fontWeight: 600, marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>

        {/* incoming orders */}
        <div style={{ marginTop: 18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span className="k-h3">Commandes en cours</span>
          <span style={{ fontSize: 12, color:'var(--vendor-deep)', fontWeight: 600 }}>4 nouvelles →</span>
        </div>
      </div>

      <div style={{ padding:'12px 22px 110px', flex: 1, overflow:'hidden' }}>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          {[
            { id:'#KB-2840', name:'Mariama S.', items:'Pizza Royale ×1, Thiéboudienne ×1', total:'12 400 F', status:'À préparer', dot:'wait', accent:'#C28714', live: true },
            { id:'#KB-2839', name:'Ibrahima D.', items:'Yassa poulet ×2', total:'7 400 F', status:'Prête · Cheikh en route', dot:'live', accent:'var(--vendor-deep)' },
            { id:'#KB-2838', name:'Awa F.', items:'Salade César ×1, Jus bissap', total:'4 900 F', status:'Préparation', dot:'wait', accent:'#C28714' },
            { id:'#KB-2837', name:'Pape M.', items:'Burger maison ×1, frites', total:'5 200 F', status:'Livrée', dot:'off', accent:'var(--ink-4)' },
          ].map(o => (
            <div key={o.id} className="k-card" style={{ padding: 12, borderRadius: 16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <Avatar name={o.name} size={32}/>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{o.id} · {o.name}</div>
                    <div style={{ fontSize: 11.5, color:'var(--ink-3)', maxWidth: 200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{o.total}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 10, paddingTop: 10, borderTop:'1px solid var(--line)' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 12, fontWeight: 600, color: o.accent }}>
                  <span className={`k-dot k-dot-${o.dot}`}/>{o.status}
                </div>
                {o.live && (
                  <button style={{ border:0, background:'var(--vendor)', color:'#fff', padding:'7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Marquer prête</button>
                )}
                {!o.live && o.dot !== 'off' && (
                  <span style={{ fontSize: 12, color:'var(--ink-3)', fontWeight: 500 }}>Voir →</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar role="vendor"/>
    </Phone>
  );
}

function VendorCatalogue() {
  return (
    <Phone role="vendor">
      <AppBar title="Mon catalogue" sub="84 produits · 6 hors stock"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
        trailing={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--vendor)', border:0, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.plus style={{ width:18, height:18 }}/></button>}
      />

      {/* search */}
      <div style={{ padding:'0 22px' }}>
        <div style={{ padding:'10px 14px', borderRadius: 14, background:'#fff', boxShadow:'0 0 0 1px var(--line)', display:'flex', alignItems:'center', gap: 10 }}>
          <Icon.search style={{ width: 16, height: 16, color:'var(--ink-3)' }}/>
          <span style={{ fontSize: 13, color:'var(--ink-4)', flex: 1 }}>Chercher un produit</span>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display:'flex', gap: 6, padding:'14px 22px 8px', overflowX:'auto' }}>
        <Chip variant="solid">Tous · 84</Chip>
        <Chip>Plats · 32</Chip>
        <Chip>Boissons · 18</Chip>
        <Chip>Desserts · 9</Chip>
        <Chip>Hors stock · 6</Chip>
      </div>

      <div style={{ padding:'4px 22px 100px', flex: 1, overflow:'hidden', display:'flex', flexDirection:'column', gap: 8 }}>
        {[
          { n:'Thiéboudienne (rouge ou blanc)', p:'4 500 F', s:'En stock · 12', g:'🍛', t:5, on:true },
          { n:'Yassa poulet', p:'3 700 F', s:'En stock · 8', g:'🍗', t:0, on:true, hot:true },
          { n:'Pizza Royale 33cm', p:'7 500 F', s:'En stock · 6', g:'🍕', t:1, on:true },
          { n:'Salade César', p:'2 900 F', s:'Hors stock', g:'🥗', t:2, on:false },
          { n:'Jus bissap maison', p:'1 200 F', s:'En stock · 24', g:'🍷', t:3, on:true },
        ].map((p,i) => (
          <div key={i} className="k-card" style={{ padding: 10, borderRadius: 14, display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, flexShrink: 0 }}>
              <ProductImg tone={p.t} glyph={p.g}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.n}</span>
                {p.hot && <span className="k-badge" style={{ background:'var(--client-tint)', color:'var(--client-deep)' }}>🔥 Top</span>}
              </div>
              <div style={{ fontSize: 12, color: p.on ? 'var(--ink-3)' : 'var(--danger)', marginTop: 2 }}>{p.s}</div>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 3 }}>{p.p}</div>
            </div>
            <label style={{ display:'inline-flex', alignItems:'center', gap: 6 }}>
              <span style={{ width: 36, height: 22, borderRadius: 999, background: p.on ? 'var(--vendor)' : 'var(--ink-5)', position:'relative', transition:'background .15s' }}>
                <span style={{ position:'absolute', top: 2, left: p.on ? 16 : 2, width: 18, height: 18, borderRadius:999, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
              </span>
            </label>
          </div>
        ))}
      </div>

      <TabBar role="vendor"/>
    </Phone>
  );
}

function VendorOrderDetail() {
  return (
    <Phone role="vendor">
      <AppBar title="Commande #KB-2840" sub="Mariama Sow · 17:42"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
        trailing={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.more style={{ width:18, height:18 }}/></button>}
      />
      <div style={{ padding:'0 22px 110px', flex: 1, overflow:'hidden' }}>

        {/* status hero */}
        <div style={{ padding: 16, borderRadius: 18, background:'linear-gradient(140deg, #ECE9FE, #DBD6FC)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color:'var(--vendor-deep)', fontWeight: 600, letterSpacing:'0.06em', textTransform:'uppercase' }}>● En préparation</div>
              <div className="k-h2" style={{ marginTop: 4 }}>3 articles · 12 400 F</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4 }}>Préparer avant 18:00 (12 min)</div>
            </div>
            <div style={{ width: 64, height: 64, borderRadius: 16, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize: 26, fontWeight: 600, color:'var(--vendor-deep)', letterSpacing:'-0.02em' }}>12</div>
            </div>
          </div>
          {/* progress */}
          <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: 16 }}>
            {['Reçue','Préparation','Prête','Livreur','Livrée'].map((l,i) => (
              <div key={l} style={{ flex: 1, display:'flex', flexDirection:'column', gap: 4, alignItems:'center' }}>
                <span style={{ width:'100%', height: 4, borderRadius: 4, background: i <= 1 ? 'var(--vendor)' : 'rgba(0,0,0,0.12)' }}/>
                <span style={{ fontSize: 9.5, color: i <= 1 ? 'var(--vendor-deep)' : 'var(--ink-4)', fontWeight: 600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* items */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 10 }}>Articles à préparer</div>
          {[
            ['🍕','Pizza Royale 33cm','×1','7 500 F'],
            ['🍛','Thiéboudienne rouge','×1','4 500 F'],
            ['🍷','Jus bissap','×1','400 F'],
          ].map(([e,n,q,p]) => (
            <div key={n} style={{ display:'flex', alignItems:'center', gap: 12, padding:'8px 0', borderBottom:'1px dashed var(--line)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background:'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 18 }}>{e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>{n}</div>
                <div style={{ fontSize: 12, color:'var(--ink-4)' }}>{q}</div>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{p}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: 10, borderRadius: 12, background:'var(--paper-2)', fontSize: 12.5 }}>
            <span style={{ fontWeight: 600 }}>Note client :</span> <span style={{ color:'var(--ink-2)' }}>Pizza bien cuite, peu de piment svp. Merci 🙏</span>
          </div>
        </div>

        {/* driver assigned */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)', display:'flex', alignItems:'center', gap: 12 }}>
          <Avatar name="Cheikh Ndiaye" size={42} ring={{ color:'var(--driver)', w: 2 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color:'var(--ink-4)', fontWeight: 500 }}>LIVREUR ASSIGNÉ</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Cheikh N. · DK-2841-AB</div>
            <div style={{ fontSize: 12, color:'var(--ink-3)' }}>Arrivée estimée à 17:58</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.chat style={{ width:16, height:16 }}/></button>
        </div>
      </div>

      <div style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 22, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', boxShadow:'var(--sh-3), 0 0 0 0.5px rgba(14,17,22,0.06)', display:'flex', alignItems:'center', gap: 10 }}>
        <button className="k-btn k-btn-tinted" style={{ flex: 0 }}>Imprimer</button>
        <button className="k-btn k-btn-role" style={{ '--role':'var(--vendor)', flex: 1 }}>Marquer prête</button>
      </div>
    </Phone>
  );
}

Object.assign(window, { VendorHome, VendorCatalogue, VendorOrderDetail });

// Exports Vite
export { VendorHome, VendorCatalogue, VendorOrderDetail };
