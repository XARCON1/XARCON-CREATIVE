# Evolución visual y comercial de XARCON

Base de trabajo: `654d3a5c38d726170a0b382dd7b75a5ba2705469`, sobre el repositorio y las rutas existentes.

## Arquitectura auditada y preservada

- React, TypeScript y Vite; rutas públicas independientes y aplicación administrativa cargada de forma diferida.
- `graphics/world.ts`, `worldFallback.ts` y `sceneMotion.ts`: escultura, cámara compartida y proyección de las tarjetas orbitales, sin cambios.
- `useSceneCamera`, `Reveal`, `DepthReveal` y `DissolveImage`: paralaje, revelado y continuidad cinematográfica, sin reemplazos.
- Dispositivos construidos en HTML/CSS, geometría de `Laptop` y apertura de escena conservadas.
- Se mantienen el perímetro neón animado, el cursor, los controles de pausa y el respeto a movimiento reducido. La rotación automática de interfaces se detiene fuera de vista, con pestaña oculta o pausa manual.
- Carrusel existente: seis marcas, duplicación necesaria para el bucle y ninguna tarjeta enlazada. No se crea un segundo portafolio.
- CRM, Firebase, autenticación, endpoints y aplicación administrativa sin modificaciones.

## Dirección aplicada

Azul más luminoso, verde lima, reflejos de los dispositivos y fotografía editorial auténtica. La base permanece oscura. Cuatro interfaces conceptuales distintas muestran gestión, web corporativa, automatización con IA y comercio electrónico. La explicación de servicios se amplía a demanda.

Se sustituyen textos extensos por titulares, fotografías y demostraciones. El proceso conserva sus cinco etapas y animaciones en una composición mucho más compacta. Las fuentes y condiciones de los nuevos activos están en `ASSETS.md`.

En la vista inicial de escritorio se contaron 530 palabras antes y 287 después en `.home-content`, excluyendo `.device-scene` para no contar teclas y contenido variable de las pantallas. Reducción aproximada: 46%. No es una métrica comercial ni incluye navegación, pie de página o contenido expandido.

## Verificación

Revisión visual en navegador Chromium con página completa y el visor adaptable del mismo origen (`/__review.html`). El visor incluye una barra de desplazamiento de 15 px, por lo que el ancho efectivo de contenido es menor que el ancho nominal del iframe.

| Vista | Resultado verificado |
| --- | --- |
| Escritorio, 1348 px efectivos | Hero, órbita al desplazar, demostraciones de servicios, fotografía editorial y proceso |
| Escritorio amplio, 1920 × 1080 (1905 px efectivos) | Proporciones contenidas, dispositivos sin invadir texto y sin desbordamiento horizontal |
| Escritorio de poca altura, 1440 × 768 (1425 px efectivos) | Hero y controles dentro de la composición |
| Tablet, 834 × 1194 (819 px efectivos) | Composición propia, dispositivos y controles separados; Hero de 1109 px |
| Móvil, 390 × 844 (375 px efectivos) | Hero de aproximadamente 777 px, CTAs accesibles, menú y acceso al formulario |
| Móvil pequeño, 360 × 800 (345 px efectivos) | Hero de aproximadamente 767 px, sin desbordamiento horizontal |

Interacciones comprobadas: selección y pausa de las interfaces del Hero; acceso al carrusel mediante el CTA; cambio de servicio y su interfaz; simulación local del flujo de IA; apertura de información adicional; navegación móvil a Contacto. El formulario se revisa sin enviar solicitudes de prueba al CRM.

Los controles de las interfaces del Hero tienen un área de 44 px de alto. Las imágenes son locales; el fondo móvil utiliza una variante de 51 kB. No se atribuye una puntuación Lighthouse ni se afirma una validación en dispositivos físicos.

Compilación: `npm run build` ejecuta comprobación TypeScript, compilación Vite y generación de metadatos por ruta. Se mantiene el aviso existente sobre el tamaño del módulo Three.js cargado por separado.

Publicación: se utiliza la conexión Git existente con Vercel y el dominio de producción `https://xarcon-creative.vercel.app/`, sin crear otro proyecto de alojamiento.

Evidencia visual previa a la publicación: [escritorio](qa/desktop.jpg), [tablet](qa/tablet.jpg) y [móvil](qa/mobile.jpg).
