# Ingresos y egresos

Estado: paso 3 implementado con planilla y resumen financiero simulados.
Revisión: 14 de octubre de 2026. Código de referencia: `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`.
Seguimiento local: DEC-009A, DEC-009C y DEC-009D.

## Propósito y estructura

La ruta `/mi-declaracion/3` presenta tres tarjetas: planilla e ingresos adicionales, egresos mensuales y otros detalles. Las acciones del formulario se ubican en la última tarjeta mediante `cards: true`. La duración del borrador y navegación se describen en [declaración y borrador](declaracion-y-borrador.md).

Planilla muestra salario bruto y neto de solo lectura, recibidos del servicio de resumen. No se capturan ni editan en esta pantalla. Las tablas adicionales permiten agregar, editar y eliminar registros; ambas pueden quedar vacías.

## Captura de registros

| Formulario | Campos y validación vigente |
| --- | --- |
| Ingreso adicional | Tipo, monto y justificación obligatorios. Tipo desde catálogo de demostración; monto solo dígitos, máximo 15 caracteres; justificación hasta 500 caracteres, sin aceptar solo espacios. |
| Egreso mensual | Tipo y monto obligatorios. Tipo desde catálogo de demostración; monto solo dígitos, máximo 15 caracteres. No incluye justificación ni adjuntos. |

Los controles eliminan caracteres no numéricos al escribir montos. Se acepta cero; no hay captura de decimales, signos negativos, separadores ni selector de moneda. Los máximos y formatos son provisionales. La función de validación comprueba presencia del tipo, sin comprobar por sí sola pertenencia al catálogo.

Los diálogos mantienen cambios locales hasta «Agregar» o «Guardar». Cancelar, cerrar o Escape conservan la fila original. Guardar genera un identificador local al crear o conserva el existente al editar; muestra una notificación y cierra el diálogo. Eliminar retira inmediatamente el registro, sin confirmación ni deshacer. Estas operaciones actualizan el borrador, sin persistencia en servidor.

La tabla de ingresos muestra tipo, monto y cantidad de archivos. La justificación se consulta al editar. Los adjuntos no son obligatorios en la validación actual, aunque el texto solicita documentación de respaldo; si hay archivos seleccionados, todos deben terminar correctamente antes de guardar. Consultar [adjuntos](adjuntos-de-ingresos.md).

El diálogo de ingresos presenta instrucciones sobre informar a la jefatura y actualizar la matrícula de cliente cuando corresponda. El de egresos indica gastos mensuales, exclusión de rebajos ya reflejados en salario neto y registro de cuotas de créditos de Grupo Mutual. Son textos informativos; el sistema no comprueba su cumplimiento ni sincroniza automáticamente cuotas con el paso 8. Confirmar su redacción con el equipo interno.

## Otros detalles y avance

| Campo | Opciones y regla |
| --- | --- |
| Cambios en situación patrimonial | Sí o no; respuesta obligatoria. |
| Calificación de situación financiera | Estable, difícil o grave; respuesta obligatoria. |
| Descripción y aclaraciones | Opcional, hasta 1000 caracteres. No cambia su obligatoriedad según las respuestas. |

Las respuestas y descripción actualizan el borrador al cambiar. «Continuar» exige presencia de ambas respuestas, sin exigir filas ni descripción. La función del paso no verifica pertenencia a las opciones ni bloquea por falta de resumen financiero. Las reglas institucionales definitivas permanecen pendientes.

## Resumen financiero

`useFinancialSummary` solicita cifras al montar y cuando cambian las referencias de ingresos o egresos. Descarta respuestas de solicitudes anteriores. Conserva el último resumen durante un refresco y también si este falla; no lo reemplaza por cero. El hook no vuelve a marcar `loading` en cada actualización ni implementa reintento automático.

Antes de la primera respuesta, planilla muestra carga y las cifras muestran «—». Si falla sin datos previos, planilla muestra el mensaje de fallo. Ante error se emite una notificación; la pantalla sigue permitiendo trabajar. Con datos previos, estos permanecen visibles y podrían estar desactualizados respecto a las filas actuales.

El servicio actual simula la respuesta con aproximadamente 250 ms de demora y salario bruto de 1 500 000 y neto de 1 200 000. Las siguientes fórmulas describen exclusivamente la demostración:

| Cifra | Fórmula provisional |
| --- | --- |
| Ingreso para cálculos | Salario neto más ingresos adicionales. |
| Total de egresos | Suma de montos de egresos registrados. |
| Saldo mensual disponible | Ingreso para cálculos menos total de egresos. |
| Relación gasto-ingreso | Egresos divididos entre ingreso para cálculos, multiplicado por 100. |
| Relación cuota créditos-ingreso | Suma de egresos de tipo `cuotas-creditos`, dividida entre ingreso para cálculos, multiplicada por 100. |

La simulación redondea porcentajes a dos decimales y devuelve cero si el denominador no es positivo. No limita el porcentaje a 100 ni el saldo a valores positivos. El frontend muestra las respuestas: el backend institucional será responsable de confirmar y calcular estas cifras.

Las tablas usan formato con separadores de miles; el saldo utiliza símbolo de colones y dos decimales; las razones muestran dos decimales y `%`. Formato, moneda y redondeo deben acordarse antes de integrar.

## Referencias y continuidad

| Archivo | Responsabilidad |
| --- | --- |
| `src/components/Pages/Declaration/IncomeExpenses/IncomeExpenses.tsx` | Composición, operaciones y validación del paso. |
| `src/components/Organisms/IncomeDialog/IncomeDialog.tsx` | Captura de ingreso y control del estado de adjuntos. |
| `src/components/Organisms/ExpenseDialog/ExpenseDialog.tsx` | Captura e instrucciones de egresos. |
| `src/services/FinancialSummaryService.ts` | Cifras sintéticas y fórmulas provisionales. |
| `src/utils/hooks/useFinancialSummary.ts` | Solicitud y conservación del último resumen. |
| `src/types/IncomeExpenses.types.ts` | Contratos de registros, respuestas y resumen. |
| `src/services/CatalogService.ts`, `src/utils/money.ts` | Opciones y presentación de cifras. |

El historial registra una columna «Justificación» para egresos en Figma, sin campo equivalente en el modal; la implementación actual no la incluye. Confirmar esa diferencia, las dos preguntas obligatorias, reglas de montos y recuperación de errores de resumen. No hubo nueva revisión visual en esta tarea; la [evidencia](../06-validacion-y-calidad.md) corresponde a pruebas existentes y lectura de código.
