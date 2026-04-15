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

  // Albanian / Shqip
  { title: "10 Sfidat e Jetës", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/10-sfidat-e-jetes.pdf" },
  { title: "99 Emrat e Allahut", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/99Names-2019.pdf" },
  { title: "Kush është Profeti Muhamed ﷺ", author: "AIITC", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/AIITC-Ky-eshte-profeti-Muhamed-a.s..pdf" },
  { title: "Madhërimi i Allahut", author: "Abdulaziz et-Tarifi", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulaziz-et-Tarifi-Madherimi-i-Allahut.pdf" },
  { title: "Gjykimi ndaj Magjisë dhe Fallit", author: "Abdulaziz ibn Baz", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulaziz-ibn-Baz-Gjykimi-ndaj-magjes-dhe-fallit.pdf" },
  { title: "Mbi Rrugën e të Parëve Tanë", author: "Abdulkadër Arnauti", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulkader-Arnauti-Mbi-rrugën-e-te-pareve-tane-selefit.pdf" },
  { title: "Sahih el-Bukhari — Vëllimi 1", author: "Mehdi Polisi", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Mehdi-Polisi-Sahih-el-Bukhari-Vellimi-01.pdf" },
  { title: "Sahih el-Bukhari — Vëllimi 2", author: "Abdullah Hamiti", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdullah-Hamiti-Sahih-el-Bukhari-Vellimi-02.pdf" },
  { title: "Këshilla të Arta për Morale të Larta", author: "Abdulmelik Ramadani", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulmelik-Ramadani-Keshilla-te-arta.pdf" },
  { title: "Rregulla rreth Tekfirit", author: "Abdulmunim Mustafa Halime", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulmunim-Mustafa-Halime-Rregulla-rreth-tekfirit.pdf" },
  { title: "Realiteti i Besimit të Vërtetë", author: "Abdurrahman es-Sadij", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdurrahman-es-Sadij-Realiteti-i-Besimit-te-Vertete.pdf" },
  { title: "Hallalli dhe Harami në Islam", author: "Dr. Jusuf Kardavi", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Dr.-Jusuf-Kardavi-Hallalli-dhe-harami-me-balline.pdf" },
  { title: "Kandili i Ramazanit", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/KANDILI-I-RAMAZANIT.pdf" },
  { title: "Kurani dhe Shkenca", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Kurani-drejt-shkences-me-kopertine.pdf" },
  { title: "Libri i Agjërimit", author: "Salih ibn Feuzan", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Libri-i-Agjerimit-Salih-ibn-Feuzan-el-Feuzan-1.pdf" },
  { title: "Forma e Namazit të të Dërguarit ﷺ", author: "Imam Albani", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Muhammed-Nasiruddin-el-Albani-Forma-e-namazit-te-te-derguarit.pdf" },
  { title: "Namazi i Natës — Teravitë në Ramazan", author: "Imam Albani", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Namazi-i-nates-teravite-ne-Ramazan-Imam-Albani.pdf" },
  { title: "Ndejat e Muajit Ramazan", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Ndejat-e-Muajit-Ramazan.pdf" },
  { title: "Pozita e Synetit në Islam", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/POZITA-E-SYNETIT-NE-ISLAM-ok.pdf" },
  { title: "Përmendja — Dhikri dhe Lutjet", author: "Literaturë Islame", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Permendja-finalja.pdf" },
  { title: "Emrat dhe Cilësitë e Allahut", author: "Xhamia Mbret Fahd", cat: "Shqip", url: "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Xhamia-Mbret-Emrat-dhe-Cilesit-e-Allahut.pdf" },
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
const R2 = "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev";

const LECTURES = [
  { id:1,  title:"Butësia",                                        file:"Butësia.mp3" },
  { id:2,  title:"Cili është Çelësi i Fitores?",                  file:"Cili eshte çelesi i fitores.mp3" },
  { id:3,  title:"Dije dhe Vetëm Dije",                           file:"Dije dhe vetem Dije.mp3" },
  { id:4,  title:"Dije dhe Vetëm Dije — Pjesa 2",                 file:"Dije dhe vetem Dije 2.mp3" },
  { id:5,  title:"Edukata e Dijes",                               file:"Edukata e Dijes.mp3" },
  { id:6,  title:"Furnizimi — Si ta Shtojmë Atë",                 file:"Furnizimi, Si ta shtojme ate .mp3" },
  { id:7,  title:"Hadithe për Hallalin, Haramin dhe Ndalesat",    file:"Hadithe per Hallalin, Haramin dhe ndalesat ne Islam.mp3" },
  { id:8,  title:"Libri i Urtësive 48 — Pastrimi i Vetvetes",    file:"Libri i Urtesive 48 _ Pastrimi i vetvetes.mp3" },
  { id:9,  title:"Mendjelehti",                                   file:"Mendjelehti.mp3" },
  { id:10, title:"Mos u Pikëllo, Por Dëgjoji Këto Rregulla",     file:"Mos u pikëllo por dëgjoji këto rregulla...mp3" },
  { id:11, title:"Njeriu — Krijesa e Fisnikëruar",               file:"Njeriu Krijesa e Fisnikeruar.mp3" },
  { id:12, title:"Padrejtësia",                                   file:"Padrejtësia.mp3" },
  { id:13, title:"Përhapja e Optimizmit dhe Rëndësia e Tij",    file:"Perhapja e Optimizmit dhe rendesia e tij.mp3" },
  { id:14, title:"Rëndësia e Optimizmit dhe Mendimit të Mirë",  file:"Rendesia e Optimizmit dhe mendimit te mire.mp3" },
  { id:15, title:"Rëndësia e Optimizmit — Pjesa 2",             file:"Rendesia e optimizmit dhe mendimit te mire - Pjesa 2.mp3" },
  { id:16, title:"Shiko Veten dhe Vlerësoje Atë",               file:"Shiko veten dhe vlerësoje atë.mp3" },
  { id:17, title:"Vendimi dhe Përcaktimi",                       file:"Vendimi dhe percaktimi.mp3" },
  { id:18, title:"Vendimi dhe Përcaktimi — Pjesa 2",            file:"vendimi dhe përcaktimi-2.mp3" },
].map(l => ({ ...l, url: R2 + "/audio/Ligjerata/" + encodeURIComponent(l.file) }));

const NAV_ITEMS = [
  { id: "home",        label: "Home",         icon: "🏠" },
  { id: "prayer",      label: "Prayer Times", icon: "🕌" },
  { id: "qibla",       label: "Qibla",        icon: "🧭" },
  { id: "zakat",       label: "Zakat",        icon: "💰" },
  { id: "inheritance", label: "Inheritance",  icon: "⚖️" },
  { id: "calendar",    label: "Calendar",     icon: "📆" },
  { id: "dates",       label: "Dates",        icon: "🔄" },
  { id: "library",     label: "Library",      icon: "📚" },
  { id: "audio",       label: "Lectures",     icon: "🎙️" },
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
        url = `https://api.aladhan.com/v1/timings/${d}?latitude=${coords.lat}&longitude=${coords.lon}&method=${method}`;
      } else {
        // Fallback: geocode first, then use coordinates
        const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, { headers: { "Accept-Language": "en" } });
        const geoJson = await geo.json();
        if (geoJson.length > 0) {
          const { lat, lon } = geoJson[0];
          url = `https://api.aladhan.com/v1/timings/${d}?latitude=${lat}&longitude=${lon}&method=${method}`;
        } else {
          url = `https://api.aladhan.com/v1/timingsByCity/${d}?city=${encodeURIComponent(q)}&country=&method=${method}`;
        }
      }
      const res = await fetch(url);
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

          {/* City input with autocomplete */}
          <div style={{ position: "relative" }} ref={wrapRef}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>City</label>
              <div style={{ position: "relative" }}>
                <input
                  placeholder="e.g. London, Cairo, Karachi"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && search()}
                  onFocus={() => suggestions.length > 0 && setShowSugg(true)}
                  style={{
                    width: "100%", padding: "9px 36px 9px 12px", borderRadius: 8,
                    border: `1px solid ${BORDER}`, fontSize: 14, color: TEXT,
                    background: SURFACE, outline: "none", boxSizing: "border-box",
                  }}
                  onFocusCapture={e => e.target.style.borderColor = GREEN}
                  onBlur={e => e.target.style.borderColor = BORDER}
                />
                {suggLoading && (
                  <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: MUTED }}>⏳</div>
                )}
              </div>
            </div>

            {/* Suggestions dropdown */}
            {showSugg && suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200,
                background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                marginTop: 4, overflow: "hidden",
              }}>
                {suggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => { setCity(s.name); setCountryCode(s.country); search(s.name, { lat: s.lat, lon: s.lon }); setShowSugg(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "10px 14px", border: "none", background: "none",
                      cursor: "pointer", fontSize: 14, color: TEXT,
                      borderBottom: i < suggestions.length - 1 ? `1px solid ${BORDER}` : "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = GREEN_L}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <span style={{ marginRight: 8 }}>📍</span>{s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Select label="Calculation Method" value={method} onChange={e => setMethod(e.target.value)} options={METHODS} />
          <Btn onClick={() => search()} disabled={loading}>{loading ? "Searching…" : "Get Prayer Times"}</Btn>
        </div>
      </Card>

      {err && <p style={{ color: "#EF4444", fontSize: 12, letterSpacing: "0.03em" }}>{err}</p>}

      {times && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700, color: TEXT }}>{displayCity}</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: MUTED }}>
              {times.date.readable} · {countryCode === "XK" ? "Europe/Pristina" : times.meta.timezone}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {prayerKeys.map(k => {
              const isNext = k === nextPrayer;
              return (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 16px", borderRadius: 0,
                  background: isNext ? GREEN_L : "transparent",
                  borderLeft: isNext ? `2px solid ${GOLD}` : "2px solid transparent",
                  borderBottom: `1px solid ${BORDER}`,
                }}>
                  <span style={{ fontWeight: isNext ? 600 : 400, color: isNext ? GOLD : MUTED, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>{k}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontWeight: 300, color: isNext ? TEXT : MUTED, fontSize: 18, fontVariantNumeric: "tabular-nums", fontFamily: SERIF, letterSpacing: "0.06em" }}>{times.timings[k]}</span>
                    {isNext && <span style={{ fontSize: 9, border: `1px solid ${GOLD}`, color: GOLD, padding: "2px 8px", fontWeight: 700, letterSpacing: "0.14em" }}>NEXT</span>}
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
function Qibla({ savedLocation }) {
  const [city, setCity] = useState("");
  const [bearing, setBearing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [locName, setLocName] = useState("");

  // Auto-load from saved location
  useEffect(() => {
    if (savedLocation && bearing === null) {
      setBearing(calcQibla(savedLocation.lat, savedLocation.lon));
      setLocName(savedLocation.name);
      setCity(savedLocation.name);
    }
  }, [savedLocation]);

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

      {err && <p style={{ color: "#EF4444", fontSize: 12, letterSpacing: "0.03em" }}>{err}</p>}

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
                  fontSize: 12, fontWeight: 700, color: l==="N" ? "#EF4444" : MUTED, letterSpacing: "0.06em"
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
            <h4 style={{ margin: "0 0 12px", color: GOLD, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}30`, paddingBottom: 8 }}>{group}</h4>
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
              <span style={{ fontSize: 20, fontWeight: 400, color: result.meetsNisab ? GOLD : MUTED, fontFamily: SERIF, letterSpacing: "0.04em" }}>
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 13, color: TEXT, letterSpacing: "0.02em" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => set(key, Math.max(0, h[key]-1))} style={{ width: 28, height: 28, borderRadius: 2, border: `1px solid ${BORDER}`, background: "#0E0E0E", cursor: "pointer", fontSize: 16, lineHeight: 1, color: TEXT }}>−</button>
        <span style={{ width: 22, textAlign: "center", fontWeight: 600, color: h[key] > 0 ? GOLD : MUTED, fontFamily: SERIF, fontSize: 16 }}>{h[key]}</span>
        <button onClick={() => set(key, Math.min(max||99, h[key]+1))} style={{ width: 28, height: 28, borderRadius: 2, border: `1px solid ${BORDER}`, background: "#0E0E0E", cursor: "pointer", fontSize: 16, lineHeight: 1, color: TEXT }}>+</button>
      </div>
    </div>
  );

  const toggle = (label, key) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 13, color: TEXT, letterSpacing: "0.02em" }}>{label}</span>
      <button onClick={() => set(key, !h[key])} style={{
        width: 42, height: 22, borderRadius: 0, border: `1px solid ${h[key] ? GOLD + "80" : BORDER}`,
        cursor: "pointer", background: h[key] ? GREEN_L : "#0A0A0A",
        position: "relative", transition: "all 0.2s"
      }}>
        <div style={{
          position: "absolute", top: 2, left: h[key] ? 21 : 2,
          width: 16, height: 16, borderRadius: 0,
          background: h[key] ? GOLD : MUTED,
          transition: "left 0.2s, background 0.2s"
        }} />
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
        <h4 style={{ margin: "0 0 4px", color: GOLD, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em" }}>Heirs</h4>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: MUTED }}>Select only the heirs who survive the deceased</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Spouse</p>
            {toggle("Husband", "husband")}
            {numInput("Wives", "wives", 4)}
            <p style={{ margin: "12px 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Children</p>
            {numInput("Sons", "sons")}
            {numInput("Daughters", "daughters")}
            <p style={{ margin: "12px 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Parents</p>
            {toggle("Father", "father")}
            {toggle("Mother", "mother")}
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Grandparents</p>
            {toggle("Paternal Grandfather", "paternalGF")}
            {toggle("Maternal Grandmother", "maternalGM")}
            {toggle("Paternal Grandmother", "paternalGM")}
            <p style={{ margin: "12px 0 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: GOLD, letterSpacing: "0.14em", borderBottom: `1px solid ${GOLD}20`, paddingBottom: 4 }}>Siblings</p>
            {numInput("Full Brothers", "fullBrothers")}
            {numInput("Full Sisters", "fullSisters")}
            {numInput("Paternal Half-Brothers", "paternalHB")}
            {numInput("Paternal Half-Sisters", "paternalHS")}
            {numInput("Uterine Siblings", "uterine")}
          </div>
        </div>
        {err && <p style={{ margin: "12px 0 0", color: "#EF4444", fontSize: 12, letterSpacing: "0.03em" }}>{err}</p>}
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
      <Card style={{ background: GREEN_L, border: `1px solid ${GOLD}30`, marginBottom: 20, textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em" }}>Today</p>
        <p style={{ margin: "6px 0 0", fontWeight: 400, color: TEXT, fontSize: 18, fontFamily: SERIF, letterSpacing: "0.04em" }}>
          {today.getDate()} {GREG_MONTHS[today.getMonth()]} {today.getFullYear()}
        </p>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD}40,transparent)`, margin: "10px 0" }} />
        <p style={{ margin: 0, color: GOLD, fontWeight: 500, fontSize: 15, fontFamily: SERIF, letterSpacing: "0.06em" }}>
          {hijriToday.day} {HIJRI_MONTHS[hijriToday.month-1]} {hijriToday.year} AH
        </p>
      </Card>

      <Card>
        {/* Mode toggle */}
        <div style={{ display: "flex", background: "#0A0A0A", border: `1px solid ${BORDER}`, borderRadius: 2, padding: 3, marginBottom: 20 }}>
          {[{v:"gToH",l:"Gregorian → Hijri"},{v:"hToG",l:"Hijri → Gregorian"}].map(opt => (
            <button key={opt.v} onClick={() => setMode(opt.v)} style={{
              flex: 1, padding: "8px", borderRadius: 2, border: "none", cursor: "pointer",
              background: mode === opt.v ? SURFACE : "transparent",
              borderBottom: mode === opt.v ? `1px solid ${GOLD}` : "1px solid transparent",
              fontWeight: mode === opt.v ? 600 : 400,
              color: mode === opt.v ? GOLD : MUTED,
              fontSize: 12, letterSpacing: "0.04em",
              transition: "all 0.2s", fontFamily: SANS,
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
          <div style={{ marginTop: 20, padding: 24, background: GREEN_L, border: `1px solid ${GOLD}30`, borderRadius: 2, textAlign: "center" }}>
            {result.type === "hijri" ? (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: MUTED }}>Hijri Date</p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 400, color: GOLD, fontFamily: SERIF, letterSpacing: "0.04em" }}>
                  {result.day} {HIJRI_MONTHS[result.month-1]} {result.year} AH
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em" }}>Gregorian Date</p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 400, color: GOLD, fontFamily: SERIF, letterSpacing: "0.04em" }}>
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
function Library({ navigate }) {
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

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          placeholder="Search by title or author…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: "1 1 200px", padding: "9px 14px", borderRadius: 2,
            border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT,
            background: "#0E0E0E", outline: "none", fontFamily: SANS,
          }}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
        <select value={cat} onChange={e => { if (e.target.value === "🎙️ Lectures") navigate("audio"); else setCat(e.target.value); }} style={{
          padding: "9px 14px", borderRadius: 2, border: `1px solid ${BORDER}`,
          fontSize: 12, color: TEXT, background: "#0E0E0E", cursor: "pointer",
          flex: "0 0 160px", letterSpacing: "0.04em", fontFamily: SANS, outline: "none",
        }}>
          {CATEGORIES.map(c => <option key={c} style={{ background: "#141414" }}>{c}</option>)}
          <option style={{ background: "#141414", color: GOLD }}>🎙️ Lectures</option>
        </select>
      </div>

      <div style={{ marginBottom: 12, color: MUTED, fontSize: 13 }}>{filtered.length} results</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, border: `1px solid ${BORDER}` }}>
        {filtered.map((b, i) => (
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
              {b.url !== "#" && (
                <a href={b.url} target="_blank" rel="noreferrer" style={{ color: MUTED, fontSize: 11, textDecoration: "none", letterSpacing: "0.04em" }}>{b.url.startsWith("https://pub-") && b.url.endsWith(".pdf") ? "↓ PDF" : "↗ Visit"}</a>
              )}
            </div>
            <div style={{ fontWeight: 500, fontSize: 14, color: TEXT, lineHeight: 1.5, fontFamily: SERIF }}>{b.title}</div>
            <div style={{ fontSize: 12, color: MUTED, letterSpacing: "0.02em" }}>{b.author}</div>
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

// ─── CALENDAR ─────────────────────────────────────────────────────
const GREG_MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function IslamicCalendar() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [popup, setPopup] = useState(null);

  const upcoming = getUpcomingEvents(today);

  // Build calendar days for current view month
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function getDayInfo(d) {
    const date = new Date(viewYear, viewMonth, d);
    const h = gregorianToHijri(viewYear, viewMonth + 1, d);
    const isToday = date.getTime() === today.getTime();
    const isWhite = h.day === 13 || h.day === 14 || h.day === 15;
    const isRamadan = isRamadanDay(date);
    const events = getEventsForDate(viewYear, viewMonth, d);
    return { date, h, isToday, isWhite, isRamadan, events };
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
    else setViewMonth(m => m-1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
    else setViewMonth(m => m+1);
  }

  const todayH = gregorianToHijri(today.getFullYear(), today.getMonth()+1, today.getDate());

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="📆" title="Islamic Calendar" sub="Hijri dates, significant events, and White Days for every month" />

      {/* Today strip */}
      <Card style={{ background: "linear-gradient(145deg,#0E0C08,#161410)", border: `1px solid ${GOLD}30`, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em" }}>Today</div>
            <div style={{ fontSize: 22, fontWeight: 400, marginTop: 4, fontFamily: SERIF, color: TEXT, letterSpacing: "0.04em" }}>
              {today.getDate()} {GREG_MONTHS_FULL[today.getMonth()]} {today.getFullYear()}
            </div>
            <div style={{ fontSize: 13, color: GOLD, marginTop: 4, letterSpacing: "0.06em" }}>
              {todayH.day} {HIJRI_MONTHS[todayH.month-1]} {todayH.year} AH
            </div>
          </div>
          {upcoming[0] && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em" }}>Next Event</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, color: TEXT, fontFamily: SERIF }}>
                {upcoming[0].emoji} {upcoming[0].name}
              </div>
              <div style={{ fontSize: 12, color: GOLD, marginTop: 4, letterSpacing: "0.04em" }}>
                {upcoming[0].daysLeft === 0 ? "Today" : upcoming[0].daysLeft === 1 ? "Tomorrow" : `In ${upcoming[0].daysLeft} days`}
                {" · "}{upcoming[0].date.getDate()} {GREG_MONTHS_FULL[upcoming[0].date.getMonth()]}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Upcoming events row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {upcoming.slice(0, 5).map((ev, i) => {
          const col = EVENT_COLORS[ev.type] || EVENT_COLORS.notable;
          return (
            <div key={i} onClick={() => setPopup(ev)} style={{
              flex: "0 0 auto", minWidth: 155,
              background: col.bg, border: `1px solid ${col.border}`,
              borderRadius: 2, padding: "14px 16px",
              cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{ev.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: col.text, lineHeight: 1.3 }}>{ev.name}</div>
              <div style={{ fontSize: 12, color: col.text, opacity: 0.8, marginTop: 4 }}>
                {ev.daysLeft === 0 ? "Today" : ev.daysLeft === 1 ? "Tomorrow" : `${ev.daysLeft} days`}
              </div>
              <div style={{ fontSize: 11, color: col.text, opacity: 0.65 }}>
                {ev.date.getDate()} {GREG_MONTHS_FULL[ev.date.getMonth()].slice(0,3)} {ev.date.getFullYear()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar */}
      <Card>
        {/* Month nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={prevMonth} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 2, width: 34, height: 34, cursor: "pointer", fontSize: 18, color: MUTED }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 400, fontSize: 20, fontFamily: SERIF, letterSpacing: "0.06em", color: TEXT }}>{GREG_MONTHS_FULL[viewMonth]} {viewYear}</div>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.08em", marginTop: 2 }}>
              {(() => { const h = gregorianToHijri(viewYear, viewMonth+1, 15); return `${HIJRI_MONTHS[h.month-1]} ${h.year} AH`; })()}
            </div>
          </div>
          <button onClick={nextMonth} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 2, width: 34, height: 34, cursor: "pointer", fontSize: 18, color: MUTED }}>›</button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: d === "Fri" ? GREEN : MUTED, padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const { h, isToday, isWhite, isRamadan, events } = getDayInfo(d);
            const hasEvent = events.length > 0;
            const eventColor = hasEvent ? (EVENT_COLORS[events[0].type] || EVENT_COLORS.notable) : null;

            let bg = "transparent";
            let borderColor = "transparent";
            let textColor = TEXT;

            if (isToday) { bg = GOLD; textColor = "#0A0A0A"; borderColor = GOLD; }
            else if (hasEvent) { bg = eventColor.bg; borderColor = eventColor.border; textColor = eventColor.text; }
            else if (isWhite) { bg = EVENT_COLORS.white.bg; borderColor = EVENT_COLORS.white.border; }
            else if (isRamadan) { bg = EVENT_COLORS.ramadan.bg; borderColor = EVENT_COLORS.ramadan.border + "60"; }

            return (
              <div key={d} onClick={() => { if (hasEvent) setPopup(events[0]); else if (isWhite) setPopup(WHITE_DAYS_INFO); }} style={{
                borderRadius: 8, border: `1px solid ${borderColor}`,
                background: bg, padding: "6px 4px",
                minHeight: 56, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 2, position: "relative",
                transition: "transform 0.1s",
                cursor: (hasEvent || isWhite) ? "pointer" : "default",
              }}
                onMouseEnter={e => { if (!isToday) e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <span style={{ fontSize: 15, fontWeight: isToday ? 700 : 400, color: textColor }}>{d}</span>
                <span style={{ fontSize: 10, color: isToday ? "rgba(255,255,255,0.8)" : MUTED }}>{h.day}</span>
                {isWhite && !hasEvent && !isToday && (
                  <span title="White Day — voluntary fast">⚪</span>
                )}
                {hasEvent && <span style={{ fontSize: 12 }}>{events[0].emoji}</span>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          {[
            { bg: GREEN, border: GREEN, label: "Today", info: null },
            { bg: WHITE_DAYS_INFO.type ? EVENT_COLORS.white.bg : "#EFF6FF", border: EVENT_COLORS.white.border, label: "White Days (13–15 Hijri)", info: WHITE_DAYS_INFO },
            { bg: EVENT_COLORS.ramadan.bg, border: EVENT_COLORS.ramadan.border, label: "Ramadan", info: ISLAMIC_EVENTS.find(e => e.ramadanStart) },
            { bg: EVENT_COLORS.eid.bg, border: EVENT_COLORS.eid.border, label: "Eid", info: ISLAMIC_EVENTS.find(e => e.type==="eid") },
            { bg: EVENT_COLORS.major.bg, border: EVENT_COLORS.major.border, label: "Major Event", info: ISLAMIC_EVENTS.find(e => e.type==="major") },
            { bg: EVENT_COLORS.notable.bg, border: EVENT_COLORS.notable.border, label: "Notable Day", info: ISLAMIC_EVENTS.find(e => e.type==="notable") },
          ].map(l => (
            <div key={l.label} onClick={() => l.info && setPopup(l.info)}
              style={{ display: "flex", alignItems: "center", gap: 6, cursor: l.info ? "pointer" : "default",
                padding: "4px 8px", borderRadius: 6, transition: "background 0.15s" }}
              onMouseEnter={e => { if(l.info) e.currentTarget.style.background="#F3F4F6"; }}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.bg, border: `1.5px solid ${l.border}`, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: MUTED }}>{l.label}</span>
              {l.info && <span style={{ fontSize: 10, color: MUTED }}>ℹ️</span>}
            </div>
          ))}
        </div>

        <p style={{ margin: "12px 0 0", fontSize: 12, color: MUTED }}>
          Small numbers = Hijri date · Click any highlighted day or legend item to learn more.
        </p>
      </Card>

      <EventPopup event={popup} onClose={() => setPopup(null)} />
    </div>
  );
}

// ─── SETTINGS HELPERS ─────────────────────────────────────────────
function loadSavedLocation() {
  try { return JSON.parse(localStorage.getItem("mp-location") || "null"); } catch { return null; }
}
function saveSavedLocation(loc) {
  try { localStorage.setItem("mp-location", JSON.stringify(loc)); } catch {}
}

// ─── SETTINGS MODAL ───────────────────────────────────────────────
function SettingsModal({ onClose, savedLocation, onSave }) {
  const [city, setCity] = useState(savedLocation?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [suggLoading, setSuggLoading] = useState(false);
  const [selected, setSelected] = useState(savedLocation || null);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (city.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    if (selected && city === selected.name) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSuggLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=6&addressdetails=1`, { headers: { "Accept-Language": "en" } });
        const json = await res.json();
        const cities = json
          .filter(r => r.class === "place" || r.class === "boundary" || ["city","town","village","municipality","administrative"].includes(r.type))
          .map(r => ({ name: r.display_name.split(",").slice(0,2).join(", "), lat: parseFloat(r.lat), lon: parseFloat(r.lon), country: r.address?.country_code?.toUpperCase() || "" }));
        setSuggestions(cities.slice(0, 6));
        setShowSugg(true);
      } catch { setSuggestions([]); }
      setSuggLoading(false);
    }, 350);
  }, [city]);

  useEffect(() => {
    function handle(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSugg(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function pick(s) { setCity(s.name); setSelected(s); setShowSugg(false); setSuggestions([]); }

  function save() {
    if (!selected) return;
    saveSavedLocation(selected);
    onSave(selected);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  }

  function clear() { setCity(""); setSelected(null); saveSavedLocation(null); onSave(null); }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#0E0E0E", borderRadius:0, maxWidth:460, width:"100%", boxShadow:`0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px ${GOLD}20`, overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#0A0A08,#141210)", borderBottom:`1px solid ${GOLD}25`, padding:"22px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:20, fontWeight:400, color:TEXT, fontFamily:SERIF, letterSpacing:"0.06em" }}>Settings</div>
            <div style={{ fontSize:11, color:MUTED, marginTop:4, letterSpacing:"0.08em" }}>Location · Prayer Times · Qibla</div>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:`1px solid ${BORDER}`, borderRadius:2, color:MUTED, width:32, height:32, cursor:"pointer", fontSize:14 }}>✕</button>
        </div>

        <div style={{ padding:24 }}>
          {/* Current location display */}
          {savedLocation && (
            <div style={{ background:GREEN_L, border:`1px solid ${GOLD}40`, borderRadius:2, padding:"14px 18px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:10, fontWeight:600, color:GOLD, textTransform:"uppercase", letterSpacing:"0.12em" }}>Active Location</div>
                <div style={{ fontSize:14, fontWeight:500, color:TEXT, marginTop:4, letterSpacing:"0.03em" }}>📍 {savedLocation.name}</div>
              </div>
              <button onClick={clear} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:2, padding:"5px 12px", fontSize:11, color:MUTED, cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase" }}>Remove</button>
            </div>
          )}

          {/* City search */}
          <div style={{ position:"relative", marginBottom:16 }} ref={wrapRef}>
            <label style={{ fontSize:13, fontWeight:600, color:TEXT, display:"block", marginBottom:6 }}>Search City</label>
            <div style={{ position:"relative" }}>
              <input
                placeholder="e.g. London, Prishtina, Dubai…"
                value={city}
                onChange={e => { setCity(e.target.value); setSelected(null); }}
                onFocus={() => suggestions.length > 0 && setShowSugg(true)}
                style={{ width:"100%", padding:"10px 36px 10px 12px", borderRadius:8, border:`1px solid ${BORDER}`, fontSize:14, color:TEXT, background:SURFACE, outline:"none", boxSizing:"border-box" }}
                onFocusCapture={e => e.target.style.borderColor = GREEN}
                onBlur={e => e.target.style.borderColor = BORDER}
              />
              {suggLoading && <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:12, color:MUTED }}>⏳</div>}
            </div>

            {showSugg && suggestions.length > 0 && (
              <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:200, background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", marginTop:4, overflow:"hidden" }}>
                {suggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => pick(s)} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 14px", border:"none", background:"none", cursor:"pointer", fontSize:14, color:TEXT, borderBottom: i < suggestions.length-1 ? `1px solid ${BORDER}` : "none", transition:"background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background=GREEN_L}
                    onMouseLeave={e => e.currentTarget.style.background="none"}
                  >
                    <span style={{ marginRight:8 }}>📍</span>{s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div style={{ background:GREEN_L, border:`1px solid ${GOLD}30`, borderRadius:2, padding:"10px 14px", marginBottom:16, fontSize:12, color:GOLD, letterSpacing:"0.04em" }}>
              ✦ {selected.name} &nbsp;·&nbsp; {selected.lat.toFixed(3)}°N {selected.lon.toFixed(3)}°E
            </div>
          )}

          <button onClick={save} disabled={!selected || saved} style={{ width:"100%", padding:"13px", borderRadius:2, border:`1px solid ${selected && !saved ? GOLD : BORDER}`, background: saved ? GREEN_L : selected ? `linear-gradient(135deg,${GOLD},#A8893C)` : "#0E0E0E", color: saved ? GOLD : selected ? "#0A0A0A" : MUTED, fontSize:12, fontWeight:700, cursor: selected && !saved ? "pointer" : "not-allowed", transition:"all 0.2s", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:SANS }}>
            {saved ? "✅ Saved!" : "Save Location"}
          </button>

          <p style={{ margin:"14px 0 0", fontSize:12, color:MUTED, textAlign:"center" }}>
            Prayer times and Qibla will auto-load with this location on every visit.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
const VALID_PAGES = ["home","prayer","qibla","zakat","inheritance","calendar","dates","library","audio"];

export default function App() {
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return VALID_PAGES.includes(hash) ? hash : "home";
  });
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [savedLocation, setSavedLocation] = useState(() => loadSavedLocation());
  const [showSettings, setShowSettings] = useState(false);

  function handleSaveLocation(loc) { setSavedLocation(loc); }

  function navigate(p) {
    setPage(p);
    window.location.hash = p === "home" ? "" : p;
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: SANS, color: TEXT }}>
      <style>{`
        h1,h2,h3 { font-family: ${SERIF}; }
        * { box-sizing: border-box; }
        ::selection { background: ${GOLD}33; color: ${TEXT}; }
        ::-webkit-scrollbar { width: 5px; background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 0; }
        input::placeholder, textarea::placeholder { color: ${MUTED}; opacity: 0.6; }
        option { background: #141414; color: ${TEXT}; }
        body { background: ${BG}; }
      `}</style>
      <Nav page={page} setPage={navigate} onSettings={() => setShowSettings(true)} hasLocation={!!savedLocation} />
      <main>
        {page === "home" && <Home quote={quote} setPage={navigate} savedLocation={savedLocation} />}
        {page === "prayer" && <PrayerTimes savedLocation={savedLocation} />}
        {page === "qibla" && <Qibla savedLocation={savedLocation} />}
        {page === "zakat" && <Zakat />}
        {page === "inheritance" && <Inheritance />}
        {page === "calendar" && <IslamicCalendar />}
        {page === "dates" && <DateConverter />}
        {page === "library" && <Library navigate={navigate} />}
        {page === "audio" && <AudioPage />}
      </main>
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          savedLocation={savedLocation}
          onSave={handleSaveLocation}
        />
      )}
    </div>
  );
}

// ─── AUDIO / LECTURES ─────────────────────────────────────────────
function AudioPage() {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  function play(lecture) {
    if (current?.id === lecture.id) {
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else { audioRef.current.play(); setPlaying(true); }
    } else {
      setCurrent(lecture);
      setProgress(0);
      setPlaying(true);
    }
  }

  useEffect(() => {
    if (!current || !audioRef.current) return;
    audioRef.current.src = current.url;
    audioRef.current.play().catch(() => {});
    // Media Session API — shows controls on phone lock screen / notification bar
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.title,
        artist: "Muslim's Path",
        album: "Ligjerata Islame",
      });
      navigator.mediaSession.setActionHandler("play", () => { audioRef.current.play(); setPlaying(true); });
      navigator.mediaSession.setActionHandler("pause", () => { audioRef.current.pause(); setPlaying(false); });
      navigator.mediaSession.setActionHandler("previoustrack", () => skip(-1));
      navigator.mediaSession.setActionHandler("nexttrack", () => skip(1));
      navigator.mediaSession.setActionHandler("seekbackward", () => { audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5); });
      navigator.mediaSession.setActionHandler("seekforward", () => { audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5); });
    }
  }, [current]);

  function onTimeUpdate() {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  }

  function seek(e) {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  }

  function skip(dir) {
    if (!current) return;
    const idx = LECTURES.findIndex(l => l.id === current.id);
    const next = LECTURES[idx + dir];
    if (next) play(next);
  }

  function fmt(s) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={() => { skip(1); }} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} />
      <PageTitle icon="🎙️" title="Ligjerata Islame" sub="Leksione dhe mësime nga studiuesit Islam" />

      {/* Player */}
      {current && (
        <div style={{ background: "linear-gradient(145deg,#0E0C08,#161410)", border: `1px solid ${GOLD}40`, padding: "24px 28px", marginBottom: 24, boxShadow: `0 8px 40px rgba(0,0,0,0.6)` }}>
          <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6 }}>Now Playing</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: TEXT, fontFamily: SERIF, letterSpacing: "0.03em", marginBottom: 20 }}>{current.title}</div>

          {/* Progress bar */}
          <div onClick={seek} style={{ height: 3, background: BORDER, cursor: "pointer", marginBottom: 10, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: GOLD, transition: "width 0.3s" }} />
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: GOLD }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{fmt(progress)}</span>
            <span style={{ fontSize: 11, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{fmt(duration)}</span>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
            {/* Prev track */}
            <button onClick={() => skip(-1)} title="Previous track" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 18 }}>⏮</button>
            {/* -5s */}
            <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5); }} title="-5 seconds" style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: 2,
              cursor: "pointer", color: MUTED, fontSize: 11, fontWeight: 700,
              padding: "4px 8px", letterSpacing: "0.04em", fontFamily: SANS,
            }}>−5s</button>
            {/* Play/Pause */}
            <button onClick={() => play(current)} style={{
              width: 52, height: 52, borderRadius: "50%", border: `1px solid ${GOLD}`,
              background: playing ? GOLD : "transparent", color: playing ? "#0A0A0A" : GOLD,
              cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>{playing ? "⏸" : "▶"}</button>
            {/* +5s */}
            <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5); }} title="+5 seconds" style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: 2,
              cursor: "pointer", color: MUTED, fontSize: 11, fontWeight: 700,
              padding: "4px 8px", letterSpacing: "0.04em", fontFamily: SANS,
            }}>+5s</button>
            {/* Next track */}
            <button onClick={() => skip(1)} title="Next track" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 18 }}>⏭</button>
          </div>
        </div>
      )}

      {/* Playlist */}
      <div style={{ border: `1px solid ${BORDER}` }}>
        {LECTURES.map((l, i) => {
          const isActive = current?.id === l.id;
          return (
            <div key={l.id} onClick={() => play(l)} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 20px", cursor: "pointer",
              background: isActive ? GREEN_L : "transparent",
              borderBottom: i < LECTURES.length - 1 ? `1px solid ${BORDER}` : "none",
              borderLeft: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#0E0E0E"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${isActive ? GOLD : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isActive && playing
                  ? <span style={{ fontSize: 10, color: GOLD }}>▶</span>
                  : <span style={{ fontSize: 11, color: MUTED }}>{l.id}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: isActive ? TEXT : MUTED, fontWeight: isActive ? 500 : 400, letterSpacing: "0.02em" }}>{l.title}</div>
              </div>
              {isActive && playing && (
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 16 }}>
                  {[1,2,3].map(b => (
                    <div key={b} style={{ width: 3, background: GOLD, borderRadius: 1, height: `${8 + b * 4}px`, animation: `bounce${b} 0.8s ease-in-out infinite alternate` }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes bounce1 { from { height: 6px } to { height: 14px } }
        @keyframes bounce2 { from { height: 10px } to { height: 18px } }
        @keyframes bounce3 { from { height: 4px } to { height: 12px } }
      `}</style>
    </div>
  );
}
