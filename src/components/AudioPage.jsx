import { BORDER, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS, SURFACE } from "../constants";
import { PageTitle } from "./primitives";

export default function AudioPage({ lectures, current, playing, play, skip, seek, progress, duration, fmt, audioRef }) {
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="audio" title="Ligjerata Islame" sub="Leksione dhe mësime nga studiuesit Islam" />

      {current && (
        <div style={{ background: `linear-gradient(145deg,${SURFACE},#f0e8d0)`, border: `1px solid ${GOLD}50`, padding: "24px 28px", marginBottom: 24, borderRadius: 16, boxShadow: `0 4px 24px rgba(160,120,50,0.12)` }}>
          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6 }}>Now Playing</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: TEXT, fontFamily: SERIF, letterSpacing: "0.03em", marginBottom: 20 }}>{current.title}</div>

          <div onClick={seek} style={{ height: 3, background: BORDER, cursor: "pointer", marginBottom: 10, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: GOLD, transition: "width 0.3s" }} />
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: GOLD }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{fmt(progress)}</span>
            <span style={{ fontSize: 11, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{fmt(duration)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
            <button onClick={() => skip(-1)} title="Previous track" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 18 }}>⏮</button>
            <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5); }} title="-5 seconds" style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: 2,
              cursor: "pointer", color: MUTED, fontSize: 11, fontWeight: 700,
              padding: "4px 8px", letterSpacing: "0.04em", fontFamily: SANS,
            }}>−5s</button>
            <button onClick={() => play(current)} style={{
              width: 52, height: 52, borderRadius: "50%", border: `1px solid ${GOLD}`,
              background: playing ? GOLD : "transparent", color: playing ? "#f0e6ce" : GOLD,
              cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>{playing ? "⏸" : "▶"}</button>
            <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5); }} title="+5 seconds" style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: 2,
              cursor: "pointer", color: MUTED, fontSize: 11, fontWeight: 700,
              padding: "4px 8px", letterSpacing: "0.04em", fontFamily: SANS,
            }}>+5s</button>
            <button onClick={() => skip(1)} title="Next track" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 18 }}>⏭</button>
          </div>
        </div>
      )}

      <div style={{ border: `1px solid ${BORDER}` }}>
        {lectures.map((l, i) => {
          const isActive = current?.id === l.id;
          return (
            <div key={l.id} onClick={() => play(l)} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 20px", cursor: "pointer",
              background: isActive ? GREEN_L : "transparent",
              borderBottom: i < lectures.length - 1 ? `1px solid ${BORDER}` : "none",
              borderLeft: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#faf5ec"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${isActive ? GOLD : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isActive && playing
                  ? <span style={{ fontSize: 10, color: GOLD }}>▶</span>
                  : <span style={{ fontSize: 11, color: MUTED }}>{l.id}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: isActive ? TEXT : MUTED, fontWeight: isActive ? 500 : 400, letterSpacing: "0.02em" }}>{l.title}</div>
              </div>
              {isActive && playing && (
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 16 }}>
                  {[1,2,3].map(b => (
                    <div key={b} style={{ width: 3, background: GOLD, borderRadius: 1, height: `${8 + b * 4}px`, animation: `bounce${b} 0.8s ease-in-out infinite alternate` }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes bounce1 { from { height: 6px } to { height: 14px } }
        @keyframes bounce2 { from { height: 10px } to { height: 18px } }
        @keyframes bounce3 { from { height: 4px } to { height: 12px } }
      `}</style>
    </div>
  );
}
