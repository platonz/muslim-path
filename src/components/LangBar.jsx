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
          border: `1.5px solid ${active ? "#1A1915" : "#C8B89A"}`,
          background: active ? "#1A1915" : "transparent",
          color: active ? "#fff" : "#6B6050",
          cursor: active ? "default" : "pointer",
          fontSize: 11, fontWeight: 600,
          letterSpacing: "0.06em", fontFamily: SANS,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#EDE8DC"; e.currentTarget.style.color = "#1A1915"; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B6050"; } }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0", borderBottom: "1px solid #EDE8DC" }}>
      {btn("en", "GB EN")}
      {btn("sq", "AL SQ")}
    </div>
  );
}
