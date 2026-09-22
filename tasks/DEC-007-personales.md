# DEC-007 Personales

Implementada y validada el 2026-09-22. Commit a cargo del usuario.

## D-03 resuelto con el diseño real

Se leyó `get_design_context` campo por campo de la composición inferior (nodos 43121:6765-6786) en vez de confiar en el inventario escrito. Confirma la propuesta de `preparacion-tecnica-visual.md` (usar la composición inferior) y **corrige un dato que `todo.md` tenía mal**: solo **"Estado civil"** y **"Agencia"** son `Dropdown-NEW` (select) en Figma. "Último grado académico obtenido" y "Oficina para la que labora" son `Field-NEW` (texto libre) — `todo.md` decía que los cuatro eran select. Los 11 campos, en el orden real de dos columnas:

| Izquierda | Derecha |
| --- | --- |
| Nombre y apellidos * | Estado civil * (select) |
| Cédula * | Último grado académico obtenido * |
| Edad en años cumplidos * | Carrera * |
| Teléfono habitación * | Agencia * (select) |
| Teléfono celular * | Oficina para la que labora * |
| Dirección actual (exacta) * — ancho completo | |

## Implementación

- `src/types/PersonalData.types.ts`: `PersonalDataValues`, todos los campos opcionales en el tipo (la obligatoriedad la exige `validate`, no el tipo).
- `src/services/CatalogService.ts`: catálogos mock para los dos selects (D-09). Estado civil usa categorías genéricas (Soltero(a)/Casado(a)/Divorciado(a)/Viudo(a)/Unión libre); Agencia usa nombres deliberadamente falsos ("Agencia 1 (mock)"...) — **no se inventaron nombres reales de sucursales de Grupo Mutual**.
- `Textarea` (`src/sad-aml-shared/components/Atoms/Textarea/`): atomo nuevo en shared (no existía ninguno multilínea), mismo patrón label/error/aria que `InputText`. Usado solo para "Dirección actual (exacta)".
- `PersonalData` (`src/components/Pages/Declaration/PersonalData/`): el contenido del paso 1. Exporta también `validatePersonalData`, que exige los once campos marcados con `*` (no vacíos tras `trim()`). Mensajes en el estilo ya usado en Login ("El X es requerido/requerida"). D-09: sin formato confirmado de cédula/teléfono, así que solo se valida presencia, no un patrón.
- Registrado en `stepDefinitions.tsx`: `STEP_DEFINITIONS[1] = { component: PersonalData, validate: validatePersonalData }`. El wizard (DEC-006B) ya sabía mostrar/validar un paso definido; no hizo falta tocar `DeclarationWizard.tsx`.

## Bug real encontrado y corregido en `Dropdown` (shared)

Al montar dos `Dropdown` dentro de una grilla CSS de 2 columnas, las filas quedaban descuadradas a partir del primer select. Causa: `Select.Root` de Radix no renderiza ningún elemento propio (solo aporta contexto), así que el `<label>` y el `<Select.Trigger>` que `Dropdown` arma quedaban como **dos hijos directos sueltos** en el padre real — dos celdas de grid en vez de una, corriendo todo lo que seguía una posición. Se confirmó con `getBoundingClientRect()` en el navegador antes de tocar código: "Cédula" aparecía en la columna derecha en vez de la izquierda. Se corrigió envolviendo `Select.Root` (label + trigger + error) en un único `<div className={styles.dropdown}>` dentro de `Dropdown.tsx` — mismo criterio que `InputText`/`Checkbox`/`Textarea`, que sí eran un solo nodo raíz. Es una corrección genérica en shared (afecta a cualquier futuro uso de `Dropdown` en un grid o flex, no solo a este paso), no un parche local en `PersonalData`.

- Archivos: `src/sad-aml-shared/components/Molecules/Dropdown/Dropdown.tsx`, `Dropdown.module.scss` (+`.dropdown { width: 100% }`).
- Las 6 pruebas de DEC-002C2 (`src/components/Molecules/index.test.tsx`) se re-ejecutaron después del cambio: siguen en verde sin modificarlas, confirmando que el fix no alteró el comportamiento externo del componente.

## Validación

- `check-types`, `lint` y `test -- --runInBand`: OK (15 suites, 75 pruebas; 9 nuevas de `PersonalData`/`validatePersonalData` — los 11 labels exactos de Figma, que solo Estado civil/Agencia son combobox, `onChange` conserva el resto de valores, error asociado por campo, los once campos requeridos, valor en blanco cuenta como vacío — y 3 de `Textarea` en el barril de Atoms). `build` OK.
- V3 en navegador (sesión real vía login): con `getBoundingClientRect()` en cada `<label>` se confirmó que las 6 filas quedan exactamente alineadas como en Figma (mismo `top` para cada par izquierda/derecha) tras el fix de `Dropdown`. Comparado visualmente contra la captura real de Figma (nodo 43121:6243): coincide en textos, orden y qué campos son select y cuáles texto.
  - Continuar con todo vacío: los campos requeridos se marcan (`aria-invalid`), aparece el resumen "Revise los campos marcados para poder continuar." y el foco va al primero.
  - Llenando los once (incluidos ambos selects): sin errores, Continuar avanza a `/mi-declaracion/2`.
  - Volviendo al paso 1 desde el stepper: los valores tecleados y los dos selects elegidos siguen ahí — ida y vuelta sin pérdida, como pide la aceptación.
  - 768px (tablet): sin desborde horizontal (la grilla baja a una columna por debajo de 700px). Sin errores de consola en ningún momento.

## Ajuste posterior (2026-09-22, mismo día): "Dirección actual (exacta)" sí es obligatoria

El cierre original marcaba `address` como el único campo sin asterisco en Figma (así se leyó con `get_design_context`). El usuario confirmó que fue un error de diseño en el propio Figma: los once campos son obligatorios, sin excepción. Se corrigió `validatePersonalData` (agrega `address` a la lista de requeridos), la etiqueta pasó a "Dirección actual (exacta) *", y se conectó `errors.address` al `Textarea`. Pruebas actualizadas (11 campos requeridos en vez de 10). `check-types`, `lint` y `test -- --runInBand` OK (mismo conteo de suites/pruebas, contenido ajustado).

## Ajuste posterior (2026-09-22, mismo día): scroll horizontal del `Textarea` y límites de caracteres

El usuario reportó que el `Textarea` mostraba un scroll horizontal en vez de vertical. Causa real: `all: unset` en `Textarea.module.scss` borra `white-space`/`overflow-wrap`, propiedades que un `<textarea>` nativo necesita para respetar los saltos de línea y partir palabras largas; sin ellas, una palabra sin espacios más ancha que el campo desbordaba horizontalmente en vez de partirse. Se corrigió fijando explícitamente `white-space: pre-wrap`, `overflow-wrap: break-word`, `word-break: break-word` y `overflow-x: hidden` (el `overflow-y: auto` para el scroll vertical ya estaba). Verificado en navegador con una palabra de 120 caracteres sin espacios: ya no desborda, se parte dentro del campo, y solo aparece la barra de scroll vertical.

De paso, el usuario preguntó si los campos de texto libre del sistema tienen algún límite de caracteres — no tenían ninguno. Sin contrato de backend que defina el máximo real por campo (D-09), se agregó `src/utils/fieldLimits.ts` (`FIELD_MAX_LENGTH`) con valores **simbólicos**, documentados como reemplazables, aplicados vía el atributo nativo `maxLength` a **todos** los campos de texto libre existentes en el sistema, no solo este paso: los 7 `InputText` y el `Textarea` de este paso, y también "Usuario"/"Contraseña" de Login (DEC-003), que no tenían límite. Registrado como D-17 en `preparacion-tecnica-visual.md`. Verificado en navegador escribiendo de verdad (no asignación por JS, que sí evade `maxLength`): el campo Edad (límite 3) se detiene en 3 dígitos al escribir un cuarto.

`check-types`, `lint` y `test -- --runInBand` OK (15 suites, 77 pruebas; +2 nuevas: límites en `PersonalData` y en `Login`).

## Diferencias y pendientes

- **D-09 sigue abierta**: catálogos de Estado civil/Agencia son mock, documentados como tal en `CatalogService.ts`; reemplazar cuando haya contrato real. Tampoco hay formato confirmado para cédula/teléfonos — solo se exige que no estén vacíos.
- El ancho de contenido de la tarjeta genérica del wizard (`DeclarationWizard.module.scss`, heredado de Paso 2/3) es ~890px; el de Figma para este paso específico es ~850px. Diferencia menor, no se tocó el wrapper compartido por los demás pasos para esto.
- Sin formato de cédula (con guiones) ni de teléfono validado — D-09.
- `inputMode="numeric"` se agregó en cédula/edad/teléfonos como mejora de teclado en tablet/móvil, no es parte literal del diseño (Figma no especifica el tipo de teclado).

## Archivos y orden de copia

1. Shared: `src/sad-aml-shared/components/Atoms/Textarea/` (tsx, scss); `src/sad-aml-shared/components/Molecules/Dropdown/Dropdown.tsx`, `Dropdown.module.scss` (fix de layout); exports en `src/sad-aml-shared/components/Atoms/index.ts`.
2. Tipos, catálogo y límites: `src/types/PersonalData.types.ts`, `src/services/CatalogService.ts`, `src/utils/fieldLimits.ts`.
3. Barril: `src/components/Atoms/index.ts` (+`Textarea`), `src/components/Atoms/index.test.tsx` (+pruebas de `Textarea`).
4. Página del paso: `src/components/Pages/Declaration/PersonalData/` (tsx, scss, test).
5. Wizard: `src/components/Pages/Declaration/DeclarationWizard/stepDefinitions.tsx` (registra el paso 1).
6. Login: `src/components/Pages/Login/Login.tsx`, `Login.test.tsx` (límite de caracteres, ver ajuste posterior).
7. Documentación: `tasks/preparacion-tecnica-visual.md` (D-03 resuelto, D-17 nuevo), `tasks/todo.md`, este archivo.

Commit sugerido (no ejecutado): `feat(declaracion): implementa Datos personales (paso 1) y corrige layout de Dropdown en grid (DEC-007)`
