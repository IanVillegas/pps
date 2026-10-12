# DEC-009C Ingreso adicional (paso 3)

Implementada y validada el 2026-10-12.

## Implementación

- **Tabla** «Ingresos adicionales» en `IncomeExpenses.tsx` (nodo Figma 43121:5650): columnas Tipo, Monto, Archivos («N archivo(s)») y Acciones, con `RecordsTable` (DEC-002F). Puede quedar vacía sin bloquear el avance (D-16). Cada alta, edición o retiro actualiza el borrador al instante y muestra un toast (D-11).
- **Modal** `src/components/Organisms/IncomeDialog/IncomeDialog.tsx` (nodos Figma 43121:5766 «sin adjuntos» y 43121:5788 «con adjuntos»: es el **mismo modal**): texto para informar a la jefatura, tipo de ingreso (lista), monto, justificación, selector de PDF (`FileUpload` de DEC-009B) y el aviso «Recuerde:». El botón dice «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta).
- **Validación**: tipo, monto y justificación son obligatorios (llevan asterisco en Figma); el monto solo acepta dígitos. Los adjuntos no llevan asterisco, pero el texto del modal pide adjuntarlos, así que **no son obligatorios**.
- **Adjuntos (D-05: seleccionado no equivale a subido)**: no se puede guardar mientras un archivo siga subiendo («Espere a que terminen de subir los archivos»), y un archivo con error o inválido se quita o se reintenta, no se descarta en silencio («Quite o reintente los archivos con error antes de continuar»). El borrador guarda solo los nombres de los PDF ya subidos; los archivos reales no se persisten.
- **Editar una fila** vuelve a mostrar sus archivos ya subidos: `useAttachments` ganó la opción `initialFileNames` (arrancan como «subido» sin volver a subirse).
- **Cancelar no altera la fila**: el estado y los adjuntos viven en el contenido del modal, que Radix solo monta mientras está abierto.

## Sobre «el error conserva el formulario»

El criterio de aceptación original decía «error conserva formulario». Hoy el guardado de una fila no tiene ruta de fallo (se guarda en el borrador en memoria, igual que Familia, Inmuebles y Muebles), así que lo que se cubre es lo que sí puede fallar: los errores de validación y de los adjuntos dejan el modal abierto con todo lo escrito. Si el backend real puede rechazar el guardado, habrá que decidir ahí qué se conserva.

## Validación

- `check-types`, `lint` y 195 pruebas: OK. Nuevas de esta tarea: 4 de validación del modal, 1 del hook (`initialFileNames`) y 7 de la tabla en la página (vacío, listado con monto formateado y conteo de archivos, errores por campo sin agregar nada, no guardar mientras un archivo sube, cancelar sin alterar, editar con datos y adjuntos precargados, retirar con aviso).
- V3 en navegador: el modal coincide con Figma; con el formulario vacío muestra los tres errores; se agregó «Alquileres · 350,000» con un PDF de prueba y la tabla muestra «1 archivo(s)» con el toast «Guardado satisfactoriamente».

## Diferencias y pendientes contra Figma

- **Corregido el 2026-10-13** (reporte del usuario): en el modal, «Tipo de ingreso» quedaba 4 px más arriba que «Monto» (la etiqueta de `InputText` separaba 14 px del campo y la del `Dropdown`, 10 px; Figma usa 10 px en ambos, «Field-NEW»). Se ajustó `InputText` de `sad-aml-shared` a 10 px, lo que alinea también cualquier otra fila que mezcle campo y lista (Datos generales, Familia, Muebles...). Y las minitarjetas de archivo se rehicieron según Figma (ver DEC-009B); el enlace «selecciónelo» ahora es subrayado gris.
- Catálogo de tipos de ingreso sintético (D-09).
- Cantidad máxima de archivos sigue siendo simbólica (D-05, 5).
- Eliminar no pide confirmación, mismo criterio que Familia e Inmuebles.
