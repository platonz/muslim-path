export const VALID_PAGES = ["home","zakat","inheritance","calendar","dates","library","audio","tasbeeh","quran","dua","asma","admin","profile","namaz"];

export const PAGE_SLUGS = {
  en: { home:"", zakat:"zakat", inheritance:"inheritance", calendar:"calendar", dates:"dates", library:"library", audio:"audio", tasbeeh:"tasbeeh", quran:"quran", dua:"dua", asma:"asma", admin:"admin", profile:"profile", namaz:"how-to-pray" },
  sq: { home:"", zakat:"zekati", inheritance:"hiseja", calendar:"kalendari", dates:"datat", library:"biblioteka", audio:"ligjerata", tasbeeh:"tesbihe", quran:"kurani", dua:"dua", asma:"emrat", admin:"admin", profile:"profili", namaz:"si-te-falesh" },
};

export function slugToPage(lang, slug) {
  const map = PAGE_SLUGS[lang] || PAGE_SLUGS.en;
  for (const [id, s] of Object.entries(map)) { if (s === slug) return id; }
  for (const [id, s] of Object.entries(PAGE_SLUGS.en)) { if (s === slug) return id; }
  return null;
}

export function pageToUrl(pageId, lang) {
  const slug = (PAGE_SLUGS[lang] || PAGE_SLUGS.en)[pageId] ?? pageId;
  return pageId === "home" ? `/${lang}/` : `/${lang}/${slug}`;
}
