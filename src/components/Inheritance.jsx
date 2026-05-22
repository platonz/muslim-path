import { useState } from "react";
import { BORDER, GREEN, GREEN_L, GOLD, TEXT, MUTED, SERIF } from "../constants";
import { Card, PageTitle, Input, Select, Btn } from "./primitives";
import { calcFaraid, fracVal, fmtFrac } from "../utils/faraid";

const MADHABS = [
  { v: "hanafi", l: "Ḥanafī" },
  { v: "maliki", l: "Mālikī" },
  { v: "shafii", l: "Shāfiʿī" },
  { v: "hanbali", l: "Ḥanbalī" },
];

export default function Inheritance() {
  const [madhab, setMadhab] = useState("hanafi");
  const [estate, setEstate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [h, setH] = useState({
    husband: false, wives: 0, sons: 0, daughters: 0,
    father: false, mother: false, paternalGF: false,
    maternalGM: false, paternalGM: false,
    fullBrothers: 0, fullSisters: 0,
    paternalHB: 0, paternalHS: 0, uterine: 0
  });
  const [results, setResults] = useState(null);
  const [err, setErr] = useState("");

  function set(k, v) { setH(p => ({...p, [k]: v})); }

  function calculate() {
    if ((parseFloat(estate)||0) <= 0) { setErr("Please enter a valid estate amount."); return; }
    if (h.husband && h.wives > 0) { setErr("The deceased cannot have both a husband and wives."); return; }
    setErr("");
    const r = calcFaraid(h, madhab);
    setResults({ shares: r, estate: parseFloat(estate) });
  }

  const numInput = (label, key, max) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 13, color: TEXT, letterSpacing: "0.02em" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => set(key, Math.max(0, h[key]-1))} style={{ width: 28, height: 28, borderRadius: 2, border: `1px solid ${BORDER}`, background: "#faf5ec", cursor: "pointer", fontSize: 16, lineHeight: 1, color: TEXT }}>−</button>
        <span style={{ width: 22, textAlign: "center", fontWeight: 600, color: h[key] > 0 ? GOLD : MUTED, fontFamily: SERIF, fontSize: 16 }}>{h[key]}</span>
        <button onClick={() => set(key, Math.min(max||99, h[key]+1))} style={{ width: 28, height: 28, borderRadius: 2, border: `1px solid ${BORDER}`, background: "#faf5ec", cursor: "pointer", fontSize: 16, lineHeight: 1, color: TEXT }}>+</button>
      </div>
    </div>
  );

  const toggle = (label, key) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 13, color: TEXT, letterSpacing: "0.02em" }}>{label}</span>
      <button onClick={() => set(key, !h[key])} style={{
        width: 42, height: 22, borderRadius: 0, border: `1px solid ${h[key] ? GOLD + "80" : BORDER}`,
        cursor: "pointer", background: h[key] ? GREEN_L : "#f0e6ce",
        position: "relative", transition: "all 0.2s"
      }}>
        <div style={{
          position: "absolute", top: 2, left: h[key] ? 21 : 2,
          width: 16, height: 16, borderRadius: 0,
          background: h[key] ? GOLD : MUTED,
          transition: "left 0.2s, background 0.2s"
        }} />
      </button>
    </div>
  );

  const fmt = (n) => (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="inherit" title="Inheritance Calculator" sub="Educational estimate for Islamic inheritance shares (Farāʾiḍ)" />

      <Card style={{ marginBottom: 16, borderColor: `${GOLD}80`, background: "#FFF9EA" }}>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: TEXT }}>
          <strong>Important:</strong> inheritance rulings can become complex very quickly. Use this as a learning estimate only, not for real estate distribution. For a real case, ask a qualified Islamic scholar.
        </div>
      </Card>

      <div className="inherit-top-grid">
        <Card>
          <Select label="Madhab" value={madhab} onChange={e => setMadhab(e.target.value)} options={MADHABS} />
          <div style={{ marginTop: 8, fontSize: 12, color: MUTED }}>
            {madhab === "maliki" ? "Grandfather does not block full siblings (muqāsama)." :
             madhab === "hanafi" ? "Grandfather treated as father — blocks full siblings." :
             madhab === "shafii" ? "ʿUmariyyatain: mother gets 1/3 of remainder. Grandfather blocks siblings." :
             "Same as Shāfiʿī for most cases. Grandfather blocks siblings."}
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}
              options={[{v:"USD",l:"USD"},{v:"GBP",l:"GBP"},{v:"EUR",l:"EUR"},{v:"AED",l:"AED"},{v:"PKR",l:"PKR"}]} />
            <Input label="Estate Value" type="number" placeholder="0.00" value={estate} onChange={e => setEstate(e.target.value)} />
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 4px", color: GOLD, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em" }}>Heirs</h4>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: MUTED }}>Select only the heirs who survive the deceased</p>
        <div className="inherit-heirs-grid">
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Spouse</p>
            {toggle("Husband", "husband")}
            {numInput("Wives", "wives", 4)}
            <p style={{ margin: "12px 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Children</p>
            {numInput("Sons", "sons")}
            {numInput("Daughters", "daughters")}
            <p style={{ margin: "12px 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Parents</p>
            {toggle("Father", "father")}
            {toggle("Mother", "mother")}
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Grandparents</p>
            {toggle("Paternal Grandfather", "paternalGF")}
            {toggle("Maternal Grandmother", "maternalGM")}
            {toggle("Paternal Grandmother", "paternalGM")}
            <p style={{ margin: "12px 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Siblings</p>
            {numInput("Full Brothers", "fullBrothers")}
            {numInput("Full Sisters", "fullSisters")}
            {numInput("Paternal Half-Brothers", "paternalHB")}
            {numInput("Paternal Half-Sisters", "paternalHS")}
            {numInput("Uterine Siblings", "uterine")}
          </div>
        </div>
        {err && <p style={{ margin: "12px 0 0", color: "#EF4444", fontSize: 12, letterSpacing: "0.03em" }}>{err}</p>}
        <Btn onClick={calculate} style={{ marginTop: 20, width: "100%" }}>Calculate Shares</Btn>
      </Card>

      {results && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 4px", fontWeight: 700 }}>Results</h3>
            <span style={{ fontSize: 12, color: MUTED }}>{currency} {fmt(results.estate)} estate · {MADHABS.find(m=>m.v===madhab)?.l}</span>
          </div>
          {results.shares.length === 0 ? (
            <p style={{ color: MUTED }}>No recognised heirs. Please add at least one heir.</p>
          ) : (
            <div>
              <div className="inherit-results-header">
                {["Heir","Share","Each","Amount"].map(hdr => (
                  <span key={hdr} style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{hdr}</span>
                ))}
              </div>
              {results.shares.map((s, i) => {
                const totalAmt = fracVal(s.frac) * results.estate;
                const eachAmt = fracVal(s.each) * results.estate;
                return (
                  <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <div className="inherit-results-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{s.heir}</div>
                        {s.count > 1 && <div style={{ fontSize: 12, color: MUTED }}>× {s.count}</div>}
                      </div>
                      <span style={{ fontFamily: "monospace", color: GREEN, fontWeight: 600, fontSize: 14 }}>{fmtFrac(s.frac)}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 14, color: MUTED }}>{fmtFrac(s.each)}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{currency} {fmt(s.count > 1 ? totalAmt : eachAmt)}</span>
                    </div>
                    <div className="inherit-results-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{s.heir}</div>
                          {s.count > 1 && <div style={{ fontSize: 11, color: MUTED }}>× {s.count} persons</div>}
                        </div>
                        <span style={{ fontFamily: "monospace", color: GREEN, fontWeight: 700, fontSize: 15 }}>{fmtFrac(s.frac)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: MUTED }}>Each: {fmtFrac(s.each)}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{currency} {fmt(s.count > 1 ? totalAmt : eachAmt)}</span>
                      </div>
                    </div>
                    {s.note && <div style={{ fontSize: 12, color: MUTED, padding: "4px 0 8px", fontStyle: "italic" }}>{s.note}</div>}
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: 4 }}>
                <span style={{ fontWeight: 700 }}>Total Distributed</span>
                <span style={{ fontWeight: 700, color: GREEN }}>
                  {currency} {fmt(results.shares.reduce((s,r) => s + fracVal(r.frac)*results.estate, 0))}
                </span>
              </div>
            </div>
          )}
          <p style={{ margin: "16px 0 0", fontSize: 12, color: MUTED, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
            Educational estimate only. Real inheritance cases may include debts, wills, missing heirs, local law, and detailed madhhab rulings. Please consult a qualified Islamic scholar before acting on these numbers.
          </p>
        </Card>
      )}
    </div>
  );
}
