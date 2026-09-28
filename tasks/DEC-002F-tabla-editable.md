# DEC-002F Tabla editable

Implementada y validada el 2026-09-28. Commit a cargo del usuario.

## Implementación

- **Componente** `src/components/Organisms/RecordsTable/RecordsTable.tsx` (genérico en el tipo de fila). Toma del nodo Figma 43121:5909 («Paso 2.1»): encabezados en Poppins Bold 14 px, filas en Poppins Regular 14 px, líneas de 1 px en `#1F1F1F` al 10 %, iconos de acción de 20 px (editar y eliminar) y «Agregar nuevo» arriba a la derecha con el «+» amarillo.
- **Solo presentación**: recibe columnas (`key`, `header`, `render`), filas con `id` estable y los manejadores `onAdd`, `onEdit` y `onDelete`. Quien la use decide qué pasa (normalmente abrir un modal). Sin `onEdit`/`onDelete` no hay columna «Acciones`; sin `onAdd` no hay botón.
- **Filas con `id` estable**, no por posición: eliminar o editar una fila no reacomoda el estado de las demás.
- **Vacío no es error** (D-16): muestra «No existen registros» (configurable) y deja agregar. No usa `role="alert"`.
- **Accesibilidad**: tabla semántica con nombre accesible (`caption` oculto + región), `scope="col"`, y acciones nombradas con la fila («Editar Ana Mora», «Eliminar Ana Mora») para que un lector de pantalla no oiga solo «Editar» repetido.
- **Scroll**: con muchas columnas hace scroll horizontal dentro de su propia región (enfocable con teclado, ancho mínimo 560 px), sin romper la página.

## Validación

- `check-types`, `lint` y pruebas de organismos: OK. Nueve pruebas nuevas: encabezados y filas, nombre accesible, vacío sin error, textos configurables, agregar, acciones nombradas que reciben la fila correcta, sin acciones cuando no hay manejadores, filas ligadas a su registro al quitar una y región de scroll accesible por teclado.
- **Sin verificación en navegador (V3):** ninguna pantalla la usa todavía; se compara contra Figma con el primer consumidor real (DEC-008B, tabla de familia).

## Diferencias y pendientes contra Figma

- El eliminar no pide confirmación aquí: eso lo decide quien la consume (modal de confirmación).
- Sin resumen por moneda ni columna con formato de monto: se agregan cuando los pasos financieros lo pidan (pendiente D-10/D-11).
- Alineación de columnas y anchos exactos se ajustan con datos reales en DEC-008B.
