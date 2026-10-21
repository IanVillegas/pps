# Ingresos y egresos

Estado: paso 3 implementado con planilla y resumen financiero simulados.
Revisión: 21 de octubre de 2026 (estructura del 14 de octubre; «Otros detalles», formato de montos y eliminación, del 21). Código de referencia: `78b3e72e6274248af2648ace1e567a5ceb9b2b4d` y `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2`.
Seguimiento local: DEC-009A, DEC-009C y DEC-009D.

## Propósito y estructura

La ruta `/mi-declaracion/3` presenta tres tarjetas: planilla e ingresos adicionales, egresos mensuales y otros detalles. Las acciones del formulario se ubican en la última tarjeta mediante `cards: true`. La duración del borrador y navegación se describen en [declaración y borrador](declaracion-y-borrador.md).

Planilla muestra salario bruto y neto de solo lectura, recibidos del servicio de resumen. No se capturan ni editan en esta pantalla. Las tablas adicionales permiten agregar, editar y eliminar registros; ambas pueden quedar vacías.

## Captura de registros

| Formulario | Campos y validación vigente |
| --- | --- |
| Ingreso adicional | Tipo, monto y justificación obligatorios. Tipo desde catálogo de demostración; monto con el formato de [montos y moneda](montos-y-moneda.md); justificación hasta 500 caracteres, sin aceptar solo espacios. |
| Egreso mensual | Tipo y monto obligatorios. Tipo desde catálogo de demostración; monto con el formato de [montos y moneda](montos-y-moneda.md). No incluye justificación ni adjuntos. |

Los montos se escriben con el formato estándar (dígitos que entran como centavos, comas y dos decimales; hasta 15 dígitos con los centavos) y se guardan como texto decimal. Se acepta cero. Llevan el ícono del colón porque los totales de este paso se muestran en colones, aunque los diálogos no tienen selector de moneda; esa suposición se registra para confirmar. Los máximos son provisionales. La función de validación comprueba presencia del tipo, sin comprobar por sí sola pertenencia al catálogo.

Los diálogos mantienen cambios locales hasta «Agregar» o «Guardar». Cancelar, cerrar o Escape conservan la fila original. Guardar genera un identificador local al crear o conserva el existente al editar; muestra una notificación y cierra el diálogo. Eliminar abre un modal de confirmación («¿Está seguro(a) que desea eliminar este registro del sistema?») y solo retira el registro con «Sí, eliminar»; no hay deshacer. Estas operaciones actualizan el borrador, sin persistencia en servidor.

La tabla de ingresos muestra tipo, monto y cantidad de archivos. La justificación se consulta al editar. Los adjuntos no son obligatorios en la validación actual, aunque el texto solicita documentación de respaldo; si hay archivos seleccionados, todos deben terminar correctamente antes de guardar. Consultar [adjuntos](adjuntos-de-ingresos.md).

El diálogo de ingresos presenta instrucciones sobre informar a la jefatura y actualizar la matrícula de cliente cuando corresponda. El de egresos indica gastos mensuales, exclusión de rebajos ya reflejados en salario neto y registro de cuotas de créditos de Grupo Mutual. Son textos informativos; el sistema no comprueba su cumplimiento ni sincroniza automáticamente cuotas con el paso 8. Confirmar su redacción con el equipo interno.

## Otros detalles y avance

| Campo | Opciones y regla |
| --- | --- |
| Cambios en situación patrimonial | Sí o no; respuesta obligatoria. |
| Calificación de situación financiera | Estable, difícil o grave; respuesta obligatoria. |
| Descripción y aclaraciones | Opcional, hasta 1000 caracteres. No cambia su obligatoriedad según las respuestas. |
| Detalle de los cambios patrimoniales | Opcional, hasta 1000 caracteres. El campo está siempre visible, pero **solo se habilita con la respuesta «Si»**; con «No» (o sin responder) queda deshabilitado y vacío. Su etiqueta es provisional. |

La sección se presenta en este orden: las tres cifras de resumen, la calificación de la situación financiera, la descripción y, al final, la pregunta sobre cambios patrimoniales con sus opciones «Si» y «No» debajo de la pregunta. Las respuestas y descripciones actualizan el borrador al cambiar. Al responder «No» se descarta el detalle de los cambios del borrador, para que no quede un texto que contradiga la respuesta. «Continuar» exige presencia de ambas respuestas, sin exigir filas ni descripciones. La función del paso no verifica pertenencia a las opciones ni bloquea por falta de resumen financiero. Las reglas institucionales definitivas permanecen pendientes.

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
