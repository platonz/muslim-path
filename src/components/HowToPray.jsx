import { useState, useMemo } from "react";
import {
  SURFACE, SERIF, SANS, MONO,
  DARK_900, DARK_700,
  WARM_700, WARM_600, WARM_500, WARM_400, WARM_300, WARM_200, WARM_100,
  GOLD_700, GOLD_600, GOLD_500, GOLD_400, GOLD_300, GOLD_200, GOLD_100, GOLD_50,
} from "../constants";

const C = {
  bg:      '#FAF7EE',
  surface:  SURFACE,
  dark900:  DARK_900,
  dark700:  DARK_700,
  warm700:  WARM_700,
  warm600:  WARM_600,
  warm500:  WARM_500,
  warm400:  WARM_400,
  warm300:  WARM_300,
  warm200:  WARM_200,
  warm100:  WARM_100,
  gold700:  GOLD_700,
  gold600:  GOLD_600,
  gold500:  GOLD_500,
  gold400:  GOLD_400,
  gold300:  GOLD_300,
  gold200:  GOLD_200,
  gold100:  GOLD_100,
  gold50:   GOLD_50,
};

// ─── PRAYER DATA (English) ────────────────────────────────────────
const PRAYERS = [
  {
    id: 'fajr', nameAr: 'الفَجْر', name: 'Fajr', nameFull: 'Morning Prayer',
    period: 'Before sunrise', timeLabel: 'Dawn', timeApprox: '05:12',
    window: [4*60+30, 5*60+45], rakatFard: 2, rakatSunnah: 2,
    blurb: 'The first prayer of the day. Performed in the stillness of dawn, before the sun breaks the horizon.',
    ayet: 'إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا',
    ayetEn: 'Indeed, the recitation at dawn is ever witnessed.',
    ayetRef: 'Al-Isra 17:78',
    sky: 'linear-gradient(180deg, #141A38 0%, #2A1F4A 18%, #4A2E58 38%, #8A4E5E 60%, #C87858 78%, #E8AE7A 92%, #F2C898 100%)',
    horizonBand: '#1A1228', sunY: 86, sunColor: '#F8D89A', sunGlow: 'rgba(248,200,140,0.45)',
    stars: [{ x:18,y:12,s:0.9 },{ x:32,y:8,s:0.7 },{ x:64,y:14,s:1 },{ x:78,y:10,s:0.8 },{ x:88,y:22,s:0.6 }],
    accent: '#C87858', accentDark: '#7A3848', onSky: '#F5DCB0',
    tips: [
      { title: "Don't delay past sunrise", body: 'Fajr begins at true dawn (Fajr Sadiq) and its time ends at sunrise. If missed unintentionally, make it up after the brief prohibited window passes.' },
      { title: 'Recite aloud (quietly)', body: 'Al-Fatiha and the short surah are recited aloud (jahr) in both rakats of Fajr — not so loud as to disturb others nearby.' },
      { title: 'Qunut varies by school', body: "Some madhabs (e.g. Shafi'i) recite Qunut du'a in the second rakat of Fajr; others don't. Follow your imam or the school you study under." },
    ],
  },
  {
    id: 'dhuhr', nameAr: 'الظُّهْر', name: 'Dhuhr', nameFull: 'Midday Prayer',
    period: 'After the sun passes its zenith', timeLabel: 'Midday', timeApprox: '12:45',
    window: [12*60+15, 15*60+45], rakatFard: 4, rakatSunnah: 6,
    blurb: 'A pause in the middle of the day — a return to Allah amid the noise of work and duties.',
    ayet: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ',
    ayetEn: 'Establish prayer at the decline of the sun.',
    ayetRef: 'Al-Isra 17:78',
    sky: 'linear-gradient(180deg, #4A8AB8 0%, #6FA8CC 25%, #98C0DC 55%, #C8DCE8 85%, #E8EFF2 100%)',
    horizonBand: '#5A92B8', sunY: 22, sunColor: '#FFF8E0', sunGlow: 'rgba(255,248,224,0.55)',
    stars: null,
    accent: '#6F9ECC', accentDark: '#2A5878', onSky: '#FFFFFF',
    tips: [
      { title: 'Wait a moment after noon', body: 'Do not pray Dhuhr exactly when the sun is at its peak — wait until the shadow begins turning eastward.' },
      { title: 'Recitation is silent', body: 'In Dhuhr, Asr, and the third/fourth rakats of other prayers, recitation is done silently (sirr).' },
      { title: "Don't mix up the 4 rakats", body: 'After the second rakat you sit for Tashahhud, then rise for the remaining two. In the final rakats, Al-Fatiha must be recited.' },
    ],
  },
  {
    id: 'asr', nameAr: 'العَصْر', name: 'Asr', nameFull: 'Afternoon Prayer',
    period: 'Late afternoon', timeLabel: 'Afternoon', timeApprox: '16:30',
    window: [15*60+45, 18*60+30], rakatFard: 4, rakatSunnah: 0,
    blurb: 'Between midday and sunset — the middle prayer, which the Quran specifically urges to guard.',
    ayet: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ',
    ayetEn: 'Guard strictly your prayers, especially the middle prayer.',
    ayetRef: 'Al-Baqarah 2:238',
    sky: 'linear-gradient(180deg, #6FA0BC 0%, #98B0B8 25%, #C8A878 55%, #E0B870 80%, #ECC890 100%)',
    horizonBand: '#A0826A', sunY: 48, sunColor: '#F8C870', sunGlow: 'rgba(248,200,112,0.5)',
    stars: null,
    accent: '#C89858', accentDark: '#6A4820', onSky: '#FFFFFF',
    tips: [
      { title: "Don't delay until the sun yellows", body: "The Prophet ﷺ warned against delaying Asr. Pray it as soon as you hear the adhan — don't push it to the last minutes." },
      { title: 'Can be shortened while travelling', body: 'Asr is 4 rakats normally. On a valid journey, according to your school, you may shorten it to 2 rakats (qasr).' },
      { title: 'Same structure as Dhuhr', body: 'Structurally identical to Dhuhr — same rakat count, silent recitation throughout.' },
    ],
  },
  {
    id: 'maghrib', nameAr: 'المَغْرِب', name: 'Maghrib', nameFull: 'Sunset Prayer',
    period: 'Immediately after sunset', timeLabel: 'Sunset', timeApprox: '19:48',
    window: [18*60+30, 20*60+15], rakatFard: 3, rakatSunnah: 2,
    blurb: 'Prayed shortly after sunset — when the day closes with gratitude as the sky lights up with colour.',
    ayet: 'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ',
    ayetEn: 'So exalt Allah when you reach the evening and when you reach the morning.',
    ayetRef: 'Ar-Rum 30:17',
    sky: 'linear-gradient(180deg, #2A1F58 0%, #5A2E5A 18%, #9A3A52 38%, #D0583A 58%, #E88838 75%, #F2B068 88%, #F8D098 100%)',
    horizonBand: '#3A1820', sunY: 70, sunColor: '#FFD088', sunGlow: 'rgba(255,200,120,0.55)',
    stars: [{ x:18,y:12,s:1 }],
    accent: '#E08838', accentDark: '#7A2820', onSky: '#FFE8C8',
    tips: [
      { title: "Don't delay — the window is short", body: 'Maghrib has the shortest prayer window: from sunset until the red glow on the horizon disappears (~1 hr 15 min).' },
      { title: '3 rakats, not 4', body: "Maghrib is the only prayer with an odd number of obligatory rakats. After the second rakat you sit for Tashahhud, then rise for the third." },
      { title: '2 sunnah rakats after fard', body: 'Immediately after the fard, pray 2 sunnah rakats — short, and better done at home.' },
    ],
  },
  {
    id: 'isha', nameAr: 'العِشَاء', name: 'Isha', nameFull: 'Night Prayer',
    period: 'After the sky has fully darkened', timeLabel: 'Night', timeApprox: '21:20',
    window: [20*60+15, (24+4)*60+30], rakatFard: 4, rakatSunnah: 2, rakatWitr: 3,
    blurb: "The closing of the day. Prayed in the quiet of night after the day has ended and the stars have filled the sky.",
    ayet: 'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ',
    ayetEn: 'And from the night, rise to pray as an additional offering for you.',
    ayetRef: 'Al-Isra 17:79',
    sky: 'linear-gradient(180deg, #050828 0%, #0F1438 25%, #1A2050 50%, #1F2858 75%, #28305A 100%)',
    horizonBand: '#080A20', sunY: -10, sunColor: '#E8E0F0', sunGlow: 'rgba(232,224,240,0.35)',
    stars: [{ x:12,y:14,s:1 },{ x:22,y:28,s:1.5 },{ x:35,y:12,s:0.8 },{ x:48,y:22,s:1.2 },{ x:62,y:18,s:1 },{ x:78,y:30,s:1.3 },{ x:88,y:14,s:0.9 },{ x:18,y:38,s:0.7 },{ x:70,y:8,s:1 }],
    isNight: true,
    accent: '#7A88B8', accentDark: '#2A305A', onSky: '#E8E0F0',
    tips: [
      { title: 'Scholars differ on the end time', body: 'The safest position for beginners is to pray Isha before Islamic midnight. Some scholars extend the time until Fajr; do not delay without reason.' },
      { title: "Don't forget Witr", body: 'After Isha, pray Witr. Many Muslims pray 3 rakats, especially in the Hanafi school, though other valid forms exist.' },
      { title: 'Aloud in the first 2 rakats', body: 'Like Fajr and Maghrib: the first two rakats are recited aloud, while rakats 3 and 4 are silent. Al-Fatiha is always required.' },
    ],
  },
];

// ─── STEPS DATA (English) ─────────────────────────────────────────
const STEPS = [
  {
    n: 1, posture: 'qiyam', name: 'Intention (Niyyah)', nameAr: 'النِّيَّة', postureEn: 'Standing, still',
    instruction: 'Make the intention in your heart — the sincere resolve of which prayer you are performing, for the sake of Allah alone. There is no specific verbal formula required before the opening Takbir.',
    arabic: null, translit: null, translation: null,
  },
  {
    n: 2, posture: 'takbir', name: 'Opening Takbir', nameAr: 'تَكْبِيرَة الإِحْرَام', postureEn: 'Hands raised to shoulders or ears',
    instruction: 'Raise your hands to the level of your shoulders or ears, fingers relaxed, and say quietly:',
    arabic: 'اللَّهُ أَكْبَر', translit: 'Allahu Akbar', translation: 'Allah is the Greatest.',
  },
  {
    n: 3, posture: 'qiyam-folded', name: 'Opening Supplication (Thana)', nameAr: 'الثَّنَاء', postureEn: 'Hands folded on chest',
    instruction: 'Place your right hand over your left on your chest and recite the opening supplication:',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ',
    translit: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghairuk.",
    translation: "Glory be to You, O Allah, and praise be to You. Blessed is Your Name, exalted is Your Majesty, and there is no deity worthy of worship besides You.",
  },
  {
    n: 4, posture: 'qiyam-folded', name: 'Al-Fatiha', nameAr: 'الفَاتِحَة', postureEn: 'Hands still folded',
    instruction: 'Recite the opening chapter of the Quran — the seven verses repeated in every rakat of every prayer. End with: Ameen.',
    arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
    translit: "Bismillahir-rahmanir-rahim. Alhamdu lillahi rabbil-'alamin. Ar-rahmanir-rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin.",
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of all worlds, the Most Gracious, the Most Merciful, Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path — the path of those You have blessed, not of those who have earned anger, nor of those who have gone astray.',
  },
  {
    n: 5, posture: 'qiyam-folded', name: 'Short Surah', nameAr: 'سُورَة قَصِيرَة', postureEn: 'Standing',
    instruction: 'After Al-Fatiha, recite a short surah. Al-Ikhlas is a perfect starting point for beginners:',
    arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
    translit: 'Qul huwal-lahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakul-lahu kufuwan ahad.',
    translation: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. And there is none comparable to Him.',
  },
  {
    n: 6, posture: 'ruku', name: 'Bowing (Ruku)', nameAr: 'الرُّكُوع', postureEn: 'Bent forward, hands on knees',
    instruction: 'Say "Allahu Akbar" and bow — back straight, hands gripping your knees, eyes looking toward your place of prostration. Repeat three times:',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', translit: 'Subhana Rabbiya al-Azim', translation: 'Glory be to my Lord, the Magnificent.',
  },
  {
    n: 7, posture: 'itidal', name: 'Standing from Ruku (I\'tidal)', nameAr: 'الِاعْتِدَال', postureEn: 'Upright again',
    instruction: 'Rise from the bow, saying:',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
    translit: "Sami' Allahu liman hamidah. Rabbana wa lakal-hamd.",
    translation: 'Allah hears those who praise Him. Our Lord, all praise is Yours.',
  },
  {
    n: 8, posture: 'sujud', name: 'Prostration (Sujud)', nameAr: 'السُّجُود', postureEn: 'Seven limbs on the ground',
    instruction: 'Say "Allahu Akbar" and go into prostration. Seven body parts must touch the ground: forehead (with nose), both palms, both knees, and the toes of both feet. Repeat three times:',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', translit: "Subhana Rabbiya al-A'la", translation: 'Glory be to my Lord, the Most High.',
  },
  {
    n: 9, posture: 'jalsa', name: 'Sitting Between Prostrations (Jalsa)', nameAr: 'الجَلْسَة', postureEn: 'Brief seated pause',
    instruction: 'Rise from prostration and sit briefly on your left foot, then say:',
    arabic: 'رَبِّ اغْفِرْ لِي', translit: 'Rabbigh-fir li', translation: 'My Lord, forgive me.',
  },
  {
    n: 10, posture: 'sujud', name: 'Second Prostration', nameAr: 'السُّجُود الثَّانِي', postureEn: 'Back into prostration',
    instruction: 'Prostrate again and repeat three times:',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', translit: "Subhana Rabbiya al-A'la", translation: 'Glory be to my Lord, the Most High.',
  },
  {
    n: 11, posture: 'qiyam', name: 'Remaining Rakats', nameAr: 'الرَّكَعَات التَّالِيَة', postureEn: 'Rise to standing',
    instruction: 'Rise and begin the next rakat — Al-Fatiha, short surah (first 2 rakats), ruku, i\'tidal, two prostrations. Total rakats: Fajr 2 · Dhuhr 4 · Asr 4 · Maghrib 3 · Isha 4.',
    arabic: null, translit: null, translation: null, isNote: true, repeatFrom: 4, repeatTo: 10,
  },
  {
    n: 12, posture: 'tashahhud', name: 'Tashahhud', nameAr: 'التَّشَهُّد', postureEn: 'Seated, right index finger raised',
    instruction: 'After the second prostration of the second rakat, sit and recite At-Tahiyyat. In 3- or 4-rakat prayers this is the middle Tashahhud — rise afterwards; in the final sitting continue with Salawat:',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translit: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu alayna wa ala ibadil-lahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan abduhu wa rasuluh.',
    translation: "All greetings, prayers, and good words are for Allah. Peace be upon you, O Prophet, and the mercy and blessings of Allah. Peace be upon us and upon all of Allah's righteous servants. I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is His servant and messenger.",
  },
  {
    n: 13, posture: 'tashahhud', name: 'Salawat (Ibrahim Prayer)', nameAr: 'الصَّلَاةُ عَلَى النَّبِيِّ', postureEn: 'Seated in final Tashahhud',
    instruction: 'In the final Tashahhud, after At-Tahiyyat, send blessings upon the Prophet ﷺ:',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translit: 'Allahumma salli ala Muhammadin wa ala ali Muhammad, kama sallayta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik ala Muhammadin wa ala ali Muhammad, kama barakta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid.',
    translation: 'O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.',
  },
  {
    n: 14, posture: 'tashahhud', name: "Du'a Before Salam", nameAr: 'الدُّعَاءُ قَبْلَ السَّلَام', postureEn: 'Seated before closing',
    instruction: 'Before the Salam, seek protection with Allah. This is one of the well-known supplications before ending the prayer:',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    translit: "Allahumma inni a'udhu bika min adhabi jahannam, wa min adhabill-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal.",
    translation: 'O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.',
  },
  {
    n: 15, posture: 'salam', name: 'Salam', nameAr: 'السَّلَام', postureEn: 'Turn head right, then left',
    instruction: 'End the prayer by turning your head to the right, then to the left, saying each time:',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', translit: 'As-salamu alaykum wa rahmatullah', translation: 'Peace and the mercy of Allah be upon you.',
  },
];

// ─── PRAYER SEQUENCES ─────────────────────────────────────────────
const PRAYER_SEQUENCES = {
  fajr:    [
    { type: 'sunet', rakat: 2, label: 'Sunnah',     desc: '2 rakats · sunnah mu\'akkadah' },
    { type: 'farz',  rakat: 2, label: 'Fard',        desc: '2 rakats · obligatory' },
  ],
  dhuhr:   [
    { type: 'sunet', rakat: 4, label: 'Sunnah (before)', desc: '4 rakats · sunnah before fard' },
    { type: 'farz',  rakat: 4, label: 'Fard',        desc: '4 rakats · obligatory' },
    { type: 'sunet', rakat: 2, label: 'Sunnah (after)',  desc: '2 rakats · sunnah after fard' },
  ],
  asr:     [
    { type: 'sunet', rakat: 4, label: 'Sunnah',     desc: '4 rakats · sunnah' },
    { type: 'farz',  rakat: 4, label: 'Fard',        desc: '4 rakats · obligatory' },
  ],
  maghrib: [
    { type: 'farz',  rakat: 3, label: 'Fard',        desc: '3 rakats · obligatory' },
    { type: 'sunet', rakat: 2, label: 'Sunnah',      desc: '2 rakats · sunnah after fard' },
  ],
  isha:    [
    { type: 'sunet', rakat: 4, label: 'Sunnah (before)', desc: '4 rakats · optional sunnah', optional: true },
    { type: 'farz',  rakat: 4, label: 'Fard',              desc: '4 rakats · obligatory' },
    { type: 'sunet', rakat: 2, label: 'Sunnah (after)',    desc: '2 rakats · sunnah mu\'akkadah' },
    { type: 'nafl',  rakat: 2, label: 'Nafl',              desc: '2 rakats · voluntary', optional: true },
    { type: 'witr',  rakat: 3, label: 'Witr',              desc: '3 rakats · obligatory (Hanafi)' },
    { type: 'nafl',  rakat: 2, label: 'Nafl (after Witr)', desc: '2 rakats · voluntary', optional: true },
  ],
};

// ─── STEP BUILDER ─────────────────────────────────────────────────
const RISE_TPL = {
  posture: 'qiyam', postureEn: 'Rise to standing',
  instruction: "Say 'Allahu Akbar' and rise slowly to your feet.",
  arabic: 'اللَّهُ أَكْبَر', translit: 'Allahu Akbar', translation: 'Allah is the Greatest.',
};

function buildPrayerSteps(prayer, rakatOverride) {
  const total = rakatOverride ?? prayer.rakatFard;
  const out = [];
  let n = 1;
  const add = (base, extra = {}) => { out.push({ ...base, n: n++, ...extra }); };

  add(STEPS[0]);  // Niyyah
  add(STEPS[1]);  // Opening Takbir
  add(STEPS[2]);  // Thana

  for (let r = 1; r <= total; r++) {
    const rl = `Rakat ${r}`;
    add(STEPS[3], { rakatLabel: rl });
    if (r <= 2) add(STEPS[4], { rakatLabel: rl });
    add(STEPS[5], { rakatLabel: rl });
    add(STEPS[6], { rakatLabel: rl });
    add(STEPS[7], { rakatLabel: rl });
    add(STEPS[8], { rakatLabel: rl });
    add(STEPS[9], { rakatLabel: rl });

    if (r < total) {
      if (r === 2 && total > 2) {
        add(STEPS[11], {
          name: 'Middle Tashahhud',
          instruction: 'Sit and recite At-Tahiyyat. No Salawat here — then rise for the next rakat.',
          rakatLabel: null,
        });
      }
      add({ ...RISE_TPL, name: `Rakat ${r + 1} begins`, nameAr: '' }, { rakatLabel: `Rakat ${r + 1}`, isRise: true });
    }
  }

  add(STEPS[11]);  // Final Tashahhud
  add(STEPS[12]);  // Salawat
  add(STEPS[13]);  // Du'a
  add(STEPS[14]);  // Salam
  return out;
}

// ─── HELPERS ──────────────────────────────────────────────────────
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDate(d) {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function getCurrentPrayer(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  for (const p of PRAYERS) {
    const [s, e] = p.window;
    if (e > 24 * 60) { if (mins >= s || mins < (e - 24 * 60)) return p; }
    else if (mins >= s && mins < e) return p;
  }
  return null;
}

function clamp(min, vwPct, max) {
  return `clamp(${min}px, ${vwPct}vw, ${max}px)`;
}

// ─── POSTURE SVGs ─────────────────────────────────────────────────
const POSTURE_ORDER = ['qiyam','takbir','qiyam-folded','ruku','itidal','sujud','jalsa','tashahhud','salam'];

const POSTURE_SVG = {
  qiyam: (<svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="40" cy="20" r="10" strokeWidth="3"/><line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/><line x1="40" y1="55" x2="20" y2="80" strokeWidth="3"/><line x1="40" y1="55" x2="60" y2="80" strokeWidth="3"/><line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/><line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/></svg>),
  takbir: (<svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="40" cy="20" r="10" strokeWidth="3"/><line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/><line x1="40" y1="50" x2="10" y2="50" strokeWidth="3"/><line x1="40" y1="50" x2="70" y2="50" strokeWidth="3"/><line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/><line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/></svg>),
  'qiyam-folded': (<svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="40" cy="20" r="10" strokeWidth="3"/><line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/><path d="M 20 65 Q 40 55 60 65" strokeWidth="3" fill="none"/><line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/><line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/></svg>),
  ruku: (<svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="70" cy="20" r="10" strokeWidth="3"/><line x1="70" y1="30" x2="20" y2="60" strokeWidth="3"/><line x1="20" y1="60" x2="70" y2="60" strokeWidth="3"/><line x1="20" y1="60" x2="10" y2="100" strokeWidth="3"/><line x1="70" y1="60" x2="60" y2="100" strokeWidth="3"/><line x1="10" y1="100" x2="10" y2="115" strokeWidth="3"/><line x1="60" y1="100" x2="60" y2="115" strokeWidth="3"/></svg>),
  itidal: (<svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="40" cy="20" r="10" strokeWidth="3"/><line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/><line x1="40" y1="55" x2="18" y2="75" strokeWidth="3"/><line x1="40" y1="55" x2="62" y2="75" strokeWidth="3"/><line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/><line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/></svg>),
  sujud: (<svg viewBox="0 0 130 80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="110" cy="15" r="10" strokeWidth="3"/><path d="M 110 25 L 80 40 L 40 40" strokeWidth="3"/><line x1="80" y1="40" x2="80" y2="70" strokeWidth="3"/><line x1="60" y1="40" x2="60" y2="70" strokeWidth="3"/><line x1="110" y1="25" x2="20" y2="25" strokeWidth="3"/></svg>),
  jalsa: (<svg viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="20" r="10" strokeWidth="3"/><path d="M 50 30 L 50 75" strokeWidth="3"/><line x1="50" y1="55" x2="25" y2="75" strokeWidth="3"/><line x1="50" y1="55" x2="75" y2="75" strokeWidth="3"/><path d="M 50 75 Q 30 90 10 95" strokeWidth="3" fill="none"/><path d="M 50 75 Q 65 100 70 130" strokeWidth="3" fill="none"/></svg>),
  tashahhud: (<svg viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="20" r="10" strokeWidth="3"/><path d="M 50 30 L 50 75" strokeWidth="3"/><line x1="50" y1="50" x2="25" y2="65" strokeWidth="3"/><line x1="50" y1="50" x2="72" y2="40" strokeWidth="3"/><path d="M 50 75 Q 30 90 10 95" strokeWidth="3" fill="none"/><path d="M 50 75 Q 65 100 70 130" strokeWidth="3" fill="none"/></svg>),
  salam: (<svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="40" cy="20" r="10" strokeWidth="3"/><path d="M 50 28 Q 60 20 58 15" strokeWidth="2.5" fill="none"/><line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/><line x1="40" y1="55" x2="20" y2="75" strokeWidth="3"/><line x1="40" y1="55" x2="60" y2="75" strokeWidth="3"/><line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/><line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/></svg>),
  note: (<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeLinecap="round"><circle cx="40" cy="40" r="30" strokeWidth="2.5" strokeDasharray="6 4"/><polyline points="30,40 40,50 50,30" strokeWidth="3"/></svg>),
};

const POSTURE_PHOTO = {
  qiyam:          '/postures/nijeti.png',
  takbir:         '/postures/tekbiri.png',
  'qiyam-folded': '/postures/subhaneke.png',
  ruku:           '/postures/ruku.png',
  itidal:         '/postures/itidali.png',
  sujud:          '/postures/sexhde.png',
  jalsa:          '/postures/xhelseja.png',
  tashahhud:      '/postures/teshehud.png',
  salam:          '/postures/selami.png',
};

function PostureFigure({ posture, size = 120, color = C.dark900, bg = C.gold50 }) {
  const idx = POSTURE_ORDER.indexOf(posture);
  const photo = POSTURE_PHOTO[posture];
  const svg = POSTURE_SVG[posture] || POSTURE_SVG.qiyam;
  const numSize = typeof size === 'number' ? size : 120;
  return (
    <div className="posture-figure" style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden', color }}>
      {photo ? (
        <img src={photo} alt={posture} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      ) : (
        <div style={{ width: numSize * 0.65, height: numSize * 0.65 }}>{svg}</div>
      )}
      {idx >= 0 && (
        <div style={{ position: 'absolute', bottom: 4, right: 6, fontFamily: MONO, fontSize: numSize * 0.1, fontWeight: 600, color: '#fff', opacity: 0.75, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{String(idx + 1).padStart(2, '0')}</div>
      )}
    </div>
  );
}

// ─── SKY SCENE ────────────────────────────────────────────────────
function SkyScene({ prayer: p, height = 200, intensity = 1 }) {
  return (
    <div style={{ position: 'relative', width: '100%', height, background: p.sky, overflow: 'hidden', flexShrink: 0 }}>
      {p.stars && p.stars.map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: 2 * s.s, height: 2 * s.s, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', boxShadow: '0 0 4px rgba(255,255,255,0.7)' }} />
      ))}
      {p.sunY > -20 && p.sunY < 110 && (
        <>
          <div style={{ position: 'absolute', left: '50%', top: `${p.sunY}%`, width: 240 * intensity, height: 240 * intensity, marginLeft: -120 * intensity, marginTop: -120 * intensity, borderRadius: '50%', background: `radial-gradient(circle, ${p.sunGlow} 0%, transparent 60%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: '50%', top: `${p.sunY}%`, width: 64 * intensity, height: 64 * intensity, marginLeft: -32 * intensity, marginTop: -32 * intensity, borderRadius: '50%', background: p.sunColor, boxShadow: `0 0 32px ${p.sunGlow}` }} />
        </>
      )}
      {p.isNight && (
        <div style={{ position: 'absolute', right: '14%', top: '18%', width: 38 * intensity, height: 38 * intensity, borderRadius: '50%', background: '#E8E0F0', boxShadow: 'inset -10px 4px 0 0 rgba(20,24,60,0.95), 0 0 18px rgba(232,224,240,0.35)' }} />
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '14%', background: `linear-gradient(180deg, transparent 0%, ${p.horizonBand} 70%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: p.horizonBand, opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.onSky, opacity: 0.82, textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}>{p.timeLabel}</div>
    </div>
  );
}

// ─── PILL BUTTON ──────────────────────────────────────────────────
function PillBtn({ children, onClick, variant = 'dark', disabled, style: sx }) {
  const vmap = {
    dark:  { bg: C.dark900, fg: '#fff', border: 'none' },
    gold:  { bg: C.gold600, fg: '#fff', border: 'none' },
    ghost: { bg: 'transparent', fg: C.dark900, border: `1px solid ${C.warm200}` },
  };
  const v = vmap[variant] || vmap.dark;
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: v.bg, color: v.fg, border: v.border, borderRadius: 999, padding: '10px 20px', fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, opacity: disabled ? 0.45 : 1, transition: 'transform 180ms, box-shadow 180ms', transform: hov && !disabled ? 'translateY(-1px)' : 'none', boxShadow: hov && !disabled && variant === 'dark' ? '0 6px 20px rgba(26,25,21,0.25)' : 'none', ...sx }}
    >{children}</button>
  );
}

// ─── RECITATION CARD ──────────────────────────────────────────────
function RecitationCard({ step: s, accent, accentDark, showTranslit }) {
  const [open, setOpen] = useState(false);
  if (!s.arabic) return null;
  return (
    <div style={{ marginTop: 14, padding: '16px 18px 14px', borderRadius: 12, background: C.surface, border: `1px solid ${C.warm200}`, boxShadow: '0 4px 18px rgba(26,25,21,0.05)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accentDark, marginBottom: 8 }}>What to say</div>
      {showTranslit && s.translit && (
        <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: '#111111', lineHeight: 1.55, letterSpacing: '0.025em', marginBottom: 10, textTransform: 'uppercase', overflowWrap: 'break-word' }}>{s.translit}</div>
      )}
      <div style={{ paddingTop: 10, borderTop: `1px solid ${C.gold200}` }}>
        {!open ? (
          <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', padding: '6px 10px', background: 'transparent', border: 'none', fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: accent, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Tap for English meaning
          </button>
        ) : (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, marginBottom: 6 }}>Meaning</div>
            <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 650, lineHeight: 1.6, color: '#111111', textTransform: 'uppercase' }}>{s.translation}</div>
            <button onClick={() => setOpen(false)} style={{ marginTop: 8, padding: 0, background: 'transparent', border: 'none', fontSize: 11, color: C.warm600, cursor: 'pointer', fontWeight: 500 }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────
function PrayerCard({ prayer: p, isCurrent, onOpen }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onOpen} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: C.surface, borderRadius: 18, boxShadow: isCurrent ? `0 18px 44px rgba(26,25,21,0.18), 0 0 0 2px ${p.accent}` : hov ? '0 12px 36px rgba(26,25,21,0.14), 0 0 0 1px rgba(26,25,21,0.05)' : '0 2px 14px rgba(26,25,21,0.07), 0 0 0 1px rgba(26,25,21,0.04)', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', textAlign: 'left', border: 'none', padding: 0, transition: 'box-shadow 250ms, transform 250ms', transform: hov ? 'translateY(-4px)' : 'translateY(0)', position: 'relative', font: 'inherit', color: 'inherit' }}
    >
      <SkyScene prayer={p} height={160} />
      {isCurrent && (
        <div style={{ position: 'absolute', top: 14, right: 14, background: C.dark900, color: '#fff', padding: '5px 10px 5px 9px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'htp-pulse 2s infinite' }} />
          Now
        </div>
      )}
      <div style={{ padding: '16px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: C.dark900, margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>{p.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px', marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: C.dark900 }}>{p.rakatFard}</span>
            <span style={{ fontSize: 10, letterSpacing: '0.12em', color: C.warm600, fontWeight: 600, textTransform: 'uppercase' }}>Fard</span>
          </div>
          {p.rakatSunnah > 0 && <>
            <div style={{ width: 1, height: 14, background: C.warm200 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: C.warm600 }}>{p.rakatSunnah}</span>
              <span style={{ fontSize: 10, letterSpacing: '0.12em', color: C.warm600, fontWeight: 600, textTransform: 'uppercase' }}>Sunnah</span>
            </div>
          </>}
          {p.rakatWitr > 0 && <>
            <div style={{ width: 1, height: 14, background: C.warm200 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: C.warm600 }}>{p.rakatWitr}</span>
              <span style={{ fontSize: 10, letterSpacing: '0.12em', color: C.warm600, fontWeight: 600, textTransform: 'uppercase' }}>Witr</span>
            </div>
          </>}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.warm100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: hov ? C.dark900 : C.warm700, fontSize: 12, fontWeight: 600, transition: 'color 200ms' }}>
          <span>Learn how to pray</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
      </div>
    </button>
  );
}

function HowToPrayHome({ onOpenPrayer }) {
  const [now, setNow] = useState(() => new Date());
  useState(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id); });

  const current = getCurrentPrayer(now);
  const nextPrayer = useMemo(() => {
    const mins = now.getHours() * 60 + now.getMinutes();
    let best = null;
    for (const p of PRAYERS) {
      const diff = p.window[0] - mins;
      const d = diff <= 0 ? diff + 24 * 60 : diff;
      if (!best || d < best.diff) best = { prayer: p, diff: d };
    }
    return best;
  }, [now]);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: SANS, color: C.dark900 }}>
      <section className="htp-hero" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="htp-hero-grid">
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600, marginBottom: 16 }}>How to Pray</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px,5vw,60px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.018em', margin: 0, color: C.dark900 }}>
              The five daily prayers,<br/>
              <em style={{ fontStyle: 'italic', fontWeight: 500, color: C.gold700 }}>step by step.</em>
            </h1>
            <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.6, color: C.warm700, marginTop: 20, maxWidth: 540 }}>
              Supplications, positions, and pronunciation — everything you need to get started.
              Choose a prayer time below.
            </p>
          </div>

          <div style={{ background: current ? current.sky : '#1A2050', borderRadius: 22, padding: '24px 26px', color: current ? current.onSky : '#fff', position: 'relative', overflow: 'hidden', minHeight: 200, boxShadow: '0 16px 40px rgba(26,25,21,0.18), 0 0 0 1px rgba(26,25,21,0.04)' }}>
            {current && current.sunY > -20 && current.sunY < 110 && (
              <>
                <div style={{ position: 'absolute', right: -60, top: -60, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${current.sunGlow} 0%, transparent 60%)`, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: 28, top: 28, width: 48, height: 48, borderRadius: '50%', background: current.sunColor, boxShadow: `0 0 30px ${current.sunGlow}` }} />
              </>
            )}
            {current && current.isNight && (
              <div style={{ position: 'absolute', right: 28, top: 28, width: 38, height: 38, borderRadius: '50%', background: '#E8E0F0', boxShadow: 'inset -10px 4px 0 0 rgba(20,24,60,0.95)' }} />
            )}
            {current && current.stars && current.stars.slice(0, 5).map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: 2 * s.s, height: 2 * s.s, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', boxShadow: '0 0 4px rgba(255,255,255,0.7)' }} />
            ))}
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.78, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'htp-pulse 2s infinite' }} />
              Now · {formatDate(now)}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 600, marginTop: 10, lineHeight: 1, position: 'relative', zIndex: 1, textShadow: '0 2px 18px rgba(0,0,0,0.18)' }}>
              {current ? current.name : 'No active prayer'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 'auto', paddingTop: 28, position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>{current ? 'Ends around' : 'Next'}</div>
                <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 500, marginTop: 2, letterSpacing: '0.02em' }}>{nextPrayer ? nextPrayer.prayer.timeApprox : '--:--'}</div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'currentColor', opacity: 0.18 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>Next prayer</div>
                <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, marginTop: 4, fontStyle: 'italic' }}>{nextPrayer ? nextPrayer.prayer.name : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 clamp(20px,4vw,56px) clamp(40px,6vw,80px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600 }}>Five Prayers</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,2.4vw,30px)', fontWeight: 600, marginTop: 4, color: C.dark900, letterSpacing: '-0.01em' }}>Choose a prayer to learn</h2>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.warm500, letterSpacing: '0.05em' }}>05 / 05</div>
        </div>
        <div className="htp-prayer-grid">
          {PRAYERS.map(p => (
            <PrayerCard key={p.id} prayer={p} isCurrent={current?.id === p.id} onOpen={() => onOpenPrayer(p.id)} />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes htp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
        .htp-hero { padding: clamp(32px,5vw,64px) clamp(20px,4vw,56px) clamp(20px,3vw,36px); }
        @media(max-width:639px){ .htp-hero{ padding-left:60px; } }
        .htp-hero-grid { display:grid; grid-template-columns:1.35fr 1fr; gap:48px; align-items:end; }
        .htp-prayer-grid { display:grid; gap:18px; grid-template-columns:repeat(5,1fr); }
        @media(max-width:1180px){ .htp-prayer-grid{grid-template-columns:repeat(3,1fr);} }
        @media(max-width:880px){ .htp-hero-grid{grid-template-columns:1fr!important;gap:28px!important;} }
        @media(max-width:760px){ .htp-prayer-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:520px){ .htp-prayer-grid{grid-template-columns:1fr;} }
      `}</style>
    </div>
  );
}

// ─── DETAIL SUB-COMPONENTS ────────────────────────────────────────
function SummaryStrip({ prayer: p }) {
  return (
    <div className="htp-summary-strip" style={{ margin: '-44px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px)', position: 'relative', zIndex: 5 }}>
      <div className="htp-summary-grid" style={{ background: C.surface, borderRadius: 18, boxShadow: '0 6px 28px rgba(26,25,21,0.10), 0 0 0 1px rgba(26,25,21,0.04)', padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[
          { label: 'Fard',      value: p.rakatFard,   unit: 'rakats',    color: C.dark900 },
          { label: 'Sunnah',    value: p.rakatSunnah, unit: 'rakats',    color: C.warm600 },
          { label: 'Steps',     value: STEPS.length,  unit: 'positions', color: C.gold600 },
          { label: 'Duration',  value: '~4',          unit: 'minutes',   color: C.dark900 },
        ].map(({ label, value, unit, color }) => (
          <div className="htp-summary-item" key={label}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.warm500 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 600, color }}>{value}</span>
              <span style={{ fontSize: 12, color: C.warm600 }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AyetBlock({ prayer: p }) {
  return (
    <div style={{ margin: '32px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px)' }}>
      <div style={{ borderLeft: `3px solid ${p.accent}`, paddingLeft: 22, paddingTop: 4, paddingBottom: 4 }}>
        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: C.dark900, lineHeight: 1.5 }}>"{p.ayetEn}"</div>
        <div style={{ fontSize: 11, color: p.accentDark, marginTop: 8, fontFamily: MONO, fontWeight: 500, letterSpacing: '0.04em' }}>{p.ayetRef}</div>
      </div>
    </div>
  );
}

function TipsBlock({ prayer: p }) {
  return (
    <section style={{ margin: '48px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600 }}>Common Mistakes</div>
        <div style={{ flex: 1, height: 1, background: C.warm200 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        {p.tips.map((tip, i) => (
          <div key={i} style={{ background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: p.accentDark, letterSpacing: '0.05em' }}>0{i + 1}</div>
            <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.dark900, marginTop: 4, lineHeight: 1.25 }}>{tip.title}</div>
            <div style={{ fontSize: 13, color: C.warm700, marginTop: 6, lineHeight: 1.55 }}>{tip.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SCROLL LAYOUT ────────────────────────────────────────────────
function ScrollLayout({ prayer: p, showTranslit }) {
  const stepsWithText = STEPS.filter(s => s.arabic).map(s => s.n);
  const [revealed, setRevealed] = useState(() => new Set());
  const allRevealed = stepsWithText.length > 0 && stepsWithText.every(n => revealed.has(n));
  const toggleAll = () => setRevealed(allRevealed ? new Set() : new Set(stepsWithText));

  return (
    <>
      <SummaryStrip prayer={p} />
      <AyetBlock prayer={p} />
      <section style={{ margin: '48px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600 }}>
            Prayer Steps · {STEPS.length} positions
          </div>
          <div style={{ flex: 1, height: 1, background: C.warm200, minWidth: 20 }} />
          <button onClick={toggleAll} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: allRevealed ? p.accentDark : C.surface, color: allRevealed ? '#fff' : C.dark900, border: `1px solid ${allRevealed ? p.accentDark : C.warm200}`, fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 200ms' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {allRevealed ? (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>) : (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>)}
            </svg>
            {allRevealed ? 'Hide translations' : 'Show all translations'}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} className="htp-scroll-row" style={{ display: 'grid', gridTemplateColumns: 'auto 140px 1fr', gap: 20, alignItems: 'start' }}>
              <div className="htp-num-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.isNote ? C.gold50 : C.dark900, color: s.isNote ? C.gold600 : '#fff', border: s.isNote ? `1.5px dashed ${C.gold400}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 600 }}>{s.n}</div>
                {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 60, background: `linear-gradient(180deg,${C.warm200},transparent)`, marginTop: 6 }} />}
              </div>
              <div className="htp-scroll-figure" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4 }}>
                <PostureFigure posture={s.posture} size={130} color={s.isNote ? p.accent : C.dark900} bg={s.isNote ? 'transparent' : C.gold50} />
              </div>
              <div className="htp-step-card" style={{ background: s.isNote ? 'transparent' : C.surface, borderRadius: 14, border: s.isNote ? `1.5px dashed ${C.gold300}` : `1px solid ${C.warm200}`, padding: s.isNote ? '14px 18px' : '18px 22px' }}>
                <div className="htp-step-heading" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="htp-card-num" style={{ display: 'none', fontFamily: MONO, fontSize: 11, fontWeight: 700, color: s.isNote ? p.accentDark : C.warm500, marginBottom: 4 }}>{String(s.n).padStart(2, '0')}</div>
                    <div className="htp-step-title" style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: C.dark900, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{s.name}</div>
                    <div className="htp-posture-badge" style={{ fontSize: 10, fontWeight: 600, color: C.warm500, letterSpacing: '0.12em', textTransform: 'uppercase', background: C.warm100, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap', display: 'inline-block', marginTop: 6 }}>{s.postureEn}</div>
                  </div>
                  <div className="htp-inline-figure" style={{ flexShrink: 0 }}>
                    <PostureFigure posture={s.posture} size={100} color={s.isNote ? p.accent : C.dark900} bg={s.isNote ? 'transparent' : C.gold50} />
                  </div>
                </div>
                <p className="htp-step-instruction" style={{ fontSize: 14, color: C.warm700, marginTop: 10, lineHeight: 1.6 }}>{s.instruction}</p>
                {s.arabic && <RecitationCard step={s} accent={p.accent} accentDark={p.accentDark} showTranslit={showTranslit} />}
              </div>
            </div>
          ))}
        </div>
      </section>
      <TipsBlock prayer={p} />
      <section style={{ margin: '64px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px) 80px' }}>
        <div style={{ background: C.dark900, color: '#fff', borderRadius: 22, padding: 'clamp(28px,4vw,44px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -80, top: -80, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${p.sunGlow} 0%, transparent 65%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 540 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold300 }}>Done?</div>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.01em' }}>Try it yourself — with practice, it becomes natural.</h3>
            <p style={{ fontSize: 14, color: C.warm300, marginTop: 10, lineHeight: 1.6 }}>Learning to pray is a journey, not a destination. Repetition brings peace.</p>
          </div>
          <PillBtn variant="gold">
            I learned this prayer
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </PillBtn>
        </div>
      </section>
      <style>{`
        .htp-inline-figure{display:none;}
        @media(max-width:760px){
          .htp-scroll-row{grid-template-columns:1fr!important;gap:12px!important;}
          .htp-num-col{display:none!important;}
          .htp-scroll-figure{display:none!important;}
          .htp-inline-figure{display:block;}
          .htp-card-num{display:block!important;}
          .htp-step-card{padding:0 18px 18px!important;overflow:hidden;}
          .htp-step-heading{margin:0 -18px 14px!important;padding:10px 14px!important;align-items:center!important;background:${C.gold50}!important;border-bottom:1px solid ${C.warm200}!important;}
          .htp-step-title{font-size:16px!important;line-height:1.2!important;}
          .htp-posture-badge{font-size:9px!important;margin-top:4px!important;padding:3px 8px!important;}
          .htp-inline-figure .posture-figure{width:76px!important;height:76px!important;}
          .htp-step-instruction{margin-top:0!important;font-size:14px!important;}
        }
      `}</style>
    </>
  );
}

// ─── STEP LAYOUT (guided) ─────────────────────────────────────────
function StepLayout({ prayer: p, showTranslit, onBack }) {
  const seqItems = PRAYER_SEQUENCES[p.id] || [{ type: 'farz', rakat: p.rakatFard, label: 'Fard', desc: `${p.rakatFard} rakats fard` }];
  const [phase, setPhase]         = useState('choose');
  const [seqIdx, setSeqIdx]       = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [stepIdx, setStepIdx]     = useState(0);

  const activeItem = seqItems[seqIdx];
  const steps = useMemo(() => buildPrayerSteps(p, activeItem.rakat), [p.id, seqIdx]);
  const s = steps[stepIdx];
  const max = steps.length;

  function startItem(i) { setSeqIdx(i); setStepIdx(0); setPhase('praying'); }
  function finishItem() {
    const next = new Set(completed); next.add(seqIdx); setCompleted(next);
    if (next.size === seqItems.length) onBack?.(); else setPhase('choose');
  }
  function goNext() { if (stepIdx < max - 1) setStepIdx(i => i + 1); else finishItem(); }
  function goPrev() { if (stepIdx > 0) setStepIdx(i => i - 1); else setPhase('choose'); }

  if (phase === 'choose') {
    const justFinished = completed.size > 0 ? seqItems[seqIdx] : null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '32px 24px 28px', gap: 24, alignItems: 'center', minHeight: 'calc(100dvh - 64px - 56px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          {justFinished ? (
            <>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: p.accentDark, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.dark900, margin: '0 0 4px' }}>{justFinished.label} complete!</h3>
              <p style={{ fontSize: 13, color: C.warm500, margin: 0 }}>Continue with the next?</p>
            </>
          ) : (
            <>
              <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: C.dark900, margin: '0 0 4px' }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: C.warm500, margin: 0 }}>Which would you like to pray first?</p>
            </>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
          {seqItems.map((item, i) => {
            const isDone = completed.has(i);
            const firstReqRemaining = seqItems.findIndex((it, j) => !completed.has(j) && !it.optional);
            const isPrimary = !isDone && !item.optional && i === firstReqRemaining;
            return (
              <button key={i} onClick={() => !isDone && startItem(i)} disabled={isDone}
                style={{ background: isDone ? C.warm100 : isPrimary ? C.dark900 : C.surface, color: isDone ? C.warm400 : isPrimary ? '#fff' : C.dark700, border: isDone ? 'none' : `1px solid ${isPrimary ? 'transparent' : C.warm200}`, borderRadius: 16, padding: '18px 20px', cursor: isDone ? 'default' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, opacity: isDone ? 0.55 : 1, transition: 'opacity 180ms' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <span style={{ fontFamily: SANS, fontWeight: isPrimary ? 700 : 600, fontSize: 15 }}>{item.label}</span>
                    {item.optional && !isDone && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: C.gold100, color: C.gold600, borderRadius: 4, padding: '2px 5px', fontFamily: SANS }}>optional</span>}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: isDone ? C.warm400 : isPrimary ? 'rgba(255,255,255,0.6)' : C.warm500 }}>{item.desc}</div>
                </div>
                {isDone
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                }
              </button>
            );
          })}
        </div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 13, color: C.warm500, cursor: 'pointer', fontFamily: SANS }}>← Back</button>
      </div>
    );
  }

  return (
    <div className="htp-guided-root" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 64px - 56px)' }}>
      <div style={{ padding: '14px 20px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStepIdx(i)} style={{ flex: '1 1 0', height: 3, borderRadius: 2, padding: 0, border: 'none', cursor: 'pointer', background: i < stepIdx ? p.accent : i === stepIdx ? p.accentDark : C.warm200, transition: 'background 180ms', minWidth: 2 }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.warm500, display: 'flex', alignItems: 'center', gap: 6 }}>
            {String(stepIdx + 1).padStart(2, '0')} / {String(max).padStart(2, '0')}
            <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 4, padding: '1px 5px', color: '#fff', background: activeItem.type === 'farz' ? C.dark900 : activeItem.type === 'witr' ? C.gold600 : activeItem.type === 'nafl' ? C.warm400 : p.accent }}>
              {activeItem.label}
            </span>
          </span>
          <span style={{ fontSize: 10, color: C.warm500, fontFamily: SANS, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {s.rakatLabel ? `${s.rakatLabel}  ·  ` : ''}{s.postureEn}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {s.isRise && (
          <div style={{ width: '100%', maxWidth: 340, background: p.accentDark, borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
            <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{s.name}</span>
          </div>
        )}
        <PostureFigure posture={s.posture} size={clamp(148, 22, 196)} color={s.isNote ? p.accent : C.dark900} bg={C.gold50} />
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 480 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,5vw,28px)', fontWeight: 600, color: C.dark900, margin: 0, lineHeight: 1.1 }}>{s.name}</h3>
        </div>
        <p style={{ fontSize: 15, color: C.warm700, lineHeight: 1.6, margin: 0, textAlign: 'center', maxWidth: 460, padding: '0 4px' }}>{s.instruction}</p>
        {s.repeatFrom && (
          <div style={{ width: '100%', maxWidth: 420, background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: p.accentDark, marginBottom: 10 }}>Repeat steps</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array.from({ length: s.repeatTo - s.repeatFrom + 1 }, (_, i) => s.repeatFrom + i).map((n, i, arr) => (
                <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: C.dark900, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{n}</span>
                  {i < arr.length - 1 && <span style={{ color: C.warm400, fontSize: 12 }}>→</span>}
                </span>
              ))}
              <span style={{ marginLeft: 4, fontSize: 18, color: p.accent }}>↺</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: C.warm600, textAlign: 'center', lineHeight: 1.5 }}>
              {STEPS.slice(s.repeatFrom - 1, s.repeatTo).map(st => st.name).join(' · ')}
            </div>
          </div>
        )}
        {s.arabic && (
          <div style={{ width: '100%', maxWidth: 520 }}>
            <RecitationCard step={s} accent={p.accent} accentDark={p.accentDark} showTranslit={showTranslit} />
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px))', borderTop: `1px solid ${C.warm100}`, background: C.bg, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={goPrev} style={{ width: 52, height: 56, borderRadius: 14, flexShrink: 0, background: C.surface, border: `1px solid ${C.warm200}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.dark900 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <button onClick={goNext} style={{ flex: 1, height: 56, borderRadius: 14, background: stepIdx === max - 1 ? C.gold600 : C.dark900, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: SANS, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'background 180ms' }}>
          {stepIdx === max - 1
            ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Finished {activeItem.label}</>
            : <>Next <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></>
          }
        </button>
      </div>
      <style>{`@media(max-width:640px){.htp-guided-root{height:calc(100dvh - 64px - 56px - 58px)!important;}}`}</style>
    </div>
  );
}

// ─── DETAIL ROOT ──────────────────────────────────────────────────
function HowToPrayDetail({ prayerId, onBack, layout, setLayout }) {
  const p = PRAYERS.find(x => x.id === prayerId) || PRAYERS[0];
  const [showTranslit, setShowTranslit] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: SANS, color: C.dark900 }}>
      {layout === 'step' ? (
        <div style={{ height: 64, background: p.sky, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>
          {p.sunY > -20 && p.sunY < 110 && <div style={{ position: 'absolute', right: -50, top: -50, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${p.sunGlow} 0%, transparent 60%)`, pointerEvents: 'none' }} />}
          <button onClick={onBack} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', color: p.onSky, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, zIndex: 1, position: 'relative' }}>Back</button>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'center', color: p.onSky, position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, textShadow: '0 1px 8px rgba(0,0,0,0.22)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
          </div>
          <button onClick={() => setShowTranslit(v => !v)} style={{ flexShrink: 0, padding: '7px 12px', borderRadius: 999, background: showTranslit ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: showTranslit ? C.dark900 : p.onSky, fontFamily: SERIF, fontStyle: 'italic', fontSize: 11, fontWeight: 600, cursor: 'pointer', zIndex: 1, position: 'relative' }}>Translit.</button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <SkyScene prayer={p} height="clamp(280px,36vh,420px)" intensity={1.3} />
          <div className="htp-detail-topbar" style={{ position: 'absolute', top: 20, left: 'clamp(20px,4vw,56px)', right: 'clamp(20px,4vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px 9px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', border: '1px solid rgba(255,255,255,0.3)', color: p.onSky, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <div className="htp-detail-controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setShowTranslit(v => !v)} style={{ padding: '7px 12px', borderRadius: 999, background: showTranslit ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: showTranslit ? C.dark900 : p.onSky, fontFamily: SERIF, fontStyle: 'italic', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Translit.</button>
              {layout !== 'step' && (
                <div className="htp-layout-selector" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  {[{ id: 'scroll', title: 'List' }, { id: 'twocol', title: 'Two col' }].map(opt => (
                    <button key={opt.id} onClick={() => setLayout(opt.id)} style={{ padding: '4px 10px', borderRadius: 999, background: layout === opt.id ? 'rgba(255,255,255,0.9)' : 'transparent', border: 'none', color: layout === opt.id ? C.dark900 : p.onSky, fontFamily: SANS, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 150ms' }}>{opt.title}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="htp-prayer-title" style={{ position: 'absolute', left: 0, right: 0, bottom: '10%', textAlign: 'center', color: p.onSky }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.85 }}>{p.period}</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(48px,7vw,84px)', fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.02em', lineHeight: 1, textShadow: '0 2px 18px rgba(0,0,0,0.22)' }}>{p.name}</h1>
            {layout !== 'step' && (
              <button onClick={() => setLayout('step')} style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 28px', borderRadius: 999, background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', color: C.dark900, fontFamily: SANS, fontSize: 15, fontWeight: 700, boxShadow: '0 4px 24px rgba(0,0,0,0.22)', letterSpacing: '0.01em' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.28)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.22)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Start step by step
              </button>
            )}
          </div>
        </div>
      )}

      {layout === 'scroll' && <ScrollLayout prayer={p} showTranslit={showTranslit} />}
      {layout === 'step'   && <StepLayout   prayer={p} showTranslit={showTranslit} onBack={onBack} />}
      {layout === 'twocol' && <TwoColLayout prayer={p} showTranslit={showTranslit} />}

      <style>{`
        @media(max-width:520px){
          .htp-detail-topbar{align-items:flex-start!important;gap:10px!important;}
          .htp-detail-controls{flex-direction:column!important;align-items:flex-end!important;gap:6px!important;}
          .htp-layout-selector{max-width:190px!important;flex-wrap:wrap!important;justify-content:flex-end!important;border-radius:20px!important;}
          .htp-summary-strip{margin-top:-28px!important;padding:0 20px!important;}
          .htp-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px 18px!important;padding:16px 20px!important;}
          .htp-prayer-title{bottom:25%!important;padding:0 24px!important;}
          .htp-prayer-title h1{font-size:clamp(42px,15vw,58px)!important;}
        }
      `}</style>
    </div>
  );
}

// ─── TWO-COL LAYOUT ───────────────────────────────────────────────
function TwoColLayout({ prayer: p, showTranslit }) {
  const [idx, setIdx] = useState(0);
  const s = STEPS[idx];
  return (
    <>
      <SummaryStrip prayer={p} />
      <section style={{ margin: '40px auto 0', maxWidth: 1200, padding: '0 clamp(20px,4vw,56px) 40px' }}>
        <div className="htp-twocol" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 28, alignItems: 'start' }}>
          <aside style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.warm200}`, overflow: 'hidden', position: 'sticky', top: 76, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            <div style={{ padding: '14px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600, borderBottom: `1px solid ${C.warm100}` }}>{STEPS.length} steps</div>
            {STEPS.map((step, i) => (
              <button key={step.n} onClick={() => setIdx(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 14px', background: i === idx ? C.gold50 : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: `3px solid ${i === idx ? p.accentDark : 'transparent'}`, borderBottom: i < STEPS.length - 1 ? `1px solid ${C.warm100}` : 'none', transition: 'background 150ms' }}>
                <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: i === idx ? p.accentDark : C.warm500, width: 22 }}>{String(step.n).padStart(2, '0')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 600, color: C.dark900, lineHeight: 1.2 }}>{step.name}</div>
                  <div style={{ fontSize: 11, color: C.warm500, marginTop: 2 }}>{step.postureEn}</div>
                </div>
                <PostureFigure posture={step.posture} size={28} color={i === idx ? C.dark900 : C.warm500} bg="transparent" />
              </button>
            ))}
          </aside>
          <div>
            <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.warm200}`, padding: 'clamp(24px,3vw,36px)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: p.accentDark }}>{String(s.n).padStart(2, '0')}</div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.warm500 }}>{s.postureEn}</div>
              </div>
              <div className="htp-twocol-detail" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start', marginTop: 14 }}>
                <PostureFigure posture={s.posture} size={150} color={C.dark900} bg={C.gold50} />
                <div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, color: C.dark900, margin: '6px 0 0', letterSpacing: '-0.015em', lineHeight: 1.1 }}>{s.name}</h3>
                  <p style={{ fontSize: 15, color: C.warm700, marginTop: 12, lineHeight: 1.6 }}>{s.instruction}</p>
                </div>
              </div>
              {s.arabic && <RecitationCard step={s} accent={p.accent} accentDark={p.accentDark} showTranslit={showTranslit} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.warm100}` }}>
                <PillBtn variant="ghost" disabled={idx === 0} onClick={() => setIdx(i => Math.max(0, i - 1))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back
                </PillBtn>
                <PillBtn variant="dark" disabled={idx === STEPS.length - 1} onClick={() => setIdx(i => Math.min(STEPS.length - 1, i + 1))}>
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </PillBtn>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AyetBlock prayer={p} />
      <TipsBlock prayer={p} />
      <style>{`
        @media(max-width:900px){.htp-twocol{grid-template-columns:1fr!important;}.htp-twocol aside{position:static!important;max-height:none!important;}}
        @media(max-width:520px){.htp-twocol-detail{grid-template-columns:1fr!important;}}
      `}</style>
    </>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────
export default function HowToPray({ initialPrayerId = null }) {
  const [view, setView] = useState(
    initialPrayerId
      ? { screen: 'detail', prayerId: initialPrayerId }
      : { screen: 'home', prayerId: null }
  );
  const [layout, setLayout] = useState('step');

  function openPrayer(id) { setView({ screen: 'detail', prayerId: id }); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function goHome()        { setView({ screen: 'home', prayerId: null }); window.scrollTo({ top: 0, behavior: 'instant' }); }

  if (view.screen === 'detail') {
    return <HowToPrayDetail prayerId={view.prayerId} onBack={goHome} layout={layout} setLayout={setLayout} />;
  }
  return <HowToPrayHome onOpenPrayer={openPrayer} />;
}
