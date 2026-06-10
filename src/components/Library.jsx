import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BORDER, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS, SURFACE } from "../constants";
import { PageTitle } from "./primitives";
import { LIBRARY, LIBRARY_CATEGORIES } from "../data/library";
import { supaFetch, SUPA_URL, UPLOAD_WORKER_URL } from "../lib/supabase";

const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;

export default function Library({ navigate }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [books, setBooks] = useState(LIBRARY);
  const [cats, setCats] = useState(LIBRARY_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  function openPdf(book) {
    const CDN = "https://cdn.muslimspath.app/";
    const key = book.url.startsWith(CDN) ? book.url.slice(CDN.length) : `books/${book.url.split("/").pop()}`;
    const workerUrl = `${UPLOAD_WORKER_URL}/${key}`;
    if (isMobile()) {
      window.open(workerUrl, "_blank", "noreferrer");
    } else {
      setPdfOpen({ url: book.url, title: book.title });
      setPdfError(false);
    }
  }

  useEffect(() => {
    if (!SUPA_URL) return;
    setLoading(true);
    supaFetch("books", "select=*&order=id")
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
          setCats(["All", ...Array.from(new Set(data.map(b => b.cat)))]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const normalizeUrl = url => url
    .replace("https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/", "https://cdn.muslimspath.app/books/")
    .replace(/^https:\/\/cdn\.muslimspath\.app\/(?!books\/)([^/]+\.pdf)$/, "https://cdn.muslimspath.app/books/$1");

  const filtered = books.map(b => ({ ...b, url: normalizeUrl(b.url) })).filter(b => {
    if (!b.url || b.url === "#") return false;
    const matchCat = cat === "All" || b.cat === cat;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="library" title={t("pages.library.title")} sub={loading ? "Loading…" : `${books.length} curated books and resources`} />

      {/* Featured: Sunneti Reading Room */}
      <button
        onClick={() => navigate("sunneti")}
        style={{
          position: "relative", overflow: "hidden", cursor: "pointer", width: "100%",
          textAlign: "left", border: "none", borderRadius: 16, marginBottom: 20,
          padding: "26px 30px",
          background: "radial-gradient(120% 140% at 88% 12%, #3c5e22 0%, #2d5018 46%, #213d12 100%)",
          boxShadow: "var(--shadow-md)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}
      >
        <span>
          <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#D4BA88", fontFamily: SANS }}>
            {t("sunneti.kicker", "Dhoma e Leximit")}
          </span>
          <span style={{ display: "block", fontFamily: SERIF, fontWeight: 700, fontSize: 28, lineHeight: 1.15, color: "#FAF7EE", marginTop: 8 }}>
            Sunneti — <em style={{ fontStyle: "italic", fontWeight: 500, color: "#D4BA88" }}>{t("sunneti.accent", "një libër për t'u shfletuar")}</em>
          </span>
          <span style={{ display: "block", fontFamily: SANS, fontSize: 14, color: "rgba(245,237,216,0.78)", marginTop: 8 }}>
            {t("sunneti.sub", "Kurani, namazi, lutjet e më shumë — të mbledhura si kapituj në një libër të vetëm.")}
          </span>
        </span>
        <span aria-hidden="true" style={{
          flex: "0 0 auto", width: 48, height: 48, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(250,247,238,0.12)", color: "#FAF7EE",
          border: "1px solid rgba(212,186,136,0.4)", fontSize: 22,
        }}>›</span>
      </button>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          placeholder="Search by title or author…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: "1 1 200px", padding: "9px 14px", borderRadius: 2,
            border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT,
            background: "#faf5ec", outline: "none", fontFamily: SANS,
          }}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
        <select value={cat} onChange={e => { if (e.target.value === "🎙️ Lectures") navigate("audio"); else setCat(e.target.value); }} style={{
          padding: "9px 14px", borderRadius: 2, border: `1px solid ${BORDER}`,
          fontSize: 12, color: TEXT, background: "#faf5ec", cursor: "pointer",
          flex: "0 0 160px", letterSpacing: "0.04em", fontFamily: SANS, outline: "none",
        }}>
          {cats.map(c => <option key={c} style={{ background: "#faf5ec" }}>{c}</option>)}
          <option style={{ background: "#faf5ec", color: GOLD }}>🎙️ Lectures</option>
        </select>
      </div>

      <div style={{ marginBottom: 12, color: MUTED, fontSize: 13 }}>{filtered.length} results</div>

      {loading && <div style={{ textAlign: "center", padding: 32, color: MUTED, letterSpacing: "0.08em", fontSize: 13 }}>Loading library…</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, border: `1px solid ${BORDER}` }}>
        {filtered.map((b, i) => {
          const isPdf = b.url.endsWith(".pdf");
          return (
            <div key={i} style={{
              background: SURFACE, border: "none",
              borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
              padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6,
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = GREEN_L}
              onMouseLeave={e => e.currentTarget.style.background = SURFACE}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${GOLD}40`, paddingBottom: 2 }}>{b.cat}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 14, color: TEXT, lineHeight: 1.5, fontFamily: SERIF, cursor: isPdf ? "pointer" : "default" }}
                onClick={() => { if (isPdf) openPdf(b); else window.open(b.url, "_blank", "noreferrer"); }}
              >{b.title}</div>
              <div style={{ fontSize: 12, color: MUTED, letterSpacing: "0.02em" }}>{b.author}</div>
              {isPdf ? (
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <button onClick={() => openPdf(b)} style={{
                    flex: 1, padding: "5px 0", background: "transparent",
                    border: `1px solid ${GOLD}50`, borderRadius: 2,
                    color: GOLD, fontSize: 11, cursor: "pointer", fontFamily: SANS,
                    letterSpacing: "0.06em", transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${GOLD}18`; e.stopPropagation(); }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >📖 Read</button>
                  <a href={b.url} download target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{
                    flex: 1, padding: "5px 0", background: "transparent",
                    border: `1px solid ${BORDER}`, borderRadius: 2,
                    color: MUTED, fontSize: 11, cursor: "pointer", fontFamily: SANS,
                    letterSpacing: "0.06em", textDecoration: "none", textAlign: "center",
                    transition: "all 0.15s", display: "block",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = MUTED; e.currentTarget.style.color = TEXT; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
                  >↓ Download</a>
                </div>
              ) : (
                <a href={b.url} target="_blank" rel="noreferrer" style={{
                  marginTop: 4, padding: "5px 0", background: "transparent",
                  border: `1px solid ${BORDER}`, borderRadius: 2,
                  color: MUTED, fontSize: 11, fontFamily: SANS,
                  letterSpacing: "0.06em", textDecoration: "none", textAlign: "center",
                  display: "block", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
                >↗ Visit</a>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div>No results for "{search}"</div>
        </div>
      )}

      {pdfOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.97)", display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 20px", background: "#f0e6ce", borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 13, color: TEXT, fontFamily: SERIF, fontWeight: 500, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              📖 {pdfOpen.title}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={pdfOpen.url} download target="_blank" rel="noreferrer" style={{
                background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 2,
                color: MUTED, padding: "6px 14px", cursor: "pointer", fontSize: 11,
                fontFamily: SANS, letterSpacing: "0.06em", textDecoration: "none",
              }}>↓ Download</a>
              <button onClick={() => setPdfOpen(null)} style={{
                background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 2,
                color: MUTED, padding: "6px 14px", cursor: "pointer", fontSize: 11,
                fontFamily: SANS, letterSpacing: "0.06em",
              }}>✕ Close</button>
            </div>
          </div>
          {pdfError ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
              <div style={{ fontSize: 40 }}>📄</div>
              <div style={{ fontSize: 15, color: TEXT, fontFamily: SERIF, textAlign: "center" }}>Could not load this PDF in the browser.</div>
              <div style={{ fontSize: 13, color: MUTED, textAlign: "center", maxWidth: 360 }}>The file may not be publicly accessible yet. Use the Download button to open it directly.</div>
              <a href={pdfOpen.url} target="_blank" rel="noreferrer" style={{
                marginTop: 8, padding: "10px 28px", borderRadius: 2,
                background: `linear-gradient(135deg, ${GOLD}, #A8893C)`,
                color: "#f0e6ce", fontWeight: 700, fontSize: 13,
                fontFamily: SANS, letterSpacing: "0.08em", textDecoration: "none",
              }}>↓ Open / Download PDF</a>
            </div>
          ) : (
            <iframe
              src={(() => {
                const CDN = "https://cdn.muslimspath.app/";
                const key = pdfOpen.url.startsWith(CDN) ? pdfOpen.url.slice(CDN.length) : `books/${pdfOpen.url.split("/").pop()}`;
                return `${UPLOAD_WORKER_URL}/${key}`;
              })()}
              title={pdfOpen.title}
              style={{ flex: 1, border: "none", width: "100%", background: "#fff" }}
              onError={() => setPdfError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
