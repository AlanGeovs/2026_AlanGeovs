import {hydrateRoot,createRoot} from 'react-dom/client';
import {MotionConfig} from 'framer-motion';
import App from './App';
import './styles.css';
const root=document.getElementById('root')!;
const app=<MotionConfig reducedMotion="user"><App/></MotionConfig>;
if(root.hasChildNodes())hydrateRoot(root,app);else createRoot(root).render(app);
