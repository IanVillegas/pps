# DEC-018A Cuestionario confidencial (paso 12)

Implementada y validada el 2026-10-20; revisión visual con capturas el 2026-10-21.

## Alcance

El paso 12 de Figma (nodos 43121:1459, todo en «No», y 43121:1124, con la pregunta 1 en «Sí»; título «Declaración patrimonial completa») es un cuestionario confidencial. Figma avisa que la denuncia la recibe únicamente la Directora de Desarrollo Humano y que **las respuestas no quedan almacenadas en la declaración patrimonial** (D-12). Esta tarea implementa la pantalla y, sobre todo, esa separación. El juramento, el envío y los estados de finalización son DEC-018B (D-13).

## Implementación

- **Paso** `src/components/Pages/Declaration/ConfidentialReport/ConfidentialReport.tsx`, registrado como paso 12 en `stepDefinitions.tsx`, sin `validate`. Muestra el aviso de confidencialidad (Work Sans SemiBold 18 px, justificado), la pregunta independiente sobre cambios notables en el estilo de vida, el encabezado «¿Conoce usted si algún compañero(a)...?» y las siete preguntas numeradas del 1 al 7, cada una con su interruptor (`Atoms/Switch`, de DEC-017) a la derecha y una línea fina entre ellas. Se abre con las ocho en «No».
- **Al responder «Sí»** aparece, debajo de esa pregunta, la indicación en rojo (#D23D3D, Work Sans SemiBold 18 px) «Desarrolle su denuncia, procure ser amplio con la informacion y detalle los hechos: descripción, ubicación, participantes (nombres y apellidos, si los hay).» y un campo de texto de 698 px (`Textarea` compartido) para el detalle. Al volver a «No» el detalle se descarta.
- **Botón final**: en el último paso el botón de la derecha se rotula «Terminar», como en Figma, y sigue **deshabilitado** hasta que exista el juramento y el envío (DEC-018B). Es el único cambio al wizard.

## Separación del borrador patrimonial (D-12)

- **Servicio propio** `src/services/ConfidentialReportService.ts`: estado en memoria independiente de `DeclarationService`. El paso 12 **no usa los valores ni el `onChange` del wizard**, de modo que nada del cuestionario pasa por `saveStepValues` ni aparece en `draft.steps[12]`. Lo lee con `src/utils/hooks/useConfidentialReport.ts` (mismo patrón de `useSyncExternalStore` que `useDeclaration`).
- **Estado**: solo existen las preguntas contestadas «Sí» (`{ detail }`); una pregunta ausente es «No». Apagar una pregunta retira su respuesta y su detalle, para no dejar texto que la contradiga. Las respuestas se conservan al salir del paso y volver, mientras dure la sesión.
- **Persistencia**: solo memoria; nunca `localStorage`. `endSession` las borra junto con el borrador, porque en un equipo compartido no deben sobrevivir al cierre de sesión. Una recarga también las pierde.
- **Payload** `buildConfidentialPayload(respuestas)`: función pura que recibe únicamente las respuestas confidenciales y devuelve `{ answers: [{ questionId, answer: 'si' | 'no', detail? }] }` con las ocho preguntas en orden; el detalle viaja recortado y solo en las respuestas «sí» que lo tienen. No lee la declaración patrimonial, así que ningún dato patrimonial puede viajar en este envío (ni viceversa). **Nada se envía a ningún lado**: el contrato, el receptor y los permisos están por definir (D-12, D-08).
- **Tipos** `src/types/ConfidentialReport.types.ts`; límite simbólico `FIELD_MAX_LENGTH.confidentialDetail = 1000` (D-17).

## Decisiones (D-24 resuelta el 2026-10-20 por el usuario)

- **Todas las preguntas se expanden**: Figma solo dibuja la indicación y el campo de la pregunta 1 en «Sí». **Confirmado por el usuario**: las ocho se comportan igual.
- **Detalle opcional** (confirmado por el usuario): el campo no lleva asterisco y las preguntas tampoco exigen texto; los asteriscos de Figma marcan que cada pregunta debe contestarse, algo que un interruptor siempre cumple («No» por omisión). Nada bloquea el avance.
- **Campo multilínea** (confirmado por el usuario): Figma dibuja el detalle como un campo de una línea (698 × 50 px), pero pide «ser amplio»; se usó el `Textarea` compartido, que crece con el contenido y mide al menos 79 px de alto.
- **Receptor y envío** (D-12 sigue abierta): quién recibe, por qué canal, con qué permisos y cuándo se envía (al terminar la declaración o aparte) depende del backend. **Decisión del usuario (2026-10-20)**: sin backend en este alcance todo queda visual; no se define ni se implementa el envío y se deja como pendiente de continuidad para quien integre el servicio real.

## Validación

- `check-types`, `lint` y 353 pruebas: OK (18 nuevas: 12 del servicio — estado inicial, abrir y apagar respuestas, detalle ignorado sin «Sí», inmutabilidad y suscripciones, borrado al cerrar sesión, **no escribe nunca en el borrador**, el borrador no la altera, el payload lista las ocho preguntas, recorta y solo incluye el detalle de los «sí», y no contiene nada patrimonial— y 6 del paso — aviso y ocho preguntas en «No», numeración, la indicación y el campo solo en «Sí», conserva y descarta el detalle, se conserva al salir y volver, **no aparece en el borrador**—). Se actualizó la prueba del wizard: en el último paso «Regresar» sigue activo y «Terminar» está deshabilitado.
- V3 en navegador (sesión local de prueba), primero **por el DOM** porque el panel del navegador estaba oculto y no permitía capturas: Tras reiniciar el servidor de vista previa: el paso abre con 8 interruptores en «No», sin campos y con «Terminar» deshabilitado; al responder «Sí» a la pregunta 1 aparece la indicación en rojo (#D23D3D, 18 px, SemiBold) y un campo de 698 × 79 px; las siete preguntas sobre compañeros van sangradas 20 px y la primera no; el aviso y las preguntas van justificados de 18 px; al salir al paso 11 y volver, la pregunta 1 sigue en «Sí» con su texto; al volver a «No» el campo desaparece. **Corrección hallada así**: las preguntas se pintaban en Poppins porque el CSS global fija Poppins en `p` y `span`; ahora cada texto del paso declara Work Sans (el «No»/«Sí» del interruptor sigue en Poppins 12 px). Los únicos errores de consola son archivos de recarga en caliente del servidor de desarrollo.
- **Revisión visual con capturas (2026-10-21)**, con el panel visible y un viewport de 1100 × 640: el paso coincide con Figma en las tres zonas. Aviso en negrita justificado y pregunta 1 con su interruptor a la derecha; encabezado «¿Conoce usted si algún compañero(a)...?» y preguntas 1 a 7 sangradas y separadas por líneas finas, con el asterisco al final del texto; con la pregunta 1 en «Sí», la indicación en rojo justificada y el campo debajo, del ancho del texto; y, al final, «Regresar» activo y «Terminar» deshabilitado. Diferencias menores: el campo es más alto que el de Figma (aceptado, D-24) y no se midió píxel a píxel contra un viewport de 1366 px.

## Diferencias y pendientes contra Figma

- Campo de detalle más alto que el de Figma (aceptado por el usuario, D-24).
- Figma pone el interruptor de la pregunta 1 a ~100 px del borde derecho; aquí queda a 24 px del borde de la fila, igual que en el paso 11.
- El borde rojo exterior de las pantallas de Figma es una anotación del usuario (D-15) y no se replica.
- Pendiente DEC-018B: habilitar «Terminar», juramento, estados de envío y la decisión de cuándo se envía el cuestionario.
