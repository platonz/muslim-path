export const HIJRI_MONTHS = ["Muharram","Safar","Rabi' al-Awwal","Rabi' al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];

// Tabular Islamic calendar: leap years in 30-yr cycle are 2,5,7,10,13,16,18,21,24,26,29
export const HIJRI_YEAR_LEN = [354,355,354,354,355,354,355,354,354,355,354,354,355,354,354,355,354,355,354,354,355,354,354,355,354,355,354,354,355,354];
export const HIJRI_EPOCH_JD = 1948439; // JD of 1 Muharram 1 AH

export function gregorianToHijri(gYear, gMonth, gDay) {
  let y = gYear, m = gMonth;
  if (m < 3) { y--; m += 12; }
  const A = Math.floor(y/100);
  const jd = Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + gDay + (2 - A + Math.floor(A/4)) - 1524;
  let rem = jd - HIJRI_EPOCH_JD;
  if (rem < 0) return { year: 1, month: 1, day: 1 };
  const cycle = Math.floor(rem / 10631);
  let dayInCycle = rem - cycle * 10631;
  let hYear = cycle * 30 + 1;
  for (let i = 0; i < 30; i++) {
    if (dayInCycle < HIJRI_YEAR_LEN[i]) break;
    dayInCycle -= HIJRI_YEAR_LEN[i];
    hYear++;
  }
  const isLeap = HIJRI_YEAR_LEN[(hYear - 1) % 30] === 355;
  const ml = [30,29,30,29,30,29,30,29,30,29,30, isLeap ? 30 : 29];
  let hMonth = 1;
  for (let i = 0; i < 12; i++) {
    if (dayInCycle < ml[i]) break;
    dayInCycle -= ml[i];
    hMonth++;
  }
  return { year: hYear, month: hMonth, day: dayInCycle + 1 };
}

export function hijriToGregorian(hYear, hMonth, hDay) {
  let days = 0;
  for (let y = 1; y < hYear; y++) days += HIJRI_YEAR_LEN[(y - 1) % 30];
  const isLeap = HIJRI_YEAR_LEN[(hYear - 1) % 30] === 355;
  const ml = [30,29,30,29,30,29,30,29,30,29,30, isLeap ? 30 : 29];
  for (let m = 1; m < hMonth; m++) days += ml[m - 1];
  days += hDay - 1;
  const jd = days + HIJRI_EPOCH_JD;
  const A2 = Math.floor((jd - 1867216.25) / 36524.25);
  const A = jd + 1 + A2 - Math.floor(A2 / 4);
  const B = A + 1524, C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C), E = Math.floor((B - D) / 30.6001);
  const gDay = B - D - Math.floor(30.6001 * E);
  const gMonth = E < 14 ? E - 1 : E - 13;
  const gYear = gMonth > 2 ? C - 4716 : C - 4715;
  return { year: gYear, month: gMonth, day: gDay };
}
