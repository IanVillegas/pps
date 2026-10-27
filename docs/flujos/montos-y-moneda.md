# Montos y moneda

Estado: formato estándar de montos aplicado a todos los campos de monto. Revisión: 27 de octubre de 2026.
Código: `c789b079859bd590e4180cb0ac3ae08fec58b781`. Seguimiento: ajustes sugeridos por Oldemar; documentación: DOC-016.

## Formato

Todo campo que pide un monto se formatea mientras se escribe, con el formato estándar de Grupo Mutual. Lo implementa `MoneyInput` (`src/sad-aml-shared/components/Molecules/MoneyInput`), con sus utilidades en `src/sad-aml-shared/utils/helpers/money.ts`.

- **Cada dígito entra por la derecha como centavos**: escribir 1 muestra 0.01, luego 12 muestra 0.12, 123 muestra 1.23, 12345 muestra 123.45 y 123456 muestra 1,234.56. Así siempre se controlan los decimales.
- Se muestran comas de miles y siempre dos decimales. Solo cuentan los dígitos; las letras y símbolos se ignoran. Pegar un número lo toma como centavos.
- Borrar quita el último dígito; al quedar solo ceros, el campo se vacía. Se admiten hasta 15 dígitos incluidos los centavos (hasta 9,999,999,999,999.99); un dígito adicional se ignora.
- El texto de ejemplo del campo vacío es `0,000.00`.
- El valor que se guarda es un **texto decimal con dos decimales** (`"1234.56"`), para no perder precisión con números flotantes. Un monto entero anterior (`"1500000"`) se lee como 1,500,000.00, de modo que los registros de versiones previas no se rompen. Las tablas muestran los montos con dos decimales; los totales también.
- La validación solo puede detectar que falte el monto (0.00 es válido); desapareció el mensaje «Escriba solo números», porque el campo ya no admite otra cosa.

## Moneda

- **El ícono de la moneda va al inicio del campo de monto**: el colón o el dólar de Figma (`CurrencyIcon`, 20 px, rojo). Mientras no se elige moneda, el espacio del ícono queda reservado para que el campo no cambie al elegirla.
- **La moneda se elige antes que el monto** (`CurrencySelect`, `src/sad-aml-shared/components/Molecules/CurrencySelect`, que recibe la lista de monedas por propiedad): la selección decide el ícono. El selector muestra el ícono en cada opción y en la moneda elegida. En los diálogos con selector, Moneda aparece arriba del monto (o de los montos).
- Las columnas que ya tienen una moneda propia llevan siempre su ícono: «Saldo colones» y «Cuota colones» con ₡, «Saldo dólares» y «Cuota dólares» con $, en tarjetas.
- Los montos que no tienen una moneda definida se formatean igual pero **sin ícono** (`currency={null}`), porque no se debe suponer una.

## Dónde se aplica

| Pantalla | Campos | Ícono |
| --- | --- | --- |
| [Ingresos y egresos](ingresos-y-egresos.md) (paso 3) | Monto de ingresos adicionales y de egresos | ₡ (los totales del paso se muestran en colones). |
| [Bienes inmuebles](bienes-inmuebles.md) | Valor de mercado | Sin ícono. |
| [Bienes muebles](bienes-muebles.md) | Valor de mercado | Sin ícono. |
| [Cuentas de ahorro](cuentas-de-ahorro.md) | Monto | La moneda elegida; Moneda va antes que Monto. |
| [Cuentas corrientes](cuentas-corrientes.md) | Saldo actual | La moneda elegida; Moneda va antes que Saldo. |
| [Créditos](creditos.md) | Monto inicial, saldo actual y monto cuota | La moneda elegida; Moneda va antes de los montos. |
| [Tarjetas de crédito](tarjetas-de-credito.md) | Límite; saldos y cuotas en colones y en dólares | El límite sigue la moneda de la tarjeta; las columnas llevan la suya. |
| [Datos judiciales](datos-judiciales.md) | Monto que cancela por mes | Sin ícono. |

## Componente compartido

`InputText` de `sad-aml-shared` incorpora la propiedad opcional `startAdornment`, un ícono decorativo dentro del campo al inicio, marcada como modificación para DecPat. `sad-aml-shared` es propio de este sistema, por lo que no hay otro repositorio al que trasladar el cambio. Ver la [guía de componentes](../03-guia-de-componentes.md).

## Continuidad

La moneda de los montos de ingresos y egresos se supone en colones por los totales del paso; la de inmuebles, muebles y la pensión no está definida. Confirmarlas, y si alguna necesita un selector de moneda, es un cambio local a su diálogo. El backend recibirá y devolverá los montos con este mismo formato (ver [contrato de API](../08-contrato-api.md)). Las reglas definitivas de redondeo y precisión permanecen pendientes (D-10). Evidencia en [validación](../06-validacion-y-calidad.md).
