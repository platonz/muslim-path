// Sunneti — një libër, shumë kapituj (shqip)
// src/data/sunneti.js
// Llojet e faqeve: chapter | prose | verse | hadith | list | contents | blank | colophon

const SECTIONS = [
  // ───────────────────────── Kurani
  {
    id: 'quran', num: 'Kapitulli I', kicker: 'Shpallje', nav: 'Kurani',
    title: 'Kurani Fisnik', arabic: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064a\u0645',
    subtitle: 'Shpallja, e recituar dhe e ruajtur', meta: 'Suretu el-F\u0101ti\u1e25a dhe el-Bekare',
    pages: [
      {
        type: 'verse', basmala: true, surah: 'El-F\u0101ti\u1e25a',
        verses: [
          { n: 1, ar: '\u0627\u0644\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0651\u064e\u0647\u0650 \u0631\u064e\u0628\u0651\u0650 \u0627\u0644\u0652\u0639\u064e\u0627\u0644\u064e\u0645\u0650\u064a\u0646\u064e', en: 'Fal\u00ebnderimi i takon Allahut, Zotit t\u00eb bot\u00ebve.' },
          { n: 2, ar: '\u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650', en: 'M\u00ebshiruesit, M\u00ebshir\u00ebb\u00ebr\u00ebsit.' },
          { n: 3, ar: '\u0645\u064e\u0627\u0644\u0650\u0643\u0650 \u064a\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u062f\u0651\u0650\u064a\u0646\u0650', en: 'Sunduesit t\u00eb Dit\u00ebs s\u00eb Gjykimit.' },
          { n: 4, ar: '\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0639\u0652\u0628\u064f\u062f\u064f \u0648\u064e\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0633\u0652\u062a\u064e\u0639\u0650\u064a\u0646\u064e', en: 'Vet\u00ebm Ty t\u00eb adhurojm\u00eb dhe vet\u00ebm prej Teje ndihm\u00eb k\u00ebrkojm\u00eb.' },
        ],
      },
      {
        type: 'verse', surah: 'El-F\u0101ti\u1e25a', continued: true,
        verses: [
          { n: 5, ar: '\u0627\u0647\u0652\u062f\u0650\u0646\u064e\u0627 \u0627\u0644\u0635\u0651\u0650\u0631\u064e\u0627\u0637\u064e \u0627\u0644\u0652\u0645\u064f\u0633\u0652\u062a\u064e\u0642\u0650\u064a\u0645\u064e', en: 'Udh\u00ebzona n\u00eb rrug\u00ebn e drejt\u00eb,' },
          { n: 6, ar: '\u0635\u0650\u0631\u064e\u0627\u0637\u064e \u0627\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0623\u064e\u0646\u0652\u0639\u064e\u0645\u0652\u062a\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652', en: 'n\u00eb rrug\u00ebn e atyre q\u00eb i bekove,' },
          { n: 7, ar: '\u063a\u064e\u064a\u0652\u0631\u0650 \u0627\u0644\u0652\u0645\u064e\u063a\u0652\u0636\u064f\u0648\u0628\u0650 \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652 \u0648\u064e\u0644\u064e\u0627 \u0627\u0644\u0636\u0651\u064e\u0627\u0644\u0651\u0650\u064a\u0646\u064e', en: 'jo n\u00eb t\u00eb atyre q\u00eb merituan z\u00ebmrimin, e as t\u00eb atyre q\u00eb humb\u00ebn.' },
        ],
      },
      {
        type: 'verse', basmala: true, surah: 'El-Bekare',
        verses: [
          { n: 1, ar: '\u0627\u0644\u0645\u0653', en: 'Elif, L\u00e2m, M\u00eem.' },
          { n: 2, ar: '\u0630\u064e\u0670\u0644\u0650\u0643\u064e \u0627\u0644\u0652\u0643\u0650\u062a\u064e\u0627\u0628\u064f \u0644\u064e\u0627 \u0631\u064e\u064a\u0652\u0628\u064e \u0641\u0650\u064a\u0647\u0650 \u0647\u064f\u062f\u064b\u0649 \u0644\u0650\u0644\u0652\u0645\u064f\u062a\u0651\u064e\u0642\u0650\u064a\u0646\u064e', en: 'Ky \u00ebsht\u00eb Libri n\u00eb t\u00eb cilin nuk ka dyshim, udh\u00ebzim p\u00ebr t\u00eb devotshmit.' },
          { n: 3, ar: '\u0627\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u064a\u064f\u0624\u0652\u0645\u0650\u0646\u064f\u0648\u0646\u064e \u0628\u0650\u0627\u0644\u0652\u063a\u064e\u064a\u0652\u0628\u0650 \u0648\u064e\u064a\u064f\u0642\u0650\u064a\u0645\u064f\u0648\u0646\u064e \u0627\u0644\u0635\u0651\u064e\u0644\u064e\u0627\u0629\u064e', en: 'T\u00eb cil\u00ebt besojn\u00eb n\u00eb t\u00eb padukshmen dhe e falin namazin.' },
        ],
      },
    ],
  },

  // ───────────────────────── Si të Falesh
  {
    id: 'salah', num: 'Kapitulli II', kicker: 'Adhurim', nav: 'Si t\u00eb Falesh',
    title: 'Si t\u00eb Falesh', arabic: '\u0627\u0644\u0635\u0651\u0644\u0627\u0629',
    subtitle: 'Pes\u00eb namazet ditore, hap pas hapi', meta: 'Sabahu \u00b7 Dreka \u00b7 Ikindia \u00b7 Akshami \u00b7 Jacia',
    pages: [
      {
        type: 'list', heading: 'Nj\u00eb dit\u00eb me pes\u00eb kthime', kicker: '\u00c7do namaz, ora e vet',
        items: [
          { label: 'Sabahu', sub: 'Agimi \u00b7 2 farz', ar: '\u0627\u0644\u0641\u062c\u0631' },
          { label: 'Dreka', sub: 'Mesdit\u00eb \u00b7 4 farz', ar: '\u0627\u0644\u0638\u0647\u0631' },
          { label: 'Ikindia', sub: 'Pasdite \u00b7 4 farz', ar: '\u0627\u0644\u0639\u0635\u0631' },
          { label: 'Akshami', sub: 'Per\u00ebndim \u00b7 3 farz', ar: '\u0627\u0644\u0645\u063a\u0631\u0628' },
          { label: 'Jacia', sub: 'Nata \u00b7 4 farz', ar: '\u0627\u0644\u0639\u0634\u0627\u0621' },
        ],
      },
      {
        type: 'list', heading: 'Nj\u00eb rekat namazi', kicker: 'Rekati',
        items: [
          { label: 'Q\u00ebndrimi', sub: 'Fillo me \u201cAllahu ekber\u201d, pastaj lexo Fatihan\u00eb' },
          { label: 'Rukuja', sub: '\u201cI lavd\u00ebruar qoft\u00eb Zoti im, i Madh\u00ebrishmi\u201d' },
          { label: 'Ngritja', sub: '\u201cAllahu e d\u00ebgjon at\u00eb q\u00eb e lavd\u00ebron\u201d' },
          { label: 'Sexhdja', sub: 'Balli n\u00eb tok\u00eb, dy her\u00eb' },
          { label: 'Ulja', sub: 'Teshehudi, pastaj selami djathtas e majtas' },
        ],
      },
      {
        type: 'hadith', number: 'Udh\u00ebzim',
        narrator: 'Transmeton M\u00e2lik ibn Huvejrithi \u2014 Buhariu',
        arabic: '\u0635\u064e\u0644\u0651\u064f\u0648\u0627 \u0643\u064e\u0645\u064e\u0627 \u0631\u064e\u0623\u064e\u064a\u0652\u062a\u064f\u0645\u064f\u0648\u0646\u0650\u064a \u0623\u064f\u0635\u064e\u0644\u0651\u0650\u064a',
        text: '\u201cFaluni ashtu si\u00e7 m\u00eb keni par\u00eb mua duke u falur.\u201d',
      },
    ],
  },

  // ───────────────────────── Dua
  {
    id: 'dua', num: 'Kapitulli III', kicker: 'P\u00ebrmendje', nav: 'Dua',
    title: 'Mburoja e Besimtarit', arabic: '\u062d\u0635\u0646 \u0627\u0644\u0645\u0633\u0644\u0645',
    subtitle: 'Lutje p\u00ebr \u00e7do \u00e7ast', meta: 'M\u00ebngjes, mbr\u00ebmje e nd\u00ebrmjet',
    pages: [
      {
        type: 'hadith', number: 'Kur zgjohesh',
        narrator: 'Nj\u00eb lutje e m\u00ebngjesit',
        arabic: '\u0627\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0623\u064e\u062d\u0652\u064a\u064e\u0627\u0646\u064e\u0627 \u0628\u064e\u0639\u0652\u062f\u064e \u0645\u064e\u0627 \u0623\u064e\u0645\u064e\u0627\u062a\u064e\u0646\u064e\u0627 \u0648\u064e\u0625\u0650\u0644\u064e\u064a\u0652\u0647\u0650 \u0627\u0644\u0646\u0651\u064f\u0634\u064f\u0648\u0631\u064f',
        text: '\u201cFal\u00ebnderimi i takon Allahut, i Cili na ngjalli pasi na b\u00ebri t\u00eb vdesim, dhe tek Ai \u00ebsht\u00eb ringjallja.\u201d',
      },
      {
        type: 'list', heading: 'Pak fjal\u00eb, t\u00eb p\u00ebrs\u00ebritura shpesh', kicker: 'Gjat\u00eb gjith\u00eb dit\u00ebs',
        items: [
          { label: 'Para ngr\u00ebnies', sub: 'Bismil-lah \u2014 n\u00eb emr\u00ebt e Allahut', ar: '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647' },
          { label: 'Kur del nga sht\u00ebpia', sub: '\u201cMb\u00ebshtetem te Allahu; nuk ka fuqi ve\u00e7se me T\u00eb\u201d' },
          { label: 'N\u00eb v\u00ebshtir\u00ebsi', sub: '\u201cNe i takojm\u00eb Allahut dhe tek Ai kthehemi\u201d' },
          { label: 'Para gjumit', sub: '\u201cMe emrin T\u00ebnd, o Allah, vdes dhe jetoj\u201d' },
        ],
      },
    ],
  },

  // ───────────────────────── Kalendari
  {
    id: 'calendar', num: 'Kapitulli IV', kicker: 'Koha', nav: 'Kalendari',
    title: 'Viti H\u00ebnor', arabic: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0647\u062c\u0631\u064a',
    subtitle: 'Dymb\u00ebdhjet\u00eb muaj t\u00eb vizatuar nga h\u00ebna', meta: 'Num\u00ebruar prej Hixhretit',
    pages: [
      {
        type: 'prose', dropcap: true, heading: 'Num\u00ebrohet prej nj\u00eb udh\u00ebtimi',
        paragraphs: [
          'Viti islam nuk fillon me sundimin e nj\u00eb mbreti apo me kthes\u00ebn e nj\u00eb stine, por me nj\u00eb udh\u00ebtim \u2014 Hixhretin, sh\u00ebrnguljen e Pejgamberit \uFDFA nga Meka n\u00eb Medine. Prej asaj nisjeje num\u00ebrohen vitet, k\u00ebshtu q\u00eb t\u00eb shkruash nj\u00eb dat\u00eb do t\u00eb thot\u00eb t\u00eb kujtosh nj\u00eb fillim.',
          'Meq\u00eb muajt ndjekin h\u00ebn\u00ebn, viti \u00ebsht\u00eb rreth nj\u00ebmb\u00ebdhjet\u00eb dit\u00eb m\u00eb i shkurt\u00ebr se ai diellor, dhe stin\u00ebt e shenjta l\u00ebvizin ngadal\u00eb n\u00ebp\u00ebr t\u00eb \u2014 Ramazani duke kaluar n\u00ebp\u00ebr ver\u00eb e dim\u00ebr gjat\u00eb nj\u00eb jete.',
        ],
        pullquote: 'T\u00eb shkruash dat\u00ebn do t\u00eb thot\u00eb t\u00eb kujtosh nj\u00eb fillim.',
      },
      {
        type: 'list', heading: 'Dymb\u00ebdhjet\u00eb muajt', kicker: '\u00c7do h\u00ebn\u00eb e re, nj\u00eb faqe e kthyer',
        items: [
          { idx: 1, label: 'Muharrem', sub: 'Muaj i shenjt\u00eb' },
          { idx: 3, label: 'Rebiul-Evvel', sub: 'Lindja e Pejgamberit \uFDFA' },
          { idx: 9, label: 'Ramazan', sub: 'Muaji i agj\u00ebrimit' },
          { idx: 10, label: 'Sheval', sub: 'Fillon me Fit\u00ebr Bajramin' },
          { idx: 12, label: 'Dhul-Hixhe', sub: 'Haxhi dhe Kurban Bajrami' },
        ],
      },
    ],
  },

  // ───────────────────────── Biblioteka
  {
    id: 'library', num: 'Kapitulli V', kicker: 'Lexime', nav: 'Biblioteka',
    title: 'Kopshtet e t\u00eb Mir\u00ebve', arabic: '\u0631\u064a\u0627\u0636 \u0627\u0644\u0635\u0627\u0644\u062d\u064a\u0646',
    subtitle: 'Libra, artikuj dhe reflektime', meta: 'Nj\u00eb lexim nga biblioteka',
    pages: [
      {
        type: 'hadith', number: 'Mbi sinqeritetin',
        narrator: 'Transmeton Omer ibn Hattabi \u2014 Buhariu dhe Muslimi',
        arabic: '\u0625\u0650\u0646\u0651\u064e\u0645\u064e\u0627 \u0627\u0644\u0623\u064e\u0639\u0652\u0645\u064e\u0627\u0644\u064f \u0628\u0650\u0627\u0644\u0646\u0651\u0650\u064a\u0651\u064e\u0627\u062a\u0650',
        text: '\u201cVeprat jan\u00eb sipas q\u00ebllimeve, dhe \u00e7dokush do t\u00eb ket\u00eb vet\u00ebm at\u00eb q\u00eb ka pasur p\u00ebr q\u00ebllim.\u201d',
      },
      {
        type: 'prose', dropcap: true, heading: 'Besniku',
        paragraphs: [
          'Shum\u00eb para se t\u2019i vinte ndonj\u00eb shpallje, qyteti i Mek\u00ebs e quante el-Emin \u2014 t\u00eb besueshmin. Tregtar\u00ebt ia linin mallin n\u00eb ruajtje; rival\u00ebt ia sillnin mosmarr\u00ebveshjet p\u00ebr gjykim. Kur fiset gati nxor\u00ebn shpatat se kush do ta vendoste Gurin e Zi n\u00eb vend, ishin duart e tij q\u00eb pranuan t\u2019i besonin.',
          'Askush ende nuk e dinte se ky njeri i qet\u00eb e i ndersh\u00ebm nj\u00eb dit\u00eb do t\u00eb kthehej nga nj\u00eb mal duke bartur fjal\u00eb q\u00eb do t\u2019i mbijetonin \u00e7do perandorie p\u00ebrreth tij.',
        ],
        pullquote: 'Nj\u00eb njeri q\u00eb qyteti i besonte, shum\u00eb para se t\u00eb vinte shpallja e par\u00eb.',
      },
      {
        type: 'prose', heading: 'Mbi leximin e ngadalt\u00eb',
        paragraphs: [
          'Recituesit e hersh\u00ebm nuk vraponin drejt fundit t\u00eb sures. Thuhet se nj\u00eb sahab kaloi nj\u00eb nat\u00eb t\u00eb t\u00ebr\u00eb duke p\u00ebrs\u00ebritur nj\u00eb ajet t\u00eb vet\u00ebm, duke gjetur n\u00eb t\u00eb edhe nj\u00eb paralajm\u00ebrim edhe nj\u00eb m\u00ebshir\u00eb q\u00eb lexuesi i nxituar nuk do t\u2019i takonte kurr\u00eb.',
          'T\u00eb lexosh n\u00eb k\u00ebt\u00eb m\u00ebnyr\u00eb nuk do t\u00eb thot\u00eb t\u00eb mbarosh nj\u00eb lib\u00ebr, por t\u00eb ndryshohesh prej tij \u2014 ta l\u00ebsh nj\u00eb rresht t\u00eb vet\u00ebm t\u00eb q\u00ebndroj\u00eb n\u00eb gjoks si nj\u00eb prush, i ngroht\u00eb e i pangutsh\u00ebm, derisa t\u00eb jap\u00eb drit\u00ebn e vet.',
        ],
      },
    ],
  },

  // ───────────────────────── Ligjëratat
  {
    id: 'lectures', num: 'Kapitulli VI', kicker: 'Dije', nav: 'Ligj\u00ebratat',
    title: 'Tubimet e Dijes', arabic: '\u0627\u0644\u062f\u0631\u0648\u0633',
    subtitle: 'Ligj\u00ebrata, audio dhe video', meta: 'Rrethi i k\u00ebrkuesve',
    pages: [
      {
        type: 'prose', dropcap: true, heading: 'Nj\u00eb rrug\u00eb e leht\u00ebsuar',
        paragraphs: [
          'K\u00ebrkimi i dijes ka filluar gjithmon\u00eb n\u00eb nj\u00eb rreth \u2014 nj\u00eb m\u00ebsues, pak n\u00ebx\u00ebn\u00ebs, dhe nj\u00eb pyetje e b\u00ebr\u00eb me p\u00ebrul\u00ebsi. Sot rrethi zgjerohet p\u00ebrmes z\u00ebrit dhe ekranit, por shpirti i tij mbetet i pandryshuar: t\u00eb m\u00ebsosh fen\u00eb do t\u00eb thot\u00eb t\u2019i afrohesh Atij q\u00eb m\u00ebsoi me an\u00eb t\u00eb lapsit.',
          'Pejgamberi \uFDFA premtoi se kush ndjek nj\u00eb rrug\u00eb n\u00eb k\u00ebrkim t\u00eb dijes, Allahu ia leht\u00ebson rrug\u00ebn drejt Xhenetit \u2014 dhe se engj\u00ebjt i ulin krah\u00ebt e tyre p\u00ebr k\u00ebrkuesin, t\u00eb k\u00ebnaqur me at\u00eb q\u00eb ai k\u00ebrkon.',
        ],
        pullquote: 'Engj\u00ebjt i ulin krah\u00ebt p\u00ebr k\u00ebrkuesin e dijes.',
      },
      {
        type: 'hadith', number: 'Nj\u00eb premtim',
        narrator: 'Transmeton Ebu Hurejra \u2014 Muslimi',
        arabic: '\u0645\u064e\u0646\u0652 \u0633\u064e\u0644\u064e\u0643\u064e \u0637\u064e\u0631\u0650\u064a\u0642\u064b\u0627 \u064a\u064e\u0644\u0652\u062a\u064e\u0645\u0650\u0633\u064f \u0641\u0650\u064a\u0647\u0650 \u0639\u0650\u0644\u0652\u0645\u064b\u0627',
        text: '\u201cKush ndjek nj\u00eb rrug\u00eb p\u00ebr t\u00eb k\u00ebrkuar dije, Allahu ia leht\u00ebson rrug\u00ebn drejt Xhenetit.\u201d',
      },
    ],
  },

  // ───────────────────────── Tesbihu
  {
    id: 'tasbeeh', num: 'Kapitulli VII', kicker: 'Dhik\u00ebr', nav: 'Tesbihu',
    title: 'P\u00ebrmendja e Allahut', arabic: '\u0627\u0644\u062a\u0633\u0628\u064a\u062d',
    subtitle: 'Dhikri i num\u00ebruar n\u00eb gishta', meta: 'Pas \u00e7do namazi',
    pages: [
      {
        type: 'list', heading: 'Pas \u00e7do namazi', kicker: 'Nj\u00ebqind, pa nj\u00eb',
        items: [
          { idx: 33, label: 'Subhanallah', sub: 'I Lavd\u00ebruar qoft\u00eb Allahu', ar: '\u0633\u064f\u0628\u0652\u062d\u064e\u0627\u0646\u064e \u0627\u0644\u0644\u0651\u064e\u0647' },
          { idx: 33, label: 'Elhamdulilah', sub: 'Fal\u00ebnderimi i takon Allahut', ar: '\u0627\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0651\u064e\u0647' },
          { idx: 34, label: 'Allahu ekber', sub: 'Allahu \u00ebsht\u00eb m\u00eb i Madhi', ar: '\u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0623\u064e\u0643\u0652\u0628\u064e\u0631' },
        ],
      },
      {
        type: 'hadith', number: 'Drit\u00eb mbi gjuh\u00eb',
        narrator: 'Transmeton Ebu Hurejra \u2014 Buhariu dhe Muslimi',
        arabic: '\u0643\u064e\u0644\u0650\u0645\u064e\u062a\u064e\u0627\u0646\u0650 \u062e\u064e\u0641\u0650\u064a\u0641\u064e\u062a\u064e\u0627\u0646\u0650 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0644\u0651\u0650\u0633\u064e\u0627\u0646\u0650',
        text: '\u201cDy fjal\u00eb t\u00eb lehta p\u00ebr gjuh\u00ebn, t\u00eb r\u00ebnda n\u00eb peshore, t\u00eb dashura p\u00ebr M\u00ebshiruesin.\u201d',
      },
    ],
  },

  // ───────────────────────── Emrat e Allahut
  {
    id: 'names', num: 'Kapitulli VIII', kicker: 'Emrat Hyjnor\u00eb', nav: 'Emrat e Allahut',
    title: 'Emrat m\u00eb t\u00eb Bukur', arabic: '\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0644\u0647 \u0627\u0644\u062d\u0633\u0646\u0649',
    subtitle: 'Esmaul-Husna', meta: 'Thirreni At\u00eb me to',
    pages: [
      {
        type: 'list', heading: 'Disa nga n\u00ebnt\u00ebdhjet\u00eb e nënt\u00eb', kicker: 'Allahut i takojn\u00eb emrat m\u00eb t\u00eb bukur',
        items: [
          { label: 'Er-Rahman', sub: 'M\u00ebshiruesi', ar: '\u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0646' },
          { label: 'Er-Rahim', sub: 'M\u00ebshir\u00ebb\u00ebr\u00ebsi', ar: '\u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645' },
          { label: 'El-Melik', sub: 'Sunduesi', ar: '\u0627\u0644\u0652\u0645\u064e\u0644\u0650\u0643' },
          { label: 'Es-Selam', sub: 'Burimi i Paqes', ar: '\u0627\u0644\u0633\u0651\u064e\u0644\u064e\u0627\u0645' },
          { label: 'El-Gafur', sub: 'Fal\u00ebsi i Madh', ar: '\u0627\u0644\u0652\u063a\u064e\u0641\u064f\u0648\u0631' },
        ],
      },
      {
        type: 'hadith', number: 'Nj\u00eb der\u00eb',
        narrator: 'Transmeton Ebu Hurejra \u2014 Buhariu dhe Muslimi',
        arabic: '\u0625\u0650\u0646\u0651\u064e \u0644\u0650\u0644\u0651\u064e\u0647\u0650 \u062a\u0650\u0633\u0652\u0639\u064e\u0629\u064b \u0648\u064e\u062a\u0650\u0633\u0652\u0639\u0650\u064a\u0646\u064e \u0627\u0633\u0652\u0645\u064b\u0627',
        text: '\u201cAllahu ka n\u00ebnt\u00ebdhjet\u00eb e nënt\u00eb emra \u2014 kush i ruan ato, hyn n\u00eb Xhenet.\u201d',
      },
    ],
  },

  // ───────────────────────── Zekati
  {
    id: 'zakat', num: 'Kapitulli IX', kicker: 'Dh\u00ebnia', nav: 'Zekati',
    title: 'Detyra Pastruese', arabic: '\u0627\u0644\u0632\u0643\u0627\u0629',
    subtitle: 'Shtylla e tret\u00eb', meta: 'E drejta e t\u00eb varf\u00ebrve',
    pages: [
      {
        type: 'prose', dropcap: true, heading: 'Nj\u00eb pjes\u00eb, e pjesa tjet\u00ebr pastrohet',
        paragraphs: [
          'Zekati nuk \u00ebsht\u00eb l\u00ebmosh\u00eb e dh\u00ebn\u00eb sipas qejfit, por nj\u00eb detyrim i borxhuar \u2014 nj\u00eb e drejt\u00eb e caktuar e t\u00eb varf\u00ebrve brenda pasuris\u00eb s\u00eb t\u00eb pasurve. Mbi kursimet e mbajtura p\u00ebr nj\u00eb vit, p\u00ebrtej nj\u00eb pragu modest, jepen dy pjes\u00eb e gjysm\u00eb n\u00eb nj\u00ebqind, dhe me at\u00eb pjes\u00eb t\u00eb vog\u00ebl pastrohet e t\u00ebra.',
          'Vet\u00eb fjala do t\u00eb thot\u00eb edhe past\u00ebrti edhe rritje, sepse ajo q\u00eb jepet nuk humbet. Ajo e pastron z\u00ebmr\u00ebn nga lakmia dhe pasurin\u00eb nga d\u00ebmi, e kthehet e shum\u00ebfishuar n\u00eb m\u00ebnyra q\u00eb regjistri nuk mund t\u2019i tregoj\u00eb.',
        ],
        pullquote: 'Nj\u00eb e drejt\u00eb e caktuar e t\u00eb varf\u00ebrve brenda pasuris\u00eb s\u00eb t\u00eb pasurve.',
      },
      {
        type: 'list', heading: 'Kujt i jepet', kicker: 'Tet\u00eb t\u00eb p\u00ebrmendur n\u00eb Kuran',
        items: [
          { label: 'T\u00eb varf\u00ebrve', sub: 'el-fukar\u00e2' },
          { label: 'Nevojtar\u00ebve', sub: 'el-mes\u00e2kin' },
          { label: 'Udh\u00ebtarit', sub: 'ibn sebil' },
          { label: 'T\u00eb ngarkuarve me borxh', sub: 'el-g\u00e2rimin' },
        ],
      },
    ],
  },

  // ───────────────────────── Hiseja
  {
    id: 'faraid', num: 'Kapitulli X', kicker: 'Drejt\u00ebsia', nav: 'Hiseja',
    title: 'Shkenca e Hiseve', arabic: '\u0639\u0644\u0645 \u0627\u0644\u0641\u0631\u0627\u0626\u0636',
    subtitle: 'Trash\u00ebgimia n\u00eb Islam', meta: 'Faraidi',
    pages: [
      {
        type: 'prose', dropcap: true, heading: 'Ndar\u00eb me dekret hyjnor',
        paragraphs: [
          'Nga t\u00eb gjitha dispozitat e fes\u00eb, ligji i trash\u00ebgimis\u00eb \u00ebsht\u00eb m\u00eb i p\u00ebrpikti. Aty ku familjet kan\u00eb grindur gjithmon\u00eb p\u00ebr at\u00eb q\u00eb l\u00ebn\u00eb t\u00eb vdekurit, Kurani cakton hise t\u00eb prera \u2014 p\u00ebr prindin, bashk\u00ebshortin, vajz\u00ebn dhe djalin \u2014 q\u00eb asnj\u00eb trash\u00ebgimtar t\u00eb mos harrohet e asnj\u00eb t\u00eb mos i b\u00ebhet padrejt\u00ebsi.',
          'Dijetar\u00ebt e quajt\u00ebn \u201cgjysm\u00ebn e t\u00ebr\u00eb dijes\u201d, sepse ai bashkon m\u00ebshir\u00ebn e ligjit me saktas\u00ebsin\u00eb e numrit, dhe e kthen nj\u00eb \u00e7ast pik\u00ebllimi n\u00eb nj\u00eb akt drejt\u00ebsie.',
        ],
        pullquote: 'Nj\u00eb \u00e7ast pik\u00ebllimi, i kthyer n\u00eb akt drejt\u00ebsie.',
      },
      {
        type: 'hadith', number: 'Urdh\u00ebr p\u00ebr t\u00eb m\u00ebsuar',
        narrator: 'Transmeton Ebu Hurejra \u2014 Ibn M\u00e2xhe',
        arabic: '\u062a\u064e\u0639\u064e\u0644\u0651\u064e\u0645\u064f\u0648\u0627 \u0627\u0644\u0652\u0641\u064e\u0631\u064e\u0627\u0626\u0650\u0636\u064e \u0648\u064e\u0639\u064e\u0644\u0651\u0650\u0645\u064f\u0648\u0647\u064e\u0627',
        text: '\u201cM\u00ebsoni ligjet e trash\u00ebgimis\u00eb dhe m\u00ebsojini, sepse ato jan\u00eb gjysma e dijes.\u201d',
      },
    ],
  },

  // ───────────────────────── Datat
  {
    id: 'dates', num: 'Kapitulli XI', kicker: 'Llogaritja', nav: 'Datat',
    title: 'Dy Kalendar\u00eb', arabic: '\u0627\u0644\u062a\u0648\u0627\u0631\u064a\u062e',
    subtitle: 'Hixhri \u2194 Gregorian', meta: 'Dy llogari, nj\u00eb \u00e7ast',
    pages: [
      {
        type: 'prose', dropcap: true, heading: 'Dielli dhe h\u00ebna',
        paragraphs: [
          'Dy kalendar\u00eb mbajn\u00eb koh\u00ebn gjat\u00eb jet\u00ebs s\u00eb besimtarit. Gregoriani ndjek diellin dhe rregullon \u00e7\u00ebshtjet e bot\u00ebs; Hixhri ndjek h\u00ebn\u00ebn dhe sh\u00ebnon stin\u00ebt e adhurimit \u2014 agj\u00ebrimin e Ramazanit, dit\u00ebt e Haxhit, dy Bajramet.',
          'Meq\u00eb viti h\u00ebnor \u00ebsht\u00eb m\u00eb i shkurt\u00ebr p\u00ebr rreth nj\u00ebmb\u00ebdhjet\u00eb dit\u00eb, dy llogarit\u00eb kurr\u00eb nuk p\u00ebrputhen plot\u00ebsisht, dhe nj\u00eb m\u00ebngjes i vetëm mund t\u00eb bart\u00eb dy data nj\u00ebher\u00ebsh. T\u00eb kalosh prej nj\u00ebr\u00ebs n\u00eb tjetr\u00ebn do t\u00eb thot\u00eb t\u00eb mbash edhe bot\u00ebn edhe adhurimin n\u00eb nj\u00eb dor\u00eb.',
        ],
        pullquote: 'Nj\u00eb m\u00ebngjes i vet\u00ebm mund t\u00eb bart\u00eb dy data nj\u00ebher\u00ebsh.',
      },
    ],
  },
];

// Ndërto një libër të vetëm: hyrje + kapituj, plus një përmbajtje.
function buildBook(sections) {
  const pages = [{ type: 'contents' }];
  const toc = [{ id: 'home', n: 1, title: 'Ballina', sub: 'Mir\u00eb se erdhe', page: 0 }];
  let n = 2;
  for (const s of sections) {
    if (pages.length % 2 === 1) pages.push({ type: 'blank' });
    const start = pages.length;
    pages.push({ type: 'chapter', num: s.num, title: s.title, subtitle: s.subtitle, arabic: s.arabic, meta: s.meta });
    for (const p of s.pages) pages.push(Object.assign({}, p, { _section: s.title }));
    toc.push({ id: s.id, n, title: s.nav, sub: s.kicker, page: start });
    n++;
  }
  pages.push({ type: 'colophon', text: 'Dhe me emrin e Tij e mbyllim librin, ashtu si\u00e7 me emrin e Tij e hap\u00ebm.' });
  return { pages, toc };
}

export const SUNNETI_BOOK = buildBook(SECTIONS);
