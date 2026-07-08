import { useState } from "react";
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
  water:    '#2E6A8A',
  waterDark:'#1F4F6B',
};

// Every ruling below is included only where Bulugh al-Maram and Fiqh-us-Sunnah
// agree; rulings the two sources flag as disputed carry `differed: true`.

// ─── ABDESI — STEPS ───────────────────────────────────────────────
const VERSE = {
  ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ',
  alb: 'O ju që besuat! Kur të çoheni për namaz, lani fytyrat tuaja dhe duart deri në bërryla, jepini mes-h kokës dhe lani këmbët deri në nyje.',
  ref: 'El-Maide 5:6',
};

const WUDU_STEPS = [
  {
    n: 1, name: 'Nijeti', nameAr: 'النِّيَّة', type: 'farz',
    body: 'Vendose në zemër qëllimin që po pastrohesh për Allahun. Nijeti është vepër e zemrës — nuk shqiptohet me zë dhe nuk ka tekst të veçantë.',
    evidence: [
      { book: 'fiqh', ref: '1.27a', text: '«Veprat janë sipas qëllimeve, dhe secilit i takon ajo që ka pasur për qëllim.» Nijeti është kusht i abdesit; shqiptimi i tij me gojë nuk është pjesë e ligjit islam.', src: 'Hadithi i Umerit — Buhariu & Muslimi' },
    ],
  },
  {
    n: 2, name: 'Bismilahi', nameAr: 'التَّسْمِيَة', type: 'sunet',
    body: 'Thuaj «Bismilah» para se të fillosh.',
    evidence: [
      { book: 'bulugh', ref: '§55', text: '«Kush nuk e përmend emrin e Allahut në fillim të abdesit, ai nuk ka abdes (të plotë).»', src: 'Ahmedi, Ebu Davudi, Ibn Maxhe — zinxhir i dobët' },
      { book: 'fiqh', ref: '1.29', text: 'Hadithet për këtë janë të dobëta, por të gjitha zinxhirët tregojnë se veprimi ka bazë. Është vepër e mirë dhe pjesë e adhurimit në përgjithësi.' },
    ],
  },
  {
    n: 3, name: 'Larja e duarve', nameAr: 'غَسْلُ الكَفَّيْنِ', type: 'sunet', times: '3×',
    body: 'Laji duart deri në kyçe tri herë. Pas gjumit kjo është edhe më e theksuar — mos i fut duart në enë pa i larë.',
    evidence: [
      { book: 'bulugh', ref: '§37', text: 'Uthmani (r.a.) kërkoi ujë për abdes dhe i lau duart tri herë… pastaj tha: «E kam parë Pejgamberin ﷺ duke marrë abdes pikërisht kështu.»', src: 'Muttefekun alejhi (Buhariu & Muslimi)' },
      { book: 'bulugh', ref: '§43', text: '«Kur ndonjëri prej jush zgjohet nga gjumi, të mos e fusë dorën në enë derisa ta lajë tri herë, sepse nuk e di se ku i ka qëndruar dora natën.»', src: 'Buhariu & Muslimi' },
      { book: 'fiqh', ref: '1.30', text: 'Larja e duarve tri herë në fillim është sunet i vërtetuar nga përshkrimi i abdesit të Pejgamberit ﷺ.' },
    ],
  },
  {
    n: 4, name: 'Shpëlarja e gojës', nameAr: 'المَضْمَضَة', type: 'sunet', times: '3×',
    body: 'Merr ujë në gojë, shpëlaje mirë dhe nxirre — tri herë. Pejgamberi ﷺ e bënte me të njëjtin grusht uji bashkë me hundën.',
    evidence: [
      { book: 'bulugh', ref: '§59', text: 'Abdullah ibn Zejdi (r.a.): «E futi dorën në enë, e shpëlau gojën dhe e thithi ujin me hundë nga i njëjti grusht uji — tri herë.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.30a', text: '«Kur dikush merr abdes, le ta shpëlajë gojën.» (Ebu Davudi, Bejhekiu)' },
    ],
  },
  {
    n: 5, name: 'Hunda', nameAr: 'الاسْتِنْشَاق', type: 'sunet', times: '3×',
    body: 'Thith ujë me hundë dhe nxirre — tri herë. Suneti është ta thithësh me të djathtën dhe ta nxjerrësh me të majtën, thellë — veç nëse je agjërueshëm.',
    evidence: [
      { book: 'bulugh', ref: '§44', text: '«Plotësoje dhe përsose abdesin, kaloje ujin mes gishtave dhe thithe ujin thellë me hundë — veç nëse je duke agjëruar.»', src: 'Katër imamët — sahih sipas Ibn Huzejmes' },
      { book: 'fiqh', ref: '1.30b', text: '«Kur dikush merr abdes, le të thithë ujë me hundë e pastaj ta nxjerrë.» (Buhariu, Muslimi, Ebu Davudi)' },
    ],
  },
  {
    n: 6, name: 'Larja e fytyrës', nameAr: 'غَسْلُ الوَجْهِ', type: 'farz', times: '3×',
    body: 'Laje fytyrën nga fillimi i ballit deri nën nofull, dhe nga veshi te veshi. Nëse ke mjekër, kaloji gishtat e lagur nëpër të.',
    evidence: [
      { book: 'bulugh', ref: '§37', text: '«…pastaj e lau fytyrën tri herë…» — nga përshkrimi i abdesit të Pejgamberit ﷺ prej Uthmanit (r.a.).', src: 'Muttefekun alejhi' },
      { book: 'bulugh', ref: '§46', text: 'Uthmani (r.a.): Pejgamberi ﷺ i kalonte gishtat nëpër mjekër gjatë abdesit.', src: 'Tirmidhiu — sahih sipas Ibn Huzejmes' },
      { book: 'fiqh', ref: '1.27b', text: 'Larja e fytyrës është farz i përmendur në Kuran (El-Maide 6): uji duhet të kalojë nga balli deri te nofulla dhe nga njëri vesh te tjetri.' },
    ],
  },
  {
    n: 7, name: 'Krahët deri në bërryla', nameAr: 'غَسْلُ اليَدَيْنِ', type: 'farz', times: '3×',
    body: 'Laje krahun e djathtë nga gishtat deri mbi bërryl tri herë, pastaj të majtin. Bërrylat përfshihen në larje.',
    evidence: [
      { book: 'bulugh', ref: '§37', text: '«…pastaj e lau krahun e djathtë deri në bërryl (duke e përfshirë) tri herë, pastaj të majtin po ashtu…»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.27c', text: 'Bërrylat duhen larë, sepse ashtu veproi Pejgamberi ﷺ — kjo është farz nga El-Maide 6.' },
    ],
  },
  {
    n: 8, name: 'Mes-hi i kokës', nameAr: 'مَسْحُ الرَّأْسِ', type: 'farz', times: '1×',
    body: 'Me duart e lagura fshije kokën një herë: nga balli drejt zverkut dhe kthehu përsëri te balli.',
    evidence: [
      { book: 'bulugh', ref: '§39–40', text: '«E fshiu kokën me të dyja duart: filloi nga pjesa e përparme e kokës, i çoi deri te zverku, pastaj i ktheu përsëri aty ku kishte filluar.»', src: 'Muttefekun alejhi' },
      { book: 'bulugh', ref: '§38', text: 'Aliu (r.a.), për abdesin e Pejgamberit ﷺ: «E fshiu kokën një herë.»', src: 'Ebu Davudi, Tirmidhiu, Nesaiu — zinxhir i saktë' },
      { book: 'fiqh', ref: '1.27d', text: 'Mes-hi i kokës është farz. Nuk mjafton vetëm ta vendosësh dorën a të prekësh kokën me gisht të lagur — dora duhet të lëvizë mbi kokë.' },
    ],
  },
  {
    n: 9, name: 'Veshët', nameAr: 'مَسْحُ الأُذُنَيْنِ', type: 'sunet',
    body: 'Me të njëjtin ujë të kokës: gishtat tregues brenda veshëve, gishtat e mëdhenj pas tyre nga jashtë.',
    evidence: [
      { book: 'bulugh', ref: '§41', text: '«…e fshiu kokën, i futi dy gishtat e vegjël në veshë dhe me gishtat e mëdhenj fshiu pjesën e jashtme të veshëve.»', src: 'Ebu Davudi, Nesaiu — sahih sipas Ibn Huzejmes' },
      { book: 'fiqh', ref: '1.32b', text: 'Veshët janë pjesë e kokës — fshihen me të njëjtin ujë: pjesa e brendshme me gishtat tregues, e jashtmja me gishtat e mëdhenj.' },
    ],
  },
  {
    n: 10, name: 'Këmbët deri në nyje', nameAr: 'غَسْلُ الرِّجْلَيْنِ', type: 'farz', times: '3×',
    body: 'Laje këmbën e djathtë deri mbi nyje tri herë, pastaj të majtën. Kalo ujin mes gishtave dhe mos lër asnjë pjesë të thatë — as thembrat.',
    evidence: [
      { book: 'bulugh', ref: '§60', text: 'Pejgamberi ﷺ pa një njeri që i kishte mbetur në këmbë një njollë e thatë sa një thua dhe i tha: «Kthehu dhe merre abdesin si duhet.»', src: 'Ebu Davudi, Nesaiu' },
      { book: 'fiqh', ref: '1.28', text: '«Mjerë thembrat nga zjarri!» — tha Pejgamberi ﷺ kur pa disa që po i fshinin këmbët pa i larë mirë. (Buhariu & Muslimi)' },
    ],
  },
  {
    n: 11, name: 'Duaja pas abdesit', nameAr: 'الدُّعَاءُ بَعْدَهُ', type: 'sunet',
    body: 'Pas abdesit dëshmo shehadetin — për të hapen të tetë dyert e Xhenetit.',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translit: 'Esh-hedu en la ilahe il-lAllahu vahdehu la sherike leh, ve esh-hedu enne Muhammeden abduhu ve resuluhu.',
    translation: 'Dëshmoj se s\'ka të adhuruar tjetër veç Allahut, Një e i pashoq, dhe dëshmoj se Muhamedi është rob dhe i Dërguar i Tij.',
    evidence: [
      { book: 'bulugh', ref: '§62', text: '«Kush e merr abdesin në mënyrë të përsosur dhe pastaj thotë: Dëshmoj se s\'ka të adhuruar tjetër veç Allahut… — i hapen të tetë dyert e Xhenetit, të hyjë nga cila të dojë.»', src: 'Muslimi & Tirmidhiu' },
      { book: 'fiqh', ref: '1.34', text: 'Duaja pas abdesit është nga sunetet e vërtetuara; asaj mund t\'i shtohet edhe lutja për t\'u bërë prej të penduarve e të pastërve.' },
    ],
  },
];

const WUDU_RULES = [
  {
    title: 'Radha nuk ndërrohet',
    body: 'Gjymtyrët lahen në radhën që i përmend Kurani — fytyra, krahët, koka, këmbët.',
    evidence: [
      { book: 'bulugh', ref: '§53', text: '«Filloni me atë me të cilën filloi Allahu.»', src: 'Nesaiu & Muslimi' },
      { book: 'fiqh', ref: '1.28a', text: 'Pejgamberi ﷺ e ndoqi gjithmonë këtë radhë dhe nuk përcillet asnjë rast që të ketë vepruar ndryshe.' },
    ],
  },
  {
    title: 'Fillo nga e djathta',
    body: 'Çdo gjymtyrë e dyfishtë lahet së pari nga ana e djathtë.',
    evidence: [
      { book: 'bulugh', ref: '§51', text: '«Kur të merrni abdes, filloni nga ana juaj e djathtë.»', src: 'Katër imamët — sahih sipas Ibn Huzejmes' },
      { book: 'fiqh', ref: '1.31c', text: 'Aishja (r.a.): «Pejgamberit ﷺ i pëlqente të fillonte nga e djathta në mbathje, në krehje dhe në pastrim.» (Buhariu & Muslimi)' },
    ],
  },
  {
    title: 'Pa ndërprerje',
    body: 'Gjymtyrët lahen njëra pas tjetrës, pa punë të tjera në mes.',
    evidence: [
      { book: 'fiqh', ref: '1.32a', text: 'Larja e çdo gjymtyre menjëherë pas tjetrës është praktika e pandërprerë e brezave të muslimanëve.' },
    ],
  },
  {
    title: 'Kurse ujin',
    body: 'Abdesi merret me pak ujë — teprimi është i papëlqyer edhe buzë lumit.',
    evidence: [
      { book: 'bulugh', ref: '§61', text: 'Enesi (r.a.): «Pejgamberi ﷺ merrte abdes me një mudd (rreth 2/3 litri) dhe lahej me një sa\' deri në pesë mudde.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.32d', text: '«Ç\'është ky shpërdorim, Sa\'d?» — «A ka shpërdorim edhe në ujë?» — «Po, edhe sikur të ishe në një lumë që rrjedh.» (Ahmedi, Ibn Maxhe)' },
    ],
  },
];

// ─── MES-HI MBI MESTE ─────────────────────────────────────────────
const MASH_KHUFF = [
  {
    title: 'Lejohet — mëshirë e sunetit',
    body: 'Në vend që t\'i lash këmbët, mund të fshish me dorë të lagur mbi meste — këpucët e lëkurës që mbulojnë nyjet — pa i hequr fare. Transmetimet për këtë janë të shumta dhe të forta.',
    evidence: [
      { book: 'bulugh', ref: '§63', text: 'Mugire ibn Shu\'be (r.a.): Isha me Pejgamberin ﷺ në udhëtim dhe desha t\'ia heqja mestet për abdes; ai tha: «Lëri ashtu, sepse i vesha kur isha me abdes» — dhe fshiu mbi to.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.44', text: 'Neveviu: të gjithë dijetarët e ixhmasë pajtohen se lejohet — në udhëtim a në shtëpi, me nevojë a pa të. Ibn Haxheri: transmetimet për këtë kalojnë tetëdhjetë, mes tyre nga dhjetë sahabët e përgëzuar me Xhenet.' },
    ],
  },
  {
    title: 'Kushti: vishen me abdes',
    body: 'Mes-hi lejohet vetëm nëse i ke veshur mestet kur ishe me abdes të plotë. Nëse i vesh pa abdes, duhet t\'i heqësh dhe të lash këmbët.',
    evidence: [
      { book: 'bulugh', ref: '§70', text: 'Ebu Bekre (r.a.): Pejgamberi ﷺ lejoi fshirjen mbi meste — tri ditë e net për udhëtarin, një ditë e natë për vendasin — «për sa kohë i kishte veshur kur ishte i pastër».', src: 'Darakutni — sahih sipas Ibn Huzejmes' },
      { book: 'fiqh', ref: '1.45', text: 'Mugireja: «Lëri, sepse i vesha kur isha i pastër.» Ky është kushti i vetëm i vërtetuar; stipulimet e tjera (të mbulojnë plotësisht nyjen, të ecësh dot me to) Ibn Tejmije i quajti të dobëta.' },
    ],
  },
  {
    title: 'Fshihet vetëm sipër',
    body: 'Dora e lagur kalon mbi pjesën e sipërme të mestit — mjafton një herë. Nuk kërkohet të fshihet fundi.',
    evidence: [
      { book: 'bulugh', ref: '§65', text: 'Aliu (r.a.): «Po të ishte feja me mendje, fundi i mestit do të kishte më shumë të drejtë të fshihej se sipër; por e pashë Pejgamberin ﷺ duke fshirë mbi sipër.»', src: 'Ebu Davudi — zinxhir i mirë (hasen)' },
      { book: 'fiqh', ref: '1.46', text: 'Mugireja: e pashë Pejgamberin ﷺ duke fshirë mbi sipër të mesteve. (Ahmedi, Ebu Davudi, Tirmidhiu — hasen) Nuk ka masë të prerë — mjafton kuptimi gjuhësor i fjalës «fshirje».' },
    ],
  },
  {
    title: 'Afati: 1 ditë vendasi, 3 udhëtari',
    body: 'Vendasi fshin mbi meste një ditë e një natë; udhëtari tri ditë e tri net. Dijetarët ndryshojnë vetëm a nis afati nga mes-hi i parë apo nga prishja e parë e abdesit pas veshjes.',
    evidence: [
      { book: 'bulugh', ref: '§67', text: 'Aliu (r.a.): Pejgamberi ﷺ caktoi tri ditë e tri net për udhëtarin dhe një ditë e një natë për vendasin — si afati i mes-hit mbi meste.', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.46a', text: 'Safvan ibn Assal dhe Aishja (r.a.) transmetojnë të njëjtin afat; Bejhekiu: «ky është transmetimi më i saktë në këtë temë».' },
    ],
  },
  {
    title: 'Çfarë e prish mes-hin',
    body: 'Mes-hi mbi meste bie kur: (1) mbaron afati, (2) bie xhunubllëku, ose (3) i heq mestet. Nëse afati mbaron a i heq kur je me abdes, mjafton t\'i lash këmbët — s\'ke nevojë ta rifillosh abdesin.',
    evidence: [
      { book: 'bulugh', ref: '§66', text: 'Safvan ibn Assal (r.a.): Na urdhëronte të mos i hiqnim mestet tri ditë e net kur ishim udhëtarë; s\'i hiqnim veçse nga xhunubllëku — jo për jashtëqitje, urinë a gjumë.', src: 'Nesaiu & Tirmidhiu' },
      { book: 'fiqh', ref: '1.47', text: 'Mes-hin e prishin: mbarimi i afatit, xhunubllëku dhe heqja e mesteve. Nëse afati mbaron ose i heq kur je i pastër, mjafton t\'i lash këmbët.' },
    ],
  },
  {
    title: 'Edhe mbi çorape e mbulesa',
    body: 'Shumica lejojnë fshirjen edhe mbi çorape të trasha e mbulesa këmbësh të veshura për nevojë (ftohtë, plagë). Disa e kufizuan te mestet e lëkurës; Ebu Hanife fillimisht s\'e lejoi mbi çorape të holla, por e ndryshoi mendimin pak para vdekjes.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§68', text: 'Theubani (r.a.): Pejgamberi ﷺ dërgoi një ekspeditë dhe i urdhëroi të fshinin mbi çallmat dhe mbi mestet e tyre.', src: 'Ahmedi & Ebu Davudi — sahih sipas Hakimit' },
      { book: 'fiqh', ref: '1.44a', text: 'Ibn Tejmije: çdo mbulesë këmbe e veshur për nevojë merr të njëjtin gjykim si mestet. Fshirja mbi këpucë (nalle) transmetohet nga shumë sahabë; Ebu Hanife e ndryshoi mendimin dhe fshiu mbi to gjatë sëmundjes së fundit.' },
    ],
  },
];

// ─── NEXHASET ─────────────────────────────────────────────────────
const NAJASAH = [
  {
    title: 'Qeni — larje shtatë herë',
    body: 'Ena që e lëpin qeni lahet shtatë herë, njëra prej tyre me dhé (ujë të përzier me baltë). Qimja e qenit, megjithatë, është e pastër.',
    evidence: [
      { book: 'bulugh', ref: '§12', text: 'Ebu Hurejra (r.a.): «Pastrimi i enës që e ka lëpirë qeni bëhet duke e larë shtatë herë, të parën me dhé.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.13a', text: 'Qeni është nexhs; ena e lëpirë prej tij lahet shtatë herë, e para me baltë (ujë të përzier me dhé derisa të turbullohet). Qimja e qenit vetë është e pastër.' },
    ],
  },
  {
    title: 'Macja s\'është e papastër',
    body: 'Uji dhe ena që prek macja mbeten të pastra — mund të marrësh abdes e të pish prej tyre pa problem.',
    evidence: [
      { book: 'bulugh', ref: '§13', text: 'Ebu Katade (r.a.): Për macen, Pejgamberi ﷺ tha: «Ajo s\'është e papastër; është nga ata që sillen mes jush.»', src: 'Katër imamët — sahih sipas Tirmidhiut e Ibn Huzejmes' },
      { book: 'fiqh', ref: '1.6', text: 'Uji i mbetur pasi pi macja është i pastër — macja s\'është nexhs, sepse sillet vazhdimisht mes njerëzve.' },
    ],
  },
  {
    title: 'Urina e foshnjës',
    body: 'Urina e vajzës së vogël lahet me ujë; urina e djalit të vogël që ende s\'ha ushqim (vetëm gji) mjafton të spërkatet me ujë. Kur fëmija fillon të hajë, të dyja lahen.',
    evidence: [
      { book: 'bulugh', ref: '§33', text: 'Ebu Semh (r.a.): «Urina e vajzës lahet, kurse mbi urinën e djalit vetëm spërkatet ujë.»', src: 'Ebu Davudi & Nesaiu — sahih sipas Hakimit' },
      { book: 'fiqh', ref: '1.9a', text: 'Um Kajs: foshnja i urinoi në prehër Pejgamberit ﷺ; ai kërkoi ujë dhe e spërkati rrobën pa e larë plotësisht. (Buhariu & Muslimi) Spërkatja mjafton sa djali është me gji; kur ha ushqim, urina lahet.' },
    ],
  },
  {
    title: 'Gjaku i hajdit në rroba',
    body: 'Gjaku i menstruacioneve në rroba: gërvishte, fërkoje me ujë, spërkate — pastaj falu me to. Nëse mbetet ndonjë gjurmë ngjyre pas larjes, s\'ka gjë.',
    evidence: [
      { book: 'bulugh', ref: '§34', text: 'Esma bint Ebu Bekr (r.a.): Për gjakun e menstruacioneve në rroba — «Gërvishte, fërkoje me ujë, spërkate dhe falu me to.»', src: 'Muttefekun alejhi' },
      { book: 'bulugh', ref: '§35', text: 'Havla pyeti ç\'të bëjë nëse gjurma s\'largohet krejt; Pejgamberi ﷺ: «Uji të mjafton, dhe s\'ka gjë nëse mbetet një shenjë.»', src: 'Tirmidhiu — zinxhir i dobët' },
      { book: 'fiqh', ref: '1.13', text: 'Rrobat a trupi i ndotur me nexhs lahen me ujë derisa të pastrohen; gjurmët e vështira që mbeten pas larjes falen.' },
    ],
  },
  {
    title: 'Menia — fshihet kur është e njomë',
    body: 'Shumica e dijetarëve e quajnë menien të pastër: nëse është e njomë, laje ose fshije; nëse është tharë, gërvishte — dhe falu me atë rrobë. Disa dijetarë e quajnë nexhs.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§30–32', text: 'Aishja (r.a.): «E laja menien nga rroba e Pejgamberit ﷺ, pastaj ai dilte e falej me të» — dhe në një version: «e fërkoja»; në një tjetër: «e gërvishtja me thua kur ishte tharë.»', src: 'Muttefekun alejhi + Muslimi' },
      { book: 'fiqh', ref: '1.11', text: 'Sabiku: dukshëm menia është e pastër, sepse vetëm rekomandohet të lahet kur është e njomë e të gërvishtet kur është tharë; një pjesë e dijetarëve e quajnë nexhs.' },
    ],
  },
  {
    title: 'Papastërtia në tokë',
    body: 'Papastërtia e lëngshme në tokë pastrohet duke hedhur ujë mbi të — s\'ka nevojë ta gërmosh a ta heqësh dheun.',
    evidence: [
      { book: 'bulugh', ref: '§14', text: 'Enesi (r.a.): Një beduin urinoi në një cep të xhamisë; Pejgamberi ﷺ i ndaloi ta ndërprisnin, pastaj urdhëroi të hidhnin një kovë të madhe ujë mbi urinë.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.14', text: 'Toka e ndotur pastrohet duke derdhur ujë mbi të. Kjo mjafton për nexhsin e lëngshëm; nëse papastërtia është e ngurtë, ajo hiqet.' },
    ],
  },
];

// ─── ADABET E NEVOJËS ─────────────────────────────────────────────
const ISTINJA = [
  {
    title: 'Dua-ja e hyrjes dhe daljes',
    body: 'Kur hyn (ose para se të zbulohesh në natyrë), thuaj: «Bismil-lah, Allahumme inni eudhu bike minel-hubthi vel-habaith» — kërkoj mbrojtje te Ti nga djajtë mashkuj e femra. Kur del, thuaj: «Gufraneke» — kërkoj faljen Tënde.',
    evidence: [
      { book: 'bulugh', ref: '§94', text: 'Enesi (r.a.): Kur hynte në nevojtore, Pejgamberi ﷺ thoshte: «O Allah, kërkoj mbrojtje te Ti nga djajtë mashkuj e femra.»', src: 'Shtatë imamët' },
      { book: 'bulugh', ref: '§106', text: 'Aishja (r.a.): Kur dilte nga nevojtorja, thoshte «Gufraneke» — «Kërkoj faljen Tënde».', src: 'Pesë imamët — sahih' },
      { book: 'fiqh', ref: '1.17a', text: 'Enesi: hyrja fillon me «Bismil-lah» dhe pastaj lutja e mbrojtjes nga djajtë. (transmeton «grupi»)' },
    ],
  },
  {
    title: 'Fshihu dhe mos fol',
    body: 'Largohu nga sytë e njerëzve kur kryen nevojën. Gjatë saj s\'flitet — as për t\'iu përgjigjur selamit a ezanit — veç në rast nevoje.',
    evidence: [
      { book: 'bulugh', ref: '§96', text: 'Mugire ibn Shu\'be (r.a.): Pejgamberi ﷺ largohej derisa s\'e shihja më, pastaj kryente nevojën.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.17b', text: 'Një njeri e përshëndeti Pejgamberin ﷺ ndërsa urinonte — ai s\'ia ktheu selamin. (grupi, veç Buhariut) Shumica e dijetarëve: të folurit gjatë nevojës është mekruh, jo haram.' },
    ],
  },
  {
    title: 'Mos u drejto nga kibla',
    body: 'Në natyrë të hapur mos ia kthe fytyrën as shpinën Kabes kur kryen nevojën — kthehu nga lindja a perëndimi. Brenda një ndërtese, me pengesë mes teje e kiblës, shumica e lejojnë.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§104', text: 'Ebu Ejjub el-Ensari (r.a.): «Kur ndonjëri kryen nevojën, të mos ia kthejë fytyrën as shpinën kiblës — le të kthehet nga lindja a perëndimi.»', src: 'Shtatë imamët' },
      { book: 'fiqh', ref: '1.18', text: 'Ndalimi vlen për vendet e hapura; Ibn Umeri e pa Pejgamberin ﷺ duke kryer nevojën i kthyer nga Shami me shpinë nga Kaba (brenda një ndërtese). «Nëse ka pengesë mes teje e kiblës, s\'ka gjë.»' },
    ],
  },
  {
    title: 'Pastrimi: ujë ose gurë',
    body: 'Pastrohu me ujë (istinxha) ose me gurë tek numër — jo më pak se tri. Nuk pastrohesh me eshtra a bajga, sepse ato nuk pastrojnë.',
    evidence: [
      { book: 'bulugh', ref: '§95', text: 'Enesi (r.a.): I sillnim Pejgamberit ﷺ një enë me ujë dhe një shkop, dhe ai pastrohej me ujë.', src: 'Muttefekun alejhi' },
      { book: 'bulugh', ref: '§103', text: 'Selmani (r.a.): Na ndaloi të pastrohemi me më pak se tri gurë, ose me eshtra e bajga.', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.19b', text: 'Pastrimi bëhet me tri gurë ose me ujë — të dyja të vërtetuara nga suneti; mund të kombinohen.' },
    ],
  },
  {
    title: 'Me dorën e majtë',
    body: 'Pastrimi pas nevojës bëhet me dorën e majtë. E djathta lihet për ushqim, pije e vepra të nderit.',
    evidence: [
      { book: 'bulugh', ref: '§102', text: 'Ebu Katade (r.a.): «Askush prej jush të mos e prekë organin me dorën e djathtë kur urinon, as të mos pastrohet me të djathtën.»', src: 'Buhariu & Muslimi' },
      { book: 'fiqh', ref: '1.20', text: 'Hafsa (r.a.): Pejgamberi ﷺ e ruante dorën e djathtë për ngrënie, pije e veshje, dhe përdorte të majtën për gjërat e tjera.' },
    ],
  },
  {
    title: 'Ku të mos e bësh — dhe ruaju nga urina',
    body: 'Shmang vendet që i sjellin mallkim njeriut: rrugët, hijet ku ulen njerëzit, dhe ujin e ndenjur a rrjedhës. Ruaju veçanërisht nga spërkatja e urinës — pakujdesia ndaj saj është shkak i shumicës së dënimit të varrit.',
    evidence: [
      { book: 'bulugh', ref: '§97', text: 'Ebu Hurejra (r.a.): «Ruhuni nga dy veprat që sjellin mallkim: kryerja e nevojës në rrugët e njerëzve ose në hijen e tyre.»', src: 'Muslimi' },
      { book: 'bulugh', ref: '§109', text: 'Ebu Hurejra (r.a.): «Ruhuni nga urina, sepse ajo është shkak i shumicës së dënimit të varrit.»', src: 'Darakutni' },
      { book: 'fiqh', ref: '1.18c–1.19', text: 'Ndalohet kryerja e nevojës në rrugë e hije, si dhe urinimi në ujë të ndenjur a rrjedhës.' },
    ],
  },
];

// ─── PRISHËSIT ────────────────────────────────────────────────────
const NULLIFIERS_YES = [
  {
    title: 'Çdo dalje nga trupi',
    body: 'Urina, jashtëqitja dhe gazrat e prishin abdesin.',
    evidence: [
      { book: 'fiqh', ref: '1.35a', text: '«Allahu nuk ia pranon namazin atij që ka lëshuar erë, derisa të marrë abdes të ri.» (Buhariu & Muslimi)' },
    ],
  },
  {
    title: 'Medhji',
    body: 'Lëngu i hollë para-seminal kërkon larjen e organit dhe abdes — jo gusël.',
    evidence: [
      { book: 'bulugh', ref: '§75', text: 'Aliu (r.a.): «Më dilte medhji, ndaj e luta Mikdadin ta pyeste Pejgamberin ﷺ. Ai u përgjigj: Duhet marrë abdes.»', src: 'Buhariu & Muslimi' },
      { book: 'fiqh', ref: '1.35a', text: 'Ibn Abasi: «Për menien duhet gusli; për medhjin dhe vedijin — larja e organit dhe abdesi.» (Bejhekiu)' },
    ],
  },
  {
    title: 'Gjumi i thellë',
    body: 'Gjumi i shtrirë, ku humb vetëdija plotësisht, e prish abdesin. Dremitja ulur — jo.',
    evidence: [
      { book: 'bulugh', ref: '§72', text: 'Sahabët e Pejgamberit ﷺ prisnin jacinë ulur derisa u lëkundeshin kokat nga gjumi, pastaj faleshin pa e ripërtërirë abdesin.', src: 'Ebu Davudi — origjina te Muslimi' },
      { book: 'fiqh', ref: '1.35b', text: 'Kush fle pa i pasur ndenjëset të mbështetura fort në tokë, duhet të marrë abdes të ri; kush dremit ulur, jo.' },
    ],
  },
  {
    title: 'Humbja e vetëdijes',
    body: 'Të fikëtit, dehja ose çdo humbje tjetër e vetëdijes e prish abdesin, pak a shumë të zgjasë.',
    evidence: [
      { book: 'fiqh', ref: '1.36', text: 'Pavetëdija është më e rëndë se gjumi — për këtë dijetarët janë të pajtimit (ixhma).' },
    ],
  },
  {
    title: 'Prekja e organit me pëllëmbë',
    body: 'Sipas shumicës së dijetarëve prish abdesin; medhhebi hanefi mendon se jo.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§79', text: '«Kush e prek organin e vet, të marrë abdes.» Buhariu e quajti hadithin më të saktë në këtë temë.', src: 'Pesë imamët — sahih' },
      { book: 'bulugh', ref: '§78', text: 'Hadithi i Talkut: «Jo (s\'ka abdes), ai është vetëm pjesë e trupit tënd.» Mbi këtë mbështetet mendimi hanefi.', src: 'Pesë imamët — sahih sipas Ibn Hibanit' },
      { book: 'fiqh', ref: '1.36a', text: 'Të dy hadithet janë të vërtetë; shumica e dijetarëve e japin përparësinë hadithit të Busras, se është përcjellë më vonë.' },
    ],
  },
  {
    title: 'Mishi i devesë',
    body: 'Hadithi i saktë thotë të merret abdes pas tij; shumica e dijetarëve megjithatë s\'e quajnë prishës.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§81', text: '«A të marrim abdes pas mishit të deles?» — «Nëse do.» — «Po pas mishit të devesë?» — «Po.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.38b', text: 'Neveviu: ky mendim ka provën më të fortë, edhe pse shumica e dijetarëve mendojnë ndryshe.' },
    ],
  },
];

const NULLIFIERS_NO = [
  {
    title: 'Dyshimi',
    body: 'Derisa të jesh i sigurt se e ke prishur, abdesi vlen.',
    evidence: [
      { book: 'bulugh', ref: '§77', text: '«Të mos dalë nga xhamia derisa të dëgjojë zë ose të ndiejë erë.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.39', text: 'Bindja nuk zhbëhet nga dyshimi — kush s\'është i sigurt, s\'ka nevojë për abdes të ri.' },
    ],
  },
  {
    title: 'Prekja e bashkëshortes',
    body: 'Puthja ose prekja e zakonshme nuk e prish abdesin.',
    evidence: [
      { book: 'bulugh', ref: '§76', text: 'Aishja (r.a.): «Pejgamberi ﷺ e puthi njërën nga gratë e tij dhe doli në namaz pa marrë abdes të ri.»', src: 'Ahmedi & të katërt' },
      { book: 'fiqh', ref: '1.37', text: '«Puthja nuk e prish abdesin dhe as agjërimin.» (Is-hak ibn Rahavejh, Bezari — zinxhir i mirë)' },
    ],
  },
  {
    title: 'Gjaku i plagës',
    body: 'Gjakderdhja nga plaga a nga hundët nuk e prish abdesin.',
    evidence: [
      { book: 'fiqh', ref: '1.38', text: 'Hasani: «Muslimanët faleshin edhe të plagosur.» Umeri (r.a.) u fal ndërsa gjaku i rridhte nga plaga. (Buhariu — mualak; Ebu Davudi)' },
    ],
  },
  {
    title: 'E vjella',
    body: 'Nuk ka hadith të saktë që e vjella e prish abdesin.',
    evidence: [
      { book: 'bulugh', ref: '§80', text: 'Hadithi që urdhëron abdes pas të vjellës është i dobët sipas Ahmedit e të tjerëve.', src: 'Ibn Maxhe — i dobët' },
      { book: 'fiqh', ref: '1.38a', text: 'Pak a shumë qoftë e vjella, s\'ka transmetim të saktë se ajo e prish abdesin.' },
    ],
  },
  {
    title: 'Larja e të vdekurit',
    body: 'Kush lan një të vdekur nuk e ka detyrim abdesin e ri.',
    evidence: [
      { book: 'bulugh', ref: '§82', text: 'Hadithet që e urdhërojnë janë të dobëta — «asnjë transmetim në këtë temë nuk është i saktë» (Ahmedi).', src: 'Ahmedi, Nesaiu, Tirmidhiu — të dobëta' },
      { book: 'fiqh', ref: '1.39b', text: 'Larja e të vdekurit nuk kërkon abdes të ri, sepse transmetimet përkatëse janë të dobëta.' },
    ],
  },
];

// ─── GUSLI ────────────────────────────────────────────────────────
const GHUSL_WHEN = [
  {
    title: 'Dalja e menisë',
    body: 'Me epsh, zgjuar a në gjumë — gusli bëhet obligim.',
    evidence: [
      { book: 'bulugh', ref: '§115', text: '«Uji (gusli) është nga uji (menia).»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.49a', text: 'Dalja e menisë me kënaqësi, zgjuar a në ëndërr, e bën guslin obligim.' },
    ],
  },
  {
    title: 'Marrëdhëniet bashkëshortore',
    body: 'Edhe pa ejakulim, gusli obligohet për të dy.',
    evidence: [
      { book: 'bulugh', ref: '§116–117', text: '«Kur ulet mes katër gjymtyrëve të saj dhe e mundon veten, gusli bëhet i detyrueshëm» — dhe në shtesën e Muslimit: «edhe nëse nuk ejakulon».', src: 'Muttefekun alejhi + Muslimi' },
      { book: 'fiqh', ref: '1.51a', text: 'Takimi i dy vendeve të synetuara e obligon guslin, me ose pa ejakulim.' },
    ],
  },
  {
    title: 'Ëndrra me lagështi',
    body: 'Edhe për gratë — por vetëm nëse gjendet gjurma e lëngut.',
    evidence: [
      { book: 'bulugh', ref: '§118', text: 'E pyetën për gruan që sheh ëndërr siç sheh burri; tha: «Ajo duhet të lahet.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.50', text: 'Kush zgjohet pa asnjë gjurmë lëngu, s\'e ka guslin obligim — edhe nëse e mban mend ëndrrën.' },
    ],
  },
  {
    title: 'Pas menstruacioneve dhe lehonisë',
    body: 'Kur mbaron cikli a lehonia, gusli është kusht për namazin.',
    evidence: [
      { book: 'bulugh', ref: '§152', text: '«Qëndro (pa namaz) sa të zgjaste zakonisht periudha jote, pastaj lahu dhe falu.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.51b', text: 'Gjaku i menstruacioneve dhe i lehonisë e obligojnë guslin me përfundimin e tyre.' },
    ],
  },
  {
    title: 'Pranimi i Islamit',
    body: 'Kush hyn në Islam, pastrohet me gusël.',
    evidence: [
      { book: 'bulugh', ref: '§121', text: 'Kur Thumame ibn Uthali pranoi Islamin, Pejgamberi ﷺ e urdhëroi të lahej.', src: 'Abdurrezaku — origjina muttefekun alejhi' },
      { book: 'fiqh', ref: '1.52a', text: 'Jomuslimanit që pranon Islamin i kërkohet gusli.' },
    ],
  },
  {
    title: 'Xhumaja — gusël i pëlqyer',
    body: 'Abdesi mjafton, por gusli të premten është shumë më i vlefshëm.',
    evidence: [
      { book: 'bulugh', ref: '§123', text: '«Kush merr abdes ditën e xhuma, i mjafton; e kush lahet, larja është më e mirë.»', src: 'Pesë imamët' },
      { book: 'fiqh', ref: '1.55a', text: 'Gusli i xhumasë është nga guslet e pëlqyera, i theksuar veçanërisht për ata që u vjen erë pune.' },
    ],
  },
];

const GHUSL_STEPS = [
  { n: 1, text: 'Laji duart tri herë, pastaj lan vendet e turpshme me dorën e majtë.' },
  { n: 2, text: 'Merr abdes të plotë si për namaz. (Këmbët mund t\'i lësh në fund.)' },
  { n: 3, text: 'Fërko ujin me gishta në rrënjët e flokëve derisa lëkura të laget.' },
  { n: 4, text: 'Hidh ujë mbi kokë tri herë.' },
  { n: 5, text: 'Laje gjithë trupin duke filluar nga ana e djathta, pastaj e majta — sqetullat, veshët, kërthizën — dhe në fund këmbët.' },
];

const GHUSL_SOURCE = {
  evidence: [
    { book: 'bulugh', ref: '§128', text: 'Aishja (r.a.): «Kur lahej nga xhunubllëku, Pejgamberi ﷺ i lante së pari duart, pastaj derdhte ujë me të djathtën mbi të majtën e lante vendet e turpshme, merrte abdesin e namazit, e fërkonte ujin në rrënjët e flokëve, hidhte tri grushta ujë mbi kokë, pastaj mbi gjithë trupin, dhe në fund i lante këmbët.»', src: 'Muttefekun alejhi' },
    { book: 'fiqh', ref: '1.58a', text: 'Kjo është mënyra e saktë e guslit sipas praktikës së Pejgamberit ﷺ — pesë hapa nga hadithi i Aishes dhe i Mejmunes.' },
  ],
  women: {
    title: 'Për gratë',
    body: 'Gruaja lahet njësoj si burri. Gërshetat s\'ka nevojë të zbërthehen — mjafton që uji të arrijë në rrënjët e flokëve.',
    evidence: [
      { book: 'bulugh', ref: '§131', text: 'Umm Seleme pyeti: «I kam flokët të gërshetuara fort — a t\'i zbërthej për gusël?» Tha: «Jo. Të mjafton të hedhësh tri grushta ujë mbi kokë.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.59', text: 'Aishja (r.a.) ua kundërshtoi atyre që i urdhëronin gratë t\'i zbërthenin gërshetat: «Unë lahesha me Pejgamberin ﷺ nga një enë dhe s\'bëja gjë tjetër veç hidhja tri grushta ujë mbi kokë.»' },
    ],
  },
};

// ─── TEJEMUMI ─────────────────────────────────────────────────────
const TAYAMMUM_WHEN = [
  {
    title: 'Nuk gjendet ujë',
    body: 'Në udhëtim a kudo — pasi ta kesh kërkuar ujin sinqerisht.',
    evidence: [
      { book: 'bulugh', ref: '§142', text: '«Dheu i pastër është pastrim për muslimanin, edhe nëse s\'gjen ujë për vite të tëra; e kur ta gjejë ujin, le t\'ia frikësohet Allahut dhe le ta prekë me të lëkurën.»', src: 'Tirmidhiu — hasen sahih' },
      { book: 'fiqh', ref: '1.64a', text: '«Përdore dheun — të mjafton», i tha Pejgamberi ﷺ atij që s\'u fal se ishte xhunub pa ujë. (Buhariu & Muslimi)' },
    ],
  },
  {
    title: 'Sëmundja ose plaga',
    body: 'Kur uji dëmton a rrezikon shërimin, merret tejemum.',
    evidence: [
      { book: 'bulugh', ref: '§147', text: 'Për të plagosurin që u detyrua të lahej dhe vdiq: «I mjaftonte të merrte tejemum, ta mbështillte plagën, të fshinte mbi të dhe ta lante pjesën tjetër të trupit.»', src: 'Ebu Davudi' },
      { book: 'fiqh', ref: '1.64b', text: '«Ata e vranë — Allahu i vraftë! Pse nuk pyetën kur s\'dinin? Ilaçi i padijes është pyetja.» (Ebu Davudi, Ibn Maxhe)' },
    ],
  },
  {
    title: 'I ftohti që rrezikon',
    body: 'Kur uji i akullt dëmton shëndetin dhe s\'ka si të ngrohet.',
    evidence: [
      { book: 'fiqh', ref: '1.65', text: 'Amr ibn Asi mori tejemum një natë të acartë nga frika për jetën dhe Pejgamberi ﷺ e miratoi në heshtje, duke qeshur. (Ahmedi, Ebu Davudi)' },
    ],
  },
];

const TAYAMMUM_HOW = {
  steps: [
    { n: 1, text: 'Bëj nijetin dhe thuaj «Bismilah».' },
    { n: 2, text: 'Goditi lehtë të dyja duart mbi dhé të pastër — dhé, rërë a gur.' },
    { n: 3, text: 'Fryj lehtë në duar që të bjerë pluhuri i tepërt.' },
    { n: 4, text: 'Fshije fytyrën me të dyja duart.' },
    { n: 5, text: 'Fshiji duart deri në kyçe — të djathtën me të majtën dhe anasjelltas.' },
  ],
  evidence: [
    { book: 'bulugh', ref: '§139–140', text: 'Amari (r.a.) u rrokullis në dhé kur ishte xhunub pa ujë; Pejgamberi ﷺ i tha: «Të mjaftonte kjo» — i goditi duart në tokë, fryu në to dhe fshiu fytyrën e duart.', src: 'Muttefekun alejhi' },
    { book: 'fiqh', ref: '1.66b', text: 'Një goditje e dheut mjafton, dhe duart fshihen deri në kyçe. Nga suneti është të fryhet në duar para fshirjes.' },
  ],
  notes: [
    {
      title: 'Çfarë lejon',
      body: 'Tejemumi zë vendin e abdesit dhe të guslit: me të falesh dhe prek Kuranin, sa herë të duash, derisa ta prishësh.',
      evidence: [ { book: 'fiqh', ref: '1.66c', text: 'Pas tejemumit je i pastër — nuk je i detyruar ta bësh brenda kohës së namazit dhe fal me të sa namaze të duash.' } ],
    },
    {
      title: 'Çfarë e prish',
      body: 'Gjithçka që prish abdesin — dhe gjetja e ujit. Namazi i falur me tejemum nuk përsëritet.',
      evidence: [
        { book: 'bulugh', ref: '§144', text: 'Njëri nga dy udhëtarët nuk e përsëriti namazin kur gjetën ujë; Pejgamberi ﷺ i tha: «Ia qëllove sunetit dhe namazi të mjafton.» Tjetrit i tha: «Ti ke shpërblim të dyfishtë.»', src: 'Ebu Davudi, Nesaiu' },
        { book: 'fiqh', ref: '1.66d', text: 'Kush falet me tejemum dhe pastaj gjen ujë, s\'e ka detyrim përsëritjen — por xhunubi duhet të lahet me ujë sapo ta gjejë.' },
      ],
    },
  ],
};

// ─── UI PRIMITIVES ────────────────────────────────────────────────
const BOOK_LABEL = { bulugh: 'Bulugh al-Maram', fiqh: 'Fikhu i Sunetit' };

function chipLabel(evidence) {
  return evidence
    .map(e => `${e.book === 'bulugh' ? 'Bulugh' : 'Fikh'} ${e.ref}`)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(' · ');
}

export function SourceChip({ evidence }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 12 }}>
      <button
        className="abd-chip"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
          color: open ? '#fff' : C.gold700,
          background: open ? C.gold600 : C.gold50,
          border: `1px solid ${open ? C.gold600 : C.gold300}`,
          borderRadius: 20, padding: '4px 12px', cursor: 'pointer',
          fontFamily: SANS, transition: 'all 150ms',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        {chipLabel(evidence)}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {evidence.map((e, i) => (
            <div key={i} style={{
              background: C.surface, border: `1px solid ${C.warm200}`,
              borderLeft: `3px solid ${e.book === 'bulugh' ? C.water : C.gold500}`,
              borderRadius: 10, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: e.book === 'bulugh' ? C.water : C.gold700, fontFamily: SANS, marginBottom: 4 }}>
                {BOOK_LABEL[e.book]} · {e.ref}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: C.dark700, fontFamily: SANS }}>{e.text}</div>
              {e.src && <div style={{ fontSize: 11, color: C.warm500, marginTop: 5, fontFamily: SANS, fontStyle: 'italic' }}>— {e.src}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type, times }) {
  const farz = type === 'farz';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: farz ? '#fff' : C.gold700,
        background: farz ? C.dark900 : C.gold100,
        border: farz ? 'none' : `1px solid ${C.gold300}`,
        borderRadius: 20, padding: '3px 10px', fontFamily: SANS,
      }}>{farz ? 'Farz' : 'Sunet'}</span>
      {times && <span style={{ fontFamily: MONO, fontSize: 11, color: C.warm500 }}>{times}</span>}
    </span>
  );
}

export function SectionHead({ eyebrow, title, sub, id }) {
  return (
    <div id={id} style={{ marginBottom: 26, scrollMarginTop: 84 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600, fontFamily: SANS }}>{eyebrow}</div>
      <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(24px,3vw,34px)', fontWeight: 600, margin: '6px 0 0', color: C.dark900, letterSpacing: '-0.01em' }}>{title}</h2>
      {sub && <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.warm700, margin: '10px 0 0', maxWidth: 640, fontFamily: SANS }}>{sub}</p>}
    </div>
  );
}

export function RulingCard({ item }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${item.differed ? C.gold300 : C.warm200}`,
      borderRadius: 14, padding: '16px 18px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.dark900 }}>{item.title}</span>
        {item.differed && (
          <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold700, background: C.gold100, border: `1px solid ${C.gold300}`, borderRadius: 20, padding: '3px 9px', fontFamily: SANS }}>
            Mendime të ndryshme
          </span>
        )}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.warm700, marginTop: 6, fontFamily: SANS }}>{item.body}</div>
      <SourceChip evidence={item.evidence} />
    </div>
  );
}

// ─── PAGE NAV ─────────────────────────────────────────────────────
// Reusable "Në këtë faqe" jump strip for content-heavy pages.
// Items: [{ id, label }] — id must match a SectionHead id (or any element id).
export function PageNav({ items }) {
  const jump = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav aria-label="Në këtë faqe" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,4vw,56px)' }}>
      <style>{`.pgnav-chip:hover { background: ${C.gold100} !important; border-color: ${C.gold400} !important; color: ${C.gold700} !important; }`}</style>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        background: C.surface, border: `1px solid ${C.warm200}`,
        borderRadius: 14, padding: '12px 16px',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold600, fontFamily: SANS }}>Në këtë faqe</span>
        </span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {items.map(it => (
            <button
              key={it.id}
              className="pgnav-chip"
              onClick={() => jump(it.id)}
              style={{
                fontFamily: SANS, fontSize: 12.5, fontWeight: 600,
                color: C.warm700, background: C.gold50,
                border: `1px solid ${C.gold200}`, borderRadius: 999,
                padding: '6px 14px', cursor: 'pointer', transition: 'all 150ms',
              }}
            >{it.label}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────
export default function AbdesPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: SANS, color: C.dark900, paddingBottom: 80 }}>
      <style>{`
        .abd-chip:hover { border-color: ${C.gold500} !important; }
        .abd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
        .abd-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items: start; }
        @media (max-width: 860px) { .abd-grid-2, .abd-grid-3 { grid-template-columns: 1fr; } }
        .abd-hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 44px; align-items: center; }
        @media (max-width: 860px) { .abd-hero-grid { grid-template-columns: 1fr; gap: 28px; } }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,4vw,56px) clamp(24px,3vw,40px)' }}>
        <div className="abd-hero-grid">
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600, marginBottom: 16 }}>Pastërtia · Taharah</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px,4.6vw,54px)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.018em', margin: 0, color: C.dark900 }}>
              Abdesi,<br/>
              <em style={{ fontStyle: 'italic', fontWeight: 500, color: C.gold700 }}>hap pas hapi.</em>
            </h1>
            <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.65, color: C.warm700, marginTop: 20, maxWidth: 520 }}>
              Pastrimi është çelësi i namazit. Çdo rregull në këtë faqe mbështetet
              në dy burime klasike njëherësh — hadithet e <em>Bulugh al-Maram</em> të
              Ibn Haxherit dhe shpjegimet e <em>Fikhut të Sunetit</em> të Sejjid Sabikut.
            </p>
          </div>
          <div style={{
            background: `linear-gradient(150deg, ${C.waterDark} 0%, ${C.water} 100%)`,
            borderRadius: 22, padding: 'clamp(22px,3vw,34px)',
            boxShadow: '0 16px 40px rgba(31,79,107,0.28)',
            color: '#EAF3F8',
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

      {/* ── Jump nav ── */}
      <PageNav items={[
        { id: 'hapat',     label: 'Si merret abdesi' },
        { id: 'meste',     label: 'Mes-hi mbi meste' },
        { id: 'nexhaset',  label: 'Nexhaset' },
        { id: 'istinxha',  label: 'Adabet e nevojës' },
        { id: 'prishesit', label: 'Prishësit' },
        { id: 'gusli',     label: 'Gusli' },
        { id: 'tejemumi',  label: 'Tejemumi' },
      ]} />

      {/* ── Steps ── */}
      <section style={{ maxWidth: 1100, margin: '24px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          id="hapat"
          eyebrow="Njëmbëdhjetë hapa"
          title="Si merret abdesi"
          sub="Katër hapat farz i cakton vetë Kurani; të tjerët janë sunete të vërtetuara nga përshkrimi i abdesit të Pejgamberit ﷺ. Prek burimin nën çdo hap për ta parë hadithin."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {WUDU_STEPS.map(s => (
            <div key={s.n} style={{
              background: C.surface, border: `1px solid ${C.warm200}`, borderRadius: 16,
              padding: 'clamp(16px,2.4vw,22px)',
              display: 'flex', gap: 'clamp(14px,2vw,20px)', alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: s.type === 'farz' ? C.dark900 : C.gold50,
                border: s.type === 'farz' ? 'none' : `1px solid ${C.gold200}`,
                color: s.type === 'farz' ? C.gold300 : C.gold700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: MONO, fontSize: 14, fontWeight: 600,
              }}>{String(s.n).padStart(2, '0')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(17px,2vw,20px)', fontWeight: 600, margin: 0, color: C.dark900 }}>{s.name}</h3>
                  <TypeBadge type={s.type} times={s.times} />
                  <span dir="rtl" style={{ marginLeft: 'auto', fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: 19, color: C.warm400, whiteSpace: 'nowrap' }}>{s.nameAr}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: C.warm700, margin: '8px 0 0' }}>{s.body}</p>
                {s.arabic && (
                  <div style={{ background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 12, padding: '14px 16px', marginTop: 12 }}>
                    <div dir="rtl" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: 20, lineHeight: 1.9, color: C.dark900, textAlign: 'right' }}>{s.arabic}</div>
                    <div style={{ fontSize: 13, fontStyle: 'italic', color: C.gold700, marginTop: 8, lineHeight: 1.6 }}>{s.translit}</div>
                    <div style={{ fontSize: 13, color: C.warm700, marginTop: 6, lineHeight: 1.6 }}>{s.translation}</div>
                  </div>
                )}
                <SourceChip evidence={s.evidence} />
              </div>
            </div>
          ))}
        </div>

        {/* Rules band */}
        <div className="abd-grid-2" style={{ marginTop: 14 }}>
          {WUDU_RULES.map(r => <RulingCard key={r.title} item={r} />)}
        </div>
      </section>

      {/* ── Mes-hi mbi meste ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          id="meste"
          eyebrow="Mes-hi mbi meste · المسح على الخفين"
          title="Fshirja mbi çorape e meste"
          sub="Një lehtësim i njohur: kur i ke veshur mestet me abdes, s'ke nevojë t'i heqësh — mjafton t'i fshish me dorë të lagur. Praktike sidomos në dimër dhe në udhëtim."
        />
        <div className="abd-grid-3">
          {MASH_KHUFF.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Nexhaset ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          id="nexhaset"
          eyebrow="Nexhaset · النجاسة"
          title="Papastërtitë dhe si pastrohen"
          sub="Çfarë e ndot trupin, rrobat a vendin — dhe si largohet. Rregulli bazë: papastërtia largohet me ujë derisa të zhduket gjurma e saj."
        />
        <div className="abd-grid-3">
          {NAJASAH.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Adabet e nevojës ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          id="istinxha"
          eyebrow="Adabet e nevojës · آداب قضاء الحاجة"
          title="Në nevojtore"
          sub="Edhe kryerja e nevojës ka edukatën e vet — nga dua-ja e hyrjes te pastrimi dhe ruajtja nga urina."
        />
        <div className="abd-grid-3">
          {ISTINJA.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Nullifiers ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          id="prishesit"
          eyebrow="Prishësit"
          title="Çfarë e prish abdesin — dhe çfarë jo"
          sub="Rregulli bazë: bindja nuk zhbëhet nga dyshimi. Abdesi mbetet i vlefshëm derisa të jesh i sigurt se e ke prishur."
        />
        <div className="abd-grid-2">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A2020', fontFamily: SANS, marginBottom: 10 }}>E prishin</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {NULLIFIERS_YES.map(item => <RulingCard key={item.title} item={item} />)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2D6A4F', fontFamily: SANS, marginBottom: 10 }}>Nuk e prishin</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {NULLIFIERS_NO.map(item => <RulingCard key={item.title} item={item} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ghusl ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          id="gusli"
          eyebrow="Gusli · الغُسْل"
          title="Larja e plotë"
          sub="Kur abdesi nuk mjafton — pastrimi i gjithë trupit sipas hadithit të Aishes (r.a.)."
        />
        <div className="abd-grid-3">
          {GHUSL_WHEN.map(item => <RulingCard key={item.title} item={item} />)}
        </div>

        <div style={{
          background: C.surface, border: `1px solid ${C.warm200}`, borderRadius: 18,
          padding: 'clamp(20px,3vw,30px)', marginTop: 16,
        }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px,2.2vw,23px)', fontWeight: 600, margin: 0, color: C.dark900 }}>Si kryhet gusli</h3>
          <ol style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {GHUSL_STEPS.map(s => (
              <li key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: C.gold50, border: `1px solid ${C.gold300}`,
                  color: C.gold700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 12, fontWeight: 600,
                }}>{s.n}</span>
                <span style={{ fontSize: 14, lineHeight: 1.65, color: C.dark700, paddingTop: 2 }}>{s.text}</span>
              </li>
            ))}
          </ol>
          <SourceChip evidence={GHUSL_SOURCE.evidence} />
          <div style={{ borderTop: `1px solid ${C.warm200}`, marginTop: 18, paddingTop: 16 }}>
            <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.dark900 }}>{GHUSL_SOURCE.women.title}</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: C.warm700, margin: '6px 0 0' }}>{GHUSL_SOURCE.women.body}</p>
            <SourceChip evidence={GHUSL_SOURCE.women.evidence} />
          </div>
        </div>
      </section>

      {/* ── Tayammum ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          id="tejemumi"
          eyebrow="Tejemumi · التَّيَمُّم"
          title="Pastrimi pa ujë"
          sub="Një lehtësim i dhuruar vetëm këtij umeti: kur uji mungon ose dëmton, dheu i pastër zë vendin e tij."
        />
        <div className="abd-grid-3">
          {TAYAMMUM_WHEN.map(item => <RulingCard key={item.title} item={item} />)}
        </div>

        <div style={{
          background: C.surface, border: `1px solid ${C.warm200}`, borderRadius: 18,
          padding: 'clamp(20px,3vw,30px)', marginTop: 16,
        }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px,2.2vw,23px)', fontWeight: 600, margin: 0, color: C.dark900 }}>Si kryhet tejemumi</h3>
          <ol style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TAYAMMUM_HOW.steps.map(s => (
              <li key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: C.gold50, border: `1px solid ${C.gold300}`,
                  color: C.gold700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 12, fontWeight: 600,
                }}>{s.n}</span>
                <span style={{ fontSize: 14, lineHeight: 1.65, color: C.dark700, paddingTop: 2 }}>{s.text}</span>
              </li>
            ))}
          </ol>
          <SourceChip evidence={TAYAMMUM_HOW.evidence} />
        </div>

        <div className="abd-grid-2" style={{ marginTop: 14 }}>
          {TAYAMMUM_HOW.notes.map(item => <RulingCard key={item.title} item={item} />)}
        </div>
      </section>

      {/* ── Sources footer ── */}
      <section style={{ maxWidth: 1100, margin: '56px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <div style={{
          background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 16,
          padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: C.warm700, fontFamily: SANS }}>
            <strong style={{ color: C.dark900 }}>Burimet.</strong> Çdo rregull në këtë faqe mbështetet njëkohësisht në{' '}
            <em>Bulugh al-Maram min Adil-lat al-Ahkam</em> të Ibn Haxher el-Askalanit (Libri i Pastërtisë, hadithet 1–156)
            dhe në <em>Fikhun e Sunetit</em> të Sejjid Sabikut (kapitujt 1.25–1.68). Aty ku dy burimet shënojnë
            mospajtim mes dijetarëve, rregulla mban shenjën <em>«Mendime të ndryshme»</em>. Për raste të veçanta
            pyet një hoxhë të kualifikuar.
          </div>
        </div>
      </section>
    </div>
  );
}
