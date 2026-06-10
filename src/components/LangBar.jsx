import { useTranslation } from "react-i18next";
import { SANS } from "../constants";
import { PAGE_SLUGS } from "../lib/routing";

export default function LangBar({ page }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("sq") ? "sq" : "en";

  function switchLang(lang) {
    if (lang === current) return;
    i18n.changeLanguage(lang);
    const slug = (PAGE_SLUGS[lang] || PAGE_SLUGS.en)[page] ?? page;
    const newUrl = page === "home" ? `/${lang}/` : `/${lang}/${slug}`;
    window.location.href = newUrl;
  }

  const btn = (lang, label) => {
    const active = current === lang;
    return (
      <button
        key={lang}
        onClick={() => switchLang(lang)}
        style={{
          padding: "4px 14px", borderRadius: 999,
          border: `1px solid ${active ? "#176B4D" : "rgba(24,35,29,0.12)"}`,
          background: active ? "#176B4D" : "rgba(255,255,255,0.72)",
          color: active ? "#fff" : "#6F7C73",
          cursor: active ? "default" : "pointer",
          fontSize: 11, fontWeight: 600,
          letterSpacing: "0.06em", fontFamily: SANS,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#EEF4EC"; e.currentTarget.style.color = "#176B4D"; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.72)"; e.currentTarget.style.color = "#6F7C73"; } }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0", borderBottom: "1px solid rgba(24,35,29,0.08)", background: "rgba(245,247,242,0.72)" }}>
      {btn("en", "EN")}
      {btn("sq", "SQ")}
    </div>
  );
}
