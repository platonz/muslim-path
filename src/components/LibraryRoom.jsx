import "../styles/library.css";
import Icon from "./Icon";

export const SHELVES = [
  {
    label: "LEXIMI",
    books: [
      { id: "quran", title: "Kurani", sub: "LEXIMI", icon: "quran", c: ["#2d785b", "#176b4d", "#0d4530"] },
      { id: "library", title: "Biblioteka", sub: "LIBRAT PDF", icon: "library", c: ["#8a5528", "#5c3719", "#38210d"] },
      { id: "audio", title: "Ligjëratat", sub: "AUDIO", icon: "audio", c: ["#945020", "#733719", "#4e250f"] },
    ],
  },
  {
    label: "ADHURIMI",
    books: [
      { id: "abdes", title: "Abdesi", sub: "PASTËRTIA", icon: "abdes", c: ["#2e6a8a", "#1f4f6b", "#123449"] },
      { id: "namaz", title: "Si të Falesh", sub: "NAMAZI", icon: "dua", c: ["#355881", "#203d64", "#142843"] },
      { id: "agjerim", title: "Agjërimi", sub: "RAMAZANI", icon: "agjerim", c: ["#4b3f7a", "#352c5c", "#221c3e"] },
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
