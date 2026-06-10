const R2 = "https://pub-cdb1d5a2606a4ef68b5d888d9c684d9e.r2.dev";

export const LECTURES = [
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
