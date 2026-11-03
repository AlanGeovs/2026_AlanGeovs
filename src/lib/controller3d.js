export function mountController(root) {
  'use strict';
  const canvas = root.querySelector('#dj-controller');
  const stage = root.querySelector('#controller-stage');
  const pause = root.querySelector('#pause-scene');
  if (!canvas || !stage || !pause) return;
  const abort = new AbortController();
  const listen=(target,type,handler,options={})=>target.addEventListener(type,handler,{...options,signal:abort.signal});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) { stage.classList.add('scene-fallback'); pause.hidden = true; return; }

  const vert = `attribute vec3 p; attribute vec3 n; attribute vec2 uv;
    uniform mat4 model; uniform mat4 vp;
    varying vec3 normal; varying vec3 position; varying vec2 texUV;
    void main(){vec4 w=model*vec4(p,1.0);position=w.xyz;normal=normalize(mat3(model)*n);texUV=uv;gl_Position=vp*w;}`;
  const frag = `precision mediump float;
    uniform vec3 color;uniform float glow;uniform float opacity;
    uniform sampler2D detail;uniform float textured;
    varying vec3 normal;varying vec3 position;varying vec2 texUV;
    void main(){vec3 N=normalize(normal);vec3 L=normalize(vec3(-0.45,0.9,0.65));
      float diffuse=max(dot(N,L),0.0);vec3 V=normalize(vec3(0.0,4.9,7.2)-position);
      float rim=pow(1.0-max(dot(N,V),0.0),3.0);
      float specular=pow(max(dot(N,normalize(L+V)),0.0),42.0);
      float fill=max(dot(N,normalize(vec3(0.8,0.25,-0.5))),0.0);
      vec3 c=color*(0.40+0.78*diffuse+glow)+vec3(0.04,0.16,0.18)*rim+vec3(0.23,0.30,0.39)*specular+vec3(0.035,0.02,0.075)*fill;
      if(textured>0.5)c=texture2D(detail,texUV).rgb*(0.95+diffuse*0.15);
      gl_FragColor=vec4(c,opacity);}`;
  function shader(type, source) { const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader unavailable');return s; }
  let program;
  try { program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vert));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Scene unavailable'); }
  catch(e){stage.classList.add('scene-fallback');pause.hidden=true;return;}
  gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  const loc={p:gl.getAttribLocation(program,'p'),n:gl.getAttribLocation(program,'n'),uv:gl.getAttribLocation(program,'uv')};
  const uni=Object.fromEntries(['model','vp','color','glow','opacity','detail','textured'].map(k=>[k,gl.getUniformLocation(program,k)]));
  const I=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
  function transform(x,y,z,sx,sy,sz,ry=0,rx=0){const c=Math.cos(ry),s=Math.sin(ry),cx=Math.cos(rx),sn=Math.sin(rx);const a=new Float32Array([c*sx,0,-s*sx,0,s*sn*sy,cx*sy,c*sn*sy,0,s*cx*sz,-sn*sz,c*cx*sz,0,x,y,z,1]);return a;}
  function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),d=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*d,-1,0,0,2*far*near*d,0]);}
  function lookAt(eye,center){let z=eye.map((n,i)=>n-center[i]);let l=Math.hypot(...z);z=z.map(n=>n/l);let x=[z[2],0,-z[0]];l=Math.hypot(...x);x=x.map(n=>n/l);const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,n,i)=>s+n*eye[i],0),-y.reduce((s,n,i)=>s+n*eye[i],0),-z.reduce((s,n,i)=>s+n*eye[i],0),1]);}
  function mesh(positions,normals,mode=gl.TRIANGLES){const data=new Float32Array(positions.length/3*8);for(let i=0;i<positions.length/3;i++){data.set(positions.slice(i*3,i*3+3),i*8);data.set(normals.slice(i*3,i*3+3),i*8+3);data.set([positions[i*3]+.5,positions[i*3+2]+.5],i*8+6);}const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return {buffer,count:positions.length/3,mode};}
  function cube(){const p=[],n=[];const faces=[[[1,0,0],[[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,.5]]],[[-1,0,0],[[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[-.5,-.5,-.5]]],[[0,1,0],[[-.5,.5,-.5],[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5]]],[[0,-1,0],[[-.5,-.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5]]],[[0,0,1],[[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]]],[[0,0,-1],[[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]]]];for(const [normal,points]of faces)for(const j of [0,1,2,0,2,3]){p.push(...points[j]);n.push(...normal);}return mesh(p,n);}
  function cylinder(){const p=[],n=[],N=48;for(let i=0;i<N;i++){const a=i/N*Math.PI*2,b=(i+1)/N*Math.PI*2,ax=Math.cos(a),az=Math.sin(a),bx=Math.cos(b),bz=Math.sin(b);p.push(ax,-.5,az,bx,-.5,bz,bx,.5,bz,ax,-.5,az,bx,.5,bz,ax,.5,az);n.push(ax,0,az,bx,0,bz,bx,0,bz,ax,0,az,bx,0,bz,ax,0,az);p.push(0,.5,0,ax,.5,az,bx,.5,bz,0,-.5,0,bx,-.5,bz,ax,-.5,az);n.push(0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0);}return mesh(p,n);}
  function circle(){const p=[],n=[];for(let i=0;i<100;i++){const a=i/100*Math.PI*2,b=(i+1)/100*Math.PI*2;p.push(Math.cos(a),0,Math.sin(a),Math.cos(b),0,Math.sin(b));n.push(0,1,0,0,1,0);}return mesh(p,n,gl.LINES);}
  const meshes={box:cube(),cyl:cylinder(),circle:circle(),screen:mesh([-.5,0,-.5,.5,0,-.5,.5,0,.5,-.5,0,-.5,.5,0,.5,-.5,0,.5],Array.from({length:6},()=>[0,1,0]).flat())};
  const display=document.createElement('canvas');display.width=768;display.height=256;
  const screen=display.getContext('2d');
  const screenTexture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,screenTexture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.uniform1i(uni.detail,0);
  function updateScreen(){
    screen.fillStyle='#07101b';screen.fillRect(0,0,768,256);
    screen.fillStyle='#162b3a';screen.fillRect(0,0,768,40);
    screen.font='bold 15px monospace';screen.fillStyle='#c3dfe4';screen.fillText('ALANGEOVS  /  SOUND IN MOTION',20,26);
    screen.fillStyle='#27c7c9';screen.fillText('A',20,76);screen.fillStyle='#aa8aff';screen.fillText('B',20,158);
    for(let deck=0;deck<2;deck++){
      const mid=90+deck*82;
      screen.strokeStyle='#254151';screen.lineWidth=1;
      for(let x=62;x<748;x+=36){screen.beginPath();screen.moveTo(x,mid-29);screen.lineTo(x,mid+29);screen.stroke();}
      screen.strokeStyle=deck?'#ab8afa':'#27c7c9';screen.lineWidth=2;
      for(let x=62;x<748;x+=4){const t=x*.16+phase*(deck?15:20);const env=.3+.7*Math.abs(Math.sin(x*.009+phase*.35));const a=(5+24*Math.abs(Math.sin(t)+.35*Math.sin(t*2.7)))*env;screen.beginPath();screen.moveTo(x,mid-a);screen.lineTo(x,mid+a);screen.stroke();}
      screen.fillStyle='#f4f2ed';screen.fillRect(344,mid-33,2,66);
    }
    screen.fillStyle='#90a9b7';screen.font='12px monospace';screen.fillText('HOUSE / GROOVE',62,231);screen.fillText('TRANCE / MELODY',410,231);
    gl.bindTexture(gl.TEXTURE_2D,screenTexture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,display);
  }
  const C={body:[.055,.065,.095],edge:[.11,.13,.18],top:[.075,.09,.125],rim:[.18,.205,.24],disc:[.08,.10,.14],ink:[.65,.7,.76],cyan:[.08,.62,.64],violet:[.36,.23,.72],off:[.075,.13,.15]};
  const objects=[];
  function add(type,pos,scale,color,glow=0,ry=0,rx=0){objects.push({type,pos,scale,color,glow,ry,rx});}
  add('box',[0,0,0],[7.4,.34,3.72],C.body);
  add('box',[0,.187,0],[7.28,.045,3.58],C.top);
  add('box',[0,-.12,1.87],[7.15,.06,.04],C.edge);
  add('box',[0,-.01,1.898],[1.8,.025,.01],C.cyan,.4);
  add('box',[0,-.09,1.91],[6.9,.018,.012],C.cyan,.7);
  add('box',[-3.72,-.02,0],[.035,.22,3.5],C.rim);
  add('box',[3.72,-.02,0],[.035,.22,3.5],C.rim);
  add('box',[0,.64,-1.57],[2.7,.1,1.07],C.body,0,0,.65);
  for(const side of [-1,1]){
    const x=side*2.12;
    add('cyl',[x,.255,-.15],[.98,.12,.98],C.rim);
    add('cyl',[x,.325,-.15],[.94,.035,.94],side<0?C.cyan:C.violet,.12);
    add('cyl',[x,.35,-.15],[.905,.045,.905],C.disc);
    add('cyl',[x,.378,-.15],[.635,.017,.635],[.12,.14,.18]);
    add('cyl',[x,.39,-.15],[.16,.014,.16],[.2,.23,.28]);
    add('circle',[x,.403,-.15],[.61,1,.61],C.rim,.1);
    for(let ring=0;ring<7;ring++)add('circle',[x,.405,-.15],[.66+ring*.033,1,.66+ring*.033],[.19,.22,.27],.05);
    for(let j=0;j<48;j++){const a=j/48*Math.PI*2;add('box',[x+Math.cos(a)*.86,.415,-.15+Math.sin(a)*.86],[.012,.007,.028],C.ink,.05,-a);}
    for(let j=0;j<40;j++){const a=j/40*Math.PI*2;add('box',[x+Math.cos(a)*.96,.272,-.15+Math.sin(a)*.96],[.025,.06,.025],C.body);}
    for(let j=0;j<4;j++)for(let r=0;r<2;r++)add('box',[x-.63+j*.42,.263,.99+r*.39],[.345,.085,.28],j===0||r===1?(side<0?C.cyan:C.violet):C.off,j===0?.32:.03);
    for(let j=0;j<3;j++){add('cyl',[x-.65+j*.5,.295,-1.3],[.105,.17,.105],C.edge);add('box',[x-.65+j*.5,.386,-1.3],[.02,.007,.09],C.ink);}
    add('box',[side*3.33,.227,-.05],[.04,.014,1.56],C.body);
    add('box',[side*3.33,.3,.12],[.25,.1,.18],C.rim);
    for(let j=0;j<9;j++)add('box',[side*3.49,.23,-.72+j*.17],[.09,.008,.014],C.ink);
    add('cyl',[side*3.2,.265,1.36],[.15,.08,.15],C.cyan,.35);
    add('cyl',[side*3.2,.265,.91],[.13,.08,.13],C.rim);
    add('box',[side*.8,.217,0],[.014,.018,3.35],C.edge);
    add('box',[side*.36,.22,.79],[.038,.012,.89],C.body);
    add('box',[side*.36,.29,.75],[.28,.10,.18],C.rim);
    add('box',[side*.36,.346,.75],[.20,.009,.016],C.ink);
    for(let j=0;j<4;j++){
      const z=-1.23+j*.43;
      add('cyl',[side*.4,.31,z],[.105,.20,.105],C.edge);
      add('box',[side*.4,.416,z-.045],[.018,.009,.085],C.ink);
    }
  }
  add('box',[0,.22,1.46],[1.24,.015,.035],C.body);
  add('box',[-.1,.29,1.46],[.15,.12,.24],C.rim);
  add('box',[-.1,.355,1.46],[.013,.008,.16],C.ink);
  for(let i=0;i<4;i++)add('cyl',[-.7+i*.47,-.21,-1.1],[.08,.12,.08],C.body);
  let w=0,h=0,frame=0,phase=0,last=0,yaw=-.12,pitch=0,hoverX=0,hoverY=0,drag=false,px=0,py=0,active=true,photoMode=false,paused=reduced.matches;
  function draw(m,model,color,glow=0,opacity=1,textured=0){gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.enableVertexAttribArray(loc.p);gl.vertexAttribPointer(loc.p,3,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(loc.n);gl.vertexAttribPointer(loc.n,3,gl.FLOAT,false,32,12);gl.enableVertexAttribArray(loc.uv);gl.vertexAttribPointer(loc.uv,2,gl.FLOAT,false,32,24);gl.uniformMatrix4fv(uni.model,false,model);gl.uniform3fv(uni.color,color);gl.uniform1f(uni.glow,glow);gl.uniform1f(uni.opacity,opacity);gl.uniform1f(uni.textured,textured);gl.drawArrays(m.mode,0,m.count);}
  function render(){updateScreen();const zoom=Math.max(1,1.15/(w/h));const view=lookAt([0,4.9*zoom,7.2*zoom],[0,.3,0]);gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uni.vp,false,mul(perspective(.76,w/h,.1,100),view));
    const root=transform(0,.04+Math.sin(phase*.5)*.045,0,1,1,1,yaw+hoverX+Math.sin(phase*.22)*.025,pitch+hoverY);
    function part(type,pos,scale,color,glow=0,ry=0,opacity=1,rx=0){draw(meshes[type],mul(root,transform(...pos,...scale,ry,rx)),color,glow,opacity);}
    part('circle',[0,-.4,0],[4.7,1,2.8],[.05,.19,.23],.1,.0,.4);
    part('circle',[0,-.4,0],[4.0,1,2.4],[.08,.11,.25],.1,.0,.35);
    for(let j=0;j<41;j++){const x=(j-20)*.176;const envelope=Math.pow(Math.sin((j+1)/42*Math.PI),1.4);const amp=.14+envelope*(.3+.75*(.5+.5*Math.sin(phase*2.4+j*.76))+.35*(.5+.5*Math.sin(phase*1.3+j*.31)));part('box',[x,.35+amp*.5,-2.08],[.045,amp,.045],j<20?C.cyan:C.violet,.25,0,.60);}
    for(let grid=-8;grid<=8;grid++){part('box',[grid*.6,-.45,0],[.008,.008,6.5],[.04,.16,.19],.04,0,.35);part('box',[0,-.45,grid*.4],[9.6,.008,.008],[.05,.10,.19],.03,0,.3);}
    for(const o of objects){const pad=o.type==='box'&&o.scale[0]===.345;part(o.type,o.pos,o.scale,o.color,pad?.3+.35*(.5+.5*Math.sin(phase*2.4+o.pos[0]*2+o.pos[2]*4)):o.glow,o.ry,1,o.rx);}
    draw(meshes.screen,mul(root,transform(0,.693,-1.528,2.52,1,.92,0,.65)),[1,1,1],0,1,1);
    for(const side of [-1,1]){
      const spin=phase*(side<0?.58:-.50);
      for(let j=0;j<3;j++){const a=spin+j*Math.PI*2/3;part('box',[side*2.12+Math.sin(a)*.72,.407,-.15+Math.cos(a)*.72],[.025,.012,.14],side<0?C.cyan:C.violet,.55,a);}
      for(let j=0;j<11;j++){const level=Math.floor(7+3*Math.sin(phase*2.3+side));part('box',[side*.105,.24,-.72+j*.12],[.055,.022,.08],j<level?(j>8?C.violet:C.cyan):C.off,j<level?.55:0);}
    }
  }
  function resize(){const r=stage.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,1.65);w=Math.max(1,Math.round(r.width*dpr));h=Math.max(1,Math.round(r.height*dpr));canvas.width=w;canvas.height=h;render();}
  function syncButton(){pause.textContent=paused?'Reanudar animación':'Pausar animación';pause.setAttribute('aria-pressed',String(paused));stage.closest('.controller-showcase').classList.toggle('animation-paused',paused);}
  function tick(ms){frame=0;if(paused||!active||photoMode||document.hidden)return;if(!last||ms-last>31){phase+=last?Math.min((ms-last)/1000,.07):0;last=ms;render();}frame=requestAnimationFrame(tick);}
  function start(){if(!frame&&!paused&&active&&!photoMode&&!document.hidden){last=0;frame=requestAnimationFrame(tick);}}
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
  listen(pause,'click',()=>{paused=!paused;syncButton();if(paused)stop();else start();});
  listen(document,'dj:scene-view',e=>{photoMode=e.detail.photo;if(photoMode)stop();else{resize();start();}});
  listen(canvas,'pointerdown',e=>{if(reduced.matches)return;drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
  listen(canvas,'pointermove',e=>{if(reduced.matches)return;if(drag){yaw+=Math.max(-.06,Math.min(.06,(e.clientX-px)*.004));pitch=Math.max(-.18,Math.min(.18,pitch+(e.clientY-py)*.002));px=e.clientX;py=e.clientY;}else if(e.pointerType==='mouse'){const r=canvas.getBoundingClientRect();hoverX=((e.clientX-r.left)/r.width-.5)*.14;hoverY=((e.clientY-r.top)/r.height-.5)*.04;}if(paused)render();});
  function end(){drag=false;canvas.classList.remove('dragging');}
  listen(canvas,'pointerup',end);listen(canvas,'pointercancel',end);listen(canvas,'pointerleave',()=>{hoverX=0;hoverY=0;if(paused)render();});
  listen(canvas,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Escape'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw-=.14;if(e.key==='ArrowRight')yaw+=.14;if(e.key==='ArrowUp')pitch=Math.max(-.18,pitch-.04);if(e.key==='ArrowDown')pitch=Math.min(.18,pitch+.04);if(e.key==='Escape'){yaw=-.12;pitch=0;}render();});
  listen(reduced,'change',()=>{paused=reduced.matches;syncButton();if(paused){stop();phase=0;render();}else start();});
  listen(document,'visibilitychange',()=>{if(document.hidden)stop();else start();});
  const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)start();else stop();},{threshold:.05});observer.observe(stage);
  listen(window,'resize',resize,{passive:true});
  listen(canvas,'webglcontextlost',e=>{e.preventDefault();stop();stage.classList.add('scene-fallback');pause.hidden=true;});
  listen(canvas,'webglcontextrestored',()=>window.location.reload());
  syncButton();resize();stage.classList.add('scene-ready');start();
  return () => {stop();observer.disconnect();abort.abort();Object.values(meshes).forEach(m=>gl.deleteBuffer(m.buffer));gl.deleteTexture(screenTexture);gl.getAttachedShaders(program)?.forEach(shader=>gl.deleteShader(shader));gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();};
}
