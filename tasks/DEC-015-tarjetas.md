# DEC-015 Tarjetas de crédito (paso 9)

Implementada y validada el 2026-10-20.

## Implementación

- **Paso** `src/components/Pages/Declaration/CreditCards/CreditCards.tsx` (nodo Figma 43121:2819, «Tarjetas de crédito»), registrado como paso 9 en `stepDefinitions.tsx`, **sin `validate`**: la tabla puede quedar vacía y aun así continuar (D-16).
- **Tabla** «Indique la información de sus tarjetas de crédito» con `RecordsTable` (alta, edición y retiro), en el orden de Figma: Periodo, Entidad, Fecha vencimiento, Límite tarjeta, Moneda, Saldo colones, Cuota colones, Saldo dólares, Cuota dólares, Últimos 4 # de operación y Acciones. Cada cambio se guarda en el borrador al instante y avisa con un toast (D-11).
- **Modal** `src/components/Organisms/CreditCardDialog/CreditCardDialog.tsx` (nodo Figma 43121:2768, «Tarjetas de crédito»), `AppDialog` tamaño `lg`, dos columnas: Entidad financiera | Periodo; Moneda | Límite de tarjeta; Fecha de vencimiento | Últimos 4 # de operación; Saldo colones | Cuota colones; Saldo dólares | Cuota dólares. Los diez campos son obligatorios (todos llevan asterisco en Figma). «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta).
- **D-04 aplicada**: Figma repite «Saldo colones» y «Cuota colones» en las dos últimas filas del modal y de la tabla; según la aclaración del usuario (2026-10-13) el segundo par es en **dólares**, así que se rotulan «Saldo dólares» y «Cuota dólares» (como ya las dibuja la tabla de Figma). Cada tarjeta puede tener saldo y cuota en ambas monedas.
- **Saldo de tarjetas de crédito**: dos columnas (colones y dólares) con la suma de saldos totales y la sumatoria de cuotas mensuales. Los entrega el backend (D-10): `src/services/CreditCardsTotalsService.ts` simula la respuesta sumando las columnas de colones por un lado y las de dólares por otro, **sin convertir ni mezclar** (provisional, reemplazable por la API real). `src/utils/hooks/useCreditCardsTotals.ts` los pide en cada cambio, descarta respuestas viejas y, si un refresco falla, conserva el último total y avisa con el toast de error. Mientras llega la primera respuesta se muestra «—».
- **Componente compartido nuevo** `src/components/Molecules/CurrencyTotals`: las dos columnas de totales por moneda (icono rojo ₡/$, suma de saldos, sumatoria de cuotas) eran idénticas en créditos y tarjetas, así que se extrajeron y ahora las usan el paso 8 y el paso 9 (el paso 8 se refactorizó sin cambiar su aspecto; sus pruebas siguen pasando).
- **Límite nuevo** `FIELD_MAX_LENGTH.cardPeriod = 40` en `src/utils/fieldLimits.ts` (periodo, texto libre).

## Decisiones

- **«Periodo»**: Figma lo dibuja como un campo de texto («Escribe aquí») y en la tabla de muestra aparece «20/05/2027», pero no dice qué es (¿periodo de facturación? ¿ciclo? ¿fecha?). Se implementó como **texto libre obligatorio** con límite simbólico (D-17) y se deja como **duda abierta D-20** (`preparacion-tecnica-visual.md`) para el usuario: si es una fecha o un catálogo (mensual, anual…) hay que cambiar el campo.
- **«Últimos 4 # de operación»**: solo dígitos y **exactamente cuatro**, como dice la etiqueta y muestra el ejemplo («1234»); es la única regla de formato que se deduce de Figma. Se muestra tal cual, sin formato de monto.
- **Fecha de vencimiento sin rango**: solo se exige que sea una fecha real («Escriba una fecha válida» si es incompleta o imposible, p. ej. 31/02; «requerida» si está vacía). No se inventa mínimo ni máximo.
- **Montos solo dígitos**, igual que los demás pasos (D-10: formato real y reglas de montos siguen abiertas). El límite de la tarjeta se entiende en la moneda de la tarjeta.
- Se puede escribir 0 en las columnas de la otra moneda (una tarjeta en colones normalmente no tiene saldo en dólares); Figma exige las cuatro.
- Catálogos de entidad y moneda sintéticos (D-09).

## Validación

- `check-types`, `lint` y 306 pruebas: OK (24 nuevas: 6 de validación del modal, 2 del servicio simulado, 3 del hook, 2 del componente compartido, 11 del paso — tabla vacía, listado con catálogos y fecha legibles, totales por moneda, guion y aviso si falla el backend, modal con sus diez campos y errores, solo dígitos y máximo cuatro en el número de operación, alta con aviso y nuevo pedido de totales, cancelar sin alterar, editar con datos precargados, retirar con aviso —).
- V3 en navegador (sesión local de prueba): la pantalla y el modal coinciden con Figma; se agregó una tarjeta de «Grupo Mutual» en colones (límite 2,000,000; saldo 350,000; cuota 25,000; saldo y cuota en dólares 100 y 10; vence 20/05/2028; últimos 4 «1234») con el toast «Guardado satisfactoriamente», y los totales pasaron de ₡ 0.00 / $ 0.00 a ₡ 350,000.00 y ₡ 25,000.00 en colones y $ 100.00 y $ 10.00 en dólares. Sin errores de consola.

## Diferencias y pendientes contra Figma

- El placeholder de la fecha es «DD/MM/AAAA» (selector estándar, como en familia y créditos); Figma muestra «26/08/2024».
- La tabla tiene once columnas: con el ancho de escritorio de 1280 px hace scroll horizontal dentro de sí misma (`min-width` de `RecordsTable`, DEC-002F); Figma la dibuja ajustada en 1006 px. Si el usuario prefiere que quepa sin scroll hay que ajustar anchos de columna o el `min-width` de la tabla.
- Figma dibuja las cifras de muestra con distintos formatos (con y sin decimales); se usa el de dos decimales en ambas monedas (D-10), como en los pasos 6 a 8.
- Los campos del modal quedan alineados en la misma rejilla (Figma los dibuja con pequeños desfases entre columnas, p. ej. «Periodo» 2 px más arriba que «Entidad financiera»).
- Eliminar no pide confirmación, mismo criterio que el resto de las tablas.
- Hay ya cuatro hooks casi idénticos de «totales que pide el backend» (`useFinancialSummary`, `useSavingsTotals`, `useCreditsTotals`, `useCreditCardsTotals`); cuando exista la API real conviene unificarlos en uno genérico (DEC-019A).
