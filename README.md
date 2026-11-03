# AlanGeovs — electrónica, deporte y comunidad

Portfolio desarrollado con React 19, TypeScript, Tailwind CSS 4, Vite y Framer Motion. Node.js ejecuta el desarrollo, la compilación y el prerenderizado. La producción sirve archivos estáticos con contenido React prerenderizado e hidratación de las interacciones.

## Desarrollo

Requiere Node.js 22.12 o superior.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm test
npm run review
node scripts/check-review.mjs
```

El build de producción se genera en `dist/`. La vista portable se genera en `review/AlanGeovs_vista_previa.html`. Incluye React, estilos, fuente y las imágenes locales; las fotos oficiales de CDJ-3000X y DJM-A9 y SoundCloud requieren conexión. `build.py` conserva compatibilidad y delega a `npm run build`.

## Estructura

- `src/App.tsx`: navegación, catálogo/reproductor, formatos deportivos, galería ampliable, ficha técnica y colaboración.
- `src/components/HeroScene.tsx`: portada con consola WebGL interactiva y vista fotográfica de XDJ-AZ.
- `src/lib/controller3d.js`: geometría, luces, pantalla, pads, pausa, reducción de movimiento y liberación de recursos WebGL.
- `src/styles.css`: sistema visual y Tailwind; identidad E4 y Space Grotesk.
- `public/`: imágenes, tipografía y press kit preservados como fuentes de publicación.
- `brand-assets.json` y `gear-assets.json`: procedencia de identidad e imágenes oficiales.

Las colaboraciones son deportivas y eventuales, sujetas a afinidad y agenda. La galería de equipos es una referencia visual: el equipo propio declarado en el rider sigue siendo DDJ-FLX4.

## Verificación y publicación

TypeScript y el build de cliente/SSR verifican la compilación. Las pruebas DOM comprueban catálogo, selección de grabación, formato deportivo, navegación y galería; el fallback fotográfico se comprueba cuando WebGL no está disponible. No sustituyen una revisión visual en navegador ni una prueba real de GPU.

## Despliegue

Ejecuta `npm ci` y `npm run build` con Node.js 22.12 o superior. Publica el contenido de `dist/` en la raíz del sitio. La aplicación publicada no necesita un proceso Node.js ni una base de datos.
