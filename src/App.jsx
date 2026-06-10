import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import { BG, SURFACE, BORDER, GREEN, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS } from "./constants";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dhikr from "./components/Dhikr";
import Profile from "./components/Profile";
import Icon from "./components/Icon";
import KaabaWatermark from "./components/KaabaWatermark";
import MobileTabBar from "./components/MobileTabBar";
import QuranReader from "./components/QuranReader";
import SiTeFalesh from "./components/SiTeFalesh";
import HowToPray from "./components/HowToPray";
import Zakat from "./components/Zakat";
import Inheritance from "./components/Inheritance";
import DateConverter from "./components/DateConverter";
import Library from "./components/Library";
import SunnetiReadingRoom from "./components/SunnetiBook";
import IslamicCalendar from "./components/IslamicCalendar";
import GlobalSearch from "./components/GlobalSearch";
import AuthModal, { loadSession, saveSession, clearSession } from "./components/AuthModal";
import LangBar from "./components/LangBar";
import FloatingPlayer from "./components/FloatingPlayer";
import DuaPage from "./components/DuaPage";
import AsmaPage from "./components/AsmaPage";
import AudioPage from "./components/AudioPage";
import { SUPA_URL, SUPA_ANON_KEY, UPLOAD_WORKER_URL, UPLOAD_API, ADMIN_EMAILS, supaFetch } from "./lib/supabase";
import { VALID_PAGES, slugToPage, pageToUrl } from "./lib/routing";
import { QUOTES } from "./data/quotes";
import { LECTURES } from "./data/lectures";


// ─── QURAN AUDIO URL RESOLVER ─────────────────────────────────────
const _UMMAH_KEY = "umh_19513cb42f6754b8129635dd79f7ddc01d237fad";
const _quranUrlCache = new Map();
async function resolveQuranUrl(surahN, verseN, reciterId) {
  const key = `${reciterId}:${surahN}:${verseN}`;
  if (_quranUrlCache.has(key)) return _quranUrlCache.get(key);
  const res = await fetch(`https://ummahapi.com/api/quran/surah/${surahN}/ayah/${verseN}?apikey=${_UMMAH_KEY}`);
  const data = await res.json();
  const entry = Array.isArray(data.data?.audio) ? data.data.audio.find(a => a.reciter_id === reciterId) : null;
  const url = entry?.ayah_audio || null;
  if (url) _quranUrlCache.set(key, url);
  return url;
}


export default function App() {
  const { t } = useTranslation();
  const [page, setPage] = useState(() => {
    // Support legacy hash URLs
    const hash = window.location.hash.replace("#", "");
    if (hash && VALID_PAGES.includes(hash)) return hash;
    // Parse /lang/slug or /lang/ (new format)
    const parts = window.location.pathname.replace(/^\//, "").split("/").filter(Boolean);
    if (parts[0] === "en" || parts[0] === "sq") {
      const urlLang = parts[0];
      i18n.changeLanguage(urlLang);
      const pageId = slugToPage(urlLang, parts[1] || "");
      return pageId || "home";
    }
    // Legacy: direct page ID
    const path = parts[0] || "";
    return VALID_PAGES.includes(path) ? path : "home";
  });
  const [navHistory, setNavHistory] = useState([]);
  const HADITH_QUOTES = QUOTES.filter(q => !q.src?.startsWith("Quran"));
  const QURAN_QUOTES  = QUOTES.filter(q =>  q.src?.startsWith("Quran"));
  const [quote]       = useState(() => HADITH_QUOTES[Math.floor(Math.random() * HADITH_QUOTES.length)]);
  const [verseQuote]  = useState(() => QURAN_QUOTES [Math.floor(Math.random() * QURAN_QUOTES.length)]);
  const [showSearch, setShowSearch] = useState(false);
  const [duaFavs, setDuaFavs] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("mp-dua-favs") || "[]")); } catch { return new Set(); }
  });

  function toggleDuaFav(id) {
    setDuaFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("mp-dua-favs", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  // ── PWA install prompt ────────────────────────────────────────
  const deferredPrompt = useRef(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mp-install-dismissed")) return;
    function handler(e) {
      e.preventDefault();
      deferredPrompt.current = e;
      setShowInstall(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    deferredPrompt.current.userChoice.then(() => {
      deferredPrompt.current = null;
      setShowInstall(false);
    });
  }

  function dismissInstall() {
    setShowInstall(false);
    try { localStorage.setItem("mp-install-dismissed", "1"); } catch {}
  }

  // ── Auth state ─────────────────────────────────────────────────
  const [authSession, setAuthSession] = useState(() => loadSession());
  const [showAuth, setShowAuth] = useState(false);
  const authUser = authSession?.user;

  // Handle OAuth redirect hash (#access_token=...&type=recovery|signup etc.)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      try {
        const params = new URLSearchParams(hash.slice(1));
        const session = {
          access_token: params.get("access_token"),
          refresh_token: params.get("refresh_token"),
          expires_in: params.get("expires_in"),
          token_type: params.get("token_type"),
        };
        // Fetch user info
        fetch(SUPA_URL + "/auth/v1/user", {
          headers: { apikey: SUPA_ANON_KEY, Authorization: "Bearer " + session.access_token },
        }).then(r => r.json()).then(user => {
          const full = { ...session, user };
          saveSession(full);
          setAuthSession(full);
          // Clean hash from URL
          history.replaceState(null, "", window.location.pathname);
        }).catch(() => {});
      } catch {}
    }
  }, []);

  function handleSignOut() {
    if (authSession?.access_token) {
      fetch(SUPA_URL + "/auth/v1/logout", {
        method: "POST",
        headers: { apikey: SUPA_ANON_KEY, Authorization: "Bearer " + authSession.access_token },
      }).catch(() => {});
    }
    clearSession();
    setAuthSession(null);
  }

  // ── Global audio state ─────────────────────────────────────────
  const [lectures, setLectures] = useState(LECTURES);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerMinimized, setPlayerMinimized] = useState(false);
  const audioRef = useRef(null);
  const quranPlaylistRef = useRef(null); // { verses, surahN, surahName, reciter }

  useEffect(() => {
    if (!SUPA_URL) return;
    supaFetch("lectures", "select=*&order=sort")
      .then(data => { if (Array.isArray(data) && data.length > 0) setLectures(data); })
      .catch(() => {});
  }, []);

  function playLecture(lecture) {
    if (current?.id === lecture.id) {
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else { audioRef.current.play(); setPlaying(true); }
    } else {
      setCurrent(lecture);
      setProgress(0);
      setPlaying(true);
    }
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  }

  function playQuranAudio(url, meta) {
    if (current?.id === meta.id) { togglePlay(); return; }
    setCurrent({ ...meta, url });
    setProgress(0);
    setPlaying(true);
  }

  async function skipQuranVerse(dir) {
    const ctx = quranPlaylistRef.current;
    if (!ctx || !current) return;
    const { verses, surahN, surahName, reciter } = ctx;
    const idx = verses.findIndex(v => v.n === current.verseN);
    const next = verses[idx + dir];
    if (!next) return;
    try {
      const url = await resolveQuranUrl(surahN, next.n, reciter);
      if (!url) return;
      const id = `quran-${surahN}-${next.n}`;
      setCurrent({ id, title: `${surahName} · ${next.n}`, url, type: "quran", surahN, surahName, verseN: next.n });
      setProgress(0);
      setPlaying(true);
    } catch {}
  }

  function handleAudioEnd() {
    if (current?.type === "quran") skipQuranVerse(1);
    else skipLecture(1);
  }

  useEffect(() => {
    if (!current || !audioRef.current) return;
    audioRef.current.src = current.url;
    audioRef.current.play().catch(() => {});
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.title,
        artist: current.type === "quran" ? (current.surahName || "Quran") : "Sunneti.com",
        album: current.type === "quran" ? "Quran" : "Ligjerata Islame",
      });
      navigator.mediaSession.setActionHandler("play", () => { audioRef.current.play(); setPlaying(true); });
      navigator.mediaSession.setActionHandler("pause", () => { audioRef.current.pause(); setPlaying(false); });
      navigator.mediaSession.setActionHandler("previoustrack", () => current?.type === "quran" ? skipQuranVerse(-1) : skipLecture(-1));
      navigator.mediaSession.setActionHandler("nexttrack", () => current?.type === "quran" ? skipQuranVerse(1) : skipLecture(1));
      navigator.mediaSession.setActionHandler("seekbackward", () => { audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5); });
      navigator.mediaSession.setActionHandler("seekforward", () => { audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 5); });
    }
  }, [current]);

  function skipLecture(dir) {
    if (!current) return;
    const idx = lectures.findIndex(l => l.id === current.id);
    const next = lectures[idx + dir];
    if (next) playLecture(next);
  }

  function stopAudio() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setPlaying(false);
    setCurrent(null);
    setProgress(0);
    setDuration(0);
  }

  function onTimeUpdate() {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  }

  function seekAudio(e) {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  }

  function fmtTime(s) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }
  // ──────────────────────────────────────────────────────────────

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setShowSearch(s => !s); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Browser back/forward button support
  useEffect(() => {
    function onPop() {
      const parts = window.location.pathname.replace(/^\//, "").split("/").filter(Boolean);
      if (parts[0] === "en" || parts[0] === "sq") {
        const urlLang = parts[0];
        i18n.changeLanguage(urlLang);
        setPage(slugToPage(urlLang, parts[1] || "") || "home");
        return;
      }
      const path = parts[0] || "";
      setPage(VALID_PAGES.includes(path) ? path : "home");
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Dynamic <title> + <meta description> per page
  const PAGE_META = {
    home:        { title: "Sunneti.com - Daily Islamic Companion",          desc: "Quran, Duas, Tasbeeh, Islamic calendar and more in one calm daily app." },
    quran:       { title: "Quran - Sunneti.com",                            desc: "Read the Holy Quran with Arabic text, transliteration and English translation." },
    dua:         { title: "Dua & Dhikr - Sunneti.com",                      desc: "Morning & evening adhkar, daily supplications and situational remembrances." },
    asma:        { title: "99 Names of Allah - Sunneti.com",                desc: "Al-Asma ul-Husna, the 99 Beautiful Names of Allah with meanings and transliteration." },
    tasbeeh:     { title: "Digital Tasbeeh Counter - Sunneti.com",          desc: "Digital dhikr counter for Subhanallah, Alhamdulillah, Allahu Akbar and custom phrases." },
    zakat:       { title: "Zakat Calculator - Sunneti.com",                 desc: "Calculate your annual Zakat obligation based on nisab threshold and zakatable assets." },
    inheritance: { title: "Islamic Inheritance Calculator - Sunneti.com",   desc: "Estimate Islamic inheritance shares for learning, then confirm real cases with a qualified scholar." },
    calendar:    { title: "Islamic Calendar - Sunneti.com",                 desc: "Hijri calendar with Islamic dates, events and Gregorian cross-reference." },
    dates:       { title: "Hijri / Gregorian Date Converter - Sunneti.com", desc: "Convert dates between the Islamic Hijri calendar and the Gregorian calendar." },
    library:     { title: "Islamic Library - Sunneti.com",                  desc: "Curated collection of essential Islamic books, Quran, Hadith, Seerah, Fiqh and Aqeedah." },
    audio:       { title: "Islamic Lectures - Sunneti.com",                 desc: "Listen to Islamic lectures and audio content." },
    namaz:       { title: "Si te Falesh - Sunneti.com",                     desc: "Pese namazet e dites, shpjeguar hap pas hapi me shqiptim dhe kuptim shqip." },
  };
  useEffect(() => {
    const m = PAGE_META[page] || PAGE_META.home;
    document.title = m.title;
    const setMeta = (sel, attr, val) => {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]',         "content", m.desc);
    setMeta('meta[property="og:title"]',        "content", m.title);
    setMeta('meta[property="og:description"]',  "content", m.desc);
    const lang = i18n.language?.startsWith("sq") ? "sq" : "en";
    setMeta('meta[property="og:url"]',          "content", `https://sunneti.com${pageToUrl(page, lang)}`);
  }, [page]);

  const [namazPrayerId, setNamazPrayerId] = useState(null);

  function navigate(p, extra) {
    if (p !== page) setNavHistory(h => [...h, page]);
    setPage(p);
    if (p === "namaz") setNamazPrayerId(extra || null);
    const lang = i18n.language?.startsWith("sq") ? "sq" : "en";
    window.history.pushState({}, "", pageToUrl(p, lang));
  }

  function goBack() {
    if (navHistory.length === 0) return;
    const prev = navHistory[navHistory.length - 1];
    setNavHistory(h => h.slice(0, -1));
    setPage(prev);
    const lang = i18n.language?.startsWith("sq") ? "sq" : "en";
    window.history.pushState({}, "", pageToUrl(prev, lang));
  }

  const skipTrack = current?.type === "quran" ? skipQuranVerse : skipLecture;
  const audioProps = { lectures, current, playing, play: playLecture, playQuranAudio, togglePlay, skip: skipTrack, stop: stopAudio, seek: seekAudio, progress, duration, fmt: fmtTime, audioRef, minimized: playerMinimized, setMinimized: setPlayerMinimized };

  return (
    <div className="app-root" style={{ paddingBottom: current && !playerMinimized ? 68 : 0 }}>
      {/* ── Fixed decorative blobs (behind all content) ── */}
      <div className="app-blob app-blob-1" aria-hidden="true" />
      <div className="app-blob app-blob-2" aria-hidden="true" />

      {/* ── Global Kaaba watermark (non-home, non-quran pages) ── */}
      {page !== "home" && page !== "quran" && <KaabaWatermark fixed opacity={0.08} />}

      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={handleAudioEnd} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} />
      <Navbar page={page} setPage={navigate} onSearch={() => setShowSearch(true)} authUser={authUser} onAuthClick={() => setShowAuth(true)} onSignOut={handleSignOut} />
      {page === "home" && <LangBar page={page} />}
      <main>
        {page === "home" && <Home quote={quote} verseQuote={verseQuote} setPage={navigate} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall} />}
        {page === "zakat" && <Zakat />}
        {page === "inheritance" && <Inheritance />}
        {page === "calendar" && <IslamicCalendar />}
        {page === "dates" && <DateConverter />}
        {page === "library" && <Library navigate={navigate} />}
        {page === "audio" && <AudioPage {...audioProps} />}
        {page === "tasbeeh" && <Dhikr />}
        {page === "quran"   && <QuranReader
          playQuranAudio={playQuranAudio}
          globalCurrentId={current?.type === "quran" ? current.id : null}
          globalPlaying={playing && current?.type === "quran"}
          globalVerseN={current?.type === "quran" ? current.verseN : null}
          quranPlaylistRef={quranPlaylistRef}
          onTogglePlay={togglePlay}
          onSkip={skipTrack}
          onStopQuranAudio={() => { if (current?.type === "quran") stopAudio(); }}
        />}
        {page === "profile" && <Profile authUser={authUser} onSignOut={handleSignOut} navigate={navigate} />}
        {page === "dua"     && <DuaPage favs={duaFavs} onFav={toggleDuaFav} />}
        {page === "asma"    && <AsmaPage />}
        {page === "admin"   && <AdminPage authSession={authSession} />}
        {page === "namaz"   && (i18n.language?.startsWith("sq")
          ? <SiTeFalesh initialPrayerId={namazPrayerId} />
          : <HowToPray  initialPrayerId={namazPrayerId} />
        )}
      </main>
      {/* Immersive full-screen page — rendered outside <main> so it stacks above the navbar */}
      {page === "sunneti" && <SunnetiReadingRoom onExit={() => navigate("library")} />}
      {showSearch && (
        <GlobalSearch
          onClose={() => setShowSearch(false)}
          navigate={navigate}
          lectures={lectures}
        />
      )}
      {/* Back button — top-left on mobile, bottom-left on desktop */}
      {page !== "home" && page !== "namaz" && navHistory.length > 0 && (
        <button onClick={goBack} title="Go back" className="back-btn" style={{
          position: "fixed",
          bottom: current ? 80 : 24,
          left: 16,
          zIndex: 450,
          background: "var(--surface)",
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-sm)",
          color: MUTED,
          cursor: "pointer",
          width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, lineHeight: 1,
          boxShadow: "var(--shadow-glass-sm)",
          transition: "border-color 0.2s, color 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
        >‹</button>
      )}
      <FloatingPlayer {...audioProps} navigate={navigate} />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={session => setAuthSession(session)}
        />
      )}

      {/* ── Mobile bottom tab bar (all pages) ── */}
      <MobileTabBar page={page} navigate={navigate} />
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────
const BOOK_CATS = ["Quran","Tafsir","Hadith","Seerah","Fiqh","Aqeedah","Spirituality","Dua & Dhikr","History","Modern Thought","Arabic","Online","Shqip"];
const EMPTY_BOOK = { title: "", author: "", cat: "Quran", url: "#" };
const EMPTY_LEC  = { sort: "", title: "", file: "", url: "" };

async function supaAdmin(method, table, body, token, filter = "") {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}${filter ? "?" + filter : ""}`, {
    method,
    headers: {
      apikey: SUPA_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text ? JSON.parse(text) : null;
}

function AdminPage({ authSession }) {
  // Use existing auth session token if user is already signed in as admin
  const sessionToken = authSession?.access_token || null;
  const sessionEmail = authSession?.user?.email || "";
  const isAdminEmail = ADMIN_EMAILS.includes(sessionEmail);

  const [token, setToken]       = useState(() => (sessionToken && isAdminEmail) ? sessionToken : null);
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [logging, setLogging]   = useState(false);
  const [tab, setTab]           = useState("books");

  const [books, setBooks]       = useState([]);
  const [lectures, setLectures] = useState([]);
  const [busy, setBusy]         = useState(false);
  const [msg, setMsg]           = useState("");

  const [bookForm, setBookForm]   = useState(EMPTY_BOOK);
  const [editBook, setEditBook]   = useState(null);
  const [lecForm, setLecForm]     = useState(EMPTY_LEC);
  const [editLec, setEditLec]     = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadPct, setUploadPct]     = useState(0);
  const [uploadingMp3, setUploadingMp3] = useState(false);
  const [uploadMp3Pct, setUploadMp3Pct] = useState(0);

  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 2800); }

  async function uploadPDF(file) {
    if (!file) return;
    setUploading(true); setUploadPct(0);
    try {
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", UPLOAD_API);
        xhr.setRequestHeader("Authorization", "Bearer " + authSession.access_token);
        xhr.setRequestHeader("X-Filename", file.name.replace(/\s+/g, "_"));
        xhr.setRequestHeader("X-Folder", "books");
        xhr.setRequestHeader("Content-Type", file.type || "application/pdf");
        xhr.upload.onprogress = e => { if (e.lengthComputable) setUploadPct(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            xhr.status < 300 ? resolve(data) : reject(new Error(data.error || xhr.responseText));
          } catch { reject(new Error(xhr.responseText)); }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });
      setBookForm(f => ({ ...f, url: result.url }));
      flash("✓ PDF uploaded to Cloudflare R2 — URL filled in.");
    } catch (e) {
      flash("Upload error: " + e.message);
    } finally {
      setUploading(false); setUploadPct(0);
    }
  }

  async function uploadMP3(file) {
    if (!file) return;
    setUploadingMp3(true); setUploadMp3Pct(0);
    try {
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", UPLOAD_API);
        xhr.setRequestHeader("Authorization", "Bearer " + authSession.access_token);
        xhr.setRequestHeader("X-Filename", file.name.replace(/\s+/g, "_"));
        xhr.setRequestHeader("X-Folder", "audio/Ligjerata");
        xhr.setRequestHeader("Content-Type", file.type || "audio/mpeg");
        xhr.upload.onprogress = e => { if (e.lengthComputable) setUploadMp3Pct(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            xhr.status < 300 ? resolve(data) : reject(new Error(data.error || xhr.responseText));
          } catch { reject(new Error(xhr.responseText)); }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });
      // Auto-fill title (filename without extension), file, url
      const nameNoExt = file.name.replace(/\.[^.]+$/, "").replace(/_/g, " ");
      setLecForm(f => ({
        ...f,
        title: f.title || nameNoExt,
        file: file.name.replace(/\s+/g, "_"),
        url: result.url,
      }));
      flash("✓ MP3 uploaded to Cloudflare R2 — fields filled in.");
    } catch (e) {
      flash("Upload error: " + e.message);
    } finally {
      setUploadingMp3(false); setUploadMp3Pct(0);
    }
  }

  async function login() {
    if (!SUPA_URL) { setLoginErr("Supabase not configured in App.jsx"); return; }
    setLogging(true); setLoginErr("");
    try {
      const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPA_ANON_KEY },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      console.log("Supabase auth response:", data);
      if (!res.ok) throw new Error(data.error_description || data.error || data.msg || JSON.stringify(data));
      setToken(data.access_token);
    } catch (e) { setLoginErr(e.message); }
    finally { setLogging(false); }
  }

  async function load() {
    setBusy(true);
    try {
      const [b, l] = await Promise.all([
        supaFetch("books", "select=*&order=id"),
        supaFetch("lectures", "select=*&order=sort"),
      ]);
      if (b) setBooks(b);
      if (l) setLectures(l);
    } finally { setBusy(false); }
  }

  useEffect(() => { if (token) load(); }, [token]);

  // ── Books CRUD ─────────────────────────────────────────────────
  async function saveBook() {
    if (!bookForm.title.trim()) return;
    setBusy(true);
    try {
      if (editBook) {
        await supaAdmin("PATCH", "books", bookForm, token, `id=eq.${editBook}`);
        setBooks(bs => bs.map(b => b.id === editBook ? { ...b, ...bookForm } : b));
        flash("Book updated.");
      } else {
        const [created] = await supaAdmin("POST", "books", bookForm, token);
        setBooks(bs => [...bs, created]);
        flash("Book added.");
      }
      setBookForm(EMPTY_BOOK); setEditBook(null);
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  async function deleteBook(id) {
    if (!confirm("Delete this book?")) return;
    setBusy(true);
    try {
      await supaAdmin("DELETE", "books", null, token, `id=eq.${id}`);
      setBooks(bs => bs.filter(b => b.id !== id));
      flash("Deleted.");
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  function startEditBook(b) {
    setEditBook(b.id);
    setBookForm({ title: b.title, author: b.author, cat: b.cat, url: b.url });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Lectures CRUD ──────────────────────────────────────────────
  async function saveLec() {
    if (!lecForm.title.trim()) return;
    setBusy(true);
    try {
      const payload = { ...lecForm, sort: Number(lecForm.sort) || 0 };
      if (editLec) {
        await supaAdmin("PATCH", "lectures", payload, token, `id=eq.${editLec}`);
        setLectures(ls => ls.map(l => l.id === editLec ? { ...l, ...payload } : l));
        flash("Lecture updated.");
      } else {
        const [created] = await supaAdmin("POST", "lectures", payload, token);
        setLectures(ls => [...ls, created].sort((a,b) => a.sort - b.sort));
        flash("Lecture added.");
      }
      setLecForm(EMPTY_LEC); setEditLec(null);
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  async function deleteLec(id) {
    if (!confirm("Delete this lecture?")) return;
    setBusy(true);
    try {
      await supaAdmin("DELETE", "lectures", null, token, `id=eq.${id}`);
      setLectures(ls => ls.filter(l => l.id !== id));
      flash("Deleted.");
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  function startEditLec(l) {
    setEditLec(l.id);
    setLecForm({ sort: l.sort, title: l.title, file: l.file, url: l.url });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Styles ─────────────────────────────────────────────────────
  const inp = {
    width: "100%", padding: "9px 12px", background: "#faf5ec",
    border: `1px solid ${BORDER}`, borderRadius: 2, color: TEXT,
    fontSize: 13, fontFamily: SANS, outline: "none",
  };
  const btn = (accent = GOLD, outline = false) => ({
    padding: "8px 18px", borderRadius: 2, cursor: "pointer", fontSize: 12,
    fontFamily: SANS, fontWeight: 600, letterSpacing: "0.06em",
    border: `1px solid ${accent}`,
    background: outline ? "transparent" : accent,
    color: outline ? accent : "#f0e6ce",
    transition: "opacity 0.2s",
  });

  // ── Login screen ───────────────────────────────────────────────
  if (!token) {
    // User is signed in but not an admin
    if (sessionToken && !isAdminEmail) return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>&#x1F512;</div>
          <div style={{ fontFamily: SERIF, fontSize: 20, color: TEXT, marginBottom: 8 }}>Access Restricted</div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
            Your account ({sessionEmail}) does not have admin access.
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380, background: SURFACE, border: `1px solid ${BORDER}`, padding: "40px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src="/logo.png" alt="" style={{ width: 52, height: 52, objectFit: "contain", marginBottom: 16 }} />
            <div style={{ fontFamily: SERIF, fontSize: 22, color: TEXT, letterSpacing: "0.04em" }}>Admin Panel</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Sunneti.com</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input style={inp} type="email" placeholder="Admin Email" value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={e => e.target.style.borderColor = GOLD}
              onBlur={e => e.target.style.borderColor = BORDER}
              onKeyDown={e => e.key === "Enter" && login()} />
            <input style={inp} type="password" placeholder="Password" value={pass}
              onChange={e => setPass(e.target.value)}
              onFocus={e => e.target.style.borderColor = GOLD}
              onBlur={e => e.target.style.borderColor = BORDER}
              onKeyDown={e => e.key === "Enter" && login()} />
            {loginErr && <div style={{ fontSize: 12, color: "#e74c3c", textAlign: "center" }}>{loginErr}</div>}
            <button onClick={login} disabled={logging} style={{ ...btn(), marginTop: 8, opacity: logging ? 0.6 : 1 }}>
              {logging ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 28, color: TEXT }}>Admin Panel</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Manage library books and lectures</div>
        </div>
        <button onClick={() => { setToken(null); setEmail(""); setPass(""); }} style={btn("#c0392b", true)}>Sign Out</button>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{ background: GREEN_L, border: `1px solid ${GOLD}40`, color: GOLD, padding: "10px 16px", fontSize: 13, marginBottom: 20, borderRadius: 2 }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: 28 }}>
        {["books", "lectures"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", borderBottom: tab === t ? `2px solid ${GOLD}` : "2px solid transparent",
            color: tab === t ? GOLD : MUTED, padding: "10px 20px", cursor: "pointer",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: SANS, transition: "color 0.2s",
          }}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        {busy && <div style={{ fontSize: 12, color: MUTED, alignSelf: "center", paddingRight: 8 }}>Loading…</div>}
      </div>

      {/* ── BOOKS TAB ── */}
      {tab === "books" && (
        <div>
          {/* Form */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "24px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              {editBook ? "Edit Book" : "Add New Book"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input style={inp} placeholder="Title *" value={bookForm.title}
                onChange={e => setBookForm(f => ({ ...f, title: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <input style={inp} placeholder="Author" value={bookForm.author}
                onChange={e => setBookForm(f => ({ ...f, author: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <select value={bookForm.cat} onChange={e => setBookForm(f => ({ ...f, cat: e.target.value }))}
                style={{ ...inp, cursor: "pointer" }}>
                {BOOK_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input style={inp} placeholder="URL (leave blank if uploading PDF)" value={bookForm.url === "#" ? "" : bookForm.url}
                onChange={e => setBookForm(f => ({ ...f, url: e.target.value || "#" }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>

            {/* PDF Upload */}
            <div style={{ marginTop: 12, border: `1px dashed ${UPLOAD_WORKER_URL ? BORDER : GOLD+"30"}`, borderRadius: 2, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, letterSpacing: "0.06em" }}>
                UPLOAD PDF — auto-fills the URL above
                {!UPLOAD_WORKER_URL && <span style={{ color: "#e67e22", marginLeft: 8 }}>⚠ Set VITE_UPLOAD_WORKER_URL in Vercel env vars to enable uploads</span>}
              </div>
              <input
                type="file" accept=".pdf"
                onChange={e => uploadPDF(e.target.files[0])}
                style={{ fontSize: 12, color: MUTED, cursor: "pointer" }}
                disabled={uploading}
              />
              {uploading && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ height: 3, background: BORDER, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${uploadPct}%`, background: GOLD, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: GOLD, marginTop: 4 }}>Uploading… {uploadPct}%</div>
                </div>
              )}
              {bookForm.url && bookForm.url !== "#" && bookForm.url.includes("supabase") && (
                <div style={{ fontSize: 11, color: GOLD, marginTop: 8 }}>✓ PDF ready: {bookForm.url.split("/").pop()}</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={saveBook} disabled={uploading} style={{ ...btn(), opacity: uploading ? 0.5 : 1 }}>
                {editBook ? "Update Book" : "Add Book"}
              </button>
              {editBook && <button onClick={() => { setEditBook(null); setBookForm(EMPTY_BOOK); }} style={btn(MUTED, true)}>Cancel</button>}
            </div>
          </div>

          {/* Books list */}
          <div style={{ border: `1px solid ${BORDER}` }}>
            {books.map((b, i) => (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                borderBottom: i < books.length - 1 ? `1px solid ${BORDER}` : "none",
                background: editBook === b.id ? GREEN_L : "transparent",
              }}>
                <span style={{ fontSize: 10, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase", minWidth: 80, flexShrink: 0 }}>{b.cat}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: TEXT, fontFamily: SERIF }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{b.author}</div>
                </div>
                {b.url !== "#" && (
                  <a href={b.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: MUTED, textDecoration: "none", flexShrink: 0 }}>↗</a>
                )}
                <button onClick={() => startEditBook(b)} style={{ ...btn(GOLD, true), padding: "5px 12px", fontSize: 11 }}>Edit</button>
                <button onClick={() => deleteBook(b.id)} style={{ ...btn("#c0392b", true), padding: "5px 12px", fontSize: 11 }}>Del</button>
              </div>
            ))}
            {books.length === 0 && !busy && (
              <div style={{ padding: 32, textAlign: "center", color: MUTED, fontSize: 13 }}>No books yet.</div>
            )}
          </div>
        </div>
      )}

      {/* ── LECTURES TAB ── */}
      {tab === "lectures" && (
        <div>
          {/* Form */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "24px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              {editLec ? "Edit Lecture" : "Add New Lecture"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, marginBottom: 10 }}>
              <input style={inp} placeholder="Order" type="number" value={lecForm.sort}
                onChange={e => setLecForm(f => ({ ...f, sort: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <input style={inp} placeholder="Title *" value={lecForm.title}
                onChange={e => setLecForm(f => ({ ...f, title: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input style={inp} placeholder="Filename (e.g. Lecture.mp3)" value={lecForm.file}
                onChange={e => setLecForm(f => ({ ...f, file: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <input style={inp} placeholder="Full URL" value={lecForm.url}
                onChange={e => setLecForm(f => ({ ...f, url: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>

            {/* MP3 Upload */}
            <div style={{ marginTop: 12, border: `1px dashed ${UPLOAD_WORKER_URL ? BORDER : GOLD+"30"}`, borderRadius: 2, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, letterSpacing: "0.06em" }}>
                UPLOAD MP3 — auto-fills filename, URL and title above
                {!UPLOAD_WORKER_URL && <span style={{ color: "#e67e22", marginLeft: 8 }}>⚠ Set VITE_UPLOAD_WORKER_URL in Vercel env vars to enable uploads</span>}
              </div>
              <input
                type="file" accept=".mp3,audio/*"
                onChange={e => uploadMP3(e.target.files[0])}
                style={{ fontSize: 12, color: MUTED, cursor: "pointer" }}
                disabled={uploadingMp3}
              />
              {uploadingMp3 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ height: 3, background: BORDER, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${uploadMp3Pct}%`, background: GOLD, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: GOLD, marginTop: 4 }}>Uploading… {uploadMp3Pct}%</div>
                </div>
              )}
              {lecForm.url && lecForm.url.includes("r2.dev") && (
                <div style={{ fontSize: 11, color: GOLD, marginTop: 8 }}>✓ MP3 ready: {lecForm.file}</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={saveLec} disabled={uploadingMp3} style={{ ...btn(), opacity: uploadingMp3 ? 0.5 : 1 }}>
                {editLec ? "Update Lecture" : "Add Lecture"}
              </button>
              {editLec && <button onClick={() => { setEditLec(null); setLecForm(EMPTY_LEC); }} style={btn(MUTED, true)}>Cancel</button>}
            </div>
          </div>

          {/* Lectures list */}
          <div style={{ border: `1px solid ${BORDER}` }}>
            {lectures.map((l, i) => (
              <div key={l.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                borderBottom: i < lectures.length - 1 ? `1px solid ${BORDER}` : "none",
                background: editLec === l.id ? GREEN_L : "transparent",
              }}>
                <span style={{ fontSize: 11, color: MUTED, minWidth: 24, flexShrink: 0 }}>#{l.sort}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: TEXT, fontFamily: SERIF }}>{l.title}</div>
                  <div style={{ fontSize: 11, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.file}</div>
                </div>
                <button onClick={() => startEditLec(l)} style={{ ...btn(GOLD, true), padding: "5px 12px", fontSize: 11 }}>Edit</button>
                <button onClick={() => deleteLec(l.id)} style={{ ...btn("#c0392b", true), padding: "5px 12px", fontSize: 11 }}>Del</button>
              </div>
            ))}
            {lectures.length === 0 && !busy && (
              <div style={{ padding: 32, textAlign: "center", color: MUTED, fontSize: 13 }}>No lectures yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
