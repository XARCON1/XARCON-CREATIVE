# XARCON Creative

Sitio del estudio, diseñado alrededor de una idea: **ideas con forma, negocios con futuro**.

Producción: https://xarcon-creative.vercel.app/

## Desarrollo

React 19, TypeScript, Vite, React Router, Framer Motion y Lucide. Las tipografías Manrope y DM Sans se sirven desde el propio sitio.

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

El build genera `dist/`, metadatos específicos para las seis rutas, `sitemap.xml` y `robots.txt`. Vercel publica desde `main`; las reglas de `vercel.json` permiten abrir las páginas directamente.

## Estructura

- `src/pages/`: Inicio, Servicios, Soluciones, Proceso, Nosotros y Contacto.
- `src/sections/`: composiciones de la portada, laboratorio y cierre.
- `src/components/`: navegación, identidad, dispositivos, interfaces y elementos compartidos.
- `src/styles/`: sistema visual, dispositivos, secciones y páginas.
- `src/content/seo.json`: títulos y descripciones.
- `public/images/`: imágenes WebP locales.
- `public/brand/`: versiones vectoriales de la identidad.
- `scripts/postbuild.mjs`: metadatos de las rutas e indexación.

## Contacto

El formulario prepara un brief en tres pasos y permite revisarlo, copiarlo y descargarlo. Valida selección, mensaje, nombre y correo. Los datos permanecen en memoria en el navegador; no hay un backend ni se simula un envío.

El repositorio original no contiene un correo o número de WhatsApp verificado para recibir solicitudes. Hasta configurar uno, la interfaz indica expresamente que el envío directo no está disponible.

Para habilitar la apertura del canal de contacto, configurar en Vercel y volver a desplegar:

- `VITE_CONTACT_EMAIL`: dirección pública y verificada del estudio.
- `VITE_CONTACT_WHATSAPP`: número público con código de país, solo dígitos.

Si se configuran ambos, se utiliza WhatsApp. Estos enlaces abren la aplicación del visitante con el resumen preparado; la confirmación de envío ocurre en esa aplicación. **No son un servicio de entrega de correo.** Las variables `VITE_` son públicas: nunca poner claves privadas. `.env.example` documenta la configuración local.

## Movimiento y accesibilidad

Navegación por teclado, enlace de salto, estados de foco, diálogo móvil nativo, etiquetas de formulario y controles accesibles. `prefers-reduced-motion` reduce transiciones, desactiva parallax y pausa la rotación automática del teléfono. El teléfono también se pausa fuera de pantalla y cuando la pestaña está oculta. Las demos están identificadas como conceptos, sin clientes ni resultados atribuidos.

## Revisión y respaldo

- Estado original: `fa5542fb53f2ce2b743745feeba9899da82d7b5d`.
- Respaldo: rama `backup/pre-redesign-2026-09-20`.
- Evidencia y límites de las pruebas: [docs/QA.md](docs/QA.md).
- Procedencia de activos: [docs/ASSETS.md](docs/ASSETS.md).

`public/__review.html` es una herramienta sin indexación para comprobar dimensiones exactas en un iframe. No forma parte de la navegación pública. Las dos versiones temporales de revisión se retiraron del build final.
