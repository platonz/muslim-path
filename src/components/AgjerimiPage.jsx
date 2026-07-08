import { SourceChip, SectionHead, RulingCard } from "./AbdesPage";
import {
  SURFACE, SERIF, SANS, MONO,
  DARK_900, DARK_700,
  WARM_700, WARM_600, WARM_500, WARM_400, WARM_200, WARM_100,
  GOLD_700, GOLD_600, GOLD_500, GOLD_400, GOLD_300, GOLD_200, GOLD_100, GOLD_50,
} from "../constants";

// Fasting (Agjërimi) — same editorial rule as Abdesi/Namazi: every ruling is
// backed by Bulugh al-Maram (Book of Fasting, hadiths 671–727) AND
// Fiqh-us-Sunnah (ch. 3.107–3.156) at once; disputed rulings carry a badge.

const C = {
  bg:       '#FAF7EE',
  surface:  SURFACE,
  dark900:  DARK_900,
  dark700:  DARK_700,
  warm700:  WARM_700,
  warm600:  WARM_600,
  warm500:  WARM_500,
  warm400:  WARM_400,
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
  night:    '#3B3564',
  nightDark:'#241F45',
};

const VERSE = {
  ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
  alb: 'O ju që besuat! Agjërimi ju është bërë obligim, sikurse u ishte bërë atyre para jush, që të bëheni të devotshëm.',
  ref: 'El-Bekare 2:183',
};

// ─── VIRTYTET ─────────────────────────────────────────────────────
const VIRTUES = [
  {
    title: 'Agjërimi është vetëm për Allahun',
    body: 'Çdo vepër e birit të Ademit është për të, përveç agjërimit — ai është për Allahun dhe Ai vetë e shpërblen.',
    evidence: [
      { book: 'fiqh', ref: '3.107a', text: '«Allahu tha: Çdo vepër e birit të Ademit është për të, përveç agjërimit — ai është për Mua dhe Unë shpërblej për të. Agjërimi është mburojë… Era e gojës së agjëruesit tek Allahu është më e mirë se aroma e miskut.»', src: 'Ahmedi, Muslimi, Nesaiu' },
      { book: 'bulugh', ref: '§684', text: '«Kush nuk e lë fjalën e rreme e veprimin sipas saj, Allahu s\'ka nevojë që ai të lërë ushqimin e pijen e vet.»', src: 'Buhariu & Ebu Davudi' },
    ],
  },
  {
    title: 'Falja e mëkateve të kaluara',
    body: 'Kush agjëron Ramazanin me besim e duke shpresuar shpërblimin, i falen mëkatet e mëparshme.',
    evidence: [
      { book: 'bulugh', ref: '§717', text: '«Kush falet natën e Ramazanit me besim e duke shpresuar shpërblimin, i falen mëkatet e kaluara.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.109', text: '«Kush agjëron Ramazanin me besim e duke kërkuar kënaqësinë e Allahut, i falen mëkatet e mëparshme.» (Ahmedi dhe autorët e Suneneve)' },
    ],
  },
  {
    title: 'Dera Rejjan',
    body: 'Në Xhenet ka një derë të quajtur Rejjan, nga e cila hyjnë vetëm agjëruesit.',
    evidence: [
      { book: 'fiqh', ref: '3.107a', text: '«Në Xhenet ka një derë të quajtur Rejjan. Ditën e Kiametit do të thirret: Ku janë agjëruesit? Kur të hyjë i fundit i tyre, dera do të mbyllet.»', src: 'Buhariu & Muslimi' },
      { book: 'bulugh', ref: '§702', text: '«Asnjë rob nuk agjëron një ditë për hir të Allahut, veçse Allahu ia largon zjarrin nga fytyra shtatëdhjetë vjet.»', src: 'Muttefekun alejhi' },
    ],
  },
];

// ─── HYRJA E RAMAZANIT ────────────────────────────────────────────
const RAMADAN_START = [
  {
    title: 'Fillo me shikimin e hënës',
    body: 'Agjërimi fillon kur shihet hëna e re; nëse qielli është me re, plotësohet Shabani tridhjetë ditë.',
    evidence: [
      { book: 'bulugh', ref: '§673', text: '«Agjëroni kur ta shihni (hënën e re) dhe ndërprite agjërimin kur ta shihni. Nëse është me re, plotësoni Shabanin tridhjetë ditë.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.111', text: 'Hyrja e Ramazanit vërtetohet me shikimin e hënës — qoftë edhe nga një dëshmitar i drejtë — ose me kalimin e tridhjetë ditëve të Shabanit.' },
    ],
  },
  {
    title: 'Mjafton një dëshmitar',
    body: 'Për fillimin e agjërimit pranohet dëshmia e një personi të drejtë.',
    evidence: [
      { book: 'bulugh', ref: '§675–676', text: 'Ibn Umeri i tregoi Pejgamberit ﷺ se e kishte parë hënën, e ai agjëroi dhe urdhëroi njerëzit të agjëronin; një beduini që dëshmoi shehadetin dhe se e kishte parë, i tha: «O Bilal, thirri njerëzit të agjërojnë nesër.»', src: 'Ebu Davudi; të pestë imamët' },
      { book: 'fiqh', ref: '3.113', text: 'Dijetarët e fikhut pajtohen se nëse vetëm një person e sheh hënën e re, ai agjëron; mendimi i saktë është që të pranohet dëshmia e tij.' },
    ],
  },
  {
    title: 'Nijeti para agimit',
    body: 'Për agjërimin farz, nijeti bëhet natën para agimit — vepër e zemrës, pa shqiptim.',
    evidence: [
      { book: 'bulugh', ref: '§677', text: '«Kush nuk e bën nijetin e agjërimit para agimit, s\'ka agjërim.»', src: 'Të pestë imamët; Darakutni' },
      { book: 'fiqh', ref: '3.113c', text: 'Nijeti bëhet çdo natë të Ramazanit, në çdo pjesë të natës; është vepër e zemrës e s\'ka nevojë të thuhet me gojë. Ngrënia e syfyrit me qëllim agjërimi mjafton si nijet.' },
    ],
  },
];

// ─── ADABET E AGJËRIMIT ───────────────────────────────────────────
const FASTING_ADAB = [
  {
    title: 'Syfyri — bereqet',
    body: 'Hani syfyr, sepse në të ka bereqet. Suneti është të vonohet sa më afër agimit.',
    evidence: [
      { book: 'bulugh', ref: '§681', text: '«Hani syfyr, sepse në syfyr ka bereqet.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.130b', text: 'Zejd ibn Thabit: mes syfyrit dhe namazit ishte sa leximi i pesëdhjetë ajeteve; sahabët e nxitonin iftarin e e vononin syfyrin.' },
    ],
  },
  {
    title: 'Nxito iftarin',
    body: 'Njerëzit do të jenë në mirësi sa ta nxitojnë iftarin — çelet me hurma teke, ose me ujë.',
    evidence: [
      { book: 'bulugh', ref: '§679, §682', text: '«Njerëzit do të jenë në mirësi sa ta nxitojnë iftarin»; «kur ndonjëri të çelë, le të çelë me hurma; nëse s\'ka, me ujë, sepse uji është pastrues.»', src: 'Muttefekun alejhi; të pestë imamët' },
      { book: 'fiqh', ref: '3.131a', text: 'Pëlqehet nxitimi i iftarit sapo të perëndojë dielli; çelet para namazit me hurma teke, e po s\'pati, me ujë.' },
    ],
  },
  {
    title: 'Ruaj gjuhën dhe veprat',
    body: 'Agjërimi nuk është vetëm heqje dorë nga ushqimi — është ruajtje nga fjala e keqe dhe veprat e ndaluara.',
    evidence: [
      { book: 'bulugh', ref: '§684', text: '«Kush nuk e lë fjalën e rreme… Allahu s\'ka nevojë që ai të lërë ushqimin e pijen e vet.»', src: 'Buhariu & Ebu Davudi' },
      { book: 'fiqh', ref: '3.132a', text: '«Agjërimi s\'është veç nga ushqimi e pija, por edhe nga fjala e kotë e sharja. Nëse dikush të shan, thuaj: Unë jam agjërueshëm.» (Ibn Huzejme, Ibn Hiban, Hakimi)' },
    ],
  },
  {
    title: 'Lutja e agjëruesit',
    body: 'Agjëruesi ka një lutje që nuk kthehet mbrapsht — sidomos në çastin e iftarit.',
    evidence: [
      { book: 'fiqh', ref: '3.132', text: '«Tre vetë s\'u kthehet lutja: agjëruesi derisa të çelë, sundimtari i drejtë, dhe i shtypuri.» (Tirmidhiu — zinxhir i mirë)' },
      { book: 'bulugh', ref: '§717', text: 'Nata e Ramazanit është kohë faljeje: «Kush falet natën e Ramazanit me besim… i falen mëkatet e kaluara.»', src: 'Muttefekun alejhi' },
    ],
  },
];

// ─── PRISHËSIT ────────────────────────────────────────────────────
const BREAKERS = [
  {
    title: 'Ngrënia dhe pirja me qëllim',
    body: 'Kush ha a pi me dashje e prish agjërimin dhe e ka detyrim ta zëvendësojë ditën.',
    evidence: [
      { book: 'fiqh', ref: '3.138a', text: 'Ngrënia a pirja me qëllim e prish agjërimin dhe kërkon zëvendësimin (kaza) e ditës.' },
      { book: 'bulugh', ref: '§690', text: '«Kush harron se është agjërueshëm dhe ha a pi, le ta plotësojë agjërimin — Allahu e ushqeu dhe i dha të pijë.»', src: 'Muttefekun alejhi' },
    ],
  },
  {
    title: 'Marrëdhëniet — kaza + kefaret',
    body: 'Marrëdhëniet me qëllim ditën e Ramazanit e prishin agjërimin dhe kërkojnë kaza + shpagim: lirim skllavi, ose agjërim dy muajsh rresht, ose ushqim 60 të varfërve.',
    evidence: [
      { book: 'bulugh', ref: '§697', text: 'Njeriu që pati marrëdhënie ditën e Ramazanit: «A mund të lirosh një skllav?» — «Jo.» — «A mund të agjërosh dy muaj rresht?» — «Jo.» — «A mund të ushqesh gjashtëdhjetë të varfër?»', src: 'Shtatë imamët — teksti i Muslimit' },
      { book: 'fiqh', ref: '3.139d', text: 'Sipas shumicës, kefareti kryhet me radhë: lirim skllavi, pastaj agjërim dy muajsh rresht, pastaj ushqim i gjashtëdhjetë të varfërve.' },
    ],
  },
  {
    title: 'E vjella me qëllim',
    body: 'Kush vjell pa dashje s\'ka gjë; kush vjell me qëllim, e ka detyrim kaza.',
    evidence: [
      { book: 'bulugh', ref: '§692', text: '«Kush mundet nga e vjella (pa dashje), s\'ka pse ta zëvendësojë ditën; e kush vjell me qëllim, le ta zëvendësojë.»', src: 'Të pestë imamët' },
      { book: 'fiqh', ref: '3.138b', text: 'Kjatabi: «S\'di ndonjë mospajtim mes dijetarëve» — e vjella e pavullnetshme s\'e prish agjërimin, ajo me qëllim e prish.' },
    ],
  },
  {
    title: 'Menstruacionet dhe lehonia',
    body: 'Gjaku, edhe pak para perëndimit, e prish agjërimin e asaj dite — dita zëvendësohet.',
    evidence: [
      { book: 'fiqh', ref: '3.139', text: 'Për këtë ka ixhma: gjaku, edhe pak para perëndimit, e prish agjërimin e ditës dhe ajo ditë duhet zëvendësuar.' },
      { book: 'bulugh', ref: '§699', text: 'Zëvendësimi i ditëve të humbura mbetet obligim: «Kush vdes e ka ditë agjërimi për të zëvendësuar, le të agjërojë për të trashëgimtari i tij.»', src: 'Muttefekun alejhi' },
    ],
  },
  {
    title: 'Hixhamja (kupat)',
    body: 'Sipas shumicës së dijetarëve hixhamja lejohet gjatë agjërimit; hadithi që e ndalon u konsiderua i shfuqizuar.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§687', text: '«Ai që bën hixhame dhe ai që i bëhet, të dy e kanë prishur agjërimin.»', src: 'Të pestë imamët veç Tirmidhiut — sahih' },
      { book: 'bulugh', ref: '§686, §688', text: 'Ibn Abasi: Pejgamberi ﷺ bëri hixhame ndërsa ishte agjërueshëm; Enesi tregon se ndalimi u lejua më vonë.', src: 'Buhariu; Darakutni' },
      { book: 'fiqh', ref: '3.135', text: 'Shumica e dijetarëve mendojnë se hixhamja lejohet gjatë agjërimit, sipas hadithit të Ibn Abasit që erdhi më vonë.' },
    ],
  },
];

// ─── NUK E PRISHIN ────────────────────────────────────────────────
const NON_BREAKERS = [
  {
    title: 'Harresa',
    body: 'Kush ha a pi nga harresa e plotëson agjërimin — s\'ka kaza e as shpagim.',
    evidence: [
      { book: 'bulugh', ref: '§690–691', text: '«Kush harron se është agjërueshëm dhe ha a pi, le ta plotësojë agjërimin»; «kush çel nga harresa, s\'ka kaza e as kefaret.»', src: 'Muttefekun alejhi; Hakimi — sahih' },
      { book: 'fiqh', ref: '3.138a', text: 'Kush ha nga harresa, gabimi a detyrimi, s\'e ka detyrim ditën e as shpagimin: «Allahu e ushqeu.»' },
    ],
  },
  {
    title: 'Puthja për atë që përmbahet',
    body: 'Puthja dhe përqafimi nuk e prishin agjërimin për atë që e ka kontrollin e vetes.',
    evidence: [
      { book: 'bulugh', ref: '§685', text: 'Aishja (r.a.): Pejgamberi ﷺ puthte e përqafonte ndërsa ishte agjërueshëm, sepse e kishte kontrollin më të madh mbi dëshirën.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.134a', text: 'Puthja lejohet për atë që ka fuqi ta përmbajë veten; ejakulimi megjithatë e prish agjërimin dhe kërkon kaza.' },
    ],
  },
  {
    title: 'Xhunubllëku deri në mëngjes',
    body: 'Kush gdhihet xhunub (nga marrëdhëniet e natës) lahet dhe agjëron — dita vlen.',
    evidence: [
      { book: 'bulugh', ref: '§698', text: 'Aishja dhe Umm Seleme: Pejgamberi ﷺ gdhihej xhunub një ditë të Ramazanit, pastaj lahej dhe agjëronte — dhe s\'e zëvendësonte atë ditë.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.137a', text: 'Lejohet për agjëruesin të gdhihet xhunub; s\'kërkohet gusli para agimit.' },
    ],
  },
  {
    title: 'Misvaku dhe kolliri',
    body: 'Misvaku lejohet në fillim e në fund të ditës; për kolirin s\'ka hadith të saktë që ta ndalojë.',
    evidence: [
      { book: 'bulugh', ref: '§689', text: 'Aishja: Pejgamberi ﷺ vinte kollir ndërsa agjëronte (Ibn Maxhe — i dobët); sipas Tirmidhiut s\'ka gjë të saktë për kolirin.', src: 'Ibn Maxhe' },
      { book: 'fiqh', ref: '3.133', text: 'Pëlqehet që agjëruesi të përdorë misvakun — s\'ka dallim në fillim a në fund të ditës.' },
    ],
  },
  {
    title: 'Dyshimi për agimin',
    body: 'Kush dyshon a ka hyrë agimi, mund të hajë e pijë derisa të bindet se agimi ka hyrë.',
    evidence: [
      { book: 'fiqh', ref: '3.131', text: 'Ibn Abasi: «Ha derisa të jesh i sigurt për kohën.» Veprimi s\'bazohet në dyshim — «hani derisa t\'ju dallohet peri i bardhë nga i ziu.»' },
      { book: 'bulugh', ref: '§698 (shën.)', text: 'Sinjalet e agimit janë të qarta; agjërimi fillon me agimin e vërtetë që përhapet në horizont.', src: 'El-Bekare 2:187' },
    ],
  },
];

// ─── KUSH LIROHET ─────────────────────────────────────────────────
const EXEMPT = [
  {
    title: 'I sëmuri dhe udhëtari — kaza',
    body: 'Lejohet të çelin dhe t\'i zëvendësojnë ditët më vonë, njësoj sa kanë humbur.',
    evidence: [
      { book: 'bulugh', ref: '§695', text: 'Hamza el-Eslemiut, që pyeti a të agjëronte në udhëtim: «Është një lehtësim nga Allahu — kush e merr ka bërë mirë; kush do të agjërojë, s\'ka gjynah.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '3.116', text: '«Kush është i sëmurë a në udhëtim, le t\'i zëvendësojë në ditë të tjera.» (El-Bekare 185) — mund të zëvendësohen me radhë a pa radhë.' },
    ],
  },
  {
    title: 'I moshuari dhe i sëmuri kronik — fidje',
    body: 'Kush s\'mund të agjërojë fare ushqen një të varfër për çdo ditë — pa detyrim zëvendësimi.',
    evidence: [
      { book: 'bulugh', ref: '§696', text: '«Të moshuarit i lejohet të çelë, por duhet të ushqejë një të varfër për çdo ditë, dhe s\'e ka detyrim zëvendësimin.»', src: 'Darakutni & Hakimi — sahih' },
      { book: 'fiqh', ref: '3.115', text: 'Të moshuarit, të sëmurët kronikë dhe punëtorët në kushte të rënda ushqejnë një të varfër për ditë (fidje), pa zëvendësuar ditët.' },
    ],
  },
  {
    title: 'Shtatzëna dhe gjidhënësja',
    body: 'Nëse frikësohen për veten a për fëmijën, mund të çelin — pastaj zëvendësojnë ose japin fidje sipas medhhebit.',
    differed: true,
    evidence: [
      { book: 'fiqh', ref: '3.115', text: 'Ibn Abasi: shtatzëna e gjidhënësja që frikësohen për fëmijën çelin e japin fidje; hanefitë e disa të tjerë thonë vetëm kaza. Mendimet ndryshojnë.' },
      { book: 'bulugh', ref: '§696', text: 'Baza është koncesioni i njëjtë me të moshuarin: «i lejohet të çelë… dhe ushqen një të varfër.»', src: 'Darakutni & Hakimi' },
    ],
  },
  {
    title: 'Fëmija dhe i pavetëdijshmi',
    body: 'Agjërimi s\'është detyrë për fëmijën para pubertetit e as për të çmendurin; fëmijët nxiten të mësohen.',
    evidence: [
      { book: 'fiqh', ref: '3.114a', text: '«Lapsi është ngritur për tre: të çmendurin derisa të vijë në vete, të fjeturin derisa të zgjohet, dhe fëmijën derisa të rritet.» (Ahmedi, Ebu Davudi, Tirmidhiu)' },
      { book: 'fiqh', ref: '3.114b', text: 'Fëmijët nxiten të agjërojnë sa të mësohen; sahabët u jepnin fëmijëve lodra për t\'i mbajtur deri në iftar. (Buhariu & Muslimi)' },
    ],
  },
];

// ─── DITËT E NDALUARA ─────────────────────────────────────────────
const FORBIDDEN_DAYS = [
  {
    title: 'Dy bajramet',
    body: 'Ndalohet agjërimi ditën e Fitër Bajramit dhe ditën e Kurban Bajramit — farz a nafile qoftë.',
    evidence: [
      { book: 'bulugh', ref: '§706', text: 'Pejgamberi ﷺ ndaloi agjërimin në dy ditë: ditën e Fitrit dhe ditën e Kurbanit.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.120a', text: 'Të gjithë dijetarët pajtohen se agjërimi këto dy ditë është i ndaluar, farz a vullnetar qoftë.' },
    ],
  },
  {
    title: 'Ditët e teshrikut',
    body: 'Tri ditët pas Kurban Bajramit (11, 12, 13 Dhulhixhe) janë ditë ngrënieje, pirjeje dhe dhikri.',
    evidence: [
      { book: 'bulugh', ref: '§707', text: '«Ditët e teshrikut janë ditë ngrënieje, pirjeje dhe përmendjeje të Allahut.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '3.120b', text: 'S\'lejohet agjërimi tri ditët pas Kurban Bajramit; Pejgamberi ﷺ dërgoi të shpallej në Mina: «Këto janë ditë ngrënieje e pirjeje.»' },
    ],
  },
  {
    title: 'Vetëm e premtja a e shtuna',
    body: 'Nuk veçohet e premtja për agjërim pa ditën para a pas saj; as e shtuna vetëm (veç farzit).',
    evidence: [
      { book: 'bulugh', ref: '§710, §712', text: '«Askush prej jush të mos agjërojë të premten, veçse bashkë me një ditë para a pas»; «mos agjëroni të shtunën, veç në agjërim farz.»', src: 'Muttefekun alejhi; të pestë imamët' },
      { book: 'fiqh', ref: '3.121', text: 'Veçimi i së premtes a së shtunës për agjërim është i papëlqyer — përveç kur bie brenda një zakoni agjërimi.' },
    ],
  },
  {
    title: 'Dita e dyshimit',
    body: 'Nuk agjërohet dita e dyshimit para Ramazanit, as një a dy ditë para tij (veç zakonit).',
    evidence: [
      { book: 'bulugh', ref: '§671–672', text: '«Askush të mos agjërojë një a dy ditë para Ramazanit, veç nëse i bie brenda zakonit»; kush agjëron ditën e dyshimit ka kundërshtuar Ebu Kasimin ﷺ.', src: 'Muttefekun alejhi; të pestë imamët — sahih' },
      { book: 'fiqh', ref: '3.122a', text: 'Dita e dyshimit është ajo para Ramazanit kur s\'dihet a është fundi i Shabanit apo fillimi i Ramazanit.' },
    ],
  },
  {
    title: 'Agjërimi i përhershëm',
    body: 'Ndalohet agjërimi pandërprerë gjithë vitin dhe vasli (agjërimi ditë e natë pa iftar).',
    evidence: [
      { book: 'bulugh', ref: '§715, §683', text: '«S\'ka agjëruar ai që agjëron përgjithmonë»; Pejgamberi ﷺ ndaloi vaslin — «kush prej jush është si unë? Unë ushqehem e freskohem nga Zoti im.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.124', text: 'Vasli (agjërimi i vazhdueshëm pa çelur) është i ndaluar; Pejgamberi ﷺ e ndaloi si mëshirë për umetin.' },
    ],
  },
];

// ─── AGJËRIMET VULLNETARE ─────────────────────────────────────────
const VOLUNTARY = [
  {
    title: 'Gjashtë ditët e Shevalit',
    body: 'Kush agjëron Ramazanin dhe e ndjek me gjashtë ditë të Shevalit, është sikur të kishte agjëruar gjithë vitin.',
    evidence: [
      { book: 'bulugh', ref: '§701', text: '«Kush agjëron Ramazanin dhe e ndjek me gjashtë ditë të Shevalit, është sikur të kishte agjëruar gjithë vitin.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '3.124b', text: 'Sipas Ahmedit mund të agjërohen me radhë a pa radhë; hanefitë e shafitë e pëlqejnë me radhë pas bajramit.' },
    ],
  },
  {
    title: 'Dita e Arafatit',
    body: 'Agjërimi i ditës së Arafatit (9 Dhulhixhe) shlyen mëkatet e një viti para dhe një viti pas — për jo-haxhiun.',
    evidence: [
      { book: 'bulugh', ref: '§700, §714', text: '«Agjërimi i ditës së Arafatit është shpagim për vitin para dhe vitin pas»; por Pejgamberi ﷺ e ndaloi për atë që është vetë në Arafat.', src: 'Muslimi; të pestë imamët' },
      { book: 'fiqh', ref: '3.124c', text: 'Tirmidhiu: dijetarët pëlqejnë agjërimin e Arafatit, veç për atë që është duke bërë haxhin në Arafat.' },
    ],
  },
  {
    title: 'Dita e Ashures',
    body: 'Agjërimi i Ashures (10 Muharrem) shlyen mëkatet e vitit të kaluar; pëlqehet edhe dita e 9-të bashkë me të.',
    evidence: [
      { book: 'bulugh', ref: '§700', text: '«Agjërimi i ditës së Ashures është shpagim për vitin e kaluar.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '3.125', text: '«Nëse jetoj deri vitin tjetër, do të agjëroj të nëntën» — pëlqehet 9 me 10 Muharrem, për t\'u dalluar nga çifutët. (Muslimi & Ebu Davudi)' },
    ],
  },
  {
    title: 'E hëna dhe e enjtja',
    body: 'Veprat i paraqiten Allahut të hënën e të enjten — Pejgamberi ﷺ pëlqente t\'i agjëronte.',
    evidence: [
      { book: 'fiqh', ref: '3.128', text: '«Veprat paraqiten çdo të hënë e të enjte, ndaj dua që vepra ime të paraqitet ndërsa jam agjërueshëm.» (Ahmedi — sahih); e hëna është dita kur linda dhe mora shpalljen.' },
      { book: 'bulugh', ref: '§700', text: 'Për të hënën: «Kjo është dita kur linda, dita kur u dërgova dhe dita kur më zbriti shpallja.»', src: 'Muslimi' },
    ],
  },
  {
    title: 'Tri ditët e bardha',
    body: 'Tri ditë të çdo muaji — 13, 14, 15 (netët e hënës së plotë) — janë sikur agjërimi i gjithë vitit.',
    evidence: [
      { book: 'bulugh', ref: '§704', text: 'Pejgamberi ﷺ na urdhëroi të agjërojmë tri ditë të çdo muaji: ditët e hënës së plotë — 13, 14, 15.', src: 'Nesaiu & Tirmidhiu — sahih sipas Ibn Hibanit' },
      { book: 'fiqh', ref: '3.128a', text: '«Është si agjërimi i gjithë vitit» — tri ditë të çdo muaji.' },
    ],
  },
  {
    title: 'Shumica e Shabanit',
    body: 'Pejgamberi ﷺ agjëronte më shumë në Shaban se në çdo muaj tjetër, veç Ramazanit.',
    evidence: [
      { book: 'bulugh', ref: '§703', text: 'Aishja: «S\'e kam parë Pejgamberin ﷺ të agjërojë një muaj të plotë veç Ramazanit, dhe s\'e kam parë të agjërojë më shumë se në Shaban.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '3.127', text: 'Shabani është muaji kur veprat ngrihen tek Allahu; Pejgamberi ﷺ donte të ishte agjërueshëm kur ngrihen veprat e tij.' },
    ],
  },
];

// ─── ITIKAFI & NATA E KADRIT ──────────────────────────────────────
const ITIKAF = {
  cards: [
    {
      title: 'Dhjetë ditët e fundit',
      body: 'Pejgamberi ﷺ bënte itikaf dhjetë ditët e fundit të Ramazanit deri sa vdiq; pas tij e bënin gratë e tij.',
      evidence: [
        { book: 'bulugh', ref: '§719', text: 'Aishja: Pejgamberi ﷺ bënte itikaf dhjetë ditët e fundit të Ramazanit deri sa vdiq; pastaj gratë e tij bënin itikaf pas tij.', src: 'Muttefekun alejhi' },
        { book: 'fiqh', ref: '3.147a', text: 'Të gjithë dijetarët pajtohen për ligjshmërinë e tij; Pejgamberi ﷺ e bënte dhjetë ditë çdo Ramazan, e vitin që vdiq njëzet ditë.' },
      ],
    },
    {
      title: 'Ngjitja për ibadet',
      body: 'Dhjetë netët e fundit i kalonte zgjuar në ibadet, i shtrëngonte rrobat dhe i zgjonte gratë.',
      evidence: [
        { book: 'bulugh', ref: '§718', text: 'Aishja: Me hyrjen e dhjetë ditëve të fundit, Pejgamberi ﷺ e shtrëngonte brezin, rrinte zgjuar tërë natën dhe i zgjonte gratë.', src: 'Muttefekun alejhi' },
        { book: 'fiqh', ref: '3.145', text: 'Pëlqehet kërkimi i Natës së Kadrit në dhjetë netët e fundit, sepse Pejgamberi ﷺ përpiqej më shumë atëherë.' },
      ],
    },
    {
      title: 'Nata e Kadrit',
      body: 'Nata më e mirë e vitit — më e mirë se një mijë muaj. Kërkohet në netët teke të dhjetëshit të fundit.',
      evidence: [
        { book: 'bulugh', ref: '§724', text: '«Ëndrrat tuaja u pajtuan se (Nata e Kadrit) është në shtatë netët e fundit — kush do ta kërkojë, le ta kërkojë atje.»', src: 'Muttefekun alejhi' },
        { book: 'fiqh', ref: '3.144a', text: 'Nata e Kadrit është nata më e virtytshme e vitit: «Është më e mirë se një mijë muaj.» (El-Kadr)' },
      ],
    },
    {
      title: 'Lutja e Natës së Kadrit',
      body: 'Kur Aishja pyeti ç\'të thoshte atë natë, Pejgamberi ﷺ i mësoi lutjen e faljes.',
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      translit: 'Allahumme inneke afuvvun tuhibbul-afve fa\'fu anni.',
      translation: 'O Allah, Ti je Falës, e do faljen, andaj më fal mua.',
      evidence: [
        { book: 'bulugh', ref: '§726', text: 'Aishja pyeti ç\'të thoshte natën e Kadrit; tha: «Thuaj: O Allah, Ti je Falës e do faljen, andaj më fal mua.»', src: 'Të pestë imamët veç Ebu Davudit — sahih' },
        { book: 'fiqh', ref: '3.145b', text: '«Kush falet natën e Kadrit me besim e duke shpresuar shpërblimin, i falen mëkatet e kaluara.» (Buhariu & Muslimi)' },
      ],
    },
  ],
};

// ─── PAGE ─────────────────────────────────────────────────────────
export default function AgjerimiPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: SANS, color: C.dark900, paddingBottom: 80 }}>
      <style>{`
        .agj-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
        .agj-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items: start; }
        @media (max-width: 860px) { .agj-grid-2, .agj-grid-3 { grid-template-columns: 1fr; } }
        .agj-hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 44px; align-items: center; }
        @media (max-width: 860px) { .agj-hero-grid { grid-template-columns: 1fr; gap: 28px; } }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,4vw,56px) clamp(24px,3vw,40px)' }}>
        <div className="agj-hero-grid">
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600, marginBottom: 16 }}>Agjërimi · Es-Sijam</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px,4.6vw,54px)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.018em', margin: 0, color: C.dark900 }}>
              Ramazani,<br/>
              <em style={{ fontStyle: 'italic', fontWeight: 500, color: C.gold700 }}>agim pas agimi.</em>
            </h1>
            <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.65, color: C.warm700, marginTop: 20, maxWidth: 520 }}>
              Shtylla e katërt e Islamit. Çdo rregull në këtë faqe mbështetet
              në dy burime klasike njëherësh — hadithet e <em>Bulugh al-Maram</em> të
              Ibn Haxherit dhe shpjegimet e <em>Fikhut të Sunetit</em> të Sejjid Sabikut.
            </p>
          </div>
          <div style={{
            background: `linear-gradient(150deg, ${C.nightDark} 0%, ${C.night} 100%)`,
            borderRadius: 22, padding: 'clamp(22px,3vw,34px)',
            boxShadow: '0 16px 40px rgba(36,31,69,0.3)',
            color: '#EDEAF6',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 14 }}>Urdhri në Kuran</div>
            <div dir="rtl" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: 'clamp(19px,2vw,24px)', lineHeight: 2, textAlign: 'right' }}>
              {VERSE.ar}
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 14, opacity: 0.92, fontStyle: 'italic' }}>{VERSE.alb}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, marginTop: 10, opacity: 0.65, letterSpacing: '0.06em' }}>— {VERSE.ref}</div>
          </div>
        </div>
      </section>

      {/* ── Virtytet ── */}
      <section style={{ maxWidth: 1100, margin: '24px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Virtytet" title="Pse agjërojmë" sub="Agjërimi është mburojë dhe adhurim që Allahu e ka lidhur veçanërisht me Veten." />
        <div className="agj-grid-3">
          {VIRTUES.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Hyrja e Ramazanit ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Fillimi" title="Kur nis Ramazani dhe si bëhet nijeti" sub="Muaji hapet me shikimin e hënës së re; agjërimi farz kërkon nijet çdo natë para agimit." />
        <div className="agj-grid-3">
          {RAMADAN_START.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Adabet ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Adabet" title="Syfyri, iftari dhe sjellja" sub="Nga bereqeti i syfyrit te nxitimi i iftarit — dhe ruajtja e gjuhës që agjërimi të mos mbetet vetëm uri." />
        <div className="agj-grid-2">
          {FASTING_ADAB.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Prishësit ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Prishësit" title="Çfarë e prish agjërimin — dhe çfarë jo" sub="Rregulli bazë: veprimi s\'bazohet në dyshim, dhe harresa nuk e prish agjërimin." />
        <div className="agj-grid-2">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A2020', fontFamily: SANS, marginBottom: 10 }}>E prishin</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {BREAKERS.map(item => <RulingCard key={item.title} item={item} />)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2D6A4F', fontFamily: SANS, marginBottom: 10 }}>Nuk e prishin</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {NON_BREAKERS.map(item => <RulingCard key={item.title} item={item} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Kush lirohet ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Lehtësimet" title="Kush lirohet nga agjërimi" sub="Sëmundja, udhëtimi, mosha dhe shtatzënia — kush zëvendëson ditët dhe kush jep fidje." />
        <div className="agj-grid-2">
          {EXEMPT.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Ditët e ndaluara ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Ditët e ndaluara" title="Kur nuk agjërohet" sub="Ditët e bajrameve, teshriku, dhe veçimi i disa ditëve pa arsye." />
        <div className="agj-grid-3">
          {FORBIDDEN_DAYS.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Vullnetare ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Agjërimet vullnetare" title="Nafile përgjatë vitit" sub="Gjashtë ditët e Shevalit, Arafati, Ashura, e hëna e e enjtja dhe ditët e bardha." />
        <div className="agj-grid-3">
          {VOLUNTARY.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Itikafi ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead eyebrow="Itikafi · الاعتكاف" title="Dhjetë netët e fundit dhe Nata e Kadrit" sub="Ngjitja në xhami për ibadet dhe kërkimi i natës më të mirë të vitit." />
        <div className="agj-grid-2">
          {ITIKAF.cards.map(s => (
            <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.warm200}`, borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.dark900 }}>{s.title}</span>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.warm700, marginTop: 6, fontFamily: SANS }}>{s.body}</div>
              {s.arabic && (
                <div style={{ background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 12, padding: '14px 16px', marginTop: 12 }}>
                  <div dir="rtl" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: 20, lineHeight: 1.9, color: C.dark900, textAlign: 'right' }}>{s.arabic}</div>
                  <div style={{ fontSize: 13, fontStyle: 'italic', color: C.gold700, marginTop: 8, lineHeight: 1.6 }}>{s.translit}</div>
                  <div style={{ fontSize: 13, color: C.warm700, marginTop: 6, lineHeight: 1.6 }}>{s.translation}</div>
                </div>
              )}
              <SourceChip evidence={s.evidence} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Sources footer ── */}
      <section style={{ maxWidth: 1100, margin: '56px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <div style={{ background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 16, padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: C.warm700, fontFamily: SANS }}>
            <strong style={{ color: C.dark900 }}>Burimet.</strong> Çdo rregull në këtë faqe mbështetet njëkohësisht në{' '}
            <em>Bulugh al-Maram</em> të Ibn Haxher el-Askalanit (Libri i Agjërimit, hadithet 671–727)
            dhe në <em>Fikhun e Sunetit</em> të Sejjid Sabikut (kapitujt 3.107–3.156). Aty ku dy burimet
            shënojnë mospajtim mes dijetarëve, rregulla mban shenjën <em>«Mendime të ndryshme»</em>.
            Për raste të veçanta pyet një hoxhë të kualifikuar.
          </div>
        </div>
      </section>
    </div>
  );
}
