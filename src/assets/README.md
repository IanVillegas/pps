# Assets DecPat

Convencion: imagenes en `./images`, importadas como modulo (igual que
`src/sad-aml-shared/assets/images`), no copiadas a `public/`.

## Pendientes de exportar desde Figma (marca 2026)

Identificados en `tasks/preparacion-tecnica-visual.md`, seccion 7. No se
pudieron exportar en esta tarea porque el conector MCP de Figma no esta
autorizado en esta sesion; quedan documentados para exportarlos apenas se
habilite el acceso o se reciban directo del equipo de diseno.

| Asset                    | Uso                              | Referencia Figma                                                     | Archivo destino propuesto              |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Logo rojo/negro 2026      | Header, shell                     | Design System GM, ver `tasks/preparacion-tecnica-visual.md` seccion 7  | `src/assets/images/logo-red-black.svg`  |
| Logo blanco de login      | Pantalla de login                 | Nodo 43121:6904 (Login)                                                | `src/assets/images/logo-white-login.svg`|
| Fondo exacto de login     | Pantalla de login                 | Nodo 43121:6904 (Login)                                                | `src/assets/images/login-background.png`|
| Ilustracion de error      | Pantallas de error general/shell  | Nodos 43121:455 y 43121:517                                            | `src/assets/images/error-illustration.svg` |

Hasta que existan estos archivos, no se debe simular su presencia (ni con un
export vacio ni con un placeholder que rompa `next/image`). Los componentes
que los necesiten (shell, login, pantallas de error) deben marcarlo como
pendiente explicito, no usar un logo o fondo heredado de `sad-aml-shared`
como si fuera el definitivo de DecPat.

Los logos heredados de referencia (naranja, rojo #E5353E) siguen disponibles
en `src/sad-aml-shared/assets/images/logo-orange-*.svg` solo para comparar
contra el rojo 2026 (#E62C3A); no se reutilizan como asset final de DecPat.
