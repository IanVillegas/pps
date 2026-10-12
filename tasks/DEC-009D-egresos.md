# DEC-009D Egresos y situación financiera (paso 3)

Implementada y validada el 2026-10-12. Cierra el paso 3.

## Implementación

- **Tabla** «Egresos mensuales» y **«Total de egresos»** en `IncomeExpenses.tsx` (nodo Figma 43121:5740). El total, en rojo, es la cifra que entrega el backend, no una suma local.
- **Modal** `src/components/Organisms/ExpenseDialog/ExpenseDialog.tsx` (nodo Figma 43121:5323): el texto «Favor considerar» con sus tres puntos, tipo de egreso (lista) y monto, ambos obligatorios; el monto solo acepta dígitos. «Agregar» al crear y «Guardar» al editar. Es un formulario de alta con un texto informativo arriba, no solo un aviso.
- **«Otros detalles»**: saldo mensual disponible y las dos razones (gasto-ingreso y cuota de créditos-ingreso), tal como las devuelve el backend (D-10); mientras llega la primera respuesta muestran «—».
- **Preguntas**: «¿Existen cambios en el periodo actual en su situación patrimonial?» (Si/No) y «¿Cómo califica su situación financiera?» (Estable/Difícil/Grave), más la descripción libre (hasta 1000 caracteres, `FIELD_MAX_LENGTH.situationDetail`, D-17).
- **Validación del paso** (`validateIncomeExpenses`): se exigen las dos preguntas. Las tablas pueden quedar vacías (D-16) y la descripción es opcional, porque Figma la pide como «cualquier aclaración que estime conveniente». Esto último es un **supuesto**: ni las preguntas ni la descripción llevan asterisco en Figma.
- **`RadioGroup`** `src/components/Molecules/RadioGroup/RadioGroup.tsx` (nuevo, **provisional**): `sad-aml-shared` solo tiene `CardRadioButton` (tarjeta con ícono), no un radio simple, y Figma usa el componente «Radio-NEW». Usa `<input type="radio">` nativo (flechas del teclado, lectores de pantalla). El grupo es un `radiogroup` con `aria-invalid` y `tabIndex=-1` para que, tras un intento fallido de «Continuar», el wizard lleve el foco a la primera pregunta con error (`aria-invalid` no aplica al rol `radio`, sí al grupo). Se reemplaza sin tocar al paso cuando shared lo exponga.

## Validación

- `check-types`, `lint` y 195 pruebas: OK. Nuevas de esta tarea: 3 de validación del modal, 4 de `RadioGroup` (nombre del grupo, valor marcado, clic y flechas, error y foco), 9 de la página (tabla vacía, listado y total, modal informativo con errores, alta con aviso, editar y retirar, cifras formateadas, nuevo pedido al backend al cambiar un egreso, respuestas y descripción en el borrador, errores del wizard) y 2 de `validateIncomeExpenses`.
- V3 en navegador: se agregó «Cuotas de créditos · 150,000»; con el ingreso de 350,000 el total de egresos fue 150,000, el saldo ₡ 1,400,000.00 y ambas razones 9.68 %. «Continuar» sin responder marca las dos preguntas y deja el foco en la primera; al responderlas el error desaparece al instante y «Continuar» pasa al paso 4. Al volver al paso 3 los datos siguen. Sin errores de consola.

## Diferencias y pendientes contra Figma

- **Columna «Justificación» de egresos**: la tabla de Figma (nodo 43121:5759) la dibuja, pero el modal de egresos no tiene ningún campo de justificación, así que esa columna nunca tendría contenido. No se implementó. En cambio sí hay columna de acciones (editar y retirar), que el encabezado de Figma no dibuja pero hace falta. Se pregunta al negocio si falta un campo o sobra la columna; no se le asignó un D- nuevo porque no hay anotación de Figma que lo respalde.
- **«Tipo de ingreso \*» en el modal de egresos**: Figma lo rotula así (parece copiado del modal de ingresos). Se usó «Tipo de egreso \*».
- **«Si»** va sin tilde, literal de Figma (nodo 43121:5713); «Dificil» sí se escribió «Difícil».
- **Radios**: el estilo de Figma («Radio-NEW», estados con anillo de foco y de hover) se aproximó con un círculo de borde verde y, al marcarlo, relleno verde con anillo blanco; no hay estado de foco dibujado más allá del contorno de teclado estándar.
- Bloques en una sola tarjeta (ver DEC-009A), y las tablas de dos o tres columnas con scroll horizontal a ancho de tablet.
- Catálogo de tipos de egreso sintético (D-09); el valor «Cuotas de créditos» lo usa la simulación del backend para la razón cuota-ingreso.
- Eliminar no pide confirmación, mismo criterio que el resto de las tablas.
