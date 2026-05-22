import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { BORDER, SURFACE } from "../constants";
import { SUPA_URL, SUPA_ANON_KEY } from "../lib/supabase";

const SESSION_KEY = "mp-session";

export function loadSession() {
  try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}
export function saveSession(s) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
}
export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

async function supaAuthFetch(path, body) {
  const res = await fetch(SUPA_URL + "/auth/v1" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPA_ANON_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || data.error || JSON.stringify(data));
  return data;
}

export default function AuthModal({ onClose, onAuth }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [pendingSession, setPendingSession] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      let session;
      if (tab === "signin") {
        session = await supaAuthFetch("/token?grant_type=password", { email, password: pass });
        saveSession(session);
        onAuth(session);
        onClose();
      } else {
        session = await supaAuthFetch("/signup", { email, password: pass, data: { full_name: name } });
        if (!session.access_token) {
          setDone(t("auth.checkEmail"));
          setBusy(false); return;
        }
        setPendingSession(session);
        setTab("lang");
      }
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  function handleLangChoice(lang) {
    i18n.changeLanguage(lang);
    if (pendingSession) {
      saveSession(pendingSession);
      onAuth(pendingSession);
    }
    onClose();
  }

  function googleSignIn() {
    const redirect = window.location.origin + window.location.pathname;
    window.location.href = SUPA_URL + "/auth/v1/authorize?provider=google&redirect_to=" + encodeURIComponent(redirect);
  }

  const inputStyle = {
    padding: "10px 14px", background: "#faf5ec", border: "1px solid #242424",
    color: "#3a2a10", fontSize: 13, outline: "none", fontFamily: "'Inter', sans-serif",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 600,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: `linear-gradient(135deg,${SURFACE},#f0e8d0)`,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 32px 80px rgba(160,120,50,0.18), 0 2px 0 rgba(255,255,255,0.8) inset",
        width: "100%", maxWidth: 400, padding: "36px 32px",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14,
          background: "none", border: `1px solid ${BORDER}`,
          color: "#7a5c28", width: 28, height: 28, cursor: "pointer",
          fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
        }}>&#x2715;</button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="" style={{ width: 44, height: 44, objectFit: "contain", marginBottom: 12 }} />
          <div style={{ fontSize: 18, color: "#3a2a10", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.05em" }}>Muslim&#x2019;s Path</div>
          <div style={{ fontSize: 11, color: "#7a5c28", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{t("auth.companion")}</div>
        </div>

        {tab === "lang" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#3a2a10", marginBottom: 24, lineHeight: 1.7 }}>{t("auth.langStep")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["en", t("lang.english")], ["sq", t("lang.albanian")]].map(([code, label]) => (
                <button key={code} onClick={() => handleLangChoice(code)} style={{
                  padding: "14px 20px", background: "#faf5ec", border: "1px solid #2A2520",
                  color: "#3a2a10", fontSize: 13, cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", letterSpacing: "0.06em",
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A84C"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#d8c090"}
                >{label}</button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", marginBottom: 24, borderBottom: "1px solid #242424" }}>
              {["signin","signup"].map(tabId => (
                <button key={tabId} onClick={() => { setTab(tabId); setErr(""); setDone(""); }} style={{
                  flex: 1, background: "none", border: "none",
                  borderBottom: tab === tabId ? "2px solid #C9A84C" : "2px solid transparent",
                  color: tab === tabId ? "#C9A84C" : "#7a5c28",
                  padding: "10px 0", fontSize: 11, cursor: "pointer",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", fontWeight: tab === tabId ? 600 : 400,
                  marginBottom: -1,
                }}>{tabId === "signin" ? t("auth.signIn") : t("auth.signUp")}</button>
              ))}
            </div>

            {done ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#C9A84C", fontSize: 14, lineHeight: 1.7 }}>{done}</div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tab === "signup" && (
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={t("auth.fullName")}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#C9A84C"}
                    onBlur={e => e.target.style.borderColor = "#e2cfa4"}
                  />
                )}
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t("auth.email")} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#e2cfa4"}
                />
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder={t("auth.password")} required minLength={6}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#e2cfa4"}
                />
                {err && <div style={{ fontSize: 12, color: "#e74c3c", lineHeight: 1.5 }}>{err}</div>}
                <button type="submit" disabled={busy} style={{
                  marginTop: 4, padding: "11px 0", background: busy ? "#f5edd8" : "linear-gradient(135deg,#C9A84C,#A8883E)",
                  border: "none", color: busy ? "#7a5c28" : "#f0e6ce",
                  fontSize: 12, fontWeight: 700, cursor: busy ? "default" : "pointer",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
                }}>{busy ? t("auth.pleaseWait") : (tab === "signin" ? t("auth.signIn") : t("auth.createAccount"))}</button>
              </form>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
              <div style={{ flex: 1, height: 1, background: "#e2cfa4" }} />
              <span style={{ fontSize: 10, color: "#7a5c28", letterSpacing: "0.1em" }}>{t("auth.or")}</span>
              <div style={{ flex: 1, height: 1, background: "#e2cfa4" }} />
            </div>

            <button onClick={googleSignIn} style={{
              width: "100%", padding: "10px 0", background: "none",
              border: "1px solid #2A2520", color: "#3a2a10",
              fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.06em", transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#d8c090"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t("auth.continueGoogle")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
