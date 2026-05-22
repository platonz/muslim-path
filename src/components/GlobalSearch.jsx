import { useState, useEffect, useRef } from "react";
import { BORDER, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS } from "../constants";
import { LIBRARY } from "../data/library";
import { getSurahCache } from "../lib/surahCache";

export default function GlobalSearch({ onClose, navigate, lectures }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const bookResults = !q ? [] : LIBRARY.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.cat.toLowerCase().includes(q)
  ).slice(0, 6);

  const lectureResults = !q ? [] : lectures.filter(l =>
    l.title.toLowerCase().includes(q)
  ).slice(0, 5);

  const surahCache = getSurahCache();
  const surahResults = !q ? [] : (surahCache || []).filter(s =>
    s.englishName.toLowerCase().includes(q) ||
    s.englishNameTranslation.toLowerCase().includes(q) ||
    String(s.number) === q
  ).slice(0, 5);

  const total = bookResults.length + lectureResults.length + surahResults.length;

  function goBook() { onClose(); navigate("library"); }
  function goLecture() { onClose(); navigate("audio"); }
  function goSurah(s) {
    localStorage.setItem("quranSurah", s.number);
    onClose();
    navigate("quran");
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1100, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:80, padding:"80px 24px 24px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#faf5ec", borderRadius:16, maxWidth:600, width:"100%", border:`1px solid ${GOLD}30`, boxShadow:`0 16px 60px rgba(160,120,50,0.2)`, overflow:"hidden" }}>

        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"18px 20px", borderBottom:`1px solid ${BORDER}` }}>
          <span style={{ fontSize:18, opacity:0.5 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search surahs, books, lectures…"
            style={{ flex:1, background:"none", border:"none", outline:"none", fontSize:16, color:TEXT, fontFamily:SANS }}
          />
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:2, color:MUTED, padding:"4px 10px", cursor:"pointer", fontSize:11, letterSpacing:"0.06em", fontFamily:SANS }}>ESC</button>
        </div>

        <div style={{ maxHeight:420, overflowY:"auto" }}>
          {!q && (
            <div style={{ padding:"40px 20px", textAlign:"center", color:MUTED, fontSize:13 }}>
              Start typing to search across the Quran, library, and lectures…
            </div>
          )}

          {q && total === 0 && (
            <div style={{ padding:"40px 20px", textAlign:"center", color:MUTED, fontSize:13 }}>
              No results for "{query}"
            </div>
          )}

          {surahResults.length > 0 && (
            <div>
              <div style={{ padding:"10px 20px 6px", fontSize:9, fontWeight:700, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", borderBottom:`1px solid ${BORDER}` }}>Quran — Surahs</div>
              {surahResults.map(s => (
                <button key={s.number} onClick={() => goSurah(s)} style={{ display:"flex", width:"100%", textAlign:"left", padding:"12px 20px", background:"none", border:"none", borderBottom:`1px solid ${BORDER}`, cursor:"pointer", alignItems:"center", gap:14, transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background=GREEN_L}
                  onMouseLeave={e => e.currentTarget.style.background="none"}
                >
                  <span style={{ fontSize:11, color:GOLD, fontVariantNumeric:"tabular-nums", minWidth:24, fontFamily:SANS }}>{s.number}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:TEXT, fontFamily:SERIF }}>{s.englishName}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{s.englishNameTranslation} · {s.numberOfAyahs} verses · {s.revelationType}</div>
                  </div>
                  <span style={{ fontSize:18, fontFamily:"'Amiri','Traditional Arabic',serif", color:GOLD, direction:"rtl" }}>{s.name}</span>
                </button>
              ))}
            </div>
          )}

          {bookResults.length > 0 && (
            <div>
              <div style={{ padding:"10px 20px 6px", fontSize:9, fontWeight:700, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", borderBottom:`1px solid ${BORDER}` }}>Library — Books</div>
              {bookResults.map((b, i) => (
                <button key={i} onClick={() => goBook(b)} style={{ display:"flex", width:"100%", textAlign:"left", padding:"12px 20px", background:"none", border:"none", borderBottom:`1px solid ${BORDER}`, cursor:"pointer", alignItems:"center", gap:14, transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background=GREEN_L}
                  onMouseLeave={e => e.currentTarget.style.background="none"}
                >
                  <span style={{ fontSize:16 }}>📚</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:TEXT, fontFamily:SERIF }}>{b.title}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{b.author} · {b.cat}</div>
                  </div>
                  {b.url && b.url !== "#" && <span style={{ fontSize:10, color:GOLD, border:`1px solid ${GOLD}40`, padding:"2px 7px", letterSpacing:"0.06em" }}>PDF</span>}
                </button>
              ))}
            </div>
          )}

          {lectureResults.length > 0 && (
            <div>
              <div style={{ padding:"10px 20px 6px", fontSize:9, fontWeight:700, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", borderBottom:`1px solid ${BORDER}` }}>Lectures — Audio</div>
              {lectureResults.map(l => (
                <button key={l.id} onClick={() => goLecture(l)} style={{ display:"flex", width:"100%", textAlign:"left", padding:"12px 20px", background:"none", border:"none", borderBottom:`1px solid ${BORDER}`, cursor:"pointer", alignItems:"center", gap:14, transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background=GREEN_L}
                  onMouseLeave={e => e.currentTarget.style.background="none"}
                >
                  <span style={{ fontSize:16 }}>🎙️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:TEXT, fontFamily:SERIF }}>{l.title}</div>
                  </div>
                  <span style={{ fontSize:10, color:MUTED }}>MP3</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding:"10px 20px", borderTop:`1px solid ${BORDER}`, display:"flex", justifyContent:"space-between", fontSize:11, color:MUTED }}>
          <span>{q ? `${total} result${total !== 1 ? "s" : ""}` : "Tip: search by name, author, or surah number"}</span>
          <span>↑↓ navigate · Enter open · Esc close</span>
        </div>
      </div>
    </div>
  );
}
