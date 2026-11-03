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
  {id:'running',label:'Running',number:'01',title:'Antes de salir.\nDespués de llegar.',text:'Recibir a la comunidad, acompañar el calentamiento y celebrar el esfuerzo de cruzar la meta. Una progresión musical que respeta los tiempos de la carrera.',tags:['House','Melodic House','Trance'],time:'Bloques propuestos de 30–45 min',note:'Coordinación con salidas, locución y premiación.'},
  {id:'fitness',label:'Fitness + calistenia',number:'02',title:'El impulso\nse comparte.',text:'Groove y melodías para entrenamientos, encuentros de calistenia y activaciones deportivas. La intensidad y los cortes se planean con quienes conducen la actividad.',tags:['Tech House','Minimal','Melodic Techno'],time:'Bloques propuestos de 30–60 min',note:'Selección y energía según la dinámica del encuentro.'},
  {id:'partido',label:'Previas deportivas',number:'03',title:'La emoción\nempieza antes.',text:'Una propuesta para recepción, fan zone o previa de partido. Bloques musicales pensados con producción para acompañar a la afición y el guion del evento.',tags:['House','Tech House','Progresión'],time:'Formato y duración por acordar',note:'Medio tiempo sujeto a ventanas y autorización de producción.'},
] as const;
