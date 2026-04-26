import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { GOLD, TEXT, MUTED, SANS, NAV_ITEMS, TOOLS_ITEMS } from "../constants";

const BG      = "rgba(250,247,238,0.95)";
const BORDER  = "#E0D5C0";
const DARK    = "#1A1915";
const WARM700 = "#6B6050";
const WARM100 = "#EDE8DC";

const PRIMARY_LINKS = ["home", "prayer", "quran"];

// Monochromatic SVG icons for nav items
const NAV_ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  prayer: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C9 3 7 5.5 7 8v11h10V8c0-2.5-2-5-5-5z"/>
      <line x1="4" y1="19" x2="20" y2="19"/>
      <line x1="9" y1="19" x2="9" y2="14"/>
      <line x1="15" y1="19" x2="15" y2="14"/>
      <rect x="9" y="14" width="6" height="5"/>
    </svg>
  ),
  dua: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v5"/>
      <path d="M14 10V4a2 2 0 0 0-4 0v6"/>
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8.5"/>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-16 0V9"/>
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  library: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  audio: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  tasbeeh: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="17.8" cy="7.2" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="19.5" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
    </svg>
  ),
  quran: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  asma: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
  zakat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  inheritance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15"/>
      <circle cx="18" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
  ),
  dates: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1,4 1,10 7,10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
    </svg>
  ),
};

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

// Animated hamburger ↔ X morph
function IconHamburger({ open }) {
  const s = {
    transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.22s ease",
    transformOrigin: "9px 9px",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line
        x1="2" y1="4.5" x2="16" y2="4.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        style={{ ...s, transform: open ? "translateY(4.5px) rotate(45deg)" : "none" }}
      />
      <line
        x1="2" y1="9" x2="16" y2="9"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        style={{ ...s, opacity: open ? 0 : 1, transform: open ? "scaleX(0.5)" : "none" }}
      />
      <line
        x1="2" y1="13.5" x2="16" y2="13.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        style={{ ...s, transform: open ? "translateY(-4.5px) rotate(-45deg)" : "none" }}
      />
    </svg>
  );
}

export default function Navbar({ page, setPage, onSettings, hasLocation, onSearch, authUser, onAuthClick, onSignOut }) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [menuClosing, setMenuClosing]   = useState(false);
  const [menuDragOffset, setMenuDragOffset] = useState(0);
  const [menuDragging, setMenuDragging] = useState(false);
  const [moreOpen, setMoreOpen]         = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const moreRef      = useRef(null);
  const dragStartY   = useRef(null);
  const dragStartX   = useRef(null);
  const dragActive   = useRef(false);
  const prevTouchY   = useRef(0);
  const prevTouchT   = useRef(0);
  const touchVel     = useRef(0);  // px/ms, positive = moving up

  function openMenu()  { setMenuOpen(true); setMenuClosing(false); setMenuDragOffset(0); }
  function closeMenu() {
    setMenuDragOffset(0);
    setMenuDragging(false);
    setMenuClosing(true);
    setTimeout(() => { setMenuOpen(false); setMenuClosing(false); }, 260);
  }

  // Swipe on open menu (both up and down) to dismiss
  function onMenuTouchStart(e) {
    dragStartY.current  = e.touches[0].clientY;
    dragStartX.current  = e.touches[0].clientX;
    dragActive.current  = false;
    prevTouchY.current  = e.touches[0].clientY;
    prevTouchT.current  = Date.now();
    touchVel.current    = 0;
    setMenuDragging(true);
  }
  function onMenuTouchMove(e) {
    if (dragStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const dy = dragStartY.current - currentY;  // positive = moved up, negative = moved down
    const dx = Math.abs(e.touches[0].clientX - dragStartX.current);
    if (!dragActive.current) {
      if (Math.abs(dy) > 6 && Math.abs(dy) > dx) dragActive.current = true;
      else return;
    }
    const now = Date.now();
    const dt  = now - prevTouchT.current;
    if (dt > 0) touchVel.current = (prevTouchY.current - currentY) / dt;
    prevTouchY.current = currentY;
    prevTouchT.current = now;
    setMenuDragOffset(dy);
    e.preventDefault();
  }
  function onMenuTouchEnd() {
    const abs = Math.abs(menuDragOffset);
    const vel = Math.abs(touchVel.current);
    const shouldClose = abs > 60 || (vel > 0.8 && abs > 15);
    if (shouldClose) {
      closeMenu();
    } else {
      // Spring snap-back: set dragging false and offset 0 in same render so browser animates
      setMenuDragging(false);
      setMenuDragOffset(0);
    }
    dragStartY.current = null;
    dragActive.current = false;
    touchVel.current   = 0;
  }

  // Swipe-down from top of screen to open menu
  useEffect(() => {
    let startY = null;
    let startX = null;
    function onTouchStart(e) {
      if (!menuOpen && e.touches[0].clientY < 100) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
      }
    }
    function onTouchEnd(e) {
      if (startY === null) return;
      const dy = e.changedTouches[0].clientY - startY;
      const dx = Math.abs(e.changedTouches[0].clientX - startX);
      if (dy > 60 && dx < 60) openMenu();
      startY = null;
    }
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [menuOpen]);

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

  // Drag offset: positive = dragged up (menu moves up), negative = dragged down (menu moves down)
  const dragTransform = menuDragOffset !== 0 ? `translateY(${-menuDragOffset}px)` : undefined;
  const dragTransition = menuDragging
    ? "none"
    : menuDragOffset === 0
      ? undefined
      : "transform 0.42s cubic-bezier(0.34,1.56,0.64,1)";

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
                animation: "menuOpen 0.18s cubic-bezier(0.22,1,0.36,1)",
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
                  <span style={{ display: "flex", color: WARM700 }}>{NAV_ICONS[n.id]}</span>
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
                  <span style={{ display: "flex", color: WARM700 }}>{NAV_ICONS[tool.id]}</span>
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
              animation: "menuOpen 0.18s cubic-bezier(0.22,1,0.36,1)",
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

        {/* Mobile hamburger — animated morph */}
        <button
          onClick={() => menuOpen ? closeMenu() : openMenu()}
          className="nav-mobile"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            display: "none", width: 34, height: 34, border: `1px solid ${BORDER}`,
            borderRadius: 8, background: "none", cursor: "pointer",
            alignItems: "center", justifyContent: "center", color: WARM700,
          }}
        >
          <IconHamburger open={menuOpen}/>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && createPortal(<>
        <div onClick={closeMenu} style={{
          position: "fixed", inset: 0, zIndex: 601,
          background: "rgba(0,0,0,0.18)",
          animation: menuClosing ? "backdropOut 0.26s forwards" : "backdropIn 0.2s forwards",
        }}/>
        <div
          className="nav-mobile-menu"
          onTouchStart={onMenuTouchStart}
          onTouchMove={onMenuTouchMove}
          onTouchEnd={onMenuTouchEnd}
          style={{
            position: "fixed", top: 56, left: 0, right: 0, zIndex: 602,
            background: "#FAF7EE", borderTop: `1px solid ${BORDER}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            padding: "0 0 20px",
            display: "flex", flexDirection: "column",
            maxHeight: "calc(100vh - 56px)",
            overflowY: menuDragging || menuDragOffset !== 0 ? "hidden" : "auto",
            transform: dragTransform,
            transition: dragTransition,
            animation: menuClosing
              ? "menuClose 0.26s cubic-bezier(0.4,0,1,1) forwards"
              : "menuOpen 0.3s cubic-bezier(0.22,1,0.36,1)",
            willChange: "transform, opacity",
          }}
        >
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", flexShrink: 0, touchAction: "none" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D4C9B0" }}/>
          </div>

          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); closeMenu(); }} style={{
              background: page === n.id ? WARM100 : "none", border: "none", cursor: "pointer",
              textAlign: "left", padding: "12px 24px", fontSize: 14,
              color: page === n.id ? DARK : WARM700,
              fontWeight: page === n.id ? 600 : 400,
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: page === n.id ? `3px solid ${GOLD}` : "3px solid transparent",
            }}>
              <span style={{ display: "flex", opacity: 0.7, color: page === n.id ? DARK : WARM700 }}>
                {NAV_ICONS[n.id]}
              </span>
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
            <span style={{ display: "flex", opacity: 0.7 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
              </svg>
            </span>
            {t("nav.tools")}
            <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: 10 }}>{mobileMoreOpen ? "▲" : "▼"}</span>
          </button>
          {mobileMoreOpen && TOOLS_ITEMS.map(tool => (
            <button key={tool.id} onClick={() => { setPage(tool.id); closeMenu(); }} style={{
              background: page === tool.id ? WARM100 : "none", border: "none", cursor: "pointer",
              textAlign: "left", padding: "11px 24px 11px 52px", fontSize: 14,
              color: page === tool.id ? DARK : WARM700,
              fontWeight: page === tool.id ? 600 : 400,
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: page === tool.id ? `3px solid ${GOLD}` : "3px solid transparent",
            }}>
              <span style={{ display: "flex", opacity: 0.7, color: page === tool.id ? DARK : WARM700 }}>
                {NAV_ICONS[tool.id]}
              </span>
              {t(`tools.${tool.id}`)}
            </button>
          ))}

          <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 8 }}/>
          <button onClick={() => { onSearch(); closeMenu(); }} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 24px", fontSize: 14, color: WARM700,
            display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
            borderLeft: "3px solid transparent",
          }}>
            <span style={{ display: "flex", opacity: 0.7 }}><IconSearch/></span>
            {t("nav.search")}
          </button>
          <button onClick={() => { onSettings(); closeMenu(); }} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 24px", fontSize: 14, color: WARM700,
            display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
            borderLeft: "3px solid transparent",
          }}>
            <span style={{ display: "flex", opacity: 0.7 }}><IconSettings/></span>
            {t("nav.settings")}
            {hasLocation && <span style={{ fontSize: 11, color: GOLD, border: `1px solid ${GOLD}60`, padding: "1px 7px", borderRadius: 4, marginLeft: 4 }}>Active</span>}
          </button>

          {authUser ? (
            <>
              <div style={{ padding: "10px 24px 6px", borderTop: `1px solid ${BORDER}`, marginTop: 4 }}>
                <div style={{ fontSize: 12, color: WARM700 }}>{authUser.user_metadata?.full_name || authUser.email}</div>
              </div>
              <button onClick={() => { onSignOut(); closeMenu(); }} style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                padding: "10px 24px 14px", fontSize: 14, color: "#c0392b",
                display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
                borderLeft: "3px solid transparent",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <button onClick={() => { onAuthClick(); closeMenu(); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "12px 24px 16px", fontSize: 14, color: GOLD,
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: "3px solid transparent",
              borderTop: `1px solid ${BORDER}`, marginTop: 4,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {t("nav.signInUp")}
            </button>
          )}
        </div>
      </>, document.body)}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
        @keyframes menuOpen {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes menuClose {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }
        #nav-user-menu { animation: menuOpen 0.18s cubic-bezier(0.22,1,0.36,1); }
      `}</style>
    </nav>
  );
}
