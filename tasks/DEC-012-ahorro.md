# DEC-012 Ahorro (paso 6, Datos económicos)

Implementada y validada el 2026-10-13.

## Implementación

- **Paso** `src/components/Pages/Declaration/Savings/Savings.tsx` (nodo Figma 43121:4102), registrado como paso 6 en `stepDefinitions.tsx`, **sin `validate`**: la tabla puede quedar vacía y aun así continuar (D-16), mismo criterio que Familia, Inmuebles y Muebles. Tabla con `RecordsTable` y el título de Figma «Indique las cuentas de ahorros en las cuales usted puede hacer movimientos»; columnas Número de cuenta/título, Nombre de dueño de la cuenta, Parentesco con dueño de la cuenta, Monto, Moneda, Entidad y Acciones.
- **Modal** `src/components/Organisms/SavingsDialog/SavingsDialog.tsx` (nodo Figma 43121:4067, «Datos económicos»): número de cuenta, nombre del titular, monto, relación con la cuenta (lista), moneda (lista) y entidad financiera (lista), todos obligatorios. El botón dice «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta). Cancelar no altera la fila. El «Número de cuenta/título» es texto libre (hasta 30 caracteres, `FIELD_MAX_LENGTH.accountNumber`), no solo dígitos, porque Figma lo rotula «cuenta/título».
- **Saldos por moneda** («Saldos cuentas de ahorro», Colones y Dólares, separados): los entrega el backend, igual que en el paso 3 (D-10, decisión del 2026-10-12). `src/services/SavingsTotalsService.ts` simula la respuesta (suma cada moneda por separado, **sin convertir ni mezclar**; provisional, reemplazable por la API real) y `src/utils/hooks/useSavingsTotals.ts` los vuelve a pedir en cada alta, edición o retiro (D-11) y descarta respuestas viejas. Mientras llega la primera respuesta se muestra «—»; si falla, se conserva la última cifra y sale el toast «La solicitud no fue procesada».
- **Formato**: `formatCurrency` ahora recibe el símbolo (`₡` por omisión, `$` para dólares): «₡ 1,897.45» y «$ 1,000.00».
- **Catálogos sintéticos** (D-09) en `CatalogService.ts`: relación con la cuenta (Titular + los parentescos de Familia), moneda (Colones/Dólares) y entidad financiera («Grupo Mutual», que es el ejemplo de Figma, más «Banco 1/2 (mock)», «Cooperativa (mock)» y «Otra»); no se inventan nombres reales de entidades.

## Validación

- `check-types`, `lint` y 217 pruebas: OK (22 nuevas: 5 de validación del modal, 3 del servicio simulado, 3 del hook, 11 del paso — tabla vacía, listado con catálogos legibles y monto formateado, saldos por moneda, guion y aviso si falla el backend, modal con sus seis campos, errores por campo, solo dígitos en el monto, alta con aviso y nuevo pedido al backend, cancelar sin alterar, editar con datos precargados, retirar con aviso —).
- V3 en navegador (sesión local de prueba): tabla vacía con «No existen registros» y saldos en cero; el modal coincide con Figma (dos columnas, tres listas); se agregó una cuenta en colones por 1,500,000 con el toast «Guardado satisfactoriamente», la fila muestra los catálogos con su nombre y el saldo en colones pasó a ₡ 1,500,000.00 mientras dólares siguió en $ 0.00. Sin errores de consola.

## Diferencias y pendientes contra Figma

- Figma no dibuja el botón «Agregar nuevo» en esta pantalla (sí lo trae el paso 2, igual de tabla con modal); se puso, porque sin él no hay forma de abrir el modal.
- Los saldos de muestra de Figma son «₡ 1,897.45» y «$ 1,000» (con y sin decimales); se usó el mismo formato de dos decimales para ambos hasta que D-10 defina el formato real.
- «Relación con la cuenta» (modal) y «Parentesco con dueño de la cuenta» (tabla) son el mismo dato; el catálogo agrega «Titular» porque en Figma la primera fila es la propia persona.
- Con ancho de tablet (768) la tabla hace scroll horizontal dentro de sí misma (`min-width` de `RecordsTable`, DEC-002F); con siete columnas es más notorio.
- Catálogos sintéticos (D-09) y fórmula de saldos provisional (D-10).
- Eliminar no pide confirmación, mismo criterio que el resto de las tablas.
