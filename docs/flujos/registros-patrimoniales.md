# Operaciones comunes de registros patrimoniales

Revisión: 14 de octubre de 2026. Código: `343c313c503bd25c652236b319c6e3874efeb8d4`.
Alcance: pasos 4 a 8 implementados con borrador en memoria.

Los pasos permiten continuar con sus tablas vacías; no registran una validación global en el contenedor. Sus diálogos sí validan cada registro al guardar. La navegación y duración del borrador se describen en [declaración y borrador](declaracion-y-borrador.md).

| Acción | Comportamiento |
| --- | --- |
| Agregar nuevo | Abre el formulario vacío. Guardar datos válidos genera un identificador local, agrega la fila, notifica y cierra el diálogo. |
| Editar | Precarga datos y cambia la acción a «Guardar». Conserva el identificador de la fila. |
| Cancelar, cerrar o Escape | Descarta cambios del diálogo sin modificar el registro anterior. |
| Eliminar | Retira inmediatamente la fila por identificador y notifica. Sin confirmación ni deshacer. |

Los formularios usan `AppDialog`, mantienen estado local hasta guardar y detienen la propagación del envío para no avanzar el formulario principal. Ante errores intentan enfocar el primer campo inválido; después del intento fallido vuelven a validar al corregir.

Los diálogos reciben `open`, `item` opcional, `onSave` y `onClose`. `onSave` entrega datos sin el identificador, cuya gestión corresponde a la pantalla. Están en sus carpetas de `src/components/Organisms`. La presentación tabular utiliza `RecordsTable`, con acciones identificadas por registro y una región enfocable con desplazamiento horizontal.

Los catálogos de `CatalogService` son de demostración. La validación comprueba presencia de selecciones, no pertenencia al catálogo. Los montos capturados son cadenas de dígitos, con máximo provisional de 15 caracteres; la interfaz elimina otros caracteres al escribir. Se admite cero, sin decimales ni importes negativos. Estos límites no sustituyen la validación institucional.

## Totales de los pasos 6 a 8

Los hooks solicitan cifras al montar y cuando cambia la referencia del arreglo de registros. Ignoran respuestas anteriores y conservan el último resultado mientras llega otro o si falla. No vuelven a marcar carga en cada refresco ni ofrecen reintento automático. Antes del primer resultado se muestra «—»; un fallo genera una notificación y no impide editar o continuar. Los valores conservados pueden estar desactualizados respecto a las filas.

Los servicios actuales simulan aproximadamente 250 ms de demora y sumas por moneda. No convierten ni mezclan colones y dólares. Los totales se muestran con símbolo y dos decimales; las filas utilizan el formato de `money.ts`. Fórmulas, precisión y formatos requieren confirmación del backend. Los cálculos no se incorporan como datos persistidos del borrador.

Las páginas específicas detallan campos y excepciones: [inmuebles](bienes-inmuebles.md), [muebles](bienes-muebles.md), [ahorro](cuentas-de-ahorro.md), [cuentas corrientes](cuentas-corrientes.md) y [créditos](creditos.md).
