import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { GOLD, TEXT, MUTED, SANS, NAV_ITEMS, TOOLS_ITEMS } from "../constants";

const BG      = "rgba(250,247,238,0.95)";
const BORDER  = "#E0D5C0";
const DARK    = "#1A1915";
const WARM700 = "#6B6050";
const WARM100 = "#EDE8DC";

// Primary desktop links — matches handoff
const PRIMARY_LINKS = ["home", "prayer", "quran"];

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function Navbar({ page, setPage, onSettings, hasLocation, onSearch, authUser, onAuthClick, onSignOut }) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [moreOpen, setMoreOpen]       = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const moreRef = useRef(null);

  const toolsActive   = TOOLS_ITEMS.some(tool => tool.id === page);
  const primaryActive = PRIMARY_LINKS.includes(page);
  const moreActive    = !primaryActive || toolsActive;

  useEffect(() => {
    function handle(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // All non-primary nav items go into "More"
  const moreItems = NAV_ITEMS.filter(n => !PRIMARY_LINKS.includes(n.id));

  const NavLink = ({ id }) => {
    const isActive = page === id;
    return (
      <button
        onClick={() => setPage(id)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 999,
          border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: isActive ? 600 : 500,
          background: isActive ? DARK : "transparent",
          color: isActive ? "#fff" : WARM700,
          fontFamily: SANS, transition: "all 0.15s", whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = WARM100; e.currentTarget.style.color = DARK; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = WARM700; } }}
      >
        {t(`nav.${id}`)}
      </button>
    );
  };

  const IconBtn = ({ onClick, title, children, dot }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 34, height: 34, border: `1px solid ${BORDER}`,
        borderRadius: 999, background: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: WARM700, transition: "all 0.15s", position: "relative",
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = WARM100; e.currentTarget.style.color = DARK; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = WARM700; }}
    >
      {children}
      {dot && <span style={{ position: "absolute", top: 5, right: 5, width: 6, height: 6, borderRadius: "50%", background: GOLD, border: "1.5px solid #FAF7EE" }}/>}
    </button>
  );

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: BG,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderBottom: `1px solid ${BORDER}`,
      padding: "0 24px",
      height: 56,
      display: "flex", alignItems: "center",
    }}>
      {/* Logo */}
      <button
        onClick={() => setPage("home")}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, padding: 0 }}
      >
        <img src="/logo.png" alt="Muslims Path" style={{ width: 32, height: 32, objectFit: "contain" }}/>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: DARK, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          Muslims Path
        </span>
      </button>

      {/* Desktop nav links */}
      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 28 }}>
        {PRIMARY_LINKS.map(id => <NavLink key={id} id={id}/>)}

        {/* More dropdown */}
        <div ref={moreRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMoreOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 999,
              border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: moreActive ? 600 : 500,
              background: moreActive ? DARK : "transparent",
              color: moreActive ? "#fff" : WARM700,
              fontFamily: SANS, transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!moreActive) { e.currentTarget.style.background = WARM100; e.currentTarget.style.color = DARK; } }}
            onMouseLeave={e => { if (!moreActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = WARM700; } }}
          >
            {t("nav.more") || "More"} <IconChevron/>
          </button>

          {moreOpen && (
            <div
              onMouseLeave={() => setMoreOpen(false)}
              style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0,
                background: "#fff", border: `1px solid ${BORDER}`,
                boxShadow: "0 4px 20px rgba(26,25,21,0.10)",
                minWidth: 200, zIndex: 200, borderRadius: 12, overflow: "hidden",
                animation: "navSlideDown 0.18s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {moreItems.map(n => (
                <button key={n.id} onClick={() => { setPage(n.id); setMoreOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "11px 16px", background: page === n.id ? WARM100 : "none",
                  border: "none", borderLeft: page === n.id ? `3px solid ${GOLD}` : "3px solid transparent",
                  cursor: "pointer", fontSize: 13, color: page === n.id ? DARK : WARM700,
                  fontWeight: page === n.id ? 600 : 400, fontFamily: SANS, transition: "all 0.12s", textAlign: "left",
                }}
                  onMouseEnter={e => { if (page !== n.id) { e.currentTarget.style.background = WARM100; e.currentTarget.style.color = DARK; } }}
                  onMouseLeave={e => { if (page !== n.id) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = WARM700; } }}
                >
                  <span style={{ fontSize: 16 }}>{n.icon}</span>
                  {t(`nav.${n.id}`)}
                </button>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}` }}/>
              {TOOLS_ITEMS.map(tool => (
                <button key={tool.id} onClick={() => { setPage(tool.id); setMoreOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "11px 16px", background: page === tool.id ? WARM100 : "none",
                  border: "none", borderLeft: page === tool.id ? `3px solid ${GOLD}` : "3px solid transparent",
                  cursor: "pointer", fontSize: 13, color: page === tool.id ? DARK : WARM700,
                  fontWeight: page === tool.id ? 600 : 400, fontFamily: SANS, transition: "all 0.12s", textAlign: "left",
                }}
                  onMouseEnter={e => { if (page !== tool.id) { e.currentTarget.style.background = WARM100; e.currentTarget.style.color = DARK; } }}
                  onMouseLeave={e => { if (page !== tool.id) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = WARM700; } }}
                >
                  <span style={{ fontSize: 16 }}>{tool.icon}</span>
                  {t(`tools.${tool.id}`)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <IconBtn onClick={onSearch} title={t("nav.search")}><IconSearch/></IconBtn>
        <IconBtn onClick={onSettings} title={t("nav.settings")} dot={hasLocation}><IconSettings/></IconBtn>

        {authUser ? (
          <div style={{ position: "relative" }} className="nav-auth-wrap">
            <button
              onClick={e => {
                e.stopPropagation();
                const m = document.getElementById("nav-user-menu");
                if (m) m.style.display = m.style.display === "none" ? "block" : "none";
              }}
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: DARK, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {(authUser.user_metadata?.full_name || authUser.email || "U").charAt(0).toUpperCase()}
            </button>
            <div id="nav-user-menu" style={{
              display: "none", position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "#fff", border: `1px solid ${BORDER}`,
              boxShadow: "0 4px 20px rgba(26,25,21,0.10)",
              minWidth: 200, zIndex: 300, padding: "8px 0", borderRadius: 12, overflow: "hidden",
              animation: "navSlideDown 0.18s cubic-bezier(0.22,1,0.36,1)",
            }}>
              <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 12, color: DARK, marginBottom: 2 }}>{authUser.user_metadata?.full_name || ""}</div>
                <div style={{ fontSize: 11, color: WARM700 }}>{authUser.email}</div>
              </div>
              <button onClick={() => { onSignOut(); document.getElementById("nav-user-menu").style.display = "none"; }} style={{
                width: "100%", background: "none", border: "none",
                padding: "10px 16px", textAlign: "left", cursor: "pointer",
                fontSize: 12, color: "#c0392b", fontFamily: SANS,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff5f5"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >{t("nav.signOut")}</button>
            </div>
          </div>
        ) : (
          <button onClick={onAuthClick} style={{
            padding: "7px 18px", borderRadius: 999,
            background: DARK, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "#fff",
            fontFamily: SANS, transition: "all 0.15s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#2d2d2d"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            {t("nav.signIn")}
          </button>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-mobile"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            display: "none", width: 34, height: 34, border: `1px solid ${BORDER}`,
            borderRadius: 8, background: "none", cursor: "pointer",
            alignItems: "center", justifyContent: "center", color: WARM700,
          }}
        >
          {menuOpen ? <IconClose/> : <IconMenu/>}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && createPortal(<>
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 601 }}/>
        <div className="nav-mobile-menu" style={{
          position: "fixed", top: 56, left: 0, right: 0, zIndex: 602,
          background: "#FAF7EE", borderTop: `1px solid ${BORDER}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          padding: "8px 0 20px",
          display: "flex", flexDirection: "column",
          maxHeight: "calc(100vh - 56px)", overflowY: "auto",
        }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }} style={{
              background: page === n.id ? WARM100 : "none", border: "none", cursor: "pointer",
              textAlign: "left", padding: "12px 24px", fontSize: 14,
              color: page === n.id ? DARK : WARM700,
              fontWeight: page === n.id ? 600 : 400,
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: page === n.id ? `3px solid ${GOLD}` : "3px solid transparent",
            }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              {t(`nav.${n.id}`)}
            </button>
          ))}

          <button onClick={() => setMobileMoreOpen(o => !o)} style={{
            background: "none", border: "none", borderTop: `1px solid ${BORDER}`,
            marginTop: 4, cursor: "pointer", textAlign: "left",
            padding: "12px 24px", fontSize: 14,
            color: WARM700, fontWeight: 400,
            display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
            borderLeft: "3px solid transparent",
          }}>
            🛠 {t("nav.tools")}
            <span style={{ marginLeft: "auto", opacity: 0.5 }}>{mobileMoreOpen ? "▲" : "▼"}</span>
          </button>
          {mobileMoreOpen && TOOLS_ITEMS.map(tool => (
            <button key={tool.id} onClick={() => { setPage(tool.id); setMenuOpen(false); }} style={{
              background: page === tool.id ? WARM100 : "none", border: "none", cursor: "pointer",
              textAlign: "left", padding: "11px 24px 11px 52px", fontSize: 14,
              color: page === tool.id ? DARK : WARM700,
              fontWeight: page === tool.id ? 600 : 400,
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: page === tool.id ? `3px solid ${GOLD}` : "3px solid transparent",
            }}>
              <span style={{ fontSize: 18 }}>{tool.icon}</span>
              {t(`tools.${tool.id}`)}
            </button>
          ))}

          <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 8 }}/>
          <button onClick={() => { onSearch(); setMenuOpen(false); }} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 24px", fontSize: 14, color: WARM700,
            display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
            borderLeft: "3px solid transparent",
          }}>
            <IconSearch/> {t("nav.search")}
          </button>
          <button onClick={() => { onSettings(); setMenuOpen(false); }} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 24px", fontSize: 14, color: WARM700,
            display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
            borderLeft: "3px solid transparent",
          }}>
            <IconSettings/> {t("nav.settings")}
            {hasLocation && <span style={{ fontSize: 11, color: GOLD, border: `1px solid ${GOLD}60`, padding: "1px 7px", borderRadius: 4, marginLeft: 4 }}>Active</span>}
          </button>

          {authUser ? (
            <>
              <div style={{ padding: "10px 24px 6px", borderTop: `1px solid ${BORDER}`, marginTop: 4 }}>
                <div style={{ fontSize: 12, color: WARM700 }}>{authUser.user_metadata?.full_name || authUser.email}</div>
              </div>
              <button onClick={() => { onSignOut(); setMenuOpen(false); }} style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                padding: "10px 24px 14px", fontSize: 14, color: "#c0392b",
                display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
                borderLeft: "3px solid transparent",
              }}>✕ {t("nav.signOut")}</button>
            </>
          ) : (
            <button onClick={() => { onAuthClick(); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "12px 24px 16px", fontSize: 14, color: GOLD,
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: "3px solid transparent",
              borderTop: `1px solid ${BORDER}`, marginTop: 4,
            }}>
              👤 {t("nav.signInUp")}
            </button>
          )}
        </div>
      </>, document.body)}

      <style>{`
        @media (max-width: 900px) { .nav-desktop { display: none !important; } .nav-mobile { display: flex !important; } }
        @keyframes navSlideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .nav-mobile-menu { animation: navSlideDown 0.22s cubic-bezier(0.22,1,0.36,1); }
        #nav-user-menu { animation: navSlideDown 0.18s cubic-bezier(0.22,1,0.36,1); }
      `}</style>
    </nav>
  );
}
