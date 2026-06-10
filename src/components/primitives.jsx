import { SURFACE, BORDER, GOLD, GREEN, TEXT, MUTED, SERIF, SANS, GREEN_L, WARM_100, WARM_600, DARK_900 } from "../constants";
import Icon from "./Icon";

export function Card({ children, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        padding: 28,
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        boxShadow: "0 16px 40px rgba(31,53,42,0.08)",
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
          width: 42, height: 42, borderRadius: 12,
        background: GREEN_L, border: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name={icon} size={20} color={GREEN} sw={1.7} />
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, color: TEXT, fontFamily: SERIF, letterSpacing: "0.01em" }}>{title}</h1>
      </div>
      {sub && <p style={{ margin: "0 0 0 54px", color: MUTED, fontSize: 13, letterSpacing: "0.02em" }}>{sub}</p>}
      <div style={{ marginTop: 16, height: 1, background: `linear-gradient(90deg, ${GREEN} 0%, transparent 60%)`, opacity: 0.40 }} />
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
        onFocus={e => { e.target.style.borderColor = GREEN; e.target.style.boxShadow = `0 0 0 3px rgba(23,107,77,0.14)`; }}
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
        background: disabled ? WARM_100
          : variant === "primary"
            ? GREEN
            : "#FFFFFF",
        color: disabled ? MUTED : variant === "primary" ? "#0C1410" : TEXT,
        fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.04em",
        transition: "opacity 0.2s, transform 0.15s, box-shadow 0.15s",
        fontFamily: SANS,
        ...style
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = "0.90"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = variant === "primary" ? "0 4px 20px rgba(23,107,77,0.22)" : "0 8px 24px rgba(31,53,42,0.12)"; } }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {children}
    </button>
  );
}
