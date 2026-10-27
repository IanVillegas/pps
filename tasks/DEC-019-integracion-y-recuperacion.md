# DEC-019A parte 2 y DEC-019B: preparación para el backend y recuperación

Implementadas y validadas el 2026-10-27.

## Alcance

El sistema no se conecta a un backend en este alcance (D-08). Esta tarea deja **preparado** el punto de integración y cubre los fallos y la pérdida de datos que sí podemos controlar sin contrato. Es una versión acotada de lo previsto en [la deuda técnica](todo.md): ver «Lo que no se hizo» al final.

## Bloqueo del paso 1 (decisión del usuario, D-29)

Solo el paso 1 (datos personales, una pantalla de datos obligatorios sin modal) bloquea el avance. Mientras le falte algún dato:

- el stepper no sale del paso 1: al intentarlo muestra los errores del paso, igual que «Continuar», y lleva el foco al primer campo inválido;
- una dirección escrita a mano a otro paso (`/mi-declaracion/7`) redirige al paso 1 con sus errores visibles.

Desde que el paso 1 está completo el desplazamiento entre pasos es libre. Los demás pasos no validan al cambiar de paso; sus campos obligatorios se exigen solo dentro de cada modal (todos los campos con asterisco) y, donde ya estaba acordado, en «Continuar» (paso 3: las dos preguntas de «Otros detalles»; paso 11: la pensión alimenticia). **No hay validación global** al terminar: el cierre (paso 12) no exige otros pasos.

Implementación: `DeclarationWizard` calcula si el paso 1 está completo con su propia validación (`definitions[1].validate`) y el borrador cuenta las peticiones de completarlo (`personalDataRequests`, `requestPersonalData` en `DeclarationService`) para que el paso 1 muestre sus errores al llegar. Sin validación definida para el paso 1 no se bloquea nada (pruebas con definiciones propias).

## Cliente HTTP único (DEC-019A)

`src/services/api/apiClient.ts`:

- **Interruptor**: con `NEXT_PUBLIC_API_BASE_URL` vacía el sistema usa datos simulados (`isMockMode()`); al definirla, los adaptadores reales pasan por `apiRequest`. Ninguna pantalla lo llama: solo los servicios.
- **Convenciones del contrato**: JSON, sesión por cookie (`credentials: 'include'`), cuerpo de error común (`ApiError` con `status`, `code` y `fieldErrors`), mensaje genérico «La solicitud no fue procesada. Inténtelo de nuevo» ante falla de red o 5xx, y `204` sin cuerpo.
- **Sesión vencida**: una respuesta `401` llama al manejador registrado con `setUnauthorizedHandler`; `AuthenticatedShell` lo registra para cerrar la sesión local y la guardia de ruta lleva al acceso. No se agregó un aviso visual de «sesión vencida»: Figma no lo dibuja.

## Catálogos asíncronos (DEC-019A)

`CatalogService` conserva las listas simuladas y agrega un almacén de catálogos (`useSyncExternalStore`, igual que los demás servicios en memoria):

- En modo simulado los trece catálogos están disponibles desde el primer render, sin llamadas.
- Con API real, `AuthenticatedShell` pide los trece al abrir sesión (`GET /catalogs/{nombre}`, contrato sección 4); si alguno falla, conserva los que llegaron, el estado queda en `error` y el wizard muestra un aviso con «Reintentar». Cada carga invalida a la anterior.
- **Las pantallas ya no importan las listas**: los diálogos y selectores usan `useCatalog('nombre')`, las tablas usan `catalogLabel('nombre', valor)` y `useCatalogs()` para volver a dibujarse cuando llegan. Cambiar a catálogos reales no toca ninguna pantalla.
- Se agregó el catálogo `society-types` (tipo de sociedad, paso 10) al contrato, sección 4.

## Recuperación (DEC-019B)

- **Reintento de cifras**: si falla el pedido de las cifras del backend (paso 3, 6, 7, 8 y 9) ya no queda solo un guion y un aviso que desaparece: un aviso permanente con «Reintentar» (`RetryNotice`) vuelve a pedirlas aunque los registros no hayan cambiado. Los cinco hooks de totales exponen `retry`.
- **Salir con datos sin guardar**: la declaración vive solo en memoria (D-08), así que recargar o cerrar la pestaña la pierde. Con datos escritos y la declaración sin guardar definitivamente, el navegador pregunta antes de salir (`beforeunload`). Tras el guardado final deja de preguntar. Cada alta, edición o retiro ya se guarda al instante (D-11): lo único que no se guarda es lo escrito en un modal abierto, que se descarta al cancelar (comportamiento conocido y probado).
- **Adjuntos y cierre**: ya tenían estado de error y reintento (DEC-009B, DEC-018B); no cambian.

## Validación

- `tsc` y `eslint src` sin errores; Jest: **64 suites y 452 pruebas** satisfactorias (29 nuevas: cliente HTTP, catálogos simulados y reales con error y reintento, bloqueo del paso 1, aviso al salir, reintento de cifras en el hook y en la pantalla de ahorro, aviso de reintento y guardia de ruta con 401).
- Navegador (`localhost:3005`, 1366 px): con el paso 1 vacío, «Paso 5» en el stepper no navega y muestra los 11 errores; con el paso 1 completo se avanzó al paso 2 y se saltó libremente del 1 al 12. Los selectores del paso 1 muestran las opciones desde el almacén de catálogos.
- No se probó contra un servidor real (no existe): el cliente y el cargador de catálogos se probaron con `fetch` simulado.

## Cómo reconocer lo simulado y lo preparado

Cada servicio simulado lleva `[SIMULADO]` en su primera línea y el código preparado para la API real lleva `[INTEGRACION]`; `src/services/README.md` tiene el mapa completo (qué se reemplaza o se borra, qué se conserva y qué sección del contrato corresponde):

```bash
grep -rn "\[SIMULADO\]" src
grep -rn "\[INTEGRACION\]" src
```

## Pendiente de documentación (rama `documentacion`)

La sección siguiente es la justificación de lo que no se hizo y debe quedar **bien documentada en `docs/`** (rama `documentacion`), con sus razones, no solo como lista. Se agrega al trabajo de esa rama.

## Lo que no se hizo (y por qué)

- **Servicios con las firmas definitivas del contrato** (los totales dejan de recibir los registros) y **guardado por acción en el adaptador**: sin contrato confirmado (D-11, D-10) cambiar las firmas obliga a reescribir las pantallas y sus pruebas, y probablemente se rehaga cuando exista el backend. Los totales siguen recibiendo los registros solo porque la simulación los necesita; el adaptador real los ignorará.
- **Adaptadores reales** de acceso, borrador, adjuntos, confidencial y cierre: solo con contrato.
- **Persistir el borrador** (recargar conserva los datos): contradice la decisión de no guardar patrimonio en el navegador (D-08).
- **Confirmar antes de descartar un modal con datos**: es una decisión de diseño; Figma no la dibuja.
- **Aviso visual de sesión vencida**: sin diseño.
