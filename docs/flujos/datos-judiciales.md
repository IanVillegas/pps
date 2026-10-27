# Datos judiciales

Estado: paso 11 implementado con borrador en memoria. Revisión: 21 de octubre de 2026.
Código: `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2`. Seguimiento: DEC-017; documentación: DOC-013.

## Propósito y estructura

`/mi-declaracion/11`, titulado «Datos judiciales», presenta cuatro preguntas con un interruptor Sí/No cada una, en este orden: juicios por la vía penal, juicios por la vía civil, embargos y pensión alimenticia. Se abre con todas en «No» y sin campos. Al responder «Sí», aparecen los campos de esa pregunta.

| Pregunta | Clave | Campos al responder «Sí» |
| --- | --- | --- |
| ¿Ha estado implicado en juicios por la vía penal? | `penal` | `penalDetail`: texto opcional, hasta 300 caracteres. |
| ¿Ha estado implicado en juicios por la vía civil? | `civil` | `civilDetail`: texto opcional, hasta 300 caracteres. |
| ¿Posee usted embargos? | `embargoes` | `embargoesDetail`: texto opcional, hasta 300 caracteres. |
| ¿Paga pensión alimenticia? | `alimony` | `alimonyTo` («¿A quién?», obligatorio, hasta 120 caracteres) y `alimonyAmount` («Monto que cancela por mes», obligatorio). |

Los tres campos de detalle no llevan etiqueta ni asterisco en el diseño: la pregunta los explica. Cada uno tiene una etiqueta solo para lectores de pantalla («Detalle de los juicios por la vía penal», etc.).

## Reglas

- Las preguntas siempre tienen respuesta («No» por omisión), de modo que con todas en «No» el paso es válido y se puede continuar.
- Solo la pensión exige campos, **únicamente mientras esté en «Sí»**: el nombre rechaza texto de solo espacios y el monto debe escribirse (0.00 es válido). El monto usa el formato de [montos](montos-y-moneda.md) y no lleva ícono de moneda, porque el diseño no indica la moneda.
- **Apagar una pregunta descarta sus campos del borrador** y limpia sus errores. Así no queda un dato que contradiga la respuesta, y tras un intento fallido de continuar, volver a «No» en la pensión elimina los errores y permite avanzar. Al volver a «Sí», los campos parten vacíos. Cambiar una pregunta no altera las otras.
- Sin respuesta (valor ausente) equivale a «No».

## Interruptor

Las preguntas usan `Switch` (`src/sad-aml-shared/components/Atoms/Switch`), un componente genérico agregado a `sad-aml-shared`. Es un `<button role="switch">` con `aria-checked`: se activa con clic, Espacio y Enter, y su nombre accesible es la pregunta. Los textos «No» y «Sí» son visuales y no se anuncian. Se reutiliza en el cuestionario confidencial.

## Continuidad

Referencias: `src/components/Pages/Declaration/JudicialData/JudicialData.tsx`, `src/sad-aml-shared/components/Atoms/Switch`, `src/types/JudicialData.types.ts` y `fieldLimits.ts`.

Pendiente de confirmar con el equipo interno (D-23): qué debe escribirse en el detalle de juicios y embargos, si es obligatorio y su longitud, y la moneda del monto de la pensión. Los límites de longitud son provisionales. Evidencia en [validación](../06-validacion-y-calidad.md).
