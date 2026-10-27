# Decisiones técnicas

Estado: decisiones vigentes y asuntos por confirmar. Revisión: 27 de octubre de 2026.

| Decisión | Justificación y consecuencia |
| --- | --- |
| Ubicar todo componente genérico en `sad-aml-shared` | Sigue el estándar de desarrollo de Grupo Mutual y concentra lo reutilizable en una sola carpeta: quien quiera usar lo construido para DecPat solo la copia. La carpeta es propia de este sistema (no se refresca desde otro repositorio), así que sus modificaciones no requieren trasladarse; sus pruebas viajan con cada componente. |
| Mantener composiciones patrimoniales en DecPat | Conserva la responsabilidad de negocio fuera de la biblioteca de interfaz: pantallas, diálogos de cada paso, servicios, `CurrencyTotals`, `DeclarationStepper` y `ConfirmSaveDialog` no son genéricos. |
| Usar Figma y el Design System GM como referencia visual | Las medidas y estados deben verificarse contra el diseño; las diferencias se documentan con su motivo. |
| Mantener sesión y borrador de demostración en memoria | Evita persistir información patrimonial localmente durante esta etapa; la recarga pierde el estado. |
| Recibir totales desde servicios | El backend será responsable de los cálculos. Las fórmulas simuladas no constituyen reglas institucionales aprobadas. |
| Separar importes por moneda | Los servicios de ahorro, cuentas corrientes, créditos y tarjetas no convierten ni mezclan colones y dólares. |
| Compartir la presentación de totales repetida entre pasos | `CurrencyTotals` presenta los totales por moneda de créditos y tarjetas; evita mantener dos copias de la misma composición. |
| Pedir confirmación antes de eliminar un registro | `RecordsTable` muestra un modal en todas las tablas; la eliminación no se deshace y se evita perder un registro con un clic accidental. |
| Guardar los montos como texto decimal con centavos | Evita errores de punto flotante y conserva el control de los decimales; el formato de entrada es el estándar de Grupo Mutual (dígitos que entran como centavos). Ver [montos y moneda](flujos/montos-y-moneda.md). |
| Mantener el cuestionario confidencial y el cierre fuera del borrador | Cada uno tiene su servicio y su estado: las respuestas confidenciales no se almacenan con la declaración ni se mezclan con su payload, y el guardado final tiene sus propios estados. |
| Declarar éxito solo tras la respuesta del servicio | El guardado del juramento muestra «Guardando», bloquea clics repetidos y solo pasa a «Guardado» con la respuesta, nunca antes. |
| Preparar el frontend para un backend futuro sin conectarlo | Las pantallas dependen de servicios; integrar una API consistirá en implementar un adaptador según el [contrato](08-contrato-api.md). Lo que depende de información externa se registra como deuda técnica y no bloquea el cierre de la preparación. |
| Bloquear el avance solo en el paso 1 | El paso 1 es una pantalla de datos obligatorios sin diálogo; los demás pasos validan dentro de sus diálogos. Por eso el desplazamiento es libre una vez completado el paso 1 y no existe validación global al terminar. |
| Mostrar el detalle de los cambios patrimoniales solo con «Sí» | La pregunta parte en «No» y el campo de detalle solo aparece con «Sí»; con «No» se oculta y se descarta, para no dejar un texto que contradiga la respuesta. |
| Leer los catálogos mediante un almacén asíncrono | Las pantallas no importan listas: leen `useCatalog` o `catalogLabel`. Cambiar de listas simuladas a catálogos del servidor no modifica ninguna pantalla. |
| Acotar la preparación para el backend | Se dejaron listos el cliente HTTP y los catálogos; las firmas definitivas de los servicios y los adaptadores reales dependen de contratos que no existen. Ver la justificación en [integración con el backend](09-integracion-con-el-backend.md). |
| No persistir el borrador en el navegador | Evita que otra persona del mismo equipo consulte información patrimonial; a cambio, recargar pierde los datos y el navegador advierte antes de salir. |
| Mostrar la lista de opciones del `Dropdown` como un panel propio | El diseño no dibuja la lista abierta; se definió con los tokens del sistema (borde y radio del campo, sombra de las tarjetas, opciones de 40 px, marca en la elegida y resaltado por teclado). |
| Presentar sociedades con una tabla compacta | Nueve columnas no caben con la presentación estándar en pantallas de portátil; `RecordsTable` ofrece una variante `dense` que las muestra completas a 1024 px. |
| Priorizar escritorio y tablet | Responde al alcance de dispositivos acordado. |
| Mantener trazabilidad DEC en documentación | Permite relacionar trabajo y evidencia sin exigir referencias en el código fuente. |

Las decisiones identificadas históricamente como `D-*` están en [preparación técnica](../tasks/preparacion-tecnica-visual.md) y registros de tareas. Son referencias locales. Al documentarlas para el equipo receptor, acompañarlas de una descripción y actualizar su estado; no reutilizar afirmaciones históricas que hayan sido reemplazadas.

Permanecen por confirmar los contratos de API, catálogos oficiales, reglas definitivas de montos y validaciones de negocio. El historial también registra diferencias visuales y supuestos de campos; se deben revisar al preparar la versión transferida.
