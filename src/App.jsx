import { useState, useEffect, useRef } from "react";

// ─── PALETTE — Luxury Dark ─────────────────────────────────────────
const BG      = "#0A0A0A";          // near-black canvas
const SURFACE = "#141414";          // dark charcoal surface
const BORDER  = "#242424";          // barely-there border
const GREEN   = "#C9A84C";          // warm gold — primary accent
const GREEN_L = "#1A1710";          // dark gold-tinted surface
const GOLD    = "#C9A84C";          // alias
const TEXT    = "#EDE8DC";          // warm off-white
const MUTED   = "#6B6358";          // warm muted tone
const SERIF   = "'Cormorant Garamond', Georgia, serif";
const SANS    = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// ─── QUOTES ────────────────────────────────────────────────────────
const QUOTES = [
  { text: "Indeed, with hardship will be ease.", src: "Quran 94:6" },
  { text: "Allah does not burden a soul beyond that it can bear.", src: "Quran 2:286" },
  { text: "The best of people are those most beneficial to people.", src: "al-Tabarani", ref: "al-Mu'jam al-Awsat 5787" },
  { text: "Speak good or remain silent.", src: "Bukhari & Muslim", ref: "Bukhari 6018 · Muslim 47" },
  { text: "He who does not thank people does not thank Allah.", src: "Abu Dawud", ref: "Abu Dawud 4811" },
  { text: "Take advantage of five before five: youth, health, wealth, free time, and life.", src: "Ibn Abbas (Shu'ab al-Iman)", ref: "Shu'ab al-Iman 9575" },
  { text: "Allah does not look at your appearance or wealth, but at your hearts and deeds.", src: "Muslim", ref: "Muslim 2564" },
  { text: "The strongest among you is the one who controls his anger.", src: "Bukhari", ref: "Bukhari 6114" },
  { text: "Do not waste water even if you are on a flowing river.", src: "Ibn Majah", ref: "Ibn Majah 425" },
  { text: "A Muslim is one from whose tongue and hands other Muslims are safe.", src: "Bukhari", ref: "Bukhari 10" },
  { text: "Make things easy, do not make them difficult. Give glad tidings, do not repel.", src: "Bukhari", ref: "Bukhari 69" },
  { text: "We have not sent you except as a mercy to the worlds.", src: "Quran 21:107" },
  { text: "So remember Me; I will remember you.", src: "Quran 2:152" },
  { text: "Indeed the most noble of you in the sight of Allah is the most righteous.", src: "Quran 49:13" },
  { text: "And He found you lost and guided you.", src: "Quran 93:7" },
  { text: "And when My servants ask you about Me — indeed I am near.", src: "Quran 2:186" },
  { text: "Verily, after difficulty there is relief.", src: "Quran 94:5" },
  { text: "Your Lord has not taken leave of you, nor has He detested you.", src: "Quran 93:3" },
  { text: "And your Lord is the Forgiving, Full of Mercy.", src: "Quran 18:58" },
  { text: "Whoever is patient, Allah will make him patient. No one is given a better gift than patience.", src: "Bukhari", ref: "Bukhari 1469" },
  { text: "The cure for ignorance is to question.", src: "Abu Dawud", ref: "Abu Dawud 336" },
  { text: "Feed the hungry, visit the sick, and free the captive.", src: "Bukhari", ref: "Bukhari 5373" },
  { text: "None of you truly believes until he loves for his brother what he loves for himself.", src: "Bukhari & Muslim", ref: "Bukhari 13 · Muslim 45" },
  { text: "Smiling at your brother is charity.", src: "Tirmidhi", ref: "Tirmidhi 1956" },
  { text: "The world is a prison for the believer and a paradise for the disbeliever.", src: "Muslim", ref: "Muslim 2956" },
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

  // ── Albanian / Shqip ─────────────────────────────────────────────
  { title: "10 Sfidat e Jetës", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/10-sfidat-e-jetes.pdf" },
  { title: "99 Emrat e Allahut", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/99Names-2019.pdf" },
  { title: "Kush është Profeti Muhamed ﷺ", author: "AIITC", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/AIITC-Ky-është-profeti-Muhamed-a.s..pdf" },
  { title: "Madhërimi i Allahut", author: "Abdulaziz et-Tarifi", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulaziz-et-Tarifi-Madhërimi-i-Allahut.pdf" },
  { title: "Gjykimi ndaj Magjisë dhe Fallit", author: "Abdulaziz ibn Baz", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulaziz-ibn-Baz-Gjykimi-ndaj-magjisë-dhe-fallit.pdf" },
  { title: "Mbi Rrugën e të Parëve Tanë — Selefitë", author: "Abdulkadër Arnauti", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulkadër-Arnauti-Mbi-rrugën-e-të-parëve-tanë-selefit.pdf" },
  { title: "Sahih el-Bukhari — Vëllimi 1", author: "Mehdi Polisi", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Mehdi-Polisi-Sahih-el-Bukhari-Vëllimi-01.pdf" },
  { title: "Sahih el-Bukhari — Vëllimi 2", author: "Abdullah Hamiti", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdullah-Hamiti-Sahih-el-Bukhari-Vëllimi-02.pdf" },
  { title: "Këshilla të Arta për Morale të Larta", author: "Abdulmelik Ramadani", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulmelik-Ramadani-Këshilla-të-arta-për-morale-të-lartaMe-balline.pdf" },
  { title: "Rregulla rreth Tekfirit", author: "Abdulmunim Mustafa Halime", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulmunim-Mustafa-Halime-Rregulla-rreth-tekfirit.pdf" },
  { title: "Realiteti i Besimit të Vërtetë", author: "Abdurrahman es-Sadij", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdurrahman-es-Sadij-Realiteti-i-Besimit-të-Vërtetë.pdf" },
  { title: "Hallalli dhe Harami në Islam", author: "Dr. Jusuf Kardavi", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Dr.-Jusuf-Kardavi-Hallalli-dhe-harami-me-balline.pdf" },
  { title: "Kandili i Ramazanit", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/KANDILI-I-RAMAZANIT.pdf" },
  { title: "Kurani dhe Shkenca", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Kurani-drejt-shkences-me-kopertine.pdf" },
  { title: "Libri i Agjërimit", author: "Salih ibn Feuzan el-Feuzan", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Libri-i-Agjerimit-Salih-ibn-Feuzan-el-Feuzan-1.pdf" },
  { title: "Forma e Namazit të të Dërguarit ﷺ", author: "Imam Albani", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Muhammed-Nasiruddin-el-Albani-Forma-e-namazit-te-te-derguarit.pdf" },
  { title: "Namazi i Natës — Teravitë në Ramazan", author: "Imam Albani", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Namazi-i-nates-teravite-ne-Ramazan-Imam-Albani.pdf" },
  { title: "Ndejat e Muajit Ramazan", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Ndejat-e-Muajit-Ramazan.pdf" },
  { title: "Pozita e Synetit në Islam", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/POZITA-E-SYNETIT-NE-ISLAM-ok.pdf" },
  { title: "Përmendja — Dhikri dhe Lutjet", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Përmendja-finalja.pdf" },
  { title: "Emrat dhe Cilësitë e Allahut", author: "Xhamia Mbret Fahd", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Xhamia-Mbret-Emrat-dhe-Cilësitë-e-Allahut.pdf" },
  { title: "Historitë e Pejgamberëve", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/historite-e-pejgambereve-botim-1-1.pdf" },
  { title: "Albislam — Nr. 63", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam63.pdf" },
  { title: "Albislam — Nr. 64", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam64.pdf" },
  { title: "Albislam — Nr. 65", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam65.pdf" },
  { title: "Albislam — Nr. 66", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam66.pdf" },
  { title: "Dituria Islame — Nr. 250", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/dituria250.pdf" },
  { title: "Dituria Islame — Nr. 282", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/dituria282.pdf" },
  { title: "Dituria Islame — Nr. 283", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/dituria283.pdf" },
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

// Tabular Islamic calendar: leap years in 30-yr cycle are 2,5,7,10,13,16,18,21,24,26,29
const HIJRI_YEAR_LEN = [354,355,354,354,355,354,355,354,354,355,354,354,355,354,354,355,354,355,354,354,355,354,354,355,354,355,354,354,355,354];
const HIJRI_EPOCH_JD = 1948439; // JD of 1 Muharram 1 AH

function gregorianToHijri(gYear, gMonth, gDay) {
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

function hijriToGregorian(hYear, hMonth, hDay) {
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

  // Father asabah — gets remainder whenever no sons (even with daughters present)
  if (father && sons === 0 && hasRemainder) {
    const fi = results.findIndex(r => r.heir === "Father");
    if (fi > -1) {
      const newFrac = fracAdd(results[fi].frac, remFrac);
      results[fi].frac = newFrac;
      results[fi].each = newFrac;
      results[fi].note = "1/6 fixed share + residuary";
    } else {
      results.push({ heir: "Father", count: 1, frac: remFrac, each: remFrac, note: "Residuary (no children)" });
    }
    return results;
  }

  // Grandfather asabah — same rule as father when father is absent
  if (pGFActive && sons === 0 && hasRemainder) {
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

  // Radd — distribute remainder proportionally to fard heirs (excluding spouse)
  // new_share = old_share × (raddTotal + remainder) / raddTotal
  if (hasRemainder) {
    const raddHeirs = results.filter(r => r.heir !== "Husband" && !r.heir.startsWith("Wife"));
    if (raddHeirs.length > 0) {
      const raddTotal = raddHeirs.reduce((s, r) => fracAdd(s, r.frac), [0,1]);
      // multiplier numerator = raddTotal + remainder, denominator = raddTotal
      const mNum = raddTotal[0] * remFrac[1] + remFrac[0] * raddTotal[1];
      const mDen = raddTotal[0] * remFrac[1];
      raddHeirs.forEach(r => {
        const newFrac = reduce(r.frac[0] * mNum, r.frac[1] * mDen);
        r.frac = newFrac;
        r.each = r.count > 1 ? reduce(newFrac[0], newFrac[1] * r.count) : newFrac;
        r.note = (r.note ? r.note + " · " : "") + "Radd applied";
      });
    }
  }

  return results;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: `linear-gradient(145deg, ${SURFACE} 0%, #111111 100%)`,
      border: `1px solid ${BORDER}`,
      borderRadius: 2, padding: 28,
      boxShadow: "0 1px 0 rgba(201,168,76,0.08), 0 8px 40px rgba(0,0,0,0.5)",
      ...style
    }}>
      {children}
    </div>
  );
}

function PageTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: TEXT, fontFamily: SERIF, letterSpacing: "0.04em" }}>{title}</h1>
      </div>
      {sub && <p style={{ margin: "0 0 0 32px", color: MUTED, fontSize: 13, letterSpacing: "0.03em" }}>{sub}</p>}
      <div style={{ marginTop: 16, height: 1, background: `linear-gradient(90deg, ${GOLD} 0%, transparent 60%)`, opacity: 0.4 }} />
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: "11px 14px", borderRadius: 2,
          border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: "#0E0E0E", outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          fontFamily: SANS,
          ...props.style
        }}
        onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 1px ${GOLD}22`; }}
        onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</label>}
      <select
        {...props}
        style={{
          padding: "11px 14px", borderRadius: 2, border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: "#0E0E0E", outline: "none", cursor: "pointer",
          fontFamily: SANS,
          ...props.style
        }}
      >
        {options.map(o => <option key={o.v} value={o.v} style={{ background: "#141414" }}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "11px 24px", borderRadius: 2,
        border: variant === "primary" ? "none" : `1px solid ${BORDER}`,
        background: disabled ? "#1A1A1A"
          : variant === "primary"
            ? `linear-gradient(135deg, ${GOLD} 0%, #A8893C 100%)`
            : "#0E0E0E",
        color: disabled ? "#3A3A3A" : variant === "primary" ? "#0A0A0A" : TEXT,
        fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.08em", textTransform: "uppercase",
        transition: "opacity 0.2s, transform 0.15s",
        fontFamily: SANS,
        ...style
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}

// ─── ISLAMIC EVENTS (observed/official dates) ─────────────────────
// Dates use JS month index (0=Jan). Ramadan range auto-highlights entire month.
const ISLAMIC_EVENTS = [
  // ── 2025 (1446–1447 AH) ──────────────────────────────────────────
  { y:2025, m:0,  d:27, name:"Isra wal-Miʿraj",       emoji:"✨", type:"major",
    desc:"The Night Journey and Ascension of the Prophet ﷺ. In a single night, he was taken from Makkah to Jerusalem (Al-Isra), then ascended through the heavens to the presence of Allah (Al-Miraj), where the five daily prayers were prescribed for all Muslims." },
  { y:2025, m:1,  d:13, name:"Laylat al-Baraʿah",     emoji:"🌟", type:"notable",
    desc:"The Night of Forgiveness, falling mid-Sha'ban. Many Muslims spend this night in extra prayer and seek Allah's forgiveness, believing that destinies for the coming year are recorded. It is a night of mercy and spiritual renewal before Ramadan." },
  { y:2025, m:2,  d:1,  name:"Start of Ramadan",      emoji:"🌙", type:"ramadan", ramadanStart:true,
    desc:"The blessed month of fasting begins. Muslims abstain from food, drink, and sins from Fajr to Maghrib each day. Ramadan is the month in which the Quran was revealed. It is a time of heightened worship, generosity, self-discipline, and closeness to Allah." },
  { y:2025, m:2,  d:20, name:"Laylat al-Qadr",        emoji:"✨", type:"major",
    desc:"The Night of Power — better than a thousand months (Quran 97:3). It falls in the last 10 nights of Ramadan, most likely on the 27th night. The Quran was first revealed on this night. Worship on this night earns the reward of over 83 years of worship." },
  { y:2025, m:2,  d:30, name:"Eid al-Fitr",           emoji:"🎉", type:"eid",
    desc:"The Festival of Breaking the Fast, celebrated on the first of Shawwal after Ramadan ends. Muslims pray the Eid prayer in congregation, give Zakat al-Fitr to the poor, wear their best clothes, and share meals and joy with family and community." },
  { y:2025, m:5,  d:6,  name:"Eid al-Adha",           emoji:"🎉", type:"eid",
    desc:"The Festival of Sacrifice, commemorating Prophet Ibrahim's willingness to sacrifice his son in obedience to Allah. Muslims worldwide offer an animal sacrifice (Udhiyah), distribute the meat to family, neighbors, and the poor, and celebrate with prayer and togetherness." },
  { y:2025, m:5,  d:5,  name:"Day of Arafah",         emoji:"🕋", type:"major",
    desc:"The pinnacle of Hajj — pilgrims gather on the plain of Arafah. For those not performing Hajj, fasting this day expiates sins of the past and coming year. The Prophet ﷺ said: 'There is no day on which Allah frees more people from the Fire than the Day of Arafah.'" },
  { y:2025, m:5,  d:27, name:"Islamic New Year 1447", emoji:"🌙", type:"major",
    desc:"The first day of Muharram marks the beginning of the new Hijri year. It commemorates the Prophet's migration (Hijra) from Makkah to Madinah in 622 CE — a pivotal moment that shaped the Muslim community." },
  { y:2025, m:8,  d:4,  name:"Mawlid al-Nabi ﷺ",     emoji:"⭐", type:"major",
    desc:"The birthday of Prophet Muhammad ﷺ, born in Makkah around 570 CE. Many Muslims mark this day with gatherings, prayers, and recitation of his life and character. It is a time to reflect on his teachings, mercy, and example." },
  { y:2025, m:0,  d:15, name:"Day of Ashura",         emoji:"🤲", type:"major",
    desc:"The 10th of Muharram is a day of great significance. Allah saved Prophet Musa (Moses) and the Children of Israel from Pharaoh on this day. The Prophet ﷺ fasted and encouraged fasting on this day. For Shia Muslims, it also commemorates the martyrdom of Imam Husayn at Karbala." },

  // ── 2026 (1447–1448 AH) — official observed dates ────────────────
  { y:2026, m:0,  d:16, name:"Isra wal-Miʿraj",       emoji:"✨", type:"major",
    desc:"The Night Journey and Ascension of the Prophet ﷺ. In a single night, he was taken from Makkah to Jerusalem (Al-Isra), then ascended through the heavens to the presence of Allah (Al-Miraj), where the five daily prayers were prescribed for all Muslims." },
  { y:2026, m:1,  d:3,  name:"Laylat al-Baraʿah",     emoji:"🌟", type:"notable",
    desc:"The Night of Forgiveness, falling mid-Sha'ban. Many Muslims spend this night in extra prayer and seek Allah's forgiveness, believing that destinies for the coming year are recorded. It is a night of mercy and spiritual renewal before Ramadan." },
  { y:2026, m:1,  d:18, name:"Start of Ramadan",      emoji:"🌙", type:"ramadan", ramadanStart:true,
    desc:"The blessed month of fasting begins. Muslims abstain from food, drink, and sins from Fajr to Maghrib each day. Ramadan is the month in which the Quran was revealed. It is a time of heightened worship, generosity, self-discipline, and closeness to Allah." },
  { y:2026, m:2,  d:9,  name:"Laylat al-Qadr (21st Ramadan)", emoji:"✨", type:"major",
    desc:"The Night of Power — better than a thousand months (Quran 97:3). Seek it on the odd nights of the last ten nights of Ramadan: 21st, 23rd, 25th, 27th, and 29th. The Quran was first revealed on this night. Worship on it earns the reward of over 83 years of worship." },
  { y:2026, m:2,  d:11, name:"Laylat al-Qadr (23rd Ramadan)", emoji:"✨", type:"major",
    desc:"The Night of Power — better than a thousand months (Quran 97:3). Seek it on the odd nights of the last ten nights of Ramadan: 21st, 23rd, 25th, 27th, and 29th. The Quran was first revealed on this night. Worship on it earns the reward of over 83 years of worship." },
  { y:2026, m:2,  d:13, name:"Laylat al-Qadr (25th Ramadan)", emoji:"✨", type:"major",
    desc:"The Night of Power — better than a thousand months (Quran 97:3). Seek it on the odd nights of the last ten nights of Ramadan: 21st, 23rd, 25th, 27th, and 29th. The Quran was first revealed on this night. Worship on it earns the reward of over 83 years of worship." },
  { y:2026, m:2,  d:15, name:"Laylat al-Qadr (27th Ramadan)", emoji:"✨", type:"major",
    desc:"The Night of Power — better than a thousand months (Quran 97:3). Seek it on the odd nights of the last ten nights of Ramadan: 21st, 23rd, 25th, 27th, and 29th. The Quran was first revealed on this night. Worship on it earns the reward of over 83 years of worship." },
  { y:2026, m:2,  d:17, name:"Laylat al-Qadr (29th Ramadan)", emoji:"✨", type:"major",
    desc:"The Night of Power — better than a thousand months (Quran 97:3). Seek it on the odd nights of the last ten nights of Ramadan: 21st, 23rd, 25th, 27th, and 29th. The Quran was first revealed on this night. Worship on it earns the reward of over 83 years of worship." },
  { y:2026, m:2,  d:20, name:"Eid al-Fitr",           emoji:"🎉", type:"eid",
    desc:"The Festival of Breaking the Fast, celebrated on the first of Shawwal after Ramadan ends. Muslims pray the Eid prayer in congregation, give Zakat al-Fitr to the poor, wear their best clothes, and share meals and joy with family and community." },
  { y:2026, m:4,  d:18, name:"Start of Dhul Hijjah",  emoji:"🕋", type:"notable",
    desc:"The first 10 days of Dhul Hijjah are the most virtuous days of the year according to the Prophet ﷺ. Pilgrims begin the Hajj journey. Muslims worldwide are encouraged to fast, increase dhikr, give charity, and perform good deeds during these blessed days." },
  { y:2026, m:4,  d:25, name:"Hajj Begins",           emoji:"🕋", type:"notable",
    desc:"Pilgrims officially begin the Hajj rites on the 8th of Dhul Hijjah (Yawm al-Tarwiyah). They travel to Mina, prepare spiritually, and await the Day of Arafah — the pinnacle of Hajj and one of the greatest days in the Islamic calendar." },
  { y:2026, m:4,  d:26, name:"Day of Arafah",         emoji:"🕋", type:"major",
    desc:"The pinnacle of Hajj — pilgrims gather on the plain of Arafah. For those not performing Hajj, fasting this day expiates sins of the past and coming year. The Prophet ﷺ said: 'There is no day on which Allah frees more people from the Fire than the Day of Arafah.'" },
  { y:2026, m:4,  d:27, name:"Eid al-Adha",           emoji:"🎉", type:"eid",
    desc:"The Festival of Sacrifice, commemorating Prophet Ibrahim's willingness to sacrifice his son in obedience to Allah. Muslims worldwide offer an animal sacrifice (Udhiyah), distribute the meat to family, neighbors, and the poor, and celebrate with prayer and togetherness." },
  { y:2026, m:5,  d:16, name:"Islamic New Year 1448", emoji:"🌙", type:"major",
    desc:"The first day of Muharram 1448 marks the beginning of a new Hijri year. It commemorates the Prophet's migration (Hijra) from Makkah to Madinah in 622 CE — a pivotal moment that shaped the Muslim community." },
];

const EVENT_COLORS = {
  eid:      { bg: "#221C08", border: "#C9A84C", text: "#F0D080" },
  major:    { bg: "#160E2A", border: "#7C3AED", text: "#C4B5FD" },
  notable:  { bg: "#0A1628", border: "#2563EB", text: "#93C5FD" },
  ramadan:  { bg: "#220A0A", border: "#DC2626", text: "#FCA5A5" },
  white:    { bg: "#0E1420", border: "#3B5998", text: "#93C5FD" },
};

const WHITE_DAYS_INFO = {
  name: "White Days (Ayyām al-Bīḍ)",
  emoji: "⚪",
  type: "white",
  desc: "The 13th, 14th, and 15th of every Hijri month are called the White Days because the nights are lit by a full moon. The Prophet ﷺ used to fast these three days every month and encouraged his companions to do the same. Fasting them is a highly recommended Sunnah, equivalent to fasting the whole month."
};

// Popup modal component
function EventPopup({ event, onClose }) {
  if (!event) return null;
  const col = EVENT_COLORS[event.type] || EVENT_COLORS.notable;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0E0E0E", borderRadius: 0, maxWidth: 480, width: "100%",
        boxShadow: `0 20px 80px rgba(0,0,0,0.8), 0 0 0 1px ${col.border}40`,
        border: `1px solid ${col.border}`,
        overflow: "hidden",
        animation: "popIn 0.2s ease",
      }}>
        <div style={{ background: col.bg, padding: "20px 24px", borderBottom: `1px solid ${col.border}` }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{event.emoji}</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: col.text }}>{event.name}</h2>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ margin: 0, fontSize: 15, color: TEXT, lineHeight: 1.75 }}>{event.desc}</p>
        </div>
        <div style={{ padding: "12px 24px 20px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: col.border, color: "#fff", fontWeight: 600,
            fontSize: 14, cursor: "pointer",
          }}>Close</button>
        </div>
      </div>
      <style>{`@keyframes popIn { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>
  );
}

function getUpcomingEvents(today) {
  const todayMs = today.getTime();
  return ISLAMIC_EVENTS
    .map(ev => { const d = new Date(ev.y, ev.m, ev.d); return { ...ev, date: d, daysLeft: Math.round((d.getTime()-todayMs)/86400000) }; })
    .filter(ev => ev.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

function getEventsForDate(y, m, d) {
  return ISLAMIC_EVENTS.filter(ev => ev.y === y && ev.m === m && ev.d === d);
}

function isRamadanDay(date) {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const start = ISLAMIC_EVENTS.find(ev => ev.ramadanStart && ev.y === y);
  if (!start) return false;
  const startMs = new Date(start.y, start.m, start.d).getTime();
  const diff = Math.round((date.getTime() - startMs) / 86400000);
  return diff >= 0 && diff < 30;
}

// ─── NAV ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",        label: "Home",         icon: "🏠" },
  { id: "prayer",      label: "Prayer Times", icon: "🕌" },
  { id: "qibla",       label: "Qibla",        icon: "🧭" },
  { id: "zakat",       label: "Zakat",        icon: "💰" },
  { id: "inheritance", label: "Inheritance",  icon: "⚖️" },
  { id: "calendar",    label: "Calendar",     icon: "📆" },
  { id: "dates",       label: "Dates",        icon: "🔄" },
  { id: "library",     label: "Library",      icon: "📚" },
];

function Nav({ page, setPage, onSettings, hasLocation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "#080808",
      borderBottom: `1px solid ${BORDER}`,
      boxShadow: `0 1px 0 ${GOLD}18, 0 4px 40px rgba(0,0,0,0.8)`,
      padding: "0 32px",
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, borderBottom: `1px solid ${GOLD}60` }}>☪️</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontWeight: 600, fontSize: 17, color: TEXT, fontFamily: SERIF, letterSpacing: "0.06em" }}>Muslim's Path</span>
            <span style={{ fontSize: 9, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: SANS }}>Your Islamic Companion</span>
          </div>
        </button>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 0, alignItems: "center" }} className="nav-desktop">
          {NAV_ITEMS.filter(n => n.id !== "home").map(n => {
            const isActive = page === n.id;
            const isHov = hovered === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? `1px solid ${GOLD}` : "1px solid transparent",
                  cursor: "pointer",
                  padding: "8px 14px", fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? GOLD : isHov ? TEXT : MUTED,
                  transition: "all 0.2s",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontFamily: SANS,
                  height: 64, borderRadius: 0,
                }}>
                {n.label}
              </button>
            );
          })}
        </div>

        {/* Settings + mobile hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onSettings} title="Settings" style={{
            background: "transparent",
            border: `1px solid ${hasLocation ? GOLD + "60" : BORDER}`,
            borderRadius: 2, cursor: "pointer", color: hasLocation ? GOLD : MUTED,
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, transition: "all 0.2s", position: "relative",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = hasLocation ? GOLD + "60" : BORDER; e.currentTarget.style.color = hasLocation ? GOLD : MUTED; }}
          >
            ⚙
            {hasLocation && <span style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, borderRadius: "50%", background: GOLD }} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: "none", background: "transparent", border: `1px solid ${BORDER}`,
            borderRadius: 2, cursor: "pointer", fontSize: 16, color: MUTED,
            width: 36, height: 36, alignItems: "center", justifyContent: "center",
          }} className="nav-mobile">{menuOpen ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "8px 0 16px", display: "flex", flexDirection: "column", background: "#080808" }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "12px 32px", fontSize: 12,
              color: page === n.id ? GOLD : MUTED,
              fontWeight: page === n.id ? 600 : 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 12, fontFamily: SANS,
              borderLeft: page === n.id ? `2px solid ${GOLD}` : "2px solid transparent",
            }}><span>{n.icon}</span>{n.label}</button>
          ))}
          <button onClick={() => { onSettings(); setMenuOpen(false); }} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "left",
            padding: "12px 32px", fontSize: 12, color: MUTED,
            display: "flex", alignItems: "center", gap: 12,
            borderTop: `1px solid ${BORDER}`, marginTop: 8,
            letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: SANS,
            borderLeft: "2px solid transparent",
          }}>
            <span>⚙</span> Settings {hasLocation && <span style={{ fontSize: 10, color: GOLD, border: `1px solid ${GOLD}60`, padding: "1px 7px", letterSpacing: "0.06em" }}>Active</span>}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 760px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        .home-prayer-strip { display: none !important; }
        @media (max-width: 760px) {
          .home-prayer-strip { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────
function Home({ quote, setPage, savedLocation }) {
  const [nextPrayer, setNextPrayer] = useState(null);
  const [now, setNow] = useState(new Date());

  // Fetch prayer times if location is saved
  useEffect(() => {
    if (!savedLocation) return;
    const d = new Date();
    const dateStr = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${savedLocation.lat}&longitude=${savedLocation.lon}&method=2`)
      .then(r => r.json())
      .then(json => {
        if (json.code !== 200) return;
        const timings = json.data.timings;
        const prayers = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
        const nowD = new Date();
        const nowMins = nowD.getHours()*60 + nowD.getMinutes();
        for (const name of prayers) {
          const [h, m] = timings[name].split(":").map(Number);
          if (h*60+m > nowMins) { setNextPrayer({ name, time: timings[name], totalMins: h*60+m }); return; }
        }
        // After Isha — next is Fajr tomorrow
        const [h, m] = timings["Fajr"].split(":").map(Number);
        setNextPrayer({ name: "Fajr", time: timings["Fajr"], totalMins: 24*60 + h*60+m });
      }).catch(() => {});
  }, [savedLocation]);

  // Tick every 30s to keep countdown fresh
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const minsLeft = nextPrayer ? nextPrayer.totalMins - (now.getHours()*60 + now.getMinutes()) : 0;
  const hoursLeft = Math.floor(minsLeft / 60);
  const minutesLeft = minsLeft % 60;
  const countdown = minsLeft <= 0 ? "Now" : hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m` : `${minutesLeft}m`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      {/* Quote */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 32, marginBottom: 20, opacity: 0.9 }}>☪️</div>
        <h1 style={{ fontSize: 42, fontWeight: 500, color: TEXT, marginBottom: 6, fontFamily: SERIF, letterSpacing: "0.06em" }}>Muslim's Path</h1>
        <p style={{ color: MUTED, marginBottom: 40, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>Tools &amp; Resources for Your Daily Islamic Life</p>
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          {/* Gold corner accents */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTop: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottom: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />
          <div style={{ padding: "36px 40px", background: "linear-gradient(145deg,#111111,#0D0D0D)" }}>
            <p style={{ fontSize: 22, color: TEXT, fontStyle: "italic", margin: 0, lineHeight: 1.8, fontFamily: SERIF, letterSpacing: "0.02em" }}>"{quote.text}"</p>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)`, margin: "16px 0" }} />
            <p style={{ margin: 0, fontSize: 12, color: GOLD, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>— {quote.src}</p>
            {quote.ref && <p style={{ margin: "4px 0 0", fontSize: 11, color: MUTED, letterSpacing: "0.06em" }}>{quote.ref}</p>}

            {/* Next prayer — shown under quote on all screen sizes */}
            {nextPrayer && (
              <div onClick={() => setPage("prayer")} style={{
                marginTop: 20, paddingTop: 16,
                borderTop: `1px solid ${GOLD}25`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer",
              }}>
                <span style={{ fontSize: 14, color: GOLD, fontFamily: SERIF, fontWeight: 500, letterSpacing: "0.06em" }}>
                  {nextPrayer.name}
                </span>
                <span style={{ fontSize: 12, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  in {countdown}
                </span>
                <span style={{ fontSize: 18, color: GOLD, fontFamily: SERIF, fontWeight: 300, letterSpacing: "0.1em", fontVariantNumeric: "tabular-nums" }}>
                  {nextPrayer.time}
                </span>
              </div>
            )}
            {!savedLocation && (
              <p style={{ margin: "16px 0 0", fontSize: 11, color: MUTED, textAlign: "center", letterSpacing: "0.08em", borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
                ⚙ Set your location to see prayer times
              </p>
            )}
          </div>
        </div>

        {/* Next prayer strip — mobile only */}
        {nextPrayer && (
          <div className="home-prayer-strip" onClick={() => setPage("prayer")} style={{
            marginTop: 16, maxWidth: 580, margin: "16px auto 0",
            background: "linear-gradient(135deg,#0E0C08,#1A1710)",
            border: `1px solid ${GOLD}40`,
            borderRadius: 2, padding: "16px 22px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 1px 0 ${GOLD}20`,
          }}>
            <div>
              <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Next Prayer</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: TEXT, marginTop: 2, fontFamily: SERIF }}>🕌 {nextPrayer.name}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2, letterSpacing: "0.04em" }}>{savedLocation?.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 300, color: TEXT, fontVariantNumeric: "tabular-nums", fontFamily: SERIF, letterSpacing: "0.06em" }}>{nextPrayer.time}</div>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 600, marginTop: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>in {countdown}</div>
            </div>
          </div>
        )}

        {!savedLocation && (
          <div className="home-prayer-strip" onClick={() => {}} style={{
            marginTop: 16, maxWidth: 580, margin: "16px auto 0",
            background: "transparent", border: `1px dashed ${BORDER}`,
            borderRadius: 2, padding: "12px 20px", textAlign: "center", cursor: "default",
          }}>
            <span style={{ fontSize: 12, color: MUTED, letterSpacing: "0.06em" }}>⚙ Set your location in Settings to see prayer times here</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, border: `1px solid ${BORDER}` }}>
        {NAV_ITEMS.filter(n => n.id !== "home").map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            background: SURFACE, border: "none", borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
            padding: "28px 24px", textAlign: "left", cursor: "pointer",
            transition: "background 0.2s",
            position: "relative", overflow: "hidden",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = GREEN_L; }}
            onMouseLeave={e => { e.currentTarget.style.background = SURFACE; }}
          >
            <div style={{ fontSize: 24, marginBottom: 14, opacity: 0.8 }}>{n.icon}</div>
            <div style={{ fontWeight: 500, color: TEXT, fontSize: 14, letterSpacing: "0.05em", fontFamily: SANS }}>{n.label}</div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${GOLD}40, transparent)`, opacity: 0, transition: "opacity 0.2s" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PRAYER TIMES ─────────────────────────────────────────────────
function PrayerTimes({ savedLocation }) {
  const [city, setCity] = useState("");
  const [method, setMethod] = useState(2);
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [date] = useState(new Date());
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [suggLoading, setSuggLoading] = useState(false);
  const [displayCity, setDisplayCity] = useState("");
  const [countryCode, setCountryCode] = useState("");

  // Auto-load from saved location
  useEffect(() => {
    if (savedLocation && !times) {
      setCity(savedLocation.name);
      setDisplayCity(savedLocation.name);
      setCountryCode(savedLocation.country || "");
      search(savedLocation.name, { lat: savedLocation.lat, lon: savedLocation.lon });
    }
  }, [savedLocation]);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  // Fetch city suggestions
  useEffect(() => {
    if (city.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSuggLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=6&featuretype=city&addressdetails=1`, { headers: { "Accept-Language": "en" } });
        const json = await res.json();
        const cities = json
          .filter(r => r.class === "place" || r.class === "boundary" || r.addresstype === "city" || r.addresstype === "town" || ["city","town","village","municipality","administrative"].includes(r.type))
          .map(r => ({
            name: r.display_name.split(",").slice(0,2).join(", "),
            lat: parseFloat(r.lat),
            lon: parseFloat(r.lon),
            country: r.address?.country_code?.toUpperCase() || "",
          }));
        setSuggestions(cities.slice(0, 6));
        setShowSugg(true);
      } catch { setSuggestions([]); }
      setSuggLoading(false);
    }, 350);
  }, [city]);

  // Close on outside click
  useEffect(() => {
    function handle(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSugg(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function search(cityName, coords) {
    const q = cityName || city;
    if (!q.trim()) return;
    setShowSugg(false);
    setDisplayCity(cityName || city);
    setLoading(true); setErr(""); setTimes(null);
    try {
      const d = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
      let url;
      if (coords) {
        // Use coordinates — works for every city worldwide
        url = `https://api.aladhan.com/v1/timings/