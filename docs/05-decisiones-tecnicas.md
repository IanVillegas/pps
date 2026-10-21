# Decisiones técnicas

Estado: decisiones vigentes y asuntos por confirmar. Revisión: 21 de octubre de 2026.

| Decisión | Justificación y consecuencia |
| --- | --- |
| Extender los componentes genéricos en shared | Facilita su reutilización y permite transferir las modificaciones al destino correspondiente. |
| Mantener composiciones patrimoniales en DecPat | Conserva la responsabilidad de negocio fuera de la biblioteca de interfaz. |
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
| Priorizar escritorio y tablet | Responde al alcance de dispositivos acordado. |
| Mantener trazabilidad DEC en documentación | Permite relacionar trabajo y evidencia sin exigir referencias en el código fuente. |

Las decisiones identificadas históricamente como `D-*` están en [preparación técnica](../tasks/preparacion-tecnica-visual.md) y registros de tareas. Son referencias locales. Al documentarlas para el equipo receptor, acompañarlas de una descripción y actualizar su estado; no reutilizar afirmaciones históricas que hayan sido reemplazadas.

Permanecen por confirmar los contratos de API, catálogos oficiales, reglas definitivas de montos y validaciones de negocio. El historial también registra diferencias visuales y supuestos de campos; se deben revisar al preparar la versión transferida.
