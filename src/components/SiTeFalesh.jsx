import { useState, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const C = {
  bg:       '#FAF7EE',
  surface:  '#FFFFFF',
  dark900:  '#1A1915',
  dark700:  '#3A3828',
  warm700:  '#6B6050',
  warm600:  '#8A7E6E',
  warm500:  '#9A8E7A',
  warm400:  '#B5A888',
  warm300:  '#D4C9A8',
  warm200:  '#E0D5C0',
  warm100:  '#EDE8DC',
  gold700:  '#6B5320',
  gold600:  '#8A7235',
  gold500:  '#9A8142',
  gold400:  '#B89D60',
  gold300:  '#D4BA88',
  gold200:  '#E8D9A8',
  gold100:  '#F2EAD0',
  gold50:   '#FAF5E8',
};
const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'Inter', system-ui, sans-serif";
const MONO  = "'Fira Code', 'Courier New', monospace";

// ─── PRAYER DATA ──────────────────────────────────────────────────
const PRAYERS = [
  {
    id: 'sabahu', nameAr: 'الفَجْر', nameAlb: 'Sabahu', nameFull: 'Namazi i Sabahut',
    period: 'Para lindjes së diellit', timeLabel: 'Agim', timeApprox: '05:12',
    window: [4*60+30, 5*60+45], rakatFard: 2, rakatSunnah: 2,
    blurb: 'Lutja e parë e ditës. Falet në heshtjen e agimit, para se dielli të çajë horizontin.',
    ayet: 'إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا',
    ayetAlb: 'Vërtet, leximi i agimit dëshmohet nga engjëjt.',
    ayetRef: 'El-Isra 17:78',
    sky: 'linear-gradient(180deg, #141A38 0%, #2A1F4A 18%, #4A2E58 38%, #8A4E5E 60%, #C87858 78%, #E8AE7A 92%, #F2C898 100%)',
    horizonBand: '#1A1228', sunY: 86, sunColor: '#F8D89A', sunGlow: 'rgba(248,200,140,0.45)',
    stars: [{ x:18,y:12,s:0.9 },{ x:32,y:8,s:0.7 },{ x:64,y:14,s:1 },{ x:78,y:10,s:0.8 },{ x:88,y:22,s:0.6 }],
    accent: '#C87858', accentDark: '#7A3848', onSky: '#F5DCB0',
    tips: [
      { title: 'Mos e ngatërro me imsakun', body: 'Sabahu fillon në agimin e vërtetë dhe koha e tij mbaron kur lind dielli. Nëse e humb pa dashje, fale kaza pasi të kalojë momenti i ndaluar i lindjes së diellit.' },
      { title: 'Lexo me zë (jo me shumë zë)', body: 'Fatihaja dhe sureja e shkurtër lexohen me zë (xhehri) në dy rekatet e Sabahut. Por jo aq lartë sa të shqetësosh të tjerët.' },
      { title: 'Kunuti varet nga medhhebi', body: 'Disa medhhebe, si Shafii, lexojnë Kunut në rekatin e dytë të Sabahut; të tjerat jo rregullisht. Ndiq imamin ose mësimin që ndjek zakonisht.' },
    ],
  },
  {
    id: 'dreka', nameAr: 'الظُّهْر', nameAlb: 'Dreka', nameFull: 'Namazi i Drekës',
    period: 'Pasi dielli ka kaluar zenitin', timeLabel: 'Mesditë', timeApprox: '12:45',
    window: [12*60+15, 15*60+45], rakatFard: 4, rakatSunnah: 6,
    blurb: 'Pauzë në mes të ditës — një kthim drejt Allahut në mes të zhurmës së punës dhe detyrave.',
    ayet: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ',
    ayetAlb: 'Fal namazin pas zenitit të diellit.',
    ayetRef: 'El-Isra 17:78',
    sky: 'linear-gradient(180deg, #4A8AB8 0%, #6FA8CC 25%, #98C0DC 55%, #C8DCE8 85%, #E8EFF2 100%)',
    horizonBand: '#5A92B8', sunY: 22, sunColor: '#FFF8E0', sunGlow: 'rgba(255,248,224,0.55)',
    stars: null,
    accent: '#6F9ECC', accentDark: '#2A5878', onSky: '#FFFFFF',
    tips: [
      { title: 'Prit pak pas mesditës', body: 'Mos e fal Drekën pikërisht kur dielli është në kulm — prit derisa hija të kthehet drejt lindjes.' },
      { title: 'Fatihaja lexohet në heshtje', body: 'Në Dreka, Iqindi dhe rekatet e tretë e të katërt të namazeve të tjera, leximi është i heshtur (sirri).' },
      { title: 'Mos i ngatërro 4 rekatet', body: 'Pas dy rekateve të para ulesh në teshehud, pastaj çohesh për dy rekatet e tjera. Në rekatet e fundit Fatiha lexohet patjetër; ndonjëherë mund të shtohet edhe pak lexim.' },
    ],
  },
  {
    id: 'iqindia', nameAr: 'العَصْر', nameAlb: 'Iqindia', nameFull: 'Namazi i Iqindisë',
    period: 'Pasdite e vonshme', timeLabel: 'Pasdite', timeApprox: '16:30',
    window: [15*60+45, 18*60+30], rakatFard: 4, rakatSunnah: 4,
    blurb: 'Mes drekës dhe perëndimit — namazi i mesëm, ai për të cilin Kurani urdhëron kujdes të veçantë.',
    ayet: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ',
    ayetAlb: 'Ruajini namazet, e veçanërisht atë të mesmin.',
    ayetRef: 'El-Bekare 2:238',
    sky: 'linear-gradient(180deg, #6FA0BC 0%, #98B0B8 25%, #C8A878 55%, #E0B870 80%, #ECC890 100%)',
    horizonBand: '#A0826A', sunY: 48, sunColor: '#F8C870', sunGlow: 'rgba(248,200,112,0.5)',
    stars: null,
    accent: '#C89858', accentDark: '#6A4820', onSky: '#FFFFFF',
    tips: [
      { title: 'Mos e shtyj derisa dielli të zverdhet', body: 'Pejgamberi (a.s.) ka tërhequr vëmendjen për mosvonimin e Iqindisë. Falu sapo të dëgjosh ezanin.' },
      { title: 'Në udhëtim mund të shkurtohet', body: 'Normalisht Iqindia është 4 rekate farz. Në udhëtim të vlefshëm, sipas rregullave të medhhebit tënd, mund të falet kasr: 2 rekate.' },
      { title: 'I njëjti ritëm si Dreka', body: 'Strukturalisht identike me Drekën — i njëjti numër rekatesh, e njëjta heshtje në lexim.' },
    ],
  },
  {
    id: 'akshami', nameAr: 'المَغْرِب', nameAlb: 'Akshami', nameFull: 'Namazi i Akshamit',
    period: 'Menjëherë pas perëndimit të diellit', timeLabel: 'Perëndim', timeApprox: '19:48',
    window: [18*60+30, 20*60+15], rakatFard: 3, rakatSunnah: 2,
    blurb: 'Shkurt pas perëndimit — kur dita mbyllet me një gjest mirënjohjeje, ndërsa qielli ndez ngjyrat.',
    ayet: 'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ',
    ayetAlb: 'Lavdëroni Allahun në mbrëmje dhe në mëngjes.',
    ayetRef: 'Er-Rum 30:17',
    sky: 'linear-gradient(180deg, #2A1F58 0%, #5A2E5A 18%, #9A3A52 38%, #D0583A 58%, #E88838 75%, #F2B068 88%, #F8D098 100%)',
    horizonBand: '#3A1820', sunY: 70, sunColor: '#FFD088', sunGlow: 'rgba(255,200,120,0.55)',
    stars: [{ x:18,y:12,s:1 }],
    accent: '#E08838', accentDark: '#7A2820', onSky: '#FFE8C8',
    tips: [
      { title: 'Mos vono — koha është e shkurtër', body: 'Akshami ka dritaren më të ngushtë kohore: nga perëndimi i diellit deri kur të zhduket e kuqja në horizont (~1h 15min).' },
      { title: '3 rekate, jo 4', body: 'Akshami është i vetmi namaz me numër tek rekatesh. Pas rekatit të dytë je në teshehud; pas të tretit, selam.' },
      { title: 'Dy rekate sunet pas farzit', body: 'Menjëherë pas farzit fal 2 rekate sunet — të shkurtra, në shtëpi është më mirë.' },
    ],
  },
  {
    id: 'jacia', nameAr: 'العِشَاء', nameAlb: 'Jacia', nameFull: 'Namazi i Jacisë',
    period: 'Pas errësimit të plotë të qiellit', timeLabel: 'Natë', timeApprox: '21:20',
    window: [20*60+15, (24+4)*60+30], rakatFard: 4, rakatSunnah: 4,
    blurb: 'Mbyllja e ditës. Falet në qetësinë e natës, kur dita ka rënë dhe yjet kanë zënë qiellin.',
    ayet: 'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ',
    ayetAlb: 'Edhe nga nata zgjohu për lutje, si dhuratë e shtuar për ty.',
    ayetRef: 'El-Isra 17:79',
    sky: 'linear-gradient(180deg, #050828 0%, #0F1438 25%, #1A2050 50%, #1F2858 75%, #28305A 100%)',
    horizonBand: '#080A20', sunY: -10, sunColor: '#E8E0F0', sunGlow: 'rgba(232,224,240,0.35)',
    stars: [{ x:12,y:14,s:1 },{ x:22,y:28,s:1.5 },{ x:35,y:12,s:0.8 },{ x:48,y:22,s:1.2 },{ x:62,y:18,s:1 },{ x:78,y:30,s:1.3 },{ x:88,y:14,s:0.9 },{ x:18,y:38,s:0.7 },{ x:70,y:8,s:1 }],
    isNight: true,
    accent: '#7A88B8', accentDark: '#2A305A', onSky: '#E8E0F0',
    tips: [
      { title: 'Koha ka dallime mendimesh', body: 'Më e sigurta për fillestarët është ta falësh Jacinë para mesnatës islame. Disa dijetarë e zgjasin kohën deri në Sabah; mos e vono pa arsye.' },
      { title: 'Mos harro Vitrin', body: 'Pas Jacisë falet Vitri. Shumë muslimanë e falin 3 rekate, sidomos në medhhebin Hanefi, ndërsa ka edhe forma të tjera të njohura në medhhebe.' },
      { title: 'Lexim me zë në 2 rekatet e para', body: 'Si te Sabahu dhe Akshami: dy rekatet e para lexohen me zë, ndërsa rekatet 3 dhe 4 në heshtje. Në rekatet e fundit Fatiha lexohet patjetër.' },
    ],
  },
];

// ─── STEPS DATA ───────────────────────────────────────────────────
const STEPS = [
  {
    n: 1, posture: 'qiyam', name: 'Nijeti', nameAr: 'النِّيَّة', postureAlb: 'Në këmbë, qetë',
    instruction: 'Bëj nijetin në zemër — qëllimin se cilin namaz po fal për Allahun. Nuk ka tekst të veçantë për t’u thënë me zë para tekbirit.',
    arabic: null, translit: null, translation: null,
  },
  {
    n: 2, posture: 'takbir', name: 'Tekbiri fillestar', nameAr: 'تَكْبِيرَة الإِحْرَام', postureAlb: 'Duart te supet ose veshët',
    instruction: 'Ngri duart deri në nivelin e supeve ose të veshëve, me gishtërinj të lirë, dhe shqipto qetë:',
    arabic: 'اللَّهُ أَكْبَر', translit: 'Allahu Ekber', translation: 'Allahu është më i Madhi.',
  },
  {
    n: 3, posture: 'qiyam-folded', name: 'Subhaneke', nameAr: 'الثَّنَاء', postureAlb: 'Duart në kraharor',
    instruction: 'Vendos duart në kraharor — e djathta mbi të majtën — dhe lexo lutjen hapëse:',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ',
    translit: "Subhaneke Allahumme ve bi hamdike, ve tebarekesmuke, ve te'ala xhedduke, ve la ilahe gajruke.",
    translation: "I madhëruar je Ti, o Allah, dhe Ty të lavdëroj. I bekuar është Emri Yt, e madhështore është madhëria Jote, dhe s'ka të adhuruar tjetër veç Teje.",
  },
  {
    n: 4, posture: 'qiyam-folded', name: 'Sureja Fatiha', nameAr: 'الفَاتِحَة', postureAlb: 'Duart ende në kraharor',
    instruction: 'Lexo suren hyrëse të Kuranit — shtatë ajetet që përsëriten në çdo rekat të çdo namazi. Në fund thuaj: Amin.',
    arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
    translit: "Bismil-lahir-rahmanir-rahim. Elhamdu lil-lahi rabbil-alemin. Er-rahmanir-rahim. Maliki jevmid-din. Ijjake na'budu ve ijjake nesta'in. Ihdinas-siratal-mustekim. Siratal-ledhine en'amte alejhim, gajril-magdubi alejhim ve led-dal-lin.",
    translation: 'Në emër të Allahut, Mëshiruesit, Mëshirëbërësit. Lavdërimi i takon Allahut, Zotit të botëve, Mëshiruesit, Mëshirëbërësit, Sunduesit të Ditës së Gjykimit. Vetëm Ty të adhurojmë dhe vetëm prej Teje ndihmë kërkojmë. Udhëzona në rrugën e drejtë — rrugën e atyre që i ke begatuar, jo të atyre që zemërimi është mbi ta, e as të të humburve.',
  },
  {
    n: 5, posture: 'qiyam-folded', name: 'Sure e shkurtër', nameAr: 'سُورَة قَصِيرَة', postureAlb: 'Në këmbë',
    instruction: 'Pas Fatihasë, lexo një sure të shkurtër. Për fillestarët, sureja El-Ihlas është më e thjeshta për të mësuar:',
    arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
    translit: 'Kul huvel-lahu ehad. Allahus-samed. Lem jelid ve lem juled. Ve lem jekul-lehu kufuven ehad.',
    translation: 'Thuaj: Ai, Allahu është Një. Allahu është Streha e gjithçkaje. Nuk lindi e as nuk është i lindur. Dhe askush nuk i është i barabartë Atij.',
  },
  {
    n: 6, posture: 'ruku', name: 'Rukuja', nameAr: 'الرُّكُوع', postureAlb: 'Përkulje, duart mbi gjunjë',
    instruction: 'Thuaj "Allahu Ekber" dhe përkulu — shpina e drejtë, duart mbi gjunjë, sytë drejt vendit ku do biesh në sexhde. Përsërit tri herë:',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', translit: 'Subhane Rabbijel-Adhim', translation: 'I lavdëruar është Zoti im, i Madhërishmi.',
  },
  {
    n: 7, posture: 'itidal', name: 'Itidali', nameAr: 'الِاعْتِدَال', postureAlb: 'Drejt në këmbë',
    instruction: 'Ngrihu nga rukuja, duke thënë:',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
    translit: "Semi'Allahu limen hamideh. Rabbena ve lekel-hamd.",
    translation: 'Allahu e dëgjon atë që e falënderon Atë. Zoti ynë, Ty të takon çdo lavdërim.',
  },
  {
    n: 8, posture: 'sujud', name: 'Sexhdja', nameAr: 'السُّجُود', postureAlb: 'Shtatë gjymtyrët në tokë',
    instruction: 'Thuaj "Allahu Ekber" dhe bjer në sexhde. Shtatë gjymtyrët duhet të prekin tokën: balli me hundë, dy pëllëmbët, dy gjunjët, dhe gishtërinjtë e dy këmbëve. Përsërit tri herë:',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', translit: "Subhane Rabbijel-A'la", translation: 'I lavdëruar është Zoti im, më i Larti.',
  },
  {
    n: 9, posture: 'jalsa', name: 'Xhelseja', nameAr: 'الجَلْسَة', postureAlb: 'Ulur mes dy sexhdeve',
    instruction: 'Ngrihu nga sexhdja dhe ulu shkurtimisht në këmbën e majtë, duke thënë:',
    arabic: 'رَبِّ اغْفِرْ لِي', translit: 'Rabbigh-fir li', translation: 'O Zot, më fal mua.',
  },
  {
    n: 10, posture: 'sujud', name: 'Sexhdja e dytë', nameAr: 'السُّجُود الثَّانِي', postureAlb: 'Përsëri në sexhde',
    instruction: 'Bjer përsëri në sexhde dhe përsërit tri herë:',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', translit: "Subhane Rabbijel-A'la", translation: 'I lavdëruar është Zoti im, më i Larti.',
  },
  {
    n: 11, posture: 'qiyam', name: 'Rekatet e ardhshme', nameAr: 'الرَّكَعَات التَّالِيَة', postureAlb: 'Ngrihu në këmbë',
    instruction: 'Ngrihu në këmbë dhe fillo rekatin e ri — Fatiha, sure e shkurtër, ruku, itidal, dy sexhde. Numri total: Sabahu 2 · Dreka 4 · Iqindia 4 · Akshami 3 · Jacia 4.',
    arabic: null, translit: null, translation: null, isNote: true, repeatFrom: 4, repeatTo: 10,
  },
  {
    n: 12, posture: 'tashahhud', name: 'Teshehudi', nameAr: 'التَّشَهُّد', postureAlb: 'Ulur, gishtin tregues e ngre',
    instruction: 'Pas sexhdes së dytë të rekatit të dytë, ulu dhe lexo Teshehudin (Et-Tehijjat). Nëse namazi ka 3 ose 4 rekate, ky është teshehudi i parë dhe pastaj ngrihesh; në uljen e fundit vazhdo edhe me salavatet:',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translit: 'Et-tehijjatu lil-lahi ves-salavatu vet-tajjibat. Es-selamu alejke ejjuhen-nebijju ve rahmetullahi ve berekatuhu. Es-selamu alejna ve ala ibadil-lahis-salihin. Esh-hedu en la ilahe il-lAllah, ve esh-hedu enne Muhammeden abduhu ve resuluhu.',
    translation: "Përshëndetjet, lutjet dhe veprat e mira i takojnë Allahut. Paqja, mëshira dhe begatitë e Allahut qofshin mbi ty, o Pejgamber. Paqja qoftë mbi ne dhe mbi robërit e mirë të Allahut. Dëshmoj se s'ka të adhuruar tjetër veç Allahut, dhe dëshmoj se Muhamedi është rob dhe i Dërguar i Tij.",
  },
  {
    n: 13, posture: 'tashahhud', name: 'Salavati', nameAr: 'الصَّلَاةُ عَلَى النَّبِيِّ', postureAlb: 'Ulur në teshehudin e fundit',
    instruction: 'Në teshehudin e fundit, pas Et-Tehijjatit, dërgo salavate mbi Pejgamberin ﷺ:',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translit: 'Allahumme sal-li ala Muhammedin ve ala aali Muhammed, kema sal-lejte ala Ibrahime ve ala aali Ibrahim, inneke Hamidun Mexhid. Allahumme barik ala Muhammedin ve ala aali Muhammed, kema barekte ala Ibrahime ve ala aali Ibrahim, inneke Hamidun Mexhid.',
    translation: 'O Allah, dërgo lavdërime mbi Muhamedin dhe familjen e Muhamedit, siç dërgove lavdërime mbi Ibrahimin dhe familjen e Ibrahimit. Me të vërtetë, Ti je i Lavdëruari, i Madhërishmi. O Allah, bekoje Muhamedin dhe familjen e Muhamedit, siç bekove Ibrahimin dhe familjen e Ibrahimit. Me të vërtetë, Ti je i Lavdëruari, i Madhërishmi.',
  },
  {
    n: 14, posture: 'tashahhud', name: 'Dua para selamit', nameAr: 'الدُّعَاءُ قَبْلَ السَّلَام', postureAlb: 'Ulur para përfundimit',
    instruction: 'Para selamit, kërko mbrojtje tek Allahu. Kjo dua është nga lutjet e njohura para përfundimit të namazit:',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    translit: "Allahumme inni e'udhu bike min adhabi xhehennem, ve min adhabil-kabr, ve min fitnetil-mahja vel-memat, ve min sherri fitnetil-mesihid-dexhxhal.",
    translation: 'O Allah, kërkoj mbrojtje tek Ti nga dënimi i Xhehenemit, nga dënimi i varrit, nga sprova e jetës dhe vdekjes, dhe nga e keqja e sprovës së Mesihut Dexhall.',
  },
  {
    n: 15, posture: 'salam', name: 'Selami', nameAr: 'السَّلَام', postureAlb: 'Kthim koke djathtas, pastaj majtas',
    instruction: 'Përfundo namazin duke kthyer kokën në të djathtë e pastaj në të majtë, duke thënë çdo herë:',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', translit: 'Es-selamu alejkum ve rahmetullah', translation: 'Paqja dhe mëshira e Allahut qofshin mbi ju.',
  },
];

// ─── FULL PRAYER STEP BUILDER ────────────────────────────────────
// Expands STEPS template into a complete step-by-step sequence
// for the specific prayer's rakat count.

const RISE_TPL = {
  posture: 'qiyam', postureAlb: 'Ngrihu në këmbë',
  instruction: "Thuaj 'Allahu Ekber' dhe ngrihu ngadalë në këmbë.",
  arabic: 'اللَّهُ أَكْبَر', translit: 'Allahu Ekber', translation: 'Allahu është më i Madhi.',
};

function buildPrayerSteps(prayer) {
  const total = prayer.rakatFard;
  const out = [];
  let n = 1;
  const add = (base, extra = {}) => { out.push({ ...base, n: n++, ...extra }); };

  // ── Opening (once) ──────────────────────────────────────────
  add(STEPS[0]);  // Nijeti
  add(STEPS[1]);  // Tekbiri fillestar
  add(STEPS[2]);  // Subhaneke

  for (let r = 1; r <= total; r++) {
    const rl = `Rekati ${r}`;

    add(STEPS[3], { rakatLabel: rl });                         // Fatiha (every rakat)
    if (r <= 2) add(STEPS[4], { rakatLabel: rl });             // Sure (rakats 1-2 only)
    add(STEPS[5], { rakatLabel: rl });                         // Rukuja
    add(STEPS[6], { rakatLabel: rl });                         // Itidali
    add(STEPS[7], { rakatLabel: rl });                         // Sexhdja
    add(STEPS[8], { rakatLabel: rl });                         // Xhelseja
    add(STEPS[9], { rakatLabel: rl });                         // Sexhdja e dytë

    if (r < total) {
      // Middle teshehud after rakat 2 in 3+ rakat prayers
      if (r === 2 && total > 2) {
        add(STEPS[11], {
          name: 'Teshehudi i mesëm',
          instruction: 'Ulu dhe lexo Teshehudin. Nuk lexohet salavati këtu — pastaj ngrihu për rekatin e ardhshëm.',
          rakatLabel: null,
        });
      }
      // Transition: rise for next rakat
      add({ ...RISE_TPL, name: `Rekati ${r + 1} fillon`, nameAr: '' }, { rakatLabel: `Rekati ${r + 1}`, isRise: true });
    }
  }

  // ── Closing (once) ──────────────────────────────────────────
  add(STEPS[11]);  // Teshehudi final
  add(STEPS[12]);  // Salavati
  add(STEPS[13]);  // Dua para selamit
  add(STEPS[14]);  // Selami

  return out;
}

// ─── HELPERS ──────────────────────────────────────────────────────
const ALB_DAYS   = ['E diel','E hënë','E martë','E mërkurë','E enjte','E premte','E shtunë'];
const ALB_MONTHS = ['janar','shkurt','mars','prill','maj','qershor','korrik','gusht','shtator','tetor','nëntor','dhjetor'];

function formatDate(d) {
  return `${ALB_DAYS[d.getDay()]}, ${d.getDate()} ${ALB_MONTHS[d.getMonth()]}`;
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

// ─── POSTURE ICONS — minimal SVG silhouettes ───────────────────────
const POSTURE_ORDER = ['qiyam','takbir','qiyam-folded','ruku','itidal','sujud','jalsa','tashahhud','salam'];

const POSTURE_SVG = {
  qiyam: (
    <svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="20" r="10" strokeWidth="3"/>
      <line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/>
      <line x1="40" y1="55" x2="20" y2="80" strokeWidth="3"/>
      <line x1="40" y1="55" x2="60" y2="80" strokeWidth="3"/>
      <line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/>
      <line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/>
    </svg>
  ),
  takbir: (
    <svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="20" r="10" strokeWidth="3"/>
      <line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/>
      <line x1="40" y1="50" x2="10" y2="50" strokeWidth="3"/>
      <line x1="40" y1="50" x2="70" y2="50" strokeWidth="3"/>
      <line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/>
      <line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/>
    </svg>
  ),
  'qiyam-folded': (
    <svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="20" r="10" strokeWidth="3"/>
      <line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/>
      <path d="M 20 65 Q 40 55 60 65" strokeWidth="3" fill="none"/>
      <line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/>
      <line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/>
    </svg>
  ),
  ruku: (
    <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="70" cy="20" r="10" strokeWidth="3"/>
      <line x1="70" y1="30" x2="20" y2="60" strokeWidth="3"/>
      <line x1="20" y1="60" x2="70" y2="60" strokeWidth="3"/>
      <line x1="20" y1="60" x2="10" y2="100" strokeWidth="3"/>
      <line x1="70" y1="60" x2="60" y2="100" strokeWidth="3"/>
      <line x1="10" y1="100" x2="10" y2="115" strokeWidth="3"/>
      <line x1="60" y1="100" x2="60" y2="115" strokeWidth="3"/>
    </svg>
  ),
  itidal: (
    <svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="20" r="10" strokeWidth="3"/>
      <line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/>
      <line x1="40" y1="55" x2="18" y2="75" strokeWidth="3"/>
      <line x1="40" y1="55" x2="62" y2="75" strokeWidth="3"/>
      <line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/>
      <line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/>
    </svg>
  ),
  sujud: (
    <svg viewBox="0 0 130 80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="110" cy="15" r="10" strokeWidth="3"/>
      <path d="M 110 25 L 80 40 L 40 40" strokeWidth="3"/>
      <line x1="80" y1="40" x2="80" y2="70" strokeWidth="3"/>
      <line x1="60" y1="40" x2="60" y2="70" strokeWidth="3"/>
      <line x1="110" y1="25" x2="20" y2="25" strokeWidth="3"/>
    </svg>
  ),
  jalsa: (
    <svg viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="20" r="10" strokeWidth="3"/>
      <path d="M 50 30 L 50 75" strokeWidth="3"/>
      <line x1="50" y1="55" x2="25" y2="75" strokeWidth="3"/>
      <line x1="50" y1="55" x2="75" y2="75" strokeWidth="3"/>
      <path d="M 50 75 Q 30 90 10 95" strokeWidth="3" fill="none"/>
      <path d="M 50 75 Q 65 100 70 130" strokeWidth="3" fill="none"/>
    </svg>
  ),
  tashahhud: (
    <svg viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="20" r="10" strokeWidth="3"/>
      <path d="M 50 30 L 50 75" strokeWidth="3"/>
      <line x1="50" y1="50" x2="25" y2="65" strokeWidth="3"/>
      <line x1="50" y1="50" x2="72" y2="40" strokeWidth="3"/>
      <path d="M 50 75 Q 30 90 10 95" strokeWidth="3" fill="none"/>
      <path d="M 50 75 Q 65 100 70 130" strokeWidth="3" fill="none"/>
    </svg>
  ),
  salam: (
    <svg viewBox="0 0 80 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="40" cy="20" r="10" strokeWidth="3"/>
      <path d="M 50 28 Q 60 20 58 15" strokeWidth="2.5" fill="none"/>
      <line x1="40" y1="30" x2="40" y2="100" strokeWidth="3"/>
      <line x1="40" y1="55" x2="20" y2="75" strokeWidth="3"/>
      <line x1="40" y1="55" x2="60" y2="75" strokeWidth="3"/>
      <line x1="40" y1="100" x2="25" y2="145" strokeWidth="3"/>
      <line x1="40" y1="100" x2="55" y2="145" strokeWidth="3"/>
    </svg>
  ),
  note: (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeLinecap="round">
      <circle cx="40" cy="40" r="30" strokeWidth="2.5" strokeDasharray="6 4"/>
      <polyline points="30,40 40,50 50,30" strokeWidth="3"/>
    </svg>
  ),
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
  return (
    <div className="posture-figure" style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative', overflow: 'hidden',
      color,
    }}>
      {photo ? (
        <img
          src={photo}
          alt={posture}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
      ) : (
        <div style={{ width: size * 0.65, height: size * 0.65 }}>{svg}</div>
      )}
      {idx >= 0 && (
        <div style={{
          position: 'absolute', bottom: 4, right: 6,
          fontFamily: MONO, fontSize: size * 0.1, fontWeight: 600,
          color: '#fff', opacity: 0.75,
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}>{String(idx + 1).padStart(2, '0')}</div>
      )}
    </div>
  );
}

// ─── SKY SCENE ────────────────────────────────────────────────────
function SkyScene({ prayer: p, height = 200, intensity = 1 }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height,
      background: p.sky, overflow: 'hidden', flexShrink: 0,
    }}>
      {p.stars && p.stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: 2 * s.s, height: 2 * s.s, borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 0 4px rgba(255,255,255,0.7)',
        }} />
      ))}
      {p.sunY > -20 && p.sunY < 110 && (
        <>
          <div style={{
            position: 'absolute', left: '50%', top: `${p.sunY}%`,
            width: 240 * intensity, height: 240 * intensity,
            marginLeft: -120 * intensity, marginTop: -120 * intensity,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${p.sunGlow} 0%, transparent 60%)`,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', left: '50%', top: `${p.sunY}%`,
            width: 64 * intensity, height: 64 * intensity,
            marginLeft: -32 * intensity, marginTop: -32 * intensity,
            borderRadius: '50%', background: p.sunColor,
            boxShadow: `0 0 32px ${p.sunGlow}`,
          }} />
        </>
      )}
      {p.isNight && (
        <div style={{
          position: 'absolute', right: '14%', top: '18%',
          width: 38 * intensity, height: 38 * intensity, borderRadius: '50%',
          background: '#E8E0F0',
          boxShadow: 'inset -10px 4px 0 0 rgba(20,24,60,0.95), 0 0 18px rgba(232,224,240,0.35)',
        }} />
      )}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '14%',
        background: `linear-gradient(180deg, transparent 0%, ${p.horizonBand} 70%)`,
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 2,
        background: p.horizonBand, opacity: 0.7,
      }} />
      <div style={{
        position: 'absolute', top: 14, left: 16,
        fontFamily: SANS, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: p.onSky, opacity: 0.82,
      }}>{p.timeLabel}</div>
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
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: v.bg, color: v.fg, border: v.border,
        borderRadius: 999, padding: '10px 20px',
        fontFamily: SANS, fontSize: 13, fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        opacity: disabled ? 0.45 : 1,
        transition: 'transform 180ms, box-shadow 180ms',
        transform: hov && !disabled ? 'translateY(-1px)' : 'none',
        boxShadow: hov && !disabled && variant === 'dark' ? '0 6px 20px rgba(26,25,21,0.25)' : 'none',
        ...sx,
      }}
    >{children}</button>
  );
}

// ─── RECITATION CARD ──────────────────────────────────────────────
function RecitationCard({ step: s, accent, accentDark, showTranslit }) {
  const [open, setOpen] = useState(false);
  if (!s.arabic) return null;
  return (
    <div style={{
      marginTop: 14, padding: '16px 18px 14px', borderRadius: 12,
      background: C.surface, border: `1px solid ${C.warm200}`,
      boxShadow: '0 4px 18px rgba(26,25,21,0.05)',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: accentDark, marginBottom: 8,
      }}>Ç'thuhet</div>

      {/* Transliteration */}
      {showTranslit && s.translit && (
        <div style={{
          fontFamily: SANS, fontSize: 16, fontWeight: 700,
          color: '#111111', lineHeight: 1.55, letterSpacing: '0.025em',
          marginBottom: 10, textTransform: 'uppercase',
          overflowWrap: 'break-word',
        }}>{s.translit}</div>
      )}

      {/* Translation — reveal on tap */}
      <div style={{ paddingTop: 10, borderTop: `1px solid ${C.gold200}` }}>
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', justifyContent: 'center',
              padding: '6px 10px', background: 'transparent', border: 'none',
              fontFamily: SANS, fontSize: 12.5, fontWeight: 600,
              color: accent, cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Prek për kuptimin në shqip
          </button>
        ) : (
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: accent, marginBottom: 6,
            }}>Kuptimi në shqip</div>
            <div style={{
              fontFamily: SANS, fontSize: 15, fontWeight: 650,
              lineHeight: 1.6, color: '#111111', textTransform: 'uppercase',
            }}>{s.translation}</div>
            <button onClick={() => setOpen(false)} style={{
              marginTop: 8, padding: 0, background: 'transparent', border: 'none',
              fontSize: 11, color: C.warm600, cursor: 'pointer', fontWeight: 500,
            }}>Mbylle</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────
function PrayerCard({ prayer: p, isCurrent, onOpen }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface, borderRadius: 18,
        boxShadow: isCurrent
          ? `0 18px 44px rgba(26,25,21,0.18), 0 0 0 2px ${p.accent}`
          : hov
            ? '0 12px 36px rgba(26,25,21,0.14), 0 0 0 1px rgba(26,25,21,0.05)'
            : '0 2px 14px rgba(26,25,21,0.07), 0 0 0 1px rgba(26,25,21,0.04)',
        overflow: 'hidden', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', textAlign: 'left',
        border: 'none', padding: 0,
        transition: 'box-shadow 250ms, transform 250ms',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative', font: 'inherit', color: 'inherit',
      }}
    >
      <SkyScene prayer={p} height={160} />
      {isCurrent && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: C.dark900, color: '#fff',
          padding: '5px 10px 5px 9px', borderRadius: 999,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'namaz-pulse 2s infinite' }} />
          Tani
        </div>
      )}
      <div style={{ padding: '16px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: C.dark900, margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>{p.nameAlb}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: C.dark900 }}>{p.rakatFard}</span>
            <span style={{ fontSize: 10, letterSpacing: '0.12em', color: C.warm600, fontWeight: 600, textTransform: 'uppercase' }}>Farz</span>
          </div>
          <div style={{ width: 1, height: 14, background: C.warm200 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: C.warm600 }}>{p.rakatSunnah}</span>
            <span style={{ fontSize: 10, letterSpacing: '0.12em', color: C.warm600, fontWeight: 600, textTransform: 'uppercase' }}>Sunet</span>
          </div>
        </div>
        <div style={{
          marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.warm100}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: hov ? C.dark900 : C.warm700,
          fontSize: 12, fontWeight: 600, transition: 'color 200ms',
        }}>
          <span>Mëso si të falesh</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
    </button>
  );
}

function SiTeFaleshHome({ onOpenPrayer }) {
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
      {/* Hero */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(20px,4vw,56px) clamp(20px,3vw,36px)', paddingLeft: window.innerWidth < 640 ? 60 : undefined, maxWidth: 1280, margin: '0 auto' }}>
        <div className="stf-hero-grid">
          {/* Left — headline */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: C.gold600, marginBottom: 16,
            }}>Si të falesh</div>
            <h1 style={{
              fontFamily: SERIF, fontSize: 'clamp(36px,5vw,60px)',
              fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.018em',
              margin: 0, color: C.dark900,
            }}>
              Pesë namazet e ditës,<br/>
              <em style={{ fontStyle: 'italic', fontWeight: 500, color: C.gold700 }}>hap pas hapi.</em>
            </h1>
            <p style={{
              fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.6,
              color: C.warm700, marginTop: 20, maxWidth: 540,
            }}>
              Lutjet, pozicionet dhe shqiptimi — gjithçka që të duhet për të filluar.
              Zgjedh kohën e namazit më poshtë.
            </p>
          </div>

          {/* Right — current prayer card */}
          <div style={{
            background: current ? current.sky : '#1A2050',
            borderRadius: 22, padding: '24px 26px',
            color: current ? current.onSky : '#fff',
            position: 'relative', overflow: 'hidden', minHeight: 200,
            boxShadow: '0 16px 40px rgba(26,25,21,0.18), 0 0 0 1px rgba(26,25,21,0.04)',
          }}>
            {current && current.sunY > -20 && current.sunY < 110 && (
              <>
                <div style={{
                  position: 'absolute', right: -60, top: -60,
                  width: 220, height: 220, borderRadius: '50%',
                  background: `radial-gradient(circle, ${current.sunGlow} 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', right: 28, top: 28,
                  width: 48, height: 48, borderRadius: '50%',
                  background: current.sunColor, boxShadow: `0 0 30px ${current.sunGlow}`,
                }} />
              </>
            )}
            {current && current.isNight && (
              <div style={{
                position: 'absolute', right: 28, top: 28, width: 38, height: 38, borderRadius: '50%',
                background: '#E8E0F0', boxShadow: 'inset -10px 4px 0 0 rgba(20,24,60,0.95)',
              }} />
            )}
            {current && current.stars && current.stars.slice(0, 5).map((s, i) => (
              <div key={i} style={{
                position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
                width: 2 * s.s, height: 2 * s.s, borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)', boxShadow: '0 0 4px rgba(255,255,255,0.7)',
              }} />
            ))}

            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              opacity: 0.78, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'namaz-pulse 2s infinite' }} />
              Tani · {formatDate(now)}
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 'clamp(28px,3.5vw,42px)',
              fontWeight: 600, marginTop: 10, lineHeight: 1,
              position: 'relative', zIndex: 1, textShadow: '0 2px 18px rgba(0,0,0,0.18)',
            }}>
              {current ? current.nameAlb : 'Pa namaz aktiv'}
            </div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 'auto',
              paddingTop: 28, position: 'relative', zIndex: 1,
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>
                  {current ? 'Mbaron pas' : 'Tjetri'}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 500, marginTop: 2, letterSpacing: '0.02em' }}>
                  {nextPrayer ? nextPrayer.prayer.timeApprox : '--:--'}
                </div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'currentColor', opacity: 0.18 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>Tjetri</div>
                <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, marginTop: 4, fontStyle: 'italic' }}>
                  {nextPrayer ? nextPrayer.prayer.nameAlb : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer grid */}
      <section style={{ padding: '0 clamp(20px,4vw,56px) clamp(40px,6vw,80px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600 }}>Pesë namazet</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,2.4vw,30px)', fontWeight: 600, marginTop: 4, color: C.dark900, letterSpacing: '-0.01em' }}>
              Zgjedh kohën për të mësuar
            </h2>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.warm500, letterSpacing: '0.05em' }}>05 / 05</div>
        </div>

        <div className="stf-prayer-grid">
          {PRAYERS.map((p, i) => (
            <PrayerCard key={p.id} prayer={p} isCurrent={current?.id === p.id} onOpen={() => onOpenPrayer(p.id)} />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes namaz-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
        .stf-hero-grid { display:grid; grid-template-columns:1.35fr 1fr; gap:48px; align-items:end; }
        .stf-prayer-grid { display:grid; gap:18px; grid-template-columns:repeat(5,1fr); }
        @media(max-width:1180px){ .stf-prayer-grid{grid-template-columns:repeat(3,1fr);} }
        @media(max-width:880px){ .stf-hero-grid{grid-template-columns:1fr!important;gap:28px!important;} }
        @media(max-width:760px){ .stf-prayer-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:520px){ .stf-prayer-grid{grid-template-columns:1fr;} }
      `}</style>
    </div>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────
function SummaryStrip({ prayer: p }) {
  return (
    <div className="stf-summary-strip" style={{ margin: '-44px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px)', position: 'relative', zIndex: 5 }}>
      <div className="stf-summary-grid" style={{
        background: C.surface, borderRadius: 18,
        boxShadow: '0 6px 28px rgba(26,25,21,0.10), 0 0 0 1px rgba(26,25,21,0.04)',
        padding: '18px 24px',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16,
      }}>
        {[
          { label: 'Farz',        value: p.rakatFard,   unit: 'rekate',   color: C.dark900 },
          { label: 'Sunet',       value: p.rakatSunnah, unit: 'rekate',   color: C.warm600 },
          { label: 'Hapa',        value: STEPS.length,  unit: 'pozicione', color: C.gold600 },
          { label: 'Kohëzgjatja', value: '~4',          unit: 'minuta',   color: C.dark900 },
        ].map(({ label, value, unit, color }) => (
          <div className="stf-summary-item" key={label}>
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
        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: C.dark900, lineHeight: 1.5 }}>"{p.ayetAlb}"</div>
        <div style={{ fontSize: 11, color: p.accentDark, marginTop: 8, fontFamily: MONO, fontWeight: 500, letterSpacing: '0.04em' }}>{p.ayetRef}</div>
      </div>
    </div>
  );
}

function TipsBlock({ prayer: p }) {
  return (
    <section style={{ margin: '48px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600 }}>
          Gabime të zakonshme
        </div>
        <div style={{ flex: 1, height: 1, background: C.warm200 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        {p.tips.map((tip, i) => (
          <div key={i} style={{
            background: C.gold50, border: `1px solid ${C.gold200}`,
            borderRadius: 14, padding: '16px 18px',
          }}>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: p.accentDark, letterSpacing: '0.05em' }}>0{i + 1}</div>
            <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.dark900, marginTop: 4, lineHeight: 1.25 }}>{tip.title}</div>
            <div style={{ fontSize: 13, color: C.warm700, marginTop: 6, lineHeight: 1.55 }}>{tip.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomCTA({ prayer: p }) {
  return (
    <section style={{ margin: '64px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px) 80px' }}>
      <div style={{
        background: C.dark900, color: '#fff', borderRadius: 22,
        padding: 'clamp(28px,4vw,44px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 28, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -80, top: -80, width: 240, height: 240, borderRadius: '50%',
          background: `radial-gradient(circle, ${p.sunGlow} 0%, transparent 65%)`, pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 540 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold300 }}>Mbarove?</div>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.01em' }}>
            Provoje vetë — me kohë, do bëhet natyrshëm.
          </h3>
          <p style={{ fontSize: 14, color: C.warm300, marginTop: 10, lineHeight: 1.6 }}>Mësimi i namazit është një rrugë, jo një cak. Përsëritja sjell qetësi.</p>
        </div>
        <PillBtn variant="gold">
          E mësova këtë namaz
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </PillBtn>
      </div>
    </section>
  );
}

// ── Scroll layout (default) ────────────────────────────────────────
function ScrollLayout({ prayer: p, showTranslit }) {
  const stepsWithText = STEPS.filter(s => s.arabic).map(s => s.n);
  const [revealed, setRevealed] = useState(() => new Set());
  const allRevealed = stepsWithText.length > 0 && stepsWithText.every(n => revealed.has(n));
  const toggleAll = () => setRevealed(allRevealed ? new Set() : new Set(stepsWithText));
  const toggleOne = n => setRevealed(prev => { const nx = new Set(prev); nx.has(n) ? nx.delete(n) : nx.add(n); return nx; });

  return (
    <>
      <SummaryStrip prayer={p} />
      <AyetBlock prayer={p} />

      <section style={{ margin: '48px auto 0', maxWidth: 1100, padding: '0 clamp(20px,4vw,56px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600 }}>
            Hapat e namazit · {STEPS.length} pozicione
          </div>
          <div style={{ flex: 1, height: 1, background: C.warm200, minWidth: 20 }} />
          <button
            onClick={toggleAll}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 999,
              background: allRevealed ? p.accentDark : C.surface,
              color: allRevealed ? '#fff' : C.dark900,
              border: `1px solid ${allRevealed ? p.accentDark : C.warm200}`,
              fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'all 200ms',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {allRevealed ? (
                <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
              ) : (
                <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
              )}
            </svg>
            {allRevealed ? 'Mbylli përkthimet' : 'Hap të gjitha përkthimet'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} className="stf-scroll-row" style={{ display: 'grid', gridTemplateColumns: 'auto 140px 1fr', gap: 20, alignItems: 'start' }}>
              {/* Number + timeline */}
              <div className="stf-num-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: s.isNote ? C.gold50 : C.dark900,
                  color: s.isNote ? C.gold600 : '#fff',
                  border: s.isNote ? `1.5px dashed ${C.gold400}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 13, fontWeight: 600,
                }}>{s.n}</div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 60, background: `linear-gradient(180deg,${C.warm200},transparent)`, marginTop: 6 }} />
                )}
              </div>

              {/* Silhouette */}
              <div className="stf-scroll-figure">
                <PostureFigure posture={s.posture} size={130} color={s.isNote ? p.accent : C.dark900} bg={s.isNote ? 'transparent' : C.gold50} />
              </div>

              {/* Content */}
              <div className="stf-step-card" style={{
                background: s.isNote ? 'transparent' : C.surface,
                borderRadius: 14,
                border: s.isNote ? `1.5px dashed ${C.gold300}` : `1px solid ${C.warm200}`,
                padding: s.isNote ? '14px 18px' : '18px 22px',
              }}>
                <div className="stf-step-heading" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="stf-card-num" style={{
                      display: 'none', fontFamily: MONO, fontSize: 11, fontWeight: 700,
                      color: s.isNote ? p.accentDark : C.warm500, marginBottom: 4,
                    }}>{String(s.n).padStart(2, '0')}</div>
                    <div className="stf-step-title" style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: C.dark900, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                      {s.name}
                    </div>
                    <div className="stf-posture-badge" style={{
                      fontSize: 10, fontWeight: 600, color: C.warm500, letterSpacing: '0.12em',
                      textTransform: 'uppercase', background: C.warm100, padding: '4px 10px', borderRadius: 999,
                      whiteSpace: 'nowrap', display: 'inline-block', marginTop: 6,
                    }}>{s.postureAlb}</div>
                  </div>
                  <div className="stf-inline-figure" style={{ flexShrink: 0 }}>
                    <PostureFigure posture={s.posture} size={100} color={s.isNote ? p.accent : C.dark900} bg={s.isNote ? 'transparent' : C.gold50} />
                  </div>
                </div>
                <p className="stf-step-instruction" style={{ fontSize: 14, color: C.warm700, marginTop: 10, lineHeight: 1.6 }}>{s.instruction}</p>
                {s.arabic && (
                  <RecitationCard step={s} accent={p.accent} accentDark={p.accentDark} showTranslit={showTranslit} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <TipsBlock prayer={p} />
      <BottomCTA prayer={p} />
      <style>{`
        .stf-inline-figure{display:none;}
        @media(max-width:760px){
          .stf-scroll-row{grid-template-columns:1fr!important;gap:12px!important;}
          .stf-num-col{display:none!important;}
          .stf-scroll-figure{display:none!important;}
          .stf-inline-figure{display:block;}
          .stf-card-num{display:block!important;}
          .stf-step-card{padding:0 18px 18px!important;overflow:hidden;}
          .stf-step-heading{
            margin:0 -18px 14px!important;
            padding:10px 14px!important;
            align-items:center!important;
            background:${C.gold50}!important;
            border-bottom:1px solid ${C.warm200}!important;
          }
          .stf-step-title{font-size:16px!important;line-height:1.2!important;}
          .stf-posture-badge{font-size:9px!important;margin-top:4px!important;padding:3px 8px!important;}
          .stf-inline-figure .posture-figure{width:76px!important;height:76px!important;}
          .stf-step-instruction{margin-top:0!important;font-size:14px!important;}
        }
      `}</style>
    </>
  );
}

// ── Step layout — full-screen guided card ──────────────────────────
function StepLayout({ prayer: p, showTranslit, onBack }) {
  const [idx, setIdx] = useState(0);
  const steps = useMemo(() => buildPrayerSteps(p), [p.id]);
  const s = steps[idx];
  const max = steps.length;

  function goNext() { if (idx < max - 1) setIdx(i => i + 1); else setIdx(0); }
  function goPrev() { if (idx > 0) setIdx(i => i - 1); else onBack?.(); }

  return (
    <div className="stf-guided-root" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 80px - 56px)' }}>
      {/* ── Progress + counter ── */}
      <div style={{ padding: '14px 20px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              flex: '1 1 0', height: 3, borderRadius: 2, padding: 0, border: 'none', cursor: 'pointer',
              background: i < idx ? p.accent : i === idx ? p.accentDark : C.warm200,
              transition: 'background 180ms', minWidth: 2,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.warm500 }}>
            {String(idx + 1).padStart(2, '0')} / {String(max).padStart(2, '0')}
          </span>
          <span style={{ fontSize: 10, color: C.warm500, fontFamily: SANS, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {s.rakatLabel ? `${s.rakatLabel}  ·  ` : ''}{s.postureAlb}
          </span>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        {s.isRise && (
          <div style={{ width: '100%', maxWidth: 340, background: p.accentDark, borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
            <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{s.name}</span>
          </div>
        )}
        <PostureFigure posture={s.posture} size={clamp(148, 22, 196)} color={s.isNote ? p.accent : C.dark900} bg={C.gold50} />

        <div style={{ textAlign: 'center', width: '100%', maxWidth: 480 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,5vw,28px)', fontWeight: 600, color: C.dark900, margin: 0, lineHeight: 1.1 }}>
            {s.name}
          </h3>
        </div>

        <p style={{ fontSize: 15, color: C.warm700, lineHeight: 1.6, margin: 0, textAlign: 'center', maxWidth: 460, padding: '0 4px' }}>
          {s.instruction}
        </p>

        {s.repeatFrom && (
          <div style={{ width: '100%', maxWidth: 420, background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: p.accentDark, marginBottom: 10 }}>Përsërit hapat</div>
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
        <div style={{ height: 8, flexShrink: 0 }} />
      </div>

      {/* ── Pinned nav bar ── */}
      <div style={{
        flexShrink: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px))',
        borderTop: `1px solid ${C.warm100}`, background: C.bg,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button onClick={goPrev} style={{
          width: 52, height: 56, borderRadius: 14, flexShrink: 0,
          background: C.surface, border: `1px solid ${C.warm200}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: C.dark900, transition: 'background 150ms',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <button onClick={goNext} style={{
          flex: 1, height: 56, borderRadius: 14,
          background: idx === max - 1 ? C.gold600 : C.dark900,
          color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: SANS, fontSize: 16, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'background 180ms',
        }}>
          {idx === max - 1 ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Mbarova namazin
            </>
          ) : (
            <>
              Tjetri
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </>
          )}
        </button>
      </div>

      <style>{`
        .stf-guided .posture-figure { transition: transform 200ms; }
        @media (max-width: 640px) {
          .stf-guided-root { height: calc(100dvh - 80px - 56px - 58px) !important; }
        }
      `}</style>
    </div>
  );
}

function clamp(min, vwPct, max) {
  return `clamp(${min}px, ${vwPct}vw, ${max}px)`;
}

// ── Two-column layout ──────────────────────────────────────────────
function TwoColLayout({ prayer: p, showTranslit }) {
  const [idx, setIdx] = useState(0);
  const s = STEPS[idx];
  return (
    <>
      <SummaryStrip prayer={p} />
      <section style={{ margin: '40px auto 0', maxWidth: 1200, padding: '0 clamp(20px,4vw,56px) 40px' }}>
        <div className="stf-twocol" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Sidebar */}
          <aside style={{
            background: C.surface, borderRadius: 16, border: `1px solid ${C.warm200}`,
            overflow: 'hidden', position: 'sticky', top: 76, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
          }}>
            <div style={{ padding: '14px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold600, borderBottom: `1px solid ${C.warm100}` }}>
              {STEPS.length} hapa
            </div>
            {STEPS.map((step, i) => (
              <button key={step.n} onClick={() => setIdx(i)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '10px 14px',
                background: i === idx ? C.gold50 : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                borderLeft: `3px solid ${i === idx ? p.accentDark : 'transparent'}`,
                borderBottom: i < STEPS.length - 1 ? `1px solid ${C.warm100}` : 'none',
                transition: 'background 150ms',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: i === idx ? p.accentDark : C.warm500, width: 22 }}>
                  {String(step.n).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 600, color: C.dark900, lineHeight: 1.2 }}>{step.name}</div>
                  <div style={{ fontSize: 11, color: C.warm500, marginTop: 2 }}>{step.postureAlb}</div>
                </div>
                <PostureFigure posture={step.posture} size={28} color={i === idx ? C.dark900 : C.warm500} bg="transparent" />
              </button>
            ))}
          </aside>

          {/* Main */}
          <div>
            <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.warm200}`, padding: 'clamp(24px,3vw,36px)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: p.accentDark }}>{String(s.n).padStart(2, '0')}</div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.warm500 }}>{s.postureAlb}</div>
              </div>
              <div className="stf-twocol-detail" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start', marginTop: 14 }}>
                <PostureFigure posture={s.posture} size={150} color={C.dark900} bg={C.gold50} />
                <div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, color: C.dark900, margin: '6px 0 0', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
                    {s.name}
                  </h3>
                  <p style={{ fontSize: 15, color: C.warm700, marginTop: 12, lineHeight: 1.6 }}>{s.instruction}</p>
                </div>
              </div>
              {s.arabic && <RecitationCard step={s} accent={p.accent} accentDark={p.accentDark} showTranslit={showTranslit} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.warm100}` }}>
                <PillBtn variant="ghost" disabled={idx === 0} onClick={() => setIdx(i => Math.max(0, i - 1))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Prapa
                </PillBtn>
                <PillBtn variant="dark" disabled={idx === STEPS.length - 1} onClick={() => setIdx(i => Math.min(STEPS.length - 1, i + 1))}>
                  Tjetri
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </PillBtn>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AyetBlock prayer={p} />
      <TipsBlock prayer={p} />
      <BottomCTA prayer={p} />
      <style>{`
        @media(max-width:900px){
          .stf-twocol{grid-template-columns:1fr!important;}
          .stf-twocol aside{position:static!important;max-height:none!important;}
        }
        @media(max-width:520px){
          .stf-twocol-detail{grid-template-columns:1fr!important;}
        }
      `}</style>
    </>
  );
}

// ─── DETAIL ROOT ──────────────────────────────────────────────────
function SiTeFaleshDetail({ prayerId, onBack, layout, setLayout }) {
  const p = PRAYERS.find(x => x.id === prayerId) || PRAYERS[0];
  const [showTranslit, setShowTranslit] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: SANS, color: C.dark900 }}>
      {/* Hero — compact strip in step mode, full sky in browse modes */}
      {layout === 'step' ? (
        <div style={{ height: 80, background: p.sky, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', flexShrink: 0 }}>
          {p.sunY > -20 && p.sunY < 110 && (
            <div style={{ position: 'absolute', right: -50, top: -50, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${p.sunGlow} 0%, transparent 60%)`, pointerEvents: 'none' }} />
          )}
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px 8px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', color: p.onSky, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600, zIndex: 1, position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Mbrapa
          </button>
          <div style={{ textAlign: 'center', color: p.onSky, position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, textShadow: '0 1px 8px rgba(0,0,0,0.22)', lineHeight: 1.1 }}>{p.nameAlb}</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.72, marginTop: 2 }}>{p.period}</div>
          </div>
          <button onClick={() => setShowTranslit(v => !v)} style={{ padding: '7px 12px', borderRadius: 999, background: showTranslit ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: showTranslit ? C.dark900 : p.onSky, fontFamily: SERIF, fontStyle: 'italic', fontSize: 11, fontWeight: 600, cursor: 'pointer', zIndex: 1, position: 'relative' }}>Shqiptim</button>
        </div>
      ) : (
      <div style={{ position: 'relative' }}>
        <SkyScene prayer={p} height="clamp(280px,36vh,420px)" intensity={1.3} />
        {/* Overlays */}
        <div className="stf-detail-topbar" style={{
          position: 'absolute', top: 20, left: 'clamp(20px,4vw,56px)', right: 'clamp(20px,4vw,56px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={onBack} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 16px 9px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: p.onSky, cursor: 'pointer', fontFamily: SANS, fontSize: 13, fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Mbrapa
          </button>

          {/* Layout + translit controls */}
          <div className="stf-detail-controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Translit toggle */}
            <button
              onClick={() => setShowTranslit(v => !v)}
              title={showTranslit ? 'Fshih shqiptimin' : 'Trego shqiptimin'}
              style={{
                padding: '7px 12px', borderRadius: 999,
                background: showTranslit ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.22)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: showTranslit ? C.dark900 : p.onSky,
                fontFamily: SERIF, fontStyle: 'italic', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >Shqiptim</button>

            {/* Layout selector — hidden in guided step mode */}
            {layout !== 'step' && <div className="stf-layout-selector" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 8px', borderRadius: 999,
              background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              {[
                { id: 'scroll', title: 'Lista' },
                { id: 'twocol', title: 'Dy kolona' },
              ].map(opt => (
                <button className="stf-layout-option" key={opt.id} onClick={() => setLayout(opt.id)} style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: layout === opt.id ? 'rgba(255,255,255,0.9)' : 'transparent',
                  border: 'none', color: layout === opt.id ? C.dark900 : p.onSky,
                  fontFamily: SANS, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 150ms',
                }}>{opt.title}</button>
              ))}
            </div>}
          </div>
        </div>

        {/* Centered prayer name */}
        <div className="stf-prayer-title" style={{ position: 'absolute', left: 0, right: 0, bottom: '10%', textAlign: 'center', color: p.onSky }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.85 }}>{p.period}</div>
          <h1 style={{
            fontFamily: SERIF, fontSize: 'clamp(48px,7vw,84px)',
            fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.02em', lineHeight: 1,
            textShadow: '0 2px 18px rgba(0,0,0,0.22)',
          }}>{p.nameAlb}</h1>
          {layout !== 'step' && (
            <button
              onClick={() => setLayout('step')}
              style={{
                marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '13px 28px', borderRadius: 999,
                background: 'rgba(255,255,255,0.95)',
                border: 'none', cursor: 'pointer',
                color: C.dark900, fontFamily: SANS, fontSize: 15, fontWeight: 700,
                boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
                transition: 'transform 150ms, box-shadow 150ms',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.22)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Fillo hap pas hapi
            </button>
          )}
        </div>
      </div>
      )}

      {layout === 'scroll'  && <ScrollLayout  prayer={p} showTranslit={showTranslit} />}
      {layout === 'step'    && <StepLayout    prayer={p} showTranslit={showTranslit} onBack={onBack} />}
      {layout === 'twocol'  && <TwoColLayout  prayer={p} showTranslit={showTranslit} />}
      <style>{`
        @media(max-width:520px){
          .stf-detail-topbar{
            align-items:flex-start!important;
            gap:10px!important;
          }
          .stf-detail-controls{
            flex-direction:column!important;
            align-items:flex-end!important;
            gap:6px!important;
          }
          .stf-layout-selector{
            max-width:190px!important;
            flex-wrap:wrap!important;
            justify-content:flex-end!important;
            border-radius:20px!important;
          }
          .stf-layout-option{
            min-width:52px!important;
            white-space:nowrap!important;
          }
          .stf-summary-strip{
            margin-top:-28px!important;
            padding:0 20px!important;
          }
          .stf-summary-grid{
            grid-template-columns:repeat(2,minmax(0,1fr))!important;
            gap:14px 18px!important;
            padding:16px 20px!important;
          }
          .stf-summary-item div:first-child{
            letter-spacing:0.12em!important;
          }
          .stf-prayer-title{
            bottom:25%!important;
            padding:0 24px!important;
          }
          .stf-prayer-title h1{
            font-size:clamp(42px,15vw,58px)!important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────
export default function SiTeFalesh({ initialPrayerId = null }) {
  const [view, setView] = useState(
    initialPrayerId
      ? { screen: 'detail', prayerId: initialPrayerId }
      : { screen: 'home', prayerId: null }
  );
  const [layout, setLayout] = useState('step');

  function openPrayer(id) {
    setView({ screen: 'detail', prayerId: id });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function goHome() {
    setView({ screen: 'home', prayerId: null });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (view.screen === 'detail') {
    return (
      <SiTeFaleshDetail
        prayerId={view.prayerId}
        onBack={goHome}
        layout={layout}
        setLayout={setLayout}
      />
    );
  }
  return <SiTeFaleshHome onOpenPrayer={openPrayer} />;
}
