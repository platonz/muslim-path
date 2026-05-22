import { useState } from "react";
import { BORDER, GREEN_L, GOLD, TEXT, MUTED, SERIF, SURFACE } from "../constants";
import { Card, PageTitle, Input, Select, Btn } from "./primitives";

export default function Zakat() {
  const [currency, setCurrency] = useState("USD");
  const [goldPriceInput, setGoldPriceInput] = useState("60");
  const [fields, setFields] = useState({
    cash: "", savings: "", gold: "", silver: "",
    stocks: "", business: "", receivables: "", crypto: "",
    loans: "", expenses: ""
  });
  const [result, setResult] = useState(null);

  const f = (k) => parseFloat(fields[k]) || 0;

  function calculate() {
    const gp = parseFloat(goldPriceInput) || 60;
    const nisabGold = 85 * gp;
    const totalAssets = f("cash")+f("savings")+f("gold")+f("silver")+f("stocks")+f("business")+f("receivables")+f("crypto");
    const totalDeductions = f("loans")+f("expenses");
    const zakatable = Math.max(0, totalAssets - totalDeductions);
    const meetsNisab = zakatable >= nisabGold;
    const zakatDue = meetsNisab ? zakatable * 0.025 : 0;
    setResult({ totalAssets, totalDeductions, zakatable, meetsNisab, zakatDue, nisab: nisabGold });
  }

  const fieldDefs = [
    { k:"cash", l:"Cash & Bank Accounts", g:"Assets" },
    { k:"savings", l:"Savings & Deposits", g:"Assets" },
    { k:"gold", l:"Gold & Jewellery (value)", g:"Assets" },
    { k:"silver", l:"Silver (value)", g:"Assets" },
    { k:"stocks", l:"Stocks & Investments", g:"Assets" },
    { k:"business", l:"Business Inventory", g:"Assets" },
    { k:"receivables", l:"Money Owed to You", g:"Assets" },
    { k:"crypto", l:"Cryptocurrency", g:"Assets" },
    { k:"loans", l:"Loans You Owe", g:"Deductions" },
    { k:"expenses", l:"Outstanding Bills/Expenses", g:"Deductions" },
  ];

  const fmt = (n) => currency + " " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="zakat" title="Zakat Calculator" sub="2.5% of net zakatable wealth above nisab, held for one lunar year" />
      <Card style={{ marginBottom: 16, borderColor: `${GOLD}80`, background: "#FFF9EA" }}>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: TEXT }}>
          <strong>Important:</strong> this is an estimate. Zakat details can vary by asset type, debts, business stock, jewelry, and scholar opinion. Ask a qualified scholar for a real case.
        </div>
      </Card>
      <Card style={{ marginBottom: 20 }}>
        <div className="zakat-top-grid" style={{ display: "grid", gap: 14, marginBottom: 20 }}>
          <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}
            options={[{v:"USD",l:"USD — US Dollar"},{v:"GBP",l:"GBP — British Pound"},{v:"EUR",l:"EUR — Euro"},{v:"AED",l:"AED — Emirati Dirham"},{v:"PKR",l:"PKR — Pakistani Rupee"},{v:"BDT",l:"BDT — Bangladeshi Taka"},{v:"MYR",l:"MYR — Malaysian Ringgit"}]} />
          <Input label="Gold Price (per gram)" type="number" value={goldPriceInput} onChange={e => setGoldPriceInput(e.target.value)} />
        </div>

        {["Assets","Deductions"].map(group => (
          <div key={group} style={{ marginBottom: 20 }}>
            <h4 style={{ margin: "0 0 12px", color: GOLD, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}30`, paddingBottom: 8 }}>{group}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {fieldDefs.filter(fd => fd.g === group).map(fd => (
                <Input key={fd.k} label={fd.l} type="number" placeholder="0.00"
                  value={fields[fd.k]} onChange={e => setFields(p => ({...p, [fd.k]: e.target.value}))} />
              ))}
            </div>
          </div>
        ))}

        <Btn onClick={calculate} style={{ width: "100%" }}>Calculate Zakat</Btn>
      </Card>

      {result && (
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { l: "Total Assets", v: fmt(result.totalAssets) },
              { l: "Total Deductions", v: `- ${fmt(result.totalDeductions)}` },
              { l: "Net Zakatable Wealth", v: fmt(result.zakatable), bold: true },
              { l: "Nisab Threshold (85g gold)", v: fmt(result.nisab), note: true },
            ].map(row => (
              <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 14, color: row.note ? MUTED : TEXT }}>{row.l}</span>
                <span style={{ fontSize: 14, fontWeight: row.bold ? 700 : 400, color: row.note ? MUTED : TEXT }}>{row.v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", marginTop: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Zakat Due (2.5%)</span>
              <span style={{ fontSize: 20, fontWeight: 400, color: result.meetsNisab ? GOLD : MUTED, fontFamily: SERIF, letterSpacing: "0.04em" }}>
                {result.meetsNisab ? fmt(result.zakatDue) : "Below Nisab — No Zakat Due"}
              </span>
            </div>
            {!result.meetsNisab && (
              <p style={{ margin: 0, fontSize: 13, color: MUTED }}>Your wealth is below the nisab threshold. Zakat is not obligatory at this time.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
