export const VALID_PAGES = ["home","zakat","inheritance","calendar","dates","library","audio","tasbeeh","quran","dua","asma","admin","profile","namaz","abdes","agjerim"];

const SLUGS = {
  home:"", zakat:"zekati", inheritance:"hiseja", calendar:"kalendari", dates:"datat",
  library:"biblioteka", audio:"ligjerata", tasbeeh:"tesbihe", quran:"kurani", dua:"dua",
  asma:"emrat", admin:"admin", profile:"profili", namaz:"si-te-falesh", abdes:"abdesi", agjerim:"agjerimi",
};

export function slugToPage(slug) {
  for (const [id, s] of Object.entries(SLUGS)) { if (s === slug) return id; }
  return null;
}

export function pageToUrl(pageId) {
  const slug = SLUGS[pageId] ?? pageId;
  return pageId === "home" ? "/" : `/${slug}`;
}
