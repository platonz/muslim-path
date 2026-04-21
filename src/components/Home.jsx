import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import Icon from "./Icon";
import KaabaWatermark from "./KaabaWatermark";

// ─── WARM PALETTE ───────────────────────────────────────────────────
const W = {
  card:        "rgba(255,252,244,0.68)",
  cardHov:     "rgba(255,252,244,0.88)",
  border:      "rgba(255,255,255,0.78)",
  shadow:      "0 2px 18px rgba(160,120,50,0.09), 0 1px 0 rgba(255,255,255,0.85) inset",
  shadowHov:   "0 6px 28px rgba(160,120,50,0.16), 0 1px 0 rgba(255,255,255,0.9) inset",
  text:        "#3a2a10",
  muted:       "rgba(100,75,30,0.52)",
  mutedDark:   "rgba(100,75,30,0.75)",
  gold:        "#c9a84c",
  goldDark:    "#a07d3a",
  goldBg:      "rgba(201,168,76,0.11)",
  goldBorder:  "rgba(201,168,76,0.28)",
};
const SR = "'Cormorant Garamond', Georgia, serif";
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
const PR_SQ  = { Imsak:"Imsak", Fajr:"Sabah", Dhuhr:"Dreka", Asr:"Ikindia", Maghrib:"Aksham", Isha:"Jacia" };
const PR_EN  = { Imsak:"Imsak", Fajr:"Fajr",  Dhuhr:"Dhuhr", Asr:"Asr",    Maghrib:"Maghrib", Isha:"Isha"  };

// Icon and KaabaWatermark are imported from shared components above

// ─── GLASS CARD ─────────────────────────────────────────────────────
function Card({ children, style = {}, onClick, className = "" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? W.cardHov : W.card,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: `1px solid ${W.border}`,
        borderRadius: 20,
        boxShadow: hov ? W.shadowHov : W.shadow,
        transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
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
      width: size, height: size, borderRadius: 10,
      background: W.goldBg,
      border: `1px solid ${W.goldBorder}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon name={name} size={size * 0.52} color={W.goldDark} sw={1.6}/>
    </div>
  );
}

// ─── PRAYER ROW PILL ────────────────────────────────────────────────
function PrayerPill({ label, time, active }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, padding: "8px 10px", borderRadius: 12, minWidth: 54,
      background: active ? W.goldBg : "rgba(255,255,255,0.35)",
      border: `1px solid ${active ? W.goldBorder : "rgba(255,255,255,0.5)"}`,
      transition: "background 0.2s",
    }}>
      <span style={{ fontSize: 10, color: active ? W.goldDark : W.muted, fontFamily: SA, fontWeight: active ? 700 : 400, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: active ? W.text : W.mutedDark, fontFamily: SA, fontWeight: active ? 700 : 500, fontVariantNumeric: "tabular-nums" }}>
        {time}
      </span>
    </div>
  );
}

// ─── FEATURE TILE ───────────────────────────────────────────────────
function FeatureTile({ icon, label, sub, onClick }) {
  return (
    <Card onClick={onClick} style={{ padding: "18px 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <IconBadge name={icon} size={38}/>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: W.text, fontFamily: SA, letterSpacing: "-0.01em" }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: W.muted, marginTop: 2, fontFamily: SA }}>{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

// ─── TOOL TILE ──────────────────────────────────────────────────────
function ToolTile({ icon, label, onClick }) {
  return (
    <Card onClick={onClick} style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge name={icon} size={32}/>
        <span style={{ fontSize: 13, fontWeight: 600, color: W.text, fontFamily: SA }}>{label}</span>
      </div>
    </Card>
  );
}

// ─── MAIN HOME COMPONENT ────────────────────────────────────────────
export default function Home({ quote, setPage, savedLocation }) {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");

  const [timings, setTimings] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [now, setNow] = useState(new Date());

  // Fetch all prayer timings
  useEffect(() => {
    if (!savedLocation) return;
    const d = new Date();
    const dateStr = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${savedLocation.lat}&longitude=${savedLocation.lon}&method=2`)
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
  const isQuranVerse = quote?.src?.startsWith("Quran");

  // Feature tiles
  const FEATURES = [
    { id:"quran",    icon:"quran",   en:"Quran",      sq:"Kurani",      subEn:"Read, listen, study",      subSq:"Lexo, dëgo, studio" },
    { id:"calendar", icon:"calendar",en:"Calendar",   sq:"Kalendari",   subEn:hijriStr,                    subSq:hijriStr },
    { id:"dua",      icon:"dua",     en:"Dua",        sq:"Dua",         subEn:"Curated supplications",    subSq:"Lutje të zgjedhura" },
    { id:"library",  icon:"library", en:"Library",    sq:"Biblioteka",  subEn:"Books & articles",         subSq:"Libra & artikuj" },
    { id:"audio",    icon:"audio",   en:"Lectures",   sq:"Ligjërata",   subEn:"Audio & video",            subSq:"Audio & video" },
    { id:"tasbeeh",  icon:"tasbeeh", en:"Tasbeeh",    sq:"Tesbihe",     subEn:"Dhikr counter",            subSq:"Dhikr dixhital" },
    { id:"asma",     icon:"asma",    en:"99 Names",   sq:"99 Emrat",    subEn:"Asma-ul-Husna",            subSq:"Asma-ul-Husna" },
  ];
  const TOOLS = [
    { id:"zakat",       icon:"zakat",   en:"Zakat",       sq:"Zekati" },
    { id:"inheritance", icon:"inherit", en:"Inheritance", sq:"Trashëgimia" },
    { id:"dates",       icon:"dates",   en:"Dates",       sq:"Datat" },
  ];

  return (
    <>
      <div className="home-wrap" style={{ padding: "28px 20px 90px", position: "relative" }}>
        <div className="home-inner" style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── TOP ROW: Prayer + Hadith ─────────────────── */}
          <div className="bento-main">

            {/* Prayer Hero Card */}
            <Card style={{ padding: "28px 28px 24px", overflow: "hidden" }}>
              {/* Small card-local Kaaba watermark, bottom-right of card */}
              <KaabaWatermark fixed={false} opacity={0.07} size="200px" />
              {/* Location + date row */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Icon name="loc" size={13} color={W.gold} sw={2}/>
                  <span style={{ fontSize:13, fontWeight:600, color:W.text, fontFamily:SA }}>
                    {savedLocation?.name || (isSq ? "Vendos qytetin" : "Set location")}
                  </span>
                </div>
                <span style={{ fontSize:12, color:W.muted, fontFamily:SA }}>
                  {gregStr}
                </span>
              </div>

              {/* Next prayer */}
              {nextPrayer ? (
                <div onClick={() => setPage("prayer")} style={{ cursor:"pointer", marginBottom: 20 }}>
                  <div style={{ fontSize:11, color:W.muted, fontFamily:SA, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>
                    {isSq ? "Namazi i ardhshëm" : "Next prayer"}
                  </div>
                  <div style={{ fontSize: 46, fontWeight:500, color:W.text, fontFamily:SR, lineHeight:1.05, letterSpacing:"-0.01em" }}>
                    {PR[nextPrayer.name]}
                  </div>
                  <div style={{ fontSize:14, color:W.muted, fontFamily:SA, marginTop:4 }}>
                    {countdown} · <span style={{ fontVariantNumeric:"tabular-nums", fontWeight:600, color:W.mutedDark }}>{nextPrayer.time}</span>
                  </div>
                </div>
              ) : !savedLocation ? (
                <div onClick={() => {}} style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:W.muted, fontFamily:SA, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>
                    {isSq ? "Namazi i ardhshëm" : "Next prayer"}
                  </div>
                  <div style={{ fontSize:13, color:W.muted, fontFamily:SA, background:"rgba(201,168,76,0.08)", padding:"10px 14px", borderRadius:10, border:`1px dashed ${W.goldBorder}` }}>
                    {isSq ? "⚙ Vendosni vendndodhjen për kohët e namazit" : "⚙ Set your location to see prayer times"}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:32, fontWeight:500, color:W.muted, fontFamily:SR }}>Loading…</div>
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
            <Card style={{ padding:"24px 22px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:3, height:20, borderRadius:2, background:`linear-gradient(180deg,${W.gold},${W.goldDark})` }}/>
                <span style={{ fontSize:11, fontWeight:700, color:W.goldDark, fontFamily:SA, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                  {isSq ? "Hadithi i ditës" : "Hadith of the day"}
                </span>
              </div>
              <p style={{ fontSize:15, color:W.text, fontFamily:SR, fontStyle:"italic", lineHeight:1.75, margin:0, flex:1 }}>
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
            <Card onClick={() => setPage("quran")} className="quran-card-large" style={{ padding:"22px 24px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <IconBadge name="quran" size={38}/>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:W.text, fontFamily:SA }}>
                        {isSq ? "Kurani" : "Quran"}
                      </div>
                      <div style={{ fontSize:11, color:W.muted, fontFamily:SA }}>
                        {isSq ? "Lexo, dëgo, studio — më përshkrthim shqip." : "Read, listen, study — with transliteration."}
                      </div>
                    </div>
                  </div>
                  {isQuranVerse && (
                    <div style={{ borderTop:`1px solid ${W.goldBorder}`, paddingTop:10 }}>
                      <div style={{ fontSize:10, color:W.goldDark, fontFamily:SA, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:6 }}>
                        {isSq ? "Ajeti i ditës" : "Verse of the day"} · {quote.src.replace("Quran ","")}
                      </div>
                      <p style={{ fontSize:14, color:W.text, fontFamily:SR, fontStyle:"italic", lineHeight:1.7, margin:0 }}>
                        "{quoteText}"
                      </p>
                    </div>
                  )}
                </div>
                <Icon name="chevron" size={18} color={W.muted} sw={2}/>
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
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0 12px" }}>
            <div style={{ width:3, height:16, borderRadius:2, background:`linear-gradient(180deg,${W.gold},${W.goldDark})` }}/>
            <span style={{ fontSize:11, fontWeight:700, color:W.goldDark, fontFamily:SA, letterSpacing:"0.12em", textTransform:"uppercase" }}>
              {isSq ? "Mjetet" : "Tools"}
            </span>
            <div style={{ flex:1, height:1, background:`linear-gradient(to right,${W.goldBorder},transparent)` }}/>
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

