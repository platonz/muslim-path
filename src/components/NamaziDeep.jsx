import { SourceChip, SectionHead, RulingCard } from "./AbdesPage";
import { SERIF, SANS, MONO, DARK_900, WARM_700, WARM_500, WARM_400, WARM_200, GOLD_700, GOLD_600, GOLD_300, GOLD_200, GOLD_50, SURFACE } from "../constants";

// Deep-dive sections for the Si të Falesh page. Same editorial rule as the
// Abdesi page: every ruling is backed by Bulugh al-Maram (Book of Prayer)
// and Fiqh-us-Sunnah at the same time; disputed rulings are flagged.

// ─── KOHËT E NAMAZIT ──────────────────────────────────────────────
const TIME_CARDS = [
  {
    title: 'Sabahu',
    body: 'Nga agimi i vërtetë deri në lindjen e diellit. Pejgamberi ﷺ e falte herët, sa ishte ende gjysmerrësirë, dhe e zgjaste leximin.',
    evidence: [
      { book: 'bulugh', ref: '§163', text: '«…dhe koha e namazit të Sabahut është nga shfaqja e agimit derisa të lindë dielli.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.88a', text: 'Pejgamberi ﷺ e falte Sabahun në errësirën e agimit deri në fund të jetës; gratë besimtare ktheheshin në shtëpi pa u njohur nga errësira.' },
    ],
  },
  {
    title: 'Dreka',
    body: 'Kur dielli kalon zenitin, derisa hija e çdo sendi të bëhet sa gjatësia e tij. Në vapë të madhe pëlqehet të shtyhet derisa të freskohet.',
    evidence: [
      { book: 'bulugh', ref: '§171', text: '«Kur vapa të bëhet e madhe, shtyjeni namazin derisa të freskohet, sepse vapa e madhe është nga fryma e Xhehenemit.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.83', text: 'Në të ftohtë falej herët, në vapë priste freskimin — për ta ruajtur përuljen e namazit. Vonesa ka kufi: jo deri në fund të kohës.' },
    ],
  },
  {
    title: 'Iqindia',
    body: 'Nga çasti kur hija barazohet me sendin, deri në perëndim — por vonimi derisa dielli të zverdhet është i papëlqyer pa nevojë.',
    evidence: [
      { book: 'bulugh', ref: '§163', text: '«Koha e Iqindisë zgjat derisa dielli të zverdhet.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.84', text: '«Ky është namazi i munafikut: pret derisa dielli të jetë mes brirëve të shejtanit, pastaj çohet e i fal katër rekate të shpejta…» (Muslimi)' },
    ],
  },
  {
    title: 'Akshami',
    body: 'Nga perëndimi i diellit derisa të zhduket e kuqja e horizontit. Pëlqehet të falet herët.',
    evidence: [
      { book: 'bulugh', ref: '§180', text: '«Muzgu (koha e Akshamit) është e kuqja e horizontit.»', src: 'Darakutni — sahih sipas Ibn Huzejmes' },
      { book: 'fiqh', ref: '1.85a', text: '«Umeti im do të mbetet në natyrshmëri sa ta falë Akshamin para se të shfaqen yjet.» (Ahmedi, Taberani)' },
    ],
  },
  {
    title: 'Jacia',
    body: 'Deri në mesnatë është koha e zgjedhur; vonimi i saj pëlqehet. Gjumi para saj dhe bisedat pas saj janë të papëlqyera.',
    evidence: [
      { book: 'bulugh', ref: '§170', text: 'Një natë e vonoi Jacinë deri në një të tretën e natës, pastaj tha: «Kjo do të ishte koha e saj e vërtetë, po të mos ishte e rëndë për umetin tim.»', src: 'Muslimi' },
      { book: 'bulugh', ref: '§166', text: 'Ebu Berze (r.a.): Pejgamberit ﷺ i pëlqente ta vononte Jacinë; e urrente gjumin para saj dhe bisedën pas saj.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.86–1.88', text: 'Koha e lejuar zgjat deri në agim për atë që ka arsye: «Neglizhenca s\'është në gjumë — neglizhenca është të mos falesh derisa të hyjë koha e namazit tjetër.» (Muslimi)' },
    ],
  },
];

const TIME_RULES = [
  {
    title: 'Fillimi i kohës — vepra më e mirë',
    body: 'Namazi në kohën e vet të parë është nga veprat më të dashura tek Allahu.',
    evidence: [
      { book: 'bulugh', ref: '§183', text: '«Vepra më e mirë është namazi në fillim të kohës së tij.»', src: 'Tirmidhiu & Hakimi — sahih' },
      { book: 'fiqh', ref: '1.83', text: 'Kur s\'ka arsye (si vapa), namazi falet herët në kohën e vet.' },
    ],
  },
  {
    title: 'Një rekat brenda kohës',
    body: 'Kush arrin një rekat para se të dalë koha, e ka arritur namazin.',
    evidence: [
      { book: 'bulugh', ref: '§173', text: '«Kush kap një rekat të Sabahut para lindjes së diellit, e ka kapur Sabahun; kush kap një rekat të Iqindisë para perëndimit, e ka kapur Iqindinë.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '1.89', text: 'Kjo vlen për çdo namaz — e plotëson namazin edhe nëse dielli po lind a po perëndon, por s\'lejohet shtyrja me qëllim.' },
    ],
  },
  {
    title: 'Gjumi dhe harresa',
    body: 'Kush fle ose harron një namaz, e fal sapo t\'i kujtohet — kjo është shpagimi i tij.',
    evidence: [
      { book: 'bulugh', ref: '§163 (shën.)', text: '«Në gjumë nuk ka neglizhencë; neglizhenca është kur (je zgjuar dhe) nuk falesh derisa vjen koha e namazit tjetër.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '1.89a', text: '«Kush harron një namaz, ta falë kur t\'i kujtohet — s\'ka shpagim tjetër veç tij.» (Buhariu & Muslimi)' },
    ],
  },
  {
    title: 'Tri kohët e ndaluara',
    body: 'Pa shkak, nuk falet namaz vullnetar: pas Sabahut deri sa të ngrihet dielli, kur dielli është në zenit, dhe pas Iqindisë deri në perëndim.',
    evidence: [
      { book: 'bulugh', ref: '§175–176', text: '«S\'ka namaz pas Sabahut derisa të lindë dielli, as pas Iqindisë derisa të perëndojë» — dhe tri kohët në të cilat ndaloi faljen e varrimin.', src: 'Muttefekun alejhi + Muslimi' },
      { book: 'fiqh', ref: '1.90', text: 'Ndalimi vlen derisa dielli të ngrihet sa një shtizë mbi horizont, kur është në zenit derisa të anojë, dhe në perëndim e sipër.' },
    ],
  },
];

// ─── UDHËTARI & I SËMURI ──────────────────────────────────────────
const TRAVEL_CARDS = [
  {
    title: 'Shkurtimi (kasr)',
    body: 'Në udhëtim, namazet 4-rekatëshe falen me 2. Kjo është dhuratë nga Allahu — Pejgamberi ﷺ s\'fali kurrë 4 rekate në udhëtim.',
    evidence: [
      { book: 'bulugh', ref: '§453–454', text: 'Aishja (r.a.): «Namazi u bë detyrë dy rekate; për udhëtarin mbeti ashtu, ndërsa për vendasin u shtua.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '2.109', text: 'Umeri (r.a.) e pyeti Pejgamberin ﷺ për shkurtimin në siguri; tha: «Kjo është një sadaka që Allahu jua ka dhuruar — pranojeni sadakanë e Tij.» (Muslimi)' },
    ],
  },
  {
    title: 'Sa larg duhet të jesh?',
    body: 'Suneti s\'cakton distancë të prerë — Pejgamberi ﷺ shkurtonte edhe për tri milje; medhhebet kanë caktuar masa të ndryshme.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§458–459', text: 'Enesi (r.a.): «Kur udhëtonte tri milje a tri farsakë, falte dy rekate» — dhe gjithë rrugës Medine–Meke falte nga dy.', src: 'Muslimi + Muttefekun alejhi' },
      { book: 'fiqh', ref: '2.110', text: 'Kuptimi i qartë i ajetit përfshin çdo udhëtim, të gjatë a të shkurtër; kufijtë e prerë të disa dijetarëve s\'kanë provë nga suneti.' },
    ],
  },
  {
    title: 'Sa gjatë vlen?',
    body: 'Derisa nuk vendos të banosh aty — në Tabuk Pejgamberi ﷺ qëndroi njëzet ditë duke shkurtuar.',
    differed: true,
    evidence: [
      { book: 'bulugh', ref: '§460–462', text: 'Në Meke qëndroi nëntëmbëdhjetë ditë duke falur dy rekate; në Tabuk njëzet ditë.', src: 'Buhariu; Ebu Davudi' },
      { book: 'fiqh', ref: '2.112', text: 'Medhhebet caktojnë afate (4 ose 15 ditë); Ibn Kajimi: udhëtari mbetet udhëtar sa kohë s\'ka vendosur të banojë aty.' },
    ],
  },
  {
    title: 'Bashkimi i namazeve',
    body: 'Në udhëtim mund të bashkohen Dreka me Iqindinë dhe Akshami me Jacinë — në kohën e njërit prej tyre.',
    evidence: [
      { book: 'bulugh', ref: '§463–464', text: 'Kur nisej para zenitit, e vononte Drekën deri në kohën e Iqindisë dhe i falte bashkë; në Tabuk bashkoi Drekën me Iqindinë dhe Akshamin me Jacinë.', src: 'Muttefekun alejhi; Muslimi' },
      { book: 'fiqh', ref: '2.115c', text: 'Bashkimi lejohet gjatë gjithë udhëtimit, në kohën e njërit nga dy namazet — edhe i ndalur në vendqëndrim, jo vetëm rrugës.' },
    ],
  },
  {
    title: 'Shiu dhe nevoja',
    body: 'Edhe vendasi mund të bashkojë Akshamin me Jacinë në shi të fortë, ose dy namaze për nevojë të vërtetë — pa e bërë zakon.',
    evidence: [
      { book: 'fiqh', ref: '2.117–2.118a', text: 'Pejgamberi ﷺ bashkoi në Medine pa frikë e pa shi «që të mos e rëndonte umetin» (Muslimi, nga Ibn Abasi); bashkimi për shi është sunet i njohur.' },
    ],
  },
  {
    title: 'Xhumaja e udhëtarit',
    body: 'Udhëtari s\'e ka detyrim xhumanë — Pejgamberi ﷺ në udhëtime falte Drekën.',
    evidence: [
      { book: 'bulugh', ref: '§496', text: '«Udhëtari s\'e ka për detyrë namazin e xhumasë.»', src: 'Taberani — zinxhir i dobët' },
      { book: 'fiqh', ref: '2.131a', text: 'Pejgamberi ﷺ udhëtonte dhe nuk falte xhuma, por bashkonte Drekën me Iqindinë; kështu vepruan edhe halifët pas tij.' },
    ],
  },
];

const SICK_CARD = {
  title: 'Namazi i të sëmurit',
  steps: [
    { n: 1, text: 'Falu në këmbë nëse mundesh.' },
    { n: 2, text: 'Nëse s\'mundesh — ulur.' },
    { n: 3, text: 'Nëse as ulur s\'mundesh — shtrirë në krah.' },
    { n: 4, text: 'Kur s\'bën dot ruku e sexhde, mjafton të përkulësh kokën — sexhdeja më ulët se rukuja.' },
  ],
  evidence: [
    { book: 'bulugh', ref: '§467', text: 'Imran ibn Husajni (r.a.): «Kisha hemorroide dhe e pyeta Pejgamberin ﷺ për namazin. Tha: Falu në këmbë; nëse s\'mundesh, ulur; nëse s\'mundesh, shtrirë në krah.»', src: 'Buhariu' },
    { book: 'bulugh', ref: '§468', text: 'Të sëmurit që falej mbi jastëk ia hoqi dhe i tha: «Falu mbi tokë nëse mundesh; përndryshe përkul kokën, dhe bëje sexhden më të ulët se rukunë.»', src: 'Bejhekiu — zinxhir i fortë' },
    { book: 'fiqh', ref: '2.118', text: 'Sëmundja që rëndohet nga falja veç e veç lejon edhe bashkimin e dy namazeve, në kohën e njërit prej tyre.' },
  ],
};

// ─── XHUMAJA ──────────────────────────────────────────────────────
const JUMUAH_CARDS = [
  {
    title: 'Për kë është detyrim',
    body: 'Detyrim personal për çdo musliman të lirë, të rritur e vendas. Përjashtohen katër: skllavi, gruaja, fëmija dhe i sëmuri.',
    evidence: [
      { book: 'bulugh', ref: '§495', text: '«Xhumaja është detyrë për çdo musliman në bashkësi, përveç katërve: skllavit, gruas, fëmijës dhe të sëmurit.»', src: 'Ebu Davudi — sahih sipas Neveviut' },
      { book: 'fiqh', ref: '2.131a', text: 'Përjashtohen edhe udhëtari dhe ai që pengohet nga shiu a frika; nëse këta e falin xhumanë, u vlen dhe s\'e falin Drekën.' },
    ],
  },
  {
    title: 'Paralajmërimi për lënien',
    body: 'Lënia e xhumasë pa arsye është nga mëkatet e rënda.',
    evidence: [
      { book: 'bulugh', ref: '§470', text: '«Ose do të heqin dorë njerëzit nga lënia e xhumave, ose Allahu do t\'ua vulosë zemrat e pastaj do të jenë nga të shkujdesurit.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '2.131', text: '«Kush lë tri xhuma rresht nga shkujdesja, Allahu ia vulos zemrën.» (të pestë imamët)' },
    ],
  },
  {
    title: 'Koha e xhumasë',
    body: 'Njësoj si Dreka — pasi dielli kalon zenitin.',
    evidence: [
      { book: 'bulugh', ref: '§471', text: 'Seleme ibn Ekva (r.a.): «Faleshim me Pejgamberin ﷺ kur dielli kalonte zenitin, dhe ktheheshim duke ndjekur hijen.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '2.132', text: 'Ky është mendimi i shumicës së sahabëve e tabi\'inëve; hanbelitë e lejojnë edhe pak para zenitit.' },
    ],
  },
  {
    title: 'Gusli dhe përgatitja',
    body: 'Gusël, rrobat më të mira, parfum, dhe ardhje herët — shpërblimi zvogëlohet sa më vonë të shkosh.',
    evidence: [
      { book: 'bulugh', ref: '§487', text: '«Kush lahet, vjen në xhuma, fal ç\'i është caktuar, hesht derisa imami ta mbarojë hutben dhe falet me të — i falen mëkatet mes kësaj xhumaje e tjetrës, edhe tri ditë më shumë.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '2.128–2.129', text: '«Çdo musliman duhet të lahet ditën e xhuma, të veshë rrobat më të mira e të parfumoset.» (Buhariu & Muslimi)' },
    ],
  },
  {
    title: 'Heshtja gjatë hutbes',
    body: 'Gjatë hutbes nuk flitet fare — as për t\'i thënë tjetrit «hesht».',
    evidence: [
      { book: 'bulugh', ref: '§480', text: '«Nëse i thua shokut tënd \'hesht\' ditën e xhuma ndërsa imami mban hutben — ke folur kot.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '2.142', text: 'Folja gjatë hutbes është e ndaluar; lejohet vetëm kur imami të pyet a të flet ty.' },
    ],
  },
  {
    title: 'Dy rekate kur hyn në xhami',
    body: 'Edhe nëse imami është duke mbajtur hutben, fali dy rekate të lehta para se të ulesh.',
    evidence: [
      { book: 'bulugh', ref: '§481', text: 'Një njeri hyri gjatë hutbes dhe Pejgamberi ﷺ e pyeti: «A u fale?» — «Jo.» — «Çohu dhe fal dy rekate.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '2.130', text: 'Tahijetul-mesxhidi falet edhe gjatë hutbes, shkurt — kështu e urdhëroi Pejgamberi ﷺ Sulejkun.' },
    ],
  },
  {
    title: 'Ora e përgjigjes',
    body: 'Të premten ka një çast të shkurtër kur lutja nuk kthehet mbrapsht.',
    evidence: [
      { book: 'bulugh', ref: '§488', text: '«Në ditën e xhuma ka një orë: s\'ka musliman që e qëllon duke u falur e duke kërkuar diçka nga Allahu, veçse Allahu do t\'ia japë» — dhe bëri me dorë sa e shkurtër është.', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '2.125a', text: 'Mendimet për kohën e saj arrijnë në dyzet; më të fortat: mes uljes së imamit e mbarimit të namazit, ose pas Iqindisë deri në perëndim.' },
    ],
  },
  {
    title: 'Pas xhumasë',
    body: 'Suneti pas xhumasë: katër rekate në xhami, ose dy në shtëpi.',
    evidence: [
      { book: 'bulugh', ref: '§485', text: '«Kush e fal xhumanë, le të falë katër rekate pas saj.»', src: 'Muslimi' },
      { book: 'fiqh', ref: '2.144a', text: 'Pejgamberi ﷺ falte dy rekate në shtëpi pas xhumasë; urdhëroi katër për atë që falet në xhami.' },
    ],
  },
];

// ─── BAJRAMET ─────────────────────────────────────────────────────
const EID_CARDS = [
  {
    title: 'Dy ditët e festës',
    body: 'Fitër Bajrami dhe Kurban Bajrami — dhurata e Allahut në vend të festave të vjetra.',
    evidence: [
      { book: 'bulugh', ref: '§524', text: 'Kur Pejgamberi ﷺ erdhi në Medine, banorët kishin dy ditë loje. Tha: «Allahu jua ka zëvendësuar me dy ditë më të mira: ditën e Kurbanit dhe ditën e Fitrit.»', src: 'Ebu Davudi & Nesaiu — zinxhir i saktë' },
      { book: 'fiqh', ref: '2.153', text: 'Loja, gëzimi dhe kënga brenda kufijve janë të lejuara ditët e bajramit: «çdo popull ka festën e vet — kjo është festa jonë».' },
    ],
  },
  {
    title: 'Dalja në namaz — të gjithë',
    body: 'Namazi i bajramit falet në vendfalje të hapur; dalin edhe gratë e fëmijët.',
    evidence: [
      { book: 'bulugh', ref: '§514', text: 'Umm Atije (r.a.): «U urdhëruam të dalim në dy bajramet bashkë me vajzat e reja dhe gratë me cikël — ato qëndronin mënjanë nga vendfalja.»', src: 'Muttefekun alejhi' },
      { book: 'fiqh', ref: '2.148–2.148a', text: 'Pejgamberi ﷺ i falte bajramet në periferi të Medines dhe kurrë në xhami, veç një herë prej shiut.' },
    ],
  },
  {
    title: 'Pa ezan, para hutbes',
    body: 'Dy rekate pa ezan e pa ikamet — namazi para hutbes, jo pas saj. Para dhe pas tij s\'ka namaz tjetër në vendfalje.',
    evidence: [
      { book: 'bulugh', ref: '§515–517', text: 'Bajramin e falnin para hutbes; dy rekate pa asnjë namaz para a pas tyre; pa ezan e pa ikamet.', src: 'Muttefekun alejhi; shtatë imamët; Ebu Davudi' },
      { book: 'fiqh', ref: '2.149a–2.151', text: 'Suneti është pa ezan, pa ikamet, pa «es-salatu xhami\'ah» — dhe pa namaz vullnetar para a pas tij në vendfalje.' },
    ],
  },
  {
    title: 'Tekbiret shtesë',
    body: 'Në rekatin e parë shtatë tekbire pas tekbirit hapës, në të dytin pesë — pastaj leximi.',
    evidence: [
      { book: 'bulugh', ref: '§520', text: 'Pejgamberi ﷺ bënte shtatë tekbire në rekatin e parë të bajramit dhe pesë në të dytin, pastaj lexonte.', src: 'Ebu Davudi' },
      { book: 'fiqh', ref: '2.150', text: 'Ky është mendimi i shumicës; tekbiret janë sunet — namazi vlen edhe po të harrohen, pa sexhde harrese.' },
    ],
  },
  {
    title: 'Hurma para Fitrit',
    body: 'Për Fitër Bajram hahet para namazit — numër tek hurmash; për Kurban nuk hahet deri pas namazit.',
    evidence: [
      { book: 'bulugh', ref: '§512–513', text: 'Nuk dilte ditën e Fitrit pa ngrënë disa hurma; ditën e Kurbanit s\'hante deri sa të kthehej nga namazi.', src: 'Buhariu; Tirmidhiu — sahih sipas Ibn Hibanit' },
      { book: 'fiqh', ref: '2.147b', text: 'Ibn Kudame: «Nuk di asnjë mospajtim se ditën e Fitrit duhet ngrënë herët.»' },
    ],
  },
  {
    title: 'Rrugë të ndryshme',
    body: 'Shko në vendfalje nga një rrugë dhe kthehu nga tjetra; pëlqehet të shkosh në këmbë.',
    evidence: [
      { book: 'bulugh', ref: '§522, §525', text: 'Ditët e bajramit ndërronte rrugë (Buhariu); «është nga suneti të dalësh në bajram në këmbë» (Tirmidhiu — hasen).', src: '' },
      { book: 'fiqh', ref: '2.148b', text: 'Shumica e dijetarëve e pëlqejnë ndërrimin e rrugës për imamin dhe xhematin njësoj.' },
    ],
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────
const C = { surface: SURFACE, dark900: DARK_900, warm700: WARM_700, warm500: WARM_500, warm400: WARM_400, warm200: WARM_200, gold700: GOLD_700, gold600: GOLD_600, gold300: GOLD_300, gold200: GOLD_200, gold50: GOLD_50 };

export default function NamaziDeep() {
  return (
    <div style={{ fontFamily: SANS, color: C.dark900 }}>
      <style>{`
        .nmd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
        .nmd-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items: start; }
        @media (max-width: 860px) { .nmd-grid-2, .nmd-grid-3 { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── Kohët ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          eyebrow="Kohët · المواقيت"
          title="Kur hyn dhe del koha e çdo namazi"
          sub="«Namazi është detyrë për besimtarët në kohë të caktuara.» (En-Nisa 4:103) — kufijtë e çdo kohe sipas hadithit të Abdullah ibn Amrit."
        />
        <div className="nmd-grid-3">
          {TIME_CARDS.map(c => <RulingCard key={c.title} item={c} />)}
        </div>
        <div className="nmd-grid-2" style={{ marginTop: 14 }}>
          {TIME_RULES.map(c => <RulingCard key={c.title} item={c} />)}
        </div>
      </section>

      {/* ── Udhëtari ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          eyebrow="Udhëtimi · السفر"
          title="Namazi i udhëtarit"
          sub="Shkurtimi dhe bashkimi janë lehtësime që Allahu do t'i pranohen — «sadaka» e Tij për umetin."
        />
        <div className="nmd-grid-3">
          {TRAVEL_CARDS.map(c => <RulingCard key={c.title} item={c} />)}
        </div>

        {/* I sëmuri */}
        <div style={{ background: C.surface, border: `1px solid ${C.warm200}`, borderRadius: 18, padding: 'clamp(20px,3vw,30px)', marginTop: 16 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px,2.2vw,23px)', fontWeight: 600, margin: 0, color: C.dark900 }}>{SICK_CARD.title}</h3>
          <ol style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SICK_CARD.steps.map(s => (
              <li key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: C.gold50, border: `1px solid ${C.gold300}`, color: C.gold700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 600 }}>{s.n}</span>
                <span style={{ fontSize: 14, lineHeight: 1.65, color: C.warm700, paddingTop: 2 }}>{s.text}</span>
              </li>
            ))}
          </ol>
          <SourceChip evidence={SICK_CARD.evidence} />
        </div>
      </section>

      {/* ── Xhumaja ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          eyebrow="E premtja · الجمعة"
          title="Xhumaja"
          sub="Dita më e mirë e javës dhe namazi i saj — nga gusli i mëngjesit deri te ora e përgjigjes."
        />
        <div className="nmd-grid-2">
          {JUMUAH_CARDS.map(c => <RulingCard key={c.title} item={c} />)}
        </div>
      </section>

      {/* ── Bajramet ── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 clamp(20px,4vw,56px)' }}>
        <SectionHead
          eyebrow="Festat · العيدان"
          title="Namazi i bajrameve"
          sub="Fitër dhe Kurban Bajrami — si falen dhe si festohen sipas sunetit."
        />
        <div className="nmd-grid-3">
          {EID_CARDS.map(c => <RulingCard key={c.title} item={c} />)}
        </div>
      </section>

      {/* ── Sources footer ── */}
      <section style={{ maxWidth: 1100, margin: '56px auto 0', padding: '0 clamp(20px,4vw,56px) 80px' }}>
        <div style={{ background: C.gold50, border: `1px solid ${C.gold200}`, borderRadius: 16, padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: C.warm700, fontFamily: SANS }}>
            <strong style={{ color: C.dark900 }}>Burimet.</strong> Rregullat e këtyre kapitujve mbështeten njëkohësisht në{' '}
            <em>Bulugh al-Maram</em> të Ibn Haxherit (Libri i Namazit, hadithet 163–526) dhe në{' '}
            <em>Fikhun e Sunetit</em> të Sejjid Sabikut (kapitujt 1.82–1.90 dhe 2.109–2.154). Aty ku burimet
            shënojnë mospajtim mes dijetarëve, rregulla mban shenjën <em>«Mendime të ndryshme»</em>.
          </div>
        </div>
      </section>
    </div>
  );
}
