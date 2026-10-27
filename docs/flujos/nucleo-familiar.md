# Conformación del núcleo familiar

Estado: paso 2 implementado con registros en memoria y catálogos de demostración.
Revisión: 14 de octubre de 2026. Código de referencia: `bda881c3316f635e2c0579c040b2dca1395d7f7a`.
Seguimiento local: DEC-008B; selector de fecha, DEC-008A.

## Propósito y recorrido

La sección `/mi-declaracion/2` presenta una tabla de familiares con parentesco, nombre, edad, fecha de nacimiento, género y acciones. Sin filas muestra «No existen registros» y permite continuar. No exige una cantidad mínima de familiares.

«Agregar nuevo» abre el diálogo «Miembro del núcleo familiar». La persona completa cinco campos y selecciona «Agregar». Editar abre el mismo diálogo con los datos de la fila y cambia la acción a «Guardar». Cancelar, el icono de cierre y Escape descartan los cambios del formulario sin alterar la tabla.

Los cambios se incorporan al borrador únicamente después de guardar un formulario válido. A diferencia de los campos de datos generales, escribir dentro del diálogo no actualiza inmediatamente el borrador.

## Campos y reglas

| Campo | Comportamiento vigente |
| --- | --- |
| Nombre y apellidos | Obligatorio, máximo de 120 caracteres. Se eliminan los espacios externos al guardar. |
| Edad en años cumplidos | Obligatoria, solo dígitos al escribir, máximo de tres caracteres; validación entre 0 y 120 inclusive. |
| Parentesco | Selección obligatoria de la lista de demostración. |
| Género | Selección obligatoria de la lista de demostración. |
| Fecha de nacimiento | Obligatoria, debe ser una fecha válida y no futura. El control presenta `DD/MM/AAAA` y guarda `YYYY-MM-DD`. |

El rango de edad y los máximos de caracteres son provisionales. Edad y fecha se capturan por separado: no se calcula la edad ni se comprueba su correspondencia con la fecha de nacimiento (confirmado por el equipo interno el 21 de octubre de 2026: no existe esa validación). Las listas de parentesco y género no representan catálogos institucionales confirmados.

El control de fecha distingue una escritura incompleta o imposible de un campo vacío y comunica un error específico. El límite superior utiliza la fecha actual local del navegador. La función de validación consume la señal de fecha inválida del selector; no constituye por sí sola una validación completa de fechas arbitrarias recibidas desde una API.

## Duplicados y operaciones

Un registro se considera duplicado cuando coincide el nombre normalizado y la fecha de nacimiento con otro familiar. La normalización ignora mayúsculas, tildes, espacios externos y espacios consecutivos. Por ejemplo, «José Mora» y «  jose   mora » se consideran iguales si tienen la misma fecha. Un nombre igual con otra fecha no se rechaza por esta regla.

Al editar, la fila actual se excluye de la comparación. La normalización solo se utiliza para detectar duplicados; el nombre guardado conserva mayúsculas y tildes. Esta regla no utiliza un identificador personal institucional y debe confirmarse con negocio.

| Operación | Efecto |
| --- | --- |
| Agregar | Genera un identificador local estable, agrega la fila y muestra una notificación de guardado. |
| Editar | Reemplaza los datos de la fila, conserva su identificador y muestra una notificación de guardado. |
| Eliminar | Abre un modal de confirmación («¿Está seguro(a) que desea eliminar este registro del sistema?»); solo con «Sí, eliminar» retira la fila por identificador y muestra una notificación de retiro. No ofrece deshacer. |
| Cancelar o cerrar | Descarta la edición del diálogo y conserva los registros anteriores. |

Las etiquetas de parentesco y género se resuelven a partir del catálogo; si no se encuentra una opción, se muestra el valor almacenado. La tabla formatea las fechas como día, mes y año. Las notificaciones acreditan cambios locales, no persistencia institucional; la duración del borrador se describe en [declaración y borrador](declaracion-y-borrador.md).

## Errores y accesibilidad

Guardar con errores mantiene abierto el diálogo y busca enfocar el primer campo inválido. Después del primer intento fallido, los errores se actualizan al corregir. El envío del diálogo detiene la propagación del evento para evitar que el formulario principal avance de paso al agregar o editar.

La tabla ofrece nombre accesible y acciones identificadas por el nombre del familiar. Su región de desplazamiento es enfocable. Estas medidas proceden del código y pruebas; falta la revisión completa de teclado y presentación sobre la versión de entrega.

## Archivos y continuidad

| Archivo | Responsabilidad |
| --- | --- |
| `src/components/Pages/Declaration/Family/Family.tsx` | Tabla, operaciones, identificadores y notificaciones. |
| `src/components/Organisms/FamilyDialog/FamilyDialog.tsx` | Formulario, validación y detección de duplicados. |
| `src/types/Family.types.ts` | Contratos de registro, formulario y valores del paso. |
| `src/services/CatalogService.ts` | Parentesco y género. |
| `src/utils/dates.ts` | Fecha local y presentación de fechas. |
| `src/sad-aml-shared/components/Organisms/RecordsTable/RecordsTable.tsx` | Presentación de tabla y acciones. |

Confirmar rango de edad, catálogos, criterio de duplicados y política de retiro de registros. La integración requerirá acordar identificadores de servidor y validaciones de datos recibidos. La tabla vacía y la ausencia de confirmación al eliminar son comportamientos vigentes, no conclusiones sobre las reglas finales.

El diálogo utiliza «Guardar» para edición, mientras el historial de diseño identifica principalmente el alta. No se hizo nueva comparación con Figma. Evidencia actual en [validación y calidad](../06-validacion-y-calidad.md).
