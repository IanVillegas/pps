# DEC-011 Bienes muebles (paso 5)

Implementada y validada el 2026-09-30.

## Implementación

- **Paso** `src/components/Pages/Declaration/MovableAssets/MovableAssets.tsx` (nodo Figma 43121:4527): tabla con `RecordsTable` (DEC-002F) y columnas Tipo, Marca, Placa, Año, Valor, Descripción, Observación y Acciones. Registrado como paso 5 en `stepDefinitions.tsx`, **sin `validate`**: la tabla puede quedar vacía y aun así continuar (D-16), mismo criterio que Familia e Inmuebles.
- **Modal** `src/components/Organisms/MovableAssetDialog/MovableAssetDialog.tsx` (nodo Figma 43121:4486, «Datos del bien mueble»): tipo (lista), marca (lista), descripción, número de placa, año, valor de mercado y observación, todos obligatorios. El botón dice «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta).
- **Alta, edición y retiro**: cada acción actualiza el borrador al instante y muestra un toast. Las filas se identifican por `id` estable.
- **Cancelar no altera la fila**: mismo patrón que Familia e Inmuebles.
- **Validaciones**: los siete campos son requeridos; año solo dígitos entre 1900 y el año entrante (rango simbólico, sin contrato de backend); valor de mercado solo dígitos.
- **Formato del valor**: reutiliza `formatAmount` de DEC-010 (comas de miles), mismo criterio, sin relación con los cálculos financieros pendientes (D-10).

## D-06, resuelta con un tooltip

El nodo de la anotación original de Figma (43121:4485, «descripción vs modelo») ya no existe en el archivo, así que no se pudo leer su texto exacto. El nodo del modal sí trae un ícono «?» junto al campo «Descripción» (nodo 43121:4494), sin texto propio visible. Se resolvió agregando un tooltip en ese ícono: «Incluya marca, modelo y demás características que permitan identificar el bien.» — **texto propuesto, no una cita de Figma**, pendiente de validación de negocio. No se agregó un campo «Modelo» aparte: Figma solo define «Descripción».

`InputText` (sad-aml-shared) ya tenía un slot `tooltip`, pero lo renderiza *después* del campo, no junto a la etiqueta como en Figma. Se usó ese slot tal cual, sin modificar el componente compartido por una diferencia de posición.

## Diferencia sin resolver: «Marca» como lista cerrada

Figma dibuja tanto «Tipo de bien mueble» como «Marca del bien mueble» como `Dropdown-NEW` (nodo 43121:4505). Se siguió el diseño tal cual, con un catálogo sintético de marcas (Toyota, Hyundai, BMW, Otra — D-09). Una lista cerrada de marcas es poco práctica en la vida real (hay cientos de marcas posibles entre vehículos, joyas, equipo electrónico, etc.); lo más probable es que termine siendo texto libre o un combobox que admita escribir una opción nueva. Queda anotado aquí para revisar con el negocio; no se le asignó un identificador D- nuevo porque no hay una anotación de Figma que lo respalde, a diferencia de D-06.

## Validación

- `check-types`, `lint` y 155 pruebas: OK (13 nuevas: 5 de validación del modal, 8 del paso — tabla vacía, valores formateados y catálogos legibles, modal con sus siete campos, errores por campo, solo dígitos en año/valor, cancelar sin alterar, editar con datos precargados, eliminar con aviso —).
- V3 en navegador (sesión real vía login local): tabla vacía con «No existen registros»; modal igual al diseño, con el ícono de ayuda junto a «Descripción»; el tooltip se confirmó con foco de teclado (con clic/hover simulados no se pudo reproducir visualmente en esta sesión, ver nota abajo) y muestra el texto correcto; al agregar aparece la fila (`Vehículo · Toyota · IAN123 · 2026 · 15,000,000 · Sedán 4 puertas · Sin gravámenes`) con el toast «Guardado satisfactoriamente».
- Se corrigió en el camino: el botón de ayuda (`?`) se estiraba a todo el ancho del campo (un `<div>` flex-column con `width: 100%` como padre, sin `align-self` en el botón) — el foco por teclado mostraba un anillo ovalado larguísimo en vez de un círculo chico. Se agregó `align-self: flex-start`.

## Diferencias y pendientes contra Figma

- El tooltip de «Descripción» queda después del campo (slot existente de `InputText`), no junto a la etiqueta como en Figma.
- Catálogos de tipo y marca son sintéticos hasta que el backend los defina (D-09); «Marca» como lista cerrada queda como punto a revisar (ver arriba).
- Eliminar no pide confirmación, mismo criterio que Familia e Inmuebles.
- El tooltip (Radix) no se pudo ver con clic u hover simulados por la herramienta de navegador de esta sesión; sí se confirmó con foco de teclado real (`.focus()` + verificación de `data-state="instant-open"` y el texto en el DOM). No hay indicio de que sea un problema del componente: es la primera vez que se prueba visualmente este `Tooltip` compartido en esta sesión.
