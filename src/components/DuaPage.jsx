import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { BORDER, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS, SURFACE } from "../constants";
import { PageTitle } from "./primitives";
import { DUAS } from "../data/duas";

const DUA_CAT_META = {
  Morning:    { icon: "☀️", sqLabel: "Mëngjes",   color: "#e8a020" },
  Evening:    { icon: "🌙", sqLabel: "Mbrëmje",   color: "#6b7fba" },
  Prayer:     { icon: "🕌", sqLabel: "Namaz",     color: "#2e8b57" },
  Meals:      { icon: "🍽️", sqLabel: "Ushqim",    color: "#c0603a" },
  Home:       { icon: "🏠", sqLabel: "Shtëpi",    color: "#8b5e3c" },
  Sleep:      { icon: "🌙", sqLabel: "Gjumë",     color: "#4a5580" },
  Travel:     { icon: "✈️", sqLabel: "Udhëtim",   color: "#1a8fa0" },
  Protection: { icon: "🛡️", sqLabel: "Mbrojtje",  color: "#6b4a9a" },
  Distress:   { icon: "🤲", sqLabel: "Vështirësi",color: "#b85c5c" },
  General:    { icon: "📿", sqLabel: "Të tjera",  color: "#5a7a5a" },
};

const ARABIC_F = "'Amiri', 'Traditional Arabic', serif";

export default function DuaPage({ favs = new Set(), onFav = () => {} }) {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");
  const [cat, setCat] = useState(null);
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);

  const CONTENT_CATS = Object.keys(DUA_CAT_META);

  const filtered = cat === "Saved"
    ? DUAS.filter((d, i) => favs.has(d.cat + "-" + i))
    : DUAS.filter(d => d.cat === cat);

  function copy(dua, id) {
    const translation = isSq && dua.sq ? dua.sq : dua.en;
    const text = `${dua.ar}\n\n${dua.tr}\n\n${translation}\n— ${dua.src}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id); setTimeout(() => setCopied(null), 1600);
    }).catch(() => {});
  }

  const savedCount = DUAS.filter((d, i) => favs.has(d.cat + "-" + i)).length;

  if (cat === null) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <PageTitle icon="dua" title={t("dua.title")} sub={t("dua.sub")} />

        {savedCount > 0 && (
          <button
            onClick={() => { setCat("Saved"); setOpen(null); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", marginBottom: 20,
              background: GREEN_L, border: `1px solid ${GOLD}40`,
              borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0ead0"}
            onMouseLeave={e => e.currentTarget.style.background = GREEN_L}
          >
            <span style={{ fontSize: 22 }}>♥</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, fontFamily: SERIF }}>{t("dua.saved")}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{savedCount} {isSq ? "lutje të ruajtura" : "saved duas"}</div>
            </div>
            <span style={{ color: MUTED, fontSize: 16 }}>›</span>
          </button>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {CONTENT_CATS.map(c => {
            const meta = DUA_CAT_META[c];
            const count = DUAS.filter(d => d.cat === c).length;
            return (
              <button
                key={c}
                onClick={() => { setCat(c); setOpen(null); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "20px 12px",
                  background: SURFACE, border: `1px solid ${BORDER}`,
                  borderRadius: "var(--radius-md)", cursor: "pointer",
                  transition: "all 0.15s", textAlign: "center",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = GREEN_L; e.currentTarget.style.borderColor = GOLD + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = SURFACE; e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 26, lineHeight: 1 }}>{meta.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: SERIF, letterSpacing: "0.02em" }}>
                    {isSq ? meta.sqLabel : c}
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{count} {isSq ? "lutje" : "duas"}</div>
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: MUTED, textAlign: "center", letterSpacing: "0.04em" }}>
          {t("dua.hint")}
        </p>
      </div>
    );
  }

  const meta = DUA_CAT_META[cat];
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => { setCat(null); setOpen(null); }}
          style={{
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-sm)",
            cursor: "pointer", color: MUTED, padding: "6px 14px",
            fontSize: 13, display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
        >‹ {isSq ? "Kategoritë" : "Categories"}</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          {cat !== "Saved" && <span style={{ fontSize: 22 }}>{meta?.icon}</span>}
          {cat === "Saved" && <span style={{ fontSize: 22, color: GOLD }}>♥</span>}
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontFamily: SERIF, color: TEXT, letterSpacing: "0.04em" }}>
              {cat === "Saved" ? t("dua.saved") : (isSq ? meta?.sqLabel : cat)}
            </h2>
            <div style={{ fontSize: 11, color: MUTED }}>{filtered.length} {isSq ? "lutje" : "duas"}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filtered.map((dua, i) => {
          const id = `${dua.cat}-${i}`;
          const origIdx = DUAS.indexOf(dua);
          const favId = `${dua.cat}-${origIdx}`;
          const isFav = favs.has(favId);
          const isOpen = open === id;
          return (
            <div key={id} className="glass-card" style={{ borderRadius: "var(--radius-sm)", marginBottom: 2, background: isOpen ? "#faf5ec" : SURFACE, border: `1px solid ${isOpen ? GOLD+"40" : BORDER}`, transition: "all 0.2s" }}>
              <button onClick={() => setOpen(isOpen ? null : id)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: TEXT, fontFamily: SERIF, letterSpacing: "0.02em" }}>{isSq && dua.sqTitle ? dua.sqTitle : dua.title}</div>
                </div>
                <span style={{ color: MUTED, fontSize: 11, flexShrink: 0, marginLeft: 12 }}>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 20px" }}>
                  <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD}40,transparent)`, marginBottom: 18 }} />
                  <div style={{ fontFamily: ARABIC_F, fontSize: 22, color: GOLD, direction: "rtl", lineHeight: 2.4, marginBottom: 16, textAlign: "right" }}>
                    {dua.ar}
                  </div>
                  <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic", marginBottom: 12, lineHeight: 1.8, borderLeft: `2px solid ${BORDER}`, paddingLeft: 12 }}>
                    {dua.tr}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.75, marginBottom: 14 }}>
                    {isSq && dua.sq ? dua.sq : dua.en}
                  </div>
                  {(isSq ? (dua.sqNote || dua.note) : dua.note) && (
                    <div style={{ fontSize: 12, color: GOLD, background: GREEN_L, border: `1px solid ${GOLD}30`, borderRadius: "var(--radius-sm)", padding: "9px 14px", marginBottom: 14, lineHeight: 1.65 }}>
                      ✦ {isSq && dua.sqNote ? dua.sqNote : dua.note}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.04em" }}>📖 {dua.src}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => onFav(favId)} title={isFav ? "Remove from saved" : "Save"} style={{
                        background: "none", border: "1px solid " + (isFav ? GOLD + "60" : BORDER),
                        borderRadius: "var(--radius-sm)", padding: "4px 10px", fontSize: 14, color: isFav ? GOLD : MUTED,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>{isFav ? "♥" : "♡"}</button>
                      <button onClick={() => copy(dua, id)} style={{
                        background: "none", border: "1px solid " + (copied===id ? GOLD : BORDER),
                        borderRadius: "var(--radius-sm)", padding: "4px 14px", fontSize: 11, color: copied===id ? GOLD : MUTED,
                        cursor: "pointer", fontFamily: SANS, letterSpacing: "0.06em", transition: "all 0.15s",
                      }}>{copied===id ? t("dua.copied") : t("dua.copy")}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {cat === "Saved" && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>♡</div>
          <div style={{ fontSize: 13, letterSpacing: "0.04em" }}>{t("dua.noSaved")}</div>
        </div>
      )}
    </div>
  );
}
