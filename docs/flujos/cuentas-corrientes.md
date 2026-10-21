# Cuentas corrientes

Estado: paso 7 implementado con cuentas y totales simulados. Revisión: 21 de octubre de 2026 (campos del 14 de octubre; formato de montos y eliminación, del 21).
Código: `343c313c503bd25c652236b319c6e3874efeb8d4` para los campos; `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2` para el formato de montos y la eliminación. Seguimiento: DEC-013; documentación: DOC-009.

## Propósito y secciones

`/mi-declaracion/7` distingue cuentas precargadas de Grupo Mutual y montos agregados por la persona. La primera tabla es de solo lectura: cuenta o título, dueño, parentesco, monto, moneda y entidad. La segunda, «Indique los montos a la fecha», permite operaciones sobre entidad financiera, saldo actual y moneda.

La precarga utiliza una cuenta sintética definida en `CurrentAccountsService`, no una consulta institucional. Sus datos no se copian al borrador del paso. `useCurrentAccounts` los solicita una vez por montaje y solicita totales por separado cada vez que cambia la lista agregada.

## Captura y validación

El diálogo «Datos económicos» exige entidad financiera, saldo actual y moneda. Entidad y moneda utilizan catálogos de demostración. El orden del diálogo es entidad, moneda y saldo actual: la moneda va antes porque decide el ícono del saldo. El saldo usa el formato de [montos y moneda](montos-y-moneda.md) (centavos, comas y dos decimales, hasta 15 dígitos con los centavos) y se guarda como texto decimal. No se solicita número de cuenta ni titular en los registros agregados y no se detectan duplicados por entidad.

Aplican las [operaciones comunes](registros-patrimoniales.md) a la segunda tabla. Los registros se conservan bajo `accounts` dentro de los valores del paso 7, separados de los del paso 6. La precarga no ofrece alta, edición ni retiro desde la pantalla.

## Saldos y fallos

La simulación suma cuentas precargadas y registros agregados por moneda, sin conversión. Por eso, una lista agregada vacía no implica saldo cero: la cuenta sintética aporta 250 000 colones. El cálculo del servicio utiliza su propia lista de precarga, no la tabla que haya logrado cargar el hook.

Carga de cuentas y carga de totales tienen estados independientes. Puede fallar una y responder la otra. Los fallos generan una notificación; se conservan los totales anteriores si existen. Antes de recibir cifras se muestra «—». La tabla de precarga distingue carga, fallo y ausencia de registros. La interfaz permite seguir editando los montos agregados.

## Mantenimiento y continuidad

Referencias: `src/components/Pages/Declaration/CurrentAccounts/CurrentAccounts.tsx`, `src/components/Organisms/CurrentAccountDialog/CurrentAccountDialog.tsx`, `src/types/CurrentAccount.types.ts`, `src/services/CurrentAccountsService.ts` y `src/utils/hooks/useCurrentAccounts.ts`.

Confirmar precarga por usuario, fecha de saldos, campos requeridos para otras cuentas y riesgo de contabilizar dos veces una cuenta ya precargada. Acordar consistencia entre consultas de filas y totales y tratamiento de errores parciales. Los colores de anotaciones de Figma no se consideran parte de la interfaz, según el historial de decisiones. No se hizo nueva revisión visual; consultar [validación](../06-validacion-y-calidad.md).
