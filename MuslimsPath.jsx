import { useState, useEffect, useRef } from "react";

// ─── PALETTE ───────────────────────────────────────────────────────
const BG = "#F9F8F6";
const SURFACE = "#FFFFFF";
const BORDER = "#E5E7EB";
const GREEN = "#2D6A4F";
const GREEN_L = "#EAF4EE";
const GOLD = "#B45309";
const TEXT = "#111827";
const MUTED = "#6B7280";

// ─── QUOTES ────────────────────────────────────────────────────────
const QUOTES = [
  { text: "Indeed, with hardship will be ease.", src: "Quran 94:6" },
  { text: "Allah does not burden a soul beyond that it can bear.", src: "Quran 2:286" },
  { text: "The best of people are those most beneficial to people.", src: "Hadith — al-Tabarani" },
  { text: "Speak good or remain silent.", src: "Hadith — Bukhari & Muslim" },
  { text: "He who does not thank people does not thank Allah.", src: "Hadith — Abu Dawud" },
  { text: "Take advantage of five before five: youth, health, wealth, free time, and life.", src: "Hadith — Ibn Abbas" },
  { text: "Allah does not look at your appearance or wealth, but at your hearts and deeds.", src: "Hadith — Muslim" },
  { text: "The strongest among you is the one who controls his anger.", src: "Hadith — Bukhari" },
  { text: "Do not waste water even if you are on a flowing river.", src: "Hadith — Ibn Majah" },
  { text: "A Muslim is one from whose tongue and hands other Muslims are safe.", src: "Hadith — Bukhari" },
  { text: "Make things easy, do not make them difficult. Give glad tidings, do not repel.", src: "Hadith — Bukhari" },
  { text: "We have not sent you except as a mercy to the worlds.", src: "Quran 21:107" },
  { text: "So remember Me; I will remember you.", src: "Quran 2:152" },
  { text: "Indeed the most noble of you in the sight of Allah is the most righteous.", src: "Quran 49:13" },
  { text: "And He found you lost and guided you.", src: "Quran 93:7" },
  { text: "And when My servants ask you about Me — indeed I am near.", src: "Quran 2:186" },
  { text: "Verily, after difficulty there is relief.", src: "Quran 94:5" },
  { text: "Your Lord has not taken leave of you, nor has He detested you.", src: "Quran 93:3" },
  { text: "And your Lord is the Forgiving, Full of Mercy.", src: "Quran 18:58" },
  { text: "Whoever is patient, Allah will make him patient. No one is given a better gift than patience.", src: "Hadith — Bukhari" },
  { text: "The cure for ignorance is to question.", src: "Hadith — Abu Dawud" },
  { text: "Feed the hungry, visit the sick, and free the captive.", src: "Hadith — Bukhari" },
  { text: "None of you truly believes until he loves for his brother what he loves for himself.", src: "Hadith — Bukhari & Muslim" },
  { text: "Smiling at your brother is charity.", src: "Hadith — Tirmidhi" },
  { text: "The world is a prison for the believer and a paradise for the disbeliever.", src: "Hadith — Muslim" },
];

// ─── LIBRARY ──────────────────────────────────────────────────────
const LIBRARY = [
  // Quran & Translation
  { title: "Quran.com", author: "Multiple translations & audio", cat: "Quran", url: "https://quran.com" },
  { title: "The Clear Quran", author: "Dr. Mustafa Khattab", cat: "Quran", url: "https://theclearquran.org" },
  { title: "The Meaning of the Holy Quran", author: "Abdullah Yusuf Ali", cat: "Quran", url: "#" },
  { title: "The Message of the Quran", author: "Muhammad Asad", cat: "Quran", url: "#" },
  // Tafsir
  { title: "Tafsir Ibn Kathir (4 vols)", author: "Ibn Kathir", cat: "Tafsir", url: "#" },
  { title: "Tafheem ul-Quran", author: "Abul Ala Maududi", cat: "Tafsir", url: "https://www.tafheem.net" },
  { title: "In the Shade of the Quran", author: "Sayyid Qutb", cat: "Tafsir", url: "#" },
  { title: "Tafsir al-Jalalain", author: "al-Suyuti & al-Mahalli", cat: "Tafsir", url: "#" },
  { title: "Tafsir al-Sa'di", author: "Abdur Rahman al-Sa'di", cat: "Tafsir", url: "#" },
  // Hadith
  { title: "Sahih al-Bukhari", author: "Imam al-Bukhari", cat: "Hadith", url: "https://sunnah.com/bukhari" },
  { title: "Sahih Muslim", author: "Imam Muslim", cat: "Hadith", url: "https://sunnah.com/muslim" },
  { title: "Sunan Abu Dawud", author: "Abu Dawud al-Sijistani", cat: "Hadith", url: "https://sunnah.com/abudawud" },
  { title: "Jami' at-Tirmidhi", author: "Imam at-Tirmidhi", cat: "Hadith", url: "https://sunnah.com/tirmidhi" },
  { title: "Sunan Ibn Majah", author: "Ibn Majah al-Qazwini", cat: "Hadith", url: "https://sunnah.com/ibnmajah" },
  { title: "Riyad as-Salihin", author: "Imam an-Nawawi", cat: "Hadith", url: "https://sunnah.com/riyadussalihin" },
  { title: "40 Hadith of an-Nawawi", author: "Imam an-Nawawi", cat: "Hadith", url: "https://sunnah.com/nawawi40" },
  { title: "Al-Adab al-Mufrad", author: "Imam al-Bukhari", cat: "Hadith", url: "https://sunnah.com/adab" },
  { title: "Sunnah.com", author: "9 hadith collections online", cat: "Hadith", url: "https://sunnah.com" },
  // Seerah
  { title: "The Sealed Nectar", author: "Saifur Rahman al-Mubarakpuri", cat: "Seerah", url: "#" },
  { title: "In the Footsteps of the Prophet", author: "Tariq Ramadan", cat: "Seerah", url: "#" },
  { title: "Muhammad: His Life Based on the Earliest Sources", author: "Martin Lings", cat: "Seerah", url: "#" },
  { title: "When the Moon Split", author: "Safiur Rahman Mubarakpuri", cat: "Seerah", url: "#" },
  { title: "The Life of the Prophet Muhammad (4 vols)", author: "Ibn Kathir", cat: "Seerah", url: "#" },
  { title: "Muhammad: A Prophet for Our Time", author: "Karen Armstrong", cat: "Seerah", url: "#" },
  // Fiqh
  { title: "Fiqh us-Sunnah", author: "Sayyid Sabiq", cat: "Fiqh", url: "#" },
  { title: "Reliance of the Traveller (Umdat al-Salik)", author: "Ahmad ibn Naqib al-Misri", cat: "Fiqh", url: "#" },
  { title: "Mukhtasar al-Quduri", author: "Imam al-Quduri (Hanafi)", cat: "Fiqh", url: "#" },
  { title: "Minhaj al-Talibin", author: "Imam an-Nawawi (Shafi'i)", cat: "Fiqh", url: "#" },
  { title: "Bidayat al-Mujtahid", author: "Ibn Rushd (Maliki)", cat: "Fiqh", url: "#" },
  { title: "Principles of Islamic Jurisprudence", author: "Mohammad Hashim Kamali", cat: "Fiqh", url: "#" },
  // Aqeedah
  { title: "The Fundamentals of Tawheed", author: "Abu Ameenah Bilal Philips", cat: "Aqeedah", url: "#" },
  { title: "Kitab al-Tawheed", author: "Muhammad ibn Abd al-Wahhab", cat: "Aqeedah", url: "#" },
  { title: "The Creed of Imam al-Tahawi", author: "Imam al-Tahawi", cat: "Aqeedah", url: "#" },
  { title: "Explanation of the Creed", author: "Imam al-Barbahari", cat: "Aqeedah", url: "#" },
  { title: "The Divine Reality", author: "Hamza Andreas Tzortzis", cat: "Aqeedah", url: "#" },
  // Spirituality
  { title: "The Revival of the Religious Sciences (Ihya)", author: "Imam al-Ghazali", cat: "Spirituality", url: "#" },
  { title: "The Alchemy of Happiness", author: "Imam al-Ghazali", cat: "Spirituality", url: "#" },
  { title: "Remembrance of Death and the Afterlife", author: "Imam al-Ghazali", cat: "Spirituality", url: "#" },
  { title: "The Book of Assistance", author: "Imam al-Haddad", cat: "Spirituality", url: "#" },
  { title: "Don't Be Sad", author: "Aaidh al-Qarni", cat: "Spirituality", url: "#" },
  { title: "Purification of the Heart", author: "Hamza Yusuf (trans.)", cat: "Spirituality", url: "#" },
  { title: "Reclaim Your Heart", author: "Yasmin Mogahed", cat: "Spirituality", url: "#" },
  { title: "The Ideal Muslim", author: "Dr. Muhammad Ali al-Hashimi", cat: "Spirituality", url: "#" },
  { title: "Patience and Gratitude", author: "Ibn Qayyim al-Jawziyyah", cat: "Spirituality", url: "#" },
  { title: "The Key to Paradise", author: "Ibn Rajab al-Hanbali", cat: "Spirituality", url: "#" },
  { title: "Inner Dimensions of Islamic Worship", author: "Imam al-Ghazali", cat: "Spirituality", url: "#" },
  { title: "The Garden of the Gnostics", author: "Ibn Qayyim al-Jawziyyah", cat: "Spirituality", url: "#" },
  // Dua
  { title: "Fortress of the Muslim (Hisnul Muslim)", author: "Said bin Ali al-Qahtani", cat: "Dua & Dhikr", url: "https://islamicstudies.info" },
  { title: "The Accepted Whispers", author: "Ashraf Ali Thanawi", cat: "Dua & Dhikr", url: "#" },
  { title: "Book of Remembrance (al-Adhkar)", author: "Imam an-Nawawi", cat: "Dua & Dhikr", url: "#" },
  // History
  { title: "Lost Islamic History", author: "Firas Alkhateeb", cat: "History", url: "#" },
  { title: "The History of the Khalifahs", author: "Jalal ad-Din as-Suyuti", cat: "History", url: "#" },
  { title: "The Venture of Islam (3 vols)", author: "Marshall Hodgson", cat: "History", url: "#" },
  { title: "Islam: Empire of Faith", author: "Robert Gardiner", cat: "History", url: "#" },
  { title: "A History of Islamic Societies", author: "Ira Lapidus", cat: "History", url: "#" },
  // Modern Thought
  { title: "The Road to Mecca", author: "Muhammad Asad", cat: "Modern Thought", url: "#" },
  { title: "Islam: The Straight Path", author: "John L. Esposito", cat: "Modern Thought", url: "#" },
  { title: "No god but God", author: "Reza Aslan", cat: "Modern Thought", url: "#" },
  { title: "The Heart of Islam", author: "Seyyed Hossein Nasr", cat: "Modern Thought", url: "#" },
  { title: "Islam and the Future of Tolerance", author: "Sam Harris & Maajid Nawaz", cat: "Modern Thought", url: "#" },
  { title: "Being Muslim", author: "Haroon Moghul", cat: "Modern Thought", url: "#" },
  { title: "Struggling to Surrender", author: "Jeffrey Lang", cat: "Modern Thought", url: "#" },
  // Arabic Language
  { title: "Madinah Arabic Reader (6 vols)", author: "Dr. V. Abdur Rahim", cat: "Arabic", url: "#" },
  { title: "Gateway to Arabic", author: "Imran Alawiye", cat: "Arabic", url: "#" },
  { title: "Arabic Between Your Hands", author: "Abdur Rahman Ibrahim", cat: "Arabic", url: "#" },
  // Online Resources
  { title: "IslamQA", author: "Sheikh Muhammad Saalih al-Munajjid", cat: "Online", url: "https://islamqa.info" },
  { title: "SeekersGuidance", author: "Online Islamic education", cat: "Online", url: "https://seekersguidance.org" },
  { title: "Yaqeen Institute", author: "Research & publications", cat: "Online", url: "https://yaqeeninstitute.org" },
  { title: "Muslim Central", author: "Lectures & audio", cat: "Online", url: "https://muslimcentral.com" },
  { title: "1000 Duas", author: "Comprehensive dua resource", cat: "Online", url: "https://1000duas.com" },
  { title: "Duaa.app", author: "Daily supplications", cat: "Online", url: "https://duaa.app" },
];

const CATEGORIES = ["All", ...Array.from(new Set(LIBRARY.map(b => b.cat)))];

// ─── PRAYER METHODS ────────────────────────────────────────────────
const METHODS = [
  { v: 1, l: "Muslim World League" },
  { v: 2, l: "ISNA (North America)" },
  { v: 3, l: "Egyptian General Authority" },
  { v: 4, l: "Umm al-Qura, Makkah" },
  { v: 5, l: "University of Islamic Sciences, Karachi" },
];

const PRAYER_NAMES = ["Fajr","Sunrise","Dhuhr","Asr","Maghrib","Isha"];
const HIJRI_MONTHS = ["Muharram","Safar","Rabi' al-Awwal","Rabi' al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];

// ─── UTILITIES ─────────────────────────────────────────────────────

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function reduce(n, d) { if (d === 0) return [0,1]; const g = gcd(Math.abs(n), Math.abs(d)); return [Math.round(n/g), Math.round(d/g)]; }
function fracAdd(a, b) { return reduce(a[0]*b[1] + b[0]*a[1], a[1]*b[1]); }
function fracVal(f) { return f[1] === 0 ? 0 : f[0]/f[1]; }
function fmtFrac(f) { if (f[0]===0) return "0"; if (f[1]===1) return `${f[0]}`; return `${f[0]}/${f[1]}`; }

function calcQibla(lat, lng) {
  const mLat = 21.3891 * Math.PI / 180;
  const mLng = 39.8579 * Math.PI / 180;
  const uLat = lat * Math.PI / 180;
  const dLng = mLng - lng * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(mLat);
  const x = Math.cos(uLat) * Math.sin(mLat) - Math.sin(uLat) * Math.cos(mLat) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function gregorianToHijri(gYear, gMonth, gDay) {
  const JDN = Math.floor((1461*(gYear+4800+Math.floor((gMonth-14)/12)))/4)
    + Math.floor((367*(gMonth-2-12*Math.floor((gMonth-14)/12)))/12)
    - Math.floor((3*Math.floor((gYear+4900+Math.floor((gMonth-14)/12))/100))/4)
    + gDay - 32075;
  let l = JDN - 1948440 + 10632;
  const n = Math.floor((l-1)/10631);
  l = l - 10631*n + 354;
  const j = Math.floor((10985-l)/5316)*Math.floor((50*l)/17719)
    + Math.floor(l/5670)*Math.floor((43*l)/15238);
  l = l - Math.floor((30-j)/15)*Math.floor((17719*j)/50)
    - Math.floor(j/16)*Math.floor((15238*j)/43) + 29;
  const hMonth = Math.floor((24*(l-29))/709);
  const hDay = l - Math.floor((709*hMonth)/24);
  const hYear = 30*n + j - 30;
  return { year: hYear, month: hMonth+1, day: hDay };
}

function hijriToGregorian(hY, hM, hD) {
  const N = hD + Math.ceil(29.5*(hM-1)) + (hY-1)*354 + Math.floor((3+11*hY)/30) + 1948440 - 385;
  let l = N + 68569;
  const nc = Math.floor((4*l)/146097);
  l = l - Math.floor((146097*nc+3)/4);
  const i = Math.floor((4000*(l+1))/1461001);
  l = l - Math.floor((1461*i)/4) + 31;
  const j = Math.floor((80*l)/2447);
  const day = l - Math.floor((2447*j)/80);
  l = Math.floor(j/11);
  const month = j+2-12*l;
  const year = 100*(nc-49)+i+l;
  return { year, month, day };
}

// Faraid calculator
function calcFaraid(h, madhab) {
  const {
    husband=false, wives=0, sons=0, daughters=0,
    father=false, mother=false, paternalGF=false,
    maternalGM=false, paternalGM=false,
    fullBrothers=0, fullSisters=0,
    paternalHB=0, paternalHS=0, uterine=0
  } = h;

  const results = [];
  const hasDesc = sons > 0 || daughters > 0;
  const totalSiblings = fullBrothers + fullSisters + paternalHB + paternalHS + uterine;

  // Blocking
  const pGFActive = paternalGF && !father;
  // Full siblings blocked by: children, father, or grandfather (except Maliki)
  const fullSibsBlocked = hasDesc || father || (pGFActive && madhab !== "maliki");
  // Paternal half-siblings additionally blocked by full brothers
  const pHSibsBlocked = fullSibsBlocked || fullBrothers > 0;
  const uterineBlocked = hasDesc || father || pGFActive;
  const mGMActive = maternalGM && !mother;
  const pGMActive = paternalGM && !father && !pGFActive;

  // Collect fard shares
  let totalFard = [0, 1];

  function addShare(heir, count, frac, each, note) {
    totalFard = fracAdd(totalFard, frac);
    results.push({ heir, count, frac, each: each || frac, note: note || "" });
  }

  // Husband
  if (husband) addShare("Husband", 1, hasDesc ? [1,4] : [1,2]);

  // Wives
  if (wives > 0) {
    const wF = hasDesc ? [1,8] : [1,4];
    addShare("Wife" + (wives > 1 ? "s" : ""), wives, wF, reduce(wF[0], wF[1]*wives));
  }

  // Father
  if (father && hasDesc) addShare("Father", 1, [1,6]);

  // Mother
  if (mother) {
    const hasManyBros = totalSiblings >= 2;
    let mF;
    if (hasDesc || hasManyBros) {
      mF = [1,6];
    } else if ((husband || wives > 0) && father) {
      // Umariyyatain
      if (madhab === "hanafi") {
        mF = [1,3];
      } else {
        // 1/3 of remainder after spouse
        const sF = husband ? [1,2] : [1,4];
        const rem = reduce(sF[1]-sF[0], sF[1]);
        mF = reduce(rem[0], rem[1]*3);
      }
    } else {
      mF = [1,3];
    }
    const note = ((husband||wives>0) && father && !hasDesc && !hasManyBros && madhab !== "hanafi")
      ? "1/3 of remainder (ʿUmariyyatain — Mālikī/Shāfiʿī/Ḥanbalī)" : "";
    addShare("Mother", 1, mF, mF, note);
  }

  // Daughters (no sons)
  if (daughters > 0 && sons === 0) {
    if (daughters === 1) addShare("Daughter", 1, [1,2]);
    else addShare("Daughters", daughters, [2,3], reduce(2, 3*daughters));
  }

  // Paternal grandfather (fard only if children present)
  if (pGFActive && hasDesc) addShare("Paternal Grandfather", 1, [1,6]);

  // Grandmothers
  if (mGMActive) addShare("Maternal Grandmother", 1, [1,6]);
  if (pGMActive) addShare("Paternal Grandmother", 1, [1,6]);

  // Full sisters as fard (no brothers, no sons, no daughters, not blocked)
  if (!fullSibsBlocked && fullBrothers === 0 && sons === 0 && daughters === 0 && fullSisters > 0) {
    if (fullSisters === 1) addShare("Full Sister", 1, [1,2]);
    else addShare("Full Sisters", fullSisters, [2,3], reduce(2, 3*fullSisters));
  }

  // Paternal half-sisters as fard (only 1, no full sisters, no blocking)
  if (!pHSibsBlocked && fullSisters === 0 && sons === 0 && daughters === 0 && paternalHB === 0 && paternalHS > 0) {
    if (paternalHS === 1) addShare("Paternal Half-Sister", 1, [1,2]);
    else addShare("Paternal Half-Sisters", paternalHS, [2,3], reduce(2, 3*paternalHS));
  }

  // Uterine siblings
  if (!uterineBlocked && uterine > 0) {
    if (uterine === 1) addShare("Uterine Sibling", 1, [1,6]);
    else addShare("Uterine Siblings", uterine, [1,3], reduce(1, 3*uterine));
  }

  // ─── ASABAH (residuary) ───────────────────────────────
  const remFrac = reduce(totalFard[1] - totalFard[0], totalFard[1]);
  const hasRemainder = remFrac[0] > 0;

  // AWL check (total fard > 1)
  if (totalFard[0] > totalFard[1]) {
    // Proportional reduction — recalculate all shares
    const total = totalFard[0];
    const denom = totalFard[1];
    results.forEach(r => {
      r.frac = reduce(r.frac[0] * denom, total * r.frac[1]);
      r.each = reduce(r.each[0] * denom, total * r.each[1]);
      r.note = (r.note ? r.note + " · " : "") + "ʿAwl applied";
    });
    return results;
  }

  // Sons + daughters asabah
  if (sons > 0 && hasRemainder) {
    const parts = sons * 2 + daughters;
    if (daughters > 0) {
      // Remove daughters fard entry (already counted)
      const di = results.findIndex(r => r.heir.startsWith("Daughter"));
      if (di > -1) {
        totalFard = fracAdd(reduce(totalFard[0]-results[di].frac[0]*totalFard[1], totalFard[1]*results[di].frac[1]), [0,1]);
        results.splice(di, 1);
      }
      const newRem = reduce(totalFard[1]-totalFard[0], totalFard[1]);
      results.push({ heir: "Sons", count: sons, frac: reduce(newRem[0]*2*sons, newRem[1]*parts), each: reduce(newRem[0]*2, newRem[1]*parts), note: "Residuary — each son = 2× daughter" });
      results.push({ heir: "Daughters", count: daughters, frac: reduce(newRem[0]*daughters, newRem[1]*parts), each: reduce(newRem[0], newRem[1]*parts), note: "Residuary with sons" });
    } else {
      results.push({ heir: "Sons", count: sons, frac: remFrac, each: reduce(remFrac[0], remFrac[1]*sons), note: "Residuary" });
    }
    return results;
  }

  // Father asabah (no children)
  if (father && !hasDesc && hasRemainder) {
    results.push({ heir: "Father", count: 1, frac: remFrac, each: remFrac, note: "Residuary (no children)" });
    return results;
  }

  // Grandfather asabah
  if (pGFActive && !hasDesc && hasRemainder) {
    if (madhab === "maliki" && !fullSibsBlocked && (fullBrothers > 0 || fullSisters > 0)) {
      // Muqasama: GF counts as one male, brothers as males, sisters as half
      const sibParts = fullBrothers * 2 + fullSisters;
      const totalParts = sibParts + 2;
      const gfMuq = reduce(remFrac[0]*2, remFrac[1]*totalParts);
      const gfThird = reduce(remFrac[0], remFrac[1]*3);
      // GF gets the larger of muqasama or 1/3
      const useThird = fracVal(gfThird) > fracVal(gfMuq);
      const gfFrac = useThird ? gfThird : gfMuq;
      const sibRem = reduce(remFrac[0]*remFrac[1] - gfFrac[0]*remFrac[1], remFrac[1]*gfFrac[1]);
      results.push({ heir: "Paternal Grandfather", count: 1, frac: gfFrac, each: gfFrac, note: "Muqasama (Mālikī)" });
      if (fullBrothers > 0) {
        const bParts = fullBrothers*2 + fullSisters;
        results.push({ heir: "Full Brothers", count: fullBrothers, frac: reduce(sibRem[0]*fullBrothers*2, sibRem[1]*bParts), each: reduce(sibRem[0]*2, sibRem[1]*bParts), note: "Residuary (Mālikī — not blocked by grandfather)" });
        if (fullSisters > 0) results.push({ heir: "Full Sisters", count: fullSisters, frac: reduce(sibRem[0]*fullSisters, sibRem[1]*bParts), each: reduce(sibRem[0], sibRem[1]*bParts), note: "Residuary (Mālikī)" });
      } else if (fullSisters > 0) {
        results.push({ heir: "Full Sisters", count: fullSisters, frac: sibRem, each: reduce(sibRem[0], sibRem[1]*fullSisters), note: "Residuary (Mālikī)" });
      }
    } else {
      results.push({ heir: "Paternal Grandfather", count: 1, frac: remFrac, each: remFrac, note: "Residuary (acts as father)" });
    }
    return results;
  }

  // Full siblings asabah
  if (!fullSibsBlocked && (fullBrothers > 0 || fullSisters > 0) && hasRemainder) {
    // If daughters present, sisters become asabah WITH daughters
    if (daughters > 0 && fullBrothers === 0 && fullSisters > 0) {
      results.push({ heir: "Full Sisters", count: fullSisters, frac: remFrac, each: reduce(remFrac[0], remFrac[1]*fullSisters), note: "Asabah bil-Ghayr — with daughters" });
    } else if (fullBrothers > 0) {
      const parts = fullBrothers*2 + fullSisters;
      results.push({ heir: "Full Brothers", count: fullBrothers, frac: reduce(remFrac[0]*fullBrothers*2, remFrac[1]*parts), each: reduce(remFrac[0]*2, remFrac[1]*parts), note: "Residuary" });
      if (fullSisters > 0) results.push({ heir: "Full Sisters", count: fullSisters, frac: reduce(remFrac[0]*fullSisters, remFrac[1]*parts), each: reduce(remFrac[0], remFrac[1]*parts), note: "Residuary with brothers" });
    }
    return results;
  }

  // Paternal half-siblings asabah
  if (!pHSibsBlocked && (paternalHB > 0 || paternalHS > 0) && hasRemainder) {
    if (paternalHB > 0) {
      const parts = paternalHB*2 + paternalHS;
      results.push({ heir: "Paternal Half-Brothers", count: paternalHB, frac: reduce(remFrac[0]*paternalHB*2, remFrac[1]*parts), each: reduce(remFrac[0]*2, remFrac[1]*parts), note: "Residuary" });
      if (paternalHS > 0) results.push({ heir: "Paternal Half-Sisters", count: paternalHS, frac: reduce(remFrac[0]*paternalHS, remFrac[1]*parts), each: reduce(remFrac[0], remFrac[1]*parts), note: "Residuary with brothers" });
    }
    return results;
  }

  // Radd — redistribute remainder to fard heirs (excluding spouse)
  if (hasRemainder) {
    const raddHeirs = results.filter(r => r.heir !== "Husband" && !r.heir.startsWith("Wife"));
    if (raddHeirs.length > 0) {
      const raddTotal = raddHeirs.reduce((s, r) => fracAdd(s, r.frac), [0,1]);
      raddHeirs.forEach(r => {
        const newFrac = reduce(r.frac[0] * raddTotal[1], raddTotal[0] * r.frac[1]);
        r.frac = newFrac;
        r.each = r.count > 1 ? reduce(newFrac[0], newFrac[1]*r.count) : newFrac;
        r.note = (r.note ? r.note + " · " : "") + "Radd applied";
      });
    }
  }

  return results;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function PageTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT }}>{title}</h1>
      </div>
      {sub && <p style={{ margin: 0, color: MUTED, fontSize: 14 }}>{sub}</p>}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: SURFACE, outline: "none",
          transition: "border-color 0.15s",
          ...props.style
        }}
        onFocus={e => e.target.style.borderColor = GREEN}
        onBlur={e => e.target.style.borderColor = BORDER}
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{label}</label>}
      <select
        {...props}
        style={{
          padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: SURFACE, outline: "none", cursor: "pointer",
          ...props.style
        }}
      >
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, style }) {
  const bg = variant === "primary" ? GREEN : SURFACE;
  const color = variant === "primary" ? "#fff" : TEXT;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 18px", borderRadius: 8, border: variant === "primary" ? "none" : `1px solid ${BORDER}`,
        background: disabled ? "#D1D5DB" : bg, color: disabled ? "#9CA3AF" : color,
        fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.15s",
        ...style
      }}
    >
      {children}
    </button>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "prayer", label: "Prayer Times", icon: "🕌" },
  { id: "qibla", label: "Qibla", icon: "🧭" },
  { id: "zakat", label: "Zakat", icon: "💰" },
  { id: "inheritance", label: "Inheritance", icon: "⚖️" },
  { id: "dates", label: "Dates", icon: "📅" },
  { id: "library", label: "Library", icon: "📚" },
];

function Nav({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
      borderBottom: `1px solid ${BORDER}`, padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>☪️</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: GREEN }}>Muslim's Path</span>
        </button>
        {/* Desktop */}
        <div style={{ display: "flex", gap: 4 }} className="nav-desktop">
          {NAV_ITEMS.filter(n => n.id !== "home").map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              background: page === n.id ? GREEN_L : "none",
              border: "none", borderRadius: 8, cursor: "pointer",
              padding: "6px 12px", fontSize: 13, fontWeight: page === n.id ? 600 : 400,
              color: page === n.id ? GREEN : MUTED,
              transition: "all 0.15s"
            }}>{n.label}</button>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 22 }} className="nav-mobile">☰</button>
      </div>
      {menuOpen && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "12px 0", display: "flex", flexDirection: "column" }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "10px 24px", fontSize: 14, color: page === n.id ? GREEN : TEXT, fontWeight: page === n.id ? 600 : 400
            }}>{n.icon} {n.label}</button>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 700px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────
function Home({ quote, setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      {/* Quote */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>☪️</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Muslim's Path</h1>
        <p style={{ color: MUTED, marginBottom: 32, fontSize: 15 }}>Tools and resources for your daily Islamic life</p>
        <Card style={{ maxWidth: 580, margin: "0 auto", background: GREEN_L, border: `1px solid #86EFAC`, padding: "28px 32px" }}>
          <p style={{ fontSize: 18, color: TEXT, fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>"{quote.text}"</p>
          <p style={{ margin: "12px 0 0", fontSize: 13, color: GREEN, fontWeight: 600 }}>— {quote.src}</p>
        </Card>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {NAV_ITEMS.filter(n => n.id !== "home").map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12,
            padding: "20px", textAlign: "left", cursor: "pointer",
            transition: "box-shadow 0.15s, transform 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{n.icon}</div>
            <div style={{ fontWeight: 600, color: TEXT, fontSize: 15 }}>{n.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PRAYER TIMES ─────────────────────────────────────────────────
function PrayerTimes() {
  const [city, setCity] = useState("");
  const [method, setMethod] = useState(2);
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [date] = useState(new Date());

  async function search() {
    if (!city.trim()) return;
    setLoading(true); setErr(""); setTimes(null);
    try {
      const d = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${d}?city=${encodeURIComponent(city)}&country=&method=${method}`);
      const json = await res.json();
      if (json.code !== 200) throw new Error(json.data || "City not found");
      setTimes(json.data);
    } catch(e) { setErr("Could not find prayer times. Please try a different city name."); }
    setLoading(false);
  }

  const prayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();
  const nowMins = now.getHours()*60 + now.getMinutes();

  function getNextPrayer() {
    if (!times) return null;
    for (const k of ["Fajr","Dhuhr","Asr","Maghrib","Isha"]) {
      const [h,m] = times.timings[k].split(":").map(Number);
      if (h*60+m > nowMins) return k;
    }
    return "Fajr";
  }
  const nextPrayer = getNextPrayer();

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="🕌" title="Prayer Times" sub="Enter your city to get today's prayer schedule" />
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="City" placeholder="e.g. London, Cairo, Karachi" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} />
          <Select label="Calculation Method" value={method} onChange={e => setMethod(e.target.value)} options={METHODS} />
          <Btn onClick={search} disabled={loading}>{loading ? "Searching…" : "Get Prayer Times"}</Btn>
        </div>
      </Card>

      {err && <p style={{ color: "#DC2626", fontSize: 14 }}>{err}</p>}

      {times && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700, color: TEXT }}>{times.meta.timezone}</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: MUTED }}>{times.date.readable}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {prayerKeys.map(k => {
              const isNext = k === nextPrayer;
              return (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 14px", borderRadius: 8,
                  background: isNext ? GREEN_L : "transparent",
                  border: isNext ? `1px solid #86EFAC` : "1px solid transparent",
                }}>
                  <span style={{ fontWeight: isNext ? 600 : 400, color: isNext ? GREEN : TEXT, fontSize: 15 }}>{k}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600, color: isNext ? GREEN : TEXT, fontSize: 16, fontVariantNumeric: "tabular-nums" }}>{times.timings[k]}</span>
                    {isNext && <span style={{ fontSize: 11, background: GREEN, color: "#fff", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>NEXT</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── QIBLA ────────────────────────────────────────────────────────
function Qibla() {
  const [city, setCity] = useState("");
  const [bearing, setBearing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [locName, setLocName] = useState("");

  async function search() {
    if (!city.trim()) return;
    setLoading(true); setErr(""); setBearing(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
        headers: { "Accept-Language": "en" }
      });
      const json = await res.json();
      if (!json.length) throw new Error("City not found");
      const { lat, lon, display_name } = json[0];
      setBearing(calcQibla(parseFloat(lat), parseFloat(lon)));
      setLocName(display_name.split(",").slice(0,2).join(", "));
    } catch(e) { setErr("Location not found. Try a different city name."); }
    setLoading(false);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return setErr("Geolocation not supported by your browser.");
    navigator.geolocation.getCurrentPosition(
      pos => { setBearing(calcQibla(pos.coords.latitude, pos.coords.longitude)); setLocName("Your Location"); },
      () => setErr("Could not access location. Please try searching by city.")
    );
  }

  const direction = bearing !== null ? (
    bearing < 22.5 ? "N" : bearing < 67.5 ? "NE" : bearing < 112.5 ? "E" :
    bearing < 157.5 ? "SE" : bearing < 202.5 ? "S" : bearing < 247.5 ? "SW" :
    bearing < 292.5 ? "W" : bearing < 337.5 ? "NW" : "N"
  ) : "";

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="🧭" title="Qibla Direction" sub="Find the direction of the Kaaba from your location" />
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="City" placeholder="e.g. London, New York, Jakarta" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={search} disabled={loading} style={{ flex: 1 }}>{loading ? "Searching…" : "Search"}</Btn>
            <Btn onClick={useMyLocation} variant="secondary">Use My Location</Btn>
          </div>
        </div>
      </Card>

      {err && <p style={{ color: "#DC2626", fontSize: 14 }}>{err}</p>}

      {bearing !== null && (
        <Card style={{ textAlign: "center" }}>
          {locName && <p style={{ margin: "0 0 20px", color: MUTED, fontSize: 13 }}>📍 {locName}</p>}

          {/* Compass */}
          <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 24px" }}>
            {/* Outer ring */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: `2px solid ${BORDER}`, background: SURFACE,
            }}>
              {/* Cardinal directions */}
              {[{l:"N",r:0},{l:"E",r:90},{l:"S",r:180},{l:"W",r:270}].map(({l,r}) => (
                <div key={l} style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: `rotate(${r}deg) translateY(-88px) rotate(-${r}deg) translate(-50%,-50%)`,
                  fontSize: 13, fontWeight: 700, color: l==="N" ? "#DC2626" : MUTED
                }}>{l}</div>
              ))}
              {/* Needle pointing to Qibla */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 4, height: 80,
                transform: `translate(-50%, -100%) rotate(${bearing}deg)`,
                transformOrigin: "bottom center",
                background: GREEN, borderRadius: 4,
                transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }} />
              {/* Ka'aba icon at needle tip */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 20, height: 20,
                transform: `translate(-50%, -50%) rotate(${bearing}deg) translateY(-82px) rotate(-${bearing}deg)`,
                fontSize: 16, lineHeight: 1, marginLeft: -2,
                transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}>🕋</div>
              {/* Center dot */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 10, height: 10, borderRadius: "50%",
                background: GREEN, transform: "translate(-50%,-50%)"
              }} />
            </div>
          </div>

          <div style={{ fontSize: 32, fontWeight: 700, color: TEXT }}>{Math.round(bearing)}°</div>
          <div style={{ fontSize: 16, color: MUTED, marginTop: 4 }}>{direction} — Qibla Direction</div>
        </Card>
      )}
    </div>
  );
}

// ─── ZAKAT ────────────────────────────────────────────────────────
function Zakat() {
  const [currency, setCurrency] = useState("USD");
  const goldPrice = 60; // USD per gram (approximate — user can override)
  const [goldPriceInput, setGoldPriceInput] = useState("60");
  const [fields, setFields] = useState({
    cash: "", savings: "", gold: "", silver: "",
    stocks: "", business: "", receivables: "", crypto: "",
    loans: "", expenses: ""
  });
  const [result, setResult] = useState(null);

  const f = (k) => parseFloat(fields[k]) || 0;

  function calculate() {
    const gp = parseFloat(goldPriceInput) || 60;
    const nisabGold = 85 * gp; // Nisab = 85g gold
    const totalAssets = f("cash")+f("savings")+f("gold")+f("silver")+f("stocks")+f("business")+f("receivables")+f("crypto");
    const totalDeductions = f("loans")+f("expenses");
    const zakatable = Math.max(0, totalAssets - totalDeductions);
    const meetsNisab = zakatable >= nisabGold;
    const zakatDue = meetsNisab ? zakatable * 0.025 : 0;
    setResult({ totalAssets, totalDeductions, zakatable, meetsNisab, zakatDue, nisab: nisabGold });
  }

  const fieldDefs = [
    { k:"cash", l:"Cash & Bank Accounts", g:"Assets" },
    { k:"savings", l:"Savings & Deposits", g:"Assets" },
    { k:"gold", l:"Gold & Jewellery (value)", g:"Assets" },
    { k:"silver", l:"Silver (value)", g:"Assets" },
    { k:"stocks", l:"Stocks & Investments", g:"Assets" },
    { k:"business", l:"Business Inventory", g:"Assets" },
    { k:"receivables", l:"Money Owed to You", g:"Assets" },
    { k:"crypto", l:"Cryptocurrency", g:"Assets" },
    { k:"loans", l:"Loans You Owe", g:"Deductions" },
    { k:"expenses", l:"Outstanding Bills/Expenses", g:"Deductions" },
  ];

  const fmt = (n) => currency + " " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="💰" title="Zakat Calculator" sub="2.5% of net zakatable wealth above nisab, held for one lunar year" />
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}
            options={[{v:"USD",l:"USD — US Dollar"},{v:"GBP",l:"GBP — British Pound"},{v:"EUR",l:"EUR — Euro"},{v:"AED",l:"AED — Emirati Dirham"},{v:"PKR",l:"PKR — Pakistani Rupee"},{v:"BDT",l:"BDT — Bangladeshi Taka"},{v:"MYR",l:"MYR — Malaysian Ringgit"}]} />
          <Input label="Gold Price (per gram)" type="number" value={goldPriceInput} onChange={e => setGoldPriceInput(e.target.value)} />
        </div>

        {["Assets","Deductions"].map(group => (
          <div key={group} style={{ marginBottom: 20 }}>
            <h4 style={{ margin: "0 0 12px", color: TEXT, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{group}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {fieldDefs.filter(fd => fd.g === group).map(fd => (
                <Input key={fd.k} label={fd.l} type="number" placeholder="0.00"
                  value={fields[fd.k]} onChange={e => setFields(p => ({...p, [fd.k]: e.target.value}))} />
              ))}
            </div>
          </div>
        ))}

        <Btn onClick={calculate} style={{ width: "100%" }}>Calculate Zakat</Btn>
      </Card>

      {result && (
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { l: "Total Assets", v: fmt(result.totalAssets) },
              { l: "Total Deductions", v: `- ${fmt(result.totalDeductions)}` },
              { l: "Net Zakatable Wealth", v: fmt(result.zakatable), bold: true },
              { l: "Nisab Threshold (85g gold)", v: fmt(result.nisab), note: true },
            ].map(row => (
              <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 14, color: row.note ? MUTED : TEXT }}>{row.l}</span>
                <span style={{ fontSize: 14, fontWeight: row.bold ? 700 : 400, color: row.note ? MUTED : TEXT }}>{row.v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", marginTop: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Zakat Due (2.5%)</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: result.meetsNisab ? GREEN : MUTED }}>
                {result.meetsNisab ? fmt(result.zakatDue) : "Below Nisab — No Zakat Due"}
              </span>
            </div>
            {!result.meetsNisab && (
              <p style={{ margin: 0, fontSize: 13, color: MUTED }}>Your wealth is below the nisab threshold. Zakat is not obligatory at this time.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── INHERITANCE ──────────────────────────────────────────────────
const MADHABS = [
  { v: "hanafi", l: "Ḥanafī" },
  { v: "maliki", l: "Mālikī" },
  { v: "shafii", l: "Shāfiʿī" },
  { v: "hanbali", l: "Ḥanbalī" },
];

function Inheritance() {
  const [madhab, setMadhab] = useState("hanafi");
  const [estate, setEstate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [h, setH] = useState({
    husband: false, wives: 0, sons: 0, daughters: 0,
    father: false, mother: false, paternalGF: false,
    maternalGM: false, paternalGM: false,
    fullBrothers: 0, fullSisters: 0,
    paternalHB: 0, paternalHS: 0, uterine: 0
  });
  const [results, setResults] = useState(null);
  const [err, setErr] = useState("");

  function set(k, v) { setH(p => ({...p, [k]: v})); }

  function calculate() {
    if ((parseFloat(estate)||0) <= 0) { setErr("Please enter a valid estate amount."); return; }
    // Validate: can't have both husband and wives
    if (h.husband && h.wives > 0) { setErr("The deceased cannot have both a husband and wives."); return; }
    setErr("");
    const r = calcFaraid(h, madhab);
    setResults({ shares: r, estate: parseFloat(estate) });
  }

  const numInput = (label, key, max) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 14, color: TEXT }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => set(key, Math.max(0, h[key]-1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${BORDER}`, background: SURFACE, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>−</button>
        <span style={{ width: 24, textAlign: "center", fontWeight: 600 }}>{h[key]}</span>
        <button onClick={() => set(key, Math.min(max||99, h[key]+1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${BORDER}`, background: SURFACE, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>+</button>
      </div>
    </div>
  );

  const toggle = (label, key) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 14, color: TEXT }}>{label}</span>
      <button onClick={() => set(key, !h[key])} style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: h[key] ? GREEN : "#D1D5DB", position: "relative", transition: "background 0.2s"
      }}>
        <div style={{ position: "absolute", top: 2, left: h[key] ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
      </button>
    </div>
  );

  const fmt = (n) => (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="⚖️" title="Inheritance Calculator" sub="Calculate Islamic inheritance shares (Farāʾiḍ) according to your madhab" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <Select label="Madhab" value={madhab} onChange={e => setMadhab(e.target.value)} options={MADHABS} />
          <div style={{ marginTop: 8, fontSize: 12, color: MUTED }}>
            {madhab === "maliki" ? "Grandfather does not block full siblings (muqāsama)." :
             madhab === "hanafi" ? "Grandfather treated as father — blocks full siblings." :
             madhab === "shafii" ? "ʿUmariyyatain: mother gets 1/3 of remainder. Grandfather blocks siblings." :
             "Same as Shāfiʿī for most cases. Grandfather blocks siblings."}
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}
              options={[{v:"USD",l:"USD"},{v:"GBP",l:"GBP"},{v:"EUR",l:"EUR"},{v:"AED",l:"AED"},{v:"PKR",l:"PKR"}]} />
            <Input label="Estate Value" type="number" placeholder="0.00" value={estate} onChange={e => setEstate(e.target.value)} />
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 4px", color: TEXT, fontWeight: 700 }}>Heirs</h4>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: MUTED }}>Select only the heirs who survive the deceased</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: MUTED, letterSpacing: "0.05em" }}>Spouse</p>
            {toggle("Husband", "husband")}
            {numInput("Wives", "wives", 4)}
            <p style={{ margin: "12px 0 6px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: MUTED, letterSpacing: "0.05em" }}>Children</p>
            {numInput("Sons", "sons")}
            {numInput("Daughters", "daughters")}
            <p style={{ margin: "12px 0 6px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: MUTED, letterSpacing: "0.05em" }}>Parents</p>
            {toggle("Father", "father")}
            {toggle("Mother", "mother")}
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: MUTED, letterSpacing: "0.05em" }}>Grandparents</p>
            {toggle("Paternal Grandfather", "paternalGF")}
            {toggle("Maternal Grandmother", "maternalGM")}
            {toggle("Paternal Grandmother", "paternalGM")}
            <p style={{ margin: "12px 0 6px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: MUTED, letterSpacing: "0.05em" }}>Siblings</p>
            {numInput("Full Brothers", "fullBrothers")}
            {numInput("Full Sisters", "fullSisters")}
            {numInput("Paternal Half-Brothers", "paternalHB")}
            {numInput("Paternal Half-Sisters", "paternalHS")}
            {numInput("Uterine Siblings", "uterine")}
          </div>
        </div>
        {err && <p style={{ margin: "12px 0 0", color: "#DC2626", fontSize: 13 }}>{err}</p>}
        <Btn onClick={calculate} style={{ marginTop: 20, width: "100%" }}>Calculate Shares</Btn>
      </Card>

      {results && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Results</h3>
            <span style={{ fontSize: 13, color: MUTED }}>{currency} {fmt(results.estate)} estate · {MADHABS.find(m=>m.v===madhab)?.l}</span>
          </div>
          {results.shares.length === 0 ? (
            <p style={{ color: MUTED }}>No recognised heirs. Please add at least one heir.</p>
          ) : (
            <div>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "8px 0", borderBottom: `2px solid ${BORDER}`, marginBottom: 4 }}>
                {["Heir","Share","Each","Amount per person"].map(h => (
                  <span key={h} style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {results.shares.map((s, i) => {
                const totalAmt = fracVal(s.frac) * results.estate;
                const eachAmt = fracVal(s.each) * results.estate;
                return (
                  <div key={i}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{s.heir}</div>
                        {s.count > 1 && <div style={{ fontSize: 12, color: MUTED }}>× {s.count}</div>}
                      </div>
                      <span style={{ fontFamily: "monospace", color: GREEN, fontWeight: 600, fontSize: 14 }}>{fmtFrac(s.frac)}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 14 }}>{fmtFrac(s.each)}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{currency} {fmt(s.count > 1 ? totalAmt : eachAmt)}</span>
                    </div>
                    {s.note && <div style={{ fontSize: 12, color: MUTED, padding: "2px 0 8px", fontStyle: "italic" }}>{s.note}</div>}
                  </div>
                );
              })}
              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: 4 }}>
                <span style={{ fontWeight: 700 }}>Total Distributed</span>
                <span style={{ fontWeight: 700, color: GREEN }}>
                  {currency} {fmt(results.shares.reduce((s,r) => s + fracVal(r.frac)*results.estate, 0))}
                </span>
              </div>
            </div>
          )}
          <p style={{ margin: "16px 0 0", fontSize: 12, color: MUTED, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
            This calculator provides general guidance based on classical faraid principles. Please consult a qualified Islamic scholar for formal legal matters.
          </p>
        </Card>
      )}
    </div>
  );
}

// ─── DATE CONVERTER ───────────────────────────────────────────────
function DateConverter() {
  const today = new Date();
  const hijriToday = gregorianToHijri(today.getFullYear(), today.getMonth()+1, today.getDate());
  const [mode, setMode] = useState("gToH");
  const [gYear, setGYear] = useState(String(today.getFullYear()));
  const [gMonth, setGMonth] = useState(String(today.getMonth()+1));
  const [gDay, setGDay] = useState(String(today.getDate()));
  const [hYear, setHYear] = useState(String(hijriToday.year));
  const [hMonth, setHMonth] = useState(String(hijriToday.month));
  const [hDay, setHDay] = useState(String(hijriToday.day));
  const [result, setResult] = useState(null);

  function convert() {
    if (mode === "gToH") {
      const r = gregorianToHijri(parseInt(gYear), parseInt(gMonth), parseInt(gDay));
      setResult({ type: "hijri", ...r });
    } else {
      const r = hijriToGregorian(parseInt(hYear), parseInt(hMonth), parseInt(hDay));
      setResult({ type: "gregorian", ...r });
    }
  }

  useEffect(() => {
    // Show today on load
    setResult({ type: "hijri", ...hijriToday });
  }, []);

  const GREG_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="📅" title="Date Converter" sub="Convert between Hijri (Islamic) and Gregorian calendars" />

      {/* Today banner */}
      <Card style={{ background: GREEN_L, border: `1px solid #86EFAC`, marginBottom: 20, textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: MUTED }}>Today</p>
        <p style={{ margin: "4px 0 0", fontWeight: 700, color: TEXT, fontSize: 16 }}>
          {today.getDate()} {GREG_MONTHS[today.getMonth()]} {today.getFullYear()}
        </p>
        <p style={{ margin: "4px 0 0", color: GREEN, fontWeight: 600 }}>
          {hijriToday.day} {HIJRI_MONTHS[hijriToday.month-1]} {hijriToday.year} AH
        </p>
      </Card>

      <Card>
        {/* Toggle */}
        <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 4, marginBottom: 20 }}>
          {[{v:"gToH",l:"Gregorian → Hijri"},{v:"hToG",l:"Hijri → Gregorian"}].map(opt => (
            <button key={opt.v} onClick={() => setMode(opt.v)} style={{
              flex: 1, padding: "7px", borderRadius: 6, border: "none", cursor: "pointer",
              background: mode === opt.v ? SURFACE : "transparent",
              fontWeight: mode === opt.v ? 600 : 400, color: mode === opt.v ? TEXT : MUTED,
              fontSize: 13, boxShadow: mode === opt.v ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s"
            }}>{opt.l}</button>
          ))}
        </div>

        {mode === "gToH" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Input label="Day" type="number" min="1" max="31" value={gDay} onChange={e => setGDay(e.target.value)} />
            <Input label="Month" type="number" min="1" max="12" value={gMonth} onChange={e => setGMonth(e.target.value)} />
            <Input label="Year" type="number" value={gYear} onChange={e => setGYear(e.target.value)} />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Input label="Day" type="number" min="1" max="30" value={hDay} onChange={e => setHDay(e.target.value)} />
            <Input label="Month" type="number" min="1" max="12" value={hMonth} onChange={e => setHMonth(e.target.value)} />
            <Input label="Year (AH)" type="number" value={hYear} onChange={e => setHYear(e.target.value)} />
          </div>
        )}

        <Btn onClick={convert} style={{ marginTop: 16, width: "100%" }}>Convert</Btn>

        {result && (
          <div style={{ marginTop: 20, padding: 20, background: GREEN_L, borderRadius: 10, textAlign: "center" }}>
            {result.type === "hijri" ? (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: MUTED }}>Hijri Date</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: GREEN }}>
                  {result.day} {HIJRI_MONTHS[result.month-1]} {result.year} AH
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: MUTED }}>Gregorian Date</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: GREEN }}>
                  {result.day} {GREG_MONTHS[result.month-1]} {result.year}
                </p>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── LIBRARY ──────────────────────────────────────────────────────
function Library() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = LIBRARY.filter(b => {
    const matchCat = cat === "All" || b.cat === cat;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="📚" title="Islamic Library" sub={`${LIBRARY.length} curated books and resources`} />

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Input placeholder="Search by title or author…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 220px" }} />
          <select value={cat} onChange={e => setCat(e.target.value)} style={{
            padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`,
            fontSize: 14, color: TEXT, background: SURFACE, cursor: "pointer", flex: "0 0 180px"
          }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </Card>

      <div style={{ marginBottom: 12, color: MUTED, fontSize: 13 }}>{filtered.length} results</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {filtered.map((b, i) => (
          <div key={i} style={{
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10,
            padding: 18, display: "flex", flexDirection: "column", gap: 6,
            transition: "box-shadow 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: GREEN, background: GREEN_L, padding: "2px 8px", borderRadius: 20 }}>{b.cat}</span>
              {b.url !== "#" && (
                <a href={b.url} target="_blank" rel="noreferrer" style={{ color: MUTED, fontSize: 12, textDecoration: "none" }}>↗ Visit</a>
              )}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: TEXT, lineHeight: 1.4 }}>{b.title}</div>
            <div style={{ fontSize: 13, color: MUTED }}>{b.author}</div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div>No results for "{search}"</div>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: TEXT }}>
      <Nav page={page} setPage={setPage} />
      <main>
        {page === "home" && <Home quote={quote} setPage={setPage} />}
        {page === "prayer" && <PrayerTimes />}
        {page === "qibla" && <Qibla />}
        {page === "zakat" && <Zakat />}
        {page === "inheritance" && <Inheritance />}
        {page === "dates" && <DateConverter />}
        {page === "library" && <Library />}
      </main>
    </div>
  );
}