import { useTranslation } from "react-i18next";
import Icon from "./Icon";

const TABS = [
  { id: "home",    icon: "home",    en: "Home",    sq: "Shtëpia" },
  { id: "quran",   icon: "quran",   en: "Quran",   sq: "Kurani"  },
  { id: "tasbeeh", icon: "tasbeeh", en: "Dhikr",   sq: "Dhikr"   },
  { id: "profile", icon: "profile", en: "You",     sq: "Ti"      },
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
              color: active ? "#176B4D" : "#87948B",
              transition: "color 0.15s",
            }}
          >
            <span style={tab.id === "quran" ? {
              filter: active
                ? "drop-shadow(0 0 5px rgba(23,107,77,0.35))"
                : "none",
              display: "flex",
            } : {}}>
              <Icon
                name={tab.icon}
                size={22}
                color={active ? "#176B4D" : "#87948B"}
                sw={active ? 2.0 : 1.5}
              />
            </span>
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
