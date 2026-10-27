# DEC-018B Juramento y cierre (paso 12)

Implementada y validada el 2026-10-21.

## Alcance

El cierre de Figma (nodo 43121:866, «Paso 12 final») es una segunda vista del paso 12: bajo el mismo título «Declaración patrimonial completa» (indicador en el paso 12), el texto de la declaración bajo juramento y un único botón «Guardar», sin «Regresar». No hay backend (D-08), así que el guardado es una **simulación** y todo queda visual; lo que se construye es el flujo y sus estados, para que al existir la API solo cambie el servicio.

## Implementación

- **Flujo**: en el cuestionario (DEC-018A) el botón de la derecha, «Terminar», ahora está habilitado y abre el juramento en lugar de avanzar de paso. El juramento muestra los tres párrafos de Figma (Work Sans Regular 16 px, justificado, #1F1F1F) y «Guardar» (280 × 60 px, centrado). Si la persona se va a otro paso sin guardar, el juramento no queda «abierto»: al volver ve de nuevo el cuestionario.
- **Estados** (`src/services/FinalizationService.ts`, propio, separado del borrador y del cuestionario confidencial; hook `src/utils/hooks/useFinalization.ts`): `idle` (cuestionario) → `oath` (juramento) → `sending` (guardando) → `done` (confirmado) o `error` (se puede reintentar).
  - **El éxito se declara solo cuando termina la respuesta simulada** (800 ms), nunca antes: mientras guarda, el botón muestra el spinner del botón compartido y queda bloqueado; al terminar bien, aparece el aviso «Guardado satisfactoriamente» y el botón pasa a «Guardado» (deshabilitado).
  - **Envío repetido controlado**: con un guardado en curso o ya terminado, otro clic se ignora (la prueba hace tres clics seguidos y verifica un solo aviso).
  - **Error**: el escenario sintético se activa con el usuario de demostración `cierre.error` (igual que `error.demo` en el acceso); muestra «La solicitud no fue procesada. Inténtelo de nuevo» y deja el botón activo para reintentar. No es una política de seguridad.
  - **Cerrar sesión** borra el estado y descarta la respuesta de un guardado que seguía en curso (así no «confirma» en la sesión siguiente).
- **Wizard** (`DeclarationWizard.tsx`, `stepDefinitions.tsx`): dos opciones nuevas en `StepDefinition`. `ownActions` hace que el paso reciba los botones del wizard y decida si y dónde mostrarlos (el wizard sigue dibujando la tarjeta); `onFinish` define qué hace el botón del último paso, que no tiene paso siguiente (sin `onFinish` queda deshabilitado, como antes). El paso 12 usa ambas: `onFinish` abre el juramento y, en la vista del juramento, el paso no muestra los botones del wizard.
- **Pantalla** `src/components/Pages/Declaration/Completion/Completion.tsx` (el paso 12 ahora registra `Completion`, que compone `ConfidentialReport` y el juramento).

## Decisiones (D-25: la primera parte resuelta, la segunda pendiente)

- **Texto del juramento** (resuelto por el usuario, 2026-10-21): Figma trae dos variantes, una visible («Conglomerado Financiero Grupo Mutual») y otra oculta («…Grupo Mutual Alajuela - La Vivienda»). **Solo se usa «Grupo Mutual»**: la otra entidad ya no existe, así que no hay variante por persona.
- **Modal de confirmación al guardar** (2026-10-21, Figma nodo 43310:470704, «Modal final»): el usuario entregó el diseño del modal. «Guardar» en el juramento ya no guarda directamente: abre `ConfirmSaveDialog` («Confirmación», con el texto de que los datos no podrán cambiarse y la pregunta «¿Está seguro(a) de que desea guardar su declaración?») y solo el «Guardar» del modal inicia el guardado simulado; «Cancelar», la X y Escape lo cierran sin guardar y el juramento queda como estaba. Tras confirmar se mantienen el aviso «Guardado satisfactoriamente» y el botón «Guardado» deshabilitado, sin salir del paso. Si el guardado falla, «Guardar» vuelve a abrir el modal para reintentar. Tamaño `md` (640 px). El texto es el de Figma tal cual, con sus faltas de tilde («podran», «sera»).
- **Respuesta del backend** (D-13): secuencia real, evidencia de aceptación (fecha, versión del texto), si el juramento exige marcar una casilla y qué se envía y a quién siguen por definir; no se asumió firma digital. El servicio simulado no envía datos ni confirma nada institucional.
- **Sin «Regresar» en el juramento**: así lo dibuja Figma; para volver al cuestionario se usa el indicador de pasos.

## Validación

- `check-types`, `lint` y 372 pruebas: OK (19 nuevas: 10 del servicio — estados, abrir y salir del juramento, no guarda desde el cuestionario, enviando antes de éxito, envío repetido, escenario de error y reintento, cierre de sesión con guardado en curso, no toca el borrador ni las respuestas confidenciales, suscripciones—; 6 del cierre —cuestionario inicial con «Terminar» habilitado, juramento con un solo «Guardar» y sin cambio de paso, bloqueo y confirmación solo al llegar la respuesta, tres clics = un guardado, error con reintento, vuelta al cuestionario al salir sin guardar—; 2 del wizard —el último paso define su acción y decide dónde van los botones, sin botones duplicados—). Se actualizó la prueba del wizard: sin `onFinish`, «Terminar» sigue deshabilitado.
- V3 en navegador (sesión local de prueba), con captura: el cuestionario abre con «Terminar» habilitado; al pulsarlo aparece el juramento con los tres párrafos justificados en Work Sans y «Guardar» centrado, sin «Regresar» ni interruptores; al hacer clic aparece el spinner y, pasado el retardo simulado, «Guardado» deshabilitado. No se ejercitó el escenario de error en el navegador (cubierto por prueba).
- Modal de confirmación (2026-10-21): `tsc` y `eslint` sin errores; Jest 60 suites y 423 pruebas (2 nuevas: el modal pide confirmación sin guardar todavía, y «Cancelar» no guarda y deja el juramento; las pruebas de guardado, envío repetido y error ahora confirman en el modal). En el navegador (`localhost:3005`, 1280 px) el modal coincide con Figma; al confirmar el botón mostró el spinner, apareció «Guardado satisfactoriamente», «Guardado» quedó deshabilitado y la ruta no cambió. No se midió píxel a píxel.

## Diferencias y pendientes contra Figma

- No se midió píxel a píxel contra un viewport de 1366 px; la comparación se hizo con capturas de la vista del juramento en un panel pequeño.
- Figma rotula el botón del juramento «Guardar» (también el nodo del botón primario); tras guardar se usa «Guardado».
- El borde rojo exterior de las pantallas de Figma es una anotación del usuario (D-15) y no se replica.
- El texto de Figma nombra «Guardar definitivamente», pero el botón se llama «Guardar»: el usuario cambió el texto del modal a «Guardar» para que coincida con el botón (2026-10-27), de modo que ahí se aparta de Figma a propósito. Quedan por confirmar con el negocio las faltas de tilde del texto («podran», «sera»), que se dejaron como en el diseño. Pendiente de continuidad (backend): envío real, evidencia de aceptación y receptor de las respuestas confidenciales (D-12).
