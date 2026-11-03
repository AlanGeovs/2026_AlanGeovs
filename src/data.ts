export const profile='https://soundcloud.com/alangeovs';
export const music = [
  {id:'set-abril',type:'sets',title:'Trance / Melodic House',subtitle:'Setlist · Abril 2026',cover:'estela-infinita.jpg',url:`${profile}/prueba-ssa-20260414-corregido`,tag:'SESIÓN CONTINUA'},
  {id:'set-042026',type:'sets',title:'Trance / Melodic House',subtitle:'Setlist · 042026',cover:'orbita-interior.jpg',url:`${profile}/trance-melodic-house-setlist`,tag:'SESIÓN CONTINUA'},
  {id:'estela',type:'tracks',title:'Estela infinita',subtitle:'Melodic House & Techno Mix',cover:'estela-infinita.jpg',url:`${profile}/estela-infinita-melodic-house-techno-mix`,tag:'PRODUCCIÓN'},
  {id:'orbita',type:'tracks',title:'Órbita interior',subtitle:'Melodic Techno Mix',cover:'orbita-interior.jpg',url:`${profile}/orbita-interior-melodic-techno-mix`,tag:'PRODUCCIÓN'},
  {id:'pulso',type:'tracks',title:'Pulso abierto',subtitle:'House Mix',cover:'pulso-abierto.jpg',url:`${profile}/pulso-abierto-house-mix`,tag:'PRODUCCIÓN'},
  {id:'estela-tech',type:'tracks',title:'Estela infinita',subtitle:'Tech House Mix',cover:'estela-infinita.jpg',url:`${profile}/estela-infinita-tech-house-mix`,tag:'PRODUCCIÓN'},
  {id:'luz',type:'tracks',title:'Entre luz y calma',subtitle:'Techno Mix',cover:'entre-luz-y-calma.jpg',url:`${profile}/entre-luz-y-calma-techno-mix`,tag:'PRODUCCIÓN'},
] as const;
export type MusicItem = (typeof music)[number];
export const formats = [
  {id:'running',label:'Running',number:'01',image:'running-community.webp',alt:'Corredores en una ruta urbana al amanecer',title:'Que la meta se escuche.',text:'Del primer paso al último sprint.',tags:['House','Melodic House','Trance']},
  {id:'fitness',label:'Fitness + calistenia',number:'02',image:'fitness-community.webp',alt:'Atletas de calistenia entrenando en un parque',title:'Una repetición más.',text:'Groove para calistenia, fuerza y comunidad.',tags:['Tech House','Minimal','Melodic Techno']},
  {id:'partido',label:'Previas deportivas',number:'03',image:'stadium-community.webp',alt:'Visual conceptual de una afición reunida ante una cabina DJ',title:'El partido empieza afuera.',text:'La afición se enciende antes del silbatazo.',tags:['House','Tech House','Progresión']},
] as const;
