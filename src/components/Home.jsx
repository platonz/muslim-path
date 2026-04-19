import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BORDER, GOLD, GREEN_L, SURFACE, TEXT, MUTED, SERIF, SANS,
  NAV_ITEMS, TOOLS_ITEMS,
} from "../constants";

export default function Home({ quote, setPage, savedLocation }) {
  const { t } = useTranslation();
  const [nextPrayer, setNextPrayer] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!savedLocation) return;
    const d = new Date();
    const dateStr = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${savedLocation.lat}&longitude=${savedLocation.lon}&method=2`)
      .then(r => r.json())
      .then(json => {
        if (json.code !== 200) return;
        const timings = json.data.timings;
        const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const nowD = new Date();
        const nowMins = nowD.getHours() * 60 + nowD.getMinutes();
        for (const name of prayers) {
          const [h, m] = timings[name].split(":").map(Number);
          if (h * 60 + m > nowMins) { setNextPrayer({ name, time: timings[name], totalMins: h * 60 + m }); return; }
        }
        const [h, m] = timings["Fajr"].split(":").map(Number);
        setNextPrayer({ name: "Fajr", time: timings["Fajr"], totalMins: 24 * 60 + h * 60 + m });
      }).catch(() => {});
  }, [savedLocation]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const minsLeft = nextPrayer ? nextPrayer.totalMins - (now.getHours() * 60 + now.getMinutes()) : 0;
  const hoursLeft = Math.floor(minsLeft / 60);
  const minutesLeft = minsLeft % 60;
  const countdown = minsLeft <= 0
    ? t("prayer.now")
    : hoursLeft > 0
      ? `${hoursLeft}h ${minutesLeft}m`
      : `${minutesLeft}m`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      {/* Hero / Quote */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ marginBottom: 20, opacity: 0.82 }}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M21 35V11C17 9 10 9 5 11.5V35.5C10 33 17 33 21 35Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M21 35V11C25 9 32 9 37 11.5V35.5C32 33 25 33 21 35Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
            <line x1="9"  y1="17" x2="19" y2="16.2" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
            <line x1="9"  y1="21" x2="19" y2="20.2" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
            <line x1="9"  y1="25" x2="19" y2="24.2" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
            <line x1="23" y1="16.2" x2="33" y2="17"  stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
            <line x1="23" y1="20.2" x2="33" y2="21"  stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
            <line x1="23" y1="24.2" x2="33" y2="25"  stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 500, color: TEXT, marginBottom: 6, fontFamily: SERIF, letterSpacing: "0.06em" }}>Muslim's Path</h1>
        <p style={{ color: MUTED, marginBottom: 40, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          {t("hero.subtitle")}
        </p>
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          {/* Gold corner accents */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTop: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottom: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />
          <div style={{ padding: "36px 40px", background: "linear-gradient(145deg,#111111,#0D0D0D)" }}>
            <p style={{ fontSize: 22, color: TEXT, fontStyle: "italic", margin: 0, lineHeight: 1.8, fontFamily: SERIF, letterSpacing: "0.02em" }}>"{quote.text}"</p>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)`, margin: "16px 0" }} />
            <p style={{ margin: 0, fontSize: 12, color: GOLD, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>— {quote.src}</p>
            {quote.ref && <p style={{ margin: "4px 0 0", fontSize: 11, color: MUTED, letterSpacing: "0.06em" }}>{quote.ref}</p>}

            {/* Next prayer under quote */}
            {nextPrayer && (
              <div onClick={() => setPage("prayer")} style={{
                marginTop: 20, paddingTop: 16,
                borderTop: `1px solid ${GOLD}25`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer",
              }}>
                <span style={{ fontSize: 14, color: GOLD, fontFamily: SERIF, fontWeight: 500, letterSpacing: "0.06em" }}>
                  {nextPrayer.name}
                </span>
                <span style={{ fontSize: 12, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {t("prayer.in")} {countdown}
                </span>
                <span style={{ fontSize: 18, color: GOLD, fontFamily: SERIF, fontWeight: 300, letterSpacing: "0.1em", fontVariantNumeric: "tabular-nums" }}>
                  {nextPrayer.time}
                </span>
              </div>
            )}
            {!savedLocation && (
              <p style={{ margin: "16px 0 0", fontSize: 11, color: MUTED, textAlign: "center", letterSpacing: "0.08em", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
                {t("hero.setLocation")}
              </p>
            )}
          </div>
        </div>

        {/* Next prayer strip — mobile only */}
        {nextPrayer && (
          <div className="home-prayer-strip" onClick={() => setPage("prayer")} style={{
            marginTop: 16, maxWidth: 580, margin: "16px auto 0",
            background: "linear-gradient(135deg,#0E0C08,#1A1710)",
            border: `1px solid ${GOLD}40`,
            borderRadius: 2, padding: "16px 22px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 1px 0 ${GOLD}20`,
          }}>
            <div>
              <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{t("prayer.next")}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: TEXT, marginTop: 2, fontFamily: SERIF }}>🕌 {nextPrayer.name}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2, letterSpacing: "0.04em" }}>{savedLocation?.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 300, color: TEXT, fontVariantNumeric: "tabular-nums", fontFamily: SERIF, letterSpacing: "0.06em" }}>{nextPrayer.time}</div>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 600, marginTop: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t("prayer.in")} {countdown}</div>
            </div>
          </div>
        )}

        {!savedLocation && (
          <div className="home-prayer-strip" onClick={() => {}} style={{
            marginTop: 16, maxWidth: 580, margin: "16px auto 0",
            background: "transparent", border: `1px dashed ${BORDER}`,
            borderRadius: 2, padding: "12px 20px", textAlign: "center", cursor: "default",
          }}>
            <span style={{ fontSize: 12, color: MUTED, letterSpacing: "0.06em" }}>{t("hero.setLocationFull")}</span>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 1, border: `1px solid ${BORDER}` }}>
        {NAV_ITEMS.filter(n => n.id !== "home").map(n => (
          <FeatureCard key={n.id} item={n} onClick={() => setPage(n.id)} label={t(`nav.${n.id}`)} patternId={`ar-${n.id}`} />
        ))}

        {/* Tools divider */}
        <div style={{
          gridColumn: "1 / -1",
          borderTop: "1px solid #242424",
          borderBottom: "1px solid #242424",
          background: "#0D0D0D",
          padding: "10px 20px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 15 }}>&#x1F6E0;</span>
          <span style={{ fontSize: 11, color: "#C9A84C", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>{t("nav.tools")}</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(201,168,76,0.3), transparent)" }} />
        </div>

        {TOOLS_ITEMS.map(n => (
          <FeatureCard key={n.id} item={n} onClick={() => setPage(n.id)} label={t(`tools.${n.id}`)} patternId={`ar-t-${n.id}`} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ item, onClick, label, patternId }) {
  return (
    <button onClick={onClick} style={{
      background: SURFACE, border: "none", borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
      padding: "24px 16px", cursor: "pointer",
      transition: "background 0.2s",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: 110, textAlign: "center",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = GREEN_L; }}
      onMouseLeave={e => { e.currentTarget.style.background = SURFACE; }}
    >
      {/* Arabesque pattern */}
      <svg xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.13, pointerEvents: "none" }}>
        <defs>
          <pattern id={patternId} width="80" height="80" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#C9A84C">
              <g transform="translate(40,40)">
                <rect x="-17" y="-17" width="34" height="34" strokeWidth="0.9"/>
                <rect x="-17" y="-17" width="34" height="34" transform="rotate(45)" strokeWidth="0.9"/>
                <circle r="10" strokeWidth="0.5"/>
                <circle r="22" strokeWidth="0.4" strokeDasharray="2 3"/>
              </g>
              <g transform="translate(0,0)">
                <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6"/>
                <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" strokeWidth="0.6"/>
              </g>
              <g transform="translate(80,0)">
                <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6"/>
                <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" strokeWidth="0.6"/>
              </g>
              <g transform="translate(0,80)">
                <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6"/>
                <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" strokeWidth="0.6"/>
              </g>
              <g transform="translate(80,80)">
                <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6"/>
                <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" strokeWidth="0.6"/>
              </g>
              <line x1="40" y1="7"  x2="40" y2="23" strokeWidth="0.5"/>
              <line x1="40" y1="57" x2="40" y2="73" strokeWidth="0.5"/>
              <line x1="7"  y1="40" x2="23" y2="40" strokeWidth="0.5"/>
              <line x1="57" y1="40" x2="73" y2="40" strokeWidth="0.5"/>
              <line x1="12" y1="12" x2="26" y2="26" strokeWidth="0.5"/>
              <line x1="68" y1="12" x2="54" y2="26" strokeWidth="0.5"/>
              <line x1="12" y1="68" x2="26" y2="54" strokeWidth="0.5"/>
              <line x1="68" y1="68" x2="54" y2="54" strokeWidth="0.5"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`}/>
      </svg>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 22, opacity: 0.9, lineHeight: 1 }}>{item.icon}</div>
        <div style={{ fontWeight: 500, color: TEXT, fontSize: 12, letterSpacing: "0.06em", fontFamily: SANS }}>{label}</div>
      </div>
    </button>
  );
}
