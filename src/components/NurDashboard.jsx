import { useState, useEffect, useRef } from "react";
import "../styles/nur-dashboard.css";
import Icon from "./Icon";
import { SHELVES } from "./LibraryRoom";
import { pageToUrl } from "../lib/routing";
import { LIBRARY } from "../data/library";
import { LECTURES } from "../data/lectures";

const GOLD_ACCENT = "#c9a24b";
const DISPLAY_FONT = "'Bricolage Grotesque', sans-serif";
const BODY_FONT = "'Hanken Grotesk', sans-serif";
const MONO_FONT = "'Space Mono', monospace";

const VARS_LIGHT = {
  "--paper": "#fbf8f1", "--surface": "#ffffff", "--cream": "#f3eee2", "--sand": "#e9ddc9",
  "--green": "#1f3d33", "--green2": "#16332a", "--gold": GOLD_ACCENT, "--clay": "#d1743e",
  "--ink": "#2c2620", "--ink-soft": "#71695b", "--line": "rgba(44,38,32,0.09)", "--line2": "rgba(44,38,32,0.15)",
};
const VARS_DARK = {
  "--paper": "#1e1811", "--surface": "#272019", "--cream": "#2f2820", "--sand": "#3a3126",
  "--green": "#254a3d", "--green2": "#1a382e", "--gold": GOLD_ACCENT, "--clay": "#dc8551",
  "--ink": "#f2ece1", "--ink-soft": "#a99f8f", "--line": "rgba(255,255,255,0.09)", "--line2": "rgba(255,255,255,0.16)",
};

const HADITHS = [
  { text: "Më të mirët prej jush janë ata që e mësojnë Kuranin dhe ua mësojnë të tjerëve.", src: "— Pejgamberi Muhammed ﷺ (Buhari)" },
  { text: "Kërkimi i dijes është obligim për çdo mysliman.", src: "— Pejgamberi Muhammed ﷺ (Ibn Maxhe)" },
  { text: "Kush ndjek një rrugë për të kërkuar dije, Allahu ia lehtëson rrugën për në Xhenet.", src: "— Pejgamberi Muhammed ﷺ (Muslim)" },
];

const ADHURIMI_IDS = ["namaz", "howpray", "dua", "asma", "tasbeeh"];
const LEXIMI_IDS = ["quran", "library", "audio"];
const LEXIMI_META = {
  quran: {
    desc: "Teksti i plotë arabisht me përkthim shqip dhe tefsir, sure më sure.",
    stats: ["114 sure", "6.236 ajete"],
  },
  library: {
    desc: "Libra islamë, tefsir dhe revista në shqip — lexoji direkt në aplikacion.",
    stats: [`${LIBRARY.length} tituj`, `${LIBRARY.filter(b => b.cat === "Shqip").length} pdf shqip`],
  },
  audio: {
    desc: "Ligjërata të dëgjueshme në shqip mbi dijen, moralin dhe jetën e besimtarit.",
    stats: [`${LECTURES.length} ligjërata`, "audio mp3"],
  },
};
const VEGLA_IDS = ["zakat", "inheritance", "calendar", "dates"];
const BOOKS = Object.fromEntries(SHELVES.flatMap(s => s.books.map(b => [b.id, b])));

function NavRow({ icon, label, active, href, onClick }) {
  return (
    <a
      className="nur-navrow"
      href={href}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px",
        borderRadius: 12, cursor: "pointer", textAlign: "left", fontFamily: BODY_FONT, fontSize: 14,
        fontWeight: 600, border: active ? "1px solid var(--line)" : "1px solid transparent",
        background: active ? "var(--cream)" : "transparent", color: active ? "var(--green)" : "var(--ink-soft)",
        textDecoration: "none", boxSizing: "border-box",
      }}
    >
      <span style={{ display: "grid", placeItems: "center", width: 20, height: 20 }}>
        <Icon name={icon} size={19} color={active ? "var(--green)" : "var(--ink-soft)"} />
      </span>
      <span>{label}</span>
    </a>
  );
}

export default function NurDashboard({ navigate, onSearch, authUser, onAuthClick, duaFavs }) {
  const [w, setW] = useState(() => window.innerWidth);
  const [dark, setDark] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hadithI, setHadithI] = useState(0);
  const contentRef = useRef(null);

  // Kept fresh on every render so the one-time effect below can call the
  // latest onSearch without re-binding window listeners on every App re-render.
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        onSearchRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function goProfile() {
    setDrawerOpen(false);
    if (authUser) navigate("profile"); else onAuthClick();
  }
  function goBook(id) {
    setDrawerOpen(false);
    navigate(id);
  }
  function goHome() {
    setDrawerOpen(false);
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  const showRail = w >= 1024;
  const rightInline = w >= 1240;
  const sm = w < 640;
  const heroRow = w >= 720;
  const vars = dark ? VARS_DARK : VARS_LIGHT;
  const hi = ((hadithI % HADITHS.length) + HADITHS.length) % HADITHS.length;

  const rootStyle = { minHeight: "100vh", background: dark ? "#0f0b07" : "#221812", padding: showRail ? "26px" : "0", fontFamily: BODY_FONT, color: "var(--ink)", ...vars };
  const shellStyle = { width: "100%", maxWidth: rightInline ? 1560 : 1200, margin: "0 auto", height: showRail ? "calc(100vh - 52px)" : "100vh", background: "var(--paper)", borderRadius: showRail ? 28 : 0, overflow: "hidden", display: "flex", position: "relative", boxShadow: showRail ? "0 40px 90px -40px rgba(0,0,0,0.6)" : "none" };
  const railBase = { background: "var(--paper)", display: "flex", flexDirection: "column", padding: "22px 16px", overflowY: "auto" };
  const sidebarStyle = showRail
    ? { ...railBase, width: 252, flex: "none", height: "100%", borderRight: "1px solid var(--line)" }
    : { ...railBase, position: "absolute", top: 0, left: 0, zIndex: 80, width: 272, height: "100%", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)", transform: drawerOpen ? "none" : "translateX(-112%)", transition: "transform .28s cubic-bezier(.25,.46,.45,.94)" };
  const topbarStyle = { position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", gap: sm ? 10 : 16, padding: sm ? "14px 16px" : "18px 26px", background: dark ? "rgba(30,24,17,0.86)" : "rgba(251,248,241,0.86)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" };
  const bodyPadStyle = { padding: sm ? "16px 14px 30px" : showRail ? "26px 30px 40px" : "22px 22px 34px" };
  const bodyRowStyle = { display: "flex", flexDirection: rightInline ? "row" : "column", gap: 24, alignItems: "flex-start" };
  const heroStyle = { position: "relative", overflow: "hidden", borderRadius: 24, background: dark ? "linear-gradient(105deg,#3d3122 0%,#332921 44%,#2b2118 60%,#241a10 100%)" : "linear-gradient(105deg,#f7efe0 0%,#f3e6cf 44%,#efd9b4 60%,#e7c79a 100%)", display: "flex", flexDirection: heroRow ? "row" : "column", minHeight: heroRow ? 300 : "auto", boxShadow: "0 20px 40px -28px rgba(80,54,24,0.5)" };
  const heroTitleColor = dark ? "#f2ece1" : "#2c2013";
  const heroSubColor = dark ? "#c7b9a0" : "#6b5a41";
  const heroEyebrowColor = dark ? "#8fb56a" : "#47602e";
  const heroOutlineBtnStyle = dark
    ? { background: "rgba(255,255,255,0.08)", color: "#f2ece1", border: "1px solid rgba(255,255,255,0.22)" }
    : { background: "rgba(255,255,255,0.65)", color: "#2c2013", border: "1px solid rgba(120,90,50,0.28)" };
  const heroTitleSize = w >= 1100 ? 42 : sm ? 32 : 38;
  const rightColStyle = rightInline ? { width: 340, flex: "none" } : { width: "100%" };
  const rightInnerStyle = rightInline ? { display: "flex", flexDirection: "column", gap: 18 } : { display: "grid", gridTemplateColumns: w >= 640 ? "repeat(auto-fit,minmax(280px,1fr))" : "1fr", gap: 18 };
  const pathGridStyle = { display: "grid", gridTemplateColumns: sm ? "repeat(2,1fr)" : rightInline ? "repeat(5,1fr)" : "repeat(auto-fill,minmax(170px,1fr))", gap: 14 };
  const tileGridStyle = { display: "grid", gridTemplateColumns: sm ? "1fr" : "repeat(auto-fit, minmax(215px, 1fr))", gap: 14 };
  const groupLabelStyle = { fontFamily: BODY_FONT, fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", color: "var(--ink-soft)", textTransform: "uppercase", padding: "16px 12px 6px" };
  const sectionTitleStyle = { fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 21, letterSpacing: "-0.02em", margin: "0 0 15px", color: "var(--ink)" };
  const panelStyle = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: 20 };

  const goldPattern = "radial-gradient(circle at 100% 100%, transparent 30%, rgba(255,255,255,0.10) 31% 33%, transparent 34%), radial-gradient(circle at 0 0, transparent 30%, rgba(255,255,255,0.10) 31% 33%, transparent 34%)";

  return (
    <div className="nur-dash" style={rootStyle}>
      {!showRail && drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(26,18,11,0.45)", backdropFilter: "blur(3px)" }} />
      )}

      <div style={shellStyle}>
        {/* ============ SIDEBAR ============ */}
        <div style={sidebarStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 8px 22px" }}>
            <img src="/logo.png" alt="" style={{ width: 40, height: 40, borderRadius: 12, objectFit: "cover", flex: "none", boxShadow: "0 6px 16px -6px rgba(31,61,51,0.6)" }} />
            <span>
              <span style={{ display: "block", fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1 }}>Sunneti</span>
              <span style={{ display: "block", fontFamily: BODY_FONT, fontSize: 11, color: "var(--ink-soft)", marginTop: 3 }}>Biblioteka Islame</span>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, overflowY: "auto" }}>
            <NavRow icon="home" label="Kreu" active href={pageToUrl("home")} onClick={goHome} />
            {SHELVES.map(section => (
              <div key={section.label}>
                <div style={groupLabelStyle}>{section.label}</div>
                {section.books.map(b => (
                  <NavRow key={b.id} icon={b.icon} label={b.title} href={pageToUrl(b.id)} onClick={() => goBook(b.id)} />
                ))}
              </div>
            ))}
            <div style={groupLabelStyle}>&nbsp;</div>
            <NavRow icon="user" label="Profili" href={pageToUrl("profile")} onClick={goProfile} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, padding: "10px 6px 4px", borderTop: "1px solid var(--line)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: BODY_FONT, fontWeight: 600, fontSize: 13.5, color: "var(--ink-soft)" }}>
              {dark
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M21 13A8.5 8.5 0 0 1 11 3a7 7 0 1 0 10 10Z" /></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" /></svg>}
              {dark ? "E errët" : "E çelët"}
            </span>
            <button
              onClick={() => setDark(d => !d)}
              aria-label="Ndrysho pamjen"
              style={{ width: 44, height: 25, borderRadius: 999, border: "none", cursor: "pointer", padding: 3, display: "flex", justifyContent: dark ? "flex-end" : "flex-start", background: dark ? "var(--green)" : "var(--sand)", transition: "background .2s ease" }}
            >
              <span style={{ width: 19, height: 19, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "all .2s ease" }} />
            </button>
          </div>
        </div>

        {/* ============ CONTENT COLUMN ============ */}
        <div ref={contentRef} style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {/* topbar */}
          <div style={topbarStyle}>
            {!showRail && (
              <button className="nur-iconbtn" onClick={() => setDrawerOpen(true)} aria-label="Menu" style={{ flex: "none", width: 42, height: 42, borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", display: "grid", placeItems: "center" }}>
                <Icon name="menu" size={19} color="var(--ink)" />
              </button>
            )}
            <button className="nur-listrow" onClick={onSearch} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: sm ? "10px 14px" : "11px 18px", maxWidth: 560, cursor: "pointer", textAlign: "left" }}>
              <Icon name="search" size={17} color="var(--ink-soft)" />
              <span style={{ flex: 1, minWidth: 0, fontFamily: BODY_FONT, fontSize: 14, color: "var(--ink-soft)" }}>Kërko një libër, faqe ose lutje…</span>
              <span style={{ flex: "none", fontFamily: MONO_FONT, fontSize: 11, color: "var(--ink-soft)", border: "1px solid var(--line2)", borderRadius: 6, padding: "2px 6px" }}>⌘ K</span>
            </button>
            <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12 }}>
              <a className="nur-iconbtn" aria-label="Profili" href={pageToUrl("profile")} onClick={(e) => { e.preventDefault(); goProfile(); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", padding: 0, borderRadius: 999, textDecoration: "none" }}>
                <span style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(150deg,#8a6a44,#5c4028)", display: "grid", placeItems: "center", color: "#f0e2c8", fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 15, boxShadow: "inset 0 0 0 2px var(--surface), 0 0 0 1px var(--line)" }}>
                  {authUser?.email ? authUser.email[0].toUpperCase() : <Icon name="user" size={18} color="#f0e2c8" />}
                </span>
                <Icon name="chevronDown" size={14} color="var(--ink-soft)" />
              </a>
            </div>
          </div>

          {/* body */}
          <div style={bodyPadStyle}>
            <div style={bodyRowStyle}>
              {/* MAIN */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 26 }}>

                {/* HERO */}
                <div style={heroStyle}>
                  <div style={{ position: "relative", zIndex: 2, flex: 1.15, minWidth: 0, padding: sm ? "26px 22px" : "38px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: BODY_FONT, fontSize: 13.5, fontWeight: 600, color: heroEyebrowColor }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 20A7 7 0 0 1 4 13c5 0 7 2 7 7Z" /><path d="M13 20a7 7 0 0 1 7-7c0 5-2 7-7 7Z" /><path d="M12 20v-6" /></svg>
                      Es-selamu alejkum, kërkues i dijes
                    </span>
                    <h1 style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: heroTitleSize, lineHeight: 1.02, letterSpacing: "-0.03em", margin: 0, color: heroTitleColor }}>
                      Mëso. Reflekto.<br />Afrohu te <span style={{ color: "var(--green)" }}>Allahu</span>
                    </h1>
                    <p style={{ fontFamily: BODY_FONT, fontSize: 15, lineHeight: 1.55, color: heroSubColor, margin: 0, maxWidth: 420 }}>
                      Kurani, duatë, adhurimi dhe veglat islame — të gjitha në një vend, në shqip.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
                      <a className="nur-btn-primary" href={pageToUrl("quran")} onClick={(e) => { e.preventDefault(); navigate("quran"); }} style={{ display: "flex", alignItems: "center", gap: 9, background: "var(--green)", color: "#f2ece1", border: "none", borderRadius: 14, padding: "14px 22px", fontFamily: BODY_FONT, fontWeight: 700, fontSize: 14.5, cursor: "pointer", boxShadow: "0 12px 24px -12px rgba(31,61,51,0.8)", textDecoration: "none" }}>
                        Lexo Kuranin <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M9 6l6 6-6 6" /></svg>
                      </a>
                      <a className="nur-btn-outline" href={pageToUrl("library")} onClick={(e) => { e.preventDefault(); navigate("library"); }} style={{ display: "flex", alignItems: "center", gap: 9, ...heroOutlineBtnStyle, borderRadius: 14, padding: "14px 20px", fontFamily: BODY_FONT, fontWeight: 700, fontSize: 14.5, cursor: "pointer", backdropFilter: "blur(4px)", textDecoration: "none" }}>
                        Eksploro Bibliotekën <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
                      </a>
                    </div>
                  </div>
                  <div style={{ position: "relative", flex: heroRow ? 1 : "none", minWidth: 0, height: heroRow ? "auto" : 150, minHeight: heroRow ? 280 : 150, overflow: "hidden", borderRadius: heroRow ? "0 24px 24px 0" : 0 }}>
                    <img src="/images/nur-hero-quran-stand.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "right center" }} />
                  </div>
                </div>

                {/* ADHURIMI — worship, quick-access cards */}
                <div>
                  <h2 style={sectionTitleStyle}>Adhurimi</h2>
                  <div style={pathGridStyle}>
                    {ADHURIMI_IDS.map((id, i) => {
                      const b = BOOKS[id];
                      return (
                        <a key={id} className="nur-card" href={pageToUrl(id)} onClick={(e) => { e.preventDefault(); navigate(id); }} style={{ display: "flex", flexDirection: "column", gap: 15, alignItems: "flex-start", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: 16, cursor: "pointer", minHeight: 140, textDecoration: "none", boxSizing: "border-box", animation: "nurDashUp .5s cubic-bezier(.25,.46,.45,.94) both", animationDelay: (0.05 + i * 0.06).toFixed(2) + "s" }}>
                          <span style={{ width: 52, height: 52, borderRadius: 16, display: "grid", placeItems: "center", background: `linear-gradient(150deg, ${b.c[0]}, ${b.c[1]})`, boxShadow: `0 8px 14px -6px ${b.c[2]}` }}>
                            <Icon name={b.icon} size={24} color="#f2ece1" />
                          </span>
                          <span style={{ display: "block", textAlign: "left", width: "100%" }}>
                            <span style={{ display: "block", fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 16.5, letterSpacing: "-0.01em", color: "var(--ink)" }}>{b.title}</span>
                            <span style={{ display: "block", fontFamily: MONO_FONT, fontSize: 11, letterSpacing: "0.06em", color: "var(--ink-soft)", marginTop: 4, textTransform: "uppercase" }}>{b.sub}</span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* LEXIMI — reading, big tiles */}
                <div>
                  <h2 style={sectionTitleStyle}>Leximi</h2>
                  <div style={tileGridStyle}>
                    {LEXIMI_IDS.map((id, i) => {
                      const b = BOOKS[id];
                      const m = LEXIMI_META[id];
                      return (
                        <a key={id} className="nur-tile" href={pageToUrl(id)} onClick={(e) => { e.preventDefault(); navigate(id); }} style={{ position: "relative", overflow: "hidden", display: "flex", border: "none", borderRadius: 18, minHeight: 216, cursor: "pointer", padding: 0, textDecoration: "none", boxShadow: "0 14px 28px -20px rgba(40,26,14,0.5)", animation: "nurDashPop .5s cubic-bezier(.25,.46,.45,.94) both", animationDelay: (0.05 + i * 0.06).toFixed(2) + "s" }}>
                          <span style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${b.c[0]} 0%, ${b.c[1]} 55%, ${b.c[2]} 120%)` }} />
                          <span style={{ position: "absolute", inset: 0, backgroundImage: goldPattern, backgroundSize: "26px 26px", opacity: 0.7 }} />
                          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,12,6,0) 18%, rgba(20,12,6,0.8) 100%)" }} />
                          <span style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left", padding: 16, boxSizing: "border-box" }}>
                            <span style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                              <span style={{ width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(3px)" }}>
                                <Icon name={b.icon} size={21} color="#fff" />
                              </span>
                              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(3px)", display: "grid", placeItems: "center", color: "#fff" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M9 6l6 6-6 6" /></svg>
                              </span>
                            </span>
                            <span style={{ display: "block" }}>
                              <span style={{ display: "block", fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 19, letterSpacing: "-0.01em", color: "#fff" }}>{b.title}</span>
                              <span style={{ display: "block", fontFamily: BODY_FONT, fontSize: 12.5, lineHeight: 1.45, color: "rgba(255,255,255,0.86)", marginTop: 5, maxWidth: 300 }}>{m.desc}</span>
                              <span style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 11 }}>
                                {m.stats.map(s => (
                                  <span key={s} style={{ fontFamily: MONO_FONT, fontSize: 10.5, letterSpacing: "0.05em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.26)", borderRadius: 999, padding: "3px 9px" }}>{s}</span>
                                ))}
                              </span>
                            </span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* HADITH BAR */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18, padding: "16px 18px" }}>
                  <span style={{ flex: "none", width: 44, height: 48, borderRadius: 12, background: "var(--cream)", display: "grid", placeItems: "center", color: "var(--gold)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v13.5H5.5A1.5 1.5 0 0 0 4 19Z" /><path d="M4 19v.5A1.5 1.5 0 0 0 5.5 21H19" /></svg>
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: BODY_FONT, fontSize: 14.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 }}>{HADITHS[hi].text}</div>
                    <div style={{ fontFamily: BODY_FONT, fontSize: 12.5, color: "var(--ink-soft)", marginTop: 3 }}>{HADITHS[hi].src}</div>
                  </div>
                  <div style={{ flex: "none", display: "flex", gap: 8 }}>
                    <button className="nur-iconbtn" onClick={() => setHadithI(i => i - 1)} aria-label="Hadithi i mëparshëm" style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink-soft)", cursor: "pointer", display: "grid", placeItems: "center" }}>
                      <Icon name="chevronLeft" size={16} color="var(--ink-soft)" />
                    </button>
                    <button className="nur-iconbtn" onClick={() => setHadithI(i => i + 1)} aria-label="Hadithi tjetër" style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink-soft)", cursor: "pointer", display: "grid", placeItems: "center" }}>
                      <Icon name="chevron" size={16} color="var(--ink-soft)" />
                    </button>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR */}
              <div style={rightColStyle}>
                <div style={rightInnerStyle}>

                  {/* Vegla e shpejtë — quick tools */}
                  <div style={panelStyle}>
                    <span style={{ display: "block", fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: 4 }}>Vegla e shpejtë</span>
                    <span style={{ display: "block", fontFamily: BODY_FONT, fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 14 }}>Llogaritjet dhe kalendari</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {VEGLA_IDS.map(id => {
                        const b = BOOKS[id];
                        return (
                          <a key={id} className="nur-listrow" href={pageToUrl(id)} onClick={(e) => { e.preventDefault(); navigate(id); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "9px 8px", borderRadius: 12, border: "none", background: "transparent", cursor: "pointer", textAlign: "left", textDecoration: "none", boxSizing: "border-box" }}>
                            <span style={{ width: 34, height: 34, borderRadius: 10, flex: "none", display: "grid", placeItems: "center", background: `linear-gradient(150deg, ${b.c[0]}, ${b.c[1]})` }}>
                              <Icon name={b.icon} size={16} color="#f2ece1" />
                            </span>
                            <span style={{ flex: 1, minWidth: 0, fontFamily: BODY_FONT, fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>{b.title}</span>
                            <Icon name="chevron" size={13} color="var(--ink-soft)" />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* ayah card */}
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: "26px 22px 24px", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", background: "linear-gradient(165deg,#2b453b 0%,#233a32 40%,#1c2b26 100%)" }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%, rgba(201,162,75,0.22), transparent 60%)" }} />
                    <div dir="rtl" style={{ position: "relative", zIndex: 2, fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: 36, color: "#f0e4c6", lineHeight: 1.6, marginBottom: 16 }}>رَبِّ زِدْنِي عِلْمًا</div>
                    <div style={{ position: "relative", zIndex: 2, fontFamily: DISPLAY_FONT, fontWeight: 600, fontSize: 16, color: "#f2ece1", lineHeight: 1.4 }}>&ldquo;Zoti im, shtomë dijen.&rdquo;</div>
                    <div style={{ position: "relative", zIndex: 2, fontFamily: BODY_FONT, fontSize: 12.5, color: "rgba(242,236,225,0.62)", marginTop: 12 }}>— Sureja Ta Ha (20:114)</div>
                  </div>

                  {/* saved duas */}
                  <div style={panelStyle}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>
                          Të ruajtura
                          <Icon name="heartFill" size={14} color="var(--clay)" />
                        </span>
                        <span style={{ display: "block", fontFamily: BODY_FONT, fontSize: 12.5, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.45 }}>
                          {duaFavs && duaFavs.size ? `${duaFavs.size} lutje të ruajtura` : "Ende s'ke ruajtur asnjë lutje"}
                        </span>
                      </div>
                      <span style={{ flex: "none", width: 44, height: 44, borderRadius: "16px 16px 16px 4px", background: "linear-gradient(150deg,var(--green),var(--green2))", display: "grid", placeItems: "center", color: "var(--gold)" }}>
                        <Icon name="heart" size={20} color="var(--gold)" />
                      </span>
                    </div>
                    <a className="nur-btn-gold" href={pageToUrl("dua")} onClick={(e) => { e.preventDefault(); navigate("dua"); }} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(90deg,var(--gold),#dcb45f)", color: "#3a2c0c", border: "none", borderRadius: 12, padding: "11px 18px", fontFamily: BODY_FONT, fontWeight: 700, fontSize: 13.5, cursor: "pointer", textDecoration: "none" }}>
                      Shiko Duatë <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M9 6l6 6-6 6" /></svg>
                    </a>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
