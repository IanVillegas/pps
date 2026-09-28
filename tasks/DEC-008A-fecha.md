# DEC-008A Campo de fecha

Implementada y validada el 2026-09-28. Commit a cargo del usuario.

## Decisión: se reutiliza el DatePicker de sad-aml-shared

No se creó un campo de fecha nuevo. `Molecules/DatePicker` (MUI X + moment, formato DD/MM/YYYY, `minDate`/`maxDate`) ya cubría lo funcional, pero le faltaba lo que un formulario de DecPat necesita. Se **modificó** en lugar de duplicarlo, para no tener dos campos de fecha en el proyecto. Todos los cambios llevan la marca `!Agregado`/`!Modificado para DecPat` en el código.

## Cambios en `DatePicker` (sad-aml-shared)

- **Etiqueta ligada al campo**: era un `<div>`; ahora es un `<label htmlFor>` con un `id` (propio o generado), así que el campo tiene nombre accesible.
- **Errores**: nueva prop `errors` con el mensaje (`role="alert"`), `aria-invalid` y `aria-describedby`, y borde rojo. Mismo patrón que `InputText`.
- **`placeholder` y `disabled`** configurables (antes el placeholder era siempre «Seleccione»).
- **Estilos**: el contorno real de MUI (un `<fieldset>`) quedaba con el gris/azul por defecto y había un `border-color: red` suelto sobre todos los `div`. Ahora replica el campo de texto de Figma (nodo 43121:6211): 48 px, borde 1 px `#CED4DA`, radio 8, Poppins Medium 12 px, placeholder `#ADB5BD` y borde oscuro al enfocar.
- **Calendario desplegable**: salía con Roboto y azul de MUI. Figma no trae su diseño; se alineó lo mínimo de marca (Poppins y verde `#00998A`).

## Cómo lo usa quien lo consuma

`onChange` entrega un objeto `moment` (o `null`). Mientras la persona escribe, MUI entrega una fecha **inválida** (`isValid() === false`) para entradas incompletas o imposibles como 31/02, y conserva el texto parcial en el campo. Quien lo use debe guardar la cadena solo si `date.isValid()` y validar la obligatoriedad en su propio esquema.

## Validación

- `check-types` y `lint`: OK.
- Verificado en navegador con una página temporal (ya borrada): aspecto igual al campo de texto; 31/02 produce fecha inválida sin borrar lo escrito; el calendario respeta `maxDate` (días posteriores deshabilitados); elegir un día actualiza el campo (`15/09/2026`) y entrega `2026-09-15`; el error se ve en rojo con su mensaje.
- Shared queda fuera de Jest (`testPathIgnorePatterns`), así que las pruebas del campo se harán a través del formulario que lo use (DEC-008B).

## Diferencias y pendientes contra Figma

- El placeholder de Figma es un ejemplo de fecha («26/08/2024»); se usa «DD/MM/AAAA» para no sugerir un dato real.
- Sin diseño del calendario desplegable en Figma: queda con el tema mínimo descrito arriba.
- No se probó escribir la fecha completa con teclado en el navegador (la herramienta de prueba no envió las teclas de forma fiable); sí se comprobó la entrada parcial inválida y la selección con el calendario.
