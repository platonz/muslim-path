import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

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
};
const SR = "'Playfair Display', Georgia, serif";
const SA = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.07em",
      textTransform: "uppercase", color: W.muted,
      fontFamily: SA, marginBottom: 8,
    }}>{children}</div>
  );
}

function SettingRow({ label, value, toggle, checked, onToggle, last, danger }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "13px 16px",
      borderBottom: last ? "none" : `1px solid ${W.border}`,
      background: W.card,
    }}>
      <div style={{
        flex: 1, fontSize: 14, fontFamily: SA,
        color: danger ? "#8A2020" : W.text,
      }}>{label}</div>
      {toggle ? (
        <button
          onClick={onToggle}
          style={{
            width: 40, height: 23, borderRadius: 999, cursor: "pointer",
            position: "relative", border: "none", outline: "none",
            background: checked ? W.goldDark : W.border,
            transition: "background 200ms ease",
            flexShrink: 0,
          }}
        >
          <div style={{
            position: "absolute", top: 3,
            left: checked ? 19 : 3,
            width: 17, height: 17, borderRadius: "50%", background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            transition: "left 200ms ease",
          }} />
        </button>
      ) : value ? (
        <div style={{ fontSize: 13, color: W.muted, fontFamily: SA }}>{value}</div>
      ) : null}
    </div>
  );
}

export default function Profile({ authUser, onSignOut, notifEnabled, onNotifToggle, savedLocation, navigate }) {
  const { i18n: _i18n } = useTranslation();
  const isSq = _i18n.language?.startsWith("sq");

  const [toggles, setToggles] = useState({
    prayerReminders: notifEnabled ?? false,
    dhikrReminder: false,
    quranGoal: true,
  });

  function flipToggle(key) {
    const next = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: next }));
    if (key === "prayerReminders" && onNotifToggle) onNotifToggle(next);
  }

  const displayName = authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || "Guest";
  const initial     = displayName.charAt(0).toUpperCase();

  const calcLabel = isSq ? "Metoda llogaritjes" : "Calculation method";
  const locationLabel = savedLocation?.name || (isSq ? "Nuk është vendosur" : "Not set");

  return (
    <div style={{ background: W.bg, minHeight: "100vh", paddingBottom: 90 }}>

      {/* Avatar + name header */}
      <div style={{
        background: W.card, borderBottom: `1px solid ${W.border}`,
        padding: "20px 20px 16px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: W.goldBg, border: `1px solid ${W.goldBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 22, fontFamily: SR, fontWeight: 600, color: W.goldDark }}>
            {initial}
          </span>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: SR, color: W.text }}>
            {displayName}
          </div>
          <div style={{ fontSize: 12, color: W.muted, fontFamily: SA, marginTop: 2 }}>
            {authUser ? (isSq ? "Anëtar i regjistruar" : "Signed in") : (isSq ? "Vizitor" : "Guest")}
          </div>
        </div>
        {!authUser && (
          <button
            onClick={() => navigate && navigate("home")}
            style={{
              marginLeft: "auto", padding: "7px 14px",
              borderRadius: 999, border: `1px solid ${W.goldDark}`,
              background: W.goldBg, color: W.goldDark,
              fontSize: 12, fontWeight: 600, fontFamily: SA,
              cursor: "pointer",
            }}
          >
            {isSq ? "Hyr" : "Sign in"}
          </button>
        )}
      </div>

      {/* Stats row */}
      <div style={{ margin: "16px 20px 0", display: "flex", gap: 10 }}>
        {[
          { label: isSq ? "Ditë radhë" : "Day streak",        value: "—" },
          { label: isSq ? "Namaze"     : "Prayers logged",    value: "—" },
          { label: isSq ? "Xhuz lexuar": "Juz read",          value: "—" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: "12px 10px", textAlign: "center",
            background: W.card, border: `1px solid ${W.border}`,
            borderRadius: 14, boxShadow: W.shadow,
          }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: W.goldDark, fontFamily: SR }}>{s.value}</div>
            <div style={{ fontSize: 10, color: W.muted, fontFamily: SA, marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Account settings */}
      <div style={{ margin: "20px 20px 0" }}>
        <SectionLabel>{isSq ? "Llogaria" : "Account"}</SectionLabel>
        <div style={{ background: W.card, border: `1px solid ${W.border}`, borderRadius: 14, boxShadow: W.shadow, overflow: "hidden" }}>
          <SettingRow label={isSq ? "Vendndodhja" : "Location"} value={locationLabel} />
          <SettingRow label={calcLabel} value="MWL" last />
        </div>
      </div>

      {/* Notifications */}
      <div style={{ margin: "16px 20px 0" }}>
        <SectionLabel>{isSq ? "Njoftime" : "Notifications"}</SectionLabel>
        <div style={{ background: W.card, border: `1px solid ${W.border}`, borderRadius: 14, boxShadow: W.shadow, overflow: "hidden" }}>
          <SettingRow
            label={isSq ? "Kujtuese të namazit" : "Prayer reminders"}
            toggle checked={toggles.prayerReminders}
            onToggle={() => flipToggle("prayerReminders")}
          />
          <SettingRow
            label={isSq ? "Kujtuese e dhikrit ditor" : "Daily dhikr reminder"}
            toggle checked={toggles.dhikrReminder}
            onToggle={() => flipToggle("dhikrReminder")}
          />
          <SettingRow
            label={isSq ? "Objektivi i leximit të Kuranit" : "Quran reading goal"}
            toggle checked={toggles.quranGoal}
            onToggle={() => flipToggle("quranGoal")}
            last
          />
        </div>
      </div>

      {/* App settings */}
      <div style={{ margin: "16px 20px 0" }}>
        <SectionLabel>{isSq ? "Aplikacioni" : "App"}</SectionLabel>
        <div style={{ background: W.card, border: `1px solid ${W.border}`, borderRadius: 14, boxShadow: W.shadow, overflow: "hidden" }}>
          <SettingRow label={isSq ? "Madhësia e shkronjave arabe" : "Arabic font size"} value={isSq ? "Normale" : "Normal"} />
          <SettingRow label={isSq ? "Përkthimi" : "Translation"} value="Sahih International" last />
        </div>
      </div>

      {/* Language */}
      <div style={{ margin: "16px 20px 0" }}>
        <SectionLabel>{isSq ? "Gjuha" : "Language"}</SectionLabel>
        <div style={{ background: W.card, border: `1px solid ${W.border}`, borderRadius: 14, boxShadow: W.shadow, overflow: "hidden" }}>
          {[
            { lang: "en", flag: "🇬🇧", label: "English" },
            { lang: "sq", flag: "🇦🇱", label: "Shqip" },
          ].map(({ lang, flag, label }, i, arr) => {
            const active = _i18n.language?.startsWith(lang);
            return (
              <button
                key={lang}
                onClick={() => { if (!active) _i18n.changeLanguage(lang); }}
                style={{
                  width: "100%", background: active ? W.goldBg : W.card,
                  border: "none", cursor: active ? "default" : "pointer",
                  display: "flex", alignItems: "center", padding: "13px 16px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${W.border}` : "none",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{flag}</span>
                <span style={{ fontSize: 14, fontFamily: SA, color: active ? W.goldDark : W.text, fontWeight: active ? 600 : 400 }}>
                  {label}
                </span>
                {active && (
                  <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: W.goldDark, display: "inline-block" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sign out */}
      {authUser && (
        <div style={{ margin: "16px 20px 0" }}>
          <div style={{ background: W.card, border: `1px solid ${W.border}`, borderRadius: 14, boxShadow: W.shadow, overflow: "hidden" }}>
            <button
              onClick={onSignOut}
              style={{
                width: "100%", background: "none", border: "none",
                padding: "14px 16px", cursor: "pointer",
                display: "flex", alignItems: "center",
                fontSize: 14, fontFamily: SA, color: "#8A2020",
              }}
            >
              {isSq ? "Dilni nga llogaria" : "Sign out"}
            </button>
          </div>
        </div>
      )}

      {/* About */}
      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: W.muted, fontFamily: SA, letterSpacing: "0.06em" }}>
          Muslim's Path · mdesign v2
        </div>
      </div>
    </div>
  );
}
