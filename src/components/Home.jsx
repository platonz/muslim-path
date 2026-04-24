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
const G = {
  green700: "#2D5018",
  green600: "#3D6B22",
  green500: "#5A8035",
  green300: "#8DB068",
  green100: "#D4E8BC",
  green50:  "#EDF5E3",
};
const SR = "'Playfair Display', Georgia, serif";
const SA = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
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
const PR_SQ  = { Fajr:"Sabahu", Dhuhr:"Dreka", Asr:"Ikindia", Maghrib:"Akshami", Isha:"Jacia" };
const PR_EN  = { Fajr:"Fajr",   Dhuhr:"Dhuhr",  Asr:"Asr",     Maghrib:"Maghrib",  Isha:"Isha"  };

const PRAYER_KEYS = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

// ─── SURAH NAMES ─────────────────────────────────────────────────────
const SURAH_NAMES = {
  1:"Al-Fatihah",2:"Al-Baqarah",3:"Ali 'Imran",4:"An-Nisa",5:"Al-Ma'idah",
  6:"Al-An'am",7:"Al-A'raf",8:"Al-Anfal",9:"At-Tawbah",10:"Yunus",
  11:"Hud",12:"Yusuf",13:"Ar-Ra'd",14:"Ibrahim",15:"Al-Hijr",
  16:"An-Nahl",17:"Al-Isra",18:"Al-Kahf",19:"Maryam",20:"Ta-Ha",
  21:"Al-Anbiya",22:"Al-Hajj",23:"Al-Mu'minun",24:"An-Nur",25:"Al-Furqan",
  26:"Ash-Shu'ara",27:"An-Naml",28:"Al-Qasas",29:"Al-'Ankabut",30:"Ar-Rum",
  31:"Luqman",32:"As-Sajdah",33:"Al-Ahzab",34:"Saba",35:"Fatir",
  36:"Ya-Sin",37:"As-Saffat",38:"Sad",39:"Az-Zumar",40:"Ghafir",
  41:"Fussilat",42:"Ash-Shura",43:"Az-Zukhruf",44:"Ad-Dukhan",45:"Al-Jathiyah",
  46:"Al-Ahqaf",47:"Muhammad",48:"Al-Fath",49:"Al-Hujurat",50:"Qaf",
  51:"Adh-Dhariyat",52:"At-Tur",53:"An-Najm",54:"Al-Qamar",55:"Ar-Rahman",
  56:"Al-Waqi'ah",57:"Al-Hadid",58:"Al-Mujadila",59:"Al-Hashr",60:"Al-Mumtahanah",
  61:"As-Saf",62:"Al-Jumu'ah",63:"Al-Munafiqun",64:"At-Taghabun",65:"At-Talaq",
  66:"At-Tahrim",67:"Al-Mulk",68:"Al-Qalam",69:"Al-Haqqah",70:"Al-Ma'arij",
  71:"Nuh",72:"Al-Jinn",73:"Al-Muzzammil",74:"Al-Muddaththir",75:"Al-Qiyamah",
  76:"Al-Insan",77:"Al-Mursalat",78:"An-Naba",79:"An-Nazi'at",80:"'Abasa",
  81:"At-Takwir",82:"Al-Infitar",83:"Al-Mutaffifin",84:"Al-Inshiqaq",85:"Al-Buruj",
  86:"At-Tariq",87:"Al-A'la",88:"Al-Ghashiyah",89:"Al-Fajr",90:"Al-Balad",
  91:"Ash-Shams",92:"Al-Layl",93:"Ad-Duha",94:"Ash-Sharh",95:"At-Tin",
  96:"Al-'Alaq",97:"Al-Qadr",98:"Al-Bayyinah",99:"Az-Zalzalah",100:"Al-'Adiyat",
  101:"Al-Qari'ah",102:"At-Takathur",103:"Al-'Asr",104:"Al-Humazah",105:"Al-Fil",
  106:"Quraysh",107:"Al-Ma'un",108:"Al-Kawthar",109:"Al-Kafirun",110:"An-Nasr",
  111:"Al-Masad",112:"Al-Ikhlas",113:"Al-Falaq",114:"An-Nas",
};

const DHIKR_PRESETS = [
  { label:"SubḥānAllāh",     arabic:"سُبْحَانَ اللَّهِ",            target:33  },
  { label:"Alḥamdulillāh",   arabic:"الْحَمْدُ لِلَّهِ",            target:33  },
  { label:"Allāhu Akbar",    arabic:"اللَّهُ أَكْبَرُ",             target:34  },
  { label:"Lā ilāha illAllāh", arabic:"لَا إِلَٰهَ إِلَّا اللَّهُ", target:100 },
  { label:"Astaghfirullāh",  arabic:"أَسْتَغْفِرُ اللَّهَ",         target:100 },
  { label:"Ṣalawāt",         arabic:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّد", target:100 },
];

function fmtTime(t) {
  if (!t) return "--:--";
  const [h,m] = t.split(":").map(Number);
  return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;
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
        borderRadius: 16, padding: "18px 18px",
        cursor: "pointer",
        boxShadow: hov ? W.shadowHov : W.shadowSm,
        transform: hov ? "translateY(-3px)" : "none",
        transition: "all 0.18s",
      }}
    >
      <div style={{
        width:40, height:40, borderRadius:12,
        background: hov ? "rgba(184,157,96,0.2)" : W.warmBg,
        display:"flex", alignItems:"center", justifyContent:"center",
        marginBottom:12, transition:"background 0.18s",
      }}>
        <Icon name={icon} size={18} color={W.goldDark} sw={1.8}/>
      </div>
      <div style={{ fontSize:14, fontWeight:600, color:W.text, fontFamily:SA, marginBottom:3 }}>{title}</div>
      {sub && <div style={{ fontSize:12, color:W.mutedDark, fontFamily:SA }}>{sub}</div>}
    </div>
  );
}

function ToolRow({ icon, title, sub, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"#fff", border:`1px solid ${W.borderLight}`,
        borderRadius:14, padding:"14px 16px",
        display:"flex", alignItems:"center", gap:12,
        cursor:"pointer",
        transform: hov ? "translateX(3px)" : "none",
        boxShadow: hov ? W.shadowSm : "none",
        transition:"all 0.18s",
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

  const [timings, setTimings]       = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [now, setNow]               = useState(new Date());

  const [showLocSearch, setShowLocSearch] = useState(false);
  const [locQuery, setLocQuery]     = useState("");
  const [locSuggs, setLocSuggs]     = useState([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locGpsLoading, setLocGpsLoading] = useState(false);
  const locDebounce = useRef(null);
  const locInputRef = useRef(null);

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || !!navigator.standalone;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isMobile = window.innerWidth < 768;
  const [installDismissed, setInstallDismissed] = useState(() => !!localStorage.getItem("mp-install-dismissed"));

  const prayerMethod = parseInt(localStorage.getItem("mp-prayer-method") || "1");
  const prayerSchool = parseInt(localStorage.getItem("mp-prayer-school") || "1");

  // Quran last opened surah
  const lastSurahNum = parseInt(localStorage.getItem("quranSurah") || "0");
  const lastSurahName = lastSurahNum > 0 ? (SURAH_NAMES[lastSurahNum] || `Surah ${lastSurahNum}`) : null;

  // Dhikr state
  const [dhikrState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tasbeeh") || "{}"); } catch { return {}; }
  });
  const dhikrIdx    = dhikrState.idx ?? 0;
  const dhikrCount  = dhikrState.count ?? 0;
  const dhikr       = DHIKR_PRESETS[Math.min(dhikrIdx, DHIKR_PRESETS.length - 1)];

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
          found = { name:"Fajr", time:T["Fajr"], totalMins:24*60+h*60+m };
        }
        setNextPrayer(found);
      }).catch(() => {});
  }, [savedLocation]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Derived values ────────────────────────────────────────────────
  const today  = now;
  const hijri  = toHijri(today.getFullYear(), today.getMonth()+1, today.getDate());
  const HM  = isSq ? HM_SQ : HM_EN;
  const DAY = isSq ? DAY_SQ : DAY_EN;
  const MON = isSq ? MON_SQ : MON_EN;
  const PR  = isSq ? PR_SQ  : PR_EN;

  const nowMins  = now.getHours()*60 + now.getMinutes();
  const dayPct   = Math.round((nowMins / (24*60)) * 100);

  const minsLeft = nextPrayer ? nextPrayer.totalMins - nowMins : 0;
  const hLeft = Math.floor(minsLeft/60), mLeft = minsLeft%60;
  const inLabel = minsLeft <= 0 ? "" : hLeft > 0 ? `${hLeft}h ${mLeft}m` : `${mLeft}m`;

  const nextIdx = nextPrayer
    ? (nextPrayer.totalMins > 1440 ? 5 : PRAYER_KEYS.indexOf(nextPrayer.name))
    : -1;

  function prayerStatus(i) {
    if (nextIdx === -1) return "future";
    if (i < nextIdx)   return "done";
    if (i === nextIdx && nextIdx < 5) return "next";
    return "future";
  }

  const FEATURES = [
    { id:"quran",   icon:"quran",   en:"Quran",    sq:"Kurani",      subEn:"Read & listen",         subSq:"Lexo & dëgo" },
    { id:"library", icon:"library", en:"Library",  sq:"Biblioteka",  subEn:"Books & articles",      subSq:"Libra & artikuj" },
    { id:"audio",   icon:"audio",   en:"Lectures", sq:"Ligjërata",   subEn:"Audio & video",         subSq:"Audio & video" },
    { id:"dua",     icon:"dua",     en:"Dua",      sq:"Dua",         subEn:"Supplications",         subSq:"Lutje" },
  ];
  const TOOLS = [
    { id:"zakat",       icon:"zakat",   en:"Zakat",   sq:"Zekati",  subEn:"Calculate your zakat",  subSq:"Llogarit zekatin" },
    { id:"inheritance", icon:"inherit", en:"Will",    sq:"Hiseja",  subEn:"Islamic will planner",  subSq:"Planifikues testamenti" },
    { id:"dates",       icon:"dates",   en:"Dates",   sq:"Datat",   subEn:"Hijri ↔ Gregorian",     subSq:"Hijri ↔ Gregorian" },
  ];

  return (
    <div style={{ background:"#FAF7EE", minHeight:"100vh", paddingBottom:90 }}>

      {/* ── PWA Install Nudge ───────────────────────────────────────── */}
      {!isStandalone && isMobile && !installDismissed && (
        <div style={{ margin:"12px 20px 0", background:"#fff", border:`1px solid ${W.border}`, borderRadius:14, padding:"14px 16px", boxShadow:W.shadow }}>
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

      {/* ── Location search panel ──────────────────────────────────── */}
      {showLocSearch && (
        <div style={{ margin:"12px 20px 0", background:"#fff", border:`1px solid ${W.border}`, borderRadius:14, padding:"14px 16px", boxShadow:W.shadow, position:"relative", zIndex:20 }}>
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

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ padding:"16px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:12, color:W.muted, fontFamily:SA }}>{isSq ? "Es-selamu alejkum" : "Assalamu Alaikum"}</div>
          <div style={{ fontSize:20, fontWeight:600, fontFamily:SR, color:W.text, marginTop:1 }}>
            {DAY[today.getDay()]}, {today.getDate()} {MON[today.getMonth()]}
          </div>
          <div style={{ fontSize:11, color:W.muted, fontFamily:SA, marginTop:1 }}>
            {hijri.day} {HM[hijri.month-1]} {hijri.year} AH
          </div>
        </div>
        <img src="/logo.png" alt="" style={{ width:38, height:38, borderRadius:10, objectFit:"contain" }}/>
      </div>

      {/* ── Next Prayer Banner ────────────────────────────────────────── */}
      <div style={{ margin:"14px 20px 0", background:G.green700, borderRadius:18, padding:"18px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-16, top:-16, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", right:20, bottom:-30, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:G.green300, fontFamily:SA }}>
            {isSq ? "Namazi i ardhshëm" : "Next Prayer"}
          </div>
          <button
            onClick={() => { setShowLocSearch(v => !v); setTimeout(() => locInputRef.current?.focus(), 60); }}
            style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", padding:0 }}
          >
            <Icon name="loc" size={11} color={G.green300} sw={2}/>
            <span style={{ fontSize:11, color:G.green300, fontFamily:SA }}>
              {savedLocation?.name || (isSq ? "Vendos qytetin" : "Set location")}
            </span>
          </button>
        </div>

        <div style={{ fontSize:28, fontWeight:600, fontFamily:SR, color:"white", marginTop:4 }} onClick={() => setPage("prayer")}>
          {nextPrayer
            ? `${PR[nextPrayer.name]} · ${fmtTime(nextPrayer.time)}`
            : savedLocation
              ? "…"
              : (isSq ? "Vendosni qytetin" : "Set your location")}
        </div>

        {nextPrayer && inLabel && (
          <div style={{ fontSize:13, color:G.green300, marginTop:3, fontFamily:SA }}>
            {isSq ? `Në ${inLabel}` : `In ${inLabel}`}{savedLocation?.name ? ` · ${savedLocation.name}` : ""}
          </div>
        )}

        <div style={{ marginTop:14, height:4, background:"rgba(255,255,255,0.15)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${dayPct}%`, background:G.green300, borderRadius:99 }}/>
        </div>
        <div style={{ fontSize:10, color:G.green300, marginTop:4, fontFamily:SA }}>
          {isSq ? `Dita ${dayPct}% e kaluar` : `Day ${dayPct}% elapsed`}
        </div>
      </div>

      {/* ── Today's Prayers ──────────────────────────────────────────── */}
      <div style={{ margin:"20px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:W.muted, marginBottom:8, fontFamily:SA }}>
          {isSq ? "Namazet e sotme" : "Today's Prayers"}
        </div>
        <div style={{ background:"#fff", border:`1px solid ${W.borderLight}`, borderRadius:14, overflow:"hidden", boxShadow:W.shadow }}>
          {PRAYER_KEYS.map((key, i) => {
            const status = prayerStatus(i);
            const isLast = i === PRAYER_KEYS.length - 1;
            return (
              <div key={key} style={{
                display:"flex", alignItems:"center", padding:"11px 16px",
                borderBottom: isLast ? "none" : `1px solid ${G.green50}`,
                background: status === "next" ? G.green50 : "#fff",
              }}>
                <div style={{
                  width:24, height:24, borderRadius:"50%", marginRight:12, flexShrink:0,
                  background: status === "done" ? G.green700 : "#fff",
                  border: `1.5px solid ${status === "done" ? G.green700 : G.green100}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {status === "done" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {status === "next" && (
                    <div style={{ width:7, height:7, borderRadius:"50%", background:G.green700 }}/>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight: status === "next" ? 600 : 500, color: status === "next" ? G.green700 : W.text, fontFamily:SA }}>
                    {PR[key]}
                  </div>
                </div>
                <div style={{ fontSize:13, color: status === "next" ? G.green700 : W.muted, fontWeight: status === "next" ? 600 : 400, fontFamily:SA }}>
                  {timings?.[key] ? fmtTime(timings[key]) : "--:--"}
                </div>
                {status === "next" && (
                  <div style={{ marginLeft:8, padding:"2px 8px", borderRadius:999, background:G.green700, color:"#fff", fontSize:10, fontWeight:700, fontFamily:SA, letterSpacing:"0.04em" }}>
                    {isSq ? "Tjetri" : "Next"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Continue Reading ─────────────────────────────────────────── */}
      <div style={{ margin:"20px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:W.muted, marginBottom:8, fontFamily:SA }}>
          {isSq ? "Vazhdo Leximin" : "Continue Reading"}
        </div>
        <div
          onClick={() => setPage("quran")}
          style={{ background:"#fff", border:`1px solid ${W.borderLight}`, borderRadius:14, padding:16, cursor:"pointer", boxShadow:W.shadow, transition:"box-shadow 0.18s,transform 0.18s" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow=W.shadowHov; e.currentTarget.style.transform="translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow=W.shadow; e.currentTarget.style.transform=""; }}
        >
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              {lastSurahName ? (
                <>
                  <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:G.green700, fontFamily:SA, marginBottom:4 }}>
                    {lastSurahName}
                  </div>
                  <div style={{ fontSize:15, fontWeight:600, fontFamily:SR, color:W.text }}>
                    {isSq ? "Vazhdo ku ndave" : "Continue where you left off"}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:G.green700, fontFamily:SA, marginBottom:4 }}>
                    {isSq ? "Kurani" : "Quran"}
                  </div>
                  <div style={{ fontSize:15, fontWeight:600, fontFamily:SR, color:W.text }}>
                    {isSq ? "Fillo të lexosh sot" : "Start reading today"}
                  </div>
                </>
              )}
              <div style={{ fontSize:12, color:W.muted, marginTop:2, fontFamily:SA }}>
                {isSq ? "114 sure · Arabisht & përkthim" : "114 surahs · Arabic & translation"}
              </div>
            </div>
            <Icon name="chevron" size={20} color={G.green700} sw={2}/>
          </div>
        </div>
      </div>

      {/* ── Daily Dhikr ──────────────────────────────────────────────── */}
      <div style={{ margin:"20px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:W.muted, marginBottom:8, fontFamily:SA }}>
          {isSq ? "Dhikr-u i ditës" : "Daily Dhikr"}
        </div>
        <div style={{ background:"#fff", border:`1px solid ${W.borderLight}`, borderRadius:14, padding:16, boxShadow:W.shadow }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontFamily:AA, fontSize:20, color:W.text, direction:"rtl", lineHeight:1.6 }}>
              {dhikr.arabic}
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:G.green700, fontFamily:SA, flexShrink:0, marginLeft:12 }}>
              {dhikrCount}<span style={{ fontSize:13, color:W.muted, fontWeight:400 }}>/{dhikr.target}</span>
            </div>
          </div>
          <div style={{ fontSize:13, color:W.mutedDark, marginTop:2, fontFamily:SA }}>{dhikr.label}</div>
          <div style={{ marginTop:10, height:4, background:G.green50, borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.min(100,(dhikrCount/dhikr.target)*100)}%`, background:G.green300, borderRadius:99 }}/>
          </div>
          <button
            onClick={() => setPage("tasbeeh")}
            style={{ marginTop:12, width:"100%", padding:"10px", borderRadius:10, background:G.green50, border:`1px solid ${G.green100}`, color:G.green700, fontWeight:600, fontSize:13, fontFamily:SA, cursor:"pointer" }}
          >
            {isSq ? "Hap numëruesin e dhikrit" : "Open Dhikr counter"}
          </button>
        </div>
      </div>

      {/* ── Explore ──────────────────────────────────────────────────── */}
      <div style={{ margin:"28px 20px 12px" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:W.mutedDark, fontFamily:SA }}>
          {isSq ? "Eksploroni" : "Explore"}
        </div>
      </div>
      <div style={{ padding:"0 20px" }}>
        <div className="home-grid-4">
          {FEATURES.map(f => (
            <FeatureCard key={f.id} icon={f.icon} title={isSq?f.sq:f.en} sub={isSq?f.subSq:f.subEn} onClick={() => setPage(f.id)}/>
          ))}
        </div>
      </div>

      {/* ── Tools ────────────────────────────────────────────────────── */}
      <div style={{ margin:"24px 20px 12px" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:W.mutedDark, fontFamily:SA }}>
          {isSq ? "Mjetet" : "Tools"}
        </div>
      </div>
      <div style={{ padding:"0 20px" }}>
        <div style={{ background:W.warmBg, borderRadius:18, padding:16 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {TOOLS.map(t => (
              <ToolRow key={t.id} icon={t.icon} title={isSq?t.sq:t.en} sub={isSq?t.subSq:t.subEn} onClick={() => setPage(t.id)}/>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
