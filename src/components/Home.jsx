import { useState } from "react";
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

// ─── PRAYER STRIP DATA ────────────────────────────────────────────────
const HOME_PRAYERS = [
  {
    id: "sabahu", nameAlb: "Sabahu", timeLabel: { sq: "AGIM",     en: "DAWN"    },
    rakatFard: 2, rakatSunnah: 2,
    sky: "linear-gradient(180deg,#141A38 0%,#2A1F4A 18%,#4A2E58 38%,#8A4E5E 60%,#C87858 78%,#E8AE7A 92%,#F2C898 100%)",
    sunY: 86, sunColor: "#F8D89A", sunGlow: "rgba(248,200,140,0.45)",
    stars: [{ x:18,y:12,s:0.9 },{ x:32,y:8,s:0.7 },{ x:64,y:14,s:1 },{ x:78,y:10,s:0.8 },{ x:88,y:22,s:0.6 }],
    window: [4*60+30, 5*60+45],
  },
  {
    id: "dreka", nameAlb: "Dreka", timeLabel: { sq: "MESDITË",  en: "MIDDAY"  },
    rakatFard: 4, rakatSunnah: 6,
    sky: "linear-gradient(180deg,#4A8AB8 0%,#6FA8CC 25%,#98C0DC 55%,#C8DCE8 85%,#E8EFF2 100%)",
    sunY: 22, sunColor: "#FFF8E0", sunGlow: "rgba(255,248,224,0.55)",
    stars: null,
    window: [12*60+15, 15*60+45],
  },
  {
    id: "iqindia", nameAlb: "Iqindia", timeLabel: { sq: "PASDITE", en: "AFTERNOON" },
    rakatFard: 4, rakatSunnah: 4,
    sky: "linear-gradient(180deg,#6FA0BC 0%,#98B0B8 25%,#C8A878 55%,#E0B870 80%,#ECC890 100%)",
    sunY: 48, sunColor: "#F8C870", sunGlow: "rgba(248,200,112,0.5)",
    stars: null,
    window: [15*60+45, 18*60+30],
  },
  {
    id: "akshami", nameAlb: "Akshami", timeLabel: { sq: "PERËNDIM", en: "SUNSET"  },
    rakatFard: 3, rakatSunnah: 2,
    sky: "linear-gradient(180deg,#2A1F58 0%,#5A2E5A 18%,#9A3A52 38%,#D0583A 58%,#E88838 75%,#F2B068 88%,#F8D098 100%)",
    sunY: 70, sunColor: "#FFD088", sunGlow: "rgba(255,200,120,0.55)",
    stars: [{ x:18,y:12,s:1 }],
    window: [18*60+30, 20*60+15],
  },
  {
    id: "jacia", nameAlb: "Jacia", timeLabel: { sq: "NATË",     en: "NIGHT"   },
    rakatFard: 4, rakatSunnah: 4,
    sky: "linear-gradient(180deg,#050828 0%,#0F1438 25%,#1A2050 50%,#1F2858 75%,#28305A 100%)",
    sunY: -10, sunColor: "#E8E0F0", sunGlow: "rgba(232,224,240,0.35)",
    stars: [{ x:12,y:14,s:1 },{ x:22,y:28,s:1.5 },{ x:35,y:12,s:0.8 },{ x:48,y:22,s:1.2 },{ x:62,y:18,s:1 },{ x:78,y:30,s:1.3 },{ x:88,y:14,s:0.9 }],
    isNight: true,
    window: [20*60+15, (24+4)*60+30],
  },
];

function getCurrentPrayerIdx() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < HOME_PRAYERS.length; i++) {
    const [s, e] = HOME_PRAYERS[i].window;
    if (e > 24*60 ? (mins >= s || mins < e - 24*60) : (mins >= s && mins < e)) return i;
  }
  return HOME_PRAYERS.length - 1;
}

function HomePrayerCard({ prayer, isCurrent, isSq, onClick }) {
  const [hov, setHov] = useState(false);
  const W_CARD = 155;
  const label = isSq ? prayer.timeLabel.sq : prayer.timeLabel.en;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0, width: W_CARD, borderRadius: 16, overflow: "hidden",
        border: isCurrent ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.25)" : "0 3px 12px rgba(0,0,0,0.18)",
        transform: hov ? "translateY(-3px)" : "none",
        transition: "transform 0.18s, box-shadow 0.18s",
        cursor: "pointer", background: "none", padding: 0, textAlign: "left",
        outline: "none",
      }}
    >
      {/* Sky scene */}
      <div style={{ position: "relative", height: 100, background: prayer.sky, overflow: "hidden" }}>
        {/* Stars */}
        {prayer.stars?.map((st, i) => (
          <div key={i} style={{
            position: "absolute", left: `${st.x}%`, top: `${st.y}%`,
            width: st.s * 3, height: st.s * 3, borderRadius: "50%",
            background: "#fff", opacity: 0.85,
          }}/>
        ))}
        {/* Sun / Moon */}
        {prayer.sunY > -5 && (
          <div style={{
            position: "absolute", left: "50%", top: `${prayer.sunY}%`,
            transform: "translate(-50%, -50%)",
            width: prayer.isNight ? 22 : 30, height: prayer.isNight ? 22 : 30,
            borderRadius: "50%", background: prayer.sunColor,
            boxShadow: `0 0 ${prayer.isNight ? 10 : 18}px 4px ${prayer.sunGlow}`,
          }}/>
        )}
        {/* Time label */}
        <div style={{
          position: "absolute", top: 8, left: 9,
          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.85)", fontFamily: SA,
        }}>{label}</div>
        {/* TANI / NOW badge */}
        {isCurrent && (
          <div style={{
            position: "absolute", top: 7, right: 7,
            background: "#fff", color: "#1A1915",
            fontSize: 9, fontWeight: 800, letterSpacing: "0.06em",
            padding: "2px 6px", borderRadius: 99, fontFamily: SA,
          }}>{isSq ? "TANI" : "NOW"}</div>
        )}
      </div>
      {/* Card body */}
      <div style={{ background: "#fff", padding: "10px 12px 12px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1915", fontFamily: SR, marginBottom: 5 }}>
          {prayer.nameAlb}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: "#6B6050", fontFamily: SA }}>
            <strong style={{ color: "#1A1915" }}>{prayer.rakatFard}</strong> {isSq ? "FARZ" : "FARD"}
          </span>
          <span style={{ width: 1, height: 10, background: "#E0D5C0" }}/>
          <span style={{ fontSize: 10, color: "#6B6050", fontFamily: SA }}>
            <strong style={{ color: "#1A1915" }}>{prayer.rakatSunnah}</strong> {isSq ? "SUNET" : "SUNNAH"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9A8E7A", fontFamily: SA }}>
          {isSq ? "Mëso si të falesh" : "Learn to pray"}
          <span style={{ fontSize: 13, marginTop: -1 }}>→</span>
        </div>
      </div>
    </button>
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
export default function Home({ quote, verseQuote, setPage, showInstall, onInstall }) {
  const isSq = i18n.language?.startsWith("sq");

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || !!navigator.standalone;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isMobile = window.innerWidth < 768;
  const [installDismissed, setInstallDismissed] = useState(() => !!localStorage.getItem("mp-install-dismissed"));

  const lastSurahNum = parseInt(localStorage.getItem("quranSurah") || "0");
  const lastSurahName = lastSurahNum > 0 ? (SURAH_NAMES[lastSurahNum] || `Surah ${lastSurahNum}`) : null;

  const [dhikrState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tasbeeh") || "{}"); } catch { return {}; }
  });
  const dhikrIdx   = dhikrState.idx ?? 0;
  const dhikrCount = dhikrState.count ?? 0;
  const dhikr      = DHIKR_PRESETS[Math.min(dhikrIdx, DHIKR_PRESETS.length - 1)];

  // ── Derived values ────────────────────────────────────────────────
  const today  = new Date();
  const hijri  = toHijri(today.getFullYear(), today.getMonth()+1, today.getDate());
  const HM  = isSq ? HM_SQ : HM_EN;
  const DAY = isSq ? DAY_SQ : DAY_EN;
  const MON = isSq ? MON_SQ : MON_EN;

  // Verse of the day ref: "Quran 17:70" → "17:70"
  const verseRef = verseQuote?.src?.replace("Quran ", "") || "";

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

      {/* ── Quran Card (dark green) ───────────────────────────────────── */}
      <div style={{ margin:"16px 20px 0" }}>
        <div
          onClick={() => setPage("quran")}
          style={{
            background: G.green700, borderRadius:16, padding:"18px 20px",
            cursor:"pointer", position:"relative", overflow:"hidden",
            boxShadow:"0 4px 16px rgba(45,80,24,0.25)",
            transition:"transform 0.18s, box-shadow 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(45,80,24,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 16px rgba(45,80,24,0.25)"; }}
        >
          <div style={{ position:"absolute", right:-10, top:-10, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:G.green300, fontFamily:SA, marginBottom:4 }}>
                {isSq ? "Kurani" : "Quran"}
              </div>
              <div style={{ fontSize:18, fontWeight:700, fontFamily:SR, color:"#FFFFFF", marginBottom:2 }}>
                {isSq ? "Lexo, Dëgjo, Studio" : "Read, Listen, Study"}
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", fontFamily:SA, marginBottom:14 }}>
                {isSq ? "Me transliterim & tefsir" : "With transliteration & tafsir"}
              </div>

              {verseQuote && (
                <>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:W.gold, fontFamily:SA, marginBottom:6 }}>
                    {isSq ? `Ajeti i ditës · ${verseRef}` : `Verse of the Day · ${verseRef}`}
                  </div>
                  <div style={{ fontSize:15, fontFamily:AA, color:"rgba(255,255,255,0.90)", direction:"rtl", lineHeight:1.8, marginBottom:6 }}>
                    {/* Arabic placeholder — show reference since we have translation only */}
                  </div>
                  <div style={{ fontSize:12, fontStyle:"italic", color:"rgba(255,255,255,0.75)", fontFamily:SR, lineHeight:1.5 }}>
                    "{isSq && verseQuote.sq ? verseQuote.sq : verseQuote.text}"
                  </div>
                </>
              )}
            </div>
            <div style={{ marginLeft:12, flexShrink:0 }}>
              <Icon name="chevron" size={20} color="rgba(255,255,255,0.6)" sw={2}/>
            </div>
          </div>
          {lastSurahName && (
            <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:10, color:G.green300, fontFamily:SA }}>
                {isSq ? "Vazhdo:" : "Continue:"} <strong style={{color:"rgba(255,255,255,0.8)"}}>{lastSurahName}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Prayer Strip ─────────────────────────────────────────────── */}
      {(() => {
        const currentIdx = getCurrentPrayerIdx();
        return (
          <div style={{ margin: "16px 0 0" }}>
            <div style={{ padding: "0 20px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: W.mutedDark, fontFamily: SA }}>
                {isSq ? "Pesë Namazet" : "Five Prayers"}
              </div>
              <button
                onClick={() => setPage("namaz")}
                style={{ fontSize: 11, color: W.gold, fontFamily: SA, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {isSq ? "Shiko të gjitha →" : "See all →"}
              </button>
            </div>
            <div className="hide-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 20px 4px", scrollSnapType: "x mandatory" }}>
              {HOME_PRAYERS.map((p, i) => (
                <HomePrayerCard
                  key={p.id}
                  prayer={p}
                  isCurrent={i === currentIdx}
                  isSq={isSq}
                  onClick={() => setPage("namaz")}
                />
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Hadith of the Day ────────────────────────────────────────── */}
      {quote && (
        <div style={{ margin:"16px 20px 0" }}>
          <div style={{
            background:"#fff",
            border:`1px solid ${W.borderLight}`,
            borderLeft:`3px solid ${W.gold}`,
            borderRadius:14, padding:"16px 18px",
            boxShadow:W.shadowSm,
          }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:W.gold, fontFamily:SA, marginBottom:8 }}>
              {isSq ? "Hadithi i ditës" : "Hadith of the Day"}
            </div>
            <div style={{ fontSize:14, fontStyle:"italic", color:W.text, fontFamily:SR, lineHeight:1.65, marginBottom:8 }}>
              "{isSq && quote.sq ? quote.sq : quote.text}"
            </div>
            <div style={{ fontSize:11, color:W.mutedDark, fontFamily:SA }}>
              — {quote.src}{quote.ref ? ` · ${quote.ref}` : ""}
            </div>
          </div>
        </div>
      )}

      {/* ── Calendar + Dua Row ───────────────────────────────────────── */}
      <div style={{ padding:"0 20px", marginTop:16 }}>
        <div className="home-grid-2">

          {/* Calendar */}
          <div
            onClick={() => setPage("dates")}
            style={{ borderRadius:18, overflow:"hidden", cursor:"pointer", background:"#fff", border:`1px solid ${W.borderLight}`, boxShadow:W.shadowSm, transition:"transform 0.18s,box-shadow 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=W.shadowHov; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=W.shadowSm; }}
          >
            <div style={{ background:`linear-gradient(135deg,${W.gold},${W.goldDark})`, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.8)", fontFamily:SA }}>
                {MON[today.getMonth()]} {today.getFullYear()}
              </div>
              <div style={{ fontFamily:AA, fontSize:13, color:"#fff", direction:"rtl" }}>
                {hijri.day} {HM[hijri.month - 1]}
              </div>
            </div>
            <div style={{ padding:"12px 14px" }}>
              <div style={{ fontFamily:"'Courier New', monospace", fontSize:34, fontWeight:700, color:W.text, lineHeight:1 }}>
                {today.getDate()}
              </div>
              <div style={{ fontSize:12, color:W.muted, marginTop:3, fontFamily:SA }}>
                {DAY[today.getDay()]}
              </div>
              <div style={{ marginTop:8, padding:"5px 8px", background:W.warmBg, borderRadius:8, display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:5, height:5, background:W.gold, borderRadius:"50%", flexShrink:0 }}/>
                <div style={{ fontSize:10, color:W.mutedDark, fontFamily:SA }}>
                  {hijri.day} {HM[hijri.month - 1]} {hijri.year}
                </div>
              </div>
            </div>
          </div>

          {/* Dua */}
          <div
            onClick={() => setPage("dua")}
            style={{ borderRadius:18, background:"linear-gradient(160deg,#FBF7EE 0%,#F3EBDA 100%)", border:`1px solid ${W.border}`, padding:"18px 16px", cursor:"pointer", transition:"transform 0.18s,box-shadow 0.18s", boxShadow:W.shadowSm }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=W.shadowHov; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=W.shadowSm; }}
          >
            <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(184,157,96,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
              <Icon name="dua" size={18} color={W.goldDark} sw={1.8}/>
            </div>
            <div style={{ fontSize:16, fontWeight:600, fontFamily:SR, color:W.text, marginBottom:4 }}>
              {isSq ? "Dua" : "Dua"}
            </div>
            <div style={{ fontSize:12, color:W.muted, fontFamily:SA, lineHeight:1.5 }}>
              {isSq ? "Lutje për çdo moment" : "Supplications for every moment"}
            </div>
          </div>

        </div>
      </div>

      {/* ── Daily Dhikr ──────────────────────────────────────────────── */}
      <div style={{ margin:"16px 20px 0" }}>
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

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
