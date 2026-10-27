# Adjuntos de ingresos adicionales

Estado: selección, vista previa y carga simulada implementadas; almacenamiento institucional pendiente.
Revisión: 14 de octubre de 2026. Código de referencia: `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`.
Seguimiento local: DEC-009B y DEC-009C.

## Selección y límites

El diálogo de [ingresos adicionales](ingresos-y-egresos.md) permite seleccionar varios archivos o arrastrarlos a la zona de adjuntos. `FileUpload` presenta tarjetas y acciones; `useAttachments` valida y coordina la simulación.

Por defecto se aceptan archivos con tipo MIME `application/pdf`, tamaño máximo de `5 × 1024 × 1024` bytes por archivo y hasta cinco tarjetas. La cantidad es provisional. Los archivos inválidos también ocupan un espacio; si se supera la capacidad, se incorporan solo los que caben y el resto se omite sin aviso específico. La comprobación de tipo utiliza el MIME informado por el navegador, no una inspección que garantice el contenido del archivo.

## Estados y guardado

| Estado | Significado y acción |
| --- | --- |
| `selected` | Archivo válido agregado, todavía sin completar la carga. |
| `uploading` | Simulación en curso, con barra de progreso. |
| `uploaded` | Simulación completada o nombre restaurado desde el ingreso guardado. |
| `error` | La simulación falló; permite reintentar o quitar. |
| `invalid` | Tipo o tamaño rechazado; requiere retirar el archivo. |

El formulario permite guardar sin adjuntos. Si los hay, bloquea el guardado mientras estén seleccionados o cargando, o si existen errores o archivos inválidos. El mensaje del conjunto aparece después de intentar guardar; los errores individuales se presentan en las tarjetas.

`AttachmentService` no envía datos a un servidor. Usa temporizadores para informar progreso y falla cuando el nombre contiene «error», sin distinguir mayúsculas. Reintentar ese mismo nombre vuelve a fallar en esta simulación. Quitar una tarjeta elimina su referencia local, sin una operación de borrado en servidor ni cancelación explícita de la tarea ya iniciada.

## Vista previa y conservación

Para nuevos PDF válidos se intenta generar una miniatura de la primera página mediante `pdfjs-dist`, cargado dinámicamente. El procesamiento ocurre en el navegador. Si la miniatura falla, se conserva la tarjeta con icono; ese fallo no convierte por sí mismo la carga en inválida ni bloquea guardar.

El registro de ingreso conserva únicamente nombres de archivos en `attachments: string[]`. No conserva contenido, URL de descarga ni identificador de servidor. Al editar, esos nombres se reconstruyen como tarjetas `uploaded`, sin cargar otra vez y sin recuperar miniaturas. La tabla muestra su cantidad; no ofrece descarga ni apertura del documento original.

Los objetos `File` permanecen en una referencia del hook mientras el formulario está montado. Cancelar o cerrar descarta la selección y no modifica el ingreso original. Eliminar un ingreso elimina sus nombres del borrador local. Estas operaciones no acreditan que exista un documento almacenado institucionalmente.

## Contrato de componentes

`FileUpload` recibe `label`, `files`, `onFilesSelected` y `onRemove`; opcionalmente `onRetry`, `accept`, `disabled` y `errors`. La carga y los límites pertenecen al hook, no al componente visual. Mantener ambas configuraciones coordinadas: el texto visible «5Mb max» está fijo y no cambia al configurar otro límite en el hook.

`useAttachments` admite `accept`, `maxSizeBytes`, `maxFiles` e `initialFileNames`. Los nombres iniciales solo se leen al montar. El hook devuelve `files`, `addFiles`, `remove` y `retry`. Los mensajes de tipo siguen refiriéndose a PDF aunque se configure otro MIME; revisar esa presentación antes de reutilizarlo para otro tipo de documento.

El selector tiene nombre accesible y relación con el error del conjunto; las acciones identifican el archivo por nombre y el progreso declara valores de 0 a 100. La miniatura es decorativa. Las pruebas seleccionadas no certifican accesibilidad completa ni lectura real de todos los PDF.

## Referencias y continuidad

| Archivo | Responsabilidad |
| --- | --- |
| `src/sad-aml-shared/components/Molecules/FileUpload/FileUpload.tsx` | Selección, arrastre, tarjetas y acciones. |
| `src/utils/hooks/useAttachments.ts` | Límites, estados, archivos temporales y miniaturas. |
| `src/services/AttachmentService.ts` | Progreso y resultados simulados. |
| `src/utils/pdfThumbnail.ts` | Generación local de vista previa. |
| `src/sad-aml-shared/types/Attachment.types.ts` | Contrato de tarjetas y estados. |
| `src/components/Organisms/IncomeDialog/IncomeDialog.tsx` | Condiciones para guardar el ingreso. |

Para integrar, acordar obligatoriedad, cantidad, tamaño, tipos y contrato de carga y descarga. Sustituir nombres por referencias recuperables de servidor y definir cancelación, eliminación y archivos cargados cuyo formulario se cancela. Las validaciones de contenido y autorización de acceso deben formar parte del servicio real. No hubo nueva comparación con Figma; consultar la [evidencia de pruebas](../06-validacion-y-calidad.md).
