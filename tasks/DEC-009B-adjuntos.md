# DEC-009B Adjuntos

Implementada y validada el 2026-09-30.

## Implementación

- **Componente** `src/components/Molecules/FileUpload/FileUpload.tsx` (nodo Figma 43121:5780 «sin adjuntos» / 43121:5788 «con adjuntos»): caja de arrastrar-y-soltar con selector de archivos, y una tarjeta por archivo ya agregado con su nombre, ícono de estado y acciones. Es **solo presentación**: recibe `files: AttachmentFile[]` y llama a `onFilesSelected`/`onRemove`/`onRetry`; no valida ni sube nada por su cuenta, mismo criterio que `RecordsTable` (DEC-002F).
- **Hook** `src/utils/hooks/useAttachments.ts` (no estaba en el área prevista original de la tarea; se agregó para no repetir la validación y la orquestación de subida en cada paso que necesite adjuntos — ingresos, egresos, etc., según D-05 en `plan.md`). Valida tipo y tamaño al seleccionar, arranca la subida simulada de inmediato para los archivos válidos, y expone `files`, `addFiles`, `remove`, `retry`.
- **Servicio simulado** `src/services/AttachmentService.ts` (DEC-009B, sin backend — D-08): `uploadAttachment(file, { onProgress })` resuelve con temporizadores, mismo patrón que `AuthService`. Un archivo cuyo nombre contiene «error» falla de forma repetible, para poder probar y demostrar el estado de error sin depender del azar.
- **Estados** (`AttachmentStatus`): `selected` (elegido, aún no subido — distinción explícita que pide D-05), `uploading` (con barra de progreso), `uploaded` (listo), `error` (con reintentar) e `invalid` (tipo o tamaño incorrecto, rechazado antes de intentar subir). `selected` casi nunca se alcanza a ver: el hook pasa a `uploading` en el mismo evento de selección.
- **Validación**: solo PDF (`application/pdf`) y máximo 5 MB por archivo, confirmados por el propio texto del modal en Figma («documentos en PDF», «5Mb max» — ya no son una propuesta). La cantidad máxima de archivos (`maxFiles`, por defecto 5) sigue siendo un valor simbólico: D-05 no la confirma.
- **Accesibilidad**: el campo de archivo real está oculto solo visualmente (mismo patrón que la etiqueta oculta del sidebar), así que sigue siendo enfocable y operable con teclado; cada acción de una tarjeta tiene su nombre accesible («Quitar cedula.pdf», «Reintentar error.pdf»); la barra de progreso usa `role="progressbar"` con su valor.

## Decisión de estructura: `<label>` no envuelve la lista de tarjetas

En Figma las tarjetas de archivos ya agregados están dentro de la misma caja punteada que el texto «arrastre y suelte». Envolver ambos en el mismo `<label>` (necesario para abrir el selector de archivos al hacer clic) habría puesto botones («Quitar», «Reintentar») dentro de un `<label>`, y un clic en esos botones reenvía su evento al campo de archivo salvo que se detenga a mano (`preventDefault`), una solución frágil. En su lugar, el `<label>` envuelve solo el ícono y el texto; la lista de tarjetas es hermana, no hija — el contenedor exterior (no el `<label>`) escucha `onDrop`, así que arrastrar sigue funcionando en toda la caja.

## Diferencias contra Figma

- Los cuatro estados de tarjeta de Figma (spinner, listo, error, "reintentar") se simplificaron a: `uploading` (spinner + barra), `uploaded` (ícono de clip), `error` (alerta + reintentar) e `invalid` (alerta, sin reintentar). El botón de «descargar» que trae el estado «listo» en Figma no se implementó: sin backend, descargar el mismo archivo que la persona acaba de elegir no tiene un propósito claro; se retoma cuando exista un origen real del archivo (servidor).
- Sin confirmación al eliminar un adjunto (mismo criterio que las tablas de Familia e Inmuebles).

## Validación

- `check-types`, `lint` y 142 pruebas: OK. 16 nuevas: 7 del hook (PDF válido hasta `uploaded`, tipo rechazado, tamaño rechazado, límite de cantidad, error simulado, reintentar sin volver a elegir el archivo, retirar) y 9 del componente (sin lista vacía, una tarjeta por archivo, barra de progreso con su porcentaje, mensajes de error visibles, «Reintentar» solo en error y con el id correcto, «Quitar» con el id correcto, selección por el campo de archivo, archivo soltado, error de formulario aparte del error por archivo).
- V3 en navegador con una página temporal (ya borrada): se seleccionaron un PDF válido, un PNG (rechazado: «Solo se aceptan archivos PDF») y un archivo «error.pdf»; se vieron en vivo los cinco estados (`selected` no se alcanza a ver, como se explica arriba): `uploading` con la barra de progreso avanzando, `uploaded` con el ícono verde, `invalid` con el mensaje de tipo, y `error` con el mensaje y el botón de reintentar. Reintentar «error.pdf» repite el fallo (mismo nombre, mismo resultado determinístico); quitar un archivo lo retira de la lista. El campo de archivo se pudo enfocar con teclado.

## Pendientes

- Sin consumidor real todavía: el primer uso previsto es DEC-009C (Ingreso adicional, nodo Figma 43121:5766/43121:5788), que sigue bloqueada por D-10 (fórmulas del paso 3).
- Cantidad máxima de archivos (D-05) sigue pendiente de confirmar.
