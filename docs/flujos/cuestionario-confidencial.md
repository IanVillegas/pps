# Cuestionario confidencial

Estado: primera vista del paso 12 implementada; sus respuestas permanecen en memoria y no se envían. Revisión: 21 de octubre de 2026.
Código: `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2`. Seguimiento: DEC-018A; documentación: DOC-014.

## Propósito

`/mi-declaracion/12`, titulado «Declaración patrimonial completa», comienza con un cuestionario confidencial. El aviso inicial indica que la denuncia la recibe únicamente la Directora de Desarrollo Humano y que **las respuestas no quedan almacenadas en la declaración patrimonial**. Este requisito determina la arquitectura de la pantalla: las respuestas no forman parte del borrador.

## Preguntas

Hay ocho preguntas Sí/No, todas en «No» al abrir. La primera es independiente; las otras siete cuelgan de «¿Conoce usted si algún compañero(a)...?» y se numeran del 1 al 7.

| Clave | Pregunta (resumen) |
| --- | --- |
| `lifestyle` | Cambios notables en el estilo de vida de compañeros o jefatura no acordes con su nivel de ingreso. |
| `vacations` | 1. Está siendo renuente a disfrutar de sus vacaciones. |
| `debts` | 2. Posee altos niveles de endeudamiento o recibe llamadas de cobro. |
| `ownBusiness` | 3. Posee un negocio propio y no lo ha reportado. |
| `afterHours` | 4. Permanece fuera de su horario laboral sin aval de la jefatura. |
| `absences` | 5. Se ausenta frecuente e injustificadamente de su lugar de trabajo. |
| `blocksClients` | 6. Impide que otros compañeros atiendan a determinados clientes. |
| `suspicious` | 7. Tiene comportamientos sospechosos sobre el nivel de ingreso y procedencia de sus fondos. |

Al responder «Sí» en cualquiera aparece, debajo, una indicación en rojo para desarrollar la denuncia (descripción, ubicación y participantes) y un campo de varias líneas, con un máximo de 1000 caracteres. El detalle es opcional: ni las respuestas ni el texto bloquean el avance. Al volver a «No», el detalle se descarta. El campo no lleva etiqueta visible; cada uno tiene una etiqueta solo para lectores de pantalla. Los interruptores son el componente `Switch` descrito en [datos judiciales](datos-judiciales.md).

## Separación del borrador patrimonial

- `ConfidentialReportService` mantiene las respuestas en un estado propio. El paso **no utiliza los valores ni el callback** que el contenedor entrega a los demás pasos, por lo que no se escribe nada bajo el paso 12 del borrador. El hook `useConfidentialReport` las expone con el mismo patrón que `useDeclaration`.
- Solo existen las preguntas contestadas «Sí»; una pregunta ausente equivale a «No». Las respuestas se conservan al salir del paso y volver durante la sesión.
- Se guardan únicamente en memoria. No utilizan `localStorage`, y el cierre de sesión las elimina junto con el borrador. Recargar la página también las pierde.
- `buildConfidentialPayload` arma lo que recibiría Desarrollo Humano a partir únicamente de las respuestas confidenciales: las ocho preguntas en orden, con `answer: "si" | "no"` y el detalle recortado solo en las respuestas afirmativas que lo tienen. No lee la declaración patrimonial, de modo que ningún dato patrimonial puede viajar con él ni viceversa. Las pruebas verifican estas propiedades.

**No se envía nada.** El receptor, el canal, los permisos y el momento del envío no están definidos (D-12); se registran en [pendientes](../07-pendientes-y-continuidad.md). El contrato propuesto está en [contrato de API](../08-contrato-api.md).

## Continuidad

Referencias: `src/components/Pages/Declaration/ConfidentialReport/ConfidentialReport.tsx`, `src/services/ConfidentialReportService.ts`, `src/utils/hooks/useConfidentialReport.ts` y `src/types/ConfidentialReport.types.ts`. El paso continúa con el [juramento y cierre](juramento-y-cierre.md).

Confirmar con el equipo interno: destinatario y canal, quién puede leer las respuestas, si se envían con la finalización o por separado, y el acuse que recibe la persona. Evidencia en [validación](../06-validacion-y-calidad.md).
