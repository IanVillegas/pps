# Operaciones comunes de registros patrimoniales

Revisión: 27 de octubre de 2026. Código: `343c313c503bd25c652236b319c6e3874efeb8d4` para los pasos 4 a 8, `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2` para los pasos 9 y 10, el formato de montos y la confirmación al eliminar, y `c789b079859bd590e4180cb0ac3ae08fec58b781` para las sociedades y la variante compacta de la tabla.
Alcance: pasos 4 a 10 implementados con borrador en memoria (el paso 10 solo con personerías jurídicas).

Los pasos permiten continuar con sus tablas vacías; no registran una validación global en el contenedor. Sus diálogos sí validan cada registro al guardar. La navegación y duración del borrador se describen en [declaración y borrador](declaracion-y-borrador.md).

| Acción | Comportamiento |
| --- | --- |
| Agregar nuevo | Abre el formulario vacío. Guardar datos válidos genera un identificador local, agrega la fila, notifica y cierra el diálogo. |
| Editar | Precarga datos y cambia la acción a «Guardar». Conserva el identificador de la fila. |
| Cancelar, cerrar o Escape | Descarta cambios del diálogo sin modificar el registro anterior. |
| Eliminar | El ícono abre un modal de confirmación («¿Está seguro(a) que desea eliminar este registro del sistema?»). Solo «Sí, eliminar» retira la fila por identificador y notifica; «Cancelar», la X y Escape no eliminan nada, y se vuelve a preguntar por cada registro. No hay deshacer. |

Los formularios usan `AppDialog`, mantienen estado local hasta guardar y detienen la propagación del envío para no avanzar el formulario principal. Ante errores intentan enfocar el primer campo inválido; después del intento fallido vuelven a validar al corregir.

Los diálogos reciben `open`, `item` opcional, `onSave` y `onClose`. `onSave` entrega datos sin el identificador, cuya gestión corresponde a la pantalla. Están en sus carpetas de `src/components/Organisms`. La presentación tabular utiliza `RecordsTable` (`src/sad-aml-shared/components/Organisms/RecordsTable`), con acciones identificadas por registro y una región enfocable con desplazamiento horizontal. La tabla tiene un ancho mínimo de 480 px y una variante compacta (`dense`) para muchas columnas, que usa la de [sociedades](sociedades.md); cuando una pantalla tiene varias tablas, `addAriaLabel` distingue el nombre accesible de cada botón de agregar.

Los catálogos de `CatalogService` son de demostración. La validación comprueba presencia de selecciones, no pertenencia al catálogo. Los montos se escriben con el formato estándar de [montos y moneda](montos-y-moneda.md): dígitos que entran como centavos, comas y dos decimales, hasta 15 dígitos con los centavos, guardados como texto decimal; se admite cero y no hay importes negativos. Estos límites no sustituyen la validación institucional.

## Totales de los pasos 6 a 9

Los hooks solicitan cifras al montar y cuando cambia la referencia del arreglo de registros. Ignoran respuestas anteriores y conservan el último resultado mientras llega otro o si falla. No vuelven a marcar carga en cada refresco ni ofrecen reintento automático. Antes del primer resultado se muestra «—»; un fallo genera una notificación y no impide editar o continuar. Los valores conservados pueden estar desactualizados respecto a las filas.

Los servicios actuales simulan aproximadamente 250 ms de demora y sumas por moneda. No convierten ni mezclan colones y dólares. Los totales se muestran con símbolo y dos decimales, y los pasos 8 y 9 los presentan con el componente compartido `CurrencyTotals`. Las filas utilizan el formato de `money.ts`. Fórmulas, precisión y formatos requieren confirmación del backend. Los cálculos no se incorporan como datos persistidos del borrador.

Las páginas específicas detallan campos y excepciones: [inmuebles](bienes-inmuebles.md), [muebles](bienes-muebles.md), [ahorro](cuentas-de-ahorro.md), [cuentas corrientes](cuentas-corrientes.md), [créditos](creditos.md) y [tarjetas de crédito](tarjetas-de-credito.md); [personería jurídica](personeria-juridica.md) para el paso 10. El formato de montos y la moneda se explican en [montos y moneda](montos-y-moneda.md).
