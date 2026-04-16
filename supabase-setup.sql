-- ─── Muslim's Path — Supabase Setup SQL ─────────────────────────────────────
-- Run this entire file in your Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- ── 1. BOOKS TABLE ─────────────────────────────────────────────────────────
create table if not exists books (
  id   bigint generated always as identity primary key,
  title  text not null,
  author text not null,
  cat    text not null,
  url    text not null default '#'
);

-- Allow anonymous reads (no login required)
alter table books enable row level security;
create policy "public read books" on books for select using (true);

-- ── 2. LECTURES TABLE ──────────────────────────────────────────────────────
create table if not exists lectures (
  id   bigint generated always as identity primary key,
  sort int  not null,
  title text not null,
  file  text not null,
  url   text not null
);

alter table lectures enable row level security;
create policy "public read lectures" on lectures for select using (true);

-- ── 3. SEED BOOKS ──────────────────────────────────────────────────────────
insert into books (title, author, cat, url) values
-- Quran & Translation
('Quran.com',                                   'Multiple translations & audio',       'Quran',        'https://quran.com'),
('The Clear Quran',                              'Dr. Mustafa Khattab',                 'Quran',        'https://theclearquran.org'),
('The Meaning of the Holy Quran',                'Abdullah Yusuf Ali',                  'Quran',        '#'),
('The Message of the Quran',                     'Muhammad Asad',                       'Quran',        '#'),
-- Tafsir
('Tafsir Ibn Kathir (4 vols)',                   'Ibn Kathir',                          'Tafsir',       '#'),
('Tafheem ul-Quran',                             'Abul Ala Maududi',                    'Tafsir',       'https://www.tafheem.net'),
('In the Shade of the Quran',                    'Sayyid Qutb',                         'Tafsir',       '#'),
('Tafsir al-Jalalain',                           'al-Suyuti & al-Mahalli',              'Tafsir',       '#'),
('Tafsir al-Sa''di',                             'Abdur Rahman al-Sa''di',              'Tafsir',       '#'),
-- Hadith
('Sahih al-Bukhari',                             'Imam al-Bukhari',                     'Hadith',       'https://sunnah.com/bukhari'),
('Sahih Muslim',                                 'Imam Muslim',                         'Hadith',       'https://sunnah.com/muslim'),
('Sunan Abu Dawud',                              'Abu Dawud al-Sijistani',              'Hadith',       'https://sunnah.com/abudawud'),
('Jami'' at-Tirmidhi',                           'Imam at-Tirmidhi',                    'Hadith',       'https://sunnah.com/tirmidhi'),
('Sunan Ibn Majah',                              'Ibn Majah al-Qazwini',                'Hadith',       'https://sunnah.com/ibnmajah'),
('Riyad as-Salihin',                             'Imam an-Nawawi',                      'Hadith',       'https://sunnah.com/riyadussalihin'),
('40 Hadith of an-Nawawi',                       'Imam an-Nawawi',                      'Hadith',       'https://sunnah.com/nawawi40'),
('Al-Adab al-Mufrad',                            'Imam al-Bukhari',                     'Hadith',       'https://sunnah.com/adab'),
('Sunnah.com',                                   '9 hadith collections online',         'Hadith',       'https://sunnah.com'),
-- Seerah
('The Sealed Nectar',                            'Saifur Rahman al-Mubarakpuri',        'Seerah',       '#'),
('In the Footsteps of the Prophet',              'Tariq Ramadan',                       'Seerah',       '#'),
('Muhammad: His Life Based on the Earliest Sources', 'Martin Lings',                   'Seerah',       '#'),
('When the Moon Split',                          'Safiur Rahman Mubarakpuri',           'Seerah',       '#'),
('The Life of the Prophet Muhammad (4 vols)',    'Ibn Kathir',                          'Seerah',       '#'),
('Muhammad: A Prophet for Our Time',             'Karen Armstrong',                     'Seerah',       '#'),
-- Fiqh
('Fiqh us-Sunnah',                              'Sayyid Sabiq',                        'Fiqh',         '#'),
('Reliance of the Traveller (Umdat al-Salik)',   'Ahmad ibn Naqib al-Misri',            'Fiqh',         '#'),
('Mukhtasar al-Quduri',                          'Imam al-Quduri (Hanafi)',             'Fiqh',         '#'),
('Minhaj al-Talibin',                            'Imam an-Nawawi (Shafi''i)',            'Fiqh',         '#'),
('Bidayat al-Mujtahid',                          'Ibn Rushd (Maliki)',                  'Fiqh',         '#'),
('Principles of Islamic Jurisprudence',          'Mohammad Hashim Kamali',             'Fiqh',         '#'),
-- Aqeedah
('The Fundamentals of Tawheed',                  'Abu Ameenah Bilal Philips',           'Aqeedah',      '#'),
('Kitab al-Tawheed',                             'Muhammad ibn Abd al-Wahhab',          'Aqeedah',      '#'),
('The Creed of Imam al-Tahawi',                  'Imam al-Tahawi',                      'Aqeedah',      '#'),
('Explanation of the Creed',                     'Imam al-Barbahari',                   'Aqeedah',      '#'),
('The Divine Reality',                           'Hamza Andreas Tzortzis',              'Aqeedah',      '#'),
-- Spirituality
('The Revival of the Religious Sciences (Ihya)', 'Imam al-Ghazali',                    'Spirituality', '#'),
('The Alchemy of Happiness',                     'Imam al-Ghazali',                    'Spirituality', '#'),
('Remembrance of Death and the Afterlife',       'Imam al-Ghazali',                    'Spirituality', '#'),
('The Book of Assistance',                       'Imam al-Haddad',                     'Spirituality', '#'),
('Don''t Be Sad',                                'Aaidh al-Qarni',                     'Spirituality', '#'),
('Purification of the Heart',                    'Hamza Yusuf (trans.)',               'Spirituality', '#'),
('Reclaim Your Heart',                           'Yasmin Mogahed',                     'Spirituality', '#'),
('The Ideal Muslim',                             'Dr. Muhammad Ali al-Hashimi',        'Spirituality', '#'),
('Patience and Gratitude',                       'Ibn Qayyim al-Jawziyyah',            'Spirituality', '#'),
('The Key to Paradise',                          'Ibn Rajab al-Hanbali',               'Spirituality', '#'),
('Inner Dimensions of Islamic Worship',          'Imam al-Ghazali',                    'Spirituality', '#'),
('The Garden of the Gnostics',                   'Ibn Qayyim al-Jawziyyah',            'Spirituality', '#'),
-- Dua & Dhikr
('Fortress of the Muslim (Hisnul Muslim)',        'Said bin Ali al-Qahtani',            'Dua & Dhikr',  'https://islamicstudies.info'),
('The Accepted Whispers',                         'Ashraf Ali Thanawi',                 'Dua & Dhikr',  '#'),
('Book of Remembrance (al-Adhkar)',               'Imam an-Nawawi',                     'Dua & Dhikr',  '#'),
-- History
('Lost Islamic History',                          'Firas Alkhateeb',                    'History',      '#'),
('The History of the Khalifahs',                  'Jalal ad-Din as-Suyuti',             'History',      '#'),
('The Venture of Islam (3 vols)',                  'Marshall Hodgson',                   'History',      '#'),
('Islam: Empire of Faith',                         'Robert Gardiner',                    'History',      '#'),
('A History of Islamic Societies',                 'Ira Lapidus',                        'History',      '#'),
-- Modern Thought
('The Road to Mecca',                              'Muhammad Asad',                      'Modern Thought','#'),
('Islam: The Straight Path',                       'John L. Esposito',                   'Modern Thought','#'),
('No god but God',                                 'Reza Aslan',                         'Modern Thought','#'),
('The Heart of Islam',                             'Seyyed Hossein Nasr',                'Modern Thought','#'),
('Islam and the Future of Tolerance',              'Sam Harris & Maajid Nawaz',          'Modern Thought','#'),
('Being Muslim',                                   'Haroon Moghul',                      'Modern Thought','#'),
('Struggling to Surrender',                        'Jeffrey Lang',                       'Modern Thought','#'),
-- Arabic
('Madinah Arabic Reader (6 vols)',                 'Dr. V. Abdur Rahim',                 'Arabic',       '#'),
('Gateway to Arabic',                              'Imran Alawiye',                      'Arabic',       '#'),
('Arabic Between Your Hands',                      'Abdur Rahman Ibrahim',               'Arabic',       '#'),
-- Online
('IslamQA',                                        'Sheikh Muhammad Saalih al-Munajjid', 'Online',       'https://islamqa.info'),
('SeekersGuidance',                                'Online Islamic education',            'Online',       'https://seekersguidance.org'),
('Yaqeen Institute',                               'Research & publications',             'Online',       'https://yaqeeninstitute.org'),
('Muslim Central',                                 'Lectures & audio',                    'Online',       'https://muslimcentral.com'),
('1000 Duas',                                      'Comprehensive dua resource',          'Online',       'https://1000duas.com'),
('Duaa.app',                                       'Daily supplications',                 'Online',       'https://duaa.app'),
-- Shqip (Albanian)
('10 Sfidat e Jetës',                              'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/10-sfidat-e-jetes.pdf'),
('99 Emrat e Allahut',                             'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/99Names-2019.pdf'),
('Kush është Profeti Muhamed ﷺ',                  'AIITC',                               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/AIITC-Ky-eshte-profeti-Muhamed-a.s..pdf'),
('Madhërimi i Allahut',                            'Abdulaziz et-Tarifi',                'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulaziz-et-Tarifi-Madherimi-i-Allahut.pdf'),
('Gjykimi ndaj Magjisë dhe Fallit',                'Abdulaziz ibn Baz',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulaziz-ibn-Baz-Gjykimi-ndaj-magjes-dhe-fallit.pdf'),
('Mbi Rrugën e të Parëve Tanë',                   'Abdulkadër Arnauti',                 'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulkader-Arnauti-Mbi-rrugën-e-te-pareve-tane-selefit.pdf'),
('Sahih el-Bukhari — Vëllimi 1',                  'Mehdi Polisi',                        'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Mehdi-Polisi-Sahih-el-Bukhari-Vellimi-01.pdf'),
('Sahih el-Bukhari — Vëllimi 2',                  'Abdullah Hamiti',                     'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdullah-Hamiti-Sahih-el-Bukhari-Vellimi-02.pdf'),
('Këshilla të Arta për Morale të Larta',          'Abdulmelik Ramadani',                'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulmelik-Ramadani-Keshilla-te-arta.pdf'),
('Rregulla rreth Tekfirit',                        'Abdulmunim Mustafa Halime',          'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdulmunim-Mustafa-Halime-Rregulla-rreth-tekfirit.pdf'),
('Realiteti i Besimit të Vërtetë',                'Abdurrahman es-Sadij',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Abdurrahman-es-Sadij-Realiteti-i-Besimit-te-Vertete.pdf'),
('Hallalli dhe Harami në Islam',                   'Dr. Jusuf Kardavi',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Dr.-Jusuf-Kardavi-Hallalli-dhe-harami-me-balline.pdf'),
('Kandili i Ramazanit',                            'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/KANDILI-I-RAMAZANIT.pdf'),
('Kurani dhe Shkenca',                             'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Kurani-drejt-shkences-me-kopertine.pdf'),
('Libri i Agjërimit',                              'Salih ibn Feuzan',                   'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Libri-i-Agjerimit-Salih-ibn-Feuzan-el-Feuzan-1.pdf'),
('Forma e Namazit të të Dërguarit ﷺ',            'Imam Albani',                         'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Muhammed-Nasiruddin-el-Albani-Forma-e-namazit-te-te-derguarit.pdf'),
('Namazi i Natës — Teravitë në Ramazan',          'Imam Albani',                         'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Namazi-i-nates-teravite-ne-Ramazan-Imam-Albani.pdf'),
('Ndejat e Muajit Ramazan',                        'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Ndejat-e-Muajit-Ramazan.pdf'),
('Pozita e Synetit në Islam',                      'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/POZITA-E-SYNETIT-NE-ISLAM-ok.pdf'),
('Përmendja — Dhikri dhe Lutjet',                 'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Permendja-finalja.pdf'),
('Emrat dhe Cilësitë e Allahut',                  'Xhamia Mbret Fahd',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/Xhamia-Mbret-Emrat-dhe-Cilesit-e-Allahut.pdf'),
('Historitë e Pejgamberëve',                      'Literaturë Islame',                  'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/historite-e-pejgambereve-botim-1-1.pdf'),
('Albislam — Nr. 63',                              'Revistë Islame Shqip',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam63.pdf'),
('Albislam — Nr. 64',                              'Revistë Islame Shqip',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam64.pdf'),
('Albislam — Nr. 65',                              'Revistë Islame Shqip',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam65.pdf'),
('Albislam — Nr. 66',                              'Revistë Islame Shqip',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/albislam66.pdf'),
('Dituria Islame — Nr. 250',                       'Revistë Islame Shqip',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/dituria250.pdf'),
('Dituria Islame — Nr. 282',                       'Revistë Islame Shqip',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/dituria282.pdf'),
('Dituria Islame — Nr. 283',                       'Revistë Islame Shqip',               'Shqip',        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/dituria283.pdf');

-- ── 4. SEED LECTURES ───────────────────────────────────────────────────────
insert into lectures (sort, title, file, url) values
(1,  'Butësia',                                     'Butësia.mp3',                                                          'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/But%C3%ABsia.mp3'),
(2,  'Cili është Çelësi i Fitores?',                'Cili eshte çelesi i fitores.mp3',                                      'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Cili%20eshte%20%C3%A7elesi%20i%20fitores.mp3'),
(3,  'Dije dhe Vetëm Dije',                          'Dije dhe vetem Dije.mp3',                                              'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Dije%20dhe%20vetem%20Dije.mp3'),
(4,  'Dije dhe Vetëm Dije — Pjesa 2',               'Dije dhe vetem Dije 2.mp3',                                            'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Dije%20dhe%20vetem%20Dije%202.mp3'),
(5,  'Edukata e Dijes',                              'Edukata e Dijes.mp3',                                                  'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Edukata%20e%20Dijes.mp3'),
(6,  'Furnizimi — Si ta Shtojmë Atë',               'Furnizimi, Si ta shtojme ate .mp3',                                    'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Furnizimi%2C%20Si%20ta%20shtojme%20ate%20.mp3'),
(7,  'Hadithe për Hallalin, Haramin dhe Ndalesat',  'Hadithe per Hallalin, Haramin dhe ndalesat ne Islam.mp3',              'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Hadithe%20per%20Hallalin%2C%20Haramin%20dhe%20ndalesat%20ne%20Islam.mp3'),
(8,  'Libri i Urtësive 48 — Pastrimi i Vetvetes',  'Libri i Urtesive 48 _ Pastrimi i vetvetes.mp3',                       'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Libri%20i%20Urtesive%2048%20_%20Pastrimi%20i%20vetvetes.mp3'),
(9,  'Mendjelehti',                                  'Mendjelehti.mp3',                                                      'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Mendjelehti.mp3'),
(10, 'Mos u Pikëllo, Por Dëgjoji Këto Rregulla',   'Mos u pikëllo por dëgjoji këto rregulla...mp3',                       'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Mos%20u%20pik%C3%ABllo%20por%20d%C3%ABgjoji%20k%C3%ABto%20rregulla....mp3'),
(11, 'Njeriu — Krijesa e Fisnikëruar',              'Njeriu Krijesa e Fisnikeruar.mp3',                                     'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Njeriu%20Krijesa%20e%20Fisnikeruar.mp3'),
(12, 'Padrejtësia',                                  'Padrejtësia.mp3',                                                      'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Padrejt%C3%ABsia.mp3'),
(13, 'Përhapja e Optimizmit dhe Rëndësia e Tij',   'Perhapja e Optimizmit dhe rendesia e tij.mp3',                        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Perhapja%20e%20Optimizmit%20dhe%20rendesia%20e%20tij.mp3'),
(14, 'Rëndësia e Optimizmit dhe Mendimit të Mirë', 'Rendesia e Optimizmit dhe mendimit te mire.mp3',                      'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Rendesia%20e%20Optimizmit%20dhe%20mendimit%20te%20mire.mp3'),
(15, 'Rëndësia e Optimizmit — Pjesa 2',            'Rendesia e optimizmit dhe mendimit te mire - Pjesa 2.mp3',             'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Rendesia%20e%20optimizmit%20dhe%20mendimit%20te%20mire%20-%20Pjesa%202.mp3'),
(16, 'Shiko Veten dhe Vlerësoje Atë',               'Shiko veten dhe vlerësoje atë.mp3',                                   'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Shiko%20veten%20dhe%20vler%C3%ABsoje%20at%C3%AB.mp3'),
(17, 'Vendimi dhe Përcaktimi',                       'Vendimi dhe percaktimi.mp3',                                           'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/Vendimi%20dhe%20percaktimi.mp3'),
(18, 'Vendimi dhe Përcaktimi — Pjesa 2',            'vendimi dhe përcaktimi-2.mp3',                                        'https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev/audio/Ligjerata/vendimi%20dhe%20p%C3%ABrcaktimi-2.mp3');
