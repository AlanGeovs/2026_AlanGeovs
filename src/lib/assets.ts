declare global { interface Window { __ALANGEOVS_ASSETS__?: Record<string,string>; __ALANGEOVS_LINKS__?:Record<string,string> } }
export function asset(name:string):string {
  return typeof window!=='undefined' && window.__ALANGEOVS_ASSETS__?.[name] || `assets/${name}`;
}
export function resource(name:string):string {
  return typeof window!=='undefined' && window.__ALANGEOVS_LINKS__?.[name] || name;
}
