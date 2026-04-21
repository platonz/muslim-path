import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  BORDER, GOLD, GREEN_L, TEXT, MUTED, SERIF, SANS,
  NAV_ITEMS, TOOLS_ITEMS,
} from "../constants";

export default function Navbar({ page, setPage, onSettings, hasLocation, onSearch, authUser, onAuthClick, onSignOut }) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const toolsRef = useRef(null);
  const toolsActive = TOOLS_ITEMS.some(tool => tool.id === page);

  // Close tools dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const isHome = page === "home";
  const navBg   = "rgba(245,237,218,0.88)";
  const navBdr  = "rgba(201,168,76,0.22)";
  const navShdw = "0 1px 0 rgba(201,168,76,0.15), 0 2px 16px rgba(160,120,50,0.08)";
  const navText = MUTED;
  const navActv = "#a07d3a";

  return (
    <nav className="nav-bar" style={{
      position: "sticky", top: 0, zIndex: 100,
      background: navBg,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: `1px solid ${navBdr}`,
      boxShadow: navShdw,
      padding: "0 32px",
      transition: "background 0.3s, box-shadow 0.3s",
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="Muslim's Path" style={{ width: 40, height: 40, objectFit: "contain" }} />
        </button>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 0, alignItems: "center" }} className="nav-desktop">
          {NAV_ITEMS.filter(n => n.id !== "home").map(n => {
            const isActive = page === n.id;
            const isHov = hovered === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: isActive ? `1px solid ${navActv}` : "1px solid transparent",
                  cursor: "pointer", padding: "8px 14px", fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? navActv : isHov ? (isHome ? "#3a2a10" : TEXT) : navText,
                  transition: "all 0.2s", letterSpacing: "0.04em",
                  fontFamily: SANS, height: 64, borderRadius: 0,
                }}>
                {t(`nav.${n.id}`)}
              </button>
            );
          })}

          {/* Tools dropdown */}
          <div ref={toolsRef} style={{ position: "relative", height: 64, display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setToolsOpen(o => !o)}
              onMouseEnter={() => setToolsOpen(true)}
              style={{
                background: "transparent", border: "none",
                borderBottom: toolsActive ? `1px solid ${navActv}` : toolsOpen ? `1px solid ${navActv}60` : "1px solid transparent",
                cursor: "pointer", padding: "8px 14px", fontSize: 12,
                fontWeight: toolsActive ? 600 : 400,
                color: toolsActive ? navActv : toolsOpen ? (isHome ? "#3a2a10" : TEXT) : navText,
                transition: "all 0.2s", letterSpacing: "0.04em",
                fontFamily: SANS,
                height: 64, borderRadius: 0, display: "flex", alignItems: "center", gap: 5,
              }}>
              ðŸ›  {t("nav.tools")} <span style={{ fontSize: 9, opacity: 0.6 }}>â–¾</span>
            </button>
            {toolsOpen && (
              <div onMouseLeave={() => setToolsOpen(false)} style={{
                position: "absolute", top: "100%", left: 0,
                background: "#faf5ec", border: `1px solid ${GOLD}25`,
                boxShadow: `0 16px 48px rgba(0,0,0,0.9)`,
                minWidth: 180, zIndex: 200,
              }}>
                {TOOLS_ITEMS.map(tool => (
                  <button key={tool.id} onClick={() => { setPage(tool.id); setToolsOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "12px 18px", background: page === tool.id ? GREEN_L : "none",
                    border: "none", borderLeft: page === tool.id ? `2px solid ${GOLD}` : "2px solid transparent",
                    cursor: "pointer", fontSize: 12, color: page === tool.id ? GOLD : MUTED,
                    fontWeight: page === tool.id ? 600 : 400,
                    letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: SANS,
                    transition: "all 0.15s", textAlign: "left",
                  }}
                    onMouseEnter={e => { if (page !== tool.id) { e.currentTarget.style.background = GREEN_L; e.currentTarget.style.color = TEXT; } }}
                    onMouseLeave={e => { if (page !== tool.id) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = MUTED; } }}
                  >
                    <span>{tool.icon}</span>{t(`tools.${tool.id}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: search + settings + lang switcher + auth + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button onClick={onSearch} title={t("nav.search")} aria-label={t("nav.search")} style={{
            background: "transparent", border: `1px solid rgba(201,168,76,0.3)`,
            borderRadius: 10, cursor: "pointer", color: navText,
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = navActv; e.currentTarget.style.color = navActv; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isHome ? "rgba(201,168,76,0.25)" : BORDER; e.currentTarget.style.color = navText; }}
          >ðŸ”</button>
          <button onClick={onSettings} title={t("nav.settings")} aria-label={t("nav.settings")} style={{
            background: "transparent",
            border: `1px solid rgba(201,168,76,${hasLocation ? "0.4" : "0.25"})`,
            borderRadius: 10, cursor: "pointer", color: hasLocation ? navActv : navText,
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, transition: "all 0.2s", position: "relative",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = navActv; e.currentTarget.style.color = navActv; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = hasLocation ? (isHome ? "rgba(201,168,76,0.35)" : GOLD+"60") : (isHome ? "rgba(201,168,76,0.25)" : BORDER); e.currentTarget.style.color = hasLocation ? navActv : navText; }}
          >
            âš™
            {hasLocation && <span style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, borderRadius: "50%", background: GOLD }} />}
          </button>

          {/* Auth button */}
          {authUser ? (
            <div style={{ position: "relative" }} className="nav-auth-wrap">
              <button title="Account" onClick={e => {
                e.stopPropagation();
                const m = document.getElementById("nav-user-menu");
                if (m) m.style.display = m.style.display === "none" ? "block" : "none";
              }} style={{
                background: "linear-gradient(135deg,#C9A84C,#A8883E)", border: "none",
                borderRadius: "50%", width: 32, height: 32, cursor: "pointer",
                fontSize: 12, fontWeight: 700, color: "#3a2a10",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {(authUser.user_metadata?.full_name || authUser.email || "U").charAt(0).toUpperCase()}
              </button>
              <div id="nav-user-menu" style={{
                display: "none", position: "absolute", top: "calc(100% + 10px)", right: 0,
                background: "#faf5ec", border: "1px solid #2A2520",
                boxShadow: "0 16px 48px rgba(0,0,0,0.9)",
                minWidth: 200, zIndex: 300, padding: "8px 0",
              }}>
                <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid #242424" }}>
                  <div style={{ fontSize: 12, color: "#3a2a10", marginBottom: 2 }}>{authUser.user_metadata?.full_name || ""}</div>
                  <div style={{ fontSize: 11, color: "#7a5c28" }}>{authUser.email}</div>
                </div>
                <button onClick={() => { onSignOut(); document.getElementById("nav-user-menu").style.display = "none"; }} style={{
                  width: "100%", background: "none", border: "none",
                  padding: "10px 16px", textAlign: "left", cursor: "pointer",
                  fontSize: 11, color: "#7a5c28", letterSpacing: "0.07em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#e74c3c"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#7a5c28"; }}
                >{t("nav.signOut")}</button>
              </div>
            </div>
          ) : (
            <button onClick={onAuthClick} style={{
              background: "linear-gradient(135deg,#C9A84C,#A8883E)",
              border: "none", cursor: "pointer",
              padding: "7px 18px", fontSize: 12, fontWeight: 700,
              color: isHome ? "#3a2a10" : "#3a2a10",
              borderRadius: 20,
              letterSpacing: "0.04em",
              fontFamily: "'Inter', sans-serif", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >{t("nav.signIn")}</button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} style={{
            display: "none", background: "transparent", border: `1px solid ${BORDER}`,
            borderRadius: 2, cursor: "pointer", fontSize: 16, color: MUTED,
            width: 36, height: 36, alignItems: "center", justifyContent: "center",
          }} className="nav-mobile">{menuOpen ? "âœ•" : "â˜°"}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && <>
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 499 }} />
        <div className="nav-mobile-menu" style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 500,
          borderTop: `1px solid ${BORDER}`,
          padding: "8px 0 16px",
          display: "flex", flexDirection: "column",
          background: "rgba(245,237,218,0.97)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.85)",
          maxHeight: "calc(100vh - 64px)", overflowY: "auto",
        }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "12px 32px", fontSize: 12,
              color: page === n.id ? GOLD : MUTED,
              fontWeight: page === n.id ? 600 : 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: page === n.id ? `2px solid ${GOLD}` : "2px solid transparent",
            }}><span>{n.icon}</span>{t(`nav.${n.id}`)}</button>
          ))}

          {/* Tools section in mobile */}
          <button onClick={() => setMobileToolsOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 32px", fontSize: 12, color: toolsActive ? GOLD : MUTED,
            fontWeight: toolsActive ? 600 : 400,
            letterSpacing: "0.08em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
            borderLeft: toolsActive ? `2px solid ${GOLD}` : "2px solid transparent",
            borderTop: `1px solid ${BORDER}`, marginTop: 4,
          }}>
            <span>ðŸ› </span> {t("nav.tools")} <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.5 }}>{mobileToolsOpen ? "â–²" : "â–¼"}</span>
          </button>
          {mobileToolsOpen && TOOLS_ITEMS.map(tool => (
            <button key={tool.id} onClick={() => { setPage(tool.id); setMenuOpen(false); }} style={{
              background: page === tool.id ? GREEN_L : "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "11px 32px 11px 52px", fontSize: 12,
              color: page === tool.id ? GOLD : MUTED,
              fontWeight: page === tool.id ? 600 : 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: page === tool.id ? `2px solid ${GOLD}` : "2px solid transparent",
            }}><span>{tool.icon}</span>{t(`tools.${tool.id}`)}</button>
          ))}

          <button onClick={() => { onSearch(); setMenuOpen(false); }} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 32px", fontSize: 12, color: MUTED,
            display: "flex", alignItems: "center", gap: 12,
            borderTop: `1px solid ${BORDER}`, marginTop: 8,
            letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: SANS,
            borderLeft: "2px solid transparent",
          }}>
            <span>ðŸ”</span> {t("nav.search")}
          </button>
          <button onClick={() => { onSettings(); setMenuOpen(false); }} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 32px", fontSize: 12, color: MUTED,
            display: "flex", alignItems: "center", gap: 12,
            letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: SANS,
            borderLeft: "2px solid transparent",
          }}>
            <span>âš™</span> {t("nav.settings")} {hasLocation && <span style={{ fontSize: 10, color: GOLD, border: `1px solid ${GOLD}60`, padding: "1px 7px", letterSpacing: "0.06em" }}>{t("nav.active")}</span>}
          </button>

          {authUser ? (
            <>
              <div style={{ padding: "10px 32px 6px", borderTop: `1px solid ${BORDER}`, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: MUTED }}>{authUser.user_metadata?.full_name || authUser.email}</div>
              </div>
              <button onClick={() => { onSignOut(); setMenuOpen(false); }} style={{
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                padding: "10px 32px 14px", fontSize: 12, color: "#e74c3c",
                display: "flex", alignItems: "center", gap: 12,
                letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: SANS,
                borderLeft: "2px solid transparent",
              }}>
                <span>&#x2715;</span> {t("nav.signOut")}
              </button>
            </>
          ) : (
            <button onClick={() => { onAuthClick(); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "12px 32px 16px", fontSize: 12, color: GOLD,
              display: "flex", alignItems: "center", gap: 12,
              borderTop: `1px solid ${BORDER}`, marginTop: 4,
              letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: SANS,
              borderLeft: "2px solid transparent",
            }}>
              <span>&#x1F464;</span> {t("nav.signInUp")}
            </button>
          )}
        </div>
      </>}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        @media (max-width: 560px) {
          .nav-bar { padding: 0 14px !important; }
          .nav-logo-sub { display: none !important; }
        }
        .home-prayer-strip { display: none !important; }
        @keyframes navSlideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .nav-mobile-menu { animation: navSlideDown 0.22s cubic-bezier(0.22,1,0.36,1); }
        #nav-user-menu { animation: navSlideDown 0.18s cubic-bezier(0.22,1,0.36,1); }
        @media (max-width: 760px) {
          .home-prayer-strip { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
