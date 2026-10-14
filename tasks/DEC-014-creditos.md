# DEC-014 Créditos (paso 8)

Implementada y validada el 2026-10-13.

## Implementación

- **Paso** `src/components/Pages/Declaration/Credits/Credits.tsx` (nodo Figma 43121:3274, «Créditos que posee»), registrado como paso 8 en `stepDefinitions.tsx`, **sin `validate`**: la tabla puede quedar vacía y aun así continuar (D-16), mismo criterio que los demás pasos de tabla.
- **Tabla** «Indique la información de sus créditos» con `RecordsTable` (alta, edición y retiro): Entidad, Monto Inicial, Moneda, Tipo de crédito, Saldo a la fecha, Monto cuota, Operación, Fecha conclusión (DD/MM/AAAA) y Acciones. Cada cambio se guarda en el borrador al instante y avisa con un toast (D-11).
- **Modal** `src/components/Organisms/CreditDialog/CreditDialog.tsx` (nodo Figma 43121:3231, «Créditos»), `AppDialog` tamaño `lg`, dos columnas: Entidad financiera (lista) | Tipo de préstamo; Monto inicial | Saldo actual; Monto cuota | Número de préstamo; Moneda (lista) | Fecha de conclusión (selector de fecha compartido). Los ocho campos son obligatorios (todos llevan asterisco en Figma). «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta). Cancelar no altera la fila.
- **Nombres distintos entre modal y tabla** (Figma): «Tipo de préstamo» ↔ «Tipo de crédito» y «Número de préstamo» ↔ «Operación»; son el mismo dato (`loanType`, `loanNumber`).
- **Saldo actual de créditos**: dos columnas con icono rojo (₡ y $), «Suma de saldos totales» y «Sumatoria de cuotas mensuales» por moneda. Los entrega el backend (D-10): `src/services/CreditsTotalsService.ts` simula la respuesta sumando por moneda **sin convertir ni mezclar** (provisional, reemplazable por la API real). `src/utils/hooks/useCreditsTotals.ts` los pide en cada cambio, descarta respuestas viejas y, si un refresco falla, conserva el último total y avisa con el toast de error. Mientras llega la primera respuesta se muestra «—».
- **Límite nuevo** `FIELD_MAX_LENGTH.loanType = 60` en `src/utils/fieldLimits.ts` (tipo de préstamo, texto libre).

## Decisiones

- **Fecha de conclusión sin rango**: solo se exige que sea una fecha real («Escriba una fecha válida» si se escribe incompleta o imposible, p. ej. 31/02; «requerida» si queda vacía). No se inventa un mínimo ni un máximo: un crédito vigente normalmente concluye en el futuro y Figma no define límite (misma lección que el año de bienes muebles).
- **Montos solo dígitos**, igual que ahorro y cuentas corrientes (D-10: formato y reglas reales de montos siguen abiertas).
- **Número de préstamo** acepta letras, números y símbolos (Figma no limita a dígitos); usa el límite de longitud de número de cuenta.
- Catálogos de entidad y moneda sintéticos (D-09).

## Validación

- `check-types`, `lint` y 282 pruebas: OK (23 nuevas: 6 de validación del modal, 3 del servicio simulado, 3 del hook, 11 del paso — tabla vacía, listado con catálogos y fecha legibles, totales por moneda, guion y aviso si falla el backend, modal con sus ocho campos y errores, solo dígitos, alta con aviso y nuevo pedido de totales, cancelar sin alterar, editar con datos precargados, retirar con aviso —).
- V3 en navegador (sesión local de prueba): la pantalla y el modal coinciden con Figma; el envío vacío marca los ocho errores; se agregó un crédito de «Banco 1 (mock)» por 9,000,000 con saldo 8,000,000, cuota 120,000, colones y conclusión 20/05/2040, con el toast «Guardado satisfactoriamente», y los totales en colones pasaron de ₡ 0.00 a ₡ 8,000,000.00 y ₡ 120,000.00 mientras dólares siguió en $ 0.00. Sin errores de consola.

## Diferencias y pendientes contra Figma

- El placeholder de la fecha es «DD/MM/AAAA» (el selector estándar, como en familia); Figma muestra «26/08/2024» como ejemplo.
- Figma dibuja las cifras de muestra con distintos formatos; se usa el de dos decimales en ambas monedas (D-10), como en los pasos 6 y 7.
- Con anchos pequeños la tabla de 9 columnas hace scroll horizontal dentro de sí misma (`min-width` de `RecordsTable`, DEC-002F) y las dos columnas de totales pasan a una.
- Eliminar no pide confirmación, mismo criterio que el resto de las tablas.
- Advertencia de consola en pruebas («Select is changing from uncontrolled to controlled») del `Dropdown` compartido al elegir la primera opción; la comparten todos los modales con listas.
