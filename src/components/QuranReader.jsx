import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import ReactDOM from "react-dom";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const T = {
  dark950:    "#0E0D0B",
  dark900:    "#1A1915",
  dark800:    "#2A2820",
  dark700:    "#3A3828",
  olive:      "#2D5018",
  oliveLight: "#3D6B22",
  gold600:    "#8A7235",
  gold500:    "#9A8142",
  gold400:    "#B89D60",
  gold300:    "#D4BA88",
  gold200:    "#E8D9A8",
  gold100:    "#F2EAD0",
  gold50:     "#FAF5E8",
  warm600:    "#8A7E6E",
  warm500:    "#9A8E7A",
  warm300:    "#D4C9A8",
  warm200:    "#E0D5C0",
  sand:       "#EDE0C4",
  surface:    "#FFFFFF",
  fontArabic: "'Amiri', 'Traditional Arabic', serif",
  fontBody:   "'Inter', system-ui, sans-serif",
  fontDisplay:"'Playfair Display', Georgia, serif",
};

// ─── UMMAH API ───────────────────────────────────────────────────────────────
const UMMAH_KEY = "umh_19513cb42f6754b8129635dd79f7ddc01d237fad";
const ummahFetch = (url) => fetch(url, { headers: { "X-API-Key": UMMAH_KEY } });

// ─── MODULE-LEVEL CACHES ─────────────────────────────────────────────────────
let _surahCache = null;
let _fullVerseCache = null;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function normSearch(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[''ʿʾʻˀ`]/g, "")
    .replace(/[-]/g, "")
    .toLowerCase();
}

const RECITERS = [
  { id: 1, label: "Mishary Alafasy" },
  { id: 2, label: "Al-Sudais" },
  { id: 3, label: "Abdul Basit (Murattal)" },
  { id: 4, label: "Abdul Basit (Mujawwad)" },
  { id: 6, label: "Saad Al-Ghamdi" },
  { id: 7, label: "Hani Ar-Rifai" },
  { id: 8, label: "Abu Bakr Al-Shatri" },
];

const TAFSIR_SOURCES = [
  { id: "ibn_kathir",    label: "Ibn Kathir (EN)" },
  { id: "maarif",        label: "Ma'arif al-Qur'an (EN)" },
  { id: "muyassar",      label: "Al-Muyassar (AR)" },
  { id: "ibn_kathir_ar", label: "Ibn Kathir (AR)" },
];

// ─── VERSE MEDALLION ─────────────────────────────────────────────────────────
function VerseMedallion({ num }) {
  return (
    <div style={{ width: 36, height: 36, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" fill="none" style={{ position: "absolute", inset: 0, width: 36, height: 36 }}>
        <path d="M13 2h10l7 7v10l-7 7H13L6 19V9z" fill={T.gold50} stroke={T.gold300} strokeWidth="1.2" />
      </svg>
      <span style={{ fontSize: 10, fontWeight: 700, color: T.gold600, position: "relative", zIndex: 1, fontFamily: T.fontBody, letterSpacing: "-0.02em" }}>{num}</span>
    </div>
  );
}

// ─── SMALL ACTION BUTTON ─────────────────────────────────────────────────────
function ActionBtn({ children, title, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
      style={{
        width: 28, height: 28, borderRadius: 6,
        background: active ? T.gold600 : hover ? T.gold50 : "none",
        border: `1px solid ${active ? T.gold600 : hover ? T.gold200 : "transparent"}`,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        color: active ? "white" : hover ? T.gold600 : T.warm500,
        transition: "all 150ms",
      }}
    >
      {children}
    </button>
  );
}

// ─── TAFSIR MODAL ─────────────────────────────────────────────────────────────
function TafsirModal({ verse, surahName, onClose, onPrev, onNext, hasPrev, hasNext, tafsirId, onTafsirIdChange, tafsirText, tafsirLoading }) {
  const [tab, setTab] = useState(TAFSIR_SOURCES[0].id);
  const bodyRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [verse, tab]);

  // Sync tab → tafsirId
  useEffect(() => { onTafsirIdChange(tab); }, [tab]);

  return ReactDOM.createPortal(
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,14,11,0.58)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
      }}
    >
      <div style={{
        background: T.dark900, border: `1px solid rgba(212,186,136,0.25)`, borderRadius: 20,
        width: "100%", maxWidth: 680, maxHeight: "80vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        overflow: "hidden",
        animation: "qr-slide-in 250ms ease forwards",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.gold400, marginBottom: 4, fontFamily: T.fontBody }}>
                Tafsir · Verse {verse.n}
              </div>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 600, color: "white" }}>{surahName}</div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div style={{ fontFamily: T.fontArabic, fontSize: 24, color: "rgba(255,255,255,0.9)", direction: "rtl", textAlign: "right", lineHeight: 1.8, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(212,186,136,0.15)" }}>
            {verse.ar}
          </div>
          {verse.en && (
            <div style={{ marginTop: 10, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic", fontFamily: T.fontBody, paddingLeft: 12, borderLeft: `3px solid ${T.gold600}` }}>
              {verse.en}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "0 24px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {TAFSIR_SOURCES.map(src => (
            <button
              key={src.id}
              onClick={() => setTab(src.id)}
              style={{
                padding: "10px 14px", fontSize: 12, fontWeight: 600, background: "none", border: "none",
                cursor: "pointer", fontFamily: T.fontBody, transition: "all 150ms", marginBottom: -1,
                color: tab === src.id ? T.gold400 : "rgba(255,255,255,0.4)",
                borderBottom: `2px solid ${tab === src.id ? T.gold500 : "transparent"}`,
              }}
            >{src.label}</button>
          ))}
        </div>

        {/* Body */}
        <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {tafsirLoading ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: T.fontBody, textAlign: "center", paddingTop: 32 }}>Loading…</div>
          ) : !tafsirText ? (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: T.fontBody, textAlign: "center", fontStyle: "italic", paddingTop: 32 }}>
              Tap a verse number circle to load tafsir from the reader, or navigate verses below.
            </div>
          ) : (
            tafsirText.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontSize: 14, lineHeight: 1.9, fontFamily: T.fontBody, marginBottom: 14,
                color: para.startsWith("Source:") ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.78)",
                borderTop: para.startsWith("Source:") ? "1px solid rgba(255,255,255,0.07)" : "none",
                paddingTop: para.startsWith("Source:") ? 14 : 0,
              }}>{para}</p>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <select
            value={tab}
            onChange={e => setTab(e.target.value)}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", fontFamily: T.fontBody, fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer", outline: "none" }}
          >
            {TAFSIR_SOURCES.map(src => <option key={src.id} value={src.id}>{src.label}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={!hasPrev}
              onClick={onPrev}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: hasPrev ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)", cursor: hasPrev ? "pointer" : "not-allowed", fontFamily: T.fontBody, transition: "all 150ms" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              Previous
            </button>
            <button
              disabled={!hasNext}
              onClick={onNext}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "none", background: T.gold600, color: "white", cursor: hasNext ? "pointer" : "not-allowed", fontFamily: T.fontBody, opacity: hasNext ? 1 : 0.5, transition: "all 150ms" }}
            >
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuranReader() {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");

  // ── State ──────────────────────────────────────────────────────────────────
  const [surahs,          setSurahs]          = useState(() => _surahCache || []);
  const [current,         setCurrent]         = useState(() => {
    const saved = localStorage.getItem("quranSurah");
    return saved ? parseInt(saved) : null;
  });
  const [verses,          setVerses]          = useState([]);
  const [loadingList,     setLoadingList]     = useState(!_surahCache);
  const [loadingRead,     setLoadingRead]     = useState(false);
  const [transEdition,    setTransEdition]    = useState(isSq ? "sq.nahi" : "en.sahih");
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTranslit,    setShowTranslit]    = useState(false);
  const [arabicFontSize,  setArabicFontSize]  = useState(32);
  const [sidebarSearch,   setSidebarSearch]   = useState("");
  const [sidebarTab,      setSidebarTab]      = useState("surah"); // "surah" | "bookmarks"
  const [reciter,         setReciter]         = useState(1);
  const [playingVerse,    setPlayingVerse]     = useState(null);
  const [audioError,      setAudioError]      = useState(false);
  const [bookmarks,       setBookmarks]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("mp-quran-bkm") || "[]"); } catch { return []; }
  });
  const [verseSearch,     setVerseSearch]     = useState("");
  const [vsOpen,          setVsOpen]          = useState(false);
  const [fullLoading,     setFullLoading]     = useState(false);
  const [tafsirVerse,     setTafsirVerse]     = useState(null);
  const [tafsirText,      setTafsirText]      = useState("");
  const [tafsirLoading,   setTafsirLoading]   = useState(false);
  const [tafsirId,        setTafsirId]        = useState("ibn_kathir");
  const [fromCache,       setFromCache]       = useState(false);
  const [isMobile,       setIsMobile]        = useState(() => window.innerWidth < 768);
  const [sidebarOpen,    setSidebarOpen]     = useState(() => window.innerWidth >= 768);

  const audioRef        = useRef(null);
  const tafsirCache     = useRef(new Map());
  const audioUrlCache   = useRef(new Map());
  const pendingVerseRef = useRef(null);
  const vsInputRef      = useRef(null);
  const touchStartX     = useRef(null);
  const touchStartY     = useRef(null);

  // Mobile resize detection
  useEffect(() => {
    const handle = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // Swipe-to-open/close sidebar on mobile
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dy > Math.abs(dx)) { touchStartX.current = null; return; }
    if (dx > 50 && touchStartX.current < 40) setSidebarOpen(true);
    if (dx < -50 && sidebarOpen) setSidebarOpen(false);
    touchStartX.current = null;
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const surah = surahs.find(s => s.number === current) ?? null;
  const nSearch = normSearch(sidebarSearch);
  const filteredSurahs = surahs.filter(s =>
    !sidebarSearch ||
    normSearch(s.englishName).includes(nSearch) ||
    normSearch(s.englishNameTranslation || "").includes(nSearch) ||
    String(s.number).includes(sidebarSearch)
  );

  const verseResults = verseSearch.trim().length >= 3
    ? verses.filter(v => {
        const nq = normSearch(verseSearch);
        return v.ar.includes(verseSearch) ||
               normSearch(v.tr).includes(nq) ||
               normSearch(v.en).includes(nq);
      }).slice(0, 30)
    : [];

  const crossResults = useMemo(() => {
    if (verseSearch.trim().length < 3) return [];
    if (!_fullVerseCache || _fullVerseCache.edition !== transEdition) return [];
    const nq = normSearch(verseSearch);
    const results = [];
    for (const v of _fullVerseCache.verses) {
      if (v.ar.includes(verseSearch) || normSearch(v.tr).includes(nq) || normSearch(v.en).includes(nq)) {
        results.push(v);
        if (results.length >= 30) break;
      }
    }
    return results;
  }, [verseSearch, transEdition, fullLoading]);

  const currentPlayingVerse = playingVerse
    ? verses.find(v => v.n === playingVerse.n) ?? null
    : null;

  // ── Load surah list ────────────────────────────────────────────────────────
  useEffect(() => {
    if (_surahCache) { setSurahs(_surahCache); setLoadingList(false); return; }
    fetch("https://api.alquran.cloud/v1/surah")
      .then(r => r.json())
      .then(d => { _surahCache = d.data || []; setSurahs(_surahCache); setLoadingList(false); })
      .catch(() => setLoadingList(false));
  }, []);

  // ── Load verses ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!current) return;
    setLoadingRead(true); setVerses([]); setFromCache(false);
    setVerseSearch(""); setVsOpen(false);
    setPlayingVerse(null); setAudioError(false);
    if (audioRef.current) { audioRef.current.pause(); }

    try {
      const cached = localStorage.getItem(`qv_${current}_${transEdition}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!parsed[0]?.globalN) { localStorage.removeItem(`qv_${current}_${transEdition}`); throw new Error("stale"); }
        setVerses(parsed); setLoadingRead(false); setFromCache(true);
        const pv = pendingVerseRef.current;
        if (pv) {
          pendingVerseRef.current = null;
          setTimeout(() => { const el = document.getElementById(`qrv-${pv}`); el?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 80);
        }
        return;
      }
    } catch {}

    fetch(`https://api.alquran.cloud/v1/surah/${current}/editions/quran-uthmani,en.transliteration,${transEdition}`)
      .then(r => r.json())
      .then(d => {
        const [ar, translit, trans] = d.data;
        const parsed = ar.ayahs.map((a, i) => ({
          n: a.numberInSurah, globalN: a.number,
          ar: a.text, tr: translit.ayahs[i]?.text || "", en: trans.ayahs[i]?.text || "",
        }));
        setVerses(parsed); setLoadingRead(false);
        try { localStorage.setItem(`qv_${current}_${transEdition}`, JSON.stringify(parsed)); } catch {}
        const pv = pendingVerseRef.current;
        if (pv) {
          pendingVerseRef.current = null;
          setTimeout(() => { const el = document.getElementById(`qrv-${pv}`); el?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 80);
        }
      })
      .catch(() => setLoadingRead(false));
  }, [current, transEdition]);

  // ── Preload full Quran for cross-search ───────────────────────────────────
  useEffect(() => {
    if (verseSearch.trim().length < 3) return;
    if (_fullVerseCache?.edition === transEdition) return;
    if (fullLoading) return;
    setFullLoading(true);
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/quran/quran-uthmani`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/quran/en.transliteration`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/quran/${transEdition}`).then(r => r.json()),
    ]).then(([arRes, trRes, enRes]) => {
      const arSurahs = arRes.data?.surahs || [];
      const trSurahs = trRes.data?.surahs || [];
      const enSurahs = enRes.data?.surahs || [];
      const allVerses = [];
      arSurahs.forEach((surah, si) => {
        const s = surahs.find(x => x.number === surah.number);
        surah.ayahs.forEach((ayah, ai) => {
          allVerses.push({
            surahNum: surah.number, ayahNum: ayah.numberInSurah,
            surahName: s?.englishName || `Surah ${surah.number}`, surahAr: s?.name || "",
            ar: ayah.text, tr: trSurahs[si]?.ayahs[ai]?.text || "", en: enSurahs[si]?.ayahs[ai]?.text || "",
          });
        });
      });
      _fullVerseCache = { edition: transEdition, verses: allVerses };
      setFullLoading(false);
    }).catch(() => setFullLoading(false));
  }, [verseSearch, transEdition]);

  // ── Audio ──────────────────────────────────────────────────────────────────
  async function getAudioUrl(surahN, verseN, reciterId) {
    const key = `${reciterId}:${surahN}:${verseN}`;
    if (audioUrlCache.current.has(key)) return audioUrlCache.current.get(key);
    const res = await ummahFetch(`https://ummahapi.com/api/quran/surah/${surahN}/ayah/${verseN}`);
    const data = await res.json();
    const entry = Array.isArray(data.data?.audio)
      ? data.data.audio.find(a => a.reciter_id === reciterId)
      : null;
    const url = entry?.ayah_audio || null;
    if (url) audioUrlCache.current.set(key, url);
    return url;
  }

  async function playVerse(v) {
    if (!audioRef.current || !v.n) return;
    if (playingVerse?.n === v.n) {
      if (audioRef.current.paused) { audioRef.current.play(); setPlayingVerse(v); }
      else { audioRef.current.pause(); setPlayingVerse(null); }
      return;
    }
    setAudioError(false);
    try {
      const url = await getAudioUrl(current, v.n, reciter);
      if (!url) { setAudioError(true); return; }
      audioRef.current.src = url;
      audioRef.current.play().catch(() => { setAudioError(true); setPlayingVerse(null); });
      setPlayingVerse(v);
      setTimeout(() => { const el = document.getElementById(`qrv-${v.n}`); el?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 80);
    } catch {
      setAudioError(true);
    }
  }

  async function handleAudioEnd() {
    if (!playingVerse) return;
    const idx = verses.findIndex(v => v.n === playingVerse.n);
    if (idx >= 0 && idx < verses.length - 1) {
      const next = verses[idx + 1];
      if (audioRef.current && next.n) {
        try {
          const url = await getAudioUrl(current, next.n, reciter);
          if (!url) { setAudioError(true); setPlayingVerse(null); return; }
          audioRef.current.src = url;
          audioRef.current.play().catch(() => { setAudioError(true); setPlayingVerse(null); });
          setPlayingVerse(next);
          setTimeout(() => { const el = document.getElementById(`qrv-${next.n}`); el?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
        } catch {
          setAudioError(true); setPlayingVerse(null);
        }
      }
    } else {
      setPlayingVerse(null);
    }
  }

  function skipVerse(dir) {
    if (!playingVerse) return;
    const idx = verses.findIndex(v => v.n === playingVerse.n);
    const next = verses[idx + dir];
    if (next) playVerse(next);
  }

  // ── Tafsir ─────────────────────────────────────────────────────────────────
  async function loadTafsir(v) {
    setTafsirVerse(v);
    setTafsirText("");
    const key = `${tafsirId}:${current}:${v.n}`;
    if (tafsirCache.current.has(key)) {
      setTafsirText(tafsirCache.current.get(key));
      return;
    }
    setTafsirLoading(true);
    try {
      const res = await ummahFetch(`https://ummahapi.com/api/tafsir/${tafsirId}/surah/${current}/ayah/${v.n}`);
      const data = await res.json();
      const text = data.data?.tafsir?.text?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "No tafsir found for this verse.";
      tafsirCache.current.set(key, text);
      setTafsirText(text);
    } catch {
      setTafsirText("Failed to load tafsir. Please try again.");
    }
    setTafsirLoading(false);
  }

  function tafsirNav(dir) {
    if (!tafsirVerse) return;
    const idx = verses.findIndex(v => v.n === tafsirVerse.n);
    const next = verses[idx + dir];
    if (next) loadTafsir(next);
  }

  // ── Bookmarks ──────────────────────────────────────────────────────────────
  function toggleBookmark(verse) {
    setBookmarks(prev => {
      const key = current + ":" + verse.n;
      const exists = prev.find(b => b.key === key);
      let next;
      if (exists) {
        next = prev.filter(b => b.key !== key);
      } else {
        next = [{ key, surah: current, verse: verse.n, surahEn: surah?.englishName || "", surahAr: surah?.name || "", preview: verse.en?.substring(0, 80) + (verse.en?.length > 80 ? "…" : "") || "", savedAt: Date.now() }, ...prev].slice(0, 20);
      }
      try { localStorage.setItem("mp-quran-bkm", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function isBookmarked(verseN) {
    return bookmarks.some(b => b.key === current + ":" + verseN);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  function openSurah(num, verseN) {
    if (verseN) pendingVerseRef.current = verseN;
    setCurrent(num);
    localStorage.setItem("quranSurah", num);
    if (isMobile) setSidebarOpen(false);
  }

  function navSurah(dir) {
    const n = Math.min(114, Math.max(1, current + dir));
    setPlayingVerse(null);
    if (audioRef.current) { audioRef.current.pause(); }
    openSurah(n);
  }

  function scrollToVerse(n) {
    setVerseSearch(""); setVsOpen(false);
    setTimeout(() => { const el = document.getElementById(`qrv-${n}`); el?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 50);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes qr-slide-in { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        #qr-verses-scroll::-webkit-scrollbar { width: 6px; }
        #qr-verses-scroll::-webkit-scrollbar-track { background: transparent; }
        #qr-verses-scroll::-webkit-scrollbar-thumb { background: ${T.warm300}; border-radius: 3px; }
        #qr-sidebar-list::-webkit-scrollbar { width: 4px; }
        #qr-sidebar-list::-webkit-scrollbar-track { background: transparent; }
        #qr-sidebar-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .qr-surah-item:hover { background: rgba(255,255,255,0.06) !important; }
        .qr-verse-card:hover .qr-verse-bar { opacity: 0.4; }
        .qr-toolbar-btn:hover { border-color: ${T.gold400} !important; color: ${T.gold600} !important; }
        .qr-ctrl-pill:hover { background: rgba(0,0,0,0.4) !important; color: white !important; }
        .qr-tafsir-btn:hover { background: ${T.gold100} !important; border-color: ${T.gold500} !important; }
      `}</style>

      <audio ref={audioRef} onEnded={handleAudioEnd} onError={() => { setAudioError(true); setPlayingVerse(null); }} style={{ display: "none" }} />

      {/* ── Mobile backdrop ────────────────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 199, top: 102 }}
        />
      )}

      {/* ── Outer layout: sidebar + reader ─────────────────────────────── */}
      <div
        style={{ display: "flex", height: "calc(100vh - 102px)", overflow: "hidden", background: T.sand, position: "relative" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >

        {/* ════════════════════════════════════════
            SIDEBAR
        ════════════════════════════════════════ */}
        <aside style={isMobile ? {
          position: "fixed", top: 102, left: 0, bottom: 0, width: 300,
          background: T.dark900, display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 260ms cubic-bezier(0.25,0.46,0.45,0.94)",
          zIndex: 200, overflowY: "hidden",
        } : {
          width: 300, background: T.dark900, display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        }}>

          {/* Sidebar header */}
          <div style={{ padding: "16px 20px 12px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 600, color: "white" }}>
                {isSq ? "Kurani" : "Quran"}
              </div>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0 12px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
                placeholder={isSq ? "Kërko sure…" : "Search surah…"}
                style={{ background: "none", border: "none", outline: "none", fontFamily: T.fontBody, fontSize: 13, color: "white", padding: "9px 0", flex: 1 }}
              />
            </div>
          </div>

          {/* Sidebar tabs */}
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", padding: "0 20px", gap: 4, marginBottom: 8, flexShrink: 0 }}>
            {[
              { id: "surah", label: isSq ? "Sure" : "Surah" },
              { id: "bookmarks", label: isSq ? "Shënime" : "Bookmarks" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setSidebarTab(tab.id)} style={{
                flex: 1, padding: "6px 0", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                textTransform: "uppercase", border: "none", borderRadius: 6, cursor: "pointer", transition: "all 150ms", fontFamily: T.fontBody,
                background: sidebarTab === tab.id ? T.gold600 : "rgba(255,255,255,0.07)",
                color: sidebarTab === tab.id ? "white" : "rgba(255,255,255,0.45)",
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Sidebar list */}
          <div id="qr-sidebar-list" style={{ flex: 1, overflowY: "auto", padding: "0 8px 120px" }}>
            {sidebarTab === "surah" && (
              loadingList ? (
                <div style={{ padding: "24px 12px", color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: T.fontBody, textAlign: "center", letterSpacing: "0.08em" }}>Loading…</div>
              ) : filteredSurahs.map(s => {
                const isActive = s.number === current;
                return (
                  <div
                    key={s.number}
                    className="qr-surah-item"
                    onClick={() => openSurah(s.number)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                      borderRadius: 10, cursor: "pointer", marginBottom: 2,
                      background: isActive ? "rgba(212,186,136,0.15)" : "transparent",
                      transition: "background 150ms",
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 600, fontFamily: T.fontBody,
                      background: "rgba(255,255,255,0.05)",
                      color: isActive ? T.gold300 : "rgba(255,255,255,0.35)",
                      border: isActive ? `1px solid rgba(212,186,136,0.25)` : "none",
                    }}>{s.number}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: isActive ? T.gold300 : "rgba(255,255,255,0.88)", fontFamily: T.fontBody, lineHeight: 1.2 }}>
                        {s.englishName}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1, fontFamily: T.fontBody }}>
                        {s.numberOfAyahs} {isSq ? "ajete" : "verses"} · {s.revelationType}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {sidebarTab === "bookmarks" && (
              bookmarks.length === 0 ? (
                <div style={{ padding: "32px 12px", color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: T.fontBody, textAlign: "center", letterSpacing: "0.06em", lineHeight: 1.8 }}>
                  {isSq ? "Nuk ka shënime të ruajtura." : "No bookmarks yet. Tap the bookmark icon on any verse to save it here."}
                </div>
              ) : (
                bookmarks.map(b => (
                  <div key={b.key} onClick={() => openSurah(b.surah, b.verse)} className="qr-surah-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2, transition: "background 150ms" }}>
                    <div style={{ flexShrink: 0, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: T.gold400, fontFamily: T.fontBody, fontWeight: 600, lineHeight: 1 }}>{b.surah}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: T.fontBody }}>:{b.verse}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", fontFamily: T.fontBody }}>{b.surahEn} · {isSq ? "Varg" : "Verse"} {b.verse}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.preview}</div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </aside>

        {/* ════════════════════════════════════════
            MAIN READER
        ════════════════════════════════════════ */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {!current || !surah ? (
            /* ── Landing ───────────────────────────────────────────── */
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, textAlign: "center" }}>
              {isMobile && (
                <button onClick={() => setSidebarOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: T.dark900, border: "none", borderRadius: 24, cursor: "pointer", color: "white", fontSize: 14, fontWeight: 600, fontFamily: T.fontBody, marginBottom: 32 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  {isSq ? "Shfaq suret" : "Browse Surahs"}
                </button>
              )}
              <div style={{ fontFamily: T.fontArabic, fontSize: 56, color: T.gold600, direction: "rtl", lineHeight: 1.4, marginBottom: 20, opacity: 0.7 }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, color: T.dark900, marginBottom: 8 }}>
                {isSq ? "Kurani Famëlartë" : "The Noble Quran"}
              </div>
              <div style={{ fontSize: 14, color: T.warm600, marginBottom: 32, fontFamily: T.fontBody }}>
                {isSq ? "Zgjidhni një sure nga paneli majtas për të filluar leximin." : "Select a surah from the sidebar to begin reading."}
              </div>
              {/* Continue reading */}
              {(() => {
                const savedNum = localStorage.getItem("quranSurah");
                if (!savedNum || !surahs.length) return null;
                const s = surahs.find(x => x.number === parseInt(savedNum));
                if (!s) return null;
                return (
                  <div onClick={() => openSurah(s.number)} style={{ display: "flex", alignItems: "center", gap: 14, background: "white", border: `1px solid ${T.gold300}`, borderRadius: 14, padding: "14px 20px", cursor: "pointer", maxWidth: 360, width: "100%", boxShadow: "0 2px 12px rgba(26,25,21,0.07)", transition: "background 150ms" }} onMouseEnter={e => e.currentTarget.style.background = T.gold50} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: T.olive, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", fontFamily: T.fontBody, flexShrink: 0 }}>{s.number}</div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <div style={{ fontSize: 10, color: T.gold600, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: T.fontBody, fontWeight: 600, marginBottom: 2 }}>{isSq ? "Vazhdo leximin" : "Continue reading"}</div>
                      <div style={{ fontSize: 15, color: T.dark900, fontFamily: T.fontDisplay }}>{s.englishName}</div>
                    </div>
                    <div style={{ fontFamily: T.fontArabic, fontSize: 20, color: T.gold600, direction: "rtl", flexShrink: 0 }}>{s.name}</div>
                    <div style={{ fontSize: 18, color: T.warm500 }}>›</div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <>
              {/* ── Surah Header (compact) ──────────────────────────── */}
              <div style={{ background: T.olive, padding: "0 16px", height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <button
                  onClick={() => {
                    if (isMobile) { setSidebarOpen(true); }
                    else { setCurrent(null); localStorage.removeItem("quranSurah"); setPlayingVerse(null); if (audioRef.current) { audioRef.current.pause(); } }
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: T.fontBody, flexShrink: 0 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                  {isSq ? "Të gjitha" : "All"}
                </button>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <span style={{ fontFamily: T.fontBody, fontSize: 13, fontWeight: 600, color: "white", letterSpacing: "0.02em" }}>{surah.englishName}</span>
                  <span style={{ fontFamily: T.fontBody, fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 6 }}>· {surah.numberOfAyahs} {isSq ? "ajete" : "verses"}</span>
                </div>
                <div style={{ width: 60, flexShrink: 0 }} />
              </div>

              {/* ── Toolbar ────────────────────────────────────────── */}
              <div style={{ background: T.surface, borderBottom: `1px solid ${T.warm200}`, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                <button className="qr-toolbar-btn" onClick={() => setArabicFontSize(s => Math.max(20, s - 4))} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.warm600, background: "none", border: `1px solid ${T.warm200}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: T.fontBody, transition: "all 150ms" }}>A−</button>
                <button className="qr-toolbar-btn" onClick={() => setArabicFontSize(s => Math.min(52, s + 4))} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.warm600, background: "none", border: `1px solid ${T.warm200}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: T.fontBody, transition: "all 150ms" }}>A+</button>
                <select value={transEdition} onChange={e => setTransEdition(e.target.value)} style={{ background: T.gold50, border: `1px solid ${T.warm200}`, borderRadius: 20, padding: "5px 10px", fontFamily: T.fontBody, fontSize: 11, fontWeight: 500, color: T.warm600, cursor: "pointer", outline: "none", appearance: "none" }}>
                  <option value="en.sahih">EN — Sahih Int'l</option>
                  <option value="en.pickthall">EN — Pickthall</option>
                  <option value="fr.hamidullah">FR — Hamidullah</option>
                  <option value="tr.diyanet">TR — Diyanet</option>
                  <option value="ur.jalandhry">UR — Jalandhry</option>
                  <option value="sq.nahi">SQ — Nahi</option>
                </select>
                <button onClick={() => setShowTranslation(v => !v)} style={{ fontSize: 11, fontWeight: 500, color: showTranslation ? "white" : T.warm600, background: showTranslation ? T.olive : "none", border: `1px solid ${showTranslation ? T.olive : T.warm200}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: T.fontBody, whiteSpace: "nowrap" }}>
                  {isSq ? "Përkthim" : "Translation"}
                </button>
                <button onClick={() => setShowTranslit(v => !v)} style={{ fontSize: 11, fontWeight: 500, color: showTranslit ? "white" : T.warm600, background: showTranslit ? T.olive : "none", border: `1px solid ${showTranslit ? T.olive : T.warm200}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontFamily: T.fontBody, whiteSpace: "nowrap" }}>
                  {isSq ? "Transliterim" : "Translit"}
                </button>
                <select value={reciter} onChange={e => { setReciter(Number(e.target.value)); audioUrlCache.current.clear(); setPlayingVerse(null); if (audioRef.current) { audioRef.current.pause(); } }} style={{ background: T.gold50, border: `1px solid ${T.warm200}`, borderRadius: 20, padding: "5px 10px", fontFamily: T.fontBody, fontSize: 11, fontWeight: 500, color: T.warm600, cursor: "pointer", outline: "none", appearance: "none" }}>
                  {RECITERS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>

                {/* Verse search */}
                <div ref={vsInputRef} style={{ position: "relative", flex: 1, minWidth: 160, maxWidth: 320 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.gold50, border: `1px solid ${verseSearch.length >= 3 ? T.gold400 + "80" : T.warm200}`, borderRadius: 20, padding: "0 12px", transition: "border-color 0.2s" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.warm500} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                      value={verseSearch}
                      onChange={e => { setVerseSearch(e.target.value); setVsOpen(true); }}
                      onFocus={() => setVsOpen(true)}
                      onBlur={() => setTimeout(() => setVsOpen(false), 180)}
                      placeholder={isSq ? "Kërko varg… (min. 3 shkronja)" : "Search verse… (min. 3 letters)"}
                      style={{ background: "none", border: "none", outline: "none", fontFamily: T.fontBody, fontSize: 12, color: T.dark900, padding: "5px 0", flex: 1 }}
                    />
                    {verseSearch && <button onClick={() => { setVerseSearch(""); setVsOpen(false); }} style={{ background: "none", border: "none", color: T.warm500, cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>}
                  </div>
                  {/* Search dropdown */}
                  {vsOpen && verseSearch.trim().length >= 3 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: T.surface, border: `1px solid ${T.warm200}`, borderTop: "none", maxHeight: 340, overflowY: "auto", borderRadius: "0 0 12px 12px", boxShadow: "0 8px 32px rgba(26,25,21,0.1)" }}>
                      {verseResults.length === 0 ? (
                        <div style={{ padding: "12px 16px", color: T.warm500, fontSize: 12, fontFamily: T.fontBody }}>{isSq ? "Asnjë rezultat." : "No results."}</div>
                      ) : verseResults.map(v => (
                        <div key={v.n} onMouseDown={() => scrollToVerse(v.n)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${T.warm200}` }} onMouseEnter={e => e.currentTarget.style.background = T.gold50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <div style={{ flexShrink: 0, width: 28, height: 28, border: `1px solid ${T.gold400}50`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: T.gold600, fontFamily: T.fontBody, fontWeight: 600 }}>{v.n}</div>
                          <div style={{ flex: 1, fontSize: 12, color: T.dark900, fontFamily: T.fontBody, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{v.en}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: T.warm600, fontFamily: T.fontBody, flexShrink: 0 }}>
                  <div style={{ height: 5, width: 80, background: T.warm300, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, Math.round((verses.length / (surah.numberOfAyahs || 1)) * 100))}%`, background: T.gold600, borderRadius: 99 }} />
                  </div>
                  <span>{verses.length} / {surah.numberOfAyahs}</span>
                </div>
              </div>

              {/* ── Audio error banner ──────────────────────────────── */}
              {audioError && (
                <div style={{ background: "#FFF3F3", border: "1px solid #E0AAAA", borderRadius: 0, padding: "8px 32px", fontSize: 12, color: "#8A2020", fontFamily: T.fontBody, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                  <span>{isSq ? "Gabim audio. Kontrolloni lidhjen ose ndërroni recituesin." : "Audio failed to load. Check your connection or try a different reciter."}</span>
                  <button onClick={() => setAudioError(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A2020", fontSize: 16, padding: "0 4px" }}>×</button>
                </div>
              )}

              {/* ── Verses ─────────────────────────────────────────── */}
              <div id="qr-verses-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px 40px 120px" }}>
                {loadingRead ? (
                  <div style={{ textAlign: "center", padding: 60, color: T.warm500, fontSize: 13, letterSpacing: "0.1em", fontFamily: T.fontBody }}>
                    {isSq ? "Duke ngarkuar ajetet…" : "Loading verses…"}
                  </div>
                ) : verses.map(v => {
                  const isActive = playingVerse?.n === v.n;
                  return (
                    <div
                      key={v.n}
                      id={`qrv-${v.n}`}
                      className="qr-verse-card"
                      onClick={() => playVerse(v)}
                      style={{
                        display: "flex", gap: 20,
                        padding: isActive ? "24px 40px" : "24px 0",
                        margin: isActive ? "0 -40px" : "0",
                        borderBottom: `1px solid ${isActive ? T.gold100 : T.warm200}`,
                        background: isActive ? T.gold50 : isBookmarked(v.n) ? `${T.gold50}80` : "transparent",
                        cursor: "pointer", position: "relative", transition: "all 200ms ease",
                      }}
                    >
                      {/* Left accent bar */}
                      <div className="qr-verse-bar" style={{
                        position: "absolute", left: isActive ? 0 : -40, top: 0, bottom: 0,
                        width: 3, background: T.gold600, borderRadius: "0 2px 2px 0",
                        opacity: isActive ? 1 : 0, transition: "opacity 200ms",
                      }} />

                      {/* Left column: medallion + actions */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, paddingTop: 4 }}>
                        <VerseMedallion num={v.n} />
                        {/* Play */}
                        <button
                          onClick={e => { e.stopPropagation(); playVerse(v); }}
                          title={isActive && audioRef.current && !audioRef.current.paused ? "Pause" : "Play verse"}
                          style={{ width: 28, height: 28, borderRadius: "50%", background: isActive ? T.gold500 : T.gold600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", transition: "all 150ms", flexShrink: 0 }}
                        >
                          {isActive && audioRef.current && !audioRef.current.paused
                            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                            : <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          }
                        </button>
                        {/* Bookmark */}
                        <ActionBtn title={isBookmarked(v.n) ? "Remove bookmark" : "Bookmark"} active={isBookmarked(v.n)} onClick={() => toggleBookmark(v)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill={isBookmarked(v.n) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                        </ActionBtn>
                      </div>

                      {/* Right: Arabic + translation + tafsir btn */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: T.fontArabic, fontSize: arabicFontSize, color: isActive ? T.dark950 : T.dark900, direction: "rtl", textAlign: "right", lineHeight: 1.9, marginBottom: 10, letterSpacing: "0.01em" }}>
                          {v.ar}
                        </div>
                        {showTranslit && v.tr && (
                          <div style={{ fontSize: 13, fontStyle: "italic", color: T.gold600, marginBottom: 8, lineHeight: 1.6, fontFamily: T.fontBody }}>
                            {v.tr}
                          </div>
                        )}
                        {showTranslation && v.en && (
                          <div style={{ fontSize: 14, color: isActive ? T.dark800 : T.warm600, lineHeight: 1.75, fontFamily: T.fontBody }}>
                            {v.en}
                          </div>
                        )}
                        {/* Tafsir button */}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                          <button
                            className="qr-tafsir-btn"
                            onClick={e => { e.stopPropagation(); loadTafsir(v); }}
                            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: T.gold600, background: T.gold50, border: `1px solid ${T.gold300}`, borderRadius: 20, padding: "4px 12px", cursor: "pointer", transition: "all 150ms", fontFamily: T.fontBody, letterSpacing: "0.02em" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                            Tafsir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Prev / Next surah nav */}
                {!loadingRead && verses.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 12 }}>
                    <button onClick={() => navSurah(-1)} disabled={current === 1} style={{ flex: 1, padding: "12px 0", background: "transparent", border: `1px solid ${T.warm200}`, borderRadius: 999, color: current === 1 ? T.warm200 : T.warm600, cursor: current === 1 ? "default" : "pointer", fontSize: 12, fontFamily: T.fontBody, transition: "all 0.2s" }}>← {isSq ? "Sure e mëparshme" : "Previous Surah"}</button>
                    <button onClick={() => navSurah(1)} disabled={current === 114} style={{ flex: 1, padding: "12px 0", background: "transparent", border: `1px solid ${T.warm200}`, borderRadius: 999, color: current === 114 ? T.warm200 : T.warm600, cursor: current === 114 ? "default" : "pointer", fontSize: 12, fontFamily: T.fontBody, transition: "all 0.2s" }}>{isSq ? "Surja tjetër" : "Next Surah"} →</button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ════════════════════════════════════════
          AUDIO BAR (fixed at bottom)
      ════════════════════════════════════════ */}
      {current && (
        <div style={{ position: "fixed", bottom: 0, left: 300, right: 0, background: T.dark900, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "0 24px", height: 72, display: "flex", alignItems: "center", gap: 16, zIndex: 50 }}>
          {/* Info */}
          <div style={{ width: 160, flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: T.fontBody }}>
              {surah?.englishName ?? ""} {playingVerse ? `· ${isSq ? "Varg" : "Verse"} ${playingVerse.n}` : ""}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: T.fontBody }}>
              {RECITERS.find(r => r.id === reciter)?.label ?? ""}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => skipVerse(-1)} style={{ width: 36, height: 36, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", transition: "all 150ms" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4" /><line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
            <button
              onClick={() => {
                if (playingVerse && audioRef.current) {
                  if (audioRef.current.paused) { audioRef.current.play(); }
                  else { audioRef.current.pause(); setPlayingVerse(null); }
                }
              }}
              style={{ width: 44, height: 44, borderRadius: "50%", background: T.gold600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", margin: "0 4px", transition: "all 150ms" }}
              onMouseEnter={e => e.currentTarget.style.background = T.gold500}
              onMouseLeave={e => e.currentTarget.style.background = T.gold600}
            >
              {playingVerse && audioRef.current && !audioRef.current.paused
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              }
            </button>
            <button onClick={() => skipVerse(1)} style={{ width: 36, height: 36, borderRadius: 8, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", transition: "all 150ms" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20" /><line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2" /></svg>
            </button>
          </div>

          {/* Progress (placeholder — no time tracking in this version) */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 99, position: "relative" }}>
              <div style={{ height: "100%", width: playingVerse ? "50%" : "0%", background: T.gold600, borderRadius: 99, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Current verse display */}
          {playingVerse && (
            <div style={{ flexShrink: 0, width: 140, textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.gold400, fontFamily: T.fontBody }}>
                {isSq ? "Varg" : "Verse"} {playingVerse.n}
              </div>
              <div style={{ fontFamily: T.fontArabic, fontSize: 15, color: "rgba(255,255,255,0.6)", direction: "rtl", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {playingVerse.ar}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          TAFSIR MODAL
      ════════════════════════════════════════ */}
      {tafsirVerse && (
        <TafsirModal
          verse={tafsirVerse}
          surahName={surah?.englishName ?? ""}
          onClose={() => setTafsirVerse(null)}
          onPrev={() => tafsirNav(-1)}
          onNext={() => tafsirNav(1)}
          hasPrev={verses.findIndex(v => v.n === tafsirVerse.n) > 0}
          hasNext={verses.findIndex(v => v.n === tafsirVerse.n) < verses.length - 1}
          tafsirId={tafsirId}
          onTafsirIdChange={setTafsirId}
          tafsirText={tafsirText}
          tafsirLoading={tafsirLoading}
        />
      )}
    </>
  );
}
