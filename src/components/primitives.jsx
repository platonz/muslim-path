import { SURFACE, BORDER, GOLD, TEXT, MUTED, SERIF, SANS, GREEN_L } from "../constants";
import Icon from "./Icon";

export function Card({ children, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        padding: 28,
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        boxShadow: "0 2px 12px rgba(26,25,21,0.07)",
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function PageTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "#FAF5E8", border: "1px solid rgba(184,157,96,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name={icon} size={20} color="#8A7235" sw={1.7} />
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: TEXT, fontFamily: SERIF, letterSpacing: "0.04em" }}>{title}</h1>
      </div>
      {sub && <p style={{ margin: "0 0 0 52px", color: MUTED, fontSize: 13, letterSpacing: "0.03em" }}>{sub}</p>}
      <div style={{ marginTop: 16, height: 1, background: `linear-gradient(90deg, ${GOLD} 0%, transparent 60%)`, opacity: 0.35 }} />
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", overflowWrap: "anywhere" }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: "11px 14px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: SURFACE, outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          fontFamily: SANS,
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          ...props.style
        }}
        onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px ${GOLD}18`; }}
        onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

export function Select({ label, options, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", overflowWrap: "anywhere" }}>{label}</label>}
      <select
        {...props}
        style={{
          padding: "11px 14px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: SURFACE, outline: "none", cursor: "pointer",
          fontFamily: SANS,
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          ...props.style
        }}
      >
        {options.map(o => <option key={o.v} value={o.v} style={{ background: "#FFFFFF" }}>{o.l}</option>)}
      </select>
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "11px 24px",
        borderRadius: 999,
        border: variant === "primary" ? "none" : `1px solid ${BORDER}`,
        background: disabled ? "#E8DCC8"
          : variant === "primary"
            ? "#8A7235"
            : "#FFFFFF",
        color: disabled ? MUTED : variant === "primary" ? "#FFFFFF" : TEXT,
        fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.05em",
        transition: "opacity 0.2s, transform 0.15s",
        fontFamily: SANS,
        ...style
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
    >
      {children}
    </button>
  );
}
