import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Albanian translations for each dua (matching order in DUAS array)
# Format: (sqTitle, sqEn, sqNote_or_None)
duas_sq = [
  # Morning
  ("Zgjimi nga Gjumi",
   "Gjithë falënderimi i takon Allahut i cili na dha jetë pasi na mori atë, dhe tek Ai është ringjallja.",
   None),
  ("Dhikri i Mëngjesit",
   "Hyrëm në mëngjes dhe sundimi i Allahut hyri me ne; gjithë lavdia i takon Allahut. Nuk ka të adhuruar tjetër me të drejtë pos Allahut, Të Vetmit, pa ortak — Atij i takon sundimi dhe lavdia, Ai mbi çdo gjë është i Fuqishëm.",
   None),
  ("Sayyid el-Istigfar",
   "O Allah, Ti je Zoti im — nuk ka të adhuruar tjetër me të drejtë pos Teje. Ti me krijove dhe unë jam robi Yt, duke qëndruar në besën dhe premtimin Tënd sipas mundësisë sime. Kërkoj strehim tek Ti nga e keqja e asaj që kam bërë. Pranoj mirësinë Tënde ndaj meje dhe pranoj mëkatin tim — pra më fal, sepse askush nuk fal mëkatet përveç Teje.",
   "Kush e thotë me bindje në mëngjes dhe vdes atë ditë hyn në Xhenet. Po ashtu për mbrëmjen. — Bukhāri"),
  ("Mbrojtja e Mëngjesit",
   "Me emrin e Allahut me emrin e të Cilit asgjë nuk dëmton — as në tokë as në qiell — dhe Ai është Dëgjuesi i Gjithëdijshmi.",
   "Recito 3 herë në mëngjes dhe mbrëmje — asgjë nuk do të dëmtojë gjatë asaj dite."),
  # Evening
  ("Dhikri i Mbrëmjes",
   "Hyrëm në mbrëmje dhe sundimi i Allahut hyri me ne; gjithë lavdia i takon Allahut. Nuk ka të adhuruar tjetër me të drejtë pos Allahut, Të Vetmit, pa ortak — Atij i takon sundimi dhe lavdia, Ai mbi çdo gjë është i Fuqishëm.",
   None),
  ("Sayyid el-Istigfar (Mbrëmja)",
   "O Allah, Ti je Zoti im — nuk ka të adhuruar tjetër me të drejtë pos Teje. Ti me krijove dhe unë jam robi Yt, duke qëndruar në besën dhe premtimin Tënd sipas mundësisë sime. Kërkoj strehim tek Ti nga e keqja e asaj që kam bërë. Pranoj mirësinë Tënde ndaj meje dhe pranoj mëkatin tim — pra më fal, sepse askush nuk fal mëkatet përveç Teje.",
   None),
  ("El-Ikhlas, El-Felek, En-Nas",
   "Lexo Suren El-Ikhlas, El-Felek dhe En-Nas — secilën tri herë në mëngjes dhe mbrëmje për mbrojtje të plotë.",
   "Mjaftojnë për çdo gjë. — Ebu Daud"),
  # Prayer
  ("Tesbih, Tehmid, Tekbir",
   "Subhanallah (33×) · Elhamdulilah (33×) · Allahu Ekber (33×). Plotëso 100: 'La ilahe il-Allah uahdehu la sherike leh, lehul-mulku ue lehul-hamdu ue hue ala kul-li shejin kadir.'",
   None),
  ("Ajeti Kursij",
   "Allahu — nuk ka të adhuruar tjetër me të drejtë pos Tij, të Gjallë e të Vetëmbajtësit. Nuk e kap kotsia e as gjumi. I Tij është gjithçka në qiej dhe tokë… Ai është i Larti, Madhërishmi.",
   "Kush e lexon pas çdo namazi — asgjë nuk e pengon të hyjë në Xhenet përveç vdekjes. — Nesai 9928"),
  ("Dua pas Namazit",
   "O Allah, më ndihmo të të kujtoj Ty, të të falënderoj Ty dhe të të adhuroj Ty në mënyrën më të mirë.",
   "Profeti ﷺ ia këshilloi Muadh ibn Xhebelit ta thotë pas çdo namazi."),
  # Meals
  ("Para Ngrënies",
   "Me emrin e Allahut.",
   "Nëse harron, kur ta kujtosh thuaj: 'Bismil-lahi fi evel-lihi ue ahirihi' — Me emrin e Allahut në fillim dhe fund."),
  ("Pas Ngrënies",
   "Gjithë falënderimi i takon Allahut i cili më ushqeu këtë dhe ma siguroi pa asnjë fuqi e forcë nga ana ime.",
   "Do ti falen mëkatet e kaluara. — Tirmidhi"),
  ("Kur Ftoheris në Darkë",
   "O Allah, ushqeje atë që me ushqeu dhe jepi të pijë atij që me dha të pija.",
   None),
  # Home
  ("Hyrja në Shtëpi",
   "Me emrin e Allahut hyrëm, me emrin e Allahut dolëm, dhe tek Zoti ynë mbështetemi.",
   None),
  ("Dalja nga Shtëpia",
   "Me emrin e Allahut, u mbështeta tek Allahu, dhe nuk ka fuqi e force vetëm se me Allahun.",
   "Do ti thuhet: 'Ti je i udhëzuar, i mbrojtur dhe i ruajtur.' Djalli nuk do ti afrohet. — Ebu Daud"),
  # Sleep
  ("Para Gjumit",
   "Me emrin Tënd, o Allah, vdes dhe jetoj.",
   None),
  ("Mbrojtja Para Gjumit",
   "O Allah, ruaj ma nga dënimi Yt ditën kur do t'i ringjallësh robërit e Tu.",
   "Thuaje 3 herë kur shtrihesh mbi anën e djathtë."),
  ("Tesbih Para Gjumit",
   "Subhanallah 33 herë, Elhamdulilah 33 herë, Allahu Ekber 34 herë — para gjumit.",
   "Kjo është me e mirë për ty sesa një shërbëtor. — Bukhāri"),
  # Travel
  ("Hyrja në Mjet",
   "Lëvduar qoftë Ai i Cili na e nënshtroi këtë — ne nuk do të kishim mundur ta ndoshim vetë — dhe me të vërtetë ne tek Zoti ynë do të kthehemi.",
   None),
  ("Dua për Udhëtim",
   "O Allah, ne po të lusim në këtë udhëtim tonin për mirësi dhe devotshmëri, dhe vepra që Ti i ke të kënaqura. O Allah, lehtësoje udhëtimin tonë dhe shkurtoje distancën e tij. O Allah, Ti je shoku në udhëtim dhe kujdestari i familjes.",
   None),
  # Protection
  ("Kundër Syrit të Keq",
   "Kërkoj strehim tek fjalët e Allahut të plota nga çdo djall dhe krijesë e dëmshme, dhe nga çdo sy i keq.",
   "Profeti ﷺ e lexonte për Hasanin dhe Husejnin me këto fjalë."),
  ("Mburojë Mëngjesi e Mbrëmje",
   "Më mjafton Allahu — nuk ka të adhuruar tjetër me të drejtë pos Tij. Tek Ai u mbështeta dhe Ai është Zoti i Arshit të Madhërishëm.",
   "Mjafton për atë që e thotë 7 herë në mëngjes dhe mbrëmje. — Ebu Daud"),
  ("Strehim nga Katër Gjëra",
   "O Allah, kërkoj strehim tek Ti nga pikëllimi dhe trishtimi, nga paaftësia dhe përtacia, nga frika dhe kopracia, dhe nga barrësia e borxhit dhe sundimi i njerëzve.",
   None),
  # Distress
  ("Dua e Profetit Junus ﷺ",
   "Nuk ka të adhuruar tjetër me të drejtë pos Teje — lëvduar qoftë Ti! Me të vërtetë unë qeshë nga të padrejtët.",
   "Asnjë musliman nuk i lutet Allahut me këto fjalë në asnjë çështje vetëm se Allahu i përgjigjet. — Tirmidhi"),
  ("Dua për Ankth dhe Trishtim",
   "O Allah, unë jam robi Yt dhe biri i robit Tënd dhe i robëreshës Tënde. Balli im është në dorën Tënde… të lutem me çdo emër që Ti e ke — ta bësh Kuranin pranverën e zemrës sime, dritën e gjoksit tim, largimin e trishtimit tim dhe heqjen e brengës sime.",
   "Allahu do ta largojë pikëllimin dhe trishtimin e tij dhe do ta zëvendësojë me gëzim. — Ahmad"),
  ("Dua kur Rëndon Barra",
   "Na mjafton Allahu dhe sa i mrekullueshëm është Kujdestari.",
   "Kjo ishte fjala e Ibrahimit ﷺ kur u hodh në zjarr, dhe e Muhamedit ﷺ kur iu tregua se një ushtri e madhe ishte mbledhur kundër tij."),
  # General
  ("Istigfar",
   "I kërkoj falje Allahut — nuk ka të adhuruar tjetër me të drejtë pos Tij, të Gjallë e të Vetëmbajtësit — dhe kthehem tek Ai me pendim.",
   "Mëkatet do ti falen edhe nëse do të ishin si shkuma e detit. — Ebu Daud"),
  ("Salavati mbi Profetin ﷺ",
   "O Allah, dërgo bekime mbi Muhamedin dhe mbi familjen e Muhamedit siç dërgove bekime mbi Ibrahimin dhe mbi familjen e Ibrahimit. Me të vërtetë, Ti je i Lavdëruari, i Nderuari.",
   None),
  ("Për Prindërit",
   "Zoti im, më fal mua dhe prindërit e mi dhe atë që hyn në shtëpinë time si besimtar, dhe të gjithë besimtarët dhe besimtaret.",
   None),
  ("Mirësia në Dy Botë",
   "Zoti ynë, na jep mirësi në këtë botë dhe mirësi në Botën Tjetër, dhe na ruaj nga dënimi i Zjarrit.",
   "Profeti ﷺ lutej me këtë me shpesh. — Bukhāri"),
  ("Për Dije",
   "Zoti im, më shto dituri.",
   None),
  ("Për Udhëzim dhe Qëndrueshmëri",
   "O Allah, udhëzomëni dhe bëni mëi vendosur.",
   None),
]

# Find DUAS array
duas_start = content.find('const DUAS = [')
duas_end = content.find('\n];\n', duas_start) + 4
duas_block = content[duas_start:duas_end]

# Find each dua entry - they end with src:"..." or note:"..." followed by }
# We'll inject sqTitle and sq after the 'en:' field
en_pattern = re.compile(r'(    en:"[^"]*(?:\\.[^"]*)*")')
matches = list(en_pattern.finditer(duas_block))
print(f"Found {len(matches)} dua en fields, have {len(duas_sq)} translations")

result = duas_block
offset = 0
for i, m in enumerate(matches):
    if i < len(duas_sq):
        sq_title, sq_en, sq_note = duas_sq[i]
        sq_title = sq_title.replace('"', '\\"')
        sq_en = sq_en.replace('"', '\\"')
        insert_pos = m.end() + offset
        parts = [f'\n    sqTitle:"{sq_title}"', f'\n    sq:"{sq_en}"']
        if sq_note:
            parts.append(f'\n    sqNote:"{sq_note.replace(chr(34), chr(92)+chr(34))}"')
        insertion = ','.join([''] + parts)  # leads with comma
        # Actually we want comma after m.end()
        insertion = ',' + '\n    sqTitle:"' + sq_title + '"' + ', sq:"' + sq_en + '"'
        if sq_note:
            sq_note_esc = sq_note.replace('"', '\\"')
            insertion += f', sqNote:"{sq_note_esc}"'
        result = result[:insert_pos] + insertion + result[insert_pos:]
        offset += len(insertion)

content = content[:duas_start] + result + content[duas_end:]
print("DUAS sq fields injected")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
