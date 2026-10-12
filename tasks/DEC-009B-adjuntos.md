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

## Rediseño de las minitarjetas (2026-10-13)

El usuario reportó que las tarjetas de archivo no se parecían a Figma. Se rehicieron contra el nodo 43121:5802 (146×118, borde gris-100, radio 12, sombra Elevation-3, 11 px entre tarjetas):

- **Zona de vista previa** (69 px, esquinas superiores redondeadas) con el icono del estado al centro: gris (`#1F1F1F` al 30 %, plano; en Figma no hay degradado) y el icono en verde para *subiendo* (girando) y *subido* (clip); blanca con icono rojo para *no válido* (alerta) y para *error de subida* (flecha circular, que **es** el botón de reintentar).
- **Barra de estado** de 5 px bajo la vista previa: avance verde mientras sube, toda roja si falló; nombre en Work Sans Bold 11 px con puntos suspensivos; el mensaje de error va en una línea debajo (texto completo en `title` y anunciado con `role="alert"`).
- **Encabezado compacto** cuando ya hay archivos: icono de 34 px y las dos líneas de texto en una sola fila, como en Figma; vacío sigue el icono grande centrado. El enlace «selecciónelo» pasa a subrayado gris (antes verde y en negrita).
- **Retirar** (papelera) está en todas las tarjetas, blanca sobre el gris en las llenas; Figma solo la dibuja en *subido* (más el botón de descarga, que sigue sin implementarse), pero un archivo con error también se tiene que poder quitar.

## Miniatura del PDF y barra (2026-10-13, segundo ajuste)

- **Barra de estado**: una vez subido el archivo ya no se pinta (antes quedaba una pista gris vacía); el espacio se conserva, así la tarjeta no cambia de alto ni el nombre de posición respecto a las que sí llevan barra (subiendo o con error).
- **Miniatura de la primera página** (como los adjuntos de ChatGPT): `src/utils/pdfThumbnail.ts` dibuja la página 1 en un canvas (270×138 px, el doble de la zona de vista previa, recortada arriba) con **pdf.js** (`pdfjs-dist`, dependencia nueva) y `useAttachments` la guarda en `previewUrl` apenas está lista. Todo ocurre en el navegador; el archivo no sale de la máquina. La librería y su worker se cargan solo al elegir un archivo (`import()` dinámico), no pesan en la carga inicial.
- En la tarjeta: la miniatura llena la zona de vista previa; mientras sube va oscurecida con el icono girando encima; ya subida se ve limpia, solo con la papelera (sobre un fondo oscuro para que no se pierda). Si el PDF no se puede leer (dañado o protegido) la tarjeta se queda con el icono gris de siempre. Las tarjetas con error o inválidas no muestran miniatura (se ven como en Figma).
- Al **editar** una fila ya guardada no hay miniatura: el borrador solo conserva los nombres de los archivos, no los archivos (sin backend). Se vería con el servidor real.
- **Contorno de foco**: el contorno de la zona de arrastre solo aparece con foco de teclado (`:has(.fileUpload__input:focus-visible)`). Con `:focus-within` salía también al elegir un archivo con el mouse y se quedaba hasta tocar otra cosa, porque el campo de archivo oculto conserva el foco (reportado por el usuario). Verificado en el navegador: tras un clic no hay contorno; con Tab sí.
- **Dependencia nueva `pdfjs-dist` 6.x**: pide Node >= 22.13 y navegadores recientes; hay que agregarla también al repositorio real cuando se copie el trabajo. Para quitarla basta borrar `pdfThumbnail.ts` y la llamada en `useAttachments`; las tarjetas vuelven a mostrar el icono. En las pruebas se reemplaza por un doble (`jest.setup.ts`) porque jsdom no tiene canvas.

## Diferencias contra Figma

- El botón de «descargar» que trae el estado «listo» en Figma no se implementó: sin backend, descargar el mismo archivo que la persona acaba de elegir no tiene un propósito claro; se retoma cuando exista un origen real del archivo (servidor).
- Sin confirmación al eliminar un adjunto (mismo criterio que las tablas de Familia e Inmuebles).

## Validación

- `check-types`, `lint` y 142 pruebas: OK. 16 nuevas: 7 del hook (PDF válido hasta `uploaded`, tipo rechazado, tamaño rechazado, límite de cantidad, error simulado, reintentar sin volver a elegir el archivo, retirar) y 9 del componente (sin lista vacía, una tarjeta por archivo, barra de progreso con su porcentaje, mensajes de error visibles, «Reintentar» solo en error y con el id correcto, «Quitar» con el id correcto, selección por el campo de archivo, archivo soltado, error de formulario aparte del error por archivo).
- V3 en navegador con una página temporal (ya borrada): se seleccionaron un PDF válido, un PNG (rechazado: «Solo se aceptan archivos PDF») y un archivo «error.pdf»; se vieron en vivo los cinco estados (`selected` no se alcanza a ver, como se explica arriba): `uploading` con la barra de progreso avanzando, `uploaded` con el ícono verde, `invalid` con el mensaje de tipo, y `error` con el mensaje y el botón de reintentar. Reintentar «error.pdf» repite el fallo (mismo nombre, mismo resultado determinístico); quitar un archivo lo retira de la lista. El campo de archivo se pudo enfocar con teclado.

## Pendientes

- Sin consumidor real todavía: el primer uso previsto es DEC-009C (Ingreso adicional, nodo Figma 43121:5766/43121:5788), que sigue bloqueada por D-10 (fórmulas del paso 3).
- Cantidad máxima de archivos (D-05) sigue pendiente de confirmar.
