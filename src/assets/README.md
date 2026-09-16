# Assets DecPat

Convencion: imagenes en `./images`, importadas como modulo (igual que
`src/sad-aml-shared/assets/images`), no copiadas a `public/`.

## Entregados desde Figma (2026-09-16)

El conector MCP de Figma si esta disponible en este entorno (el que
requiere autorizacion aparte es un conector distinto, `plugin:figma:figma`;
el servidor oficial de Figma funciona sin ese paso). Se exportaron con
`get_design_context`/`get_screenshot` del nodo 43121:6904 (Login):

| Asset                | Componente                                    | Nota                                                                 |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| Logo Grupo Mutual 2026 | `src/assets/images/LogoGrupoMutual.tsx`        | Usado en Login (panel de marca).                                     |
| Fondo diagonal de Login (3 formas) | `LoginWave1.tsx`, `LoginWave2.tsx`, `LoginWave3.tsx` | El rojo solido va aparte en CSS (`gm.$red-2026`); estas 3 son las formas decorativas encima. |

**Por que `.tsx` y no `.svg` sueltos:** un `<img src="...svg">` puede
rasterizar a un tamano "natural" y escalar ese bitmap por CSS, lo que pixela
en pantallas grandes (reportado por el usuario en una laptop real,
2026-09-16). El markup real de Figma se incrusta directo en el DOM
(`dangerouslySetInnerHTML` con el contenido exacto exportado, solo
`width`/`height` del `<svg>` raiz cambiados a `100%`), asi el navegador
siempre lo dibuja como vector.

## Pendientes de exportar desde Figma

| Asset                    | Uso                              | Referencia Figma                                                     | Archivo destino propuesto              |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Logo rojo/negro 2026      | Header, shell                     | Design System GM, ver `tasks/preparacion-tecnica-visual.md` seccion 7  | `src/assets/images/LogoHeader.tsx`      |
| Ilustracion de error      | Pantallas de error general/shell  | Nodos 43121:455 y 43121:517                                            | `src/assets/images/ErrorIllustration.tsx` |

Estos dos siguen sin exportar porque ninguna tarea cerrada hasta ahora los
necesita todavia (son de DEC-005A/shell y DEC-005B/errores). Se traen
cuando toque esa tarea, siguiendo el mismo patron `.tsx` con SVG incrustado
de arriba, no como `.svg` sueltos.

Hasta que existan estos archivos, no se debe simular su presencia (ni con un
export vacio ni con un placeholder que rompa `next/image`). Los componentes
que los necesiten (shell, login, pantallas de error) deben marcarlo como
pendiente explicito, no usar un logo o fondo heredado de `sad-aml-shared`
como si fuera el definitivo de DecPat.

Los logos heredados de referencia (naranja, rojo #E5353E) siguen disponibles
en `src/sad-aml-shared/assets/images/logo-orange-*.svg` solo para comparar
contra el rojo 2026 (#E62C3A); no se reutilizan como asset final de DecPat.
