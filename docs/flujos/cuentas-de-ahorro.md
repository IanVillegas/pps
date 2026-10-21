# Cuentas de ahorro

Estado: paso 6 implementado con saldos simulados. Revisión: 21 de octubre de 2026 (campos del 14 de octubre; formato de montos y eliminación, del 21).
Código: `343c313c503bd25c652236b319c6e3874efeb8d4` para los campos; `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2` para el formato de montos y la eliminación. Seguimiento: DEC-012; documentación: DOC-008.

## Propósito y captura

`/mi-declaracion/6`, titulado «Datos económicos», recoge cuentas de ahorro en las que la persona puede realizar movimientos. La tabla muestra cuenta o título, dueño, parentesco, monto, moneda y entidad. El diálogo «Datos económicos» contiene seis campos obligatorios.

| Campo | Clave | Regla vigente |
| --- | --- | --- |
| Número de cuenta | `accountNumber` | Texto, hasta 30 caracteres; admite letras y símbolos. |
| Nombre del titular | `holderName` | Texto, hasta 120 caracteres. |
| Monto | `amount` | Formato de [montos y moneda](montos-y-moneda.md): centavos, comas y dos decimales, con el ícono de la moneda elegida al inicio. Se guarda como texto decimal. |
| Relación con la cuenta | `relationship` | Catálogo de demostración, que incluye titular y parentescos. |
| Moneda | `currency` | Colones o dólares, con su ícono en el selector (`CurrencySelect`). En el diálogo va **antes** del monto, en la misma columna, porque decide su ícono. |
| Entidad financiera | `entity` | Catálogo de demostración. |

Cuenta y titular se guardan sin espacios externos y rechazan texto vacío. No hay validación de formato bancario ni duplicados. Aplican las [operaciones comunes](registros-patrimoniales.md); las filas del borrador se almacenan bajo `accounts`.

## Saldos y continuidad

`SavingsTotalsService.fetchSavingsTotals` suma los montos registrados por moneda. `useSavingsTotals` refresca ese resultado al cambiar las cuentas. Los totales de una lista vacía son cero después de responder el servicio. La pantalla no calcula conversiones; los estados de carga y fallo siguen el [criterio común](registros-patrimoniales.md).

Referencias: `src/components/Pages/Declaration/Savings/Savings.tsx`, `src/components/Organisms/SavingsDialog/SavingsDialog.tsx`, `src/types/Savings.types.ts`, `src/services/SavingsTotalsService.ts` y `src/utils/hooks/useSavingsTotals.ts`.

Confirmar qué cuentas deben declararse, catálogos, identificación, moneda, precisión y reglas de duplicados. El historial registra la incorporación de «Agregar nuevo» aunque el diseño de esta pantalla no lo dibuja y la normalización del formato de totales a dos decimales. No se hizo nueva revisión visual o comparación con Figma. Evidencia en [validación](../06-validacion-y-calidad.md).
