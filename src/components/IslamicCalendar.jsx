import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BORDER, GREEN, GREEN_L, GOLD, TEXT, MUTED, SERIF, SURFACE } from "../constants";
import { Card, PageTitle } from "./primitives";
import { gregorianToHijri, HIJRI_MONTHS } from "../utils/hijri";
import { ISLAMIC_EVENTS, EVENT_COLORS, WHITE_DAYS_INFO } from "../data/islamicEvents";

const GREG_MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function EventPopup({ event, onClose }) {
  if (!event) return null;
  const col = EVENT_COLORS[event.type] || EVENT_COLORS.notable;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#faf5ec", borderRadius: 0, maxWidth: 480, width: "100%",
        boxShadow: `0 12px 48px rgba(160,120,50,0.18), 0 0 0 1px ${col.border}40`,
        border: `1px solid ${col.border}`,
        overflow: "hidden",
        animation: "popIn 0.2s ease",
      }}>
        <div style={{ background: col.bg, padding: "20px 24px", borderBottom: `1px solid ${col.border}` }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{event.emoji}</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: col.text }}>{event.name}</h2>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ margin: 0, fontSize: 15, color: TEXT, lineHeight: 1.75 }}>{event.desc}</p>
        </div>
        <div style={{ padding: "12px 24px 20px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: col.border, color: "#fff", fontWeight: 600,
            fontSize: 14, cursor: "pointer",
          }}>Close</button>
        </div>
      </div>
      <style>{`@keyframes popIn { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>
  );
}

function getUpcomingEvents(today) {
  const todayMs = today.getTime();
  return ISLAMIC_EVENTS
    .map(ev => { const d = new Date(ev.y, ev.m, ev.d); return { ...ev, date: d, daysLeft: Math.round((d.getTime()-todayMs)/86400000) }; })
    .filter(ev => ev.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

function getEventsForDate(y, m, d) {
  return ISLAMIC_EVENTS.filter(ev => ev.y === y && ev.m === m && ev.d === d);
}

function isRamadanDay(date) {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const start = ISLAMIC_EVENTS.find(ev => ev.ramadanStart && ev.y === y);
  if (!start) return false;
  const startMs = new Date(start.y, start.m, start.d).getTime();
  const diff = Math.round((date.getTime() - startMs) / 86400000);
  return diff >= 0 && diff < 30;
}

export default function IslamicCalendar() {
  const { t } = useTranslation();
  const today = new Date();
  today.setHours(0,0,0,0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [popup, setPopup] = useState(null);

  const upcoming = getUpcomingEvents(today);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function getDayInfo(d) {
    const date = new Date(viewYear, viewMonth, d);
    const h = gregorianToHijri(viewYear, viewMonth + 1, d);
    const isToday = date.getTime() === today.getTime();
    const isWhite = h.day === 13 || h.day === 14 || h.day === 15;
    const isRamadan = isRamadanDay(date);
    const events = getEventsForDate(viewYear, viewMonth, d);
    return { date, h, isToday, isWhite, isRamadan, events };
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
    else setViewMonth(m => m-1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
    else setViewMonth(m => m+1);
  }

  const todayH = gregorianToHijri(today.getFullYear(), today.getMonth()+1, today.getDate());

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="calendar" title={t("pages.calendar.title")} sub={t("pages.calendar.sub")} />

      <Card style={{ background: `linear-gradient(145deg,${SURFACE},#f5edda)`, border: `1px solid ${GOLD}40`, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em" }}>Today</div>
            <div style={{ fontSize: 22, fontWeight: 400, marginTop: 4, fontFamily: SERIF, color: TEXT, letterSpacing: "0.04em" }}>
              {today.getDate()} {GREG_MONTHS_FULL[today.getMonth()]} {today.getFullYear()}
            </div>
            <div style={{ fontSize: 13, color: GOLD, marginTop: 4, letterSpacing: "0.06em" }}>
              {todayH.day} {HIJRI_MONTHS[todayH.month-1]} {todayH.year} AH
            </div>
          </div>
          {upcoming[0] && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em" }}>Next Event</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, color: TEXT, fontFamily: SERIF }}>
                {upcoming[0].emoji} {upcoming[0].name}
              </div>
              <div style={{ fontSize: 12, color: GOLD, marginTop: 4, letterSpacing: "0.04em" }}>
                {upcoming[0].daysLeft === 0 ? "Today" : upcoming[0].daysLeft === 1 ? "Tomorrow" : `In ${upcoming[0].daysLeft} days`}
                {" · "}{upcoming[0].date.getDate()} {GREG_MONTHS_FULL[upcoming[0].date.getMonth()]}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {upcoming.slice(0, 5).map((ev, i) => {
          const col = EVENT_COLORS[ev.type] || EVENT_COLORS.notable;
          return (
            <div key={i} onClick={() => setPopup(ev)} style={{
              flex: "0 0 auto", minWidth: 155,
              background: col.bg, border: `1px solid ${col.border}`,
              borderRadius: 2, padding: "14px 16px",
              cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{ev.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: col.text, lineHeight: 1.3 }}>{ev.name}</div>
              <div style={{ fontSize: 12, color: col.text, opacity: 0.8, marginTop: 4 }}>
                {ev.daysLeft === 0 ? "Today" : ev.daysLeft === 1 ? "Tomorrow" : `${ev.daysLeft} days`}
              </div>
              <div style={{ fontSize: 11, color: col.text, opacity: 0.65 }}>
                {ev.date.getDate()} {GREG_MONTHS_FULL[ev.date.getMonth()].slice(0,3)} {ev.date.getFullYear()}
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={prevMonth} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 2, width: 34, height: 34, cursor: "pointer", fontSize: 18, color: MUTED }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 400, fontSize: 20, fontFamily: SERIF, letterSpacing: "0.06em", color: TEXT }}>{GREG_MONTHS_FULL[viewMonth]} {viewYear}</div>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.08em", marginTop: 2 }}>
              {(() => { const h = gregorianToHijri(viewYear, viewMonth+1, 15); return `${HIJRI_MONTHS[h.month-1]} ${h.year} AH`; })()}
            </div>
          </div>
          <button onClick={nextMonth} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 2, width: 34, height: 34, cursor: "pointer", fontSize: 18, color: MUTED }}>›</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: d === "Fri" ? GREEN : MUTED, padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const { h, isToday, isWhite, isRamadan, events } = getDayInfo(d);
            const hasEvent = events.length > 0;
            const eventColor = hasEvent ? (EVENT_COLORS[events[0].type] || EVENT_COLORS.notable) : null;

            let bg = "transparent";
            let borderColor = "transparent";
            let textColor = TEXT;

            if (isToday) { bg = GOLD; textColor = "#f0e6ce"; borderColor = GOLD; }
            else if (hasEvent) { bg = eventColor.bg; borderColor = eventColor.border; textColor = eventColor.text; }
            else if (isWhite) { bg = EVENT_COLORS.white.bg; borderColor = EVENT_COLORS.white.border; }
            else if (isRamadan) { bg = EVENT_COLORS.ramadan.bg; borderColor = EVENT_COLORS.ramadan.border + "60"; }

            return (
              <div key={d} onClick={() => { if (hasEvent) setPopup(events[0]); else if (isWhite) setPopup(WHITE_DAYS_INFO); }} style={{
                borderRadius: 8, border: `1px solid ${borderColor}`,
                background: bg, padding: "6px 4px",
                minHeight: 56, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 2, position: "relative",
                transition: "transform 0.1s",
                cursor: (hasEvent || isWhite) ? "pointer" : "default",
              }}
                onMouseEnter={e => { if (!isToday) e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <span style={{ fontSize: 15, fontWeight: isToday ? 700 : 400, color: textColor }}>{d}</span>
                <span style={{ fontSize: 10, color: isToday ? "rgba(255,255,255,0.8)" : MUTED }}>{h.day}</span>
                {isWhite && !hasEvent && !isToday && <span title="White Day — voluntary fast">⚪</span>}
                {hasEvent && <span style={{ fontSize: 12 }}>{events[0].emoji}</span>}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          {[
            { bg: GREEN, border: GREEN, label: "Today", info: null },
            { bg: EVENT_COLORS.white.bg, border: EVENT_COLORS.white.border, label: "White Days (13–15 Hijri)", info: WHITE_DAYS_INFO },
            { bg: EVENT_COLORS.ramadan.bg, border: EVENT_COLORS.ramadan.border, label: "Ramadan", info: ISLAMIC_EVENTS.find(e => e.ramadanStart) },
            { bg: EVENT_COLORS.eid.bg, border: EVENT_COLORS.eid.border, label: "Eid", info: ISLAMIC_EVENTS.find(e => e.type==="eid") },
            { bg: EVENT_COLORS.major.bg, border: EVENT_COLORS.major.border, label: "Major Event", info: ISLAMIC_EVENTS.find(e => e.type==="major") },
            { bg: EVENT_COLORS.notable.bg, border: EVENT_COLORS.notable.border, label: "Notable Day", info: ISLAMIC_EVENTS.find(e => e.type==="notable") },
          ].map(l => (
            <div key={l.label} onClick={() => l.info && setPopup(l.info)}
              style={{ display: "flex", alignItems: "center", gap: 6, cursor: l.info ? "pointer" : "default",
                padding: "4px 8px", borderRadius: 6, transition: "background 0.15s" }}
              onMouseEnter={e => { if(l.info) e.currentTarget.style.background="#F3F4F6"; }}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.bg, border: `1.5px solid ${l.border}`, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: MUTED }}>{l.label}</span>
              {l.info && <span style={{ fontSize: 10, color: MUTED }}>ℹ️</span>}
            </div>
          ))}
        </div>

        <p style={{ margin: "12px 0 0", fontSize: 12, color: MUTED }}>
          Small numbers = Hijri date · Click any highlighted day or legend item to learn more.
        </p>
      </Card>

      <EventPopup event={popup} onClose={() => setPopup(null)} />
    </div>
  );
}
