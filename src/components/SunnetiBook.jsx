// Sunneti Reading Room — cover landing + flip-book reader (desktop) / single-page pager (mobile)
// Ported from the "Sunneti Reading Room" design (claude.ai design project "sunneti").
import React from "react";
import "../styles/sunneti.css";
import { SUNNETI_BOOK } from "../data/sunneti";

/* ── Cover (closed book landing) ── */
function Cover({ onOpen, onExit }) {
  const [opening, setOpening] = React.useState(false);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    function fit() {
      const availH = window.innerHeight - 150;
      const availW = window.innerWidth - 48;
      setScale(Math.min(availW / 470, availH / 640, 1.08));
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  function open() {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 720);
  }

  return (
    <div className="cover-stage">
      <div className="cover-vignette" aria-hidden="true" />

      <button className="cover-brand" onClick={onExit} aria-label="Kthehu te Sunneti.com">
        <img className="cover-brand-logo" src="/logo.png" alt="" />
        <span className="cover-brand-word">Sunneti.com</span>
      </button>

      <div className="cover-scaler" style={{ transform: `scale(${scale})` }}>
        <div className="cover-shadow" aria-hidden="true" />
        <button
          className={'cover-book' + (opening ? ' is-opening' : '')}
          onClick={open}
          aria-label="Open the book"
        >
          <span className="cover-spine" aria-hidden="true" />
          <span className="cover-edge" aria-hidden="true" />
          <span className="cover-face">
            <span className="cover-rule cover-rule--outer" aria-hidden="true" />
            <span className="cover-rule cover-rule--inner" aria-hidden="true" />

            <span className="cover-top">
              <span className="cover-kicker">Sunneti.com</span>
            </span>

            <span className="cover-center">
              <span className="cover-emblem" aria-hidden="true">
                <img src="/logo.png" alt="" />
              </span>
              <span className="cover-title">Sunneti</span>
              <span className="cover-arabic">{'\u0627\u0644\u0633\u0651\u064f\u0646\u0651\u064e\u0629'}</span>
              <span className="cover-orn" aria-hidden="true">
                <span className="orn-rule" /><span className="orn-diamond">&#10070;</span><span className="orn-rule" />
              </span>
              <span className="cover-sub">Shoqërues leximi për kërkuesin</span>
            </span>

            <span className="cover-bottom">
              <span className="cover-open-hint">
                Hap librin
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </span>
            </span>
          </span>
          {/* inside page revealed as the cover swings open */}
          <span className="cover-inside" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}


/* ── Open-book flip reader ── */
const LEAF_W = 470;   // one page width (design px)
const LEAF_H = 640;   // page height
const BOOK_TITLE = 'Sunneti';

// ───────────────────────── page face renderers ─────────────────────────

function Ornament({ small }) {
  return (
    <div className={'ornament' + (small ? ' ornament--sm' : '')} aria-hidden="true">
      <span className="orn-rule" />
      <span className="orn-diamond">&#10070;</span>
      <span className="orn-rule" />
    </div>
  );
}

function Folio({ side, n, title }) {
  return (
    <div className={'folio folio--' + side}>
      <span className="folio-title">{title}</span>
      <span className="folio-num">{n}</span>
    </div>
  );
}

function ContentsPage({ toc, onGoto }) {
  return (
    <div className="pg pg--contents">
      <div className="contents-head">
        <div className="t-label contents-kicker">Sunneti.com</div>
        <h2 className="contents-title">Përmbajtja</h2>
        <div className="contents-arabic">{'\u0627\u0644\u0633\u0651\u064f\u0646\u0651\u064e\u0629'}</div>
        <Ornament small />
      </div>
      <ul className="toc">
        {toc.map((e) => (
          <li key={e.id} className="toc-row">
            <button className="toc-link" onClick={() => onGoto(e.page)}>
              <span className="toc-n">{e.n}</span>
              <span className="toc-text">
                <span className="toc-title">{e.title}</span>
                {e.sub && <span className="toc-sub">{e.sub}</span>}
              </span>
              <span className="toc-dots" aria-hidden="true" />
              <span className="toc-folio">{e.page + 1}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageBody({ page, side, folio, toc, onGoto }) {
  if (!page || page.type === 'blank') {
    return <div className="pg-endpaper" aria-hidden="true"><div className="endpaper-mark" /></div>;
  }
  const T = page.type;
  const head = page._section || BOOK_TITLE;

  if (T === 'contents') {
    return <ContentsPage toc={toc} onGoto={onGoto} />;
  }

  if (T === 'chapter') {
    return (
      <div className="pg pg--center pg--chapter">
        <div className="chapter-num t-label">{page.num}</div>
        <div className="chapter-rule" />
        <h2 className="chapter-title">{page.title}</h2>
        {page.subtitle && <div className="chapter-sub">{page.subtitle}</div>}
        <div className="chapter-arabic">{page.arabic}</div>
        {page.meta && <div className="chapter-meta">{page.meta}</div>}
      </div>
    );
  }

  if (T === 'verse') {
    return (
      <div className="pg pg--verse">
        <div className="running-head">{head}</div>
        {page.continued && <div className="verse-continued">{page.surah} &middot; vazhdim</div>}
        {page.basmala && (
          <div className="basmala">{'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650'}</div>
        )}
        <div className="verse-list">
          {page.verses.map((v) => (
            <div className="verse" key={v.n}>
              <div className="verse-ar">
                <span className="verse-text-ar">{v.ar}</span>
                <span className="ayah-mark">{v.n}</span>
              </div>
              <div className="verse-en">{v.en}</div>
            </div>
          ))}
        </div>
        <Folio side={side} n={folio} title={head} />
      </div>
    );
  }

  if (T === 'hadith') {
    return (
      <div className="pg pg--center pg--hadith">
        <div className="hadith-number t-label">{page.number}</div>
        <div className="hadith-arabic">{page.arabic}</div>
        <div className="hadith-text">{page.text}</div>
        <Ornament small />
        <div className="hadith-narrator">{page.narrator}</div>
        <Folio side={side} n={folio} title={head} />
      </div>
    );
  }

  if (T === 'colophon') {
    return (
      <div className="pg pg--center pg--colophon">
        <Ornament small />
        <p className="colophon-text">{page.text}</p>
        <div className="colophon-mark">{'\uFDFD'}</div>
      </div>
    );
  }

  if (T === 'list') {
    return (
      <div className="pg pg--list">
        <div className="running-head">{head}</div>
        {page.kicker && <div className="list-kicker t-label">{page.kicker}</div>}
        {page.heading && <h3 className="prose-heading">{page.heading}</h3>}
        <ul className="list-items">
          {page.items.map((it, i) => (
            <li className="list-row" key={i}>
              <span className="list-idx">{it.idx != null ? it.idx : i + 1}</span>
              <span className="list-main">
                <span className="list-label">{it.label}</span>
                {it.sub && <span className="list-sub">{it.sub}</span>}
              </span>
              {it.ar && <span className="list-ar">{it.ar}</span>}
            </li>
          ))}
        </ul>
        <Folio side={side} n={folio} title={head} />
      </div>
    );
  }

  // prose
  return (
    <div className="pg pg--prose">
      <div className="running-head">{head}</div>
      {page.heading && <h3 className="prose-heading">{page.heading}</h3>}
      {page.paragraphs.map((p, i) => (
        <p key={i} className={i === 0 && page.dropcap ? 'prose-p has-dropcap' : 'prose-p'}>
          {i === 0 && page.dropcap ? (
            <>
              <span className="dropcap">{p.charAt(0)}</span>
              {p.slice(1)}
            </>
          ) : p}
        </p>
      ))}
      {page.pullquote && <blockquote className="pullquote">{page.pullquote}</blockquote>}
      <Folio side={side} n={folio} title={head} />
    </div>
  );
}

function Face({ page, kind, folio, toc, onGoto }) {
  const side = kind === 'front' ? 'right' : 'left';
  const gutterSide = kind === 'front' ? 'left' : 'right';
  return (
    <div className={'leaf-face leaf-face--' + kind}>
      <div className="paper">
        <div className={'gutter gutter--' + gutterSide} aria-hidden="true" />
        <div className={'page-edge-fore page-edge-fore--' + side} aria-hidden="true" />
        <PageBody page={page} side={side} folio={folio} toc={toc} onGoto={onGoto} />
      </div>
    </div>
  );
}

// ───────────────────────── the flip book ─────────────────────────

function SunnetiBook({ pages, toc, onClose, focusBlank = true, flipAnim = true }) {
  const leafCount = Math.ceil(pages.length / 2);
  const [flipped, setFlipped] = React.useState(0);
  const [anim, setAnim] = React.useState(null);
  const [jumping, setJumping] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const timer = React.useRef(null);
  const maxFlipped = leafCount;

  React.useEffect(() => {
    function fit() {
      const pad = window.innerWidth < 720 ? 18 : 80;
      const availW = window.innerWidth - pad * 2;
      const availH = window.innerHeight - 150;
      const bookW = LEAF_W * 2 + 28;
      const bookH = LEAF_H + 28;
      setScale(Math.min(availW / bookW, availH / bookH, 1.05));
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  function go(dir) {
    if (anim !== null || jumping) return;
    if (dir === 1 && flipped < maxFlipped) {
      setAnim(flipped); setFlipped(flipped + 1); schedule();
    } else if (dir === -1 && flipped > 0) {
      setAnim(flipped - 1); setFlipped(flipped - 1); schedule();
    }
  }
  function schedule() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAnim(null), 950);
  }

  function goTo(targetPage) {
    const leaf = Math.max(0, Math.min(maxFlipped, Math.floor(targetPage / 2)));
    if (leaf === flipped) return;
    setJumping(true);
    setTimeout(() => {
      setFlipped(leaf);
      setTimeout(() => setJumping(false), 40);
    }, 200);
  }

  React.useEffect(() => {
    function key(e) {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  // which chapter are we in?  right page index = 2*flipped
  const rightIdx = 2 * flipped;
  let current = toc[0];
  for (const e of toc) { if (e.page <= rightIdx) current = e; }
  const atContents = flipped === 0;
  const progress = Math.round((flipped / maxFlipped) * 100);

  // ── focus mode: when a spread has one blank/endpaper face, show only the
  //    page that actually has content, centered (e.g. the Përmbajtja page).
  const atRest = anim === null && !jumping;
  const isEmpty = (p) => !p || p.type === 'blank';
  const vLeft = flipped > 0 ? pages[2 * flipped - 1] : undefined;       // back of leaf flipped-1
  const vRight = flipped < leafCount ? pages[2 * flipped] : undefined;  // front of leaf flipped
  const leftEmpty = isEmpty(vLeft);
  const rightEmpty = isEmpty(vRight);
  const single = focusBlank && atRest && (leftEmpty !== rightEmpty);
  const singlePage = single ? (rightEmpty ? vLeft : vRight) : null;
  const singleSide = rightEmpty ? 'left' : 'right';
  const singleFolio = rightEmpty ? 2 * flipped : 2 * flipped + 1;
  const pageNo = single ? singleFolio : Math.min(pages.length, 2 * flipped + 1);

  return (
    <div className="reader">
      <button className="reader-back" onClick={onClose}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
        Mbyll librin
      </button>

      <div className="reader-meta">
        <div className="reader-title">{BOOK_TITLE}</div>
        <div className="reader-author">{atContents ? 'Përmbajtja' : current.title}</div>
      </div>

      <button className={'reader-contents' + (atContents ? ' is-active' : '')} onClick={() => goTo(0)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
        Përmbajtja
      </button>

      <div className="book-stage">
        {single ? (
          <div className="book-case book-case--single" style={{ transform: `scale(${scale})` }}>
            <div className="single-leaf">
              <div className="paper">
                <div className={'page-edge-fore page-edge-fore--' + singleSide} aria-hidden="true" />
                <PageBody page={singlePage} side={singleSide} folio={singleFolio} toc={toc} onGoto={goTo} />
              </div>
            </div>
          </div>
        ) : (
        <div className="book-case" style={{ transform: `scale(${scale})` }}>
          <div className="book-spine-shadow" aria-hidden="true" />
          <div className={'pages-area' + (jumping ? ' is-jumping' : '') + (flipAnim ? '' : ' no-flip')}>
            <div className="base base--left"><div className="paper paper--endpaper"><div className="gutter gutter--left" /></div></div>
            <div className="base base--right"><div className="paper paper--endpaper"><div className="gutter gutter--right" /></div></div>

            {Array.from({ length: leafCount }).map((_, L) => {
              const isFlipped = L < flipped;
              let z = isFlipped ? L : leafCount - L;
              if (anim === L) z = 1000;
              return (
                <div
                  key={L}
                  className={'leaf' + (isFlipped ? ' is-flipped' : '') + (anim === L ? ' is-anim' : '')}
                  style={{ zIndex: z }}
                >
                  <Face page={pages[2 * L]} kind="front" folio={2 * L + 1} toc={toc} onGoto={goTo} />
                  <Face page={pages[2 * L + 1]} kind="back" folio={2 * L + 2} toc={toc} onGoto={goTo} />
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>

      <button className="page-nav page-nav--prev" onClick={() => go(-1)} disabled={flipped === 0} aria-label="Previous page">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button className="page-nav page-nav--next" onClick={() => go(1)} disabled={flipped === maxFlipped} aria-label="Next page">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      <div className="reader-foot">
        <div className="prog-track"><div className="prog-fill" style={{ width: progress + '%' }} /></div>
        <div className="prog-meta">
          <span className="prog-label">{atContents ? 'Përmbajtja' : flipped >= maxFlipped ? 'Fundi' : current.title}</span>
          <span className="prog-dot" aria-hidden="true">&middot;</span>
          <span className="prog-count">Faqja {pageNo} / {pages.length}</span>
        </div>
      </div>
    </div>
  );
}


/* ── Mobile single-page pager ──
   On narrow screens the two-page spread is unreadable, so we present one page
   at a time (blanks skipped), scaled to fit the device width, with swipe + nav. */
function MobilePager({ pages, toc, onClose }) {
  // ordered list of real pages (skip the blank endpapers)
  const seq = React.useMemo(() => {
    const out = [];
    pages.forEach((p, i) => { if (!p || p.type !== 'blank') out.push({ p, i }); });
    return out;
  }, [pages]);
  const total = seq.length;

  const [idx, setIdx] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [scale, setScale] = React.useState(1);
  const cur = seq[Math.min(idx, total - 1)];

  // fit a 470×640 page to the device
  React.useEffect(() => {
    function fit() {
      const availW = Math.min(window.innerWidth - 28, 460);
      const availH = window.innerHeight - 150;
      setScale(Math.min(availW / 470, availH / 640));
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  function go(d) {
    setIdx((c) => {
      const next = Math.min(total - 1, Math.max(0, c + d));
      if (next !== c) setDir(d);
      return next;
    });
  }
  function goToPage(targetPageIndex) {
    let j = seq.findIndex((s) => s.i >= targetPageIndex);
    if (j < 0) j = 0;
    setDir(j >= idx ? 1 : -1);
    setIdx(j);
  }

  React.useEffect(() => {
    function key(e) {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  const touch = React.useRef(null);
  function ts(e) { touch.current = e.touches[0].clientX; }
  function te(e) {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    touch.current = null;
  }

  let current = toc[0];
  for (const e of toc) { if (e.page <= cur.i) current = e; }
  const isContents = cur.p.type === 'contents';
  const folio = cur.i + 1;
  const progress = total > 1 ? (idx / (total - 1)) * 100 : 0;

  return (
    <div className="mreader">
      <header className="mreader-bar">
        <button className="mbtn" onClick={onClose} aria-label="Mbyll librin">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div className="mreader-title">
          <div className="mreader-book">Sunneti</div>
          <div className="mreader-ch">{isContents ? 'Përmbajtja' : current.title}</div>
        </div>
        <button className={'mbtn' + (isContents ? ' is-active' : '')} onClick={() => goToPage(0)} aria-label="Përmbajtja">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
        </button>
      </header>

      <div className="mreader-stage" onTouchStart={ts} onTouchEnd={te}>
        <div className="mpage-scaler" style={{ width: 470 * scale, height: 640 * scale }}>
          <div className="mpage" key={idx} data-dir={dir} style={{ transform: `scale(${scale})` }}>
            <div className="paper">
              <div className="page-edge-fore page-edge-fore--right" aria-hidden="true" />
              <PageBody page={cur.p} side="right" folio={folio} toc={toc} onGoto={goToPage} />
            </div>
          </div>
        </div>
      </div>

      <footer className="mreader-foot">
        <button className="mnav" onClick={() => go(-1)} disabled={idx === 0} aria-label="Faqja e mëparshme">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div className="mprog">
          <div className="mprog-track"><div className="mprog-fill" style={{ width: progress + '%' }} /></div>
          <div className="mprog-label">{idx + 1} / {total}</div>
        </div>
        <button className="mnav" onClick={() => go(1)} disabled={idx === total - 1} aria-label="Faqja tjetër">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </footer>
    </div>
  );
}


function useNarrow(bp) {
  const [n, setN] = React.useState(() => window.innerWidth < bp);
  React.useEffect(() => {
    const f = () => setN(window.innerWidth < bp);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [bp]);
  return n;
}

export default function SunnetiReadingRoom({ onExit }) {
  const { pages, toc } = SUNNETI_BOOK;
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const narrow = useNarrow(800);

  function close() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 360);
  }

  return (
    <div className="sunneti-room">
      {!open && <Cover onOpen={() => setOpen(true)} onExit={onExit} />}
      {open && (
        <div className={'reader-overlay' + (closing ? ' is-closing' : '')}>
          {narrow ? (
            <MobilePager pages={pages} toc={toc} onClose={close} />
          ) : (
            <SunnetiBook pages={pages} toc={toc} onClose={close} />
          )}
        </div>
      )}
    </div>
  );
}
