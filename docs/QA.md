# Revisión de XARCON Creative

Fecha: 20 de septiembre de 2026.

## Revisión inicial

Se abrió el repositorio y el deployment existente. Se conservaron capturas de las seis páginas en desktop (1440 × 900) y móvil (390 × 844), junto con la rama de respaldo del estado original. La nueva dirección artística no depende de los componentes visuales anteriores.

## Revisión adaptable

Se revisó el hero visualmente en los ocho tamaños del brief. Se comprobaron las seis páginas en cada tamaño: 48 combinaciones, todas con un único H1 y sin desbordamiento horizontal ni imágenes cargadas rotas. La evidencia estructurada está en `responsive-matrix.json`.

| Tamaño CSS | Páginas verificadas |
| --- | --- |
| 1920 × 1080 | Las seis |
| 1440 × 900 | Las seis |
| 1366 × 768 | Las seis |
| 1024 × 768 | Las seis |
| 768 × 1024 | Las seis |
| 430 × 932 | Las seis |
| 390 × 844 | Las seis |
| 360 × 800 | Las seis |

Método: Chromium, con el sitio real dentro de un iframe de dimensiones exactas. En pantallas grandes la captura se escala para caber en la vista de revisión, sin cambiar el viewport CSS del sitio. El ancho del documento excluye la barra vertical de desplazamiento. Esto no equivale a pruebas en dispositivos físicos ni a una certificación de Safari/iOS.

Se capturaron las seis páginas del rediseño en desktop y móvil. También se inspeccionaron el menú, las tarjetas fotográficas, los módulos de capacidades, las interfaces conceptuales y el cierre.

## Interacciones comprobadas

- Apertura, cierre con Escape y navegación desde el menú móvil.
- Selección de servicios y acordeón de capacidades.
- Simulación y estado final del flujo de automatización, sin mensajes externos.
- Filtro comercial del portal: muestra solo el espacio comercial conceptual.
- Filtro «En revisión» del panel: muestra solo la tarea correspondiente.
- Reserva conceptual: muestra día y hora elegidos e indica que no se creó una reserva.
- Contacto vacío: no permite continuar.
- Contacto con correo inválido: bloquea el avance.
- Contacto válido: genera el resumen con los valores introducidos.
- Copia del resumen y descarga de `mi-proyecto-xarcon.txt`; se comprobó el contenido del archivo descargado.

No se enviaron consultas, reservas, correos ni mensajes reales. El canal de contacto está pendiente de un destinatario verificado.

## Build y contenido

- `npm run build`: correcto, incluye TypeScript estricto.
- Metadatos HTML de las seis rutas: título, descripción y canonical verificados contra `src/content/seo.json`.
- `npm audit --omit=dev --audit-level=high`: sin vulnerabilidades reportadas en la revisión.
- Fuentes e imágenes locales; carga diferida de rutas interiores e imágenes fuera del hero.
- JavaScript inicial: aproximadamente 141 kB comprimido con gzip. Las rutas interiores se separan en chunks.
- Sin errores propios de la aplicación en la consola de las páginas muestreadas.
- Se retiraron las compilaciones temporales `__hero` y `__stage` del código final.

No se ejecutó Lighthouse ni se afirma una puntuación o una medición de 60 FPS. La verificación del deployment final y la URL pública se realiza después del commit de producción y se informa en la entrega.
