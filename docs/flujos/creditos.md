# Créditos que posee

Estado: paso 8 implementado con totales simulados. Revisión: 14 de octubre de 2026.
Código: `343c313c503bd25c652236b319c6e3874efeb8d4`. Seguimiento: DEC-014; documentación: DOC-010.

## Propósito y captura

`/mi-declaracion/8` presenta los créditos declarados y sus saldos y cuotas por moneda. El diálogo «Créditos», tamaño `lg`, exige ocho campos.

| Campo del diálogo | Clave | Regla vigente |
| --- | --- | --- |
| Entidad financiera | `entity` | Selección de catálogo de demostración. |
| Tipo de préstamo | `loanType` | Texto obligatorio, hasta 60 caracteres. |
| Monto inicial | `initialAmount` | Solo dígitos, hasta 15 caracteres. |
| Saldo actual | `currentBalance` | Solo dígitos, hasta 15 caracteres. |
| Monto cuota | `installment` | Solo dígitos, hasta 15 caracteres. |
| Número de préstamo | `loanNumber` | Texto obligatorio, hasta 30 caracteres; admite letras y símbolos. |
| Moneda | `currency` | Colones o dólares del catálogo actual. |
| Fecha de conclusión | `endDate` | Fecha real y obligatoria; sin mínimo ni máximo. |

Los textos libres rechazan contenido formado solo por espacios y se guardan sin espacios externos. El selector distingue fecha inválida de vacía, presenta `DD/MM/AAAA` y conserva `YYYY-MM-DD`. Puede registrar fechas futuras o pasadas. La validación utiliza la señal del selector; requiere revisar datos de fecha arbitrarios al integrar una API.

No se detecta número de préstamo duplicado ni se exige que el saldo sea menor al monto inicial. Tampoco se comparan cuota y saldo. Aplican las [operaciones comunes](registros-patrimoniales.md); las filas del borrador se almacenan bajo `credits`.

## Tabla y totales

La tabla muestra entidad, monto inicial, moneda, tipo de crédito, saldo a la fecha, monto cuota, operación y fecha de conclusión. «Tipo de crédito» corresponde a `loanType` y «Operación» a `loanNumber`; son los mismos datos capturados con etiquetas distintas.

`CreditsTotalsService.fetchCreditsTotals` devuelve, para cada moneda, suma de saldos actuales y suma de cuotas. No suma montos iniciales ni toma datos del paso de egresos. Una lista vacía devuelve cero. `useCreditsTotals` conserva el último resultado e ignora respuestas anteriores según el [criterio común](registros-patrimoniales.md).

Los totales no sincronizan automáticamente las cuotas con los egresos del paso 3. «Continuar» abre el [paso 9, tarjetas de crédito](tarjetas-de-credito.md); no constituye envío final.

La sección «Saldo actual de créditos» se presenta con `CurrencyTotals` (`@/components/Molecules`), componente compartido con las tarjetas, desde el commit `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`. El cambio no modificó la presentación ni los datos de esta pantalla.

## Mantenimiento y continuidad

Referencias: `src/components/Pages/Declaration/Credits/Credits.tsx`, `src/components/Organisms/CreditDialog/CreditDialog.tsx`, `src/types/Credit.types.ts`, `src/services/CreditsTotalsService.ts` y `src/utils/hooks/useCreditsTotals.ts`.

Confirmar reglas de fecha, saldos, cuotas, duplicados, moneda y precisión. Acordar la relación con egresos sin introducir sumas automáticas que dupliquen cifras. El historial registra placeholder de fecha estándar y totales de dos decimales frente a ejemplos variables de Figma. No se hizo nueva revisión visual; evidencia en [validación](../06-validacion-y-calidad.md).
