import { useState } from "react";
import "../styles/library.css";
import Icon from "./Icon";
import { pageToUrl } from "../lib/routing";

/* Set true to see the clickable zones over the scene image */
const DEBUG_HOTSPOTS = false;

export const SHELVES = [
  {
    label: "LEXIMI",
    books: [
      { id: "sunneti", title: "Sunneti", sub: "LIBRI", icon: "bookmark", c: ["#42652a", "#2f511b", "#1d3510"] },
      { id: "quran", title: "Kurani", sub: "LEXIMI", icon: "quran", c: ["#2d785b", "#176b4d", "#0d4530"] },
      { id: "library", title: "Biblioteka", sub: "LIBRAT PDF", icon: "library", c: ["#8a5528", "#5c3719", "#38210d"] },
      { id: "audio", title: "Ligjëratat", sub: "AUDIO", icon: "audio", c: ["#945020", "#733719", "#4e250f"] },
    ],
  },
  {
    label: "ADHURIMI",
    books: [
      { id: "namaz", title: "Si të Falesh", sub: "NAMAZI", icon: "dua", c: ["#355881", "#203d64", "#142843"] },
      { id: "howpray", title: "How to Pray", sub: "ENGLISH", icon: "globe", c: ["#426681", "#2b4b67", "#1b3148"] },
      { id: "dua", title: "Duatë", sub: "LUTJET", icon: "heart", c: ["#842d3a", "#67202b", "#45131b"] },
      { id: "asma", title: "99 Emrat", sub: "EL-ESMA", icon: "asma", c: ["#66335b", "#4c2546", "#31172d"] },
      { id: "tasbeeh", title: "Tesbih", sub: "DHIKRI", icon: "tasbeeh", c: ["#2d6361", "#1f4a49", "#132f2f"] },
    ],
  },
  {
    label: "VEGLA",
    books: [
      { id: "zakat", title: "Zekati", sub: "LLOGARITJA", icon: "zakat", c: ["#937024", "#735719", "#4f3b0f"] },
      { id: "inheritance", title: "Trashëgimia", sub: "HISEJA", icon: "inherit", c: ["#63632a", "#49491d", "#303013"] },
      { id: "calendar", title: "Kalendari", sub: "HIXHRI", icon: "calendar", c: ["#4f6d3f", "#38542c", "#263a1f"] },
      { id: "dates", title: "Datat", sub: "KONVERTIMI", icon: "dates", c: ["#755341", "#583c2e", "#3c281f"] },
    ],
  },
];

export const BOOK_TITLES = Object.fromEntries(
  SHELVES.flatMap(section => section.books.map(book => [book.id, book.title]))
);

export function LibraryDoor({ onEnter }) {
  const [opening, setOpening] = useState(false);

  function open() {
    if (opening) return;
    setOpening(true);
    setTimeout(onEnter, 1250);
  }

  return (
    <div className={"lib-door" + (opening ? " is-opening" : "")}>
      <div className="door-brand">
        <img src="/logo.png" alt="" />
        <span>Sunneti.com</span>
      </div>
      <div className="door-sign">
        <div className="door-sign-title">Biblioteka</div>
        <div className="door-sign-sub">Dije • Adhurim • Lexim</div>
      </div>
      <div className="door-scene">
        <span className="door-lantern door-lantern--left" aria-hidden="true" />
        <button className="door-frame" onClick={open} aria-label="Hyr në bibliotekë">
          <span className="door-arch-rim" aria-hidden="true" />
          <span className="door-keystone" aria-hidden="true">❖</span>
          <span className="door-light" aria-hidden="true" />
          <span className="door-leaves" aria-hidden="true">
            <span className="door-leaf door-leaf--left">
              <span className="leaf-panel leaf-panel--top" />
              <span className="leaf-panel leaf-panel--bottom" />
              <span className="leaf-handle" />
            </span>
            <span className="door-leaf door-leaf--right">
              <span className="leaf-panel leaf-panel--top" />
              <span className="leaf-panel leaf-panel--bottom" />
              <span className="leaf-handle" />
            </span>
          </span>
          <span className="door-threshold" aria-hidden="true" />
        </button>
        <span className="door-lantern door-lantern--right" aria-hidden="true" />
      </div>
      <span className="door-floor-glow" aria-hidden="true" />
      <div className="door-hint">
        Trokit për të hyrë
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </div>
    </div>
  );
}

/* Percent-based clickable zones over the scene image (1536x1024).
   `page` is the app's internal page id; hrefs come from lib/routing slugs. */
const HOTSPOTS = [
  { id: "sunneti",      label: "Sunneti",            page: "sunneti",     left: 17.95, top: 19.10, width: 7.55,  height: 15.45 },
  { id: "kurani",       label: "Kurani",             page: "quran",       left: 28.90, top: 19.10, width: 7.50,  height: 15.45 },
  { id: "biblioteka",   label: "Biblioteka",         page: "library",     left: 39.25, top: 19.10, width: 7.55,  height: 15.45 },
  { id: "ligjeratat",   label: "Ligjëratat",         page: "audio",       left: 49.60, top: 19.10, width: 7.55,  height: 15.45 },

  { id: "si-te-falesh", label: "Si të Falesh",       page: "namaz",       left: 14.85, top: 44.15, width: 7.95,  height: 17.95 },
  { id: "how-to-pray",  label: "How to Pray",        page: "howpray",     left: 24.75, top: 44.15, width: 7.95,  height: 17.95 },
  { id: "duate",        label: "Duatë",              page: "dua",         left: 34.70, top: 44.15, width: 8.05,  height: 17.95 },
  { id: "emrat-99",     label: "99 Emrat",           page: "asma",        left: 44.85, top: 44.15, width: 7.95,  height: 17.95 },
  { id: "tesbih",       label: "Tesbih",             page: "tasbeeh",     left: 54.60, top: 44.15, width: 8.05,  height: 17.95 },

  { id: "zekati",       label: "Zekati",             page: "zakat",       left: 17.75, top: 69.05, width: 7.90,  height: 17.40 },
  { id: "trashegimia",  label: "Trashëgimia",        page: "inheritance", left: 28.35, top: 69.05, width: 7.85,  height: 17.40 },
  { id: "kalendari",    label: "Kalendari",          page: "calendar",    left: 39.05, top: 69.05, width: 7.90,  height: 17.40 },
  { id: "datat",        label: "Datat",              page: "dates",       left: 49.65, top: 69.05, width: 7.85,  height: 17.40 },

  { id: "read-cta",     label: "Merr për të lexuar", page: "library",     left: 68.80, top: 69.20, width: 15.20, height: 5.40 },

  { id: "kreu",         label: "Kreu",               page: "home",        left: 20.31, top: 90.50, width: 9.57,  height: 7.50 },
  { id: "katalogu",     label: "Katalogu",           page: "library",     left: 31.38, top: 90.50, width: 12.96, height: 7.50 },
  { id: "favoritet",    label: "Favoritet",          page: "dua",         left: 45.77, top: 90.50, width: 12.50, height: 7.50 },
  { id: "historia",     label: "Historia",           page: "calendar",    left: 59.70, top: 90.50, width: 10.55, height: 7.50 },
  { id: "profili",      label: "Profili",            page: "profile",     left: 71.74, top: 90.50, width: 10.81, height: 7.50 },
];

/* Shared leather-cover innards, used by the mobile cards */
function BookCover({ b }) {
  return (
    <>
      <span className="bk-spine" aria-hidden="true" />
      <span className="bk-pages" aria-hidden="true" />
      <span className="bk-face">
        <span className="bk-corner bk-corner--tl" aria-hidden="true" />
        <span className="bk-corner bk-corner--tr" aria-hidden="true" />
        <span className="bk-corner bk-corner--bl" aria-hidden="true" />
        <span className="bk-corner bk-corner--br" aria-hidden="true" />
        <span className="bk-medallion">
          <span className="bk-icon"><Icon name={b.icon} size={18} /></span>
        </span>
        <span className="bk-title">{b.title}</span>
        <span className="bk-orn" aria-hidden="true">
          <span className="bk-orn-rule" /><span className="bk-orn-diamond">&#10070;</span><span className="bk-orn-rule" />
        </span>
        <span className="bk-sub">{b.sub}</span>
      </span>
      <span className="bk-sheen" aria-hidden="true" />
    </>
  );
}

export function LibraryShelf({ navigate, onSearch, authUser, onAuthClick }) {
  function go(e, spot) {
    e.preventDefault();
    if (spot.page === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (spot.page === "profile" && !authUser) { onAuthClick(); return; }
    navigate(spot.page);
  }

  const DOCK = HOTSPOTS.filter(h => ["kreu", "katalogu", "favoritet", "historia", "profili"].includes(h.id));
  const DOCK_ICONS = { kreu: "home", katalogu: "library", favoritet: "heart", historia: "calendar", profili: "user" };

  return (
    <main className="libraryPage">
      {/* ── Desktop / tablet: the painted scene with live hotspots ── */}
      <section className="libraryScene" aria-label="Biblioteka">
        <picture>
          <source srcSet="/images/library-scene.avif" type="image/avif" />
          <source srcSet="/images/library-scene.webp" type="image/webp" />
          <img
            src="/images/library-scene.png"
            alt=""
            className="librarySceneImage"
            fetchpriority="high"
            aria-hidden="true"
          />
        </picture>
        <nav className={"sceneHotspots" + (DEBUG_HOTSPOTS ? " is-debug" : "")} aria-label="Biblioteka — librat dhe navigimi">
          {HOTSPOTS.map(spot => (
            <a
              key={spot.id}
              href={pageToUrl(spot.page)}
              className={"hero-spot" + (spot.id === "kreu" ? " is-active" : "")}
              aria-label={spot.label}
              data-label={spot.label}
              onClick={e => go(e, spot)}
              style={{
                left: spot.left + "%",
                top: spot.top + "%",
                width: spot.width + "%",
                height: spot.height + "%",
              }}
            />
          ))}
        </nav>
      </section>

      {/* ── Mobile fallback: real cards in a 2-column grid ── */}
      <div className="libraryMobile">
        <header className="mShelf-sign">
          <h1>Biblioteka</h1>
          <p>Leximi &amp; Adhurimi</p>
        </header>
        {SHELVES.map(shelf => (
          <section className="mShelf-section" key={shelf.label}>
            <div className="shelf-label">{shelf.label}</div>
            <div className="mShelf-grid">
              {shelf.books.map(b => (
                <button
                  key={b.id}
                  className="shelf-book"
                  style={{ "--bk-hi": b.c[0], "--bk": b.c[1], "--bk-lo": b.c[2] }}
                  onClick={() => navigate(b.id)}
                  aria-label={b.title}
                >
                  <BookCover b={b} />
                </button>
              ))}
            </div>
          </section>
        ))}
        <nav className="mShelf-dock" aria-label="Navigimi">
          {DOCK.map(spot => (
            <a
              key={spot.id}
              href={pageToUrl(spot.page)}
              className={"dock-item" + (spot.id === "kreu" ? " is-active" : "")}
              onClick={e => go(e, spot)}
            >
              <Icon name={DOCK_ICONS[spot.id]} size={17} /> <span>{spot.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}

export function BookHeader({ title, onBack, onSearch }) {
  return (
    <div className="book-head">
      <button className="book-head-back" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Biblioteka
      </button>
      <span className="book-head-title">{title}</span>
      <button className="book-head-action" onClick={onSearch} aria-label="Kërko">
        <Icon name="search" size={16} />
      </button>
    </div>
  );
}
