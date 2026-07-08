/**
 * Shared inline-SVG icon system — no external dependency.
 * All icons are 24×24 Lucide-style stroked paths.
 * Usage: <Icon name="prayer" size={20} color="#a07d3a" />
 */
export default function Icon({ name, size = 20, color = "currentColor", sw = 1.6 }) {
  const p = {
    width: size, height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { display: "block", flexShrink: 0 },
  };
  switch (name) {
    /* ── Navigation & pages ── */
    case "home":
      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "quran":
      return <svg {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
    case "calendar":
      return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "dua":
      return <svg {...p}><path d="M18 11V6a3 3 0 00-6 0v5"/><path d="M6 11V6a3 3 0 016 0"/><path d="M6 11h12v8a3 3 0 01-3 3H9a3 3 0 01-3-3v-8z"/></svg>;
    case "abdes":
      return <svg {...p}><path d="M12 3.2c3.1 3.9 5.2 6.6 5.2 9.3a5.2 5.2 0 0 1-10.4 0c0-2.7 2.1-5.4 5.2-9.3Z"/><path d="M9.6 13.4a2.4 2.4 0 0 0 2.4 2.4"/></svg>;
    case "mihrab":
      return <svg {...p}><path d="M5 21V10.5a7 7 0 0 1 14 0V21"/><path d="M3.4 21h17.2"/><path d="M12 8.6V6.4"/><circle cx="12" cy="10.4" r="1.3"/></svg>;
    case "agjerim":
      return <svg {...p}><path d="M18.6 15.4A7 7 0 1 1 12.8 4.1a5.5 5.5 0 0 0 5.8 11.3Z"/><path d="M18.8 3.8l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7Z"/></svg>;
    case "duaHands":
      return <svg {...p}><path d="M5 13c0 4 3 6.6 7 6.6s7-2.6 7-6.6"/><path d="M8.6 13.4V7.6a1.35 1.35 0 0 1 2.7 0V12.6"/><path d="M12.7 12.6V7.6a1.35 1.35 0 0 1 2.7 0V13.4"/><path d="M12 4.6l.35.95.95.35-.95.35L12 7.2l-.35-.95L10.7 5.9l.95-.35Z"/></svg>;
    case "library":
      return <svg {...p}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>;
    case "audio":
      return <svg {...p}><path d="M12 2a3 3 0 013 3v7a3 3 0 01-6 0V5a3 3 0 013-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
    case "tasbeeh":
      return <svg {...p}><path d="M12 4c-3.6 0-6.4 3-6.4 6.7S8.4 17.4 12 17.4s6.4-3 6.4-6.7S15.6 4 12 4Z"/><circle cx="12" cy="4" r="1.5" fill={color} stroke="none"/><circle cx="5.6" cy="10.7" r="1.5" fill={color} stroke="none"/><circle cx="18.4" cy="10.7" r="1.5" fill={color} stroke="none"/><circle cx="12" cy="17.4" r="1.5" fill={color} stroke="none"/><path d="M12 19v1.1"/><circle cx="12" cy="21.4" r="1.6" fill={color} stroke="none"/></svg>;
    case "asma":
      return <svg {...p}><rect x="6.4" y="6.4" width="11.2" height="11.2" rx="1.4"/><rect x="6.4" y="6.4" width="11.2" height="11.2" rx="1.4" transform="rotate(45 12 12)"/></svg>;

    /* ── Tools ── */
    case "zakat":
      return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 000 4h4a2 2 0 010 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>;
    case "inherit":
      return <svg {...p}><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 22l4-6 4 6"/></svg>;
    case "dates":
      return <svg {...p}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;

    /* ── UI chrome ── */
    case "more":
      return <svg {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
    case "search":
      return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "settings":
      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case "user":
    case "profile":
      return <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "loc":
      return <svg {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "chevron":
      return <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>;
    case "chevronDown":
      return <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>;
    case "chevronLeft":
      return <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>;
    case "close":
      return <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "menu":
      return <svg {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case "bookmark":
      return <svg {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>;
    case "copy":
      return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
    case "heart":
      return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case "heartFill":
      return <svg {...p} fill={color}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case "play":
      return <svg {...p} fill={color}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case "pause":
      return <svg {...p}><line x1="6" y1="4" x2="6" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/></svg>;
    case "skipForward":
      return <svg {...p}><polygon points="5 4 15 12 5 20 5 4" fill={color}/><line x1="19" y1="5" x2="19" y2="19"/></svg>;
    case "skipBack":
      return <svg {...p}><polygon points="19 20 9 12 19 4 19 20" fill={color}/><line x1="5" y1="19" x2="5" y2="5"/></svg>;
    case "volume":
      return <svg {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>;
    case "bell":
      return <svg {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
    case "download":
      return <svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case "admin":
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "globe":
      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
    case "check":
      return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    case "star":
      return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    default:
      return null;
  }
}
