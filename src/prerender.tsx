import {renderToString} from 'react-dom/server';
import {MotionConfig} from 'framer-motion';
import App from './App';
export {App};
export function render(){return renderToString(<MotionConfig reducedMotion="user"><App/></MotionConfig>)}
