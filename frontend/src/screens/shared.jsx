// shared.jsx — Notifications, Settings/Profil, Litige & support
import { Phone, Icon, Avatar, Stars, TabBar, Chip, Logo, AppBar, MapBg, ProductImg, ROLE, StatusBar } from './components.jsx';

function NotificationsScreen() {
  return (
    <Phone role="client">
      <AppBar title="Notifications" sub="3 non lues"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
        trailing={<span style={{ fontSize: 12.5, color:'var(--ink-3)', fontWeight: 500 }}>Tout lire</span>}
      />

      <div style={{ padding:'0 22px 100px', flex: 1, overflow:'hidden' }}>
        <div style={{ display:'flex', gap: 6, marginBottom: 12, overflowX:'auto' }}>
          <Chip variant="solid">Tout · 12</Chip>
          <Chip>Commandes</Chip>
          <Chip>Promo</Chip>
          <Chip>Système</Chip>
        </div>

        <div className="k-eyebrow" style={{ marginBottom: 8 }}>Aujourd’hui</div>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          {[
            { t:'Cheikh arrive dans 8 min', s:'Commande #KB-2840 · Pharmacie Liberté', ago:'À l’instant', i: 'moto', c:'var(--client)', new: true },
            { t:'Votre code de remise est 4729', s:'Donnez-le au livreur à la porte', ago:'2 min', i: 'shield', c:'var(--driver)', new: true },
            { t:'Promo Marché Sandaga · -15%', s:'Sur les produits frais jusqu’à 21h', ago:'1 h', i: 'bolt', c:'var(--client-deep)', new: true },
          ].map((n,i) => (
            <div key={i} className="k-card" style={{ padding: 12, borderRadius: 16, display:'flex', alignItems:'flex-start', gap: 12, position:'relative' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: `color-mix(in oklab, ${n.c} 12%, transparent)`, color: n.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {n.i==='moto' && <Icon.moto style={{ width:18, height:18 }}/>}
                {n.i==='shield' && <Icon.shield style={{ width:18, height:18 }}/>}
                {n.i==='bolt' && <Icon.bolt style={{ width:18, height:18 }}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{n.t}</div>
                <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>{n.s}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: 11, color:'var(--ink-4)' }}>{n.ago}</div>
                {n.new && <span style={{ display:'inline-block', marginTop: 6, width: 8, height: 8, borderRadius: 999, background:'var(--client)' }}/>}
              </div>
            </div>
          ))}
        </div>

        <div className="k-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>Hier</div>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          {[
            { t:'Livraison réussie · 4 étoiles reçues', s:'Commande #KB-2820 · Au bon Maquis', ago:'Hier 19:42', i: 'star', c:'#C28714' },
            { t:'Khady B. a été ajouté à vos favoris', s:'Vous recevrez ses propositions en priorité', ago:'Hier 14:11', i: 'shield', c:'var(--driver-deep)' },
            { t:'Mise à jour de la politique de litige', s:'Délai porté à 48h pour signaler', ago:'Hier 09:00', i: 'shield', c:'var(--ink-3)' },
          ].map((n,i) => (
            <div key={i} style={{ padding: 12, borderRadius: 14, display:'flex', alignItems:'flex-start', gap: 12, background:'transparent', opacity: 0.85 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--paper-2)', color: n.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {n.i==='star' && <Icon.star style={{ width:18, height:18 }}/>}
                {n.i==='shield' && <Icon.shield style={{ width:18, height:18 }}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{n.t}</div>
                <div style={{ fontSize: 11.5, color:'var(--ink-4)', marginTop: 2 }}>{n.s}</div>
              </div>
              <div style={{ fontSize: 11, color:'var(--ink-4)' }}>{n.ago}</div>
            </div>
          ))}
        </div>
      </div>
      <TabBar role="client"/>
    </Phone>
  );
}

function ProfileScreen() {
  return (
    <Phone role="client">
      <div style={{ padding:'4px 22px 0' }}>
        <div className="k-h2">Mon compte</div>
      </div>
      <div style={{ padding:'14px 22px 110px', flex: 1, overflow:'hidden' }}>
        {/* hero card */}
        <div style={{ padding: 18, borderRadius: 22, background:'linear-gradient(160deg, #FFEDDC, #FFD79E)', display:'flex', alignItems:'center', gap: 14 }}>
          <Avatar name="Mariama Sow" size={64} ring={{ color:'#fff', w: 2 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em' }}>Mariama Sow</div>
            <div style={{ fontSize: 12, color:'var(--ink-3)' }}>+221 77 412 89 03</div>
            <div style={{ display:'flex', gap: 6, marginTop: 6 }}>
              <span className="k-badge k-badge-verified">✓ Vérifiée</span>
              <span className="k-badge" style={{ background:'#fff', color:'var(--client-deep)' }}>★ Korba Plus</span>
            </div>
          </div>
        </div>

        {/* fav drivers */}
        <div className="k-card" style={{ marginTop: 14, padding: 14, borderRadius: 18 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span className="k-h3">Mes livreurs favoris</span>
            <span style={{ fontSize: 12, color:'var(--ink-3)' }}>3</span>
          </div>
          <div style={{ display:'flex', gap: 12, marginTop: 12, overflowX:'auto' }}>
            {[
              ['Cheikh N.', 4.9, 'var(--driver)'],
              ['Khady B.', 4.8, 'var(--driver)'],
              ['Aïssatou D.', 4.9, 'var(--agency)'],
              ['+'],
            ].map((p,i) => (
              i < 3 ? (
                <div key={i} style={{ textAlign:'center', flex:'0 0 auto' }}>
                  <Avatar name={p[0]} size={52} ring={{ color: p[2], w: 2 }}/>
                  <div style={{ fontSize: 11, fontWeight: 500, marginTop: 6 }}>{p[0]}</div>
                  <div style={{ fontSize: 10, color:'var(--ink-4)' }}>{p[1]} ★</div>
                </div>
              ) : (
                <div key={i} style={{ textAlign:'center', flex:'0 0 auto' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 999, background:'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon.plus style={{ width: 20, height: 20, color:'var(--ink-3)' }}/>
                  </div>
                  <div style={{ fontSize: 11, marginTop: 6, color:'var(--ink-4)' }}>Ajouter</div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* menu list */}
        <div style={{ marginTop: 14, background:'#fff', borderRadius: 18, boxShadow:'0 0 0 1px var(--line)', overflow:'hidden' }}>
          {[
            { i: <Icon.pkg style={{ width:18, height:18 }}/>,    t:'Mes commandes', s:'18 livrées · 1 en cours', a:'→' },
            { i: <Icon.pin style={{ width:18, height:18 }}/>,    t:'Adresses', s:'3 enregistrées', a:'→' },
            { i: <Icon.card style={{ width:18, height:18 }}/>,   t:'Paiement', s:'Orange Money •• 89 03', a:'→' },
            { i: <Icon.shield style={{ width:18, height:18 }}/>, t:'Sécurité', s:'Empreinte · code OTP', a:'→' },
            { i: <Icon.bell style={{ width:18, height:18 }}/>,   t:'Notifications', s:'Personnalisées', a:<span style={{ display:'inline-flex', width: 32, height: 20, borderRadius: 999, background:'var(--client)', position:'relative' }}><span style={{ position:'absolute', top: 2, left: 14, width: 16, height: 16, borderRadius: 999, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,0.2)' }}/></span> },
            { i: <Icon.cog style={{ width:18, height:18 }}/>,    t:'Préférences', s:'Langue, devise, thème', a:'→' },
          ].map((m,i,a) => (
            <div key={m.t} style={{ display:'flex', alignItems:'center', gap: 12, padding:'14px 16px', borderBottom: i < a.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background:'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-2)' }}>{m.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.t}</div>
                <div style={{ fontSize: 11.5, color:'var(--ink-4)' }}>{m.s}</div>
              </div>
              <div style={{ fontSize: 13, color:'var(--ink-4)' }}>{m.a}</div>
            </div>
          ))}
        </div>

        <button style={{ marginTop: 14, width:'100%', padding: 14, borderRadius: 999, background:'transparent', border:0, color:'var(--danger)', fontWeight: 600, fontSize: 14 }}>Se déconnecter</button>
        <div style={{ textAlign:'center', fontSize: 11, color:'var(--ink-4)', marginTop: 8 }}>Korba v0.1 · build 2026.05</div>
      </div>
      <TabBar role="client"/>
    </Phone>
  );
}

function DisputeScreen() {
  return (
    <Phone role="client">
      <AppBar title="Litige · #KB-2812" sub="Au bon Maquis · 17 mai"
        leading={<button style={{ width: 36, height: 36, borderRadius: 999, background:'var(--paper-2)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.back style={{ width:18, height:18 }}/></button>}
      />
      <div style={{ padding:'0 22px 110px', flex: 1, overflow:'hidden' }}>

        {/* status */}
        <div style={{ padding: 14, borderRadius: 18, background:'linear-gradient(150deg, #FFE9E5, #FBD1C8)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background:'var(--danger)' }}/>
            <span style={{ fontSize: 11, fontWeight: 600, color:'#7E2018', textTransform:'uppercase', letterSpacing:'0.05em' }}>Litige ouvert · examen sous 24h</span>
          </div>
          <div className="k-h2" style={{ marginTop: 8, color:'#7E2018' }}>Article manquant à la livraison</div>
          <div style={{ fontSize: 13, color:'#7E2018', opacity: 0.85, marginTop: 6, lineHeight: 1.45 }}>
            Notre équipe vous contactera. Vous serez remboursé si la responsabilité de l’agence ou du livreur est avérée.
          </div>
        </div>

        {/* reason */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 10 }}>Motif sélectionné</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
            {[
              ['Article manquant', true],
              ['Article endommagé', false],
              ['Mauvais article', false],
              ['Retard important', false],
            ].map(([l,a]) => (
              <div key={l} style={{ padding: 10, borderRadius: 12, background: a ? 'var(--client-tint)' : 'var(--paper-2)', border: a ? '1.5px solid var(--client)' : '1.5px solid transparent', display:'flex', alignItems:'center', gap: 6 }}>
                <span style={{ width: 14, height: 14, borderRadius: 999, background: a ? 'var(--client)' : '#fff', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                  {a && <Icon.check style={{ width: 10, height: 10, color:'#fff', strokeWidth: 3 }}/>}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--client-deep)' : 'var(--ink-2)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* attachments */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 10 }}>Pièces jointes (2)</div>
          <div style={{ display:'flex', gap: 8 }}>
            <div style={{ width: 72, height: 72, borderRadius: 12, background:'linear-gradient(135deg, #FFEDDC, #FFD79E)', position:'relative', overflow:'hidden' }}>
              <Icon.cam style={{ width: 24, height: 24, color:'rgba(14,17,22,0.4)', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}/>
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 12, background:'linear-gradient(135deg, #E1DCFA, #C7BEF7)', position:'relative', overflow:'hidden' }}>
              <Icon.cam style={{ width: 24, height: 24, color:'rgba(14,17,22,0.4)', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}/>
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 12, background:'var(--paper-2)', border:'1.5px dashed var(--ink-5)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-3)' }}>
              <Icon.plus style={{ width: 18, height: 18 }}/>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background:'var(--paper-2)', fontSize: 12.5, color:'var(--ink-2)' }}>
            « Le jus bissap n’était pas dans le sac. Vérifié à la réception, signalé immédiatement. »
          </div>
        </div>

        {/* chat */}
        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background:'#fff', boxShadow:'0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 10 }}>Conversation</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            <div style={{ display:'flex', alignItems:'flex-end', gap: 8 }}>
              <Avatar name="Korba Support" size={28}/>
              <div style={{ background:'var(--paper-2)', padding:'8px 12px', borderRadius:'14px 14px 14px 4px', fontSize: 13, maxWidth: 220 }}>
                Bonjour Mariama, nous avons bien reçu votre signalement. Pouvez-vous confirmer l’article manquant ?
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap: 8, justifyContent:'flex-end' }}>
              <div style={{ background:'var(--client)', color:'#fff', padding:'8px 12px', borderRadius:'14px 14px 4px 14px', fontSize: 13, maxWidth: 220 }}>
                Bonjour, oui c’est le jus bissap (1 200 F).
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', left: 12, right: 12, bottom: 12, padding: 8, borderRadius: 22, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', boxShadow:'var(--sh-3), 0 0 0 0.5px rgba(14,17,22,0.06)', display:'flex', alignItems:'center', gap: 8 }}>
        <div style={{ flex: 1, display:'flex', alignItems:'center', gap: 8, padding:'10px 14px', background:'var(--paper)', borderRadius: 999, fontSize: 13, color:'var(--ink-4)' }}>
          Écrire un message…
        </div>
        <button style={{ width: 42, height: 42, borderRadius: 999, background:'var(--client)', color:'#fff', border:0, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          <Icon.arrow style={{ width: 18, height: 18 }}/>
        </button>
      </div>
    </Phone>
  );
}

Object.assign(window, { NotificationsScreen, ProfileScreen, DisputeScreen });

// Exports Vite
export { NotificationsScreen, ProfileScreen, DisputeScreen };
