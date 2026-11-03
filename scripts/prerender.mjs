import {readFile,writeFile} from 'node:fs/promises';
import {render} from '../.build-ssr/prerender.js';
const url=new URL('../dist/index.html',import.meta.url);
const html=await readFile(url,'utf8');
const markup=render();
if(!html.includes('<div id="root"></div>'))throw Error('Root placeholder missing');
await writeFile(url,html.replace('<div id="root"></div>',`<div id="root">${markup}</div>`));
console.log('React content prerendered: music, sports, equipment and official identity available before hydration.');
