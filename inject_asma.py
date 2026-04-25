import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

sq_meanings = [
    "Emri me i Madhërishëm — i vetmi që meriton gjithë adhurim dhe devotshmëri.",
    "Ai Meshira e të Cilit përfshin gjithë krijimin në këtë botë.",
    "Ai Meshira e të Cilit e veçantë është rezervuar për besimtarët në Botën Tjetër.",
    "Zotëruesi Sovran që zotëron gjithë krijimin dhe nuk i detyrohet askujt.",
    "Ai që është plotësisht i lirë nga të gjitha të metat, defektet dhe papërsosmëritë.",
    "Ai nga i cili zbret paqja dhe i cili dhuron siguri të vërtetë.",
    "Ai që jep siguri dhe konfirmon robërit e Tij në besim.",
    "Ai që mbikëqyr, ruan dhe mbron gjithë krijimin.",
    "I Papërzishmi i Madhërishëm, i pamposhtur dhe i pamundur të ngadhënjehet.",
    "Ai që detyron, rivendos të thyerin dhe nënshtron gjithçka.",
    "Ai që është Madhërishëm dhe mbi gjithë krijimin e Tij.",
    "Ai që sjell ekzistencën nga joekzistenca.",
    "Ai që krijon qeniet e formuara saktë dhe të përsosura.",
    "Ai që i jep çdo krijimi formën e tij unike dhe dalluese.",
    "Ai që fal vazhdimisht — duke mbuluar mëkatet herë pas here.",
    "Ai që sundon çdo gjë dhe nuk mund të ngadhënjehet.",
    "Ai që jep bujarisht pa pritur asgjë në këmbim.",
    "Ai që siguron gjithë ushqimin — të dukshëm dhe të padukshëm.",
    "Ai që hap gjithçka që është e mbyllur — dyer, zemra dhe fitore.",
    "Ai dija e të Cilit përfshin çdo gjë të dukshme dhe të fshehur.",
    "Ai që ndalon, kufizon dhe merr siç do.",
    "Ai që zgjeron, pasuron dhe hap siç do.",
    "Ai që poshtëron dhe përul kë do.",
    "Ai që ngre dhe nderoi kë do.",
    "Ai që jep nder, dinjitet dhe forcë kë do.",
    "Ai që poshtëron dhe nënshtron të kryelartët dhe të padrejtët.",
    "Ai që dëgjon çdo zë — afër dhe larg, me zë dhe me fshehurazi.",
    "Ai që sheh të gjitha gjërat — të dukshme dhe të fshehura, të mëdha dhe të vogla.",
    "Ai që gjykon midis krijimit me drejtësi absolute.",
    "Ai që është plotësisht i drejtë në të gjitha dekretet dhe gjykimet e Tij.",
    "Ai që është i butë, zemërmirë dhe i ndërgjegjshëm për detajet me të hollë të krijimit.",
    "Ai i plotpajisur me njohuri për të gjitha punët e brendshme dhe hollësitë e fshehura.",
    "Ai që nuk nxiton ndëshkimin pavarësisht se ka fuqi të plotë për ta bërë.",
    "Ai Madhërishëm i suprematisë në të gjitha atributet — përtej çdo kuptimi.",
    "Ai që fal plotësisht mëkatet e të gjithë atyre që pendohen sinqerisht.",
    "Ai që shpërblen shumë edhe veprat e vogla me shpërblim të madh.",
    "Ai i ngritur mbi çdo gjë në thelbin dhe atributet e Tij.",
    "Ai Madhësia e të Cilit është e pafundme dhe përtej çdo kuptimi.",
    "Ai që mbron, ruan dhe kujdes gjithë krijimin e Tij.",
    "Ai që siguron ushqimin dhe ruan jetën për të gjithë.",
    "Ai që llogaris të gjitha veprat dhe është plotësisht i mjaftueshëm.",
    "Ai që zotëron madhështi, shkëlqim dhe supremaci.",
    "Ai që jep bujarisht dhe bollshëm pa marrë parasysh meritën.",
    "Ai që mbikëqyr të gjitha punët e krijimit gjatë gjithë kohës.",
    "Ai që u përgjigjet dhe i pranon çdo lutjeje të sinqertë.",
    "Ai Meshira, dija dhe bujaria e të Cilit janë të pakufishme dhe të pafundme.",
    "Ai Urtësia e të Cilit në krijim dhe dekret është absolutisht e përsosur.",
    "Ai që i do robërit e Tij të drejtë dhe i cili është i dashur nga ata.",
    "Ai Gjithëlavdishëm, që zotëron çdo cilësi të përsosjes dhe nderit.",
    "Ai që ngre krijimin nga vdekja në Ditën e Ringjalljes.",
    "Ai që dëshmon të gjitha gjërat — asgjë nuk i fshihet.",
    "Ai që ekziston vërtet dhe domosdoshmërisht — fjala e të Cilit është e vërteta absolute.",
    "Ai në të cilin vihet besimi i plotë dhe i cili mjafton për të gjitha punët.",
    "Ai që është i përsosur në fuqi — kurrë i dobët apo i lodhur.",
    "Ai Forca dhe Fuqia e të Cilit nuk shpenzohen apo zvogëlohen kurrë.",
    "Ai që është aleat dhe mbrojtës i besimtarëve.",
    "Ai që meriton gjithë lavdërim me thelbin e Tij dhe të gjitha veprimet e Tij.",
    "Ai që numëron dhe regjistron të gjitha gjërat me saktësi të përsosur.",
    "Ai që filloi krijimin nga hiçi, pa precedent.",
    "Ai që do ti rivendosë dhe riketë gjithë krijimin pas vdekjes.",
    "Ai që u jep jetë gjithçkaje që jeton.",
    "Ai që merr shpirtrat e krijimit në kohën e tyre të caktuar.",
    "Ai Jeta e të Cilit nuk ka fillim, fund apo ndërprerje.",
    "Ai nga i cili varet gjithë ekzistenca, ndërkohë që Ai nuk varet nga asgjë.",
    "Ai që gjen dhe percepton gjithçka që dëshiron sipas vullnetit të Tij.",
    "Ai fisnik dhe bujar, plot nder dhe lavdi.",
    "Ai që është unik dhe pa asnjë partner apo të barabartë.",
    "Ai që është absolutisht singular, i pandashëm dhe i pakrahasueshëm.",
    "Ai nga i cili varen të gjithë, por Ai Vetë nuk varet nga asgjë.",
    "Ai që ka fuqi të plotë mbi çdo gjë pa asnjë kufi.",
    "Ai i autoritetit të plotë i cili ekzekuton vullnetin e Tij me fuqi absolute.",
    "Ai që çon përpara dhe jep përparësi kujt dhe çfarë do.",
    "Ai që vonon dhe shtyn prapa kujt dhe çfarë do.",
    "Ai Ekzistenca e të Cilit nuk ka fillim — Ai i paraprin gjithçkaje.",
    "Ai Ekzistenca e të Cilit nuk ka fund — Ai mbetet pas gjithçkaje.",
    "Ai që është i dukshëm dhe evident nëpërmjet shenjave dhe krijimit të Tij.",
    "Ai i fshehur nga shikimi dhe shqisat e gjithë krijimit të Tij.",
    "Ai që qeveris dhe administron të gjitha punët e universit.",
    "Ai i lartë mbi gjithë krijimin dhe çdo përshkrim në Madhërinë e Tij.",
    "Ai që është i pafund në mirësi, i drejtë dhe besnik ndaj të gjitha premtimeve të Tij.",
    "Ai që pranon me gëzim dhe vazhdimisht pendimin e robërve të Tij.",
    "Ai që ndëshkon shtypësit dhe keqbërësit me drejtësi të përsosur.",
    "Ai që fshin plotësisht mëkatet — sikur nuk kanë ndodhur kurrë.",
    "Ai plot dhembshuri dhe butësi të thellë për robërit e Tij.",
    "Ai që zotëron pronësi absolute dhe ekskluzive të gjithë sundimit.",
    "Ai që kombinon në mënyrë unike madhësi supreme me bujarim të pafund.",
    "Ai që është plotësisht i drejtë në të gjitha gjykimet dhe marrëveshjet e Tij.",
    "Ai që do të mbledhë gjithë krijimin në Ditën e Gjykimit.",
    "Ai që nuk ka nevojë absolute për asnjë nga krijimi i Tij.",
    "Ai që pasuron dhe ngop me bujarinë e Tij kë do.",
    "Ai që ndalon dhe mbron — duke vendosur çfarë u arrin robërve të Tij.",
    "Ai që ka fuqi të shkaktojë dëm kur do si pjesë e urtësisë së Tij.",
    "Ai që krijon gjithë dobinë dhe mirësinë për krijimin e Tij siç do.",
    "Ai që është burimi i fundit i gjithë dritës, udhëzimit dhe ndriçimit.",
    "Ai që udhëzon krijimin e Tij drejt rrugës së drejtë dhe diturisë së vërtetë.",
    "Ai që krijoi universin në mënyrë krejt të re dhe të paprecedentë.",
    "Ai që mbetet përgjithmonë kur gjithçka tjetër pushon dhe shkatërrohet.",
    "Ai që trashëgon tokën dhe gjithçka mbi të pasi krijimi mbaron.",
    "Ai që është i pafund në durim — kurrë nuk nxiton ndëshkimin përtej afatit të tij.",
]

asma_start = content.find('const ASMA = [')
asma_end = content.find('\n];\n', asma_start) + 4
asma_block = content[asma_start:asma_end]

en_pattern = re.compile(r'(en:"[^"]*")')
matches = list(en_pattern.finditer(asma_block))
print(f"Found {len(matches)} en fields, have {len(sq_meanings)} sq meanings")

result = asma_block
offset = 0
for i, m in enumerate(matches):
    if i < len(sq_meanings):
        sq_text = sq_meanings[i].replace('"', '\\"')
        insert_pos = m.end() + offset
        insertion = f', sq:"{sq_text}"'
        result = result[:insert_pos] + insertion + result[insert_pos:]
        offset += len(insertion)

content = content[:asma_start] + result + content[asma_end:]
print("ASMA sq fields injected")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
