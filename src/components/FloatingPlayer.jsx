import { BORDER, GOLD, TEXT, MUTED, SERIF, SURFACE } from "../constants";

export default function FloatingPlayer({ current, playing, play, togglePlay, skip, stop, progress, duration, fmt, navigate, minimized, setMinimized }) {
  const onPlayPause = current?.type === "quran" ? togglePlay : () => play(current);
  if (!current) return null;
  const pct = duration ? (progress / duration) * 100 : 0;

  if (minimized) {
    return (
      <div
        onClick={() => setMinimized(false)}
        title="Restore player"
        style={{
          position: "fixed", bottom: 8, right: 16, zIndex: 300,
          display: "flex", alignItems: "center", gap: 10,
          background: `linear-gradient(135deg,${SURFACE},#f0e8d0)`,
          border: `1px solid ${playing ? GOLD + "70" : BORDER}`,
          borderRadius: 999,
          boxShadow: `0 4px 20px rgba(160,120,50,0.18)`,
          padding: "6px 14px 6px 8px",
          cursor: "pointer",
          maxWidth: "calc(100vw - 32px)",
          animation: "slideUp 0.22s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0, width: 28, height: 28 }}>
          <svg viewBox="0 0 28 28" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="14" cy="14" r="12" fill="none" stroke={BORDER} strokeWidth="2" />
            <circle cx="14" cy="14" r="12" fill="none" stroke={GOLD} strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 12}`}
              strokeDashoffset={`${2 * Math.PI * 12 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.4s linear" }} />
          </svg>
          <img src="/logo.png" alt="" style={{ position: "absolute", inset: 4, width: 20, height: 20, objectFit: "contain", opacity: playing ? 0.9 : 0.5 }} />
        </div>

        <div style={{ minWidth: 0, maxWidth: 160 }}>
          <div style={{ fontSize: 9, color: playing ? GOLD : MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>{playing ? "Playing" : "Paused"}</div>
          <div style={{ fontSize: 12, color: TEXT, fontFamily: SERIF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{current.title}</div>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onPlayPause(); }}
          title={playing ? "Pause" : "Resume"}
          style={{
            width: 28, height: 28, borderRadius: "50%",
            border: `1px solid ${GOLD}`, background: playing ? GOLD : "transparent",
            color: playing ? "#f0e6ce" : GOLD,
            cursor: "pointer", fontSize: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s",
          }}
        >{playing ? "⏸" : "▶"}</button>
      </div>
    );
  }

  return (
    <div className="floating-player-full" style={{
      position: "fixed", left: 0, right: 0, zIndex: 510,
      background: `linear-gradient(135deg,${SURFACE},#f0e8d0)`,
      borderTop: `1px solid ${playing ? GOLD + "70" : BORDER}`,
      boxShadow: `0 -4px 24px rgba(160,120,50,0.15)`,
      padding: "0 16px",
      animation: "slideUp 0.28s cubic-bezier(0.22,1,0.36,1)",
      transition: "border-color 0.3s, bottom 0.2s",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: BORDER }}>
        <div style={{ height: "100%", width: `${pct}%`, background: playing ? GOLD : MUTED, transition: "width 0.4s linear, background 0.3s" }} />
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, height: 68 }}>
        <img
          src="/logo.png" alt="" onClick={() => navigate(current?.type === "quran" ? "quran" : "audio")}
          style={{ width: 32, height: 32, objectFit: "contain", cursor: "pointer", opacity: playing ? 0.9 : 0.45, flexShrink: 0, transition: "opacity 0.3s" }}
        />

        <div onClick={() => navigate(current?.type === "quran" ? "quran" : "audio")} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
          <div style={{ fontSize: 9, color: playing ? GOLD : MUTED, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 2, transition: "color 0.3s" }}>
            {playing ? "Now Playing" : "Paused"}
          </div>
          <div style={{ fontSize: 13, color: playing ? TEXT : MUTED, fontFamily: SERIF, letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 0.3s" }}>
            {current.title}
          </div>
        </div>

        <div style={{ fontSize: 11, color: MUTED, fontVariantNumeric: "tabular-nums", flexShrink: 0, display: "flex", gap: 4 }}>
          <span>{fmt(progress)}</span><span style={{ opacity: 0.4 }}>/</span><span>{fmt(duration)}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button onClick={() => skip(-1)} title="Previous" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 15, padding: 4 }}>⏮</button>

          <button
            onClick={onPlayPause}
            title={playing ? "Pause" : "Resume"}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              border: `1px solid ${GOLD}`,
              background: playing ? GOLD : "transparent",
              color: playing ? "#f0e6ce" : GOLD,
              cursor: "pointer", fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >{playing ? "⏸" : "▶"}</button>

          <button onClick={() => skip(1)} title="Next" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 15, padding: 4 }}>⏭</button>

          <button
            onClick={() => setMinimized(true)}
            title="Minimize player"
            style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: "var(--radius-sm)",
              cursor: "pointer", color: MUTED, fontSize: 11,
              width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
          >⌄</button>

          <button
            onClick={stop}
            title="Stop"
            style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: "var(--radius-sm)",
              cursor: "pointer", color: MUTED, fontSize: 12, fontWeight: 700,
              width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0392b"; e.currentTarget.style.color = "#c0392b"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
          >■</button>
        </div>
      </div>
    </div>
  );
}
