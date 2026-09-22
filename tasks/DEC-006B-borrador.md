# DEC-006B Borrador y navegación del wizard

Implementada y validada el 2026-09-21. Commit a cargo del usuario.

`todo.md` pedía dividir una tarea que excediera cinco archivos funcionales. Esta lo excedía, así que se separó en **006B** (borrador, ruta, navegación y validación) y **006B2** (modal inicial), ambas cerradas hoy y documentadas aquí.

## Implementación

- **Ruta** `src/app/mi-declaracion/[paso]/page.tsx`: renderiza `DeclarationWizard`. Un paso inexistente (`0`, `13`, `abc`, un número enorme) se redirige a `/mi-declaracion/1` con `redirect()`; no hay 404 ni pantalla rota, y el borrador no se toca. La ruta es dinámica (`ƒ`) en el build.
- **Guardia de sesión compartida** `src/components/Templates/AuthenticatedShell`: se extrajo de `inicio/layout.tsx` (sin cambio de comportamiento) para que `/inicio` y `/mi-declaracion` usen la misma guardia + `AppShell`. Ambos layouts quedaron en tres líneas.
- **Shell**: el ítem «Mi declaración» del menú ahora es un enlace a `/mi-declaracion/1`, activo en todo `/mi-declaracion/*`. En un paso, `AppShell` titula la pantalla con el nombre de la sección y su ícono (Figma), en vez de «Declaración Patrimonial». `DashboardLayout` (shared) ganó dos props opcionales, `titleIcon` y `compactTitle` (espaciado del título cuando lo sigue el stepper); sin ellas se comporta igual que antes.
- **Borrador** `src/services/DeclarationService.ts` + `src/utils/hooks/useDeclaration.ts` + `src/types/Declaration.types.ts`: almacén observable en memoria (mismo patrón que `SessionService`), con `saveStepValues`, `acknowledgeIntro` y `clearDraft`. Es un mock: no hay contrato de backend (D-08/D-09) y **no se guarda patrimonio en `localStorage`**. `SessionService.endSession()` llama a `clearDraft()`, así que un cierre de sesión borra el borrador (importante en equipos compartidos).
- **Wizard** `src/components/Pages/Declaration/DeclarationWizard/`: stepper + tarjeta con el contenido del paso + Regresar/Continuar.
  - Pasos no lineales: el stepper salta a cualquier paso **sin validar**, y Regresar tampoco valida. Solo **Continuar valida el paso actual**.
  - Cada cambio en un paso se guarda en el borrador al instante, por eso ir y volver conserva los datos.
  - Si Continuar falla: no avanza, muestra un resumen `role="alert"`, y el foco va al primer campo con `aria-invalid="true"`. Tras el primer intento fallido los errores se recalculan mientras el usuario corrige.
  - Regresar está deshabilitado en el paso 1 (Figma: «Button secundario inactivo») y Continuar en el 12 (el cierre/juramento es DEC-018B).
- **Contrato para los pasos** `stepDefinitions.tsx`: cada paso registra `{ component, validate }`. El componente recibe `{ values, errors, onChange }`; `validate(values)` devuelve errores por campo (`{}` = válido). El registro real está vacío: DEC-007 agrega el paso 1. Los pasos sin definición muestran un marcador y Continuar avanza sin validar. Para probar sin un paso real, el wizard acepta la prop `definitions`.
- **Modal inicial (006B2)** `src/components/Organisms/DeclarationIntroDialog/` (nodo Figma 43121:6787): logo, «Declaración Patrimonial Funcionarios», texto de periodicidad y «Entendido», sobre `Modal` de shared (mismo patrón que `HelpDialog`). Se muestra al entrar a la declaración hasta que se cierra (con «Entendido», la X o Escape) y no reaparece en la sesión.

## Validación

- `check-types`, `lint` y `test -- --runInBand`: OK (13 suites, 59 pruebas; 16 nuevas: 10 del wizard —marcador, paso fuera de rango, límites de Regresar/Continuar, bloqueo con foco y anuncio, recuperación al corregir, avance sin reglas, salto sin perder datos, valores persistentes, Regresar, modal una vez por sesión—, 3 del servicio —inmutabilidad, suscripción, borrado al cerrar sesión— y 3 del modal). La prueba de `AppShell` se actualizó (ahora «Mi declaración» es un enlace). `build` OK.
- V3 en navegador (sesión real vía login, entrando por el menú porque la sesión vive en memoria):
  - 1366px: título a 95px (Figma 95), stepper a 148px (149), tarjeta a 210px (209), ancho de tarjeta 1006px, botones de 280×60 exactos; ícono del título en `#E62C3A`. Comparado contra la captura del Paso 2 de Figma: coincide (título con ícono, stepper, tarjeta, Regresar verde con borde, Continuar amarillo).
  - Recorrido: entrada → modal → «Entendido» → Continuar (paso 2, título «Conformación del núcleo familiar») → salto al 9 → Regresar (8) → salto al 12 (Continuar deshabilitado) → salto al 1 (Regresar deshabilitado). El modal no reapareció.
  - Pasos inválidos por `curl`: `0`, `13`, `abc` y `99999999999999999999` devuelven `NEXT_REDIRECT → /mi-declaracion/1`; `5` y `07` cargan.
  - 768px (tablet): sin desborde horizontal; los botones se apilan porque dos de 280px no caben en la tarjeta.
- Incidente de desarrollo, no de código: tras varias ediciones de SCSS en caliente el servidor dev devolvió 500 (`__webpack_modules__[moduleId] is not a function`) en una ruta y cortó una navegación; se resolvió borrando `.next` y reiniciando, y no reapareció. Un `404` en consola vio un `hot-update.json` de HMR y no se encontró ningún recurso 4xx en la página actual.

## Diferencias contra Figma y pendientes

- La tarjeta llena el alto disponible (como Home) en vez de medir 496px fijos.
- Íconos por sección: son el equivalente en Remix Icon del que Figma dibuja junto al título. Los pasos 6 (`bolsa-dinero`) y 12 (`garantia`) son íconos propios de Figma sin equivalente exacto (se usó `wallet-3` y `shield-check`); el paso 3 repite `account-multiple` en Figma; el paso 1 no muestra ícono en Figma (se usó `user-line`). Confirmar con diseño.
- Figma muestra en el header un botón «Regresar» + migas «Inicio / Mi declaración»; no se implementó (no está en la aceptación de 006B).
- El estilo del Regresar deshabilitado es el genérico de `Button`; Figma tiene un «secundario inactivo» sin revisar en detalle.
- Sin backend: el borrador se pierde al recargar la pestaña (igual que la sesión). Fallo de guardado/carga con reintento es DEC-019B.
- La ruta es dinámica; se puede prerenderizar con `generateStaticParams` (1–12) si hace falta, no se hizo.
- El contenido de cada paso sigue siendo el marcador «aún no está disponible» hasta DEC-007 en adelante.

## Ajuste posterior (2026-09-21): se elimina `src/app/loading.tsx`

El usuario reporto que al ingresar el login desaparecia unos segundos y salia un texto `Loading...` antes de Inicio. Causa: `loading.tsx` heredado del arquetipo (`c01ec27`) actua como fallback de Suspense de la raiz mientras carga `/inicio`, y en `npm run dev` esa ruta se compila la primera vez que se visita. Se elimino el archivo: el login queda visible (con el spinner del boton) hasta que aparece Inicio. `check-types` y `lint` OK. No se verifico en navegador porque el servidor dev del usuario (puerto 3004) comparte `.next`; queda para que lo confirme reiniciando `npm run dev`.

## Archivos y orden de copia

1. Tipos y configuración: `src/types/Declaration.types.ts`, `src/types/DeclarationStep.types.ts` (+`iconClass`), `src/utils/declarationSteps.ts` (íconos).
2. Servicio y hook: `src/services/DeclarationService.ts`, `src/services/SessionService.ts` (`clearDraft` al cerrar sesión), `src/utils/hooks/useDeclaration.ts`.
3. Shared: `src/sad-aml-shared/components/Templates/DashboardLayout/DashboardLayout.tsx` y `.module.scss` (`titleIcon`, `compactTitle`).
4. Shell: `src/components/Templates/AuthenticatedShell/AuthenticatedShell.tsx`, `src/components/Templates/AppShell/AppShell.tsx`, `src/app/inicio/layout.tsx`, `src/app/mi-declaracion/layout.tsx`.
5. Modal: `src/components/Organisms/DeclarationIntroDialog/` (tsx, scss, test).
6. Wizard: `src/components/Pages/Declaration/DeclarationWizard/` (`DeclarationWizard.tsx`, `.module.scss`, `.test.tsx`, `stepDefinitions.tsx`).
7. Ruta: `src/app/mi-declaracion/[paso]/page.tsx`.
8. Pruebas: `src/services/DeclarationService.test.ts`, `src/components/Templates/AppShell/AppShell.test.tsx` (actualizada).
9. Documentación: `tasks/todo.md` y este archivo.

Commit sugerido (no ejecutado): `feat(declaracion): implementa borrador, ruta del wizard y modal inicial (DEC-006B)`
