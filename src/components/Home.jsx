import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import Icon from "./Icon";
import KaabaWatermark from "./KaabaWatermark";

// ─── DESIGN TOKENS (mdesign v2) ─────────────────────────────────────
const W = {
  card:       "#FFFFFF",
  cardHov:    "#FDFCF9",
  border:     "#E0D5C0",
  shadow:     "0 2px 12px rgba(26,25,21,0.07)",
  shadowHov:  "0 4px 20px rgba(26,25,21,0.12)",
  text:       "#1A1915",
  muted:      "#9A8E7A",
  mutedDark:  "#6B6050",
  gold:       "#B89D60",
  goldDark:   "#8A7235",
  goldBg:     "#FAF5E8",
  goldBorder: "rgba(184,157,96,0.30)",
};
const SR = "'Playfair Display', Georgia, serif";
const SA = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// ─── HIJRI ──────────────────────────────────────────────────────────
const HM_SQ = ["Muharrem","Safer","Rabi'ul-Evvel","Rabi'ul-Ahir","Xhumadel-Ula","Xhumadel-Uhra","Rexheb","Sha'ban","Ramazan","Sheval","Dhul-Ka'de","Dhul-Hixhxhe"];
const HM_EN = ["Muharram","Safar","Rabi' al-Awwal","Rabi' al-Thani","Jumada al-Ula","Jumada al-Akhirah","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];
function toHijri(y, m, d) {
  const JD = Math.floor((1461*(y+4800+Math.floor((m-14)/12)))/4)
    + Math.floor((367*(m-2-12*Math.floor((m-14)/12)))/12)
    - Math.floor((3*(Math.floor((y+4900+Math.floor((m-14)/12))/100)))/4)+d-32075;
  const l=JD-1948440+10632, n=Math.floor((l-1)/10631), l2=l-10631*n+354;
  const j=Math.floor((10985-l2)/5316)*Math.floor((50*l2)/17719)+Math.floor(l2/5670)*Math.floor((43*l2)/15238);
  const l3=l2-Math.floor((30-j)/15)*Math.floor((17719*j)/50)-Math.floor(j/16)*Math.floor((15238*j)/43)+29;
  return { year:30*n+j-30, month:Math.floor((24*l3)/709), day:l3-Math.floor((709*Math.floor((24*l3)/709))/24) };
}

// ─── LOCALE STRINGS ─────────────────────────────────────────────────
const DAY_SQ = ["E diel","E hënë","E martë","E mërkurë","E enjte","E premte","E shtunë"];
const DAY_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MON_SQ = ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor"];
const MON_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PR_SQ  = { Imsak:"Imsaku", Fajr:"Sabahu", Dhuhr:"Dreka", Asr:"Ikindia", Maghrib:"Akshami", Isha:"Jacia" };
const PR_EN  = { Imsak:"Imsak", Fajr:"Fajr",  Dhuhr:"Dhuhr", Asr:"Asr",    Maghrib:"Maghrib", Isha:"Isha"  };

// Icon and KaabaWatermark are imported from shared components above

// ─── CARD ────────────────────────────────────────────────────────────
function Card({ children, style = {}, onClick, className = "" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? W.cardHov : W.card,
        border: `1px solid ${hov ? W.goldBorder : W.border}`,
        borderRadius: 14,
        boxShadow: hov ? W.shadowHov : W.shadow,
        transition: "background 0.18s, box-shadow 0.18s, transform 0.18s, border-color 0.18s",
        transform: hov && onClick ? "translateY(-2px)" : "none",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── ICON BADGE ─────────────────────────────────────────────────────
function IconBadge({ name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 9,
      background: W.goldBg,
      border: `1px solid ${W.goldBorder}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon name={name} size={size * 0.50} color={W.goldDark} sw={1.5}/>
    </div>
  );
}

// ─── PRAYER ROW PILL ────────────────────────────────────────────────
function PrayerPill({ label, time, active }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 3, padding: "8px 10px", borderRadius: 10, minWidth: 54,
      background: active ? "#2D5018" : "#F7F4EE",
      border: `1px solid ${active ? "#1A3010" : W.border}`,
      transition: "background 0.15s",
    }}>
      <span style={{ fontSize: 10, color: active ? "rgba(255,255,255,0.75)" : W.muted, fontFamily: SA, fontWeight: active ? 700 : 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: active ? "#FFFFFF" : W.mutedDark, fontFamily: SA, fontWeight: active ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>
        {time}
      </span>
    </div>
  );
}

// ─── FEATURE TILE ───────────────────────────────────────────────────
function FeatureTile({ icon, label, sub, onClick }) {
  return (
    <Card onClick={onClick} style={{ padding: "16px 14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <IconBadge name={icon} size={36}/>
          <div style={{ fontSize: 13, fontWeight: 600, color: W.text, fontFamily: SA }}>{label}</div>
        </div>
        {sub && <div style={{ fontSize: 12, color: W.muted, fontFamily: SA, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </Card>
  );
}

// ─── TOOL TILE ──────────────────────────────────────────────────────
function ToolTile({ icon, label, onClick }) {
  return (
    <Card onClick={onClick} style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge name={icon} size={30}/>
        <span style={{ fontSize: 12, fontWeight: 600, color: W.text, fontFamily: SA }}>{label}</span>
      </div>
    </Card>
  );
}

// ─── MAIN HOME COMPONENT ────────────────────────────────────────────
export default function Home({ quote, verseQuote, setPage, savedLocation, onSaveLocation, showInstall, onInstall, onDismissInstall }) {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");

  const [timings, setTimings] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [now, setNow] = useState(new Date());

  // ── Inline location search ─────────────────────────────────────
  const [showLocSearch, setShowLocSearch] = useState(false);
  const [locQuery, setLocQuery] = useState("");
  const [locSuggs, setLocSuggs] = useState([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locGpsLoading, setLocGpsLoading] = useState(false);
  const locDebounce = useRef(null);
  const locInputRef = useRef(null);

  // Photon geocoding helper (replaces Nominatim — no rate limits)
  function photonToLoc(f) {
    const p = f.properties;
    const parts = [p.name || p.city || p.town || p.village, p.state !== p.country ? p.state : null, p.country].filter(Boolean);
    return { name: parts.slice(0,2).join(", "), lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], country: (p.countrycode || "").toUpperCase() };
  }

  useEffect(() => {
    if (locQuery.length < 2) { setLocSuggs([]); return; }
    clearTimeout(locDebounce.current);
    locDebounce.current = setTimeout(async () => {
      setLocLoading(true);
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(locQuery)}&limit=8&lang=en`);
        const json = await res.json();
        setLocSuggs((json.features || []).map(photonToLoc).slice(0, 6));
      } catch { setLocSuggs([]); }
      setLocLoading(false);
    }, 300);
  }, [locQuery]);

  function pickLocation(loc) {
    onSaveLocation && onSaveLocation(loc);
    setShowLocSearch(false);
    setLocQuery("");
    setLocSuggs([]);
  }

  async function locGPS() {
    if (!navigator.geolocation) return;
    setLocGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}&limit=1`);
          const json = await res.json();
          const loc = json.features?.[0] ? photonToLoc(json.features[0]) : { name: "My Location", lat: coords.latitude, lon: coords.longitude, country: "" };
          loc.lat = coords.latitude; loc.lon = coords.longitude;
          pickLocation(loc);
        } catch { pickLocation({ name: "My Location", lat: coords.latitude, lon: coords.longitude, country: "" }); }
        setLocGpsLoading(false);
      },
      () => setLocGpsLoading(false),
      { timeout: 10000 }
    );
  }

  // ── PWA install nudge ──────────────────────────────────────────
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || !!navigator.standalone;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isMobile = window.innerWidth < 768;
  const [installDismissed, setInstallDismissed] = useState(() => !!localStorage.getItem("mp-install-dismissed"));

  function dismissInstallNudge() {
    setInstallDismissed(true);
    localStorage.setItem("mp-install-dismissed", "1");
  }

  // Fetch prayer timings using saved method/school preferences
  const prayerMethod = parseInt(localStorage.getItem("mp-prayer-method") || "1");
  const prayerSchool = parseInt(localStorage.getItem("mp-prayer-school") || "1");

  useEffect(() => {
    if (!savedLocation) return;
    const d = new Date();
    const dateStr = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${savedLocation.lat}&longitude=${savedLocation.lon}&method=${prayerMethod}&school=${prayerSchool}`)
      .then(r => r.json())
      .then(json => {
        if (json.code !== 200) return;
        const T = json.data.timings;
        setTimings(T);
        // find next prayer
        const prayers = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
        const nowD = new Date();
        const nowM = nowD.getHours()*60+nowD.getMinutes();
        let found = null;
        for (const name of prayers) {
          const [h,m] = T[name].split(":").map(Number);
          if (h*60+m > nowM) { found = { name, time: T[name], totalMins: h*60+m }; break; }
        }
        if (!found) {
          const [h,m] = T["Fajr"].split(":").map(Number);
          found = { name:"Fajr", time: T["Fajr"], totalMins: 24*60+h*60+m };
        }
        setNextPrayer(found);
      }).catch(() => {});
  }, [savedLocation]);

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // Computed values
  const today = now;
  const hijri = toHijri(today.getFullYear(), today.getMonth()+1, today.getDate());
  const HM = isSq ? HM_SQ : HM_EN;
  const DAY = isSq ? DAY_SQ : DAY_EN;
  const MON = isSq ? MON_SQ : MON_EN;
  const PR  = isSq ? PR_SQ  : PR_EN;

  const gregStr = `${DAY[today.getDay()]}, ${today.getDate()} ${MON[today.getMonth()]}`;
  const hijriStr = `${hijri.day} ${HM[hijri.month-1]}`;

  const minsLeft = nextPrayer ? nextPrayer.totalMins - (now.getHours()*60+now.getMinutes()) : 0;
  const hLeft = Math.floor(minsLeft/60), mLeft = minsLeft%60;
  const countdown = minsLeft <= 0 ? (isSq ? "Tani" : "Now")
    : hLeft > 0 ? `${isSq ? "në" : "in"} ${hLeft}h ${mLeft}m`
    : `${isSq ? "në" : "in"} ${mLeft}m`;

  // Prayer row: Imsak, Fajr, Dhuhr, Asr, Maghrib
  const ROW_KEYS = ["Imsak","Fajr","Dhuhr","Asr","Maghrib"];

  const quoteText = isSq && quote?.sq ? quote.sq : quote?.text || "";
  const verseText  = isSq && verseQuote?.sq ? verseQuote.sq : verseQuote?.text || "";

  // Feature tiles — design order: Dua, 99 Names, Library, Lectures, Tasbeeh, Calendar
  const FEATURES = [
    { id:"quran",    icon:"quran",   en:"Quran",      sq:"Kurani",      subEn:"Read, listen, study",      subSq:"Lexo, dëgo, studio" },
    { id:"dua",      icon:"dua",     en:"Dua",        sq:"Dua",         subEn:"Curated supplications",    subSq:"Lutje të zgjedhura" },
    { id:"asma",     icon:"asma",    en:"99 Names",   sq:"99 Emrat",    subEn:"Asma-ul-Husna",            subSq:"Asma-ul-Husna" },
    { id:"library",  icon:"library", en:"Library",    sq:"Biblioteka",  subEn:"Books & articles",         subSq:"Libra & artikuj" },
    { id:"audio",    icon:"audio",   en:"Lectures",   sq:"Ligjërata",   subEn:"Audio & video",            subSq:"Audio & video" },
    { id:"tasbeeh",  icon:"tasbeeh", en:"Tasbeeh",    sq:"Tesbihe",     subEn:"Dhikr counter",            subSq:"Dhikr dixhital" },
    { id:"calendar", icon:"calendar",en:"Calendar",   sq:"Kalendari",   subEn:hijriStr,                    subSq:hijriStr },
  ];
  const TOOLS = [
    { id:"zakat",       icon:"zakat",   en:"Zakat",       sq:"Zekati" },
    { id:"inheritance", icon:"inherit", en:"Will", sq:"Hiseja" },
    { id:"dates",       icon:"dates",   en:"Dates",       sq:"Datat" },
  ];

  return (
    <>
      <div className="home-wrap" style={{ padding: "28px 20px 90px", position: "relative" }}>
        <div className="home-inner" style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── PWA Install Nudge ────────────────────────── */}
          {!isStandalone && isMobile && !installDismissed && (
            <div style={{ marginBottom:16, background:"#FFFFFF", border:`1px solid ${W.border}`, borderRadius:14, padding:"14px 16px", boxShadow:W.shadow }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <img src="/logo.png" alt="" style={{ width:40, height:40, objectFit:"contain", flexShrink:0, borderRadius:8 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:W.text, fontFamily:SA, marginBottom:2 }}>
                    {isSq ? "Shto në ekranin kryesor" : "Add to your Home Screen"}
                  </div>
                  {isIOS ? (
                    <div style={{ fontSize:11, color:W.muted, fontFamily:SA, lineHeight:1.5 }}>
                      {isSq
                        ? <>Tap <strong style={{color:W.goldDark}}>□↑</strong> → <strong style={{color:W.goldDark}}>"Shto në ekranin kryesor"</strong></>
                        : <>Tap <strong style={{color:W.goldDark}}>□↑ Share</strong> → <strong style={{color:W.goldDark}}>"Add to Home Screen"</strong></>
                      }
                    </div>
                  ) : showInstall ? (
                    <div style={{ fontSize:11, color:W.muted, fontFamily:SA }}>
                      {isSq ? "Instalo për akses të shpejtë." : "Install for quick offline access."}
                    </div>
                  ) : (
                    <div style={{ fontSize:11, color:W.muted, fontFamily:SA, lineHeight:1.5 }}>
                      {isSq
                        ? <>Tap <strong style={{color:W.goldDark}}>⋮</strong> → <strong style={{color:W.goldDark}}>"Shto në ekranin kryesor"</strong></>
                        : <>Tap <strong style={{color:W.goldDark}}>⋮</strong> → <strong style={{color:W.goldDark}}>"Add to Home Screen"</strong></>
                      }
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0, alignItems:"flex-end" }}>
                  {showInstall && !isIOS && (
                    <button onClick={onInstall} style={{ padding:"6px 12px", borderRadius:7, border:"none", background:`linear-gradient(135deg,${W.gold},${W.goldDark})`, color:"#fff8e8", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:SA, whiteSpace:"nowrap" }}>
                      {isSq ? "Instalo" : "Install"}
                    </button>
                  )}
                  <button onClick={dismissInstallNudge} style={{ padding:"4px 12px", borderRadius:7, border:`1px solid ${W.goldBorder}`, background:"none", color:W.muted, fontSize:11, cursor:"pointer", fontFamily:SA, whiteSpace:"nowrap" }}>
                    {isSq ? "Jo tani" : "Not now"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TOP ROW: Prayer + Hadith ─────────────────── */}
          <div className="bento-main">

            {/* Prayer Hero Card */}
            <Card style={{ padding: "24px 24px 20px", overflow: "hidden", borderLeft: "3px solid #2D5018" }}>
              {/* Location + date row */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: showLocSearch ? 10 : 18 }}>
                <button
                  onClick={() => { setShowLocSearch(v => !v); setTimeout(() => locInputRef.current?.focus(), 60); }}
                  style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", padding:0 }}
                >
                  <Icon name="loc" size={12} color={W.goldDark} sw={2}/>
                  <span style={{ fontSize:13, fontWeight:600, color:W.text, fontFamily:SA }}>
                    {savedLocation?.name || (isSq ? "Vendos qytetin" : "Set location")}
                  </span>
                  <span style={{ fontSize:9, color:W.gold, fontFamily:SA, marginLeft:2 }}>{showLocSearch ? "▲" : "▼"}</span>
                </button>
                <span style={{ fontSize:11, color:W.muted, fontFamily:SA }}>
                  {gregStr}
                </span>
              </div>

              {/* ── Inline location search ── */}
              {showLocSearch && (
                <div style={{ marginBottom:16, position:"relative" }}>
                  {/* GPS button */}
                  <button onClick={locGPS} disabled={locGpsLoading} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"9px 12px", marginBottom:8, borderRadius:999, border:`1px solid ${W.goldBorder}`, background:W.goldBg, color:W.goldDark, fontSize:12, fontWeight:600, cursor:locGpsLoading ? "wait" : "pointer", fontFamily:SA }}>
                    <span>{locGpsLoading ? "⏳" : "📡"}</span>
                    {locGpsLoading ? (isSq ? "Duke gjetur…" : "Finding location…") : (isSq ? "Përdor GPS-in tim" : "Use my GPS location")}
                  </button>

                  {/* Text search */}
                  <div style={{ position:"relative" }}>
                    <input
                      ref={locInputRef}
                      value={locQuery}
                      onChange={e => setLocQuery(e.target.value)}
                      placeholder={isSq ? "Kërko qytetin…" : "Search city…"}
                      style={{ width:"100%", padding:"9px 14px", borderRadius:10, border:`1px solid ${W.border}`, fontSize:13, color:W.text, background:"#FFFFFF", outline:"none", fontFamily:SA, boxSizing:"border-box" }}
                    />
                    {locLoading && <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:12 }}>⏳</span>}
                  </div>

                  {/* Suggestions */}
                  {locSuggs.length > 0 && (
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:50, background:"#FFFFFF", border:`1px solid ${W.border}`, borderRadius:10, boxShadow:"0 4px 20px rgba(26,25,21,0.10)", marginTop:4, overflow:"hidden" }}>
                      {locSuggs.map((s, i) => (
                        <button key={i} onMouseDown={() => pickLocation(s)} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 14px", border:"none", background:"none", cursor:"pointer", fontSize:13, color:W.text, fontFamily:SA, borderBottom: i < locSuggs.length-1 ? `1px solid ${W.border}` : "none" }}
                          onMouseEnter={e => e.currentTarget.style.background = W.goldBg}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >📍 {s.name}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Next prayer */}
              {nextPrayer ? (
                <div onClick={() => setPage("prayer")} style={{ cursor:"pointer", marginBottom:18 }}>
                  <div style={{ fontSize:10, color:W.muted, fontFamily:SA, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:4 }}>
                    {isSq ? "Namazi i ardhshëm" : "Next prayer"}
                  </div>
                  <div style={{ fontSize:44, fontWeight:600, color:W.text, fontFamily:SR, lineHeight:1.05, letterSpacing:"-0.01em" }}>
                    {PR[nextPrayer.name]}
                  </div>
                  <div style={{ fontSize:13, color:W.muted, fontFamily:SA, marginTop:4 }}>
                    {countdown} · <span style={{ fontVariantNumeric:"tabular-nums", fontWeight:600, color:W.goldDark }}>{nextPrayer.time}</span>
                  </div>
                </div>
              ) : !savedLocation && !showLocSearch ? (
                <div onClick={() => { setShowLocSearch(true); setTimeout(() => locInputRef.current?.focus(), 60); }} style={{ marginBottom:18, cursor:"pointer" }}>
                  <div style={{ fontSize:10, color:W.muted, fontFamily:SA, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:8 }}>
                    {isSq ? "Namazi i ardhshëm" : "Next prayer"}
                  </div>
                  <div style={{ fontSize:13, color:W.goldDark, fontFamily:SA, background:W.goldBg, padding:"10px 14px", borderRadius:10, border:`1px dashed ${W.goldBorder}`, display:"flex", alignItems:"center", gap:8 }}>
                    <Icon name="loc" size={14} color={W.goldDark} sw={1.5}/>
                    <span>{isSq ? "Vendosni vendndodhjen për kohët e namazit" : "Tap to set your location and see prayer times"}</span>
                  </div>
                </div>
              ) : !savedLocation ? null : (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontSize:32, fontWeight:400, color:W.muted, fontFamily:SR }}>Loading…</div>
                </div>
              )}

              {/* Prayer time row */}
              {timings && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {ROW_KEYS.map(key => (
                    <PrayerPill
                      key={key}
                      label={PR[key]}
                      time={timings[key] || "--:--"}
                      active={nextPrayer?.name === key}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Hadith Card */}
            <Card style={{ padding:"22px 20px", display:"flex", flexDirection:"column", gap:12, borderLeft:`3px solid ${W.goldDark}` }}>
              <div>
                <span style={{ fontSize:10, fontWeight:700, color:W.muted, fontFamily:SA, letterSpacing:"0.10em", textTransform:"uppercase" }}>
                  {isSq ? "Hadithi i ditës" : "Hadith of the day"}
                </span>
              </div>
              <p style={{ fontSize:14, color:W.text, fontFamily:SR, fontStyle:"italic", lineHeight:1.8, margin:0, flex:1 }}>
                "{quoteText}"
              </p>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:W.goldDark, fontFamily:SA }}>{quote?.src}</div>
                {quote?.ref && <div style={{ fontSize:11, color:W.muted, marginTop:2, fontFamily:SA }}>{quote.ref}</div>}
              </div>
            </Card>
          </div>

          {/* ── FEATURE TILES ────────────────────────────── */}
          <div className="bento-features">
            {/* Quran — large tile spanning 2 cols */}
            <Card onClick={() => setPage("quran")} className="quran-card-large" style={{ padding:"20px 22px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <IconBadge name="quran" size={36}/>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:W.text, fontFamily:SA }}>
                        {isSq ? "Kurani" : "Quran"}
                      </div>
                      <div style={{ fontSize:11, color:W.muted, fontFamily:SA }}>
                        {isSq ? "Lexo, dëgo, studio — me përshkrthim shqip." : "Read, listen, study — with transliteration."}
                      </div>
                    </div>
                  </div>
                  {verseQuote && (
                    <div style={{ borderTop:`1px solid ${W.border}`, paddingTop:10 }}>
                      <div style={{ fontSize:10, color:W.muted, fontFamily:SA, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:5 }}>
                        {isSq ? "Ajeti i ditës" : "Verse of the day"} · {verseQuote.src.replace("Quran ","")}
                      </div>
                      <p style={{ fontSize:13, color:W.text, fontFamily:SR, fontStyle:"italic", lineHeight:1.75, margin:0 }}>
                        "{verseText}"
                      </p>
                    </div>
                  )}
                </div>
                <Icon name="chevron" size={16} color={W.muted} sw={1.5}/>
              </div>
            </Card>

            {FEATURES.filter(f => f.id !== "quran").map(f => (
              <FeatureTile
                key={f.id}
                icon={f.icon}
                label={isSq ? f.sq : f.en}
                sub={isSq ? f.subSq : f.subEn}
                onClick={() => setPage(f.id)}
              />
            ))}
          </div>

          {/* ── TOOLS ────────────────────────────────────── */}
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0 10px" }}>
            <span style={{ fontSize:10, fontWeight:700, color:W.muted, fontFamily:SA, letterSpacing:"0.12em", textTransform:"uppercase" }}>
              {isSq ? "Mjetet" : "Tools"}
            </span>
            <div style={{ flex:1, height:1, background:W.border }}/>
          </div>
          <div className="bento-tools">
            {TOOLS.map(tool => (
              <ToolTile
                key={tool.id}
                icon={tool.icon}
                label={isSq ? tool.sq : tool.en}
                onClick={() => setPage(tool.id)}
              />
            ))}
          </div>

        </div>

      </div>

    </>
  );
}

