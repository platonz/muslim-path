import { useEffect, useState } from "react";
import i18n from "../i18n";
import Icon from "./Icon";
import { SURAH_NAMES } from "../lib/surahNames";

const C = {
  bg: "#F5F7F2",
  bg2: "#EAF1E8",
  surface: "#FFFFFF",
  ink: "#18231D",
  muted: "#6F7C73",
  soft: "#EEF4EC",
  line: "rgba(24,35,29,0.10)",
  green: "#176B4D",
  green2: "#0F4E3A",
  mint: "#DCECDF",
  gold: "#C99A35",
  peach: "#F5D7B8",
  rose: "#F1C8C3",
  blue: "#CDE4EF",
};

const SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const SERIF = "'Playfair Display', Georgia, serif";
const ARABIC = "'Amiri', serif";

const HM_SQ = ["Muharrem","Safer","Rabi'ul-Evvel","Rabi'ul-Ahir","Xhumadel-Ula","Xhumadel-Uhra","Rexheb","Sha'ban","Ramazan","Sheval","Dhul-Ka'de","Dhul-Hixhxhe"];
const HM_EN = ["Muharram","Safar","Rabi' al-Awwal","Rabi' al-Thani","Jumada al-Ula","Jumada al-Akhirah","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];
const DAY_SQ = ["E diel","E hene","E marte","E merkure","E enjte","E premte","E shtune"];
const DAY_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MON_SQ = ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nentor","dhjetor"];
const MON_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const DHIKR_PRESETS = [
  { label:"SubhanAllah", arabic:"\u0633\u064f\u0628\u0652\u062d\u064e\u0627\u0646\u064e \u0627\u0644\u0644\u064e\u0651\u0647\u0650", target:33 },
  { label:"Alhamdulillah", arabic:"\u0627\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u064e\u0651\u0647\u0650", target:33 },
  { label:"Allahu Akbar", arabic:"\u0627\u0644\u0644\u064e\u0651\u0647\u064f \u0623\u064e\u0643\u0652\u0628\u064e\u0631\u064f", target:34 },
  { label:"La ilaha illAllah", arabic:"\u0644\u064e\u0627 \u0625\u0650\u0644\u064e\u0670\u0647\u064e \u0625\u0650\u0644\u064e\u0651\u0627 \u0627\u0644\u0644\u064e\u0651\u0647\u064f", target:100 },
];

const PRAYERS = [
  { id:"sabahu", name:"Sabahu", en:"Dawn", sq:"Agim", fard:2, sunnah:2, bg:"linear-gradient(160deg,#23395B,#DFA36D)", sun:"#FFE0A3", window:[270,345] },
  { id:"dreka", name:"Dreka", en:"Midday", sq:"Mesdite", fard:4, sunnah:6, bg:"linear-gradient(160deg,#78B7D6,#F7F1D3)", sun:"#FFF8DA", window:[735,945] },
  { id:"iqindia", name:"Iqindia", en:"Afternoon", sq:"Pasdite", fard:4, sunnah:4, bg:"linear-gradient(160deg,#9EC6BC,#F0C778)", sun:"#F9C55E", window:[945,1110] },
  { id:"akshami", name:"Akshami", en:"Sunset", sq:"Perendim", fard:3, sunnah:2, bg:"linear-gradient(160deg,#7D3D73,#F28B45)", sun:"#FFD08A", window:[1110,1215] },
  { id:"jacia", name:"Jacia", en:"Night", sq:"Nate", fard:4, sunnah:4, bg:"linear-gradient(160deg,#111D45,#354D80)", sun:"#EAF2FF", window:[1215,1710] },
];

const FEATURES = [
  { id:"quran", icon:"quran", en:"Quran", sq:"Kurani", subEn:"Read and listen", subSq:"Lexo dhe degjo" },
  { id:"dua", icon:"dua", en:"Dua", sq:"Dua", subEn:"For daily moments", subSq:"Per cdo moment" },
  { id:"library", icon:"library", en:"Library", sq:"Biblioteka", subEn:"Books and articles", subSq:"Libra dhe artikuj" },
  { id:"audio", icon:"audio", en:"Lectures", sq:"Ligjerata", subEn:"Audio lessons", subSq:"Mesime audio" },
];

const TOOLS = [
  { id:"zakat", icon:"zakat", en:"Zakat", sq:"Zekati" },
  { id:"inheritance", icon:"inherit", en:"Will", sq:"Hiseja" },
  { id:"dates", icon:"dates", en:"Dates", sq:"Datat" },
];

function toHijri(y, m, d) {
  const jd = Math.floor((1461*(y+4800+Math.floor((m-14)/12)))/4)
    + Math.floor((367*(m-2-12*Math.floor((m-14)/12)))/12)
    - Math.floor((3*(Math.floor((y+4900+Math.floor((m-14)/12))/100)))/4)+d-32075;
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
    + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  return { year: 30 * n + j - 30, month, day: l3 - Math.floor((709 * month) / 24) };
}

function currentPrayerIndex() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  return PRAYERS.findIndex(p => {
    const [start, end] = p.window;
    return end > 1440 ? mins >= start || mins < end - 1440 : mins >= start && mins < end;
  });
}

function SectionTitle({ title, action, onAction }) {
  return (
    <div className="home-section-title">
      <h2>{title}</h2>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}

function PrayerCard({ prayer, active, isSq, onClick }) {
  return (
    <button className={`prayer-card ${active ? "is-active" : ""}`} onClick={onClick}>
      <div className="prayer-sky" style={{ background: prayer.bg }}>
        <span className="prayer-sun" style={{ background: prayer.sun }} />
        {prayer.id === "jacia" && <span className="prayer-stars">*  *    *</span>}
        {active && <span className="now-chip">{isSq ? "Tani" : "Now"}</span>}
      </div>
      <div className="prayer-body">
        <span>{isSq ? prayer.sq : prayer.en}</span>
        <strong>{prayer.name}</strong>
        <small>{prayer.fard} {isSq ? "farz" : "fard"} / {prayer.sunnah} sun.</small>
      </div>
    </button>
  );
}

function FeatureButton({ item, isSq, setPage }) {
  return (
    <button className="feature-button" onClick={() => setPage(item.id)}>
      <span className="feature-icon"><Icon name={item.icon} size={19} color={C.green} sw={1.8} /></span>
      <span>
        <strong>{isSq ? item.sq : item.en}</strong>
        <small>{isSq ? item.subSq : item.subEn}</small>
      </span>
    </button>
  );
}

function CompactPrayerList({ currentIdx, isSq, setPage }) {
  return (
    <div className="compact-prayers">
      {PRAYERS.map((prayer, idx) => (
        <button key={prayer.id} className={idx === currentIdx ? "active" : ""} onClick={() => setPage("namaz", prayer.id)}>
          <span>{isSq ? prayer.sq : prayer.en}</span>
          <strong>{prayer.name}</strong>
        </button>
      ))}
    </div>
  );
}

export default function Home({ quote, verseQuote, setPage, showInstall, onInstall }) {
  const isSq = i18n.language?.startsWith("sq");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 720);
  const [installDismissed, setInstallDismissed] = useState(() => !!localStorage.getItem("mp-install-dismissed"));

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const today = new Date();
  const hijri = toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const HM = isSq ? HM_SQ : HM_EN;
  const DAY = isSq ? DAY_SQ : DAY_EN;
  const MON = isSq ? MON_SQ : MON_EN;
  const currentIdx = Math.max(0, currentPrayerIndex());
  const verseRef = verseQuote?.src?.replace("Quran ", "") || "";
  const lastSurahNum = parseInt(localStorage.getItem("quranSurah") || "0", 10);
  const lastSurahName = lastSurahNum > 0 ? SURAH_NAMES[lastSurahNum] : null;

  const [dhikrState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tasbeeh") || "{}"); } catch { return {}; }
  });
  const dhikr = DHIKR_PRESETS[Math.min(dhikrState.idx ?? 0, DHIKR_PRESETS.length - 1)];
  const dhikrCount = dhikrState.count ?? 0;
  const dhikrProgress = Math.min(100, (dhikrCount / dhikr.target) * 100);
  const currentPrayer = PRAYERS[currentIdx] || PRAYERS[0];

  return (
    <div className="home-modern">
      <div className="home-shell">
        {!installDismissed && (showInstall || isMobile) && (
          <div className="install-card">
            <img src="/logo.png" alt="" />
            <div>
              <strong>{isSq ? "Shto Sunneti.com ne telefon" : "Add Sunneti.com to your phone"}</strong>
              <span>{isSq ? "Qasje me e shpejte cdo dite." : "Faster access for your daily routine."}</span>
            </div>
            {showInstall && <button onClick={onInstall}>{isSq ? "Instalo" : "Install"}</button>}
            <button className="plain" onClick={() => { setInstallDismissed(true); localStorage.setItem("mp-install-dismissed", "1"); }}>
              {isSq ? "Mbyll" : "Close"}
            </button>
          </div>
        )}

        <article className="book-flow">
          <header className="book-opening">
            <div className="brand-row">
              <span className="brand-mark">S</span>
              <span>Sunneti.com</span>
            </div>
            <p className="book-date">{DAY[today.getDay()]}, {MON[today.getMonth()]} {today.getDate()} / {hijri.day} {HM[hijri.month - 1]} {hijri.year}</p>
            <h1>{isSq ? "Sot ne Sunneti" : "Today in Sunneti"}</h1>
            <p className="opening-line">
              {isSq
                ? "Nje faqe e qete per namazin, Kuranin dhe perkujtimin e dites."
                : "A quiet page for prayer, Quran, and the remembrance of the day."}
            </p>
          </header>

          <section className="book-section current-prayer">
            <p className="kicker">{isSq ? "Namazi tani" : "Prayer now"}</p>
            <button onClick={() => setPage("namaz", currentPrayer.id)}>
              <span>{currentPrayer.name}</span>
              <small>{isSq ? currentPrayer.sq : currentPrayer.en} / {currentPrayer.fard} {isSq ? "farz" : "fard"} / {currentPrayer.sunnah} sun.</small>
            </button>
            <CompactPrayerList currentIdx={currentIdx} isSq={isSq} setPage={setPage} />
          </section>

          <section className="book-section scripture">
            <button className="verse-line" onClick={() => setPage("quran")}>
              <span>{isSq ? "Ajeti i dites" : "Verse of the day"} / {verseRef || "78:8"}</span>
              <q>{isSq && verseQuote?.sq ? verseQuote.sq : verseQuote?.text || "And We created you in pairs."}</q>
            </button>
            <div className="text-actions">
              <button onClick={() => setPage("quran")}>{isSq ? "Lexo Kuranin" : "Read Quran"}</button>
              <button onClick={() => setPage("dua")}>{isSq ? "Gjej nje dua" : "Find a dua"}</button>
              <button onClick={() => setPage("tasbeeh")}>{isSq ? "Dhikr" : "Dhikr"}</button>
            </div>
            {lastSurahName && <p className="continue-note">{isSq ? "Vazhdo" : "Continue"}: {lastSurahName}</p>}
          </section>

          {quote && (
            <section className="book-section hadith-flow">
              <p className="kicker">{isSq ? "Hadithi i dites" : "Hadith of the day"}</p>
              <p>"{isSq && quote.sq ? quote.sq : quote.text}"</p>
              <small>{quote.src}{quote.ref ? ` / ${quote.ref}` : ""}</small>
            </section>
          )}

          <section className="book-section dhikr-flow">
            <div>
              <p className="kicker">{isSq ? "Dhikr-u ditor" : "Daily dhikr"}</p>
              <p dir="rtl">{dhikr.arabic}</p>
              <small>{dhikr.label}</small>
            </div>
            <button onClick={() => setPage("tasbeeh")}>
              {dhikrCount}<small>/{dhikr.target}</small>
            </button>
          </section>

          <section className="book-section contents">
            <p className="kicker">{isSq ? "Tabela e permbajtjes" : "Table of contents"}</p>
            {[...FEATURES, ...TOOLS].map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}>
                <span>{isSq ? item.sq : item.en}</span>
                <small>{"subSq" in item ? (isSq ? item.subSq : item.subEn) : (isSq ? "Mjet" : "Tool")}</small>
              </button>
            ))}
          </section>
        </article>
      </div>

      <style>{`
        .home-modern {
          min-height: 100vh;
          padding: 28px 18px 96px;
          color: ${C.ink};
          background:
            linear-gradient(90deg, rgba(23,107,77,0.035) 1px, transparent 1px),
            linear-gradient(180deg, #FBFAF3 0%, #F4F1E6 100%);
          background-size: 42px 42px, auto;
          font-family: ${SANS};
        }
        .home-shell { width: min(860px, 100%); margin: 0 auto; }
        .install-card {
          display: flex; align-items: center; gap: 12px; padding: 12px 0; margin-bottom: 20px;
          border-bottom: 1px solid rgba(24,35,29,0.10);
        }
        .install-card img { width: 38px; height: 38px; object-fit: contain; border-radius: 10px; }
        .install-card div { flex: 1; min-width: 0; display: grid; gap: 2px; }
        .install-card strong { font-size: 13px; }
        .install-card span { font-size: 12px; color: ${C.muted}; }
        .install-card button {
          border: 0; border-radius: 999px; padding: 9px 14px; background: ${C.green}; color: white; font-weight: 700; cursor: pointer;
        }
        .install-card .plain { background: transparent; color: ${C.muted}; }
        .book-flow {
          background: rgba(255,253,246,0.72);
          border-left: 1px solid rgba(24,35,29,0.08);
          border-right: 1px solid rgba(24,35,29,0.08);
          padding: clamp(26px, 5vw, 56px);
          box-shadow: 0 24px 80px rgba(61,48,28,0.08);
        }
        .brand-row { display: inline-flex; align-items: center; gap: 8px; color: ${C.green}; font-weight: 800; margin-bottom: 26px; }
        .brand-mark {
          width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
          background: ${C.green}; color: white; font-family: ${SERIF}; font-size: 18px;
        }
        .book-opening { padding-bottom: 38px; border-bottom: 1px solid rgba(24,35,29,0.12); }
        .book-date { margin: 0 0 12px; color: ${C.gold}; font-size: 13px; font-weight: 800; }
        .book-opening h1 {
          margin: 0; max-width: 680px; font-family: ${SERIF};
          font-size: clamp(48px, 8vw, 92px); line-height: 0.94; letter-spacing: 0; color: ${C.ink};
        }
        .opening-line {
          margin: 22px 0 0; max-width: 560px; font-family: ${SERIF};
          color: ${C.muted}; font-size: clamp(19px, 2.6vw, 27px); line-height: 1.45;
        }
        .book-section {
          padding: 34px 0;
          border-bottom: 1px solid rgba(24,35,29,0.10);
        }
        .kicker {
          margin: 0 0 14px; color: ${C.green}; font-size: 12px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0;
        }
        .current-prayer > button {
          display: grid; gap: 6px; width: 100%; padding: 0; border: 0; background: transparent;
          text-align: left; cursor: pointer;
        }
        .current-prayer > button span { font-family: ${SERIF}; font-size: clamp(38px, 6vw, 64px); color: ${C.ink}; line-height: 1; }
        .current-prayer > button small { color: ${C.muted}; font-size: 15px; }
        .compact-prayers {
          display: flex; gap: 18px; overflow-x: auto; margin-top: 24px; padding-bottom: 6px;
        }
        .compact-prayers button {
          border: 0; border-bottom: 2px solid transparent; background: transparent; padding: 0 0 8px;
          cursor: pointer; text-align: left; min-width: 100px; color: ${C.muted};
        }
        .compact-prayers button.active { color: ${C.green}; border-bottom-color: ${C.green}; }
        .compact-prayers span { display: block; font-size: 11px; text-transform: uppercase; font-weight: 900; margin-bottom: 3px; }
        .compact-prayers strong { font-size: 15px; color: inherit; }
        .verse-line {
          display: block; width: 100%; padding: 0; border: 0; background: transparent; text-align: left; cursor: pointer;
        }
        .verse-line span { display: block; color: ${C.gold}; font-size: 13px; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; }
        .verse-line q {
          display: block; max-width: 720px; color: ${C.ink}; font-family: ${SERIF};
          font-size: clamp(28px, 4.2vw, 48px); line-height: 1.22;
        }
        .text-actions { display: flex; flex-wrap: wrap; gap: 14px 24px; margin-top: 28px; }
        .text-actions button {
          border: 0; border-bottom: 1px solid currentColor; padding: 0 0 3px; background: transparent;
          color: ${C.green}; font-weight: 900; cursor: pointer; font-size: 14px;
        }
        .continue-note { margin: 18px 0 0; color: ${C.muted}; }
        .hadith-flow p:not(.kicker) {
          margin: 0; max-width: 700px; font-family: ${SERIF}; color: ${C.ink};
          font-size: clamp(22px, 3vw, 34px); line-height: 1.35;
        }
        .hadith-flow small { display: block; margin-top: 14px; color: ${C.muted}; }
        .dhikr-flow { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 20px; }
        .dhikr-flow p[dir="rtl"] { margin: 0; font-family: ${ARABIC}; font-size: clamp(30px, 5vw, 48px); line-height: 1.4; }
        .dhikr-flow small { color: ${C.muted}; }
        .dhikr-flow button {
          border: 0; background: transparent; color: ${C.green}; cursor: pointer;
          font-size: clamp(34px, 6vw, 58px); font-weight: 900; line-height: 1;
        }
        .dhikr-flow button small { font-size: 15px; color: ${C.muted}; }
        .contents { display: grid; grid-template-columns: 1fr; gap: 0; border-bottom: 0; }
        .contents .kicker { margin-bottom: 8px; }
        .contents button {
          display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: baseline;
          width: 100%; padding: 18px 0; border: 0; border-bottom: 1px solid rgba(24,35,29,0.10);
          background: transparent; text-align: left; cursor: pointer;
        }
        .contents button span { font-family: ${SERIF}; font-size: clamp(24px, 3vw, 34px); color: ${C.ink}; }
        .contents button small { color: ${C.muted}; font-size: 13px; }
        button:hover { color: ${C.green}; }
        @media (max-width: 760px) {
          .home-modern { padding: 14px 10px 104px; }
          .book-flow { padding: 26px 18px; border-left: 0; border-right: 0; }
          .book-section { padding: 28px 0; }
          .dhikr-flow { grid-template-columns: 1fr; }
          .contents button { grid-template-columns: 1fr; gap: 3px; }
        }
        @media (max-width: 420px) {
          .install-card { align-items: flex-start; flex-wrap: wrap; }
          .install-card div { flex-basis: calc(100% - 52px); }
          .book-opening h1 { font-size: 44px; }
        }
      `}</style>
    </div>
  );
}
