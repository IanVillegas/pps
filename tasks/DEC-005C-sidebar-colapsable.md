# DEC-005C Sidebar colapsable en tablet

Implementada y validada el 2026-09-23. Commit a cargo del usuario.

Tarea nueva, pedida directamente por el usuario (no estaba en `todo.md`): el sidebar no tenía forma de colapsar, y varios pasos futuros del wizard (familia, inmuebles, muebles, ahorro, corrientes, créditos, tarjetas...) traen tablas anchas que no deberían necesitar scroll horizontal. Se decidió liberar ese ancho colapsando el sidebar en vez de agregarle scroll a cada tabla.

## Decisiones confirmadas por el usuario antes de implementar

- **Activación**: colapsado automático en tablet + botón manual en cualquier ancho (no solo automático, no solo manual).
- **Apariencia colapsada**: franja de solo íconos (no oculto por completo con overlay).

## Contexto: no había nada que reutilizar

El arquetipo original de Grupo Mutual sí traía un botón de colapsar y un Drawer para tablet/móvil, pero DEC-005A los quitó a propósito (venían atados a un enum de rutas ajeno y a un Drawer pensado para teléfonos, fuera de alcance). Se construyó de cero.

## Implementación

- **Breakpoint**: se reutiliza `max-width: 1100px`, el mismo que ya angostaba el sidebar (266→216px) desde DEC-005A — no se introduce un segundo breakpoint de tablet.
- **`SideBar`** (`sad-aml-shared/components/Organisms/SideBar/`, componente genérico): gana dos props opcionales, `collapsed` y `onToggleCollapse`. Sin `onToggleCollapse` no se renderiza ningún botón (retrocompatible con cualquier otro consumidor).
  - Botón de colapsar/expandir (`ri-menu-fold-line`/`ri-menu-unfold-line`), posicionado absoluto sobre la esquina superior derecha para no alterar la posición vertical del primer ítem de navegación, ya validada contra Figma en DEC-005A.
  - Colapsado: la franja baja a 84px, cada ítem muestra solo el ícono centrado (sin flecha, sin espacio para ella), y el logo se oculta — no existe ningún asset de solo el símbolo "M" en el proyecto; recortar el wordmark completo a mano habría sido inventar un asset que el diseño no define.
  - El texto de cada ítem **no se quita del DOM**, se oculta solo visualmente (`sideBar__labelHidden`, patrón "visually hidden"): sigue siendo el nombre accesible del enlace/botón para lectores de pantalla. Para el caso visual (mouse/teclado), cada ítem con ruta real se envuelve en el `Tooltip` que ya existe (DEC-006A), mostrando el nombre completo al pasar el mouse o el foco. Los ítems deshabilitados ("No disponible") no se envuelven en `Tooltip` a propósito: un botón `disabled` no dispara eventos de puntero/foco, así que el Tooltip nunca abriría; conservan su `title` nativo, que sí funciona ahí.
- **`AppShell`**: dueño del estado `sidebarCollapsed`. Un `useEffect` en el montaje consulta `window.matchMedia('(max-width: 1100px)')` para el valor inicial y se suscribe a su evento `change` para re-sincronizar solo al cruzar el breakpoint — no pelea con la elección manual del usuario mientras se queda dentro del mismo rango (tablet o escritorio).

## Bug real encontrado y corregido (especificidad CSS)

Al probar en el navegador, el colapso automático en tablet no se aplicaba: el sidebar se quedaba en 216px (la versión angosta de DEC-005A) en vez de 84px. Causa confirmada con `getComputedStyle`/`getBoundingClientRect` antes de corregir: en SCSS, `&--collapsed` dentro de `.sideBar { }` genera un selector de clase **independiente** (`.sideBar--collapsed`), no uno compuesto con `.sideBar` como parecía a simple vista. Eso le daba la misma especificidad (0,1,0) que la regla del `@media (max-width: 1100px) { .sideBar { width: 216px } }`, y como esa regla aparece después en el archivo, ganaba el empate por orden de aparición — el mismo tipo de bug de especificidad ya documentado en DEC-005A para el ancho angosto de tablet. Se corrigió escribiendo `&.sideBar--collapsed` (selector compuesto real, especificidad 0,2,0), que gana sin importar el ancho de viewport ni el orden en el archivo.

## Validación

- `check-types`, `lint` y `test -- --runInBand`: OK (15 suites, 79 pruebas; 2 nuevas en `AppShell.test.tsx` — alternar el sidebar conservando el nombre accesible del enlace, y que arranca colapsado en tablet y se resincroniza al cruzar el breakpoint). `jest.setup.ts` agrega un polyfill de `window.matchMedia` (jsdom no lo implementa), con `matches: false` por defecto; las pruebas de tablet lo sobreescriben puntualmente. `build` pendiente: el servidor de desarrollo del usuario estaba activo (puerto 3004) y correr `build` lo hubiera corrompido (mismo incidente ya documentado en DEC-006B).
- V3 en navegador (sesión real vía login):
  - 1366px (escritorio): sidebar expandido por defecto, botón visible, tooltip funciona con foco de teclado ("Inicio").
  - Botón manual en escritorio: colapsa a 84px: el contenido de Inicio y la tarjeta del wizard crecen automáticamente para aprovechar el espacio (sin cambios adicionales, ya heredan `flex:1`/sin `max-width` de DEC-006B). Tarjeta del wizard pasó de ~1000px a 1183px de ancho al colapsar, en 1366px.
  - 768px y 1024px: montaje nuevo (navegando a una ruta distinta) arranca colapsado automáticamente, sin tocar el botón; sin desborde horizontal.
  - Navegar de una ruta con sidebar expandido manualmente a otra en el mismo ancho de tablet: el nuevo montaje vuelve a aplicar el valor automático (colapsado), no arrastra la elección manual anterior — comportamiento esperado, ya que cada layout de ruta monta su propio `AppShell`.
  - Re-sincronización en vivo al cruzar el breakpoint (sin recargar) **no se pudo verificar con la herramienta de automatización**: se confirmó que es una limitación de su emulación de viewport (CDP) y no del código — incluso un listener de `matchMedia` creado en el momento nunca recibe el evento `change` al redimensionar con la herramienta, aunque `matchMedia(...).matches` sí refleja el ancho nuevo correctamente al consultarlo. La API usada (`MediaQueryList.addEventListener('change', ...)`) es estándar y bien soportada; queda cubierta por la prueba automatizada de Jest, que sí dispara el evento directamente.
  - Sin errores de consola en ningún viewport probado.

## Ajuste posterior (2026-09-23, mismo día): cuatro correcciones tras revisión del usuario

- **Tipografía rota en el texto de cada ítem**: al colapsar/expandir, el usuario reportó "otra fuente totalmente diferente y más grande". Bug real confirmado con `getComputedStyle` antes de corregir: el nuevo `<span>` de la etiqueta (agregado en esta tarea) quedaba en **Poppins 20px** en vez de **Work Sans 14px/600**, por dos reglas preexistentes que antes nunca se notaban porque solo existía el `<span>` del ícono:
  1. `globals.scss` tiene `p, span { font-family: poppins }` — una declaración explícita siempre gana a la herencia, sin importar especificidad, así que le pegaba a cualquier `<span>` nuevo sin excepción.
  2. `SideBar.module.scss` tenía `nav a, nav button { span { font-size: 20px; font-weight: 400 } }`, un selector `span` genérico pensado solo para el ícono (su glifo real viene del `<i>` interno con la fuente de íconos, así que su propio `font-family`/`font-size` nunca importó visualmente).

  Se corrigió dándole una clase propia a cada `<span>`: `sideBar__icon` (con el `font-size: 20px` que antes era genérico) y `sideBar__label` (nuevo, con `font: inherit` para heredar el `font` completo ya correcto del `<a>`/`<button>` padre, venciendo el reset global).
- **Botón de colapsar muy pegado al logo**: se movió de `right: 16px` a `right: -16px` (mitad del botón, 32px) — queda flotando sobre el borde derecho del sidebar en vez de junto al logo.
- **Botón no alineado con los íconos al colapsar**: en la franja colapsada (84px) el botón ahora se centra (`left: 50%; transform: translateX(-50%)`) en vez de mantener el `right` pensado para el ancho expandido (266px). Verificado con `getBoundingClientRect`: el centro horizontal del botón, el centro de la franja y el centro del primer ícono de navegación coinciden exactos (42px los tres).
- **Los íconos subían al colapsar**: medido antes de corregir con `getBoundingClientRect`: el `nav` pasaba de 172px (expandido) a 95px (colapsado) respecto al borde superior del sidebar — el hueco exacto que dejaba el logo oculto (36px de padding + ~41px de alto + 95px de margen = 172px). Se agregó `margin-top: 172px` específico para el estado colapsado (mismo total que expandido, documentado con la aritmética en el propio comentario del SCSS), así los íconos no se mueven al colapsar/expandir.
- **Transición suave**: no hay ninguna librería de animación instalada en el proyecto (se confirmó en `package.json`); se agregó `transition` en CSS plano para `width`/`flex-basis` del sidebar, y `width`/`gap`/`padding`/`left`/`right`/`transform` en los botones de navegación y el de colapsar — mismo criterio que ya usaba este archivo para el hover. El resto del layout (tarjetas, contenido) se reacomoda solo, cuadro a cuadro, por ser hermano flex del sidebar animado.

Validación de este ajuste: `check-types`, `lint` y `test -- --runInBand` OK (mismas 15 suites, 79 pruebas, sin cambios de comportamiento que requirieran pruebas nuevas). Verificado en navegador con sesión real: fuente y tamaño del texto igual al resto de la app (Work Sans 14px/600) en ambos estados; botón en el borde al expandir, centrado y alineado con los íconos al colapsar; posición vertical del `nav` idéntica (172px) en ambos estados; transiciones (`getComputedStyle`) presentes en `.sideBar` y en los botones de navegación. Los 4 errores de consola observados durante la prueba se confirmaron como residuo del buffer de la pestaña (diagnóstico anterior de esta misma sesión + HMR), no del código: persistían idénticos tras una recarga completa de la página, que los habría limpiado si fueran del render actual.

## Diferencias y pendientes

- No hay ningún nodo de Figma para este estado (no está en el diseño); las medidas (84px de franja, 48px de botón, posición del botón de colapsar) son decisiones propias, sin referencia visual que confirmar.
- El logo se oculta por completo al colapsar (no hay asset de solo el símbolo "M"); si más adelante se exporta uno desde Figma, se puede mostrar en la franja colapsada.
- Afecta a todas las pantallas que usan `AppShell` (Inicio y los doce pasos del wizard), no solo a los pasos con tablas grandes.

## Archivos y orden de copia

1. Shared: `src/sad-aml-shared/components/Organisms/SideBar/SideBar.tsx`, `SideBar.module.scss`.
2. Shell: `src/components/Templates/AppShell/AppShell.tsx`.
3. Pruebas: `src/components/Templates/AppShell/AppShell.test.tsx`, `jest.setup.ts` (polyfill de `matchMedia`).
4. Documentación: `tasks/todo.md` y este archivo.

Commit sugerido (no ejecutado): `feat(shell): agrega sidebar colapsable a franja de iconos en tablet (DEC-005C)`
