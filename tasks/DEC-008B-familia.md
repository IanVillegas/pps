# DEC-008B Familia (paso 2)

Implementada y validada el 2026-09-28. Commit a cargo del usuario.

## Implementación

- **Paso** `src/components/Pages/Declaration/Family/Family.tsx` (nodo Figma 43121:5909): tabla con `RecordsTable` (DEC-002F) y columnas Parentesco, Nombre, Edad, Fecha nacimiento, Género y Acciones. Registrado como paso 2 en `stepDefinitions.tsx`, **sin `validate`**: la tabla puede quedar vacía y aun así continuar (D-16).
- **Modal** `src/components/Organisms/FamilyDialog/FamilyDialog.tsx` (nodo Figma 43121:6211, «Miembro del núcleo familiar»): nombre y apellidos, edad en años cumplidos, parentesco, género y fecha de nacimiento, todos obligatorios. Usa `Modal`, `InputText`, `Dropdown` y el `DatePicker` de shared (DEC-008A). El botón dice «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta).
- **Alta, edición y retiro**: cada acción actualiza el borrador al instante y muestra un toast (`Guardado satisfactoriamente` / `Eliminado satisfactoriamente`). Las filas se identifican por `id` estable.
- **Cancelar no altera la fila**: el formulario vive dentro del contenido del modal, que Radix solo monta abierto; al cerrar (Cancelar, X, Escape) el estado se descarta.
- **Sin duplicados**: mismo nombre (sin distinguir mayúsculas, tildes ni espacios de más) y misma fecha de nacimiento que otro familiar. Al editar se excluye la propia fila.
- **Validaciones**: campos requeridos; edad solo dígitos, de 0 a 120 (rango simbólico, sin contrato de backend); fecha real (31/02 se rechaza con «Escriba una fecha válida») y no futura. Los errores aparecen al intentar guardar y se actualizan mientras la persona corrige; el foco va al primer campo inválido.
- **Edad vs fecha de nacimiento: NO se valida** (D-19, abierto por decisión del usuario). Se capturan y guardan por separado.
- **Datos**: tipos en `src/types/Family.types.ts`; catálogos de parentesco y género sintéticos en `CatalogService.ts` (D-09); utilidades `src/utils/dates.ts` (fechas ISO locales, sin el desfase de UTC) y `src/utils/ids.ts`.

## Cambios en sad-aml-shared

- **`Dropdown`**: la lista desplegable tenía `z-index: 2`, por debajo del modal (3), así que dentro de un modal se abría pero no se veía. Ahora usa `$z-10`. Marcado `!Modificado para DecPat`.
- **`DatePicker`**: ver [DEC-008A](DEC-008A-fecha.md).

## Trampas resueltas

- El formulario del wizard envuelve el paso, y el modal va en un portal: React propaga el evento `submit` por el árbol de componentes, no por el DOM. Sin `stopPropagation` en el formulario del modal, «Agregar» también habría avanzado de paso. Verificado en navegador: se queda en el paso 2.
- `Modal` es un `AlertDialog` que exige una descripción accesible; el modal lleva una descripción visualmente oculta («Complete los datos del familiar…») para no dar advertencias y para lectores de pantalla.

## Validación

- `check-types`, `lint` y 113 pruebas: OK (18 nuevas: 9 de validación del formulario, 9 del paso —tabla vacía, etiquetas legibles y fecha DD/MM/YYYY, modal con sus cinco campos, errores por campo, solo dígitos en la edad, cancelar sin alterar, editar con datos precargados, rechazo de duplicado al editar y eliminar con aviso—).
- V3 en navegador (sesión real vía login local): tabla vacía con «No existen registros»; modal igual al diseño; enviar vacío muestra cinco errores y enfoca el primero sin cambiar de paso; el calendario aparece por encima del modal; al agregar aparece la fila (`Hijo(a) · Ana Mora Solano · 28 · 10/09/2026 · Femenino`) y **el primer toast real** («Guardado satisfactoriamente», verde, arriba a la derecha).
- Limitación de la prueba: la herramienta del navegador no selecciona opciones de una lista con clic sintético; se usó teclado. Escribir la fecha con teclado tampoco se probó (ver DEC-008A).

## Diferencias y pendientes contra Figma

- Eliminar no pide confirmación: Figma no dibuja un diálogo de confirmación. Es una decisión a revisar (se borra un dato declarado).
- En error, `InputText` y `Dropdown` (shared) no marcan el borde en rojo; el `DatePicker` sí. Inconsistencia visual dentro del mismo formulario, pendiente de decidir si se unifica.
- Catálogos de parentesco y género son sintéticos hasta que el backend los defina (D-09).
- Sin verificar 1366 px y tablet en detalle; la prueba se hizo con la ventana estrecha del panel (sidebar colapsado).
