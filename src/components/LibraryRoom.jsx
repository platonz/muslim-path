// Library Room — the app shell metaphor: a closed door at the entrance,
// a bookshelf as the home screen, and a book-page header inside each section.
import { useState } from "react";
import "../styles/library.css";
import Icon from "./Icon";

/* Every main page as a book on the shelf. --bk* drive the leather gradient. */
export const SHELVES = [
  {
    label: "Leximi",
    books: [
      { id: "sunneti", title: "Sunneti",      sub: "Libri",        icon: "bookmark", c: ["#3c5e22", "#2d5018", "#1f3a10"] },
      { id: "quran",   title: "Kurani",       sub: "Leximi",       icon: "quran",    c: ["#2a6b52", "#176B4D", "#0e4733"] },
      { id: "library", title: "Biblioteka",   sub: "Librat PDF",   icon: "library",  c: ["#7a4a22", "#5b3a1e", "#3f2812"] },
      { id: "audio",   title: "Ligjëratat",   sub: "Audio",        icon: "audio",    c: ["#8a4a1e", "#7a3b1e", "#542811"] },
    ],
  },
  {
    label: "Adhurimi",
    books: [
      { id: "namaz",   title: "Si të Falesh", sub: "Namazi",       icon: "dua",      c: ["#2e4a72", "#1e3a5f", "#142944"] },
      { id: "howpray", title: "How to Pray",  sub: "English",      icon: "globe",    c: ["#3a5a78", "#2b4a66", "#1c3349"] },
      { id: "dua",     title: "Duatë",        sub: "Lutjet",       icon: "heart",    c: ["#7a2a36", "#6b1f2a", "#4a141d"] },
      { id: "asma",    title: "99 Emrat",     sub: "El-Esma",      icon: "asma",     c: ["#5e3055", "#4a2545", "#33182f"] },
      { id: "tasbeeh", title: "Tesbih",       sub: "Dhikri",       icon: "tasbeeh",  c: ["#2a5a5a", "#1e4a4a", "#133232"] },
    ],
  },
  {
    label: "Vegla",
    books: [
      { id: "zakat",       title: "Zekati",      sub: "Llogaritja",  icon: "zakat",    c: ["#8a6a1e", "#75591a", "#523e10"] },
      { id: "inheritance", title: "Trashëgimia", sub: "Hiseja",      icon: "inherit",  c: ["#5a5a26", "#4a4a1e", "#333314"] },
      { id: "calendar",    title: "Kalendari",   sub: "Hixhri",      icon: "calendar", c: ["#456238", "#37512c", "#25381d"] },
      { id: "dates",       title: "Datat",       sub: "Konvertimi",  icon: "dates",    c: ["#6a4a3a", "#583c2e", "#3d2920"] },
    ],
  },
];

export const BOOK_TITLES = Object.fromEntries(
  SHELVES.flatMap(s => s.books.map(b => [b.id, b.title]))
);

/* ── The closed library door (landing, once per session) ── */
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
          <span className="door-keystone" aria-hidden="true">&#10070;</span>
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

/* ── The bookshelf home ── */
export function LibraryShelf({ navigate, onSearch, authUser, onAuthClick }) {
  return (
    <div className="lib-shelf">
      {/* room architecture: fluted pilasters, lanterns, the door ajar on the right wall */}
      <span className="shelf-pilaster shelf-pilaster--l" aria-hidden="true" />
      <span className="shelf-pilaster shelf-pilaster--r" aria-hidden="true" />
      <span className="shelf-lantern shelf-lantern--l" aria-hidden="true" />
      <span className="shelf-lantern shelf-lantern--r" aria-hidden="true" />
      <span className="shelf-door-ajar" aria-hidden="true">
        <span className="ajar-light" />
        <span className="ajar-leaf">
          <span className="ajar-panel ajar-panel--top" />
          <span className="ajar-panel ajar-panel--bottom" />
          <span className="ajar-handle" />
        </span>
      </span>

      <div className="shelf-inner">
        {/* carved hanging sign */}
        <header className="shelf-sign">
          <span className="sign-flourish" aria-hidden="true">&#10086;</span>
          <div className="sign-body">
            <h1>Biblioteka</h1>
            <div className="sign-sub">
              <span className="sign-rule" aria-hidden="true" />
              Leximi &amp; Adhurimi
              <span className="sign-rule" aria-hidden="true" />
            </div>
          </div>
          <span className="sign-flourish sign-flourish--r" aria-hidden="true">&#10086;</span>
        </header>

        <div className="shelf-layout">
          {/* the wooden bookcase */}
          <div className="shelf-case">
            {SHELVES.map(shelf => (
              <section className="shelf-section" key={shelf.label}>
                <div className="shelf-label">{shelf.label}</div>
                <div className="shelf-row">
                  {shelf.books.map(b => (
                <button
                  key={b.id}
                  className="shelf-book"
                  style={{ "--bk-hi": b.c[0], "--bk": b.c[1], "--bk-lo": b.c[2] }}
                  onClick={() => navigate(b.id)}
                >
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
                </button>
                  ))}
                </div>
                <div className="shelf-plank" aria-hidden="true" />
              </section>
            ))}
          </div>

          {/* side panel: take a book */}
          <aside className="shelf-side">
            <div className="side-title">Merr një libër</div>
            <div className="side-emblem"><Icon name="quran" size={30} /></div>
            <p className="side-text">Zgjidh një libër dhe lexo, mëso dhe përfito.</p>
            <ul className="side-feats">
              <li>
                <span className="feat-icon"><Icon name="check" size={15} /></span>
                <span><strong>Falas</strong><em>Zgjeroni diturinë tuaj</em></span>
              </li>
              <li>
                <span className="feat-icon"><Icon name="bookmark" size={15} /></span>
                <span><strong>Praktik</strong><em>Përdoreni në jetën e përditshme</em></span>
              </li>
              <li>
                <span className="feat-icon"><Icon name="globe" size={15} /></span>
                <span><strong>I Qasshëm</strong><em>Gjithmonë me vete</em></span>
              </li>
            </ul>
            <button className="side-cta" onClick={() => navigate("sunneti")}>
              Merr për të lexuar
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
            <div className="side-quote">
              &ldquo;Lexo në emër të Zotit tënd, që të krijoi.&rdquo;
              <span>&mdash; Kurani 96:1</span>
            </div>
          </aside>
        </div>
      </div>

      {/* wooden bottom dock */}
      <nav className="shelf-dock">
        <button className="dock-item is-active">
          <Icon name="home" size={17} /> <span>Kreu</span>
        </button>
        <button className="dock-item" onClick={onSearch}>
          <Icon name="search" size={17} /> <span>Katalogu</span>
        </button>
        <button className="dock-item" onClick={() => navigate("dua")}>
          <Icon name="heart" size={17} /> <span>Favoritet</span>
        </button>
        <button className="dock-item" onClick={() => navigate("calendar")}>
          <Icon name="calendar" size={17} /> <span>Historia</span>
        </button>
        {authUser ? (
          <button className="dock-item" onClick={() => navigate("profile")}>
            <Icon name="user" size={17} /> <span>Profili</span>
          </button>
        ) : (
          <button className="dock-item" onClick={onAuthClick}>
            <Icon name="user" size={17} /> <span>Profili</span>
          </button>
        )}
      </nav>
    </div>
  );
}

/* ── Header strip shown at the top of every open book (page) ── */
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
