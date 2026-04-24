import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import Icon from "./Icon";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────
const W = {
  card:        "#FFFFFF",
  border:      "#E0D5C0",
  borderLight: "#EDE8DC",
  shadow:      "0 2px 12px rgba(26,25,21,0.07)",
  shadowHov:   "0 4px 20px rgba(26,25,21,0.12)",
  shadowSm:    "0 1px 4px rgba(26,25,21,0.06)",
  text:        "#1A1915",
  muted:       "#9A8E7A",
  mutedDark:   "#6B6050",
  gold:        "#B89D60",
  goldDark:    "#8A7235",
  goldBg:      "#FAF5E8",
  goldBorder:  "rgba(184,157,96,0.30)",
  warmBg:      "#EDE8DC",
};
const SR = "'Playfair Display', Georgia, serif";
const SA = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const SM = "'Fira Code', 'Courier New', monospace";
const AA = "'Amiri', serif";

// ─── HIJRI ────────────────────────────────────────────────────────────
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

// ─── LOCALE ───────────────────────────────────────────────────────────
const DAY_SQ = ["E diel","E hënë","E martë","E mërkurë","E enjte","E premte","E shtunë"];
const DAY_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MON_SQ = ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor"];
const MON_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PR_SQ  = { Imsak:"Imsaku", Fajr:"Sabahu", Dhuhr:"Dreka", Asr:"Ikindia", Maghrib:"Akshami", Isha:"Jacia" };
const PR_EN  = { Imsak:"Imsak", Fajr:"Fajr", Dhuhr:"Dhuhr", Asr:"Asr", Maghrib:"Maghrib", Isha:"Isha" };

const STRIP_KEYS   = ["Imsak","Fajr","Dhuhr","Asr","Maghrib","Isha"];
const PRAYER_KEYS  = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const CIRC         = 2 * Math.PI * 30; // SVG circle circumference (r=30)

// ─── HOVER CARD ───────────────────────────────────────────────────────
function HoverCard({ children, style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hov ? "rgba(184,157,96,0.25)" : W.borderLight}`,
        borderRadius: 18,
        boxShadow: hov ? W.shadowHov : W.shadowSm,
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 0.18s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── FEATURE CARD ─────────────────────────────────────────────────────
function FeatureCard({ icon, title, sub, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hov ? W.border : W.borderLight}`,
        borderRadius: 16,
        padding: "18px 18px",
        cursor: "pointer",
        boxShadow: hov ? W.shadowHov : W.shadowSm,
        transform: hov ? "translateY(-3px)" : "none",
        transition: "all 0.18s",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: hov ? "rgba(184,157,96,0.2)" : W.warmBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 12, transition: "background 0.18s",
      }}>
        <Icon name={icon} size={18} color={W.goldDark} sw={1.8}/>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: W.text, fontFamily: SA, marginBottom: 3 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: W.mutedDark, fontFamily: SA }}>{sub}</div>}
    </div>
  );
}

// ─── TOOL ROW ─────────────────────────────────────────────────────────
function ToolRow({ icon, title, sub, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: `1px solid ${W.borderLight}`,
        borderRadius: 14, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer",
        transform: hov ? "translateX(3px)" : "none",
        boxShadow: hov ? W.shadowSm : "none",
        transition: "all 0.18s",
      }}
    >
      <div style={{ width:36, height:36, borderRadius:10, background:W.warmBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon name={icon} size={16} color={W.goldDark} sw={1.8}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:W.text, fontFamily:SA }}>{title}</div>
        {sub && <div style={{ fontSize:11, color:W.mutedDark, fontFamily:SA, marginTop:1 }}>{sub}</div>}
      </div>
      <Icon name="chevron" size={14} color={W.muted} sw={2}/>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function Home({ quote, verseQuote, setPage, savedLocation, onSaveLocation, showInstall, onInstall }) {
  const isSq = i18n.language?.startsWith("sq");

  const [timings, setTimings]     = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [prevPrayer, setPrevPrayer] = useState(null);
  const [now, setNow]             = useState(new Date());

  const [showLocSearch, setShowLocSearch] = useState(false);
  const [locQuery, setLocQuery]   = useState("");
  const [locSuggs, setLocSuggs]   = useState([]);
  const [locLoading, setLocLoading]   = useState(false);
  const [locGpsLoading, setLocGpsLoading] = useState(false);
  const locDebounce = useRef(null);
  const locInputRef = useRef(null);

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || !!navigator.standalone;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isMobile = window.innerWidth < 768;
  const [installDismissed, setInstallDismissed] = useState(() => !!localStorage.getItem("mp-install-dismissed"));

  const prayerMethod = parseInt(localStorage.getItem("mp-prayer-method") || "1");
  const prayerSchool = parseInt(localStorage.getItem("mp-prayer-school") || "1");

  function photonToLoc(f) {
    const p = f.properties;
    const parts = [p.name || p.city || p.town || p.village, p.state !== p.country ? p.state : null, p.country].filter(Boolean);
    return { name: parts.slice(0,2).join(", "), lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], country: (p.countrycode||"").toUpperCase() };
  }

  useEffect(() => {
    if (locQuery.length < 2) { setLocSuggs([]); return; }
    clearTimeout(locDebounce.current);
    locDebounce.current = setTimeout(async () => {
      setLocLoading(true);
      try {
        const res  = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(locQuery)}&limit=8&lang=en`);
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
          const res  = await fetch(`https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}&limit=1`);
          const json = await res.json();
          const loc  = json.features?.[0] ? photonToLoc(json.features[0]) : { name:"My Location", lat:coords.latitude, lon:coords.longitude, country:"" };
          loc.lat = coords.latitude; loc.lon = coords.longitude;
          pickLocation(loc);
        } catch { pickLocation({ name:"My Location", lat:coords.latitude, lon:coords.longitude, country:"" }); }
        setLocGpsLoading(false);
      },
      () => setLocGpsLoading(false),
      { timeout: 10000 }
    );
  }

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
        const nowM = new Date().getHours()*60 + new Date().getMinutes();
        let found = null, foundIdx = -1;
        for (let i = 0; i < PRAYER_KEYS.length; i++) {
          const [h,m] = T[PRAYER_KEYS[i]].split(":").map(Number);
          if (h*60+m > nowM) { found = { name:PRAYER_KEYS[i], time:T[PRAYER_KEYS[i]], totalMins:h*60+m }; foundIdx = i; break; }
        }
        if (!found) {
          const [h,m] = T["Fajr"].split(":").map(Number);
          found = { name:"Fajr", time:T["Fajr"], totalMins:24*60+h*60+m }; foundIdx = 0;
        }
        setNextPrayer(found);
        if (foundIdx > 0) {
          const pn = PRAYER_KEYS[foundIdx-1];
          const [ph,pm] = T[pn].split(":").map(Number);
          setPrevPrayer({ name:pn, totalMins:ph*60+pm });
        } else {
          const [ph,pm] = T["Isha"].split(":").map(Number);
          setPrevPrayer({ name:"Isha", totalMins:ph*60+pm });
        }
      }).catch(() => {});
  }, [savedLocation]);

  // 1-second tick for live countdown
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Derived values ────────────────────────────────────────────────
  const today   = now;
  const hijri   = toHijri(today.getFullYear(), today.getMonth()+1, today.getDate());
  const HM  = isSq ? HM_SQ : HM_EN;
  const DAY = isSq ? DAY_SQ : DAY_EN;
  const MON = isSq ? MON_SQ : MON_EN;
  const PR  = isSq ? PR_SQ  : PR_EN;

  const hijriStr = `${hijri.day} ${HM[hijri.month-1]}`;

  // Countdown H:MM:SS
  const nowTotalSecs = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();
  let secsLeft = 0;
  if (nextPrayer) {
    secsLeft = nextPrayer.totalMins * 60 - nowTotalSecs;
    if (secsLeft < 0) secsLeft += 86400;
  }
  const cH = Math.floor(secsLeft / 3600);
  const cM = Math.floor((secsLeft % 3600) / 60);
  const cS = secsLeft % 60;
  const countdownStr = nextPrayer
    ? (secsLeft <= 0 ? (isSq ? "Tani" : "Now") : `${cH}:${String(cM).padStart(2,"0")}:${String(cS).padStart(2,"0")}`)
    : "--:--:--";

  // Short form for sub-label
  const minsLeft = nextPrayer ? nextPrayer.totalMins - (now.getHours()*60+now.getMinutes()) : 0;
  const hLeft = Math.floor(minsLeft/60), mLeft = minsLeft%60;
  const countdownShort = minsLeft <= 0 ? "" : hLeft > 0 ? `${hLeft}h ${mLeft}m` : `${mLeft}m`;

  // Circle progress (elapsed / window duration)
  let circleProgress = 0;
  if (nextPrayer && prevPrayer) {
    const nowMins = now.getHours()*60 + now.getMinutes();
    let prev = prevPrayer.totalMins;
    let next = nextPrayer.totalMins > 1440 ? nextPrayer.totalMins - 1440 : nextPrayer.totalMins;
    let cur  = nowMins;
    if (next < prev) { if (cur < next) cur += 1440; next += 1440; }
    circleProgress = Math.max(0, Math.min(1, (cur - prev) / (next - prev)));
  }
  const circleDashOffset = CIRC * (1 - circleProgress);

  function isPast(key) {
    if (!timings) return false;
    const [h,m] = (timings[key]||"0:0").split(":").map(Number);
    return h*60+m < now.getHours()*60+now.getMinutes();
  }

  const quoteText = isSq && quote?.sq ? quote.sq : quote?.text || "";
  const verseText = isSq && verseQuote?.sq ? verseQuote.sq : verseQuote?.text || "";

  const FEATURES = [
    { id:"library",  icon:"library", en:"Library",  sq:"Biblioteka", subEn:"Books & articles",   subSq:"Libra & artikuj" },
    { id:"audio",    icon:"audio",   en:"Lectures", sq:"Ligjërata",  subEn:"Audio & video",      subSq:"Audio & video" },
    { id:"asma",     icon:"asma",    en:"99 Names", sq:"99 Emrat",   subEn:"Asma-ul-Husna",      subSq:"Asma-ul-Husna" },
    { id:"dua",      icon:"dua",     en:"Dua",      sq:"Dua",        subEn:"Supplications",      subSq:"Lutje" },
  ];
  const TOOLS = [
    { id:"zakat",       icon:"zakat",   en:"Zakat",  sq:"Zekati",  subEn:"Calculate your zakat",  subSq:"Llogarit zekatin" },
    { id:"inheritance", icon:"inherit", en:"Will",   sq:"Hiseja",  subEn:"Islamic will planner",  subSq:"Planifikues testamenti" },
    { id:"dates",       icon:"dates",   en:"Dates",  sq:"Datat",   subEn:"Hijri ↔ Gregorian",     subSq:"Hijri ↔ Gregorian" },
  ];

  return (
    <div className="home-wrap" style={{ padding:"28px 20px 90px" }}>
      <div style={{ maxWidth:1040, margin:"0 auto" }}>

        {/* ── PWA Install Nudge ──────────────────────────────────── */}
        {!isStandalone && isMobile && !installDismissed && (
          <div style={{ marginBottom:16, background:"#fff", border:`1px solid ${W.border}`, borderRadius:14, padding:"14px 16px", boxShadow:W.shadow }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <img src="/logo.png" alt="" style={{ width:40, height:40, objectFit:"contain", flexShrink:0, borderRadius:8 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:W.text, fontFamily:SA, marginBottom:2 }}>
                  {isSq ? "Shto në ekranin kryesor" : "Add to your Home Screen"}
                </div>
                {isIOS ? (
                  <div style={{ fontSize:11, color:W.muted, fontFamily:SA, lineHeight:1.5 }}>
                    {isSq ? <>Tap <strong style={{color:W.goldDark}}>□↑</strong> → <strong style={{color:W.goldDark}}>"Shto në ekranin kryesor"</strong></> : <>Tap <strong style={{color:W.goldDark}}>□↑ Share</strong> → <strong style={{color:W.goldDark}}>"Add to Home Screen"</strong></>}
                  </div>
                ) : showInstall ? (
                  <div style={{ fontSize:11, color:W.muted, fontFamily:SA }}>
                    {isSq ? "Instalo për akses të shpejtë." : "Install for quick offline access."}
                  </div>
                ) : (
                  <div style={{ fontSize:11, color:W.muted, fontFamily:SA, lineHeight:1.5 }}>
                    {isSq ? <>Tap <strong style={{color:W.goldDark}}>⋮</strong> → <strong style={{color:W.goldDark}}>"Shto në ekranin kryesor"</strong></> : <>Tap <strong style={{color:W.goldDark}}>⋮</strong> → <strong style={{color:W.goldDark}}>"Add to Home Screen"</strong></>}
                  </div>
                )}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0, alignItems:"flex-end" }}>
                {showInstall && !isIOS && (
                  <button onClick={onInstall} style={{ padding:"6px 12px", borderRadius:7, border:"none", background:`linear-gradient(135deg,${W.gold},${W.goldDark})`, color:"#fff8e8", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:SA }}>
                    {isSq ? "Instalo" : "Install"}
                  </button>
                )}
                <button onClick={() => { setInstallDismissed(true); localStorage.setItem("mp-install-dismissed","1"); }} style={{ padding:"4px 12px", borderRadius:7, border:`1px solid ${W.goldBorder}`, background:"none", color:W.muted, fontSize:11, cursor:"pointer", fontFamily:SA }}>
                  {isSq ? "Jo tani" : "Not now"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Location search panel (above hero) ─────────────────── */}
        {showLocSearch && (
          <div style={{ marginBottom:12, background:"#fff", border:`1px solid ${W.border}`, borderRadius:14, padding:"14px 16px", boxShadow:W.shadow, position:"relative", zIndex:20 }}>
            <button onClick={locGPS} disabled={locGpsLoading} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"9px 12px", marginBottom:8, borderRadius:999, border:`1px solid ${W.goldBorder}`, background:W.goldBg, color:W.goldDark, fontSize:12, fontWeight:600, cursor:locGpsLoading?"wait":"pointer", fontFamily:SA }}>
              <span>{locGpsLoading ? "⏳" : "📡"}</span>
              {locGpsLoading ? (isSq ? "Duke gjetur…" : "Finding location…") : (isSq ? "Përdor GPS-in tim" : "Use my GPS location")}
            </button>
            <div style={{ position:"relative" }}>
              <input
                ref={locInputRef}
                value={locQuery}
                onChange={e => setLocQuery(e.target.value)}
                placeholder={isSq ? "Kërko qytetin…" : "Search city…"}
                style={{ width:"100%", padding:"9px 14px", borderRadius:10, border:`1px solid ${W.border}`, fontSize:13, color:W.text, background:"#fff", outline:"none", fontFamily:SA, boxSizing:"border-box" }}
              />
              {locLoading && <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:12 }}>⏳</span>}
            </div>
            {locSuggs.length > 0 && (
              <div style={{ position:"absolute", left:16, right:16, top:"100%", zIndex:50, background:"#fff", border:`1px solid ${W.border}`, borderRadius:10, boxShadow:"0 4px 20px rgba(26,25,21,0.10)", marginTop:4, overflow:"hidden" }}>
                {locSuggs.map((s,i) => (
                  <button key={i} onMouseDown={() => pickLocation(s)}
                    style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 14px", border:"none", background:"none", cursor:"pointer", fontSize:13, color:W.text, fontFamily:SA, borderBottom:i<locSuggs.length-1?`1px solid ${W.border}`:"none" }}
                    onMouseEnter={e => e.currentTarget.style.background=W.goldBg}
                    onMouseLeave={e => e.currentTarget.style.background="none"}
                  >📍 {s.name}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ PRAYER HERO ════════════════════════════════════════════ */}
        <div style={{
          borderRadius: 20, overflow:"hidden", marginBottom:20,
          position:"relative",
          background:"linear-gradient(135deg, #1A2F0E 0%, #2A4A16 40%, #3A6320 70%, #4A7A28 100%)",
          padding:"28px 28px 0",
        }}>
          {/* Radial glow overlay */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse at 70% 0%, rgba(184,157,96,0.25) 0%, transparent 60%), radial-gradient(ellipse at 10% 100%, rgba(74,122,40,0.4) 0%, transparent 50%)" }}/>
          {/* Geometric pattern */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1'%3E%3Cpolygon points='30,2 58,16 58,44 30,58 2,44 2,16'/%3E%3Cpolygon points='30,12 48,21 48,39 30,48 12,39 12,21'/%3E%3C/g%3E%3C/svg%3E")` }}/>

          {/* 2-col hero grid */}
          <div className="prayer-hero-grid">

            {/* Left — prayer info */}
            <div style={{ position:"relative", zIndex:1, paddingBottom:28 }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:4, fontFamily:SA }}>
                {isSq ? "Namazi i ardhshëm" : "Next Prayer"}
              </div>

              {nextPrayer ? (
                <div className="prayer-name-big" onClick={() => setPage("prayer")} style={{ cursor:"pointer", fontFamily:SR, fontWeight:700, color:"#fff", lineHeight:1, letterSpacing:"-0.02em", marginBottom:6 }}>
                  {PR[nextPrayer.name]}
                </div>
              ) : !savedLocation ? (
                <div style={{ fontSize:22, color:"rgba(255,255,255,0.55)", fontFamily:SA, marginBottom:6, marginTop:4 }}>
                  {isSq ? "Vendosni qytetin" : "Set your location"}
                </div>
              ) : (
                <div style={{ fontSize:36, color:"rgba(255,255,255,0.4)", fontFamily:SR, marginBottom:6, marginTop:4 }}>…</div>
              )}

              {nextPrayer && (
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginBottom:20, fontFamily:SA }}>
                  {countdownShort && <>{isSq ? "në" : "in"} <strong style={{color:"rgba(255,255,255,0.9)", fontWeight:600}}>{countdownShort}</strong> · </>}
                  <span style={{ fontFamily:SM, fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{nextPrayer.time}</span>
                </div>
              )}

              {/* Circle + countdown */}
              {nextPrayer && (
                <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:20 }}>
                  <div style={{ position:"relative", width:72, height:72, flexShrink:0 }}>
                    <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform:"rotate(-90deg)" }}>
                      <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#B89D60" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={CIRC} strokeDashoffset={circleDashOffset}
                        style={{ transition:"stroke-dashoffset 1s ease" }}
                      />
                    </svg>
                    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:SM, lineHeight:1 }}>{nextPrayer.time}</div>
                      <div style={{ fontSize:8, color:"rgba(255,255,255,0.5)", marginTop:2, letterSpacing:"0.05em", fontFamily:SA }}>{PR[nextPrayer.name]}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily:SM, fontSize:32, fontWeight:700, color:"#fff", letterSpacing:"0.02em", lineHeight:1, display:"flex", alignItems:"center" }}>
                      <span style={{ display:"inline-block", width:7, height:7, background:"#B89D60", borderRadius:"50%", marginRight:6, flexShrink:0, animation:"pulse-ring 2s ease-out infinite" }}/>
                      {countdownStr}
                    </div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:3, letterSpacing:"0.04em", textTransform:"uppercase", fontFamily:SA }}>
                      {isSq ? "deri në ezan" : "until adhan"}
                    </div>
                  </div>
                </div>
              )}

              {/* Location button */}
              <button onClick={() => { setShowLocSearch(v => !v); setTimeout(() => locInputRef.current?.focus(), 60); }}
                style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:SA, fontSize:12 }}>
                <Icon name="loc" size={12} color="rgba(255,255,255,0.7)" sw={2}/>
                <span style={{ color:"rgba(255,255,255,0.8)", fontWeight:500 }}>
                  {savedLocation?.name || (isSq ? "Vendos qytetin" : "Set location")}
                </span>
                <Icon name="chevronDown" size={10} color="rgba(255,255,255,0.5)" sw={2.5}/>
              </button>
            </div>

            {/* Right — info sidebar (hidden on mobile) */}
            <div className="prayer-right-col" style={{ position:"relative", zIndex:1, paddingBottom:28 }}>
              <div style={{ background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:28, fontWeight:300, color:"#fff", lineHeight:1 }}>—°</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:2, fontFamily:SA }}>
                      {savedLocation?.name || (isSq ? "Vendndodhja" : "Location")}
                    </div>
                  </div>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                </div>
                {/* Sun gradient bar */}
                <div style={{ height:3, borderRadius:2, marginBottom:10, background:"linear-gradient(90deg,#1a1a2e 0%,#FF6B35 20%,#FFD166 50%,#06D6A0 80%,#1a1a2e 100%)", position:"relative" }}>
                  <div style={{ position:"absolute", top:-4, width:11, height:11, background:"#FFD166", border:"2px solid #fff", borderRadius:"50%", transform:"translateX(-50%)", left:"62%", boxShadow:"0 0 6px rgba(255,209,102,0.7)" }}/>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFD166" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    </svg>
                    <div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontFamily:SA }}>{isSq ? "Lindja" : "Sunrise"}</div>
                      <div style={{ fontFamily:SM, fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:500 }}>{timings?.Sunrise || "--:--"}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginLeft:"auto" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,160,80,0.8)" strokeWidth="2" strokeLinecap="round">
                      <path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/>
                      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/>
                      <line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
                    </svg>
                    <div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontFamily:SA }}>{isSq ? "Perëndimi" : "Sunset"}</div>
                      <div style={{ fontFamily:SM, fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:500 }}>{timings?.Sunset || "--:--"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prayer times strip */}
          <div style={{ display:"flex", gap:4, background:"rgba(0,0,0,0.25)", borderRadius:"0 0 20px 20px", padding:"10px 12px", margin:"0 -28px" }}>
            {STRIP_KEYS.map(key => {
              const active = nextPrayer?.name === key;
              const past   = isPast(key) && !active;
              return (
                <div key={key} onClick={() => setPage("prayer")} style={{ flex:1, textAlign:"center", padding:"8px 6px", borderRadius:10, cursor:"pointer", background:active?"#B89D60":"transparent", transition:"background 0.18s" }}>
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:active?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.4)", marginBottom:4, fontFamily:SA }}>
                    {PR[key]}
                  </div>
                  <div style={{ fontFamily:SM, fontSize:13, fontWeight:600, color:active?"#fff":past?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.7)" }}>
                    {timings?.[key] || "--:--"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ QURAN + HADITH ROW ══════════════════════════════════════ */}
        <div className="home-grid-2">

          {/* Quran — dark green premium card */}
          <div onClick={() => setPage("quran")}
            style={{ background:"linear-gradient(135deg,#1A2F0E 0%,#2D5018 100%)", borderRadius:18, padding:"22px 24px", position:"relative", overflow:"hidden", cursor:"pointer", boxShadow:"0 4px 20px rgba(26,47,14,0.15)", transition:"transform 0.18s,box-shadow 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(26,47,14,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 20px rgba(26,47,14,0.15)"; }}
          >
            <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'%3E%3Cpolygon points='40,4 76,22 76,58 40,76 4,58 4,22'/%3E%3C/g%3E%3C/svg%3E")` }}/>
            <div style={{ position:"absolute", right:20, top:22, width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="chevron" size={14} color="rgba(255,255,255,0.6)" sw={2}/>
            </div>
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", marginBottom:3, fontFamily:SA }}>
                {isSq ? "Kurani" : "Quran"}
              </div>
              <div style={{ fontFamily:SR, fontSize:22, fontWeight:700, color:"#fff", marginBottom:2 }}>
                {isSq ? "Lexo, Dëgo, Studio" : "Read, Listen, Study"}
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:16, fontFamily:SA }}>
                {isSq ? "Me transliterim & tefsir" : "With transliteration & tafsir"}
              </div>
              {verseQuote && (
                <>
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"#B89D60", marginBottom:8, fontFamily:SA }}>
                    {isSq ? "Ajeti i ditës" : "Verse of the Day"} · {verseQuote.src?.replace("Quran ","")}
                  </div>
                  {verseQuote.arabic && (
                    <div style={{ fontFamily:AA, fontSize:18, direction:"rtl", textAlign:"right", color:"rgba(255,255,255,0.9)", lineHeight:1.8, borderRight:"2px solid rgba(184,157,96,0.5)", paddingRight:12 }}>
                      {verseQuote.arabic}
                    </div>
                  )}
                  <div style={{ fontFamily:SR, fontStyle:"italic", fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:8, lineHeight:1.6 }}>
                    "{verseText}"
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hadith card */}
          <HoverCard style={{ padding:"22px 24px" }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:W.muted, marginBottom:12, fontFamily:SA }}>
              {isSq ? "Hadithi i ditës" : "Hadith of the Day"}
            </div>
            <div style={{ fontFamily:SR, fontStyle:"italic", fontSize:15, lineHeight:1.65, color:W.text, borderLeft:`3px solid ${W.gold}`, paddingLeft:14, marginBottom:14 }}>
              "{quoteText}"
            </div>
            <div style={{ fontSize:12, fontWeight:600, color:W.goldDark, fontFamily:SA }}>{quote?.src}</div>
            {quote?.ref && <div style={{ fontSize:11, color:W.muted, marginTop:2, fontFamily:SA }}>{quote.ref}</div>}
          </HoverCard>
        </div>

        {/* ══ CALENDAR + DUA + TASBEEH ════════════════════════════════ */}
        <div className="home-grid-3">

          {/* Calendar */}
          <div style={{ background:"#fff", border:`1px solid ${W.borderLight}`, borderRadius:18, overflow:"hidden", cursor:"pointer", boxShadow:W.shadowSm, transition:"transform 0.18s,box-shadow 0.18s" }}
            onClick={() => setPage("calendar")}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=W.shadowHov; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=W.shadowSm; }}
          >
            <div style={{ background:`linear-gradient(135deg,${W.gold},${W.goldDark})`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.7)", fontFamily:SA }}>
                {MON[today.getMonth()]} {today.getFullYear()}
              </div>
              <div style={{ fontFamily:AA, fontSize:14, color:"#fff", direction:"rtl" }}>
                {hijri.day} {HM[hijri.month-1]}
              </div>
            </div>
            <div style={{ padding:"14px 16px" }}>
              <div style={{ fontFamily:SM, fontSize:36, fontWeight:700, color:W.text, lineHeight:1 }}>{today.getDate()}</div>
              <div style={{ fontSize:12, color:W.mutedDark, marginTop:3, fontFamily:SA }}>{DAY[today.getDay()]}</div>
              <div style={{ marginTop:10, padding:"6px 10px", background:W.warmBg, borderRadius:8, fontSize:11, color:W.mutedDark, display:"flex", alignItems:"center", gap:6, fontFamily:SA }}>
                <div style={{ width:6, height:6, background:W.gold, borderRadius:"50%", flexShrink:0 }}/>
                {hijriStr}
              </div>
            </div>
          </div>

          {/* Dua */}
          <div style={{ background:"linear-gradient(160deg,#FBF7EE 0%,#F3EBDA 100%)", border:`1px solid ${W.border}`, borderRadius:18, padding:"20px 22px", cursor:"pointer", transition:"transform 0.18s,box-shadow 0.18s" }}
            onClick={() => setPage("dua")}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=W.shadowHov; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}
          >
            <div style={{ width:38, height:38, background:"rgba(184,157,96,0.15)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
              <Icon name="heart" size={18} color={W.goldDark} sw={1.8}/>
            </div>
            <div style={{ fontFamily:SR, fontSize:16, fontWeight:600, color:W.text, marginBottom:3 }}>Dua</div>
            <div style={{ fontSize:12, color:W.mutedDark, fontFamily:SA, lineHeight:1.5 }}>
              {isSq ? "Lutje të zgjedhura për çdo moment" : "Curated supplications for every moment"}
            </div>
          </div>

          {/* Tasbeeh */}
          <div style={{ background:"#fff", border:`1px solid ${W.borderLight}`, borderRadius:18, padding:"20px 22px", display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", boxShadow:W.shadowSm, transition:"transform 0.18s,box-shadow 0.18s" }}
            onClick={() => setPage("tasbeeh")}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=W.shadowHov; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=W.shadowSm; }}
          >
            <div style={{ width:72, height:72, borderRadius:"50%", background:"conic-gradient(#2D5018 0deg,#5A8035 120deg,#EDE8DC 120deg)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12, boxShadow:"0 4px 16px rgba(45,80,24,0.2)" }}>
              <div style={{ width:54, height:54, borderRadius:"50%", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontFamily:SM, fontSize:18, fontWeight:700, color:W.text, lineHeight:1 }}>33</div>
                <div style={{ fontSize:9, color:W.muted, fontFamily:SA }}>of 99</div>
              </div>
            </div>
            <div style={{ fontFamily:SR, fontSize:15, fontWeight:600, color:W.text, marginBottom:2 }}>
              {isSq ? "Tesbihe" : "Tasbeeh"}
            </div>
            <div style={{ fontSize:11, color:W.muted, fontFamily:SA }}>{isSq ? "Dixhital dhikr" : "Dhikr counter"}</div>
          </div>
        </div>

        {/* ══ EXPLORE ════════════════════════════════════════════════ */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:W.mutedDark, fontFamily:SA }}>
            {isSq ? "Eksploroni" : "Explore"}
          </span>
        </div>
        <div className="home-grid-4">
          {FEATURES.map(f => (
            <FeatureCard key={f.id} icon={f.icon} title={isSq?f.sq:f.en} sub={isSq?f.subSq:f.subEn} onClick={() => setPage(f.id)}/>
          ))}
        </div>

        {/* ══ TOOLS ══════════════════════════════════════════════════ */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:W.mutedDark, fontFamily:SA }}>
            {isSq ? "Mjetet" : "Tools"}
          </span>
        </div>
        <div style={{ background:W.warmBg, borderRadius:18, padding:20 }}>
          <div className="home-grid-tools">
            {TOOLS.map(t => (
              <ToolRow key={t.id} icon={t.icon} title={isSq?t.sq:t.en} sub={isSq?t.subSq:t.subEn} onClick={() => setPage(t.id)}/>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
