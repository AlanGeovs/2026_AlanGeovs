import {useEffect,useRef,useState} from 'react';
import {motion,useMotionValue,useSpring,useTransform,useReducedMotion} from 'framer-motion';
import {asset} from '../lib/assets';
import {mountController} from '../lib/controller3d';
import {Wave} from './Icons';

export default function HeroScene(){
  const ref=useRef<HTMLDivElement>(null);
  const [view,setView]=useState<'3d'|'photo'>('3d');
  const [has3D,setHas3D]=useState(true);
  const reduced=useReducedMotion();
  const x=useMotionValue(0),y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:75,damping:22}),sy=useSpring(y,{stiffness:75,damping:22});
  const rotateX=useTransform(sy,[-.5,.5],[7,-7]),rotateY=useTransform(sx,[-.5,.5],[-9,9]);
  useEffect(()=>{if(!ref.current)return;const cleanup=mountController(ref.current);if(ref.current.querySelector('.scene-fallback')){setHas3D(false);setView('photo')}return cleanup},[]);
  useEffect(()=>{document.dispatchEvent(new CustomEvent('dj:scene-view',{detail:{photo:view==='photo'}}))},[view]);
  return <div ref={ref} className="controller-showcase hero-console" onPointerMove={e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left)/r.width-.5);y.set((e.clientY-r.top)/r.height-.5)}} onPointerLeave={()=>{x.set(0);y.set(0)}}>
    <div className="console-orbit orbit-a" aria-hidden="true"/><div className="console-orbit orbit-b" aria-hidden="true"/><div className="console-glow glow-a" aria-hidden="true"/><div className="console-glow glow-b" aria-hidden="true"/>
    <div className="scene-top"><span className="micro-label">ESTUDIO / ALANGEOVS</span><span className="scene-signal"><i/>SOUND IN MOTION</span></div>
    <div className="scene-vertical" aria-hidden="true">GROOVE • EMOCIÓN • PROGRESIÓN</div>
    <div id="controller-stage" className="controller-stage" data-view={view}>
      <motion.img className="controller-fallback" src={asset('xdj-az.webp')} alt="AlphaTheta XDJ-AZ, sistema DJ profesional con dos jog wheels y pantalla" width={1600} height={986} fetchPriority="high" style={{rotateX,rotateY}}/>
      <canvas id="dj-controller" tabIndex={view==='3d'?0:-1} aria-hidden={view!=='3d'} role="img" aria-label="Consola DJ tridimensional interactiva con jog wheels, pads luminosos y pantalla de ondas" aria-describedby="scene-help"/>
      <div className="deck-label deck-a"><b>01</b><span>GROOVE<br/><em>HOUSE / MINIMAL</em></span></div><div className="deck-label deck-b"><b>02</b><span>EMOCIÓN<br/><em>TRANCE / MELODIC</em></span></div>
    </div>
    <div className="scene-controls"><div className="scene-switch" role="group" aria-label="Visual de la consola"><button type="button" aria-pressed={view==='3d'} disabled={!has3D} onClick={()=>setView('3d')}>Consola 3D</button><button type="button" aria-pressed={view==='photo'} onClick={()=>setView('photo')}>XDJ-AZ real</button></div><Wave/><button id="pause-scene" type="button" aria-pressed="false" hidden={view==='photo'} className="pause-scene">Pausar animación</button></div>
    <div className="scene-caption"><span id="scene-help">{view==='3d'?'Arrastra para girar · También con las flechas':'XDJ-AZ / imagen oficial de AlphaTheta'}</span><span>{view==='3d'?'CONCEPTO DE CABINA':'REFERENCIA VISUAL'}</span></div>
  </div>
}
