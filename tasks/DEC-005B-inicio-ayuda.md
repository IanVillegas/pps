# DEC-005B Inicio y ayuda

Implementada y validada el 2026-09-18. Commit a cargo del usuario.

## Implementacion

- `Home` (`src/components/Pages/Home/Home.tsx`, nodo Figma 43121:6798): panel blanco "Bienvenido a DecPat" con las dos tarjetas del diseno real — "¿Qué es?" (icono `ri-information-line`, texto justificado) y "¿Necesitas ayuda?" (badge circular `#00998A` con `ri-customer-service-line`, boton "Contactos"). El h1 "Declaración Patrimonial" y el shell ya los pone `AppShell`/`DashboardLayout` (DEC-005A); este componente es solo el contenido de abajo.
- `HelpDialog` (`src/components/Organisms/HelpDialog/HelpDialog.tsx`, nodo Figma 43121:6886): modal de contacto reutilizando `Modal`/`Button` de `sad-aml-shared`, mismo patron que `LoginFeedback`. Correo y telefono exactos del diseno (`talentohumano@grupomutual.fi.cr`, `2222-2222`), convertidos ademas en enlaces `mailto:`/`tel:` reales (mejora minima sobre el diseno, el texto visible no cambia).
- Estado de error recuperable (nodo Figma 43121:455, acceptance de DEC-005B): el contenido de Inicio es texto estatico sin fetch real (D-14 sigue sin contrato/validacion de negocio), asi que no hay nada que de verdad pueda fallar hoy. En vez de inventar un servicio mock solo para tener algo que rechazar, se agrego un trigger explicito de demo/QA: visitar `/inicio?demo=error` muestra el mensaje/ilustracion/boton "Entendido" de ese nodo; "Entendido" recupera el contenido normal. Documentado como tal en el propio codigo (`Home.tsx`), no es un flujo real de usuario.
- `ErrorIllustration` (`src/assets/images/ErrorIllustration.tsx`): ilustracion de error de Figma, nodo 43121:531 (un solo SVG con ovalo completo, ventana, lupa y destellos). Reemplaza la version que combinaba dos capas (nodos 43121:478 y 43121:493) y traia el ovalo fragmentado con costura. Resuelve el "Ilustracion de error" que `src/assets/README.md` tenia anotado como pendiente desde DEC-001A.
- `src/app/inicio/page.tsx` ahora renderiza `<Home />` envuelto en `Suspense` (requerido por Next.js porque `Home` usa `useSearchParams`, evita que la ruta pierda el prerender estatico sin avisar).

## Decision de alcance: el error recuperable NO reemplaza toda la pantalla

El nodo 43121:455 en Figma es una pantalla completa (fondo rojo diagonal propio, logo propio, sin sidebar/header) — mas coherente con un fallo *antes* de poder renderizar el shell (ej. DEC-019, integracion). La aceptacion de DEC-005B lista `src/components/Pages/Home` como area prevista, no `layout.tsx` ni un componente de error a pantalla completa nuevo. Se implemento entonces el mensaje/ilustracion/boton "Entendido" **dentro del panel del shell** (sidebar y header quedan visibles), tomando el contenido exacto de 43121:455 pero no su fondo de pantalla completa — evita que un fallo puntual del contenido de Inicio le quite al usuario la navegacion. Se documenta como diferencia conocida, no como pendiente.

## Validacion

- `check-types`, `lint` y `test -- --runInBand`: OK (9 suites, 36 pruebas — 3 nuevas para `Home` cubriendo contenido por defecto, apertura/cierre de `HelpDialog` y el ciclo completo de `?demo=error` → "Entendido" → contenido normal; 4 nuevas para `HelpDialog` cubriendo contenido, cierre por boton, cierre por Escape y que no renderiza nada si `open=false`).
- Hallazgo real corregido durante la implementacion: Radix avisaba en consola (`console.warn`) que `AlertDialogContent` necesita una descripcion accesible; `HelpDialog` inicialmente pasaba los renglones de contacto por `contentCard` (pensado para contenido *adicional*, no para la descripcion accesible del dialogo) en vez de por `description`. Se movio a `description`/`classNameDescription`, que si conecta `aria-describedby` via Radix. Verificado que el warning desaparecio y las pruebas siguen en verde.
- `build`: OK (con el servidor dev detenido). `/inicio` se mantiene estatico (`○`) gracias al `Suspense` alrededor de `Home`.
- V3 en navegador (Chrome automatizado, sesion real via login, no solo lectura de codigo):
  - Contenido de Inicio en 1366px: dos tarjetas lado a lado, comparado visualmente contra la captura de Figma — coincide en textos, iconos, colores y el boton amarillo "Contactos".
  - En 1024px las tarjetas se apilan (el contenido disponible no alcanza para las dos a 380px + espacio); en 768px (tablet) se apilan tambien sin desbordamiento — verificado sin errores de consola.
  - "Contactos" abre `HelpDialog`: headset amarillo, correo, telefono con iconos y "Entendido", visualmente igual a la captura de Figma.
  - Estado de error (forzado temporalmente para la revision visual, ya que la sesion en memoria no sobrevive una navegacion dura a `/inicio?demo=error`; la logica real quedo cubierta por la prueba automatizada de `Home.test.tsx`, que si mockea `useSearchParams`): ilustracion, mensaje y boton coinciden con la captura de Figma; "Entendido" recupera el contenido normal.
  - Sin errores de consola de la aplicacion en ningun caso (el unico error de consola observado fue un 404 de un archivo `webpack.hot-update.json`, artefacto propio del HMR de Next en modo desarrollo durante una edicion en caliente, no reproducible en `build` de produccion).

## Archivos y orden de copia

1. Asset: `src/assets/images/ErrorIllustration.tsx`; `src/assets/README.md` (documentacion).
2. Organismo: `src/components/Organisms/HelpDialog/HelpDialog.tsx`, `HelpDialog.module.scss`, `HelpDialog.test.tsx`.
3. Pagina: `src/components/Pages/Home/Home.tsx`, `Home.module.scss`, `Home.test.tsx`.
4. Ruta: `src/app/inicio/page.tsx`.
5. Documentacion: `tasks/todo.md` y este archivo.

## Ajustes posteriores al cierre inicial (2026-09-18)

El usuario reviso Inicio en su propia laptop y reporto dos problemas reales, con capturas:

- **Las tarjetas se apilaban en laptops con escala de Windows al 150%.** Causa: `.home__cards` usaba `flex-wrap:wrap` con `flex:1 1 380px` en cada tarjeta. Flexbox decide el wrap por el ancho "hipotetico" (flex-basis) de cada item ANTES de aplicar flex-shrink — dos tarjetas de 380px + 24px de gap necesitan ~784px disponibles para no pasar a una segunda linea, sin importar que si hubiera espacio de sobra para achicarlas un poco. En una laptop 1920x1080 a 150% (ancho efectivo ~1280px CSS, mismo tipo de caso ya investigado para la diagonal de Login) el sidebar + los paddings del shell dejaban menos de eso disponible. Se cambio `.home__cards` de `flex-wrap` a `display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`, que si permite achicar cada columna hasta 280px antes de pasar a una sola — verificado con `getBoundingClientRect` que a 904px de viewport (donde antes se apilaban) ahora quedan lado a lado.
- **Las tarjetas tenian demasiado espacio vacio, incluso con contenido corto.** Causa real (no relacionada con lo anterior): `.home__card` nunca declaraba `box-sizing: border-box`, asi que `min-height: 200px` (content-box por default) NO incluia el padding — el alto real terminaba en `200px + 2×22px de padding ≈ 246px` en vez de los 200px que pedia Figma. Se agrego `box-sizing: border-box`; verificado que ahora una tarjeta con contenido corto mide exactamente 200px (antes 245.6px).
- **El panel blanco no llenaba la pantalla, quedaba del tamano de su contenido** (reportado a escala 125%, panel tan bajo como la mitad de la pantalla). `DashboardLayout` (`sad-aml-shared`) nunca le daba una altura al `<main>`: `.sideContent` y `.content` eran bloques normales, sin `display:flex`, asi que cualquier pagina quedaba del alto de su propio contenido. Se cambio `DashboardLayout.module.scss` para que `.sideContent`/`.content` formen una columna flex donde el `<main>` ocupa el resto del alto disponible (`flex:1`), y `Home.module.scss` agrego `flex:1` a `.home` para aprovecharlo — el margen inferior ya lo daba el `padding-bottom` existente de `.sideContent`, no hizo falta agregar uno nuevo. Es un cambio generico de `DashboardLayout` (no especifico de Inicio): cualquier pagina futura puede optar por lo mismo poniendo `flex:1` en su propio contenedor raiz, o ignorarlo y quedarse con su alto de contenido como antes.

Validacion de estos ajustes: `check-types`, `lint` y `test -- --runInBand` (9 suites, 36 pruebas) OK. `build` OK (con el servidor dev detenido). Verificado en navegador con sesion real en 904px (ancho angosto real de esta revision, cards ya no se apilan), 1366px (panel llena hasta `viewport - 48px` exacto, verificado con `getBoundingClientRect`, no solo visualmente) y 768px/tablet (tarjetas a 200px exactos, panel lleno hasta `viewport - 40px`). Sin errores de consola de la aplicacion (los unicos vistos fueron artefactos de HMR de Next en modo desarrollo tras varias ediciones en caliente, no reproducibles en `build`).

## Boton de solo-desarrollo para el estado de error (2026-09-18)

El usuario pidio ver el estado de error sin depender de `/inicio?demo=error` (ese trigger pierde la sesion si se escribe la URL directo en la barra de direcciones, porque hace una recarga dura y la sesion es solo en memoria). Se agrego un boton "Simular error (solo desarrollo)" al final del panel, visible solo cuando `process.env.NODE_ENV !== 'production'` (definido por Next.js solo — `development` en `npm run dev`/`dev-preview`, `production` en `build`/`start` — no hace falta configurar `NEXT_PUBLIC_ENVIRONMENT`, que en esta copia local ni siquiera esta en `.env.local`). Al hacer click activa el mismo estado que el parametro de URL, sin navegar ni perder la sesion; "Entendido" lo cierra igual que antes. El parametro `?demo=error` se mantiene tal cual (utilidad para armar un link directo).

Verificado explicitamente que NO aparece en produccion: `build` limpio + `npm run start` en un puerto aparte, login real, el boton no esta en el DOM. Verificado en `npm run dev` que si aparece, funciona (activa el error con la sesion intacta, "Hola, ivillegas" sigue visible) y que "Entendido" recupera el contenido normal sin perder la sesion. `check-types`, `lint` y `test -- --runInBand` (9 suites, 37 pruebas, 1 nueva) OK.

## Diferencias y pendientes

- D-14 (contactos de ayuda y periodicidad) sigue sin validacion de negocio; el correo/telefono usados son los literales de Figma, no un contrato confirmado.
- El estado de error recuperable se implemento dentro del shell, no a pantalla completa (ver seccion de decision de alcance arriba); si mas adelante se necesita el fondo rojo completo de 43121:455 para un fallo previo al shell (candidato natural: DEC-019), se puede reutilizar `ErrorIllustration.tsx` directamente.
- El trigger `?demo=error` es solo para QA/demo, documentado como tal en el codigo; no representa una fuente de datos real (no existe todavia, D-14).
- Reportes, Declaraciones y Mantenimientos del sidebar siguen deshabilitados (D-07, fuera de alcance).

Commit sugerido: `feat(inicio): implementa Inicio con tarjetas informativas, contacto de ayuda y estado de error recuperable`
