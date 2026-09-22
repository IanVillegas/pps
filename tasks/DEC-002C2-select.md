# DEC-002C2 Select

Implementada y validada el 2026-09-22. Commit a cargo del usuario.

## Decisión: se corrige `sad-aml-shared/Dropdown` en el sitio, no se crea `SelectField`

`todo.md` proponía `src/components/Molecules/SelectField` (área "prevista", escrita el 2026-09-14, antes de la migración de esa misma fecha que definió el criterio actual). `AGENTS.md` — sección "Estrategia de implementación" — pone **Select** como ejemplo explícito de componente genérico y reutilizable que debe corregirse directo en `sad-aml-shared`, mismo criterio ya aplicado a `Checkbox`, `InputText`, `InputSecret` y `Modal`. Antes de tocar nada se confirmó con `grep` que ningún archivo de `src/` importa `Dropdown` todavía (solo lo usan internamente otros componentes de shared con nombre distinto), así que no había ningún consumidor que romper.

## Bugs reales corregidos (no solo estilo)

- **Keys aleatorias con `Math.random()`**: cada `Select.Item`/`Select.ItemText` usaba `key={randomKey(...)}`, una key nueva en cada render — React destruye y recrea las opciones en vez de reconciliarlas (el bug ya diagnosticado en `todo.md`). Se cambió a `key={element.value}` (estable) en ambas ramas (`options` y `multiOptions`); las keys en `'0'`/`'empty'` de los estados vacíos también se volvieron estables. El `key` en `Select.ItemText` no cumplía ninguna función (no está dentro de un array), se quitó.
- **Sin nombre accesible programático**: el componente envolvía el texto del label en `<Select.Group><Select.Label>`, colocado como hermano de `Select.Trigger`, no dentro de `Select.Content`. Se confirmó leyendo el código fuente de `@radix-ui/react-select` que `SelectGroup`/`SelectLabel` solo generan `aria-labelledby` entre ellos mismos (para agrupar opciones dentro del listado) — no hay ninguna relación con el trigger. El campo quedaba con label visible pero sin nombre accesible real: un lector de pantalla no sabía qué control era. Se reemplazó por un `<label htmlFor={triggerId}>` real (mismo patrón que `InputText`/`Checkbox`) con `id` generado por `useId()` si no se pasa uno; confirmado con `getByLabelText` en Jest y en el navegador (el combobox reporta el nombre "Estado civil \*").
- **Sin soporte de error**: no existía ninguna forma de mostrar un error de validación. Se agregó prop `errors?: string`: texto rojo debajo del trigger (mismo estilo que `InputText`/`Checkbox`, `role="alert"`), `aria-invalid` y `aria-describedby` en el trigger.
- **Sin `ref`**: se envolvió en `forwardRef<HTMLButtonElement, ...>` reenviado a `Select.Trigger`, consistente con `InputText`/`Checkbox`/`InputSecret`, y necesario para que el wizard (DEC-006B) pueda enfocar el campo con error tras un intento fallido (`querySelector('[aria-invalid="true"]')` + `.focus()`).
- El teclado y la selección controlada (`value`/`onChange`) ya funcionaban correctamente (Radix Select los provee); no fue necesario cambiarlos.

Nada de esto es una API nueva encima de la existente: `options`, `multiOptions`, `placeholder`, `label`, `onChange`, `disabled`, `value`, `labelNoRegister`, `isShort` se mantienen igual. Solo se agregaron `id` y `errors`, ambos opcionales.

## Archivos

- `src/sad-aml-shared/components/Molecules/Dropdown/Dropdown.tsx` (corregido).
- `src/sad-aml-shared/components/Molecules/Dropdown/Dropdown.module.scss` (+`__errors`, mismo estilo que `InputText`).
- `src/components/Molecules/index.ts` (nuevo, reexporta `Dropdown`; antes solo exportaba `DeclarationStepper` sin barril documentado).
- `src/components/Molecules/index.test.tsx` (nuevo, pruebas del `Dropdown` reexportado — igual patrón que `src/components/Atoms/index.test.tsx` para `InputText`/`Checkbox`, porque Jest excluye `src/sad-aml-shared/`).
- `jest.setup.ts`: se agregaron polyfills de `scrollIntoView`, `hasPointerCapture`, `setPointerCapture` y `releasePointerCapture` en `Element.prototype` — Radix Select los usa al resaltar opciones y manejar el puntero, y jsdom no los implementa (mismo tipo de gap que el `ResizeObserver` agregado en DEC-006A para `Tooltip`). Sin esto, el primer intento de prueba fallaba con `TypeError: candidate?.scrollIntoView is not a function`, confirmado antes de agregar el polyfill (no es un bug del componente).

## Validación

- `check-types`, `lint` y `test -- --runInBand`: OK (14 suites, 65 pruebas; 6 nuevas: asociación label/trigger, apertura por teclado + selección de opción, valor controlado mostrado, error enlazado por `aria-describedby`, `disabled` nativo, estado vacío). `build` OK.
- V3 en navegador (montado en una ruta temporal ya eliminada, dos selects lado a lado): comparado contra el nodo Figma 43121:6770 — label "Estado civil \*" en Work Sans SemiBold 14px gris-500, campo blanco 48px con borde `#CED4DA`, radio 8px, placeholder "Selecciona" en Poppins Medium 12px gris-300, flecha a la derecha; coincide. El combobox reporta nombre accesible "Estado civil \*" (antes no tenía ninguno). Clic en una opción actualiza el trigger ("Casado(a)") sin recargar ni error de consola. El segundo select con `errors="Campo obligatorio"` muestra el texto en rojo debajo, igual que `InputText`.
- El toggle por teclado (flechas + Enter) dentro del listado abierto **no se pudo verificar de forma concluyente con la herramienta de automatización del navegador** (mismo tipo de limitación ya documentado en el cierre de DEC-002C con la tecla espacio del `Checkbox`: los eventos de teclado sintéticos de la herramienta no siempre disparan el manejo interno de Radix). Sí quedó cubierto por la prueba automatizada de Jest (`userEvent.keyboard('{Enter}')` para abrir + click en la opción resaltada), que simula esto de forma fiable.

## Diferencias y pendientes

- No se encontró en el Design System GM (archivo `9kPyFvx98Nm6zcVICW2erz`) ningún componente publicado de Select/Dropdown ni una variante de error documentada (`search_design_system` sin resultados); el estilo del error se tomó por consistencia con `InputText`/`Checkbox`, no de un nodo Figma específico del Select.
- `element: any` en el mapeo de `multiOptions` (preexistente) no se tocó — no es parte del bug reportado y no está en el alcance de esta tarea; se deja para no mezclar cambios no relacionados.
- Este componente aún no está montado en ninguna pantalla real; lo conecta DEC-007 (estado civil, grado académico, agencia, oficina).

Commit sugerido (no ejecutado): `fix(dropdown): corrige keys aleatorias, nombre accesible y agrega error/ref al Select de sad-aml-shared (DEC-002C2)`
