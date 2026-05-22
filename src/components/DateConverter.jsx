import { useState, useEffect } from "react";
import { GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS, SURFACE } from "../constants";
import { Card, PageTitle, Input, Btn } from "./primitives";
import { gregorianToHijri, hijriToGregorian, HIJRI_MONTHS } from "../utils/hijri";

const GREG_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function DateConverter() {
  const today = new Date();
  const hijriToday = gregorianToHijri(today.getFullYear(), today.getMonth()+1, today.getDate());
  const [mode, setMode] = useState("gToH");
  const [gYear, setGYear] = useState(String(today.getFullYear()));
  const [gMonth, setGMonth] = useState(String(today.getMonth()+1));
  const [gDay, setGDay] = useState(String(today.getDate()));
  const [hYear, setHYear] = useState(String(hijriToday.year));
  const [hMonth, setHMonth] = useState(String(hijriToday.month));
  const [hDay, setHDay] = useState(String(hijriToday.day));
  const [result, setResult] = useState(null);

  function convert() {
    if (mode === "gToH") {
      const r = gregorianToHijri(parseInt(gYear), parseInt(gMonth), parseInt(gDay));
      setResult({ type: "hijri", ...r });
    } else {
      const r = hijriToGregorian(parseInt(hYear), parseInt(hMonth), parseInt(hDay));
      setResult({ type: "gregorian", ...r });
    }
  }

  useEffect(() => {
    setResult({ type: "hijri", ...hijriToday });
  }, []);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="dates" title="Date Converter" sub="Convert between Hijri (Islamic) and Gregorian calendars" />

      <Card style={{ background: GREEN_L, border: `1px solid ${GOLD}30`, marginBottom: 20, textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em" }}>Today</p>
        <p style={{ margin: "6px 0 0", fontWeight: 400, color: TEXT, fontSize: 18, fontFamily: SERIF, letterSpacing: "0.04em" }}>
          {today.getDate()} {GREG_MONTHS[today.getMonth()]} {today.getFullYear()}
        </p>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD}40,transparent)`, margin: "10px 0" }} />
        <p style={{ margin: 0, color: GOLD, fontWeight: 500, fontSize: 15, fontFamily: SERIF, letterSpacing: "0.06em" }}>
          {hijriToday.day} {HIJRI_MONTHS[hijriToday.month-1]} {hijriToday.year} AH
        </p>
      </Card>

      <Card>
        <div style={{ display: "flex", background: "#f0e6ce", border: `1px solid #E5E7EB`, borderRadius: 2, padding: 3, marginBottom: 20 }}>
          {[{v:"gToH",l:"Gregorian → Hijri"},{v:"hToG",l:"Hijri → Gregorian"}].map(opt => (
            <button key={opt.v} onClick={() => setMode(opt.v)} style={{
              flex: 1, padding: "8px", borderRadius: 2, border: "none", cursor: "pointer",
              background: mode === opt.v ? SURFACE : "transparent",
              borderBottom: mode === opt.v ? `1px solid ${GOLD}` : "1px solid transparent",
              fontWeight: mode === opt.v ? 600 : 400,
              color: mode === opt.v ? GOLD : MUTED,
              fontSize: 12, letterSpacing: "0.04em",
              transition: "all 0.2s", fontFamily: SANS,
            }}>{opt.l}</button>
          ))}
        </div>

        {mode === "gToH" ? (
          <div className="date-input-grid" style={{ display: "grid", gap: 12 }}>
            <Input label="Day" type="number" min="1" max="31" value={gDay} onChange={e => setGDay(e.target.value)} />
            <Input label="Month" type="number" min="1" max="12" value={gMonth} onChange={e => setGMonth(e.target.value)} />
            <Input label="Year" type="number" value={gYear} onChange={e => setGYear(e.target.value)} />
          </div>
        ) : (
          <div className="date-input-grid" style={{ display: "grid", gap: 12 }}>
            <Input label="Day" type="number" min="1" max="30" value={hDay} onChange={e => setHDay(e.target.value)} />
            <Input label="Month" type="number" min="1" max="12" value={hMonth} onChange={e => setHMonth(e.target.value)} />
            <Input label="Year (AH)" type="number" value={hYear} onChange={e => setHYear(e.target.value)} />
          </div>
        )}

        <Btn onClick={convert} style={{ marginTop: 16, width: "100%" }}>Convert</Btn>

        {result && (
          <div style={{ marginTop: 20, padding: 24, background: GREEN_L, border: `1px solid ${GOLD}30`, borderRadius: 2, textAlign: "center" }}>
            {result.type === "hijri" ? (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: MUTED }}>Hijri Date</p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 400, color: GOLD, fontFamily: SERIF, letterSpacing: "0.04em" }}>
                  {result.day} {HIJRI_MONTHS[result.month-1]} {result.year} AH
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em" }}>Gregorian Date</p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 400, color: GOLD, fontFamily: SERIF, letterSpacing: "0.04em" }}>
                  {result.day} {GREG_MONTHS[result.month-1]} {result.year}
                </p>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
