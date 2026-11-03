import {useEffect,useRef,useState,type ReactNode} from 'react';
import {AnimatePresence,motion,useScroll,useSpring} from 'framer-motion';
import HeroScene from './components/HeroScene';
import {Arrow,Close,Play,Wave} from './components/Icons';
import {asset,resource} from './lib/assets';
import {formats,music,profile,type MusicItem} from './data';
import gearSource from '../gear-assets.json';

const nav=[['Sonido','#sonido'],['Deporte','#deporte'],['Cabina','#cabina'],['Press kit','#presskit']];
const mail='mailto:alangeovs@gmail.com?subject='+encodeURIComponent('Colaboración DJ deportiva | AlanGeovs')+'&body='+encodeURIComponent('Hola Alan,\n\nMe interesa explorar una colaboración deportiva.\n\nOrganización / comunidad:\nCarrera, encuentro o formato deportivo:\nFecha y sede:\nHorario / momento musical:\n\nDescripción del proyecto:\n');
const sectionMotion={initial:false as const,whileInView:{opacity:1},viewport:{once:true,amount:.1}};

function Shell({children,className=''}:{children:ReactNode,className?:string}){return <div className={`shell ${className}`}>{children}</div>}
function Label({children,light=false}:{children:ReactNode,light?:boolean}){return <p className={`eyebrow ${light?'eyebrow-dark':''}`}>{children}</p>}
function LinkButton({children,href,primary=false,external=false,className=''}:{children:ReactNode,href:string,primary?:boolean,external?:boolean,className?:string}){return <a href={href} className={`btn ${primary?'btn-primary':'btn-ghost'} ${className}`} {...external?{target:'_blank',rel:'noopener noreferrer'}:{}}>{children}<Arrow/></a>}

function Header(){
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const change=()=>setScrolled(window.scrollY>30);change();window.addEventListener('scroll',change,{passive:true});return()=>window.removeEventListener('scroll',change)},[]);
  const button=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus()}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[open]);
  return <header className={`site-header ${scrolled?'is-scrolled':''}`}><Shell className="flex items-center justify-between gap-4"><a className="brand" href="#inicio" aria-label="AlanGeovs — inicio"><picture><source media="(max-width:650px)" srcSet={asset('wordmark.svg')}/><img src={asset('logo-white.svg')} alt="AlanGeovs" width="1137" height="270"/></picture></a><nav className="desktop-nav" aria-label="Principal">{nav.map(([name,href])=><a key={href} href={href}>{name}</a>)}</nav><a className="header-contact" href="#colaboracion">Conexión deportiva <Arrow/></a><button ref={button} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)} aria-label={open?'Cerrar navegación':'Abrir navegación'}>{open?<Close/>:<span><i/><i/></span>}</button></Shell><nav id="mobile-nav" className="mobile-nav" aria-label="Navegación móvil" hidden={!open}>{nav.map(([name,href],i)=><a key={href} href={href} onClick={()=>setOpen(false)}><small>0{i+1}</small>{name}<Arrow/></a>)}<a href="#colaboracion" onClick={()=>setOpen(false)}><small>05</small>Colaboración deportiva<Arrow/></a></nav></header>
}

function Hero(){
  return <section id="inicio" className="hero-section"><div className="hero-grid-lines" aria-hidden="true"/><Shell><div className="hero-layout"><div className="hero-copy"><Label><span className="signal-dot"/>Electrónica × deporte × comunidad</Label><h1>El ritmo<br/>de estar<br/><span>vivo.</span></h1><p className="hero-lead">Melodías que emocionan.<br/>Ritmos que nos ponen en movimiento.</p><div className="hero-actions"><LinkButton href="#sonido" primary>Entrar en el sonido</LinkButton><LinkButton href="#deporte" className="hero-text-link">Explorar la propuesta deportiva</LinkButton></div><p className="hero-availability"><span>CDMX + alrededores</span><i/>Colaboraciones eventuales</p></div><HeroScene/></div><div className="hero-bottom"><div className="hero-coordinate"><span>ALANGEOVS / DJ & PRODUCTOR</span><p>Música para compartir el camino.</p></div><a href="#sonido" className="scroll-cue">DESLIZA PARA EXPLORAR<Arrow diagonal={false}/></a><span className="hero-bottom-index">VOL. 01 — EN MOVIMIENTO</span></div></Shell></section>
}

function GenreRibbon(){return <div className="genre-ribbon" aria-label="House, melodic house, trance, melodic trance, tech house y minimal"><div aria-hidden="true" className="ribbon-track">{[0,1].map(i=><span key={i}>HOUSE <b>✳</b> MELODIC HOUSE <b>✳</b> TRANCE <b>✳</b> TECH HOUSE <b>✳</b> MINIMAL <b>✳</b> MELODIC TRANCE <b>✳</b> </span>)}</div></div>}

function Sound(){
  const [tab,setTab]=useState<'sets'|'tracks'>('sets');
  const [selected,setSelected]=useState<MusicItem>(music[0]);
  const [playing,setPlaying]=useState(false);
  const items=music.filter(item=>item.type===tab);
  function choose(item:MusicItem){setSelected(item);setPlaying(true)}
  function changeTab(next:'sets'|'tracks'){setTab(next);setSelected(music.find(item=>item.type===next)!);setPlaying(false)}
  function tabKey(e:React.KeyboardEvent<HTMLButtonElement>){if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'sets':e.key==='End'?'tracks':tab==='sets'?'tracks':'sets';changeTab(next);document.getElementById(`tab-${next}`)?.focus()}}
  return <motion.section {...sectionMotion} id="sonido" className="section-space sound-section"><span id="musica" className="anchor-alias" aria-hidden="true"/><Shell><div className="section-heading"><div><Label>01 / El sonido</Label><h2>Una frecuencia.<br/><span className="text-muted">Muchas formas de sentir.</span></h2></div><p>Del groove del house a la emoción del trance. Sesiones continuas y producciones para descubrir el universo musical de AlanGeovs.</p></div><div className="sound-layout"><div className="featured-player"><div className="player-top"><span className="micro-label">AHORA EXPLORANDO</span><span className="signal-dot"/></div><div className={`record-stage ${playing?'record-active':''}`}><div className="record-orbit"/><div className="vinyl"><img src={asset(selected.cover)} alt={`Portada de ${selected.title}`} width="1254" height="1254" loading="lazy"/><i/></div><span className="record-side-label">MELODÍA / GROOVE / PROGRESIÓN</span></div><div className="featured-caption"><div><span>{selected.tag}</span><h3>{selected.title}</h3><p>{selected.subtitle}</p></div><button type="button" className="round-play" onClick={()=>setPlaying(!playing)} aria-label={playing?'Cerrar reproductor de SoundCloud':`Escuchar ${selected.title}`} aria-expanded={playing}>{playing?<Close/>:<Play/>}</button></div>{playing?<div className="soundcloud-embed"><iframe key={selected.id} title={`${selected.title} — ${selected.subtitle} en SoundCloud`} src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(selected.url)}&color=%2327C7C9&auto_play=false&hide_related=true&show_comments=false&show_user=false&visual=false`} allow="autoplay"/><p>Reproductor de SoundCloud. Inicia la música con sus controles.</p></div>:<div className="player-wave"><Wave/><span>EL VIAJE EMPIEZA AL ESCUCHAR</span></div>}</div><div className="music-library"><div className="library-tabs" role="tablist" aria-label="Catálogo musical"><button type="button" id="tab-sets" role="tab" aria-selected={tab==='sets'} aria-controls="music-panel" tabIndex={tab==='sets'?0:-1} onKeyDown={tabKey} onClick={()=>changeTab('sets')}>DJ sets <span>02</span></button><button type="button" id="tab-tracks" role="tab" aria-selected={tab==='tracks'} aria-controls="music-panel" tabIndex={tab==='tracks'?0:-1} onKeyDown={tabKey} onClick={()=>changeTab('tracks')}>Producciones <span>05</span></button></div><div role="tabpanel" id="music-panel" aria-labelledby={`tab-${tab}`} tabIndex={0}><AnimatePresence mode="wait" initial={false}><motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>{items.map((item,i)=><button key={item.id} type="button" className={`music-row ${selected.id===item.id?'is-selected':''}`} onClick={()=>choose(item)} aria-label={`Escuchar ${item.title} — ${item.subtitle}`}><span className="music-number">0{i+1}</span><img src={asset(item.cover)} alt="" width="72" height="72" loading="lazy"/><span className="music-row-copy"><b>{item.title}</b><small>{item.subtitle}</small></span><span className="music-row-play"><Play/></span></button>)}</motion.div></AnimatePresence></div><a href={selected.url} target="_blank" rel="noopener noreferrer" className="selected-track-link">Abrir selección en SoundCloud<Arrow/></a><div className="library-footer"><span>Un recorrido propio.<br/>Siempre en construcción.</span><a href={profile} target="_blank" rel="noopener noreferrer">Explorar perfil completo<Arrow/></a></div></div></div></Shell></motion.section>
}

function Sports(){
  const [active,setActive]=useState(0);const current=formats[active];
  function formatKey(e:React.KeyboardEvent<HTMLButtonElement>,index:number){let n=index;if(e.key==='ArrowRight')n=(index+1)%formats.length;else if(e.key==='ArrowLeft')n=(index+formats.length-1)%formats.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=formats.length-1;else return;e.preventDefault();setActive(n);document.getElementById(`format-${formats[n].id}`)?.focus()}
  return (
    <section id="deporte" className="sports-section sports-visual">
      <span id="experiencias" className="anchor-alias" aria-hidden="true"/>
      <Shell>
        <div className="section-heading">
          <div><Label light>02 / Música en movimiento</Label><h2>El esfuerzo es tuyo.<br/><span className="sports-heading-accent">La energía se comparte.</span></h2></div>
        </div>
        <div className="sports-tabs" role="tablist" aria-label="Formatos de colaboración deportiva">
          {formats.map((format,index)=>(
            <button type="button" role="tab" key={format.id} id={`format-${format.id}`} aria-selected={active===index} aria-controls="format-panel" tabIndex={active===index?0:-1} onKeyDown={event=>formatKey(event,index)} onClick={()=>setActive(index)}>
              <img src={asset(format.image)} alt="" loading="lazy"/>
              <span><small>{format.number}</small>{format.label}</span>
              <Arrow/>
            </button>
          ))}
        </div>
        <div id="format-panel" className="sports-stage" role="tabpanel" aria-labelledby={`format-${current.id}`} tabIndex={0}>
          <AnimatePresence initial={false}>
            <motion.figure key={current.id} className={`sports-scene sports-scene-${current.id}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.35}}>
              <img src={asset(current.image)} alt={current.alt} loading="lazy"/>
              <figcaption>
                <div className="sports-scene-label"><span>{current.number} / {current.label}</span><Wave/></div>
                <h3>{current.title}</h3>
                <p>{current.text}</p>
                <div className="sports-scene-tags">{current.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="sports-collab-note">
          <span className="signal-dot"/><p>Sets en vivo · CDMX y alrededores</p>
          <a href="#colaboracion">Hagamos equipo<Arrow/></a>
        </div>
      </Shell>
    </section>
  )
}

type Equipment={name:string,brand:string,category:string,description:string,alt:string,asset?:string,owned?:boolean,width:number,height:number,product_url:string,image_url:string};
const equipment:Equipment[]=gearSource.models;
function gearImage(item:Equipment){return item.asset?asset(item.asset.split('/').pop()!):item.image_url}
function EquipmentGallery(){
  const rail=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null);
  const [selected,setSelected]=useState<Equipment|null>(null);
  const [position,setPosition]=useState(1);
  const opener=useRef<HTMLButtonElement|null>(null);
  function show(item:Equipment,button:HTMLButtonElement){opener.current=button;setSelected(item)}
  useEffect(()=>{if(selected&&!dialog.current?.open)dialog.current?.showModal()},[selected]);
  function close(){dialog.current?.close();setSelected(null);opener.current?.focus()}
  function move(dir:number){const box=rail.current;if(!box)return;const card=box.querySelector<HTMLElement>('.gear-card');const gap=parseFloat(getComputedStyle(box).columnGap)||24;box.scrollBy({left:dir*((card?.offsetWidth||400)+gap),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
  return <section id="cabina" className="section-space gear-section"><Shell><div className="section-heading"><div><Label>03 / Universo de cabina</Label><h2>Donde el sonido<br/><span className="text-muted">toma forma.</span></h2></div><div className="gear-intro"><p>Mi equipo es el Pioneer DJ DDJ-FLX4. Aquí también están los modelos que conozco y con los que he practicado.</p><div className="rail-controls"><span>0{position}<i>/</i>0{equipment.length}</span><button type="button" onClick={()=>move(-1)} aria-label="Ver equipo anterior"><Arrow diagonal={false}/></button><button type="button" onClick={()=>move(1)} aria-label="Ver siguiente equipo"><Arrow diagonal={false}/></button></div></div></div></Shell><div ref={rail} className="gear-rail" onScroll={e=>{const el=e.currentTarget;const width=(el.querySelector<HTMLElement>('.gear-card')?.offsetWidth||1)+(parseFloat(getComputedStyle(el).columnGap)||24);setPosition(Math.min(equipment.length,Math.round(el.scrollLeft/width)+1))}}>{equipment.map((item,i)=><button type="button" className={item.owned?'gear-card gear-card-own':'gear-card'} key={item.name} onClick={e=>show(item,e.currentTarget)} aria-label={`Ampliar imagen de ${item.name}`}><div className="gear-top"><span>{item.brand}</span><small>0{i+1} / {item.owned?'EQUIPO PROPIO':'EQUIPO DE PRÁCTICA'}</small></div><div className="gear-photo"><img src={gearImage(item)} alt={item.alt} width={item.width} height={item.height} loading="lazy" referrerPolicy="no-referrer"/></div><div className="gear-caption"><div><p>{item.category}</p><h3>{item.name}</h3></div><span><Arrow/></span></div></button>)}</div><Shell><div className="gear-disclosure"><p>Imágenes oficiales de AlphaTheta y Pioneer DJ.</p><p>El montaje de cada evento se acuerda con producción.</p></div></Shell><dialog ref={dialog} className="equipment-dialog" aria-label={selected?`Equipo ${selected.name}`:'Detalle de equipo'} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}><div className="equipment-dialog-inner"><button type="button" className="dialog-close" onClick={close} aria-label="Cerrar detalle de equipo"><Close/></button>{selected&&<><Label>{selected.brand} / {selected.owned?'Equipo propio':'Equipo de práctica'}</Label><img src={gearImage(selected)} alt={selected.alt} width={selected.width} height={selected.height} referrerPolicy="no-referrer"/><div className="dialog-caption"><div><h3>{selected.name}</h3><p>{selected.description}</p></div><LinkButton href={selected.product_url} external>Ver equipo oficial</LinkButton></div></>}</div></dialog></section>
}

function Artist(){return <section id="sobre" className="artist-section"><Shell><div className="artist-layout"><figure className="studio-photo"><img src={asset('dj-session.webp')} alt="Visual conceptual de una sesión de mezcla con consola, audífonos y luces turquesa" width="1672" height="941" loading="lazy"/><figcaption>ESTUDIO / EL SONIDO EMPIEZA AQUÍ.<small>IMAGEN CONCEPTUAL</small></figcaption><img className="studio-brand" src={asset('symbol.svg')} alt="" aria-hidden="true" width="100" height="100"/></figure><div className="artist-copy"><Label>04 / Detrás de AlanGeovs</Label><h2>Moverse.<br/>Sentir.<br/><span>Conectar.</span></h2><p>Soy Alan, DJ y productor de música electrónica en Ciudad de México. Mi propuesta reúne groove, melodía y progresión, entre house, trance y texturas melódicas.</p><p>Comencé a explorar la mezcla en 2024 y desde 2025 me formo en Sound Space Academy. El running y la calistenia también forman parte de mi vida: de ahí nace mi interés por unir música y deporte.</p><a href="#presskit" className="inline-link">Conoce la propuesta completa<Arrow/></a></div></div></Shell></section>}

function PressKit(){return <section id="presskit" className="section-space presskit-section"><Shell><div className="presskit-panel"><div><Label>05 / Para organizaciones deportivas</Label><h2>Una idea en común.<br/>Una propuesta concreta.</h2><p>Biografía, música, formatos y ficha técnica. Todo lo necesario para explorar una colaboración con tu comunidad.</p><div className="flex flex-wrap gap-3"><a href={resource('AlanGeovs_Press_Kit.pdf')} className="btn btn-primary" download>Descargar press kit<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v13m-5-5 5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="1.5"/></svg></a><a className="btn btn-ghost" href={resource('presskit.html')}>Versión web<Arrow/></a></div></div><div className="technical-details"><details><summary>Equipo y conexión<span>+</span></summary><p>DDJ-FLX4, Rekordbox en MacBook Pro y audífonos propios. Salida máster RCA estéreo. La conexión al PA se acuerda con el técnico; las tiradas largas requieren una solución balanceada adecuada.</p></details><details><summary>Montaje y producción<span>+</span></summary><p>El organizador aporta PA y operación técnica acordes al espacio, mesa estable, energía segura y protección de sol o lluvia. Montaje y soundcheck por acordar.</p></details><details><summary>Formato de colaboración<span>+</span></summary><p>Participaciones eventuales y piloto como voluntario, sin honorarios de DJ; apoyo de traslado opcional. Duración, selección musical, locución y cortes se coordinan previamente. Una propuesta no confirma la fecha.</p></details></div></div></Shell></section>}

function Collaboration(){return <section id="colaboracion" className="collaboration-section"><span id="contacto" className="anchor-alias" aria-hidden="true"/><Shell><div className="collab-top"><Label>06 / Cuando el deporte nos conecta</Label><span className="micro-label">CDMX / COLABORACIONES EVENTUALES</span></div><h2>Compartamos<br/><span>el impulso.</span><a href={mail} aria-label="Proponer una colaboración deportiva por correo"><Arrow/></a></h2><div className="collab-bottom"><p>¿Hay música en el camino de tu comunidad?<br/>Me interesa conocer carreras, encuentros fitness, calistenia y previas deportivas que conecten con esta propuesta.</p><div><a href={mail} className="inline-link">Compartir proyecto deportivo<Arrow/></a><p>Participaciones según afinidad del proyecto y agenda.</p></div></div></Shell></section>}

function Footer(){return <footer className="site-footer"><Shell><div className="footer-brand"><img src={asset('wordmark.svg')} alt="AlanGeovs" width="874" height="200" loading="lazy"/></div><div className="footer-bottom"><span>EL RITMO DE ESTAR VIVO.</span><span>DJ & PRODUCTOR / CIUDAD DE MÉXICO</span><div><a href={profile} target="_blank" rel="noopener noreferrer">SoundCloud<Arrow/></a><a href="mailto:alangeovs@gmail.com">Correo<Arrow/></a><a href="#inicio">Volver arriba ↑</a></div></div></Shell></footer>}

export default function App(){
  const {scrollYProgress}=useScroll();const progress=useSpring(scrollYProgress,{stiffness:100,damping:30,restDelta:.001});
  return <><a className="skip-link" href="#contenido">Ir al contenido</a><motion.div className="scroll-progress" style={{scaleX:progress}} aria-hidden="true"/><Header/><main id="contenido"><Hero/><GenreRibbon/><Sound/><Sports/><EquipmentGallery/><Artist/><PressKit/><Collaboration/></main><Footer/></>
}
