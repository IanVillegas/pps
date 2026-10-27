# DEC-020A y DEC-020B: revisión visual, responsive y regresión

Ejecutadas el 2026-10-27 sobre el código de `main` (con los cambios de DEC-019, aún sin commit).

## DEC-020A: visual y responsive

Método: sesión local de prueba (`localhost:3005`) con el paso 1 completo; para cada ancho se recorrieron los doce pasos con el stepper y se midió con JavaScript el desborde horizontal de la página, el de cada tabla (región con scroll) y los elementos que salen del ancho visible. Es una **medición de desbordes**, no una comparación píxel a píxel contra Figma.

| Ancho | Resultado |
| --- | --- |
| 1440 px | Sin desborde de página ni de tablas en los 12 pasos. |
| 1366 px | Sin desborde de página ni de tablas en los 12 pasos. |
| 768 px (tablet) | Sin desborde de página en los 12 pasos. Las tablas con más columnas desplazan dentro de sí mismas (por diseño, DEC-002F): después del ajuste, solo los pasos 5 (525 px de contenido en 518), 6 (546), 8 (627) y 9 (802). |

Defectos encontrados y corregidos:

- **Tabla de sociedades (paso 10) cortada a 1024 px**: las dos últimas columnas, con editar y eliminar, quedaban ocultas. Se resolvió en DEC-016B con la variante compacta de `RecordsTable` (`dense`).
- **Scroll innecesario en tablet**: el ancho mínimo de las tablas era de 560 px y la tarjeta deja ~500 px a 768, así que hasta tablas de cuatro columnas desplazaban. Se bajó a 480 px: dejaron de desplazar los pasos 2, 3, 4, 7 y 10.

Comprobado sin defecto: el modal de sociedad (el de nueve campos) a 768 px mide 720 px, no se sale del ancho y ningún campo queda cortado. Los demás modales usan el mismo `AppDialog`.

Diferencias contra Figma que se mantienen (registradas en cada tarea): bordes rojos y amarillos de las capturas (anotaciones del usuario, D-15), tamaño `lg` en lugar de 750 px para el modal de sociedad, textos de «Eliminar» y «Guardar» con confirmación que Figma no dibuja en las tablas, y los textos con faltas de tilde del modal de confirmación.

No se hizo: revisión en teléfono (fuera de alcance, `AGENTS.md`), comparación píxel a píxel de cada pantalla contra Figma, ni revisión de contraste de color.

## DEC-020B: regresión

- **Automática**: `tsc --noEmit` y `eslint src` sin errores; Jest **64 suites y 452 pruebas** satisfactorias. El aviso conocido del selector compartido (paso de no controlado a controlado) sigue apareciendo en las pruebas; no afecta el funcionamiento.
- **Compilación de producción**: `next build` compila y genera las rutas `/`, `/inicio` y `/mi-declaracion/[paso]` sin errores. Se corrió en una copia aparte del proyecto para no tocar los servidores de desarrollo; el único aviso es de Sass dentro de `sad-aml-shared` (división con `/`), ajeno a este proyecto.
- **Recorrido en navegador** (`localhost:3005`, usuario de demostración): inicio de sesión; entrar a «Mi declaración» y cerrar el aviso inicial; con el paso 1 vacío el stepper no sale del paso y muestra los 11 errores; con el paso 1 completo, «Continuar» llega al paso 2 y el stepper salta libremente hasta el 12 y de vuelta; en el paso 12, «Terminar» abre el juramento, «Guardar» abre el modal de confirmación, «Guardar» en el modal muestra el spinner y luego «Guardado satisfactoriamente» con el botón «Guardado» deshabilitado, sin salir del paso.
- **Teclado y foco**: cubiertos por pruebas (navegación con flechas en el stepper, foco al primer campo inválido, foco en los diálogos). No se recorrió el sistema completo solo con teclado en el navegador.

Sin defectos materiales pendientes de lo medido. Pendientes explícitos: auditoría de accesibilidad completa (lector de pantalla real, contraste) y revisión píxel a píxel contra Figma, que quedan como mejora si hay tiempo antes de la entrega.
