import { useTranslation } from "react-i18next";
import Icon from "./Icon";

const TABS = [
  { id: "home",    icon: "home",    en: "Home",    sq: "Shtëpia" },
  { id: "prayer",  icon: "prayer",  en: "Prayers", sq: "Kohët"   },
  { id: "quran",   icon: "quran",   en: "Quran",   sq: "Kurani"  },
  { id: "dua",     icon: "dua",     en: "Dua",     sq: "Dua"     },
  { id: "library", icon: "library", en: "More",    sq: "Më shumë"},
];

export default function MobileTabBar({ page, navigate }) {
  const { i18n } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");

  return (
    <nav className="mobile-tab-bar" aria-label={isSq ? "Navigim kryesor" : "Main navigation"}>
      {TABS.map(tab => {
        const active = page === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            aria-label={isSq ? tab.sq : tab.en}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 0",
              color: active ? "var(--gold-dark)" : "var(--text-muted)",
              transition: "color 0.15s",
            }}
          >
            <Icon
              name={tab.icon}
              size={22}
              color={active ? "var(--gold-dark)" : "var(--text-muted)"}
              sw={active ? 2.1 : 1.5}
            />
            <span style={{
              fontSize: 9,
              fontFamily: "var(--font-sans)",
              fontWeight: active ? 700 : 400,
              letterSpacing: "0.04em",
            }}>
              {isSq ? tab.sq : tab.en}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
