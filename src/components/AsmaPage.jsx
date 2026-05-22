import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { BORDER, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS, SURFACE } from "../constants";
import { PageTitle } from "./primitives";
import { ASMA } from "../data/asma";

const ARABIC_F = "'Amiri', 'Traditional Arabic', serif";

export default function AsmaPage() {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);

  const filtered = !search.trim() ? ASMA : ASMA.filter(a =>
    a.tr.toLowerCase().includes(search.toLowerCase()) ||
    a.en.toLowerCase().includes(search.toLowerCase()) ||
    (a.sq && a.sq.toLowerCase().includes(search.toLowerCase())) ||
    a.m.toLowerCase().includes(search.toLowerCase()) ||
    String(a.n) === search.trim()
  );

  return (
    <div style={{ maxWidth: 940, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="asma" title={t("asma.title")} sub={t("asma.sub")} />

      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontFamily: ARABIC_F, fontSize: 20, color: GOLD, direction: "rtl", lineHeight: 2 }}>
          وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا
        </div>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 4, letterSpacing: "0.04em" }}>
          {t("asma.verse")}
        </p>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder={t("asma.search")}
        style={{ width:"100%", padding:"10px 14px", background:SURFACE, border:`1px solid ${BORDER}`,
          color:TEXT, fontSize:13, outline:"none", marginBottom:24, fontFamily:SANS, boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor=GOLD}
        onBlur={e => e.target.style.borderColor=BORDER}
      />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:1, border:`1px solid ${BORDER}` }}>
        {filtered.map(a => (
          <button key={a.n} onClick={() => setSel(sel?.n===a.n ? null : a)} style={{
            background: sel?.n===a.n ? GREEN_L : SURFACE,
            border:"none", borderRight:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`,
            padding:"14px 10px", cursor:"pointer", textAlign:"center", transition:"background 0.15s",
          }}
            onMouseEnter={e => { if(sel?.n!==a.n) e.currentTarget.style.background=GREEN_L; }}
            onMouseLeave={e => { if(sel?.n!==a.n) e.currentTarget.style.background=SURFACE; }}
          >
            <div style={{ fontSize:9, color:sel?.n===a.n ? GOLD : MUTED, letterSpacing:"0.1em", marginBottom:4 }}>{a.n}</div>
            <div style={{ fontFamily:ARABIC_F, fontSize:18, color:sel?.n===a.n ? GOLD : TEXT, lineHeight:1.9, marginBottom:4 }}>{a.ar}</div>
            <div style={{ fontSize:9, color:sel?.n===a.n ? GOLD : MUTED, letterSpacing:"0.07em", textTransform:"uppercase", lineHeight:1.4 }}>{a.tr}</div>
          </button>
        ))}
      </div>

      {sel && (
        <div onClick={() => setSel(null)} style={{
          position:"fixed", inset:0, zIndex:500,
          background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"20px",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:`linear-gradient(135deg,${SURFACE},#f0e8d0)`,
            border:`1px solid ${GOLD}50`,
            boxShadow:`0 24px 80px rgba(160,120,50,0.2), 0 0 0 1px ${GOLD}20`,
            maxWidth:480, width:"100%", padding:"36px 32px",
            position:"relative",
          }}>
            <button onClick={() => setSel(null)} style={{
              position:"absolute", top:14, right:14,
              background:"none", border:`1px solid ${BORDER}`,
              color:MUTED, width:28, height:28, cursor:"pointer",
              fontSize:13, display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:SANS, borderRadius:2,
            }}>✕</button>

            <div style={{ fontSize:10, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:16 }}>
              {t("asma.nameOf", { n: sel.n })}
            </div>

            <div style={{
              fontFamily:ARABIC_F, fontSize:46, color:GOLD,
              lineHeight:1.8, direction:"rtl", textAlign:"center",
              marginBottom:12,
              textShadow:`0 0 40px ${GOLD}40`,
            }}>{sel.ar}</div>

            <div style={{ height:1, background:`linear-gradient(to right, transparent, ${GOLD}40, transparent)`, marginBottom:16 }} />

            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:22, color:TEXT, fontFamily:SERIF, letterSpacing:"0.05em", marginBottom:6 }}>{sel.tr}</div>
              <div style={{ fontSize:13, color:GOLD, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:SANS }}>{sel.en}</div>
            </div>

            <div style={{
              background:"rgba(201,168,76,0.06)",
              border:`1px solid ${GOLD}20`,
              padding:"16px 18px",
              fontSize:14, color:TEXT, lineHeight:1.8,
              fontFamily:SANS,
            }}>
              {isSq && sel.sq ? sel.sq : sel.m}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
              <button
                disabled={sel.n === 1}
                onClick={() => setSel(ASMA[sel.n - 2])}
                style={{
                  background:"none", border:`1px solid ${sel.n === 1 ? BORDER : GOLD + "50"}`,
                  color: sel.n === 1 ? MUTED : GOLD,
                  padding:"6px 16px", cursor: sel.n === 1 ? "default" : "pointer",
                  fontSize:11, fontFamily:SANS, letterSpacing:"0.07em",
                }}>&#8592; Prev</button>
              <button
                disabled={sel.n === 99}
                onClick={() => setSel(ASMA[sel.n])}
                style={{
                  background:"none", border:`1px solid ${sel.n === 99 ? BORDER : GOLD + "50"}`,
                  color: sel.n === 99 ? MUTED : GOLD,
                  padding:"6px 16px", cursor: sel.n === 99 ? "default" : "pointer",
                  fontSize:11, fontFamily:SANS, letterSpacing:"0.07em",
                }}>Next &#8594;</button>
            </div>
          </div>
        </div>
      )}

      <p style={{ marginTop:20, fontSize:12, color:MUTED, textAlign:"center", letterSpacing:"0.04em" }}>
        This list is a learning aid for Allah's Beautiful Names. Scholars discuss the exact list; the hadith encourages learning, preserving, understanding, and living by them. — Bukhari 2736 · Muslim 2677
      </p>
    </div>
  );
}
