# Tarjetas de crédito

Estado: paso 9 implementado con totales simulados. Revisión: 20 de octubre de 2026.
Código: `779fd7ad2b39796d3d2466f0ddb9ac44298f9193` (rama `main`). Seguimiento: DEC-015; documentación: DOC-011.

## Propósito y captura

`/mi-declaracion/9`, titulado «Tarjetas de crédito», presenta las tarjetas declaradas con su saldo y su cuota en colones y en dólares. El diálogo «Tarjetas de crédito», tamaño `lg`, exige diez campos.

| Campo del diálogo | Clave | Regla vigente |
| --- | --- | --- |
| Entidad financiera | `entity` | Selección de catálogo de demostración. |
| Periodo | `period` | Texto obligatorio, hasta 40 caracteres. Su significado está pendiente de confirmar. |
| Moneda | `currency` | Colones o dólares del catálogo actual; es la moneda de la tarjeta. |
| Límite de tarjeta | `limit` | Solo dígitos, hasta 15 caracteres; se entiende en la moneda de la tarjeta. |
| Fecha de vencimiento | `expiryDate` | Fecha real y obligatoria; sin mínimo ni máximo. |
| Últimos 4 # de operación | `lastFour` | Exactamente cuatro dígitos. |
| Saldo colones | `balanceColones` | Solo dígitos, hasta 15 caracteres; admite cero. |
| Cuota colones | `installmentColones` | Solo dígitos, hasta 15 caracteres; admite cero. |
| Saldo dólares | `balanceDollars` | Solo dígitos, hasta 15 caracteres; admite cero. |
| Cuota dólares | `installmentDollars` | Solo dígitos, hasta 15 caracteres; admite cero. |

Cada tarjeta puede tener saldo y cuota en ambas monedas, de modo que una tarjeta en colones puede registrar cero en las columnas de dólares. Las cuatro columnas son obligatorias porque el diseño marca todos los campos con asterisco. El diseño repite la etiqueta «Saldo colones» y «Cuota colones» en las dos últimas filas del diálogo; por decisión del equipo, el segundo par corresponde a dólares y así se rotula.

El texto de «Periodo» se guarda sin espacios externos y se rechaza si queda vacío. El selector de fecha distingue una fecha incompleta o imposible (por ejemplo, 31/02, que genera «Escriba una fecha válida») de un campo vacío («requerida»), presenta `DD/MM/AAAA` y conserva `YYYY-MM-DD`. Puede registrar fechas pasadas o futuras. La validación utiliza la señal del selector; requiere revisar datos de fecha arbitrarios al integrar una API.

No se detectan tarjetas duplicadas, no se comprueba que el saldo respete el límite ni que la moneda de la tarjeta coincida con las columnas que se llenan. Aplican las [operaciones comunes](registros-patrimoniales.md); las filas del borrador se almacenan bajo `cards`.

## Tabla y totales

La tabla sigue el orden del diseño: periodo, entidad, fecha de vencimiento, límite, moneda, saldo y cuota en colones, saldo y cuota en dólares, últimos 4 dígitos de la operación y acciones. Los importes usan el formato de `money.ts` y la fecha se presenta como `DD/MM/AAAA`. Las acciones de cada fila se identifican por los últimos cuatro dígitos («Editar tarjeta 1234»), de modo que dos tarjetas con el mismo número no se distinguen para un lector de pantalla.

`CreditCardsTotalsService.fetchCreditCardsTotals` devuelve, para cada moneda, la suma de saldos y la suma de cuotas: las columnas de colones se suman entre sí y las de dólares entre sí, sin tomar en cuenta la moneda de la tarjeta, sin convertir y sin mezclar. Una lista vacía devuelve cero. `useCreditCardsTotals` conserva el último resultado e ignora respuestas anteriores según el [criterio común](registros-patrimoniales.md).

La sección «Saldo de tarjetas de crédito» utiliza `CurrencyTotals` (`@/components/Molecules`), el mismo componente que muestra los totales del [paso 8](creditos.md): una columna en colones y otra en dólares, con la suma de saldos y la sumatoria de cuotas mensuales. Antes del primer resultado cada cifra muestra «—».

Los totales no se sincronizan con los egresos del paso 3 ni con los créditos del paso 8; cada paso calcula los suyos. «Continuar» abre el paso 10, cuyo contenido aún es un marcador; no constituye envío final.

## Mantenimiento y continuidad

Referencias: `src/components/Pages/Declaration/CreditCards/CreditCards.tsx`, `src/components/Organisms/CreditCardDialog/CreditCardDialog.tsx`, `src/components/Molecules/CurrencyTotals/CurrencyTotals.tsx`, `src/types/CreditCard.types.ts`, `src/services/CreditCardsTotalsService.ts` y `src/utils/hooks/useCreditCardsTotals.ts`. El límite de longitud del periodo está en `FIELD_MAX_LENGTH.cardPeriod`.

Confirmar con el equipo de negocio:

- Qué representa «Periodo». El diseño lo dibuja como un campo de texto y la tabla de ejemplo muestra un valor con forma de fecha; hoy es texto libre. Si resulta ser una fecha o un catálogo, deben cambiar el campo del diálogo y la columna de la tabla.
- Si «Últimos 4 # de operación» identifica la tarjeta o una operación, y si debe evitarse su repetición.
- Reglas de saldo frente a límite, fechas de vencimiento, duplicados, catálogos, precisión y moneda de cada columna.
- La relación entre las cuotas de tarjetas y las declaradas como egresos, sin introducir sumas automáticas que dupliquen cifras.

El historial registra el placeholder de fecha estándar, los totales de dos decimales frente a ejemplos de formato variable en el diseño y el desfase de un par de píxeles entre columnas del diálogo, que se alineó en una rejilla. Con el ancho de escritorio de 1280 px la tabla de once columnas desplaza horizontalmente dentro de su región, mientras el diseño la dibuja ajustada a 1006 px; la decisión sobre ajustar anchos queda pendiente. No se hizo una revisión visual en tablet. Evidencia en [validación](../06-validacion-y-calidad.md).
