import { useState, useEffect } from "react";
import { BORDER, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS, SURFACE } from "../constants";
import { PageTitle } from "./primitives";

const DHIKR_PRESETS = [
  { label: "SubḥānAllāh",   arabic: "سُبْحَانَ اللَّهِ",   target: 33  },
  { label: "Alḥamdulillāh", arabic: "الْحَمْدُ لِلَّهِ",   target: 33  },
  { label: "Allāhu Akbar",  arabic: "اللَّهُ أَكْبَرُ",    target: 34  },
  { label: "Lā ilāha illAllāh", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", target: 100 },
  { label: "Astaghfirullāh", arabic: "أَسْتَغْفِرُ اللَّهَ", target: 100 },
  { label: "Ṣalawāt",       arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّد", target: 100 },
];

export default function TasbeehPage() {
  const saved = JSON.parse(localStorage.getItem("tasbeeh") || "{}");
  const [dhikrIdx, setDhikrIdx] = useState(saved.idx ?? 0);
  const [count, setCount]       = useState(0);
  const [rounds, setRounds]     = useState(0);
  const [flash2, setFlash2]     = useState(false);

  const dhikr = DHIKR_PRESETS[dhikrIdx];
  const pct   = Math.min(count / dhikr.target, 1);
  const R = 110, stroke = 8;
  const circ = 2 * Math.PI * R;
  const dash  = pct * circ;

  function persist(idx, c, r) {
    localStorage.setItem("tasbeeh", JSON.stringify({ idx, count: c, rounds: r }));
  }

  function tap() {
    if (navigator.vibrate) navigator.vibrate(18);
    const next = count + 1;
    if (next >= dhikr.target) {
      const newRounds = rounds + 1;
      setCount(0); setRounds(newRounds);
      setFlash2(true); setTimeout(() => setFlash2(false), 600);
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

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("tasbeeh") || "{}");
    if (s.idx !== undefined) {
      setDhikrIdx(s.idx);
      setCount(s.count ?? 0);
      setRounds(s.rounds ?? 0);
    }
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px", userSelect: "none" }}>
      <PageTitle icon="tasbeeh" title="Tasbeeh" sub="Digital dhikr counter" />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, justifyContent: "center" }}>
        {DHIKR_PRESETS.map((d, i) => (
          <button key={i} onClick={() => selectDhikr(i)} style={{
            padding: "7px 14px", borderRadius: 999, cursor: "pointer", fontSize: 11,
            fontFamily: SANS, fontWeight: 600, letterSpacing: "0.07em",
            border: `1px solid ${dhikrIdx === i ? GOLD : BORDER}`,
            background: dhikrIdx === i ? GREEN_L : "transparent",
            color: dhikrIdx === i ? GOLD : MUTED,
            transition: "all 0.18s",
          }}>{d.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ position: "relative", width: 260, height: 260 }}>
          <svg width="260" height="260" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
            <circle cx="130" cy="130" r={R} fill="none" stroke={BORDER} strokeWidth={stroke} />
            <circle cx="130" cy="130" r={R} fill="none"
              stroke={flash2 ? "#27ae60" : GOLD}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              style={{ transition: "stroke-dasharray 0.25s ease, stroke 0.3s" }}
            />
          </svg>

          <button
            onClick={tap}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 196, height: 196, borderRadius: "50%",
              background: flash2
                ? `radial-gradient(circle, #e8f5e8, #d4edda)`
                : `radial-gradient(circle, ${SURFACE}, #f0e8d0)`,
              border: `1px solid ${flash2 ? "#27ae60" : GOLD}60`,
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.15s",
              boxShadow: flash2
                ? `0 0 30px #27ae6040`
                : `0 4px 24px rgba(160,120,50,0.18), 0 1px 0 rgba(255,255,255,0.9) inset`,
              WebkitTapHighlightColor: "transparent",
              outline: "none",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "translate(-50%, -50%) scale(0.96)"}
            onMouseUp={e => e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"}
            onTouchStart={e => { e.currentTarget.style.transform = "translate(-50%, -50%) scale(0.96)"; e.preventDefault(); }}
            onTouchEnd={e => { e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"; tap(); e.preventDefault(); }}
          >
            <div style={{ fontSize: 56, fontWeight: 300, color: flash2 ? "#2ecc71" : TEXT, fontVariantNumeric: "tabular-nums", lineHeight: 1, fontFamily: SERIF, transition: "color 0.3s" }}>
              {count}
            </div>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              of {dhikr.target}
            </div>
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, color: GOLD, fontFamily: SERIF, marginBottom: 6, direction: "rtl", letterSpacing: "0.05em" }}>
            {dhikr.arabic}
          </div>
          <div style={{ fontSize: 13, color: MUTED, letterSpacing: "0.08em" }}>{dhikr.label}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, color: TEXT, fontFamily: SERIF }}>{rounds}</div>
            <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Rounds</div>
          </div>
          <div style={{ width: 1, height: 40, background: BORDER }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, color: TEXT, fontFamily: SERIF }}>{rounds * dhikr.target + count}</div>
            <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Total</div>
          </div>
          <div style={{ width: 1, height: 40, background: BORDER }} />
          <button onClick={reset} style={{
            background: "none", border: `1px solid ${BORDER}`, borderRadius: 999,
            cursor: "pointer", color: MUTED, fontSize: 11, fontWeight: 600,
            padding: "8px 16px", letterSpacing: "0.08em", fontFamily: SANS,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0392b"; e.currentTarget.style.color = "#c0392b"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
          >RESET</button>
        </div>
      </div>
    </div>
  );
}
