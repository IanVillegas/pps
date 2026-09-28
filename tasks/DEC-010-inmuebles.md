# DEC-010 Bienes inmuebles (paso 4)

Implementada y validada el 2026-09-28. Commit a cargo del usuario.

## Implementación

- **Paso** `src/components/Pages/Declaration/RealEstate/RealEstate.tsx` (nodo Figma 43121:4951): tabla con `RecordsTable` (DEC-002F) y columnas Número finca, Ubicación, Valor, Destino, Forma adquisición y Acciones. Registrado como paso 4 en `stepDefinitions.tsx`, **sin `validate`**: la tabla puede quedar vacía y aun así continuar (D-16), mismo criterio que Familia (DEC-008B).
- **Modal** `src/components/Organisms/RealEstateDialog/RealEstateDialog.tsx` (nodo Figma 43121:4922, «Datos del bien inmueble»): número de finca, ubicación, valor de mercado, destino (lista) y forma de adquisición, todos obligatorios. La leyenda de Figma sobre la forma de adquisición («puede ser: compra, donación, herencia, otros») se puso como `caption` del campo, debajo del input — en Figma está a un lado del campo, no debajo; se prefirió esto porque `InputText` ya soporta un `caption` y queda pegado a lo que describe. El botón dice «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta), mismo patrón que `FamilyDialog`.
- **Alta, edición y retiro**: cada acción actualiza el borrador al instante y muestra un toast (`Guardado satisfactoriamente` / `Eliminado satisfactoriamente`). Las filas se identifican por `id` estable.
- **Cancelar no altera la fila**: mismo patrón que Familia (el formulario vive dentro del contenido del modal, que Radix solo monta abierto).
- **Validaciones**: los cinco campos son requeridos; el valor de mercado solo acepta dígitos (sin separadores mientras se escribe).
- **Formato del valor**: `src/utils/money.ts` (`formatAmount`) muestra el valor con comas de miles (`45,000,000`), tomado literal del placeholder de Figma (nodo 43121:5271, columna Valor: «0,000,000»). **Sin relación con D-10** (cálculos financieros): esto es solo formato de un valor capturado, no un total calculado.
- **Datos**: tipos en `src/types/RealEstate.types.ts`; catálogo de destino sintético en `CatalogService.ts` (D-09, mismo criterio que parentesco/género).

## Validación

- `check-types`, `lint` y 126 pruebas: OK (11 nuevas: 6 de validación del modal, 5 del paso — tabla vacía, valores formateados y destino legible, modal con sus cinco campos, errores por campo, solo dígitos en el valor, cancelar sin alterar, editar con datos precargados y eliminar con aviso —).
- V3 en navegador (sesión real vía login local, tablet 768px): tabla vacía con «No existen registros»; modal igual al diseño, con la leyenda de forma de adquisición visible; al agregar aparece la fila (`123456789 · Guácima arriba · 45,000,000 · Vivienda · Compra`) con el toast «Guardado satisfactoriamente»; el valor seleccionado del Destino se ve en color oscuro (no gris), confirmando el fix de DEC-008B en este nuevo consumidor; scroll horizontal de la tabla revela Destino/Forma adquisición/Acciones sin romper el layout.

## Diferencias y pendientes contra Figma

- La leyenda de «Forma de adquisición» quedó como `caption` debajo del campo, no a un lado como en Figma (ver arriba).
- Eliminar no pide confirmación: Figma no dibuja un diálogo de confirmación, mismo criterio ya anotado en DEC-008B.
- Catálogo de destino (Vivienda, Alquiler, Uso comercial, Lote sin construir, Otro) es sintético hasta que el backend lo defina (D-09); solo «Vivienda» viene confirmado por el ejemplo de Figma.
- El formato de miles con coma es una decisión visual tomada del placeholder de Figma, no una regla de negocio confirmada; revisar si D-10 (cuando se resuelva) define un formato distinto para toda la app.
