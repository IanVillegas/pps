# DEC-005A Shell interno

Implementada 2026-09-17 (sesion interrumpida por limite de uso de otro entorno).
Revisada, validada y cerrada 2026-09-17. Commit a cargo del usuario.

## Implementacion

- `AppShell` (`src/components/Templates/AppShell/AppShell.tsx`) compone `DashboardLayout` + `SideBar` + `Header` de `sad-aml-shared` con los datos de DecPat: menu de cinco items (Inicio, Mi declaración, Reportes, Declaraciones, Mantenimientos — solo Inicio tiene ruta real, el resto son botones deshabilitados con `title="No disponible"` hasta que existan sus pantallas) y nombre del usuario en el header.
- `SessionService` (`src/services/SessionService.ts`): sesion mock en memoria (no persiste al recargar, documentado en el propio archivo), con patron observable (`subscribeSession`/`getSession`/`getServerSession`) consumido via `useSyncExternalStore` en `InicioLayout`.
- `src/app/inicio/layout.tsx`: guardia de ruta — sin sesion redirige a `/` con `router.replace`; `src/app/inicio/page.tsx` queda vacio a proposito, el contenido informativo es DEC-005B.
- `Login.tsx` ahora llama `startMockSession(data.username)` y redirige a `/inicio` en vez de mostrar el mensaje de exito en la misma pantalla (ese placeholder ya no aplica).
- Componentes de `sad-aml-shared` reescritos para recibir datos por props en vez de contenido hardcodeado de otro microfrontend (rutas/menus de un producto bancario distinto, `useTranslation` sin instancia, `next/router` de Pages Router que no funciona en App Router):
  - `SideBar`: antes tenia un enum de rutas ajeno (`enumMf`), un Drawer para tablet/movil y un boton de colapsar; ahora recibe `items`/`logo` por props, usa `next/link`, y se adapta con un solo breakpoint (`max-width: 1100px`, angosta el ancho e iconos) en vez de un Drawer separado — coherente con que el alcance ya no incluye telefonos (`AGENTS.md`).
  - `Header`: recibe `clientName`/`handleLogout` por props; ya no depende de `CurrencyInfo`/`ProfileInfoHeader` con datos fijos de otro dominio.
  - `ProfileNavigation`: aria-label corregido de ingles ("Customise options") a espanol ("Menú de usuario"); el logout ahora es un `DropdownMenu.Item` con `onSelect` real (antes anidaba un `Button` completo dentro del Item, redundante); se agrego estado `data-highlighted` para foco por teclado.
  - `DashboardLayout`: recibe `sidebar`/`header`/`title` por props en vez de armarlos internamente con un `handleLogout` que era un no-op (`() => {}`, hallazgo ya anotado en `preparacion-tecnica-visual.md` seccion 3). Cambia `height: 100vh; overflow: hidden` por `min-height: 100vh` (el primero recortaba contenido mas alto que la pantalla). Se agrego skip-link ("Saltar al contenido") y `<main>` semantico con `h1`.

## Validacion

Pendiente de la sesion anterior, completada en esta revision:

- `check-types`: OK.
- `lint`: encontro 1 error real (formato Prettier en `AppShell.test.tsx`, una aserción `toHaveAttribute` partida en varias lineas); corregido con `npx prettier --write` y reverificado. `lint` final: sin errores ni avisos.
- `test -- --runInBand`: 7 suites, 29 pruebas, todas en verde (incluye las 3 nuevas de `AppShell.test.tsx`: contenido visible con rutas inexistentes deshabilitadas, apertura del menu por teclado + logout, y que terminar la sesion no borra el usuario recordado).
- `build`: OK (con el servidor dev detenido, evitando el error de chunks ya documentado en `DEC-003A`). Genera `/`, `/inicio` y `/_not-found`.
- V3, verificado en esta revision con Chrome automatizado (no solo confiar en el reporte de la sesion anterior):
  - Navegar a `/inicio` sin sesion redirige a `/` (Login).
  - Login exitoso redirige a `/inicio`, header muestra "Hola, `<usuario>`".
  - Menu de usuario: abre por click, "Cerrar sesión" con rol `menuitem`; logout redirige a `/` y borra la sesion.
  - "Recordar mi usuario" marcado: tras logout, `localStorage` conserva el usuario y el campo lo precarga en el siguiente login (verificado con `getSession`/`localStorage` reales, no solo lectura de codigo).
  - Capturas en 768x1024 y 1366x768: sidebar, header y contenido sin desbordamiento; item activo "Inicio" en rojo con flecha; items sin ruta muestran boton deshabilitado. Sin errores en consola. `logo-header.png` carga con 200 OK.

## Archivos y orden de copia

1. Shared: `Header.tsx`/`.module.scss`, `SideBar.tsx`/`.module.scss`, `ProfileNavigation.tsx`/`.module.scss`, `DashboardLayout.tsx`/`.module.scss` (los cuatro con cambios de props incompatibles con su version anterior — ver "Diferencias y pendientes").
2. Tipos y servicio: `src/types/Session.types.ts`, `src/services/SessionService.ts`.
3. Shell DecPat: `src/components/Templates/AppShell/AppShell.tsx` y `AppShell.test.tsx`.
4. Rutas: `src/app/inicio/layout.tsx`, `src/app/inicio/page.tsx`.
5. Asset: `src/assets/images/LogoHeader.tsx`, `AppShell.module.scss` (nuevo, solo la clase `.logo`).
6. Login: `src/components/Pages/Login/Login.tsx`, `Login.test.tsx`, `LoginFeedback.test.tsx` (agregan la redireccion a `/inicio` y su prueba).
7. Documentacion: `tasks/todo.md` y este archivo.

## Ajustes posteriores al cierre inicial (2026-09-17)

El usuario revisó el shell contra Mutual en Línea y encontró dos cosas:

- **Sin hover en el sidebar**: confirmado que era una omisión real del código (`SideBar.module.scss` no tenía ninguna regla `:hover`, ni siquiera en el item habilitado "Inicio"), no una consecuencia de que el resto de items esten deshabilitados. Primera correccion (gris `$gray-100`) reemplazada: el usuario aporto un analisis del hover real de "Mutual en Linea" (mismo componente `ListItem`/`SideMenuList` legado, via Gemini) — en hover, un item de menu se ve exactamente como "activo" (fondo rojo, texto blanco, la misma sombra `rgba(233,85,93,0.35)`) y su flecha se revela. Se implemento ese comportamiento adaptado a la estructura actual: `.active, li:has(> a:hover) { .sideBar__arrow { display: flex; } a { color: white; background: $red-2026; box-shadow: ...; } }`, reemplazando la regla gris anterior. `:has()` permite que un `<button disabled>` (nunca tiene `<a>` adentro) jamas dispare el efecto, sin depender de JS para distinguirlo; soporte de navegador Chrome/Edge 105+, Firefox 121+, Safari 15.4+, suficiente para un sistema interno. `SideBar.tsx` ya no oculta el icono de flecha por JS (`item.active &&`); ahora siempre se renderiza y el CSS decide su visibilidad.
- **Bug adicional encontrado al probar el hover (no introducido por este cambio)**: la version "compacta" del sidebar para tablet (`@media max-width: 1100px`, pensada para angostar los botones a 184px) nunca se aplicaba: su selector (`a, button`, especificidad 0,0,2) perdia siempre contra la regla base (`nav a, nav button`, especificidad 0,0,3), sin importar el orden en la hoja de estilos. No rompia nada visible porque 215px cabia igual dentro del contenedor ya angostado a 216px, pero el ajuste no ocurria. Corregido igualando la especificidad (`nav a, nav button` tambien en el media query). Verificado con `getComputedStyle` en 768px: el ancho del enlace pasa de 215px a 184px como se esperaba.
- Verificado en navegador (con un item temporalmente habilitado solo para la prueba, revertido despues): hover en un item habilitado no activo se ve igual que "activo" (rojo, blanco, flecha) en 1024 y 768px; los items deshabilitados no reaccionan al hover en ningun viewport. No se agrego una prueba de Jest para esto: jsdom no simula matching de `:hover`/`:has()` sobre eventos de mouse (limitacion ya documentada en este proyecto para el foco async de Radix).
- **Mensaje "Ingreso exitoso." eliminado**: el usuario lo describio como poco profesional y pidio no reemplazarlo por nada (ni siquiera un toast) — la redireccion a `/inicio` ya es suficiente confirmacion. Se elimino el estado `success` de `Login.tsx` y la rama que reemplazaba el formulario por ese texto; ahora el formulario permanece montado hasta que `router.replace('/inicio')` completa la navegacion real. Se actualizaron las pruebas que dependian de ese texto (`Login.test.tsx`, `LoginFeedback.test.tsx`) para esperar `mockReplace` en su lugar.

Validacion de este ajuste: `check-types`, `lint` (1 error de formato Prettier corregido) y `test -- --runInBand` (7 suites, 29 pruebas) OK. Verificado en navegador: login exitoso ya no muestra ningun mensaje intermedio, pasa directo al shell.

## Diferencias y pendientes

- **Cambio disruptivo en componentes compartidos**: `Header`, `SideBar`, `ProfileNavigation` y `DashboardLayout` cambiaron su interfaz de props por completo (ya no aceptan `isDrawerOpen`/`openDrawer`/`closeDrawer`, el enum `enumMf`, etc.). Como `sad-aml-shared` es la libreria real que Grupo Mutual reutiliza entre proyectos (no una copia de un solo uso, ver `AGENTS.md`), cualquier otro consumidor de estos componentes se rompe al traer esta version. El codigo anterior ya tenia datos de otro microfrontend bancario (rutas de pagos, `useTranslation` sin inicializar) que no aplicaban a DecPat ni parecen reutilizables tal cual; aun asi, esto se marca explicitamente para que quien copie al repositorio real decida si migrar a los otros consumidores o mantener ambas versiones.
- **Riesgo de pixelado en el logo del header: resuelto 2026-09-17.** El usuario aporto el SVG real (159x41) exportado de Figma. Se creo `src/assets/images/LogoHeader.tsx` siguiendo el mismo patron que `LogoGrupoMutual.tsx` (SVG incrustado con `dangerouslySetInnerHTML`, sin pasar por `<img>`/PNG), y `AppShell.tsx` lo usa en vez de `public/logo-header.png` (eliminado). El contenedor (`AppShell.module.scss`, clase `.logo`) fija `width: 159px` y `aspect-ratio: 159/41` para no distorsionarlo — se verifico con `getBoundingClientRect` que renderiza exacto a esas proporciones. Documentado en `src/assets/README.md`.
- Los items de menu sin ruta (Mi declaración, Reportes, Declaraciones, Mantenimientos) son botones deshabilitados a proposito: sus pantallas no existen todavia (Reportes/Declaraciones/Mantenimientos ni siquiera tienen alcance estimado, ver `preparacion-tecnica-visual.md` D-07).
- Contenido informativo real de `/inicio` (bienvenida, contacto de ayuda) queda para `DEC-005B`, ya dependiente de este shell.
- Sesion sigue siendo mock en memoria: recargar la pagina termina la sesion (documentado en `SessionService.ts`); persistencia real depende de D-08.

Commit sugerido: `feat(shell): implementa AppShell con header, sidebar y sesion mock`
