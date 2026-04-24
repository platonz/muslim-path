import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// ─── DESIGN TOKENS (mdesign v2) ─────────────────────────────────────
const W = {
  bg:         "#FAF7EE",
  card:       "#FFFFFF",
  border:     "#E0D5C0",
  shadow:     "0 2px 12px rgba(26,25,21,0.07)",
  text:       "#1A1915",
  muted:      "#9A8E7A",
  mutedDark:  "#6B6050",
  gold:       "#B89D60",
  goldDark:   "#8A7235",
  goldBg:     "#FAF5E8",
  goldBorder: "rgba(184,157,96,0.30)",
  green:      "#2D5018",
  greenBg:    "#EDF5E3",
  greenBorder:"#D4E8BC",
};
const SR = "'Playfair Display', Georgia, serif";
const SA = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const ARABIC = "'Amiri', serif";

const DHIKR_PRESETS = [
  { label: "SubḥānAllāh",       trans: "Glory be to Allah",               arabic: "سُبْحَانَ اللَّهِ",            target: 33  },
  { label: "Alḥamdulillāh",     trans: "All praise to Allah",             arabic: "الْحَمْدُ لِلَّهِ",            target: 33  },
  { label: "Allāhu Akbar",      trans: "Allah is the Greatest",           arabic: "اللَّهُ أَكْبَرُ",             target: 34  },
  { label: "Lā ilāha illAllāh", trans: "There is no god but Allah",       arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",  target: 100 },
  { label: "Astaghfirullāh",    trans: "I seek forgiveness from Allah",   arabic: "أَسْتَغْفِرُ اللَّهَ",         target: 100 },
  { label: "Ṣalawāt",           trans: "Blessings upon the Prophet",      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّد", target: 100 },
];

function persist(idx, count, rounds) {
  try { localStorage.setItem("tasbeeh", JSON.stringify({ idx, count, rounds })); } catch {}
}

export default function Dhikr() {
  const { t, i18n } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");

  const [dhikrIdx, setDhikrIdx] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tasbeeh") || "{}").idx ?? 0; } catch { return 0; }
  });
  const [count, setCount]   = useState(0);
  const [rounds, setRounds] = useState(0);
  const [flash, setFlash]   = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("tasbeeh") || "{}");
      if (s.idx !== undefined) {
        setDhikrIdx(s.idx);
        setCount(s.count ?? 0);
        setRounds(s.rounds ?? 0);
      }
    } catch {}
  }, []);

  const dhikr = DHIKR_PRESETS[dhikrIdx];
  const pct   = Math.min(count / dhikr.target, 1);
  const R     = 90;
  const circ  = 2 * Math.PI * R;
  const done  = count >= dhikr.target;

  function tap() {
    if (done) return;
    if (navigator.vibrate) navigator.vibrate(18);
    const next = count + 1;
    if (next >= dhikr.target) {
      const newRounds = rounds + 1;
      setCount(0); setRounds(newRounds);
      setFlash(true); setTimeout(() => setFlash(false), 600);
      persist(dhikrIdx, 0, newRounds);
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    } else {
      setCount(next);
      persist(dhikrIdx, next, rounds);
    }
  }

  function selectDhikr(idx) {
    setDhikrIdx(idx); setCount(0); setRounds(0);
    persist(idx, 0, 0);
  }

  function reset() { setCount(0); setRounds(0); persist(dhikrIdx, 0, 0); }

  // Three main dhikrs shown as prominent tabs; rest accessible via overflow row
  const mainTabs  = DHIKR_PRESETS.slice(0, 3);
  const extraTabs = DHIKR_PRESETS.slice(3);

  return (
    <div style={{ background: W.bg, minHeight: "100vh", paddingBottom: 90 }}>
      {/* White page header */}
      <div style={{
        background: W.card, borderBottom: `1px solid ${W.border}`,
        padding: "16px 20px 14px",
      }}>
        <div style={{ fontFamily: SR, fontSize: 20, fontWeight: 600, color: W.text }}>
          {isSq ? "Tesbihe" : "Dhikr"}
        </div>
        <div style={{ fontSize: 12, color: W.muted, fontFamily: SA, marginTop: 2 }}>
          {isSq ? "Numëruesi dixhital i dhikrit" : "Digital dhikr counter"}
        </div>
      </div>

      {/* Main tabs (first 3 dhikrs) */}
      <div style={{ padding: "16px 20px 0", display: "flex", gap: 8 }}>
        {mainTabs.map((d, i) => {
          const active = dhikrIdx === i;
          return (
            <button key={i} onClick={() => selectDhikr(i)} style={{
              flex: 1, padding: "9px 4px", borderRadius: 10, border: "none",
              cursor: "pointer", fontFamily: SA, fontSize: 11, fontWeight: 600,
              background: active ? W.goldDark : W.card,
              color: active ? "#FFFFFF" : W.muted,
              boxShadow: W.shadow,
              transition: "background 0.18s, color 0.18s",
            }}>
              {d.label.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Extra presets row */}
      <div style={{ padding: "8px 20px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {extraTabs.map((d, i) => {
          const realIdx = i + 3;
          const active = dhikrIdx === realIdx;
          return (
            <button key={realIdx} onClick={() => selectDhikr(realIdx)} style={{
              padding: "6px 12px", borderRadius: 999, border: `1px solid ${active ? W.goldDark : W.border}`,
              cursor: "pointer", fontFamily: SA, fontSize: 10, fontWeight: active ? 600 : 400,
              background: active ? W.goldBg : "transparent",
              color: active ? W.goldDark : W.muted,
              transition: "all 0.18s",
            }}>
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Counter area */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "32px 40px 24px",
      }}>
        {/* SVG ring + tap button */}
        <div style={{ position: "relative", width: 220, height: 220, marginBottom: 28 }}>
          <svg width="220" height="220" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
            <circle cx="110" cy="110" r={R} fill="none" stroke={W.border} strokeWidth="8" />
            <circle
              cx="110" cy="110" r={R} fill="none"
              stroke={flash ? W.green : W.goldDark}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              style={{ transition: "stroke-dashoffset 0.25s ease, stroke 0.3s" }}
            />
          </svg>

          <button
            onClick={tap}
            onMouseDown={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(0.96)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; }}
            onTouchStart={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(0.96)"; e.preventDefault(); }}
            onTouchEnd={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; tap(); e.preventDefault(); }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: 168, height: 168, borderRadius: "50%",
              background: flash ? W.greenBg : W.card,
              border: `1px solid ${flash ? W.greenBorder : W.border}`,
              cursor: done ? "default" : "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 4,
              boxShadow: W.shadow,
              transition: "background 0.25s, border-color 0.25s",
              WebkitTapHighlightColor: "transparent",
              outline: "none",
            }}
          >
            <div style={{
              fontSize: 52, fontWeight: 600, lineHeight: 1,
              fontFamily: SR, color: flash ? W.green : W.goldDark,
              transition: "color 0.3s",
            }}>
              {count}
            </div>
            <div style={{ fontSize: 11, color: W.muted, fontFamily: SA }}>
              {isSq ? `nga ${dhikr.target}` : `of ${dhikr.target}`}
            </div>
          </button>
        </div>

        {/* Arabic text */}
        <div style={{
          fontFamily: ARABIC, fontSize: 30, color: W.text,
          direction: "rtl", textAlign: "center", marginBottom: 6,
          lineHeight: 1.7,
        }}>
          {dhikr.arabic}
        </div>
        <div style={{ fontSize: 14, color: W.mutedDark, fontFamily: SA, marginBottom: 6 }}>
          {dhikr.label}
        </div>
        <div style={{ fontSize: 12, color: W.muted, fontFamily: SA, marginBottom: 24 }}>
          {dhikr.trans}
        </div>

        {/* Done state */}
        {done && (
          <div style={{
            fontSize: 13, fontWeight: 600, color: W.green,
            background: W.greenBg, padding: "10px 24px",
            borderRadius: 10, border: `1px solid ${W.greenBorder}`,
            marginBottom: 16, fontFamily: SA,
          }}>
            {isSq ? "Alhamdulilah — kompletuar ✓" : "Alhamdulillah — complete ✓"}
          </div>
        )}
        {!done && (
          <div style={{ fontSize: 12, color: W.muted, fontFamily: SA, marginBottom: 16 }}>
            {isSq ? "Trokitni rrathën për të numëruar" : "Tap the circle to count"}
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 28,
          padding: "16px 24px",
          background: W.card, border: `1px solid ${W.border}`,
          borderRadius: 14, boxShadow: W.shadow,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: W.text, fontFamily: SR }}>{rounds}</div>
            <div style={{ fontSize: 10, color: W.muted, fontFamily: SA, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
              {isSq ? "raunde" : "Rounds"}
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: W.border }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: W.text, fontFamily: SR }}>
              {rounds * dhikr.target + count}
            </div>
            <div style={{ fontSize: 10, color: W.muted, fontFamily: SA, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
              {isSq ? "gjithsej" : "Total"}
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: W.border }} />
          <button onClick={reset} style={{
            background: "none", border: `1px solid ${W.border}`,
            borderRadius: 999, cursor: "pointer",
            color: W.muted, fontSize: 11, fontWeight: 500,
            padding: "6px 14px", fontFamily: SA,
            transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#8A2020"; e.currentTarget.style.color = "#8A2020"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = W.border; e.currentTarget.style.color = W.muted; }}
          >
            {isSq ? "Rinis" : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}
