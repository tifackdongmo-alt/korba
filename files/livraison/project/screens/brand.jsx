// brand.jsx — design system showcase card (single big artboard)

function BrandSystem() {
  const swatch = (label, val, deep, tint) => (
    <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
      <div style={{ display:'flex', borderRadius: 14, overflow:'hidden', boxShadow: '0 0 0 1px var(--line)' }}>
        <div style={{ flex: 2, height: 88, background: val, color: '#fff', padding: 12, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize: 11, opacity: 0.9 }}>{val}</span>
        </div>
        <div style={{ flex: 1, background: deep }} />
        <div style={{ flex: 1, background: tint }} />
      </div>
    </div>
  );
  return (
    <div style={{
      width: 880, padding: 36,
      background: '#fff', borderRadius: 28,
      fontFamily: 'var(--font-sans)', color: 'var(--ink)',
      boxShadow: '0 0 0 1px var(--line)',
    }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap: 24, paddingBottom: 28, borderBottom: '1px solid var(--line)' }}>
        <div>
          <div className="k-eyebrow" style={{ marginBottom: 14 }}>Direction artistique</div>
          <Logo size={46} />
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight: 600, fontSize: 44, letterSpacing:'-0.035em', margin: '14px 0 6px', lineHeight: 1 }}>
            Marketplace logistique<br/>pour l’Afrique francophone.
          </h1>
          <p style={{ color: 'var(--ink-3)', fontSize: 15, maxWidth: 540, marginTop: 12, lineHeight: 1.45 }}>
            Quatre rôles, une même architecture. Glassmorphism discret, beaucoup d’espace, hiérarchie nette&nbsp;:
            le design doit aider à <strong style={{ color:'var(--ink)' }}>vendre, commander et livrer sans friction</strong>.
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 6, textAlign:'right', fontSize: 13, color:'var(--ink-3)' }}>
          <span>v0.1 · Dakar · Abidjan · Douala</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize: 11 }}>XOF · XAF</span>
        </div>
      </div>

      {/* palette per role */}
      <div style={{ marginTop: 28 }}>
        <div className="k-eyebrow" style={{ marginBottom: 14 }}>Palette par rôle</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16 }}>
          {[
            ['Client · orange épuré', '#E87B36', '#B85412', '#FFEDDC'],
            ['Vendeur · violet', '#6E58F1', '#4632C2', '#ECE9FE'],
            ['Agence · vert premium', '#1F8B5B', '#0F5B3A', '#E0F0E6'],
            ['Livreur · bleu ciel', '#5BA4F0', '#1E6FC6', '#E5F0FB'],
          ].map(([l,v,d,t]) => swatch(l, v, d, t))}
        </div>
      </div>

      {/* typo + components */}
      <div style={{ marginTop: 28, display:'grid', gridTemplateColumns:'1.1fr 1fr', gap: 24 }}>
        <div style={{ borderRadius: 18, padding: 24, background: 'var(--paper)', boxShadow: '0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 14 }}>Typographie · Switzer</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 600, letterSpacing:'-0.04em', lineHeight: 1 }}>Aa</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, letterSpacing:'-0.02em', marginTop: 8 }}>Display · 600 · -2.5%</div>
          <div style={{ fontSize: 15, color:'var(--ink-3)', marginTop: 4 }}>Text · 400/500 · -0.5%</div>
          <div style={{ marginTop: 16, display:'flex', gap: 18, fontSize: 13, color:'var(--ink-3)' }}>
            <span>aA · 200 — 800</span>
            <span style={{ fontVariantNumeric:'tabular-nums' }}>0123456789</span>
            <span>« français »</span>
          </div>
          <div style={{ marginTop: 18, fontSize: 14, color:'var(--ink-2)', lineHeight: 1.55, textWrap:'pretty' }}>
            Néotype humaniste, proche d’ABC Diatype. Style éditorial, lisible sur petit écran. Numérique tabulaire pour montants, distances et délais.
          </div>
        </div>

        <div style={{ borderRadius: 18, padding: 24, background: 'var(--paper)', boxShadow: '0 0 0 1px var(--line)' }}>
          <div className="k-eyebrow" style={{ marginBottom: 14 }}>Composants clés</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 8, marginBottom: 14 }}>
            <button className="k-btn k-btn-primary">Commander · 4 500 FCFA</button>
            <button className="k-btn k-btn-tinted">Annuler</button>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 14 }}>
            <Chip>Tous</Chip>
            <Chip active>À proximité</Chip>
            <Chip>≤ 60 min</Chip>
            <Chip>Moins de 2 000 F</Chip>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 14 }}>
            <span className="k-badge k-badge-verified">✓ Vérifié</span>
            <span className="k-badge k-badge-pro">PRO</span>
            <span className="k-badge k-badge-new">Nouveau</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <Avatar name="Aïssatou Diop" size={42}/>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Aïssatou Diop</div>
              <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: 2 }}>
                <Stars value={4.9} showValue/>
                <span style={{ fontSize: 12, color:'var(--ink-4)' }}>· 312 livraisons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* principles */}
      <div style={{ marginTop: 28, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 16 }}>
        {[
          ['Fonctionnel d’abord', 'Décorer en dernier. Lisible sur petit écran.'],
          ['Statuts toujours visibles', 'Disponible, en route, en attente, livré, litige.'],
          ['Confiance immédiate', 'Note, KYC, garanties, photo du livreur.'],
          ['Verre subtil, jamais excessif', 'Beaucoup d’espace blanc, ombres douces.'],
        ].map(([t,d]) => (
          <div key={t} style={{ padding: 16, borderRadius: 14, background: 'var(--paper)', boxShadow: '0 0 0 1px var(--line)' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{t}</div>
            <div style={{ fontSize: 12.5, color:'var(--ink-3)', marginTop: 4, lineHeight: 1.45 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.BrandSystem = BrandSystem;
