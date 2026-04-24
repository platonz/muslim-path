import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import { BG, SURFACE, BORDER, GREEN, GREEN_L, GOLD, TEXT, MUTED, SERIF, SANS } from "./constants";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dhikr from "./components/Dhikr";
import Profile from "./components/Profile";
import Icon from "./components/Icon";
import KaabaWatermark from "./components/KaabaWatermark";
import MobileTabBar from "./components/MobileTabBar";

// ─── QUOTES ────────────────────────────────────────────────────────
const QUOTES = [
  // ── HADITHS ──────────────────────────────────────────────────────
  { text: "The best of people are those most beneficial to people.", src: "al-Tabarani", sq:"Njerëzit më të mirë janë ata që u sjellin dobi më të madhe njerëzve.", ref: "al-Mu'jam al-Awsat 5787" },
  { text: "Speak good or remain silent.", src: "Bukhari & Muslim", sq:"Thuaj mirë ose hesht.", ref: "Bukhari 6018 · Muslim 47" },
  { text: "He who does not thank people does not thank Allah.", src: "Abu Dawud", sq:"Ai që nuk u falënderon njerëzve, nuk i falënderohet as Allahut.", ref: "Abu Dawud 4811" },
  { text: "Take advantage of five before five: youth, health, wealth, free time, and life.", src: "Shu'ab al-Iman", sq:"Përfito nga pesë gjëra para pesë të tjera: rinia, shëndeti, pasuria, koha e lirë dhe jeta.", ref: "Shu'ab al-Iman 9575" },
  { text: "Allah does not look at your appearance or wealth, but at your hearts and deeds.", src: "Muslim", sq:"Allahu nuk shikon pamjen tuaj apo pasurinë tuaj, por shikon zemrat dhe veprat tuaja.", ref: "Muslim 2564" },
  { text: "The strongest among you is the one who controls his anger.", src: "Bukhari", sq:"Më i forti ndër ju është ai që kontrollon zemëratën e tij.", ref: "Bukhari 6114" },
  { text: "Do not waste water even if you are on a flowing river.", src: "Ibn Majah", sq:"Mos shpërdoro ujin edhe nëse je pranë lumit.", ref: "Ibn Majah 425" },
  { text: "A Muslim is one from whose tongue and hands other Muslims are safe.", src: "Bukhari", sq:"Muslimani është ai nga gjuha dhe dora e të cilit janë të sigurt muslimanët e tjerë.", ref: "Bukhari 10" },
  { text: "Make things easy, do not make them difficult. Give glad tidings, do not repel.", src: "Bukhari", sq:"Lehtësoni, mos vështirësoni. Jepni lajme të gëzueshme, mos largoni njerëzit.", ref: "Bukhari 69" },
  { text: "Whoever is patient, Allah will make him patient. No one is given a better gift than patience.", src: "Bukhari", sq:"Kush bën durim, Allahu e bën të durueshëm. Askujt nuk i është dhënë dhuratë më e mirë sesa durimi.", ref: "Bukhari 1469" },
  { text: "The cure for ignorance is to question.", src: "Abu Dawud", sq:"Ilaçi i injorancës është pyetja.", ref: "Abu Dawud 336" },
  { text: "Feed the hungry, visit the sick, and free the captive.", src: "Bukhari", sq:"Ushqejeni të uriurin, vizitoni të sëmurin dhe çlironi të robëruarin.", ref: "Bukhari 5373" },
  { text: "None of you truly believes until he loves for his brother what he loves for himself.", src: "Bukhari & Muslim", sq:"Asnjë nga ju nuk beson me të vërtetë, deri sa të dojë për vëllain e tij atë çfarë do për veten e tij.", ref: "Bukhari 13 · Muslim 45" },
  { text: "Smiling at your brother is charity.", src: "Tirmidhi", sq:"Buzëqeshja ndaj vëllait tënd është sadaka.", ref: "Tirmidhi 1956" },
  { text: "The world is a prison for the believer and a paradise for the disbeliever.", src: "Muslim", sq:"Bota është burg për besimtarin dhe parajsë për jobesimtarin.", ref: "Muslim 2956" },
  { text: "Actions are judged by intentions, and every person will get the reward according to what he intended.", src: "Bukhari & Muslim", sq:"Veprat gjykohen sipas qëllimeve, dhe çdo njeri do të marrë atë që ka pasur qëllim.", ref: "Bukhari 1 · Muslim 1907" },
  { text: "The most beloved of deeds to Allah are those done consistently, even if they are small.", src: "Bukhari & Muslim", sq:"Veprat më të dashura tek Allahu janë ato që bëhen rregullisht, edhe nëse janë të vogla.", ref: "Bukhari 6464 · Muslim 782" },
  { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", src: "Bukhari & Muslim", sq:"Kush beson në Allahun dhe Ditën e Fundit, le të thotë mirë ose le të heshtë.", ref: "Bukhari 6018" },
  { text: "Cleanliness is half of faith.", src: "Muslim", sq:"Pastërtia është gjysma e besimit.", ref: "Muslim 223" },
  { text: "Tie your camel, then put your trust in Allah.", src: "Tirmidhi", sq:"Lidhe devenë, pastaj mbështetu tek Allahu.", ref: "Tirmidhi 2517" },
  { text: "The best charity is that given when you are healthy and hopeful, fearing poverty and hoping for wealth.", src: "Bukhari", sq:"Sadakaja më e mirë është ajo që jepet kur je shëndetshëm dhe shpresëplotë, duke u frikësuar nga varfëria dhe shpresuar pasuri.", ref: "Bukhari 1419" },
  { text: "Do not belittle any act of kindness, even meeting your brother with a cheerful face.", src: "Muslim", sq:"Mos e nënvlerëso asnjë vepër të mirë, madje edhe takimin e vëllait tënd me fytyrë të qeshur.", ref: "Muslim 2626" },
  { text: "The merciful are shown mercy by the Most Merciful. Have mercy on those on earth, and He who is in the heaven will have mercy on you.", src: "Abu Dawud & Tirmidhi", sq:"Të mëshirshmëve u tregohet mëshirë nga Mëshiruesi. Kini mëshirë ndaj atyre në tokë, dhe Ai në qiell do t'ju tregojë mëshirë.", ref: "Abu Dawud 4941 · Tirmidhi 1924" },
  { text: "The best of you are those who learn the Quran and teach it.", src: "Bukhari", sq:"Më i mirë ndër ju është ai që mëson Kuranin dhe ua mëson të tjerëve.", ref: "Bukhari 5027" },
  { text: "Whoever is not grateful to people is not grateful to Allah.", src: "Abu Dawud & Tirmidhi", sq:"Kush nuk është mirënjohës ndaj njerëzve, nuk është mirënjohës ndaj Allahut.", ref: "Abu Dawud 4811" },
  { text: "Make use of five before five: your youth before old age, your health before sickness, your wealth before poverty, your free time before preoccupation, and your life before death.", src: "al-Hakim", sq:"Përfito nga pesë para pesë: rinia jote para pleqërisë, shëndeti para sëmundjes, pasuria para varfërisë, koha e lirë para angazhimeve dhe jeta para vdekjes.", ref: "al-Mustadrak 7846" },
  { text: "There is no disease that Allah has created except that He also has created its remedy.", src: "Bukhari", sq:"Nuk ka sëmundje që Allahu e ka krijuar, vetëm se ka krijuar edhe ilaçin e saj.", ref: "Bukhari 5678" },
  { text: "The most complete of the believers in faith are those with the best character.", src: "Abu Dawud & Tirmidhi", sq:"Besimtarët me besimin më të plotë janë ata me karakterin më të mirë.", ref: "Abu Dawud 4682 · Tirmidhi 1162" },
  { text: "Whoever removes a worldly hardship from a believer, Allah will remove from him one of the hardships of the Day of Resurrection.", src: "Muslim", sq:"Kush i heq një vështirësi besimtarit në këtë botë, Allahu do t'i heqë një nga vështirësitë e Ditës së Ringjalljes.", ref: "Muslim 2699" },
  { text: "Say: 'I believe in Allah,' then be steadfast.", src: "Muslim", sq:"Thuaj: 'Besoj në Allahun,' pastaj qëndro i qëndrueshëm.", ref: "Muslim 38" },
  { text: "The upper hand is better than the lower hand. The upper hand is the one that gives, and the lower hand is the one that takes.", src: "Bukhari & Muslim", sq:"Dora e sipërme është më e mirë se dora e poshtme. Dora e sipërme është ajo që jep, dhe dora e poshtme është ajo që merr.", ref: "Bukhari 1429 · Muslim 1033" },
  { text: "Verily, gentleness does not enter anything but it adorns it, and it is not removed from anything but it disgraces it.", src: "Muslim", sq:"Me të vërtetë, butësia nuk hyn në asgjë pa e zbukuruar, dhe nuk hiqet nga asgjë pa e shëmtuar.", ref: "Muslim 2594" },
  { text: "The right of the road is to lower your gaze, return greetings, and enjoin good and forbid evil.", src: "Bukhari & Muslim", sq:"E drejta e rrugës është: uleni shikimin, kthejini selamin, urdhërojeni të mirën dhe ndalojeni të keqen.", ref: "Bukhari 2465 · Muslim 2121" },
  { text: "He is not a believer whose neighbor is not safe from his harm.", src: "Bukhari & Muslim", sq:"Nuk është besimtar ai nga dëmi i të cilit nuk është i sigurt fqinji.", ref: "Bukhari 6016 · Muslim 46" },
  { text: "Visit the sick, feed the hungry, and free the captive — for in these acts there is great virtue.", src: "Bukhari", sq:"Vizitoni të sëmurin, ushqejeni të uriurin dhe çlironi të robëruarin — sepse në këto vepra ka virtyt të madh.", ref: "Bukhari 5649" },
  { text: "Whoever conceals the faults of a Muslim, Allah will conceal his faults on the Day of Judgment.", src: "Muslim", sq:"Kush i mbulon të metat e një muslimani, Allahu do t'i mbulojë të metat e tij në Ditën e Gjykimit.", ref: "Muslim 2699" },
  { text: "The best house among the Muslims is one where an orphan is treated well.", src: "Ibn Majah", sq:"Shtëpia më e mirë ndër myslimanët është ajo ku jetimi trajtohet mirë.", ref: "Ibn Majah 3679" },
  { text: "Beware of envy, for envy devours good deeds just as fire devours wood.", src: "Abu Dawud", sq:"Ruajuni smirës, sepse smira i gllabëron veprat e mira ashtu si zjarri gllabëron drurin.", ref: "Abu Dawud 4903" },
  { text: "Do not be people without minds of your own, saying that if others treat you well you will treat them well, and that if they do wrong you will do wrong. Instead, accustom yourselves to do good if people do good and not to do wrong if people do evil.", src: "Tirmidhi", sq:"Mos u bëni njerëz pa mendjet tuaja, duke thënë: nëse njerëzit bëjnë mirë, edhe ne bëjmë mirë. Mësohuni të bëni mirë nëse njerëzit bëjnë mirë, dhe të mos bëni keq nëse bëjnë keq.", ref: "Tirmidhi 2007" },
  { text: "Modesty brings nothing except good.", src: "Bukhari & Muslim", sq:"Turpi nuk sjell gjë tjetër veçse të mira.", ref: "Bukhari 6117 · Muslim 37" },
  { text: "The most burdensome prayers for the hypocrites are Isha and Fajr, yet if they knew what these contain they would come even if crawling.", src: "Bukhari & Muslim", sq:"Namazet më të rënda për munafikët janë Jacia dhe Sabahu. Por sikur të dinin çfarë shpërblimi kanë, do të vinin edhe duke u zvarritur.", ref: "Bukhari 657 · Muslim 651" },
  { text: "Whoever guides someone to goodness will have a reward like the one who did it.", src: "Muslim", sq:"Kush udhëzon dikë drejt të mirës do të ketë shpërblim si ai që e bëri.", ref: "Muslim 1893" },
  { text: "The prayer is a light, charity is a proof, patience is an illumination, and the Quran is an argument for or against you.", src: "Muslim", sq:"Namazi është dritë, sadakaja është provë, durimi është ndriçim dhe Kurani është argument për ose kundër jush.", ref: "Muslim 223" },
  { text: "A good word is charity.", src: "Bukhari & Muslim", sq:"Një fjalë e mirë është sadaka.", ref: "Bukhari 2989 · Muslim 1009" },
  { text: "The most beloved people to Allah are those who are most beneficial to people, and the most beloved of deeds to Allah is happiness you bring to a Muslim.", src: "al-Tabarani", sq:"Njerëzit më të dashur tek Allahu janë ata me dobi më të madhe për njerëzit, dhe veprat më të dashura tek Allahu janë gëzimi që i sjell një muslimani.", ref: "al-Mu'jam al-Awsat 6192" },
  { text: "Every act of kindness is charity.", src: "Bukhari & Muslim", sq:"Çdo vepër e mirë është sadaka.", ref: "Bukhari 2989 · Muslim 1005" },
  { text: "Perform the prayer before you die, and fast the month of Ramadan and give Zakat on your wealth — it purifies you.", src: "Ahmad", sq:"Fale namazin para se të vdesësh, agjëro muajin e Ramazanit dhe jep zeqatin e pasurisë sate — ai të pastron.", ref: "Ahmad 22387" },
  { text: "Seek knowledge from the cradle to the grave.", src: "Traditional saying", sq:"Kërkoje diturinë nga djepi deri në varr." },
  { text: "The ink of the scholar is more sacred than the blood of the martyr.", src: "Traditional saying", sq:"Boja e dijetarit është më e shenjtë se gjaku i dëshmorit." },
  { text: "The believer does not slander, curse, speak obscenely, or behave indecently.", src: "Tirmidhi", sq:"Besimtari nuk shpif, nuk mallkon, nuk flet të paturpshme dhe nuk sillet pa dinjitet.", ref: "Tirmidhi 1977" },
  { text: "Whoever loves to meet Allah, Allah loves to meet him.", src: "Bukhari & Muslim", sq:"Kush dëshiron të takojë Allahun, Allahu dëshiron ta takojë atë.", ref: "Bukhari 6507 · Muslim 2683" },
  { text: "The best of your leaders are those you love and who love you, who pray for you and you pray for them.", src: "Muslim", sq:"Më të mirët e udhëheqësve tuaj janë ata që i doni dhe ju duan, që luten për ju dhe ju luteni për ta.", ref: "Muslim 1855" },
  { text: "Richness is not having many possessions, but richness is being content with oneself.", src: "Bukhari & Muslim", sq:"Pasuria nuk është në shumësinë e gjërave, por pasuria e vërtetë është kënaqësia e shpirtit.", ref: "Bukhari 6446 · Muslim 1051" },
  { text: "The Muslim who mixes with people and bears their harm with patience is better than the one who does not mix with people.", src: "Ibn Majah & Tirmidhi", sq:"Muslimani që shoqërohet me njerëzit dhe duron dëmin e tyre është më i mirë se ai që nuk shoqërohet me ta.", ref: "Ibn Majah 4032 · Tirmidhi 2507" },
  { text: "Make things easy for people and do not make things difficult. Bring good tidings and do not make people flee.", src: "Bukhari", sq:"Lehtësojini gjërat njerëzve dhe mos i vështirësoni. Jepuni lajme të gëzueshme dhe mos i bëni të largohen.", ref: "Bukhari 6125" },
  { text: "Verily Allah is kind and gentle, and loves kindness in all affairs.", src: "Bukhari & Muslim", sq:"Me të vërtetë Allahu është i butë dhe i dashur, dhe e do butësinë në të gjitha çështjet.", ref: "Bukhari 6927 · Muslim 2593" },
  { text: "The best among you are those who have the best manners and character.", src: "Bukhari", sq:"Më i mirë ndër ju është ai me sjelljen dhe karakterin më të mirë.", ref: "Bukhari 3559" },
  { text: "Whoever has faith the size of a mustard seed in his heart shall be taken out of the Fire.", src: "Bukhari & Muslim", sq:"Kush ka besim sa një kokërr sinapi në zemrën e tij, do të dalë nga zjarri.", ref: "Bukhari 44 · Muslim 193" },
  { text: "The deen (religion) is easy. Whoever makes it too hard for himself will be overpowered, so direct yourselves to what is right.", src: "Bukhari", sq:"Feja është e lehtë. Kush e bën të vështirë për veten, do të mposhtet. Prandaj ecni në drejtim të drejtë.", ref: "Bukhari 39" },

  // ── QURAN VERSES ─────────────────────────────────────────────────
  { text: "Indeed, with hardship will be ease.", src: "Quran 94:6", sq:"Me të vërtetë, me vështirësinë vjen lehtësia." },
  { text: "Allah does not burden a soul beyond that it can bear.", src: "Quran 2:286", sq:"Allahu nuk ngarkon asnjë shpirt përtej mundësive të tij." },
  { text: "We have not sent you except as a mercy to the worlds.", src: "Quran 21:107", sq:"Ne të kemi dërguar vetëm si mëshirë për të gjitha botët." },
  { text: "So remember Me; I will remember you.", src: "Quran 2:152", sq:"Kujtomëni Mua; edhe Unë do t'ju kujtoj." },
  { text: "Indeed the most noble of you in the sight of Allah is the most righteous.", src: "Quran 49:13", sq:"Me të vërtetë, më i nderuari ndër ju tek Allahu është ai me devotshmërinë më të madhe." },
  { text: "And He found you lost and guided you.", src: "Quran 93:7", sq:"Dhe Ai të gjeti të humbur e të udhëzoi." },
  { text: "And when My servants ask you about Me — indeed I am near.", src: "Quran 2:186", sq:"Kur robërit e Mi të pyesin për Mua — me të vërtetë Unë jam afër." },
  { text: "Verily, after difficulty there is relief.", src: "Quran 94:5", sq:"Me të vërtetë, pas vështirësisë vjen lehtësia." },
  { text: "Your Lord has not taken leave of you, nor has He detested you.", src: "Quran 93:3", sq:"Zoti yt nuk të ka lënë e as nuk të urren." },
  { text: "And your Lord is the Forgiving, Full of Mercy.", src: "Quran 18:58", sq:"Zoti yt është i Falshmi, Mëshirëploti." },
  { text: "And whoever relies upon Allah — then He is sufficient for him.", src: "Quran 65:3", sq:"Kush mbështetet tek Allahu — Ai i mjafton atij." },
  { text: "Do not lose hope in the mercy of Allah. Indeed, Allah forgives all sins.", src: "Quran 39:53", sq:"Mos e humbni shpresën ndaj mëshirës së Allahut. Me të vërtetë, Allahu i fal të gjitha mëkatet." },
  { text: "And He is with you wherever you are.", src: "Quran 57:4", sq:"Dhe Ai është me ju kudo që të jeni." },
  { text: "Indeed, Allah is with the patient.", src: "Quran 2:153", sq:"Me të vërtetë, Allahu është me të duruarit." },
  { text: "And do good; indeed, Allah loves the doers of good.", src: "Quran 2:195", sq:"Dhe bëni mirë; me të vërtetë, Allahu i do bamirësit." },
  { text: "Call upon Me; I will respond to you.", src: "Quran 40:60", sq:"Lutmuni Mua; Unë do t'ju përgjigjem." },
  { text: "And whoever fears Allah — He will make for him a way out, and will provide for him from where he does not expect.", src: "Quran 65:2-3", sq:"Kush i frikësohet Allahut — Ai do t'i gjejë rrugëdalje dhe do t'i japë rizk nga s'e pret." },
  { text: "And We have certainly honored the children of Adam.", src: "Quran 17:70", sq:"Dhe me të vërtetë Ne i kemi nderuar bijtë e Ademit." },
  { text: "So which of the favors of your Lord would you deny?", src: "Quran 55:13", sq:"Pra, cilin prej mirësive të Zotit tuaj do ta mohoni?" },
  { text: "Indeed, to Allah we belong and to Him we shall return.", src: "Quran 2:156", sq:"Me të vërtetë, ne i takojmë Allahut dhe tek Ai do të kthehemi." },
  { text: "Allah intends for you ease and does not intend for you hardship.", src: "Quran 2:185", sq:"Allahu dëshiron për ju lehtësi dhe nuk dëshiron vështirësi." },
  { text: "My mercy encompasses all things.", src: "Quran 7:156", sq:"Mëshira Ime përfshin çdo gjë." },
  { text: "And He found you in need and made you self-sufficient.", src: "Quran 93:8", sq:"Dhe të gjeti nevojtar e të bëri të pasur." },
  { text: "Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.", src: "Quran 29:45", sq:"Me të vërtetë, namazi largon nga të shëmtuarat dhe të këqijat, dhe përmendja e Allahut është më e madhja." },
  { text: "Establish prayer and give zakah, and whatever good you put forward for yourselves — you will find it with Allah.", src: "Quran 2:110", sq:"Falni namazin dhe jepni zeqatin, dhe çfarëdo të mirë që dërgoni për veten tuaj — do ta gjeni tek Allahu." },
  { text: "And speak to people good words.", src: "Quran 2:83", sq:"Dhe u thoni njerëzve fjalë të mira." },
  { text: "Your God is one God, so to Him submit.", src: "Quran 22:34", sq:"Zoti juaj është një Zot, prandaj vetëm Atij nënshtrojuni." },
  { text: "Whoever does righteousness, whether male or female, while he is a believer — We will give him a good life.", src: "Quran 16:97", sq:"Kush bën vepra të mira, qoftë mashkull apo femër, duke qenë besimtar — Ne do t'i japim një jetë të mirë." },
  { text: "And be patient, for indeed, Allah does not allow to be lost the reward of those who do good.", src: "Quran 11:115", sq:"Dhe bëhu i durueshëm, sepse me të vërtetë Allahu nuk e humb shpërblimin e bamirësve." },
  { text: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.", src: "Quran 2:153", sq:"O ju që besuat, kërkoni ndihmë me durim dhe namaz. Me të vërtetë, Allahu është me të duruarit." },
  { text: "And He is the Forgiving, the Affectionate.", src: "Quran 85:14", sq:"Dhe Ai është Falësi, i Dashuri." },
  { text: "Allah is the ally of those who believe. He brings them out from darknesses into the light.", src: "Quran 2:257", sq:"Allahu është mbrojtësi i besimtarëve. Ai i nxjerr ata nga errësirat në dritë." },
  { text: "And We created you in pairs.", src: "Quran 78:8", sq:"Dhe Ne ju krijuam në çifte." },
  { text: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them.", src: "Quran 30:21", sq:"Dhe nga shenjat e Tij është se krijoi për ju nga vetë ju bashkëshortë që të gjeni qetësi tek ata." },
  { text: "Indeed, the men who practice charity and the women who practice charity and have loaned Allah a goodly loan — it will be multiplied for them.", src: "Quran 57:18", sq:"Me të vërtetë, burrat dhe gratë që japin sadaka dhe kanë dhënë hua Allahut njëhua të mirë — do t'u shumëfishohet." },
  { text: "And He taught Adam the names of all things.", src: "Quran 2:31", sq:"Dhe Ai i mësoi Ademit emrat e të gjitha gjërave." },
  { text: "Read in the name of your Lord who created.", src: "Quran 96:1", sq:"Lexo në emrin e Zotit tënd që krijoi." },
  { text: "And it may be that you dislike a thing which is good for you and that you like a thing which is bad for you. Allah knows but you do not know.", src: "Quran 2:216", sq:"Ndoshta ju nuk e pëlqeni diçka, ndërkohë ajo është e mirë për ju; dhe ndoshta ju e doni diçka, ndërkohë ajo është e dëmshme. Allahu di, ndërsa ju nuk dini." },
  { text: "Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.", src: "Quran 13:28", sq:"Ata që besuan dhe zemrat e tyre qetësohen me përmendjen e Allahut. Vini re, me përmendjen e Allahut zemrat qetësohen." },
];

// ─── LIBRARY ──────────────────────────────────────────────────────
const LIBRARY = [
  // Quran & Translation
  { title: "Quran.com", author: "Multiple translations & audio", cat: "Quran", url: "https://quran.com" },
  { title: "The Clear Quran", author: "Dr. Mustafa Khattab", cat: "Quran", url: "https://theclearquran.org" },
  // Tafsir
  { title: "Tafheem ul-Quran", author: "Abul Ala Maududi", cat: "Tafsir", url: "https://www.tafheem.net" },
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
  // Dua & Dhikr
  { title: "Fortress of the Muslim (Hisnul Muslim)", author: "Said bin Ali al-Qahtani", cat: "Dua & Dhikr", url: "https://islamicstudies.info" },
  // Online Resources
  { title: "IslamQA", author: "Sheikh Muhammad Saalih al-Munajjid", cat: "Online", url: "https://islamqa.info" },
  { title: "SeekersGuidance", author: "Online Islamic education", cat: "Online", url: "https://seekersguidance.org" },
  { title: "Yaqeen Institute", author: "Research & publications", cat: "Online", url: "https://yaqeeninstitute.org" },
  { title: "Muslim Central", author: "Lectures & audio", cat: "Online", url: "https://muslimcentral.com" },
  { title: "1000 Duas", author: "Comprehensive dua resource", cat: "Online", url: "https://1000duas.com" },
  { title: "Duaa.app", author: "Daily supplications", cat: "Online", url: "https://duaa.app" },

  // Albanian / Shqip
  { title: "10 Sfidat e Jetës", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/10-sfidat-e-jetes.pdf" },
  { title: "99 Emrat e Allahut", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/99Names-2019.pdf" },
  { title: "Kush është Profeti Muhamed ﷺ", author: "AIITC", cat: "Shqip", url: "https://cdn.muslimspath.app/books/AIITC-Ky-eshte-profeti-Muhamed-a.s..pdf" },
  { title: "Madhërimi i Allahut", author: "Abdulaziz et-Tarifi", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Abdulaziz-et-Tarifi-Madherimi-i-Allahut.pdf" },
  { title: "Gjykimi ndaj Magjisë dhe Fallit", author: "Abdulaziz ibn Baz", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Abdulaziz-ibn-Baz-Gjykimi-ndaj-magjes-dhe-fallit.pdf" },
  { title: "Mbi Rrugën e të Parëve Tanë", author: "Abdulkadër Arnauti", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Abdulkader-Arnauti-Mbi-rrugën-e-te-pareve-tane-selefit.pdf" },
  { title: "Sahih el-Bukhari — Vëllimi 1", author: "Mehdi Polisi", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Mehdi-Polisi-Sahih-el-Bukhari-Vellimi-01.pdf" },
  { title: "Sahih el-Bukhari — Vëllimi 2", author: "Abdullah Hamiti", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Abdullah-Hamiti-Sahih-el-Bukhari-Vellimi-02.pdf" },
  { title: "Këshilla të Arta për Morale të Larta", author: "Abdulmelik Ramadani", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Abdulmelik-Ramadani-Keshilla-te-arta.pdf" },
  { title: "Rregulla rreth Tekfirit", author: "Abdulmunim Mustafa Halime", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Abdulmunim-Mustafa-Halime-Rregulla-rreth-tekfirit.pdf" },
  { title: "Realiteti i Besimit të Vërtetë", author: "Abdurrahman es-Sadij", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Abdurrahman-es-Sadij-Realiteti-i-Besimit-te-Vertete.pdf" },
  { title: "Hallalli dhe Harami në Islam", author: "Dr. Jusuf Kardavi", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Dr.-Jusuf-Kardavi-Hallalli-dhe-harami-me-balline.pdf" },
  { title: "Kandili i Ramazanit", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/KANDILI-I-RAMAZANIT.pdf" },
  { title: "Kurani dhe Shkenca", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Kurani-drejt-shkences-me-kopertine.pdf" },
  { title: "Libri i Agjërimit", author: "Salih ibn Feuzan", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Libri-i-Agjerimit-Salih-ibn-Feuzan-el-Feuzan-1.pdf" },
  { title: "Forma e Namazit të të Dërguarit ﷺ", author: "Imam Albani", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Muhammed-Nasiruddin-el-Albani-Forma-e-namazit-te-te-derguarit.pdf" },
  { title: "Namazi i Natës — Teravitë në Ramazan", author: "Imam Albani", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Namazi-i-nates-teravite-ne-Ramazan-Imam-Albani.pdf" },
  { title: "Ndejat e Muajit Ramazan", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Ndejat-e-Muajit-Ramazan.pdf" },
  { title: "Pozita e Synetit në Islam", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/POZITA-E-SYNETIT-NE-ISLAM-ok.pdf" },
  { title: "Përmendja — Dhikri dhe Lutjet", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Permendja-finalja.pdf" },
  { title: "Emrat dhe Cilësitë e Allahut", author: "Xhamia Mbret Fahd", cat: "Shqip", url: "https://cdn.muslimspath.app/books/Xhamia-Mbret-Emrat-dhe-Cilesit-e-Allahut.pdf" },
  { title: "Historitë e Pejgamberëve", author: "Literaturë Islame", cat: "Shqip", url: "https://cdn.muslimspath.app/books/historite-e-pejgambereve-botim-1-1.pdf" },
  { title: "Albislam — Nr. 63", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://cdn.muslimspath.app/books/albislam63.pdf" },
  { title: "Albislam — Nr. 64", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://cdn.muslimspath.app/books/albislam64.pdf" },
  { title: "Albislam — Nr. 65", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://cdn.muslimspath.app/books/albislam65.pdf" },
  { title: "Albislam — Nr. 66", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://cdn.muslimspath.app/books/albislam66.pdf" },
  { title: "Dituria Islame — Nr. 250", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://cdn.muslimspath.app/books/dituria250.pdf" },
  { title: "Dituria Islame — Nr. 282", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://cdn.muslimspath.app/books/dituria282.pdf" },
  { title: "Dituria Islame — Nr. 283", author: "Revistë Islame Shqip", cat: "Shqip", url: "https://cdn.muslimspath.app/books/dituria283.pdf" },
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
function Card({ children, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        padding: 28,
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        boxShadow: "0 2px 12px rgba(26,25,21,0.07)",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function PageTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "#FAF5E8", border: "1px solid rgba(184,157,96,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name={icon} size={20} color="#8A7235" sw={1.7} />
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: TEXT, fontFamily: SERIF, letterSpacing: "0.04em" }}>{title}</h1>
      </div>
      {sub && <p style={{ margin: "0 0 0 52px", color: MUTED, fontSize: 13, letterSpacing: "0.03em" }}>{sub}</p>}
      <div style={{ marginTop: 16, height: 1, background: `linear-gradient(90deg, ${GOLD} 0%, transparent 60%)`, opacity: 0.35 }} />
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
          padding: "11px 14px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: SURFACE, outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          fontFamily: SANS,
          ...props.style
        }}
        onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px ${GOLD}18`; }}
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
          padding: "11px 14px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${BORDER}`,
          fontSize: 14, color: TEXT, background: SURFACE, outline: "none", cursor: "pointer",
          fontFamily: SANS,
          ...props.style
        }}
      >
        {options.map(o => <option key={o.v} value={o.v} style={{ background: "#FFFFFF" }}>{o.l}</option>)}
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
        padding: "11px 24px",
        borderRadius: 999,
        border: variant === "primary" ? "none" : `1px solid ${BORDER}`,
        background: disabled ? "#E8DCC8"
          : variant === "primary"
            ? "#8A7235"
            : "#FFFFFF",
        color: disabled ? MUTED : variant === "primary" ? "#FFFFFF" : TEXT,
        fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.05em",
        transition: "opacity 0.2s, transform 0.15s",
        fontFamily: SANS,
        ...style
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
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
  eid:      { bg: "#faf5ec", border: "#C9A84C", text: "#a07d3a" },
  major:    { bg: "#f0ebfa", border: "#7C3AED", text: "#5b3fa0" },
  notable:  { bg: "#eaf2fc", border: "#2563EB", text: "#1a4a9e" },
  ramadan:  { bg: "#fdf0f0", border: "#DC2626", text: "#9b1c1c" },
  white:    { bg: "#eef4fc", border: "#3B82F6", text: "#1e4fad" },
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
        background: "#faf5ec", borderRadius: 0, maxWidth: 480, width: "100%",
        boxShadow: `0 12px 48px rgba(160,120,50,0.18), 0 0 0 1px ${col.border}40`,
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

// ─── SUPABASE CONFIG ──────────────────────────────────────────────
// Fill these in after creating your Supabase project (Settings → API)
const SUPA_URL      = import.meta.env.VITE_SUPA_URL      || "";
const SUPA_ANON_KEY = import.meta.env.VITE_SUPA_ANON_KEY || "";

// Cloudflare Worker URL (public — used for reading files via GET)
const UPLOAD_WORKER_URL = import.meta.env.VITE_UPLOAD_WORKER_URL || "";

// Uploads go through /api/upload (Vercel serverless) — key never reaches browser
const UPLOAD_API = "/api/upload";

// Emails allowed to access /admin — add yours here
const ADMIN_EMAILS = ["platoni@live.com"];

async function supaFetch(table, opts = "") {
  if (!SUPA_URL) return null;
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${opts}`, {
    headers: { apikey: SUPA_ANON_KEY, Authorization: `Bearer ${SUPA_ANON_KEY}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// ─── NAV ──────────────────────────────────────────────────────────
const R2 = "https://cdn.muslimspath.app";

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


// ─── PRAYER TIMES ─────────────────────────────────────────────────
function PrayerTimes({ savedLocation }) {
  const { t, i18n } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");
  const [city, setCity] = useState("");
  const [method, setMethod] = useState(() => parseInt(localStorage.getItem("mp-prayer-method") || "1"));
  const [school, setSchool] = useState(() => parseInt(localStorage.getItem("mp-prayer-school") || "1"));
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [date] = useState(new Date());
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [suggLoading, setSuggLoading] = useState(false);
  const [displayCity, setDisplayCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  async function useGPS() {
    if (!navigator.geolocation) { setErr("Geolocation not supported by your browser"); return; }
    setGpsLoading(true); setErr("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`, { headers: { "Accept-Language": "en" } });
          const json = await res.json();
          const name = [json.address?.city || json.address?.town || json.address?.village || json.address?.county, json.address?.country].filter(Boolean).join(", ");
          const cityName = name || "My Location";
          setCity(cityName);
          setCountryCode(json.address?.country_code?.toUpperCase() || "");
          search(cityName, { lat: coords.latitude, lon: coords.longitude });
        } catch {
          setCity("My Location");
          search("My Location", { lat: coords.latitude, lon: coords.longitude });
        }
        setGpsLoading(false);
      },
      () => { setErr("Location access denied. Please search for a city manually."); setGpsLoading(false); },
      { timeout: 10000 }
    );
  }

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
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=8&addressdetails=1`, { headers: { "Accept-Language": "en" } });
        const json = await res.json();
        const cities = json.map(r => ({
            name: r.display_name.split(",").slice(0,3).join(", "),
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
        url = `https://api.aladhan.com/v1/timings/${d}?latitude=${coords.lat}&longitude=${coords.lon}&method=${method}&school=${school}`;
      } else {
        // Fallback: geocode first, then use coordinates
        const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, { headers: { "Accept-Language": "en" } });
        const geoJson = await geo.json();
        if (geoJson.length > 0) {
          const { lat, lon } = geoJson[0];
          url = `https://api.aladhan.com/v1/timings/${d}?latitude=${lat}&longitude=${lon}&method=${method}`;
        } else {
          url = `https://api.aladhan.com/v1/timingsByCity/${d}?city=${encodeURIComponent(q)}&country=&method=${method}&school=${school}`;
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
  const PR_SQ_PAGE = { Fajr:"Sabahu", Sunrise:"Lindja", Dhuhr:"Dreka", Asr:"Ikindia", Maghrib:"Akshami", Isha:"Jacia" };
  const PR_EN_PAGE = { Fajr:"Fajr", Sunrise:"Sunrise", Dhuhr:"Dhuhr", Asr:"Asr", Maghrib:"Maghrib", Isha:"Isha" };
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
  const PRAY_ONLY = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
  const doneCount = times ? (() => {
    const [ih,im] = times.timings.Isha.split(":").map(Number);
    return (nextPrayer === "Fajr" && nowMins > ih*60+im) ? 5 : PRAY_ONLY.indexOf(nextPrayer ?? "Fajr");
  })() : 0;
  const qiblaDeg = times ? (() => {
    const φ1 = times.meta.latitude * Math.PI / 180, λ1 = times.meta.longitude * Math.PI / 180;
    const φ2 = 21.4225 * Math.PI / 180, λ2 = 39.8262 * Math.PI / 180;
    const dλ = λ2 - λ1;
    const y = Math.sin(dλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ);
    return Math.round((Math.atan2(y, x) * 180 / Math.PI + 360) % 360);
  })() : null;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 90px" }}>
      <PageTitle icon="prayer" title={t("pages.prayer.title")} sub={t("pages.prayer.sub")} />
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

          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => search()} disabled={loading || gpsLoading} style={{ flex: 1 }}>{loading ? "Searching…" : "Get Prayer Times"}</Btn>
            <button
              onClick={useGPS}
              disabled={gpsLoading || loading}
              title="Use GPS location"
              style={{
                flexShrink: 0, padding: "0 14px", borderRadius: 999,
                border: `1px solid ${BORDER}`, background: "#FAF5E8", color: "#8A7235",
                fontSize: 18, cursor: (gpsLoading || loading) ? "wait" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F0EAD8"}
              onMouseLeave={e => e.currentTarget.style.background = "#FAF5E8"}
            >{gpsLoading ? "⏳" : "📡"}</button>
          </div>
        </div>
      </Card>

      {err && <p style={{ color: "#EF4444", fontSize: 12, letterSpacing: "0.03em" }}>{err}</p>}

      {times && (
        <div>
          {/* Completion card */}
          <div style={{ background:"#fff", border:`1px solid #E0D5C0`, borderRadius:14, padding:"16px 20px", marginBottom:16, boxShadow:"0 2px 12px rgba(26,25,21,0.07)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontSize:13, color:"#9A8E7A", fontFamily:SANS, marginBottom:2 }}>
                  {isSq ? "Kryerja sot" : "Today's completion"}
                </div>
                <div style={{ fontSize:24, fontWeight:700, color:"#2D5018", fontFamily:SANS }}>
                  {doneCount}<span style={{ fontSize:14, color:"#9A8E7A", fontWeight:400 }}>/5</span>
                </div>
              </div>
              <div style={{ fontSize:12, color:"#6B6050", fontFamily:SANS, textAlign:"right", maxWidth:160 }}>
                <div style={{ fontWeight:600, color:TEXT }}>{displayCity}</div>
                <div style={{ marginTop:2 }}>{times.date.readable}</div>
              </div>
            </div>
            <div style={{ height:5, background:"#EDF5E3", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(doneCount/5)*100}%`, background:"#2D5018", borderRadius:99 }}/>
            </div>
            <div style={{ fontSize:12, color:"#6B6050", marginTop:6, fontFamily:SANS }}>
              {doneCount < 5 && nextPrayer && (
                isSq
                  ? `Vazhdo — ${PR_SQ_PAGE[nextPrayer]||nextPrayer} është i ardhshëm`
                  : `Keep going — ${PR_EN_PAGE[nextPrayer]||nextPrayer} is next`
              )}
              {doneCount === 5 && (isSq ? "Të gjitha namazet u falën sot!" : "All prayers completed today!")}
            </div>
          </div>

          {/* Schedule */}
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:"#9A8E7A", marginBottom:8, fontFamily:SANS }}>
            {isSq ? "Orari i sotëm" : "Today's Schedule"}
          </div>
          <div style={{ background:"#fff", border:`1px solid #E0D5C0`, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(26,25,21,0.07)", marginBottom:16 }}>
            {prayerKeys.map((k, i) => {
              const isSunrise = k === "Sunrise";
              const pIdx = PRAY_ONLY.indexOf(k);
              const isDone = !isSunrise && pIdx < doneCount;
              const isNext = k === nextPrayer;
              const isLast = i === prayerKeys.length - 1;
              return (
                <div key={k} style={{
                  display:"flex", alignItems:"center", padding:"12px 16px",
                  borderBottom: isLast ? "none" : `1px solid #EDF5E3`,
                  background: isNext ? "#EDF5E3" : "#fff",
                }}>
                  {isSunrise ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B89D60" strokeWidth="1.8" strokeLinecap="round" style={{ marginRight:12, flexShrink:0 }}>
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  ) : (
                    <div style={{
                      width:26, height:26, borderRadius:"50%", marginRight:12, flexShrink:0,
                      background: isDone ? "#2D5018" : "#fff",
                      border: `1.5px solid ${isDone ? "#2D5018" : "#D4E8BC"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      {isDone && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                      {isNext && !isDone && <div style={{ width:8, height:8, borderRadius:"50%", background:"#2D5018" }}/>}
                    </div>
                  )}
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight: isNext ? 600 : 500, color: isNext ? "#2D5018" : (isSunrise ? "#B89D60" : TEXT), fontFamily:SANS }}>
                      {isSq ? (PR_SQ_PAGE[k]||k) : (PR_EN_PAGE[k]||k)}
                    </div>
                  </div>
                  <div style={{ fontSize:13, color: isNext ? "#2D5018" : MUTED, fontWeight: isNext ? 600 : 400, fontFamily:SANS }}>
                    {times.timings[k]}
                  </div>
                  {isNext && (
                    <div style={{ marginLeft:8, padding:"2px 8px", borderRadius:999, background:"#2D5018", color:"#fff", fontSize:10, fontWeight:700, fontFamily:SANS, letterSpacing:"0.04em" }}>
                      {isSq ? "Tjetri" : "Next"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Qibla card */}
          {qiblaDeg !== null && (
            <div style={{ background:"#fff", border:`1px solid #E0D5C0`, borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 2px 12px rgba(26,25,21,0.07)" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#EDF5E3", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D5018" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 2L8 7H5L3 10l9 2 9-2-2-3h-3L12 2z"/><line x1="12" y1="12" x2="12" y2="22"/><path d="M5 22h14"/>
                </svg>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:TEXT, fontFamily:SANS }}>
                  {isSq ? "Drejtimi i Kibles" : "Qibla Direction"}
                </div>
                <div style={{ fontSize:13, color:"#9A8E7A", fontFamily:SANS, marginTop:2 }}>
                  {qiblaDeg}° {isSq ? "nga Veriu" : "from North"}
                </div>
              </div>
            </div>
          )}
        </div>
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
      <PageTitle icon="zakat" title="Zakat Calculator" sub="2.5% of net zakatable wealth above nisab, held for one lunar year" />
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
        <button onClick={() => set(key, Math.max(0, h[key]-1))} style={{ width: 28, height: 28, borderRadius: 2, border: `1px solid ${BORDER}`, background: "#faf5ec", cursor: "pointer", fontSize: 16, lineHeight: 1, color: TEXT }}>−</button>
        <span style={{ width: 22, textAlign: "center", fontWeight: 600, color: h[key] > 0 ? GOLD : MUTED, fontFamily: SERIF, fontSize: 16 }}>{h[key]}</span>
        <button onClick={() => set(key, Math.min(max||99, h[key]+1))} style={{ width: 28, height: 28, borderRadius: 2, border: `1px solid ${BORDER}`, background: "#faf5ec", cursor: "pointer", fontSize: 16, lineHeight: 1, color: TEXT }}>+</button>
      </div>
    </div>
  );

  const toggle = (label, key) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 13, color: TEXT, letterSpacing: "0.02em" }}>{label}</span>
      <button onClick={() => set(key, !h[key])} style={{
        width: 42, height: 22, borderRadius: 0, border: `1px solid ${h[key] ? GOLD + "80" : BORDER}`,
        cursor: "pointer", background: h[key] ? GREEN_L : "#f0e6ce",
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
      <PageTitle icon="inherit" title="Inheritance Calculator" sub="Calculate Islamic inheritance shares (Farāʾiḍ) according to your madhab" />

      <div className="inherit-top-grid">
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
        <div className="inherit-heirs-grid">
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
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 4px", fontWeight: 700 }}>Results</h3>
            <span style={{ fontSize: 12, color: MUTED }}>{currency} {fmt(results.estate)} estate · {MADHABS.find(m=>m.v===madhab)?.l}</span>
          </div>
          {results.shares.length === 0 ? (
            <p style={{ color: MUTED }}>No recognised heirs. Please add at least one heir.</p>
          ) : (
            <div>
              {/* Desktop header row — hidden on mobile */}
              <div className="inherit-results-header">
                {["Heir","Share","Each","Amount"].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
                ))}
              </div>
              {results.shares.map((s, i) => {
                const totalAmt = fracVal(s.frac) * results.estate;
                const eachAmt = fracVal(s.each) * results.estate;
                return (
                  <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {/* Desktop row */}
                    <div className="inherit-results-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{s.heir}</div>
                        {s.count > 1 && <div style={{ fontSize: 12, color: MUTED }}>× {s.count}</div>}
                      </div>
                      <span style={{ fontFamily: "monospace", color: GREEN, fontWeight: 600, fontSize: 14 }}>{fmtFrac(s.frac)}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 14, color: MUTED }}>{fmtFrac(s.each)}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{currency} {fmt(s.count > 1 ? totalAmt : eachAmt)}</span>
                    </div>
                    {/* Mobile card row */}
                    <div className="inherit-results-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{s.heir}</div>
                          {s.count > 1 && <div style={{ fontSize: 11, color: MUTED }}>× {s.count} persons</div>}
                        </div>
                        <span style={{ fontFamily: "monospace", color: GREEN, fontWeight: 700, fontSize: 15 }}>{fmtFrac(s.frac)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: MUTED }}>Each: {fmtFrac(s.each)}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{currency} {fmt(s.count > 1 ? totalAmt : eachAmt)}</span>
                      </div>
                    </div>
                    {s.note && <div style={{ fontSize: 12, color: MUTED, padding: "4px 0 8px", fontStyle: "italic" }}>{s.note}</div>}
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
      <PageTitle icon="dates" title="Date Converter" sub="Convert between Hijri (Islamic) and Gregorian calendars" />

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
        <div style={{ display: "flex", background: "#f0e6ce", border: `1px solid ${BORDER}`, borderRadius: 2, padding: 3, marginBottom: 20 }}>
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
const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;

function Library({ navigate }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [books, setBooks] = useState(LIBRARY);
  const [cats, setCats] = useState(CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(null); // { url, title }
  const [pdfError, setPdfError] = useState(false);

  function openPdf(book) {
    const CDN = "https://cdn.muslimspath.app/";
    const key = book.url.startsWith(CDN) ? book.url.slice(CDN.length) : `books/${book.url.split("/").pop()}`;
    const workerUrl = `${UPLOAD_WORKER_URL}/${key}`;
    if (isMobile()) {
      window.open(workerUrl, "_blank", "noreferrer");
    } else {
      setPdfOpen({ url: book.url, title: book.title });
      setPdfError(false);
    }
  }

  useEffect(() => {
    if (!SUPA_URL) return;
    setLoading(true);
    supaFetch("books", "select=*&order=id")
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
          setCats(["All", ...Array.from(new Set(data.map(b => b.cat)))]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Normalize any old R2 URLs still stored in Supabase
  const normalizeUrl = url => url
    .replace("https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/", "https://cdn.muslimspath.app/books/")
    .replace(/^https:\/\/cdn\.muslimspath\.app\/(?!books\/)([^/]+\.pdf)$/, "https://cdn.muslimspath.app/books/$1");

  const filtered = books.map(b => ({ ...b, url: normalizeUrl(b.url) })).filter(b => {
    if (!b.url || b.url === "#") return false; // hide books with no real content
    const matchCat = cat === "All" || b.cat === cat;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="library" title={t("pages.library.title")} sub={loading ? "Loading…" : `${books.length} curated books and resources`} />

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          placeholder="Search by title or author…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: "1 1 200px", padding: "9px 14px", borderRadius: 2,
            border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT,
            background: "#faf5ec", outline: "none", fontFamily: SANS,
          }}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
        <select value={cat} onChange={e => { if (e.target.value === "🎙️ Lectures") navigate("audio"); else setCat(e.target.value); }} style={{
          padding: "9px 14px", borderRadius: 2, border: `1px solid ${BORDER}`,
          fontSize: 12, color: TEXT, background: "#faf5ec", cursor: "pointer",
          flex: "0 0 160px", letterSpacing: "0.04em", fontFamily: SANS, outline: "none",
        }}>
          {cats.map(c => <option key={c} style={{ background: "#faf5ec" }}>{c}</option>)}
          <option style={{ background: "#faf5ec", color: GOLD }}>🎙️ Lectures</option>
        </select>
      </div>

      <div style={{ marginBottom: 12, color: MUTED, fontSize: 13 }}>{filtered.length} results</div>

      {loading && <div style={{ textAlign: "center", padding: 32, color: MUTED, letterSpacing: "0.08em", fontSize: 13 }}>Loading library…</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, border: `1px solid ${BORDER}` }}>
        {filtered.map((b, i) => {
          const isPdf = b.url.endsWith(".pdf");
          return (
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
              </div>
              <div style={{ fontWeight: 500, fontSize: 14, color: TEXT, lineHeight: 1.5, fontFamily: SERIF, cursor: isPdf ? "pointer" : "default" }}
                onClick={() => { if (isPdf) openPdf(b); else window.open(b.url, "_blank", "noreferrer"); }}
              >{b.title}</div>
              <div style={{ fontSize: 12, color: MUTED, letterSpacing: "0.02em" }}>{b.author}</div>
              {isPdf ? (
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <button onClick={() => openPdf(b)} style={{
                    flex: 1, padding: "5px 0", background: "transparent",
                    border: `1px solid ${GOLD}50`, borderRadius: 2,
                    color: GOLD, fontSize: 11, cursor: "pointer", fontFamily: SANS,
                    letterSpacing: "0.06em", transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${GOLD}18`; e.stopPropagation(); }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >📖 Read</button>
                  <a href={b.url} download target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{
                    flex: 1, padding: "5px 0", background: "transparent",
                    border: `1px solid ${BORDER}`, borderRadius: 2,
                    color: MUTED, fontSize: 11, cursor: "pointer", fontFamily: SANS,
                    letterSpacing: "0.06em", textDecoration: "none", textAlign: "center",
                    transition: "all 0.15s", display: "block",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = MUTED; e.currentTarget.style.color = TEXT; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
                  >↓ Download</a>
                </div>
              ) : (
                <a href={b.url} target="_blank" rel="noreferrer" style={{
                  marginTop: 4, padding: "5px 0", background: "transparent",
                  border: `1px solid ${BORDER}`, borderRadius: 2,
                  color: MUTED, fontSize: 11, fontFamily: SANS,
                  letterSpacing: "0.06em", textDecoration: "none", textAlign: "center",
                  display: "block", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
                >↗ Visit</a>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div>No results for "{search}"</div>
        </div>
      )}

      {/* PDF reader modal */}
      {pdfOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.97)", display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 20px", background: "#f0e6ce", borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 13, color: TEXT, fontFamily: SERIF, fontWeight: 500, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              📖 {pdfOpen.title}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={pdfOpen.url} download target="_blank" rel="noreferrer" style={{
                background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 2,
                color: MUTED, padding: "6px 14px", cursor: "pointer", fontSize: 11,
                fontFamily: SANS, letterSpacing: "0.06em", textDecoration: "none",
              }}>↓ Download</a>
              <button onClick={() => setPdfOpen(null)} style={{
                background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 2,
                color: MUTED, padding: "6px 14px", cursor: "pointer", fontSize: 11,
                fontFamily: SANS, letterSpacing: "0.06em",
              }}>✕ Close</button>
            </div>
          </div>
          {pdfError ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
              <div style={{ fontSize: 40 }}>📄</div>
              <div style={{ fontSize: 15, color: TEXT, fontFamily: SERIF, textAlign: "center" }}>Could not load this PDF in the browser.</div>
              <div style={{ fontSize: 13, color: MUTED, textAlign: "center", maxWidth: 360 }}>The file may not be publicly accessible yet. Use the Download button to open it directly.</div>
              <a href={pdfOpen.url} target="_blank" rel="noreferrer" style={{
                marginTop: 8, padding: "10px 28px", borderRadius: 2,
                background: `linear-gradient(135deg, ${GOLD}, #A8893C)`,
                color: "#f0e6ce", fontWeight: 700, fontSize: 13,
                fontFamily: SANS, letterSpacing: "0.08em", textDecoration: "none",
              }}>↓ Open / Download PDF</a>
            </div>
          ) : (
            <iframe
              src={(() => {
                const CDN = "https://cdn.muslimspath.app/";
                const key = pdfOpen.url.startsWith(CDN) ? pdfOpen.url.slice(CDN.length) : `books/${pdfOpen.url.split("/").pop()}`;
                return `${UPLOAD_WORKER_URL}/${key}`;
              })()}
              title={pdfOpen.title}
              style={{ flex: 1, border: "none", width: "100%", background: "#fff" }}
              onError={() => setPdfError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR ─────────────────────────────────────────────────────
const GREG_MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function IslamicCalendar() {
  const { t } = useTranslation();
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
      <PageTitle icon="calendar" title={t("pages.calendar.title")} sub={t("pages.calendar.sub")} />

      {/* Today strip */}
      <Card style={{ background: `linear-gradient(145deg,${SURFACE},#f5edda)`, border: `1px solid ${GOLD}40`, marginBottom: 20 }}>
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

            if (isToday) { bg = GOLD; textColor = "#f0e6ce"; borderColor = GOLD; }
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
function SettingsModal({ onClose, savedLocation, onSave, notifEnabled, onNotifToggle }) {
  const [city, setCity] = useState(savedLocation?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [suggLoading, setSuggLoading] = useState(false);
  const [selected, setSelected] = useState(savedLocation || null);
  const [saved, setSaved] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsErr, setGpsErr] = useState("");
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  async function useGPS() {
    if (!navigator.geolocation) { setGpsErr("Geolocation not supported"); return; }
    setGpsLoading(true); setGpsErr("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`, { headers: { "Accept-Language": "en" } });
          const json = await res.json();
          const name = [json.address?.city || json.address?.town || json.address?.village || json.address?.county, json.address?.country].filter(Boolean).join(", ");
          const loc = { name: name || "My Location", lat: coords.latitude, lon: coords.longitude, country: json.address?.country_code?.toUpperCase() || "" };
          setCity(loc.name); setSelected(loc);
        } catch {
          setSelected({ name: "My Location", lat: coords.latitude, lon: coords.longitude, country: "" });
          setCity("My Location");
        }
        setGpsLoading(false);
      },
      (err) => { setGpsErr("Location access denied. Please search manually."); setGpsLoading(false); },
      { timeout: 10000 }
    );
  }

  useEffect(() => {
    if (city.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    if (selected && city === selected.name) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSuggLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=8&addressdetails=1`, { headers: { "Accept-Language": "en" } });
        const json = await res.json();
        const cities = json.map(r => ({ name: r.display_name.split(",").slice(0,3).join(", "), lat: parseFloat(r.lat), lon: parseFloat(r.lon), country: r.address?.country_code?.toUpperCase() || "" }));
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
      <div onClick={e => e.stopPropagation()} style={{ background:"#faf5ec", borderRadius:16, maxWidth:460, width:"100%", boxShadow:`0 16px 60px rgba(160,120,50,0.22), 0 0 0 1px ${GOLD}20`, overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${SURFACE},#f0e8d0)`, borderBottom:`1px solid ${GOLD}30`, padding:"22px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:20, fontWeight:400, color:TEXT, fontFamily:SERIF, letterSpacing:"0.06em" }}>Settings</div>
            <div style={{ fontSize:11, color:MUTED, marginTop:4, letterSpacing:"0.08em" }}>Location · Prayer Times</div>
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

          {/* GPS button */}
          <button onClick={useGPS} disabled={gpsLoading} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", marginBottom:14, borderRadius:"var(--radius-sm)", border:`1px solid ${GOLD}50`, background:GREEN_L, color:GOLD, fontSize:13, fontWeight:600, cursor:gpsLoading ? "wait" : "pointer", transition:"all 0.2s", fontFamily:SANS }}>
            <span style={{ fontSize:16 }}>📡</span>
            {gpsLoading ? "Getting location…" : "Use my GPS location"}
          </button>
          {gpsErr && <p style={{ margin:"-8px 0 12px", fontSize:11, color:"#c0392b", textAlign:"center" }}>{gpsErr}</p>}

          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <div style={{ flex:1, height:1, background:BORDER }} />
            <span style={{ fontSize:11, color:MUTED, letterSpacing:"0.08em" }}>OR</span>
            <div style={{ flex:1, height:1, background:BORDER }} />
          </div>

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

          <button onClick={save} disabled={!selected || saved} style={{ width:"100%", padding:"13px", borderRadius:2, border:`1px solid ${selected && !saved ? GOLD : BORDER}`, background: saved ? GREEN_L : selected ? `linear-gradient(135deg,${GOLD},#A8893C)` : "#faf5ec", color: saved ? GOLD : selected ? "#f0e6ce" : MUTED, fontSize:12, fontWeight:700, cursor: selected && !saved ? "pointer" : "not-allowed", transition:"all 0.2s", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:SANS }}>
            {saved ? "✅ Saved!" : "Save Location"}
          </button>

          <p style={{ margin:"14px 0 0", fontSize:12, color:MUTED, textAlign:"center" }}>
            Prayer times will auto-load with this location on every visit.
          </p>

          {/* Prayer Notification Toggle */}
          <div style={{ marginTop:24, paddingTop:20, borderTop:`1px solid ${BORDER}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:TEXT }}>Prayer Notifications</div>
                <div style={{ fontSize:11, color:MUTED, marginTop:3, letterSpacing:"0.03em" }}>
                  Browser alert at each prayer time
                  {!savedLocation && <span style={{ color:GOLD }}> — save a location first</span>}
                </div>
              </div>
              <button
                disabled={!savedLocation}
                onClick={() => onNotifToggle(!notifEnabled)}
                style={{
                  width:46, height:26, borderRadius:13,
                  background: notifEnabled ? GOLD : BORDER,
                  border:"none", cursor: savedLocation ? "pointer" : "not-allowed",
                  position:"relative", transition:"background 0.25s", flexShrink:0,
                  opacity: savedLocation ? 1 : 0.4,
                }}
              >
                <span style={{
                  position:"absolute", top:3, left: notifEnabled ? 23 : 3,
                  width:20, height:20, borderRadius:"50%",
                  background: notifEnabled ? "#f0e6ce" : MUTED,
                  transition:"left 0.25s",
                }} />
              </button>
            </div>
            {notifEnabled && savedLocation && (
              <div style={{ marginTop:10, fontSize:11, color:GOLD, background:GREEN_L, border:`1px solid ${GOLD}30`, borderRadius:2, padding:"8px 12px" }}>
                🔔 Notifications scheduled for today's prayers in {savedLocation.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GLOBAL SEARCH ────────────────────────────────────────────────
function GlobalSearch({ onClose, navigate, lectures }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const bookResults = !q ? [] : LIBRARY.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.cat.toLowerCase().includes(q)
  ).slice(0, 6);

  const lectureResults = !q ? [] : lectures.filter(l =>
    l.title.toLowerCase().includes(q)
  ).slice(0, 5);

  // Surah list from module-level cache
  const surahResults = !q ? [] : (_surahCache || []).filter(s =>
    s.englishName.toLowerCase().includes(q) ||
    s.englishNameTranslation.toLowerCase().includes(q) ||
    String(s.number) === q
  ).slice(0, 5);

  const total = bookResults.length + lectureResults.length + surahResults.length;

  function goBook(b) {
    onClose();
    navigate("library");
  }
  function goLecture(l) {
    onClose();
    navigate("audio");
  }
  function goSurah(s) {
    localStorage.setItem("quranSurah", s.number);
    onClose();
    navigate("quran");
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1100, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:80, padding:"80px 24px 24px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#faf5ec", borderRadius:16, maxWidth:600, width:"100%", border:`1px solid ${GOLD}30`, boxShadow:`0 16px 60px rgba(160,120,50,0.2)`, overflow:"hidden" }}>

        {/* Search input */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"18px 20px", borderBottom:`1px solid ${BORDER}` }}>
          <span style={{ fontSize:18, opacity:0.5 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search surahs, books, lectures…"
            style={{ flex:1, background:"none", border:"none", outline:"none", fontSize:16, color:TEXT, fontFamily:SANS }}
          />
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:2, color:MUTED, padding:"4px 10px", cursor:"pointer", fontSize:11, letterSpacing:"0.06em", fontFamily:SANS }}>ESC</button>
        </div>

        {/* Results */}
        <div style={{ maxHeight:420, overflowY:"auto" }}>
          {!q && (
            <div style={{ padding:"40px 20px", textAlign:"center", color:MUTED, fontSize:13 }}>
              Start typing to search across the Quran, library, and lectures…
            </div>
          )}

          {q && total === 0 && (
            <div style={{ padding:"40px 20px", textAlign:"center", color:MUTED, fontSize:13 }}>
              No results for "{query}"
            </div>
          )}

          {surahResults.length > 0 && (
            <div>
              <div style={{ padding:"10px 20px 6px", fontSize:9, fontWeight:700, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", borderBottom:`1px solid ${BORDER}` }}>Quran — Surahs</div>
              {surahResults.map(s => (
                <button key={s.number} onClick={() => goSurah(s)} style={{ display:"flex", width:"100%", textAlign:"left", padding:"12px 20px", background:"none", border:"none", borderBottom:`1px solid ${BORDER}`, cursor:"pointer", alignItems:"center", gap:14, transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background=GREEN_L}
                  onMouseLeave={e => e.currentTarget.style.background="none"}
                >
                  <span style={{ fontSize:11, color:GOLD, fontVariantNumeric:"tabular-nums", minWidth:24, fontFamily:SANS }}>{s.number}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:TEXT, fontFamily:SERIF }}>{s.englishName}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{s.englishNameTranslation} · {s.numberOfAyahs} verses · {s.revelationType}</div>
                  </div>
                  <span style={{ fontSize:18, fontFamily:"'Amiri','Traditional Arabic',serif", color:GOLD, direction:"rtl" }}>{s.name}</span>
                </button>
              ))}
            </div>
          )}

          {bookResults.length > 0 && (
            <div>
              <div style={{ padding:"10px 20px 6px", fontSize:9, fontWeight:700, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", borderBottom:`1px solid ${BORDER}` }}>Library — Books</div>
              {bookResults.map((b, i) => (
                <button key={i} onClick={() => goBook(b)} style={{ display:"flex", width:"100%", textAlign:"left", padding:"12px 20px", background:"none", border:"none", borderBottom:`1px solid ${BORDER}`, cursor:"pointer", alignItems:"center", gap:14, transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background=GREEN_L}
                  onMouseLeave={e => e.currentTarget.style.background="none"}
                >
                  <span style={{ fontSize:16 }}>📚</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:TEXT, fontFamily:SERIF }}>{b.title}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{b.author} · {b.cat}</div>
                  </div>
                  {b.url && b.url !== "#" && <span style={{ fontSize:10, color:GOLD, border:`1px solid ${GOLD}40`, padding:"2px 7px", letterSpacing:"0.06em" }}>PDF</span>}
                </button>
              ))}
            </div>
          )}

          {lectureResults.length > 0 && (
            <div>
              <div style={{ padding:"10px 20px 6px", fontSize:9, fontWeight:700, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", borderBottom:`1px solid ${BORDER}` }}>Lectures — Audio</div>
              {lectureResults.map(l => (
                <button key={l.id} onClick={() => goLecture(l)} style={{ display:"flex", width:"100%", textAlign:"left", padding:"12px 20px", background:"none", border:"none", borderBottom:`1px solid ${BORDER}`, cursor:"pointer", alignItems:"center", gap:14, transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background=GREEN_L}
                  onMouseLeave={e => e.currentTarget.style.background="none"}
                >
                  <span style={{ fontSize:16 }}>🎙️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:TEXT, fontFamily:SERIF }}>{l.title}</div>
                  </div>
                  <span style={{ fontSize:10, color:MUTED }}>MP3</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding:"10px 20px", borderTop:`1px solid ${BORDER}`, display:"flex", justifyContent:"space-between", fontSize:11, color:MUTED }}>
          <span>{q ? `${total} result${total !== 1 ? "s" : ""}` : "Tip: search by name, author, or surah number"}</span>
          <span>↑↓ navigate · Enter open · Esc close</span>
        </div>
      </div>
    </div>
  );
}


// ─── AUTH HELPERS ─────────────────────────────────────────────────
const SESSION_KEY = "mp-session";

function loadSession() {
  try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}
function saveSession(s) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

async function supaAuthFetch(path, body) {
  const res = await fetch(SUPA_URL + "/auth/v1" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPA_ANON_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || data.error || JSON.stringify(data));
  return data;
}

// ─── AUTH MODAL ────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("signin");          // "signin" | "signup" | "lang"
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [pendingSession, setPendingSession] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      let session;
      if (tab === "signin") {
        session = await supaAuthFetch("/token?grant_type=password", { email, password: pass });
        saveSession(session);
        onAuth(session);
        onClose();
      } else {
        session = await supaAuthFetch("/signup", { email, password: pass, data: { full_name: name } });
        if (!session.access_token) {
          setDone(t("auth.checkEmail"));
          setBusy(false); return;
        }
        // Go to language selection step
        setPendingSession(session);
        setTab("lang");
      }
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  function handleLangChoice(lang) {
    i18n.changeLanguage(lang);
    if (pendingSession) {
      saveSession(pendingSession);
      onAuth(pendingSession);
    }
    onClose();
  }

  function googleSignIn() {
    const redirect = window.location.origin + window.location.pathname;
    window.location.href = SUPA_URL + "/auth/v1/authorize?provider=google&redirect_to=" + encodeURIComponent(redirect);
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 600,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: `linear-gradient(135deg,${SURFACE},#f0e8d0)`,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 32px 80px rgba(160,120,50,0.18), 0 2px 0 rgba(255,255,255,0.8) inset",
        width: "100%", maxWidth: 400, padding: "36px 32px",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14,
          background: "none", border: `1px solid ${BORDER}`,
          color: "#7a5c28", width: 28, height: 28, cursor: "pointer",
          fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
        }}>&#x2715;</button>

        {/* Logo + title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="" style={{ width: 44, height: 44, objectFit: "contain", marginBottom: 12 }} />
          <div style={{ fontSize: 18, color: "#3a2a10", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.05em" }}>Muslim&#x2019;s Path</div>
          <div style={{ fontSize: 11, color: "#7a5c28", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{t("auth.companion")}</div>
        </div>

        {/* Language selection step (after signup) */}
        {tab === "lang" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: TEXT, marginBottom: 24, lineHeight: 1.7 }}>{t("auth.langStep")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["en", t("lang.english")], ["sq", t("lang.albanian")]].map(([code, label]) => (
                <button key={code} onClick={() => handleLangChoice(code)} style={{
                  padding: "14px 20px", background: "#faf5ec", border: "1px solid #2A2520",
                  color: "#3a2a10", fontSize: 13, cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", letterSpacing: "0.06em",
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A84C"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#d8c090"}
                >{label}</button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: 24, borderBottom: "1px solid #242424" }}>
              {["signin","signup"].map(tabId => (
                <button key={tabId} onClick={() => { setTab(tabId); setErr(""); setDone(""); }} style={{
                  flex: 1, background: "none", border: "none",
                  borderBottom: tab === tabId ? "2px solid #C9A84C" : "2px solid transparent",
                  color: tab === tabId ? "#C9A84C" : "#7a5c28",
                  padding: "10px 0", fontSize: 11, cursor: "pointer",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", fontWeight: tab === tabId ? 600 : 400,
                  marginBottom: -1,
                }}>{tabId === "signin" ? t("auth.signIn") : t("auth.signUp")}</button>
              ))}
            </div>

            {done ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#C9A84C", fontSize: 14, lineHeight: 1.7 }}>{done}</div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tab === "signup" && (
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder={t("auth.fullName")}
                    style={{ padding: "10px 14px", background: "#faf5ec", border: "1px solid #242424", color: "#3a2a10", fontSize: 13, outline: "none", fontFamily: "'Inter', sans-serif" }}
                    onFocus={e => e.target.style.borderColor = "#C9A84C"}
                    onBlur={e => e.target.style.borderColor = "#e2cfa4"}
                  />
                )}
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t("auth.email")} required
                  style={{ padding: "10px 14px", background: "#faf5ec", border: "1px solid #242424", color: "#3a2a10", fontSize: 13, outline: "none", fontFamily: "'Inter', sans-serif" }}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#e2cfa4"}
                />
                <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                  placeholder={t("auth.password")} required minLength={6}
                  style={{ padding: "10px 14px", background: "#faf5ec", border: "1px solid #242424", color: "#3a2a10", fontSize: 13, outline: "none", fontFamily: "'Inter', sans-serif" }}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#e2cfa4"}
                />
                {err && <div style={{ fontSize: 12, color: "#e74c3c", lineHeight: 1.5 }}>{err}</div>}
                <button type="submit" disabled={busy} style={{
                  marginTop: 4, padding: "11px 0", background: busy ? "#f5edd8" : "linear-gradient(135deg,#C9A84C,#A8883E)",
                  border: "none", color: busy ? "#7a5c28" : "#f0e6ce",
                  fontSize: 12, fontWeight: 700, cursor: busy ? "default" : "pointer",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
                }}>{busy ? t("auth.pleaseWait") : (tab === "signin" ? t("auth.signIn") : t("auth.createAccount"))}</button>
              </form>
            )}

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
              <div style={{ flex: 1, height: 1, background: "#e2cfa4" }} />
              <span style={{ fontSize: 10, color: "#7a5c28", letterSpacing: "0.1em" }}>{t("auth.or")}</span>
              <div style={{ flex: 1, height: 1, background: "#e2cfa4" }} />
            </div>

            {/* Google */}
            <button onClick={googleSignIn} style={{
              width: "100%", padding: "10px 0", background: "none",
              border: "1px solid #2A2520", color: "#3a2a10",
              fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.06em", transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#d8c090"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t("auth.continueGoogle")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LANGUAGE BAR ─────────────────────────────────────────────────
function LangBar({ page }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("sq") ? "sq" : "en";

  function switchLang(lang) {
    if (lang === current) return;
    i18n.changeLanguage(lang);
    const slug = (PAGE_SLUGS[lang] || PAGE_SLUGS.en)[page] ?? page;
    const newUrl = page === "home" ? `/${lang}/` : `/${lang}/${slug}`;
    window.location.href = newUrl;
  }

  const btn = (lang, label) => {
    const active = current === lang;
    return (
      <button
        key={lang}
        onClick={() => switchLang(lang)}
        style={{
          padding: "4px 14px", borderRadius: 999,
          border: `1.5px solid ${active ? "#1A1915" : "#C8B89A"}`,
          background: active ? "#1A1915" : "transparent",
          color: active ? "#fff" : "#6B6050",
          cursor: active ? "default" : "pointer",
          fontSize: 11, fontWeight: 600,
          letterSpacing: "0.06em", fontFamily: SANS,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#EDE8DC"; e.currentTarget.style.color = "#1A1915"; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B6050"; } }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0", borderBottom: "1px solid #EDE8DC" }}>
      {btn("en", "GB\u00a0EN")}
      {btn("sq", "AL\u00a0SQ")}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
const VALID_PAGES = ["home","prayer","zakat","inheritance","calendar","dates","library","audio","tasbeeh","quran","dua","asma","admin","profile"];

// ── Language-prefixed URL slug mapping ────────────────────────────
const PAGE_SLUGS = {
  en: { home:"", prayer:"prayer", zakat:"zakat", inheritance:"inheritance", calendar:"calendar", dates:"dates", library:"library", audio:"audio", tasbeeh:"tasbeeh", quran:"quran", dua:"dua", asma:"asma", admin:"admin", profile:"profile" },
  sq: { home:"", prayer:"namazi", zakat:"zekati", inheritance:"hiseja", calendar:"kalendari", dates:"datat", library:"biblioteka", audio:"ligjerata", tasbeeh:"tesbihe", quran:"kurani", dua:"dua", asma:"emrat", admin:"admin", profile:"profili" },
};
function slugToPage(lang, slug) {
  const map = PAGE_SLUGS[lang] || PAGE_SLUGS.en;
  for (const [id, s] of Object.entries(map)) { if (s === slug) return id; }
  // Fallback: try English slugs (backwards compat)
  for (const [id, s] of Object.entries(PAGE_SLUGS.en)) { if (s === slug) return id; }
  return null;
}
function pageToUrl(pageId, lang) {
  const slug = (PAGE_SLUGS[lang] || PAGE_SLUGS.en)[pageId] ?? pageId;
  return pageId === "home" ? `/${lang}/` : `/${lang}/${slug}`;
}

// ─── FLOATING MINI-PLAYER ─────────────────────────────────────────
function FloatingPlayer({ current, playing, play, skip, stop, progress, duration, fmt, navigate, minimized, setMinimized }) {
  if (!current) return null;
  const pct = duration ? (progress / duration) * 100 : 0;

  // ── Minimized pill ──────────────────────────────────────────────
  if (minimized) {
    return (
      <div
        onClick={() => setMinimized(false)}
        title="Restore player"
        style={{
          position: "fixed", bottom: 8, right: 16, zIndex: 300,
          display: "flex", alignItems: "center", gap: 10,
          background: `linear-gradient(135deg,${SURFACE},#f0e8d0)`,
          border: `1px solid ${playing ? GOLD + "70" : BORDER}`,
          borderRadius: 999,
          boxShadow: `0 4px 20px rgba(160,120,50,0.18)`,
          padding: "6px 14px 6px 8px",
          cursor: "pointer",
          maxWidth: "calc(100vw - 32px)",
          animation: "slideUp 0.22s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}
      >
        {/* Progress ring around logo */}
        <div style={{ position: "relative", flexShrink: 0, width: 28, height: 28 }}>
          <svg viewBox="0 0 28 28" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="14" cy="14" r="12" fill="none" stroke={BORDER} strokeWidth="2" />
            <circle cx="14" cy="14" r="12" fill="none" stroke={GOLD} strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 12}`}
              strokeDashoffset={`${2 * Math.PI * 12 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.4s linear" }} />
          </svg>
          <img src="/logo.png" alt="" style={{ position: "absolute", inset: 4, width: 20, height: 20, objectFit: "contain", opacity: playing ? 0.9 : 0.5 }} />
        </div>

        {/* Track title */}
        <div style={{ minWidth: 0, maxWidth: 160 }}>
          <div style={{ fontSize: 9, color: playing ? GOLD : MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>{playing ? "Playing" : "Paused"}</div>
          <div style={{ fontSize: 12, color: TEXT, fontFamily: SERIF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{current.title}</div>
        </div>

        {/* Play/Pause inline */}
        <button
          onClick={e => { e.stopPropagation(); play(current); }}
          title={playing ? "Pause" : "Resume"}
          style={{
            width: 28, height: 28, borderRadius: "50%",
            border: `1px solid ${GOLD}`, background: playing ? GOLD : "transparent",
            color: playing ? "#f0e6ce" : GOLD,
            cursor: "pointer", fontSize: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s",
          }}
        >{playing ? "⏸" : "▶"}</button>
      </div>
    );
  }

  // ── Full player ──────────────────────────────────────────────────
  return (
    <div className="floating-player-full" style={{
      position: "fixed", left: 0, right: 0, zIndex: 510,
      background: `linear-gradient(135deg,${SURFACE},#f0e8d0)`,
      borderTop: `1px solid ${playing ? GOLD + "70" : BORDER}`,
      boxShadow: `0 -4px 24px rgba(160,120,50,0.15)`,
      padding: "0 16px",
      animation: "slideUp 0.28s cubic-bezier(0.22,1,0.36,1)",
      transition: "border-color 0.3s, bottom 0.2s",
    }}>
      {/* Progress bar at top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: BORDER }}>
        <div style={{ height: "100%", width: `${pct}%`, background: playing ? GOLD : MUTED, transition: "width 0.4s linear, background 0.3s" }} />
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, height: 68 }}>
        {/* Logo */}
        <img
          src="/logo.png" alt="" onClick={() => navigate("audio")}
          style={{ width: 32, height: 32, objectFit: "contain", cursor: "pointer", opacity: playing ? 0.9 : 0.45, flexShrink: 0, transition: "opacity 0.3s" }}
        />

        {/* Track title + status */}
        <div onClick={() => navigate("audio")} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
          <div style={{ fontSize: 9, color: playing ? GOLD : MUTED, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 2, transition: "color 0.3s" }}>
            {playing ? "Now Playing" : "Paused"}
          </div>
          <div style={{ fontSize: 13, color: playing ? TEXT : MUTED, fontFamily: SERIF, letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 0.3s" }}>
            {current.title}
          </div>
        </div>

        {/* Time */}
        <div style={{ fontSize: 11, color: MUTED, fontVariantNumeric: "tabular-nums", flexShrink: 0, display: "flex", gap: 4 }}>
          <span>{fmt(progress)}</span><span style={{ opacity: 0.4 }}>/</span><span>{fmt(duration)}</span>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button onClick={() => skip(-1)} title="Previous" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 15, padding: 4 }}>⏮</button>

          {/* Pause / Resume */}
          <button
            onClick={() => play(current)}
            title={playing ? "Pause" : "Resume"}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              border: `1px solid ${GOLD}`,
              background: playing ? GOLD : "transparent",
              color: playing ? "#f0e6ce" : GOLD,
              cursor: "pointer", fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >{playing ? "⏸" : "▶"}</button>

          <button onClick={() => skip(1)} title="Next" style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 15, padding: 4 }}>⏭</button>

          {/* Minimize — keeps audio playing */}
          <button
            onClick={() => setMinimized(true)}
            title="Minimize player"
            style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: "var(--radius-sm)",
              cursor: "pointer", color: MUTED, fontSize: 11,
              width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
          >⌄</button>

          {/* Stop — closes player entirely */}
          <button
            onClick={stop}
            title="Stop"
            style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: "var(--radius-sm)",
              cursor: "pointer", color: MUTED, fontSize: 12, fontWeight: 700,
              width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0392b"; e.currentTarget.style.color = "#c0392b"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
          >■</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [page, setPage] = useState(() => {
    // Support legacy hash URLs
    const hash = window.location.hash.replace("#", "");
    if (hash && VALID_PAGES.includes(hash)) return hash;
    // Parse /lang/slug or /lang/ (new format)
    const parts = window.location.pathname.replace(/^\//, "").split("/").filter(Boolean);
    if (parts[0] === "en" || parts[0] === "sq") {
      const urlLang = parts[0];
      i18n.changeLanguage(urlLang);
      const pageId = slugToPage(urlLang, parts[1] || "");
      return pageId || "home";
    }
    // Legacy: direct page ID
    const path = parts[0] || "";
    return VALID_PAGES.includes(path) ? path : "home";
  });
  const [navHistory, setNavHistory] = useState([]);
  const HADITH_QUOTES = QUOTES.filter(q => !q.src?.startsWith("Quran"));
  const QURAN_QUOTES  = QUOTES.filter(q =>  q.src?.startsWith("Quran"));
  const [quote]       = useState(() => HADITH_QUOTES[Math.floor(Math.random() * HADITH_QUOTES.length)]);
  const [verseQuote]  = useState(() => QURAN_QUOTES [Math.floor(Math.random() * QURAN_QUOTES.length)]);
  const [savedLocation, setSavedLocation] = useState(() => loadSavedLocation());
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem("mp-notifs") === "1");
  const [duaFavs, setDuaFavs] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("mp-dua-favs") || "[]")); } catch { return new Set(); }
  });

  function toggleDuaFav(id) {
    setDuaFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("mp-dua-favs", JSON.stringify([...next])); } catch {}
      return next;
    });
  }
  const notifTimers = useRef([]);

  // ── PWA install prompt ────────────────────────────────────────
  const deferredPrompt = useRef(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mp-install-dismissed")) return;
    function handler(e) {
      e.preventDefault();
      deferredPrompt.current = e;
      setShowInstall(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    deferredPrompt.current.userChoice.then(() => {
      deferredPrompt.current = null;
      setShowInstall(false);
    });
  }

  function dismissInstall() {
    setShowInstall(false);
    try { localStorage.setItem("mp-install-dismissed", "1"); } catch {}
  }

  // ── Auth state ─────────────────────────────────────────────────
  const [authSession, setAuthSession] = useState(() => loadSession());
  const [showAuth, setShowAuth] = useState(false);
  const authUser = authSession?.user;

  // Handle OAuth redirect hash (#access_token=...&type=recovery|signup etc.)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      try {
        const params = new URLSearchParams(hash.slice(1));
        const session = {
          access_token: params.get("access_token"),
          refresh_token: params.get("refresh_token"),
          expires_in: params.get("expires_in"),
          token_type: params.get("token_type"),
        };
        // Fetch user info
        fetch(SUPA_URL + "/auth/v1/user", {
          headers: { apikey: SUPA_ANON_KEY, Authorization: "Bearer " + session.access_token },
        }).then(r => r.json()).then(user => {
          const full = { ...session, user };
          saveSession(full);
          setAuthSession(full);
          // Clean hash from URL
          history.replaceState(null, "", window.location.pathname);
        }).catch(() => {});
      } catch {}
    }
  }, []);

  function handleSignOut() {
    if (authSession?.access_token) {
      fetch(SUPA_URL + "/auth/v1/logout", {
        method: "POST",
        headers: { apikey: SUPA_ANON_KEY, Authorization: "Bearer " + authSession.access_token },
      }).catch(() => {});
    }
    clearSession();
    setAuthSession(null);
  }

  // ── Global audio state ─────────────────────────────────────────
  const [lectures, setLectures] = useState(LECTURES);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerMinimized, setPlayerMinimized] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!SUPA_URL) return;
    supaFetch("lectures", "select=*&order=sort")
      .then(data => { if (Array.isArray(data) && data.length > 0) setLectures(data); })
      .catch(() => {});
  }, []);

  function playLecture(lecture) {
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
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.title,
        artist: "Muslim's Path",
        album: "Ligjerata Islame",
      });
      navigator.mediaSession.setActionHandler("play", () => { audioRef.current.play(); setPlaying(true); });
      navigator.mediaSession.setActionHandler("pause", () => { audioRef.current.pause(); setPlaying(false); });
      navigator.mediaSession.setActionHandler("previoustrack", () => skipLecture(-1));
      navigator.mediaSession.setActionHandler("nexttrack", () => skipLecture(1));
      navigator.mediaSession.setActionHandler("seekbackward", () => { audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5); });
      navigator.mediaSession.setActionHandler("seekforward", () => { audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 5); });
    }
  }, [current]);

  function skipLecture(dir) {
    if (!current) return;
    const idx = lectures.findIndex(l => l.id === current.id);
    const next = lectures[idx + dir];
    if (next) playLecture(next);
  }

  function stopAudio() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setPlaying(false);
    setCurrent(null);
    setProgress(0);
    setDuration(0);
  }

  function onTimeUpdate() {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  }

  function seekAudio(e) {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  }

  function fmtTime(s) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }
  // ──────────────────────────────────────────────────────────────

  // ── Prayer notifications ───────────────────────────────────────
  async function schedulePrayerNotifs(loc) {
    if (!loc || !("Notification" in window)) return;
    let perm = Notification.permission;
    if (perm === "denied") return;
    if (perm !== "granted") perm = await Notification.requestPermission();
    if (perm !== "granted") return;

    notifTimers.current.forEach(t => clearTimeout(t));
    notifTimers.current = [];

    const d = new Date();
    const dateStr = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${loc.lat}&longitude=${loc.lon}&method=2`);
      const json = await res.json();
      if (json.code !== 200) return;
      const now = Date.now();
      for (const name of ["Fajr","Dhuhr","Asr","Maghrib","Isha"]) {
        const [h, m] = json.data.timings[name].split(":").map(Number);
        const pDate = new Date(); pDate.setHours(h, m, 0, 0);
        const ms = pDate.getTime() - now;
        if (ms > 0) {
          const t = setTimeout(() => {
            new Notification(`🕌 ${name} — Time to Pray`, {
              body: `${name} prayer time has begun in ${loc.name}`,
              icon: "/logo.png",
            });
          }, ms);
          notifTimers.current.push(t);
        }
      }
    } catch {}
  }

  useEffect(() => {
    if (notifEnabled && savedLocation) schedulePrayerNotifs(savedLocation);
    else { notifTimers.current.forEach(t => clearTimeout(t)); notifTimers.current = []; }
  }, [notifEnabled, savedLocation]);

  function handleNotifToggle(val) {
    setNotifEnabled(val);
    try { localStorage.setItem("mp-notifs", val ? "1" : "0"); } catch {}
  }
  // ──────────────────────────────────────────────────────────────

  function handleSaveLocation(loc) { setSavedLocation(loc); }

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setShowSearch(s => !s); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Browser back/forward button support
  useEffect(() => {
    function onPop() {
      const parts = window.location.pathname.replace(/^\//, "").split("/").filter(Boolean);
      if (parts[0] === "en" || parts[0] === "sq") {
        const urlLang = parts[0];
        i18n.changeLanguage(urlLang);
        setPage(slugToPage(urlLang, parts[1] || "") || "home");
        return;
      }
      const path = parts[0] || "";
      setPage(VALID_PAGES.includes(path) ? path : "home");
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Dynamic <title> + <meta description> per page
  const PAGE_META = {
    home:        { title: "Muslim's Path — Daily Islamic Companion",          desc: "Prayer times, Quran, Duas, Tasbeeh, Islamic calendar and more — all in one app." },
    prayer:      { title: "Prayer Times — Muslim's Path",                      desc: "Accurate daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for any city worldwide." },

    quran:       { title: "Quran — Muslim's Path",                             desc: "Read the Holy Quran with Arabic text, transliteration and English translation." },
    dua:         { title: "Dua & Dhikr — Muslim's Path",                       desc: "Morning & evening adhkar, daily supplications and situational remembrances." },
    asma:        { title: "99 Names of Allah — Muslim's Path",                 desc: "Al-Asma ul-Husna — the 99 Beautiful Names of Allah with meanings and transliteration." },
    tasbeeh:     { title: "Digital Tasbeeh Counter — Muslim's Path",           desc: "Digital dhikr counter for Subhanallah, Alhamdulillah, Allahu Akbar and custom phrases." },
    zakat:       { title: "Zakat Calculator — Muslim's Path",                  desc: "Calculate your annual Zakat obligation based on nisab threshold and zakatable assets." },
    inheritance: { title: "Islamic Inheritance Calculator — Muslim's Path",    desc: "Distribute estate according to Quranic inheritance rules (Faraidh)." },
    calendar:    { title: "Islamic Calendar — Muslim's Path",                  desc: "Hijri calendar with Islamic dates, events and Gregorian cross-reference." },
    dates:       { title: "Hijri ↔ Gregorian Date Converter — Muslim's Path", desc: "Convert dates between the Islamic Hijri calendar and the Gregorian calendar." },
    library:     { title: "Islamic Library — Muslim's Path",                   desc: "Curated collection of essential Islamic books — Quran, Hadith, Seerah, Fiqh and Aqeedah." },
    audio:       { title: "Islamic Lectures — Muslim's Path",                  desc: "Listen to Islamic lectures and audio content." },
  };
  useEffect(() => {
    const m = PAGE_META[page] || PAGE_META.home;
    document.title = m.title;
    const setMeta = (sel, attr, val) => {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]',         "content", m.desc);
    setMeta('meta[property="og:title"]',        "content", m.title);
    setMeta('meta[property="og:description"]',  "content", m.desc);
    const lang = i18n.language?.startsWith("sq") ? "sq" : "en";
    setMeta('meta[property="og:url"]',          "content", `https://www.muslimspath.app${pageToUrl(page, lang)}`);
  }, [page]);

  function navigate(p) {
    if (p !== page) setNavHistory(h => [...h, page]);
    setPage(p);
    const lang = i18n.language?.startsWith("sq") ? "sq" : "en";
    window.history.pushState({}, "", pageToUrl(p, lang));
  }

  function goBack() {
    if (navHistory.length === 0) return;
    const prev = navHistory[navHistory.length - 1];
    setNavHistory(h => h.slice(0, -1));
    setPage(prev);
    const lang = i18n.language?.startsWith("sq") ? "sq" : "en";
    window.history.pushState({}, "", pageToUrl(prev, lang));
  }

  const audioProps = { lectures, current, playing, play: playLecture, skip: skipLecture, stop: stopAudio, seek: seekAudio, progress, duration, fmt: fmtTime, audioRef, minimized: playerMinimized, setMinimized: setPlayerMinimized };

  return (
    <div className="app-root" style={{ paddingBottom: current && !playerMinimized ? 68 : 0 }}>
      {/* ── Fixed decorative blobs (behind all content) ── */}
      <div className="app-blob app-blob-1" aria-hidden="true" />
      <div className="app-blob app-blob-2" aria-hidden="true" />

      {/* ── Global Kaaba watermark (every page) ── */}
      {page !== "home" && <KaabaWatermark fixed opacity={0.08} />}

      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={() => skipLecture(1)} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} />
      <Navbar page={page} setPage={navigate} onSettings={() => setShowSettings(true)} hasLocation={!!savedLocation} onSearch={() => setShowSearch(true)} authUser={authUser} onAuthClick={() => setShowAuth(true)} onSignOut={handleSignOut} />
      <LangBar page={page} />
      <main>
        {page === "home" && <Home quote={quote} verseQuote={verseQuote} setPage={navigate} savedLocation={savedLocation} onSaveLocation={loc => { saveSavedLocation(loc); handleSaveLocation(loc); }} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall} />}
        {page === "prayer" && <PrayerTimes savedLocation={savedLocation} />}
        {page === "zakat" && <Zakat />}
        {page === "inheritance" && <Inheritance />}
        {page === "calendar" && <IslamicCalendar />}
        {page === "dates" && <DateConverter />}
        {page === "library" && <Library navigate={navigate} />}
        {page === "audio" && <AudioPage {...audioProps} />}
        {page === "tasbeeh" && <Dhikr />}
        {page === "quran"   && <QuranPage />}
        {page === "profile" && <Profile authUser={authUser} onSignOut={handleSignOut} notifEnabled={notifEnabled} onNotifToggle={handleNotifToggle} savedLocation={savedLocation} navigate={navigate} />}
        {page === "dua"     && <DuaPage favs={duaFavs} onFav={toggleDuaFav} />}
        {page === "asma"    && <AsmaPage />}
        {page === "admin"   && <AdminPage authSession={authSession} />}
      </main>
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          savedLocation={savedLocation}
          onSave={handleSaveLocation}
          notifEnabled={notifEnabled}
          onNotifToggle={handleNotifToggle}
        />
      )}
      {showSearch && (
        <GlobalSearch
          onClose={() => setShowSearch(false)}
          navigate={navigate}
          lectures={lectures}
        />
      )}
      {/* Back button — top-left on mobile, bottom-left on desktop */}
      {navHistory.length > 0 && (
        <button onClick={goBack} title="Go back" className="back-btn" style={{
          position: "fixed",
          bottom: current ? 80 : 24,
          left: 16,
          zIndex: 450,
          background: "var(--surface)",
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-sm)",
          color: MUTED,
          cursor: "pointer",
          width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, lineHeight: 1,
          boxShadow: "var(--shadow-glass-sm)",
          transition: "border-color 0.2s, color 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
        >‹</button>
      )}
      <FloatingPlayer {...audioProps} navigate={navigate} />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={session => setAuthSession(session)}
        />
      )}

      {/* ── Mobile bottom tab bar (all pages) ── */}
      <MobileTabBar page={page} navigate={navigate} />
    </div>
  );
}

// ─── DUA DATA ─────────────────────────────────────────────────────
const DUA_CATS = ["All","Morning","Evening","Prayer","Meals","Home","Sleep","Travel","Protection","Distress","General"];

const DUAS = [
  // ── MORNING ──────────────────────────────────────────────────────
  { cat:"Morning", title:"Waking Up",
    ar:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    tr:"Alḥamdu lillāhi alladhī aḥyānā baʿda mā amātanā wa-ilayhi al-nushūr",
    en:"All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
    sqTitle:"Zgjimi nga Gjumi", sq:"Gjithë falënderimi i takon Allahut i cili na dha jetë pasi na mori atë, dhe tek Ai është ringjallja.", src:"Bukhari 6312" },
  { cat:"Morning", title:"Morning Remembrance",
    ar:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    tr:"Aṣbaḥnā wa-aṣbaḥa al-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illā Allāhu waḥdahu lā sharīka lah, lahu al-mulku wa-lahu al-ḥamdu wa-huwa ʿalā kulli shayʾin qadīr",
    en:"We have entered the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None is worthy of worship except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
    sqTitle:"Dhikri i Mëngjesit", sq:"Hyrëm në mëngjes dhe sundimi i Allahut hyri me ne; gjithë lavdia i takon Allahut. Nuk ka të adhuruar tjetër me të drejtë pos Allahut, Të Vetmit, pa ortak — Atij i takon sundimi dhe lavdia, Ai mbi çdo gjë është i Fuqishëm.", src:"Abu Dawud 5076" },
  { cat:"Morning", title:"Sayyid al-Istighfar",
    ar:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    tr:"Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa-anā ʿabduk, wa-anā ʿalā ʿahdika wa-waʿdika mā istaṭaʿtu, aʿūdhu bika min sharri mā ṣanaʿtu, abūʾu laka biniʿmatika ʿalayya, wa-abūʾu bidhanbī faghfir lī fa-innahū lā yaghfiru al-dhunūba illā anta",
    en:"O Allah, You are my Lord, none is worthy of worship but You. You created me and I am Your servant, abiding by Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your blessings upon me, and I acknowledge my sin, so forgive me — for none forgives sins except You.",
    sqTitle:"Sayyid el-Istigfar", sq:"O Allah, Ti je Zoti im — nuk ka të adhuruar tjetër me të drejtë pos Teje. Ti me krijove dhe unë jam robi Yt, duke qëndruar në besën dhe premtimin Tënd sipas mundësisë sime. Kërkoj strehim tek Ti nga e keqja e asaj që kam bërë. Pranoj mirësinë Tënde ndaj meje dhe pranoj mëkatin tim — pra më fal, sepse askush nuk fal mëkatet përveç Teje.", sqNote:"Kush e thotë me bindje në mëngjes dhe vdes atë ditë hyn në Xhenet. Po ashtu për mbrëmjen. — Bukhāri", src:"Bukhari 6306",
    note:"Whoever says this with certainty in the morning and dies that day shall enter Paradise. Same for evening. — Bukhari" },
  { cat:"Morning", title:"Morning Protection",
    ar:"بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    tr:"Bismillāhi alladhī lā yaḍurru maʿa ismihi shayʾun fī al-arḍi wa-lā fī al-samāʾ, wa-huwa al-samīʿu al-ʿalīm",
    en:"In the name of Allah with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    sqTitle:"Mbrojtja e Mëngjesit", sq:"Me emrin e Allahut me emrin e të Cilit asgjë nuk dëmton — as në tokë as në qiell — dhe Ai është Dëgjuesi i Gjithëdijshmi.", sqNote:"Recito 3 herë në mëngjes dhe mbrëmje — asgjë nuk do të dëmtojë gjatë asaj dite.", src:"Abu Dawud 5088",
    note:"Recite 3 times in the morning and evening — nothing will harm you that day." },

  // ── EVENING ──────────────────────────────────────────────────────
  { cat:"Evening", title:"Evening Remembrance",
    ar:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    tr:"Amsaynā wa-amsā al-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illā Allāhu waḥdahu lā sharīka lah, lahu al-mulku wa-lahu al-ḥamdu wa-huwa ʿalā kulli shayʾin qadīr",
    en:"We have entered the evening and at this very time unto Allah belongs all sovereignty, all praise is for Allah. None is worthy of worship except Allah, alone, without partner, to Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    sqTitle:"Dhikri i Mbrëmjes", sq:"Hyrëm në mbrëmje dhe sundimi i Allahut hyri me ne; gjithë lavdia i takon Allahut. Nuk ka të adhuruar tjetër me të drejtë pos Allahut, Të Vetmit, pa ortak — Atij i takon sundimi dhe lavdia, Ai mbi çdo gjë është i Fuqishëm.", src:"Abu Dawud 5076" },
  { cat:"Evening", title:"Sayyid al-Istighfar (Evening)",
    ar:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    tr:"Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa-anā ʿabduk…",
    en:"O Allah, You are my Lord, none is worthy of worship but You. You created me and I am Your servant, abiding by Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your blessings upon me, and I acknowledge my sin, so forgive me — for none forgives sins except You.",
    sqTitle:"Sayyid el-Istigfar (Mbrëmja)", sq:"O Allah, Ti je Zoti im — nuk ka të adhuruar tjetër me të drejtë pos Teje. Ti me krijove dhe unë jam robi Yt, duke qëndruar në besën dhe premtimin Tënd sipas mundësisë sime. Kërkoj strehim tek Ti nga e keqja e asaj që kam bërë. Pranoj mirësinë Tënde ndaj meje dhe pranoj mëkatin tim — pra më fal, sepse askush nuk fal mëkatet përveç Teje.", src:"Bukhari 6306" },
  { cat:"Evening", title:"Al-Ikhlas, Al-Falaq, An-Nas",
    ar:"قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    tr:"Qul huwa Allāhu Aḥad · Qul aʿūdhu bi-rabbi al-falaq · Qul aʿūdhu bi-rabbi al-nās",
    en:"Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas — each three times in the morning and evening for complete protection.",
    sqTitle:"El-Ikhlas, El-Felek, En-Nas", sq:"Lexo Suren El-Ikhlas, El-Felek dhe En-Nas — secilën tri herë në mëngjes dhe mbrëmje për mbrojtje të plotë.", sqNote:"Mjaftojnë për çdo gjë. — Ebu Daud", src:"Abu Dawud 5082",
    note:"Sufficient for everything. — Abu Dawud" },

  // ── AFTER PRAYER ────────────────────────────────────────────────
  { cat:"Prayer", title:"Tasbih, Tahmid, Takbir",
    ar:"سُبْحَانَ اللَّهِ (٣٣×) ۝ الْحَمْدُ لِلَّهِ (٣٣×) ۝ اللَّهُ أَكْبَرُ (٣٣×)",
    tr:"Subḥāna Allāh (33×) · Al-ḥamdu lillāh (33×) · Allāhu akbar (33×)",
    en:"Glory be to Allah (33×) · All praise be to Allah (33×) · Allah is the Greatest (33×). Complete to 100: 'Lā ilāha illā Allāhu waḥdahu lā sharīka lah, lahu al-mulku wa-lahu al-ḥamd, wa-huwa ʿalā kulli shayʾin qadīr.'",
    sqTitle:"Tesbih, Tehmid, Tekbir", sq:"Subhanallah (33×) · Elhamdulilah (33×) · Allahu Ekber (33×). Plotëso 100: 'La ilahe il-Allah uahdehu la sherike leh, lehul-mulku ue lehul-hamdu ue hue ala kul-li shejin kadir.'", src:"Muslim 597" },
  { cat:"Prayer", title:"Ayatul Kursi",
    ar:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    tr:"Allāhu lā ilāha illā huwa al-ḥayyu al-qayyūm, lā taʾkhudhuhū sinatun wa-lā nawm…",
    en:"Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and earth… He is the Most High, the Most Great.",
    sqTitle:"Ajeti Kursij", sq:"Allahu — nuk ka të adhuruar tjetër me të drejtë pos Tij, të Gjallë e të Vetëmbajtësit. Nuk e kap kotsia e as gjumi. I Tij është gjithçka në qiej dhe tokë… Ai është i Larti, Madhërishmi.", sqNote:"Kush e lexon pas çdo namazi — asgjë nuk e pengon të hyjë në Xhenet përveç vdekjes. — Nesai 9928", src:"Quran 2:255",
    note:"Whoever recites this after every prayer — nothing prevents him from entering Paradise except death. — Nasai 9928" },
  { cat:"Prayer", title:"Dua After Prayer",
    ar:"اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    tr:"Allāhumma aʿinnī ʿalā dhikrika wa-shukrika wa-ḥusni ʿibādatik",
    en:"O Allah, help me to remember You, to give thanks to You, and to worship You in the best manner.",
    sqTitle:"Dua pas Namazit", sq:"O Allah, më ndihmo të të kujtoj Ty, të të falënderoj Ty dhe të të adhuroj Ty në mënyrën më të mirë.", sqNote:"Profeti ﷺ ia këshilloi Muadh ibn Xhebelit ta thotë pas çdo namazi.", src:"Abu Dawud 1522",
    note:"The Prophet ﷺ advised Muadh ibn Jabal to say this after every prayer." },

  // ── MEALS ────────────────────────────────────────────────────────
  { cat:"Meals", title:"Before Eating",
    ar:"بِسْمِ اللَّهِ",
    tr:"Bismillāh",
    en:"In the name of Allah.",
    sqTitle:"Para Ngrënies", sq:"Me emrin e Allahut.", sqNote:"Nëse harron, kur ta kujtosh thuaj: 'Bismil-lahi fi evel-lihi ue ahirihi' — Me emrin e Allahut në fillim dhe fund.", src:"Abu Dawud 3767",
    note:"If you forget, say when you remember: 'Bismillāhi fī awwalihi wa-ākhirih' — In the name of Allah at its beginning and end." },
  { cat:"Meals", title:"After Eating",
    ar:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    tr:"Al-ḥamdu lillāhi alladhī aṭʿamanī hādhā wa-razaqanīhi min ghayri ḥawlin minnī wa-lā quwwa",
    en:"All praise is for Allah who fed me this and provided it for me without any might or power from myself.",
    sqTitle:"Pas Ngrënies", sq:"Gjithë falënderimi i takon Allahut i cili më ushqeu këtë dhe ma siguroi pa asnjë fuqi e forcë nga ana ime.", sqNote:"Do ti falen mëkatet e kaluara. — Tirmidhi", src:"Tirmidhi 3458",
    note:"His past sins will be forgiven. — Tirmidhi" },
  { cat:"Meals", title:"When Invited to a Meal",
    ar:"اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي",
    tr:"Allāhumma aṭʿim man aṭʿamanī wa-sqī man saqānī",
    en:"O Allah, feed the one who fed me and give drink to the one who gave me drink.",
    sqTitle:"Kur Ftoheris në Darkë", sq:"O Allah, ushqeje atë që me ushqeu dhe jepi të pijë atij që me dha të pija.", src:"Muslim 2055" },

  // ── HOME ─────────────────────────────────────────────────────────
  { cat:"Home", title:"Entering the Home",
    ar:"بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    tr:"Bismillāhi walajna, wa-bismillāhi kharajnā, wa-ʿalā Allāhi rabbinā tawakkalnā",
    en:"In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.",
    sqTitle:"Hyrja në Shtëpi", sq:"Me emrin e Allahut hyrëm, me emrin e Allahut dolëm, dhe tek Zoti ynë mbështetemi.", src:"Abu Dawud 5096" },
  { cat:"Home", title:"Leaving the Home",
    ar:"بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    tr:"Bismillāh, tawakkaltu ʿalā Allāh, wa-lā ḥawla wa-lā quwwata illā billāh",
    en:"In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    sqTitle:"Dalja nga Shtëpia", sq:"Me emrin e Allahut, u mbështeta tek Allahu, dhe nuk ka fuqi e force vetëm se me Allahun.", sqNote:"Do ti thuhet: 'Ti je i udhëzuar, i mbrojtur dhe i ruajtur.' Djalli nuk do ti afrohet. — Ebu Daud", src:"Abu Dawud 5095",
    note:"It will be said: 'You are guided, defended and protected.' The devil will not come near him. — Abu Dawud" },

  // ── SLEEP ─────────────────────────────────────────────────────────
  { cat:"Sleep", title:"Before Sleeping",
    ar:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    tr:"Bismika Allāhumma amūtu wa-aḥyā",
    en:"In Your name, O Allah, I die and I live.",
    sqTitle:"Para Gjumit", sq:"Me emrin Tënd, o Allah, vdes dhe jetoj.", src:"Bukhari 6324" },
  { cat:"Sleep", title:"Protection Before Sleep",
    ar:"اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    tr:"Allāhumma qinī ʿadhābaka yawma tabʿathu ʿibādak",
    en:"O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
    sqTitle:"Mbrojtja Para Gjumit", sq:"O Allah, ruaj ma nga dënimi Yt ditën kur do t'i ringjallësh robërit e Tu.", sqNote:"Thuaje 3 herë kur shtrihesh mbi anën e djathtë.", src:"Abu Dawud 5045",
    note:"Say 3 times when lying down on your right side." },
  { cat:"Sleep", title:"Tasbeeh Before Sleep",
    ar:"سُبْحَانَ اللَّهِ (٣٣×) ۝ الْحَمْدُ لِلَّهِ (٣٣×) ۝ اللَّهُ أَكْبَرُ (٣٤×)",
    tr:"Subḥāna Allāh (33×) · Al-ḥamdu lillāh (33×) · Allāhu akbar (34×)",
    en:"Glory be to Allah 33 times, All Praise to Allah 33 times, Allah is Greatest 34 times — before sleeping.",
    sqTitle:"Tesbih Para Gjumit", sq:"Subhanallah 33 herë, Elhamdulilah 33 herë, Allahu Ekber 34 herë — para gjumit.", sqNote:"Kjo është me e mirë për ty sesa një shërbëtor. — Bukhāri", src:"Bukhari 5362",
    note:"This is better for you than a servant. — Bukhari" },

  // ── TRAVEL ───────────────────────────────────────────────────────
  { cat:"Travel", title:"Entering a Vehicle",
    ar:"سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    tr:"Subḥāna alladhī sakhkhara lanā hādhā wa-mā kunnā lahu muqrinīna wa-innā ilā rabbinā lamunqalibūn",
    en:"Glory to Him Who subjected this to us, for we could never have done so by our own power. And indeed, to our Lord we shall return.",
    sqTitle:"Hyrja në Mjet", sq:"Lëvduar qoftë Ai i Cili na e nënshtroi këtë — ne nuk do të kishim mundur ta ndoshim vetë — dhe me të vërtetë ne tek Zoti ynë do të kthehemi.", src:"Quran 43:13–14 · Abu Dawud 2602" },
  { cat:"Travel", title:"Dua for a Journey",
    ar:"اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ",
    tr:"Allāhumma innā nasʾaluka fī safarinā hādhā al-birra wa-l-taqwā, wa-mina al-ʿamali mā tarḍā, Allāhumma hawwin ʿalaynā safaranā hādhā waṭwi ʿannā buʿdah, Allāhumma anta al-ṣāḥibu fī al-safar wal-khalīfatu fī al-ahl",
    en:"O Allah, we ask You on this journey for righteousness, piety, and deeds that please You. O Allah, make this journey easy for us and shorten its distance. O Allah, You are the Companion in travel and the Guardian of the family.",
    sqTitle:"Dua për Udhëtim", sq:"O Allah, ne po të lusim në këtë udhëtim tonin për mirësi dhe devotshmëri, dhe vepra që Ti i ke të kënaqura. O Allah, lehtësoje udhëtimin tonë dhe shkurtoje distancën e tij. O Allah, Ti je shoku në udhëtim dhe kujdestari i familjes.", src:"Muslim 1342" },

  // ── PROTECTION ───────────────────────────────────────────────────
  { cat:"Protection", title:"Against the Evil Eye",
    ar:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
    tr:"Aʿūdhu bi-kalimāti Allāhi al-tāmmāti min kulli shayṭānin wa-hāmmatin wa-min kulli ʿaynin lāmmah",
    en:"I seek refuge in the perfect words of Allah from every devil and harmful creature, and from every evil eye.",
    sqTitle:"Kundër Syrit të Keq", sq:"Kërkoj strehim tek fjalët e Allahut të plota nga çdo djall dhe krijesë e dëmshme, dhe nga çdo sy i keq.", sqNote:"Profeti ﷺ e lexonte për Hasanin dhe Husejnin me këto fjalë.", src:"Bukhari 3371",
    note:"The Prophet ﷺ used to seek Allah's protection for al-Hasan and al-Husain with these words." },
  { cat:"Protection", title:"Morning & Evening Shield",
    ar:"حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    tr:"Ḥasbiya Allāhu lā ilāha illā huwa ʿalayhi tawakkaltu wa-huwa rabbu al-ʿarshi al-ʿaẓīm",
    en:"Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
    sqTitle:"Mburojë Mëngjesi e Mbrëmje", sq:"Më mjafton Allahu — nuk ka të adhuruar tjetër me të drejtë pos Tij. Tek Ai u mbështeta dhe Ai është Zoti i Arshit të Madhërishëm.", sqNote:"Mjafton për atë që e thotë 7 herë në mëngjes dhe mbrëmje. — Ebu Daud", src:"Quran 9:129 · Abu Dawud 5081",
    note:"Sufficient for whoever says it 7 times morning and evening. — Abu Dawud" },
  { cat:"Protection", title:"Seeking Refuge from Four Things",
    ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    tr:"Allāhumma innī aʿūdhu bika mina al-hammi wal-ḥazani, wa-aʿūdhu bika mina al-ʿajzi wal-kasali, wa-aʿūdhu bika mina al-jubni wal-bukhli, wa-aʿūdhu bika min ghalabati al-dayni wa-qahri al-rijāl",
    en:"O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, and from the burden of debt and the domination of men.",
    sqTitle:"Strehim nga Katër Gjëra", sq:"O Allah, kërkoj strehim tek Ti nga pikëllimi dhe trishtimi, nga paaftësia dhe përtacia, nga frika dhe kopracia, dhe nga barrësia e borxhit dhe sundimi i njerëzve.", src:"Bukhari 6369" },

  // ── DISTRESS ─────────────────────────────────────────────────────
  { cat:"Distress", title:"Dua of Prophet Yunus ﷺ",
    ar:"لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    tr:"Lā ilāha illā anta subḥānaka innī kuntu mina al-ẓālimīn",
    en:"There is none worthy of worship except You, glory be to You. Indeed, I have been among the wrongdoers.",
    sqTitle:"Dua e Profetit Junus ﷺ", sq:"Nuk ka të adhuruar tjetër me të drejtë pos Teje — lëvduar qoftë Ti! Me të vërtetë unë qeshë nga të padrejtët.", sqNote:"Asnjë musliman nuk i lutet Allahut me këto fjalë në asnjë çështje vetëm se Allahu i përgjigjet. — Tirmidhi", src:"Quran 21:87 · Tirmidhi 3505",
    note:"No Muslim calls upon Allah with these words in any matter except that Allah responds to him. — Tirmidhi" },
  { cat:"Distress", title:"Dua for Anxiety and Grief",
    ar:"اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدِكَ وَابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ... أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجِلَاءَ حُزْنِي وَذَهَابَ هَمِّي",
    tr:"Allāhumma innī ʿabduka wa-bnu ʿabdika wa-bnu amatik, nāṣiyatī bi-yadik… an tajʿala al-Qurʾāna rabīʿa qalbī wa-nūra ṣadrī wa-jalāʾa ḥuznī wa-dhahāba hammī",
    en:"O Allah, I am Your servant, son of Your servant, son of Your female servant. My forelock is in Your hand… I ask You by every name belonging to You to make the Quran the spring of my heart, the light of my chest, the reliever of my distress, and the remover of my anxiety.",
    sqTitle:"Dua për Ankth dhe Trishtim", sq:"O Allah, unë jam robi Yt dhe biri i robit Tënd dhe i robëreshës Tënde. Balli im është në dorën Tënde… të lutem me çdo emër që Ti e ke — ta bësh Kuranin pranverën e zemrës sime, dritën e gjoksit tim, largimin e trishtimit tim dhe heqjen e brengës sime.", sqNote:"Allahu do ta largojë pikëllimin dhe trishtimin e tij dhe do ta zëvendësojë me gëzim. — Ahmad", src:"Ahmad 3712",
    note:"Allah will remove his distress and grief and replace it with joy. — Ahmad" },
  { cat:"Distress", title:"Dua When Overwhelmed",
    ar:"حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    tr:"Ḥasbunā Allāhu wa-niʿma al-wakīl",
    en:"Allah is sufficient for us, and He is the best Disposer of affairs.",
    sqTitle:"Dua kur Rëndon Barra", sq:"Na mjafton Allahu dhe sa i mrekullueshëm është Kujdestari.", sqNote:"Kjo ishte fjala e Ibrahimit ﷺ kur u hodh në zjarr, dhe e Muhamedit ﷺ kur iu tregua se një ushtri e madhe ishte mbledhur kundër tij.", src:"Quran 3:173",
    note:"This was the saying of Ibrahim ﷺ when cast into the fire, and Muhammad ﷺ when told a great army had gathered against him." },

  // ── GENERAL ─────────────────────────────────────────────────────
  { cat:"General", title:"Istighfar",
    ar:"أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    tr:"Astaghfiru Allāha alladhī lā ilāha illā huwa al-ḥayyu al-qayyūmu wa-atūbu ilayh",
    en:"I seek forgiveness from Allah, there is none worthy of worship but He, the Ever-Living, the Self-Subsisting, and I turn to Him in repentance.",
    sqTitle:"Istigfar", sq:"I kërkoj falje Allahut — nuk ka të adhuruar tjetër me të drejtë pos Tij, të Gjallë e të Vetëmbajtësit — dhe kthehem tek Ai me pendim.", sqNote:"Mëkatet do ti falen edhe nëse do të ishin si shkuma e detit. — Ebu Daud", src:"Abu Dawud 1517",
    note:"Sins will be forgiven even if they were like the foam of the sea. — Abu Dawud" },
  { cat:"General", title:"Salawat upon the Prophet ﷺ",
    ar:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    tr:"Allāhumma ṣalli ʿalā Muḥammad wa-ʿalā āli Muḥammad kamā ṣallayta ʿalā Ibrāhīm wa-ʿalā āli Ibrāhīm, innaka ḥamīdun majīd",
    en:"O Allah, send blessings upon Muhammad and upon the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
    sqTitle:"Salavati mbi Profetin ﷺ", sq:"O Allah, dërgo bekime mbi Muhamedin dhe mbi familjen e Muhamedit siç dërgove bekime mbi Ibrahimin dhe mbi familjen e Ibrahimit. Me të vërtetë, Ti je i Lavdëruari, i Nderuari.", src:"Bukhari 3370" },
  { cat:"General", title:"For Parents",
    ar:"رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
    tr:"Rabbi ighfir lī wa-liwālidayya wa-liman dakhala baytiya muʾminan wa-lil-muʾminīna wal-muʾmināt",
    en:"My Lord, forgive me and my parents and whoever enters my house as a believer and all the believing men and women.",
    sqTitle:"Për Prindërit", sq:"Zoti im, më fal mua dhe prindërit e mi dhe atë që hyn në shtëpinë time si besimtar, dhe të gjithë besimtarët dhe besimtaret.", src:"Quran 71:28" },
  { cat:"General", title:"Good in This Life and the Next",
    ar:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    tr:"Rabbanā ātinā fī al-dunyā ḥasanatan wa-fī al-ākhirati ḥasanatan wa-qinā ʿadhāba al-nār",
    en:"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    sqTitle:"Mirësia në Dy Botë", sq:"Zoti ynë, na jep mirësi në këtë botë dhe mirësi në Botën Tjetër, dhe na ruaj nga dënimi i Zjarrit.", sqNote:"Profeti ﷺ lutej me këtë me shpesh. — Bukhāri", src:"Quran 2:201 · Bukhari 6389",
    note:"The Prophet ﷺ supplicated with this most frequently. — Bukhari" },
  { cat:"General", title:"For Knowledge",
    ar:"رَبِّ زِدْنِي عِلْمًا",
    tr:"Rabbi zidnī ʿilmā",
    en:"My Lord, increase me in knowledge.",
    sqTitle:"Për Dije", sq:"Zoti im, më shto dituri.", src:"Quran 20:114" },
  { cat:"General", title:"For Guidance and Steadfastness",
    ar:"اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي",
    tr:"Allāhumma ihdinī wa-saddidnī",
    en:"O Allah, guide me and make me steadfast.",
    sqTitle:"Për Udhëzim dhe Qëndrueshmëri", sq:"O Allah, udhëzomëni dhe bëni mëi vendosur.", src:"Muslim 2725" },
];

// ─── DUA PAGE ──────────────────────────────────────────────────────
// Category metadata for the grid view
const DUA_CAT_META = {
  Morning:    { icon: "☀️", sqLabel: "Mëngjes",   color: "#e8a020" },
  Evening:    { icon: "🌙", sqLabel: "Mbrëmje",   color: "#6b7fba" },
  Prayer:     { icon: "🕌", sqLabel: "Namaz",     color: "#2e8b57" },
  Meals:      { icon: "🍽️", sqLabel: "Ushqim",    color: "#c0603a" },
  Home:       { icon: "🏠", sqLabel: "Shtëpi",    color: "#8b5e3c" },
  Sleep:      { icon: "🌙", sqLabel: "Gjumë",     color: "#4a5580" },
  Travel:     { icon: "✈️", sqLabel: "Udhëtim",   color: "#1a8fa0" },
  Protection: { icon: "🛡️", sqLabel: "Mbrojtje",  color: "#6b4a9a" },
  Distress:   { icon: "🤲", sqLabel: "Vështirësi",color: "#b85c5c" },
  General:    { icon: "📿", sqLabel: "Të tjera",  color: "#5a7a5a" },
};

function DuaPage({ favs = new Set(), onFav = () => {} }) {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");
  // null = category grid view; "Saved" or cat name = list view
  const [cat, setCat] = useState(null);
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);
  const ARABIC_F = "'Amiri', 'Traditional Arabic', serif";

  const CONTENT_CATS = Object.keys(DUA_CAT_META); // ordered category list, no "All"

  const filtered = cat === "Saved"
    ? DUAS.filter((d, i) => favs.has(d.cat + "-" + i))
    : DUAS.filter(d => d.cat === cat);

  function copy(dua, id) {
    const translation = isSq && dua.sq ? dua.sq : dua.en;
    const text = `${dua.ar}\n\n${dua.tr}\n\n${translation}\n— ${dua.src}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id); setTimeout(() => setCopied(null), 1600);
    }).catch(() => {});
  }

  const savedCount = DUAS.filter((d, i) => favs.has(d.cat + "-" + i)).length;

  // ── Category grid (landing view) ───────────────────────────────
  if (cat === null) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <PageTitle icon="dua" title={t("dua.title")} sub={t("dua.sub")} />

        {/* Saved shortcut */}
        {savedCount > 0 && (
          <button
            onClick={() => { setCat("Saved"); setOpen(null); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", marginBottom: 20,
              background: GREEN_L, border: `1px solid ${GOLD}40`,
              borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0ead0"}
            onMouseLeave={e => e.currentTarget.style.background = GREEN_L}
          >
            <span style={{ fontSize: 22 }}>♥</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, fontFamily: SERIF }}>{t("dua.saved")}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{savedCount} {isSq ? "lutje të ruajtura" : "saved duas"}</div>
            </div>
            <span style={{ color: MUTED, fontSize: 16 }}>›</span>
          </button>
        )}

        {/* Category grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {CONTENT_CATS.map(c => {
            const meta = DUA_CAT_META[c];
            const count = DUAS.filter(d => d.cat === c).length;
            return (
              <button
                key={c}
                onClick={() => { setCat(c); setOpen(null); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "20px 12px",
                  background: SURFACE, border: `1px solid ${BORDER}`,
                  borderRadius: "var(--radius-md)", cursor: "pointer",
                  transition: "all 0.15s", textAlign: "center",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = GREEN_L; e.currentTarget.style.borderColor = GOLD + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = SURFACE; e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 26, lineHeight: 1 }}>{meta.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: SERIF, letterSpacing: "0.02em" }}>
                    {isSq ? meta.sqLabel : c}
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{count} {isSq ? "lutje" : "duas"}</div>
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: MUTED, textAlign: "center", letterSpacing: "0.04em" }}>
          {t("dua.hint")}
        </p>
      </div>
    );
  }

  // ── Dua list view (category selected) ──────────────────────────
  const meta = DUA_CAT_META[cat];
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      {/* Back header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => { setCat(null); setOpen(null); }}
          style={{
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-sm)",
            cursor: "pointer", color: MUTED, padding: "6px 14px",
            fontSize: 13, display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
        >‹ {isSq ? "Kategoritë" : "Categories"}</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          {cat !== "Saved" && <span style={{ fontSize: 22 }}>{meta?.icon}</span>}
          {cat === "Saved" && <span style={{ fontSize: 22, color: GOLD }}>♥</span>}
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontFamily: SERIF, color: TEXT, letterSpacing: "0.04em" }}>
              {cat === "Saved" ? t("dua.saved") : (isSq ? meta?.sqLabel : cat)}
            </h2>
            <div style={{ fontSize: 11, color: MUTED }}>{filtered.length} {isSq ? "lutje" : "duas"}</div>
          </div>
        </div>
      </div>

      {/* Dua cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filtered.map((dua, i) => {
          const id = `${dua.cat}-${i}`;
          const origIdx = DUAS.indexOf(dua);
          const favId = `${dua.cat}-${origIdx}`;
          const isFav = favs.has(favId);
          const isOpen = open === id;
          return (
            <div key={id} className="glass-card" style={{ borderRadius: "var(--radius-sm)", marginBottom: 2, background: isOpen ? "#faf5ec" : SURFACE, border: `1px solid ${isOpen ? GOLD+"40" : BORDER}`, transition: "all 0.2s" }}>
              <button onClick={() => setOpen(isOpen ? null : id)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: TEXT, fontFamily: SERIF, letterSpacing: "0.02em" }}>{isSq && dua.sqTitle ? dua.sqTitle : dua.title}</div>
                </div>
                <span style={{ color: MUTED, fontSize: 11, flexShrink: 0, marginLeft: 12 }}>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 20px" }}>
                  <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD}40,transparent)`, marginBottom: 18 }} />
                  {/* Arabic */}
                  <div style={{ fontFamily: ARABIC_F, fontSize: 22, color: GOLD, direction: "rtl", lineHeight: 2.4, marginBottom: 16, textAlign: "right" }}>
                    {dua.ar}
                  </div>
                  {/* Transliteration */}
                  <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic", marginBottom: 12, lineHeight: 1.8, borderLeft: `2px solid ${BORDER}`, paddingLeft: 12 }}>
                    {dua.tr}
                  </div>
                  {/* Translation */}
                  <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.75, marginBottom: 14 }}>
                    {isSq && dua.sq ? dua.sq : dua.en}
                  </div>
                  {/* Note */}
                  {(isSq ? (dua.sqNote || dua.note) : dua.note) && (
                    <div style={{ fontSize: 12, color: GOLD, background: GREEN_L, border: `1px solid ${GOLD}30`, borderRadius: "var(--radius-sm)", padding: "9px 14px", marginBottom: 14, lineHeight: 1.65 }}>
                      ✦ {isSq && dua.sqNote ? dua.sqNote : dua.note}
                    </div>
                  )}
                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.04em" }}>📖 {dua.src}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => onFav(favId)} title={isFav ? "Remove from saved" : "Save"} style={{
                        background: "none", border: "1px solid " + (isFav ? GOLD + "60" : BORDER),
                        borderRadius: "var(--radius-sm)", padding: "4px 10px", fontSize: 14, color: isFav ? GOLD : MUTED,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>{isFav ? "♥" : "♡"}</button>
                      <button onClick={() => copy(dua, id)} style={{
                        background: "none", border: "1px solid " + (copied===id ? GOLD : BORDER),
                        borderRadius: "var(--radius-sm)", padding: "4px 14px", fontSize: 11, color: copied===id ? GOLD : MUTED,
                        cursor: "pointer", fontFamily: SANS, letterSpacing: "0.06em", transition: "all 0.15s",
                      }}>{copied===id ? t("dua.copied") : t("dua.copy")}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {cat === "Saved" && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>♡</div>
          <div style={{ fontSize: 13, letterSpacing: "0.04em" }}>{t("dua.noSaved")}</div>
        </div>
      )}
    </div>
  );
}

// ─── 99 NAMES DATA ────────────────────────────────────────────────
const ASMA = [
  {n:1,  ar:"ٱللَّهُ",                         tr:"Allāh",          en:"Allah", sq:"Emri me i Madhërishëm — i vetmi që meriton gjithë adhurim dhe devotshmëri.",                    m:"The Greatest Name — the only one deserving all worship and devotion."},
  {n:2,  ar:"ٱلرَّحْمَٰنُ",                     tr:"Ar-Raḥmān",     en:"The Most Gracious", sq:"Ai Meshira e të Cilit përfshin gjithë krijimin në këtë botë.",        m:"The One whose mercy encompasses all creation in this world."},
  {n:3,  ar:"ٱلرَّحِيمُ",                       tr:"Ar-Raḥīm",      en:"The Most Merciful", sq:"Ai Meshira e të Cilit e veçantë është rezervuar për besimtarët në Botën Tjetër.",        m:"The One whose special mercy is reserved for the believers in the Hereafter."},
  {n:4,  ar:"ٱلْمَلِكُ",                        tr:"Al-Malik",       en:"The King", sq:"Zotëruesi Sovran që zotëron gjithë krijimin dhe nuk i detyrohet askujt.",                 m:"The Sovereign Lord who owns all creation and owes nothing to anyone."},
  {n:5,  ar:"ٱلْقُدُّوسُ",                       tr:"Al-Quddūs",     en:"The Holy", sq:"Ai që është plotësisht i lirë nga të gjitha të metat, defektet dhe papërsosmëritë.",                 m:"The One utterly free from all faults, defects and imperfections."},
  {n:6,  ar:"ٱلسَّلَامُ",                        tr:"As-Salām",       en:"The Source of Peace", sq:"Ai nga i cili zbret paqja dhe i cili dhuron siguri të vërtetë.",      m:"The One from whom peace descends, and who bestows true security."},
  {n:7,  ar:"ٱلْمُؤْمِنُ",                       tr:"Al-Muʾmin",     en:"The Guardian of Faith", sq:"Ai që jep siguri dhe konfirmon robërit e Tij në besim.",    m:"The One who grants security and affirms His servants in faith."},
  {n:8,  ar:"ٱلْمُهَيْمِنُ",                      tr:"Al-Muhaymin",   en:"The Protector", sq:"Ai që mbikëqyr, ruan dhe mbron gjithë krijimin.",            m:"The One who watches over, guards and protects all creation."},
  {n:9,  ar:"ٱلْعَزِيزُ",                        tr:"Al-ʿAzīz",      en:"The Almighty", sq:"I Papërzishmi i Madhërishëm, i pamposhtur dhe i pamundur të ngadhënjehet.",             m:"The Incomparably Great, invincible and impossible to overpower."},
  {n:10, ar:"ٱلْجَبَّارُ",                       tr:"Al-Jabbār",     en:"The Compeller", sq:"Ai që detyron, rivendos të thyerin dhe nënshtron gjithçka.",            m:"The One who compels, restores the broken and subdues all."},
  {n:11, ar:"ٱلْمُتَكَبِّرُ",                     tr:"Al-Mutakabbir", en:"The Supreme", sq:"Ai që është Madhërishëm dhe mbi gjithë krijimin e Tij.",              m:"The One who is supremely great and above all His creation."},
  {n:12, ar:"ٱلْخَالِقُ",                        tr:"Al-Khāliq",     en:"The Creator", sq:"Ai që sjell ekzistencën nga joekzistenca.",              m:"The One who brings existence out of non-existence."},
  {n:13, ar:"ٱلْبَارِئُ",                        tr:"Al-Bāriʾ",      en:"The Originator", sq:"Ai që krijon qeniet e formuara saktë dhe të përsosura.",           m:"The One who creates beings distinctly fashioned and perfectly formed."},
  {n:14, ar:"ٱلْمُصَوِّرُ",                       tr:"Al-Muṣawwir",  en:"The Fashioner", sq:"Ai që i jep çdo krijimi formën e tij unike dhe dalluese.",            m:"The One who gives every creation its unique and distinct form."},
  {n:15, ar:"ٱلْغَفَّارُ",                        tr:"Al-Ghaffār",    en:"The Forgiving", sq:"Ai që fal vazhdimisht — duke mbuluar mëkatet herë pas here.",            m:"The One who forgives repeatedly — covering sins time after time."},
  {n:16, ar:"ٱلْقَهَّارُ",                        tr:"Al-Qahhār",     en:"The Subduer", sq:"Ai që sundon çdo gjë dhe nuk mund të ngadhënjehet.",              m:"The One who dominates everything and cannot be overcome."},
  {n:17, ar:"ٱلْوَهَّابُ",                        tr:"Al-Wahhāb",     en:"The Bestower", sq:"Ai që jep bujarisht pa pritur asgjë në këmbim.",             m:"The One who gives generously without expecting anything in return."},
  {n:18, ar:"ٱلرَّزَّاقُ",                        tr:"Ar-Razzāq",     en:"The Provider", sq:"Ai që siguron gjithë ushqimin — të dukshëm dhe të padukshëm.",             m:"The One who provides all sustenance — seen and unseen."},
  {n:19, ar:"ٱلْفَتَّاحُ",                        tr:"Al-Fattāḥ",     en:"The Opener", sq:"Ai që hap gjithçka që është e mbyllur — dyer, zemra dhe fitore.",               m:"The One who opens all that is closed — doors, hearts and victories."},
  {n:20, ar:"ٱلْعَلِيمُ",                         tr:"Al-ʿAlīm",      en:"The All-Knowing", sq:"Ai dija e të Cilit përfshin çdo gjë të dukshme dhe të fshehur.",          m:"The One whose knowledge encompasses every manifest and hidden thing."},
  {n:21, ar:"ٱلْقَابِضُ",                         tr:"Al-Qābiḍ",      en:"The Restrainer", sq:"Ai që ndalon, kufizon dhe merr siç do.",           m:"The One who withholds, constricts and seizes as He wills."},
  {n:22, ar:"ٱلْبَاسِطُ",                         tr:"Al-Bāsiṭ",      en:"The Expander", sq:"Ai që zgjeron, pasuron dhe hap siç do.",             m:"The One who expands, enriches and opens as He wills."},
  {n:23, ar:"ٱلْخَافِضُ",                         tr:"Al-Khāfiḍ",     en:"The Abaser", sq:"Ai që poshtëron dhe përul kë do.",               m:"The One who lowers and humbles whom He wills."},
  {n:24, ar:"ٱلرَّافِعُ",                          tr:"Ar-Rāfiʿ",      en:"The Exalter", sq:"Ai që ngre dhe nderoi kë do.",              m:"The One who raises and elevates to honour whom He wills."},
  {n:25, ar:"ٱلْمُعِزُّ",                          tr:"Al-Muʿizz",     en:"The Bestower of Honour", sq:"Ai që jep nder, dinjitet dhe forcë kë do.",   m:"The One who gives honour, dignity and strength to whom He wills."},
  {n:26, ar:"ٱلْمُذِلُّ",                          tr:"Al-Mudhill",    en:"The Humiliator", sq:"Ai që poshtëron dhe nënshtron të kryelartët dhe të padrejtët.",           m:"The One who abases and humiliates the arrogant and unjust."},
  {n:27, ar:"ٱلسَّمِيعُ",                          tr:"As-Samīʿ",      en:"The All-Hearing", sq:"Ai që dëgjon çdo zë — afër dhe larg, me zë dhe me fshehurazi.",          m:"The One who hears every sound — near and far, loud and whispered."},
  {n:28, ar:"ٱلْبَصِيرُ",                          tr:"Al-Baṣīr",      en:"The All-Seeing", sq:"Ai që sheh të gjitha gjërat — të dukshme dhe të fshehura, të mëdha dhe të vogla.",           m:"The One who sees all things — manifest and hidden, large and small."},
  {n:29, ar:"ٱلْحَكَمُ",                           tr:"Al-Ḥakam",      en:"The Judge", sq:"Ai që gjykon midis krijimit me drejtësi absolute.",                m:"The One who judges between creation with absolute justice."},
  {n:30, ar:"ٱلْعَدْلُ",                           tr:"Al-ʿAdl",       en:"The Just", sq:"Ai që është plotësisht i drejtë në të gjitha dekretet dhe gjykimet e Tij.",                 m:"The One who is perfectly equitable in all His decrees and judgements."},
  {n:31, ar:"ٱللَّطِيفُ",                          tr:"Al-Laṭīf",      en:"The Subtle", sq:"Ai që është i butë, zemërmirë dhe i ndërgjegjshëm për detajet me të hollë të krijimit.",               m:"The One who is kind, gentle and aware of the finest details of creation."},
  {n:32, ar:"ٱلْخَبِيرُ",                          tr:"Al-Khabīr",     en:"The All-Aware", sq:"Ai i plotpajisur me njohuri për të gjitha punët e brendshme dhe hollësitë e fshehura.",            m:"The One fully aware of all inner affairs and hidden subtleties."},
  {n:33, ar:"ٱلْحَلِيمُ",                          tr:"Al-Ḥalīm",      en:"The Forbearing", sq:"Ai që nuk nxiton ndëshkimin pavarësisht se ka fuqi të plotë për ta bërë.",           m:"The One who does not hasten punishment despite having full power to do so."},
  {n:34, ar:"ٱلْعَظِيمُ",                          tr:"Al-ʿAẓīm",      en:"The Magnificent", sq:"Ai Madhërishëm i suprematisë në të gjitha atributet — përtej çdo kuptimi.",          m:"The One supremely great in all attributes — beyond any comprehension."},
  {n:35, ar:"ٱلْغَفُورُ",                          tr:"Al-Ghafūr",     en:"The All-Forgiving", sq:"Ai që fal plotësisht mëkatet e të gjithë atyre që pendohen sinqerisht.",        m:"The One who completely forgives the sins of all who sincerely repent."},
  {n:36, ar:"ٱلشَّكُورُ",                          tr:"Ash-Shakūr",    en:"The Appreciative", sq:"Ai që shpërblen shumë edhe veprat e vogla me shpërblim të madh.",         m:"The One who greatly rewards even small deeds with immense recompense."},
  {n:37, ar:"ٱلْعَلِيُّ",                          tr:"Al-ʿAliyy",     en:"The Most High", sq:"Ai i ngritur mbi çdo gjë në thelbin dhe atributet e Tij.",            m:"The One exalted above everything in His essence and attributes."},
  {n:38, ar:"ٱلْكَبِيرُ",                          tr:"Al-Kabīr",      en:"The Most Great", sq:"Ai Madhësia e të Cilit është e pafundme dhe përtej çdo kuptimi.",           m:"The One whose greatness is infinite and beyond all comprehension."},
  {n:39, ar:"ٱلْحَفِيظُ",                          tr:"Al-Ḥafīẓ",     en:"The Preserver", sq:"Ai që mbron, ruan dhe kujdes gjithë krijimin e Tij.",            m:"The One who protects, preserves and guards all His creation."},
  {n:40, ar:"ٱلْمُقِيتُ",                          tr:"Al-Muqīt",      en:"The Nourisher", sq:"Ai që siguron ushqimin dhe ruan jetën për të gjithë.",            m:"The One who provides sustenance and maintains life for all."},
  {n:41, ar:"ٱلْحَسِيبُ",                          tr:"Al-Ḥasīb",      en:"The Reckoner", sq:"Ai që llogaris të gjitha veprat dhe është plotësisht i mjaftueshëm.",             m:"The One who takes account of all deeds and is completely sufficient."},
  {n:42, ar:"ٱلْجَلِيلُ",                          tr:"Al-Jalīl",      en:"The Majestic", sq:"Ai që zotëron madhështi, shkëlqim dhe supremaci.",             m:"The One who possesses grandeur, magnificence and supremacy."},
  {n:43, ar:"ٱلْكَرِيمُ",                          tr:"Al-Karīm",      en:"The Generous", sq:"Ai që jep bujarisht dhe bollshëm pa marrë parasysh meritën.",             m:"The One who gives generously and abundantly without regard to merit."},
  {n:44, ar:"ٱلرَّقِيبُ",                          tr:"Ar-Raqīb",      en:"The Watchful", sq:"Ai që mbikëqyr të gjitha punët e krijimit gjatë gjithë kohës.",             m:"The One who watches over all affairs of creation at all times."},
  {n:45, ar:"ٱلْمُجِيبُ",                          tr:"Al-Mujīb",      en:"The Responsive", sq:"Ai që u përgjigjet dhe i pranon çdo lutjeje të sinqertë.",           m:"The One who answers and responds to every sincere supplication."},
  {n:46, ar:"ٱلْوَاسِعُ",                          tr:"Al-Wāsiʿ",      en:"The Vast", sq:"Ai Meshira, dija dhe bujaria e të Cilit janë të pakufishme dhe të pafundme.",                 m:"The One whose mercy, knowledge and generosity are boundless and infinite."},
  {n:47, ar:"ٱلْحَكِيمُ",                          tr:"Al-Ḥakīm",      en:"The All-Wise", sq:"Ai Urtësia e të Cilit në krijim dhe dekret është absolutisht e përsosur.",             m:"The One whose wisdom in creation and decree is absolutely perfect."},
  {n:48, ar:"ٱلْوَدُودُ",                          tr:"Al-Wadūd",      en:"The Loving", sq:"Ai që i do robërit e Tij të drejtë dhe i cili është i dashur nga ata.",               m:"The One who loves His righteous servants and is loved by them."},
  {n:49, ar:"ٱلْمَجِيدُ",                          tr:"Al-Majīd",      en:"The Glorious", sq:"Ai Gjithëlavdishëm, që zotëron çdo cilësi të përsosjes dhe nderit.",             m:"The One all-glorious, possessing every quality of perfection and honour."},
  {n:50, ar:"ٱلْبَاعِثُ",                          tr:"Al-Bāʿith",     en:"The Resurrector", sq:"Ai që ngre krijimin nga vdekja në Ditën e Ringjalljes.",          m:"The One who raises creation from the dead on the Day of Resurrection."},
  {n:51, ar:"ٱلشَّهِيدُ",                          tr:"Ash-Shahīd",    en:"The Witness", sq:"Ai që dëshmon të gjitha gjërat — asgjë nuk i fshihet.",              m:"The One who witnesses all things — nothing is concealed from Him."},
  {n:52, ar:"ٱلْحَقُّ",                            tr:"Al-Ḥaqq",       en:"The Truth", sq:"Ai që ekziston vërtet dhe domosdoshmërisht — fjala e të Cilit është e vërteta absolute.",                m:"The One who truly and necessarily exists — whose word is absolute truth."},
  {n:53, ar:"ٱلْوَكِيلُ",                          tr:"Al-Wakīl",      en:"The Trustee", sq:"Ai në të cilin vihet besimi i plotë dhe i cili mjafton për të gjitha punët.",              m:"The One in whom full trust is placed and who suffices for all affairs."},
  {n:54, ar:"ٱلْقَوِيُّ",                          tr:"Al-Qawiyy",     en:"The All-Powerful", sq:"Ai që është i përsosur në fuqi — kurrë i dobët apo i lodhur.",         m:"The One who is perfect in strength — never weak or fatigued."},
  {n:55, ar:"ٱلْمَتِينُ",                          tr:"Al-Matīn",      en:"The Firm", sq:"Ai Forca dhe Fuqia e të Cilit nuk shpenzohen apo zvogëlohen kurrë.",                 m:"The One whose strength and might are never exhausted or diminished."},
  {n:56, ar:"ٱلْوَلِيُّ",                          tr:"Al-Waliyy",     en:"The Protecting Friend", sq:"Ai që është aleat dhe mbrojtës i besimtarëve.",    m:"The One who is the ally and protector of the believers."},
  {n:57, ar:"ٱلْحَمِيدُ",                          tr:"Al-Ḥamīd",      en:"The Praiseworthy", sq:"Ai që meriton gjithë lavdërim me thelbin e Tij dhe të gjitha veprimet e Tij.",         m:"The One who deserves all praise by His very essence and all His actions."},
  {n:58, ar:"ٱلْمُحْصِي",                          tr:"Al-Muḥṣī",      en:"The Counter", sq:"Ai që numëron dhe regjistron të gjitha gjërat me saktësi të përsosur.",              m:"The One who counts and records all things with perfect precision."},
  {n:59, ar:"ٱلْمُبْدِئُ",                         tr:"Al-Mubdiʾ",     en:"The Originator", sq:"Ai që filloi krijimin nga hiçi, pa precedent.",           m:"The One who started creation from nothing, without precedent."},
  {n:60, ar:"ٱلْمُعِيدُ",                          tr:"Al-Muʿīd",      en:"The Restorer", sq:"Ai që do ti rivendosë dhe riketë gjithë krijimin pas vdekjes.",             m:"The One who will restore and recreate all creation after death."},
  {n:61, ar:"ٱلْمُحْيِي",                          tr:"Al-Muḥyī",      en:"The Giver of Life", sq:"Ai që u jep jetë gjithçkaje që jeton.",        m:"The One who grants life to everything that lives."},
  {n:62, ar:"ٱلْمُمِيتُ",                          tr:"Al-Mumīt",      en:"The Taker of Life", sq:"Ai që merr shpirtrat e krijimit në kohën e tyre të caktuar.",        m:"The One who takes the souls of creation at their appointed time."},
  {n:63, ar:"ٱلْحَيُّ",                            tr:"Al-Ḥayy",       en:"The Ever-Living", sq:"Ai Jeta e të Cilit nuk ka fillim, fund apo ndërprerje.",          m:"The One whose life has no beginning, no end, and no interruption."},
  {n:64, ar:"ٱلْقَيُّومُ",                         tr:"Al-Qayyūm",     en:"The Self-Subsisting", sq:"Ai nga i cili varet gjithë ekzistenca, ndërkohë që Ai nuk varet nga asgjë.",      m:"The One upon whom all existence depends, yet who depends on nothing."},
  {n:65, ar:"ٱلْوَاجِدُ",                          tr:"Al-Wājid",      en:"The Finder", sq:"Ai që gjen dhe percepton gjithçka që dëshiron sipas vullnetit të Tij.",               m:"The One who finds and perceives everything He wishes at will."},
  {n:66, ar:"ٱلْمَاجِدُ",                          tr:"Al-Mājid",      en:"The Noble", sq:"Ai fisnik dhe bujar, plot nder dhe lavdi.",                m:"The One noble and generous, full of honour and glory."},
  {n:67, ar:"ٱلْوَاحِدُ",                          tr:"Al-Wāḥid",      en:"The One", sq:"Ai që është unik dhe pa asnjë partner apo të barabartë.",                  m:"The One who is unique and without any partner or equal."},
  {n:68, ar:"ٱلْأَحَدُ",                           tr:"Al-Aḥad",       en:"The Unique", sq:"Ai që është absolutisht singular, i pandashëm dhe i pakrahasueshëm.",               m:"The One who is absolutely singular, indivisible and incomparable."},
  {n:69, ar:"ٱلصَّمَدُ",                           tr:"Aṣ-Ṣamad",     en:"The Eternal", sq:"Ai nga i cili varen të gjithë, por Ai Vetë nuk varet nga asgjë.",              m:"The One upon whom all depend, but who Himself depends on nothing."},
  {n:70, ar:"ٱلْقَادِرُ",                          tr:"Al-Qādir",      en:"The Capable", sq:"Ai që ka fuqi të plotë mbi çdo gjë pa asnjë kufi.",              m:"The One who has complete power over everything without any limit."},
  {n:71, ar:"ٱلْمُقْتَدِرُ",                       tr:"Al-Muqtadir",   en:"The All-Powerful", sq:"Ai i autoritetit të plotë i cili ekzekuton vullnetin e Tij me fuqi absolute.",         m:"The One of full authority who executes His will with absolute power."},
  {n:72, ar:"ٱلْمُقَدِّمُ",                        tr:"Al-Muqaddim",   en:"The Expediter", sq:"Ai që çon përpara dhe jep përparësi kujt dhe çfarë do.",            m:"The One who brings forward and prioritises whom and what He wills."},
  {n:73, ar:"ٱلْمُؤَخِّرُ",                        tr:"Al-Muʾakhkhir", en:"The Delayer", sq:"Ai që vonon dhe shtyn prapa kujt dhe çfarë do.",              m:"The One who delays and puts back whom and what He wills."},
  {n:74, ar:"ٱلْأَوَّلُ",                          tr:"Al-Awwal",      en:"The First", sq:"Ai Ekzistenca e të Cilit nuk ka fillim — Ai i paraprin gjithçkaje.",                m:"The One whose existence has no beginning — He precedes everything."},
  {n:75, ar:"ٱلْآخِرُ",                            tr:"Al-Ākhir",      en:"The Last", sq:"Ai Ekzistenca e të Cilit nuk ka fund — Ai mbetet pas gjithçkaje.",                 m:"The One whose existence has no end — He remains after everything."},
  {n:76, ar:"ٱلظَّاهِرُ",                          tr:"Aẓ-Ẓāhir",     en:"The Manifest", sq:"Ai që është i dukshëm dhe evident nëpërmjet shenjave dhe krijimit të Tij.",             m:"The One who is apparent and evident through His signs and creation."},
  {n:77, ar:"ٱلْبَاطِنُ",                          tr:"Al-Bāṭin",      en:"The Hidden", sq:"Ai i fshehur nga shikimi dhe shqisat e gjithë krijimit të Tij.",               m:"The One hidden from the sight and senses of all His creation."},
  {n:78, ar:"ٱلْوَالِي",                           tr:"Al-Wālī",       en:"The Governor", sq:"Ai që qeveris dhe administron të gjitha punët e universit.",             m:"The One who governs and manages all affairs of the universe."},
  {n:79, ar:"ٱلْمُتَعَالِي",                       tr:"Al-Mutaʿālī",   en:"The Most Exalted", sq:"Ai i lartë mbi gjithë krijimin dhe çdo përshkrim në Madhërinë e Tij.",         m:"The One far above all creation and any description in His greatness."},
  {n:80, ar:"ٱلْبَرُّ",                            tr:"Al-Barr",       en:"The Source of Goodness", sq:"Ai që është i pafund në mirësi, i drejtë dhe besnik ndaj të gjitha premtimeve të Tij.",   m:"The One who is infinitely kind, righteous and true to all His promises."},
  {n:81, ar:"ٱلتَّوَّابُ",                         tr:"At-Tawwāb",     en:"The Acceptor of Repentance", sq:"Ai që pranon me gëzim dhe vazhdimisht pendimin e robërve të Tij.",m:"The One who repeatedly and joyfully accepts the repentance of His servants."},
  {n:82, ar:"ٱلْمُنْتَقِمُ",                       tr:"Al-Muntaqim",   en:"The Avenger", sq:"Ai që ndëshkon shtypësit dhe keqbërësit me drejtësi të përsosur.",              m:"The One who punishes the oppressors and wrongdoers with perfect justice."},
  {n:83, ar:"ٱلْعَفُوُّ",                          tr:"Al-ʿAfuww",     en:"The Pardoner", sq:"Ai që fshin plotësisht mëkatet — sikur nuk kanë ndodhur kurrë.",             m:"The One who erases sins entirely — as if they never occurred."},
  {n:84, ar:"ٱلرَّءُوفُ",                          tr:"Ar-Raʾūf",      en:"The Most Kind", sq:"Ai plot dhembshuri dhe butësi të thellë për robërit e Tij.",            m:"The One full of the deepest compassion and tenderness for His servants."},
  {n:85, ar:"مَالِكُ ٱلْمُلْكِ",                   tr:"Mālik al-Mulk", en:"Owner of Sovereignty", sq:"Ai që zotëron pronësi absolute dhe ekskluzive të gjithë sundimit.",     m:"The One who possesses absolute and exclusive ownership of all dominion."},
  {n:86, ar:"ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ",       tr:"Dhul-Jalāli wal-Ikrām", en:"Lord of Majesty and Bounty", sq:"Ai që kombinon në mënyrë unike madhësi supreme me bujarim të pafund.", m:"The One who uniquely combines supreme greatness with infinite generosity."},
  {n:87, ar:"ٱلْمُقْسِطُ",                         tr:"Al-Muqsiṭ",     en:"The Equitable", sq:"Ai që është plotësisht i drejtë në të gjitha gjykimet dhe marrëveshjet e Tij.",            m:"The One who is perfectly just in all His judgements and dealings."},
  {n:88, ar:"ٱلْجَامِعُ",                          tr:"Al-Jāmiʿ",      en:"The Gatherer", sq:"Ai që do të mbledhë gjithë krijimin në Ditën e Gjykimit.",             m:"The One who will gather all of creation on the Day of Judgement."},
  {n:89, ar:"ٱلْغَنِيُّ",                          tr:"Al-Ghaniyy",    en:"The Self-Sufficient", sq:"Ai që nuk ka nevojë absolute për asnjë nga krijimi i Tij.",      m:"The One who needs absolutely nothing from any of His creation."},
  {n:90, ar:"ٱلْمُغْنِي",                          tr:"Al-Mughnī",     en:"The Enricher", sq:"Ai që pasuron dhe ngop me bujarinë e Tij kë do.",             m:"The One who enriches and satisfies with His bounty whoever He wills."},
  {n:91, ar:"ٱلْمَانِعُ",                          tr:"Al-Māniʿ",      en:"The Preventer", sq:"Ai që ndalon dhe mbron — duke vendosur çfarë u arrin robërve të Tij.",            m:"The One who withholds and protects — deciding what reaches His servants."},
  {n:92, ar:"ٱلضَّارُّ",                           tr:"Aḍ-Ḍārr",      en:"The Distresser", sq:"Ai që ka fuqi të shkaktojë dëm kur do si pjesë e urtësisë së Tij.",           m:"The One who has power to cause harm when He wills as part of His wisdom."},
  {n:93, ar:"ٱلنَّافِعُ",                          tr:"An-Nāfiʿ",      en:"The Benefiter", sq:"Ai që krijon gjithë dobinë dhe mirësinë për krijimin e Tij siç do.",            m:"The One who creates all benefit and good for His creation as He wills."},
  {n:94, ar:"ٱلنُّورُ",                            tr:"An-Nūr",        en:"The Light", sq:"Ai që është burimi i fundit i gjithë dritës, udhëzimit dhe ndriçimit.",                m:"The One who is the ultimate source of all light, guidance and illumination."},
  {n:95, ar:"ٱلْهَادِي",                           tr:"Al-Hādī",       en:"The Guide", sq:"Ai që udhëzon krijimin e Tij drejt rrugës së drejtë dhe diturisë së vërtetë.",                m:"The One who guides His creation to the right path and true knowledge."},
  {n:96, ar:"ٱلْبَدِيعُ",                          tr:"Al-Badīʿ",      en:"The Incomparable", sq:"Ai që krijoi universin në mënyrë krejt të re dhe të paprecedentë.",         m:"The One who created the universe in a wholly new and unprecedented way."},
  {n:97, ar:"ٱلْبَاقِي",                           tr:"Al-Bāqī",       en:"The Everlasting", sq:"Ai që mbetet përgjithmonë kur gjithçka tjetër pushon dhe shkatërrohet.",          m:"The One who remains forever when all else ceases and perishes."},
  {n:98, ar:"ٱلْوَارِثُ",                          tr:"Al-Wārith",     en:"The Inheritor", sq:"Ai që trashëgon tokën dhe gjithçka mbi të pasi krijimi mbaron.",            m:"The One who inherits the earth and all that is upon it after creation ends."},
  {n:99, ar:"ٱلصَّبُورُ",                          tr:"Aṣ-Ṣabūr",     en:"The Patient", sq:"Ai që është i pafund në durim — kurrë nuk nxiton ndëshkimin përtej afatit të tij.",              m:"The One who is infinitely patient — never rushing punishment beyond its due time."},
];

// ─── 99 NAMES PAGE ────────────────────────────────────────────────
function AsmaPage() {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);
  const ARABIC_F = "'Amiri', 'Traditional Arabic', serif";

  const filtered = !search.trim() ? ASMA : ASMA.filter(a =>
    a.tr.toLowerCase().includes(search.toLowerCase()) ||
    a.en.toLowerCase().includes(search.toLowerCase()) ||
    (a.sq && a.sq.toLowerCase().includes(search.toLowerCase())) ||
    a.m.toLowerCase().includes(search.toLowerCase()) ||
    String(a.n) === search.trim()
  );

  return (
    <div style={{ maxWidth: 940, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="asma" title={t("asma.title")} sub={t("asma.sub")} />

      {/* Quranic verse */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontFamily: ARABIC_F, fontSize: 20, color: GOLD, direction: "rtl", lineHeight: 2 }}>
          وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا
        </div>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 4, letterSpacing: "0.04em" }}>
          {t("asma.verse")}
        </p>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder={t("asma.search")}
        style={{ width:"100%", padding:"10px 14px", background:SURFACE, border:`1px solid ${BORDER}`,
          color:TEXT, fontSize:13, outline:"none", marginBottom:24, fontFamily:SANS, boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor=GOLD}
        onBlur={e => e.target.style.borderColor=BORDER}
      />

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:1, border:`1px solid ${BORDER}` }}>
        {filtered.map(a => (
          <button key={a.n} onClick={() => setSel(sel?.n===a.n ? null : a)} style={{
            background: sel?.n===a.n ? GREEN_L : SURFACE,
            border:"none", borderRight:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`,
            padding:"14px 10px", cursor:"pointer", textAlign:"center", transition:"background 0.15s",
          }}
            onMouseEnter={e => { if(sel?.n!==a.n) e.currentTarget.style.background=GREEN_L; }}
            onMouseLeave={e => { if(sel?.n!==a.n) e.currentTarget.style.background=SURFACE; }}
          >
            <div style={{ fontSize:9, color:sel?.n===a.n ? GOLD : MUTED, letterSpacing:"0.1em", marginBottom:4 }}>{a.n}</div>
            <div style={{ fontFamily:ARABIC_F, fontSize:18, color:sel?.n===a.n ? GOLD : TEXT, lineHeight:1.9, marginBottom:4 }}>{a.ar}</div>
            <div style={{ fontSize:9, color:sel?.n===a.n ? GOLD : MUTED, letterSpacing:"0.07em", textTransform:"uppercase", lineHeight:1.4 }}>{a.tr}</div>
          </button>
        ))}
      </div>

      {/* Modal popup */}
      {sel && (
        <div onClick={() => setSel(null)} style={{
          position:"fixed", inset:0, zIndex:500,
          background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"20px",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:`linear-gradient(135deg,${SURFACE},#f0e8d0)`,
            border:`1px solid ${GOLD}50`,
            boxShadow:`0 24px 80px rgba(160,120,50,0.2), 0 0 0 1px ${GOLD}20`,
            maxWidth:480, width:"100%", padding:"36px 32px",
            position:"relative",
          }}>
            {/* Close button */}
            <button onClick={() => setSel(null)} style={{
              position:"absolute", top:14, right:14,
              background:"none", border:`1px solid ${BORDER}`,
              color:MUTED, width:28, height:28, cursor:"pointer",
              fontSize:13, display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:SANS, borderRadius:2,
            }}>✕</button>

            {/* Number badge */}
            <div style={{ fontSize:10, color:GOLD, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:16 }}>
              {t("asma.nameOf", { n: sel.n })}
            </div>

            {/* Arabic */}
            <div style={{
              fontFamily:ARABIC_F, fontSize:46, color:GOLD,
              lineHeight:1.8, direction:"rtl", textAlign:"center",
              marginBottom:12,
              textShadow:`0 0 40px ${GOLD}40`,
            }}>{sel.ar}</div>

            {/* Divider */}
            <div style={{ height:1, background:`linear-gradient(to right, transparent, ${GOLD}40, transparent)`, marginBottom:16 }} />

            {/* Transliteration + English */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:22, color:TEXT, fontFamily:SERIF, letterSpacing:"0.05em", marginBottom:6 }}>{sel.tr}</div>
              <div style={{ fontSize:13, color:GOLD, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:SANS }}>{sel.en}</div>
            </div>

            {/* Meaning */}
            <div style={{
              background:"rgba(201,168,76,0.06)",
              border:`1px solid ${GOLD}20`,
              padding:"16px 18px",
              fontSize:14, color:TEXT, lineHeight:1.8,
              fontFamily:SANS,
            }}>
              {isSq && sel.sq ? sel.sq : sel.m}
            </div>

            {/* Nav prev/next */}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
              <button
                disabled={sel.n === 1}
                onClick={() => setSel(ASMA[sel.n - 2])}
                style={{
                  background:"none", border:`1px solid ${sel.n === 1 ? BORDER : GOLD + "50"}`,
                  color: sel.n === 1 ? MUTED : GOLD,
                  padding:"6px 16px", cursor: sel.n === 1 ? "default" : "pointer",
                  fontSize:11, fontFamily:SANS, letterSpacing:"0.07em",
                }}>&#8592; Prev</button>
              <button
                disabled={sel.n === 99}
                onClick={() => setSel(ASMA[sel.n])}
                style={{
                  background:"none", border:`1px solid ${sel.n === 99 ? BORDER : GOLD + "50"}`,
                  color: sel.n === 99 ? MUTED : GOLD,
                  padding:"6px 16px", cursor: sel.n === 99 ? "default" : "pointer",
                  fontSize:11, fontFamily:SANS, letterSpacing:"0.07em",
                }}>Next &#8594;</button>
            </div>
          </div>
        </div>
      )}

      <p style={{ marginTop:20, fontSize:12, color:MUTED, textAlign:"center", letterSpacing:"0.04em" }}>
        "Allah has 99 names. Whoever memorises (and acts upon) them all will enter Paradise." — Bukhari 2736 · Muslim 2677
      </p>
    </div>
  );
}

// ─── QURAN ────────────────────────────────────────────────────────
const ARABIC = "'Amiri', 'Traditional Arabic', serif";

// Normalize text for fuzzy search: strip diacritics, apostrophes, hyphens
// So "Ma'un" → "maun", "Raḥmān" → "rahman", "Al-Fātiḥah" → "alfatihah"
function normSearch(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // strip combining diacritics (ā→a, ḥ→h, etc.)
    .replace(/[''ʿʾʻˀ`]/g, "")        // strip Arabic ʿayn, hamza, apostrophe variants
    .replace(/[-]/g, "")               // strip hyphens (Al-Fatiha → Alfatiha)
    .toLowerCase();
}
let _surahCache = null;
// Full-Quran verse index for search — loaded once per session per edition
let _fullVerseCache = null; // { edition: string, verses: [{surahNum,ayahNum,surahName,surahAr,ar,tr,en}] }

function QuranPage() {
  const { t } = useTranslation();
  const isSq = i18n.language?.startsWith("sq");
  const [transEdition, setTransEdition] = useState(isSq ? "sq.nahi" : "en.sahih");
  const [surahs,       setSurahs]       = useState(() => _surahCache || []);
  const [current,      setCurrent]      = useState(null);
  const arabicFontSize = { Small: 20, Normal: 26, Large: 32, "X-Large": 38 }[localStorage.getItem("mp-arabic-font") || "Normal"] || 26;
  const [verses,       setVerses]       = useState([]);
  const [loadingList,  setLoadingList]  = useState(!_surahCache);
  const [loadingRead,  setLoadingRead]  = useState(false);
  const [search,       setSearch]       = useState("");
  const [showTrans,    setShowTrans]     = useState(true);
  const [fromCache,    setFromCache]    = useState(false);
  const [bookmarks,    setBookmarks]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("mp-quran-bkm") || "[]"); } catch { return []; }
  });
  const [fullLoading, setFullLoading] = useState(false);
  const [playingVerse, setPlayingVerse] = useState(null);
  const [reciter, setReciter] = useState("ar.alafasy");
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirVerse, setTafsirVerse] = useState(null);
  const [tafsirText, setTafsirText] = useState("");
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirId, setTafsirId] = useState(169);
  const topRef = useRef(null);
  const vsInputRef = useRef(null);
  const pendingVerseRef = useRef(null);
  const audioRef = useRef(null);
  const tafsirCache = useRef(new Map());
  const [verseSearch, setVerseSearch] = useState("");
  const [vsOpen, setVsOpen]           = useState(false);

  const verseResults = verseSearch.trim().length >= 3
    ? verses.filter(v => {
        const nq = normSearch(verseSearch);
        return v.ar.includes(verseSearch) ||
               normSearch(v.tr).includes(nq) ||
               normSearch(v.en).includes(nq);
      }).slice(0, 30)
    : [];

  function scrollToVerse(n) {
    setVerseSearch("");
    setVsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`verse-${n}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  function toggleBookmark(verse) {
    setBookmarks(prev => {
      const surah = surahs.find(s => s.number === current);
      const key = current + ":" + verse.n;
      const exists = prev.find(b => b.key === key);
      let next;
      if (exists) {
        next = prev.filter(b => b.key !== key);
      } else {
        const entry = {
          key,
          surah: current,
          verse: verse.n,
          surahEn: surah?.englishName || "",
          surahAr: surah?.name || "",
          preview: verse.en ? verse.en.substring(0, 80) + (verse.en.length > 80 ? "…" : "") : "",
          savedAt: Date.now(),
        };
        next = [entry, ...prev].slice(0, 20);
      }
      try { localStorage.setItem("mp-quran-bkm", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function isBookmarked(verseN) {
    return bookmarks.some(b => b.key === current + ":" + verseN);
  }

  function getAudioUrl(globalN) {
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalN}.mp3`;
  }

  function playVerse(v) {
    if (!audioRef.current || !v.globalN) return;
    if (playingVerse?.globalN === v.globalN) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setPlayingVerse(v);
      } else {
        audioRef.current.pause();
        setPlayingVerse(null);
      }
      return;
    }
    audioRef.current.src = getAudioUrl(v.globalN);
    audioRef.current.play().catch(() => {});
    setPlayingVerse(v);
    setTimeout(() => {
      const el = document.getElementById(`verse-${v.n}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }

  function handleAudioEnd() {
    if (!playingVerse) return;
    const idx = verses.findIndex(v => v.globalN === playingVerse.globalN);
    if (idx >= 0 && idx < verses.length - 1) {
      const next = verses[idx + 1];
      if (audioRef.current && next.globalN) {
        audioRef.current.src = getAudioUrl(next.globalN);
        audioRef.current.play().catch(() => {});
        setPlayingVerse(next);
        setTimeout(() => {
          const el = document.getElementById(`verse-${next.n}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } else {
      setPlayingVerse(null);
    }
  }

  async function loadTafsir(v) {
    setTafsirVerse(v);
    setTafsirText("");
    const key = `${tafsirId}:${current}:${v.n}`;
    if (tafsirCache.current.has(key)) {
      setTafsirText(tafsirCache.current.get(key));
      return;
    }
    setTafsirLoading(true);
    try {
      const res = await fetch(`https://api.qurancdn.com/api/qdc/tafsirs/${tafsirId}/by_chapter/${current}`);
      const data = await res.json();
      const verseKey = `${current}:${v.n}`;
      const entry = data.tafsirs?.find(t => t.verse_key === verseKey);
      const text = entry?.text?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "No tafsir found for this verse.";
      tafsirCache.current.set(key, text);
      setTafsirText(text);
    } catch {
      setTafsirText("Failed to load tafsir. Please try again.");
    }
    setTafsirLoading(false);
  }

  // Load surah list — use module cache if available
  useEffect(() => {
    if (_surahCache) { setSurahs(_surahCache); setLoadingList(false); return; }
    fetch("https://api.alquran.cloud/v1/surah")
      .then(r => r.json())
      .then(d => {
        _surahCache = d.data || [];
        setSurahs(_surahCache);
        setLoadingList(false);
      })
      .catch(() => setLoadingList(false));
  }, []);

  // Load verses — check localStorage first (offline cache)
  useEffect(() => {
    if (!current) return;
    setLoadingRead(true); setVerses([]); setFromCache(false);
    setVerseSearch(""); setVsOpen(false);
    setPlayingVerse(null);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }

    // Try offline cache first
    try {
      const cached = localStorage.getItem(`qv_${current}_${transEdition}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Invalidate cache if missing globalN (old format)
        if (!parsed[0]?.globalN) { localStorage.removeItem(`qv_${current}_${transEdition}`); throw new Error("stale"); }
        setVerses(parsed);
        setLoadingRead(false);
        setFromCache(true);
        const pv = pendingVerseRef.current;
        if (pv) {
          pendingVerseRef.current = null;
          setTimeout(() => {
            const el = document.getElementById(`verse-${pv}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 80);
        } else {
          topRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
    } catch {}

    fetch(`https://api.alquran.cloud/v1/surah/${current}/editions/quran-uthmani,en.transliteration,${transEdition}`)
      .then(r => r.json())
      .then(d => {
        const [ar, translit, trans] = d.data;
        const parsed = ar.ayahs.map((a, i) => ({
          n: a.numberInSurah,
          globalN: a.number,
          ar: a.text,
          tr: translit.ayahs[i]?.text || "",
          en: trans.ayahs[i]?.text || "",
        }));
        setVerses(parsed);
        setLoadingRead(false);
        try { localStorage.setItem(`qv_${current}_${transEdition}`, JSON.stringify(parsed)); } catch {}
        const pv = pendingVerseRef.current;
        if (pv) {
          pendingVerseRef.current = null;
          setTimeout(() => {
            const el = document.getElementById(`verse-${pv}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 80);
        } else {
          topRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch(() => setLoadingRead(false));
  }, [current, transEdition]);

  // Load full Quran verse index when user starts typing (3+ chars)
  useEffect(() => {
    if (search.trim().length < 3) return;
    if (_fullVerseCache?.edition === transEdition) return; // already loaded
    if (fullLoading) return;
    setFullLoading(true);
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/quran/quran-uthmani`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/quran/en.transliteration`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/quran/${transEdition}`).then(r => r.json()),
    ]).then(([arRes, trRes, enRes]) => {
      const arSurahs = arRes.data?.surahs || [];
      const trSurahs = trRes.data?.surahs || [];
      const enSurahs = enRes.data?.surahs || [];
      const verses = [];
      arSurahs.forEach((surah, si) => {
        const s = surahs.find(x => x.number === surah.number);
        surah.ayahs.forEach((ayah, ai) => {
          verses.push({
            surahNum: surah.number,
            ayahNum: ayah.numberInSurah,
            surahName: s?.englishName || surah.englishName || `Surah ${surah.number}`,
            surahAr: s?.name || surah.name || "",
            ar: ayah.text,
            tr: trSurahs[si]?.ayahs[ai]?.text || "",
            en: enSurahs[si]?.ayahs[ai]?.text || "",
          });
        });
      });
      _fullVerseCache = { edition: transEdition, verses };
      setFullLoading(false);
    }).catch(() => setFullLoading(false));
  }, [search, transEdition]);

  // Cross-surah verse search — uses full Quran cache once loaded
  const crossResults = useMemo(() => {
    if (search.trim().length < 3) return [];
    if (!_fullVerseCache || _fullVerseCache.edition !== transEdition) return [];
    const nq = normSearch(search);
    const results = [];
    for (const v of _fullVerseCache.verses) {
      if (
        v.ar.includes(search) ||
        normSearch(v.tr).includes(nq) ||
        normSearch(v.en).includes(nq)
      ) {
        results.push({ surahNum: v.surahNum, surahName: v.surahName, surahAr: v.surahAr, verse: { n: v.ayahNum, ar: v.ar, tr: v.tr, en: v.en } });
        if (results.length >= 50) break;
      }
    }
    return results;
  }, [search, transEdition, fullLoading]);

  function openSurah(num, verseN) {
    if (verseN) pendingVerseRef.current = verseN;
    setCurrent(num);
    localStorage.setItem("quranSurah", num);
  }
  function back() {
    setCurrent(null);
    localStorage.removeItem("quranSurah");
    setPlayingVerse(null);
    setShowTafsir(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
  }
  function navSurah(dir) {
    const n = Math.min(114, Math.max(1, current + dir));
    setPlayingVerse(null);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    openSurah(n);
  }

  const surah    = surahs.find(s => s.number === current);
  const nSearch = normSearch(search);
  const filtered = surahs.filter(s =>
    !search ||
    normSearch(s.englishName).includes(nSearch) ||
    normSearch(s.englishNameTranslation).includes(nSearch) ||
    String(s.number).includes(search)
  );

  // ── READER VIEW ────────────────────────────────────────────────
  if (current && surah) return (
    <>
    <audio ref={audioRef} onEnded={handleAudioEnd} style={{ display: "none" }} />
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px", transition: "margin-right 0.3s", marginRight: showTafsir ? 340 : undefined }} ref={topRef}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <button onClick={back} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontFamily: SANS, letterSpacing: "0.06em" }}>
          {t("quran.back")}
        </button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
            Surah {surah.number} · {surah.revelationType} · {surah.numberOfAyahs} verses
            {fromCache && <span style={{ marginLeft:8, color:GOLD, fontSize:9, border:`1px solid ${GOLD}40`, padding:"1px 6px", letterSpacing:"0.1em" }}>CACHED</span>}
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: TEXT }}>{surah.englishName}</div>
          <div style={{ fontSize: 12, color: MUTED }}>{surah.englishNameTranslation}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {/* Translation edition selector */}
          <select
            value={transEdition}
            onChange={e => setTransEdition(e.target.value)}
            style={{
              background: GREEN_L, border: `1px solid ${BORDER}`, borderRadius: 8,
              color: MUTED, padding: "7px 10px", cursor: "pointer",
              fontSize: 11, fontFamily: SANS, outline: "none",
            }}
          >
            <option value="en.sahih">EN — Sahih Intl</option>
            <option value="en.pickthall">EN — Pickthall</option>
            <option value="fr.hamidullah">FR — Hamidullah</option>
            <option value="tr.diyanet">TR — Diyanet</option>
            <option value="ur.jalandhry">UR — Jalandhry</option>
            <option value="sq.nahi">SQ — Nahi</option>
          </select>
          {/* Translation toggle */}
          <button onClick={() => setShowTrans(s => !s)} style={{
            background: showTrans ? GREEN_L : "transparent", border: `1px solid ${showTrans ? GOLD : BORDER}`,
            borderRadius: 8, color: showTrans ? GOLD : MUTED, padding: "7px 14px", cursor: "pointer",
            fontSize: 11, fontFamily: SANS, letterSpacing: "0.06em",
          }}>{t("quran.showTrans")}</button>
          {/* Reciter selector */}
          <select
            value={reciter}
            onChange={e => { setReciter(e.target.value); setPlayingVerse(null); if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; } }}
            style={{
              background: GREEN_L, border: `1px solid ${BORDER}`, borderRadius: 8,
              color: MUTED, padding: "7px 10px", cursor: "pointer",
              fontSize: 11, fontFamily: SANS, outline: "none",
            }}
          >
            <option value="ar.alafasy">Alafasy</option>
            <option value="ar.abdulbasitmurattal">Abdul Basit</option>
            <option value="ar.saadalghamdi">Saad Al-Ghamdi</option>
            <option value="ar.husary">Husary</option>
            <option value="ar.minshawi">Minshawi</option>
          </select>
          {/* Tafsir toggle */}
          <button onClick={() => setShowTafsir(s => !s)} style={{
            background: showTafsir ? GREEN_L : "transparent", border: `1px solid ${showTafsir ? GOLD : BORDER}`,
            borderRadius: 8, color: showTafsir ? GOLD : MUTED, padding: "7px 14px", cursor: "pointer",
            fontSize: 11, fontFamily: SANS, letterSpacing: "0.06em",
          }}>Tafsir</button>
        </div>
      </div>

      {/* Verse search */}
      {verses.length > 0 && (
        <div style={{ position: "relative", marginBottom: 28 }} ref={vsInputRef}>
          <div style={{ position: "relative" }}>
            <input
              placeholder={isSq ? "Kërko fjalë apo varg… (min. 3 shkronja)" : "Search word or verse… (min. 3 letters)"}
              value={verseSearch}
              onChange={e => { setVerseSearch(e.target.value); setVsOpen(true); }}
              onFocus={() => setVsOpen(true)}
              onBlur={() => setTimeout(() => setVsOpen(false), 180)}
              style={{
                width: "100%", padding: "10px 40px 10px 16px",
                background: "#FAF5E8", border: `1px solid ${verseSearch.length >= 3 ? GOLD + "80" : BORDER}`,
                borderRadius: 10, color: TEXT, fontSize: 13, fontFamily: SANS,
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onMouseEnter={e => { if (verseSearch.length < 3) e.target.style.borderColor = MUTED; }}
              onMouseLeave={e => { if (verseSearch.length < 3) e.target.style.borderColor = BORDER; }}
            />
            {verseSearch && (
              <button onClick={() => { setVerseSearch(""); setVsOpen(false); }} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 16, lineHeight: 1,
              }}>×</button>
            )}
            {!verseSearch && (
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: MUTED, pointerEvents: "none" }}>
                &#x2315;
              </span>
            )}
          </div>
          {/* Results dropdown */}
          {vsOpen && verseSearch.trim().length >= 3 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
              background: "#FFFFFF", border: `1px solid ${BORDER}`,
              borderTop: "none", maxHeight: 380, overflowY: "auto",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 8px 32px rgba(26,25,21,0.10)",
            }}>
              {verseResults.length === 0 ? (
                <div style={{ padding: "14px 18px", color: MUTED, fontSize: 12, fontFamily: SANS, letterSpacing: "0.08em" }}>
                  {isSq ? "Asnjë rezultat." : "No results found."}
                </div>
              ) : (
                <>
                  <div style={{ padding: "7px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: SANS }}>
                      {verseResults.length}{verseResults.length === 30 ? "+" : ""} {isSq ? "ajete" : "verses"}
                    </span>
                    <span style={{ fontSize: 10, color: MUTED, fontFamily: SANS }}>
                      {surah?.englishName}
                    </span>
                  </div>
                  {verseResults.map(v => {
                    const q = verseSearch.toLowerCase();
                    // build a snippet from whichever field matched
                    let snippet = v.en;
                    if (v.ar.includes(verseSearch)) snippet = v.ar;
                    else if (v.tr.toLowerCase().includes(q)) snippet = v.tr;
                    // highlight
                    const re = new RegExp(`(${verseSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
                    const parts = snippet.split(re);
                    return (
                      <div
                        key={v.n}
                        onMouseDown={() => scrollToVerse(v.n)}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          padding: "11px 14px", cursor: "pointer",
                          borderBottom: `1px solid ${BORDER}`,
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = GREEN_L}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{
                          flexShrink: 0, minWidth: 28, height: 28, border: `1px solid ${GOLD}50`,
                          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, color: GOLD, fontFamily: SANS, fontWeight: 600,
                        }}>{v.n}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 12, color: TEXT, fontFamily: snippet === v.ar ? ARABIC : SANS,
                            direction: snippet === v.ar ? "rtl" : "ltr",
                            lineHeight: 1.7, overflow: "hidden",
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          }}>
                            {parts.map((p, i) =>
                              re.test(p)
                                ? <mark key={i} style={{ background: GOLD + "30", color: GOLD, borderRadius: 2 }}>{p}</mark>
                                : p
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Arabic title */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 34, fontFamily: ARABIC, color: GOLD, direction: "rtl", letterSpacing: "0.04em", lineHeight: 1.6 }}>
          {surah.name}
        </div>
        {surah.number !== 9 && (
          <div style={{ fontSize: 20, fontFamily: ARABIC, color: MUTED, direction: "rtl", marginTop: 8, lineHeight: 2 }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        )}
        <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)`, margin: "20px auto 0" }} />
      </div>

      {loadingRead && (
        <div style={{ textAlign: "center", padding: 60, color: MUTED, fontSize: 13, letterSpacing: "0.1em" }}>
          Loading verses…
        </div>
      )}

      {/* Verses */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {verses.map((v, i) => {
          const isPlaying = playingVerse?.globalN === v.globalN && audioRef.current && !audioRef.current.paused;
          const isActive  = playingVerse?.globalN === v.globalN;
          return (
          <div key={v.n} id={`verse-${v.n}`} style={{
            padding: "28px 0", borderBottom: `1px solid ${BORDER}`,
            display: "flex", flexDirection: "column", gap: 14,
            background: isActive ? `${GOLD}08` : isBookmarked(v.n) ? "rgba(201,168,76,0.04)" : "transparent",
            borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
            paddingLeft: isActive ? 14 : undefined,
            transition: "background 0.2s, border-left-color 0.2s",
          }}>
            {/* Verse number + Arabic */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, direction: "rtl" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, direction: "ltr" }}>
                {/* Play button */}
                <button
                  onClick={() => playVerse(v)}
                  title={isActive ? "Pause" : "Play verse"}
                  style={{
                    background: isActive ? GOLD : "none",
                    border: `1px solid ${isActive ? GOLD : BORDER}`,
                    borderRadius: "50%", cursor: "pointer",
                    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: isActive ? "#fff" : MUTED,
                    transition: "all 0.15s", padding: 0, flexShrink: 0,
                  }}
                >{isActive && !audioRef.current?.paused ? "⏸" : "▶"}</button>
                {/* Verse number badge — click to load tafsir */}
                <div
                  onClick={() => { if (showTafsir) loadTafsir(v); }}
                  style={{
                    width: 32, height: 32, borderRadius: "50%", border: `1px solid ${showTafsir && tafsirVerse?.n === v.n ? GOLD : GOLD + "50"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: showTafsir && tafsirVerse?.n === v.n ? GOLD : GOLD + "99", fontFamily: SANS,
                    cursor: showTafsir ? "pointer" : "default",
                    background: showTafsir && tafsirVerse?.n === v.n ? GREEN_L : "transparent",
                    transition: "all 0.15s",
                  }}
                  title={showTafsir ? "Load tafsir for this verse" : undefined}
                >{v.n}</div>
                <button onClick={() => toggleBookmark(v)} title={isBookmarked(v.n) ? "Remove bookmark" : "Bookmark verse"} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, color: isBookmarked(v.n) ? GOLD : MUTED,
                  padding: 2, transition: "color 0.15s", lineHeight: 1,
                }}>{"🔖"}</button>
              </div>
              <div style={{ fontSize: arabicFontSize, fontFamily: ARABIC, color: TEXT, lineHeight: 2.2, flex: 1, textAlign: "right" }}>
                {v.ar}
              </div>
            </div>
            {/* Transliteration — always visible */}
            {v.tr && (
              <div style={{ fontSize: 14, color: GOLD + "bb", lineHeight: 1.8, fontFamily: SANS, letterSpacing: "0.04em", fontStyle: "italic" }}>
                {v.tr}
              </div>
            )}
            {/* Translation */}
            {showTrans && (
              <div style={{ fontSize: 16, color: TEXT, lineHeight: 1.85, fontFamily: SERIF, letterSpacing: "0.02em" }}>
                {v.en}
              </div>
            )}
          </div>
          );
        })}
      </div>

      {/* Prev / Next surah */}
      {!loadingRead && verses.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, gap: 12 }}>
          <button onClick={() => navSurah(-1)} disabled={current === 1} style={{
            flex: 1, padding: "12px 0", background: "transparent", border: `1px solid ${BORDER}`,
            borderRadius: 999, color: current === 1 ? BORDER : MUTED, cursor: current === 1 ? "default" : "pointer",
            fontSize: 12, fontFamily: SANS, letterSpacing: "0.06em", transition: "all 0.2s",
          }}>← Previous Surah</button>
          <button onClick={back} style={{
            padding: "12px 24px", background: "transparent", border: `1px solid ${BORDER}`,
            borderRadius: 999, color: MUTED, cursor: "pointer", fontSize: 12, fontFamily: SANS,
          }}>All Surahs</button>
          <button onClick={() => navSurah(1)} disabled={current === 114} style={{
            flex: 1, padding: "12px 0", background: "transparent", border: `1px solid ${BORDER}`,
            borderRadius: 999, color: current === 114 ? BORDER : MUTED, cursor: current === 114 ? "default" : "pointer",
            fontSize: 12, fontFamily: SANS, letterSpacing: "0.06em", transition: "all 0.2s",
          }}>Next Surah →</button>
        </div>
      )}
    </div>

    {/* Tafsir side panel */}
    {showTafsir && (
      <div style={{
        position: "fixed", right: 0, top: 0, height: "100%", width: 320,
        background: SURFACE, borderLeft: `1px solid ${BORDER}`,
        zIndex: 200, overflowY: "auto", display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(26,25,21,0.10)",
      }}>
        {/* Tafsir panel header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px", borderBottom: `1px solid ${BORDER}`,
          position: "sticky", top: 0, background: SURFACE, zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 10, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: SANS, fontWeight: 600 }}>Tafsir</div>
            <select
              value={tafsirId}
              onChange={e => { setTafsirId(Number(e.target.value)); setTafsirText(""); setTafsirVerse(null); tafsirCache.current.clear(); }}
              style={{
                marginTop: 4, background: GREEN_L, border: `1px solid ${BORDER}`, borderRadius: 6,
                color: TEXT, padding: "4px 8px", fontSize: 11, fontFamily: SANS, outline: "none", cursor: "pointer",
              }}
            >
              <option value={169}>Ibn Kathir (EN)</option>
              <option value={16}>Al-Muyassar (AR)</option>
              <option value={90}>Al-Qurtubi (AR)</option>
              <option value={94}>Al-Baghawi (AR)</option>
            </select>
          </div>
          <button onClick={() => setShowTafsir(false)} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 18,
            color: MUTED, lineHeight: 1, padding: "4px 8px",
          }}>×</button>
        </div>

        {/* Tafsir content */}
        <div style={{ padding: "20px 18px", flex: 1 }}>
          {!tafsirVerse ? (
            <div style={{ color: MUTED, fontSize: 13, fontFamily: SANS, lineHeight: 1.7, textAlign: "center", paddingTop: 40 }}>
              Click a verse number to load its tafsir.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, color: GOLD, fontFamily: SANS, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {surah.englishName} · Verse {tafsirVerse.n}
                </div>
                <div style={{ marginTop: 8, fontSize: 18, fontFamily: ARABIC, color: TEXT, direction: "rtl", lineHeight: 2, textAlign: "right" }}>
                  {tafsirVerse.ar}
                </div>
              </div>
              {tafsirLoading ? (
                <div style={{ color: MUTED, fontSize: 13, fontFamily: SANS, textAlign: "center", padding: 20 }}>Loading…</div>
              ) : (
                <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.9, fontFamily: SANS }}>
                  {tafsirText}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )}
    </>
  );

  // ── SURAH LIST VIEW ────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 100px" }}>
      <PageTitle icon="quran" title={t("pages.quran.title")} sub={t("pages.quran.sub")} />

      {/* Continue reading banner */}
      {(() => {
        const savedNum = localStorage.getItem("quranSurah");
        if (!savedNum || !surahs.length) return null;
        const savedSurah = surahs.find(s => s.number === parseInt(savedNum));
        if (!savedSurah) return null;
        return (
          <div
            onClick={() => openSurah(savedSurah.number)}
            style={{
              marginBottom: 20, display: "flex", alignItems: "center", gap: 14,
              background: "#FFFFFF", border: `1px solid ${GOLD}40`,
              borderRadius: 14, padding: "14px 18px", cursor: "pointer",
              boxShadow: "0 2px 12px rgba(26,25,21,0.07)",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = GREEN_L}
            onMouseLeave={e => e.currentTarget.style.background = "#FFFFFF"}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: GREEN, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontFamily: SANS, fontWeight: 700, color: "#fff",
            }}>{savedSurah.number}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: SANS, fontWeight: 600, marginBottom: 2 }}>
                {isSq ? "Vazhdo leximin" : "Continue reading"}
              </div>
              <div style={{ fontSize: 15, color: TEXT, fontFamily: SERIF }}>{savedSurah.englishName}</div>
            </div>
            <div style={{ fontFamily: ARABIC, fontSize: 20, color: GOLD, direction: "rtl", flexShrink: 0 }}>{savedSurah.name}</div>
            <div style={{ fontSize: 18, color: MUTED, flexShrink: 0 }}>›</div>
          </div>
        );
      })()}

      {/* Bookmarks panel */}
      {bookmarks.length > 0 && (
        <div style={{ marginBottom: 28, border: `1px solid ${BORDER}`, borderRadius: 14, background: "#FFFFFF", boxShadow: "0 2px 12px rgba(26,25,21,0.07)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid " + BORDER }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{"🔖"}</span>
              <span style={{ fontSize: 11, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: SANS, fontWeight: 600 }}>Bookmarks</span>
              <span style={{ fontSize: 10, color: MUTED, background: BORDER, padding: "1px 7px" }}>{bookmarks.length}</span>
            </div>
            <button onClick={() => {
              setBookmarks([]);
              try { localStorage.removeItem("mp-quran-bkm"); } catch {}
            }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED, fontFamily: SANS, letterSpacing: "0.06em" }}>
              Clear all
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {bookmarks.map((b, i) => (
              <div key={b.key} onClick={() => openSurah(b.surah)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "11px 18px",
                  borderBottom: i < bookmarks.length - 1 ? "1px solid " + BORDER : "none",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = GREEN_L}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: GOLD, fontFamily: SANS, fontWeight: 600 }}>{b.surah}:{b.verse}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: TEXT, fontFamily: SERIF, marginBottom: 2 }}>{b.surahEn} — Verse {b.verse}</div>
                  <div style={{ fontSize: 11, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.preview}</div>
                </div>
                <div style={{ fontFamily: ARABIC, fontSize: 16, color: GOLD, flexShrink: 0, direction: "rtl" }}>{b.surahAr}</div>
                <button onClick={e => {
                  e.stopPropagation();
                  setBookmarks(prev => {
                    const next = prev.filter(x => x.key !== b.key);
                    try { localStorage.setItem("mp-quran-bkm", JSON.stringify(next)); } catch {}
                    return next;
                  });
                }} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 16, padding: "0 4px", flexShrink: 0 }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        placeholder={isSq ? "Kërko sure ose përmbajtje Kurani… (3+ shkronja)" : "Search surah name or Quran content… (3+ letters)"}
        value={search} onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "11px 16px", background: "#FAF5E8",
          border: `1px solid ${search.trim().length >= 3 ? GOLD + "80" : BORDER}`,
          borderRadius: 10, color: TEXT,
          fontSize: 13, fontFamily: SANS, outline: "none", marginBottom: 24,
          boxSizing: "border-box", transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = GOLD}
        onBlur={e => e.target.style.borderColor = search.trim().length >= 3 ? GOLD + "80" : BORDER}
      />

      {loadingList && (
        <div style={{ textAlign: "center", padding: 60, color: MUTED, fontSize: 13, letterSpacing: "0.1em" }}>
          Loading surahs…
        </div>
      )}

      {/* Surah name matches */}
      {filtered.length > 0 && (
        <div style={{ border: `1px solid #E0D5C0`, borderRadius: 14, boxShadow: "0 2px 12px rgba(26,25,21,0.07)", overflow: "hidden", marginBottom: crossResults.length > 0 ? 28 : 0, background: "#fff" }}>
          {filtered.map((s, i) => {
            const isOpened = current === s.number;
            return (
              <div key={s.number} onClick={() => openSurah(s.number)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "13px 18px",
                  borderBottom: i < filtered.length - 1 ? `1px solid #EDF5E3` : "none",
                  cursor: "pointer", transition: "background 0.15s",
                  background: "transparent",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#EDF5E3"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontFamily: SANS, fontWeight: 700,
                  background: isOpened ? "#2D5018" : "#FAF7EE",
                  color: isOpened ? "#fff" : "#8A7235",
                  border: `1px solid ${isOpened ? "#2D5018" : "#E0D5C0"}`,
                }}>{s.number}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: TEXT, fontWeight: 600, fontFamily: SANS }}>{s.englishName}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2, fontFamily: SANS }}>
                    {s.numberOfAyahs} {isSq ? "ajete" : "ayahs"}{isOpened ? (isSq ? " · E hapur" : " · Opened") : ""}
                  </div>
                </div>
                <div style={{ fontFamily: ARABIC, fontSize: 18, color: isOpened ? "#2D5018" : GOLD, direction: "rtl", flexShrink: 0, lineHeight: 1.6 }}>
                  {s.name}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cross-surah verse content search results */}
      {crossResults.length > 0 && (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, boxShadow: "0 2px 12px rgba(26,25,21,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "9px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, background: "#FAF5E8" }}>
            <span style={{ fontSize: 10, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: SANS, fontWeight: 600 }}>
              {isSq ? "Rezultate në përmbajtje" : "Verse content matches"}
            </span>
            <span style={{ fontSize: 10, color: MUTED, background: BORDER, padding: "1px 7px", fontFamily: SANS }}>
              {crossResults.length}{crossResults.length === 50 ? "+" : ""}
            </span>
            <span style={{ fontSize: 10, color: MUTED, fontFamily: SANS, marginLeft: "auto" }}>
              {isSq ? "Të gjitha suret" : "All 114 surahs"}
            </span>
          </div>
          {crossResults.map((r, i) => {
            const q = search.toLowerCase();
            const v = r.verse;
            let snippet = v.en;
            if (v.ar.includes(search)) snippet = v.ar;
            else if (v.tr.toLowerCase().includes(q)) snippet = v.tr;
            const isAr = snippet === v.ar;
            const re = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
            const parts = snippet.split(re);
            return (
              <div
                key={`${r.surahNum}-${v.n}`}
                onClick={() => openSurah(r.surahNum, v.n)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 16px",
                  borderBottom: i < crossResults.length - 1 ? `1px solid ${BORDER}` : "none",
                  cursor: "pointer", transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = GREEN_L}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Surah + verse badge */}
                <div style={{ flexShrink: 0, textAlign: "center", minWidth: 44 }}>
                  <div style={{ fontSize: 11, color: GOLD, fontFamily: SANS, fontWeight: 600, lineHeight: 1.3 }}>{r.surahNum}:{v.n}</div>
                  <div style={{ fontSize: 9, color: MUTED, fontFamily: SANS, marginTop: 2, letterSpacing: "0.05em" }}>{r.surahName}</div>
                </div>
                {/* Snippet */}
                <div style={{
                  flex: 1, minWidth: 0, fontSize: 13, color: TEXT,
                  fontFamily: isAr ? ARABIC : SANS,
                  direction: isAr ? "rtl" : "ltr",
                  lineHeight: 1.7,
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {parts.map((p, j) =>
                    re.test(p)
                      ? <mark key={j} style={{ background: GOLD + "30", color: GOLD, borderRadius: 2 }}>{p}</mark>
                      : p
                  )}
                </div>
                {/* Arabic surah name */}
                <div style={{ fontFamily: ARABIC, fontSize: 14, color: GOLD + "80", flexShrink: 0, direction: "rtl", lineHeight: 1.6 }}>{r.surahAr}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading / no-results state for verse search */}
      {search.trim().length >= 3 && crossResults.length === 0 && (
        <div style={{ padding: "18px 0", textAlign: "center", color: MUTED, fontSize: 12, fontFamily: SANS, letterSpacing: "0.08em" }}>
          {fullLoading
            ? (isSq ? "Duke ngarkuar indeksin e Kuranit…" : "Loading Quran index…")
            : (filtered.length > 0 ? null : (isSq ? "Asnjë rezultat." : "No matches found."))}
        </div>
      )}
    </div>
  );
}

// ─── TASBEEH ──────────────────────────────────────────────────────
const DHIKR_PRESETS = [
  { label: "SubḥānAllāh",   arabic: "سُبْحَانَ اللَّهِ",   target: 33  },
  { label: "Alḥamdulillāh", arabic: "الْحَمْدُ لِلَّهِ",   target: 33  },
  { label: "Allāhu Akbar",  arabic: "اللَّهُ أَكْبَرُ",    target: 34  },
  { label: "Lā ilāha illAllāh", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", target: 100 },
  { label: "Astaghfirullāh", arabic: "أَسْتَغْفِرُ اللَّهَ", target: 100 },
  { label: "Ṣalawāt",       arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّد", target: 100 },
];

function TasbeehPage() {
  const saved = JSON.parse(localStorage.getItem("tasbeeh") || "{}");
  const [dhikrIdx, setDhikrIdx] = useState(saved.idx ?? 0);
  const [count, setCount]       = useState(0);
  const [rounds, setRounds]     = useState(0);
  const [flash2, setFlash2]     = useState(false);

  const dhikr = DHIKR_PRESETS[dhikrIdx];
  const pct   = Math.min(count / dhikr.target, 1);
  const R = 110, stroke = 8;
  const circ = 2 * Math.PI * R;
  const dash  = pct * circ;

  function persist(idx, c, r) {
    localStorage.setItem("tasbeeh", JSON.stringify({ idx, count: c, rounds: r }));
  }

  function tap() {
    if (navigator.vibrate) navigator.vibrate(18);
    const next = count + 1;
    if (next >= dhikr.target) {
      const newRounds = rounds + 1;
      setCount(0); setRounds(newRounds);
      setFlash2(true); setTimeout(() => setFlash2(false), 600);
      persist(dhikrIdx, 0, newRounds);
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    } else {
      setCount(next);
      persist(dhikrIdx, next, rounds);
    }
  }

  function selectDhikr(idx) {
    setDhikrIdx(idx); setCount(0); setRounds(0);
    persist(idx, 0, 0);
  }

  function reset() { setCount(0); setRounds(0); persist(dhikrIdx, 0, 0); }

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("tasbeeh") || "{}");
    if (s.idx !== undefined) {
      setDhikrIdx(s.idx);
      setCount(s.count ?? 0);
      setRounds(s.rounds ?? 0);
    }
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px", userSelect: "none" }}>
      <PageTitle icon="tasbeeh" title="Tasbeeh" sub="Digital dhikr counter" />

      {/* Preset selector */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, justifyContent: "center" }}>
        {DHIKR_PRESETS.map((d, i) => (
          <button key={i} onClick={() => selectDhikr(i)} style={{
            padding: "7px 14px", borderRadius: 999, cursor: "pointer", fontSize: 11,
            fontFamily: SANS, fontWeight: 600, letterSpacing: "0.07em",
            border: `1px solid ${dhikrIdx === i ? GOLD : BORDER}`,
            background: dhikrIdx === i ? GREEN_L : "transparent",
            color: dhikrIdx === i ? GOLD : MUTED,
            transition: "all 0.18s",
          }}>{d.label}</button>
        ))}
      </div>

      {/* Main counter circle */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ position: "relative", width: 260, height: 260 }}>
          {/* SVG progress ring */}
          <svg width="260" height="260" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
            {/* Track */}
            <circle cx="130" cy="130" r={R} fill="none" stroke={BORDER} strokeWidth={stroke} />
            {/* Progress */}
            <circle cx="130" cy="130" r={R} fill="none"
              stroke={flash2 ? "#27ae60" : GOLD}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              style={{ transition: "stroke-dasharray 0.25s ease, stroke 0.3s" }}
            />
          </svg>

          {/* Tap button */}
          <button
            onClick={tap}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 196, height: 196, borderRadius: "50%",
              background: flash2
                ? `radial-gradient(circle, #e8f5e8, #d4edda)`
                : `radial-gradient(circle, ${SURFACE}, #f0e8d0)`,
              border: `1px solid ${flash2 ? "#27ae60" : GOLD}60`,
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.15s",
              boxShadow: flash2
                ? `0 0 30px #27ae6040`
                : `0 4px 24px rgba(160,120,50,0.18), 0 1px 0 rgba(255,255,255,0.9) inset`,
              WebkitTapHighlightColor: "transparent",
              outline: "none",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "translate(-50%, -50%) scale(0.96)"}
            onMouseUp={e => e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"}
            onTouchStart={e => { e.currentTarget.style.transform = "translate(-50%, -50%) scale(0.96)"; e.preventDefault(); }}
            onTouchEnd={e => { e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"; tap(); e.preventDefault(); }}
            onClick={tap}
          >
            <div style={{ fontSize: 56, fontWeight: 300, color: flash2 ? "#2ecc71" : TEXT, fontVariantNumeric: "tabular-nums", lineHeight: 1, fontFamily: SERIF, transition: "color 0.3s" }}>
              {count}
            </div>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              of {dhikr.target}
            </div>
          </button>
        </div>

        {/* Arabic text */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, color: GOLD, fontFamily: SERIF, marginBottom: 6, direction: "rtl", letterSpacing: "0.05em" }}>
            {dhikr.arabic}
          </div>
          <div style={{ fontSize: 13, color: MUTED, letterSpacing: "0.08em" }}>{dhikr.label}</div>
        </div>

        {/* Rounds + reset */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, color: TEXT, fontFamily: SERIF }}>{rounds}</div>
            <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Rounds</div>
          </div>
          <div style={{ width: 1, height: 40, background: BORDER }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, color: TEXT, fontFamily: SERIF }}>{rounds * dhikr.target + count}</div>
            <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Total</div>
          </div>
          <div style={{ width: 1, height: 40, background: BORDER }} />
          <button onClick={reset} style={{
            background: "none", border: `1px solid ${BORDER}`, borderRadius: 999,
            cursor: "pointer", color: MUTED, fontSize: 11, fontWeight: 600,
            padding: "8px 16px", letterSpacing: "0.08em", fontFamily: SANS,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0392b"; e.currentTarget.style.color = "#c0392b"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
          >RESET</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────
const BOOK_CATS = ["Quran","Tafsir","Hadith","Seerah","Fiqh","Aqeedah","Spirituality","Dua & Dhikr","History","Modern Thought","Arabic","Online","Shqip"];
const EMPTY_BOOK = { title: "", author: "", cat: "Quran", url: "#" };
const EMPTY_LEC  = { sort: "", title: "", file: "", url: "" };

async function supaAdmin(method, table, body, token, filter = "") {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}${filter ? "?" + filter : ""}`, {
    method,
    headers: {
      apikey: SUPA_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text ? JSON.parse(text) : null;
}

function AdminPage({ authSession }) {
  // Use existing auth session token if user is already signed in as admin
  const sessionToken = authSession?.access_token || null;
  const sessionEmail = authSession?.user?.email || "";
  const isAdminEmail = ADMIN_EMAILS.includes(sessionEmail);

  const [token, setToken]       = useState(() => (sessionToken && isAdminEmail) ? sessionToken : null);
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [logging, setLogging]   = useState(false);
  const [tab, setTab]           = useState("books");

  const [books, setBooks]       = useState([]);
  const [lectures, setLectures] = useState([]);
  const [busy, setBusy]         = useState(false);
  const [msg, setMsg]           = useState("");

  const [bookForm, setBookForm]   = useState(EMPTY_BOOK);
  const [editBook, setEditBook]   = useState(null);
  const [lecForm, setLecForm]     = useState(EMPTY_LEC);
  const [editLec, setEditLec]     = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadPct, setUploadPct]     = useState(0);
  const [uploadingMp3, setUploadingMp3] = useState(false);
  const [uploadMp3Pct, setUploadMp3Pct] = useState(0);

  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 2800); }

  async function uploadPDF(file) {
    if (!file) return;
    setUploading(true); setUploadPct(0);
    try {
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", UPLOAD_API);
        xhr.setRequestHeader("Authorization", "Bearer " + authSession.access_token);
        xhr.setRequestHeader("X-Filename", file.name.replace(/\s+/g, "_"));
        xhr.setRequestHeader("X-Folder", "books");
        xhr.setRequestHeader("Content-Type", file.type || "application/pdf");
        xhr.upload.onprogress = e => { if (e.lengthComputable) setUploadPct(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            xhr.status < 300 ? resolve(data) : reject(new Error(data.error || xhr.responseText));
          } catch { reject(new Error(xhr.responseText)); }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });
      setBookForm(f => ({ ...f, url: result.url }));
      flash("✓ PDF uploaded to Cloudflare R2 — URL filled in.");
    } catch (e) {
      flash("Upload error: " + e.message);
    } finally {
      setUploading(false); setUploadPct(0);
    }
  }

  async function uploadMP3(file) {
    if (!file) return;
    setUploadingMp3(true); setUploadMp3Pct(0);
    try {
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", UPLOAD_API);
        xhr.setRequestHeader("Authorization", "Bearer " + authSession.access_token);
        xhr.setRequestHeader("X-Filename", file.name.replace(/\s+/g, "_"));
        xhr.setRequestHeader("X-Folder", "audio/Ligjerata");
        xhr.setRequestHeader("Content-Type", file.type || "audio/mpeg");
        xhr.upload.onprogress = e => { if (e.lengthComputable) setUploadMp3Pct(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            xhr.status < 300 ? resolve(data) : reject(new Error(data.error || xhr.responseText));
          } catch { reject(new Error(xhr.responseText)); }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });
      // Auto-fill title (filename without extension), file, url
      const nameNoExt = file.name.replace(/\.[^.]+$/, "").replace(/_/g, " ");
      setLecForm(f => ({
        ...f,
        title: f.title || nameNoExt,
        file: file.name.replace(/\s+/g, "_"),
        url: result.url,
      }));
      flash("✓ MP3 uploaded to Cloudflare R2 — fields filled in.");
    } catch (e) {
      flash("Upload error: " + e.message);
    } finally {
      setUploadingMp3(false); setUploadMp3Pct(0);
    }
  }

  async function login() {
    if (!SUPA_URL) { setLoginErr("Supabase not configured in App.jsx"); return; }
    setLogging(true); setLoginErr("");
    try {
      const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPA_ANON_KEY },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      console.log("Supabase auth response:", data);
      if (!res.ok) throw new Error(data.error_description || data.error || data.msg || JSON.stringify(data));
      setToken(data.access_token);
    } catch (e) { setLoginErr(e.message); }
    finally { setLogging(false); }
  }

  async function load() {
    setBusy(true);
    try {
      const [b, l] = await Promise.all([
        supaFetch("books", "select=*&order=id"),
        supaFetch("lectures", "select=*&order=sort"),
      ]);
      if (b) setBooks(b);
      if (l) setLectures(l);
    } finally { setBusy(false); }
  }

  useEffect(() => { if (token) load(); }, [token]);

  // ── Books CRUD ─────────────────────────────────────────────────
  async function saveBook() {
    if (!bookForm.title.trim()) return;
    setBusy(true);
    try {
      if (editBook) {
        await supaAdmin("PATCH", "books", bookForm, token, `id=eq.${editBook}`);
        setBooks(bs => bs.map(b => b.id === editBook ? { ...b, ...bookForm } : b));
        flash("Book updated.");
      } else {
        const [created] = await supaAdmin("POST", "books", bookForm, token);
        setBooks(bs => [...bs, created]);
        flash("Book added.");
      }
      setBookForm(EMPTY_BOOK); setEditBook(null);
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  async function deleteBook(id) {
    if (!confirm("Delete this book?")) return;
    setBusy(true);
    try {
      await supaAdmin("DELETE", "books", null, token, `id=eq.${id}`);
      setBooks(bs => bs.filter(b => b.id !== id));
      flash("Deleted.");
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  function startEditBook(b) {
    setEditBook(b.id);
    setBookForm({ title: b.title, author: b.author, cat: b.cat, url: b.url });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Lectures CRUD ──────────────────────────────────────────────
  async function saveLec() {
    if (!lecForm.title.trim()) return;
    setBusy(true);
    try {
      const payload = { ...lecForm, sort: Number(lecForm.sort) || 0 };
      if (editLec) {
        await supaAdmin("PATCH", "lectures", payload, token, `id=eq.${editLec}`);
        setLectures(ls => ls.map(l => l.id === editLec ? { ...l, ...payload } : l));
        flash("Lecture updated.");
      } else {
        const [created] = await supaAdmin("POST", "lectures", payload, token);
        setLectures(ls => [...ls, created].sort((a,b) => a.sort - b.sort));
        flash("Lecture added.");
      }
      setLecForm(EMPTY_LEC); setEditLec(null);
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  async function deleteLec(id) {
    if (!confirm("Delete this lecture?")) return;
    setBusy(true);
    try {
      await supaAdmin("DELETE", "lectures", null, token, `id=eq.${id}`);
      setLectures(ls => ls.filter(l => l.id !== id));
      flash("Deleted.");
    } catch (e) { flash("Error: " + e.message); }
    finally { setBusy(false); }
  }

  function startEditLec(l) {
    setEditLec(l.id);
    setLecForm({ sort: l.sort, title: l.title, file: l.file, url: l.url });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Styles ─────────────────────────────────────────────────────
  const inp = {
    width: "100%", padding: "9px 12px", background: "#faf5ec",
    border: `1px solid ${BORDER}`, borderRadius: 2, color: TEXT,
    fontSize: 13, fontFamily: SANS, outline: "none",
  };
  const btn = (accent = GOLD, outline = false) => ({
    padding: "8px 18px", borderRadius: 2, cursor: "pointer", fontSize: 12,
    fontFamily: SANS, fontWeight: 600, letterSpacing: "0.06em",
    border: `1px solid ${accent}`,
    background: outline ? "transparent" : accent,
    color: outline ? accent : "#f0e6ce",
    transition: "opacity 0.2s",
  });

  // ── Login screen ───────────────────────────────────────────────
  if (!token) {
    // User is signed in but not an admin
    if (sessionToken && !isAdminEmail) return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>&#x1F512;</div>
          <div style={{ fontFamily: SERIF, fontSize: 20, color: TEXT, marginBottom: 8 }}>Access Restricted</div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
            Your account ({sessionEmail}) does not have admin access.
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380, background: SURFACE, border: `1px solid ${BORDER}`, padding: "40px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src="/logo.png" alt="" style={{ width: 52, height: 52, objectFit: "contain", marginBottom: 16 }} />
            <div style={{ fontFamily: SERIF, fontSize: 22, color: TEXT, letterSpacing: "0.04em" }}>Admin Panel</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Muslim’s Path</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input style={inp} type="email" placeholder="Admin Email" value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={e => e.target.style.borderColor = GOLD}
              onBlur={e => e.target.style.borderColor = BORDER}
              onKeyDown={e => e.key === "Enter" && login()} />
            <input style={inp} type="password" placeholder="Password" value={pass}
              onChange={e => setPass(e.target.value)}
              onFocus={e => e.target.style.borderColor = GOLD}
              onBlur={e => e.target.style.borderColor = BORDER}
              onKeyDown={e => e.key === "Enter" && login()} />
            {loginErr && <div style={{ fontSize: 12, color: "#e74c3c", textAlign: "center" }}>{loginErr}</div>}
            <button onClick={login} disabled={logging} style={{ ...btn(), marginTop: 8, opacity: logging ? 0.6 : 1 }}>
              {logging ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 28, color: TEXT }}>Admin Panel</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Manage library books and lectures</div>
        </div>
        <button onClick={() => { setToken(null); setEmail(""); setPass(""); }} style={btn("#c0392b", true)}>Sign Out</button>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{ background: GREEN_L, border: `1px solid ${GOLD}40`, color: GOLD, padding: "10px 16px", fontSize: 13, marginBottom: 20, borderRadius: 2 }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, marginBottom: 28 }}>
        {["books", "lectures"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", borderBottom: tab === t ? `2px solid ${GOLD}` : "2px solid transparent",
            color: tab === t ? GOLD : MUTED, padding: "10px 20px", cursor: "pointer",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: SANS, transition: "color 0.2s",
          }}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        {busy && <div style={{ fontSize: 12, color: MUTED, alignSelf: "center", paddingRight: 8 }}>Loading…</div>}
      </div>

      {/* ── BOOKS TAB ── */}
      {tab === "books" && (
        <div>
          {/* Form */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "24px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              {editBook ? "Edit Book" : "Add New Book"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input style={inp} placeholder="Title *" value={bookForm.title}
                onChange={e => setBookForm(f => ({ ...f, title: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <input style={inp} placeholder="Author" value={bookForm.author}
                onChange={e => setBookForm(f => ({ ...f, author: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <select value={bookForm.cat} onChange={e => setBookForm(f => ({ ...f, cat: e.target.value }))}
                style={{ ...inp, cursor: "pointer" }}>
                {BOOK_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input style={inp} placeholder="URL (leave blank if uploading PDF)" value={bookForm.url === "#" ? "" : bookForm.url}
                onChange={e => setBookForm(f => ({ ...f, url: e.target.value || "#" }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>

            {/* PDF Upload */}
            <div style={{ marginTop: 12, border: `1px dashed ${UPLOAD_WORKER_URL ? BORDER : GOLD+"30"}`, borderRadius: 2, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, letterSpacing: "0.06em" }}>
                UPLOAD PDF — auto-fills the URL above
                {!UPLOAD_WORKER_URL && <span style={{ color: "#e67e22", marginLeft: 8 }}>⚠ Set VITE_UPLOAD_WORKER_URL in Vercel env vars to enable uploads</span>}
              </div>
              <input
                type="file" accept=".pdf"
                onChange={e => uploadPDF(e.target.files[0])}
                style={{ fontSize: 12, color: MUTED, cursor: "pointer" }}
                disabled={uploading}
              />
              {uploading && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ height: 3, background: BORDER, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${uploadPct}%`, background: GOLD, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: GOLD, marginTop: 4 }}>Uploading… {uploadPct}%</div>
                </div>
              )}
              {bookForm.url && bookForm.url !== "#" && bookForm.url.includes("supabase") && (
                <div style={{ fontSize: 11, color: GOLD, marginTop: 8 }}>✓ PDF ready: {bookForm.url.split("/").pop()}</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={saveBook} disabled={uploading} style={{ ...btn(), opacity: uploading ? 0.5 : 1 }}>
                {editBook ? "Update Book" : "Add Book"}
              </button>
              {editBook && <button onClick={() => { setEditBook(null); setBookForm(EMPTY_BOOK); }} style={btn(MUTED, true)}>Cancel</button>}
            </div>
          </div>

          {/* Books list */}
          <div style={{ border: `1px solid ${BORDER}` }}>
            {books.map((b, i) => (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                borderBottom: i < books.length - 1 ? `1px solid ${BORDER}` : "none",
                background: editBook === b.id ? GREEN_L : "transparent",
              }}>
                <span style={{ fontSize: 10, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase", minWidth: 80, flexShrink: 0 }}>{b.cat}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: TEXT, fontFamily: SERIF }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{b.author}</div>
                </div>
                {b.url !== "#" && (
                  <a href={b.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: MUTED, textDecoration: "none", flexShrink: 0 }}>↗</a>
                )}
                <button onClick={() => startEditBook(b)} style={{ ...btn(GOLD, true), padding: "5px 12px", fontSize: 11 }}>Edit</button>
                <button onClick={() => deleteBook(b.id)} style={{ ...btn("#c0392b", true), padding: "5px 12px", fontSize: 11 }}>Del</button>
              </div>
            ))}
            {books.length === 0 && !busy && (
              <div style={{ padding: 32, textAlign: "center", color: MUTED, fontSize: 13 }}>No books yet.</div>
            )}
          </div>
        </div>
      )}

      {/* ── LECTURES TAB ── */}
      {tab === "lectures" && (
        <div>
          {/* Form */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: "24px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              {editLec ? "Edit Lecture" : "Add New Lecture"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, marginBottom: 10 }}>
              <input style={inp} placeholder="Order" type="number" value={lecForm.sort}
                onChange={e => setLecForm(f => ({ ...f, sort: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <input style={inp} placeholder="Title *" value={lecForm.title}
                onChange={e => setLecForm(f => ({ ...f, title: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input style={inp} placeholder="Filename (e.g. Lecture.mp3)" value={lecForm.file}
                onChange={e => setLecForm(f => ({ ...f, file: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
              <input style={inp} placeholder="Full URL" value={lecForm.url}
                onChange={e => setLecForm(f => ({ ...f, url: e.target.value }))}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>

            {/* MP3 Upload */}
            <div style={{ marginTop: 12, border: `1px dashed ${UPLOAD_WORKER_URL ? BORDER : GOLD+"30"}`, borderRadius: 2, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, letterSpacing: "0.06em" }}>
                UPLOAD MP3 — auto-fills filename, URL and title above
                {!UPLOAD_WORKER_URL && <span style={{ color: "#e67e22", marginLeft: 8 }}>⚠ Set VITE_UPLOAD_WORKER_URL in Vercel env vars to enable uploads</span>}
              </div>
              <input
                type="file" accept=".mp3,audio/*"
                onChange={e => uploadMP3(e.target.files[0])}
                style={{ fontSize: 12, color: MUTED, cursor: "pointer" }}
                disabled={uploadingMp3}
              />
              {uploadingMp3 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ height: 3, background: BORDER, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${uploadMp3Pct}%`, background: GOLD, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: GOLD, marginTop: 4 }}>Uploading… {uploadMp3Pct}%</div>
                </div>
              )}
              {lecForm.url && lecForm.url.includes("r2.dev") && (
                <div style={{ fontSize: 11, color: GOLD, marginTop: 8 }}>✓ MP3 ready: {lecForm.file}</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={saveLec} disabled={uploadingMp3} style={{ ...btn(), opacity: uploadingMp3 ? 0.5 : 1 }}>
                {editLec ? "Update Lecture" : "Add Lecture"}
              </button>
              {editLec && <button onClick={() => { setEditLec(null); setLecForm(EMPTY_LEC); }} style={btn(MUTED, true)}>Cancel</button>}
            </div>
          </div>

          {/* Lectures list */}
          <div style={{ border: `1px solid ${BORDER}` }}>
            {lectures.map((l, i) => (
              <div key={l.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                borderBottom: i < lectures.length - 1 ? `1px solid ${BORDER}` : "none",
                background: editLec === l.id ? GREEN_L : "transparent",
              }}>
                <span style={{ fontSize: 11, color: MUTED, minWidth: 24, flexShrink: 0 }}>#{l.sort}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: TEXT, fontFamily: SERIF }}>{l.title}</div>
                  <div style={{ fontSize: 11, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.file}</div>
                </div>
                <button onClick={() => startEditLec(l)} style={{ ...btn(GOLD, true), padding: "5px 12px", fontSize: 11 }}>Edit</button>
                <button onClick={() => deleteLec(l.id)} style={{ ...btn("#c0392b", true), padding: "5px 12px", fontSize: 11 }}>Del</button>
              </div>
            ))}
            {lectures.length === 0 && !busy && (
              <div style={{ padding: 32, textAlign: "center", color: MUTED, fontSize: 13 }}>No lectures yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AUDIO / LECTURES ─────────────────────────────────────────────
function AudioPage({ lectures, current, playing, play, skip, seek, progress, duration, fmt, audioRef }) {
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <PageTitle icon="audio" title="Ligjerata Islame" sub="Leksione dhe mësime nga studiuesit Islam" />

      {/* Player */}
      {current && (
        <div style={{ background: `linear-gradient(145deg,${SURFACE},#f0e8d0)`, border: `1px solid ${GOLD}50`, padding: "24px 28px", marginBottom: 24, borderRadius: 16, boxShadow: `0 4px 24px rgba(160,120,50,0.12)` }}>
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
              background: playing ? GOLD : "transparent", color: playing ? "#f0e6ce" : GOLD,
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
        {lectures.map((l, i) => {
          const isActive = current?.id === l.id;
          return (
            <div key={l.id} onClick={() => play(l)} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 20px", cursor: "pointer",
              background: isActive ? GREEN_L : "transparent",
              borderBottom: i < lectures.length - 1 ? `1px solid ${BORDER}` : "none",
              borderLeft: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#faf5ec"; }}
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