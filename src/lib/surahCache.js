// Shared module-level cache so QuranPage and GlobalSearch read from the same slot
let _cache = null;

export function getSurahCache() { return _cache; }
export function setSurahCache(data) { _cache = data; }
