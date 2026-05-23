// components.jsx — shared primitives for Korba screens
// Phone frame, status bar, icons, role context, helpers

const ROLE = {
  client:  { id:'client',  name:'Client',  accent:'var(--client)',  deep:'var(--client-deep)',  tint:'var(--client-tint)',  tint2:'var(--client-tint-2)',  glass:'var(--client-glass)' },
  vendor:  { id:'vendor',  name:'Vendeur', accent:'var(--vendor)',  deep:'var(--vendor-deep)',  tint:'var(--vendor-tint)',  tint2:'var(--vendor-tint-2)',  glass:'var(--vendor-glass)' },
  agency:  { id:'agency',  name:'Agence',  accent:'var(--agency)',  deep:'var(--agency-deep)',  tint:'var(--agency-tint)',  tint2:'var(--agency-tint-2)',  glass:'var(--agency-glass)' },
  driver:  { id:'driver',  name:'Livreur', accent:'var(--driver)',  deep:'var(--driver-deep)',  tint:'var(--driver-tint)',  tint2:'var(--driver-tint-2)',  glass:'var(--driver-glass)' },
};

// Phone container — uses a CSS var to expose --role for descendant styling
function Phone({ role = 'client', bg = 'var(--paper)', children, statusDark = false, statusInvert = false, statusBg = 'transparent', noStatus = false, style }) {
  const r = ROLE[role];
  return (
    <div className="k-phone"
         style={{
           '--role': r.accent,
           '--role-deep': r.deep,
           '--role-tint': r.tint,
           '--role-tint-2': r.tint2,
           '--role-glass': r.glass,
           background: bg,
           ...style,
         }}>
      {!noStatus && <StatusBar invert={statusInvert} bg={statusBg} />}
      <div className="k-scroll">{children}</div>
    </div>
  );
}

function StatusBar({ time = '9:41', invert = false, bg = 'transparent' }) {
  const c = invert ? '#fff' : 'var(--ink)';
  return (
    <div className="k-status" style={{ color: c, background: bg }}>
      <span>{time}</span>
      <div className="k-status-r">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}><rect x="0" y="7" width="3" height="4" rx=".5"/><rect x="4.5" y="5" width="3" height="6" rx=".5"/><rect x="9" y="3" width="3" height="8" rx=".5"/><rect x="13.5" y="0" width="3" height="11" rx=".5"/></svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill={c}><path d="M7.5 1.5C4.5 1.5 1.9 2.6 0 4.3l1.4 1.4c1.7-1.4 3.8-2.3 6.1-2.3s4.4.9 6.1 2.3L15 4.3C13.1 2.6 10.5 1.5 7.5 1.5zM7.5 4.6C5.4 4.6 3.5 5.4 2 6.7L3.5 8.1c1-.9 2.4-1.5 4-1.5s3 .6 4 1.5l1.5-1.4c-1.5-1.3-3.4-2.1-5.5-2.1zM7.5 7.6c-1.2 0-2.3.4-3.1 1.1l3.1 3 3.1-3c-.8-.7-1.9-1.1-3.1-1.1z"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke={c} strokeOpacity=".5"/><rect x="23.5" y="4" width="1.5" height="4" rx=".5" fill={c} fillOpacity=".5"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill={c}/></svg>
      </div>
    </div>
  );
}

// Icons — minimal stroke set
const Icon = {
  home:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z"/></svg>,
  search:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  bag:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 8h16l-1.2 11.1a2 2 0 01-2 1.9H7.2a2 2 0 01-2-1.9L4 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>,
  route:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V9a4 4 0 014-4h4a4 4 0 014 4v-.5"/></svg>,
  user:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>,
  bell:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M6 8a6 6 0 0112 0c0 6 2 8 2 8H4s2-2 2-8z"/><path d="M10 21a2 2 0 004 0"/></svg>,
  chat:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.4 8.4 0 01-9.4 8.4L3 21l1.5-5.6A8.4 8.4 0 1121 11.5z"/></svg>,
  pin:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s7-7.6 7-13a7 7 0 10-14 0c0 5.4 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  star:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.7l1.8-7.3L1.5 9.5l7.5-.6z"/></svg>,
  shield:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l8 3v6c0 5-3.5 9.4-8 11-4.5-1.6-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  check:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l4 4 10-10"/></svg>,
  plus:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  arrow:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  back:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>,
  filter:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>,
  more:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>,
  heart:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s-7-4.5-9.5-9.2C.9 8.5 2.5 4.5 6.3 4c2.2-.3 4.3.9 5.7 2.7C13.4 4.9 15.5 3.7 17.7 4c3.8.5 5.4 4.5 3.8 7.8C19 16.5 12 21 12 21z"/></svg>,
  bolt:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L3 14h7l-1 8 11-13h-7z"/></svg>,
  pkg:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>,
  clock:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  car:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 13l2-5a3 3 0 013-2h8a3 3 0 013 2l2 5v5H3v-5z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>,
  moto:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M14 6h3l2 6M5.5 17h6l4-6h-3l-2-2H8"/></svg>,
  qr:      (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3M14 17v4M17 17v4M21 14v7"/></svg>,
  card:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></svg>,
  cog:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1A2 2 0 114.3 17l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8L4.3 7A2 2 0 117 4.3l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1A2 2 0 1119.7 7l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>,
  alert:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.3 3.9L2.3 17a2 2 0 001.7 3h16a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
  cam:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/><circle cx="12" cy="13" r="4"/></svg>,
};

// Avatar with deterministic gradient based on initials
function Avatar({ name = 'A B', size = 36, src, style, ring }) {
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  const palette = [
    ['#FFC9A2', '#E87B36'],
    ['#D6CDF8', '#6E58F1'],
    ['#BFE4D0', '#1F8B5B'],
    ['#C9DFF6', '#5BA4F0'],
    ['#F5D4C7', '#B85412'],
    ['#E8DFD3', '#5C616B'],
    ['#FFD79E', '#C28714'],
  ];
  const hash = [...name].reduce((a,c)=>a+c.charCodeAt(0),0);
  const [c1, c2] = palette[hash % palette.length];
  const bg = src ? undefined : `linear-gradient(135deg, ${c1}, ${c2})`;
  return (
    <span className="k-avatar"
      style={{
        width: size, height: size,
        fontSize: size * 0.36,
        color: '#fff',
        background: bg,
        backgroundImage: src ? `url(${src})` : bg,
        boxShadow: ring ? `0 0 0 2px #fff, 0 0 0 ${2 + (ring.w||1)}px ${ring.color || 'var(--role)'}` : undefined,
        ...style,
      }}>
      {!src && initials}
    </span>
  );
}

// Star rating
function Stars({ value = 4.8, size = 12, showValue = false, color = '#E8A53C' }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap: 4 }}>
      <span className="k-stars" style={{ color }}>
        {[0,1,2,3,4].map(i => (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < full ? 'currentColor' : (i === full && half ? 'url(#half)' : 'rgba(0,0,0,0.12)')}>
            {i === 0 && (
              <defs>
                <linearGradient id="half"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="rgba(0,0,0,0.12)"/></linearGradient>
              </defs>
            )}
            <path d="M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.7l1.8-7.3L1.5 9.5l7.5-.6z"/>
          </svg>
        ))}
      </span>
      {showValue && <span style={{ fontSize: size+1, fontWeight: 600 }}>{value.toFixed(1)}</span>}
    </span>
  );
}

// Tab bar with role-aware accent
function TabBar({ role = 'client', tabs }) {
  const defaults = {
    client: ['Accueil','Commandes','Carte','Compte'],
    vendor: ['Boutique','Commandes','Stats','Compte'],
    agency: ['Pilotage','Équipe','Zones','Compte'],
    driver: ['Missions','Itinéraire','Gains','Compte'],
  }[role];
  const items = tabs || defaults;
  const icons = {
    client: [Icon.home, Icon.bag, Icon.pin, Icon.user],
    vendor: [Icon.bag, Icon.pkg, Icon.bolt, Icon.user],
    agency: [Icon.home, Icon.user, Icon.pin, Icon.cog],
    driver: [Icon.route, Icon.pin, Icon.card, Icon.user],
  }[role];
  return (
    <div className="k-tabbar">
      {items.map((t,i) => {
        const IconC = icons[i];
        const active = i === 0;
        return (
          <div key={i} className="k-tab" data-active={active}>
            {active && <span className="k-tab-pill" />}
            <IconC />
            <span>{t}</span>
          </div>
        );
      })}
    </div>
  );
}

// Section pills for filters
function Chip({ children, active = false, variant = 'default', leading }) {
  const cls = ['k-chip'];
  if (variant === 'tinted' || active) cls.push('k-chip-tinted');
  if (variant === 'solid') cls.push('k-chip-solid');
  return <span className={cls.join(' ')}>{leading}{children}</span>;
}

// Brand logo mark — simple wordmark with dot
function Logo({ size = 22, color = 'var(--ink)' }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'baseline', gap: 1, fontFamily:'var(--font-display)', fontWeight: 700, fontSize: size, letterSpacing: '-0.04em', color }}>
      korba<span style={{ width: size*0.18, height: size*0.18, borderRadius:999, background:'var(--client)', marginLeft: size*0.06, display:'inline-block', alignSelf:'center' }} />
    </span>
  );
}

// App-bar (top of an inner screen)
function AppBar({ title, leading, trailing, sub }) {
  return (
    <div style={{ padding: '4px 18px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10, flex: 1, minWidth: 0 }}>
        {leading}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="k-h2" style={{ fontSize: 18 }}>{title}</div>
          {sub && <div className="k-meta" style={{ marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {trailing}
    </div>
  );
}

// Map pattern — used for any tracking visual
function MapBg({ children, style }) {
  return (
    <div className="k-map-bg" style={{ width:'100%', height:'100%', ...style }}>
      <svg viewBox="0 0 360 480" width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
        {/* faded grid */}
        <defs>
          <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(14,17,22,0.05)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="route" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--role, #5BA4F0)" stopOpacity="0.9"/>
            <stop offset="1" stopColor="var(--role, #5BA4F0)" stopOpacity="0.55"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        {/* big roads */}
        <path d="M -10 80 C 80 60, 160 140, 260 110 S 400 140, 420 90" fill="none" stroke="rgba(14,17,22,0.10)" strokeWidth="14" strokeLinecap="round"/>
        <path d="M -10 80 C 80 60, 160 140, 260 110 S 400 140, 420 90" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round"/>
        {/* river */}
        <path d="M -20 380 C 60 350, 140 420, 240 360 S 400 360, 420 320" fill="none" stroke="#CFE3EC" strokeWidth="36" strokeLinecap="round" opacity="0.7"/>
        {/* small roads */}
        <path d="M 60 -10 L 80 240 L 140 480" fill="none" stroke="rgba(14,17,22,0.08)" strokeWidth="6"/>
        <path d="M 60 -10 L 80 240 L 140 480" fill="none" stroke="#fff" strokeWidth="3.5"/>
        <path d="M 300 -10 L 280 220 L 320 480" fill="none" stroke="rgba(14,17,22,0.08)" strokeWidth="6"/>
        <path d="M 300 -10 L 280 220 L 320 480" fill="none" stroke="#fff" strokeWidth="3.5"/>
        {/* parks */}
        <rect x="160" y="200" width="80" height="60" rx="8" fill="#DCE9D8" opacity="0.85"/>
        <rect x="20" y="290" width="55" height="40" rx="6" fill="#DCE9D8" opacity="0.85"/>
        <rect x="270" y="380" width="70" height="60" rx="8" fill="#DCE9D8" opacity="0.85"/>
        {/* blocks */}
        {[[40,150,30,30],[100,300,30,40],[180,80,28,40],[240,160,28,30],[200,310,30,28],[40,420,28,28]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="rgba(14,17,22,0.05)" />
        ))}
      </svg>
      {children}
    </div>
  );
}

// Product image placeholder — gradient + glyph
function ProductImg({ tone = 1, glyph = '📦', label, style }) {
  const tones = [
    ['#FFE3CC', '#F5C99A'],
    ['#E1DCFA', '#C7BEF7'],
    ['#D8ECDE', '#B5D9C2'],
    ['#D9E9F8', '#B3D2F0'],
    ['#F7E4D9', '#EBC3AE'],
    ['#F0EBE0', '#DACDB4'],
  ];
  const [a,b] = tones[tone % tones.length];
  return (
    <div style={{
      width: '100%', aspectRatio: '1/1',
      borderRadius: 16,
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display:'flex', alignItems:'flex-end', justifyContent:'flex-start',
      padding: 10,
      position: 'relative',
      overflow: 'hidden',
      fontSize: 12,
      color: 'rgba(14,17,22,0.6)',
      ...style,
    }}>
      <svg viewBox="0 0 100 100" width="60%" height="60%" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', opacity: 0.6 }}>
        <circle cx="50" cy="50" r="34" fill="rgba(255,255,255,0.6)"/>
      </svg>
      <span style={{ fontSize: 30, position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}>{glyph}</span>
      {label && <span style={{ position:'relative', zIndex:1, fontWeight: 500 }}>{label}</span>}
    </div>
  );
}

Object.assign(window, { ROLE, Phone, StatusBar, Icon, Avatar, Stars, TabBar, Chip, Logo, AppBar, MapBg, ProductImg });
